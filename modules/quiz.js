import { state } from './state.js';
import { saveState } from './storage.js';
import { escapeHtml, formatTopic, capitalize } from './utils.js';
import { BANK, TENSES, VOCAB } from './data.js';
import { recordIncorrectQuestion } from './review.js';
import { syncCloudProfile, recordCloudQuizHistory } from './supabase-client.js';

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
    // Search across all categories
    categories.forEach(cat => {
      (VOCAB[cat] || []).forEach(item => {
        const matchesWord = item.w.toLowerCase().includes(searchQuery);
        const matchesMeaning = item.m.toLowerCase().includes(searchQuery);
        const matchesId = item.m_id && item.m_id.toLowerCase().includes(searchQuery);
        const matchesEx = item.e && item.e.toLowerCase().includes(searchQuery);
        if (matchesWord || matchesMeaning || matchesId || matchesEx) {
          displayedItems.push({ ...item, category: cat });
        }
      });
    });
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
        <div style="font-size: 2rem; margin-bottom: .5rem;">🔍</div>
        <div style="font-weight: 700; font-size: 1.05rem;">${isId ? 'Tidak ada kosakata yang cocok' : 'No vocabulary words matched'}</div>
        <p style="color: var(--muted); font-size: .85rem; margin-top: .3rem;">${isId ? `Tidak ditemukan kata dengan pencarian "${escapeHtml(searchQuery)}". Coba kata kunci lain.` : `No items found matching "${escapeHtml(searchQuery)}". Try another keyword.`}</p>
      </div>
    `;
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
      if (currentDiff === 'beginner') nextDiff = 'intermediate';
      else if (currentDiff === 'intermediate') nextDiff = 'advanced';

      state.selectedDifficulty = nextDiff;
      state.adaptiveNotice = {
        type: 'levelup',
        msg_en: `🎯 Level Up! You scored ${prevScore}%! Difficulty auto-adapted to ${capitalize(nextDiff)}.`,
        msg_id: `🎯 Naik Tingkat! Anda meraih ${prevScore}%! Kesulitan otomatis disesuaikan ke ${formatDiffName(nextDiff, 'id')}.`
      };
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

  const count = state.selectedCount || state.selectedAIQuestions || 5;
  const topic = state.selectedTopic || 'mixed';
  const difficulty = state.selectedDifficulty || 'intermediate';

  state.recentQuestionIds = state.recentQuestionIds || [];
  const questions = getAdaptiveQuestionSet(topic, difficulty, count, state.recentQuestionIds);

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
