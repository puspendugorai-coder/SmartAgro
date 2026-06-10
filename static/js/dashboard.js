function requestLocation() {
  const btn = document.getElementById('locationBtn');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Getting location...</span>';
    btn.disabled  = true;
  }

  if (!navigator.geolocation) {
    showToast('Geolocation not supported.', 'warning');
    loadDashboard(28.6139, 77.2090);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      showToast('📍 Location found!', 'success');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Location Found</span>';
        btn.style.background = '#fff';
        btn.style.color      = '#1b4332';
      }
      loadDashboard(pos.coords.latitude, pos.coords.longitude);
      // Send notification if alerts found
      setTimeout(() => {
        const count = parseInt(sessionStorage.getItem('alert_count') || '0');
        if (count > 0) sendNotification('SmartAgro Alert', `${count} active alerts for your farm area!`);
      }, 5000);
    },
    err => {
      console.warn('[Location error]', err.code, err.message);
      showToast('Using Delhi as default. Please allow location for accurate data.', 'warning');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> <span>Get My Location</span>';
        btn.disabled  = false;
        btn.style.background = '';
        btn.style.color      = '';
      }
      loadDashboard(28.6139, 77.2090);
    },
    {timeout: 12000, enableHighAccuracy: false, maximumAge: 300000}
  );
}

async function loadDashboard(lat, lon) {
  const card = document.getElementById('heroWeatherCard');
  if (card) card.innerHTML = `
    <div class="hwc-loading">
      <div style="width:28px;height:28px;border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 8px"></div>
      <span style="font-size:0.82rem">Loading weather...</span>
    </div>`;

  const data = await fetchWeather(lat, lon);
  if (!data) return;

  renderHeroCard(data.current);
  renderWeatherSection(data.current, data.forecast);
  renderStatBar(data.current);
  renderRainForecast(data.forecast);
  loadCrops(data.current);
}

function renderHeroCard(w) {
  const card = document.getElementById('heroWeatherCard');
  if (!card) return;
  card.innerHTML = `
    <div class="hwc-loaded">
      <div class="hwc-city"><i class="fas fa-location-dot"></i> ${w.city}</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
        <div>
          <div class="hwc-temp">${w.temp}°</div>
          <div class="hwc-desc">${capitalize(w.description)}</div>
        </div>
        <div class="hwc-icon-large">${getWeatherEmoji(w.icon)}</div>
      </div>
      <div class="hwc-stats">
        <div class="hwc-stat"><i class="fas fa-droplets"></i> ${w.humidity}%</div>
        <div class="hwc-stat"><i class="fas fa-wind"></i> ${w.wind_speed} m/s</div>
        <div class="hwc-stat"><i class="fas fa-temperature-half"></i> ${w.feels_like}°C</div>
        <div class="hwc-stat"><i class="fas fa-gauge-high"></i> ${w.pressure} hPa</div>
      </div>
    </div>`;
}

function renderWeatherSection(current, forecast) {
  const section = document.getElementById('weatherSection');
  if (section) section.style.display = '';

  const main = document.getElementById('weatherMain');
  if (main) main.innerHTML = `
    <div class="weather-primary-card">
      <div style="font-size:4rem">${getWeatherEmoji(current.icon)}</div>
      <div>
        <div class="wpc-temp">${current.temp}°C</div>
        <div class="wpc-city"><i class="fas fa-location-dot" style="margin-right:4px"></i>${current.city}</div>
        <div class="wpc-desc">${capitalize(current.description)}</div>
        <div class="wpc-feels">Feels like ${current.feels_like}°C</div>
      </div>
    </div>
    <div class="weather-stat-card">
      <div class="wsc-icon"><i class="fas fa-droplets"></i></div>
      <div class="wsc-label">Humidity</div>
      <div class="wsc-val">${current.humidity}<span class="wsc-unit">%</span></div>
    </div>
    <div class="weather-stat-card">
      <div class="wsc-icon"><i class="fas fa-wind"></i></div>
      <div class="wsc-label">Wind Speed</div>
      <div class="wsc-val">${current.wind_speed}<span class="wsc-unit"> m/s</span></div>
    </div>
    <div class="weather-stat-card">
      <div class="wsc-icon"><i class="fas fa-eye"></i></div>
      <div class="wsc-label">Visibility</div>
      <div class="wsc-val">${current.visibility.toFixed(1)}<span class="wsc-unit"> km</span></div>
    </div>`;

  const fg = document.getElementById('forecastGrid');
  if (fg && forecast) {
    const todayStr = new Date().toISOString().split('T')[0];
    fg.innerHTML = forecast.map((day, i) => `
      <div class="forecast-card ${day.date === todayStr ? 'today' : ''}" style="animation-delay:${i*0.06}s">
        <div class="fc-day">${getDayName(day.date)}</div>
        <div class="fc-icon">${getWeatherEmoji(day.icon)}</div>
        <div class="fc-desc">${capitalize(day.description)}</div>
        <div class="fc-temps">
          <span class="fc-max">${Math.round(day.temp_max)}°</span>
          <span class="fc-min">${Math.round(day.temp_min)}°</span>
        </div>
        <div style="font-size:0.65rem;color:var(--text-3);margin-top:3px">
          <i class="fas fa-droplets" style="color:#1d4e89"></i> ${day.humidity}%
        </div>
      </div>`).join('');
  }
}

function renderStatBar(w) {
  const bar = document.getElementById('statsBar');
  if (bar) bar.style.display = '';
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('statTemp',       `${w.temp}°C`);
  set('statHumidity',   `${w.humidity}%`);
  set('statWind',       `${w.wind_speed} m/s`);
  set('statVisibility', `${w.visibility.toFixed(1)} km`);
  set('statPressure',   `${w.pressure} hPa`);
}

function renderRainForecast(forecast) {
  const section = document.getElementById('rainSection');
  if (!section || !forecast) return;
  section.style.display = '';
  const today    = forecast[0] || {};
  const tomorrow = forecast[1] || {};
  const todayRain    = today.rain > 0    || (today.description    || '').toLowerCase().includes('rain');
  const tomorrowRain = tomorrow.rain > 0 || (tomorrow.description || '').toLowerCase().includes('rain');
  const grid = document.getElementById('rainGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="rain-card ${todayRain ? 'rain-yes' : 'rain-no'}">
      <div class="rain-icon">${todayRain ? '🌧️' : '☀️'}</div>
      <div class="rain-label">Today</div>
      <div class="rain-answer">${todayRain ? 'YES — Rain Expected' : 'NO — Clear Sky'}</div>
      <div class="rain-temp">${Math.round(today.temp_max||0)}° / ${Math.round(today.temp_min||0)}°</div>
    </div>
    <div class="rain-card ${tomorrowRain ? 'rain-yes' : 'rain-no'}">
      <div class="rain-icon">${tomorrowRain ? '🌧️' : '☀️'}</div>
      <div class="rain-label">Tomorrow</div>
      <div class="rain-answer">${tomorrowRain ? 'YES — Rain Expected' : 'NO — Clear Sky'}</div>
      <div class="rain-temp">${Math.round(tomorrow.temp_max||0)}° / ${Math.round(tomorrow.temp_min||0)}°</div>
    </div>`;
}

async function loadCrops(current) {
  try {
    const res  = await fetch('/api/crop-recommendations', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({temp: current.temp, humidity: current.humidity, rain: current.rain || 0})
    });
    const data = await res.json();
    renderCrops(data);
    renderSoilTips(data.soil_tips);
    renderPesticides(data.pesticides);
    const label = document.getElementById('seasonLabel');
    if (label) label.textContent = `Season: ${data.season} — ${current.city}`;
  } catch { showToast('Could not load crop data.', 'error'); }
}

function renderCrops(data) {
  const section = document.getElementById('cropSection');
  const grid    = document.getElementById('cropsGrid');
  if (!section || !grid) return;
  section.style.display = '';
  grid.innerHTML = (data.crops || []).map((crop, i) => `
    <div class="crop-card" style="animation-delay:${i*0.07}s">
      <div class="crop-card-top">
        <div class="crop-emoji">${crop.icon}</div>
        <div class="crop-match-badge"><i class="fas fa-check-circle"></i> ${crop.match}</div>
      </div>
      <div class="crop-name">${crop.name}</div>
      <div class="crop-desc">${crop.description}</div>
      <div class="crop-meta">
        <div class="cm-item"><span class="cm-label">Season</span><span class="cm-val">${crop.season.split(' ')[0]}</span></div>
        <div class="cm-item"><span class="cm-label">Water</span><span class="cm-val">${crop.water}</span></div>
        <div class="cm-item"><span class="cm-label">Yield</span><span class="cm-val">${crop.yield}</span></div>
        <div class="cm-item"><span class="cm-label">Duration</span><span class="cm-val">${crop.duration}</span></div>
      </div>
      <div class="crop-profit"><i class="fas fa-indian-rupee-sign"></i> ${crop.profit}</div>
    </div>`).join('');
  setTimeout(() => observeAnimations(), 100);
}

function renderSoilTips(tips) {
  const section = document.getElementById('soilSection');
  const grid    = document.getElementById('soilGrid');
  if (!section || !grid || !tips?.length) return;
  section.style.display = '';
  grid.innerHTML = tips.map((tip, i) => `
    <div class="soil-tip-card" style="animation-delay:${i*0.08}s">
      <div class="soil-tip-icon">${tip.icon}</div>
      <div class="soil-tip-content">
        <div class="soil-tip-title">${tip.title}</div>
        <div class="soil-tip-text">${tip.tip}</div>
      </div>
    </div>`).join('');
}

function renderPesticides(pesticides) {
  const section = document.getElementById('pestSection');
  const cards   = document.getElementById('pestCards');
  if (!section || !cards || !pesticides?.length) return;
  section.style.display = '';
  cards.innerHTML = pesticides.map(p => `
    <div class="pest-crop-card">
      <div class="pcc-header">🌾 ${p.crop} — Pest Control</div>
      <div class="pcc-items">
        ${p.guides.map(g => `
          <div class="pcc-item">
            <div class="pcc-pest"><i class="fas fa-bug" style="color:var(--amber);margin-right:5px"></i>${g.pest}</div>
            <div class="pcc-meta">
              <span><i class="fas fa-flask"></i> ${g.pesticide}</span>
              <span><i class="fas fa-scale-balanced"></i> ${g.dose}</span>
            </div>
            <div class="pcc-eco eco-${g.eco}">${g.eco ? '🌿 Eco-Friendly' : '⚗️ Chemical'}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}
