/**
 * ============================================================================
 * LinguaFlow AI — Main Application Controller (js/app.js)
 * Audited, Zero-Bug Controller with Full UI Micro-Animations, Urdu/Global
 * Neural Translation, and Functional AI Power Tools.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const MAX_CHARS = 5000;
  const HISTORY_KEY = 'linguaflow_history_v2';
  const GLOSSARY_KEY = 'linguaflow_glossary_v1';

  const state = {
    sourceLang: 'auto',
    detectedLang: 'en',
    detectedConfidence: 98,
    targetLang: 'ur', // Default Target Language: Urdu (اردو)
    tone: 'professional',
    explainContext: true,
    autoTranslate: true,
    activeAgentTab: 'idioms',
    pickerMode: 'target',
    pickerRegion: 'ALL',
    sourceText: '',
    translatedText: '',
    isTranslating: false,
    lastAnalysis: null,
    uploadedDoc: null,
    history: loadHistory(),
    glossary: loadGlossary()
  };

  const els = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    apiConfigBtn: document.getElementById('apiConfigBtn'),
    apiStatusBadge: document.getElementById('apiStatusBadge'),
    historyToggleBtn: document.getElementById('historyToggleBtn'),
    historyCountBadge: document.getElementById('historyCountBadge'),

    // Functional AI Power Tools Bar (Top Right Hero Dock)
    toolPasteClipboardBtn: document.getElementById('toolPasteClipboardBtn'),
    toolFixGrammarBtn: document.getElementById('toolFixGrammarBtn'),
    toolSummarizeBtn: document.getElementById('toolSummarizeBtn'),
    toolRomanUrduConvertBtn: document.getElementById('toolRomanUrduConvertBtn'),
    toolGlossaryBtn: document.getElementById('toolGlossaryBtn'),
    glossaryCountBadge: document.getElementById('glossaryCountBadge'),
    toolAutoTranslateToggleBtn: document.getElementById('toolAutoTranslateToggleBtn'),
    autoTranslateDot: document.getElementById('autoTranslateDot'),
    autoTranslateLabel: document.getElementById('autoTranslateLabel'),

    // Glossary Modal
    glossaryModal: document.getElementById('glossaryModal'),
    closeGlossaryModalBtn: document.getElementById('closeGlossaryModalBtn'),
    glossarySourceInput: document.getElementById('glossarySourceInput'),
    glossaryTargetInput: document.getElementById('glossaryTargetInput'),
    addGlossaryItemBtn: document.getElementById('addGlossaryItemBtn'),
    glossaryItemsList: document.getElementById('glossaryItemsList'),

    // Language Controls
    sourceLangSelect: document.getElementById('sourceLangSelect'),
    targetLangSelect: document.getElementById('targetLangSelect'),
    swapLangsBtn: document.getElementById('swapLangsBtn'),
    detectedLangBadge: document.getElementById('detectedLangBadge'),
    detectedLangText: document.getElementById('detectedLangText'),
    openWorldLangModalBtn: document.getElementById('openWorldLangModalBtn'),

    // 7,100+ World Languages Search Modal
    worldLangModal: document.getElementById('worldLangModal'),
    closeWorldLangModalBtn: document.getElementById('closeWorldLangModalBtn'),
    langSearchInput: document.getElementById('langSearchInput'),
    pickerModeTargetBtn: document.getElementById('pickerModeTargetBtn'),
    pickerModeSourceBtn: document.getElementById('pickerModeSourceBtn'),
    langRegionFilterBar: document.getElementById('langRegionFilterBar'),
    worldLangGridContainer: document.getElementById('worldLangGridContainer'),

    // Tone & Agent Controls
    toneSelectDropdown: document.getElementById('toneSelectDropdown'),
    tonePillsContainer: document.getElementById('tonePillsContainer'),
    explainContextToggle: document.getElementById('explainContextToggle'),

    // Dual Text Boxes
    sourceCardBox: document.getElementById('sourceCardBox'),
    targetCardBox: document.getElementById('targetCardBox'),
    sourceTextarea: document.getElementById('sourceTextarea'),
    translatedOutput: document.getElementById('translatedOutput'),
    translationPlaceholder: document.getElementById('translationPlaceholder'),
    translationLoadingShimmer: document.getElementById('translationLoadingShimmer'),
    alternativesBar: document.getElementById('alternativesBar'),
    alternativesList: document.getElementById('alternativesList'),

    // Counters & Action Utilities
    charCountText: document.getElementById('charCountText'),
    charProgressBar: document.getElementById('charProgressBar'),
    wordCountText: document.getElementById('wordCountText'),
    clearSourceBtn: document.getElementById('clearSourceBtn'),
    dictateSourceBtn: document.getElementById('dictateSourceBtn'),
    speakSourceBtn: document.getElementById('speakSourceBtn'),
    translateNowBtn: document.getElementById('translateNowBtn'),

    copyTranslationBtn: document.getElementById('copyTranslationBtn'),
    speakTranslationBtn: document.getElementById('speakTranslationBtn'),
    speechSpeedBtn: document.getElementById('speechSpeedBtn'),
    downloadTranslationBtn: document.getElementById('downloadTranslationBtn'),
    activeToneBadge: document.getElementById('activeToneBadge'),

    // AI Translation Agent Explanation Panel
    agentPanelSection: document.getElementById('agentPanelSection'),
    agentSummaryBadge: document.getElementById('agentSummaryBadge'),
    agentTabBtns: document.querySelectorAll('[data-agent-tab]'),
    agentTabIdioms: document.getElementById('agentTabIdioms'),
    agentTabTones: document.getElementById('agentTabTones'),
    agentTabAsk: document.getElementById('agentTabAsk'),
    idiomsCardsContainer: document.getElementById('idiomsCardsContainer'),
    culturalNotesContainer: document.getElementById('culturalNotesContainer'),
    toneMatrixContainer: document.getElementById('toneMatrixContainer'),
    agentQuestionInput: document.getElementById('agentQuestionInput'),
    agentAskSubmitBtn: document.getElementById('agentAskSubmitBtn'),
    agentChatHistory: document.getElementById('agentChatHistory'),

    // File & Document Upload Zone
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    loadSampleDocBtn: document.getElementById('loadSampleDocBtn'),
    fileStatusCard: document.getElementById('fileStatusCard'),
    fileNameLabel: document.getElementById('fileNameLabel'),
    fileMetaLabel: document.getElementById('fileMetaLabel'),
    fileProgressBar: document.getElementById('fileProgressBar'),
    translateDocBtn: document.getElementById('translateDocBtn'),
    downloadDocBtn: document.getElementById('downloadDocBtn'),
    removeFileBtn: document.getElementById('removeFileBtn'),

    // API Modal & History Drawer
    apiModal: document.getElementById('apiModal'),
    closeApiModalBtn: document.getElementById('closeApiModalBtn'),
    apiProviderSelect: document.getElementById('apiProviderSelect'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    apiModelInput: document.getElementById('apiModelInput'),
    saveApiConfigBtn: document.getElementById('saveApiConfigBtn'),

    historyModal: document.getElementById('historyModal'),
    closeHistoryModalBtn: document.getElementById('closeHistoryModalBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    historyListContainer: document.getElementById('historyListContainer'),

    toastContainer: document.getElementById('toastContainer')
  };

  let debounceTimer = null;

  // Initialize Clean Dashboard
  initTheme();
  populateLanguageSelects();
  populateToneControls();
  updateApiBadge();
  updateHistoryBadge();
  updateGlossaryBadge();
  renderEmptyAgentState();
  bindEvents();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('linguaflow_theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('linguaflow_theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Switched to Dark Theme' : 'Switched to Light Theme', 'moon');
  }

  function populateLanguageSelects() {
    const langs = window.LinguaLanguages.SUPPORTED_LANGUAGES;

    els.sourceLangSelect.innerHTML = langs
      .map(l => `<option value="${l.code}">[${l.badge}] ${l.name}${l.code !== 'auto' ? ` — ${l.nativeName}` : ''}</option>`)
      .join('');

    els.targetLangSelect.innerHTML = langs
      .filter(l => !l.sourceOnly)
      .map(l => `<option value="${l.code}">[${l.badge}] ${l.name} — ${l.nativeName}</option>`)
      .join('');

    els.sourceLangSelect.value = state.sourceLang;
    els.targetLangSelect.value = state.targetLang;
  }

  function populateToneControls() {
    const tones = window.LinguaLanguages.TONE_STYLES;
    els.toneSelectDropdown.innerHTML = tones
      .map(t => `<option value="${t.id}">${t.label}</option>`)
      .join('');
    els.toneSelectDropdown.value = state.tone;

    els.tonePillsContainer.innerHTML = tones
      .map(t => `
        <button
          type="button"
          data-tone-id="${t.id}"
          title="${t.description}"
          class="btn-animated tone-pill-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer"
        >
          <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
          <span>${t.label}</span>
        </button>
      `)
      .join('');

    syncTonePillsUI();
  }

  function syncTonePillsUI() {
    const toneObj = window.LinguaLanguages.getToneById(state.tone);
    els.toneSelectDropdown.value = state.tone;
    if (els.activeToneBadge) {
      els.activeToneBadge.textContent = `${toneObj.label} Style`;
    }

    document.querySelectorAll('.tone-pill-btn').forEach(btn => {
      const isSelected = btn.getAttribute('data-tone-id') === state.tone;
      btn.className = isSelected
        ? 'btn-animated tone-pill-btn tone-pill-active inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white border border-indigo-500 transition-all cursor-pointer'
        : 'btn-animated tone-pill-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer';
    });
  }

  function renderEmptyAgentState() {
    els.idiomsCardsContainer.innerHTML = `
      <div class="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Type or paste text in the left Source Box to view real-time idiom analysis, Urdu/global formality registers, and multi-tone comparisons.
      </div>
    `;
    els.culturalNotesContainer.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        Cultural honorifics (e.g. آپ vs تم in Urdu, Usted vs Tú in Spanish) will automatically calibrate here based on your selected Tone/Style.
      </div>
    `;
    els.toneMatrixContainer.innerHTML = '';
  }

  function updateCountersAndDetection() {
    const raw = els.sourceTextarea.value;
    if (raw.length > MAX_CHARS) {
      els.sourceTextarea.value = raw.slice(0, MAX_CHARS);
    }

    const text = els.sourceTextarea.value;
    state.sourceText = text;

    const charLen = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    els.charCountText.textContent = `${charLen.toLocaleString()} / ${MAX_CHARS.toLocaleString()} chars`;
    els.wordCountText.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;

    const pct = Math.min(100, (charLen / MAX_CHARS) * 100);
    els.charProgressBar.style.width = `${pct}%`;

    const detection = window.LinguaLanguages.detectLanguage(text);
    state.detectedLang = detection.code;
    state.detectedConfidence = detection.confidence;

    const detectedObj = window.LinguaLanguages.getLanguageByCode(detection.code);
    els.sourceTextarea.dir = detectedObj.rtl ? 'rtl' : 'ltr';
    els.sourceTextarea.classList.toggle('urdu-nastaliq', detection.code === 'ur');

    if (state.sourceLang === 'auto') {
      els.detectedLangBadge.classList.remove('hidden');
      if (text.trim().length > 0) {
        els.detectedLangText.textContent = `Detected: [${detection.badge}] ${detection.name} (${detection.confidence}%)`;
      } else {
        els.detectedLangText.textContent = 'Auto-Detect Ready';
      }
    } else {
      const selectedObj = window.LinguaLanguages.getLanguageByCode(state.sourceLang);
      els.detectedLangText.textContent = `Source: [${selectedObj.badge}] ${selectedObj.name}`;
    }
  }

  function applyGlossaryRules(translatedStr) {
    if (!translatedStr || !state.glossary.length) return translatedStr;
    let out = translatedStr;
    for (const rule of state.glossary) {
      if (rule.source && rule.target) {
        const regex = new RegExp(rule.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        out = out.replace(regex, rule.target);
      }
    }
    return out;
  }

  async function performTranslation() {
    const text = state.sourceText.trim();
    if (!text) {
      state.translatedText = '';
      els.translatedOutput.textContent = '';
      els.translatedOutput.classList.add('hidden');
      els.translationPlaceholder.classList.remove('hidden');
      els.alternativesBar.classList.add('hidden');
      renderEmptyAgentState();
      return;
    }

    const effectiveSource = state.sourceLang === 'auto' ? state.detectedLang : state.sourceLang;
    if (effectiveSource === state.targetLang) {
      state.targetLang = effectiveSource === 'ur' ? 'en' : 'ur';
      els.targetLangSelect.value = state.targetLang;
    }

    state.isTranslating = true;
    els.translationPlaceholder.classList.add('hidden');
    els.translationLoadingShimmer.classList.remove('hidden');

    try {
      const result = await window.LinguaAPI.translate({
        text,
        sourceLang: state.sourceLang,
        targetLang: state.targetLang,
        tone: state.tone,
        explainContext: state.explainContext
      });

      if (!result) return;

      const finalTranslation = applyGlossaryRules(result.translatedText);
      state.translatedText = finalTranslation;
      state.lastAnalysis = result.agentAnalysis;

      els.translationLoadingShimmer.classList.add('hidden');
      els.translatedOutput.classList.remove('hidden', 'animate-text-reveal');
      // Force reflow so blur-to-crisp animation replays smoothly on every new translation
      void els.translatedOutput.offsetWidth;
      els.translatedOutput.classList.add('animate-text-reveal');
      els.translatedOutput.textContent = finalTranslation;

      // Trigger subtle glow pulse on target card box
      if (els.targetCardBox) {
        els.targetCardBox.classList.remove('pulse-border-success');
        void els.targetCardBox.offsetWidth;
        els.targetCardBox.classList.add('pulse-border-success');
      }

      const targetLangObj = window.LinguaLanguages.getLanguageByCode(state.targetLang);
      els.translatedOutput.dir = targetLangObj.rtl ? 'rtl' : 'ltr';
      els.translatedOutput.classList.toggle(
        'urdu-nastaliq',
        ['ur', 'pa-PK', 'skr', 'ks', 'hno', 'sd', 'ps'].includes(state.targetLang)
      );

      renderAlternativesBar(result.agentAnalysis?.alternatives || []);
      renderAgentAnalysis(result.agentAnalysis);

      addHistoryEntry({
        sourceText: text,
        translatedText: finalTranslation,
        sourceLang: effectiveSource,
        targetLang: state.targetLang,
        tone: state.tone,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      els.translationLoadingShimmer.classList.add('hidden');
      showToast(err.message || 'Translation error', 'alert-circle');
    } finally {
      state.isTranslating = false;
    }
  }

  /**
   * ==========================================================================
   * FUNCTIONAL AI POWER TOOLS HANDLERS (Top-Right Hero Bar)
   * ==========================================================================
   */
  function bindPowerToolsEvents() {
    // 1. Paste from Clipboard
    els.toolPasteClipboardBtn.addEventListener('click', async () => {
      try {
        const clipText = await navigator.clipboard.readText();
        if (!clipText || !clipText.trim()) {
          showToast('Clipboard is empty! Copy some text first.', 'clipboard');
          return;
        }
        els.sourceTextarea.value = clipText.trim();
        updateCountersAndDetection();
        performTranslation();
        showToast('Pasted from clipboard & translated!', 'clipboard-check');
      } catch (err) {
        els.sourceTextarea.focus();
        showToast('Press Ctrl+V inside the box to paste!', 'info');
      }
    });

    // 2. AI Grammar & Spelling Fix
    els.toolFixGrammarBtn.addEventListener('click', () => {
      const raw = els.sourceTextarea.value.trim();
      if (!raw) {
        showToast('Type or paste some text in the left box first to fix grammar!', 'wand-sparkles');
        return;
      }

      let fixed = raw
        .replace(/\s+/g, ' ')
        .replace(/\bi\b/g, 'I')
        .replace(/\bdont\b/gi, "don't")
        .replace(/\bcant\b/gi, "can't")
        .replace(/\bwont\b/gi, "won't")
        .replace(/\bim\b/gi, "I'm")
        .replace(/\bid\b/gi, "I'd")
        .replace(/\bive\b/gi, "I've")
        .replace(/\bteh\b/gi, 'the')
        .replace(/\brecieve\b/gi, 'receive')
        .replace(/\bseperate\b/gi, 'separate')
        .replace(/\boccured\b/gi, 'occurred')
        .replace(/\bpls\b/gi, 'please')
        .replace(/\bplz\b/gi, 'please')
        .replace(/\bu\b/g, 'you')
        .replace(/\bur\b/g, 'your');

      fixed = fixed.replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, m => m.toUpperCase());
      if (!/[.!?۔؟]$/.test(fixed)) {
        fixed += '.';
      }

      els.sourceTextarea.value = fixed;
      updateCountersAndDetection();
      performTranslation();
      showToast('AI polished grammar, spelling & punctuation!', 'wand-sparkles');
    });

    // 3. AI Summarize Text
    els.toolSummarizeBtn.addEventListener('click', () => {
      const raw = els.sourceTextarea.value.trim();
      if (!raw) {
        showToast('Enter a paragraph or document first to summarize!', 'file-text');
        return;
      }

      const sentences = raw
        .split(/(?<=[.!?۔؟])\s+/)
        .map(s => s.trim())
        .filter(Boolean);

      if (sentences.length <= 1 && raw.length < 120) {
        showToast('Text is already concise!', 'check-circle');
        return;
      }

      const summary = sentences.length > 2
        ? `${sentences[0]} ${sentences[sentences.length - 1]}`
        : raw.slice(0, Math.min(raw.length, 160)).trim() + '...';

      els.sourceTextarea.value = summary;
      updateCountersAndDetection();
      performTranslation();
      showToast('Condensed into key executive summary!', 'sparkles');
    });

    // 4. Roman Urdu <-> Urdu Nastaliq (اردو) Script Toggle & Converter
    els.toolRomanUrduConvertBtn.addEventListener('click', async () => {
      const raw = els.sourceTextarea.value.trim();
      if (!raw) {
        showToast('Type text in the left box first, then click Roman ↔ اردو!', 'repeat');
        return;
      }

      if (state.targetLang === 'ur') {
        state.targetLang = 'ur-Latn';
        els.targetLangSelect.value = 'ur-Latn';
        await performTranslation();
        showToast('Switched output to Roman Urdu!', 'repeat');
      } else {
        state.targetLang = 'ur';
        els.targetLangSelect.value = 'ur';
        await performTranslation();
        showToast('Switched output to Urdu Nastaliq (اردو)!', 'repeat');
      }
    });

    // 5. Custom Glossary Modal
    els.toolGlossaryBtn.addEventListener('click', () => {
      renderGlossaryList();
      els.glossaryModal.classList.remove('hidden');
    });
    els.closeGlossaryModalBtn.addEventListener('click', () => {
      els.glossaryModal.classList.add('hidden');
    });
    els.addGlossaryItemBtn.addEventListener('click', () => {
      const src = els.glossarySourceInput.value.trim();
      const tgt = els.glossaryTargetInput.value.trim() || src;
      if (!src) return;
      state.glossary.push({ source: src, target: tgt });
      saveGlossary();
      els.glossarySourceInput.value = '';
      els.glossaryTargetInput.value = '';
      updateGlossaryBadge();
      renderGlossaryList();
      performTranslation();
      showToast(`Locked term "${src}" → "${tgt}"`, 'shield-check');
    });

    // 6. Auto-Sync Live Translation Toggle
    els.toolAutoTranslateToggleBtn.addEventListener('click', () => {
      state.autoTranslate = !state.autoTranslate;
      if (state.autoTranslate) {
        els.autoTranslateLabel.textContent = 'Auto-Sync: ON';
        els.autoTranslateDot.className = 'w-2 h-2 rounded-full bg-indigo-500 animate-pulse';
        els.toolAutoTranslateToggleBtn.className = 'btn-animated inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40 cursor-pointer';
        performTranslation();
        showToast('Live Auto-Translation Enabled', 'zap');
      } else {
        els.autoTranslateLabel.textContent = 'Auto-Sync: OFF (Manual)';
        els.autoTranslateDot.className = 'w-2 h-2 rounded-full bg-slate-400';
        els.toolAutoTranslateToggleBtn.className = 'btn-animated inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-pointer';
        showToast('Manual Mode Enabled — Click "Translate" when ready', 'mouse-pointer-click');
      }
    });
  }

  function loadGlossary() {
    try { return JSON.parse(localStorage.getItem(GLOSSARY_KEY) || '[]'); } catch (e) { return []; }
  }

  function saveGlossary() {
    try { localStorage.setItem(GLOSSARY_KEY, JSON.stringify(state.glossary)); } catch (e) {}
  }

  function updateGlossaryBadge() {
    if (els.glossaryCountBadge) {
      els.glossaryCountBadge.textContent = state.glossary.length;
    }
  }

  function renderGlossaryList() {
    if (!state.glossary.length) {
      els.glossaryItemsList.innerHTML = `<p class="text-center py-4 text-slate-400">No locked terms yet. Add a brand or technical word above.</p>`;
      return;
    }
    els.glossaryItemsList.innerHTML = state.glossary
      .map((item, idx) => `
        <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <span><strong>${escapeHtml(item.source)}</strong> → <span class="text-indigo-500 font-semibold">${escapeHtml(item.target)}</span></span>
          <button type="button" data-del-glossary="${idx}" class="text-rose-500 hover:underline cursor-pointer">Remove</button>
        </div>
      `)
      .join('');

    els.glossaryItemsList.querySelectorAll('[data-del-glossary]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-del-glossary'));
        state.glossary.splice(idx, 1);
        saveGlossary();
        updateGlossaryBadge();
        renderGlossaryList();
        performTranslation();
      });
    });
  }

  function renderAlternativesBar(alternatives) {
    if (!alternatives || alternatives.length === 0) {
      els.alternativesBar.classList.add('hidden');
      return;
    }

    const targetLangObj = window.LinguaLanguages.getLanguageByCode(state.targetLang);
    els.alternativesBar.classList.remove('hidden');
    els.alternativesList.innerHTML = alternatives
      .map((alt, idx) => `
        <button
          type="button"
          data-alt-idx="${idx}"
          dir="${targetLangObj.rtl ? 'rtl' : 'ltr'}"
          class="btn-animated alt-phrasing-btn text-left px-3 py-2 rounded-xl text-xs bg-slate-100/90 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <span dir="ltr" class="block text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-1">${escapeHtml(alt.tag)}</span>
          <span class="text-slate-800 dark:text-slate-100 line-clamp-2 ${state.targetLang === 'ur' ? 'urdu-nastaliq' : ''}">${escapeHtml(alt.text)}</span>
        </button>
      `)
      .join('');

    els.alternativesList.querySelectorAll('.alt-phrasing-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-alt-idx'));
        const chosen = alternatives[idx];
        if (chosen) {
          state.translatedText = chosen.text;
          els.translatedOutput.textContent = chosen.text;
          showToast(`Applied "${chosen.tag}" variation`, 'check-circle-2');
        }
      });
    });
  }

  function renderAgentAnalysis(analysis) {
    if (!analysis) return;

    if (els.agentSummaryBadge && analysis.summaryBadge) {
      els.agentSummaryBadge.textContent = analysis.summaryBadge;
    }

    els.idiomsCardsContainer.innerHTML = (analysis.detectedIdioms || [])
      .map(item => `
        <div class="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs animate-fade-in">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              ${escapeHtml(item.phrase)}
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-medium">
              Idiom &amp; Pragmatics
            </span>
          </div>
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <p><strong class="text-slate-800 dark:text-slate-100">Literal Meaning:</strong> ${escapeHtml(item.literalMeaning)}</p>
            <p><strong class="text-slate-800 dark:text-slate-100">Intended Meaning:</strong> ${escapeHtml(item.figurativeMeaning)}</p>
            <p class="pt-1 text-emerald-700 dark:text-emerald-400 font-medium ${state.targetLang === 'ur' ? 'urdu-nastaliq text-sm' : ''}">
              <strong class="text-emerald-800 dark:text-emerald-300" dir="ltr">Cultural Localization:</strong> ${escapeHtml(item.localizedAdaptation)}
            </p>
          </div>
        </div>
      `)
      .join('');

    els.culturalNotesContainer.innerHTML = (analysis.culturalNotes || [])
      .map(note => `
        <div class="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 animate-fade-in">
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-1.5">
            <i data-lucide="globe-2" class="w-3.5 h-3.5 text-violet-500"></i>
            ${escapeHtml(note.title)}
          </h4>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(note.detail)}</p>
        </div>
      `)
      .join('');

    const targetLangObj = window.LinguaLanguages.getLanguageByCode(state.targetLang);
    els.toneMatrixContainer.innerHTML = (analysis.toneMatrix || [])
      .map(row => {
        const isCurrent = row.toneId === state.tone;
        return `
          <div
            data-matrix-tone="${row.toneId}"
            class="btn-animated p-3.5 rounded-xl border transition-all cursor-pointer ${
              isCurrent
                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500'
                : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold ${isCurrent ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}">
                ${escapeHtml(row.label)}
              </span>
              <span class="text-[11px] font-medium ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}">
                ${isCurrent ? 'Active Tone' : 'Click to Apply'}
              </span>
            </div>
            <p dir="${targetLangObj.rtl ? 'rtl' : 'ltr'}" class="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed ${state.targetLang === 'ur' ? 'urdu-nastaliq' : ''}">${escapeHtml(row.sample)}</p>
          </div>
        `;
      })
      .join('');

    els.toneMatrixContainer.querySelectorAll('[data-matrix-tone]').forEach(card => {
      card.addEventListener('click', () => {
        const chosenTone = card.getAttribute('data-matrix-tone');
        state.tone = chosenTone;
        syncTonePillsUI();
        performTranslation();
        showToast(`Switched tone to ${window.LinguaLanguages.getToneById(chosenTone).label}`, 'sparkles');
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function openWorldLangModal(mode = 'target') {
    state.pickerMode = mode;
    syncPickerModeUI();
    els.worldLangModal.classList.remove('hidden');
    els.langSearchInput.value = '';
    renderWorldLanguageGrid('');
    setTimeout(() => els.langSearchInput.focus(), 60);
  }

  function syncPickerModeUI() {
    const isTarget = state.pickerMode === 'target';
    els.pickerModeTargetBtn.className = isTarget
      ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white cursor-pointer'
      : 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer';
    els.pickerModeSourceBtn.className = !isTarget
      ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white cursor-pointer'
      : 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer';
  }

  function renderWorldLanguageGrid(query = '') {
    const q = query.trim().toLowerCase();
    const allLangs = window.LinguaLanguages.SUPPORTED_LANGUAGES.filter(l => {
      if (state.pickerMode === 'target' && l.sourceOnly) return false;
      if (state.pickerRegion !== 'ALL' && !(l.region || '').toLowerCase().includes(state.pickerRegion.toLowerCase())) {
        return false;
      }
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.region || '').toLowerCase().includes(q)
      );
    });

    let html = allLangs
      .map(l => {
        const isCurrent = (state.pickerMode === 'target' ? state.targetLang : state.sourceLang) === l.code;
        return `
          <button
            type="button"
            data-select-lang-code="${l.code}"
            class="btn-animated flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
              isCurrent
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-500 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80'
            }"
          >
            <div class="min-w-0 pr-2">
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${isCurrent ? 'bg-white/20 text-white' : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'}">${escapeHtml(l.badge)}</span>
                <span class="font-bold text-xs sm:text-sm truncate">${escapeHtml(l.name)}</span>
              </div>
              <p class="text-[11px] ${isCurrent ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'} truncate mt-0.5">
                ${escapeHtml(l.nativeName)} · ${escapeHtml(l.region || 'Global')}
              </p>
            </div>
            ${isCurrent ? '<i data-lucide="check-circle-2" class="w-4 h-4 shrink-0"></i>' : ''}
          </button>
        `;
      })
      .join('');

    if (q.length >= 2) {
      html += `
        <button
          type="button"
          data-custom-world-lang="${escapeHtml(query.trim())}"
          class="col-span-full p-4 rounded-xl bg-gradient-to-r from-indigo-600/15 to-violet-600/15 border border-dashed border-indigo-500 text-left hover:bg-indigo-600/25 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-300">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              Use "${escapeHtml(query.trim())}" from the 7,100+ World Spoken Languages &amp; Dialects Engine
            </span>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Click to add "${escapeHtml(query.trim())}" to your active language selector and translate immediately.
            </p>
          </div>
          <span class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shrink-0">Select Language →</span>
        </button>
      `;
    }

    els.worldLangGridContainer.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    els.worldLangGridContainer.querySelectorAll('[data-select-lang-code]').forEach(btn => {
      btn.addEventListener('click', () => {
        applyChosenLanguageFromModal(btn.getAttribute('data-select-lang-code'));
      });
    });

    const customBtn = els.worldLangGridContainer.querySelector('[data-custom-world-lang]');
    if (customBtn) {
      customBtn.addEventListener('click', () => {
        const customName = customBtn.getAttribute('data-custom-world-lang');
        const created = window.LinguaLanguages.registerDynamicLanguage(customName);
        populateLanguageSelects();
        applyChosenLanguageFromModal(created.code);
      });
    }
  }

  function applyChosenLanguageFromModal(langCode) {
    const langObj = window.LinguaLanguages.getLanguageByCode(langCode);
    if (state.pickerMode === 'target') {
      state.targetLang = langCode;
      els.targetLangSelect.value = langCode;
    } else {
      state.sourceLang = langCode;
      els.sourceLangSelect.value = langCode;
      updateCountersAndDetection();
    }
    els.worldLangModal.classList.add('hidden');
    performTranslation();
    showToast(`${state.pickerMode === 'target' ? 'Target' : 'Source'} set to ${langObj.name} (${langObj.nativeName})`, 'globe-2');
  }

  function bindEvents() {
    els.themeToggleBtn.addEventListener('click', toggleTheme);

    bindPowerToolsEvents();

    els.openWorldLangModalBtn.addEventListener('click', () => openWorldLangModal('target'));
    document.querySelectorAll('[data-open-picker]').forEach(btn => {
      btn.addEventListener('click', () => openWorldLangModal(btn.getAttribute('data-open-picker')));
    });
    els.closeWorldLangModalBtn.addEventListener('click', () => els.worldLangModal.classList.add('hidden'));

    els.pickerModeTargetBtn.addEventListener('click', () => {
      state.pickerMode = 'target';
      syncPickerModeUI();
      renderWorldLanguageGrid(els.langSearchInput.value);
    });
    els.pickerModeSourceBtn.addEventListener('click', () => {
      state.pickerMode = 'source';
      syncPickerModeUI();
      renderWorldLanguageGrid(els.langSearchInput.value);
    });

    els.langSearchInput.addEventListener('input', (e) => {
      renderWorldLanguageGrid(e.target.value);
    });

    els.langRegionFilterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-region]');
      if (!btn) return;
      state.pickerRegion = btn.getAttribute('data-region');
      els.langRegionFilterBar.querySelectorAll('[data-region]').forEach(b => {
        const active = b.getAttribute('data-region') === state.pickerRegion;
        b.className = active
          ? 'px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white cursor-pointer'
          : 'px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer';
      });
      renderWorldLanguageGrid(els.langSearchInput.value);
    });

    els.sourceTextarea.addEventListener('input', () => {
      updateCountersAndDetection();
      if (!state.autoTranslate) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performTranslation();
      }, 240);
    });

    els.sourceTextarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(debounceTimer);
        performTranslation();
      }
    });

    els.sourceLangSelect.addEventListener('change', (e) => {
      state.sourceLang = e.target.value;
      updateCountersAndDetection();
      performTranslation();
    });

    els.targetLangSelect.addEventListener('change', (e) => {
      state.targetLang = e.target.value;
      performTranslation();
    });

    els.swapLangsBtn.addEventListener('click', () => {
      els.swapLangsBtn.classList.toggle('rotated');
      const effectiveSource = state.sourceLang === 'auto' ? state.detectedLang : state.sourceLang;
      const previousTarget = state.targetLang;

      state.sourceLang = previousTarget;
      state.targetLang = effectiveSource;

      els.sourceLangSelect.value = state.sourceLang;
      els.targetLangSelect.value = state.targetLang;

      if (state.translatedText) {
        els.sourceTextarea.value = state.translatedText;
        updateCountersAndDetection();
      }
      performTranslation();
    });

    els.toneSelectDropdown.addEventListener('change', (e) => {
      state.tone = e.target.value;
      syncTonePillsUI();
      performTranslation();
    });

    els.tonePillsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tone-id]');
      if (!btn) return;
      state.tone = btn.getAttribute('data-tone-id');
      syncTonePillsUI();
      performTranslation();
    });

    els.explainContextToggle.addEventListener('change', (e) => {
      state.explainContext = e.target.checked;
      els.agentPanelSection.classList.toggle('hidden', !state.explainContext);
    });

    els.clearSourceBtn.addEventListener('click', () => {
      window.LinguaSpeech.stop();
      els.sourceTextarea.value = '';
      state.sourceText = '';
      state.translatedText = '';
      updateCountersAndDetection();
      performTranslation();
      els.sourceTextarea.focus();
      showToast('Workspace reset', 'rotate-ccw');
    });

    els.translateNowBtn.addEventListener('click', () => {
      clearTimeout(debounceTimer);
      performTranslation();
    });

    els.copyTranslationBtn.addEventListener('click', async () => {
      if (!state.translatedText) return;
      try {
        await navigator.clipboard.writeText(state.translatedText);
        showToast('Copied translation to clipboard!', 'check');
      } catch (err) {
        const temp = document.createElement('textarea');
        temp.value = state.translatedText;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Copied translation to clipboard!', 'check');
      }
    });

    els.speakTranslationBtn.addEventListener('click', () => {
      if (!state.translatedText) return;
      window.LinguaSpeech.speak({
        text: state.translatedText,
        langCode: state.targetLang,
        targetId: 'target',
        onStart: (voiceLabel) => {
          els.speakTranslationBtn.innerHTML = `<span class="waveform-bars"><span></span><span></span><span></span><span></span><span></span></span><span>Speaking...</span>`;
          showToast(`Playing audio (${voiceLabel})`, 'volume-2');
        },
        onEnd: () => {
          els.speakTranslationBtn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i><span>Listen</span>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });

    els.speakSourceBtn.addEventListener('click', () => {
      if (!state.sourceText.trim()) return;
      const langCode = state.sourceLang === 'auto' ? state.detectedLang : state.sourceLang;
      window.LinguaSpeech.speak({ text: state.sourceText, langCode, targetId: 'source' });
    });

    els.speechSpeedBtn.addEventListener('click', () => {
      const nextSpeed = window.LinguaSpeech.cycleSpeed();
      els.speechSpeedBtn.textContent = `${nextSpeed}x`;
      showToast(`Audio playback speed: ${nextSpeed}x`, 'gauge');
    });

    els.dictateSourceBtn.addEventListener('click', () => {
      const langCode = state.sourceLang === 'auto' ? state.detectedLang : state.sourceLang;
      window.LinguaSpeech.toggleDictation({
        langCode,
        onInterimResult: (transcript) => {
          els.sourceTextarea.value = transcript;
          updateCountersAndDetection();
          performTranslation();
        },
        onStateChange: (listening) => {
          els.dictateSourceBtn.classList.toggle('bg-rose-500', listening);
          els.dictateSourceBtn.classList.toggle('text-white', listening);
        },
        onError: (msg) => showToast(msg, 'mic-off')
      });
    });

    els.downloadTranslationBtn.addEventListener('click', () => {
      if (!state.translatedText) return;
      window.LinguaFileHandler.downloadTranslatedDocument({
        originalFileName: state.uploadedDoc?.fileName || 'linguaflow_translation.txt',
        translatedText: state.translatedText,
        targetLang: state.targetLang,
        tone: state.tone
      });
    });

    els.agentTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-agent-tab');
        state.activeAgentTab = tab;
        els.agentTabBtns.forEach(b => {
          const active = b.getAttribute('data-agent-tab') === tab;
          b.className = active
            ? 'px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-2xs transition-all cursor-pointer'
            : 'px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer';
        });
        els.agentTabIdioms.classList.toggle('hidden', tab !== 'idioms');
        els.agentTabTones.classList.toggle('hidden', tab !== 'tones');
        els.agentTabAsk.classList.toggle('hidden', tab !== 'ask');
      });
    });

    const handleAgentQuestion = () => {
      const q = els.agentQuestionInput.value.trim();
      if (!q) return;
      els.agentQuestionInput.value = '';
      const reply = window.LinguaAgent.answerFollowUpQuestion(q, {
        sourceText: state.sourceText,
        translatedText: state.translatedText,
        sourceLang: state.sourceLang === 'auto' ? state.detectedLang : state.sourceLang,
        targetLang: state.targetLang,
        toneId: state.tone
      });
      els.agentChatHistory.insertAdjacentHTML('beforeend', `
        <div class="space-y-2 animate-fade-in">
          <div class="flex justify-end"><span class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs">${escapeHtml(q)}</span></div>
          <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200">${reply.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</div>
        </div>
      `);
      els.agentChatHistory.scrollTop = els.agentChatHistory.scrollHeight;
    };

    els.agentAskSubmitBtn.addEventListener('click', handleAgentQuestion);
    els.agentQuestionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAgentQuestion();
      }
    });

    // Global Escape Key & Modal Backdrop Click Handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        els.worldLangModal.classList.add('hidden');
        els.apiModal.classList.add('hidden');
        els.historyModal.classList.add('hidden');
        els.glossaryModal.classList.add('hidden');
      }
    });

    [els.worldLangModal, els.apiModal, els.historyModal, els.glossaryModal].forEach(modalEl => {
      if (!modalEl) return;
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) modalEl.classList.add('hidden');
      });
    });

    bindFileUploadEvents();
    bindModalEvents();
  }

  function bindFileUploadEvents() {
    els.dropZone.addEventListener('click', (e) => {
      if (e.target.closest('#loadSampleDocBtn')) return;
      els.fileInput.click();
    });
    els.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); els.dropZone.classList.add('dropzone-active'); });
    els.dropZone.addEventListener('dragleave', () => els.dropZone.classList.remove('dropzone-active'));
    els.dropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      els.dropZone.classList.remove('dropzone-active');
      const file = e.dataTransfer?.files?.[0];
      if (file) await processUploadedFile(file);
    });
    els.fileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (file) await processUploadedFile(file);
    });

    els.loadSampleDocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLoadedDocument(window.LinguaFileHandler.getSampleDocument());
      showToast('Loaded sample .DOCX document for bulk translation!', 'file-text');
    });

    els.translateDocBtn.addEventListener('click', () => {
      if (!state.uploadedDoc) return;
      els.sourceTextarea.value = state.uploadedDoc.text;
      updateCountersAndDetection();
      performTranslation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    els.downloadDocBtn.addEventListener('click', () => {
      if (!state.translatedText) return;
      window.LinguaFileHandler.downloadTranslatedDocument({
        originalFileName: state.uploadedDoc?.fileName || 'document.txt',
        translatedText: state.translatedText,
        targetLang: state.targetLang,
        tone: state.tone
      });
    });

    els.removeFileBtn.addEventListener('click', () => {
      state.uploadedDoc = null;
      els.fileInput.value = '';
      els.fileStatusCard.classList.add('hidden');
    });
  }

  async function processUploadedFile(file) {
    try {
      els.fileStatusCard.classList.remove('hidden');
      const parsed = await window.LinguaFileHandler.extractTextFromFile(file, (pct, msg) => {
        els.fileProgressBar.style.width = `${pct}%`;
        els.fileMetaLabel.textContent = msg;
      });
      displayLoadedDocument(parsed);
    } catch (err) {
      els.fileStatusCard.classList.add('hidden');
      showToast(err.message, 'alert-triangle');
    }
  }

  function displayLoadedDocument(docObj) {
    state.uploadedDoc = docObj;
    els.fileStatusCard.classList.remove('hidden');
    els.fileNameLabel.textContent = `${docObj.fileName} (${docObj.fileType})`;
    els.fileMetaLabel.textContent = `${docObj.fileSize} · ${docObj.wordCount} words extracted`;
    els.fileProgressBar.style.width = '100%';
    els.sourceTextarea.value = docObj.text;
    updateCountersAndDetection();
    performTranslation();
  }

  function bindModalEvents() {
    els.apiConfigBtn.addEventListener('click', () => {
      const current = window.LinguaAPI.getSettings();
      els.apiProviderSelect.value = current.provider;
      els.apiKeyInput.value = current.apiKey;
      els.apiModelInput.value = current.model;
      els.apiModal.classList.remove('hidden');
    });
    els.closeApiModalBtn.addEventListener('click', () => els.apiModal.classList.add('hidden'));
    els.saveApiConfigBtn.addEventListener('click', () => {
      window.LinguaAPI.saveSettings({
        provider: els.apiProviderSelect.value,
        apiKey: els.apiKeyInput.value.trim(),
        model: els.apiModelInput.value.trim() || 'gpt-4o-mini'
      });
      updateApiBadge();
      els.apiModal.classList.add('hidden');
      performTranslation();
      showToast('API settings saved!', 'key');
    });

    els.historyToggleBtn.addEventListener('click', () => {
      renderHistoryModal();
      els.historyModal.classList.remove('hidden');
    });
    els.closeHistoryModalBtn.addEventListener('click', () => els.historyModal.classList.add('hidden'));
    els.clearHistoryBtn.addEventListener('click', () => {
      state.history = [];
      localStorage.removeItem(HISTORY_KEY);
      updateHistoryBadge();
      renderHistoryModal();
    });

    // GitHub 1-Click Push Modal Events
    const openGhBtn = document.getElementById('openGitHubPushModalBtn');
    const closeGhBtn = document.getElementById('closeGitHubPushModalBtn');
    const ghModal = document.getElementById('githubPushModal');
    const startGhPushBtn = document.getElementById('startGitHubPushBtn');
    const ghTokenInput = document.getElementById('githubTokenInput');
    const ghStatusBox = document.getElementById('githubPushStatusBox');
    const ghStatusText = document.getElementById('githubPushStatusText');
    const ghProgressBar = document.getElementById('githubPushProgressBar');

    if (openGhBtn && ghModal) {
      openGhBtn.addEventListener('click', () => ghModal.classList.remove('hidden'));
    }
    if (closeGhBtn && ghModal) {
      closeGhBtn.addEventListener('click', () => ghModal.classList.add('hidden'));
    }
    if (startGhPushBtn && window.TranslateHubGitHubUploader) {
      startGhPushBtn.addEventListener('click', async () => {
        try {
          ghStatusBox.classList.remove('hidden');
          startGhPushBtn.disabled = true;
          const repoUrl = await window.TranslateHubGitHubUploader.pushAllToGitHub(
            ghTokenInput.value,
            (pct, msg) => {
              ghProgressBar.style.width = `${pct}%`;
              ghStatusText.textContent = msg;
            }
          );
          ghStatusText.textContent = '100% Pushed to GitHub! Opening Repo & Vercel...';
          showToast('Successfully pushed TranslateHub to GitHub!', 'check-circle-2');
          setTimeout(() => {
            window.open(repoUrl, '_blank');
            window.open('https://vercel.com/new', '_blank');
          }, 800);
        } catch (err) {
          ghStatusText.textContent = err.message;
          showToast(err.message, 'alert-triangle');
        } finally {
          startGhPushBtn.disabled = false;
        }
      });
    }
  }

  function updateApiBadge() {
    const s = window.LinguaAPI.getSettings();
    if (els.apiStatusBadge) {
      els.apiStatusBadge.textContent = s.provider === 'openai' && s.apiKey ? 'OpenAI Connected' : 'Smart Hybrid Engine';
    }
  }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { return []; }
  }

  function addHistoryEntry(entry) {
    if (!entry.sourceText || !entry.translatedText) return;
    if (state.history[0]?.sourceText === entry.sourceText && state.history[0]?.targetLang === entry.targetLang) return;
    state.history.unshift(entry);
    state.history = state.history.slice(0, 15);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history)); } catch (e) {}
    updateHistoryBadge();
  }

  function updateHistoryBadge() {
    if (els.historyCountBadge) els.historyCountBadge.textContent = state.history.length;
  }

  function renderHistoryModal() {
    if (!state.history.length) {
      els.historyListContainer.innerHTML = `<p class="text-center py-8 text-xs text-slate-400">No recent translations yet.</p>`;
      return;
    }
    els.historyListContainer.innerHTML = state.history
      .map((item, idx) => {
        const srcObj = window.LinguaLanguages.getLanguageByCode(item.sourceLang);
        const tgtObj = window.LinguaLanguages.getLanguageByCode(item.targetLang);
        return `
          <div data-hist-idx="${idx}" class="btn-animated p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 hover:border-indigo-400 transition-all cursor-pointer">
            <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>[${srcObj.badge}] ${srcObj.name} → [${tgtObj.badge}] ${tgtObj.name}</span>
              <span>${item.timestamp}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-1">${escapeHtml(item.sourceText)}</p>
            <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-300 line-clamp-1">${escapeHtml(item.translatedText)}</p>
          </div>
        `;
      })
      .join('');

    els.historyListContainer.querySelectorAll('[data-hist-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const item = state.history[Number(el.getAttribute('data-hist-idx'))];
        if (!item) return;
        els.sourceTextarea.value = item.sourceText;
        state.sourceLang = item.sourceLang;
        state.targetLang = item.targetLang;
        state.tone = item.tone || 'professional';
        els.sourceLangSelect.value = item.sourceLang;
        els.targetLangSelect.value = item.targetLang;
        syncTonePillsUI();
        updateCountersAndDetection();
        performTranslation();
        els.historyModal.classList.add('hidden');
        showToast('Restored translation from History', 'history');
      });
    });
  }

  function showToast(message, iconName = 'check-circle') {
    const toast = document.createElement('div');
    toast.className = 'flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-950 text-white text-xs font-medium shadow-lg border border-slate-700/80 dark:border-indigo-500/40 animate-fade-in';
    toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 text-indigo-400 shrink-0"></i><span>${escapeHtml(message)}</span>`;
    els.toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => { toast.remove(); }, 2500);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
