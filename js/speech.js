/**
 * ============================================================================
 * LinguaFlow AI — Speech Synthesis (TTS) & Voice Recognition (STT) Module
 * Provides crystal-clear audio playback for translated & source text with
 * automatic BCP-47 voice selection and playback speed control.
 * ============================================================================
 */

window.LinguaSpeech = (function () {
  let availableVoices = [];
  let isSpeaking = false;
  let currentTarget = null; // 'source' | 'target'
  let playbackRate = 1.0;
  let recognitionInstance = null;
  let isListening = false;

  function initVoices() {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      availableVoices = window.speechSynthesis.getVoices() || [];
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  function findBestVoice(langCode) {
    if (!availableVoices.length) {
      availableVoices = ('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : [];
    }
    const langObj = window.LinguaLanguages.getLanguageByCode(langCode);
    const targetBcp47 = (langObj?.bcp47 || langCode || 'en-US').toLowerCase();
    const shortCode = targetBcp47.split('-')[0];

    // Prefer Google/Natural/Neural voices matching full BCP-47
    const exactMatch = availableVoices.find(
      v => v.lang.toLowerCase() === targetBcp47 && (v.name.includes('Natural') || v.name.includes('Google'))
    ) || availableVoices.find(v => v.lang.toLowerCase() === targetBcp47);

    if (exactMatch) return exactMatch;

    // Fallback to prefix match (e.g., 'es' matches 'es-MX')
    return availableVoices.find(v => v.lang.toLowerCase().startsWith(shortCode)) || null;
  }

  function speak({ text, langCode, targetId = 'target', onStart, onEnd, onError }) {
    if (!('speechSynthesis' in window)) {
      if (onError) onError('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (!text || !text.trim()) return;

    // If already speaking the same target, toggle stop
    if (isSpeaking && currentTarget === targetId) {
      stop();
      if (onEnd) onEnd();
      return;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    const langObj = window.LinguaLanguages.getLanguageByCode(langCode === 'auto' ? 'en' : langCode);
    utterance.lang = langObj.bcp47 || 'en-US';
    utterance.rate = playbackRate;

    const matchedVoice = findBestVoice(langCode === 'auto' ? 'en' : langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      isSpeaking = true;
      currentTarget = targetId;
      if (onStart) onStart(matchedVoice ? matchedVoice.name : utterance.lang);
    };

    utterance.onend = () => {
      isSpeaking = false;
      currentTarget = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      currentTarget = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    currentTarget = null;
  }

  function cycleSpeed() {
    const speeds = [0.75, 1.0, 1.25];
    const idx = speeds.indexOf(playbackRate);
    playbackRate = speeds[(idx + 1) % speeds.length];
    return playbackRate;
  }

  function getSpeed() {
    return playbackRate;
  }

  /**
   * Optional Voice Input (Speech-to-Text) for Source Box
   */
  function toggleDictation({ langCode, onInterimResult, onStateChange, onError }) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      if (onError) onError('Voice dictation is supported in Chrome, Edge, and Safari.');
      return;
    }

    if (isListening && recognitionInstance) {
      recognitionInstance.stop();
      isListening = false;
      if (onStateChange) onStateChange(false);
      return;
    }

    recognitionInstance = new SpeechRec();
    const langObj = window.LinguaLanguages.getLanguageByCode(langCode === 'auto' ? 'en' : langCode);
    recognitionInstance.lang = langObj.bcp47 || 'en-US';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;

    recognitionInstance.onstart = () => {
      isListening = true;
      if (onStateChange) onStateChange(true);
    };

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (onInterimResult) onInterimResult(transcript);
    };

    recognitionInstance.onerror = () => {
      isListening = false;
      if (onStateChange) onStateChange(false);
    };

    recognitionInstance.onend = () => {
      isListening = false;
      if (onStateChange) onStateChange(false);
    };

    recognitionInstance.start();
  }

  initVoices();

  return {
    speak,
    stop,
    cycleSpeed,
    getSpeed,
    toggleDictation
  };
})();
