let chatOpen    = false;
let recognition = null;
let isListening = false;
let chatHistory = [];

// Speech language codes
const SPEECH_LANGS = {
  'hi':'hi-IN','bn':'bn-IN','ta':'ta-IN','te':'te-IN',
  'mr':'mr-IN','pa':'pa-IN','gu':'gu-IN','kn':'kn-IN',
  'ml':'ml-IN','en':'en-IN','ur':'ur-IN','or':'or-IN'
};

function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chatBox');
  const fab = document.getElementById('chatFab');
  if (chatOpen) {
    box.style.display = 'flex';
    fab.innerHTML = '<i class="fas fa-times"></i>';
    setTimeout(() => box.classList.add('open'), 10);
    if (chatHistory.length === 0) showWelcome();
  } else {
    box.classList.remove('open');
    fab.innerHTML = '<i class="fas fa-microphone"></i>';
    setTimeout(() => { box.style.display = 'none'; }, 300);
  }
}

function showWelcome() {
  const lang = localStorage.getItem('agrosmart_lang') || 'hi';
  const msgs = {
    hi: '🌾 नमस्ते! मैं SmartAgro सहायक हूं। मुझसे फसल, मौसम, बाजार भाव या सरकारी योजनाओं के बारे में पूछें।',
    bn: '🌾 নমস্কার! আমি SmartAgro সহায়ক। ফসল, আবহাওয়া বা বাজার সম্পর্কে জিজ্ঞাসা করুন।',
    ta: '🌾 வணக்கம்! நான் SmartAgro உதவியாளர். பயிர், வானிலை அல்லது சந்தை பற்றி கேளுங்கள்।',
    te: '🌾 నమస్కారం! నేను SmartAgro సహాయకుడిని। పంట, వాతావరణం లేదా మార్కెట్ గురించి అడగండి।',
    mr: '🌾 नमस्कार! मी SmartAgro सहाय्यक आहे। पीक, हवामान किंवा बाजारभाव विचारा।',
    pa: '🌾 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ SmartAgro ਸਹਾਇਕ ਹਾਂ। ਫਸਲ, ਮੌਸਮ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।',
    en: '🌾 Hello! I am SmartAgro Assistant. Ask me about crops, weather, market prices or government schemes.',
  };
  addBotMsg(msgs[lang] || msgs.en);
}

function addBotMsg(text) {
  const list = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addUserMsg(text) {
  const list = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addTyping() {
  const list = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg bot typing-msg';
  div.innerHTML  = '<div class="msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>';
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  addUserMsg(msg);
  chatHistory.push({role: 'user', content: msg});
  const typing = addTyping();
  const weather = window.weatherData?.current || {};
  try {
    const res  = await fetch('/api/chat', {
      method:  'POST',
      headers: {'Content-Type': 'application/json'},
      body:    JSON.stringify({
        message:         msg,
        weather_context: weather,
        history:         chatHistory.slice(-6)
      })
    });
    const data = await res.json();
    typing.remove();
    const reply = data.reply || 'Sorry, try again.';
    addBotMsg(reply);
    chatHistory.push({role: 'assistant', content: reply});
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
  } catch {
    typing.remove();
    addBotMsg('Connection error. Please try again.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendMessage();
}

// ── Voice input — auto detects language ──────────────────
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showToast('Voice not supported. Use Chrome browser.', 'error');
    return;
  }
  if (isListening) {
    recognition?.stop();
    return;
  }
  if (!chatOpen) toggleChat();

  recognition = new SR();

  // Use current UI language as hint but allow any language
  const uiLang = localStorage.getItem('agrosmart_lang') || 'hi';
  recognition.lang = SPEECH_LANGS[uiLang] || 'hi-IN';

  // Allow continuous recognition for better accuracy
  recognition.interimResults  = false;
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    isListening = true;
    updateMicState(true);
    showToast('🎤 Listening... speak now', 'success');
  };

  recognition.onresult = e => {
    // Get best result
    const transcript = e.results[0][0].transcript;
    const confidence = e.results[0][0].confidence;
    console.log(`[Voice] "${transcript}" (confidence: ${confidence})`);
    document.getElementById('chatInput').value = transcript;
    // Auto send if confidence is good
    if (confidence > 0.7) {
      sendMessage();
    } else {
      // Show in input and let user confirm
      showToast('Please check your message and press send', 'warning');
    }
  };

  recognition.onerror = e => {
    isListening = false;
    updateMicState(false);
    if (e.error === 'no-speech') showToast('No speech detected. Try again.', 'warning');
    else if (e.error === 'not-allowed') showToast('Microphone access denied.', 'error');
    else showToast('Voice error. Try again.', 'error');
  };

  recognition.onend = () => {
    isListening = false;
    updateMicState(false);
  };

  recognition.start();
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
    fab.innerHTML = listening
      ? '<i class="fas fa-stop"></i>'
      : '<i class="fas fa-microphone"></i>';
    fab.classList.toggle('listening', listening);
  }
}

// Close chat on outside click
document.addEventListener('click', e => {
  const box = document.getElementById('chatBox');
  const fab = document.getElementById('chatFab');
  if (chatOpen && box && !box.contains(e.target) && fab && !fab.contains(e.target)) {
    toggleChat();
  }
});