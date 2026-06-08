let chatOpen      = false;
let recognition   = null;
let isListening   = false;
let chatHistory   = [];
let currentLangCode = localStorage.getItem('agrosmart_lang') || 'hi';

const LANG_SPEECH_CODES = {
  'hi':'hi-IN','bn':'bn-IN','ta':'ta-IN','te':'te-IN',
  'mr':'mr-IN','pa':'pa-IN','gu':'gu-IN','kn':'kn-IN',
  'ml':'ml-IN','en':'en-IN'
};

function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chatBox');
  const fab  = document.getElementById('chatFab');
  if (chatOpen) {
    box.style.display  = 'flex';
    fab.innerHTML      = '<i class="fas fa-times"></i>';
    setTimeout(() => box.classList.add('open'), 10);
    if (chatHistory.length === 0) addBotMessage(getWelcomeMsg());
  } else {
    box.classList.remove('open');
    fab.innerHTML = '<i class="fas fa-microphone"></i>';
    setTimeout(() => { box.style.display='none'; }, 300);
  }
}

function getWelcomeMsg() {
  const msgs = {
    hi: '🌾 नमस्ते किसान भाई! मैं SmartAgro सहायक हूं। आप मुझसे मौसम, फसल, बाजार भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।',
    bn: '🌾 নমস্কার! আমি SmartAgro সহায়ক। আপনি আমাকে আবহাওয়া, ফসল বা বাজার সম্পর্কে জিজ্ঞাসা করতে পারেন।',
    ta: '🌾 வணக்கம்! நான் SmartAgro உதவியாளர். வானிலை, பயிர் அல்லது சந்தை பற்றி கேளுங்கள்.',
    en: '🌾 Hello farmer! I am SmartAgro Assistant. Ask me about weather, crops, market prices or government schemes.',
  };
  return msgs[currentLangCode] || msgs.en;
}

function addBotMessage(text) {
  const list = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addUserMessage(text) {
  const list = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addTypingIndicator() {
  const list = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg bot typing-msg';
  div.innerHTML = '<div class="msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>';
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  addUserMessage(msg);
  const typing = addTypingIndicator();

  // Get weather context if available
  const weather = window.weatherData?.current || {};

  try {
    const res  = await fetch('/api/chat', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify({
        message:         msg,
        language:        currentLangCode,
        weather_context: weather
      })
    });
    const data = await res.json();
    typing.remove();
    addBotMessage(data.reply || 'Sorry, try again.');
  } catch {
    typing.remove();
    addBotMessage('Connection error. Please try again.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendMessage();
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Voice not supported. Use Chrome browser.', 'error');
    return;
  }

  if (isListening) {
    recognition?.stop();
    isListening = false;
    updateMicBtn(false);
    return;
  }

  if (!chatOpen) toggleChat();

  recognition = new SpeechRecognition();
  recognition.lang        = LANG_SPEECH_CODES[currentLangCode] || 'hi-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    updateMicBtn(true);
    showToast('🎤 Listening... speak now', 'success');
  };

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    document.getElementById('chatInput').value = transcript;
    sendMessage();
  };

  recognition.onerror = () => {
    isListening = false;
    updateMicBtn(false);
    showToast('Could not hear. Try again.', 'error');
  };

  recognition.onend = () => {
    isListening = false;
    updateMicBtn(false);
  };

  recognition.start();
}

function updateMicBtn(listening) {
  const btn = document.getElementById('micBtn');
  const fab  = document.getElementById('chatFab');
  if (btn) {
    btn.classList.toggle('listening', listening);
    btn.innerHTML = listening
      ? '<i class="fas fa-stop"></i>'
      : '<i class="fas fa-microphone"></i>';
  }
  if (fab && !chatOpen) {
    fab.classList.toggle('listening', listening);
  }
}

// Sync language with translations.js
document.addEventListener('DOMContentLoaded', () => {
  currentLangCode = localStorage.getItem('agrosmart_lang') || 'hi';
});

// Watch for language changes
const origSetLang = window.setLanguage;
window.setLanguage = function(code) {
  currentLangCode = code;
  if (origSetLang) origSetLang(code);
};
