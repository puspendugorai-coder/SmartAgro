/* translations.js */

const LANGUAGES = [
  { code:'en',  name:'English',           flag:'🇬🇧', label:'EN'  },
  { code:'hi',  name:'हिन्दी (Hindi)',      flag:'🇮🇳', label:'HI'  },
  { code:'bn',  name:'বাংলা (Bengali)',     flag:'🇮🇳', label:'BN'  },
  { code:'te',  name:'తెలుగు (Telugu)',     flag:'🇮🇳', label:'TE'  },
  { code:'mr',  name:'मराठी (Marathi)',     flag:'🇮🇳', label:'MR'  },
  { code:'ta',  name:'தமிழ் (Tamil)',       flag:'🇮🇳', label:'TA'  },
  { code:'gu',  name:'ગુજરાતી (Gujarati)', flag:'🇮🇳', label:'GU'  },
  { code:'kn',  name:'ಕನ್ನಡ (Kannada)',    flag:'🇮🇳', label:'KN'  },
  { code:'ml',  name:'മലയാളം (Malayalam)', flag:'🇮🇳', label:'ML'  },
  { code:'pa',  name:'ਪੰਜਾਬੀ (Punjabi)',   flag:'🇮🇳', label:'PA'  },
  { code:'or',  name:'ଓଡ଼ିଆ (Odia)',        flag:'🇮🇳', label:'OR'  },
  { code:'as',  name:'অসমীয়া (Assamese)',  flag:'🇮🇳', label:'AS'  },
  { code:'ur',  name:'اردو (Urdu)',          flag:'🇮🇳', label:'UR'  },
];

const T = {
  en: {
    nav_dashboard:'Dashboard', nav_diagnose:'Diagnose Crop',
    nav_market:'Market Prices', nav_alerts:'Alerts',
    btn_location:'Get My Location', btn_diagnose:'Diagnose Crop',
    section_weather:'Current Weather', section_crops:'Best Crops for You',
    section_advisory:'Farming Calendar', section_pest:'Pest Control Guide',
    section_quick:'Quick Actions', footer_text:"Helping India's farmers",
    market_title:'Crop Market Prices', alerts_title:'Farm Alert Center',
    btn_get_location:'Enable Location', no_alerts_title:'All Clear!',
    safe_title:'Safe to Grow Now', harmful_title:'Risky Crops Right Now',
  },
  hi: {
    nav_dashboard:'डैशबोर्ड', nav_diagnose:'फसल निदान',
    nav_market:'बाजार भाव', nav_alerts:'अलर्ट',
    btn_location:'मेरी लोकेशन लें', btn_diagnose:'फसल जांचें',
    section_weather:'मौसम', section_crops:'आपके लिए सबसे अच्छी फसलें',
    section_advisory:'खेती कैलेंडर', section_pest:'कीट नियंत्रण',
    section_quick:'त्वरित कार्य', footer_text:'किसानों के लिए AI सहायता',
    market_title:'फसल बाजार भाव', alerts_title:'फार्म अलर्ट केंद्र',
    btn_get_location:'लोकेशन दें', no_alerts_title:'सब ठीक है!',
    safe_title:'अभी उगाने के लिए सुरक्षित', harmful_title:'अभी जोखिम वाली फसलें',
  },
  bn: {
    nav_dashboard:'ড্যাশবোর্ড', nav_diagnose:'ফসল নির্ণয়',
    nav_market:'বাজার মূল্য', nav_alerts:'সতর্কতা',
    btn_location:'আমার অবস্থান', section_weather:'আবহাওয়া',
    section_crops:'আপনার জন্য সেরা ফসল', market_title:'ফসলের বাজার মূল্য',
    alerts_title:'ফার্ম সতর্কতা', safe_title:'এখন চাষের জন্য নিরাপদ',
  },
  pa: {
    nav_dashboard:'ਡੈਸ਼ਬੋਰਡ', nav_diagnose:'ਫਸਲ ਜਾਂਚ',
    nav_market:'ਮੰਡੀ ਭਾਅ', nav_alerts:'ਚੇਤਾਵਨੀ',
    btn_location:'ਮੇਰੀ ਲੋਕੇਸ਼ਨ', market_title:'ਫਸਲ ਮੰਡੀ ਭਾਅ',
  },
  mr: {
    nav_dashboard:'डॅशबोर्ड', nav_diagnose:'पीक निदान',
    nav_market:'बाजारभाव', nav_alerts:'सतर्कता',
    btn_location:'माझे स्थान', market_title:'पीक बाजारभाव',
  },
  ta: {
    nav_dashboard:'டாஷ்போர்ட்', nav_diagnose:'பயிர் நோய்',
    nav_market:'சந்தை விலை', nav_alerts:'எச்சரிக்கை',
    btn_location:'என் இடம்', market_title:'பயிர் சந்தை விலை',
  },
  te: {
    nav_dashboard:'డ్యాష్‌బోర్డ్', nav_diagnose:'పంట నిర్ధారణ',
    nav_market:'మార్కెట్ ధరలు', nav_alerts:'హెచ్చరికలు',
    btn_location:'నా స్థానం', market_title:'పంట మార్కెట్ ధరలు',
  },
  gu: {
    nav_dashboard:'ડૅશબોર્ડ', nav_diagnose:'પાક નિદાન',
    nav_market:'બજાર ભાવ', nav_alerts:'ચેતવણી',
    btn_location:'મારી સ્થિતિ', market_title:'પાક બજાર ભાવ',
  },
  kn: {
    nav_dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', nav_diagnose:'ಬೆಳೆ ರೋಗ',
    nav_market:'ಬೆಲೆಗಳು', nav_alerts:'ಎಚ್ಚರಿಕೆ',
    btn_location:'ನನ್ನ ಸ್ಥಳ', market_title:'ಬೆಳೆ ಬೆಲೆಗಳು',
  },
  ml: {
    nav_dashboard:'ഡാഷ്‌ബോർഡ്', nav_diagnose:'വിള രോഗം',
    nav_market:'വിപണി വില', nav_alerts:'മുന്നറിയിപ്പ്',
    btn_location:'എൻ്റെ സ്ഥാനം', market_title:'വിള വിപണി വില',
  },
};

let currentLang = localStorage.getItem('agrosmart_lang') || 'en';

function translate(key) {
  return (T[currentLang] || {})[key] || T.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key  = el.getAttribute('data-translate');
    const text = translate(key);
    if (el.tagName === 'INPUT') { el.placeholder = text; return; }
    if (el.classList.contains('nav-item')) {
      const span = el.querySelector('span');
      if (span) span.textContent = text;
      return;
    }
    el.textContent = text;
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
  // Close dropdown
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
  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(f) || l.code.toLowerCase().includes(f)
  );
  list.innerHTML = filtered.map(l => `
    <div class="lang-option ${l.code === currentLang ? 'active' : ''}"
         data-code="${l.code}"
         onclick="setLanguage('${l.code}')">
      <span class="lang-flag">${l.flag}</span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-code">${l.label}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  buildLangList();
  applyTranslations();
  updateLangUI();
});
