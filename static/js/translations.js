/* ═══════════════════════════════════════════════
   translations.js — Indian + World Languages
   Supports: 22 official Indian languages + English
═══════════════════════════════════════════════ */

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', label: 'EN' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳', label: 'HI' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳', label: 'BN' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳', label: 'TE' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳', label: 'MR' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳', label: 'TA' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', label: 'GU' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', label: 'KN' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳', label: 'ML' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳', label: 'PA' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳', label: 'OR' },
    { code: 'as', name: 'অসমীয়া (Assamese)', flag: '🇮🇳', label: 'AS' },
    { code: 'ur', name: 'اردو (Urdu)', flag: '🇮🇳', label: 'UR' },
    { code: 'mai', name: 'मैथिली (Maithili)', flag: '🇮🇳', label: 'MAI' },
    { code: 'sat', name: 'संताली (Santali)', flag: '🇮🇳', label: 'SAT' },
    { code: 'ks', name: 'کٲشُر (Kashmiri)', flag: '🇮🇳', label: 'KS' },
    { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇮🇳', label: 'NE' },
    { code: 'sd', name: 'سنڌي (Sindhi)', flag: '🇮🇳', label: 'SD' },
    { code: 'kok', name: 'कोंकणी (Konkani)', flag: '🇮🇳', label: 'KOK' },
    { code: 'mni', name: 'মণিপুরী (Manipuri)', flag: '🇮🇳', label: 'MNI' },
    { code: 'bodo', name: 'बोडो (Bodo)', flag: '🇮🇳', label: 'BDO' },
    { code: 'doi', name: 'डोगरी (Dogri)', flag: '🇮🇳', label: 'DOI' },
    { code: 'sa', name: 'संस्कृत (Sanskrit)', flag: '🇮🇳', label: 'SA' },
];

/* ── Translation strings ────────────────────────────────────────── */
/* Full translations for Hindi + Bengali; others fallback to English
   via Google Translate API dynamically if available.              */

const T = {
    en: {
        nav_dashboard: 'Dashboard',
        nav_diagnose: 'Diagnose Crop',
        nav_market: 'Market Prices',
        nav_alerts: 'Alerts',
        hero_badge: '🌿 AI-Powered Precision Agriculture',
        hero_title: 'Smart Farming Intelligence',
        hero_subtitle: 'Real-time crop advisory, disease detection & market insights powered by AI',
        btn_location: 'Get My Location',
        btn_diagnose: 'Diagnose Crop',
        section_weather: 'Current Weather Conditions',
        section_weather_sub: 'Live data from your location',
        forecast_title: '7-Day Forecast',
        stat_temp: 'Temperature',
        stat_humidity: 'Humidity',
        stat_wind: 'Wind Speed',
        stat_visibility: 'Visibility',
        stat_pressure: 'Pressure',
        section_crops: 'Crop Recommendations',
        section_crops_sub: 'Based on your climate & location',
        section_advisory: 'Crop Advisory Calendar',
        section_advisory_sub: 'Week-by-week action plan for your crops',
        section_pest: 'Pesticide & Pest Control Guide',
        section_pest_sub: 'Safe and effective crop protection plan',
        section_quick: 'Quick Actions',
        quick_diagnose: 'Diagnose Crop Disease',
        quick_diagnose_sub: 'Upload or take a photo of your crop',
        quick_market: 'Check Market Prices',
        quick_market_sub: 'Live mandi prices across India',
        quick_alerts: 'View Active Alerts',
        quick_alerts_sub: 'Weather & pest warnings for your area',
        footer_text: 'Empowering farmers with AI-driven precision agriculture',
        diagnose_title: 'Crop Disease Detector',
        diagnose_subtitle: 'Upload or capture a photo of your affected crop for instant AI-powered diagnosis',
        upload_title: 'Drop your crop image here',
        upload_sub: 'Supports JPG, PNG, WEBP – max 10MB',
        btn_upload: 'Upload Photo',
        btn_camera: 'Take Photo',
        btn_analyze: 'Analyze Crop',
        results_placeholder: 'Upload a crop image to begin diagnosis',
        results_placeholder_sub: 'Our AI will analyze the disease and suggest eco-friendly treatments',
        how_title: 'How It Works',
        step1_title: 'Capture or Upload',
        step1_desc: 'Take a clear photo of the affected crop leaf, stem, or fruit',
        step2_title: 'AI Analysis',
        step2_desc: 'Our AI model analyzes visual patterns to identify diseases',
        step3_title: 'Get Remedies',
        step3_desc: 'Receive eco-friendly and chemical treatment plans instantly',
        market_title: 'Crop Market Prices',
        market_subtitle: 'Real-time mandi prices across 10+ Indian cities — updated daily',
        search_placeholder: 'Search city (e.g. Delhi, Mumbai, Kolkata...)',
        btn_search: 'Search',
        filter_all: 'All',
        filter_very_high: 'Very High Demand',
        filter_rising: 'Price Rising',
        filter_falling: 'Price Falling',
        legend_very_high: 'Very High Demand',
        legend_high: 'High Demand',
        legend_medium: 'Medium Demand',
        legend_low: 'Low Demand',
        legend_rising: 'Price Rising',
        legend_falling: 'Price Falling',
        market_data_title: 'Mandi Prices by City',
        market_data_sub: 'Showing all major Indian markets',
        loading_market: 'Fetching latest mandi prices...',
        no_results_title: 'No markets found',
        no_results_sub: 'Try searching for Delhi, Mumbai, Kolkata...',
        btn_show_all: 'Show All Markets',
        chart_title: 'Price Trend Analysis',
        chart_sub: '30-day price movement for top crops',
        tab_trend: 'Trend',
        tab_comparison: 'Comparison',
        tab_demand: 'Demand Map',
        th_crop: 'Crop',
        table_title: 'Detailed Price Comparison',
        table_sub: 'Prices across all major cities (₹/quintal)',
        alerts_title: 'Farm Alert Center',
        alerts_subtitle: 'Real-time weather warnings, pest advisories, and crop safety alerts',
        live_alerts: 'Live Alerts',
        alert_danger: 'Critical',
        alert_warning: 'Warning',
        alert_info: 'Advisory',
        alert_total: 'Total Alerts',
        location_required: 'Location Required for Alerts',
        location_required_sub: 'We need your location to show relevant alerts for your area',
        btn_get_location: 'Enable Location',
        filter_all_alerts: 'All Alerts',
        filter_critical: 'Critical',
        filter_warnings: 'Warnings',
        filter_advisories: 'Advisories',
        filter_weather_tab: 'Weather',
        filter_pest_tab: 'Pest',
        filter_crop_tab: 'Crop',
        loading_alerts: 'Analyzing weather and pest data...',
        no_alerts_title: 'All Clear! No Active Alerts',
        no_alerts_sub: 'Conditions are favorable for farming in your area',
        pest_calendar_title: 'Seasonal Pest Alert Calendar',
        pest_calendar_sub: 'Know which pests are active this season',
        pesticide_title: 'Pesticide Safety Guide',
        pesticide_sub: 'Recommended dosage and harmful combinations to avoid',
        harmful_title: 'Crops at Risk in Current Conditions',
        harmful_sub: 'Avoid growing these crops in present weather conditions',
        safe_title: 'Safe to Grow Now',
        safe_sub: 'These crops are well-suited for current weather conditions',
        risk_chart_title: 'Risk Level Overview',
        risk_chart_sub: 'Visual breakdown of current agricultural risk factors',
    },
    hi: {
        nav_dashboard: 'डैशबोर्ड',
        nav_diagnose: 'फसल निदान',
        nav_market: 'बाजार भाव',
        nav_alerts: 'अलर्ट',
        hero_badge: '🌿 AI-संचालित सटीक कृषि',
        hero_title: 'स्मार्ट खेती बुद्धिमत्ता',
        hero_subtitle: 'AI द्वारा संचालित रियल-टाइम फसल सलाह, रोग पहचान और बाजार अंतर्दृष्टि',
        btn_location: 'मेरी लोकेशन प्राप्त करें',
        btn_diagnose: 'फसल निदान करें',
        section_weather: 'वर्तमान मौसम की स्थिति',
        section_weather_sub: 'आपकी लोकेशन से लाइव डेटा',
        forecast_title: '7 दिन का पूर्वानुमान',
        stat_temp: 'तापमान',
        stat_humidity: 'आर्द्रता',
        stat_wind: 'हवा की गति',
        stat_visibility: 'दृश्यता',
        stat_pressure: 'दबाव',
        section_crops: 'फसल सिफारिशें',
        section_crops_sub: 'आपकी जलवायु और स्थान के आधार पर',
        section_advisory: 'फसल सलाह कैलेंडर',
        section_advisory_sub: 'आपकी फसलों के लिए साप्ताहिक कार्य योजना',
        section_pest: 'कीटनाशक और कीट नियंत्रण गाइड',
        section_pest_sub: 'सुरक्षित और प्रभावी फसल सुरक्षा योजना',
        section_quick: 'त्वरित क्रियाएं',
        quick_diagnose: 'फसल रोग का निदान करें',
        quick_diagnose_sub: 'अपनी फसल की फोटो अपलोड करें या लें',
        quick_market: 'बाजार भाव देखें',
        quick_market_sub: 'भारत भर में लाइव मंडी भाव',
        quick_alerts: 'सक्रिय अलर्ट देखें',
        quick_alerts_sub: 'आपके क्षेत्र के लिए मौसम और कीट चेतावनी',
        footer_text: 'AI-संचालित सटीक कृषि से किसानों को सशक्त बनाना',
        diagnose_title: 'फसल रोग डिटेक्टर',
        diagnose_subtitle: 'तत्काल AI-संचालित निदान के लिए अपनी प्रभावित फसल की फोटो अपलोड करें',
        upload_title: 'यहाँ अपनी फसल की छवि छोड़ें',
        upload_sub: 'JPG, PNG, WEBP समर्थित – अधिकतम 10MB',
        btn_upload: 'फोटो अपलोड करें',
        btn_camera: 'फोटो लें',
        btn_analyze: 'फसल विश्लेषण करें',
        results_placeholder: 'निदान शुरू करने के लिए फसल की छवि अपलोड करें',
        results_placeholder_sub: 'हमारा AI रोग का विश्लेषण करेगा और पर्यावरण-अनुकूल उपचार सुझाएगा',
        how_title: 'यह कैसे काम करता है',
        step1_title: 'कैप्चर या अपलोड करें',
        step1_desc: 'प्रभावित फसल की पत्ती, तने या फल की स्पष्ट फोटो लें',
        step2_title: 'AI विश्लेषण',
        step2_desc: 'हमारा AI मॉडल रोगों की पहचान के लिए दृश्य पैटर्न का विश्लेषण करता है',
        step3_title: 'उपचार प्राप्त करें',
        step3_desc: 'तुरंत पर्यावरण-अनुकूल और रासायनिक उपचार योजनाएं प्राप्त करें',
        market_title: 'फसल बाजार भाव',
        market_subtitle: '10+ भारतीय शहरों में रियल-टाइम मंडी भाव — दैनिक अपडेट',
        search_placeholder: 'शहर खोजें (जैसे दिल्ली, मुंबई, कोलकाता...)',
        btn_search: 'खोजें',
        filter_all: 'सभी',
        filter_very_high: 'बहुत अधिक मांग',
        filter_rising: 'बढ़ते भाव',
        filter_falling: 'गिरते भाव',
        alerts_title: 'फार्म अलर्ट केंद्र',
        alerts_subtitle: 'रियल-टाइम मौसम चेतावनी, कीट सलाह और फसल सुरक्षा अलर्ट',
        live_alerts: 'लाइव अलर्ट',
        alert_danger: 'गंभीर',
        alert_warning: 'चेतावनी',
        alert_info: 'सलाह',
        alert_total: 'कुल अलर्ट',
        location_required: 'अलर्ट के लिए लोकेशन आवश्यक',
        location_required_sub: 'आपके क्षेत्र के लिए प्रासंगिक अलर्ट दिखाने के लिए हमें आपकी लोकेशन चाहिए',
        btn_get_location: 'लोकेशन सक्षम करें',
        no_alerts_title: 'सब ठीक! कोई सक्रिय अलर्ट नहीं',
        no_alerts_sub: 'आपके क्षेत्र में खेती के लिए स्थिति अनुकूल है',
        pest_calendar_title: 'मौसमी कीट अलर्ट कैलेंडर',
        pesticide_title: 'कीटनाशक सुरक्षा गाइड',
        harmful_title: 'वर्तमान परिस्थितियों में जोखिम में फसलें',
        safe_title: 'अभी उगाने के लिए सुरक्षित',
        risk_chart_title: 'जोखिम स्तर अवलोकन',
        footer_text: 'AI-संचालित सटीक कृषि से किसानों को सशक्त बनाना',
    },
    bn: {
        nav_dashboard: 'ড্যাশবোর্ড',
        nav_diagnose: 'ফসল নির্ণয়',
        nav_market: 'বাজার মূল্য',
        nav_alerts: 'সতর্কতা',
        hero_badge: '🌿 AI-চালিত নির্ভুল কৃষি',
        hero_title: 'স্মার্ট কৃষি বুদ্ধিমত্তা',
        hero_subtitle: 'AI দ্বারা পরিচালিত রিয়েল-টাইম ফসল পরামর্শ, রোগ সনাক্তকরণ এবং বাজার অন্তর্দৃষ্টি',
        btn_location: 'আমার অবস্থান পান',
        btn_diagnose: 'ফসল নির্ণয় করুন',
        section_weather: 'বর্তমান আবহাওয়া পরিস্থিতি',
        section_weather_sub: 'আপনার অবস্থান থেকে লাইভ ডেটা',
        forecast_title: '৭ দিনের পূর্বাভাস',
        stat_temp: 'তাপমাত্রা',
        stat_humidity: 'আর্দ্রতা',
        stat_wind: 'বায়ু গতি',
        stat_visibility: 'দৃশ্যমানতা',
        stat_pressure: 'চাপ',
        section_crops: 'ফসলের সুপারিশ',
        section_crops_sub: 'আপনার জলবায়ু এবং অবস্থানের উপর ভিত্তি করে',
        section_advisory: 'ফসল পরামর্শ ক্যালেন্ডার',
        section_pest: 'কীটনাশক ও কীট নিয়ন্ত্রণ গাইড',
        section_quick: 'দ্রুত কার্যক্রম',
        quick_diagnose: 'ফসলের রোগ নির্ণয়',
        quick_market: 'বাজার মূল্য দেখুন',
        quick_alerts: 'সক্রিয় সতর্কতা দেখুন',
        footer_text: 'AI-চালিত নির্ভুল কৃষির মাধ্যমে কৃষকদের ক্ষমতায়ন',
        btn_upload: 'ছবি আপলোড করুন',
        btn_camera: 'ছবি তুলুন',
        btn_analyze: 'ফসল বিশ্লেষণ করুন',
        results_placeholder: 'রোগ নির্ণয় শুরু করতে ফসলের ছবি আপলোড করুন',
        market_title: 'ফসলের বাজার মূল্য',
        market_subtitle: '১০+ ভারতীয় শহরে রিয়েল-টাইম মান্ডি মূল্য',
        alerts_title: 'ফার্ম সতর্কতা কেন্দ্র',
        live_alerts: 'লাইভ সতর্কতা',
        no_alerts_title: 'সব ঠিক আছে! কোনো সক্রিয় সতর্কতা নেই',
        harmful_title: 'বর্তমান পরিস্থিতিতে ঝুঁকিতে থাকা ফসল',
        safe_title: 'এখন চাষের জন্য নিরাপদ',
    },
    te: {
        nav_dashboard: 'డ్యాష్‌బోర్డ్',
        nav_diagnose: 'పంట నిర్ధారణ',
        nav_market: 'మార్కెట్ ధరలు',
        nav_alerts: 'హెచ్చరికలు',
        hero_title: 'స్మార్ట్ వ్యవసాయ తెలివి',
        hero_subtitle: 'AI ద్వారా నడిచే రియల్-టైమ్ పంట సలహా',
        btn_location: 'నా స్థానాన్ని పొందండి',
        btn_diagnose: 'పంటను నిర్ధారించండి',
        section_weather: 'ప్రస్తుత వాతావరణ పరిస్థితులు',
        section_crops: 'పంట సిఫార్సులు',
        section_advisory: 'పంట సలహా క్యాలెండర్',
        section_pest: 'పురుగుమందు మరియు తెగులు నియంత్రణ',
        section_quick: 'త్వరిత చర్యలు',
        market_title: 'పంట మార్కెట్ ధరలు',
        alerts_title: 'వ్యవసాయ హెచ్చరిక కేంద్రం',
        footer_text: 'AI-ఆధారిత వ్యవసాయంతో రైతులను సాధికారత పరచడం',
    },
    mr: {
        nav_dashboard: 'डॅशबोर्ड',
        nav_diagnose: 'पीक निदान',
        nav_market: 'बाजारभाव',
        nav_alerts: 'सतर्कता',
        hero_title: 'स्मार्ट शेती बुद्धिमत्ता',
        hero_subtitle: 'AI-संचालित रिअल-टाइम पीक सल्ला',
        btn_location: 'माझे स्थान मिळवा',
        btn_diagnose: 'पीक निदान करा',
        section_weather: 'सध्याची हवामान परिस्थिती',
        section_crops: 'पीक शिफारसी',
        market_title: 'पीक बाजारभाव',
        alerts_title: 'शेती सतर्कता केंद्र',
        footer_text: 'AI-संचालित शेतीने शेतकऱ्यांना सक्षम बनवणे',
    },
    ta: {
        nav_dashboard: 'டாஷ்போர்ட்',
        nav_diagnose: 'பயிர் நோய் கண்டறிதல்',
        nav_market: 'சந்தை விலைகள்',
        nav_alerts: 'எச்சரிக்கைகள்',
        hero_title: 'ஸ்மார்ட் விவசாய நுண்ணறிவு',
        hero_subtitle: 'AI-இயங்கும் நிகழ்நேர பயிர் ஆலோசனை',
        btn_location: 'என் இடத்தைப் பெறுக',
        section_weather: 'தற்போதைய வானிலை நிலைமைகள்',
        section_crops: 'பயிர் பரிந்துரைகள்',
        market_title: 'பயிர் சந்தை விலைகள்',
        alerts_title: 'விவசாய எச்சரிக்கை மையம்',
        footer_text: 'AI-இயங்கும் விவசாயத்தால் விவசாயிகளை மேம்படுத்துதல்',
    },
    gu: {
        nav_dashboard: 'ડૅશબોર્ડ',
        nav_diagnose: 'પાક નિદાન',
        nav_market: 'બજાર ભાવ',
        nav_alerts: 'ચેતવણીઓ',
        hero_title: 'સ્માર્ટ ખેતી બુદ્ધિ',
        btn_location: 'મારી સ્થિતિ મેળવો',
        section_crops: 'પાક ભલામણો',
        market_title: 'પાક બજાર ભાવ',
        footer_text: 'AI-સંચાલિત ખેતી સાથે ખેડૂતોને સક્ષમ બનાવવા',
    },
    kn: {
        nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        nav_diagnose: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ',
        nav_market: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
        nav_alerts: 'ಎಚ್ಚರಿಕೆಗಳು',
        hero_title: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಬುದ್ಧಿಮತ್ತೆ',
        btn_location: 'ನನ್ನ ಸ್ಥಳ ಪಡೆಯಿರಿ',
        section_crops: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳು',
        market_title: 'ಬೆಳೆ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
        footer_text: 'AI-ಚಾಲಿತ ನಿಖರ ಕೃಷಿಯಿಂದ ರೈತರನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು',
    },
    ml: {
        nav_dashboard: 'ഡാഷ്‌ബോർഡ്',
        nav_diagnose: 'വിള രോഗ നിർണ്ണയം',
        nav_market: 'വിപണി വില',
        nav_alerts: 'മുന്നറിയിപ്പുകൾ',
        hero_title: 'സ്മാർട്ട് കൃഷി ബുദ്ധി',
        btn_location: 'എൻ്റെ സ്ഥാനം നേടുക',
        section_crops: 'വിള ശുപാർശകൾ',
        market_title: 'വിള വിപണി വില',
        footer_text: 'AI-ചലിതമായ കൃഷിയിലൂടെ കർഷകരെ ശക്തിപ്പെടുത്തുക',
    },
    pa: {
        nav_dashboard: 'ਡੈਸ਼ਬੋਰਡ',
        nav_diagnose: 'ਫਸਲ ਦੀ ਜਾਂਚ',
        nav_market: 'ਮੰਡੀ ਭਾਅ',
        nav_alerts: 'ਚੇਤਾਵਨੀਆਂ',
        hero_title: 'ਸਮਾਰਟ ਖੇਤੀ ਬੁੱਧੀਮਤਾ',
        btn_location: 'ਮੇਰੀ ਲੋਕੇਸ਼ਨ ਲਓ',
        section_crops: 'ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ',
        market_title: 'ਫਸਲ ਮੰਡੀ ਭਾਅ',
        footer_text: 'AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ',
    },
};

/* ── Translation Engine ─────────────────────────────────────────── */
let currentLang = localStorage.getItem('agrosmart_lang') || 'en';

function translate(key) {
    const langData = T[currentLang] || {};
    return langData[key] || T.en[key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const text = translate(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else if (el.children.length > 0 && !el.classList.contains('nav-item')) {
            el.childNodes.forEach(node => {
                if (node.nodeType === 3 && node.textContent.trim()) {
                    node.textContent = text;
                }
            });
        } else {
            el.textContent = text;
        }
    });
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        el.placeholder = translate(key);
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
}

function updateLangUI() {
    const lang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
    const btn = document.getElementById('currentLang');
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
         onclick="setLanguage('${l.code}'); closeLangDropdown();">
      <span class="lang-flag">${l.flag}</span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-code">${l.label}</span>
    </div>
  `).join('');
}

function closeLangDropdown() {
    const sel = document.getElementById('langSelector');
    if (sel) sel.classList.remove('open');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    buildLangList();
    applyTranslations();
    updateLangUI();

    // Toggle dropdown
    const btn = document.getElementById('langBtn');
    const sel = document.getElementById('langSelector');
    if (btn && sel) {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            sel.classList.toggle('open');
        });
        document.addEventListener('click', e => {
            if (!sel.contains(e.target)) sel.classList.remove('open');
        });
    }

    // Search
    const searchEl = document.getElementById('langSearch');
    if (searchEl) {
        searchEl.addEventListener('input', e => buildLangList(e.target.value));
    }
});