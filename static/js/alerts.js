let allAlerts    = [];
let riskChart    = null;
let curWeather   = null;

function requestAlertsLocation() {
  const btn=document.getElementById('alertLocationBtn');
  if (btn) { btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Getting location...'; btn.disabled=true; }
  if (!navigator.geolocation) { loadAlerts(28.6139,77.2090); return; }
  navigator.geolocation.getCurrentPosition(
    pos=>{ showToast('📍 Location found!','success'); loadAlerts(pos.coords.latitude,pos.coords.longitude); },
    ()=>{ showToast('Using Delhi as default.','warning'); loadAlerts(28.6139,77.2090); },
    {timeout:10000,enableHighAccuracy:true}
  );
}

async function loadAlerts(lat,lon) {
  document.getElementById('locationSection').style.display='none';
  document.getElementById('alertsSection').style.display='';
  try {
    const wRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    const wData = await wRes.json();
    curWeather = wData.current;
    const aRes = await fetch('/api/alerts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({temp:curWeather.temp,humidity:curWeather.humidity,wind_speed:curWeather.wind_speed,rain:curWeather.rain||0,description:curWeather.description})});
    const aData = await aRes.json();
    allAlerts = aData.alerts||[];
    updateCounts(allAlerts);
    sessionStorage.setItem('alert_count',allAlerts.length);
    updateAlertBadge(allAlerts.length);
    renderAlertsList(allAlerts);
    renderPestCalendar(curWeather);
    renderHarmfulSafe(curWeather);
    ['pestCalendarSection','harmfulSection'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='';});
  } catch(err) {
    console.error(err);
    document.getElementById('alertsList').innerHTML='<div style="text-align:center;padding:60px 0;color:var(--text-3)"><i class="fas fa-exclamation-triangle" style="font-size:2rem;color:var(--amber)"></i><p style="margin-top:12px">Could not load alerts.</p><button class="btn-secondary" style="margin-top:16px" onclick="requestAlertsLocation()">Retry</button></div>';
  }
}

function updateCounts(alerts) {
  const set=(id,val)=>{const el=document.getElementById(id);if(!el)return;let n=0;const iv=setInterval(()=>{n=Math.min(n+1,val);el.textContent=n;if(n>=val)clearInterval(iv);},60);};
  set('dangerCount',alerts.filter(a=>a.type==='danger').length);
  set('warningCount',alerts.filter(a=>a.type==='warning').length);
  set('infoCount',alerts.filter(a=>a.type==='info').length);
  set('totalCount',alerts.length);
}

function renderAlertsList(alerts) {
  window._lastAlertsData = alerts; // cache for re-render
  const list  = document.getElementById('alertsList');
  const none  = document.getElementById('noAlerts');

  if (!list) return;
  if (!alerts || alerts.length === 0) {
    list.style.display  = 'none';
    if (none) none.style.display = '';
    updateAlertBadge(0);
    return;
  }

  if (none) none.style.display = 'none';
  list.style.display  = '';

  const danger  = alerts.filter(a => a.type === 'danger').length;
  const warning = alerts.filter(a => a.type === 'warning').length;
  const info    = alerts.filter(a => a.type === 'info').length;
  const setEl   = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('dangerCount',  danger);
  setEl('warningCount', warning);
  setEl('infoCount',    info);
  setEl('totalCount',   alerts.length);
  updateAlertBadge(danger + warning);
  sessionStorage.setItem('alert_count', danger + warning);

  renderAlertsHTML(alerts);
}

async function renderAlertsHTML(alerts) {
  const list = document.getElementById('alertsList');
  if (!list) return;

  let messages = alerts.map(a => a.message);
  let actions  = alerts.map(a => a.action);

  if (typeof currentLang !== 'undefined' && currentLang !== 'en') {
    try {
      const translatedMsgs = await translateDynamicTexts(messages, currentLang);
      const translatedActs = await translateDynamicTexts(actions, currentLang);
      messages = translatedMsgs;
      actions  = translatedActs;
    } catch (e) { console.error(e); }
  }

  list.innerHTML = alerts.map((a, i) => `
    <div class="alert-card ${a.type}" data-type="${a.type}" data-category="${a.category}" style="animation-delay:${i*0.06}s">
      <div class="alert-card-icon">
        <i class="fas ${a.icon}"></i>
      </div>
      <div class="alert-card-body">
        <div class="alert-card-top">
          <span class="alert-card-title">${getAlertT(a.title)}</span>
          <span class="alert-category cat-${a.category.toLowerCase().replace(' ','-')}">${a.category}</span>
        </div>
        <div class="alert-card-msg">${messages[i]}</div>
        <div class="alert-card-action">
          <i class="fas fa-lightbulb"></i> ${actions[i]}
        </div>
      </div>
    </div>`).join('');
}

function filterAlerts(filter) {
  document.querySelectorAll('.alert-tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  let visible=0;
  document.querySelectorAll('.alert-card').forEach(card=>{
    const show=filter==='all'||card.dataset.type===filter||card.dataset.category===filter;
    card.style.display=show?'flex':'none';
    if(show) visible++;
  });
  const none=document.getElementById('noAlerts');
  if(none) none.style.display=visible===0?'block':'none';
}

const PESTS=[
  {name:'Brown Plant Hopper',icon:'🦗',season:'Kharif (Jun–Oct)',risk:'High',crops:'Rice, Paddy',description:'Feeds on rice causing hopperburn. High risk in humid conditions.',prevention:'Use resistant varieties. Keep fields drained.'},
  {name:'Aphids',icon:'🐜',season:'Rabi (Nov–Feb)',risk:'Medium',crops:'Wheat, Mustard',description:'Suck plant sap, transmit viral diseases. Risk in mild temperatures.',prevention:'Neem oil spray. Release ladybird beetles.'},
  {name:'Fall Armyworm',icon:'🐛',season:'Kharif (Jul–Sep)',risk:'High',crops:'Maize, Sorghum',description:'Causes severe leaf damage. Can destroy crops within days.',prevention:'Bt-based bioinsecticide spray early.'},
  {name:'Whitefly',icon:'🦋',season:'Year-round',risk:'Medium',crops:'Cotton, Tomato',description:'Transmits leaf curl virus. Multiplies in dry hot weather.',prevention:'Yellow sticky traps. Reflective mulch.'},
  {name:'Red Spider Mite',icon:'🕷️',season:'Zaid (Mar–May)',risk:'High',crops:'Soybean, Cotton',description:'Causes bronzing of leaves. Severe in hot dry weather.',prevention:'Increase irrigation. Abamectin spray.'},
  {name:'Stem Borer',icon:'🐞',season:'Kharif (Jun–Sep)',risk:'High',crops:'Rice, Maize',description:'Bores into stems causing dead heart in vegetative stage.',prevention:'Pheromone traps. Remove crop residues.'},
];

async function renderPestCalendar(weather) {
  window._lastPestWeather = weather; // cache for re-render
  const grid=document.getElementById('pestCalendarGrid');
  if (!grid) return;
  const highRisk=weather.humidity>70||weather.temp>30;

  let descs = PESTS.map(p=>p.description);
  let prevs = PESTS.map(p=>p.prevention);

  if (typeof currentLang !== 'undefined' && currentLang !== 'en') {
    try {
      descs = await translateDynamicTexts(descs, currentLang);
      prevs = await translateDynamicTexts(prevs, currentLang);
    } catch (e) { console.error(e); }
  }

  grid.innerHTML=PESTS.map((p,i)=>{
    const active=highRisk&&p.risk==='High';
    return `<div class="pest-cal-card ${active?'current-risk':''}" style="animation-delay:${i*0.05}s">
      <div class="pcal-header">
        <div class="pcal-icon">${p.icon}</div>
        <div><div class="pcal-name">${getPestT(p.name)}</div><div class="pcal-season">${p.season}</div></div>
        ${active?'<span style="font-size:0.65rem;padding:2px 8px;background:rgba(248,113,113,0.1);color:var(--red);border-radius:50px;border:1px solid rgba(248,113,113,0.2)">⚠ Active</span>':''}
      </div>
      <div class="pcal-body">
        <div style="font-size:0.78rem;color:var(--text-3);margin-bottom:4px">🌱 ${p.crops}</div>
        <div style="font-size:0.8rem;color:var(--text-2);margin-bottom:6px">${descs[i]}</div>
        <div style="font-size:0.75rem;color:var(--teal)">🛡️ ${prevs[i]}</div>
        <span class="pcal-risk risk-${p.risk.toLowerCase()}">${p.risk} Risk</span>
      </div>
    </div>`;
  }).join('');
}

const ALL_CROPS=[
  {name:'Rice',icon:'🌾',minTemp:20,maxTemp:38,minHumidity:70},
  {name:'Wheat',icon:'🌿',minTemp:10,maxTemp:25,minHumidity:40},
  {name:'Maize',icon:'🌽',minTemp:18,maxTemp:35,minHumidity:50},
  {name:'Cotton',icon:'☁️',minTemp:25,maxTemp:40,minHumidity:40},
  {name:'Tomato',icon:'🍅',minTemp:18,maxTemp:30,minHumidity:60},
  {name:'Onion',icon:'🧅',minTemp:13,maxTemp:28,minHumidity:50},
  {name:'Potato',icon:'🥔',minTemp:10,maxTemp:22,minHumidity:60},
  {name:'Chilli',icon:'🌶️',minTemp:20,maxTemp:35,minHumidity:60},
  {name:'Groundnut',icon:'🥜',minTemp:22,maxTemp:36,minHumidity:50},
  {name:'Mustard',icon:'🌻',minTemp:10,maxTemp:25,minHumidity:40},
];

async function renderHarmfulSafe(weather) {
  window._lastHarmfulWeather = weather; // cache for re-render
  const section=document.getElementById('harmfulSection');
  const harmGrid=document.getElementById('harmfulGrid');
  const safeGrid=document.getElementById('safeGrid');
  if (!section||!harmGrid||!safeGrid) return;
  section.style.display='';
  const {temp,humidity}=weather;
  const harmful=[],safe=[];
  ALL_CROPS.forEach(crop=>{
    const tok=temp>=crop.minTemp&&temp<=crop.maxTemp;
    const hok=humidity>=crop.minHumidity;
    if (!tok||!hok) {
      const reasons=[];
      if(temp<crop.minTemp) reasons.push(`Too cold (need ${crop.minTemp}°C+)`);
      if(temp>crop.maxTemp) reasons.push(`Too hot (max ${crop.maxTemp}°C)`);
      if(humidity<crop.minHumidity) reasons.push(`Low humidity (need ${crop.minHumidity}%+)`);
      harmful.push({...crop,reasons});
    } else { safe.push(crop); }
  });

  // collect all reason strings for translation
  let allReasons = [];
  harmful.forEach(c => allReasons.push(...c.reasons));
  let translatedReasons = allReasons;
  let goodForText = `Good for ${temp}°C, ${humidity}% humidity`;

  if (typeof currentLang !== 'undefined' && currentLang !== 'en') {
    try {
      const toTranslate = [...allReasons, goodForText];
      const result = await translateDynamicTexts(toTranslate, currentLang);
      translatedReasons = result.slice(0, allReasons.length);
      goodForText = result[allReasons.length] || goodForText;
    } catch (e) { console.error(e); }
  }

  // map translated reasons back per crop
  let ri = 0;
  const harmfulTranslated = harmful.map(c => {
    const reasons = c.reasons.map(() => translatedReasons[ri++]);
    return {...c, reasons};
  });

  harmGrid.innerHTML=harmfulTranslated.length?harmfulTranslated.map(c=>`<div class="harmful-card"><div class="hsc-name"><span style="font-size:1.5rem">${c.icon}</span>${getCropName(c.name)}<span style="margin-left:auto;font-size:0.7rem;padding:2px 8px;background:rgba(248,113,113,0.1);color:var(--red);border-radius:50px">⚠ Risky</span></div><div class="hsc-reason">${c.reasons.map(r=>`<div><i class="fas fa-xmark" style="color:var(--red);margin-right:4px"></i>${r}</div>`).join('')}</div></div>`).join(''):'<p style="color:var(--text-3)">No risky crops found.</p>';
  safeGrid.innerHTML=safe.length?safe.map(c=>`<div class="safe-card"><div class="hsc-name"><span style="font-size:1.5rem">${c.icon}</span>${getCropName(c.name)}<span style="margin-left:auto;font-size:0.7rem;padding:2px 8px;background:rgba(74,222,128,0.1);color:var(--green);border-radius:50px">✓ Safe</span></div><div style="font-size:0.78rem;color:var(--text-2);margin-top:4px">${goodForText}</div></div>`).join(''):'<p style="color:var(--text-3)">No fully safe crops found.</p>';
}
