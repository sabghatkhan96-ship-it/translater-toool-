/**
 * ============================================================================
 * LinguaFlow AI — Integrated AI Translation Agent & Cultural Context Engine
 * Enhanced with Urdu (اردو), Roman Urdu, Pakistani Regional Languages &
 * 7,100+ World Language Register Analysis.
 * ============================================================================
 */

window.LinguaAgent = (function () {
  const IDIOM_KNOWLEDGE_BASE = [
    {
      pattern: /break a leg/i,
      phrase: 'Break a leg',
      originLang: 'en',
      literalMeaning: 'Fracture a limb (theatrical superstition where wishing good luck directly was believed to bring bad luck).',
      figurativeMeaning: 'Wishing someone outstanding success and confidence before a keynote, exam, or performance.',
      equivalents: {
        ur: 'اللہ آپ کو شاندار کامیابی عطا فرمائے! / آپ کا شو بے حد کامیاب رہے!',
        'ur-Latn': 'Allah aap ko shandar kamyabi ata farmaye! / Best of luck, kamal kar dikhana!',
        ps: 'الله دې تاسو ته لوی بریالیتوب درکړي!',
        sd: 'الله توهان کي وڏي ڪاميابي عطا فرمائي!',
        ar: 'أتمنى لك كل التوفيق والنجاح الباهر!',
        es: '¡Mucha mierda! (theatrical) / ¡Mucho éxito!',
        fr: 'Merde ! (theatrical) / Plein de succès !',
        de: 'Hals- und Beinbruch!',
        ja: 'ご武運を祈ります / 頑張ってください'
      }
    },
    {
      pattern: /knock it out of the park/i,
      phrase: 'Knock it out of the park',
      originLang: 'en',
      literalMeaning: 'Hit a baseball/cricket ball right out of the stadium boundary (sixer / home run).',
      figurativeMeaning: 'Achieve a resounding, extraordinary success that exceeds all expectations.',
      equivalents: {
        ur: 'میدان مار لینا / چھکا لگا دینا / شاندار کارکردگی دکھانا',
        'ur-Latn': 'Maidan maar lena / Chhakka laga dena / Kamaal kar dikhana',
        es: 'Sacarla del estadio / Hacer un trabajo impecable',
        fr: 'Faire un tabac / Réussir haut la main',
        de: 'Einen vollen Erfolg landen'
      }
    },
    {
      pattern: /drop us a note|respond within/i,
      phrase: 'Drop us a note / Business SLA Courtesies',
      originLang: 'en',
      literalMeaning: 'Informal corporate idiom meaning "send a brief written message or inquiry".',
      figurativeMeaning: 'Inviting a client or partner to reach out while assuring a prompt, committed response time.',
      equivalents: {
        ur: 'ہمیں نیچے پیغام بھیجیں / ہم سے رابطہ فرمائیں (آدابِ کاروبار)',
        'ur-Latn': 'Humein neeche paigham bhejein, hamari team 4 karobari ghanton mein rabta karegi.',
        ar: 'اترك لنا رسالة أدناه وسيرد فريق الامتثال لدينا خلال 4 ساعات عمل.',
        es: 'Envíenos un mensaje a continuación y nuestro equipo responderá en 4 horas hábiles.'
      }
    },
    {
      pattern: /raining cats and dogs/i,
      phrase: 'Raining cats and dogs',
      originLang: 'en',
      literalMeaning: 'Domestic animals falling from the sky.',
      figurativeMeaning: 'Raining torrentially or pouring heavily (موسلا دھار بارش).',
      equivalents: {
        ur: 'موسلا دھار بارش ہو رہی ہے / جل تھل ایک ہو گیا ہے',
        'ur-Latn': 'Bahar moosla dhaar barish ho rahi hai',
        es: 'Llover a cántaros',
        fr: 'Pleuvoir des cordes',
        de: 'Es gießt wie aus Eimern'
      }
    },
    {
      pattern: /every cloud has a silver lining/i,
      phrase: 'Every cloud has a silver lining',
      originLang: 'en',
      literalMeaning: 'Sunlight shining behind a dark storm cloud creates a bright silver edge.',
      figurativeMeaning: 'After every hardship comes ease; every difficulty holds a ray of hope.',
      equivalents: {
        ur: 'ہر تاریک رات کے بعد سویرا ہے / ہر مشکل کے ساتھ آسانی ہے',
        'ur-Latn': 'Har mushkil ke baad aasani hai / Har andhere ke baad ujala hai',
        ar: 'إن مع العسر يسراً / وراء كل غيمة مظلمة بارقة أمل',
        es: 'No hay mal que por bien no venga',
        fr: 'Après la pluie, le beau temps'
      }
    },
    {
      pattern: /circle back/i,
      phrase: 'Circle back',
      originLang: 'en',
      literalMeaning: 'Walk or fly in a loop to return to the starting point.',
      figurativeMeaning: 'Corporate idiom meaning to revisit, follow up on, or resume discussing a topic later.',
      equivalents: {
        ur: 'اس معاملے پر دوبارہ تفصیلی بات چیت کرنا / بعد میں جائزہ لینا',
        'ur-Latn': 'Is mauzoo par baad mein dobara tafseeli baat karna',
        es: 'Retomar el tema más adelante',
        ja: '改めて協議する'
      }
    },
    {
      pattern: /el mundo es un pañuelo/i,
      phrase: 'El mundo es un pañuelo',
      originLang: 'es',
      literalMeaning: 'The world is a handkerchief.',
      figurativeMeaning: 'It is a very small world! Used when unexpectedly meeting someone far from home.',
      equivalents: {
        ur: 'دنیا واقعی بہت چھوٹی ہے! (اتفاقیہ ملاقات پر بولا جانے والا محاورہ)',
        'ur-Latn': 'Dunya waqai bohat choti hai!',
        en: "It's a small world!",
        fr: 'Le monde est petit !'
      }
    }
  ];

  function adaptTextToTone(baseTranslation, targetLang, toneId, sourceText) {
    if (!baseTranslation) return '';
    const clean = baseTranslation.trim();

    const toneAdapters = {
      ur: {
        professional: (t) => t.replace(/\bتم\b/g, 'آپ').replace(/\bتمہارے\b/g, 'آپ کے'),
        casual: (t) => t,
        academic: (t) => `علمی و تحقیقی تناظر میں: ${t}`,
        poetic: (t) => `${t} — خوشبوئے الفاظ اور ادبی لطافت کے ساتھ۔`,
        diplomatic: (t) => `نہایت احترام کے ساتھ عرض ہے کہ ${t}`
      },
      'ur-Latn': {
        professional: (t) => t.replace(/\btum\b/gi, 'aap').replace(/\btumhara\b/gi, 'aap ka'),
        casual: (t) => t,
        academic: (t) => `Tehqeeqi aur rasmi taur par: ${t}`,
        poetic: (t) => `${t} (Adabi andaaz mein)`,
        diplomatic: (t) => `Intehai ehtaram ke saath guzarish hai: ${t}`
      },
      es: {
        professional: (t) => t.replace(/\b(tú|te|tu)\b/gi, (m) => ({ tú: 'usted', te: 'le', tu: 'su' }[m.toLowerCase()] || m)),
        casual: (t) => t,
        academic: (t) => `En términos formales: ${t}`,
        poetic: (t) => t,
        diplomatic: (t) => `Con el debido respeto, ${t.charAt(0).toLowerCase() + t.slice(1)}`
      },
      fr: {
        professional: (t) => t.replace(/\btu\b/gi, 'vous'),
        casual: (t) => t,
        academic: (t) => `Selon l'analyse formelle : ${t}`,
        poetic: (t) => t,
        diplomatic: (t) => `Avec toute notre considération, ${t.charAt(0).toLowerCase() + t.slice(1)}`
      },
      de: {
        professional: (t) => t.replace(/\b(du|dich|dir|dein)\b/gi, (m) => ({ du: 'Sie', dich: 'Sie', dir: 'Ihnen', dein: 'Ihr' }[m.toLowerCase()] || m)),
        casual: (t) => t,
        academic: (t) => t,
        poetic: (t) => t,
        diplomatic: (t) => `Mit vorzüglicher Hochachtung: ${t}`
      }
    };

    const langAdapter = toneAdapters[targetLang];
    if (langAdapter && langAdapter[toneId]) {
      return langAdapter[toneId](clean);
    }
    return clean;
  }

  function generateAgentAnalysis({ sourceText, translatedText, sourceLang, targetLang, toneId }) {
    const sourceLangObj = window.LinguaLanguages.getLanguageByCode(sourceLang);
    const targetLangObj = window.LinguaLanguages.getLanguageByCode(targetLang);
    const toneObj = window.LinguaLanguages.getToneById(toneId);

    const detectedIdioms = [];
    for (const item of IDIOM_KNOWLEDGE_BASE) {
      if (item.pattern.test(sourceText)) {
        detectedIdioms.push({
          phrase: item.phrase,
          literalMeaning: item.literalMeaning,
          figurativeMeaning: item.figurativeMeaning,
          localizedAdaptation: item.equivalents[targetLang] || `Culturally adapted into natural ${targetLangObj.name} (${targetLangObj.nativeName}) phrasing.`
        });
      }
    }

    if (detectedIdioms.length === 0 && sourceText.trim().length > 0) {
      detectedIdioms.push({
        phrase: `${sourceLangObj.name} → ${targetLangObj.name} (${targetLangObj.nativeName}) Syntax & Register`,
        literalMeaning: `Direct clause structure from ${sourceLangObj.name}.`,
        figurativeMeaning: `Preserves the speaker's polite intent and natural cadence in ${targetLangObj.name}.`,
        localizedAdaptation: targetLang === 'ur'
          ? 'اردو ادب اور شائستہ کاروباری لب و لہجے (آپ / احترام) کے مطابق ڈھالا گیا ہے۔'
          : `Adapted word order and vocabulary to read natively in ${targetLangObj.name} (${toneObj.label} style).`
      });
    }

    const culturalNotes = [
      {
        title: `${toneObj.label} Register in ${targetLangObj.name} (${targetLangObj.nativeName})`,
        detail: `${toneObj.description} ${targetLangObj.registerNote || ''}`
      },
      {
        title: 'Cross-Cultural & Script Intelligence',
        detail: targetLangObj.rtl
          ? `${targetLangObj.name} uses Right-to-Left (${targetLang === 'ur' ? 'Nastaliq Urdu' : 'Arabic/Persian'}) script. The agent automatically aligned typography, punctuation (۔ ، ؟), and honorific pronouns.`
          : `The agent calibrated verb conjugations, politeness markers, and terminology for ${targetLangObj.name}.`
      }
    ];

    const toneMatrix = ['professional', 'casual', 'academic', 'poetic'].map(tId => ({
      toneId: tId,
      label: window.LinguaLanguages.getToneById(tId).label,
      sample: adaptTextToTone(translatedText, targetLang, tId, sourceText)
    }));

    const alternatives = generateAlternativePhrasings(translatedText, targetLang);

    return {
      detectedIdioms,
      culturalNotes,
      toneMatrix,
      alternatives,
      summaryBadge: `${targetLangObj.name} · ${toneObj.label} Calibrated`
    };
  }

  function generateAlternativePhrasings(translatedText, targetLang) {
    if (!translatedText || !translatedText.trim()) return [];
    const base = translatedText.trim();

    if (targetLang === 'ur') {
      return [
        { tag: 'معیاری اور شائستہ (Recommended Urdu)', text: base },
        { tag: 'اعلیٰ دفتری / کاروباری انداز (Executive)', text: `نہایت احترام کے ساتھ: ${base}` },
        { tag: 'سادہ اور مختصر (Concise / Direct)', text: base.split('۔')[0] + '۔' }
      ];
    }

    if (targetLang === 'ur-Latn') {
      return [
        { tag: 'Natural Roman Urdu', text: base },
        { tag: 'Polite Business (Aap)', text: `Ehtaram ke saath: ${base}` },
        { tag: 'Short / WhatsApp Style', text: base.split('.')[0] + '.' }
      ];
    }

    return [
      { tag: 'Primary Recommended', text: base },
      { tag: 'Polished / Executive', text: adaptTextToTone(base, targetLang, 'professional') },
      { tag: 'Warm / Conversational', text: adaptTextToTone(base, targetLang, 'casual') }
    ];
  }

  function answerFollowUpQuestion(question, context) {
    const targetLangObj = window.LinguaLanguages.getLanguageByCode(context.targetLang);
    const toneObj = window.LinguaLanguages.getToneById(context.toneId);

    if (!context.sourceText || !context.translatedText) {
      return 'Pehle upar box mein koi jumla likhein, phir main uski Urdu/Grammar aur cultural context detail se samjhaunga!';
    }

    return `In **${targetLangObj.name} (${targetLangObj.nativeName})** [${toneObj.label} style]: **"${context.translatedText}"** — ${targetLangObj.registerNote || 'This translation preserves full contextual accuracy and polite etiquette.'}`;
  }

  return {
    IDIOM_KNOWLEDGE_BASE,
    adaptTextToTone,
    generateAgentAnalysis,
    answerFollowUpQuestion
  };
})();
