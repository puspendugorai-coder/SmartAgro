let chatOpen         = false;
let recognition      = null;
let isListening      = false;
let chatHistory      = [];
let chatLang         = localStorage.getItem('agrosmart_lang') || 'en';
let currentUtterance = null;
let speakingMsgId    = null;

const SPEECH_LANGS = {
  'hi':'hi-IN','bn':'bn-IN','ta':'ta-IN','te':'te-IN',
  'mr':'mr-IN','pa':'pa-IN','gu':'gu-IN','kn':'kn-IN',
  'ml':'ml-IN','en':'en-IN','ur':'ur-IN'
};

/* ── Toggle fullscreen chat ── */
function toggleChat() {
  chatOpen = !chatOpen;
  const overlay = document.getElementById('chatOverlay');
  const fab     = document.getElementById('chatFab');
  if (!overlay) return;

  if (chatOpen) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    fab.innerHTML = '<i class="fas fa-times"></i>';
    fab.classList.add('chat-open');
    setTimeout(() => overlay.classList.add('open'), 10);
    if (chatHistory.length === 0) showWelcome();
    setTimeout(() => {
      const inp = document.getElementById('chatInput');
      if (inp) inp.focus();
    }, 300);
  } else {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    fab.innerHTML = '<i class="fas fa-microphone"></i>';
    fab.classList.remove('chat-open');
    setTimeout(() => { overlay.style.display = 'none'; }, 280);
    stopSpeaking();
  }
}

function closeChat() {
  if (chatOpen) toggleChat();
}

/* ── Welcome message ── */
function showWelcome() {
  const lang = localStorage.getItem('agrosmart_lang') || 'en';
  const msgs = {
    hi: '🌾 नमस्ते किसान भाई!\n\nमैं SmartAgro सहायक हूं। मुझसे पूछें:\n• फसल की बीमारी और इलाज\n• आज का मौसम और खेती सलाह\n• मंडी भाव और MSP\n• सरकारी योजनाएं (PM-KISAN, फसल बीमा)\n• खाद और कीटनाशक की जानकारी',
    en: '🌾 Hello Farmer!\n\nI am SmartAgro Assistant. Ask me about:\n• Crop diseases and treatment\n• Weather and farming advice\n• Mandi prices and MSP rates\n• Government schemes (PM-KISAN, Crop Insurance)\n• Fertilizers and pesticides',
    bn: '🌾 নমস্কার কৃষক ভাই!\n\nআমি SmartAgro সহায়ক। জিজ্ঞাসা করুন:\n• ফসলের রোগ ও চিকিৎসা\n• আবহাওয়া ও চাষের পরামর্শ\n• বাজার মূল্য ও MSP\n• সরকারি প্রকল্প',
    ta: '🌾 வணக்கம் விவசாயி!\n\nநான் SmartAgro உதவியாளர். கேளுங்கள்:\n• பயிர் நோய்கள் மற்றும் சிகிச்சை\n• வானிலை மற்றும் விவசாய ஆலோசனை\n• சந்தை விலைகள் மற்றும் MSP\n• அரசு திட்டங்கள்',
    te: '🌾 నమస్కారం రైతు అన్న!\n\nనేను SmartAgro సహాయకుడిని. అడగండి:\n• పంట రోగాలు మరియు చికిత్స\n• వాతావరణం మరియు వ్యవసాయ సలహా\n• మార్కెట్ ధరలు మరియు MSP\n• ప్రభుత్వ పథకాలు',
    mr: '🌾 नमस्कार शेतकरी!\n\nमी SmartAgro सहाय्यक आहे. विचारा:\n• पीक रोग आणि उपचार\n• हवामान आणि शेती सल्ला\n• बाजारभाव आणि MSP\n• सरकारी योजना',
    pa: '🌾 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ!\n\nਮੈਂ SmartAgro ਸਹਾਇਕ ਹਾਂ। ਪੁੱਛੋ:\n• ਫਸਲ ਰੋਗ ਅਤੇ ਇਲਾਜ\n• ਮੌਸਮ ਅਤੇ ਖੇਤੀ ਸਲਾਹ\n• ਮੰਡੀ ਭਾਅ ਅਤੇ MSP\n• ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
  };
  addBotMsg(msgs[lang] || msgs.en);
}

/* ── Add bot message with speaker ── */
function addBotMsg(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const id  = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
  const div = document.createElement('div');
  div.className   = 'chat-msg bot';
  div.id          = id;
  div.dataset.text = text;

  const formatted = text
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/\n/g,'<br>')
    .replace(/•/g,'<span style="color:var(--green);margin-right:4px">•</span>');

  div.innerHTML = `
    <div class="msg-avatar">🌾</div>
    <div class="msg-content">
      <div class="msg-bubble">${formatted}</div>
      <div class="msg-actions">
        <button class="msg-speak-btn" id="speak_${id}" onclick="toggleSpeak('${id}')" title="Listen">
          <i class="fas fa-volume-up"></i>
        </button>
        <span class="msg-time">${getTime()}</span>
      </div>
    </div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

/* ── Add user message ── */
function addUserMsg(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="msg-content">
      <div class="msg-bubble">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
      <span class="msg-time">${getTime()}</span>
    </div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

/* ── Typing indicator ── */
function addTyping() {
  const list = document.getElementById('chatMessages');
  if (!list) return null;
  const div = document.createElement('div');
  div.className = 'chat-msg bot typing-msg';
  div.innerHTML = `
    <div class="msg-avatar">🌾</div>
    <div class="msg-content">
      <div class="msg-bubble">
        <span class="typing-dots"><span></span><span></span><span></span></span>
      </div>
    </div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  return div;
}

function getTime() {
  return new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
}

/* ── Send message ── */
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg   = input?.value.trim();
  if (!msg) return;
  input.value = '';

  addUserMsg(msg);
  chatHistory.push({role:'user', content:msg});

  const typing  = addTyping();
  const weather = window.weatherData?.current || {};

  try {
    const res = await fetch('/api/chat', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify({
        message:         msg,
        weather_context: weather,
        history:         chatHistory.slice(-6)
      })
    });
    const data = await res.json();
    if (typing) typing.remove();
    const reply = data.reply || 'Sorry, try again.';
    addBotMsg(reply);
    chatHistory.push({role:'assistant', content:reply});
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
  } catch {
    if (typing) typing.remove();
    addBotMsg('Connection error. Please check internet and try again.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

/* ── Text to Speech ── */
function toggleSpeak(msgId) {
  const div  = document.getElementById(msgId);
  const btn  = document.getElementById('speak_' + msgId);
  if (!div || !btn) return;

  if (speakingMsgId === msgId) {
    stopSpeaking();
    return;
  }

  stopSpeaking();

  const text = div.dataset.text || div.querySelector('.msg-bubble')?.innerText || '';
  if (!text) return;

  const lang     = localStorage.getItem('agrosmart_lang') || 'en';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang  = SPEECH_LANGS[lang] || 'en-IN';
  utterance.rate  = 0.9;
  utterance.pitch = 1;

  utterance.onstart = () => {
    speakingMsgId = msgId;
    btn.innerHTML = '<i class="fas fa-stop"></i>';
    btn.classList.add('speaking');
  };

  utterance.onend = utterance.onerror = () => {
    speakingMsgId = null;
    btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    btn.classList.remove('speaking');
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (speakingMsgId) {
    const btn = document.getElementById('speak_' + speakingMsgId);
    if (btn) {
      btn.innerHTML = '<i class="fas fa-volume-up"></i>';
      btn.classList.remove('speaking');
    }
    speakingMsgId = null;
  }
}

/* ── Voice input ── */
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showToast('Voice not supported. Please use Chrome browser.', 'error');
    return;
  }
  if (isListening) {
    recognition?.stop();
    return;
  }
  if (!chatOpen) toggleChat();

  const langCode   = localStorage.getItem('agrosmart_lang') || 'en';
  const speechLang = SPEECH_LANGS[langCode] || 'en-IN';

  recognition = new SR();
  recognition.lang            = speechLang;
  recognition.interimResults  = false;
  recognition.maxAlternatives = 1;
  recognition.continuous      = false;

  recognition.onstart = () => {
    isListening = true;
    updateMicState(true);
    showToast('🎤 Listening... speak now', 'success');
  };

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    const input      = document.getElementById('chatInput');
    if (input) input.value = transcript;
    sendMessage();
  };

  recognition.onerror = e => {
    isListening = false;
    updateMicState(false);
    if (e.error === 'no-speech')     showToast('No speech detected. Try again.', 'warning');
    else if (e.error === 'not-allowed') showToast('Microphone access denied.', 'error');
    else showToast('Voice error. Try again.', 'error');
  };

  recognition.onend = () => {
    isListening = false;
    updateMicState(false);
  };

  try { recognition.start(); }
  catch { showToast('Could not start mic. Try again.', 'error'); }
}

function updateMicState(listening) {
  const micBtn = document.getElementById('micBtn');
  const fab    = document.getElementById('chatFab');

  if (micBtn) {
    micBtn.classList.toggle('listening', listening);
    micBtn.innerHTML = listening
      ? '<i class="fas fa-stop"></i>'
      : '<i class="fas fa-microphone"></i>';
  }
  if (fab && !chatOpen) {
    fab.classList.toggle('listening', listening);
    fab.innerHTML = listening
      ? '<i class="fas fa-stop"></i>'
      : '<i class="fas fa-microphone"></i>';
  }
}

/* ── Clear chat ── */
function clearChat() {
  chatHistory = [];
  const list = document.getElementById('chatMessages');
  if (list) list.innerHTML = '';
  showWelcome();
}

/* ── Sync lang ── */
document.addEventListener('DOMContentLoaded', () => {
  chatLang = localStorage.getItem('agrosmart_lang') || 'en';
});

window.addEventListener('storage', e => {
  if (e.key === 'agrosmart_lang') chatLang = e.newValue || 'en';
});
