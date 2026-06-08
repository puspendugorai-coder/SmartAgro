const LANGUAGES = [
  {code:'en', name:'English',           flag:'🇬🇧', label:'EN'},
  {code:'hi', name:'हिन्दी',             flag:'🇮🇳', label:'HI'},
  {code:'bn', name:'বাংলা',              flag:'🇮🇳', label:'BN'},
  {code:'ta', name:'தமிழ்',             flag:'🇮🇳', label:'TA'},
  {code:'te', name:'తెలుగు',            flag:'🇮🇳', label:'TE'},
  {code:'mr', name:'मराठी',             flag:'🇮🇳', label:'MR'},
  {code:'pa', name:'ਪੰਜਾਬੀ',            flag:'🇮🇳', label:'PA'},
  {code:'gu', name:'ગુજરાતી',           flag:'🇮🇳', label:'GU'},
  {code:'kn', name:'ಕನ್ನಡ',            flag:'🇮🇳', label:'KN'},
  {code:'ml', name:'മലയാളം',           flag:'🇮🇳', label:'ML'},
];

const T = {
  en: { nav_dashboard:'Dashboard', nav_diagnose:'Diagnose Crop', nav_market:'Market Prices', nav_alerts:'Alerts', hero_title:'Smart Farming Intelligence', hero_sub:'Weather, crops, disease detection and market prices', btn_location:'Get My Location', btn_diagnose:'Diagnose Crop', rain_today:'Will it rain today?', msp_label:'MSP Price', chatbot_placeholder:'Ask anything... (type or speak)', chatbot_title:'Kisan Helper', kisan_helpline:'Kisan Helpline' },
  hi: { nav_dashboard:'डैशबोर्ड', nav_diagnose:'फसल निदान', nav_market:'बाजार भाव', nav_alerts:'अलर्ट', hero_title:'स्मार्ट खेती सहायक', hero_sub:'मौसम, फसल, रोग और बाजार भाव एक जगह', btn_location:'मेरी लोकेशन लें', btn_diagnose:'फसल जांचें', rain_today:'क्या आज बारिश होगी?', msp_label:'MSP भाव', chatbot_placeholder:'कुछ भी पूछें... (टाइप करें या बोलें)', chatbot_title:'किसान सहायक', kisan_helpline:'किसान हेल्पलाइन' },
  bn: { nav_dashboard:'ড্যাশবোর্ড', nav_diagnose:'ফসল নির্ণয়', nav_market:'বাজার মূল্য', nav_alerts:'সতর্কতা', hero_title:'স্মার্ট কৃষি সহায়তা', btn_location:'আমার অবস্থান', chatbot_placeholder:'যেকোনো প্রশ্ন করুন...', chatbot_title:'কিসান সহায়ক' },
  ta: { nav_dashboard:'டாஷ்போர்ட்', nav_diagnose:'பயிர் நோய்', nav_market:'சந்தை விலை', nav_alerts:'எச்சரிக்கை', hero_title:'ஸ்மார்ட் விவசாய உதவி', btn_location:'என் இடம்', chatbot_placeholder:'எதையும் கேளுங்கள்...', chatbot_title:'கிசான் உதவியாளர்' },
  te: { nav_dashboard:'డ్యాష్‌బోర్డ్', nav_diagnose:'పంట నిర్ధారణ', nav_market:'మార్కెట్ ధరలు', nav_alerts:'హెచ్చరికలు', hero_title:'స్మార్ట్ వ్యవసాయ సహాయం', btn_location:'నా స్థానం', chatbot_placeholder:'ఏదైనా అడగండి...', chatbot_title:'కిసాన్ సహాయకుడు' },
  mr: { nav_dashboard:'डॅशबोर्ड', nav_diagnose:'पीक निदान', nav_market:'बाजारभाव', nav_alerts:'सतर्कता', hero_title:'स्मार्ट शेती मदत', btn_location:'माझे स्थान', chatbot_placeholder:'काहीही विचारा...', chatbot_title:'किसान मदतनीस' },
  pa: { nav_dashboard:'ਡੈਸ਼ਬੋਰਡ', nav_diagnose:'ਫਸਲ ਜਾਂਚ', nav_market:'ਮੰਡੀ ਭਾਅ', nav_alerts:'ਚੇਤਾਵਨੀ', hero_title:'ਸਮਾਰਟ ਖੇਤੀ ਮਦਦ', btn_location:'ਮੇਰੀ ਲੋਕੇਸ਼ਨ', chatbot_placeholder:'ਕੁਝ ਵੀ ਪੁੱਛੋ...', chatbot_title:'ਕਿਸਾਨ ਸਹਾਇਕ' },
  gu: { nav_dashboard:'ડૅશબોર્ડ', nav_diagnose:'પાક નિદાન', nav_market:'બજાર ભાવ', nav_alerts:'ચેતવણી', hero_title:'સ્માર્ટ ખેતી મદદ', btn_location:'મારી સ્થિતિ', chatbot_placeholder:'કઈ પણ પૂછો...', chatbot_title:'કિસાન મદદગાર' },
  kn: { nav_dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', nav_diagnose:'ಬೆಳೆ ರೋಗ', nav_market:'ಬೆಲೆಗಳು', nav_alerts:'ಎಚ್ಚರಿಕೆ', hero_title:'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯ', btn_location:'ನನ್ನ ಸ್ಥಳ', chatbot_placeholder:'ಏನಾದರೂ ಕೇಳಿ...', chatbot_title:'ಕಿಸಾನ್ ಸಹಾಯಕ' },
  ml: { nav_dashboard:'ഡാഷ്‌ബോർഡ്', nav_diagnose:'വിള രോഗം', nav_market:'വിപണി വില', nav_alerts:'മുന്നറിയിപ്പ്', hero_title:'സ്മാർട്ട് കൃഷി സഹായം', btn_location:'എൻ്റെ സ്ഥാനം', chatbot_placeholder:'എന്തും ചോദിക്കൂ...', chatbot_title:'കിസാൻ സഹായി' },
};

let currentLang = localStorage.getItem('agrosmart_lang') || 'hi';

function translate(key) { return (T[currentLang]||{})[key] || T.en[key] || key; }

function applyTranslations() {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    const txt = translate(key);
    if (el.tagName==='INPUT') { el.placeholder=txt; return; }
    if (el.classList.contains('nav-item')) { const s=el.querySelector('span'); if(s) s.textContent=txt; return; }
    el.textContent = txt;
  });
  document.documentElement.lang = currentLang;
}

function setLanguage(code) {
  currentLang = code;
  localStorage.setItem('agrosmart_lang', code);
  applyTranslations();
  updateLangUI();
  document.querySelectorAll('.lang-option').forEach(o => o.classList.toggle('active', o.dataset.code===code));
  const sel = document.getElementById('langSelector');
  if (sel) sel.classList.remove('open');
}

function updateLangUI() {
  const lang = LANGUAGES.find(l=>l.code===currentLang)||LANGUAGES[0];
  const btn  = document.getElementById('currentLang');
  if (btn) btn.textContent = lang.label;
}

function buildLangList(filter='') {
  const list = document.getElementById('langList');
  if (!list) return;
  const f = filter.toLowerCase();
  list.innerHTML = LANGUAGES.filter(l=>l.name.toLowerCase().includes(f)||l.code.includes(f)).map(l=>`
    <div class="lang-option ${l.code===currentLang?'active':''}" data-code="${l.code}" onclick="setLanguage('${l.code}')">
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
