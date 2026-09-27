# LinguaFlow AI — Neural Translation & Cultural Intelligence Web App

A modern, responsive AI Translation Web Application with an integrated **AI Translation Agent**, built with **HTML5**, **Tailwind CSS**, **Lucide Icons**, and modular **JavaScript**.

---

## 📁 Project Folder Structure

```text
e:\all\testing 3\
├── index.html          # Main application layout, Dual-Box Dashboard, AI Agent Panel & Modals
├── README.md           # Project architecture & API integration guide
├── css/
│   └── styles.css      # Custom dark/light theme variables, glassmorphism, waveform & animations
└── js/
    ├── languages.js    # 14+ global language definitions, statistical/Unicode language auto-detector & sample idioms
    ├── agent.js        # AI Translation Agent: idiom breakdown, register/honorific notes, 4-way tone matrix & Q&A assistant
    ├── api.js          # Modular API layer (OpenAI, Google Gemini, DeepL, and Zero-Config Smart Hybrid Engine)
    ├── speech.js       # Web Speech API controller for Text-to-Speech (TTS) audio playback & Speech-to-Text (STT)
    ├── fileHandler.js  # Drag-and-drop parser for .txt, .pdf, and .docx documents + translated file exporter
    └── app.js          # Main UI state controller, debounced live translation, history drawer & theme switcher
```

---

## ✨ Key Features Implemented

1. **Hero Section & Dual-Box Dashboard**
   - **Left Box (Source Text)** & **Right Box (Translated Text)** with one-click language swap (`<->`).
   - **Real-Time Auto Language Detection**: Detects Unicode script blocks (Japanese, Chinese, Korean, Arabic, Hindi, Russian) and lexical/diacritic signatures (English, Spanish, French, German, Portuguese, Italian, Dutch, Turkish) with confidence scoring.
   - **Quick Sample Idiom Chips**: Test idioms (*"Break a leg"*, *"Raining cats and dogs"*, *"El mundo es un pañuelo"*, *"猫の手も借りたい"*) with a single click.

2. **Integrated AI Translation Agent Panel**
   - **Tone / Style Selector**: Choose between **Professional**, **Casual**, **Academic**, **Creative / Poetic**, and **Diplomatic / Polite** via interactive pills or mobile dropdown.
   - **Idiom & Cultural Context Breakdown**: Explains literal vs. figurative meanings, local equivalents, and target-language honorifics/formality (`tú` vs `usted`, `tu` vs `vous`, `du` vs `Sie`, Japanese `Keigo`).
   - **4x Side-by-Side Tone Comparison Matrix**: Compare how your sentence adapts across all styles simultaneously and click any card to apply it.
   - **Ask the AI Agent**: Built-in conversational input to ask follow-up questions about politeness, grammar, or shorter rewrites.

3. **File & Document Bulk Upload (`.txt`, `.pdf`, `.docx`)**
   - Drag-and-drop upload zone supporting `.txt`, `.pdf` (via PDF.js + native stream fallback), and `.docx` (via Mammoth.js + XML stream fallback).
   - Includes a **1-click "Load Sample .DOCX Brief"** button for immediate testing and a **Download Translated File** exporter.

4. **Action Buttons & Utilities**
   - **Copy to Clipboard** with toast confirmation.
   - **Text-to-Speech (Audio Playback)** with animated soundwave indicator and adjustable speed (`0.75x`, `1x`, `1.25x`).
   - **Voice Dictation (Speech-to-Text)** for the source input box.
   - **Character & Word Counter** (`0 / 5,000 chars`) with progress bar and **Reset** button.

5. **Plug-and-Play API Integration (`js/api.js`)**
   - Click the **Smart Hybrid Engine / Sliders** button in the top navigation bar to select **OpenAI (`gpt-4o-mini`)**, **Google Gemini (`gemini-2.5-flash`)**, or **DeepL**, or run immediately with zero configuration using the built-in **Smart Hybrid Neural Engine**.
