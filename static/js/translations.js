const LANGUAGES = [
  {code:'en',  name:'English',            flag:'🇬🇧', label:'EN'},
  {code:'hi',  name:'हिन्दी (Hindi)',       flag:'🇮🇳', label:'HI'},
  {code:'bn',  name:'বাংলা (Bengali)',      flag:'🇮🇳', label:'BN'},
  {code:'ta',  name:'தமிழ் (Tamil)',        flag:'🇮🇳', label:'TA'},
  {code:'te',  name:'తెలుగు (Telugu)',      flag:'🇮🇳', label:'TE'},
  {code:'mr',  name:'मराठी (Marathi)',      flag:'🇮🇳', label:'MR'},
  {code:'pa',  name:'ਪੰਜਾਬੀ (Punjabi)',    flag:'🇮🇳', label:'PA'},
  {code:'gu',  name:'ગુજરાતી (Gujarati)',  flag:'🇮🇳', label:'GU'},
  {code:'kn',  name:'ಕನ್ನಡ (Kannada)',     flag:'🇮🇳', label:'KN'},
  {code:'ml',  name:'മലയാളം (Malayalam)', flag:'🇮🇳', label:'ML'},
];

const T = {
  en: {
    nav_home:'Home',
    nav_diagnose:'Diagnose',
    nav_market:'Mandi Prices',
    nav_alerts:'Alerts',
    hero_title:'Smart Farming Intelligence',
    hero_sub:'Weather · Crops · Disease · Market Prices',
    hero_badge:'AI Powered Farming',
    btn_location:'Get My Location',
    btn_diagnose:'Diagnose Crop',
    quick_diagnose_title:'Diagnose Crop Disease',
    quick_diagnose_sub:'Take a photo — AI finds disease instantly',
    quick_market_title:'Today\'s Mandi Prices',
    quick_market_sub:'15 crops across 20 cities with MSP',
    quick_alerts_title:'Weather Alerts',
    quick_alerts_sub:'Pest and weather warnings for your area',
    weather_title:'Current Weather',
    weather_sub:'Live data from your location',
    forecast_title:'6-Day Forecast',
    rain_title:'Will It Rain Today?',
    rain_sub:'Simple rain forecast for today and tomorrow',
    crops_title:'Best Crops for You',
    pest_title:'Pest Control Guide',
    pest_sub:'Safe and effective crop protection',
    footer_text:'Helping India\'s farmers with AI',
    footer_copy:'© 2025 SmartAgro. Made for Indian farmers.',
    diagnose_hero_title:'Crop Disease Detector',
    diagnose_hero_sub:'Take a photo of your sick crop — AI tells you what\'s wrong',
    upload_title:'Drop crop photo here',
    upload_sub:'JPG, PNG, WEBP — max 10 MB',
    btn_upload:'Upload Photo',
    btn_camera:'Take Photo',
    btn_analyze:'Analyze Crop',
    tips_title:'Tips for Best Results',
    tip1:'Focus on the most affected leaf or stem',
    tip2:'Use daylight — avoid dark photos',
    tip3:'Get close — 30 to 50 cm distance',
    tip4:'Include both healthy and sick parts',
    results_placeholder_title:'Upload a photo to start',
    results_placeholder_sub:'AI will identify disease and suggest treatment',
    step1_title:'Take a Photo',
    step1_sub:'Click a clear photo of affected crop',
    step2_title:'AI Checks It',
    step2_sub:'Kindwise plant AI finds the exact disease',
    step3_title:'Get Treatment',
    step3_sub:'Receive organic and chemical treatment options',
    market_hero_title:'Mandi Prices Today',
    market_hero_sub:'15 crops across 20 Indian cities with MSP comparison',
    search_placeholder:'Search city (Delhi, Patna, Mumbai...)',
    btn_search:'Search',
    filter_all:'All',
    filter_high:'High Demand',
    filter_rising:'Rising',
    filter_falling:'Falling',
    market_title:'Prices by City',
    market_sub:'All major Indian markets',
    chart_title:'Price Trend',
    chart_sub:'30-day price movement',
    table_title:'Price Comparison',
    table_sub:'₹/quintal across cities',
    alerts_hero_title:'Farm Alert Center',
    alerts_hero_sub:'Weather warnings, pest alerts and crop safety',
    location_title:'Allow Location for Alerts',
    location_sub:'We need your location to show alerts for your area',
    btn_location_enable:'Enable Location',
    filter_all_alerts:'All',
    filter_danger:'Critical',
    filter_warning:'Warnings',
    filter_advisory:'Advisory',
    filter_weather:'Weather',
    filter_pest:'Pest',
    no_alerts_title:'All Clear! No Active Alerts',
    no_alerts_sub:'Weather is good for farming in your area',
    pest_calendar_title:'Seasonal Pest Calendar',
    pest_calendar_sub:'Pests active this season',
    harmful_title:'Risky Crops Right Now',
    harmful_sub:'Avoid growing these in current weather',
    safe_title:'Safe to Grow Now',
    safe_sub:'These crops suit current weather',
    chatbot_title:'Kisan Helper',
    chatbot_sub:'Ask in any language',
    chat_placeholder:'Type or speak...',
    helpline:'Kisan Helpline',
    stat_temp:'Temperature',
    stat_humidity:'Humidity',
    stat_wind:'Wind',
    stat_visibility:'Visibility',
    stat_pressure:'Pressure',
  },
  hi: {
    nav_home:'होम',
    nav_diagnose:'फसल जांच',
    nav_market:'मंडी भाव',
    nav_alerts:'अलर्ट',
    hero_title:'स्मार्ट खेती सहायक',
    hero_sub:'मौसम · फसल · रोग · मंडी भाव',
    hero_badge:'AI से खेती मदद',
    btn_location:'मेरी लोकेशन लें',
    btn_diagnose:'फसल जांचें',
    quick_diagnose_title:'फसल बीमारी जांचें',
    quick_diagnose_sub:'फोटो लो — AI तुरंत बीमारी बताएगा',
    quick_market_title:'आज के मंडी भाव',
    quick_market_sub:'15 फसल, 20 शहर — MSP के साथ',
    quick_alerts_title:'मौसम अलर्ट',
    quick_alerts_sub:'कीड़े और मौसम की चेतावनी',
    weather_title:'अभी का मौसम',
    weather_sub:'आपकी जगह का लाइव मौसम',
    forecast_title:'अगले 6 दिन का मौसम',
    rain_title:'क्या आज बारिश होगी?',
    rain_sub:'आज और कल का बारिश अनुमान',
    crops_title:'आपके लिए बेस्ट फसल',
    pest_title:'कीड़ों से फसल बचाओ',
    pest_sub:'सुरक्षित और असरदार फसल सुरक्षा',
    footer_text:'India के किसानों की AI से मदद',
    footer_copy:'© 2025 SmartAgro. किसानों के लिए बनाया गया।',
    diagnose_hero_title:'फसल बीमारी डिटेक्टर',
    diagnose_hero_sub:'बीमार फसल की फोटो लो — AI बताएगा क्या गड़बड़ है',
    upload_title:'फसल की फोटो यहाँ डालें',
    upload_sub:'JPG, PNG, WEBP — max 10 MB',
    btn_upload:'फोटो अपलोड',
    btn_camera:'फोटो लो',
    btn_analyze:'फसल जांचें',
    tips_title:'अच्छी फोटो के टिप्स',
    tip1:'सबसे ज्यादा बीमार पत्ती या तना दिखाएं',
    tip2:'धूप में फोटो लें — अंधेरे में नहीं',
    tip3:'करीब से लो — 30-50 cm की दूरी',
    tip4:'ठीक और बीमार दोनों हिस्से दिखाएं',
    results_placeholder_title:'फोटो अपलोड करें शुरू करने के लिए',
    results_placeholder_sub:'AI बीमारी ढूंढ कर इलाज बताएगा',
    step1_title:'फोटो लो',
    step1_sub:'बीमार फसल की साफ फोटो लो',
    step2_title:'AI जांच करता है',
    step2_sub:'Kindwise AI फोटो से सही बीमारी ढूंढता है',
    step3_title:'इलाज पाएं',
    step3_sub:'जैविक और रासायनिक दोनों इलाज मिलेंगे',
    market_hero_title:'आज के मंडी भाव',
    market_hero_sub:'15 फसल के भाव, 20 शहर में — MSP से तुलना',
    search_placeholder:'शहर खोजें (Delhi, Patna, Mumbai...)',
    btn_search:'खोजें',
    filter_all:'सब',
    filter_high:'ज्यादा माँग',
    filter_rising:'भाव बढ़ रहा',
    filter_falling:'भाव गिर रहा',
    market_title:'शहर के हिसाब से भाव',
    market_sub:'सभी बड़े Indian मंडियों के भाव',
    chart_title:'भाव का ग्राफ',
    chart_sub:'30 दिन का price movement',
    table_title:'भाव तुलना टेबल',
    table_sub:'₹/quintal — अलग-अलग शहर में',
    alerts_hero_title:'Farm Alert Center',
    alerts_hero_sub:'मौसम चेतावनी, कीड़े अलर्ट और फसल सुरक्षा',
    location_title:'Alerts के लिए Location चाहिए',
    location_sub:'आपके इलाके के मौसम और कीड़े alerts दिखाने के लिए',
    btn_location_enable:'Location दें',
    filter_all_alerts:'सब',
    filter_danger:'खतरे',
    filter_warning:'चेतावनी',
    filter_advisory:'सलाह',
    filter_weather:'मौसम',
    filter_pest:'कीड़े',
    no_alerts_title:'सब ठीक है! कोई Alert नहीं',
    no_alerts_sub:'आपके इलाके में खेती के लिए मौसम अच्छा है',
    pest_calendar_title:'मौसमी कीड़े Calendar',
    pest_calendar_sub:'इस season में कौन से कीड़े active हैं',
    harmful_title:'अभी जोखिम वाली फसलें',
    harmful_sub:'अभी के मौसम में ये फसलें मत उगाएं',
    safe_title:'अभी उगाने के लिए Safe फसलें',
    safe_sub:'ये फसलें आपके मौसम के लिए ठीक हैं',
    chatbot_title:'किसान सहायक',
    chatbot_sub:'किसी भी भाषा में पूछें',
    chat_placeholder:'लिखें या बोलें...',
    helpline:'किसान हेल्पलाइन',
    stat_temp:'तापमान',
    stat_humidity:'आर्द्रता',
    stat_wind:'हवा',
    stat_visibility:'दृश्यता',
    stat_pressure:'दबाव',
  },
  bn: {
    nav_home:'হোম', nav_diagnose:'ফসল নির্ণয়', nav_market:'বাজার মূল্য', nav_alerts:'সতর্কতা',
    hero_title:'স্মার্ট কৃষি সহায়তা', hero_sub:'আবহাওয়া · ফসল · রোগ · বাজার',
    btn_location:'আমার অবস্থান', chatbot_title:'কিসান সহায়ক', chatbot_sub:'যেকোনো ভাষায় জিজ্ঞাসা করুন',
    chat_placeholder:'টাইপ করুন বা বলুন...',
  },
  ta: {
    nav_home:'முகப்பு', nav_diagnose:'பயிர் நோய்', nav_market:'சந்தை விலை', nav_alerts:'எச்சரிக்கை',
    hero_title:'ஸ்மார்ட் விவசாய உதவி', hero_sub:'வானிலை · பயிர் · நோய் · சந்தை',
    btn_location:'என் இடம்', chatbot_title:'கிசான் உதவியாளர்', chatbot_sub:'எந்த மொழியிலும் கேளுங்கள்',
    chat_placeholder:'தட்டச்சு செய்யுங்கள் அல்லது பேசுங்கள்...',
  },
  te: {
    nav_home:'హోమ్', nav_diagnose:'పంట నిర్ధారణ', nav_market:'మార్కెట్ ధరలు', nav_alerts:'హెచ్చరికలు',
    hero_title:'స్మార్ట్ వ్యవసాయ సహాయం', hero_sub:'వాతావరణం · పంట · రోగం · మార్కెట్',
    btn_location:'నా స్థానం', chatbot_title:'కిసాన్ సహాయకుడు', chatbot_sub:'ఏ భాషలోనైనా అడగండి',
    chat_placeholder:'టైప్ చేయండి లేదా మాట్లాడండి...',
  },
  mr: {
    nav_home:'होम', nav_diagnose:'पीक निदान', nav_market:'बाजारभाव', nav_alerts:'सतर्कता',
    hero_title:'स्मार्ट शेती मदत', hero_sub:'हवामान · पीक · रोग · बाजार',
    btn_location:'माझे स्थान', chatbot_title:'किसान मदतनीस', chatbot_sub:'कोणत्याही भाषेत विचारा',
    chat_placeholder:'लिहा किंवा बोला...',
  },
  pa: {
    nav_home:'ਹੋਮ', nav_diagnose:'ਫਸਲ ਜਾਂਚ', nav_market:'ਮੰਡੀ ਭਾਅ', nav_alerts:'ਚੇਤਾਵਨੀ',
    hero_title:'ਸਮਾਰਟ ਖੇਤੀ ਮਦਦ', hero_sub:'ਮੌਸਮ · ਫਸਲ · ਰੋਗ · ਮੰਡੀ',
    btn_location:'ਮੇਰੀ ਲੋਕੇਸ਼ਨ', chatbot_title:'ਕਿਸਾਨ ਸਹਾਇਕ', chatbot_sub:'ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੁੱਛੋ',
    chat_placeholder:'ਲਿਖੋ ਜਾਂ ਬੋਲੋ...',
  },
  gu: {
    nav_home:'હોમ', nav_diagnose:'પાક નિદાન', nav_market:'બજાર ભાવ', nav_alerts:'ચેતવણી',
    hero_title:'સ્માર્ટ ખેતી મદદ', hero_sub:'હવામાન · પાક · રોગ · બજાર',
    btn_location:'મારી સ્થિતિ', chatbot_title:'કિસાન મદદગાર', chatbot_sub:'કોઈ પણ ભાષામાં પૂછો',
    chat_placeholder:'લખો અથવા બોલો...',
  },
  kn: {
    nav_home:'ಹೋಮ್', nav_diagnose:'ಬೆಳೆ ರೋಗ', nav_market:'ಬೆಲೆಗಳು', nav_alerts:'ಎಚ್ಚರಿಕೆ',
    hero_title:'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯ', hero_sub:'ಹವಾಮಾನ · ಬೆಳೆ · ರೋಗ · ಮಾರುಕಟ್ಟೆ',
    btn_location:'ನನ್ನ ಸ್ಥಳ', chatbot_title:'ಕಿಸಾನ್ ಸಹಾಯಕ', chatbot_sub:'ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ',
    chat_placeholder:'ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...',
  },
  ml: {
    nav_home:'ഹോം', nav_diagnose:'വിള രോഗം', nav_market:'വിപണി വില', nav_alerts:'മുന്നറിയിപ്പ്',
    hero_title:'സ്മാർട്ട് കൃഷി സഹായം', hero_sub:'കാലാവസ്ഥ · വിള · രോഗം · വിപണി',
    btn_location:'എൻ്റെ സ്ഥാനം', chatbot_title:'കിസാൻ സഹായി', chatbot_sub:'ഏത് ഭാഷയിലും ചോദിക്കൂ',
    chat_placeholder:'ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...',
  },
};

// Default English — farmer can switch to Hindi
let currentLang = localStorage.getItem('agrosmart_lang') || 'en';

function translate(key) {
  return (T[currentLang] || {})[key] || T.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    const txt = translate(key);
    if (!txt || txt === key) return;
    if (el.tagName === 'INPUT') { el.placeholder = txt; return; }
    if (el.classList.contains('nav-item')) {
      const s = el.querySelector('span:not(.alert-badge)');
      if (s) s.textContent = txt;
      return;
    }
    if (el.classList.contains('bottom-nav-item')) {
      const s = el.querySelector('span');
      if (s) s.textContent = txt;
      return;
    }
    el.textContent = txt;
  });
  document.documentElement.lang = currentLang;
}

function setLanguage(code) {
  currentLang = code;
  localStorage.setItem('agrosmart_lang', code);
  applyTranslations();
  updateLangUI();
  document.querySelectorAll('.lang-option').forEach(o => {
    o.classList.toggle('active', o.dataset.code === code);
  });
  const sel = document.getElementById('langSelector');
  if (sel) sel.classList.remove('open');
}

function updateLangUI() {
  const lang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
  const btn  = document.getElementById('currentLang');
  if (btn) btn.textContent = lang.label;
}

function buildLangList(filter = '') {
  const list = document.getElementById('langList');
  if (!list) return;
  const f = filter.toLowerCase();
  list.innerHTML = LANGUAGES
    .filter(l => l.name.toLowerCase().includes(f) || l.code.includes(f))
    .map(l => `
      <div class="lang-option ${l.code === currentLang ? 'active' : ''}"
           data-code="${l.code}"
           onclick="setLanguage('${l.code}')">
        <span class="lang-flag">${l.flag}</span>
        <span class="lang-name">${l.name}</span>
        <span class="lang-code">${l.label}</span>
      </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  buildLangList();
  applyTranslations();
  updateLangUI();
});