const LANGUAGES = [
  {code:'en', name:'English',            flag:'🇬🇧', label:'EN'},
  {code:'hi', name:'हिन्दी (Hindi)',       flag:'🇮🇳', label:'HI'},
  {code:'bn', name:'বাংলা (Bengali)',      flag:'🇮🇳', label:'BN'},
  {code:'ta', name:'தமிழ் (Tamil)',        flag:'🇮🇳', label:'TA'},
  {code:'te', name:'తెలుగు (Telugu)',      flag:'🇮🇳', label:'TE'},
  {code:'mr', name:'मराठी (Marathi)',      flag:'🇮🇳', label:'MR'},
  {code:'pa', name:'ਪੰਜਾਬੀ (Punjabi)',    flag:'🇮🇳', label:'PA'},
  {code:'gu', name:'ગુજરાતી (Gujarati)',  flag:'🇮🇳', label:'GU'},
  {code:'kn', name:'ಕನ್ನಡ (Kannada)',     flag:'🇮🇳', label:'KN'},
  {code:'ml', name:'മലയാളം (Malayalam)', flag:'🇮🇳', label:'ML'},
];

// ── Crop name translations ──
const CROP_NAMES = {
  en: {Rice:'Rice',Wheat:'Wheat',Maize:'Maize',Cotton:'Cotton',Tomato:'Tomato',Sugarcane:'Sugarcane',Soybean:'Soybean',Mustard:'Mustard',Onion:'Onion',Potato:'Potato',Chilli:'Chilli',Groundnut:'Groundnut',Arhar:'Arhar',Moong:'Moong',Urad:'Urad'},
  hi: {Rice:'धान/चावल',Wheat:'गेहूं',Maize:'मक्का',Cotton:'कपास',Tomato:'टमाटर',Sugarcane:'गन्ना',Soybean:'सोयाबीन',Mustard:'सरसों',Onion:'प्याज',Potato:'आलू',Chilli:'मिर्च',Groundnut:'मूंगफली',Arhar:'अरहर',Moong:'मूंग',Urad:'उड़द'},
  bn: {Rice:'ধান/চাল',Wheat:'গম',Maize:'ভুট্টা',Cotton:'তুলা',Tomato:'টমেটো',Sugarcane:'আখ',Soybean:'সয়াবিন',Mustard:'সরিষা',Onion:'পেঁয়াজ',Potato:'আলু',Chilli:'মরিচ',Groundnut:'চিনাবাদাম',Arhar:'অরহর',Moong:'মুগ',Urad:'উড়দ'},
  ta: {Rice:'அரிசி',Wheat:'கோதுமை',Maize:'மக்காச்சோளம்',Cotton:'பருத்தி',Tomato:'தக்காளி',Sugarcane:'கரும்பு',Soybean:'சோயாபீன்',Mustard:'கடுகு',Onion:'வெங்காயம்',Potato:'உருளைக்கிழங்கு',Chilli:'மிளகாய்',Groundnut:'நிலக்கடலை',Arhar:'துவரை',Moong:'பயறு',Urad:'உளுந்து'},
  te: {Rice:'వరి/బియ్యం',Wheat:'గోధుమ',Maize:'మొక్కజొన్న',Cotton:'పత్తి',Tomato:'టమాటా',Sugarcane:'చెరకు',Soybean:'సోయాబీన్',Mustard:'ఆవాలు',Onion:'ఉల్లిపాయ',Potato:'బంగాళాదుంప',Chilli:'మిరపకాయ',Groundnut:'వేరుశెనగ',Arhar:'కందిపప్పు',Moong:'పెసలు',Urad:'మినుములు'},
  mr: {Rice:'तांदूळ',Wheat:'गहू',Maize:'मका',Cotton:'कापूस',Tomato:'टोमॅटो',Sugarcane:'ऊस',Soybean:'सोयाबीन',Mustard:'मोहरी',Onion:'कांदा',Potato:'बटाटा',Chilli:'मिरची',Groundnut:'शेंगदाणे',Arhar:'तूर',Moong:'मूग',Urad:'उडीद'},
  pa: {Rice:'ਝੋਨਾ/ਚਾਵਲ',Wheat:'ਕਣਕ',Maize:'ਮੱਕੀ',Cotton:'ਕਪਾਹ',Tomato:'ਟਮਾਟਰ',Sugarcane:'ਗੰਨਾ',Soybean:'ਸੋਇਆਬੀਨ',Mustard:'ਸਰੋਂ',Onion:'ਪਿਆਜ਼',Potato:'ਆਲੂ',Chilli:'ਮਿਰਚ',Groundnut:'ਮੂੰਗਫਲੀ',Arhar:'ਅਰਹਰ',Moong:'ਮੂੰਗ',Urad:'ਉੜਦ'},
  gu: {Rice:'ડાંગર/ચોખા',Wheat:'ઘઉં',Maize:'મકાઈ',Cotton:'કપાસ',Tomato:'ટામેટા',Sugarcane:'શેરડી',Soybean:'સોયાબીન',Mustard:'સરસવ',Onion:'ડુંગળી',Potato:'બટાકા',Chilli:'મરચા',Groundnut:'મગફળી',Arhar:'અરહર',Moong:'મગ',Urad:'અડદ'},
  kn: {Rice:'ಭತ್ತ/ಅಕ್ಕಿ',Wheat:'ಗೋಧಿ',Maize:'ಮೆಕ್ಕೆಜೋಳ',Cotton:'ಹತ್ತಿ',Tomato:'ಟೊಮ್ಯಾಟೊ',Sugarcane:'ಕಬ್ಬು',Soybean:'ಸೋಯಾಬೀನ್',Mustard:'ಸಾಸಿವೆ',Onion:'ಈರುಳ್ಳಿ',Potato:'ಆಲೂಗಡ್ಡೆ',Chilli:'ಮೆಣಸಿನಕಾಯಿ',Groundnut:'ಕಡಲೆಕಾಯಿ',Arhar:'ತೊಗರಿ',Moong:'ಹೆಸರು',Urad:'ಉದ್ದು'},
  ml: {Rice:'നെല്ല്/അരി',Wheat:'ഗോതമ്പ്',Maize:'ചോളം',Cotton:'പഞ്ഞി',Tomato:'തക്കാളി',Sugarcane:'കരിമ്പ്',Soybean:'സോയാബീൻ',Mustard:'കടുക്',Onion:'ഉള്ളി',Potato:'ഉരുളക്കിഴങ്ങ്',Chilli:'മുളക്',Groundnut:'നിലക്കടല',Arhar:'തുവര',Moong:'ചെറുപയർ',Urad:'ഉഴുന്ന്'},
};

// ── Crop descriptions ──
const CROP_DESC = {
  en: {
    Rice:'Best for high humidity and warm weather',
    Wheat:'Cool dry winters, most popular rabi crop',
    Maize:'Versatile crop for warm humid weather',
    Cotton:'Hot dry spells with moderate rain',
    Tomato:'High value crop for moderate climates',
    Sugarcane:'Hot climate and heavy rainfall needed',
    Soybean:'Nitrogen-fixing legume for warm monsoon',
    Mustard:'Cool weather oil seed crop',
    Onion:'High demand vegetable with good income',
    Potato:'Cool weather staple with high yield',
    Chilli:'Warm climate spice with high market value',
    Groundnut:'Warm season oilseed crop',
  },
  hi: {
    Rice:'अधिक नमी और गर्म मौसम के लिए सबसे अच्छा',
    Wheat:'ठंडी सर्दियों में उगाई जाने वाली सबसे लोकप्रिय फसल',
    Maize:'गर्म और नम मौसम के लिए उपयुक्त फसल',
    Cotton:'गर्म और शुष्क मौसम में मध्यम बारिश के साथ',
    Tomato:'मध्यम जलवायु के लिए उच्च मूल्य वाली फसल',
    Sugarcane:'गर्म जलवायु और भारी वर्षा आवश्यक',
    Soybean:'गर्म मानसून के लिए नाइट्रोजन-स्थिरक फलीदार',
    Mustard:'ठंडे मौसम की तिलहन फसल',
    Onion:'अच्छी आय वाली उच्च मांग की सब्जी',
    Potato:'ठंडे मौसम की मुख्य फसल, उच्च उपज',
    Chilli:'उच्च बाजार मूल्य वाला गर्म जलवायु मसाला',
    Groundnut:'गर्म मौसम की तिलहन फसल',
  },
  bn: {
    Rice:'উচ্চ আর্দ্রতা এবং গরম আবহাওয়ার জন্য সেরা',
    Wheat:'ঠান্ডা শুষ্ক শীতকালে সবচেয়ে জনপ্রিয় রবি ফসল',
    Maize:'গরম আর্দ্র আবহাওয়ার জন্য বহুমুখী ফসল',
    Cotton:'গরম শুষ্ক আবহাওয়ায় মাঝারি বৃষ্টিতে ভালো',
    Tomato:'মাঝারি জলবায়ুতে উচ্চ মূল্যের ফসল',
    Sugarcane:'গরম জলবায়ু এবং ভারী বৃষ্টিপাত প্রয়োজন',
    Soybean:'উষ্ণ বর্ষায় নাইট্রোজেন-স্থিরকারী শিম',
    Mustard:'ঠান্ডা আবহাওয়ার তেলবীজ ফসল',
    Onion:'ভালো আয়ের উচ্চ চাহিদার সবজি',
    Potato:'ঠান্ডা আবহাওয়ার প্রধান ফসল, উচ্চ ফলন',
    Chilli:'উচ্চ বাজার মূল্যের উষ্ণ জলবায়ু মসলা',
    Groundnut:'উষ্ণ মৌসুমের তেলবীজ ফসল',
  },
  ta: {
    Rice:'அதிக ஈரப்பதம் மற்றும் வெப்பமான வானிலைக்கு சிறந்தது',
    Wheat:'குளிர் வறண்ட குளிர்காலத்தில் பிரபலமான பயிர்',
    Maize:'வெப்பமான ஈரமான வானிலைக்கு ஏற்ற பயிர்',
    Cotton:'வெப்பமான வறண்ட காலத்தில் மிதமான மழையுடன்',
    Tomato:'மிதமான காலநிலைக்கு உயர் மதிப்பு பயிர்',
    Sugarcane:'வெப்பமான காலநிலை மற்றும் கனமழை தேவை',
    Soybean:'வெப்பமான பருவமழைக்கு நைட்ரஜன் நிலைப்படுத்தும் பயிர்',
    Mustard:'குளிர் வானிலை எண்ணெய் வித்து பயிர்',
    Onion:'நல்ல வருமானமுள்ள அதிக தேவையுள்ள காய்கறி',
    Potato:'குளிர் வானிலை முக்கிய பயிர், அதிக மகசூல்',
    Chilli:'உயர் சந்தை மதிப்புள்ள வெப்பமண்டல மசாலா',
    Groundnut:'வெப்ப காலத்தில் எண்ணெய் வித்து பயிர்',
  },
  te: {
    Rice:'అధిక తేమ మరియు వెచ్చని వాతావరణానికి అనుకూలం',
    Wheat:'చల్లని పొడి శీతాకాలంలో అత్యంత ప్రాచుర్యం పొందిన పంట',
    Maize:'వెచ్చని తేమతో కూడిన వాతావరణానికి అనువైన పంట',
    Cotton:'వేడి పొడి వాతావరణంలో మితమైన వర్షంతో',
    Tomato:'మితమైన వాతావరణానికి అధిక విలువైన పంట',
    Sugarcane:'వేడి వాతావరణం మరియు భారీ వర్షపాతం అవసరం',
    Soybean:'వెచ్చని వర్షాకాలంలో నత్రజని స్థిరీకరించే పంట',
    Mustard:'చల్లని వాతావరణపు నూనె గింజల పంట',
    Onion:'మంచి ఆదాయంతో అధిక డిమాండ్ ఉన్న కూరగాయ',
    Potato:'చల్లని వాతావరణపు ప్రధాన పంట, అధిక దిగుబడి',
    Chilli:'అధిక మార్కెట్ విలువతో వేడి వాతావరణ మసాలా',
    Groundnut:'వేడి కాలపు నూనె గింజల పంట',
  },
  mr: {
    Rice:'जास्त आर्द्रता आणि उष्ण हवामानासाठी सर्वोत्तम',
    Wheat:'थंड कोरड्या हिवाळ्यातील सर्वात लोकप्रिय रब्बी पीक',
    Maize:'उष्ण दमट हवामानासाठी योग्य पीक',
    Cotton:'उष्ण कोरड्या हवामानात मध्यम पावसासह',
    Tomato:'मध्यम हवामानासाठी उच्च मूल्याचे पीक',
    Sugarcane:'उष्ण हवामान आणि जास्त पाऊस आवश्यक',
    Soybean:'उष्ण मान्सूनसाठी नायट्रोजन-स्थिरीकरण करणारी शेंग',
    Mustard:'थंड हवामानातील तेलबिया पीक',
    Onion:'चांगल्या उत्पन्नासह जास्त मागणी असलेली भाजी',
    Potato:'थंड हवामानातील मुख्य पीक, जास्त उत्पादन',
    Chilli:'उच्च बाजारभावाचे उष्ण हवामानातील मसाला पीक',
    Groundnut:'उष्ण हंगामातील तेलबिया पीक',
  },
  pa: {
    Rice:'ਵੱਧ ਨਮੀ ਅਤੇ ਗਰਮ ਮੌਸਮ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ',
    Wheat:'ਠੰਡੇ ਸੁੱਕੇ ਸਰਦੀਆਂ ਵਿੱਚ ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ ਰਬੀ ਫਸਲ',
    Maize:'ਗਰਮ ਨਮੀ ਵਾਲੇ ਮੌਸਮ ਲਈ ਢੁਕਵੀਂ ਫਸਲ',
    Cotton:'ਗਰਮ ਸੁੱਕੇ ਮੌਸਮ ਵਿੱਚ ਦਰਮਿਆਨੀ ਬਾਰਿਸ਼ ਨਾਲ',
    Tomato:'ਦਰਮਿਆਨੇ ਮੌਸਮ ਲਈ ਉੱਚ ਮੁੱਲ ਵਾਲੀ ਫਸਲ',
    Sugarcane:'ਗਰਮ ਮੌਸਮ ਅਤੇ ਭਾਰੀ ਬਾਰਿਸ਼ ਜ਼ਰੂਰੀ',
    Soybean:'ਗਰਮ ਮਾਨਸੂਨ ਲਈ ਨਾਈਟ੍ਰੋਜਨ ਬਣਾਉਣ ਵਾਲੀ ਫਲੀ',
    Mustard:'ਠੰਡੇ ਮੌਸਮ ਦੀ ਤੇਲ ਬੀਜ ਫਸਲ',
    Onion:'ਚੰਗੀ ਆਮਦਨ ਵਾਲੀ ਵੱਧ ਮੰਗ ਵਾਲੀ ਸਬਜ਼ੀ',
    Potato:'ਠੰਡੇ ਮੌਸਮ ਦੀ ਮੁੱਖ ਫਸਲ, ਵੱਧ ਝਾੜ',
    Chilli:'ਉੱਚ ਬਾਜ਼ਾਰ ਮੁੱਲ ਵਾਲਾ ਗਰਮ ਮੌਸਮ ਮਸਾਲਾ',
    Groundnut:'ਗਰਮ ਮੌਸਮ ਦੀ ਤੇਲ ਬੀਜ ਫਸਲ',
  },
  gu: {
    Rice:'વધુ ભેજ અને ગરમ હવામાન માટે શ્રેષ્ઠ',
    Wheat:'ઠંડા સૂકા શિયાળામાં સૌથી લોકપ્રિય રવિ પાક',
    Maize:'ગરમ ભેજવાળા હવામાન માટે યોગ્ય પાક',
    Cotton:'ગરમ સૂકા હવામાનમાં મધ્યમ વરસાદ સાથે',
    Tomato:'સમશીતોષ્ણ હવામાન માટે ઉચ્ચ મૂલ્યનો પાક',
    Sugarcane:'ગરમ હવામાન અને ભારે વરસાદ જરૂરી',
    Soybean:'ગરમ ચોમાસા માટે નાઇટ્રોજન સ્થિર કરતી કઠોળ',
    Mustard:'ઠંડા હવામાનનો તેલીબિયાં પાક',
    Onion:'સારી આવક સાથે વધુ માંગ ધરાવતી શાક',
    Potato:'ઠંડા હવામાનનો મુખ્ય પાક, વધુ ઉત્પાદન',
    Chilli:'ઉચ્ચ બજાર ભાવ ધરાવતો ગરમ હવામાન મસાલો',
    Groundnut:'ગરમ ઋતુનો તેલીબિયાં પાક',
  },
  kn: {
    Rice:'ಹೆಚ್ಚು ತೇವಾಂಶ ಮತ್ತು ಬಿಸಿ ವಾತಾವರಣಕ್ಕೆ ಸೂಕ್ತ',
    Wheat:'ತಂಪಾದ ಶುಷ್ಕ ಚಳಿಗಾಲದಲ್ಲಿ ಅತ್ಯಂತ ಜನಪ್ರಿಯ ರಬಿ ಬೆಳೆ',
    Maize:'ಬಿಸಿ ತೇವಾಂಶದ ವಾತಾವರಣಕ್ಕೆ ಸೂಕ್ತ ಬೆಳೆ',
    Cotton:'ಬಿಸಿ ಶುಷ್ಕ ವಾತಾವರಣದಲ್ಲಿ ಮಧ್ಯಮ ಮಳೆಯೊಂದಿಗೆ',
    Tomato:'ಸಮಶೀತೋಷ್ಣ ವಾತಾವರಣಕ್ಕೆ ಹೆಚ್ಚಿನ ಮೌಲ್ಯದ ಬೆಳೆ',
    Sugarcane:'ಬಿಸಿ ವಾತಾವರಣ ಮತ್ತು ಭಾರಿ ಮಳೆ ಅವಶ್ಯಕ',
    Soybean:'ಬಿಸಿ ಮಾನ್ಸೂನ್‌ಗೆ ನೈಟ್ರೋಜನ್ ಸ್ಥಿರೀಕರಿಸುವ ದ್ವಿದಳ',
    Mustard:'ತಂಪಾದ ವಾತಾವರಣದ ಎಣ್ಣೆ ಬೀಜ ಬೆಳೆ',
    Onion:'ಉತ್ತಮ ಆದಾಯದೊಂದಿಗೆ ಹೆಚ್ಚು ಬೇಡಿಕೆಯ ತರಕಾರಿ',
    Potato:'ತಂಪಾದ ವಾತಾವರಣದ ಮುಖ್ಯ ಬೆಳೆ, ಹೆಚ್ಚು ಇಳುವರಿ',
    Chilli:'ಹೆಚ್ಚು ಮಾರುಕಟ್ಟೆ ಮೌಲ್ಯದ ಬಿಸಿ ವಾತಾವರಣ ಮಸಾಲೆ',
    Groundnut:'ಬಿಸಿ ಋತುವಿನ ಎಣ್ಣೆ ಬೀಜ ಬೆಳೆ',
  },
  ml: {
    Rice:'ഉയർന്ന ആർദ്രതയും ചൂടുള്ള കാലാവസ്ഥയ്ക്കും അനുയോജ്യം',
    Wheat:'തണുത്ത വരണ്ട ശൈത്യകാലത്ത് ഏറ്റവും ജനപ്രിയ രബി വിള',
    Maize:'ചൂടും ഈർപ്പവുമുള്ള കാലാവസ്ഥയ്ക്ക് അനുയോജ്യം',
    Cotton:'ചൂടുള്ള വരണ്ട കാലത്ത് മിതമായ മഴയോടെ',
    Tomato:'മിതശീതോഷ്ണ കാലാവസ്ഥയ്ക്ക് ഉയർന്ന മൂല്യമുള്ള വിള',
    Sugarcane:'ചൂടുള്ള കാലാവസ്ഥയും കനത്ത മഴയും ആവശ്യം',
    Soybean:'ഊഷ്മള മൺസൂണിൽ നൈട്രജൻ സ്ഥിരീകരിക്കുന്ന പയർ',
    Mustard:'തണുത്ത കാലാവസ്ഥയുടെ എണ്ണ വിത്ത് വിള',
    Onion:'നല്ല വരുമാനമുള്ള ഉയർന്ന ഡിമാൻഡ് പച്ചക്കറി',
    Potato:'തണുത്ത കാലാവസ്ഥയുടെ പ്രധാന വിള, ഉയർന്ന വിളവ്',
    Chilli:'ഉയർന്ന വിപണി മൂല്യമുള്ള ചൂടുള്ള കാലാവസ്ഥ മസാല',
    Groundnut:'ഊഷ്മള ഋതുവിലെ എണ്ണ വിത്ത് വിള',
  },
};

// ── Season translations ──
const SEASON_T = {
  en: {"Kharif (Monsoon)":"Kharif (Monsoon)","Rabi (Winter)":"Rabi (Winter)","Zaid (Summer)":"Zaid (Summer)"},
  hi: {"Kharif (Monsoon)":"खरीफ (मानसून)","Rabi (Winter)":"रबी (सर्दी)","Zaid (Summer)":"जायद (गर्मी)"},
  bn: {"Kharif (Monsoon)":"খরিফ (বর্ষা)","Rabi (Winter)":"রবি (শীত)","Zaid (Summer)":"জায়েদ (গ্রীষ্ম)"},
  ta: {"Kharif (Monsoon)":"கரீஃப் (மழை)","Rabi (Winter)":"ராபி (குளிர்)","Zaid (Summer)":"ஜாய்த் (கோடை)"},
  te: {"Kharif (Monsoon)":"ఖరీఫ్ (వర్షాకాలం)","Rabi (Winter)":"రబీ (శీతాకాలం)","Zaid (Summer)":"జాయిద్ (వేసవి)"},
  mr: {"Kharif (Monsoon)":"खरीप (पावसाळा)","Rabi (Winter)":"रब्बी (हिवाळा)","Zaid (Summer)":"उन्हाळी (उन्हाळा)"},
  pa: {"Kharif (Monsoon)":"ਖਰੀਫ (ਮਾਨਸੂਨ)","Rabi (Winter)":"ਰਬੀ (ਸਰਦੀ)","Zaid (Summer)":"ਜ਼ਾਇਦ (ਗਰਮੀ)"},
  gu: {"Kharif (Monsoon)":"ખરીફ (ચોમાસુ)","Rabi (Winter)":"રવિ (શિયાળો)","Zaid (Summer)":"ઝાઇદ (ઉનાળો)"},
  kn: {"Kharif (Monsoon)":"ಖಾರಿಫ್ (ಮಳೆಗಾಲ)","Rabi (Winter)":"ರಬಿ (ಚಳಿಗಾಲ)","Zaid (Summer)":"ಜಾಯಿದ್ (ಬೇಸಿಗೆ)"},
  ml: {"Kharif (Monsoon)":"ഖരീഫ് (മൺസൂൺ)","Rabi (Winter)":"റബി (ശൈത്യകാലം)","Zaid (Summer)":"സൈദ് (വേനൽ)"},
};

// ── Weather labels ──
const WEATHER_T = {
  en: {humidity:'Humidity',wind:'Wind Speed',visibility:'Visibility',pressure:'Pressure',feels:'Feels like',today:'Today',tomorrow:'Tomorrow',rain_yes:'YES — Rain Expected',rain_no:'NO — Clear Sky',forecast:'6-Day Forecast'},
  hi: {humidity:'आर्द्रता',wind:'हवा की गति',visibility:'दृश्यता',pressure:'वायुदाब',feels:'महसूस होता है',today:'आज',tomorrow:'कल',rain_yes:'हाँ — बारिश की संभावना',rain_no:'नहीं — साफ आकाश',forecast:'6 दिन का पूर्वानुमान'},
  bn: {humidity:'আর্দ্রতা',wind:'বায়ু গতি',visibility:'দৃশ্যমানতা',pressure:'বায়ুচাপ',feels:'অনুভব হয়',today:'আজ',tomorrow:'আগামীকাল',rain_yes:'হ্যাঁ — বৃষ্টির সম্ভাবনা',rain_no:'না — পরিষ্কার আকাশ',forecast:'৬ দিনের পূর্বাভাস'},
  ta: {humidity:'ஈரப்பதம்',wind:'காற்று வேகம்',visibility:'தெரிவுத்திறன்',pressure:'காற்றழுத்தம்',feels:'உணர்கிறது',today:'இன்று',tomorrow:'நாளை',rain_yes:'ஆம் — மழை எதிர்பார்க்கப்படுகிறது',rain_no:'இல்லை — தெளிவான வானம்',forecast:'6 நாள் முன்னறிவிப்பு'},
  te: {humidity:'తేమ',wind:'గాలి వేగం',visibility:'దృశ్యమానత',pressure:'వాయు పీడనం',feels:'అనిపిస్తుంది',today:'ఈరోజు',tomorrow:'రేపు',rain_yes:'అవును — వర్షం అంచనా',rain_no:'కాదు —맑은 ఆకాశం',forecast:'6 రోజుల అంచనా'},
  mr: {humidity:'आर्द्रता',wind:'वाऱ्याचा वेग',visibility:'दृश्यमानता',pressure:'हवेचा दाब',feels:'जाणवते',today:'आज',tomorrow:'उद्या',rain_yes:'होय — पाऊस अपेक्षित',rain_no:'नाही — स्वच्छ आकाश',forecast:'6 दिवसांचा अंदाज'},
  pa: {humidity:'ਨਮੀ',wind:'ਹਵਾ ਦੀ ਗਤੀ',visibility:'ਦਿੱਖ',pressure:'ਵਾਯੂ ਦਬਾਅ',feels:'ਮਹਿਸੂਸ ਹੁੰਦਾ',today:'ਅੱਜ',tomorrow:'ਕੱਲ੍ਹ',rain_yes:'ਹਾਂ — ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ',rain_no:'ਨਹੀਂ — ਸਾਫ਼ ਅਸਮਾਨ',forecast:'6 ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ'},
  gu: {humidity:'ભેજ',wind:'પવન ગતિ',visibility:'દ્રષ્ટિ',pressure:'હવાનું દબાણ',feels:'અનુભવ થાય',today:'આજ',tomorrow:'કાલ',rain_yes:'હા — વરસાદ અपेक्षित',rain_no:'ના — સ્વચ્છ આકાશ',forecast:'6 દિવસની આગાહી'},
  kn: {humidity:'ಆರ್ದ್ರತೆ',wind:'ಗಾಳಿ ವೇಗ',visibility:'ದೃಶ್ಯಮಾನತೆ',pressure:'ವಾಯು ಒತ್ತಡ',feels:'ಅನಿಸುತ್ತದೆ',today:'ಇಂದು',tomorrow:'ನಾಳೆ',rain_yes:'ಹೌದು — ಮಳೆ ನಿರೀಕ್ಷಿತ',rain_no:'ಇಲ್ಲ — ನಿರ್ಮಲ ಆಕಾಶ',forecast:'6 ದಿನಗಳ ಮುನ್ಸೂಚನೆ'},
  ml: {humidity:'ആർദ്രത',wind:'കാറ്റ് വേഗത',visibility:'ദൃശ്യദൂരം',pressure:'വായുമർദ്ദം',feels:'അനുഭവപ്പെടുന്നത്',today:'ഇന്ന്',tomorrow:'നാളെ',rain_yes:'അതെ — മഴ പ്രതീക്ഷിക്കുന്നു',rain_no:'ഇല്ല — തെളിഞ്ഞ ആകാശം',forecast:'6 ദിവസത്തെ പ്രവചനം'},
};

// ── Alert translations ──
const ALERT_T = {
  en: {
    danger:'Critical',warning:'Warning',info:'Advisory',
    "Extreme Heat":"Extreme Heat","Frost Warning":"Frost Warning",
    "Fungal Disease Risk":"Fungal Disease Risk","Strong Winds":"Strong Winds",
    "Heavy Rainfall":"Heavy Rainfall","Thunderstorm":"Thunderstorm",
    "Aphid and Whitefly Risk":"Aphid and Whitefly Risk",
    "Spider Mite Alert":"Spider Mite Alert","Crops at Risk":"Crops at Risk",
  },
  hi: {
    danger:'खतरा',warning:'चेतावनी',info:'सलाह',
    "Extreme Heat":"अत्यधिक गर्मी","Frost Warning":"पाले की चेतावनी",
    "Fungal Disease Risk":"फफूंद रोग का खतरा","Strong Winds":"तेज हवाएं",
    "Heavy Rainfall":"भारी वर्षा","Thunderstorm":"आंधी-तूफान",
    "Aphid and Whitefly Risk":"माहू और सफेद मक्खी का खतरा",
    "Spider Mite Alert":"मकड़ी के कण का अलर्ट","Crops at Risk":"जोखिम में फसलें",
  },
  bn: {
    danger:'বিপদ',warning:'সতর্কতা',info:'পরামর্শ',
    "Extreme Heat":"চরম গরম","Frost Warning":"তুষারপাতের সতর্কতা",
    "Fungal Disease Risk":"ছত্রাক রোগের ঝুঁকি","Strong Winds":"শক্তিশালী বায়ু",
    "Heavy Rainfall":"ভারী বৃষ্টিপাত","Thunderstorm":"বজ্রঝড়",
    "Aphid and Whitefly Risk":"জাব পোকা ও সাদামাছির ঝুঁকি",
    "Spider Mite Alert":"মাকড়সা মাইট সতর্কতা","Crops at Risk":"ঝুঁকিতে ফসল",
  },
  ta: {
    danger:'அபாயம்',warning:'எச்சரிக்கை',info:'ஆலோசனை',
    "Extreme Heat":"அதிக வெப்பம்","Frost Warning":"உறைபனி எச்சரிக்கை",
    "Fungal Disease Risk":"பூஞ்சை நோய் அபாயம்","Strong Winds":"வலிமையான காற்று",
    "Heavy Rainfall":"கனமழை","Thunderstorm":"இடிமழை",
    "Aphid and Whitefly Risk":"அசுவினி மற்றும் வெள்ளை ஈ அபாயம்",
    "Spider Mite Alert":"சிலந்தி பூச்சி எச்சரிக்கை","Crops at Risk":"அபாயத்தில் பயிர்கள்",
  },
  te: {
    danger:'ప్రమాదం',warning:'హెచ్చరిక',info:'సలహా',
    "Extreme Heat":"అధిక వేడి","Frost Warning":"మంచు హెచ్చరిక",
    "Fungal Disease Risk":"శిలీంధ్ర వ్యాధి ప్రమాదం","Strong Winds":"తీవ్రమైన గాలులు",
    "Heavy Rainfall":"భారీ వర్షపాతం","Thunderstorm":"పెనుగాలి తుఫాను",
    "Aphid and Whitefly Risk":"పేను మరియు తెల్ల ఈగ ప్రమాదం",
    "Spider Mite Alert":"సాలీడు పురుగు హెచ్చరిక","Crops at Risk":"ప్రమాదంలో పంటలు",
  },
  mr: {
    danger:'धोका',warning:'सावधानता',info:'सल्ला',
    "Extreme Heat":"अत्यंत उष्णता","Frost Warning":"दंव इशारा",
    "Fungal Disease Risk":"बुरशी रोगाचा धोका","Strong Winds":"जोरदार वारे",
    "Heavy Rainfall":"जड पाऊस","Thunderstorm":"वादळ",
    "Aphid and Whitefly Risk":"मावा आणि पांढरी माशी धोका",
    "Spider Mite Alert":"कोळी माइट अलर्ट","Crops at Risk":"धोक्यात पिके",
  },
  pa: {
    danger:'ਖ਼ਤਰਾ',warning:'ਚੇਤਾਵਨੀ',info:'ਸਲਾਹ',
    "Extreme Heat":"ਬਹੁਤ ਜ਼ਿਆਦਾ ਗਰਮੀ","Frost Warning":"ਪਾਲੇ ਦੀ ਚੇਤਾਵਨੀ",
    "Fungal Disease Risk":"ਫੰਗਲ ਬਿਮਾਰੀ ਦਾ ਖ਼ਤਰਾ","Strong Winds":"ਤੇਜ਼ ਹਵਾਵਾਂ",
    "Heavy Rainfall":"ਭਾਰੀ ਬਾਰਿਸ਼","Thunderstorm":"ਤੂਫ਼ਾਨ",
    "Aphid and Whitefly Risk":"ਮਾਹੂ ਅਤੇ ਚਿੱਟੀ ਮੱਖੀ ਦਾ ਖ਼ਤਰਾ",
    "Spider Mite Alert":"ਮੱਕੜੀ ਦੇ ਕੀੜੇ ਦੀ ਚੇਤਾਵਨੀ","Crops at Risk":"ਖ਼ਤਰੇ ਵਿੱਚ ਫ਼ਸਲਾਂ",
  },
  gu: {
    danger:'ખતરો',warning:'ચેતવણી',info:'સલાહ',
    "Extreme Heat":"અત્યંત ગરમી","Frost Warning":"હિમ ચેતવણી",
    "Fungal Disease Risk":"ફૂગ રોગ ખતરો","Strong Winds":"ઝડપી પવન",
    "Heavy Rainfall":"ભારે વરસાદ","Thunderstorm":"વાવાઝોડું",
    "Aphid and Whitefly Risk":"માઇટ અને સફેદ માખી ખતરો",
    "Spider Mite Alert":"સ્પાઇડર માઇટ ચેતવણી","Crops at Risk":"ખતરામાં પાક",
  },
  kn: {
    danger:'ಅಪಾಯ',warning:'ಎಚ್ಚರಿಕೆ',info:'ಸಲಹೆ',
    "Extreme Heat":"ಅತಿಯಾದ ಶಾಖ","Frost Warning":"ಹಿಮ ಎಚ್ಚರಿಕೆ",
    "Fungal Disease Risk":"ಶಿಲೀಂಧ್ರ ರೋಗ ಅಪಾಯ","Strong Winds":"ಬಲವಾದ ಗಾಳಿ",
    "Heavy Rainfall":"ಭಾರೀ ಮಳೆ","Thunderstorm":"ಗುಡುಗು ಚಂಡಮಾರುತ",
    "Aphid and Whitefly Risk":"ರಸ ಹೀರುವ ಕೀಟ ಅಪಾಯ",
    "Spider Mite Alert":"ಜೇಡ ಮಿಟೆ ಎಚ್ಚರಿಕೆ","Crops at Risk":"ಅಪಾಯದಲ್ಲಿ ಬೆಳೆಗಳು",
  },
  ml: {
    danger:'അപകടം',warning:'മുന്നറിയിപ്പ്',info:'ഉപദേശം',
    "Extreme Heat":"അതിശക്തമായ ചൂട്","Frost Warning":"മഞ്ഞ് മുന്നറിയിപ്പ്",
    "Fungal Disease Risk":"കുമിൾ രോഗ അപകടം","Strong Winds":"ശക്തമായ കാറ്റ്",
    "Heavy Rainfall":"കനത്ത മഴ","Thunderstorm":"ഇടിമിന്നൽ കൊടുങ്കാറ്റ്",
    "Aphid and Whitefly Risk":"അഫിഡ്, വൈറ്റ്ഫ്ലൈ അപകടം",
    "Spider Mite Alert":"ചിലന്തി കീടം മുന്നറിയിപ്പ്","Crops at Risk":"അപകടത്തിലുള്ള വിളകൾ",
  },
};

// ── Soil tip translations ──
const SOIL_T = {
  en: {
    "Drainage Important":"Drainage Important",
    "Green Manure":"Green Manure",
    "Soil Testing":"Soil Testing",
    "Deep Ploughing":"Deep Ploughing",
    "Phosphorus Application":"Phosphorus Application",
    "Residue Management":"Residue Management",
    "Mulching Essential":"Mulching Essential",
    "Early Morning Irrigation":"Early Morning Irrigation",
    "Micronutrients":"Micronutrients",
    "Fungal Disease Alert":"Fungal Disease Alert",
    "Heat Stress Warning":"Heat Stress Warning",
  },
  hi: {
    "Drainage Important":"जल निकासी जरूरी",
    "Green Manure":"हरी खाद",
    "Soil Testing":"मिट्टी परीक्षण",
    "Deep Ploughing":"गहरी जुताई",
    "Phosphorus Application":"फास्फोरस का उपयोग",
    "Residue Management":"फसल अवशेष प्रबंधन",
    "Mulching Essential":"मल्चिंग जरूरी",
    "Early Morning Irrigation":"सुबह सिंचाई",
    "Micronutrients":"सूक्ष्म पोषक तत्व",
    "Fungal Disease Alert":"फफूंद रोग अलर्ट",
    "Heat Stress Warning":"गर्मी तनाव चेतावनी",
  },
  bn: {
    "Drainage Important":"নিষ্কাশন গুরুত্বপূর্ণ",
    "Green Manure":"সবুজ সার",
    "Soil Testing":"মাটি পরীক্ষা",
    "Deep Ploughing":"গভীর চাষ",
    "Phosphorus Application":"ফসফরাস প্রয়োগ",
    "Residue Management":"অবশিষ্ট ব্যবস্থাপনা",
    "Mulching Essential":"মালচিং জরুরি",
    "Early Morning Irrigation":"সকালে সেচ",
    "Micronutrients":"অণু পুষ্টি",
    "Fungal Disease Alert":"ছত্রাক রোগ সতর্কতা",
    "Heat Stress Warning":"তাপ চাপ সতর্কতা",
  },
  ta: {"Drainage Important":"வடிகால் முக்கியம்","Green Manure":"பசுந்தாள் உரம்","Soil Testing":"மண் பரிசோதனை","Deep Ploughing":"ஆழ உழவு","Phosphorus Application":"பாஸ்பரஸ் பயன்பாடு","Residue Management":"எச்சம் மேலாண்மை","Mulching Essential":"மல்சிங் அவசியம்","Early Morning Irrigation":"காலை நீர்ப்பாசனம்","Micronutrients":"நுண்ணூட்டச்சத்துகள்","Fungal Disease Alert":"பூஞ்சை நோய் எச்சரிக்கை","Heat Stress Warning":"வெப்ப அழுத்த எச்சரிக்கை"},
  te: {"Drainage Important":"డ్రైనేజ్ ముఖ్యం","Green Manure":"పచ్చిరొట్ట ఎరువు","Soil Testing":"నేల పరీక్ష","Deep Ploughing":"లోతు దున్నడం","Phosphorus Application":"ఫాస్ఫరస్ వినియోగం","Residue Management":"అవశేష నిర్వహణ","Mulching Essential":"మల్చింగ్ అవసరం","Early Morning Irrigation":"ఉదయం నీటి పారుదల","Micronutrients":"సూక్ష్మ పోషకాలు","Fungal Disease Alert":"శిలీంధ్ర వ్యాధి హెచ్చరిక","Heat Stress Warning":"వేడి ఒత్తిడి హెచ్చరిక"},
  mr: {"Drainage Important":"निचरा महत्त्वाचा","Green Manure":"हिरवळीचे खत","Soil Testing":"माती परीक्षण","Deep Ploughing":"खोल नांगरणी","Phosphorus Application":"फॉस्फरस वापर","Residue Management":"अवशेष व्यवस्थापन","Mulching Essential":"आच्छादन आवश्यक","Early Morning Irrigation":"सकाळी सिंचन","Micronutrients":"सूक्ष्म पोषक","Fungal Disease Alert":"बुरशी रोग सूचना","Heat Stress Warning":"उष्णता ताण इशारा"},
  pa: {"Drainage Important":"ਨਿਕਾਸੀ ਜ਼ਰੂਰੀ","Green Manure":"ਹਰੀ ਖਾਦ","Soil Testing":"ਮਿੱਟੀ ਪਰੀਖਣ","Deep Ploughing":"ਡੂੰਘੀ ਵਾਹੀ","Phosphorus Application":"ਫਾਸਫੋਰਸ ਵਰਤੋਂ","Residue Management":"ਬਚੇ-ਖੁਚੇ ਦਾ ਪ੍ਰਬੰਧ","Mulching Essential":"ਮਲਚਿੰਗ ਜ਼ਰੂਰੀ","Early Morning Irrigation":"ਸਵੇਰੇ ਸਿੰਚਾਈ","Micronutrients":"ਸੂਖਮ ਪੌਸ਼ਟਿਕ","Fungal Disease Alert":"ਫੰਗਲ ਰੋਗ ਚੇਤਾਵਨੀ","Heat Stress Warning":"ਗਰਮੀ ਤਣਾਅ ਚੇਤਾਵਨੀ"},
  gu: {"Drainage Important":"નિકાલ જરૂરી","Green Manure":"લીલો ખાતર","Soil Testing":"માટી પરીક્ષણ","Deep Ploughing":"ઊંડી ખેડ","Phosphorus Application":"ફોસ્ફરસ ઉપયોગ","Residue Management":"અવશેષ વ્યવસ્થાપન","Mulching Essential":"મલ્ચિંગ જરૂરી","Early Morning Irrigation":"સવારે સિંચાઈ","Micronutrients":"સૂક્ષ્મ પોષક","Fungal Disease Alert":"ફૂગ રોગ ચેતવણી","Heat Stress Warning":"ગરમી તણાવ ચેતવણી"},
  kn: {"Drainage Important":"ನೀರು ಬಸಿಯುವಿಕೆ ಮುಖ್ಯ","Green Manure":"ಹಸಿರೆಲೆ ಗೊಬ್ಬರ","Soil Testing":"ಮಣ್ಣು ಪರೀಕ್ಷೆ","Deep Ploughing":"ಆಳ ಉಳುಮೆ","Phosphorus Application":"ರಂಜಕ ಬಳಕೆ","Residue Management":"ಉಳಿಕೆ ನಿರ್ವಹಣೆ","Mulching Essential":"ಮಲ್ಚಿಂಗ್ ಅಗತ್ಯ","Early Morning Irrigation":"ಬೆಳಗ್ಗೆ ನೀರಾವರಿ","Micronutrients":"ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು","Fungal Disease Alert":"ಶಿಲೀಂಧ್ರ ರೋಗ ಎಚ್ಚರಿಕೆ","Heat Stress Warning":"ಶಾಖ ಒತ್ತಡ ಎಚ್ಚರಿಕೆ"},
  ml: {"Drainage Important":"ഡ്രെയ്‌നേജ് പ്രധാനം","Green Manure":"ഹരിത വളം","Soil Testing":"മണ്ണ് പരിശോധന","Deep Ploughing":"ആഴത്തിൽ ഉഴുതിടൽ","Phosphorus Application":"ഫോസ്ഫറസ് ഉപയോഗം","Residue Management":"അവശിഷ്ട മാനേജ്‌മെന്റ്","Mulching Essential":"മൾച്ചിംഗ് അത്യാവശ്യം","Early Morning Irrigation":"രാവിലെ ജലസേചനം","Micronutrients":"സൂക്ഷ്മ പോഷകങ്ങൾ","Fungal Disease Alert":"കുമിൾ രോഗ മുന്നറിയിപ്പ്","Heat Stress Warning":"ചൂട് സമ്മർദ്ദ മുന്നറിയിപ്പ്"},
};

// ── Pest name translations ──
const PEST_T = {
  en: {"Brown Plant Hopper":"Brown Plant Hopper","Leaf folder":"Leaf Folder","Aphids":"Aphids","Yellow rust":"Yellow Rust","Fall Armyworm":"Fall Armyworm","Bollworm":"Bollworm","Whitefly":"Whitefly","Early Blight":"Early Blight","Thrips":"Thrips"},
  hi: {"Brown Plant Hopper":"भूरा पौधा हॉपर","Leaf folder":"पत्ती मोड़क","Aphids":"माहू/चेपा","Yellow rust":"पीला रस्ट","Fall Armyworm":"फॉल आर्मीवर्म","Bollworm":"बॉलवर्म","Whitefly":"सफेद मक्खी","Early Blight":"अगेती झुलसा","Thrips":"थ्रिप्स"},
  bn: {"Brown Plant Hopper":"বাদামী ধানের হপার","Leaf folder":"পাতা মোড়ক","Aphids":"জাব পোকা","Yellow rust":"হলুদ মরিচা","Fall Armyworm":"ফল আর্মিওয়ার্ম","Bollworm":"বলওয়ার্ম","Whitefly":"সাদামাছি","Early Blight":"আগাম ধসা","Thrips":"থ্রিপস"},
  ta: {"Brown Plant Hopper":"பழுப்பு நெல் தாவல்","Leaf folder":"இலை மடிப்பான்","Aphids":"அசுவினி","Yellow rust":"மஞ்சள் துரு","Fall Armyworm":"கவலை படை புழு","Bollworm":"காய் புழு","Whitefly":"வெள்ளை ஈ","Early Blight":"முன் கருகல்","Thrips":"தம்மட்டை"},
  te: {"Brown Plant Hopper":"గోధుమ మొక్క దూటి","Leaf folder":"ఆకు మడత","Aphids":"పేను","Yellow rust":"పసుపు తుప్పు","Fall Armyworm":"ఆర్మీవర్మ్","Bollworm":"పత్తి గొంగళి","Whitefly":"తెల్ల ఈగ","Early Blight":"ముందు తుంటరి","Thrips":"థ్రిప్స్"},
  mr: {"Brown Plant Hopper":"तपकिरी वनस्पती हॉपर","Leaf folder":"पान गुंडाळणारा","Aphids":"मावा","Yellow rust":"पिवळा गंज","Fall Armyworm":"फॉल आर्मीवर्म","Bollworm":"बोंड अळी","Whitefly":"पांढरी माशी","Early Blight":"लवकर करपा","Thrips":"फुलकिडे"},
  pa: {"Brown Plant Hopper":"ਭੂਰਾ ਪੌਦਾ ਹੌਪਰ","Leaf folder":"ਪੱਤਾ ਮੋੜਨ ਵਾਲਾ","Aphids":"ਮਾਹੂ","Yellow rust":"ਪੀਲਾ ਕਾਂਗਿਆਰੀ","Fall Armyworm":"ਫਾਲ ਆਰਮੀਵਰਮ","Bollworm":"ਟਿੰਡਾ ਕੀੜਾ","Whitefly":"ਚਿੱਟੀ ਮੱਖੀ","Early Blight":"ਛੇਤੀ ਝੁਲਸ","Thrips":"ਥ੍ਰਿਪਸ"},
  gu: {"Brown Plant Hopper":"ભૂરો પ્લાન્ટ હૉપર","Leaf folder":"પાંદડા મોડનાર","Aphids":"માઈટ","Yellow rust":"પીળો ગેરૂ","Fall Armyworm":"ફૉલ આર્મીવર્મ","Bollworm":"ભૂળ","Whitefly":"સફેદ માખી","Early Blight":"વહેલો ખારો","Thrips":"ચૂસિયા"},
  kn: {"Brown Plant Hopper":"ಕಂದು ಸಸ್ಯ ಹಾಪರ್","Leaf folder":"ಎಲೆ ಸುರುಳಿ","Aphids":"ರಸ ಹೀರುವ ಕೀಟ","Yellow rust":"ಹಳದಿ ತುಕ್ಕು","Fall Armyworm":"ಫಾಲ್ ಆರ್ಮಿವರ್ಮ್","Bollworm":"ಕಾಯಿ ಹುಳ","Whitefly":"ಬಿಳಿ ನೊಣ","Early Blight":"ಮೊದಲ ರೋಗ","Thrips":"ಥ್ರಿಪ್ಸ್"},
  ml: {"Brown Plant Hopper":"തവിട്ട് ചാടി","Leaf folder":"ഇല മടക്കി","Aphids":"മൂട് പേൻ","Yellow rust":"മഞ്ഞ ക്ഷയം","Fall Armyworm":"ഫാൾ ആർമിവോം","Bollworm":"ബോൾവോം","Whitefly":"വെള്ള ഈച്ച","Early Blight":"നേരത്തെ കരിച്ചിൽ","Thrips":"ത്രിപ്സ്"},
};

// ── Market labels ──
const MARKET_T = {
  en: {above_msp:'Above MSP',below_msp:'Below MSP',per_quintal:'per quintal',msp:'MSP',demand:'Demand',price_up:'Price Up',price_down:'Price Down',live:'LIVE',indicative:'INDICATIVE'},
  hi: {above_msp:'MSP से ऊपर',below_msp:'MSP से नीचे',per_quintal:'प्रति क्विंटल',msp:'न्यूनतम समर्थन मूल्य',demand:'मांग',price_up:'भाव बढ़ा',price_down:'भाव गिरा',live:'लाइव',indicative:'अनुमानित'},
  bn: {above_msp:'MSP এর উপরে',below_msp:'MSP এর নিচে',per_quintal:'প্রতি কুইন্টাল',msp:'ন্যূনতম সমর্থন মূল্য',demand:'চাহিদা',price_up:'দাম বাড়ল',price_down:'দাম কমল',live:'লাইভ',indicative:'আনুমানিক'},
  ta: {above_msp:'MSP க்கு மேல்',below_msp:'MSP க்கு கீழ்',per_quintal:'குவிண்டால் ஒன்றுக்கு',msp:'குறைந்தபட்ச ஆதரவு விலை',demand:'தேவை',price_up:'விலை உயர்வு',price_down:'விலை குறைவு',live:'நேரடி',indicative:'தோராயமான'},
  te: {above_msp:'MSP పైన',below_msp:'MSP కింద',per_quintal:'క్వింటాలుకు',msp:'కనీస మద్దతు ధర',demand:'డిమాండ్',price_up:'ధర పెరిగింది',price_down:'ధర తగ్గింది',live:'లైవ్',indicative:'సూచికగా'},
  mr: {above_msp:'MSP पेक्षा जास्त',below_msp:'MSP पेक्षा कमी',per_quintal:'प्रति क्विंटल',msp:'किमान आधारभूत किंमत',demand:'मागणी',price_up:'भाव वाढला',price_down:'भाव घसरला',live:'थेट',indicative:'अंदाजे'},
  pa: {above_msp:'MSP ਤੋਂ ਉੱਪਰ',below_msp:'MSP ਤੋਂ ਹੇਠਾਂ',per_quintal:'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',msp:'ਘੱਟੋ-ਘੱਟ ਸਮਰਥਨ ਮੁੱਲ',demand:'ਮੰਗ',price_up:'ਭਾਅ ਵਧਿਆ',price_down:'ਭਾਅ ਘਟਿਆ',live:'ਲਾਈਵ',indicative:'ਅਨੁਮਾਨਿਤ'},
  gu: {above_msp:'MSP ઉપર',below_msp:'MSP નીચે',per_quintal:'પ્રતિ ક્વિન્ટલ',msp:'લઘુત્તમ ટેકાના ભાવ',demand:'માંગ',price_up:'ભાવ વધ્યો',price_down:'ભાવ ઘટ્યો',live:'લાઈવ',indicative:'અંદાજિત'},
  kn: {above_msp:'MSP ಮೇಲೆ',below_msp:'MSP ಕೆಳಗೆ',per_quintal:'ಕ್ವಿಂಟಾಲ್‌ಗೆ',msp:'ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ',demand:'ಬೇಡಿಕೆ',price_up:'ಬೆಲೆ ಏರಿತು',price_down:'ಬೆಲೆ ಇಳಿಯಿತು',live:'ನೇರ',indicative:'ಸೂಚಕ'},
  ml: {above_msp:'MSP ൽ കൂടുതൽ',below_msp:'MSP ൽ കുറവ്',per_quintal:'ക്വിന്റലിന്',msp:'കുറഞ്ഞ താങ്ങുവില',demand:'ഡിമാൻഡ്',price_up:'വില ഉയർന്നു',price_down:'വില കുറഞ്ഞു',live:'തത്സമയം',indicative:'ഏകദേശം'},
};

// ── Helper functions ──
function getCropName(name) {
  return (CROP_NAMES[currentLang] || CROP_NAMES.en)[name] || name;
}
function getCropDesc(name) {
  return (CROP_DESC[currentLang] || CROP_DESC.en)[name] || (CROP_DESC.en)[name] || '';
}
function getSeason(key) {
  return (SEASON_T[currentLang] || SEASON_T.en)[key] || key;
}
function getWeatherT(key) {
  return (WEATHER_T[currentLang] || WEATHER_T.en)[key] || (WEATHER_T.en)[key] || key;
}
function getAlertT(key) {
  return (ALERT_T[currentLang] || ALERT_T.en)[key] || (ALERT_T.en)[key] || key;
}
function getSoilT(key) {
  return (SOIL_T[currentLang] || SOIL_T.en)[key] || (SOIL_T.en)[key] || key;
}
function getPestT(key) {
  return (PEST_T[currentLang] || PEST_T.en)[key] || (PEST_T.en)[key] || key;
}
function getMarketT(key) {
  return (MARKET_T[currentLang] || MARKET_T.en)[key] || (MARKET_T.en)[key] || key;
}

// ── Static UI translations ──
const T = {
  en: {
    nav_home:'Home',nav_diagnose:'Diagnose',nav_market:'Mandi Prices',nav_alerts:'Alerts',
    hero_title:'Smart Farming Intelligence',hero_sub:'Weather · Crops · Disease · Market Prices',hero_badge:'AI Powered Farming',
    btn_location:'Get My Location',btn_diagnose:'Diagnose Crop',
    quick_diagnose_title:'Diagnose Crop Disease',quick_diagnose_sub:'Take a photo — AI finds disease instantly',
    quick_market_title:"Today's Mandi Prices",quick_market_sub:'15 crops across 20 cities with MSP',
    quick_alerts_title:'Weather Alerts',quick_alerts_sub:'Pest and weather warnings for your area',
    weather_title:'Current Weather',weather_sub:'Live data from your location',
    forecast_title:'6-Day Forecast',rain_title:'Will It Rain Today?',rain_sub:'Rain forecast for today and tomorrow',
    crops_title:'Best Crops for You',pest_title:'Pest Control Guide',pest_sub:'Safe and effective crop protection',
    soil_title:'Soil Health Tips',soil_sub:'Season-specific soil care advice',
    footer_text:"Helping India's farmers with AI",footer_copy:'© 2025 SmartAgro. Made for Indian farmers.',
    diagnose_hero_title:'Crop Disease Detector',diagnose_hero_sub:'Take a photo — AI tells you what is wrong',
    upload_title:'Drop crop photo here',upload_sub:'JPG, PNG, WEBP — max 10 MB',
    btn_upload:'Upload Photo',btn_camera:'Take Photo',btn_analyze:'Analyze Crop',
    tips_title:'Tips for Best Results',tip1:'Focus on most affected leaf or stem',
    tip2:'Use daylight — avoid dark photos',tip3:'Get close — 30 to 50 cm',
    tip4:'Include both healthy and sick parts',
    results_placeholder_title:'Upload a photo to start',results_placeholder_sub:'AI will identify disease and suggest treatment',
    step1_title:'Take a Photo',step1_sub:'Clear photo of affected crop',
    step2_title:'AI Checks It',step2_sub:'Kindwise AI finds the exact disease',
    step3_title:'Get Treatment',step3_sub:'Organic and chemical treatment options',
    market_hero_title:'Mandi Prices Today',market_hero_sub:'15 crops · 20 cities · MSP comparison',
    search_placeholder:'Search city (Delhi, Patna, Mumbai...)',btn_search:'Search',
    filter_all:'All',filter_high:'High Demand',filter_rising:'Rising',filter_falling:'Falling',
    market_title:'Prices by City',market_sub:'All major Indian markets',
    chart_title:'Price Trend',chart_sub:'Price vs MSP by city',
    table_title:'Price Comparison',table_sub:'₹/quintal across cities',
    alerts_hero_title:'Farm Alert Center',alerts_hero_sub:'Weather warnings, pest alerts and crop safety',
    location_title:'Allow Location for Alerts',location_sub:'We need your location to show alerts for your area',
    btn_location_enable:'Enable Location',
    filter_all_alerts:'All',filter_danger:'Critical',filter_warning:'Warnings',
    filter_advisory:'Advisory',filter_weather:'Weather',filter_pest:'Pest',
    no_alerts_title:'All Clear! No Active Alerts',no_alerts_sub:'Weather is good for farming in your area',
    pest_calendar_title:'Seasonal Pest Calendar',pest_calendar_sub:'Pests active this season',
    harmful_title:'Risky Crops Right Now',harmful_sub:'Avoid growing these in current weather',
    safe_title:'Safe to Grow Now',safe_sub:'These crops suit current weather',
    chatbot_title:'Kisan Helper',chatbot_sub:'Ask in any language',
    chat_placeholder:'Type or speak...',helpline:'Kisan Helpline',
    stat_temp:'Temperature',stat_humidity:'Humidity',stat_wind:'Wind',
    stat_visibility:'Visibility',stat_pressure:'Pressure',install_app:'Install App',
  },
  hi: {
    nav_home:'होम',nav_diagnose:'फसल जांच',nav_market:'मंडी भाव',nav_alerts:'अलर्ट',
    hero_title:'स्मार्ट खेती सहायक',hero_sub:'मौसम · फसल · रोग · मंडी भाव',hero_badge:'AI से खेती मदद',
    btn_location:'मेरी लोकेशन लें',btn_diagnose:'फसल जांचें',
    quick_diagnose_title:'फसल बीमारी जांचें',quick_diagnose_sub:'फोटो लो — AI तुरंत बताएगा',
    quick_market_title:'आज के मंडी भाव',quick_market_sub:'15 फसल, 20 शहर — MSP के साथ',
    quick_alerts_title:'मौसम अलर्ट',quick_alerts_sub:'कीड़े और मौसम की चेतावनी',
    weather_title:'अभी का मौसम',weather_sub:'आपकी जगह का लाइव मौसम',
    forecast_title:'अगले 6 दिन',rain_title:'क्या आज बारिश होगी?',rain_sub:'आज और कल का बारिश अनुमान',
    crops_title:'आपके लिए बेस्ट फसल',pest_title:'कीड़ों से फसल बचाओ',pest_sub:'सुरक्षित फसल सुरक्षा',
    soil_title:'मिट्टी की देखभाल',soil_sub:'मौसम के हिसाब से मिट्टी की सलाह',
    footer_text:'India के किसानों की AI से मदद',footer_copy:'© 2025 SmartAgro. किसानों के लिए।',
    diagnose_hero_title:'फसल बीमारी डिटेक्टर',diagnose_hero_sub:'बीमार फसल की फोटो लो — AI बताएगा',
    upload_title:'फसल की फोटो यहाँ डालें',upload_sub:'JPG, PNG, WEBP — max 10 MB',
    btn_upload:'फोटो अपलोड',btn_camera:'फोटो लो',btn_analyze:'फसल जांचें',
    tips_title:'अच्छी फोटो के टिप्स',tip1:'सबसे बीमार पत्ती दिखाएं',
    tip2:'धूप में फोटो लें',tip3:'करीब से लो — 30-50 cm',
    tip4:'ठीक और बीमार दोनों दिखाएं',
    results_placeholder_title:'फोटो अपलोड करें',results_placeholder_sub:'AI बीमारी ढूंढ कर इलाज बताएगा',
    step1_title:'फोटो लो',step1_sub:'बीमार फसल की साफ फोटो',
    step2_title:'AI जांच करता है',step2_sub:'Kindwise AI सही बीमारी ढूंढता है',
    step3_title:'इलाज पाएं',step3_sub:'जैविक और रासायनिक इलाज',
    market_hero_title:'आज के मंडी भाव',market_hero_sub:'15 फसल · 20 शहर · MSP तुलना',
    search_placeholder:'शहर खोजें (Delhi, Patna, Mumbai...)',btn_search:'खोजें',
    filter_all:'सब',filter_high:'ज्यादा माँग',filter_rising:'भाव बढ़ रहा',filter_falling:'भाव गिर रहा',
    market_title:'शहर के हिसाब से भाव',market_sub:'सभी बड़े मंडियों के भाव',
    chart_title:'भाव का ग्राफ',chart_sub:'शहर के हिसाब से भाव vs MSP',
    table_title:'भाव तुलना',table_sub:'₹/क्विंटल — अलग-अलग शहर',
    alerts_hero_title:'Farm Alert Center',alerts_hero_sub:'मौसम चेतावनी और कीड़े अलर्ट',
    location_title:'Location की जरूरत है',location_sub:'आपके इलाके के alerts के लिए',
    btn_location_enable:'Location दें',
    filter_all_alerts:'सब',filter_danger:'खतरे',filter_warning:'चेतावनी',
    filter_advisory:'सलाह',filter_weather:'मौसम',filter_pest:'कीड़े',
    no_alerts_title:'सब ठीक! कोई Alert नहीं',no_alerts_sub:'मौसम अच्छा है',
    pest_calendar_title:'मौसमी कीड़े Calendar',pest_calendar_sub:'इस season में active कीड़े',
    harmful_title:'अभी जोखिम वाली फसलें',harmful_sub:'इन्हें अभी मत उगाएं',
    safe_title:'अभी उगाने के लिए Safe फसलें',safe_sub:'ये आपके मौसम के लिए ठीक हैं',
    chatbot_title:'किसान सहायक',chatbot_sub:'किसी भी भाषा में पूछें',
    chat_placeholder:'लिखें या बोलें...',helpline:'किसान हेल्पलाइन',
    stat_temp:'तापमान',stat_humidity:'आर्द्रता',stat_wind:'हवा',
    stat_visibility:'दृश्यता',stat_pressure:'दबाव',install_app:'App इंस्टॉल करें',
  },
  bn: {
    nav_home:'হোম',nav_diagnose:'ফসল নির্ণয়',nav_market:'বাজার মূল্য',nav_alerts:'সতর্কতা',
    hero_title:'স্মার্ট কৃষি সহায়তা',hero_sub:'আবহাওয়া · ফসল · রোগ · বাজার',hero_badge:'AI কৃষি সহায়তা',
    btn_location:'আমার অবস্থান',btn_diagnose:'ফসল পরীক্ষা',
    quick_diagnose_title:'ফসল রোগ নির্ণয়',quick_diagnose_sub:'ছবি তুলুন — AI বলবে',
    quick_market_title:'আজকের বাজার মূল্য',quick_market_sub:'১৫ ফসল, ২০ শহর',
    quick_alerts_title:'আবহাওয়া সতর্কতা',quick_alerts_sub:'কীটপতঙ্গ ও আবহাওয়া সতর্কতা',
    weather_title:'বর্তমান আবহাওয়া',weather_sub:'আপনার অবস্থানের তথ্য',
    forecast_title:'৬ দিনের পূর্বাভাস',rain_title:'আজ কি বৃষ্টি হবে?',rain_sub:'আজ ও আগামীকালের পূর্বাভাস',
    crops_title:'আপনার জন্য সেরা ফসল',pest_title:'কীটনাশক গাইড',pest_sub:'নিরাপদ ফসল সুরক্ষা',
    soil_title:'মাটির যত্ন',soil_sub:'মৌসুম অনুযায়ী পরামর্শ',
    footer_text:'AI দিয়ে ভারতীয় কৃষকদের সাহায্য',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'ফসল রোগ সনাক্তকারী',diagnose_hero_sub:'ছবি তুলুন — AI বলবে কী সমস্যা',
    upload_title:'ফসলের ছবি এখানে রাখুন',upload_sub:'JPG, PNG, WEBP — সর্বোচ্চ 10 MB',
    btn_upload:'ছবি আপলোড',btn_camera:'ছবি তুলুন',btn_analyze:'ফসল পরীক্ষা করুন',
    tips_title:'সেরা ছবির টিপস',
    market_hero_title:'আজকের বাজার মূল্য',market_hero_sub:'১৫ ফসল · ২০ শহর · MSP তুলনা',
    search_placeholder:'শহর খুঁজুন',btn_search:'খুঁজুন',
    filter_all:'সব',filter_high:'বেশি চাহিদা',filter_rising:'বাড়ছে',filter_falling:'কমছে',
    market_title:'শহর অনুযায়ী দাম',market_sub:'সব প্রধান বাজার',
    alerts_hero_title:'Farm Alert Center',alerts_hero_sub:'আবহাওয়া সতর্কতা ও কীট অ্যালার্ট',
    location_title:'অবস্থান অনুমতি দিন',location_sub:'আপনার এলাকার অ্যালার্টের জন্য',
    btn_location_enable:'অবস্থান দিন',
    filter_all_alerts:'সব',filter_danger:'বিপদ',filter_warning:'সতর্কতা',
    filter_advisory:'পরামর্শ',filter_weather:'আবহাওয়া',filter_pest:'কীট',
    no_alerts_title:'সব ঠিক আছে!',no_alerts_sub:'আবহাওয়া চাষের জন্য ভালো',
    chatbot_title:'কিসান সহায়ক',chatbot_sub:'যেকোনো ভাষায় জিজ্ঞাসা',
    chat_placeholder:'টাইপ করুন বা বলুন...',helpline:'কিসান হেল্পলাইন',
    stat_temp:'তাপমাত্রা',stat_humidity:'আর্দ্রতা',stat_wind:'বায়ু',stat_visibility:'দৃশ্যমানতা',stat_pressure:'চাপ',
  },
  ta: {
    nav_home:'முகப்பு',nav_diagnose:'பயிர் நோய்',nav_market:'சந்தை விலை',nav_alerts:'எச்சரிக்கை',
    hero_title:'ஸ்மார்ட் விவசாய உதவி',hero_sub:'வானிலை · பயிர் · நோய் · சந்தை',hero_badge:'AI விவசாய உதவி',
    btn_location:'என் இடம்',btn_diagnose:'பயிர் பரிசோதனை',
    quick_diagnose_title:'பயிர் நோய் கண்டறிதல்',quick_diagnose_sub:'படம் எடு — AI சொல்லும்',
    quick_market_title:'இன்றைய சந்தை விலை',quick_market_sub:'15 பயிர், 20 நகரம்',
    quick_alerts_title:'வானிலை எச்சரிக்கை',quick_alerts_sub:'பூச்சி மற்றும் வானிலை எச்சரிக்கை',
    weather_title:'தற்போதைய வானிலை',weather_sub:'உங்கள் இடத்தின் நேரடி தகவல்',
    forecast_title:'6 நாள் முன்னறிவிப்பு',rain_title:'இன்று மழை வருமா?',rain_sub:'இன்று மற்றும் நாளை மழை முன்னறிவிப்பு',
    crops_title:'உங்களுக்கான சிறந்த பயிர்கள்',pest_title:'பூச்சி கட்டுப்பாடு',pest_sub:'பாதுகாப்பான பயிர் பாதுகாப்பு',
    soil_title:'மண் ஆரோக்கிய குறிப்புகள்',soil_sub:'பருவகால மண் பராமரிப்பு',
    footer_text:'AI மூலம் இந்திய விவசாயிகளுக்கு உதவி',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'பயிர் நோய் கண்டுபிடிப்பாளர்',diagnose_hero_sub:'படம் எடு — AI சொல்லும்',
    upload_title:'பயிர் படம் இங்கே போடுங்கள்',upload_sub:'JPG, PNG, WEBP — அதிகபட்சம் 10 MB',
    btn_upload:'படம் பதிவேற்று',btn_camera:'படம் எடு',btn_analyze:'பயிர் பரிசோதனை',
    tips_title:'சிறந்த படத்திற்கான குறிப்புகள்',
    market_hero_title:'இன்றைய மாண்டி விலைகள்',market_hero_sub:'15 பயிர் · 20 நகரம் · MSP ஒப்பீடு',
    search_placeholder:'நகரம் தேடுங்கள்',btn_search:'தேடு',
    filter_all:'அனைத்தும்',filter_high:'அதிக தேவை',filter_rising:'உயர்கிறது',filter_falling:'குறைகிறது',
    market_title:'நகரம் வாரியாக விலை',market_sub:'அனைத்து முக்கிய சந்தைகள்',
    alerts_hero_title:'விவசாய எச்சரிக்கை மையம்',alerts_hero_sub:'வானிலை எச்சரிக்கைகள்',
    location_title:'எச்சரிக்கைக்கு இடம் வேண்டும்',location_sub:'உங்கள் பகுதியின் தகவலுக்கு',
    btn_location_enable:'இடம் கொடுங்கள்',
    filter_all_alerts:'அனைத்தும்',filter_danger:'அபாயம்',filter_warning:'எச்சரிக்கை',
    filter_advisory:'ஆலோசனை',filter_weather:'வானிலை',filter_pest:'பூச்சி',
    no_alerts_title:'எல்லாம் நல்லது!',no_alerts_sub:'வானிலை விவசாயத்திற்கு நல்லது',
    chatbot_title:'கிசான் உதவியாளர்',chatbot_sub:'எந்த மொழியிலும் கேளுங்கள்',
    chat_placeholder:'தட்டச்சு அல்லது பேசுங்கள்...',helpline:'கிசான் உதவி',
    stat_temp:'வெப்பநிலை',stat_humidity:'ஈரப்பதம்',stat_wind:'காற்று',stat_visibility:'தெரிவுத்திறன்',stat_pressure:'அழுத்தம்',
  },
  te: {
    nav_home:'హోమ్',nav_diagnose:'పంట నిర్ధారణ',nav_market:'మార్కెట్ ధరలు',nav_alerts:'హెచ్చరికలు',
    hero_title:'స్మార్ట్ వ్యవసాయ సహాయం',hero_sub:'వాతావరణం · పంట · రోగం · మార్కెట్',hero_badge:'AI వ్యవసాయ సహాయం',
    btn_location:'నా స్థానం',btn_diagnose:'పంట పరీక్ష',
    quick_diagnose_title:'పంట రోగ నిర్ధారణ',quick_diagnose_sub:'ఫోటో తీయి — AI చెప్తుంది',
    quick_market_title:'నేటి మార్కెట్ ధరలు',quick_market_sub:'15 పంటలు, 20 నగరాలు',
    quick_alerts_title:'వాతావరణ హెచ్చరికలు',quick_alerts_sub:'పురుగు మరియు వాతావరణ హెచ్చరికలు',
    weather_title:'ప్రస్తుత వాతావరణం',weather_sub:'మీ స్థానం నుండి నేరుగా',
    forecast_title:'6 రోజుల అంచనా',rain_title:'ఈరోజు వర్షం వస్తుందా?',rain_sub:'ఈరోజు మరియు రేపటి అంచనా',
    crops_title:'మీకు అనుకూలమైన పంటలు',pest_title:'పురుగు నిర్వహణ గైడ్',pest_sub:'సురక్షితమైన పంట రక్షణ',
    soil_title:'నేల ఆరోగ్య చిట్కాలు',soil_sub:'ఋతు-నిర్దిష్ట నేల సంరక్షణ',
    footer_text:'AI తో భారత రైతులకు సహాయం',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'పంట వ్యాధి గుర్తింపు',diagnose_hero_sub:'ఫోటో తీయండి — AI చెప్తుంది',
    upload_title:'పంట ఫోటో ఇక్కడ వేయండి',upload_sub:'JPG, PNG, WEBP — గరిష్ఠం 10 MB',
    btn_upload:'ఫోటో అప్లోడ్',btn_camera:'ఫోటో తీయి',btn_analyze:'పంట పరీక్షించు',
    tips_title:'మంచి ఫోటోకు చిట్కాలు',
    market_hero_title:'నేటి మండి ధరలు',market_hero_sub:'15 పంటలు · 20 నగరాలు · MSP పోలిక',
    search_placeholder:'నగరం వెతకండి',btn_search:'వెతకు',
    filter_all:'అన్నీ',filter_high:'అధిక డిమాండ్',filter_rising:'పెరుగుతోంది',filter_falling:'తగ్గుతోంది',
    market_title:'నగరం వారీగా ధరలు',market_sub:'అన్ని ప్రధాన మండీలు',
    alerts_hero_title:'వ్యవసాయ హెచ్చరిక కేంద్రం',alerts_hero_sub:'వాతావరణ హెచ్చరికలు',
    location_title:'హెచ్చరికలకు స్థానం అవసరం',location_sub:'మీ ప్రాంతం సమాచారానికి',
    btn_location_enable:'స్థానం ఇవ్వండి',
    filter_all_alerts:'అన్నీ',filter_danger:'ప్రమాదం',filter_warning:'హెచ్చరిక',
    filter_advisory:'సలహా',filter_weather:'వాతావరణం',filter_pest:'పురుగులు',
    no_alerts_title:'అన్నీ బాగున్నాయి!',no_alerts_sub:'వాతావరణం వ్యవసాయానికి అనుకూలంగా ఉంది',
    chatbot_title:'కిసాన్ సహాయకుడు',chatbot_sub:'ఏ భాషలోనైనా అడగండి',
    chat_placeholder:'టైప్ చేయండి లేదా మాట్లాడండి...',helpline:'కిసాన్ హెల్ప్‌లైన్',
    stat_temp:'ఉష్ణోగ్రత',stat_humidity:'తేమ',stat_wind:'గాలి',stat_visibility:'దృశ్యమానత',stat_pressure:'పీడనం',
  },
  mr: {
    nav_home:'होम',nav_diagnose:'पीक निदान',nav_market:'बाजारभाव',nav_alerts:'सतर्कता',
    hero_title:'स्मार्ट शेती मदत',hero_sub:'हवामान · पीक · रोग · बाजार',hero_badge:'AI शेती मदत',
    btn_location:'माझे स्थान',btn_diagnose:'पीक तपासा',
    quick_diagnose_title:'पीक रोग निदान',quick_diagnose_sub:'फोटो घ्या — AI सांगेल',
    quick_market_title:'आजचे बाजारभाव',quick_market_sub:'15 पिके, 20 शहरे',
    quick_alerts_title:'हवामान सतर्कता',quick_alerts_sub:'कीड आणि हवामान इशारे',
    weather_title:'सध्याचे हवामान',weather_sub:'तुमच्या ठिकाणाची माहिती',
    forecast_title:'6 दिवसांचा अंदाज',rain_title:'आज पाऊस येणार का?',rain_sub:'आज आणि उद्याचा अंदाज',
    crops_title:'तुमच्यासाठी सर्वोत्तम पिके',pest_title:'कीड नियंत्रण मार्गदर्शक',pest_sub:'सुरक्षित पीक संरक्षण',
    soil_title:'मातीच्या आरोग्याच्या टिप्स',soil_sub:'हंगामानुसार माती काळजी',
    footer_text:'AI सह भारतीय शेतकऱ्यांना मदत',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'पीक रोग शोधक',diagnose_hero_sub:'फोटो घ्या — AI सांगेल',
    upload_title:'पिकाचा फोटो येथे टाका',upload_sub:'JPG, PNG, WEBP — जास्तीत जास्त 10 MB',
    btn_upload:'फोटो अपलोड',btn_camera:'फोटो घ्या',btn_analyze:'पीक तपासा',
    tips_title:'चांगल्या फोटोसाठी टिप्स',
    market_hero_title:'आजचे मंडी भाव',market_hero_sub:'15 पिके · 20 शहरे · MSP तुलना',
    search_placeholder:'शहर शोधा',btn_search:'शोधा',
    filter_all:'सर्व',filter_high:'जास्त मागणी',filter_rising:'भाव वाढत आहे',filter_falling:'भाव घसरत आहे',
    market_title:'शहरानुसार भाव',market_sub:'सर्व प्रमुख मंड्या',
    alerts_hero_title:'शेती अलर्ट केंद्र',alerts_hero_sub:'हवामान इशारे',
    location_title:'अलर्टसाठी स्थान द्या',location_sub:'तुमच्या भागाच्या माहितीसाठी',
    btn_location_enable:'स्थान द्या',
    filter_all_alerts:'सर्व',filter_danger:'धोका',filter_warning:'सावधानता',
    filter_advisory:'सल्ला',filter_weather:'हवामान',filter_pest:'कीड',
    no_alerts_title:'सर्व ठीक आहे!',no_alerts_sub:'हवामान शेतीसाठी चांगले आहे',
    chatbot_title:'किसान मदतनीस',chatbot_sub:'कोणत्याही भाषेत विचारा',
    chat_placeholder:'लिहा किंवा बोला...',helpline:'किसान हेल्पलाइन',
    stat_temp:'तापमान',stat_humidity:'आर्द्रता',stat_wind:'वारा',stat_visibility:'दृश्यमानता',stat_pressure:'दाब',
  },
  pa: {
    nav_home:'ਹੋਮ',nav_diagnose:'ਫਸਲ ਜਾਂਚ',nav_market:'ਮੰਡੀ ਭਾਅ',nav_alerts:'ਚੇਤਾਵਨੀ',
    hero_title:'ਸਮਾਰਟ ਖੇਤੀ ਮਦਦ',hero_sub:'ਮੌਸਮ · ਫਸਲ · ਰੋਗ · ਮੰਡੀ',hero_badge:'AI ਖੇਤੀ ਮਦਦ',
    btn_location:'ਮੇਰੀ ਲੋਕੇਸ਼ਨ',btn_diagnose:'ਫਸਲ ਜਾਂਚੋ',
    quick_diagnose_title:'ਫਸਲ ਰੋਗ ਜਾਂਚ',quick_diagnose_sub:'ਫੋਟੋ ਲਓ — AI ਦੱਸੇਗਾ',
    quick_market_title:'ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ',quick_market_sub:'15 ਫਸਲਾਂ, 20 ਸ਼ਹਿਰ',
    quick_alerts_title:'ਮੌਸਮ ਅਲਰਟ',quick_alerts_sub:'ਕੀੜੇ ਅਤੇ ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ',
    weather_title:'ਹੁਣ ਦਾ ਮੌਸਮ',weather_sub:'ਤੁਹਾਡੀ ਜਗ੍ਹਾ ਦੀ ਜਾਣਕਾਰੀ',
    forecast_title:'6 ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ',rain_title:'ਕੀ ਅੱਜ ਮੀਂਹ ਪਵੇਗਾ?',rain_sub:'ਅੱਜ ਅਤੇ ਕੱਲ੍ਹ ਦਾ ਅਨੁਮਾਨ',
    crops_title:'ਤੁਹਾਡੇ ਲਈ ਵਧੀਆ ਫਸਲਾਂ',pest_title:'ਕੀੜੇ ਕੰਟਰੋਲ ਗਾਈਡ',pest_sub:'ਸੁਰੱਖਿਅਤ ਫਸਲ ਸੁਰੱਖਿਆ',
    soil_title:'ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਟਿਪਸ',soil_sub:'ਮੌਸਮ ਅਨੁਸਾਰ ਮਿੱਟੀ ਦੀ ਦੇਖਭਾਲ',
    footer_text:'AI ਨਾਲ ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'ਫਸਲ ਰੋਗ ਖੋਜਕਰਤਾ',diagnose_hero_sub:'ਫੋਟੋ ਲਓ — AI ਦੱਸੇਗਾ',
    upload_title:'ਫਸਲ ਦੀ ਫੋਟੋ ਇੱਥੇ ਰੱਖੋ',upload_sub:'JPG, PNG, WEBP — ਵੱਧ ਤੋਂ ਵੱਧ 10 MB',
    btn_upload:'ਫੋਟੋ ਅਪਲੋਡ',btn_camera:'ਫੋਟੋ ਲਓ',btn_analyze:'ਫਸਲ ਜਾਂਚੋ',
    tips_title:'ਚੰਗੀ ਫੋਟੋ ਲਈ ਟਿਪਸ',
    market_hero_title:'ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ',market_hero_sub:'15 ਫਸਲਾਂ · 20 ਸ਼ਹਿਰ · MSP ਤੁਲਨਾ',
    search_placeholder:'ਸ਼ਹਿਰ ਲੱਭੋ',btn_search:'ਲੱਭੋ',
    filter_all:'ਸਭ',filter_high:'ਵੱਧ ਮੰਗ',filter_rising:'ਭਾਅ ਵਧ ਰਿਹਾ',filter_falling:'ਭਾਅ ਘਟ ਰਿਹਾ',
    market_title:'ਸ਼ਹਿਰ ਅਨੁਸਾਰ ਭਾਅ',market_sub:'ਸਾਰੀਆਂ ਪ੍ਰਮੁੱਖ ਮੰਡੀਆਂ',
    alerts_hero_title:'ਖੇਤੀ ਅਲਰਟ ਕੇਂਦਰ',alerts_hero_sub:'ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ',
    location_title:'ਅਲਰਟ ਲਈ ਲੋਕੇਸ਼ਨ ਦਿਓ',location_sub:'ਤੁਹਾਡੇ ਇਲਾਕੇ ਦੀ ਜਾਣਕਾਰੀ ਲਈ',
    btn_location_enable:'ਲੋਕੇਸ਼ਨ ਦਿਓ',
    filter_all_alerts:'ਸਭ',filter_danger:'ਖ਼ਤਰਾ',filter_warning:'ਚੇਤਾਵਨੀ',
    filter_advisory:'ਸਲਾਹ',filter_weather:'ਮੌਸਮ',filter_pest:'ਕੀੜੇ',
    no_alerts_title:'ਸਭ ਠੀਕ ਹੈ!',no_alerts_sub:'ਮੌਸਮ ਖੇਤੀ ਲਈ ਚੰਗਾ ਹੈ',
    chatbot_title:'ਕਿਸਾਨ ਸਹਾਇਕ',chatbot_sub:'ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੁੱਛੋ',
    chat_placeholder:'ਲਿਖੋ ਜਾਂ ਬੋਲੋ...',helpline:'ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ',
    stat_temp:'ਤਾਪਮਾਨ',stat_humidity:'ਨਮੀ',stat_wind:'ਹਵਾ',stat_visibility:'ਦਿੱਖ',stat_pressure:'ਦਬਾਅ',
  },
  gu: {
    nav_home:'હોમ',nav_diagnose:'પાક નિદાન',nav_market:'બજાર ભાવ',nav_alerts:'ચેતવણી',
    hero_title:'સ્માર્ટ ખેતી મદદ',hero_sub:'હવામાન · પાક · રોગ · બજાર',hero_badge:'AI ખેતી મદદ',
    btn_location:'મારી સ્થિતિ',btn_diagnose:'પાક તપાસો',
    quick_diagnose_title:'પાક રોગ નિદાન',quick_diagnose_sub:'ફોટો લો — AI કહેશે',
    quick_market_title:'આજના બજાર ભાવ',quick_market_sub:'15 પાક, 20 શહેર',
    quick_alerts_title:'હવામાન ચેતવણી',quick_alerts_sub:'જીવાત અને હવામાન ચેતવણીઓ',
    weather_title:'હાલનું હવામાન',weather_sub:'તમારી જગ્યાની માહિતી',
    forecast_title:'6 દિવસની આગાહી',rain_title:'આજ વરસાદ પડશે?',rain_sub:'આજ અને કાલ ની આગાહી',
    crops_title:'તમારા માટે શ્રેષ્ઠ પાક',pest_title:'જીવાત નિયંત્રણ ગાઈડ',pest_sub:'સલામત પાક સુરક્ષા',
    soil_title:'માટીની તંદુરસ્તી ટીપ્સ',soil_sub:'ઋતુ અનુસાર માટી સંભાળ',
    footer_text:'AI સાથે ભારતીય ખેડૂતોને મદદ',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'પાક રોગ શોધક',diagnose_hero_sub:'ફોટો લો — AI કહેશે',
    upload_title:'પાકનો ફોટો અહીં મૂકો',upload_sub:'JPG, PNG, WEBP — મહત્તમ 10 MB',
    btn_upload:'ફોટો અપલોડ',btn_camera:'ફોટો લો',btn_analyze:'પાક તપાસો',
    tips_title:'સારા ફોટા માટે ટીપ્સ',
    market_hero_title:'આજના મંડી ભાવ',market_hero_sub:'15 પાક · 20 શહેર · MSP સરખામણી',
    search_placeholder:'શહેર શોધો',btn_search:'શોધો',
    filter_all:'બધા',filter_high:'વધુ માંગ',filter_rising:'ભાવ વધી રહ્યો',filter_falling:'ભાવ ઘટી રહ્યો',
    market_title:'શહેર પ્રમાણે ભાવ',market_sub:'બધા મુખ્ય બજારો',
    alerts_hero_title:'ખેતી અલર્ટ કેન્દ્ર',alerts_hero_sub:'હવામાન ચેતવણીઓ',
    location_title:'અલર્ટ માટે સ્થાન આપો',location_sub:'તમારા વિસ્તારની માહિતી માટે',
    btn_location_enable:'સ્થાન આપો',
    filter_all_alerts:'બધા',filter_danger:'ખતરો',filter_warning:'ચેતવણી',
    filter_advisory:'સલાહ',filter_weather:'હવામાન',filter_pest:'જીવાત',
    no_alerts_title:'બધું ઠીક છે!',no_alerts_sub:'હવામાન ખેતી માટે સારું છે',
    chatbot_title:'કિસાન મદદગાર',chatbot_sub:'કોઈ પણ ભાષામાં પૂછો',
    chat_placeholder:'લખો અથવા બોલો...',helpline:'કિસાન હેલ્પલાઈન',
    stat_temp:'તાપમાન',stat_humidity:'ભેજ',stat_wind:'પવન',stat_visibility:'દ્રષ્ટિ',stat_pressure:'દબાણ',
  },
  kn: {
    nav_home:'ಹೋಮ್',nav_diagnose:'ಬೆಳೆ ರೋಗ',nav_market:'ಬೆಲೆಗಳು',nav_alerts:'ಎಚ್ಚರಿಕೆ',
    hero_title:'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯ',hero_sub:'ಹವಾಮಾನ · ಬೆಳೆ · ರೋಗ · ಮಾರುಕಟ್ಟೆ',hero_badge:'AI ಕೃಷಿ ಸಹಾಯ',
    btn_location:'ನನ್ನ ಸ್ಥಳ',btn_diagnose:'ಬೆಳೆ ಪರೀಕ್ಷೆ',
    quick_diagnose_title:'ಬೆಳೆ ರೋಗ ಪತ್ತೆ',quick_diagnose_sub:'ಫೋಟೋ ತೆಗೆ — AI ಹೇಳುತ್ತದೆ',
    quick_market_title:'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',quick_market_sub:'15 ಬೆಳೆಗಳು, 20 ನಗರಗಳು',
    quick_alerts_title:'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ',quick_alerts_sub:'ಕೀಟ ಮತ್ತು ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
    weather_title:'ಪ್ರಸ್ತುತ ಹವಾಮಾನ',weather_sub:'ನಿಮ್ಮ ಸ್ಥಳದ ನೇರ ಮಾಹಿತಿ',
    forecast_title:'6 ದಿನಗಳ ಮುನ್ಸೂಚನೆ',rain_title:'ಇಂದು ಮಳೆ ಬರುವುದೇ?',rain_sub:'ಇಂದು ಮತ್ತು ನಾಳೆ ಮಳೆ ಮುನ್ಸೂಚನೆ',
    crops_title:'ನಿಮಗೆ ಸೂಕ್ತ ಬೆಳೆಗಳು',pest_title:'ಕೀಟ ನಿಯಂತ್ರಣ ಮಾರ್ಗದರ್ಶಿ',pest_sub:'ಸುರಕ್ಷಿತ ಬೆಳೆ ರಕ್ಷಣೆ',
    soil_title:'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸಲಹೆಗಳು',soil_sub:'ಋತು-ನಿರ್ದಿಷ್ಟ ಮಣ್ಣಿನ ಆರೈಕೆ',
    footer_text:'AI ಮೂಲಕ ಭಾರತೀಯ ರೈತರಿಗೆ ಸಹಾಯ',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'ಬೆಳೆ ರೋಗ ಪತ್ತೆಕಾರ',diagnose_hero_sub:'ಫೋಟೋ ತೆಗೆ — AI ಹೇಳುತ್ತದೆ',
    upload_title:'ಬೆಳೆ ಫೋಟೋ ಇಲ್ಲಿ ಹಾಕಿ',upload_sub:'JPG, PNG, WEBP — ಗರಿಷ್ಠ 10 MB',
    btn_upload:'ಫೋಟೋ ಅಪ್‌ಲೋಡ್',btn_camera:'ಫೋಟೋ ತೆಗೆ',btn_analyze:'ಬೆಳೆ ಪರೀಕ್ಷಿಸಿ',
    tips_title:'ಉತ್ತಮ ಫೋಟೋಗಾಗಿ ಸಲಹೆಗಳು',
    market_hero_title:'ಇಂದಿನ ಮಂಡಿ ಬೆಲೆಗಳು',market_hero_sub:'15 ಬೆಳೆಗಳು · 20 ನಗರಗಳು · MSP ಹೋಲಿಕೆ',
    search_placeholder:'ನಗರ ಹುಡುಕಿ',btn_search:'ಹುಡುಕಿ',
    filter_all:'ಎಲ್ಲಾ',filter_high:'ಹೆಚ್ಚು ಬೇಡಿಕೆ',filter_rising:'ಬೆಲೆ ಏರುತ್ತಿದೆ',filter_falling:'ಬೆಲೆ ಇಳಿಯುತ್ತಿದೆ',
    market_title:'ನಗರ ವಾರಿ ಬೆಲೆಗಳು',market_sub:'ಎಲ್ಲಾ ಪ್ರಮುಖ ಮಂಡಿಗಳು',
    alerts_hero_title:'ಕೃಷಿ ಎಚ್ಚರಿಕೆ ಕೇಂದ್ರ',alerts_hero_sub:'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
    location_title:'ಎಚ್ಚರಿಕೆಗಾಗಿ ಸ್ಥಳ ನೀಡಿ',location_sub:'ನಿಮ್ಮ ಪ್ರದೇಶದ ಮಾಹಿತಿಗಾಗಿ',
    btn_location_enable:'ಸ್ಥಳ ನೀಡಿ',
    filter_all_alerts:'ಎಲ್ಲಾ',filter_danger:'ಅಪಾಯ',filter_warning:'ಎಚ್ಚರಿಕೆ',
    filter_advisory:'ಸಲಹೆ',filter_weather:'ಹವಾಮಾನ',filter_pest:'ಕೀಟ',
    no_alerts_title:'ಎಲ್ಲಾ ಸರಿಯಾಗಿದೆ!',no_alerts_sub:'ಹವಾಮಾನ ಕೃಷಿಗೆ ಅನುಕೂಲ',
    chatbot_title:'ಕಿಸಾನ್ ಸಹಾಯಕ',chatbot_sub:'ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ',
    chat_placeholder:'ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...',helpline:'ಕಿಸಾನ್ ಸಹಾಯವಾಣಿ',
    stat_temp:'ತಾಪಮಾನ',stat_humidity:'ಆರ್ದ್ರತೆ',stat_wind:'ಗಾಳಿ',stat_visibility:'ದೃಶ್ಯಮಾನತೆ',stat_pressure:'ಒತ್ತಡ',
  },
  ml: {
    nav_home:'ഹോം',nav_diagnose:'വിള രോഗം',nav_market:'വിപണി വില',nav_alerts:'മുന്നറിയിപ്പ്',
    hero_title:'സ്മാർട്ട് കൃഷി സഹായം',hero_sub:'കാലാവസ്ഥ · വിള · രോഗം · വിപണി',hero_badge:'AI കൃഷി സഹായം',
    btn_location:'എൻ്റെ സ്ഥാനം',btn_diagnose:'വിള പരിശോധന',
    quick_diagnose_title:'വിള രോഗ നിർണ്ണയം',quick_diagnose_sub:'ഫോട്ടോ എടുക്കൂ — AI പറയും',
    quick_market_title:'ഇന്നത്തെ വിപണി വില',quick_market_sub:'15 വിളകൾ, 20 നഗരങ്ങൾ',
    quick_alerts_title:'കാലാവസ്ഥ മുന്നറിയിപ്പ്',quick_alerts_sub:'കീടം, കാലാവസ്ഥ മുന്നറിയിപ്പുകൾ',
    weather_title:'നിലവിലെ കാലാവസ്ഥ',weather_sub:'നിങ്ങളുടെ സ്ഥലത്തിന്റെ വിവരം',
    forecast_title:'6 ദിവസത്തെ പ്രവചനം',rain_title:'ഇന്ന് മഴ ഉണ്ടാകുമോ?',rain_sub:'ഇന്നും നാളെയും മഴ പ്രവചനം',
    crops_title:'നിങ്ങൾക്ക് അനുകൂലമായ വിളകൾ',pest_title:'കീട നിയന്ത്രണ ഗൈഡ്',pest_sub:'സുരക്ഷിത വിള സംരക്ഷണം',
    soil_title:'മണ്ണ് ആരോഗ്യ നുറുങ്ങുകൾ',soil_sub:'ഋതു-നിർദ്ദിഷ്ട മണ്ണ് പരിചരണം',
    footer_text:'AI ഉപയോഗിച്ച് ഇന്ത്യൻ കർഷകർക്ക് സഹായം',footer_copy:'© 2025 SmartAgro.',
    diagnose_hero_title:'വിള രോഗ കണ്ടെത്തൽ',diagnose_hero_sub:'ഫോട്ടോ എടുക്കൂ — AI പറയും',
    upload_title:'വിള ഫോട്ടോ ഇവിടെ ഇടൂ',upload_sub:'JPG, PNG, WEBP — പരമാവധി 10 MB',
    btn_upload:'ഫോട്ടോ അപ്‌ലോഡ്',btn_camera:'ഫോട്ടോ എടുക്കൂ',btn_analyze:'വിള പരിശോധിക്കൂ',
    tips_title:'നല്ല ഫോട്ടോക്ക് നുറുങ്ങുകൾ',
    market_hero_title:'ഇന്നത്തെ മണ്ടി വിലകൾ',market_hero_sub:'15 വിളകൾ · 20 നഗരങ്ങൾ · MSP താരതമ്യം',
    search_placeholder:'നഗരം തിരയൂ',btn_search:'തിരയൂ',
    filter_all:'എല്ലാം',filter_high:'ഉയർന്ന ഡിമാൻഡ്',filter_rising:'വില ഉയരുന്നു',filter_falling:'വില കുറയുന്നു',
    market_title:'നഗരം അനുസരിച്ച് വില',market_sub:'എല്ലാ പ്രധാന മണ്ടികളും',
    alerts_hero_title:'കൃഷി അലർട്ട് കേന്ദ്രം',alerts_hero_sub:'കാലാവസ്ഥ മുന്നറിയിപ്പുകൾ',
    location_title:'അലർട്ടിന് സ്ഥാനം നൽകൂ',location_sub:'നിങ്ങളുടെ പ്രദേശ വിവരത്തിന്',
    btn_location_enable:'സ്ഥാനം നൽകൂ',
    filter_all_alerts:'എല്ലാം',filter_danger:'അപകടം',filter_warning:'മുന്നറിയിപ്പ്',
    filter_advisory:'ഉപദേശം',filter_weather:'കാലാവസ്ഥ',filter_pest:'കീടം',
    no_alerts_title:'എല്ലാം ശരിയാണ്!',no_alerts_sub:'കാലാവസ്ഥ കൃഷിക്ക് അനുകൂലം',
    chatbot_title:'കിസാൻ സഹായി',chatbot_sub:'ഏത് ഭാഷയിലും ചോദിക്കൂ',
    chat_placeholder:'ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...',helpline:'കിസാൻ ഹെൽപ്പ്‌ലൈൻ',
    stat_temp:'താപനില',stat_humidity:'ആർദ്രത',stat_wind:'കാറ്റ്',stat_visibility:'ദൃശ്യദൂരം',stat_pressure:'മർദ്ദം',
  },
};

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
    if (el.classList.contains('nav-item') || el.classList.contains('bottom-nav-item')) {
      const s = el.querySelector('span:not(.alert-badge)');
      if (s) s.textContent = txt;
      return;
    }
    el.textContent = txt;
  });
  document.documentElement.lang = currentLang;
  // Re-render dynamic content when language changes
  if (window.weatherData) rerenderDynamic();
}

function rerenderDynamic() {
  // Re-render crops if available
  if (typeof renderCrops === 'function' && window._lastCropData) {
    renderCrops(window._lastCropData);
  }
  if (typeof renderSoilTips === 'function' && window._lastSoilData) {
    renderSoilTips(window._lastSoilData);
  }
  if (typeof renderPesticides === 'function' && window._lastPestData) {
    renderPesticides(window._lastPestData);
  }
  if (typeof renderWeatherSection === 'function' && window.weatherData) {
    renderWeatherSection(window.weatherData.current, window.weatherData.forecast);
    renderStatBar(window.weatherData.current);
    renderRainForecast(window.weatherData.forecast);
  }
  if (typeof renderAlertsList === 'function' && window._lastAlertsData) {
    renderAlertsList(window._lastAlertsData);
  }
  if (typeof renderGrid === 'function' && window.allMarketData) {
    renderGrid(window.allMarketData);
  }
}

function setLanguage(code) {
  currentLang = code;
  localStorage.setItem('agrosmart_lang', code);
  applyTranslations();
  updateLangUI();
  document.querySelectorAll('.lang-option').forEach(o => o.classList.toggle('active', o.dataset.code === code));
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
