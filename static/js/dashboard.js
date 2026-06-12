function requestLocation() {
  const btn = document.getElementById('locationBtn');
  const CROP_EMOJI = {
  Rice:'🌾', Wheat:'🌿', Maize:'🌽', Cotton:'☁️', Tomato:'🍅',
  Sugarcane:'🎋', Soybean:'🫘', Mustard:'🌻', Onion:'🧅', Potato:'🥔',
  Chilli:'🌶️', Groundnut:'🥜', Arhar:'🫛', Moong:'🫛', Urad:'🫛',
};
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
      showToast('Location found!', 'success');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Location Found</span>';
        btn.style.background = '#fff';
        btn.style.color      = '#1b4332';
      }
      loadDashboard(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      showToast('Using Delhi as default.', 'warning');
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
        <div class="wpc-feels">${getWeatherT('feels')} ${current.feels_like}°C</div>
      </div>
    </div>
    <div class="weather-stat-card">
      <div class="wsc-icon"><i class="fas fa-droplets"></i></div>
      <div class="wsc-label">${getWeatherT('humidity')}</div>
      <div class="wsc-val">${current.humidity}<span class="wsc-unit">%</span></div>
    </div>
    <div class="weather-stat-card">
      <div class="wsc-icon"><i class="fas fa-wind"></i></div>
      <div class="wsc-label">${getWeatherT('wind')}</div>
      <div class="wsc-val">${current.wind_speed}<span class="wsc-unit"> m/s</span></div>
    </div>
    <div class="weather-stat-card">
      <div class="wsc-icon"><i class="fas fa-eye"></i></div>
      <div class="wsc-label">${getWeatherT('visibility')}</div>
      <div class="wsc-val">${current.visibility.toFixed(1)}<span class="wsc-unit"> km</span></div>
    </div>`;

  // Forecast header
  const fh = document.querySelector('.forecast-section h3');
  if (fh) fh.textContent = getWeatherT('forecast');

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

// Override getDayName to use translations
function getDayName(dateStr) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const daysLang = {
    hi:  ['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'],
    bn:  ['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'],
    ta:  ['ஞா','தி','செ','பு','வி','வெ','ச'],
    te:  ['ఆది','సోమ','మంగళ','బుధ','గురు','శుక్ర','శని'],
    mr:  ['रवि','सोम','मंगळ','बुध','गुरू','शुक्र','शनि'],
    pa:  ['ਐਤ','ਸੋਮ','ਮੰਗ','ਬੁੱਧ','ਵੀਰ','ਸ਼ੁੱਕ','ਸ਼ਨੀ'],
    gu:  ['રવિ','સોમ','મંગળ','બુધ','ગુરુ','શુક્ર','શનિ'],
    kn:  ['ಭಾನು','ಸೋಮ','ಮಂಗಳ','ಬುಧ','ಗುರು','ಶುಕ್ರ','ಶನಿ'],
    ml:  ['ഞായ','തിങ്','ചൊവ്','ബുധ','വ്യാ','വെള്','ശനി'],
    or:  ['ରବି','ସୋମ','ମଙ୍ଗଳ','ବୁଧ','ଗୁରୁ','ଶୁକ୍ର','ଶନି'],
    as:  ['দেওবাৰ','সোমবাৰ','মঙ্গলবাৰ','বুধবাৰ','বৃহস্পতিবাৰ','শুক্ৰবাৰ','শনিবাৰ'],
 };
  const d = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return getWeatherT('today');
  const tom = new Date(today);
  tom.setDate(today.getDate() + 1);
  if (d.toDateString() === tom.toDateString()) return getWeatherT('tomorrow');
  const localDays = daysLang[currentLang] || days;
  return localDays[d.getDay()];
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
  // Update stat labels
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (key && key.startsWith('stat_')) el.textContent = translate(key);
  });
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
      <div class="rain-label">${getWeatherT('today')}</div>
      <div class="rain-answer">${todayRain ? getWeatherT('rain_yes') : getWeatherT('rain_no')}</div>
      <div class="rain-temp">${Math.round(today.temp_max||0)}° / ${Math.round(today.temp_min||0)}°</div>
    </div>
    <div class="rain-card ${tomorrowRain ? 'rain-yes' : 'rain-no'}">
      <div class="rain-icon">${tomorrowRain ? '🌧️' : '☀️'}</div>
      <div class="rain-label">${getWeatherT('tomorrow')}</div>
      <div class="rain-answer">${tomorrowRain ? getWeatherT('rain_yes') : getWeatherT('rain_no')}</div>
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
    // Cache for language re-render
    window._lastCropData  = data;
    window._lastSoilData  = data.soil_tips;
    window._lastPestData  = data.pesticides;
    renderCrops(data);
    renderSoilTips(data.soil_tips);
    renderPesticides(data.pesticides);
    const label = document.getElementById('seasonLabel');
    if (label) label.textContent = `${getSeason(data.season)} — ${current.city}`;
  } catch { showToast('Could not load crop data.', 'error'); }
}
function translateLevel(val) {
  const map = {
    'Very High': translate('level_very_high'),
    'High':      translate('level_high'),
    'Medium':    translate('level_medium'),
    'Low':       translate('level_low'),
  };
  return map[val] || val;
}

function translateDuration(val) {
  // e.g. "90-150 days" → "90-150 <translated days>"
  const daysWord = translate('unit_days');
  return val.replace(/days/gi, daysWord);
}
function renderCrops(data) {
  const section = document.getElementById('cropSection');
  const grid    = document.getElementById('cropsGrid');
  if (!section || !grid) return;
  section.style.display = '';

  const label = document.getElementById('seasonLabel');
  if (label && data.season) {
    const city = window.weatherData?.current?.city || '';
    label.textContent = `${getSeason(data.season)}${city ? ' — ' + city : ''}`;
  }

  grid.innerHTML = (data.crops || []).map((crop, i) => `
    <div class="crop-card" style="animation-delay:${i*0.07}s">
      <div class="crop-card-top">
        <div class="crop-emoji">${CROP_EMOJI[crop.name] || '🌱'}</div>
        <div class="crop-match-badge"><i class="fas fa-check-circle"></i> ${crop.match}</div>
      </div>
      <div class="crop-name">${getCropName(crop.name)}</div>
      <div class="crop-desc">${getCropDesc(crop.name)}</div>
      <div class="crop-meta">
        <div class="cm-item"><span class="cm-label">${translate('cm_season')}</span><span class="cm-val">${getSeason(crop.season)}</span></div>
        <div class="cm-item"><span class="cm-label">${translate('cm_water')}</span><span class="cm-val">${translateLevel(crop.water)}</span></div>
        <div class="cm-item"><span class="cm-label">${translate('cm_yield')}</span><span class="cm-val">${crop.yield}</span></div>
        <div class="cm-item"><span class="cm-label">${translate('cm_duration')}</span><span class="cm-val">${translateDuration(crop.duration)}</span></div>
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
      <div class="soil-tip-icon"><i class="fas fa-seedling" style="color:var(--green)"></i></div>
      <div class="soil-tip-content">
        <div class="soil-tip-title">${getSoilT(tip.title)}</div>
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
      <div class="pcc-header"><i class="fas fa-bug" style="margin-right:6px;color:var(--amber)"></i>${getCropName(p.crop)} — Pest Control</div>
      <div class="pcc-items">
        ${p.guides.map(g => `
          <div class="pcc-item">
            <div class="pcc-pest"><i class="fas fa-exclamation-circle" style="color:var(--amber);margin-right:5px"></i>${getPestT(g.pest)}</div>
            <div class="pcc-meta">
              <span><i class="fas fa-flask"></i> ${g.pesticide}</span>
              <span><i class="fas fa-scale-balanced"></i> ${g.dose}</span>
            </div>
            <div class="pcc-eco eco-${g.eco}">${g.eco ? 'Eco-Friendly' : 'Chemical'}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}
