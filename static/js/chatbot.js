let chatOpen         = false;
let recognition      = null;
let isListening      = false;
let chatHistory      = [];
let speakingMsgId    = null;
let availableVoices  = [];

const SPEECH_LANGS = {
  'hi':'hi-IN','bn':'bn-IN','ta':'ta-IN','te':'te-IN',
  'mr':'mr-IN','pa':'pa-IN','gu':'gu-IN','kn':'kn-IN',
  'ml':'ml-IN','en':'en-IN'
};

// Load all available voices
function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();
}
if (window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Find best voice for language
function getBestVoice(langCode) {
  const speechLang = SPEECH_LANGS[langCode] || 'en-IN';
  const langPrefix = speechLang.split('-')[0]; // 'hi', 'bn', etc.

  // Try exact match first
  let voice = availableVoices.find(v => v.lang === speechLang);
  // Try language prefix
  if (!voice) voice = availableVoices.find(v => v.lang.startsWith(langPrefix));
  // Try any Indian English if Hindi/Bengali not found
  if (!voice && langCode !== 'en') voice = availableVoices.find(v => v.lang === 'en-IN');
  // Fall back to any English
  if (!voice) voice = availableVoices.find(v => v.lang.startsWith('en'));

  return voice || null;
}

/* ── Toggle fullscreen ── */
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
    }, 350);
  } else {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    fab.innerHTML = '<i class="fas fa-microphone"></i>';
    fab.classList.remove('chat-open');
    setTimeout(() => { overlay.style.display = 'none'; }, 280);
    stopSpeaking();
  }
}

function closeChat() { if (chatOpen) toggleChat(); }

/* ── Welcome ── */
function showWelcome() {
  const lang = localStorage.getItem('agrosmart_lang') || 'en';
  const msgs = {
    hi: '🌾 नमस्ते किसान भाई!\n\nमैं SmartAgro सहायक हूं। पूछें:\n• फसल की बीमारी और इलाज\n• आज का मौसम\n• मंडी भाव और MSP\n• सरकारी योजनाएं (PM-KISAN)\n• खाद और कीटनाशक',
    en: '🌾 Hello Farmer!\n\nI am SmartAgro Assistant. Ask me:\n• Crop diseases and treatment\n• Weather and farming advice\n• Mandi prices and MSP\n• Government schemes (PM-KISAN)\n• Fertilizers and pesticides',
    bn: '🌾 নমস্কার কৃষক ভাই!\n\nআমি SmartAgro সহায়ক। জিজ্ঞাসা করুন:\n• ফসলের রোগ ও চিকিৎসা\n• আজকের আবহাওয়া\n• বাজার মূল্য ও MSP\n• সরকারি প্রকল্প',
    ta: '🌾 வணக்கம்!\n\nகேளுங்கள்:\n• பயிர் நோய்கள்\n• வானிலை\n• சந்தை விலைகள்\n• அரசு திட்டங்கள்',
    te: '🌾 నమస్కారం!\n\nఅడగండి:\n• పంట రోగాలు\n• వాతావరణం\n• మార్కెట్ ధరలు\n• ప్రభుత్వ పథకాలు',
    mr: '🌾 नमस्कार!\n\nविचारा:\n• पीक रोग\n• हवामान\n• बाजारभाव\n• सरकारी योजना',
    pa: '🌾 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!\n\nਪੁੱਛੋ:\n• ਫਸਲ ਰੋਗ\n• ਮੌਸਮ\n• ਮੰਡੀ ਭਾਅ\n• ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
  };
  addBotMsg(msgs[lang] || msgs.en);
}

/* ── Messages ── */
function addBotMsg(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const id  = 'msg_' + Date.now() + '_' + Math.floor(Math.random()*9999);
  const div = document.createElement('div');
  div.className    = 'chat-msg bot';
  div.id           = id;
  div.dataset.text = text;

  const formatted = text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\n/g,'<br>')
    .replace(/•/g,'<span style="color:var(--green);margin-right:4px;font-weight:700">•</span>');

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

/* ── Send ── */
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
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({message:msg, weather_context:weather, history:chatHistory.slice(-6)})
    });
    const data = await res.json();
    if (typing) typing.remove();
    const reply = data.reply || 'Sorry, try again.';
    addBotMsg(reply);
    chatHistory.push({role:'assistant', content:reply});
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
  } catch {
    if (typing) typing.remove();
    addBotMsg('Connection error. Please try again.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

/* ── Text to Speech — fixed for all languages ── */
function toggleSpeak(msgId) {
  const div = document.getElementById(msgId);
  const btn = document.getElementById('speak_' + msgId);
  if (!div || !btn) return;

  if (speakingMsgId === msgId) { stopSpeaking(); return; }
  stopSpeaking();

  const text = div.dataset.text || '';
  if (!text || !window.speechSynthesis) return;

  const lang     = localStorage.getItem('agrosmart_lang') || 'en';
  const voice    = getBestVoice(lang);
  const speechLang = SPEECH_LANGS[lang] || 'en-IN';

  const utterance  = new SpeechSynthesisUtterance(text);
  utterance.lang   = speechLang;
  utterance.rate   = 0.88;
  utterance.pitch  = 1;
  if (voice) utterance.voice = voice;

  // Show warning if no native voice available for Indian language
  if (!voice && lang !== 'en') {
    showToast(`No ${lang.toUpperCase()} voice on this device. Reading in available voice.`, 'warning', 3000);
  }

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

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (speakingMsgId) {
    const btn = document.getElementById('speak_' + speakingMsgId);
    if (btn) { btn.innerHTML = '<i class="fas fa-volume-up"></i>'; btn.classList.remove('speaking'); }
    speakingMsgId = null;
  }
}

/* ── Voice Input ── */
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Voice not supported. Use Chrome browser.', 'error'); return; }
  if (isListening) { recognition?.stop(); return; }
  if (!chatOpen) toggleChat();

  const lang       = localStorage.getItem('agrosmart_lang') || 'en';
  const speechLang = SPEECH_LANGS[lang] || 'en-IN';

  recognition = new SR();
  recognition.lang           = speechLang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous     = false;

  recognition.onstart = () => {
    isListening = true;
    updateMicState(true);
    showToast('🎤 Listening... speak now', 'success');
  };
  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    const inp = document.getElementById('chatInput');
    if (inp) inp.value = transcript;
    sendMessage();
  };
  recognition.onerror = e => {
    isListening = false; updateMicState(false);
    if (e.error === 'no-speech')     showToast('No speech detected. Try again.', 'warning');
    else if (e.error === 'not-allowed') showToast('Microphone access denied.', 'error');
    else showToast('Voice error. Try again.', 'error');
  };
  recognition.onend = () => { isListening = false; updateMicState(false); };
  try { recognition.start(); } catch { showToast('Could not start mic.', 'error'); }
}

function updateMicState(listening) {
  const micBtn = document.getElementById('micBtn');
  const fab    = document.getElementById('chatFab');
  if (micBtn) {
    micBtn.classList.toggle('listening', listening);
    micBtn.innerHTML = listening ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-microphone"></i>';
  }
  if (fab && !chatOpen) {
    fab.classList.toggle('listening', listening);
    fab.innerHTML = listening ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-microphone"></i>';
  }
}

/* ── Clear chat ── */
function clearChat() {
  chatHistory = [];
  const list = document.getElementById('chatMessages');
  if (list) list.innerHTML = '';
  showWelcome();
}

/* ── Swipe to close on mobile ── */
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, {passive: true});
document.addEventListener('touchmove', e => {
  if (!chatOpen) return;
  const chatWindow = document.getElementById('chatWindow');
  if (!chatWindow) return;
  const touchY = e.touches[0].clientY;
  const diff   = touchY - touchStartY;
  // Swipe down more than 80px to close
  if (diff > 80 && chatWindow.contains(e.target)) {
    closeChat();
  }
}, {passive: true});
