import { state, isGuestUser } from './state.js';
import { saveState } from './storage.js';
import { escapeHtml, formatTopic, capitalize, speakText } from './utils.js';
import {
  BANK,
  TENSES,
  VOCAB,
  EXTENDED_OXFORD_LEXICON,
  LEMMA_MAP,
  GRAMMAR_PARTS_OF_SPEECH,
  GRAMMAR_CURRICULUM_MODULES,
  INDONESIAN_LEARNER_PITFALLS,
  INTERACTIVE_SENTENCE_PATTERNS,
  EXAM_GRAMMAR_HACKS
} from './data.js';
import { recordIncorrectQuestion } from './review.js';
import { syncCloudProfile, recordCloudQuizHistory } from './supabase-client.js';
import { openAuthModal } from './auth.js';
import { showToast } from './notifications.js';

export function renderTenses() {
  const grid = document.getElementById('tenseGrid');
  const tabs = document.getElementById('tenseCategoryTabs');
  if (!grid) return;

  const isId = state.lang === 'id';
  const filter = state.tenseFilter || 'all';

  if (tabs) {
    const cats = [
      { id: 'all', label: isId ? 'Semua Tenses (12)' : 'All Tenses (12)' },
      { id: 'Present', label: 'Present (4)' },
      { id: 'Past', label: 'Past (4)' },
      { id: 'Future', label: 'Future (4)' }
    ];
    tabs.innerHTML = cats.map(c => `
      <button class="pill ${filter === c.id ? 'active' : ''}" data-tfilter="${c.id}">${c.label}</button>
    `).join('');

    tabs.querySelectorAll('[data-tfilter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.tenseFilter = btn.dataset.tfilter;
        renderTenses();
      });
    });
  }

  const filtered = TENSES.filter(t => filter === 'all' || t.time === filter);

  grid.innerHTML = filtered.map((tense) => {
    const origIndex = TENSES.findIndex(t => t.name === tense.name);
    const isOpen = state.openTense === origIndex;
    const uses = (isId ? tense.uses_id : tense.uses) || tense.uses;
    return `
      <div class="card tense-card ${isOpen ? 'open' : ''}" data-tense-index="${origIndex}">
        <div class="tc-top">
          <div>
            <div class="tc-aspect">${escapeHtml(tense.time)} · ${escapeHtml(tense.aspect)}</div>
            <h4>${escapeHtml(tense.name)}</h4>
          </div>
          <span class="chev">▼</span>
        </div>
        <div class="tc-formula">${escapeHtml(tense.formula)}</div>
        <div class="tense-detail" style="max-height:${isOpen ? '1800px' : '0px'}">
          <div class="tense-detail-inner">
            <div class="tc-subheading">📋 ${isId ? 'Rumus Bentuk Kalimat' : 'Sentence Structure Formulas'}</div>
            <div class="tc-formulas-box">
              <div><span class="tc-type-badge">(+)</span> <code>${escapeHtml(tense.formula)}</code></div>
              <div><span class="tc-type-badge">(-)</span> <code>${escapeHtml(tense.negFormula)}</code></div>
              <div><span class="tc-type-badge">(?)</span> <code>${escapeHtml(tense.quesFormula)}</code></div>
            </div>

            <div class="tc-subheading">📌 ${isId ? 'Kapan Digunakan (Fungsi & Aturan Inti)' : 'When to Use (Core Rules)'}</div>
            <ul class="tc-rules-list">${uses.map(use => {
              const colonIdx = use.indexOf(':');
              if (colonIdx !== -1) {
                const head = use.substring(0, colonIdx);
                const desc = use.substring(colonIdx + 1);
                return `<li><strong class="tc-rule-title">${escapeHtml(head)}:</strong><span class="tc-rule-desc">${escapeHtml(desc)}</span></li>`;
              }
              return `<li>${escapeHtml(use)}</li>`;
            }).join('')}</ul>

            ${tense.signals && tense.signals.length ? `
              <div class="tc-subheading">⏱️ ${isId ? 'Kata Kunci / Sinyal Waktu' : 'Key Time Signals'}</div>
              <div class="tc-signals-list">
                ${tense.signals.map(sig => `<span class="signal-tag">${escapeHtml(sig)}</span>`).join('')}
              </div>
            ` : ''}

            <div class="tc-subheading">💡 ${isId ? 'Contoh Kalimat Nyata & Terjemahan' : 'Real-World Examples & Translations'}</div>
            <div class="tc-examples">
              ${tense.ex.map((example, i) => {
                const tr = (tense.ex_id && tense.ex_id[i]) || '';
                return `
                  <div class="tc-example">
                    <div class="tc-example-en">${escapeHtml(example)}</div>
                    ${tr ? `<div class="tc-example-id">${escapeHtml(tr)}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <button class="btn btn-primary btn-sm tense-practice-btn" data-tense-name="${escapeHtml(tense.name)}" style="margin-top:var(--sp-4);width:100%;">
              🎯 ${isId ? `Latih Soal ${tense.name}` : `Practice ${tense.name}`}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-tense-index]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.tense-practice-btn')) return;
      const idx = Number(card.dataset.tenseIndex);
      state.openTense = idx === state.openTense ? null : idx;
      renderTenses();
    });
  });

  grid.querySelectorAll('.tense-practice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selectedTopic = 'tenses';
      if (typeof window.setView === 'function') {
        window.setView('practice');
      }
      setTimeout(() => {
        startQuickQuiz();
      }, 50);
    });
  });
}

export function renderVocabulary() {
  const grid = document.getElementById('vocabGrid');
  const tabs = document.getElementById('vocabCategoryTabs');
  const searchInput = document.getElementById('vocabSearchInput');
  const countBadge = document.getElementById('vocabWordCountBadge');
  if (!grid || !tabs) return;

  const isId = state.lang === 'id';
  const categories = Object.keys(VOCAB);
  const category = tabs.dataset.active || categories[0];

  const catLabels = {
    'Daily life': isId ? 'Aktivitas Harian (A1-B1)' : 'Daily Life (A1-B1)',
    'Work & study': isId ? 'Karier & Bisnis (B1-C1)' : 'Work & Business (B1-C1)',
    'Travel': isId ? 'Perjalanan & Wisata (A2-B2)' : 'Travel & Transport (A2-B2)',
    'Academic': isId ? 'Akademik & Riset (B2-C2)' : 'Academic & Research (B2-C2)',
    'Feelings': isId ? 'Emosi & Karakter (B1-C1)' : 'Feelings & Personality (B1-C1)',
    'Technology': isId ? 'Teknologi & Media (B1-C1)' : 'Technology & Media (B1-C1)',
    'Environment': isId ? 'Lingkungan & Sosial (B2-C1)' : 'Environment & Society (B2-C1)',
    'Health & Medicine': isId ? 'Kesehatan & Medis (A2-C1)' : 'Health & Medicine (A2-C1)',
    'Arts & Culture': isId ? 'Seni & Kebudayaan (B1-C1)' : 'Arts & Culture (B1-C1)',
    'Law & Society': isId ? 'Hukum & Pemerintahan (B2-C2)' : 'Law & Society (B2-C2)',
    'Food & Dining': isId ? 'Kuliner & Pangan (A1-B2)' : 'Food & Dining (A1-B2)',
    'Phrasal verbs': isId ? 'Phrasal Verbs & Idioms (B1-B2)' : 'Phrasal Verbs & Idioms (B1-B2)'
  };

  const posLabels = {
    'noun': isId ? 'kata benda (noun)' : 'noun',
    'verb': isId ? 'kata kerja (verb)' : 'verb',
    'noun / verb': isId ? 'kata benda / kerja (noun / verb)' : 'noun / verb',
    'verb / noun': isId ? 'kata kerja / benda (verb / noun)' : 'verb / noun',
    'adjective': isId ? 'kata sifat (adjective)' : 'adjective',
    'adjective / noun': isId ? 'kata sifat / benda (adjective / noun)' : 'adjective / noun',
    'adverb': isId ? 'kata keterangan (adverb)' : 'adverb',
    'phrasal verb': isId ? 'frasa kata kerja (phrasal verb)' : 'phrasal verb'
  };

  const searchQuery = (searchInput?.value || '').trim().toLowerCase();

  tabs.innerHTML = categories.map(cat => {
    const totalInCat = (VOCAB[cat] || []).length;
    return `
      <button class="pill ${cat === category && !searchQuery ? 'active' : ''}" data-vocab-cat="${escapeHtml(cat)}">
        ${escapeHtml(catLabels[cat] || cat)} <span style="opacity:.7;font-size:.7rem;">(${totalInCat})</span>
      </button>
    `;
  }).join('');

  let displayedItems = [];
  if (searchQuery) {
    // Search across all core categories
    categories.forEach(cat => {
      (VOCAB[cat] || []).forEach(item => {
        const matchesWord = item.w.toLowerCase().includes(searchQuery);
        const matchesMeaning = item.m && item.m.toLowerCase().includes(searchQuery);
        const matchesId = item.m_id && item.m_id.toLowerCase().includes(searchQuery);
        const matchesEx = item.e && item.e.toLowerCase().includes(searchQuery);
        if (matchesWord || matchesMeaning || matchesId || matchesEx) {
          displayedItems.push({ ...item, category: cat });
        }
      });
    });

    // Also include matches from Extended Oxford Lexicon
    if (typeof EXTENDED_OXFORD_LEXICON === 'object' && EXTENDED_OXFORD_LEXICON !== null) {
      Object.keys(EXTENDED_OXFORD_LEXICON).forEach(key => {
        const entry = EXTENDED_OXFORD_LEXICON[key];
        const w = entry.word || key;
        const already = displayedItems.some(it => it.w.toLowerCase() === w.toLowerCase());
        if (!already) {
          const def1 = entry.meanings?.[0]?.definitions?.[0]?.definition || '';
          const defId1 = entry.meanings?.[0]?.definitions?.[0]?.definition_id || '';
          const ex1 = entry.meanings?.[0]?.definitions?.[0]?.example || '';
          const matchesWord = w.toLowerCase().includes(searchQuery);
          const matchesDef = def1.toLowerCase().includes(searchQuery);
          const matchesId = defId1.toLowerCase().includes(searchQuery);
          if (matchesWord || matchesDef || matchesId) {
            displayedItems.push({
              w,
              p: entry.meanings?.[0]?.partOfSpeech || 'word',
              ipa: entry.phonetic || '',
              cefr: entry.cefr || 'C1',
              m: def1,
              m_id: defId1,
              e: ex1,
              category: 'Oxford Lexicon'
            });
          }
        }
      });
    }
  } else {
    displayedItems = (VOCAB[category] || []).map(item => ({ ...item, category }));
  }

  // Update count badge
  if (countBadge) {
    const totalAll = Object.values(VOCAB).reduce((acc, curr) => acc + curr.length, 0);
    countBadge.textContent = searchQuery
      ? (isId ? `${displayedItems.length} Ditemukan` : `${displayedItems.length} Found`)
      : (isId ? `${displayedItems.length} dari ${totalAll} Kata` : `${displayedItems.length} of ${totalAll} Words`);
  }

  if (displayedItems.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--sp-6);">
        <div style="font-size: 2.2rem; margin-bottom: .5rem;">🔍</div>
        <div style="font-weight: 700; font-size: 1.1rem;">${isId ? `Kata "${escapeHtml(searchQuery)}" tidak ada di flashcard dasar` : `"${escapeHtml(searchQuery)}" is not in basic flashcards`}</div>
        <p style="color: var(--muted); font-size: .88rem; margin: .45rem auto var(--sp-4); max-width: 52ch; line-height: 1.5;">
          ${isId 
            ? `Tetapi kata ini tersedia di <strong>Kamus Lengkap Oxford</strong> dengan definisi baku, fonetik IPA, dan rekaman audio pengucapan asli.` 
            : `However, you can look it up directly in the <strong>Full Oxford Dictionary</strong> with definitions, IPA, and native audio.`}
        </p>
        <button type="button" class="btn btn-primary" id="btnSearchFromEmptyFlashcards" style="display:inline-flex;align-items:center;gap:.5rem;margin:0 auto;font-weight:700;">
          <span>📖</span> <span>${isId ? `Cari "${escapeHtml(searchQuery)}" di Kamus Oxford` : `Lookup "${escapeHtml(searchQuery)}" in Oxford Dictionary`}</span>
        </button>
      </div>
    `;

    document.getElementById('btnSearchFromEmptyFlashcards')?.addEventListener('click', () => {
      setVocabMode('dictionary');
      const dictInput = document.getElementById('dictSearchInput');
      if (dictInput) dictInput.value = searchQuery;
      searchDictionary(searchQuery);
    });
    return;
  }

  grid.innerHTML = displayedItems.map((item, index) => {
    const posText = posLabels[item.p] || item.p;
    return `
      <div class="flashcard" data-flip="${index}">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="word">${escapeHtml(item.w)}</div>
            ${item.ipa ? `<div class="ipa">${escapeHtml(item.ipa)}</div>` : ''}
            <div class="pos">${escapeHtml(posText)}</div>
            ${item.cefr ? `<span class="cefr-pill">CEFR ${escapeHtml(item.cefr)}</span>` : ''}
            <div style="font-size:.72rem;color:var(--sky-bright);margin-top:.45rem;opacity:.9;">
              ${isId ? '↻ Klik untuk membalik' : '↻ Tap to flip card'}
            </div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-bottom:.2rem;">
              ${isId ? 'Definisi Oxford:' : 'Oxford Definition:'}
            </div>
            <div class="mean">${escapeHtml(item.m)}</div>
            ${item.m_id ? `
              <div class="mean-id">${escapeHtml(item.m_id)}</div>
            ` : ''}
            <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-top:.4rem;margin-bottom:.15rem;">
              ${isId ? 'Contoh Penggunaan:' : 'Example Sentence:'}
            </div>
            <div class="ex">${escapeHtml(item.e)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  tabs.querySelectorAll('[data-vocab-cat]').forEach(btn => btn.addEventListener('click', () => {
    tabs.dataset.active = btn.dataset.vocabCat;
    if (searchInput) searchInput.value = '';
    renderVocabulary();
  }));

  grid.querySelectorAll('.flashcard').forEach(card => card.addEventListener('click', () => card.classList.toggle('flipped')));

  // Bind search input only once or reuse
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = 'true';
    searchInput.addEventListener('input', () => {
      renderVocabulary();
    });
  }

  // Initialize and bind dictionary engine
  initDictionaryEngine();
}

/* ========================================================
   OXFORD & GLOBAL ENGLISH DICTIONARY ENGINE LOGIC
   ======================================================== */

let isDictEngineInitialized = false;

export function initDictionaryEngine() {
  updateSavedWordsCountBadge();

  if (isDictEngineInitialized) return;
  isDictEngineInitialized = true;

  // Bind mode selector buttons
  const modeButtons = [
    { id: 'btnVocabModeDictionary', mode: 'dictionary' },
    { id: 'btnVocabModeBrowse', mode: 'browse' },
    { id: 'btnVocabModeSaved', mode: 'saved' }
  ];

  modeButtons.forEach(({ id, mode }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        setVocabMode(mode);
      });
    }
  });

  // Bind Dictionary Search Input & Button
  const dictInput = document.getElementById('dictSearchInput');
  const dictBtn = document.getElementById('dictSearchBtn');
  const dictForm = document.getElementById('dictSearchForm');

  if (dictBtn && dictInput) {
    dictBtn.addEventListener('click', () => {
      searchDictionary(dictInput.value);
    });
  }

  if (dictForm && dictInput) {
    dictForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchDictionary(dictInput.value);
    });
  }

  if (dictInput) {
    dictInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchDictionary(dictInput.value);
      }
    });

    // Real-time live suggestion & auto-lookup as user types
    let inputDebounce = null;
    dictInput.addEventListener('input', () => {
      const query = (dictInput.value || '').trim();
      clearTimeout(inputDebounce);

      if (!query) {
        const sugg = document.getElementById('dictLiveSuggestions');
        if (sugg) {
          sugg.classList.add('hidden');
          sugg.innerHTML = '';
        }
        return;
      }

      inputDebounce = setTimeout(() => {
        const matches = findDictionaryMatches(query, 6);
        renderLiveSuggestions(matches, query);

        // If user typed the exact word (e.g. "eloquent"), auto-render immediately!
        const clean = query.toLowerCase().replace(/^[“"']+|[”"'.?!,:;]+$/g, '');
        const exact = matches.find(m => m.word.toLowerCase() === clean);
        if (exact) {
          searchDictionary(clean);
        }
      }, 150);
    });
  }

  // Bind Quick Suggestion Chips
  document.querySelectorAll('.dict-quick-chips [data-lookup]').forEach(chip => {
    chip.addEventListener('click', () => {
      const word = chip.dataset.lookup;
      if (dictInput) dictInput.value = word;
      searchDictionary(word);
    });
  });

  // Apply default view mode
  setVocabMode(state.vocabMode || 'dictionary', false);

  // Preload an inspiring initial Oxford standard word if container is empty
  const resContainer = document.getElementById('dictResultContainer');
  if (resContainer && !resContainer.hasChildNodes()) {
    searchDictionary('serendipity');
  }
}

export function setVocabMode(mode, save = true) {
  state.vocabMode = mode;
  if (save) saveState();

  const paneDict = document.getElementById('paneVocabDictionary');
  const paneBrowse = document.getElementById('paneVocabBrowse');
  const paneSaved = document.getElementById('paneVocabSaved');

  const btnDict = document.getElementById('btnVocabModeDictionary');
  const btnBrowse = document.getElementById('btnVocabModeBrowse');
  const btnSaved = document.getElementById('btnVocabModeSaved');

  if (paneDict) paneDict.classList.toggle('hidden', mode !== 'dictionary');
  if (paneBrowse) paneBrowse.classList.toggle('hidden', mode !== 'browse');
  if (paneSaved) paneSaved.classList.toggle('hidden', mode !== 'saved');

  if (btnDict) btnDict.classList.toggle('active', mode === 'dictionary');
  if (btnBrowse) btnBrowse.classList.toggle('active', mode === 'browse');
  if (btnSaved) btnSaved.classList.toggle('active', mode === 'saved');

  if (mode === 'saved') {
    renderSavedWords();
  }
}

export function updateSavedWordsCountBadge() {
  const badge = document.getElementById('savedWordsCountBadge');
  if (badge) {
    badge.textContent = String(Array.isArray(state.savedWords) ? state.savedWords.length : 0);
  }
}

// -------------------------------------------------------------
// Offline Oxford Dictionary Matcher & Lemma Engine
// -------------------------------------------------------------
export function lookupOfflineOxfordWord(query) {
  if (!query) return null;
  const clean = String(query).trim().toLowerCase().replace(/^[“"']+|[”"'.?!,:;]+$/g, '');
  if (!clean) return null;

  // 1. Direct match in EXTENDED_OXFORD_LEXICON
  if (EXTENDED_OXFORD_LEXICON && EXTENDED_OXFORD_LEXICON[clean]) {
    return {
      ...EXTENDED_OXFORD_LEXICON[clean],
      isOxfordCore: true,
      isExtendedLexicon: true
    };
  }

  // 2. Check Lemma Map -> EXTENDED_OXFORD_LEXICON
  if (LEMMA_MAP && LEMMA_MAP[clean]) {
    const base = LEMMA_MAP[clean];
    if (EXTENDED_OXFORD_LEXICON && EXTENDED_OXFORD_LEXICON[base]) {
      return {
        ...EXTENDED_OXFORD_LEXICON[base],
        queriedLemma: clean,
        isOxfordCore: true,
        isExtendedLexicon: true
      };
    }
  }

  // 3. Direct match in VOCAB (all categories)
  for (const cat of Object.keys(VOCAB)) {
    const list = VOCAB[cat] || [];
    const found = list.find(item => item.w.toLowerCase() === clean);
    if (found) {
      return {
        word: found.w,
        phonetic: found.ipa || '',
        phonetics: [],
        meanings: [
          {
            partOfSpeech: found.p || 'word',
            definitions: [
              {
                definition: found.m,
                example: found.e,
                definition_id: found.m_id
              }
            ]
          }
        ],
        cefr: found.cefr || 'B1',
        isOxfordCore: true,
        category: cat
      };
    }
  }

  // 4. Lemma Map -> VOCAB
  if (LEMMA_MAP && LEMMA_MAP[clean]) {
    const base = LEMMA_MAP[clean];
    for (const cat of Object.keys(VOCAB)) {
      const list = VOCAB[cat] || [];
      const found = list.find(item => item.w.toLowerCase() === base);
      if (found) {
        return {
          word: found.w,
          queriedLemma: clean,
          phonetic: found.ipa || '',
          phonetics: [],
          meanings: [
            {
              partOfSpeech: found.p || 'word',
              definitions: [
                {
                  definition: found.m,
                  example: found.e,
                  definition_id: found.m_id
                }
              ]
            }
          ],
          cefr: found.cefr || 'B1',
          isOxfordCore: true,
          category: cat
        };
      }
    }
  }

  // 5. English Suffix De-inflection Heuristics (-ly, -ing, -ed, -es, -s, -ment, -ness)
  const suffixes = [
    { s: 'ly', cut: 2 },
    { s: 'ing', cut: 3 },
    { s: 'ed', cut: 2 },
    { s: 'es', cut: 2 },
    { s: 's', cut: 1 },
    { s: 'ment', cut: 4 },
    { s: 'ness', cut: 4 }
  ];

  for (const suf of suffixes) {
    if (clean.length > suf.cut + 2 && clean.endsWith(suf.s)) {
      const stem = clean.slice(0, -suf.cut);
      const candidates = [stem, stem + 'e'];
      for (const cand of candidates) {
        if (EXTENDED_OXFORD_LEXICON && EXTENDED_OXFORD_LEXICON[cand]) {
          return {
            ...EXTENDED_OXFORD_LEXICON[cand],
            queriedLemma: clean,
            isOxfordCore: true
          };
        }
        for (const cat of Object.keys(VOCAB)) {
          const list = VOCAB[cat] || [];
          const found = list.find(item => item.w.toLowerCase() === cand);
          if (found) {
            return {
              word: found.w,
              queriedLemma: clean,
              phonetic: found.ipa || '',
              phonetics: [],
              meanings: [
                {
                  partOfSpeech: found.p || 'word',
                  definitions: [
                    {
                      definition: found.m,
                      example: found.e,
                      definition_id: found.m_id
                    }
                  ]
                }
              ],
              cefr: found.cefr || 'B1',
              isOxfordCore: true,
              category: cat
            };
          }
        }
      }
    }
  }

  return null;
}

export function findDictionaryMatches(query, limit = 8) {
  if (!query) return [];
  const q = String(query).trim().toLowerCase().replace(/^[“"']+|[”"'.?!,:;]+$/g, '');
  if (!q) return [];

  const results = [];
  const seen = new Set();

  function addMatch(w, cefr, pos, meaning, source) {
    const key = w.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ word: w, cefr: cefr || 'B1', pos: pos || 'word', meaning: meaning || '', source });
    }
  }

  // Exact startsWith matches from EXTENDED_OXFORD_LEXICON
  if (EXTENDED_OXFORD_LEXICON) {
    for (const [key, item] of Object.entries(EXTENDED_OXFORD_LEXICON)) {
      if (key.toLowerCase().startsWith(q)) {
        addMatch(item.word || key, item.cefr, item.meanings?.[0]?.partOfSpeech, item.meanings?.[0]?.definitions?.[0]?.definition, 'extended');
      }
    }
  }

  // Exact startsWith matches from VOCAB
  for (const cat of Object.keys(VOCAB)) {
    for (const item of (VOCAB[cat] || [])) {
      if (item.w.toLowerCase().startsWith(q)) {
        addMatch(item.w, item.cefr, item.p, item.m, cat);
      }
    }
  }

  // If results < limit, search contains (substring)
  if (results.length < limit) {
    if (EXTENDED_OXFORD_LEXICON) {
      for (const [key, item] of Object.entries(EXTENDED_OXFORD_LEXICON)) {
        if (!key.toLowerCase().startsWith(q) && key.toLowerCase().includes(q)) {
          addMatch(item.word || key, item.cefr, item.meanings?.[0]?.partOfSpeech, item.meanings?.[0]?.definitions?.[0]?.definition, 'extended');
        }
      }
    }
    for (const cat of Object.keys(VOCAB)) {
      for (const item of (VOCAB[cat] || [])) {
        if (!item.w.toLowerCase().startsWith(q) && item.w.toLowerCase().includes(q)) {
          addMatch(item.w, item.cefr, item.p, item.m, cat);
        }
      }
    }
  }

  return results.slice(0, limit);
}

function renderLiveSuggestions(matches, currentQuery) {
  const container = document.getElementById('dictLiveSuggestions');
  if (!container) return;

  if (!matches || !matches.length) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const isId = (state.lang || 'id') === 'id';
  container.innerHTML = `
    <span style="font-size:.78rem;font-weight:700;color:var(--sky-bright);">💡 ${isId ? 'Saran kata Oxford:' : 'Oxford suggestions:'}</span>
    ${matches.map(m => `
      <button type="button" class="dict-suggest-chip" data-suggest="${escapeHtml(m.word)}">
        <span>${escapeHtml(m.word)}</span>
        <span class="dict-suggest-cefr">${escapeHtml(m.cefr)}</span>
      </button>
    `).join('')}
  `;
  container.classList.remove('hidden');

  container.querySelectorAll('[data-suggest]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetWord = btn.dataset.suggest;
      const dictInput = document.getElementById('dictSearchInput');
      if (dictInput) dictInput.value = targetWord;
      container.classList.add('hidden');
      searchDictionary(targetWord);
    });
  });
}

export async function searchDictionary(query) {
  const cleanWord = (query || '').trim().toLowerCase().replace(/^[“"']+|[”"'.?!,:;]+$/g, '');
  const container = document.getElementById('dictResultContainer');
  if (!cleanWord || !container) return;

  const isId = (state.lang || 'id') === 'id';

  // 1. Instant check in offline Oxford Database (0ms latency, works 100% offline)
  const offlineMatch = lookupOfflineOxfordWord(cleanWord);
  if (offlineMatch) {
    renderDictionaryResult(offlineMatch);
    const sugg = document.getElementById('dictLiveSuggestions');
    if (sugg) sugg.classList.add('hidden');
    return;
  }

  // 2. Show fast loading state for live global lookup
  container.innerHTML = `
    <div class="dict-result-card" style="text-align:center;padding:var(--sp-6);">
      <div style="font-size:2.2rem;display:inline-block;animation:spin 2s linear infinite;">📖</div>
      <div style="font-weight:700;font-size:1.1rem;margin-top:.75rem;">${isId ? `Mencari kata "${escapeHtml(cleanWord)}" di repositori kamus Oxford...` : `Looking up "${escapeHtml(cleanWord)}" in Oxford lexicon...`}</div>
      <div style="font-size:.85rem;color:var(--muted);margin-top:.3rem;">${isId ? 'Memuat definisi baku, transkripsi fonetik IPA, dan rekaman audio asli' : 'Loading definitions, phonetic transcription (IPA), and native audio'}</div>
    </div>
  `;

  // 3. Try Live Dictionary API with 2.8s strict timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2800);

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        renderDictionaryResult(data[0]);
        return;
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    // Fall through to smart suggestions
  }

  // 4. Fallback when word is not found: Show smart suggestions
  const closestMatches = findDictionaryMatches(cleanWord, 6);

  container.innerHTML = `
    <div class="dict-result-card" style="text-align:center;padding:var(--sp-6);">
      <div style="font-size:2.4rem;margin-bottom:.5rem;">🔍</div>
      <h3 style="margin:0 0 .4rem 0;">${isId ? `Kata "${escapeHtml(cleanWord)}" tidak ditemukan persis` : `Word "${escapeHtml(cleanWord)}" not found`}</h3>
      <p style="color:var(--muted);font-size:.88rem;max-width:55ch;margin:0 auto var(--sp-4);line-height:1.5;">
        ${isId 
          ? 'Periksa kembali ejaan kata tersebut atau coba cari bentuk kata dasarnya (lemma).'
          : 'Please check your spelling or search for the base lemma of the word.'}
      </p>

      ${closestMatches.length ? `
        <div style="margin-top:.75rem;padding:var(--sp-3);background:rgba(14,165,233,0.06);border-radius:var(--r-sm);border:1px dashed rgba(14,165,233,0.25);">
          <div style="font-size:.85rem;font-weight:700;color:var(--sky-bright);margin-bottom:.5rem;">
            💡 ${isId ? 'Apakah maksud Anda salah satu kata berstandar Oxford ini?' : 'Did you mean one of these Oxford standard words?'}
          </div>
          <div class="dict-quick-chips" style="justify-content:center;margin-top:.4rem;">
            ${closestMatches.map(m => `
              <button type="button" class="dict-quick-chip" data-lookup="${escapeHtml(m.word)}">
                ${escapeHtml(m.word)} <span style="opacity:.7;font-size:.7rem;">(${escapeHtml(m.cefr)})</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : `
        <div style="font-size:.85rem;color:var(--sky-bright);">
          <strong>💡 ${isId ? 'Coba cari kata-kata populer ini:' : 'Try searching these popular words:'}</strong>
          <div class="dict-quick-chips" style="justify-content:center;margin-top:.6rem;">
            <button type="button" class="dict-quick-chip" data-lookup="eloquent">eloquent (C1)</button>
            <button type="button" class="dict-quick-chip" data-lookup="serendipity">serendipity (C2)</button>
            <button type="button" class="dict-quick-chip" data-lookup="resilience">resilience (C1)</button>
            <button type="button" class="dict-quick-chip" data-lookup="ubiquitous">ubiquitous (C1)</button>
            <button type="button" class="dict-quick-chip" data-lookup="accomplish">accomplish (B1)</button>
          </div>
        </div>
      `}
    </div>
  `;

  container.querySelectorAll('[data-lookup]').forEach(b => {
    b.addEventListener('click', () => {
      const w = b.dataset.lookup;
      const inp = document.getElementById('dictSearchInput');
      if (inp) inp.value = w;
      searchDictionary(w);
    });
  });
}

function renderDictionaryResult(entry) {
  const container = document.getElementById('dictResultContainer');
  if (!container) return;

  const isId = (state.lang || 'id') === 'id';
  const word = entry.word || '';

  // Extract best phonetic transcription
  let phoneticText = entry.phonetic || '';
  let audioUrl = '';

  if (Array.isArray(entry.phonetics)) {
    for (const p of entry.phonetics) {
      if (!phoneticText && p.text) phoneticText = p.text;
      if (!audioUrl && p.audio && p.audio.endsWith('.mp3')) {
        audioUrl = p.audio;
      }
    }
  }

  // Check if saved in bookmarks
  if (!Array.isArray(state.savedWords)) state.savedWords = [];
  const isSaved = state.savedWords.some(w => (w.word || '').toLowerCase() === word.toLowerCase());

  // Check if in Oxford 3000 / 5000 core list
  let oxfordCefr = entry.cefr || '';
  if (!oxfordCefr) {
    for (const cat of Object.keys(VOCAB)) {
      const found = (VOCAB[cat] || []).find(item => item.w.toLowerCase() === word.toLowerCase());
      if (found && found.cefr) {
        oxfordCefr = found.cefr;
        break;
      }
    }
  }

  const primaryMeaning = entry.meanings?.[0]?.definitions?.[0]?.definition || '';
  const primaryExample = entry.meanings?.[0]?.definitions?.[0]?.example || '';

  const lemmaBannerHtml = entry.queriedLemma ? `
    <div class="dict-lemma-banner">
      <span>💡</span>
      <span>${isId 
        ? `Menampilkan bentuk baku: <strong>${escapeHtml(entry.word)}</strong> (hasil penyesuaian dari pencarian "<em>${escapeHtml(entry.queriedLemma)}</em>")` 
        : `Displaying base lemma: <strong>${escapeHtml(entry.word)}</strong> (matched from "<em>${escapeHtml(entry.queriedLemma)}</em>")`}
      </span>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="dict-result-card">
      ${lemmaBannerHtml}
      <div class="dict-word-head">
        <div class="dict-word-title-group">
          <h2 class="dict-word-h2">${escapeHtml(word)}</h2>
          <div class="dict-word-meta">
            ${phoneticText ? `<span class="dict-phonetic-badge">${escapeHtml(phoneticText)}</span>` : ''}
            <span class="dict-oxford-badge">📖 OED Standard</span>
            ${oxfordCefr ? `<span class="pill active" style="font-size:.7rem;padding:.15rem .5rem;">CEFR ${escapeHtml(oxfordCefr)}</span>` : ''}
          </div>
        </div>

        <div class="dict-actions-group">
          <button type="button" class="dict-audio-btn" id="dictPlayAudioBtn" title="Dengarkan pelafalan asli">
            <span>🔊</span> <span>${isId ? 'Dengarkan' : 'Listen'}</span>
          </button>
          <button type="button" class="dict-save-btn ${isSaved ? 'saved' : ''}" id="dictSaveWordBtn">
            <span>${isSaved ? '⭐' : '☆'}</span>
            <span>${isSaved ? (isId ? 'Tersimpan' : 'Saved') : (isId ? 'Simpan Kata' : 'Save Word')}</span>
          </button>
        </div>
      </div>

      <div class="dict-meanings-list">
        ${(entry.meanings || []).map(m => `
          <div class="dict-pos-section">
            <div class="dict-pos-header">
              <span class="dict-pos-tag">${escapeHtml(m.partOfSpeech || 'definition')}</span>
            </div>
            <ol class="dict-defs-ordered">
              ${(m.definitions || []).slice(0, 4).map(d => `
                <li class="dict-def-item">
                  <div>${escapeHtml(d.definition || '')}</div>
                  ${d.definition_id ? `<div style="font-size:.85rem;color:var(--sky-bright);margin-top:.2rem;">🇮🇩 ${escapeHtml(d.definition_id)}</div>` : ''}
                  ${d.example ? `<div class="dict-example-box">“${escapeHtml(d.example)}”</div>` : ''}
                </li>
              `).join('')}
            </ol>
            ${Array.isArray(m.synonyms) && m.synonyms.length ? `
              <div class="dict-synonyms-box">
                <span style="font-weight:700;color:var(--muted);">${isId ? 'Sinonim:' : 'Synonyms:'}</span>
                ${m.synonyms.slice(0, 6).map(syn => `
                  <button type="button" class="dict-syn-tag" data-lookup="${escapeHtml(syn)}">${escapeHtml(syn)}</button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach audio playback event
  document.getElementById('dictPlayAudioBtn')?.addEventListener('click', () => {
    playWordAudio(word, audioUrl);
  });

  // Attach bookmark save event
  document.getElementById('dictSaveWordBtn')?.addEventListener('click', () => {
    toggleSaveWord({
      word,
      ipa: phoneticText,
      audioUrl,
      meaning: primaryMeaning,
      example: primaryExample,
      cefr: oxfordCefr || 'B1',
      pos: entry.meanings?.[0]?.partOfSpeech || 'noun'
    });
    // Re-render button state
    const nowSaved = state.savedWords.some(w => (w.word || '').toLowerCase() === word.toLowerCase());
    const saveBtn = document.getElementById('dictSaveWordBtn');
    if (saveBtn) {
      saveBtn.className = `dict-save-btn ${nowSaved ? 'saved' : ''}`;
      saveBtn.innerHTML = `<span>${nowSaved ? '⭐' : '☆'}</span> <span>${nowSaved ? (isId ? 'Tersimpan' : 'Saved') : (isId ? 'Simpan Kata' : 'Save Word')}</span>`;
    }
  });

  // Attach synonyms click to quick search
  container.querySelectorAll('.dict-syn-tag[data-lookup]').forEach(tag => {
    tag.addEventListener('click', () => {
      const w = tag.dataset.lookup;
      const inp = document.getElementById('dictSearchInput');
      if (inp) inp.value = w;
      searchDictionary(w);
    });
  });
}

export function playWordAudio(word, audioUrl) {
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          speakBrowserTTS(word);
        });
      }
      return;
    } catch (e) {
      speakBrowserTTS(word);
      return;
    }
  }
  speakBrowserTTS(word);
}

function speakBrowserTTS(word) {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = 'en-US';
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }
}

export function toggleSaveWord(wordItem) {
  if (!Array.isArray(state.savedWords)) state.savedWords = [];
  const isId = (state.lang || 'id') === 'id';
  const targetWord = (wordItem.word || '').toLowerCase();
  const existingIdx = state.savedWords.findIndex(w => (w.word || '').toLowerCase() === targetWord);

  if (existingIdx >= 0) {
    state.savedWords.splice(existingIdx, 1);
    saveState();
    updateSavedWordsCountBadge();
    showToast(isId ? `"${wordItem.word}" dihapus dari kosakata tersimpan` : `"${wordItem.word}" removed from saved words`);
  } else {
    state.savedWords.unshift({
      word: wordItem.word,
      ipa: wordItem.ipa || '',
      audioUrl: wordItem.audioUrl || '',
      meaning: wordItem.meaning || '',
      example: wordItem.example || '',
      cefr: wordItem.cefr || 'B1',
      pos: wordItem.pos || 'noun',
      savedAt: new Date().toISOString()
    });
    saveState();
    updateSavedWordsCountBadge();
    showToast(isId ? `⭐ "${wordItem.word}" disimpan ke Kosakata Saya!` : `⭐ "${wordItem.word}" saved to My Vocabulary!`);
  }
}

export function renderSavedWords() {
  const grid = document.getElementById('savedWordsGrid');
  if (!grid) return;

  const isId = (state.lang || 'id') === 'id';
  const list = state.savedWords || [];

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column:1/-1;text-align:center;padding:var(--sp-6);">
        <div style="font-size:2.5rem;margin-bottom:.5rem;">⭐</div>
        <h4 style="margin:0 0 .4rem 0;">${isId ? 'Belum Ada Kosakata yang Disimpan' : 'No Saved Vocabulary Yet'}</h4>
        <p style="color:var(--muted);font-size:.85rem;max-width:50ch;margin:0 auto var(--sp-4);">
          ${isId 
            ? 'Cari kata di Kamus Oxford dan tekan tombol "⭐ Simpan Kata" untuk membuat daftar hafalan pribadimu.'
            : 'Look up words in the Oxford Dictionary and tap "⭐ Save Word" to build your custom flashcard collection.'}
        </p>
        <button type="button" class="btn btn-primary btn-sm" id="btnGoToDictFromSaved">
          🔍 ${isId ? 'Buka Kamus Oxford' : 'Open Oxford Dictionary'}
        </button>
      </div>
    `;

    document.getElementById('btnGoToDictFromSaved')?.addEventListener('click', () => {
      setVocabMode('dictionary');
    });
    return;
  }

  grid.innerHTML = list.map((item, idx) => `
    <div class="flashcard" data-saved-idx="${idx}">
      <div class="flashcard-inner">
        <div class="flashcard-face flashcard-front">
          <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
            <span class="cefr-pill">CEFR ${escapeHtml(item.cefr || 'B1')}</span>
            <button type="button" class="saved-delete-btn" data-del-word="${escapeHtml(item.word)}" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem;padding:.2rem;" title="Hapus dari simpanan">&times;</button>
          </div>
          <div class="word" style="margin-top:.4rem;">${escapeHtml(item.word)}</div>
          ${item.ipa ? `<div class="ipa">${escapeHtml(item.ipa)}</div>` : ''}
          <div class="pos">${escapeHtml(item.pos || 'word')}</div>
          <div style="display:flex;align-items:center;gap:.5rem;margin-top:.6rem;">
            <button type="button" class="btn btn-ghost btn-sm saved-audio-btn" data-speak-word="${escapeHtml(item.word)}" data-speak-audio="${escapeHtml(item.audioUrl || '')}" style="font-size:.78rem;padding:.25rem .6rem;">
              🔊 Dengarkan
            </button>
          </div>
          <div style="font-size:.72rem;color:var(--sky-bright);margin-top:.4rem;opacity:.9;">
            ${isId ? '↻ Klik kartu untuk membalik' : '↻ Tap to flip card'}
          </div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-bottom:.2rem;">
            ${isId ? 'Definisi:' : 'Definition:'}
          </div>
          <div class="mean">${escapeHtml(item.meaning || '-')}</div>
          ${item.example ? `
            <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-top:.4rem;margin-bottom:.15rem;">
              ${isId ? 'Contoh Penggunaan:' : 'Example Sentence:'}
            </div>
            <div class="ex">${escapeHtml(item.example)}</div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.saved-delete-btn') || e.target.closest('.saved-audio-btn')) return;
      card.classList.toggle('flipped');
    });
  });

  grid.querySelectorAll('.saved-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const word = btn.dataset.delWord;
      toggleSaveWord({ word });
      renderSavedWords();
    });
  });

  grid.querySelectorAll('.saved-audio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playWordAudio(btn.dataset.speakWord, btn.dataset.speakAudio);
    });
  });
}

function prepareQuestion(orig) {
  const q = { ...orig };
  // Clone options and shuffle them so answer position is randomized
  const indexedOptions = q.options.map((opt, idx) => ({ opt, isCorrect: idx === q.answer }));
  indexedOptions.sort(() => Math.random() - 0.5);
  q.options = indexedOptions.map(o => o.opt);
  q.answer = indexedOptions.findIndex(o => o.isCorrect);
  return q;
}

function getPoolForCategoryAndDifficulty(topic, difficulty) {
  if (topic === 'mixed') {
    return Object.keys(BANK).flatMap(key =>
      (BANK[key][difficulty] || BANK[key].intermediate || []).map(q => ({ ...q, topic: key, difficulty }))
    );
  }
  const topicBank = BANK[topic] || BANK.tenses;
  const list = topicBank[difficulty] || topicBank.intermediate || [];
  return list.map(q => ({ ...q, topic, difficulty }));
}

export function syncDifficultyChipsUI(difficulty) {
  document.querySelectorAll('#quizDifficultyChips [data-diff]').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.diff === difficulty);
  });
}

function formatDiffName(diff, lang = state.lang) {
  if (lang === 'id') {
    return diff === 'beginner' ? 'Pemula' : diff === 'advanced' ? 'Mahir' : 'Menengah';
  }
  return capitalize(diff);
}


// ====================================================
// PROCEDURAL DYNAMIC QUESTION GENERATORS (MERGED)
// ====================================================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function makeQ(q, options, correctIdx, explainEn, explainId, category, difficulty) {
  const seed = `${q}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const id = `dyn-${category.slice(0, 3)}-${difficulty.slice(0, 3)}-${seed.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 40)}`;
  return {
    id,
    q,
    options,
    answer: correctIdx,
    explain: explainEn,
    explain_id: explainId,
    topic: category,
    difficulty,
    isDynamicallyGenerated: true
  };
}

// ----------------------------------------------------
// TENSES GENERATOR
// ----------------------------------------------------
const NAMES = ['Sarah', 'David', 'Maya', 'Kenji', 'Elena', 'Marcus', 'Amina', 'Lucas', 'Priya', 'Liam', 'Zack', 'Nadia'];
const PLURAL_SUBJECTS = ['The researchers', 'Our engineering team members', 'The university students', 'The local residents', 'The musicians', 'The project supervisors', 'The pilots'];
const PLACES = ['in Singapore', 'in London', 'at the central hospital', 'at the international research lab', 'in Melbourne', 'in downtown Chicago', 'at the tech campus'];

export function generateDynamicTenseQuestion(difficulty = 'intermediate') {
  const name = pick(NAMES);
  const plural = pick(PLURAL_SUBJECTS);
  const place = pick(PLACES);

  if (difficulty === 'beginner') {
    const templates = [
      // Present Simple vs Continuous
      () => {
        const verbData = pick([
          { base: 'prepare', s: 'prepares', ing: 'is preparing', ed: 'prepared', habit: 'breakfast every morning at 7 AM', now: 'her breakfast in the kitchen right now' },
          { base: 'read', s: 'reads', ing: 'is reading', ed: 'read', habit: 'the morning newspapers every Sunday', now: 'an inspiring novel in the lounge right now' },
          { base: 'check', s: 'checks', ing: 'is checking', ed: 'checked', habit: 'his work inbox every weekday', now: 'the passenger manifest right now' },
          { base: 'practice', s: 'practices', ing: 'is practicing', ed: 'practiced', habit: 'English pronunciation every evening', now: 'her presentation slides right now' }
        ]);
        const isHabit = Math.random() > 0.5;
        if (isHabit) {
          const q = `${name} ____ ${verbData.habit}.`;
          const opts = shuffle([verbData.s, verbData.base, verbData.ing, verbData.ed]);
          return makeQ(
            q, opts, opts.indexOf(verbData.s),
            `Routine actions or habitual facts with a singular third-person subject (${name}) require Present Simple with -s/-es ("${verbData.s}").`,
            `Kebiasaan rutin dengan subjek orang ketiga tunggal (${name}) menggunakan Present Simple berakhiran -s/-es: "${verbData.s}".`,
            'tenses', 'beginner'
          );
        } else {
          const q = `Look! ${name} ____ ${verbData.now}.`;
          const opts = shuffle([verbData.ing, verbData.s, verbData.base, verbData.ed]);
          return makeQ(
            q, opts, opts.indexOf(verbData.ing),
            `An action in progress right now indicated by "Look!" takes Present Continuous (is/are + V-ing: "${verbData.ing}").`,
            `Peristiwa yang sedang berlangsung saat ini ditandai seruan "Look!" menggunakan Present Continuous: "${verbData.ing}".`,
            'tenses', 'beginner'
          );
        }
      },
      // Past Simple finished time
      () => {
        const item = pick([
          { v1: 'visit', v2: 'visited', ing: 'visiting', s: 'visits', time: 'yesterday afternoon', obj: 'the national museum' },
          { v1: 'complete', v2: 'completed', ing: 'completing', s: 'completes', time: 'last night', obj: 'the application form' },
          { v1: 'buy', v2: 'bought', ing: 'buying', s: 'buys', time: 'two days ago', obj: 'a new laptop for work' },
          { v1: 'send', v2: 'sent', ing: 'sending', s: 'sends', time: 'last Friday', obj: 'an urgent package to Jakarta' },
          { v1: 'meet', v2: 'met', ing: 'meeting', s: 'meets', time: 'yesterday morning', obj: 'the client at the coffee shop' }
        ]);
        const q = `${name} ____ ${item.obj} ${item.time}.`;
        const opts = shuffle([item.v2, item.v1, item.ing, item.s]);
        return makeQ(
          q, opts, opts.indexOf(item.v2),
          `Specific completed time in the past ("${item.time}") strictly requires Past Simple: "${item.v2}".`,
          `Keterangan waktu lampau yang sudah tuntas ("${item.time}") mengharuskan penggunaan Past Simple (V2): "${item.v2}".`,
          'tenses', 'beginner'
        );
      },
      // Future with will
      () => {
        const item = pick([
          { base: 'travel', phrase: `to Japan next month for holiday` },
          { base: 'start', phrase: `a new internship next Monday morning` },
          { base: 'join', phrase: `the English conversation club next weekend` },
          { base: 'attend', phrase: `the international seminar tomorrow afternoon` }
        ]);
        const q = `${name} ____ ${item.base} ${item.phrase}.`;
        const opts = shuffle(['will', 'is', 'was', 'has']);
        return makeQ(
          q, opts, opts.indexOf('will'),
          `Modal auxiliary "will" followed by bare infinitive ("will ${item.base}") indicates a definite future action or commitment.`,
          `Kata kerja bantu modal "will" diikuti kata kerja dasar ("will ${item.base}") menyatakan kepastian atau rencana di masa depan.`,
          'tenses', 'beginner'
        );
      }
    ];
    return pick(templates)();
  }

  if (difficulty === 'intermediate') {
    const templates = [
      // Present Perfect Continuous with for / since
      () => {
        const years = pick(['three', 'four', 'five', 'seven']);
        const startYear = pick(['2019', '2020', '2021', '2022']);
        const useSince = Math.random() > 0.5;
        const timeClause = useSince ? `since ${startYear}` : `for ${years} consecutive years`;
        const q = `${name} ____ ${place} ${timeClause}.`;
        const correct = 'has been working';
        const opts = shuffle([correct, 'worked', 'is working', 'will work']);
        return makeQ(
          q, opts, opts.indexOf(correct),
          `An ongoing activity that started in the past and continues into the present with "${timeClause}" requires Present Perfect Continuous ("has been working").`,
          `Kegiatan yang dimulai sejak masa lalu dan masih terus berjalan hingga sekarang dengan "${timeClause}" menggunakan Present Perfect Continuous: "has been working".`,
          'tenses', 'intermediate'
        );
      },
      // Past Perfect sequence
      () => {
        const context = pick([
          { act1: 'had already boarded', act2: 'arrived at the boarding gate', wrong: ['boarded', 'has boarded', 'was boarding'] },
          { act1: 'had already submitted', act2: 'received the deadline extension notification', wrong: ['submitted', 'has submitted', 'is submitting'] },
          { act1: 'had finished', act2: 'sat down to enjoy dinner', wrong: ['has finished', 'finished', 'was finishing'] },
          { act1: 'had already concluded', act2: 'walked into the conference hall', wrong: ['concluded', 'has concluded', 'was concluding'] }
        ]);
        const q = `By the time ${name} ${context.act2}, the team ____ the task.`;
        const correct = context.act1;
        const opts = shuffle([correct, ...context.wrong]);
        return makeQ(
          q, opts, opts.indexOf(correct),
          `Past Perfect ("${correct}") designates an action completed prior to another past event ("${context.act2}").`,
          `Past Perfect ("${correct}") digunakan untuk aksi yang telah terjadi dan selesai terlebih dahulu sebelum kejadian lampau lainnya.`,
          'tenses', 'intermediate'
        );
      },
      // Future Continuous at specific future time
      () => {
        const timeMarker = pick(['This time tomorrow', 'At 10:00 AM next Friday', 'This time next week', 'Around 3 PM tomorrow']);
        const action = pick([
          { correct: 'will be flying', wrong: ['will fly', 'flies', 'flew'], phrase: 'over the Pacific Ocean' },
          { correct: 'will be presenting', wrong: ['presents', 'presented', 'has presented'], phrase: 'the quarterly financial results' },
          { correct: 'will be taking', wrong: ['takes', 'took', 'will have taken'], phrase: 'her final TOEFL examination' }
        ]);
        const q = `${timeMarker}, ${name} ____ ${action.phrase}.`;
        const opts = shuffle([action.correct, ...action.wrong]);
        return makeQ(
          q, opts, opts.indexOf(action.correct),
          `Future Continuous ("${action.correct}") describes an ongoing activity that will be actively in progress at a specific moment in the future ("${timeMarker}").`,
          `Future Continuous ("${action.correct}") menggambarkan aktivitas yang sedang berlangsung tepat pada titik waktu tertentu di masa depan ("${timeMarker}").`,
          'tenses', 'intermediate'
        );
      },
      // Past Continuous interrupted by Past Simple
      () => {
        const item = pick([
          { long: 'was cycling', short: 'a heavy rain shower suddenly began' },
          { long: 'was giving', short: 'a sudden power outage interrupted the session' },
          { long: 'was writing', short: 'an urgent phone call distracted him' },
          { long: 'was reviewing', short: 'the supervisor entered the office' }
        ]);
        const q = `While ${name} ____ the files, ${item.short}.`;
        const opts = shuffle([item.long, 'cycled', 'has cycled', 'is cycling'].map(x => x === 'cycled' ? 'reviewed' : x === 'has cycled' ? 'has reviewed' : x === 'is cycling' ? 'is reviewing' : item.long));
        return makeQ(
          q, opts, opts.indexOf(item.long),
          `Past Continuous ("${item.long}") sets the longer background scene that was underway when a shorter event intervened.`,
          `Past Continuous ("${item.long}") menyatakan aksi berdurasi sedang berlangsung saat disela peristiwa lain di masa lampau.`,
          'tenses', 'intermediate'
        );
      }
    ];
    return pick(templates)();
  }

  // Advanced: Inversion, Future Perfect, Conditionals
  const advancedTemplates = [
    () => {
      const adverb = pick(['Hardly', 'Scarcely', 'Barely']);
      const q = `${adverb} ____ the signed contract when the client revised the terms.`;
      const correct = 'had they delivered';
      const opts = shuffle([correct, 'they had delivered', 'they delivered', 'did they deliver']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Negative adverbials like "${adverb}" at the clause onset mandate subject-auxiliary inversion: "${correct}".`,
        `Kata keterangan negatif seperti "${adverb}" di awal kalimat memicu inversi (kata bantu mendahului subjek): "${correct}".`,
        'tenses', 'advanced'
      );
    },
    () => {
      const year = pick(['2030', 'next decade', 'next December']);
      const yearsElapsed = pick(['twenty', 'fifteen', 'twelve']);
      const q = `By ${year}, ${name} ____ at this institution for over ${yearsElapsed} years.`;
      const correct = 'will have been working';
      const opts = shuffle([correct, 'will work', 'is working', 'will be worked']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Future Perfect Continuous ("${correct}") computes total accumulated duration leading directly up to a designated future benchmark ("By ${year}").`,
        `Future Perfect Continuous ("${correct}") menghitung akumulasi total durasi masa kerja hingga titik waktu tertentu di masa depan.`,
        'tenses', 'advanced'
      );
    },
    () => {
      const q = `Had ${name} ____ about the unexpected travel disruption, she would have rescheduled her morning interview.`;
      const correct = 'known';
      const opts = shuffle(['known', 'knew', 'knows', 'been knowing']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Third conditional inversion without "if" utilizes the structure "Had + subject + past participle (V3)": "Had ${name} known".`,
        `Inversi pengandaian tipe 3 tanpa kata "if" menggunakan rumus "Had + subjek + V3": "Had ${name} known".`,
        'tenses', 'advanced'
      );
    },
    () => {
      const adverb = pick(['Seldom', 'Rarely', 'Never before']);
      const q = `${adverb} ____ such flawless collaboration among competing corporate departments.`;
      const correct = 'have we observed';
      const opts = shuffle([correct, 'we have observed', 'we observed', 'had observed we']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Initial limiting adverbials such as "${adverb}" force subject-auxiliary inversion: "${correct}".`,
        `Kata keterangan pembatas frekuensi di awal kalimat ("${adverb}") memicu pola pembalikan struktur kalimat (inversi): "${correct}".`,
        'tenses', 'advanced'
      );
    }
  ];
  return pick(advancedTemplates)();
}

// ----------------------------------------------------
// TO BE & PASSIVE VOICE GENERATOR
// ----------------------------------------------------
export function generateDynamicToBeQuestion(difficulty = 'intermediate') {
  const name = pick(NAMES);
  const plural = pick(PLURAL_SUBJECTS);

  if (difficulty === 'beginner') {
    const templates = [
      () => {
        const noun = pick(['The laptop battery', 'The coffee cup', 'The conference badge', 'My passport']);
        const q = `${noun} ____ on the reception desk right now.`;
        const opts = shuffle(['is', 'are', 'am', 'be']);
        return makeQ(
          q, opts, opts.indexOf('is'),
          `Singular third-person subject ("${noun}") pairs with present "is".`,
          `Subjek tunggal ("${noun}") dalam Present Tense selalu berpasangan dengan to be "is".`,
          'tobe', 'beginner'
        );
      },
      () => {
        const q = `${plural} ____ very satisfied with the workshop results yesterday.`;
        const opts = shuffle(['were', 'was', 'are', 'is']);
        return makeQ(
          q, opts, opts.indexOf('were'),
          `Plural subjects in the past require "were": "${plural} were".`,
          `Subjek jamak di masa lampau ("yesterday") memerlukan to be "were".`,
          'tobe', 'beginner'
        );
      },
      () => {
        const q = `____ you and your colleagues ready for the product demonstration?`;
        const opts = shuffle(['Are', 'Is', 'Am', 'Was']);
        return makeQ(
          q, opts, opts.indexOf('Are'),
          `Compound subject ("you and your colleagues") is plural and addressed in the present, taking "Are".`,
          `Subjek gabungan jamak ("you and your colleagues") di waktu sekarang menggunakan to be "Are".`,
          'tobe', 'beginner'
        );
      },
      () => {
        const time = pick(['yesterday', 'last Sunday', 'two days ago']);
        const q = `The weather ____ unusually pleasant during our trip ${time}.`;
        const opts = shuffle(['was', 'were', 'is', 'are']);
        return makeQ(
          q, opts, opts.indexOf('was'),
          `Uncountable/singular noun "weather" in the past takes "was".`,
          `Kata benda tunggal "weather" dengan keterangan masa lampau menggunakan "was".`,
          'tobe', 'beginner'
        );
      }
    ];
    return pick(templates)();
  }

  if (difficulty === 'intermediate') {
    const templates = [
      // Passive voice in past
      () => {
        const doc = pick(['The confidentiality agreements', 'The financial balance sheets', 'The design blueprints', 'The survey questionnaires']);
        const verb = pick(['approved', 'circulated', 'reviewed', 'dispatched']);
        const q = `${doc} ____ by the executive committee last Wednesday.`;
        const opts = shuffle(['were ' + verb, 'was ' + verb, 'are ' + verb, 'have ' + verb]);
        const correct = 'were ' + verb;
        return makeQ(
          q, opts, opts.indexOf(correct),
          `Past passive with plural noun ("${doc}") requires "were + V3": "${correct}".`,
          `Kalimat pasif lampau untuk subjek jamak ("${doc}") menggunakan rumus "were + V3": "${correct}".`,
          'tobe', 'intermediate'
        );
      },
      // Uncountable noun existential there is / was
      () => {
        const noun = pick(['confidential information', 'fresh drinking water', 'valuable feedback', 'sufficient funding']);
        const q = `____ there any ${noun} remaining after the budget audit?`;
        const opts = shuffle(['Was', 'Were', 'Are', 'Have']);
        return makeQ(
          q, opts, opts.indexOf('Was'),
          `Uncountable nouns like "${noun}" take singular agreement ("Was there").`,
          `Kata benda tak dapat dihitung ("${noun}") selalu berpasangan dengan bentuk tunggal: "Was there".`,
          'tobe', 'intermediate'
        );
      },
      // Continuous passive
      () => {
        const facility = pick(['A modern high-speed railway', 'A state-of-the-art laboratory', 'A new community health clinic']);
        const q = `${facility} is currently ____ constructed in the eastern district.`;
        const opts = shuffle(['being', 'been', 'be', 'to be']);
        return makeQ(
          q, opts, opts.indexOf('being'),
          `Present Continuous passive voice formula is "is/are being + past participle (V3)": "is currently being constructed".`,
          `Rumus kalimat pasif sedang berlangsung (Present Continuous Passive) adalah "is/are being + V3": "being constructed".`,
          'tobe', 'intermediate'
        );
      },
      // Tag questions with to be
      () => {
        const q = `${name} and Maya are presenting the keynote speech, ____ they?`;
        const opts = shuffle(["aren't", "isn't", "don't", "won't"]);
        return makeQ(
          q, opts, opts.indexOf("aren't"),
          `Positive statement with "are" takes negative tag "aren't they?".`,
          `Pernyataan positif dengan to be "are" berpasangan dengan question tag negatif "aren't they?".`,
          'tobe', 'intermediate'
        );
      }
    ];
    return pick(templates)();
  }

  // Advanced to be
  const advancedTemplates = [
    () => {
      const q = `The missing archaeological artifacts were reported to ____ stolen from the vault decades ago.`;
      const correct = 'have been';
      const opts = shuffle([correct, 'be', 'being', 'having been']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Perfect passive infinitive "to have been + V3" designates an action that took place prior to the act of reporting.`,
        `Infinitive pasif sempurna ("to have been + V3") menunjukkan peristiwa pencurian terjadi jauh sebelum waktu pelaporan.`,
        'tobe', 'advanced'
      );
    },
    () => {
      const q = `Far from ____ intimidated by the stern cross-examination, the witness remained composed.`;
      const correct = 'being';
      const opts = shuffle([correct, 'been', 'be', 'to be']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `The prepositional phrase "Far from" mandates a gerund passive form: "being + past participle".`,
        `Setelah frasa preposisi "Far from", gunakan bentuk gerund pasif: "being intimidated".`,
        'tobe', 'advanced'
      );
    },
    () => {
      const q = `Were the board of directors ____ the merger, hundreds of jobs would be preserved.`;
      const correct = 'to endorse';
      const opts = shuffle([correct, 'endorsed', 'endorsing', 'be endorse']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Formal hypothetical inversion with "Were" uses "Were [subject] to [bare verb]": "Were the board to endorse".`,
        `Pola inversi pengandaian formal menggunakan "Were [subjek] to [verb]": "Were the board to endorse".`,
        'tobe', 'advanced'
      );
    }
  ];
  return pick(advancedTemplates)();
}

// ----------------------------------------------------
// GRAMMAR & SYNTAX GENERATOR
// ----------------------------------------------------
export function generateDynamicGrammarQuestion(difficulty = 'intermediate') {
  const name = pick(NAMES);

  if (difficulty === 'beginner') {
    const templates = [
      // Articles a vs an
      () => {
        const item = pick([
          { vowel: true, word: 'umbrella', art: 'an' },
          { vowel: true, word: 'honest mistake', art: 'an' },
          { vowel: true, word: 'urgent email', art: 'an' },
          { vowel: true, word: 'extraordinary opportunity', art: 'an' },
          { vowel: false, word: 'university degree', art: 'a' },
          { vowel: false, word: 'European city', art: 'a' },
          { vowel: false, word: 'useful guide', art: 'a' },
          { vowel: false, word: 'smartphone application', art: 'a' }
        ]);
        const q = `${name} found ____ ${item.word} during her research.`;
        const opts = shuffle(['a', 'an', 'the', 'some']);
        return makeQ(
          q, opts, opts.indexOf(item.art),
          `The indefinite article "${item.art}" is determined by the phonetic sound following it: "${item.art} ${item.word}".`,
          `Pemilihan artikel "${item.art}" ditentukan oleh bunyi fonetik vokal/konsonan di depannya: "${item.art} ${item.word}".`,
          'grammar', 'beginner'
        );
      },
      // Prepositions of time: at / on / in
      () => {
        const timeItem = pick([
          { prep: 'on', phrase: 'Friday morning' },
          { prep: 'on', phrase: 'July 15th' },
          { prep: 'at', phrase: 'half past three' },
          { prep: 'at', phrase: 'midnight' },
          { prep: 'in', phrase: 'October' },
          { prep: 'in', phrase: 'the late afternoon' }
        ]);
        const q = `The team scheduled the project kickoff ____ ${timeItem.phrase}.`;
        const opts = shuffle(['on', 'at', 'in', 'by']);
        return makeQ(
          q, opts, opts.indexOf(timeItem.prep),
          `Correct preposition of time: use "${timeItem.prep}" with "${timeItem.phrase}".`,
          `Preposisi waktu yang baku: gunakan "${timeItem.prep}" untuk "${timeItem.phrase}".`,
          'grammar', 'beginner'
        );
      },
      // Irregular plural nouns
      () => {
        const irregular = pick([
          { sing: 'child', plural: 'children', dist: ['childs', 'childrens', 'childes'] },
          { sing: 'person', plural: 'people', dist: ['persons', 'peoples', 'persones'] },
          { sing: 'foot', plural: 'feet', dist: ['foots', 'feets', 'footies'] },
          { sing: 'tooth', plural: 'teeth', dist: ['tooths', 'teeths', 'toothen'] }
        ]);
        const q = `There were several ____ waiting patiently in the reception area.`;
        const opts = shuffle([irregular.plural, ...irregular.dist]);
        return makeQ(
          q, opts, opts.indexOf(irregular.plural),
          `The irregular plural form of "${irregular.sing}" is "${irregular.plural}".`,
          `Bentuk jamak tidak beraturan (irregular plural) dari "${irregular.sing}" adalah "${irregular.plural}".`,
          'grammar', 'beginner'
        );
      }
    ];
    return pick(templates)();
  }

  if (difficulty === 'intermediate') {
    const templates = [
      // Second conditional: If I were
      () => {
        const q = `If ${name} ____ more flexible working hours, she would pursue a master's degree.`;
        const correct = 'had';
        const opts = shuffle([correct, 'has', 'will have', 'would have']);
        return makeQ(
          q, opts, opts.indexOf(correct),
          `Second conditional (hypothetical present/future) employs Past Simple in the if-clause: "If ${name} had... she would pursue".`,
          `Second Conditional (situasi pengandaian saat ini) menggunakan Past Simple di anak kalimat if: "If ${name} had...".`,
          'grammar', 'intermediate'
        );
      },
      // Relative pronouns who vs whose vs which
      () => {
        const q = `The senior architect ____ designed the eco-friendly stadium received a national award.`;
        const correct = 'who';
        const opts = shuffle([correct, 'which', 'whose', 'whom']);
        return makeQ(
          q, opts, opts.indexOf(correct),
          `Use the relative pronoun "who" when referencing a person acting as the subject of the clause.`,
          `Gunakan kata ganti relatif "who" untuk merujuk pada orang yang berkedudukan sebagai subjek kalimat.`,
          'grammar', 'intermediate'
        );
      },
      // Gerund after verb (avoid, suggest, consider, enjoy)
      () => {
        const verbData = pick([
          { verb: 'avoided', gerund: 'taking', base: 'take' },
          { verb: 'considered', gerund: 'accepting', base: 'accept' },
          { verb: 'postponed', gerund: 'signing', base: 'sign' },
          { verb: 'recommended', gerund: 'hiring', base: 'hire' }
        ]);
        const q = `The committee ${verbData.verb} ____ any hasty decisions without prior review.`;
        const opts = shuffle([verbData.gerund, 'to ' + verbData.base, verbData.base, 'to be ' + verbData.gerund]);
        return makeQ(
          q, opts, opts.indexOf(verbData.gerund),
          `The verb "${verbData.verb}" is idiomatic when paired directly with a gerund (-ing form): "${verbData.gerund}".`,
          `Kata kerja "${verbData.verb}" selalu berpasangan dengan bentuk gerund (V-ing): "${verbData.gerund}".`,
          'grammar', 'intermediate'
        );
      },
      // Much vs Many with uncountable vs countable
      () => {
        const item = pick([
          { word: 'confidential feedback', quantifier: 'much', wrong: 'many' },
          { word: 'actionable suggestions', quantifier: 'many', wrong: 'much' },
          { word: 'valuable advice', quantifier: 'much', wrong: 'many' },
          { word: 'scientific articles', quantifier: 'many', wrong: 'much' }
        ]);
        const q = `The team did not receive ____ ${item.word} during the initial briefing.`;
        const opts = shuffle([item.quantifier, item.wrong, 'a few', 'several']);
        return makeQ(
          q, opts, opts.indexOf(item.quantifier),
          `"${item.word}" pairs with "${item.quantifier}" in negative clauses.`,
          `Frasa "${item.word}" berpasangan dengan penentu kuantitas "${item.quantifier}".`,
          'grammar', 'intermediate'
        );
      }
    ];
    return pick(templates)();
  }

  // Advanced grammar
  const advancedTemplates = [
    // Subjunctive mood
    () => {
      const boss = pick(['The regulatory authority', 'The lead auditor', 'The judge', 'The medical board']);
      const verb = pick(['insisted', 'demanded', 'recommended', 'mandated']);
      const action = pick([
        { base: 'disclose', wrong: ['discloses', 'disclosed', 'is disclosing'], text: 'all financial records immediately' },
        { base: 'attend', wrong: ['attends', 'attended', 'will attend'], text: 'the mandatory compliance hearing' },
        { base: 'halt', wrong: ['halts', 'halted', 'is halting'], text: 'all unregulated trial activities' }
      ]);
      const q = `${boss} ${verb} that the organization ____ ${action.text}.`;
      const opts = shuffle([action.base, ...action.wrong]);
      return makeQ(
        q, opts, opts.indexOf(action.base),
        `The English subjunctive mood in that-clauses following verbs of urgency/demand mandates the base form of the verb ("${action.base}").`,
        `Subjunctive mood dalam klausa that setelah kata kerja perintah/tuntutan mengharuskan kata kerja dasar tanpa imbuhan: "${action.base}".`,
        'grammar', 'advanced'
      );
    },
    // Correlative inversion: Not only did...
    () => {
      const q = `Not only ____ the international debate trophy, but she also secured a prestigious research scholarship.`;
      const correct = 'did Maya win';
      const opts = shuffle([correct, 'Maya won', 'has Maya win', 'Maya did win']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Correlative conjunction "Not only" at the start of a main clause mandates inversion: auxiliary "did" + subject + base verb.`,
        `Frasa "Not only" di awal kalimat mengharuskan pola inversi: kata bantu "did" + subjek + kata kerja dasar.`,
        'grammar', 'advanced'
      );
    },
    // Cleft sentence: It was not until... that
    () => {
      const q = `It was not until the statistical audit concluded ____ the true discrepancies surfaced.`;
      const correct = 'that';
      const opts = shuffle([correct, 'when', 'which', 'where']);
      return makeQ(
        q, opts, opts.indexOf(correct),
        `Standard cleft sentence structure: "It was not until [time clause] that [main clause]".`,
        `Pola kalimat cleft baku: "It was not until [waktu/kejadian] that [klausa utama]".`,
        'grammar', 'advanced'
      );
    }
  ];
  return pick(advancedTemplates)();
}

// ----------------------------------------------------
// VOCABULARY GENERATOR (PULLS FROM 370 OXFORD WORDS)
// ----------------------------------------------------
export function generateDynamicVocabularyQuestion(difficulty = 'intermediate') {
  // Filter vocab by CEFR or level
  const allVocabEntries = Object.entries(VOCAB).flatMap(([cat, list]) =>
    list.map(item => ({ ...item, categoryName: cat }))
  );

  let targetList = [];
  if (difficulty === 'beginner') {
    targetList = allVocabEntries.filter(v => v.cefr === 'A1' || v.cefr === 'A2' || v.cefr === 'B1');
  } else if (difficulty === 'advanced') {
    targetList = allVocabEntries.filter(v => v.cefr === 'C1' || v.cefr === 'C2' || v.cefr === 'B2');
  } else {
    targetList = allVocabEntries.filter(v => v.cefr === 'B1' || v.cefr === 'B2');
  }
  if (!targetList.length) targetList = allVocabEntries;

  // Pick target word
  const target = pick(targetList);

  // Pick 3 plausible distractors with same part of speech or same category
  const samePos = allVocabEntries.filter(v => v.w !== target.w && v.p === target.p);
  const pool = samePos.length >= 3 ? samePos : allVocabEntries.filter(v => v.w !== target.w);
  const shuffledPool = shuffle(pool);
  const distractors = shuffledPool.slice(0, 3).map(d => d.w);

  // Mask the word in its example sentence or construct an in-context sentence
  let sentence = target.e;
  const regex = new RegExp(`\\b${target.w}\\b`, 'gi');
  let blanked = sentence.replace(regex, '____');

  // If the word has inflection like -ed, -s, -ing in the sentence, mask that as well
  if (!blanked.includes('____')) {
    const stem = target.w.slice(0, Math.max(3, target.w.length - 2));
    const stemRegex = new RegExp(`\\b${stem}[a-z]*\\b`, 'gi');
    blanked = sentence.replace(stemRegex, '____');
  }

  // Fallback sentence if masking didn't happen cleanly
  if (!blanked.includes('____')) {
    blanked = `The concept of "____" is defined as: ${target.m}.`;
  }

  const options = shuffle([target.w, ...distractors]);
  const correctIdx = options.indexOf(target.w);

  const explainEn = `"${target.w}" (${target.p}, CEFR ${target.cefr}) means: ${target.m}. Example: "${target.e}".`;
  const explainId = `"${target.w}" (${target.p}, CEFR ${target.cefr}) bermakna: ${target.m_id || target.m}. Contoh kalimat: "${target.e}".`;

  return makeQ(
    blanked,
    options,
    correctIdx,
    explainEn,
    explainId,
    'vocabulary',
    difficulty
  );
}

// ----------------------------------------------------
// UNIFIED MASTER DYNAMIC QUESTION GENERATOR
// ----------------------------------------------------
export function generateFreshQuestion(topic = 'mixed', difficulty = 'intermediate') {
  if (topic === 'tenses') {
    return generateDynamicTenseQuestion(difficulty);
  }
  if (topic === 'tobe') {
    return generateDynamicToBeQuestion(difficulty);
  }
  if (topic === 'grammar') {
    return generateDynamicGrammarQuestion(difficulty);
  }
  if (topic === 'vocabulary') {
    return generateDynamicVocabularyQuestion(difficulty);
  }
  // Mixed: randomly choose one of the domains
  const chosenDomain = pick(['tenses', 'tobe', 'grammar', 'vocabulary']);
  return generateFreshQuestion(chosenDomain, difficulty);
}

export function generateFreshQuizSet(topic = 'mixed', difficulty = 'intermediate', count = 5) {
  const list = [];
  const generatedSignatures = new Set();
  let attempts = 0;

  while (list.length < count && attempts < count * 8) {
    attempts++;
    const q = generateFreshQuestion(topic, difficulty);
    const signature = q.q.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!generatedSignatures.has(signature)) {
      generatedSignatures.add(signature);
      list.push(q);
    }
  }

  return list;
}


export function getAdaptiveQuestionSet(topic = 'mixed', difficulty = 'intermediate', count = 5, recentIds = []) {
  // 1. Get base pool for requested topic and difficulty
  const basePool = getPoolForCategoryAndDifficulty(topic, difficulty);

  // 2. Filter out questions seen recently to avoid immediate repetition
  let freshPool = basePool.filter(q => !recentIds.includes(q.id));

  // 3. Procedural dynamic generation: always generate fresh, unique questions
  // to ensure questions never run out and every quiz refresh offers truly new questions!
  const targetDynamicCount = Math.max(count - freshPool.length, Math.ceil(count / 2));
  const dynamicGenerated = generateFreshQuizSet(topic, difficulty, targetDynamicCount);

  // Merge newly generated questions with available unrepeated base pool items
  let combinedCandidates = [...freshPool, ...dynamicGenerated];
  combinedCandidates.sort(() => Math.random() - 0.5);

  // 4. If still not enough, generate additional dynamic questions on-the-fly
  while (combinedCandidates.length < count) {
    const extraQ = generateFreshQuestion(topic, difficulty);
    combinedCandidates.push(extraQ);
  }

  // 5. Integrate a targeted reinforcement question if the user has an unmastered mistake
  let reinforcementQ = null;
  if (state.reviewQuestions && state.reviewQuestions.length > 0) {
    const unmastered = state.reviewQuestions.filter(rq =>
      !rq.mastered &&
      !recentIds.includes(rq.id) &&
      (topic === 'mixed' || rq.topic === topic)
    );
    if (unmastered.length > 0) {
      reinforcementQ = unmastered[Math.floor(Math.random() * unmastered.length)];
    }
  }

  // Shuffle candidate pool
  combinedCandidates.sort(() => Math.random() - 0.5);

  const selected = combinedCandidates.slice(0, count);

  // If we have a reinforcement question, replace the last item
  if (reinforcementQ && !selected.some(q => q.id === reinforcementQ.id) && selected.length > 0) {
    selected[selected.length - 1] = { ...reinforcementQ, isReinforcement: true };
  }

  return selected.map(prepareQuestion);
}

export function startQuiz(adaptiveOptions = {}) {
  // Check if this round was triggered by "Try Another Quiz" with adaptive performance feedback
  if (adaptiveOptions.isAdaptiveNext && adaptiveOptions.previousScore !== undefined) {
    const prevScore = adaptiveOptions.previousScore;
    const currentDiff = state.selectedDifficulty || 'intermediate';
    let nextDiff = currentDiff;

    if (prevScore >= 80) {
      if (currentDiff === 'beginner') {
        nextDiff = 'intermediate';
      } else if (currentDiff === 'intermediate') {
        if (isGuestUser()) {
          nextDiff = 'intermediate';
        } else {
          nextDiff = 'advanced';
        }
      }

      state.selectedDifficulty = nextDiff;
      if (isGuestUser() && currentDiff === 'intermediate') {
        state.adaptiveNotice = {
          type: 'levelup',
          msg_en: `🎯 Mastered Intermediate (${prevScore}%)! Create a free account to unlock Advanced level.`,
          msg_id: `🎯 Hebat! Menguasai Intermediate (${prevScore}%)! Daftar akun gratis untuk membuka tingkat Advanced.`
        };
      } else {
        state.adaptiveNotice = {
          type: 'levelup',
          msg_en: `🎯 Level Up! You scored ${prevScore}%! Difficulty auto-adapted to ${capitalize(nextDiff)}.`,
          msg_id: `🎯 Naik Tingkat! Anda meraih ${prevScore}%! Kesulitan otomatis disesuaikan ke ${formatDiffName(nextDiff, 'id')}.`
        };
      }
    } else if (prevScore < 50) {
      if (currentDiff === 'advanced') nextDiff = 'intermediate';
      else if (currentDiff === 'intermediate') nextDiff = 'beginner';

      state.selectedDifficulty = nextDiff;
      state.adaptiveNotice = {
        type: 'support',
        msg_en: `💡 Adaptive Support: Reinforcing core concepts at ${capitalize(nextDiff)} level.`,
        msg_id: `💡 Dukungan Adaptif: Memperkuat pemahaman konsep dasar di tingkat ${formatDiffName(nextDiff, 'id')}.`
      };
    } else {
      state.adaptiveNotice = {
        type: 'fresh',
        msg_en: `✨ Adaptive Round: Fresh question set selected at ${capitalize(currentDiff)} level.`,
        msg_id: `✨ Putaran Adaptif: Rangkaian soal baru disiapkan di tingkat ${formatDiffName(currentDiff, 'id')}.`
      };
    }

    syncDifficultyChipsUI(state.selectedDifficulty);
  }

  const isGuest = isGuestUser();
  if (isGuest) {
    state.selectedTopic = 'mixed';
    if (state.selectedDifficulty === 'advanced') {
      state.selectedDifficulty = 'intermediate';
    }
  }

  const count = state.selectedCount || state.selectedAIQuestions || 5;
  const topic = isGuest ? 'mixed' : (state.selectedTopic || 'mixed');
  const difficulty = isGuest
    ? (state.selectedDifficulty === 'advanced' ? 'intermediate' : (state.selectedDifficulty || 'intermediate'))
    : (state.selectedDifficulty || 'intermediate');

  state.recentQuestionIds = state.recentQuestionIds || [];
  let questions = getAdaptiveQuestionSet(topic, difficulty, count, state.recentQuestionIds);

  // Record newly selected question IDs into recent memory to guarantee non-repetition
  questions.forEach(q => {
    if (q.id && !state.recentQuestionIds.includes(q.id)) {
      state.recentQuestionIds.push(q.id);
    }
  });
  if (state.recentQuestionIds.length > 60) {
    state.recentQuestionIds = state.recentQuestionIds.slice(-60);
  }
  saveState();

  state.quiz = {
    questions,
    current: 0,
    score: 0,
    isReviewMode: false,
    isAiMode: false,
    adaptiveNotice: state.adaptiveNotice || null
  };
  state.adaptiveNotice = null;

  const setupBox = document.getElementById('quizSetupBox');
  if (setupBox) setupBox.classList.add('hidden');
  const aiSetupBox = document.getElementById('aiSetupBox');
  if (aiSetupBox) aiSetupBox.classList.add('hidden');

  renderQuiz();
}

export const startQuickQuiz = startQuiz;
export const runAiAdaptiveTest = startQuiz;

export function renderQuiz() {
  if (!state.quiz) return;
  const playArea = document.getElementById('quizPlayArea') || document.getElementById('aiPlayArea');
  if (!playArea) return;

  const currentIdx = state.quiz.current;
  const q = state.quiz.questions[currentIdx];

  if (!q) {
    const total = state.quiz.questions.length;
    const score = total ? Math.round((state.quiz.score / total) * 100) : 100;
    const xp = Math.max(5, Math.round(score / 10));

    const isId = state.lang === 'id';

    // Performance assessment & next adaptive step
    let adaptiveNextText = '';
    let adaptiveBadge = '';
    if (score >= 80) {
      adaptiveBadge = isId ? '🔥 Performa Unggul · Siap Naik Level' : '🔥 Mastery Achieved · Ready for Next Level';
      adaptiveNextText = isId
        ? `Luar biasa! Skor ${score}% membuktikan pemahaman yang sangat kuat. Menekan tombol di bawah akan otomatis menyiapkan kuis baru adaptif dengan soal yang belum pernah Anda temui sebelumnya.`
        : `Outstanding! A score of ${score}% demonstrates strong mastery. The next adaptive quiz will automatically present fresh, challenging questions you haven't seen before.`;
    } else if (score < 50) {
      adaptiveBadge = isId ? '💡 Mode Penguatan Konsep Dasar' : '💡 Foundational Reinforcement Mode';
      adaptiveNextText = isId
        ? `Latihan yang bagus! Sistem adaptif akan menyesuaikan kuis berikutnya dengan soal-soal baru untuk memperkuat konsep tata bahasa yang sempat keliru.`
        : `Valuable practice session! The adaptive engine will adjust your next round with fresh questions reinforcing the rules you missed.`;
    } else {
      adaptiveBadge = isId ? '⚡ Kemajuan Stabil · Soal Baru' : '⚡ Steady Progress · Fresh Set';
      adaptiveNextText = isId
        ? `Bagus! Pemahaman Anda semakin konsisten. Menekan tombol di bawah akan menghasilkan kuis baru dengan rangkaian soal yang benar-benar berbeda.`
        : `Good job! Your consistency is building. Click below to generate a brand new set of non-repeating questions.`;
    }

    const isGuest = isGuestUser();
    const guestResultCallout = isGuest ? `
      <div class="guest-result-box" style="margin:1rem auto;padding:.85rem 1.15rem;background:linear-gradient(135deg, rgba(245,158,11,.12), rgba(217,119,6,.06));border:1px solid rgba(245,158,11,.35);border-radius:var(--r-md);max-width:520px;text-align:center;">
        <div style="font-size:.85rem;font-weight:700;color:#fbbf24;margin-bottom:.3rem;display:flex;align-items:center;justify-content:center;gap:.4rem;">
          <span>🔒</span> ${isId ? 'Sesi Selesai (Mode Tamu)' : 'Session Finished (Guest Mode)'}
        </div>
        <p style="font-size:.82rem;color:var(--text);margin:0 0 .65rem 0;line-height:1.45;">
          ${isId 
            ? 'Ingin menyimpan rekor XP Anda ke Cloud, serta membuka kuis topik khusus (Tenses, To Be, Vocab, Grammar) dan tingkat Advanced?' 
            : 'Want to sync your XP to Cloud, and unlock topic-specific quizzes (Tenses, To Be, Vocab, Grammar) and Advanced level?'}
        </p>
        <button type="button" class="btn btn-primary btn-sm" id="quizResultGuestSignUpBtn" style="font-weight:700;">
          ${isId ? '🚀 Buat Akun / Log In (Akses Penuh)' : '🚀 Create Free Account / Log In'}
        </button>
      </div>
    ` : '';

    playArea.innerHTML = `
      <div class="card quiz-results">
        <div class="score">${score}%</div>
        <div class="xp-earned">+${xp} XP</div>
        
        <div class="adaptive-eval-box" style="margin:1rem auto;padding:.75rem 1rem;background:rgba(79,195,255,.08);border:1px solid rgba(79,195,255,.25);border-radius:var(--r-md);max-width:520px;text-align:center;">
          <div style="font-size:.78rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--sky-bright);margin-bottom:.3rem;">
            ${adaptiveBadge}
          </div>
          <p style="font-size:.85rem;color:var(--text);margin:0;line-height:1.45;">
            ${adaptiveNextText}
          </p>
        </div>

        ${guestResultCallout}

        <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:var(--sp-4);">
          <button class="btn btn-primary" id="quizAgainBtn">
            ${isId ? '⚡ Coba Kuis Baru (Adaptif)' : '⚡ Try Another Quiz (Fresh Adaptive)'}
          </button>
          <button class="btn btn-ghost" id="quizChangeSetupBtn">
            ${isId ? '⚙️ Ubah Topik / Level' : '⚙️ Change Topic / Level'}
          </button>
          <button class="btn btn-ghost" id="quizDashboardBtn">
            ${isId ? '🏠 Kembali ke Beranda' : '🏠 Back to Dashboard'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('quizResultGuestSignUpBtn')?.addEventListener('click', () => {
      openAuthModal('sign-up');
    });

    state.xp += xp;
    state.history.unshift({
      label: state.quiz.isReviewMode ? 'Review quiz' : `Quiz (${capitalize(state.selectedTopic)})`,
      score,
      timestamp: Date.now()
    });
    state.streak += 1;
    saveState();

    if (state.supabaseUserId) {
      const activeProf = state.profiles?.[state.activeProfile] || {};
      syncCloudProfile(state.supabaseUserId, {
        name: activeProf.name || 'Learner',
        email: activeProf.email,
        level: state.level,
        xp: state.xp,
        streak: state.streak
      });
      recordCloudQuizHistory(state.supabaseUserId, {
        topic: state.quiz.isReviewMode ? 'Review' : state.selectedTopic,
        level: state.selectedDifficulty,
        score,
        total: state.quiz.questions?.length || 5
      });
    }

    if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
    if (typeof window.renderBadges === 'function') window.renderBadges();
    if (typeof window.renderHistory === 'function') window.renderHistory();

    const lastFinishedScore = score;
    const lastFinishedTopic = state.selectedTopic;
    const lastFinishedDiff = state.selectedDifficulty;

    document.getElementById('quizAgainBtn')?.addEventListener('click', () => {
      if (state.quiz?.isReviewMode) {
        window.setView?.('dashboard');
      } else {
        playArea.innerHTML = `
          <div class="card" style="text-align:center;padding:2.2rem 1.5rem;">
            <div style="font-size:2rem;margin-bottom:.5rem;">✨</div>
            <div style="font-weight:700;font-size:1.05rem;">${isId ? 'Menyiapkan Kuis Baru yang Adaptif...' : 'Generating Fresh Adaptive Quiz...'}</div>
            <p style="color:var(--muted);font-size:.85rem;margin-top:.35rem;margin-bottom:0;">
              ${isId ? 'Memilih soal baru yang berbeda dari putaran sebelumnya...' : 'Selecting questions not seen in your previous rounds...'}
            </p>
          </div>
        `;
        setTimeout(() => {
          startQuiz({
            isAdaptiveNext: true,
            previousScore: lastFinishedScore,
            previousTopic: lastFinishedTopic,
            previousDifficulty: lastFinishedDiff
          });
        }, 320);
      }
    });

    document.getElementById('quizChangeSetupBtn')?.addEventListener('click', () => {
      const setupBox = document.getElementById('quizSetupBox');
      if (setupBox) setupBox.classList.remove('hidden');
      playArea.innerHTML = '';
      setupBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    document.getElementById('quizDashboardBtn')?.addEventListener('click', () => {
      const setupBox = document.getElementById('quizSetupBox');
      if (setupBox) setupBox.classList.remove('hidden');
      playArea.innerHTML = '';
      window.setView?.('dashboard');
    });

    state.quiz = null;
    return;
  }

  const progress = state.quiz.questions.map((_, index) => `
    <span class="dot ${index < currentIdx ? 'done' : (index === currentIdx ? 'current' : '')}"></span>
  `).join('');

  const isId = state.lang === 'id';
  const adaptiveBanner = state.quiz.adaptiveNotice ? `
    <div class="adaptive-pill-banner" style="margin-bottom:.75rem;padding:.35rem .75rem;background:rgba(79,195,255,.12);border:1px solid rgba(79,195,255,.3);border-radius:var(--r-pill);font-size:.78rem;color:var(--sky-bright);font-weight:600;display:inline-flex;align-items:center;gap:.4rem;">
      <span>✨</span> ${escapeHtml(isId ? state.quiz.adaptiveNotice.msg_id : state.quiz.adaptiveNotice.msg_en)}
    </div>
  ` : (q.isReinforcement ? `
    <div class="adaptive-pill-banner" style="margin-bottom:.75rem;padding:.35rem .75rem;background:rgba(255,183,77,.14);border:1px solid rgba(255,183,77,.35);border-radius:var(--r-pill);font-size:.78rem;color:#ffb74d;font-weight:600;display:inline-flex;align-items:center;gap:.4rem;">
      <span>🎯</span> ${isId ? 'Soal Penguatan Adaptif (Dari Catatan Review Anda)' : 'Adaptive Reinforcement (From Your Review Queue)'}
    </div>
  ` : '');

  playArea.innerHTML = `
    <div class="card quiz-stage quiz-question">
      <div class="quiz-progress">${progress}</div>
      ${adaptiveBanner}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-2);">
        <span class="review-topic-tag">${escapeHtml(formatTopic(q.topic || state.selectedTopic))}</span>
        <span style="font-size:.76rem;color:var(--muted);">${isId ? `Pertanyaan ${currentIdx + 1} dari ${state.quiz.questions.length}` : `Question ${currentIdx + 1} of ${state.quiz.questions.length}`}</span>
      </div>
      <h3>${escapeHtml(q.q)}</h3>
      <div class="quiz-options">
        ${q.options.map((option, index) => `
          <button class="quiz-option" data-index="${index}">${escapeHtml(option)}</button>
        `).join('')}
      </div>
      <div style="margin-top:var(--sp-3);display:flex;justify-content:space-between;align-items:center;">
        <button class="btn btn-ghost btn-sm" id="skipQuizBtn">${isId ? 'Lewati Pertanyaan' : 'Skip Question'}</button>
      </div>
    </div>
  `;

  playArea.querySelectorAll('.quiz-option').forEach(button => {
    button.addEventListener('click', () => {
      const pick = Number(button.dataset.index);
      const correct = pick === q.answer;
      if (correct) {
        state.quiz.score += 1;
      } else {
        recordIncorrectQuestion(q, pick, q.topic, q.difficulty);
      }

      const explainText = isId ? (q.explain_id || q.explain) : (q.explain || q.explain_id);
      playArea.innerHTML = `
        <div class="card quiz-stage quiz-question">
          <div class="quiz-progress">${progress}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-2);">
            <span class="review-topic-tag">${escapeHtml(formatTopic(q.topic || state.selectedTopic))}</span>
            <span style="font-size:.76rem;color:var(--muted);">${isId ? `Pertanyaan ${currentIdx + 1} dari ${state.quiz.questions.length}` : `Question ${currentIdx + 1} of ${state.quiz.questions.length}`}</span>
          </div>
          <h3>${escapeHtml(q.q)}</h3>
          <div class="quiz-options">
            ${q.options.map((option, index) => `
              <button class="quiz-option ${index === q.answer ? 'correct' : ''} ${index === pick && !correct ? 'incorrect' : ''}" disabled>
                ${escapeHtml(option)}
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback ${correct ? '' : 'wrong'}">
            ${correct ? (isId ? '<strong>✓ Benar!</strong>' : '<strong>✓ Correct!</strong>') : (isId ? '<strong>✕ Kurang tepat.</strong>' : '<strong>✕ Incorrect.</strong>')} ${escapeHtml(explainText)}
          </div>
          <div style="margin-top:var(--sp-3);">
            <button class="btn btn-primary btn-sm" id="nextQuizBtn">
              ${currentIdx === state.quiz.questions.length - 1 ? (isId ? 'Selesai & Lihat Skor' : 'Finish & View Score') : (isId ? 'Pertanyaan Berikutnya →' : 'Next Question →')}
            </button>
          </div>
        </div>
      `;

      document.getElementById('nextQuizBtn')?.addEventListener('click', () => {
        state.quiz.current += 1;
        renderQuiz();
      });
    });
  });

  document.getElementById('skipQuizBtn')?.addEventListener('click', () => {
    state.quiz.current += 1;
    renderQuiz();
  });
}

// ===================================================================
// GRAMMAR CURRICULUM & INTERACTIVE LAB MODULE
// ===================================================================

let currentGrammarTab = 'all';
let currentGrammarSearchQuery = '';
let activeSentencePatternIndex = 0;
let activeTemplateIndex = 0;

export function initGrammarModule() {
  const container = document.getElementById('msub-grammar');
  if (!container) return;

  renderGrammarStructure();
  bindGrammarEvents();
  renderGrammarContent();
}

function renderGrammarStructure() {
  const container = document.getElementById('msub-grammar');
  if (!container) return;

  const isId = (state.lang || 'id') === 'id';

  container.innerHTML = `
    <!-- Top Header & National Standards Badge -->
    <div class="grammar-hero-card card" style="margin-bottom:var(--sp-4);padding:var(--sp-5);background:linear-gradient(135deg,rgba(14,165,233,0.12),rgba(99,102,241,0.08));border:1px solid rgba(14,165,233,0.25);">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div style="max-width:760px;">
          <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.4rem;">
            <span style="font-size:1.5rem;">🇮🇩</span>
            <h3 style="font-size:1.2rem;margin:0;font-family:var(--font-d);">
              ${isId ? 'Tata Bahasa Inggris Standar Pendidikan Nasional' : 'National Standard English Grammar Curriculum'}
            </h3>
            <span class="pill active" style="font-size:.72rem;padding:.15rem .6rem;background:var(--sky);color:#fff;">
              Kurikulum Merdeka (Fase D SMP & E-F SMA) · UTBK / SNBT
            </span>
          </div>
          <p style="margin:0 0 .75rem 0;font-size:.88rem;color:var(--text);line-height:1.5;">
            ${isId 
              ? 'Materi tata bahasa dirancang berbasis capaian pembelajaran nasional: mulai dari pondasi kata, kalimat pasif, pengandaian (conditionals), klausa penjelas, hingga <strong>Klinik Kesalahan Khas Siswa Indonesia</strong> untuk menghindari jebakan terjemahan harfiah.'
              : 'Grammar modules aligned with Indonesian national competency frameworks: from parts of speech, passive voice, conditionals, and clauses to our signature Indonesian Learner Pitfalls Clinic.'}
          </p>
          <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" id="btnGrammarTakeQuiz" style="display:inline-flex;align-items:center;gap:.4rem;font-weight:700;">
              <span>🎯</span> <span>${isId ? 'Latihan Kuis Grammar Sekarang' : 'Start Grammar Practice Quiz'}</span>
            </button>
            <span style="font-size:.8rem;color:var(--muted);">${isId ? 'Disertai audio pengucapan asli 🔊 dan pembahasan rumus kilat.' : 'Includes native audio 🔊 and exam cheat-sheets.'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Category Tabs Navigation -->
    <div class="grammar-controls-bar" style="margin-bottom:var(--sp-4);display:flex;flex-direction:column;gap:.75rem;">
      <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <input type="text" class="text-input" id="grammarSearchInput" placeholder="${isId ? '🔍 Cari materi grammar (contoh: passive, conditional, agree, although, relative, modals)...' : '🔍 Search grammar topics (e.g. passive, conditional, agree, modals)...'}" style="margin:0;width:100%;font-size:.88rem;padding:.5rem .85rem;">
        </div>
        <button type="button" class="btn btn-ghost btn-sm" id="grammarClearSearchBtn" style="display:none;padding:.5rem .85rem;">
          ✕ ${isId ? 'Reset Pencarian' : 'Reset Search'}
        </button>
      </div>

      <div class="subtabs" id="grammarCategoryTabs" style="border-bottom:none;padding-bottom:0;flex-wrap:wrap;gap:.45rem;">
        <button class="pill ${currentGrammarTab === 'all' ? 'active' : ''}" data-gtab="all">
          <span>🌟</span> <span>${isId ? 'Semua Materi' : 'All Modules'}</span>
        </button>
        <button class="pill ${currentGrammarTab === 'curriculum' ? 'active' : ''}" data-gtab="curriculum">
          <span>🎓</span> <span>${isId ? 'Kurikulum Inti SMP/SMA/UTBK' : 'Core Curriculum'}</span>
        </button>
        <button class="pill ${currentGrammarTab === 'pitfalls' ? 'active' : ''}" data-gtab="pitfalls">
          <span>⚠️</span> <span>${isId ? 'Klinik Kesalahan Siswa Indonesia' : 'Indonesian Learner Pitfalls'}</span>
        </button>
        <button class="pill ${currentGrammarTab === 'lab' ? 'active' : ''}" data-gtab="lab">
          <span>🧪</span> <span>${isId ? 'Lab Struktur Kalimat' : 'Sentence Builder Lab'}</span>
        </button>
        <button class="pill ${currentGrammarTab === 'hacks' ? 'active' : ''}" data-gtab="hacks">
          <span>⚡</span> <span>${isId ? 'Trik Cepat Ujian (Exam Hacks)' : 'Exam Hacks'}</span>
        </button>
        <button class="pill ${currentGrammarTab === 'foundations' ? 'active' : ''}" data-gtab="foundations">
          <span>🏛️</span> <span>${isId ? 'Parts of Speech (Dasar)' : 'Parts of Speech'}</span>
        </button>
      </div>
    </div>

    <!-- Dynamic Content Container -->
    <div id="grammarContentArea"></div>
  `;
}

function bindGrammarEvents() {
  const container = document.getElementById('msub-grammar');
  if (!container) return;

  // 1. Direct Quiz Launch Button
  document.getElementById('btnGrammarTakeQuiz')?.addEventListener('click', () => {
    if (typeof window.setView === 'function') {
      window.setView('practice');
    }
    const gChip = document.querySelector('#quizTopicChips [data-topic="grammar"]');
    if (gChip) gChip.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Subtabs Filtering
  document.querySelectorAll('#grammarCategoryTabs [data-gtab]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentGrammarTab = btn.dataset.gtab;
      document.querySelectorAll('#grammarCategoryTabs [data-gtab]').forEach(b => b.classList.toggle('active', b === btn));
      renderGrammarContent();
    });
  });

  // 3. Search Input Filtering
  const searchInput = document.getElementById('grammarSearchInput');
  const clearBtn = document.getElementById('grammarClearSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentGrammarSearchQuery = (searchInput.value || '').trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = currentGrammarSearchQuery ? 'inline-block' : 'none';
      }
      renderGrammarContent();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentGrammarSearchQuery = '';
      clearBtn.style.display = 'none';
      renderGrammarContent();
    });
  }
}

export function renderGrammarContent() {
  const area = document.getElementById('grammarContentArea');
  if (!area) return;

  const isId = (state.lang || 'id') === 'id';
  const query = currentGrammarSearchQuery;
  const tab = currentGrammarTab;

  let html = '';

  // SECTION 1: INTERACTIVE SENTENCE PATTERN LAB
  if ((tab === 'all' || tab === 'lab') && (!query || 'interactive sentence lab struktur pola aktif pasif conditional inversion'.includes(query))) {
    html += renderSentencePatternLab(isId);
  }

  // SECTION 2: INDONESIAN LEARNER PITFALLS CLINIC
  if (tab === 'all' || tab === 'pitfalls') {
    const matchedPitfalls = query
      ? INDONESIAN_LEARNER_PITFALLS.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.wrong.toLowerCase().includes(query) ||
          p.correct.toLowerCase().includes(query) ||
          p.explanation.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        )
      : INDONESIAN_LEARNER_PITFALLS;

    if (matchedPitfalls.length > 0) {
      html += `
        <div class="grammar-section-block" style="margin-bottom:var(--sp-6);">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:var(--sp-3);">
            <div>
              <div style="display:flex;align-items:center;gap:.5rem;">
                <span style="font-size:1.3rem;">⚠️</span>
                <h3 style="font-size:1.15rem;margin:0;font-family:var(--font-d);">
                  ${isId ? 'Klinik Kesalahan Khas Siswa Indonesia (Indonesian Pitfalls Clinic)' : 'Indonesian Learner Pitfalls Clinic'}
                </h3>
                <span class="pill active" style="font-size:.7rem;padding:.1rem .5rem;background:#ef4444;color:#fff;">
                  ${matchedPitfalls.length} ${isId ? 'Kasus Penting' : 'Common Cases'}
                </span>
              </div>
              <p style="margin:.25rem 0 0 0;font-size:.84rem;color:var(--muted);">
                ${isId 
                  ? 'Kumpulan kesalahan tata bahasa yang paling sering terjadi akibat interferensi pola bahasa ibu (L1 transfer) dan terjemahan kata per kata.'
                  : 'Critical grammar mistakes commonly triggered by mother-tongue interference and word-for-word translation from Indonesian.'}
              </p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:var(--sp-4);">
            ${matchedPitfalls.map(p => `
              <div class="card pitfall-card" style="padding:var(--sp-4);border-left:4px solid #ef4444;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.4rem;">
                    <span style="font-size:.72rem;font-weight:700;color:var(--muted-dim);text-transform:uppercase;letter-spacing:.05em;">${escapeHtml(p.category)}</span>
                    <button type="button" class="btn-audio-speak" data-speak="${escapeHtml(p.correct)}" title="Dengarkan pengucapan yang benar" style="background:none;border:none;cursor:pointer;font-size:1rem;padding:.1rem .3rem;">🔊</button>
                  </div>
                  <h4 style="font-size:.98rem;margin:0 0 .5rem 0;color:var(--text);font-family:var(--font-d);">${escapeHtml(p.title)}</h4>

                  <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.65rem;background:rgba(0,0,0,0.15);padding:.55rem .75rem;border-radius:var(--r-sm);">
                    <div style="font-size:.85rem;color:#f87171;display:flex;align-items:flex-start;gap:.4rem;">
                      <span style="font-weight:700;">❌ Salah:</span>
                      <span style="text-decoration:line-through;opacity:.9;">"${escapeHtml(p.wrong)}"</span>
                    </div>
                    <div style="font-size:.86rem;color:#34d399;font-weight:700;display:flex;align-items:flex-start;gap:.4rem;">
                      <span>✅ Benar:</span>
                      <span>"${escapeHtml(p.correct)}"</span>
                    </div>
                  </div>

                  <p style="font-size:.82rem;line-height:1.45;color:var(--muted);margin:0 0 .6rem 0;">
                    ${escapeHtml(p.explanation)}
                  </p>
                </div>

                <div style="border-top:1px dashed var(--line);padding-top:.45rem;font-size:.78rem;color:var(--sky-bright);">
                  <strong>📌 Kaidah Baku:</strong> ${escapeHtml(p.rule)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // SECTION 3: NATIONAL CURRICULUM CORE MODULES
  if (tab === 'all' || tab === 'curriculum') {
    const matchedCurriculum = query
      ? GRAMMAR_CURRICULUM_MODULES.filter(m =>
          m.title.toLowerCase().includes(query) ||
          m.fase.toLowerCase().includes(query) ||
          m.summary.toLowerCase().includes(query) ||
          m.formula.toLowerCase().includes(query) ||
          m.example.toLowerCase().includes(query) ||
          m.tips.toLowerCase().includes(query)
        )
      : GRAMMAR_CURRICULUM_MODULES;

    if (matchedCurriculum.length > 0) {
      html += `
        <div class="grammar-section-block" style="margin-bottom:var(--sp-6);">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:var(--sp-3);">
            <span style="font-size:1.3rem;">🎓</span>
            <h3 style="font-size:1.15rem;margin:0;font-family:var(--font-d);">
              ${isId ? 'Topik Inti Kurikulum SMP, SMA & Seleksi Masuk PTN / UTBK' : 'Core National Curriculum Modules (SMP, SMA & SNBT)'}
            </h3>
            <span class="pill active" style="font-size:.7rem;padding:.1rem .5rem;">${matchedCurriculum.length} Modul Lengkap</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--sp-4);">
            ${matchedCurriculum.map(mod => `
              <div class="card curriculum-card" style="padding:var(--sp-5);">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem;">
                  <div>
                    <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.2rem;">
                      <h4 style="font-size:1.08rem;margin:0;font-family:var(--font-d);">${escapeHtml(mod.title)}</h4>
                      <span class="pill" style="font-size:.68rem;padding:.12rem .5rem;background:rgba(14,165,233,0.15);color:var(--sky-bright);border:1px solid rgba(14,165,233,0.3);">
                        ${escapeHtml(mod.fase)}
                      </span>
                      <span class="pill active" style="font-size:.68rem;padding:.12rem .5rem;">
                        ${escapeHtml(mod.tag)}
                      </span>
                    </div>
                    <p style="margin:0;font-size:.85rem;color:var(--muted);">${escapeHtml(mod.summary)}</p>
                  </div>
                  <button type="button" class="btn-audio-speak" data-speak="${escapeHtml(mod.example)}" title="Dengarkan contoh kalimat" style="background:var(--navy-900);border:1px solid var(--line);border-radius:var(--r-pill);cursor:pointer;font-size:.82rem;padding:.3rem .7rem;color:var(--text);display:inline-flex;align-items:center;gap:.3rem;">
                    <span>🔊</span> <span>Dengarkan</span>
                  </button>
                </div>

                <div style="background:rgba(0,0,0,0.2);border-radius:var(--r-sm);padding:.55rem .85rem;margin-bottom:.75rem;font-family:monospace;font-size:.85rem;color:var(--sky-bright);border-left:3px solid var(--sky);">
                  <strong>Formula:</strong> ${escapeHtml(mod.formula)}
                </div>

                <!-- Pattern Breakdown Table -->
                <div style="overflow-x:auto;margin-bottom:.75rem;">
                  <table class="conj-table" style="width:100%;font-size:.82rem;">
                    <thead>
                      <tr>
                        <th style="width:28%;">${isId ? 'Tipe / Tense' : 'Type / Tense'}</th>
                        <th style="width:36%;">${isId ? 'Bentuk Dasar / Aktif' : 'Base / Active Form'}</th>
                        <th style="width:36%;">${isId ? 'Bentuk Target / Pasif' : 'Target / Passive Form'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${mod.table.map(row => `
                        <tr>
                          <td style="font-weight:700;color:var(--sky-bright);">${escapeHtml(row.tense)}</td>
                          <td style="opacity:.9;">${escapeHtml(row.active)}</td>
                          <td style="font-weight:600;color:var(--text);">${escapeHtml(row.passive)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                <!-- Example Sentence Box -->
                <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.2);border-radius:var(--r-sm);padding:.55rem .85rem;margin-bottom:.55rem;">
                  <div style="font-size:.85rem;">
                    <div style="font-style:italic;color:var(--text);">${escapeHtml(mod.example)}</div>
                    <div style="font-size:.78rem;color:var(--muted);margin-top:.15rem;">🇮🇩 ${escapeHtml(mod.example_id)}</div>
                  </div>
                </div>

                <!-- Exam Tip -->
                <div style="font-size:.8rem;color:#fbbf24;background:rgba(245,158,11,0.08);border:1px dashed rgba(245,158,11,0.3);padding:.4rem .7rem;border-radius:var(--r-sm);">
                  💡 <strong>${isId ? 'Tips Trik Ujian:' : 'Exam Strategy:'}</strong> ${escapeHtml(mod.tips)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // SECTION 4: EXAM GRAMMAR HACKS
  if (tab === 'all' || tab === 'hacks') {
    const matchedHacks = query
      ? EXAM_GRAMMAR_HACKS.filter(h =>
          h.title.toLowerCase().includes(query) ||
          h.rule.toLowerCase().includes(query) ||
          h.tip.toLowerCase().includes(query) ||
          h.wrong.toLowerCase().includes(query) ||
          h.correct.toLowerCase().includes(query)
        )
      : EXAM_GRAMMAR_HACKS;

    if (matchedHacks.length > 0) {
      html += `
        <div class="grammar-section-block" style="margin-bottom:var(--sp-6);">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:var(--sp-3);">
            <span style="font-size:1.3rem;">⚡</span>
            <h3 style="font-size:1.15rem;margin:0;font-family:var(--font-d);">
              ${isId ? 'Trik Cepat Soal Ujian (Grammar Hacks for Exams & UTBK)' : 'Exam Grammar Hacks'}
            </h3>
            <span class="pill active" style="font-size:.7rem;padding:.1rem .5rem;">${matchedHacks.length} Cheat Sheets</span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:var(--sp-4);">
            ${matchedHacks.map(h => `
              <div class="card hack-card" style="padding:var(--sp-4);border-top:3px solid var(--sky);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.35rem;">
                  <span class="pill active" style="font-size:.68rem;padding:.1rem .45rem;">${escapeHtml(h.tag)}</span>
                </div>
                <h4 style="font-size:.95rem;margin:0 0 .4rem 0;font-family:var(--font-d);">${escapeHtml(h.title)}</h4>
                <p style="font-size:.83rem;color:var(--text);margin:0 0 .5rem 0;line-height:1.45;">${escapeHtml(h.rule)}</p>

                <div style="background:rgba(0,0,0,0.18);border-radius:var(--r-sm);padding:.45rem .65rem;margin-bottom:.55rem;font-size:.8rem;">
                  <div style="color:#f87171;margin-bottom:.2rem;">${escapeHtml(h.wrong)}</div>
                  <div style="color:#34d399;font-weight:600;">${escapeHtml(h.correct)}</div>
                </div>

                <div style="font-size:.78rem;color:var(--sky-bright);line-height:1.35;">
                  <strong>💡 Kunci Jawaban:</strong> ${escapeHtml(h.tip)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // SECTION 5: PARTS OF SPEECH (FOUNDATIONS)
  if (tab === 'all' || tab === 'foundations') {
    const matchedPOS = query
      ? GRAMMAR_PARTS_OF_SPEECH.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query) ||
          p.ex.toLowerCase().includes(query) ||
          p.sentence.toLowerCase().includes(query)
        )
      : GRAMMAR_PARTS_OF_SPEECH;

    if (matchedPOS.length > 0) {
      html += `
        <div class="grammar-section-block" style="margin-bottom:var(--sp-6);">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:var(--sp-3);">
            <span style="font-size:1.3rem;">🏛️</span>
            <h3 style="font-size:1.15rem;margin:0;font-family:var(--font-d);">
              ${isId ? 'Fondasi Dasar: 8 Kelas Kata (Parts of Speech)' : 'Foundations: 8 Parts of Speech'}
            </h3>
            <span class="pill active" style="font-size:.7rem;padding:.1rem .5rem;">Fase D (SMP)</span>
          </div>

          <div class="pos-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:var(--sp-4);">
            ${matchedPOS.map(pos => `
              <div class="card pos-card" style="padding:var(--sp-4);display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.25rem;">
                    <h4 style="font-size:.95rem;margin:0;font-family:var(--font-d);">${escapeHtml(pos.name)}</h4>
                    <button type="button" class="btn-audio-speak" data-speak="${escapeHtml(pos.sentence)}" title="Dengarkan contoh kalimat" style="background:none;border:none;cursor:pointer;font-size:.95rem;padding:.1rem;">🔊</button>
                  </div>
                  <p style="font-size:.82rem;color:var(--muted);margin:0 0 .4rem 0;line-height:1.4;">${escapeHtml(pos.desc)}</p>
                  <div style="font-size:.78rem;color:var(--sky-bright);margin-bottom:.45rem;font-family:monospace;background:rgba(14,165,233,0.06);padding:.25rem .5rem;border-radius:var(--r-sm);">
                    ${escapeHtml(pos.ex)}
                  </div>
                </div>

                <div style="border-top:1px dashed var(--line);padding-top:.45rem;font-size:.78rem;">
                  <div style="font-style:italic;color:var(--text);">"${escapeHtml(pos.sentence)}"</div>
                  <div style="color:var(--muted-dim);font-size:.72rem;margin-top:.15rem;">🇮🇩 ${escapeHtml(pos.sentence_id)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // EMPTY SEARCH FALLBACK
  if (!html) {
    html = `
      <div class="card" style="text-align:center;padding:var(--sp-6);">
        <div style="font-size:2.4rem;margin-bottom:.5rem;">🔍</div>
        <h3 style="margin:0 0 .4rem 0;">${isId ? `Tidak ada materi grammar yang cocok dengan "${escapeHtml(query)}"` : `No grammar topics matched "${escapeHtml(query)}"`}</h3>
        <p style="color:var(--muted);font-size:.88rem;max-width:55ch;margin:0 auto var(--sp-4);line-height:1.5;">
          ${isId 
            ? 'Coba gunakan kata kunci umum seperti: "passive", "conditional", "agree", "although", "modals", atau "gerund".' 
            : 'Try using common keywords like "passive", "conditional", "agree", "although", "modals", or "gerund".'}
        </p>
        <button type="button" class="btn btn-primary btn-sm" id="btnResetSearchFromEmpty">
          ${isId ? 'Tampilkan Semua Materi' : 'Show All Modules'}
        </button>
      </div>
    `;
  }

  area.innerHTML = html;

  // Bind audio speak buttons
  area.querySelectorAll('.btn-audio-speak[data-speak]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.dataset.speak;
      speakText(text);
    });
  });

  // Bind reset search button if shown
  document.getElementById('btnResetSearchFromEmpty')?.addEventListener('click', () => {
    const inp = document.getElementById('grammarSearchInput');
    if (inp) inp.value = '';
    currentGrammarSearchQuery = '';
    const clearBtn = document.getElementById('grammarClearSearchBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    renderGrammarContent();
  });

  // Bind interactive sentence lab controls
  bindSentencePatternLabEvents();
}

function renderSentencePatternLab(isId) {
  const pattern = INTERACTIVE_SENTENCE_PATTERNS[activeSentencePatternIndex] || INTERACTIVE_SENTENCE_PATTERNS[0];
  const template = pattern.templates[activeTemplateIndex] || pattern.templates[0];

  return `
    <div class="card sentence-lab-card" style="margin-bottom:var(--sp-6);padding:var(--sp-5);border:1px solid rgba(14,165,233,0.3);background:linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.9));box-shadow:var(--shadow-2);">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:var(--sp-3);">
        <div style="display:flex;align-items:center;gap:.5rem;">
          <span style="font-size:1.4rem;">🧪</span>
          <div>
            <h3 style="font-size:1.15rem;margin:0;font-family:var(--font-d);">
              ${isId ? 'Lab Struktur Kalimat Interaktif (Sentence Builder Lab)' : 'Interactive Sentence Pattern Lab'}
            </h3>
            <div style="font-size:.8rem;color:var(--muted);">${escapeHtml(pattern.desc)}</div>
          </div>
        </div>

        <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
          ${INTERACTIVE_SENTENCE_PATTERNS.map((p, idx) => `
            <button type="button" class="pill ${idx === activeSentencePatternIndex ? 'active' : ''} btn-switch-pattern" data-pattern-index="${idx}" style="font-size:.75rem;padding:.2rem .6rem;">
              ${escapeHtml(p.name)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Template Transformer Switcher -->
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem;flex-wrap:wrap;">
        <span style="font-size:.78rem;font-weight:700;color:var(--muted);">${isId ? 'Pilih Sudut Pandang Pola:' : 'Select Pattern View:'}</span>
        ${pattern.templates.map((tpl, tIdx) => `
          <button type="button" class="btn btn-sm ${tIdx === activeTemplateIndex ? 'btn-primary' : 'btn-ghost'} btn-switch-template" data-template-index="${tIdx}" style="font-size:.78rem;padding:.25rem .75rem;">
            ${escapeHtml(tpl.label)}
          </button>
        `).join('')}
      </div>

      <!-- Visual Color-Coded Chips Diagram -->
      <div style="background:var(--navy-900);border:1px solid var(--line-strong);border-radius:var(--r-md);padding:var(--sp-4);margin-bottom:.75rem;">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-bottom:.5rem;">
          ${isId ? 'Diagram Komponen Pembentuk Kalimat (Color-Coded Structure):' : 'Sentence Structure Diagram:'}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;">
          ${template.chips.map(chip => {
            const colorStyles = {
              blue: 'background:rgba(59,130,246,0.18);border-color:#3b82f6;color:#93c5fd;',
              green: 'background:rgba(16,185,129,0.18);border-color:#10b981;color:#6ee7b7;',
              yellow: 'background:rgba(245,158,11,0.18);border-color:#f59e0b;color:#fcd34d;',
              purple: 'background:rgba(168,85,247,0.18);border-color:#a855f7;color:#d8b4fe;',
              cyan: 'background:rgba(6,182,212,0.18);border-color:#06b6d4;color:#67e8f9;',
              orange: 'background:rgba(249,115,22,0.18);border-color:#f97316;color:#fdba74;'
            }[chip.color] || 'background:rgba(14,165,233,0.15);border-color:var(--sky);color:var(--sky-bright);';

            return `
              <div style="border:1px solid;border-radius:var(--r-sm);padding:.35rem .75rem;${colorStyles}display:inline-flex;flex-direction:column;align-items:center;transition:transform .15s ease;">
                <span style="font-weight:700;font-size:.92rem;">${escapeHtml(chip.text)}</span>
                <span style="font-size:.65rem;opacity:.85;text-transform:uppercase;letter-spacing:.03em;margin-top:.1rem;">${escapeHtml(chip.role)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Resulting Full Sentence with Audio Playback -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.25);border-radius:var(--r-sm);padding:.6rem 1rem;">
        <div>
          <div style="font-size:.98rem;font-weight:700;color:var(--text);font-family:var(--font-d);">
            “${escapeHtml(template.sentence)}”
          </div>
          <div style="font-size:.82rem;color:var(--sky-bright);margin-top:.15rem;">
            🇮🇩 ${escapeHtml(template.translation)}
          </div>
        </div>
        <button type="button" class="btn btn-ghost btn-sm btn-speak-lab" data-speak="${escapeHtml(template.sentence)}" style="display:inline-flex;align-items:center;gap:.35rem;font-weight:700;">
          <span>🔊</span> <span>${isId ? 'Dengarkan Kalimat' : 'Listen'}</span>
        </button>
      </div>
    </div>
  `;
}

function bindSentencePatternLabEvents() {
  document.querySelectorAll('.btn-switch-pattern').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSentencePatternIndex = parseInt(btn.dataset.patternIndex, 10) || 0;
      activeTemplateIndex = 0;
      renderGrammarContent();
    });
  });

  document.querySelectorAll('.btn-switch-template').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTemplateIndex = parseInt(btn.dataset.templateIndex, 10) || 0;
      renderGrammarContent();
    });
  });

  document.querySelectorAll('.btn-speak-lab[data-speak]').forEach(btn => {
    btn.addEventListener('click', () => {
      speakText(btn.dataset.speak);
    });
  });
}

