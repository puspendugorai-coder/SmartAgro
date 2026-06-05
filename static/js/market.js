/* ═══════════════════════════════════════════════
   market.js — Market Prices page
   Handles: city cards, search, filter, charts,
            price table, ticker
═══════════════════════════════════════════════ */

let allMarketData = {};
let allLocations = [];
let marketChart = null;
let activeChartType = 'line';
let activeFilter = 'all';

/* ── Init on DOM ready ──────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    loadAllMarkets();
    setupSearchEnterKey();
});

/* ── Load all market data ───────────────────── */
async function loadAllMarkets() {
    try {
        const res = await fetch('/api/market-prices');
        const data = await res.json();
        allMarketData = data.markets || {};
        allLocations = data.locations || [];

        hideLoading();
        renderMarketGrid(allMarketData);
        buildTicker(allMarketData);
        buildPriceTable(allMarketData);
        buildChart(allMarketData, 'Delhi', 'line');

    } catch (err) {
        console.error('Market data error:', err);
        document.getElementById('marketLoading').innerHTML = `
      <div style="color:var(--red)">
        <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:12px"></i>
        <p>Could not load market data. Please refresh.</p>
      </div>`;
    }
}

function hideLoading() {
    const loader = document.getElementById('marketLoading');
    const grid = document.getElementById('marketCitiesGrid');
    if (loader) loader.style.display = 'none';
    if (grid) grid.style.display = '';
}

/* ── Render market city cards ───────────────── */
function renderMarketGrid(markets) {
    const grid = document.getElementById('marketCitiesGrid');
    const none = document.getElementById('noResults');
    if (!grid) return;

    const entries = Object.entries(markets);
    if (entries.length === 0) {
        grid.style.display = 'none';
        if (none) none.style.display = '';
        return;
    }

    if (none) none.style.display = 'none';
    grid.style.display = '';

    grid.innerHTML = entries.map(([city, crops], cityIdx) => {
                let filtered = crops;
                if (activeFilter === 'Very High') {
                    filtered = crops.filter(c => c.demand === 'Very High');
                } else if (activeFilter === 'rising') {
                    filtered = crops.filter(c => c.change > 0);
                } else if (activeFilter === 'falling') {
                    filtered = crops.filter(c => c.change < 0);
                }

                if (filtered.length === 0) return '';

                return `
      <div class="city-card" style="animation-delay:${cityIdx * 0.06}s">
        <div class="city-card-header">
          <div class="city-name">
            <i class="fas fa-location-dot"></i> ${city}
          </div>
          <span class="city-count">${filtered.length} crops</span>
        </div>
        <div class="crop-rows">
          <div style="display:grid;grid-template-columns:1.5fr 1fr 80px 100px;padding:8px 20px;font-size:0.68rem;color:var(--text-3);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid var(--border)">
            <span>Crop</span><span>Price</span><span>Change</span><span>Demand</span>
          </div>
          ${filtered.map(crop => `
            <div class="crop-row">
              <div class="cr-name">${crop.crop}</div>
              <div>
                <div class="cr-price">₹${crop.price.toLocaleString('en-IN')}</div>
                <div class="cr-unit">${crop.unit}</div>
              </div>
              <div class="cr-change ${crop.change >= 0 ? 'up' : 'down'}">
                <i class="fas fa-arrow-${crop.change >= 0 ? 'up' : 'down'}"></i>
                ${Math.abs(crop.change).toFixed(1)}%
              </div>
              <div class="cr-demand demand-${getDemandClass(crop.demand)}">${crop.demand}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  // Check if all cards filtered out
  const visibleCards = grid.querySelectorAll('.city-card');
  if (visibleCards.length === 0) {
    grid.style.display = 'none';
    if (none) none.style.display = '';
  }

  setTimeout(() => observeAnimations(), 100);
}

function getDemandClass(demand) {
  const map = {
    'Very High': 'very-high',
    'High':      'high',
    'Medium':    'medium',
    'Low':       'low',
  };
  return map[demand] || 'medium';
}

/* ── Search location ────────────────────────── */
async function searchLocation() {
  const input = document.getElementById('locationSearch');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (!input) return;

  const query = input.value.trim();
  if (!query) {
    clearSearch();
    return;
  }

  if (clearBtn) clearBtn.style.display = 'flex';

  const subtitle = document.getElementById('marketSubtitle');
  if (subtitle) subtitle.textContent = `Showing results for "${query}"`;

  try {
    const res  = await fetch(`/api/market-prices?location=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.markets || Object.keys(data.markets).length === 0) {
      const grid = document.getElementById('marketCitiesGrid');
      const none = document.getElementById('noResults');
      if (grid) grid.style.display = 'none';
      if (none) none.style.display = '';
    } else {
      allMarketData = data.markets;
      renderMarketGrid(data.markets);
      buildPriceTable(data.markets);
      const firstCity = data.locations[0];
      if (firstCity) buildChart(data.markets, firstCity, activeChartType);
      showToast(`📍 Showing ${data.locations[0]} market data`, 'success');
    }
  } catch (err) {
    showToast('Search failed. Try again.', 'error');
  }
}

function clearSearch() {
  const input    = document.getElementById('locationSearch');
  const clearBtn = document.getElementById('clearSearchBtn');
  const subtitle = document.getElementById('marketSubtitle');

  if (input)    input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  if (subtitle) subtitle.textContent = 'Showing all major Indian markets';

  loadAllMarkets();
}

function setupSearchEnterKey() {
  const input = document.getElementById('locationSearch');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchLocation();
    });
    input.addEventListener('input', () => {
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) clearBtn.style.display = input.value ? 'flex' : 'none';
    });
  }
}

/* ── Filter by demand / price ───────────────── */
function filterDemand(type, el) {
  activeFilter = type;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderMarketGrid(allMarketData);
}

/* ── Live price ticker ──────────────────────── */
function buildTicker(markets) {
  const content = document.getElementById('tickerContent');
  if (!content) return;

  const items = [];
  Object.entries(markets).forEach(([city, crops]) => {
    crops.forEach(crop => {
      const sign  = crop.change >= 0 ? '▲' : '▼';
      const color = crop.change >= 0 ? '#4ade80' : '#f87171';
      items.push(
        `<span style="margin:0 32px">
          <strong style="color:#e8f5e9">${crop.crop}</strong>
          <span style="color:var(--text-3)">(${city})</span>
          <strong style="color:var(--amber)"> ₹${crop.price.toLocaleString('en-IN')}</strong>
          <span style="color:${color}"> ${sign}${Math.abs(crop.change).toFixed(1)}%</span>
        </span>`
      );
    });
  });

  // Duplicate for seamless scroll
  const html = items.join('  •  ');
  content.innerHTML = html + '  •  ' + html;
}

/* ── Chart ──────────────────────────────────── */
function switchChart(type) {
  activeChartType = type;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.chart-tab[onclick*="${type}"]`);
  if (activeTab) activeTab.classList.add('active');
  const city = document.getElementById('chartCitySelect')?.value || 'Delhi';
  buildChart(allMarketData, city, type);
}

function updateChart() {
  const city = document.getElementById('chartCitySelect')?.value || 'Delhi';
  buildChart(allMarketData, city, activeChartType);
}

function buildChart(markets, city, type) {
  const canvas = document.getElementById('marketChart');
  if (!canvas) return;

  const cityData = markets[city] || Object.values(markets)[0] || [];
  if (marketChart) marketChart.destroy();

  if (type === 'line') {
    buildLineChart(canvas, cityData, city);
  } else if (type === 'bar') {
    buildBarChart(canvas, cityData, city);
  } else if (type === 'radar') {
    buildRadarChart(canvas, cityData, city);
  }
}

/* ── Line chart: 30-day simulated trend ─────── */
function buildLineChart(canvas, cityData, city) {
  const labels = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
  }

  const topCrops  = cityData.slice(0, 4);
  const lineColors = ['#4ade80', '#fbbf24', '#2dd4bf', '#a78bfa'];

  const datasets = topCrops.map((crop, idx) => {
    const base  = crop.price;
    const trend = crop.change / 100;
    const data  = labels.map((_, dayIdx) => {
      const noise = (Math.random() - 0.5) * base * 0.04;
      return Math.round(base * (1 - trend * (29 - dayIdx) / 29) + noise);
    });
    return {
      label: crop.crop,
      data,
      borderColor:     lineColors[idx],
      backgroundColor: lineColors[idx] + '18',
      borderWidth: 2.5,
      tension: 0.4,
      fill: idx === 0,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: lineColors[idx],
    };
  });

  marketChart = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: getChartOptions(`${city} — 30-Day Price Trend (₹/quintal)`),
  });
}

/* ── Bar chart: current prices comparison ───── */
function buildBarChart(canvas, cityData, city) {
  const colors = cityData.map(c =>
    c.change >= 2  ? 'rgba(74,222,128,0.75)'  :
    c.change <= -2 ? 'rgba(248,113,113,0.75)' :
                     'rgba(251,191,36,0.75)'
  );

  marketChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels:   cityData.map(c => c.crop),
      datasets: [{
        label: 'Price (₹/quintal)',
        data:  cityData.map(c => c.price),
        backgroundColor: colors,
        borderColor:     colors.map(c => c.replace('0.75', '1')),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      ...getChartOptions(`${city} — Current Crop Prices (₹/quintal)`),
      scales: {
        x: {
          grid:   { color: 'rgba(74,222,128,0.05)' },
          ticks:  { color: '#a7c4a8', font: { size: 11 } },
          border: { color: 'rgba(74,222,128,0.1)' }
        },
        y: {
          grid:   { color: 'rgba(74,222,128,0.06)' },
          ticks:  { color: '#6b8c6c', callback: v => '₹' + v.toLocaleString('en-IN') },
          border: { color: 'rgba(74,222,128,0.1)' }
        }
      }
    }
  });
}

/* ── Radar chart: demand intensity ──────────── */
function buildRadarChart(canvas, cityData, city) {
  const demandMap = { 'Very High': 100, 'High': 75, 'Medium': 50, 'Low': 25 };

  marketChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: cityData.map(c => c.crop),
      datasets: [{
        label: 'Demand Intensity',
        data:  cityData.map(c => demandMap[c.demand] || 50),
        backgroundColor: 'rgba(251,191,36,0.12)',
        borderColor:     'rgba(251,191,36,0.7)',
        borderWidth: 2,
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 100,
          ticks: {
            color: 'rgba(107,140,108,0.7)',
            backdropColor: 'transparent',
            stepSize: 25,
            font: { size: 10 }
          },
          grid:        { color: 'rgba(74,222,128,0.08)' },
          angleLines:  { color: 'rgba(74,222,128,0.1)' },
          pointLabels: { color: '#a7c4a8', font: { size: 11, weight: '600' } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0e1510',
          borderColor: 'rgba(74,222,128,0.25)',
          borderWidth: 1,
          titleColor: '#e8f5e9',
          bodyColor: '#a7c4a8',
        }
      }
    }
  });
}

/* ── Shared chart options ───────────────────── */
function getChartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid:   { color: 'rgba(74,222,128,0.05)', drawBorder: false },
        ticks:  { color: '#6b8c6c', font: { size: 10 }, maxTicksLimit: 8 },
        border: { color: 'rgba(74,222,128,0.1)' }
      },
      y: {
        grid:   { color: 'rgba(74,222,128,0.06)', drawBorder: false },
        ticks:  { color: '#6b8c6c', callback: v => '₹' + v.toLocaleString('en-IN') },
        border: { color: 'rgba(74,222,128,0.1)' }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: { color: '#a7c4a8', font: { size: 12 }, usePointStyle: true, pointStyleWidth: 10 }
      },
      title: {
        display: true,
        text:    title,
        color:   '#a7c4a8',
        font:    { size: 13, weight: '600' },
        padding: { bottom: 12 }
      },
      tooltip: {
        backgroundColor: '#0e1510',
        borderColor:     'rgba(74,222,128,0.25)',
        borderWidth: 1,
        titleColor:  '#e8f5e9',
        bodyColor:   '#a7c4a8',
        padding: 10,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}`
        }
      }
    },
    animation: { duration: 700, easing: 'easeOutQuart' }
  };
}

/* ── Price Comparison Table ─────────────────── */
function buildPriceTable(markets) {
  const tbody = document.getElementById('priceTableBody');
  if (!tbody) return;

  const cities = Object.keys(markets);

  // Collect all unique crops
  const cropSet = new Set();
  Object.values(markets).forEach(crops => crops.forEach(c => cropSet.add(c.crop)));
  const allCrops = Array.from(cropSet).sort();

  // Build lookup: city → crop → price
  const lookup = {};
  Object.entries(markets).forEach(([city, crops]) => {
    lookup[city] = {};
    crops.forEach(c => { lookup[city][c.crop] = c; });
  });

  tbody.innerHTML = allCrops.map(crop => {
    const cells = cities.map(city => {
      const item = lookup[city]?.[crop];
      if (!item) return `<td class="not-available">—</td>`;

      const color = item.change >= 2  ? '#4ade80' :
                    item.change <= -2 ? '#f87171' : '#e8f5e9';
      const arrow = item.change >= 0.5  ? '▲' :
                    item.change <= -0.5 ? '▼' : '–';
      return `
        <td style="color:${color}">
          ₹${item.price.toLocaleString('en-IN')}
          <span style="font-size:0.65rem;opacity:0.7"> ${arrow}</span>
        </td>`;
    });
    return `<tr><td>${crop}</td>${cells.join('')}</tr>`;
  }).join('');

  // Update table headers dynamically
  const thead = document.querySelector('.price-table thead tr');
  if (thead) {
    thead.innerHTML = `<th>Crop</th>` +
      cities.map(c => `<th>${c}</th>`).join('');
  }
}