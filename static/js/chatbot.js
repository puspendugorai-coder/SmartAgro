// Scope-isolated variables to prevent global collisions
let chatOpen         = false;
let recognition      = null;
let isListening      = false;
let userClickedStop  = false; // Tracks if the user explicitly hit the stop button
let chatHistory      = [];
let currentLangCode  = (localStorage.getItem('agrosmart_lang') || 'hi').toLowerCase();
let speechTimeout    = null; // Manages the Gemini-style silence detection

const LANG_SPEECH_CODES = {
  'hi':'hi-IN','bn':'bn-IN','ta':'ta-IN','te':'te-IN',
  'mr':'mr-IN','pa':'pa-IN','gu':'gu-IN','kn':'kn-IN',
  'ml':'ml-IN','en':'en-IN'
};

// Conflict-free notification fallback
function safeToast(message, type = 'info') {
  if (typeof showToast === 'function') {
    showToast(message, type);
  } else {
    console.log(`[ChatBot Mini-Toast - ${type}]: ${message}`);
  }
}

function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chatBox');
  const fab = document.getElementById('chatFab');
  
  if (chatOpen) {
    if (box) {
      box.style.display = 'flex';
      setTimeout(() => box.classList.add('open'), 10);
    }
    if (fab) fab.innerHTML = '<i class="fas fa-times"></i>';
    if (chatHistory.length === 0) addBotMessage(getWelcomeMsg());
  } else {
    if (box) {
      box.classList.remove('open');
      setTimeout(() => { box.style.display = 'none'; }, 300);
    }
    if (fab) fab.innerHTML = '<i class="fas fa-microphone"></i>';
  }
}

function getWelcomeMsg() {
  const msgs = {
    hi: '🌾 नमस्ते किसान भाई! मैं SmartAgro सहायक हूं। आप मुझसे मौसम, फसल, बाजार भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।',
    bn: '🌾 নমস্কার! আমি SmartAgro সহায়ক। আপনি আমাকে আবহাওয়া, ফসল বা বাজার সম্পর্কে জিজ্ঞাসা করতে পারেন।',
    ta: '🌾 வணக்கம்! நான் SmartAgro உதவியாளர். வானிலை, பயிர் அல்லது சந்தை பற்றி கேளுங்கள்.',
    te: '🌾 నమస్కారం రైతు సోదరులారా! నేను SmartAgro సహాయకుడిని. వాతావరణం, పంటలు, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి నన్ను അడగండి.',
    mr: '🌾 नमस्कार शेतकरी बंधूंनो! मी SmartAgro सहाय्यक आहे. तुम्ही मला हवामान, पिके, बाजारभाव किंवा सरकारी योजनांबद्दल विचारू शकता.',
    pa: '🌾 ਨਮਸਤੇ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ SmartAgro ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਕੋਲੋਂ ਮੌਸਮ, ਫਸਲਾਂ, ਮੰਡੀ ਦੇ ਭਾਅ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।',
    gu: '🌾 નમસ્તે ખેડૂત ભાઈઓ! હું SmartAgro સહાયક છું. તમે મને હવામાન, પાક, બજારના ભાવ અથવા સરકારી યોજનાઓ વિશે પૂછી શકો છો.',
    kn: '🌾 ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು SmartAgro ಸಹಾಯಕ. ನೀವು ನನ್ನ ಬಳಿ ಹವಾಮಾನ, ಬೆಳೆಗಳು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.',
    ml: '🌾 നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ! ഞാൻ SmartAgro സഹായിയാണ്. കാലാവസ്ഥ, വിളകൾ, വിപണി വിലകൾ അല്ലെങ്കിൽ സർക്കാർ പദ്ധതികളെക്കുറിച്ച് നിങ്ങൾക്ക് എന്നോട് ചോദിക്കാം.',
    en: '🌾 Hello farmer! I am SmartAgro Assistant. Ask me about weather, crops, market prices or government schemes.',
  };
  return msgs[currentLangCode] || msgs.en;
}

function addBotMessage(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const div  = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addUserMessage(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const div  = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addTypingIndicator() {
  const list = document.getElementById('chatMessages');
  if (!list) return null;
  const div  = document.createElement('div');
  div.className = 'chat-msg bot typing-msg';
  div.innerHTML = '<div class="msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>';
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  
  addUserMessage(msg);
  const typing = addTypingIndicator();

  const weather = (window.weatherData && window.weatherData.current) ? window.weatherData.current : {};

  try {
    const res = await fetch('/api/chat', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify({
        message:         msg,
        language:        currentLangCode.toUpperCase(), // Normalize to UPPERCASE ("HI", "BN") so app.py safely catches it
        weather_context: weather
      })
    });
    const data = await res.json();
    if (typing) typing.remove();
    
    // Fallback handler safely maps BOTH data.reply or data.response structures smoothly
    addBotMessage(data.reply || data.response || 'Sorry, try again.');
  } catch (err) {
    if (typing) typing.remove();
    addBotMessage('Connection error. Please try again.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendMessage();
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    safeToast('Voice not supported. Use Chrome browser.', 'error');
    return;
  }

  const inputEl = document.getElementById('chatInput');

  if (isListening) {
    isListening = false;
    userClickedStop = true; 
    clearTimeout(speechTimeout);
    if (recognition) {
      recognition.stop();
    }
    updateMicBtn(false);
    return;
  }

  if (!chatOpen) toggleChat();

  userClickedStop = false; 
  recognition = new SpeechRecognition();
  recognition.lang = LANG_SPEECH_CODES[currentLangCode] || 'hi-IN';
  
  recognition.continuous = true; 
  recognition.interimResults = true; 
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    updateMicBtn(true);
    if (inputEl) {
      inputEl.classList.add('listening-mode');
      inputEl.placeholder = "Listening... बोलिए / बोलुन...";
    }
    safeToast('🎤 Listening... speak freely', 'success');
  };

  recognition.onresult = e => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript;
      } else {
        interimTranscript += e.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    if (inputEl && currentText) {
      inputEl.value = currentText;
    }

    // Smart Auto-Submit after 2 seconds of silence
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      if (inputEl && inputEl.value.trim()) {
        isListening = false;
        userClickedStop = true; 
        sendMessage();
        if (recognition) recognition.stop(); 
      }
    }, 2000); 
  };

  recognition.onerror = e => {
    if (e.error === 'no-speech' || e.error === 'aborted') return; 
    console.error("Speech error caught safely: ", e.error);
  };

  recognition.onend = () => {
    if (isListening && !userClickedStop) {
      try {
        recognition.start();
      } catch (err) {
        console.log("Mic restarting loop active...");
      }
    } else {
      isListening = false;
      updateMicBtn(false);
      if (inputEl) {
        inputEl.classList.remove('listening-mode');
        inputEl.placeholder = "Type or speak...";
      }
      clearTimeout(speechTimeout);
    }
  };

  recognition.start();
}

function updateMicBtn(listening) {
  const btn = document.getElementById('micBtn');
  const fab = document.getElementById('chatFab');
  
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

document.addEventListener('DOMContentLoaded', () => {
  currentLangCode = (localStorage.getItem('agrosmart_lang') || 'hi').toLowerCase();
});

const origSetLang = window.setLanguage;
window.setLanguage = function(code) {
  if(code) currentLangCode = code.toLowerCase();
  if (typeof origSetLang === 'function') origSetLang(code);
};
