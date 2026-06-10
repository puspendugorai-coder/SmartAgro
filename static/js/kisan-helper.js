/* ═══════════════════════════════════════════════
   kisan-helper.js — Kisan Helper Voice+Chat Widget
   Fixed: UI overlap, AI not responding, stop btn,
          new chat btn, lang detection
═══════════════════════════════════════════════ */
(function() {

        /* ── Inject HTML ─────────────────────────── */
        document.body.insertAdjacentHTML('beforeend', `
  <div id="kisanWidget">
    <div id="kisanToggleBtn" onclick="toggleKisan()" title="Kisan Helper">
      <i class="fas fa-microphone-alt"></i>
      <span class="kw-pulse"></span>
    </div>
    <div id="kisanPanel" class="kp-hidden">
      <div class="kp-header">
        <div class="kp-header-left">
          <div class="kp-avatar"><i class="fas fa-seedling"></i></div>
          <div>
            <div class="kp-name">Kisan Helper</div>
            <div class="kp-sub" id="kisanLangLabel">Ask in any language</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="kp-newchat-btn" onclick="newKisanChat()" title="New Chat">
            <i class="fas fa-plus"></i>
          </button>
          <button class="kp-close" onclick="toggleKisan()"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="kp-messages" id="kisanMessages"></div>
      <div class="kp-input-bar">
        <input type="text" id="kisanInput" placeholder="Type or speak..."
               onkeydown="if(event.key==='Enter')sendKisanMessage()"/>
        <button id="kisanStopBtn" class="kp-stop-btn" onclick="stopKisanTyping()" title="Stop" style="display:none">
          <i class="fas fa-stop"></i>
        </button>
        <button id="kisanMicBtn" class="kp-mic-btn" onclick="toggleKisanMic()" title="Voice">
          <i class="fas fa-microphone"></i>
        </button>
        <button class="kp-send-btn" onclick="sendKisanMessage()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
  <a id="kisanHelpline"
     href="https://www.google.com/search?q=kisan+helpline+1800-180-1551"
     target="_blank" rel="noopener">
    <i class="fas fa-phone"></i>
    <span>Kisan Helpline: <strong>1800-180-1551</strong></span>
  </a>`);

        /* ── Styles ──────────────────────────────── */
        const S = document.createElement('style');
        S.textContent = `
  #kisanToggleBtn{
    position:fixed;bottom:28px;right:28px;width:58px;height:58px;
    border-radius:50%;background:linear-gradient(135deg,#166534,#22c55e);
    box-shadow:0 4px 24px rgba(74,222,128,.45);display:flex;
    align-items:center;justify-content:center;cursor:pointer;z-index:9999;
    transition:transform .2s,box-shadow .2s;
  }
  #kisanToggleBtn:hover{transform:scale(1.1);box-shadow:0 6px 32px rgba(74,222,128,.6)}
  #kisanToggleBtn i{font-size:1.45rem;color:#fff;pointer-events:none}
  .kw-pulse{
    position:absolute;top:-3px;right:-3px;width:13px;height:13px;
    background:#f87171;border-radius:50%;
    animation:kwp 1.8s ease-in-out infinite;pointer-events:none;
  }
  @keyframes kwp{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}

  #kisanPanel{
    position:fixed;bottom:100px;right:28px;width:340px;
    max-height:75vh;
    background:var(--card,#111a12);border:1px solid rgba(74,222,128,.25);
    border-radius:20px;box-shadow:0 8px 48px rgba(0,0,0,.5);
    display:flex;flex-direction:column;z-index:9998;
    animation:panelIn .25s cubic-bezier(.34,1.56,.64,1);
  }
  #kisanPanel.kp-hidden{display:none!important}
  @keyframes panelIn{from{transform:scale(.85) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}

  .kp-header{
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 14px;background:linear-gradient(135deg,#166534,#15803d);
    flex-shrink:0;border-radius:20px 20px 0 0;
  }
  .kp-header-left{display:flex;align-items:center;gap:10px}
  .kp-avatar{
    width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);
    display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;flex-shrink:0;
  }
  .kp-name{font-weight:700;font-size:.9rem;color:#fff;font-family:'Syne',sans-serif}
  .kp-sub{font-size:.68rem;color:rgba(255,255,255,.75)}
  .kp-close,.kp-newchat-btn{
    background:rgba(255,255,255,.15);border:none;border-radius:50%;
    width:26px;height:26px;display:flex;align-items:center;justify-content:center;
    color:#fff;cursor:pointer;font-size:.75rem;transition:background .2s;flex-shrink:0;
  }
  .kp-close:hover{background:rgba(248,113,113,.4)}
  .kp-newchat-btn:hover{background:rgba(74,222,128,.35)}

  /* ── Lang picker — scrollable so it never overflows ── */
  .kp-lang-picker{
    padding:10px 12px;display:flex;flex-direction:column;gap:8px;
    flex-shrink:0;max-height:260px;overflow-y:auto;
    border-bottom:1px solid rgba(74,222,128,.1);
  }
  .kp-lang-picker::-webkit-scrollbar{width:3px}
  .kp-lang-picker::-webkit-scrollbar-thumb{background:rgba(74,222,128,.2);border-radius:2px}
  .kp-lang-picker p{font-size:.78rem;color:var(--text-2,#a7c4a8);text-align:center;margin:0;flex-shrink:0}
  .kp-lang-options{display:grid;grid-template-columns:1fr 1fr;gap:5px}
  .kp-lang-opt{
    padding:6px 8px;border-radius:7px;font-size:.72rem;font-weight:600;
    background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.2);
    color:var(--text-2,#a7c4a8);cursor:pointer;transition:all .15s;text-align:center;
  }
  .kp-lang-opt:hover{background:rgba(74,222,128,.1);border-color:var(--green,#4ade80);color:var(--green,#4ade80)}
  .kp-lang-skip{
    font-size:.7rem;color:var(--text-3,#6b8c6d);text-align:center;
    cursor:pointer;text-decoration:underline;margin-top:2px;flex-shrink:0;
  }
  .kp-lang-skip:hover{color:var(--green,#4ade80)}

  /* ── Messages — takes remaining space ── */
  .kp-messages{
    flex:1;overflow-y:auto;padding:12px 10px;
    display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;
    min-height:80px;
  }
  .kp-messages::-webkit-scrollbar{width:4px}
  .kp-messages::-webkit-scrollbar-thumb{background:rgba(74,222,128,.2);border-radius:2px}

  .kp-msg{
    max-width:85%;padding:9px 12px;border-radius:14px;
    font-size:.82rem;line-height:1.6;
    animation:msgIn .2s ease;word-break:break-word;
  }
  @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .kp-msg.bot{
    background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.12);
    color:var(--text,#e8f5e9);align-self:flex-start;border-bottom-left-radius:4px;
  }
  .kp-msg.user{
    background:linear-gradient(135deg,#166534,#22c55e);color:#fff;
    align-self:flex-end;border-bottom-right-radius:4px;
  }

  .typing-dots span{
    display:inline-block;width:7px;height:7px;
    background:var(--green,#4ade80);border-radius:50%;margin:0 2px;
    animation:dot 1.2s infinite;
  }
  .typing-dots span:nth-child(2){animation-delay:.2s}
  .typing-dots span:nth-child(3){animation-delay:.4s}
  @keyframes dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}

  /* ── Input bar — always at bottom ── */
  .kp-input-bar{
    display:flex;align-items:center;gap:5px;padding:8px 10px;
    border-top:1px solid rgba(74,222,128,.1);background:var(--bg-2,#0e1510);
    flex-shrink:0;border-radius:0 0 20px 20px;
  }
  #kisanInput{
    flex:1;background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.2);
    border-radius:20px;padding:7px 12px;color:var(--text,#e8f5e9);
    font-size:.8rem;font-family:inherit;outline:none;transition:border-color .2s;min-width:0;
  }
  #kisanInput:focus{border-color:rgba(74,222,128,.5)}
  #kisanInput::placeholder{color:rgba(255,255,255,.35)}

  .kp-mic-btn,.kp-send-btn,.kp-stop-btn{
    width:34px;height:34px;border-radius:50%;border:none;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;font-size:.82rem;transition:transform .2s,background .2s;flex-shrink:0;
  }
  .kp-mic-btn{background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.2);color:var(--text-2,#a7c4a8)}
  .kp-mic-btn:hover{background:rgba(74,222,128,.1);color:var(--green,#4ade80)}
  .kp-mic-btn.recording{background:rgba(248,113,113,.15);border-color:#f87171;color:#f87171;animation:micP .8s ease-in-out infinite}
  @keyframes micP{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
  .kp-send-btn{background:linear-gradient(135deg,#166534,#22c55e);color:#fff;box-shadow:0 2px 8px rgba(74,222,128,.3)}
  .kp-send-btn:hover{transform:scale(1.08)}
  .kp-stop-btn{background:rgba(248,113,113,.15);border:1px solid #f87171;color:#f87171}
  .kp-stop-btn:hover{background:rgba(248,113,113,.3);transform:scale(1.08)}

  #kisanHelpline{
    position:fixed;bottom:20px;left:20px;display:flex;align-items:center;gap:8px;
    background:var(--card,#111a12);border:1px solid rgba(74,222,128,.25);
    border-radius:50px;padding:8px 16px;font-size:.78rem;color:var(--text-2,#a7c4a8);
    text-decoration:none;z-index:9997;transition:border-color .2s,transform .2s,box-shadow .2s;
    box-shadow:0 2px 12px rgba(0,0,0,.3);
  }
  #kisanHelpline:hover{border-color:var(--green,#4ade80);color:var(--green,#4ade80);transform:translateY(-2px);box-shadow:0 4px 20px rgba(74,222,128,.2)}
  #kisanHelpline i{color:var(--green,#4ade80);font-size:.85rem}

  body.light-theme #kisanHelpline{background:#fff;color:#374151}
  body.light-theme #kisanPanel{background:#fff;border-color:rgba(22,101,52,.2)}
  body.light-theme .kp-msg.bot{background:#f0fdf4;color:#1a2e1c;border-color:rgba(22,101,52,.15)}
  body.light-theme .kp-input-bar{background:#f9fafb}
  body.light-theme #kisanInput{background:#fff;color:#1a2e1c;border-color:rgba(22,101,52,.2)}
  body.light-theme #kisanInput::placeholder{color:#9ca3af}
  body.light-theme .kp-mic-btn{background:#f0fdf4;color:#374151;border-color:rgba(22,101,52,.2)}
  body.light-theme .kp-lang-opt{background:#f0fdf4;color:#374151;border-color:rgba(22,101,52,.2)}
  body.light-theme .kp-lang-picker{background:#f9fafb}

  /* ── Per-message speaker button ── */
  .kp-msg-footer{
    display:flex;align-items:center;justify-content:flex-end;
    margin-top:6px;gap:6px;
  }
  .kp-speak-btn{
    background:none;border:1px solid rgba(74,222,128,.25);border-radius:50%;
    width:28px;height:28px;min-width:28px;
    display:flex;align-items:center;justify-content:center;
    color:rgba(74,222,128,.7);cursor:pointer;font-size:.72rem;
    transition:all .18s;flex-shrink:0;
    -webkit-tap-highlight-color:transparent;touch-action:manipulation;
  }
  .kp-speak-btn:hover,.kp-speak-btn:active{
    background:rgba(74,222,128,.12);border-color:var(--green,#4ade80);
    color:var(--green,#4ade80);transform:scale(1.12);
  }
  .kp-speak-btn.speaking{
    background:rgba(74,222,128,.15);border-color:var(--green,#4ade80);
    color:var(--green,#4ade80);animation:speakPulse .9s ease-in-out infinite;
  }
  .kp-speak-btn.paused{
    background:rgba(248,190,0,.1);border-color:#fbbf24;color:#fbbf24;
  }
  @keyframes speakPulse{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.35)}50%{box-shadow:0 0 0 5px rgba(74,222,128,0)}}
  body.light-theme .kp-speak-btn{border-color:rgba(22,101,52,.25);color:rgba(22,101,52,.6)}
  body.light-theme .kp-speak-btn:hover{background:rgba(22,101,52,.08);border-color:#166534;color:#166534}

  @media(max-width:600px){
    #kisanPanel{width:calc(100vw - 24px);right:12px;bottom:80px;max-height:72vh}
    #kisanToggleBtn{bottom:16px;right:12px;width:50px;height:50px}
    #kisanHelpline{bottom:12px;left:12px;font-size:.7rem;padding:6px 10px}
    #kisanHelpline strong{display:none}
    .kp-lang-options{grid-template-columns:1fr 1fr 1fr}
    .kp-lang-opt{padding:7px 4px;font-size:.68rem}
    .kp-speak-btn{width:32px;height:32px;min-width:32px;font-size:.8rem}
    #kisanInput{font-size:.85rem;padding:9px 12px}
    .kp-mic-btn,.kp-send-btn,.kp-stop-btn{width:38px;height:38px;font-size:.88rem}
  }`;
        document.head.appendChild(S);

        /* ── State ───────────────────────────────── */
        let chatHistory = [];
        let isOpen = false;
        let isBusy = false;
        let recognition = null;
        let isRecording = false;
        let langChosen = false;
        let chosenLang = null;
        let typingAborted = false;
        let currentSpeakBtn = null; // tracks which message's speaker btn is active
        let speechPaused = false; // tracks pause/play state
        let mobileSpeechText = '';   // full text currently being spoken (mobile)
        let mobileSpeechOffset = 0;  // character offset for mobile resume

        /* ── Mobile detection ───────────────────────── */
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
                      || ('ontouchstart' in window && navigator.maxTouchPoints > 1);

        /* ── Lang data ───────────────────────────── */
        const LANG_NAMES = {
            en: 'English',
            hi: 'हिन्दी',
            bn: 'বাংলা',
            te: 'తెలుగు',
            mr: 'मराठी',
            ta: 'தமிழ்',
            gu: 'ગુજરાતી',
            kn: 'ಕನ್ನಡ',
            ml: 'മലയാളം',
            pa: 'ਪੰਜਾਬੀ',
            or: 'ଓଡ଼ିଆ',
            as: 'অসমীয়া',
            ur: 'اردو',
            mai: 'मैथिली',
            ne: 'नेपाली',
            sa: 'संस्कृतम्',
            kok: 'कोंकणी',
            mni: 'মৈতৈলোন্',
            bodo: 'बड़ो',
            doi: 'डोगरी',
        };

        const GREETINGS = {
            en: '🌾 Hello farmer friend! I\'m SmartAgro Kisan Helper. Ask me anything about crops, weather, market prices, or government schemes like PM-KISAN.',
            hi: '🌾 नमस्ते किसान भाई! मैं SmartAgro किसान सहायक हूं। आप मुझसे मौसम, फसल, बाजार भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।',
            bn: '🌾 নমস্কার কৃষক বন্ধু! আমি SmartAgro কিষান সহায়ক। আবহাওয়া, ফসল, বাজার মূল্য বা সরকারি প্রকল্প সম্পর্কে জিজ্ঞেস করুন।',
            te: '🌾 నమస్కారం రైతు మిత్రమా! నేను SmartAgro కిసాన్ హెల్పర్. వాతావరణం, పంటలు, మార్కెట్ ధరలు గురించి అడగండి.',
            mr: '🌾 नमस्कार शेतकरी मित्रा! मी SmartAgro किसान सहाय्यक आहे। हवामान, पीक, बाजारभाव किंवा सरकारी योजनांबद्दल विचारा.',
            ta: '🌾 வணக்கம் விவசாயி நண்பரே! நான் SmartAgro கிசான் உதவியாளர். வானிலை, பயிர்கள், சந்தை விலைகள் பற்றி கேளுங்கள்.',
            gu: '🌾 નમસ્તે ખેડૂત મિત્ર! હું SmartAgro કિસાન સહાયક છું. હવામાન, પાક, બજાર ભાવ વિશે પૂછો.',
            kn: '🌾 ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರ! ನಾನು SmartAgro ಕಿಸಾನ್ ಸಹಾಯಕ. ಹವಾಮಾನ, ಬೆಳೆ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
            ml: '🌾 നമസ്കാരം കർഷക സുഹൃത്തേ! ഞാൻ SmartAgro കിസാൻ അസിസ്റ്റന്റ്. കാലാവസ്ഥ, വിളകൾ, വിപണി വില ചോദിക്കൂ.',
            pa: '🌾 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੇ! ਮੈਂ SmartAgro ਕਿਸਾਨ ਸਹਾਇਕ ਹਾਂ। ਮੌਸਮ, ਫਸਲ, ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।',
            or: '🌾 ନମସ୍କାର କୃଷକ ବନ୍ଧୁ! ମୁଁ SmartAgro କିସାନ ସହାୟକ। ଆବହାୱା, ଫସଲ, ବଜାର ମୂଲ୍ୟ ବିଷୟରେ ପଚାରନ୍ତୁ।',
            as: '🌾 নমস্কাৰ কৃষক বন্ধু! মই SmartAgro কিষান সহায়ক। বতৰ, শস্য, বজাৰ মূল্য বা চৰকাৰী আঁচনিৰ বিষয়ে সুধিব।',
            ur: '🌾 السلام علیکم کسان دوست! میں SmartAgro کسان مددگار ہوں۔ موسم، فصل، منڈی بھاؤ کے بارے میں پوچھیں۔',
            mai: '🌾 प्रणाम किसान भाई! हम SmartAgro किसान सहायक छी। मौसम, फसल, बाजार भाव के बारे में पूछू।',
            ne: '🌾 नमस्ते किसान साथी! म SmartAgro किसान सहायक हुँ। मौसम, बाली, बजार मूल्य वा सरकारी योजनाबारे सोध्नुस्।',
            sa: '🌾 नमस्ते कृषक मित्र! अहं SmartAgro किसान सहायकः अस्मि। कृषि, वायुमण्डलं, विपणनमूल्यं च पृच्छतु।',
            kok: '🌾 नमस्कार शेतकारी दोस्ता! हांव SmartAgro किसान सहाय्यक. हवामान, पीक, बाजारभाव विशीं विचार.',
            mni: '🌾 নমস্কার চাষী নুংশিজবা! ঐ SmartAgro কিসান হেল্পার নি। য়াম্না চাউখৎলবা বিউজেট বিষয়দা হায়বিয়ু।',
            bodo: '🌾 नमस्कार खेती आरो! आं SmartAgro किसान सहायक। मौसम, खेती, बाजार बिफान बिलाइ दिन्थि।',
            doi: '🌾 नमस्ते किसान भाई! मैं SmartAgro किसान सहायक आं। मौसम, फसल, बजार भाव बारे पुच्छो।',
        };

        const LANG_QUESTION = {
            en: 'Which language do you prefer for answers?',
            hi: 'आप किस भाषा में जवाब चाहते हैं?',
            default: 'Which language? / आप कौन सी भाषा चाहते हैं?',
        };

        const VOICE_LANGS = {
            en: 'en-IN',
            hi: 'hi-IN',
            bn: 'bn-IN',
            te: 'te-IN',
            mr: 'mr-IN',
            ta: 'ta-IN',
            gu: 'gu-IN',
            kn: 'kn-IN',
            ml: 'ml-IN',
            pa: 'pa-IN',
            or: 'or-IN',
            as: 'as-IN',
            ur: 'ur-PK',
            mai: 'hi-IN',
            ne: 'ne-NP',
            sa: 'hi-IN',
            kok: 'mr-IN',
            mni: 'bn-IN',
            bodo: 'hi-IN',
            doi: 'hi-IN',
        };
        // TTS language codes — Indian accent preferred
        const TTS_LANGS = {
            en: 'en-IN',
            hi: 'hi-IN',
            bn: 'bn-IN',
            te: 'te-IN',
            mr: 'mr-IN',
            ta: 'ta-IN',
            gu: 'gu-IN',
            kn: 'kn-IN',
            ml: 'ml-IN',
            pa: 'pa-IN',
            or: 'or-IN',
            as: 'as-IN',
            ur: 'ur-PK',
            mai: 'hi-IN',
            ne: 'ne-NP',
            sat: 'hi-IN',
            ks: 'ur-PK',
            sd: 'ur-PK',
            kok: 'mr-IN',
            mni: 'bn-BD',
            bodo: 'hi-IN',
            doi: 'hi-IN',
        };

        /* ── Helpers ─────────────────────────────── */
        function getMsgs() { return document.getElementById('kisanMessages'); }

        function getInput() { return document.getElementById('kisanInput'); }

        function scrollBot() { const m = getMsgs(); if (m) m.scrollTop = m.scrollHeight; }

        function getAppLang() { return chosenLang || localStorage.getItem('agrosmart_lang') || 'en'; }

        function updateSubLabel(lang) {
            const el = document.getElementById('kisanLangLabel');
            if (el) el.textContent = 'Answering in ' + (LANG_NAMES[lang] || lang.toUpperCase());
        }

        function showStopBtn() {
            const b = document.getElementById('kisanStopBtn');
            if (b) b.style.display = 'flex';
        }

        function hideStopBtn() {
            const b = document.getElementById('kisanStopBtn');
            if (b) b.style.display = 'none';
        }

        /* ── Toggle ──────────────────────────────── */
        window.toggleKisan = function() {
            const panel = document.getElementById('kisanPanel');
            isOpen = !isOpen;
            panel.classList.toggle('kp-hidden', !isOpen);
            if (!isOpen) stopSpeaking();
            if (isOpen) {
                if (chatHistory.length === 0 && !langChosen) showLangPicker();
                setTimeout(() => { const i = getInput(); if (i) i.focus(); }, 300);
            }
        };

        /* ── Language Picker ─────────────────────── */
        function showLangPicker() {
            // Remove existing picker first
            const old = document.getElementById('kisanLangPicker');
            if (old) old.remove();

            const appLang = localStorage.getItem('agrosmart_lang') || 'en';
            const q = LANG_QUESTION[appLang] || LANG_QUESTION.default;

            const picker = document.createElement('div');
            picker.className = 'kp-lang-picker';
            picker.id = 'kisanLangPicker';
            picker.innerHTML = `
      <p>${q}</p>
      <div class="kp-lang-options">
        ${Object.entries(LANG_NAMES).map(([code, name]) =>
          `<div class="kp-lang-opt" onclick="pickKisanLang('${code}')">${name}</div>`
        ).join('')}
      </div>
      <div class="kp-lang-skip" onclick="pickKisanLang('${appLang}')">
        Skip — use app language (${LANG_NAMES[appLang] || appLang})
      </div>`;

    const inputBar = document.querySelector('.kp-input-bar');
    if (inputBar && inputBar.parentNode) {
      inputBar.parentNode.insertBefore(picker, inputBar);
    }
  }

  window.pickKisanLang = function (code) {
    chosenLang  = code;
    langChosen  = true;
    const picker = document.getElementById('kisanLangPicker');
    if (picker) picker.remove();
    updateSubLabel(code);
    const greet = GREETINGS[code] || GREETINGS.en;
    appendBot(greet, true);
  };

  /* ── New Chat ────────────────────────────── */
  window.newKisanChat = function () {
    stopSpeaking();
    chatHistory   = [];
    langChosen    = false;
    chosenLang    = null;
    typingAborted = true;
    isBusy        = false;
    const msgs = getMsgs();
    if (msgs) msgs.innerHTML = '';
    hideStopBtn();
    const picker = document.getElementById('kisanLangPicker');
    if (picker) picker.remove();
    showLangPicker();
    updateSubLabel(localStorage.getItem('agrosmart_lang') || 'en');
  };

  /* ── Stop typing ─────────────────────────── */
window.stopKisanTyping = function () {
    typingAborted = true;
    isBusy        = false;
    hideStopBtn();
    stopSpeaking();
};

  /* ── Send message ────────────────────────── */
  window.sendKisanMessage = async function () {
    const input = getInput();
    const text  = (input ? input.value : '').trim();
    if (!text || isBusy) return;
    if (input) input.value = '';

    // Auto-pick app lang if user types without choosing
    if (!langChosen) {
      langChosen = true;
      chosenLang = localStorage.getItem('agrosmart_lang') || 'en';
      const picker = document.getElementById('kisanLangPicker');
      if (picker) picker.remove();
      updateSubLabel(chosenLang);
    }

    appendUser(text);
    chatHistory.push({ role: 'user', content: text });
    isBusy = true;
    const tid = showTyping();

    try {
      // Detect language change keywords in message
      const msgLower = text.toLowerCase();
      const langKeywords = {
        'english':'en','hindi':'hi','bengali':'bn','telugu':'te',
        'marathi':'mr','tamil':'ta','gujarati':'gu','kannada':'kn',
        'malayalam':'ml','punjabi':'pa','odia':'or','assamese':'as',
        'urdu':'ur','nepali':'ne','maithili':'mai','sanskrit':'sa',
        'konkani':'kok','manipuri':'mni','meitei':'mni','bodo':'bodo',
        'dogri':'doi','santhali':'sat','kashmiri':'ks','sindhi':'sd',
        'हिंदी':'hi','हिन्दी':'hi','বাংলা':'bn','తెలుగు':'te',
        'मराठी':'mr','தமிழ்':'ta','ગુજરાતી':'gu','ಕನ್ನಡ':'kn',
        'മലയാളം':'ml','ਪੰਜਾਬੀ':'pa','ଓଡ଼ିଆ':'or','অসমীয়া':'as',
        'اردو':'ur','मैथिली':'mai','संस्कृत':'sa','कोंकणी':'kok',
        'डोगरी':'doi','سنڌي':'sd','كٲشُر':'ks',
      };
      for (const [kw, code] of Object.entries(langKeywords)) {
        if (msgLower.includes(kw)) {
          chosenLang = code;
          updateSubLabel(code);
          break;
        }
      }

      const lang = getAppLang();
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: chatHistory, lang })
      });

      removeTyping(tid);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        appendBot('⚠️ Server error: ' + (err.error || res.status) + '. Please try again.', false);
        isBusy = false;
        return;
      }

      const data = await res.json();
      if (data.reply) {
        chatHistory.push({ role: 'assistant', content: data.reply });
        appendBot(data.reply, true);
      } else {
        appendBot('⚠️ ' + (data.error || 'No response received.'), false);
      }
    } catch (e) {
      removeTyping(tid);
      appendBot('⚠️ Connection error. Check your internet.', false);
      console.error('[KisanHelper]', e);
    }
    isBusy = false;
  };

  /* ── Message renderers ───────────────────── */
  function appendUser(text) {
    const el = document.createElement('div');
    el.className = 'kp-msg user';
    el.textContent = text;
    getMsgs().appendChild(el);
    scrollBot();
  }

  function appendBot(text, animate) {
    const wrapper = document.createElement('div');
    wrapper.className = 'kp-msg-wrapper';
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-self:flex-start;max-width:85%';

    const el = document.createElement('div');
    el.className = 'kp-msg bot';
    el.style.maxWidth = '100%';

    // Speaker button row
    const footer = document.createElement('div');
    footer.className = 'kp-msg-footer';

    const speakBtn = document.createElement('button');
    speakBtn.className = 'kp-speak-btn';
    speakBtn.title = 'Listen';
    speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    speakBtn.setAttribute('aria-label', 'Play / Pause voice');

    speakBtn.addEventListener('click', handleSpeakBtnAction);
    speakBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      handleSpeakBtnAction(e);
    }, { passive: false });

    function handleSpeakBtnAction(e) {
      e.stopPropagation();
      const synth = window.speechSynthesis;

      // ── This button is active and speaking → PAUSE ──
      if (currentSpeakBtn === speakBtn && !speechPaused) {
        speechPaused = true;
        speakBtn.classList.remove('speaking');
        speakBtn.classList.add('paused');
        speakBtn.innerHTML = '<i class="fas fa-play"></i>';
        speakBtn.title = 'Resume';
        // Web Speech pause() works on desktop; on mobile it's unreliable
        // but we still call it as best-effort — stopSpeaking/restart
        // on resume is the reliable mobile path handled below.
        if (synth) synth.pause();
        return;
      }

      // ── This button is active and paused → RESUME ──
      if (currentSpeakBtn === speakBtn && speechPaused) {
        speechPaused = false;
        speakBtn.classList.remove('paused');
        speakBtn.classList.add('speaking');
        speakBtn.innerHTML = '<i class="fas fa-pause"></i>';
        speakBtn.title = 'Pause';
        if (isMobile) {
          // Mobile: synth.resume() is unreliable — restart from beginning
          // (pause/resume is best-effort on mobile Web Speech)
          speakText(el.textContent, getAppLang(), speakBtn);
        } else {
          if (synth) synth.resume();
        }
        return;
      }

      // ── Different / new message → start fresh ──
      speakText(el.textContent, getAppLang(), speakBtn);
    }

    footer.appendChild(speakBtn);
    wrapper.appendChild(el);
    wrapper.appendChild(footer);
    getMsgs().appendChild(wrapper);
    scrollBot();

   // Inside appendBot(), replace the animate block:
    if (animate) {
        typingAborted = false;
        showStopBtn();
        typeWriter(el, text, 0, () => {
            // Speak only after typing animation ends
            speakText(text, getAppLang(), speakBtn);
        });
    } else {
        el.textContent = text;
        scrollBot();
    }
  }

 // Replace typeWriter function:
function typeWriter(el, text, i, onComplete) {
    if (typingAborted) {
        el.textContent = text;
        typingAborted  = false;
        hideStopBtn();
        scrollBot();
        if (onComplete) onComplete();
        return;
    }
    if (i < text.length) {
        el.textContent += text[i];
        scrollBot();
        setTimeout(() => typeWriter(el, text, i + 1, onComplete), 18);
    } else {
        hideStopBtn();
        if (onComplete) onComplete();
    }
}

  function showTyping() {
    const id = 'kp-typing-' + Date.now();
    const el = document.createElement('div');
    el.className = 'kp-msg bot';
    el.id = id;
    el.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    getMsgs().appendChild(el);
    scrollBot();
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
  /* ── Reset any active speaker button to default ── */
  function resetSpeakBtnUI() {
    if (currentSpeakBtn) {
      currentSpeakBtn.classList.remove('speaking', 'paused');
      currentSpeakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      currentSpeakBtn.title = 'Listen';
    }
    currentSpeakBtn = null;
    speechPaused = false;
  }

  /* ══════════════════════════════════════════════════════════
     TEXT-TO-SPEECH  —  Web Speech API, correctly configured
     ────────────────────────────────────────────────────────
     ROOT CAUSE OF PREVIOUS FAILURES:
     Explicitly setting utter.voice overrides Android's Google
     TTS service. When a language like Gujarati has no matching
     voice in getVoices(), the override forces a Hindi/English
     voice which can't read Gujarati script → silence.

     CORRECT APPROACH:
     • Set utter.lang to the right BCP-47 code.
     • On MOBILE: do NOT set utter.voice at all.
       Android Chrome delegates to the Google TTS system service
       which handles ALL Indian languages server-side.
     • On DESKTOP: set utter.voice only on an exact lang match.
  ══════════════════════════════════════════════════════════ */

  /* BCP-47 lang tag for each app language code */
  const TTS_LANG_TAG = {
    en:   'en-IN',
    hi:   'hi-IN',
    bn:   'bn-IN',
    te:   'te-IN',
    mr:   'mr-IN',
    ta:   'ta-IN',
    gu:   'gu-IN',
    kn:   'kn-IN',
    ml:   'ml-IN',
    pa:   'pa-IN',
    or:   'or-IN',
    as:   'as-IN',
    ur:   'ur-PK',
    mai:  'hi-IN',   // Maithili  → Hindi (Devanagari)
    ne:   'ne-NP',
    sa:   'hi-IN',   // Sanskrit  → Hindi
    kok:  'mr-IN',   // Konkani   → Marathi
    mni:  'bn-IN',   // Meitei    → Bengali script
    bodo: 'hi-IN',   // Bodo      → Hindi
    doi:  'hi-IN',   // Dogri     → Hindi
    sat:  'hi-IN',   // Santali   → Hindi
    ks:   'ur-PK',   // Kashmiri  → Urdu
    sd:   'ur-PK',   // Sindhi    → Urdu
  };

  /* Strip emoji, markdown symbols before speaking */
  function cleanForTTS(text) {
    return text
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/[\u2600-\u27BF]/g, '')
      .replace(/[⚠️✓•→★☆]/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .trim();
  }

  /*
   * speakText — single Web Speech API engine.
   *
   * MOBILE:  set utter.lang only, never utter.voice.
   *          Android's Google TTS service reads the lang tag and
   *          uses the correct language engine server-side.
   *
   * DESKTOP: set utter.lang, then utter.voice only on exact match.
   */
  function speakText(text, lang, speakBtn) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    resetSpeakBtnUI();

    const cleaned = cleanForTTS(text);
    if (!cleaned) return;

    mobileSpeechText   = cleaned;
    mobileSpeechOffset = 0;

    const synth     = window.speechSynthesis;
    const langTag   = TTS_LANG_TAG[lang] || 'hi-IN';
    const toggleBtn = document.getElementById('kisanToggleBtn');

    if (speakBtn) {
      currentSpeakBtn = speakBtn;
      speechPaused    = false;
      speakBtn.classList.remove('paused');
      speakBtn.classList.add('speaking');
      speakBtn.innerHTML = '<i class="fas fa-pause"></i>';
      speakBtn.title = 'Pause';
    }
    if (toggleBtn) toggleBtn.innerHTML =
      '<i class="fas fa-volume-up" style="color:#fff;font-size:1.3rem"></i><span class="kw-pulse"></span>';

    const onDone = () => {
      mobileSpeechText   = '';
      mobileSpeechOffset = 0;
      if (toggleBtn) toggleBtn.innerHTML =
        '<i class="fas fa-microphone-alt" style="color:#fff;font-size:1.45rem"></i><span class="kw-pulse"></span>';
      resetSpeakBtnUI();
    };

    function doSpeak(voices) {
      const utter  = new SpeechSynthesisUtterance(cleaned);
      utter.lang   = langTag;
      utter.rate   = 0.88;
      utter.pitch  = 1.0;
      utter.volume = 1.0;

      if (!isMobile && voices && voices.length) {
        // Desktop only: set voice on exact language match
        const base  = langTag.split('-')[0];
        const match = voices.find(v => v.lang === langTag)
                   || voices.find(v => v.lang.startsWith(base + '-'))
                   || voices.find(v => v.lang.startsWith(base));
        if (match) utter.voice = match;
        // If no match, leave utter.voice unset (browser chooses)
      }
      // Mobile: utter.voice deliberately NOT set — Android Google TTS
      // handles the language via its own service when only lang is set.

      utter.onboundary = (e) => {
        if (e.name === 'word') mobileSpeechOffset = e.charIndex || 0;
      };
      utter.onend   = onDone;
      utter.onerror = (e) => { if (e.error !== 'interrupted') onDone(); };

      // Small delay on mobile after any prior cancel()
      setTimeout(() => synth.speak(utter), isMobile ? 150 : 0);
    }

    if (isMobile) {
      // No need to wait for voices — we're not using them
      doSpeak(null);
    } else {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        doSpeak(voices);
      } else {
        synth.onvoiceschanged = () => {
          synth.onvoiceschanged = null;
          doSpeak(synth.getVoices());
        };
        // Safety fallback if event never fires
        setTimeout(() => {
          if (!synth.speaking) doSpeak(synth.getVoices());
        }, 600);
      }
    }
  }

  function stopSpeaking() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    mobileSpeechText   = '';
    mobileSpeechOffset = 0;
    const toggleBtn = document.getElementById('kisanToggleBtn');
    if (toggleBtn) toggleBtn.innerHTML =
      '<i class="fas fa-microphone-alt" style="color:#fff;font-size:1.45rem"></i><span class="kw-pulse"></span>';
  }

  /* ── iOS audio context unlock on first touch ── */
  if (isMobile) {
    document.addEventListener('touchstart', function _iosUnlock() {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(u);
        window.speechSynthesis.cancel();
      }
      document.removeEventListener('touchstart', _iosUnlock);
    }, { once: true, passive: true });
  }

  /* ── Voice input ─────────────────────────── */
  window.toggleKisanMic = function () {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported. Please use Chrome.'); return; }
    if (isRecording) { if (recognition) recognition.stop(); return; }

    recognition = new SR();
    recognition.lang = VOICE_LANGS[getAppLang()] || 'hi-IN';
    recognition.continuous     = false;
    recognition.interimResults = true;

    const btn = document.getElementById('kisanMicBtn');
    recognition.onstart  = () => {
      isRecording = true;
      btn.classList.add('recording');
      btn.innerHTML = '<i class="fas fa-stop"></i>';
    };
    recognition.onresult = e => {
      if (getInput()) getInput().value = Array.from(e.results).map(r => r[0].transcript).join('');
    };
    recognition.onend    = () => {
      isRecording = false;
      btn.classList.remove('recording');
      btn.innerHTML = '<i class="fas fa-microphone"></i>';
      const val = getInput() ? getInput().value.trim() : '';
      if (val) sendKisanMessage();
    };
    recognition.onerror  = () => {
      isRecording = false;
      btn.classList.remove('recording');
      btn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    recognition.start();
  };

  /* ── Sync with app language toggle ──────── */
  const _orig = window.setLanguage;
  window.setLanguage = function (code) {
    if (_orig) _orig(code);
    if (!langChosen) updateSubLabel(code);
  };

})();
