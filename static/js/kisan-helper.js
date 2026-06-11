/* ═══════════════════════════════════════════════
   kisan-helper.js — Kisan Helper Voice+Chat Widget
   v3: Romanization approach — all responses written
   in English alphabet phonetics of chosen language.
   Works on ALL mobile devices (iOS/Android/WebView)
   because only en-IN TTS is needed — always available.
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
  position:fixed;
  bottom:calc(28px + env(safe-area-inset-bottom,0px));
  right:calc(28px + env(safe-area-inset-right,0px));
  width:58px;height:58px;border-radius:50%;
  background:linear-gradient(135deg,#166534,#22c55e);
  box-shadow:0 4px 24px rgba(74,222,128,.45);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;z-index:9999;transition:transform .2s,box-shadow .2s;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
#kisanToggleBtn:active{transform:scale(1.1);box-shadow:0 6px 32px rgba(74,222,128,.6)}
#kisanToggleBtn i{font-size:1.45rem;color:#fff;pointer-events:none}
.kw-pulse{
  position:absolute;top:-3px;right:-3px;width:13px;height:13px;
  background:#f87171;border-radius:50%;
  animation:kwp 1.8s ease-in-out infinite;pointer-events:none;
}
@keyframes kwp{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}

#kisanPanel{
  position:fixed;
  bottom:calc(100px + env(safe-area-inset-bottom,0px));
  right:calc(28px + env(safe-area-inset-right,0px));
  width:min(340px,calc(100vw - 24px));
  max-height:min(75vh,calc(100dvh - 130px));
  background:var(--card,#111a12);
  border:1px solid rgba(74,222,128,.25);
  border-radius:20px;box-shadow:0 8px 48px rgba(0,0,0,.5);
  display:flex;flex-direction:column;z-index:9998;
  animation:panelIn .25s cubic-bezier(.34,1.56,.64,1);
  overflow:hidden;
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
  width:32px;height:32px;display:flex;align-items:center;justify-content:center;
  color:#fff;cursor:pointer;font-size:.8rem;transition:background .2s;flex-shrink:0;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
.kp-close:active{background:rgba(248,113,113,.4)}
.kp-newchat-btn:active{background:rgba(74,222,128,.35)}

/* ── Lang picker ── */
.kp-lang-picker{
  padding:10px 12px;display:flex;flex-direction:column;gap:8px;
  flex-shrink:0;max-height:min(260px,40vh);overflow-y:auto;
  border-bottom:1px solid rgba(74,222,128,.1);
}
.kp-lang-picker::-webkit-scrollbar{width:3px}
.kp-lang-picker::-webkit-scrollbar-thumb{background:rgba(74,222,128,.2);border-radius:2px}
.kp-lang-picker p{font-size:.78rem;color:var(--text-2,#a7c4a8);text-align:center;margin:0;flex-shrink:0}
.kp-lang-options{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
.kp-lang-opt{
  padding:9px 5px;border-radius:8px;font-size:.7rem;font-weight:600;
  background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.2);
  color:var(--text-2,#a7c4a8);cursor:pointer;transition:all .15s;text-align:center;
  min-height:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:2px;line-height:1.2;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
  user-select:none;-webkit-user-select:none;
}
.kp-lang-opt .kl-roman{font-size:.58rem;font-weight:400;opacity:.6;margin-top:1px}
.kp-lang-opt:active,.kp-lang-opt.kl-speaking{
  background:rgba(74,222,128,.15);border-color:var(--green,#4ade80);
  color:var(--green,#4ade80);transform:scale(.96);
}
@keyframes klSpeak{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}50%{box-shadow:0 0 0 5px rgba(74,222,128,.2)}}
.kp-lang-opt.kl-speaking{animation:klSpeak .6s ease-in-out infinite}
.kp-lang-skip{
  font-size:.7rem;color:var(--text-3,#6b8c6d);text-align:center;
  cursor:pointer;text-decoration:underline;margin-top:2px;flex-shrink:0;
  padding:6px;-webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
.kp-lang-skip:active{color:var(--green,#4ade80)}

/* ── Messages ── */
.kp-messages{
  flex:1;overflow-y:auto;padding:12px 10px;
  display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;min-height:80px;
}
.kp-messages::-webkit-scrollbar{width:4px}
.kp-messages::-webkit-scrollbar-thumb{background:rgba(74,222,128,.2);border-radius:2px}
.kp-msg{
  max-width:85%;padding:9px 12px;border-radius:14px;
  font-size:.82rem;line-height:1.6;animation:msgIn .2s ease;word-break:break-word;
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
  background:var(--green,#4ade80);border-radius:50%;margin:0 2px;animation:dot 1.2s infinite;
}
.typing-dots span:nth-child(2){animation-delay:.2s}
.typing-dots span:nth-child(3){animation-delay:.4s}
@keyframes dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}

/* ── Input bar ── */
.kp-input-bar{
  display:flex;align-items:center;gap:5px;padding:8px 10px;
  border-top:1px solid rgba(74,222,128,.1);background:var(--bg-2,#0e1510);
  flex-shrink:0;border-radius:0 0 20px 20px;
}
#kisanInput{
  flex:1;background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.2);
  border-radius:20px;padding:7px 12px;color:var(--text,#e8f5e9);
  font-size:16px;font-family:inherit;outline:none;transition:border-color .2s;min-width:0;
}
#kisanInput:focus{border-color:rgba(74,222,128,.5)}
#kisanInput::placeholder{color:rgba(255,255,255,.35)}
.kp-mic-btn,.kp-send-btn,.kp-stop-btn{
  width:40px;height:40px;border-radius:50%;border:none;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:.9rem;transition:transform .2s,background .2s;flex-shrink:0;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
.kp-mic-btn{background:var(--bg-3,#1a2a1c);border:1px solid rgba(74,222,128,.2);color:var(--text-2,#a7c4a8)}
.kp-mic-btn:active{background:rgba(74,222,128,.1);color:var(--green,#4ade80)}
.kp-mic-btn.recording{background:rgba(248,113,113,.15);border-color:#f87171;color:#f87171;animation:micP .8s ease-in-out infinite}
@keyframes micP{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.kp-send-btn{background:linear-gradient(135deg,#166534,#22c55e);color:#fff;box-shadow:0 2px 8px rgba(74,222,128,.3)}
.kp-send-btn:active{transform:scale(1.08)}
.kp-stop-btn{background:rgba(248,113,113,.15);border:1px solid #f87171;color:#f87171}
.kp-stop-btn:active{background:rgba(248,113,113,.3);transform:scale(1.08)}

/* ── Helpline ── */
#kisanHelpline{
  position:fixed;
  bottom:calc(20px + env(safe-area-inset-bottom,0px));
  left:calc(20px + env(safe-area-inset-left,0px));
  display:flex;align-items:center;gap:8px;
  background:var(--card,#111a12);border:1px solid rgba(74,222,128,.25);
  border-radius:50px;padding:8px 16px;font-size:.78rem;color:var(--text-2,#a7c4a8);
  text-decoration:none;z-index:9997;transition:border-color .2s,transform .2s,box-shadow .2s;
  box-shadow:0 2px 12px rgba(0,0,0,.3);
}
#kisanHelpline:active{border-color:var(--green,#4ade80);color:var(--green,#4ade80)}
#kisanHelpline i{color:var(--green,#4ade80);font-size:.85rem}

/* ── Per-message speaker button ── */
.kp-msg-footer{display:flex;align-items:center;justify-content:flex-end;margin-top:6px;gap:6px}
.kp-speak-btn{
  background:none;border:1px solid rgba(74,222,128,.25);border-radius:50%;
  width:32px;height:32px;min-width:32px;
  display:flex;align-items:center;justify-content:center;
  color:rgba(74,222,128,.7);cursor:pointer;font-size:.8rem;transition:all .18s;flex-shrink:0;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
.kp-speak-btn:active{background:rgba(74,222,128,.12);border-color:var(--green,#4ade80);color:var(--green,#4ade80)}
.kp-speak-btn.speaking{
  background:rgba(74,222,128,.15);border-color:var(--green,#4ade80);color:var(--green,#4ade80);
  animation:speakPulse .9s ease-in-out infinite;
}
.kp-speak-btn.paused{background:rgba(248,190,0,.1);border-color:#fbbf24;color:#fbbf24}
@keyframes speakPulse{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.35)}50%{box-shadow:0 0 0 5px rgba(74,222,128,0)}}

/* Light theme */
body.light-theme #kisanHelpline{background:#fff;color:#374151}
body.light-theme #kisanPanel{background:#fff;border-color:rgba(22,101,52,.2)}
body.light-theme .kp-msg.bot{background:#f0fdf4;color:#1a2e1c;border-color:rgba(22,101,52,.15)}
body.light-theme .kp-input-bar{background:#f9fafb}
body.light-theme #kisanInput{background:#fff;color:#1a2e1c;border-color:rgba(22,101,52,.2)}
body.light-theme #kisanInput::placeholder{color:#9ca3af}
body.light-theme .kp-mic-btn{background:#f0fdf4;color:#374151;border-color:rgba(22,101,52,.2)}
body.light-theme .kp-lang-opt{background:#f0fdf4;color:#374151;border-color:rgba(22,101,52,.2)}
body.light-theme .kp-lang-picker{background:#f9fafb}
body.light-theme .kp-speak-btn{border-color:rgba(22,101,52,.25);color:rgba(22,101,52,.6)}

@media(max-width:600px){
  #kisanPanel{
    width:calc(100vw - 16px);
    right:calc(8px + env(safe-area-inset-right,0px));
    left:calc(8px + env(safe-area-inset-left,0px));
    bottom:calc(80px + env(safe-area-inset-bottom,0px));
    max-height:min(74vh,calc(100dvh - 100px));
    border-radius:16px;
  }
  #kisanToggleBtn{
    bottom:calc(16px + env(safe-area-inset-bottom,0px));
    right:calc(12px + env(safe-area-inset-right,0px));
    width:52px;height:52px;
  }
  #kisanHelpline{
    bottom:calc(12px + env(safe-area-inset-bottom,0px));
    left:calc(8px + env(safe-area-inset-left,0px));
    font-size:.68rem;padding:5px 10px;
  }
  #kisanHelpline strong{display:none}
  .kp-lang-opt{min-height:48px;padding:8px 3px;font-size:.68rem}
  .kp-speak-btn{width:36px;height:36px;min-width:36px;font-size:.85rem}
  .kp-mic-btn,.kp-send-btn,.kp-stop-btn{width:42px;height:42px}
  .kp-header{padding:10px 12px}
  .kp-close,.kp-newchat-btn{width:34px;height:34px}
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
    let currentSpeakBtn = null;
    let speechPaused = false;

    /* ── Lang data ───────────────────────────── */
    // Display name (native script) + romanized pronunciation for the speak button
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

    // Romanized pronunciation shown below native script on button
    const LANG_ROMAN = {
        en: 'English',
        hi: 'Hindi',
        bn: 'Bangla',
        te: 'Telugu',
        mr: 'Marathi',
        ta: 'Tamil',
        gu: 'Gujarati',
        kn: 'Kannada',
        ml: 'Malayalam',
        pa: 'Punjabi',
        or: 'Odia',
        as: 'Assamese',
        ur: 'Urdu',
        mai: 'Maithili',
        ne: 'Nepali',
        sa: 'Sanskrit',
        kok: 'Konkani',
        mni: 'Meitei',
        bodo: 'Bodo',
        doi: 'Dogri',
    };

    /*
     * What the speaker says when user taps a language button.
     * Written in English alphabet so en-IN voice reads it correctly on ALL devices.
     */
    const LANG_SPEAK_TEXT = {
        en: 'English',
        hi: 'Hindi — Aapki bhasha Hindi hai',
        bn: 'Bangla — Aapnar bhasha Bangla',
        te: 'Telugu — Mee bhaasha Telugu',
        mr: 'Marathi — Tumchi bhaasha Marathi',
        ta: 'Tamil — Ungal moli Tamil',
        gu: 'Gujarati — Tamari bhaasha Gujarati',
        kn: 'Kannada — Nimma bhaashe Kannada',
        ml: 'Malayalam — Ningalude bhaasha Malayalam',
        pa: 'Punjabi — Teri boli Punjabi',
        or: 'Odia — Aapanka bhaasha Odia',
        as: 'Assamese — Aapunar bhaaxa Assamese',
        ur: 'Urdu — Aap ki zaban Urdu hai',
        mai: 'Maithili — Apan bhaasha Maithili',
        ne: 'Nepali — Tapaaiko bhaasha Nepali',
        sa: 'Sanskrit — Bhavatah bhaasha Samskritam',
        kok: 'Konkani — Tumchi bhaasha Konkani',
        mni: 'Meitei — Nanggi lon Meitei',
        bodo: 'Bodo — Nwng bw Bodo',
        doi: 'Dogri — Teri boli Dogri',
    };

    /*
     * Romanized greetings — spoken by en-IN TTS voice on ALL devices.
     * Also shown as the display text (readable on every mobile).
     */
    const GREETINGS = {
        en: '🌾 Hello farmer friend! I am SmartAgro Kisan Helper. Ask me about crops, weather, market prices, or government schemes like PM-KISAN.',
        hi: '🌾 Namaste kisan bhai! Main SmartAgro Kisan Sahayak hoon. Aap mujhse mausam, fasal, baazaar bhaav ya sarkari yojanaon ke baare mein pooch sakte hain.',
        bn: '🌾 Nomoshkar krishok bondhu! Ami SmartAgro Kishan Sahayak. Aabohawa, foshol, bazar mulyo ba shorkaari prokolpo shomporke jiggesh korun.',
        te: '🌾 Namaskaram raitu mitruda! Nenu SmartAgro Kisan Helper. Vaatavaranam, pantalu, market dhaaralu gurinchi adagandi.',
        mr: '🌾 Namaskar shetkari mithraa! Mi SmartAgro Kisan Sahaayyak aahe. Hawamaan, peek, baazarbhaav kiva sarkari yojanaanbaddal vicharaa.',
        ta: '🌾 Vanakkam vivasaayi nanbharE! Naan SmartAgro Kisan Udaviyaalar. Vaanilai, payirkal, sandai vilaikal pattri keelungal.',
        gu: '🌾 Namaste khedoot mitra! Hoon SmartAgro Kisan Sahayak chhun. Hawaman, paak, bazaar bhaav vishe poochho.',
        kn: '🌾 Namaskara raita mitra! Naanu SmartAgro Kisan Sahayaka. Hawaamaana, bele, maarukatte belgalu bagge keeli.',
        ml: '🌾 Namaskaram karshaka suhruthe! Njaan SmartAgro Kisan Assistant. Kaalavastha, vilakkal, vipani vila choadikhkoo.',
        pa: '🌾 Sat sri akaal kisan veere! Main SmartAgro Kisan Sahayak haan. Mausam, fasal, mandi bhaav baare puchho.',
        or: '🌾 Namaskar krushak bandhu! Mun SmartAgro Kisan Sahayak. Aabhaawa, fasal, bazaar mulya bishayare pachaara.',
        as: '🌾 Nomashkar krishhok bondhu! Moi SmartAgro Kishan Shahayak. Batar, shashyo, bazaar mulyo ba charkari aanshonir bishaye soodibo.',
        ur: '🌾 Assalaamu alaykum kisaan dost! Main SmartAgro Kisaan Madadgaar hoon. Mausam, fasal, mandi bhaao ke baare mein poochhein.',
        mai: '🌾 Pranaam kisaan bhai! Hum SmartAgro Kisaan Sahayak chhi. Mausam, fasaL, baazaar bhaav ke baare mein poochhu.',
        ne: '🌾 Namaste kisaan saathi! Ma SmartAgro Kisaan Sahayak hun. Mausam, baali, bazaar mulya vaa sarkari yojanabare sodhnus.',
        sa: '🌾 Namaste krishak mitra! Aham SmartAgro Kisan Sahayakah asmi. Krishi, vaayumanDalam, vipaNana mulya cha prichhatu.',
        kok: '🌾 Namaskar shetkari dosta! Haaov SmartAgro Kisan Sahaayyak. Hawaman, peek, baazarbhaav visheen vichaar.',
        mni: '🌾 Namashkaar chaashi nungshibaa! Ei SmartAgro Kisan Helper ni. Paangam, pambei, market tengbang bishayada haabigU.',
        bodo: '🌾 Namashkaar kheti aaro! Ang SmartAgro Kisan Sahayak. Mausam, kheti, bazaar biphaan bilaai dinthiz.',
        doi: '🌾 Namaste kisaan bhai! Main SmartAgro Kisaan Sahayak aan. Mausam, fasal, bazaar bhaav baare puchho.',
    };

    const LANG_QUESTION_ROMAN = 'Kaun si bhaasha mein baat karein? / Which language?';

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

    /* ── Helpers ─────────────────────────────── */
    function getMsgs() { return document.getElementById('kisanMessages'); }

    function getInput() { return document.getElementById('kisanInput'); }

    function scrollBot() { const m = getMsgs(); if (m) m.scrollTop = m.scrollHeight; }

    function getAppLang() { return chosenLang || localStorage.getItem('agrosmart_lang') || 'en'; }

    function updateSubLabel(lang) {
        const el = document.getElementById('kisanLangLabel');
        const roman = LANG_ROMAN[lang] || lang.toUpperCase();
        if (el) el.textContent = 'Answering in ' + roman + ' (Roman)';
    }

    function showStopBtn() { const b = document.getElementById('kisanStopBtn'); if (b) b.style.display = 'flex'; }

    function hideStopBtn() { const b = document.getElementById('kisanStopBtn'); if (b) b.style.display = 'none'; }

    /* ── TTS — en-IN only, works on ALL devices ── */
    function doSpeak(text, onDone) {
        if (!window.speechSynthesis) { if (onDone) onDone(); return; }
        try { window.speechSynthesis.cancel(); } catch (e) {}

        const utter = new SpeechSynthesisUtterance(text
            .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
            .replace(/[⚠️✓•→*]/g, '')
            .trim()
        );
        utter.lang = 'en-IN';
        utter.rate = 0.88;
        utter.pitch = 1.0;
        utter.volume = 1.0;

        if (onDone) { utter.onend = onDone;
            utter.onerror = onDone; }

        // Set en-IN voice if available; fall back to any English voice
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const v = voices.find(v => v.lang === 'en-IN') ||
                voices.find(v => v.lang.startsWith('en-')) ||
                voices.find(v => v.lang.startsWith('en'));
            if (v) utter.voice = v;
        }

        // Call speak() directly — this is always called from a click/touchend user gesture
        window.speechSynthesis.speak(utter);
    }

    function resetSpeakBtnUI() {
        if (currentSpeakBtn) {
            currentSpeakBtn.classList.remove('speaking', 'paused');
            currentSpeakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            currentSpeakBtn.title = 'Listen';
        }
        currentSpeakBtn = null;
        speechPaused = false;
    }

    function speakText(text, speakBtn) {
        if (!window.speechSynthesis) return;
        try { window.speechSynthesis.cancel(); } catch (e) {}
        resetSpeakBtnUI();

        if (speakBtn) {
            currentSpeakBtn = speakBtn;
            speechPaused = false;
            speakBtn.classList.add('speaking');
            speakBtn.innerHTML = '<i class="fas fa-pause"></i>';
            speakBtn.title = 'Pause';
        }

        const toggleBtn = document.getElementById('kisanToggleBtn');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-volume-up" style="color:#fff;font-size:1.3rem"></i><span class="kw-pulse"></span>';

        doSpeak(text, () => {
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-microphone-alt" style="color:#fff;font-size:1.45rem"></i><span class="kw-pulse"></span>';
            resetSpeakBtnUI();
        });
    }

    function stopSpeaking() {
        if (window.speechSynthesis) try { window.speechSynthesis.cancel(); } catch (e) {}
        resetSpeakBtnUI();
        const b = document.getElementById('kisanToggleBtn');
        if (b) b.innerHTML = '<i class="fas fa-microphone-alt" style="color:#fff;font-size:1.45rem"></i><span class="kw-pulse"></span>';
    }

    /* ── Toggle panel ────────────────────────── */
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
        const old = document.getElementById('kisanLangPicker');
        if (old) old.remove();

        const picker = document.createElement('div');
        picker.className = 'kp-lang-picker';
        picker.id = 'kisanLangPicker';

        const label = document.createElement('p');
        label.textContent = LANG_QUESTION_ROMAN;
        picker.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'kp-lang-options';

        Object.entries(LANG_NAMES).forEach(function([code, nativeName]) {
            const romanName = LANG_ROMAN[code] || code;

            const btn = document.createElement('div');
            btn.className = 'kp-lang-opt';
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');

            // Native script on top
            const topSpan = document.createElement('span');
            topSpan.textContent = nativeName;

            // Romanized below (small, for readability)
            const romSpan = document.createElement('span');
            romSpan.className = 'kl-roman';
            romSpan.textContent = romanName;

            btn.appendChild(topSpan);
            btn.appendChild(romSpan);

            /* ──────────────────────────────────────────────────
             * MOBILE TTS STRATEGY (the definitive fix):
             *
             * The browser ONLY allows speechSynthesis.speak() inside
             * a trusted user gesture (click or touchend).
             *
             * We use ONE unified handler for both tap and click:
             *   - touchstart: flag that it's touch, record coords
             *   - touchmove:  detect scroll
             *   - touchend:   if not scroll → speak + pick (after 700ms)
             *                 preventDefault() blocks the ghost click
             *   - click:      fires on desktop only (touch devices blocked above)
             *
             * Text spoken = LANG_SPEAK_TEXT[code] which is already
             * in English alphabet — reads perfectly on en-IN TTS
             * that is ALWAYS available on every iOS and Android device.
             ────────────────────────────────────────────────── */
            let touchStartX = 0,
                touchStartY = 0,
                touchScrolled = false,
                isTouched = false;

            btn.addEventListener('touchstart', function(e) {
                isTouched = true;
                touchScrolled = false;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            btn.addEventListener('touchmove', function(e) {
                if (Math.abs(e.touches[0].clientX - touchStartX) > 8 ||
                    Math.abs(e.touches[0].clientY - touchStartY) > 8) {
                    touchScrolled = true;
                }
            }, { passive: true });

            btn.addEventListener('touchend', function(e) {
                if (touchScrolled) return;
                e.preventDefault(); // block ghost click

                btn.classList.add('kl-speaking');
                // Speak language preview in English alphabet — works on every device
                doSpeak(LANG_SPEAK_TEXT[code], null);

                setTimeout(function() {
                    btn.classList.remove('kl-speaking');
                    window.pickKisanLang(code);
                }, 700);
            }, { passive: false });

            // Desktop click only (isTouched prevents double-fire on touch devices)
            btn.addEventListener('click', function() {
                if (isTouched) return;
                btn.classList.add('kl-speaking');
                doSpeak(LANG_SPEAK_TEXT[code], null);
                setTimeout(function() {
                    btn.classList.remove('kl-speaking');
                    window.pickKisanLang(code);
                }, 700);
            });

            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    doSpeak(LANG_SPEAK_TEXT[code], null);
                    setTimeout(function() { window.pickKisanLang(code); }, 700);
                }
            });

            grid.appendChild(btn);
        });

        picker.appendChild(grid);

        const appLang = localStorage.getItem('agrosmart_lang') || 'en';
        const skip = document.createElement('div');
        skip.className = 'kp-lang-skip';
        skip.textContent = 'Skip — use ' + (LANG_ROMAN[appLang] || 'English');
        skip.addEventListener('click', function() { window.pickKisanLang(appLang); });
        picker.appendChild(skip);

        const inputBar = document.querySelector('.kp-input-bar');
        if (inputBar && inputBar.parentNode) inputBar.parentNode.insertBefore(picker, inputBar);
    }

    window.pickKisanLang = function(code) {
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
        document.querySelectorAll('.kp-lang-opt.kl-speaking').forEach(el => el.classList.remove('kl-speaking'));

        chosenLang = code;
        langChosen = true;
        const picker = document.getElementById('kisanLangPicker');
        if (picker) picker.remove();
        updateSubLabel(code);

        const greet = GREETINGS[code] || GREETINGS.en;
        appendBot(greet, true);
    };

    /* ── New Chat ────────────────────────────── */
    window.newKisanChat = function() {
        stopSpeaking();
        chatHistory = [];
        langChosen = false;
        chosenLang = null;
        typingAborted = true;
        isBusy = false;
        const msgs = getMsgs();
        if (msgs) msgs.innerHTML = '';
        hideStopBtn();
        const picker = document.getElementById('kisanLangPicker');
        if (picker) picker.remove();
        showLangPicker();
        updateSubLabel(localStorage.getItem('agrosmart_lang') || 'en');
    };

    /* ── Stop typing ─────────────────────────── */
    window.stopKisanTyping = function() {
        typingAborted = true;
        isBusy = false;
        hideStopBtn();
        stopSpeaking();
    };

    /* ── Send message ────────────────────────── */
    window.sendKisanMessage = async function() {
        const input = getInput();
        const text = (input ? input.value : '').trim();
        if (!text || isBusy) return;
        if (input) input.value = '';

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
            // Detect language switch in message
            const msgLower = text.toLowerCase();
            const langKeywords = {
                'english': 'en',
                'hindi': 'hi',
                'bengali': 'bn',
                'bangla': 'bn',
                'telugu': 'te',
                'marathi': 'mr',
                'tamil': 'ta',
                'gujarati': 'gu',
                'kannada': 'kn',
                'malayalam': 'ml',
                'punjabi': 'pa',
                'odia': 'or',
                'assamese': 'as',
                'urdu': 'ur',
                'nepali': 'ne',
                'maithili': 'mai',
                'sanskrit': 'sa',
                'konkani': 'kok',
                'manipuri': 'mni',
                'meitei': 'mni',
                'bodo': 'bodo',
                'dogri': 'doi',
                'हिंदी': 'hi',
                'हिन्दी': 'hi',
                'বাংলা': 'bn',
                'తెలుగు': 'te',
                'मराठी': 'mr',
                'தமிழ்': 'ta',
                'ગુજરાતી': 'gu',
                'ಕನ್ನಡ': 'kn',
                'മലയാളം': 'ml',
                'ਪੰਜਾਬੀ': 'pa',
                'ଓଡ଼ିଆ': 'or',
                'অসমীয়া': 'as',
                'اردو': 'ur',
                'मैथिली': 'mai',
                'संस्कृत': 'sa',
                'कोंकणी': 'kok',
                'डोगरी': 'doi',
            };
            for (const [kw, code] of Object.entries(langKeywords)) {
                if (msgLower.includes(kw)) { chosenLang = code;
                    updateSubLabel(code); break; }
            }

            const lang = getAppLang();

            /*
             * ROMANIZATION RULE — injected as first message in the array.
             * Works regardless of how the server is built because the model
             * sees it before any user question.
             *
             * Rule: reply in the chosen language spoken words, spelled with
             * English/Roman letters only (transliteration). No native script.
             * en-IN TTS (available on every Android/iOS) can then read it.
             */
            let messagesPayload = [...chatHistory];

            if (lang !== 'en') {
                const langName = LANG_ROMAN[lang] || lang;
                const romanRule = {
                    role: 'user',
                    content: '[SYSTEM RULE - FOLLOW FOR EVERY REPLY] ' +
                        'You must reply in ' + langName + ' language. ' +
                        'Write every word using ONLY English/Roman alphabet letters (transliteration). ' +
                        'NEVER use native script. ' +
                        'Hindi example: write "Aapki fasal achhi hai, paani dete rahein" NOT native script. ' +
                        'Bengali example: write "Aapnar fasal bhalo ache" NOT native script. ' +
                        'Tamil example: write "Ungal payir nalla irukku" NOT native script. ' +
                        'Telugu example: write "Mee panta baagundi" NOT native script. ' +
                        'Apply this rule for ALL languages — Roman letters only, every reply, no exceptions.'
                };
                messagesPayload = [romanRule, ...chatHistory];
            }

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messagesPayload, lang })
            });

            removeTyping(tid);

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                appendBot('Server error: ' + (err.error || res.status) + '. Please try again.', false);
                isBusy = false;
                return;
            }

            const data = await res.json();
            if (data.reply) {
                chatHistory.push({ role: 'assistant', content: data.reply });
                appendBot(data.reply, true);
            } else {
                appendBot(data.error || 'No response received.', false);
            }
        } catch (e) {
            removeTyping(tid);
            appendBot('Connection error. Check your internet.', false);
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

        const footer = document.createElement('div');
        footer.className = 'kp-msg-footer';

        const speakBtn = document.createElement('button');
        speakBtn.className = 'kp-speak-btn';
        speakBtn.title = 'Listen';
        speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakBtn.setAttribute('aria-label', 'Play / Pause voice');

        speakBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const synth = window.speechSynthesis;
            if (!synth) return;

            if (currentSpeakBtn === speakBtn && synth.speaking && !synth.paused && !speechPaused) {
                synth.pause();
                speechPaused = true;
                speakBtn.classList.remove('speaking');
                speakBtn.classList.add('paused');
                speakBtn.innerHTML = '<i class="fas fa-play"></i>';
                speakBtn.title = 'Resume';
                return;
            }
            if (currentSpeakBtn === speakBtn && (synth.paused || speechPaused)) {
                synth.resume();
                speechPaused = false;
                speakBtn.classList.remove('paused');
                speakBtn.classList.add('speaking');
                speakBtn.innerHTML = '<i class="fas fa-pause"></i>';
                speakBtn.title = 'Pause';
                return;
            }
            speakText(el.textContent, speakBtn);
        });

        footer.appendChild(speakBtn);
        wrapper.appendChild(el);
        wrapper.appendChild(footer);
        getMsgs().appendChild(wrapper);
        scrollBot();

        if (animate) {
            typingAborted = false;
            showStopBtn();
            typeWriter(el, text, 0, () => {
                speakText(text, speakBtn);
            });
        } else {
            el.textContent = text;
            scrollBot();
        }
    }

    function typeWriter(el, text, i, onComplete) {
        if (typingAborted) {
            el.textContent = text;
            typingAborted = false;
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

    /* ── Voice input ─────────────────────────── */
    window.toggleKisanMic = function() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Voice input not supported. Please use Chrome or Safari.'); return; }
        if (isRecording) { if (recognition) recognition.stop(); return; }

        recognition = new SR();
        recognition.lang = VOICE_LANGS[getAppLang()] || 'hi-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        const btn = document.getElementById('kisanMicBtn');
        recognition.onstart = () => { isRecording = true;
            btn.classList.add('recording');
            btn.innerHTML = '<i class="fas fa-stop"></i>'; };
        recognition.onresult = e => { if (getInput()) getInput().value = Array.from(e.results).map(r => r[0].transcript).join(''); };
        recognition.onend = () => {
            isRecording = false;
            btn.classList.remove('recording');
            btn.innerHTML = '<i class="fas fa-microphone"></i>';
            const val = getInput() ? getInput().value.trim() : '';
            if (val) sendKisanMessage();
        };
        recognition.onerror = () => { isRecording = false;
            btn.classList.remove('recording');
            btn.innerHTML = '<i class="fas fa-microphone"></i>'; };
        recognition.start();
    };

    /* ── Sync with app language toggle ──────── */
    const _orig = window.setLanguage;
    window.setLanguage = function(code) {
        if (_orig) _orig(code);
        if (!langChosen) updateSubLabel(code);
    };

})();
