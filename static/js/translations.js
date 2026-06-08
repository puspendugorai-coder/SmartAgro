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
    nav_home:'Home', nav_diagnose:'Diagnose', nav_market:'Mandi Prices', nav_alerts:'Alerts',
    hero_title:'Smart Farming Intelligence',
    hero_sub:'Weather · Crops · Disease · Market Prices',
    btn_location:'Get My Location',
    section_weather:'Current Weather',
    section_crops:'Best Crops for You',
    section_pest:'Pest Control',
    chatbot_title:'Kisan Helper',
    chatbot_sub:'Ask in any language',
    helpline:'Kisan Helpline',
    rain_today:'Will It Rain Today?',
  },
  hi: {
    nav_home:'होम', nav_diagnose:'फसल जांच', nav_market:'मंडी भाव', nav_alerts:'अलर्ट',
    hero_title:'स्मार्ट खेती सहायक',
    hero_sub:'मौसम · फसल · रोग · मंडी भाव',
    btn_location:'मेरी लोकेशन लें',
    section_weather:'मौसम की जानकारी',
    section_crops:'आपके लिए सबसे अच्छी फसलें',
    section_pest:'कीट नियंत्रण',
    chatbot_title:'किसान सहायक',
    chatbot_sub:'किसी भी भाषा में पूछें',
    helpline:'किसान हेल्पलाइन',
    rain_today:'क्या आज बारिश होगी?',
  },
  bn: {
    nav_home:'হোম', nav_diagnose:'ফসল নির্ণয়', nav_market:'বাজার মূল্য', nav_alerts:'সতর্কতা',
    hero_title:'স্মার্ট কৃষি সহায়তা',
    hero_sub:'আবহাওয়া · ফসল · রোগ · বাজার',
    btn_location:'আমার অবস্থান',
    chatbot_title:'কিসান সহায়ক',
    helpline:'কিসান হেল্পলাইন',
  },
  ta: {
    nav_home:'முகப்பு', nav_diagnose:'பயிர் நோய்', nav_market:'சந்தை விலை', nav_alerts:'எச்சரிக்கை',
    hero_title:'ஸ்மார்ட் விவசாய உதவி',
    btn_location:'என் இடம்',
    chatbot_title:'கிசான் உதவியாளர்',
  },
  te: {
    nav_home:'హోమ్', nav_diagnose:'పంట నిర్ధారణ', nav_market:'మార్కెట్ ధరలు', nav_alerts:'హెచ్చరికలు',
    hero_title:'స్మార్ట్ వ్యవసాయ సహాయం',
    btn_location:'నా స్థానం',
    chatbot_title:'కిసాన్ సహాయకుడు',
  },
  mr: {
    nav_home:'होम', nav_diagnose:'पीक निदान', nav_market:'बाजारभाव', nav_alerts:'सतर्कता',
    hero_title:'स्मार्ट शेती मदत',
    btn_location:'माझे स्थान',
    chatbot_title:'किसान मदतनीस',
  },
  pa: {
    nav_home:'ਹੋਮ', nav_diagnose:'ਫਸਲ ਜਾਂਚ', nav_market:'ਮੰਡੀ ਭਾਅ', nav_alerts:'ਚੇਤਾਵਨੀ',
    hero_title:'ਸਮਾਰਟ ਖੇਤੀ ਮਦਦ',
    btn_location:'ਮੇਰੀ ਲੋਕੇਸ਼ਨ',
    chatbot_title:'ਕਿਸਾਨ ਸਹਾਇਕ',
  },
  gu: {
    nav_home:'હોમ', nav_diagnose:'પાક નિદાન', nav_market:'બજાર ભાવ', nav_alerts:'ચેતવણી',
    hero_title:'સ્માર્ટ ખેતી મદદ',
    btn_location:'મારી સ્થિતિ',
    chatbot_title:'કિસાન મદદગાર',
  },
  kn: {
    nav_home:'ಹೋಮ್', nav_diagnose:'ಬೆಳೆ ರೋಗ', nav_market:'ಬೆಲೆಗಳು', nav_alerts:'ಎಚ್ಚರಿಕೆ',
    hero_title:'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯ',
    btn_location:'ನನ್ನ ಸ್ಥಳ',
    chatbot_title:'ಕಿಸಾನ್ ಸಹಾಯಕ',
  },
  ml: {
    nav_home:'ഹോം', nav_diagnose:'വിള രോഗം', nav_market:'വിപണി വില', nav_alerts:'മുന്നറിയിപ്പ്',
    hero_title:'സ്മാർട്ട് കൃഷി സഹായം',
    btn_location:'എൻ്റെ സ്ഥാനം',
    chatbot_title:'കിസാൻ സഹായി',
  },
};

let currentLang = localStorage.getItem('agrosmart_lang') || 'hi';

function translate(key) {
  return (T[currentLang] || {})[key] || T.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    const txt = translate(key);
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
           data-code="${l.code}" onclick="setLanguage('${l.code}')">
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