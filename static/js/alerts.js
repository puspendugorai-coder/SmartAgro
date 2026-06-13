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
  const badge = document.getElementById('alertBadge');

  if (!list) return;
  if (!alerts || alerts.length === 0) {
    list.style.display  = 'none';
    if (none) none.style.display = '';
    updateAlertBadge(0);
    return;
  }

  if (none) none.style.display = 'none';
  list.style.display  = '';

  // Update summary counts
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

  list.innerHTML = alerts.map((a, i) => `
    <div class="alert-card ${a.type}" style="animation-delay:${i*0.06}s">
      <div class="alert-card-icon">
        <i class="fas ${a.icon}"></i>
      </div>
      <div class="alert-card-body">
        <div class="alert-card-top">
          <span class="alert-card-title">${getAlertT(a.title)}</span>
          <span class="alert-category cat-${a.category.toLowerCase().replace(' ','-')}">${getAlertT(a.category) || a.category}</span>
        </div>
        <div class="alert-card-msg">${a.message}</div>
        <div class="alert-card-action">
          <i class="fas fa-lightbulb"></i> ${a.action}
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

function renderPestCalendar(weather) {
  const grid = document.getElementById('pestCalendarGrid');
  if (!grid) return;
  const highRisk = weather.humidity > 70 || weather.temp > 30;

  // Translated crop names for pest calendar
  const pestCrops = {
    en: {'Brown Plant Hopper':'Rice, Paddy','Aphids':'Wheat, Mustard','Fall Armyworm':'Maize, Sorghum','Whitefly':'Cotton, Tomato','Red Spider Mite':'Soybean, Cotton','Stem Borer':'Rice, Maize'},
    hi: {'Brown Plant Hopper':'धान','Aphids':'गेहूं, सरसों','Fall Armyworm':'मक्का, ज्वार','Whitefly':'कपास, टमाटर','Red Spider Mite':'सोयाबीन, कपास','Stem Borer':'धान, मक्का'},
    te: {'Brown Plant Hopper':'వరి, ధాన్యం','Aphids':'గోధుమ, ఆవాలు','Fall Armyworm':'మొక్కజొన్న, జొన్న','Whitefly':'పత్తి, టమాటా','Red Spider Mite':'సోయాబీన్, పత్తి','Stem Borer':'వరి, మొక్కజొన్న'},
    ta: {'Brown Plant Hopper':'நெல், அரிசி','Aphids':'கோதுமை, கடுகு','Fall Armyworm':'மக்காச்சோளம், சோளம்','Whitefly':'பருத்தி, தக்காளி','Red Spider Mite':'சோயாபீன், பருத்தி','Stem Borer':'நெல், மக்காச்சோளம்'},
    mr: {'Brown Plant Hopper':'भात, धान','Aphids':'गहू, मोहरी','Fall Armyworm':'मका, ज्वारी','Whitefly':'कापूस, टोमॅटो','Red Spider Mite':'सोयाबीन, कापूस','Stem Borer':'भात, मका'},
    pa: {'Brown Plant Hopper':'ਝੋਨਾ, ਚਾਵਲ','Aphids':'ਕਣਕ, ਸਰੋਂ','Fall Armyworm':'ਮੱਕੀ, ਜਵਾਰ','Whitefly':'ਕਪਾਹ, ਟਮਾਟਰ','Red Spider Mite':'ਸੋਇਆਬੀਨ, ਕਪਾਹ','Stem Borer':'ਝੋਨਾ, ਮੱਕੀ'},
    bn: {'Brown Plant Hopper':'ধান','Aphids':'গম, সরিষা','Fall Armyworm':'ভুট্টা, জোয়ার','Whitefly':'তুলা, টমেটো','Red Spider Mite':'সয়াবিন, তুলা','Stem Borer':'ধান, ভুট্টা'},
    kn: {'Brown Plant Hopper':'ಭತ್ತ, ಅಕ್ಕಿ','Aphids':'ಗೋಧಿ, ಸಾಸಿವೆ','Fall Armyworm':'ಮೆಕ್ಕೆಜೋಳ, ಜ್ವಾರಿ','Whitefly':'ಹತ್ತಿ, ಟೊಮ್ಯಾಟೊ','Red Spider Mite':'ಸೋಯಾಬೀನ್, ಹತ್ತಿ','Stem Borer':'ಭತ್ತ, ಮೆಕ್ಕೆಜೋಳ'},
    ml: {'Brown Plant Hopper':'നെല്ല്, അരി','Aphids':'ഗോതമ്പ്, കടുക്','Fall Armyworm':'ചോളം, ജോവർ','Whitefly':'പഞ്ഞി, തക്കാളി','Red Spider Mite':'സോയാബീൻ, പഞ്ഞി','Stem Borer':'നെല്ല്, ചോളം'},
    gu: {'Brown Plant Hopper':'ડાંગર, ચોખા','Aphids':'ઘઉં, સરસવ','Fall Armyworm':'મકाई, જુવार','Whitefly':'કपास, ટामेटा','Red Spider Mite':'સोयाबीन, કपास','Stem Borer':'ડાંगर, मकाई'},
    or: {'Brown Plant Hopper':'ଧାନ','Aphids':'ଗହମ, ସରିଷା','Fall Armyworm':'ମକା, ଜୁଆर','Whitefly':'କପା, ଟମାଟୋ','Red Spider Mite':'ସୋୟାବିନ, କପା','Stem Borer':'ଧାନ, ମକା'},
    as: {'Brown Plant Hopper':'ধান','Aphids':'ঘেঁহু, সৰিয়হ','Fall Armyworm':'মকৈ, জোৱাৰ','Whitefly':'কপাহ, টমেটো','Red Spider Mite':'চয়াবিন, কপাহ','Stem Borer':'ধান, মকৈ'},
  };

  const activeLabel = {
    en:'Active', hi:'सक्रिय', te:'చురుకుగా ఉంది', ta:'செயலில்', mr:'सक्रिय',
    pa:'ਸਰਗਰਮ', bn:'সক্রিয়', kn:'ಸಕ್ರಿಯ', ml:'സജീവം', gu:'સક્રિય',
    or:'ସକ୍ରିୟ', as:'সক্ৰিয়',
  };
  const riskLabel = {
    en:{High:'High Risk', Medium:'Medium Risk'}, hi:{High:'अधिक जोखिम', Medium:'मध्यम जोखिम'},
    te:{High:'అధిక ప్రమాదం', Medium:'మధ్యమ ప్రమాదం'}, ta:{High:'அதிக அபாயம்', Medium:'நடுத்தர அபாயம்'},
    mr:{High:'जास्त धोका', Medium:'मध्यम धोका'}, pa:{High:'ਵੱਧ ਖ਼ਤਰਾ', Medium:'ਦਰਮਿਆਨਾ ਖ਼ਤਰਾ'},
    bn:{High:'উচ্চ ঝুঁকি', Medium:'মাঝারি ঝুঁকি'}, kn:{High:'ಹೆಚ್ಚು ಅಪಾಯ', Medium:'ಮಧ್ಯಮ ಅಪಾಯ'},
    ml:{High:'ഉയർന്ന അപകടം', Medium:'മധ്യമ അപകടം'}, gu:{High:'વધુ જોખમ', Medium:'મધ્યમ જોખમ'},
    or:{High:'ଅଧିକ ବିପଦ', Medium:'ମଧ୍ୟମ ବିପଦ'}, as:{High:'অধিক বিপদ', Medium:'মধ্যমীয়া বিপদ'},
  };

  const riskLangMap = riskLabel[currentLang] || riskLabel.en;
  const activeLangLabel = activeLabel[currentLang] || activeLabel.en;
  const cropLangMap = pestCrops[currentLang] || pestCrops.en;

  grid.innerHTML = PESTS.map((p, i) => {
    const active = highRisk && p.risk === 'High';
    return `<div class="pest-cal-card ${active ? 'current-risk' : ''}" style="animation-delay:${i*0.05}s">
      <div class="pcal-header">
        <div class="pcal-icon">${p.icon}</div>
        <div><div class="pcal-name">${getPestT(p.name)}</div><div class="pcal-season">${getPestSeason(p.season)}</div></div>
        ${active ? `<span style="font-size:0.65rem;padding:2px 8px;background:rgba(248,113,113,0.1);color:var(--red);border-radius:50px;border:1px solid rgba(248,113,113,0.2)">⚠ ${activeLangLabel}</span>` : ''}
      </div>
      <div class="pcal-body">
        <div style="font-size:0.78rem;color:var(--text-3);margin-bottom:4px">🌱 ${cropLangMap[p.name] || p.crops}</div>
        <div style="font-size:0.8rem;color:var(--text-2);margin-bottom:6px">${getPestDesc(p.name)}</div>
        <div style="font-size:0.75rem;color:var(--teal)">🛡️ ${getPestPrev(p.name)}</div>
        <span class="pcal-risk risk-${p.risk.toLowerCase()}">${riskLangMap[p.risk] || p.risk}</span>
      </div>
    </div>`;
  }).join('');
}

// ADD these translation objects at the top of alerts.js (after the existing variable declarations)

const PEST_DESCRIPTIONS = {
  en: {
    'Brown Plant Hopper': 'Feeds on rice causing hopperburn. High risk in humid conditions.',
    'Aphids': 'Suck plant sap, transmit viral diseases. Risk in mild temperatures.',
    'Fall Armyworm': 'Causes severe leaf damage. Can destroy crops within days.',
    'Whitefly': 'Transmits leaf curl virus. Multiplies in dry hot weather.',
    'Red Spider Mite': 'Causes bronzing of leaves. Severe in hot dry weather.',
    'Stem Borer': 'Bores into stems causing dead heart in vegetative stage.',
  },
  hi: {
    'Brown Plant Hopper': 'धान को नुकसान पहुंचाता है। नम परिस्थितियों में अधिक खतरा।',
    'Aphids': 'पौधे का रस चूसते हैं, वायरल रोग फैलाते हैं।',
    'Fall Armyworm': 'गंभीर पत्ती क्षति करता है। कुछ दिनों में फसल नष्ट कर सकता है।',
    'Whitefly': 'लीफ कर्ल वायरस फैलाता है। गर्म शुष्क मौसम में बढ़ता है।',
    'Red Spider Mite': 'पत्तियों पर कांसे के रंग के धब्बे। गर्म शुष्क मौसम में गंभीर।',
    'Stem Borer': 'तनों में छेद करता है, डेड हार्ट पैदा करता है।',
  },
  te: {
    'Brown Plant Hopper': 'వరిపై హాపర్‌బర్న్ కలిగిస్తుంది. తేమ వాతావరణంలో అధిక ప్రమాదం.',
    'Aphids': 'మొక్క రసం పీలుస్తాయి, వైరల్ వ్యాధులు వ్యాపిస్తాయి.',
    'Fall Armyworm': 'తీవ్రమైన ఆకు నష్టం. రోజుల్లో పంటను నాశనం చేయవచ్చు.',
    'Whitefly': 'లీఫ్ కర్ల్ వైరస్ వ్యాపిస్తుంది. వేడి పొడి వాతావరణంలో పెరుగుతుంది.',
    'Red Spider Mite': 'ఆకులు కాంస్య రంగుకు మారతాయి. వేడి పొడి వాతావరణంలో తీవ్రం.',
    'Stem Borer': 'కాండంలో చొచ్చుకుపోయి డెడ్ హార్ట్ కలిగిస్తుంది.',
  },
  ta: {
    'Brown Plant Hopper': 'நெல்லை பாதிக்கிறது. ஈர வானிலையில் அதிக அபாயம்.',
    'Aphids': 'தாவர சாறு உறிஞ்சுகின்றன, வைரஸ் நோய்கள் பரவுகின்றன.',
    'Fall Armyworm': 'கடுமையான இலை சேதம். சில நாட்களில் பயிரை அழிக்கலாம்.',
    'Whitefly': 'இலை சுருட்டு வைரஸை பரப்புகிறது. வெப்பமான வறண்ட வானிலையில் பெருகுகிறது.',
    'Red Spider Mite': 'இலைகளில் வெண்கல நிறம். வெப்பமான வறண்ட வானிலையில் தீவிரமாகும்.',
    'Stem Borer': 'தண்டுகளில் துளையிடுகிறது, இறந்த இதயம் உண்டாகிறது.',
  },
  mr: {
    'Brown Plant Hopper': 'भातावर हॉपरबर्न होतो. दमट परिस्थितीत जास्त धोका.',
    'Aphids': 'झाडाचा रस शोषतात, विषाणू रोग पसरवतात.',
    'Fall Armyworm': 'गंभीर पान नुकसान. काही दिवसांत पीक नष्ट होऊ शकते.',
    'Whitefly': 'लीफ कर्ल विषाणू पसरवतो. उष्ण कोरड्या हवामानात वाढतो.',
    'Red Spider Mite': 'पाने कांस्यरंगी होतात. उष्ण कोरड्या हवामानात गंभीर.',
    'Stem Borer': 'खोडात छिद्र पाडतो, डेड हार्ट तयार होतो.',
  },
  pa: {
    'Brown Plant Hopper': 'ਝੋਨੇ ਨੂੰ ਹੌਪਰਬਰਨ ਕਰਦਾ ਹੈ। ਨਮੀ ਵਿੱਚ ਵੱਧ ਖ਼ਤਰਾ।',
    'Aphids': 'ਪੌਦੇ ਦਾ ਰਸ ਚੂਸਦੇ ਹਨ, ਵਾਇਰਲ ਬਿਮਾਰੀਆਂ ਫੈਲਾਉਂਦੇ ਹਨ।',
    'Fall Armyworm': 'ਗੰਭੀਰ ਪੱਤਾ ਨੁਕਸਾਨ। ਕੁਝ ਦਿਨਾਂ ਵਿੱਚ ਫਸਲ ਬਰਬਾਦ ਕਰ ਸਕਦਾ।',
    'Whitefly': 'ਲੀਫ ਕਰਲ ਵਾਇਰਸ ਫੈਲਾਉਂਦਾ ਹੈ। ਗਰਮ ਸੁੱਕੇ ਮੌਸਮ ਵਿੱਚ ਵਧਦਾ।',
    'Red Spider Mite': 'ਪੱਤੇ ਕਾਂਸੀ ਰੰਗ ਦੇ ਹੁੰਦੇ ਹਨ। ਗਰਮ ਸੁੱਕੇ ਮੌਸਮ ਵਿੱਚ ਗੰਭੀਰ।',
    'Stem Borer': 'ਤਣੇ ਵਿੱਚ ਛੇਕ ਕਰਦਾ, ਡੈੱਡ ਹਾਰਟ ਬਣਾਉਂਦਾ।',
  },
  bn: {
    'Brown Plant Hopper': 'ধানে হপারবার্ন করে। আর্দ্র পরিবেশে বেশি ঝুঁকি।',
    'Aphids': 'গাছের রস শোষণ করে, ভাইরাস রোগ ছড়ায়।',
    'Fall Armyworm': 'গুরুতর পাতা ক্ষতি। কয়েক দিনে ফসল নষ্ট করতে পারে।',
    'Whitefly': 'লিফ কার্ল ভাইরাস ছড়ায়। গরম শুষ্ক আবহাওয়ায় বাড়ে।',
    'Red Spider Mite': 'পাতা ব্রোঞ্জ রঙ ধারণ করে। গরম শুষ্ক আবহাওয়ায় মারাত্মক।',
    'Stem Borer': 'কাণ্ডে ছিদ্র করে ডেড হার্ট তৈরি করে।',
  },
  kn: {
    'Brown Plant Hopper': 'ಭತ್ತಕ್ಕೆ ಹಾಪರ್‌ಬರ್ನ್ ಉಂಟುಮಾಡುತ್ತದೆ. ಆರ್ದ್ರ ವಾತಾವರಣದಲ್ಲಿ ಹೆಚ್ಚು ಅಪಾಯ.',
    'Aphids': 'ಸಸ್ಯದ ರಸ ಹೀರುತ್ತವೆ, ವೈರಲ್ ರೋಗ ಹರಡುತ್ತವೆ.',
    'Fall Armyworm': 'ತೀವ್ರ ಎಲೆ ಹಾನಿ. ಕೆಲವು ದಿನಗಳಲ್ಲಿ ಬೆಳೆ ನಾಶ ಮಾಡಬಹುದು.',
    'Whitefly': 'ಲೀಫ್ ಕರ್ಲ್ ವೈರಸ್ ಹರಡುತ್ತದೆ. ಬಿಸಿ ಶುಷ್ಕ ವಾತಾವರಣದಲ್ಲಿ ಹೆಚ್ಚಾಗುತ್ತದೆ.',
    'Red Spider Mite': 'ಎಲೆಗಳು ಕಂಚಿನ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತವೆ. ಬಿಸಿ ಶುಷ್ಕ ವಾತಾವರಣದಲ್ಲಿ ತೀವ್ರ.',
    'Stem Borer': 'ಕಾಂಡದಲ್ಲಿ ತೂರಿ ಡೆಡ್ ಹಾರ್ಟ್ ಉಂಟುಮಾಡುತ್ತದೆ.',
  },
  ml: {
    'Brown Plant Hopper': 'നെൽകൃഷിയിൽ ഹോപ്പർബേൺ ഉണ്ടാക്കുന്നു. ആർദ്ര കാലാവസ്ഥയിൽ അധിക അപകടം.',
    'Aphids': 'സസ്യത്തിന്റെ നീര് ഊറ്റിക്കുടിക്കുന്നു, വൈറൽ രോഗങ്ങൾ പരത്തുന്നു.',
    'Fall Armyworm': 'ഗുരുതരമായ ഇല നാശം. ദിവസങ്ങൾക്കുള്ളിൽ വിള നശിപ്പിക്കും.',
    'Whitefly': 'ലീഫ് കർൾ വൈറസ് പരത്തുന്നു. ചൂടുള്ള വരണ്ട കാലാവസ്ഥയിൽ വർദ്ധിക്കുന്നു.',
    'Red Spider Mite': 'ഇലകൾ വെങ്കലനിറമാകുന്നു. ചൂടുള്ള വരണ്ട കാലാവസ്ഥയിൽ ഗുരുതരം.',
    'Stem Borer': 'തണ്ടുകളിൽ തുളയ്ക്കുന്നു, ഡെഡ് ഹാർട്ട് ഉണ്ടാകുന്നു.',
  },
  gu: {
    'Brown Plant Hopper': 'ડાંગरमাં હૉપરબર્ન કરે છે. ભેજવાળા વાતાવરણમાં વધુ ખતરો.',
    'Aphids': 'છોડનો રસ ચૂસે છે, વાઇરલ રોગ ફેલાવે છે.',
    'Fall Armyworm': 'ગંભીર પાન નુકસાન. થોડા દિવસોમાં પાક નષ્ટ કરી શકે.',
    'Whitefly': 'લીફ કર્લ વાઇરસ ફેલાવે છે. ગરમ સૂકા વાતાવરણમાં વધે છે.',
    'Red Spider Mite': 'પાન કાંસ્ય રંગ ધારણ કરે. ગરમ સૂકા વાતાવરણમાં ગંભીર.',
    'Stem Borer': 'ડાળીમાં છિદ્ર પાડે, ડેડ હાર્ટ બનાવે.',
  },
  or: {
    'Brown Plant Hopper': 'ଧାନରେ ହ୍ୟୋପର୍‌ବର୍ନ ଘଟାଏ। ଆର୍ଦ୍ର ଅବସ୍ଥାରେ ଅଧିକ ବିପଦ।',
    'Aphids': 'ଗଛ ରସ ଶୋଷୁଣ କରନ୍ତି, ଭୂତାଣୁ ରୋଗ ଛড়ায়।',
    'Fall Armyworm': 'ଗୁରୁତର ପତ୍ର କ୍ଷତି। କଦ ଦିନ ଭିତରେ ଫସଲ ନଷ୍ଟ ହୋଇ ପାରେ।',
    'Whitefly': 'ଲିଫ କର୍ଲ ଭୂତାଣୁ ଛড়ায়। ଉଷ୍ଣ ଶୁଷ୍କ ପାଣିପାଗରେ ବଢ଼େ।',
    'Red Spider Mite': 'ପତ୍ର ଧାତୁ ରଙ୍ଗ ଧାରଣ କରେ। ଉଷ୍ଣ ଶୁଷ୍କ ପାଣିପାଗରେ ଗୁରୁତର।',
    'Stem Borer': 'ଡାଳରେ ଛିଦ୍ର କରି ଡେଡ ହାର୍ଟ ସୃଷ୍ଟି କରେ।',
  },
  as: {
    'Brown Plant Hopper': 'ধানত হপাৰবাৰ্ন কৰে। আর্দ্ৰ পৰিস্থিতিত অধিক বিপদ।',
    'Aphids': 'গছৰ ৰস শোষণ কৰে, ভাইৰাল ৰোগ বিয়পায়।',
    'Fall Armyworm': 'গুৰুতৰ পাত ক্ষতি। কেইদিনমানত শস্য নষ্ট কৰিব পাৰে।',
    'Whitefly': 'লিফ কাৰ্ল ভাইৰাছ বিয়পায়। গৰম শুকান বতৰত বাঢ়ে।',
    'Red Spider Mite': 'পাত ব্ৰঞ্জ ৰং ধাৰণ কৰে। গৰম শুকান বতৰত গুৰুতৰ।',
    'Stem Borer': 'কাণ্ডত বিন্ধা কৰে, ডেড হাৰ্ট তৈয়াৰ কৰে।',
  },
};

const PEST_PREVENTION = {
  en: {
    'Brown Plant Hopper': 'Use resistant varieties. Keep fields drained.',
    'Aphids': 'Neem oil spray. Release ladybird beetles.',
    'Fall Armyworm': 'Bt-based bioinsecticide spray early.',
    'Whitefly': 'Yellow sticky traps. Reflective mulch.',
    'Red Spider Mite': 'Increase irrigation. Abamectin spray.',
    'Stem Borer': 'Pheromone traps. Remove crop residues.',
  },
  hi: {
    'Brown Plant Hopper': 'प्रतिरोधी किस्में उगाएं। खेत में जल निकासी रखें।',
    'Aphids': 'नीम तेल स्प्रे। लेडीबर्ड बीटल छोड़ें।',
    'Fall Armyworm': 'Bt आधारित जैव कीटनाशक का जल्दी छिड़काव।',
    'Whitefly': 'पीले चिपचिपे जाल। परावर्तक मल्च।',
    'Red Spider Mite': 'सिंचाई बढ़ाएं। एबामेक्टिन स्प्रे।',
    'Stem Borer': 'फेरोमोन जाल। फसल अवशेष हटाएं।',
  },
  te: {
    'Brown Plant Hopper': 'నిరోధక రకాలు వాడండి. పొలంలో నీరు నిలబడకుండా చూడండి.',
    'Aphids': 'వేప నూనె స్ప్రే. లేడీబర్డ్ బీటిల్స్ వదలండి.',
    'Fall Armyworm': 'Bt ఆధారిత జీవ కీటకనాశక స్ప్రే చేయండి.',
    'Whitefly': 'పసుపు జిగురు ఉచ్చులు. పరావర్తన మల్చ్.',
    'Red Spider Mite': 'నీటి పారుదల పెంచండి. అబామెక్టిన్ స్ప్రే.',
    'Stem Borer': 'ఫెరోమోన్ ఉచ్చులు. పంట అవశేషాలు తొలగించండి.',
  },
  ta: {
    'Brown Plant Hopper': 'எதிர்ப்பு திறன் கொண்ட ரகங்கள் பயன்படுத்துங்கள். வயல் வடிகட்டுங்கள்.',
    'Aphids': 'வேப்ப எண்ணெய் தெளிப்பு. லேடிபர்ட் வண்டுகளை விடுங்கள்.',
    'Fall Armyworm': 'Bt அடிப்படை உயிரி பூச்சிக்கொல்லி தெளிக்கவும்.',
    'Whitefly': 'மஞ்சள் ஒட்டும் கண்ணி. பிரதிபலிப்பு மல்ச்.',
    'Red Spider Mite': 'நீர்ப்பாசனம் அதிகரிக்கவும். அபாமெக்டின் தெளிப்பு.',
    'Stem Borer': 'ஃபெரோமோன் கண்ணிகள். பயிர் எச்சங்கள் அகற்றவும்.',
  },
  mr: {
    'Brown Plant Hopper': 'प्रतिकारक वाण वापरा. शेताचा निचरा ठेवा.',
    'Aphids': 'कडुलिंब तेल फवारणी. लेडीबर्ड बीटल सोडा.',
    'Fall Armyworm': 'Bt आधारित जैव कीटकनाशक लवकर फवारा.',
    'Whitefly': 'पिवळे चिकट सापळे. परावर्तक पालापाचोळा.',
    'Red Spider Mite': 'सिंचन वाढवा. अॅबामेक्टिन फवारणी.',
    'Stem Borer': 'फेरोमोन सापळे. पीक अवशेष काढा.',
  },
  pa: {
    'Brown Plant Hopper': 'ਰੋਧਕ ਕਿਸਮਾਂ ਉਗਾਓ। ਖੇਤ ਵਿੱਚ ਨਿਕਾਸੀ ਰੱਖੋ।',
    'Aphids': 'ਨਿੰਮ ਤੇਲ ਛਿੜਕਾਅ। ਲੇਡੀਬਰਡ ਬੀਟਲ ਛੱਡੋ।',
    'Fall Armyworm': 'Bt ਅਧਾਰਿਤ ਜੀਵ ਕੀਟਨਾਸ਼ਕ ਦਾ ਜਲਦੀ ਛਿੜਕਾਅ।',
    'Whitefly': 'ਪੀਲੇ ਚਿਪਚਿਪੇ ਜਾਲ। ਪ੍ਰਤੀਬਿੰਬੀ ਮਲਚ।',
    'Red Spider Mite': 'ਸਿੰਚਾਈ ਵਧਾਓ। ਐਬਾਮੈਕਟਿਨ ਛਿੜਕਾਅ।',
    'Stem Borer': 'ਫੇਰੋਮੋਨ ਜਾਲ। ਫਸਲ ਅਵਸ਼ੇਸ਼ ਹਟਾਓ।',
  },
  bn: {
    'Brown Plant Hopper': 'প্রতিরোধী জাত ব্যবহার করুন। মাঠে পানি নিষ্কাশন রাখুন।',
    'Aphids': 'নিম তেল স্প্রে। লেডিবার্ড বিটল ছাড়ুন।',
    'Fall Armyworm': 'Bt ভিত্তিক জৈব কীটনাশক তাড়াতাড়ি স্প্রে করুন।',
    'Whitefly': 'হলুদ আঠালো ফাঁদ। প্রতিফলনশীল মালচ।',
    'Red Spider Mite': 'সেচ বাড়ান। অ্যাবামেক্টিন স্প্রে।',
    'Stem Borer': 'ফেরোমোন ফাঁদ। ফসলের অবশিষ্ট সরান।',
  },
  kn: {
    'Brown Plant Hopper': 'ನಿರೋಧಕ ತಳಿಗಳನ್ನು ಬಳಸಿ. ಹೊಲದಲ್ಲಿ ನೀರು ಬಸಿಯಲು ಅನುಮತಿ ನೀಡಿ.',
    'Aphids': 'ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ಲೇಡಿಬರ್ಡ್ ಬೀಟಲ್ ಬಿಡಿ.',
    'Fall Armyworm': 'Bt ಆಧಾರಿತ ಜೈವಿಕ ಕೀಟನಾಶಕ ಮೊದಲೇ ಸಿಂಪಡಿಸಿ.',
    'Whitefly': 'ಹಳದಿ ಅಂಟು ಬಲೆ. ಪ್ರತಿಫಲನ ಮಲ್ಚ್.',
    'Red Spider Mite': 'ನೀರಾವರಿ ಹೆಚ್ಚಿಸಿ. ಅಬಾಮೆಕ್ಟಿನ್ ಸಿಂಪಡಿಸಿ.',
    'Stem Borer': 'ಫೆರೊಮೋನ್ ಬಲೆ. ಬೆಳೆ ತ್ಯಾಜ್ಯ ತೆಗೆದುಹಾಕಿ.',
  },
  ml: {
    'Brown Plant Hopper': 'പ്രതിരോധ ഇനങ്ങൾ ഉപയോഗിക്കുക. വയലിൽ നല്ല ഡ്രെയ്‌നേജ് ഉറപ്പാക്കുക.',
    'Aphids': 'വേപ്പ് എണ്ണ സ്പ്രേ. ലേഡിബേർഡ് ബീറ്റിൽ വിടുക.',
    'Fall Armyworm': 'Bt അടിസ്ഥാന ജൈവ കീടനാശിനി നേരത്തെ സ്പ്രേ ചെയ്യുക.',
    'Whitefly': 'മഞ്ഞ ഒട്ടുകെണി. പ്രതിഫലന മൾച്ച്.',
    'Red Spider Mite': 'ജലസേചനം വർദ്ധിപ്പിക്കുക. അബമെക്ടിൻ സ്പ്രേ.',
    'Stem Borer': 'ഫെറോമോൺ കെണി. വിള അവശിഷ്ടങ്ങൾ നീക്കം ചെയ്യുക.',
  },
  gu: {
    'Brown Plant Hopper': 'પ્રતિરોધક જાતો ઉગાડો. ખેતરમાં નિકાલ રાખો.',
    'Aphids': 'લીમડાના તેલનો છંટકાવ. લેડીબર્ડ ભૃંગ છોડો.',
    'Fall Armyworm': 'Bt આધારિત જૈવ જંતુનાશક વહેલો છાંટો.',
    'Whitefly': 'પીળા ચીકટ ઉપકરણ. પ્રતિવર્તી પલ્ચ.',
    'Red Spider Mite': 'સિંચાઈ વધારો. એબામેક્ટિન છંટકાવ.',
    'Stem Borer': 'ફેરોમોન ઉપકરણ. પાક અવશેષ દૂર કરો.',
  },
  or: {
    'Brown Plant Hopper': 'ପ୍ରତିରୋଧୀ ଜାତ ବ୍ୟବହାର କରନ୍ତୁ। ଜମିରେ ଜଳ ନିଷ୍କାସନ ରଖନ୍ତୁ।',
    'Aphids': 'ନିମ ତେଲ ସ୍ପ୍ରେ। ଲେଡ଼ିବର୍ଡ ପୋକ ଛାଡ଼ନ୍ତୁ।',
    'Fall Armyworm': 'Bt ଭିତ୍ତିକ ଜୀବ କୀଟନାଶକ ଶୀଘ୍ର ସ୍ପ୍ରେ।',
    'Whitefly': 'ହଳଦିଆ ଆଠୁଆ ଫାଦ। ପ୍ରତିଫଳିତ ମଲ୍ଚ।',
    'Red Spider Mite': 'ଜଳ ସେଚ ବଢ଼ାନ୍ତୁ। ଅ୍ୟାବାମେକ୍ଟିନ ସ୍ପ୍ରେ।',
    'Stem Borer': 'ଫେରୋମୋନ ଫାଦ। ଫସଲ ଅବଶିଷ୍ଟ ସଫା କରନ୍ତୁ।',
  },
  as: {
    'Brown Plant Hopper': 'প্ৰতিৰোধী জাত ব্যৱহাৰ কৰক। পথাৰত পানী নিষ্কাশন ৰাখক।',
    'Aphids': 'নিম তেল স্প্ৰে। লেডিবাৰ্ড পোকা এৰক।',
    'Fall Armyworm': 'Bt ভিত্তিক জৈৱ কীটনাশক সোনকালে স্প্ৰে কৰক।',
    'Whitefly': 'হালধীয়া আঠা ফান্দ। প্ৰতিফলনশীল মালচ।',
    'Red Spider Mite': 'জলসিঞ্চন বঢ়াওক। এবামেক্টিন স্প্ৰে।',
    'Stem Borer': 'ফেৰোমোন ফান্দ। শস্যৰ অৱশেষ আঁতৰাওক।',
  },
};

const PEST_SEASONS = {
  en: {'Kharif (Jun–Oct)':'Kharif (Jun–Oct)','Rabi (Nov–Feb)':'Rabi (Nov–Feb)','Kharif (Jul–Sep)':'Kharif (Jul–Sep)','Year-round':'Year-round','Zaid (Mar–May)':'Zaid (Mar–May)','Kharif (Jun–Sep)':'Kharif (Jun–Sep)'},
  hi: {'Kharif (Jun–Oct)':'खरीफ (जून–अक्टूबर)','Rabi (Nov–Feb)':'रबी (नवंबर–फरवरी)','Kharif (Jul–Sep)':'खरीफ (जुलाई–सितंबर)','Year-round':'साल भर','Zaid (Mar–May)':'जायद (मार्च–मई)','Kharif (Jun–Sep)':'खरीफ (जून–सितंबर)'},
  te: {'Kharif (Jun–Oct)':'ఖరీఫ్ (జూన్–అక్టో)','Rabi (Nov–Feb)':'రబీ (నవంబర్–ఫిబ్రవరి)','Kharif (Jul–Sep)':'ఖరీఫ్ (జులై–సెప్టెంబర్)','Year-round':'ఏడాది పొడవునా','Zaid (Mar–May)':'జాయిద్ (మార్చి–మే)','Kharif (Jun–Sep)':'ఖరీఫ్ (జూన్–సెప్టెంబర్)'},
  ta: {'Kharif (Jun–Oct)':'கரீஃப் (ஜூன்–அக்.)', 'Rabi (Nov–Feb)':'ராபி (நவ்–பிப்)','Kharif (Jul–Sep)':'கரீஃப் (ஜூலை–செப்)','Year-round':'ஆண்டு முழுவதும்','Zaid (Mar–May)':'ஜாய்த் (மார்–மே)','Kharif (Jun–Sep)':'கரீஃப் (ஜூன்–செப்)'},
  mr: {'Kharif (Jun–Oct)':'खरीप (जून–ऑक्टो)','Rabi (Nov–Feb)':'रब्बी (नोव्हें–फेब्रु)','Kharif (Jul–Sep)':'खरीप (जुलै–सप्टें)','Year-round':'वर्षभर','Zaid (Mar–May)':'उन्हाळी (मार्च–मे)','Kharif (Jun–Sep)':'खरीप (जून–सप्टें)'},
  pa: {'Kharif (Jun–Oct)':'ਖਰੀਫ (ਜੂਨ–ਅਕਤੂ)','Rabi (Nov–Feb)':'ਰਬੀ (ਨਵੰ–ਫਰਵ)','Kharif (Jul–Sep)':'ਖਰੀਫ (ਜੁਲਾ–ਸਤੰ)','Year-round':'ਸਾਲ ਭਰ','Zaid (Mar–May)':'ਜ਼ਾਇਦ (ਮਾਰਚ–ਮਈ)','Kharif (Jun–Sep)':'ਖਰੀਫ (ਜੂਨ–ਸਤੰ)'},
  bn: {'Kharif (Jun–Oct)':'খরিফ (জুন–অক্টো)','Rabi (Nov–Feb)':'রবি (নভেম্বর–ফেব্রু)','Kharif (Jul–Sep)':'খরিফ (জুলাই–সেপ্টে)','Year-round':'সারা বছর','Zaid (Mar–May)':'জায়েদ (মার্চ–মে)','Kharif (Jun–Sep)':'খরিফ (জুন–সেপ্টে)'},
  kn: {'Kharif (Jun–Oct)':'ಖಾರಿಫ್ (ಜೂನ್–ಅಕ್ಟೋ)','Rabi (Nov–Feb)':'ರಬಿ (ನವ–ಫೆಬ್)','Kharif (Jul–Sep)':'ಖಾರಿಫ್ (ಜುಲೈ–ಸೆಪ್ಟೆ)','Year-round':'ವರ್ಷಪೂರ್ತಿ','Zaid (Mar–May)':'ಜಾಯಿದ್ (ಮಾರ್ಚ್–ಮೇ)','Kharif (Jun–Sep)':'ಖಾರಿಫ್ (ಜೂನ್–ಸೆಪ್ಟೆ)'},
  ml: {'Kharif (Jun–Oct)':'ഖരീഫ് (ജൂൺ–ഒക്ടോ)','Rabi (Nov–Feb)':'റബി (നവ–ഫെബ്)','Kharif (Jul–Sep)':'ഖരീഫ് (ജൂലൈ–സെപ്)','Year-round':'വർഷം മുഴുവൻ','Zaid (Mar–May)':'സൈദ് (മാർ–മേ)','Kharif (Jun–Sep)':'ഖരീഫ് (ജൂൺ–സെപ്)'},
  gu: {'Kharif (Jun–Oct)':'ખરીફ (જૂન–ઓક્ટો)','Rabi (Nov–Feb)':'રવિ (નવ–ફેબ)','Kharif (Jul–Sep)':'ખરીફ (જુલા–સપ્ટે)','Year-round':'વર્ષભर','Zaid (Mar–May)':'ઝાઇદ (માર્ચ–મે)','Kharif (Jun–Sep)':'ખરીફ (જૂન–સપ્ટે)'},
  or: {'Kharif (Jun–Oct)':'ଖରିଫ (ଜୁନ–ଅକ୍ଟୋ)','Rabi (Nov–Feb)':'ରବି (ନଭ–ଫେବ)','Kharif (Jul–Sep)':'ଖରିଫ (ଜୁଲାଇ–ସେପ୍)','Year-round':'ସାରା ବର୍ଷ','Zaid (Mar–May)':'ଯାଇଦ (ମାର୍ଚ–ମଇ)','Kharif (Jun–Sep)':'ଖରିଫ (ଜୁନ–ସେପ୍)'},
  as: {'Kharif (Jun–Oct)':'খাৰিফ (জুন–অক্টো)','Rabi (Nov–Feb)':'ৰবি (নভ–ফেব)','Kharif (Jul–Sep)':'খাৰিফ (জুলাই–ছেপ্টে)','Year-round':'বছৰজুৰি','Zaid (Mar–May)':'জায়েদ (মাৰ্চ–মে)','Kharif (Jun–Sep)':'খাৰিফ (জুন–ছেপ্টে)'},
};

function getPestDesc(name) {
  return (PEST_DESCRIPTIONS[currentLang] || PEST_DESCRIPTIONS.en)[name] || PEST_DESCRIPTIONS.en[name] || '';
}
function getPestPrev(name) {
  return (PEST_PREVENTION[currentLang] || PEST_PREVENTION.en)[name] || PEST_PREVENTION.en[name] || '';
}
function getPestSeason(season) {
  return (PEST_SEASONS[currentLang] || PEST_SEASONS.en)[season] || season;
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

function renderHarmfulSafe(weather) {
  const section  = document.getElementById('harmfulSection');
  const harmGrid = document.getElementById('harmfulGrid');
  const safeGrid = document.getElementById('safeGrid');
  if (!section || !harmGrid || !safeGrid) return;
  section.style.display = '';

  const { temp, humidity } = weather;
  const harmful = [], safe = [];

  // Translated reason strings
  const reasonT = {
    too_cold: {
      en:'Too cold', hi:'बहुत ठंडा', te:'చాలా చల్లగా', ta:'மிகவும் குளிர்',
      mr:'खूप थंड', pa:'ਬਹੁਤ ਠੰਡਾ', bn:'অনেক ঠান্ডা', kn:'ತುಂಬಾ ತಂಪು',
      ml:'വളരെ തണുക്കുന്നു', gu:'ખૂબ ઠंडó', or:'ଅତ୍ୟଧିକ ଥଣ୍ଡା', as:'অতি ঠাণ্ডা',
    },
    too_hot: {
      en:'Too hot', hi:'बहुत गर्म', te:'చాలా వేడి', ta:'மிகவும் வெப்பம்',
      mr:'खूप गरम', pa:'ਬਹੁਤ ਗਰਮ', bn:'অনেক গরম', kn:'ತುಂಬಾ ಬಿಸಿ',
      ml:'വളരെ ചൂടാണ്', gu:'ખૂબ ગরम', or:'ଅତ୍ୟଧିକ ଗରମ', as:'অতি গৰম',
    },
    low_humidity: {
      en:'Low humidity', hi:'कम नमी', te:'తక్కువ తేమ', ta:'குறைந்த ஈரப்பதம்',
      mr:'कमी आर्द्रता', pa:'ਘੱਟ ਨਮੀ', bn:'কম আর্দ্রতা', kn:'ಕಡಿಮೆ ಆರ್ದ್ರತೆ',
      ml:'കുറഞ്ഞ ആർദ്രത', gu:'ઓछо ভেজ', or:'କମ ଆର୍ଦ୍ରତା', as:'কম আর্দ্রতা',
    },
    need_min: {
      en:'need', hi:'चाहिए', te:'కావాలి', ta:'தேவை',
      mr:'हवे', pa:'ਚਾਹੀਦਾ', bn:'দরকার', kn:'ಬೇಕು',
      ml:'വേണം', gu:'જોઈए', or:'ଦରକାର', as:'লাগে',
    },
    max: {
      en:'max', hi:'अधिकतम', te:'గరిష్ఠం', ta:'அதிகபட்சம்',
      mr:'कमाल', pa:'ਵੱਧ ਤੋਂ ਵੱਧ', bn:'সর্বোচ্চ', kn:'ಗರಿಷ್ಠ',
      ml:'പരമാവധി', gu:'મહत्तम', or:'ସର୍ବୋଚ୍ଚ', as:'সৰ্বোচ্চ',
    },
  };

  const riskyLabel = {
    en:'Risky', hi:'जोखिम', te:'ప్రమాదకరం', ta:'ஆபத்தான',
    mr:'जोखीम', pa:'ਜੋਖਮ', bn:'ঝুঁকিপূর্ণ', kn:'ಅಪಾಯಕಾರಿ',
    ml:'അപകടകരം', gu:'જોखिम', or:'ବିପଦଜ', as:'বিপজ্জনক',
  };
  const safeLabel = {
    en:'Safe', hi:'सुरक्षित', te:'సురక్షితం', ta:'பாதுகாப்பான',
    mr:'सुरक्षित', pa:'ਸੁਰੱਖਿਅਤ', bn:'নিরাপদ', kn:'ಸುರಕ್ಷಿತ',
    ml:'സുരക്ഷിതം', gu:'સुरक्षित', or:'ସୁରକ୍ଷିତ', as:'সুৰক্ষিত',
  };
  const goodForLabel = {
    en:'Good for', hi:'के लिए उपयुक्त', te:'కు అనుకూలం', ta:'க்கு ஏற்றது',
    mr:'साठी योग्य', pa:'ਲਈ ਢੁਕਵਾਂ', bn:'এর জন্য উপযুক্ত', kn:'ಗೆ ಸೂಕ್ತ',
    ml:'ന് അനുകൂലം', gu:'માટे ઉपयुक्त', or:'ପାଇଁ ଉପଯୁକ୍ତ', as:'ৰ বাবে উপযুক্ত',
  };
  const noRiskyLabel = {
    en:'No risky crops found.', hi:'कोई जोखिम वाली फसल नहीं।', te:'ప్రమాదకరమైన పంటలు కనుగొనబడలేదు।',
    ta:'ஆபத்தான பயிர்கள் இல்லை.', mr:'जोखीम असलेले पीक नाही.', pa:'ਕੋਈ ਜੋਖਮ ਵਾਲੀ ਫਸਲ ਨਹੀਂ।',
    bn:'কোনো ঝুঁকিপূর্ণ ফসল পাওয়া যায়নি।', kn:'ಅಪಾಯಕಾರಿ ಬೆಳೆಗಳು ಇಲ್ಲ.',
    ml:'അപകടകരമായ വിളകൾ ഇല്ല.', gu:'કোઈ જોखिम ਵਾળो पाक मळ्यो नथी.',
    or:'କୌଣସି ବିପଦଜ ଫସଲ ନାହିଁ।', as:'কোনো বিপজ্জনক শস্য পোৱা নগ'ল।',
  };
  const noSafeLabel = {
    en:'No fully safe crops found.', hi:'कोई पूरी तरह सुरक्षित फसल नहीं।',
    te:'పూర్తిగా సురక్షితమైన పంటలు కనుగొనబడలేదు।', ta:'பாதுகாப்பான பயிர்கள் இல்லை.',
    mr:'कोणतेही पूर्णपणे सुरक्षित पीक नाही.', pa:'ਕੋਈ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਫਸਲ ਨਹੀਂ।',
    bn:'কোনো সম্পূর্ণ নিরাপদ ফসল পাওয়া যায়নি।', kn:'ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ ಬೆಳೆಗಳು ಇಲ್ಲ.',
    ml:'പൂർണ്ണ സുരക്ഷിതമായ വിളകൾ ഇല്ല.', gu:'કોઈ સંपૂর્ण સুরक्षित पाक मळ्यो नथी.',
    or:'କୌଣସି ସଂପୂର୍ଣ ସୁରକ୍ଷିତ ଫସଲ ନାହିଁ।', as:'কোনো সম্পূৰ্ণ সুৰক্ষিত শস্য পোৱা নগ'ল।',
  };

  const r = (key) => (reasonT[key] || {})[currentLang] || (reasonT[key] || {}).en || key;

  ALL_CROPS.forEach(crop => {
    const tok = temp >= crop.minTemp && temp <= crop.maxTemp;
    const hok = humidity >= crop.minHumidity;
    if (!tok || !hok) {
      const reasons = [];
      if (temp < crop.minTemp) reasons.push(`${r('too_cold')} (${r('need_min')} ${crop.minTemp}°C+)`);
      if (temp > crop.maxTemp) reasons.push(`${r('too_hot')} (${r('max')} ${crop.maxTemp}°C)`);
      if (humidity < crop.minHumidity) reasons.push(`${r('low_humidity')} (${r('need_min')} ${crop.minHumidity}%+)`);
      harmful.push({ ...crop, reasons });
    } else {
      safe.push(crop);
    }
  });

  const rl = riskyLabel[currentLang] || riskyLabel.en;
  const sl = safeLabel[currentLang] || safeLabel.en;
  const gfl = goodForLabel[currentLang] || goodForLabel.en;

  harmGrid.innerHTML = harmful.length
    ? harmful.map(c => `<div class="harmful-card">
        <div class="hsc-name">
          <span style="font-size:1.5rem">${c.icon}</span>
          ${getCropName(c.name)}
          <span style="margin-left:auto;font-size:0.7rem;padding:2px 8px;background:rgba(248,113,113,0.1);color:var(--red);border-radius:50px">⚠ ${rl}</span>
        </div>
        <div class="hsc-reason">${c.reasons.map(reason => `<div><i class="fas fa-xmark" style="color:var(--red);margin-right:4px"></i>${reason}</div>`).join('')}</div>
      </div>`).join('')
    : `<p style="color:var(--text-3)">${noRiskyLabel[currentLang] || noRiskyLabel.en}</p>`;

  safeGrid.innerHTML = safe.length
    ? safe.map(c => `<div class="safe-card">
        <div class="hsc-name">
          <span style="font-size:1.5rem">${c.icon}</span>
          ${getCropName(c.name)}
          <span style="margin-left:auto;font-size:0.7rem;padding:2px 8px;background:rgba(74,222,128,0.1);color:var(--green);border-radius:50px">✓ ${sl}</span>
        </div>
        <div style="font-size:0.78rem;color:var(--text-2);margin-top:4px">${gfl} ${temp}°C, ${humidity}%</div>
      </div>`).join('')
    : `<p style="color:var(--text-3)">${noSafeLabel[currentLang] || noSafeLabel.en}</p>`;
}
