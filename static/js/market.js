let allMarkets   = {};
let chartInst    = null;
let currentFilter = 'all';
let currentSearch = '';
let dataSource   = 'indicative';

document.addEventListener('DOMContentLoaded', loadMarket);

async function loadMarket() {
  try {
    const res  = await fetch('/api/market');
    const data = await res.json();
    allMarkets = data.markets || {};
    dataSource = data.data_source || 'indicative';

    const lastUpdated = data.last_updated || '';
    updateSourceBadge(dataSource, lastUpdated);
    buildTicker();
    renderCitiesGrid(allMarkets);
    buildPriceTable(allMarkets);
    initChart(allMarkets);
  } catch (e) {
    console.error('[Market]', e);
    document.getElementById('marketLoading').innerHTML =
      '<p style="color:var(--red)">Could not load market data. Please refresh.</p>';
  }
}

function updateSourceBadge(source, updated) {
  const badge = document.getElementById('dataSourceBadge');
  const time  = document.getElementById('lastUpdated');
  if (badge) {
    if (source === 'live') {
      badge.textContent   = 'LIVE DATA';
      badge.style.background = 'var(--green)';
      badge.style.color      = '#fff';
    } else {
      badge.textContent   = 'INDICATIVE';
      badge.style.background = 'var(--amber-light)';
      badge.style.color      = 'var(--amber)';
    }
  }
  if (time && updated) time.textContent = 'Updated: ' + updated;
}

/* ── Ticker ── */
function buildTicker() {
  const el = document.getElementById('tickerContent');
  if (!el) return;
  const items = [];
  const cities = Object.keys(allMarkets).slice(0, 8);
  cities.forEach(city => {
    (allMarkets[city] || []).slice(0, 5).forEach(c => {
      const dir   = c.change >= 0 ? '▲' : '▼';
      const color = c.change >= 0 ? '#4ade80' : '#f87171';
      items.push(`<span style="margin:0 18px">${city}: <b>${c.crop}</b> ₹${c.price.toLocaleString('en-IN')} <span style="color:${color}">${dir}${Math.abs(c.change)}%</span></span>`);
    });
  });
  const content = items.join('') + items.join('');
  el.innerHTML = content;
}

/* ── Render city cards ── */
function renderCitiesGrid(markets) {
  const loading = document.getElementById('marketLoading');
  const grid    = document.getElementById('marketCitiesGrid');
  const noRes   = document.getElementById('noResults');
  if (!grid) return;

  const cities = Object.keys(markets);
  if (cities.length === 0) {
    loading.style.display = 'none';
    grid.style.display    = 'none';
    noRes.style.display   = 'block';
    return;
  }

  loading.style.display = 'none';
  noRes.style.display   = 'none';
  grid.style.display    = 'grid';

  grid.innerHTML = cities.map((city, ci) => {
    let crops = markets[city] || [];

    // Apply filter
    if (currentFilter === 'rising')  crops = crops.filter(c => c.change > 0);
    if (currentFilter === 'falling') crops = crops.filter(c => c.change < 0);
    if (currentFilter === 'Very High') crops = crops.filter(c => c.demand === 'Very High');
    if (crops.length === 0) return '';

    const cropsHtml = crops.map(c => {
      const changeClass = c.change >= 0 ? 'up' : 'down';
      const changeIcon  = c.change >= 0 ? '▲' : '▼';
      const priceClass  = c.above_msp ? 'above-msp' : 'below-msp';
      const sourceTag   = c.source === 'live'
        ? '<span class="live-tag">LIVE</span>'
        : '';
      return `
        <div class="crop-row">
          <div class="cr-name">${c.crop}${sourceTag}</div>
          <div>
            <span class="cr-price ${priceClass}">₹${c.price.toLocaleString('en-IN')}</span>
            <span class="cr-unit">/quintal</span>
          </div>
          <div class="cr-msp">MSP ₹${c.msp.toLocaleString('en-IN')}</div>
          <div class="cr-change ${changeClass}">
            ${changeIcon}${Math.abs(c.change)}%
          </div>
        </div>`;
    }).join('');

    if (!cropsHtml.trim()) return '';

    return `
      <div class="city-card" style="animation-delay:${ci*0.04}s">
        <div class="city-card-header">
          <div class="city-name">
            <i class="fas fa-store"></i> ${city}
          </div>
          <div class="city-count">${crops.length} crops</div>
        </div>
        <div class="crop-rows">
          <div class="crop-row-header">
            <span>Crop</span><span>Price</span><span>MSP</span><span>Change</span>
          </div>
          ${cropsHtml}
        </div>
      </div>`;
  }).join('');
}

/* ── Search ── */
function searchLocation() {
  currentSearch = (document.getElementById('locationSearch')?.value || '').trim().toLowerCase();
  const btn     = document.getElementById('clearSearchBtn');
  if (btn) btn.style.display = currentSearch ? 'flex' : 'none';

  if (!currentSearch) {
    renderCitiesGrid(allMarkets);
    return;
  }
  const filtered = {};
  Object.keys(allMarkets).forEach(city => {
    if (city.toLowerCase().includes(currentSearch)) filtered[city] = allMarkets[city];
  });
  renderCitiesGrid(filtered);

  const sub = document.getElementById('marketSubtitle');
  if (sub) sub.textContent = Object.keys(filtered).length > 0
    ? `Showing results for "${currentSearch}"`
    : 'No markets found';
}

function clearSearch() {
  currentSearch = '';
  const inp = document.getElementById('locationSearch');
  if (inp) inp.value = '';
  const btn = document.getElementById('clearSearchBtn');
  if (btn) btn.style.display = 'none';
  const sub = document.getElementById('marketSubtitle');
  if (sub) sub.textContent = 'All major Indian markets';
  renderCitiesGrid(allMarkets);
}

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('locationSearch');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') searchLocation(); });
});

/* ── Filter ── */
function filterDemand(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const toShow = currentSearch
    ? Object.fromEntries(Object.entries(allMarkets).filter(([c]) => c.toLowerCase().includes(currentSearch)))
    : allMarkets;
  renderCitiesGrid(toShow);
}

/* ── Price Table ── */
function buildPriceTable(markets) {
  const body   = document.getElementById('priceTableBody');
  if (!body) return;
  const cities = ["Delhi","Mumbai","Kolkata","Patna","Lucknow","Jaipur","Bhopal","Indore","Amritsar","Hyderabad"];
  const crops  = ["Rice","Wheat","Maize","Cotton","Soybean","Mustard","Onion","Potato","Tomato","Arhar","Moong","Urad"];

  body.innerHTML = crops.map(crop => {
    const cells = cities.map(city => {
      const found = (markets[city] || []).find(c => c.crop === crop);
      if (!found) return '<td class="not-available">—</td>';
      const cls = found.above_msp ? 'above-msp' : 'below-msp';
      return `<td class="${cls}">₹${found.price.toLocaleString('en-IN')}</td>`;
    }).join('');
    return `<tr><td><b>${crop}</b></td>${cells}</tr>`;
  }).join('');
}

/* ── Chart ── */
let currentChartType = 'bar';

function switchChart(type) {
  currentChartType = type;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  updateChart();
}

function updateChart() {
  const city   = document.getElementById('chartCitySelect')?.value || 'Delhi';
  const crops  = (allMarkets[city] || []).slice(0, 10);
  const labels = crops.map(c => c.crop);
  const prices = crops.map(c => c.price);
  const msps   = crops.map(c => c.msp);
  const colors = crops.map(c => c.above_msp ? 'rgba(45,106,79,0.75)' : 'rgba(193,18,31,0.75)');
  const canvas  = document.getElementById('marketChart');
  if (!canvas) return;
  if (chartInst) { chartInst.destroy(); chartInst = null; }

  const isDark = document.body.classList.contains('dark');
  const textColor  = isDark ? '#95d5b2' : '#2d6a4f';
  const gridColor  = isDark ? 'rgba(82,183,136,0.12)' : 'rgba(45,106,79,0.1)';

  chartInst = new Chart(canvas, {
    type: currentChartType === 'radar' ? 'radar' : currentChartType,
    data: {
      labels,
      datasets: [
        {
          label: `${city} Price (₹/quintal)`,
          data: prices,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.75','1')),
          borderWidth: 2,
          borderRadius: currentChartType === 'bar' ? 6 : 0,
          fill: currentChartType === 'line',
          tension: 0.4,
          pointBackgroundColor: colors,
        },
        {
          label: 'MSP (₹/quintal)',
          data: msps,
          backgroundColor: 'rgba(232,93,4,0.12)',
          borderColor: 'rgba(232,93,4,0.7)',
          borderWidth: 2,
          borderDash: [5,5],
          fill: false,
          tension: 0.4,
          type: currentChartType === 'radar' ? 'radar' : 'line',
          pointRadius: currentChartType === 'bar' ? 0 : 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Poppins', size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => `₹${ctx.raw?.toLocaleString('en-IN')}/quintal`
          }
        }
      },
      scales: currentChartType !== 'radar' ? {
        x: { ticks: { color: textColor, font: { family: 'Poppins', size: 11 } }, grid: { color: gridColor } },
        y: {
          ticks: {
            color: textColor,
            font: { family: 'Poppins', size: 11 },
            callback: v => '₹' + v.toLocaleString('en-IN')
          },
          grid: { color: gridColor }
        }
      } : {
        r: { ticks: { color: textColor }, grid: { color: gridColor }, pointLabels: { color: textColor } }
      }
    }
  });
}

function initChart(markets) {
  updateChart();
}
