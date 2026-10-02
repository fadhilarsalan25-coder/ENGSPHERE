import { state } from './state.js';
import { saveState } from './storage.js';
import { escapeHtml, formatTopic, capitalize } from './utils.js';
import { BANK, TENSES, VOCAB } from './data.js';
import { recordIncorrectQuestion } from './review.js';

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
        <div class="tense-detail" style="max-height:${isOpen ? '950px' : '0px'}">
          <div class="tense-detail-inner">
            <div class="tc-subheading">📋 ${isId ? 'Rumus Bentuk Kalimat' : 'Sentence Structure Formulas'}</div>
            <div class="tc-formulas-box">
              <div><span class="tc-type-badge">(+)</span> <code>${escapeHtml(tense.formula)}</code></div>
              <div><span class="tc-type-badge">(-)</span> <code>${escapeHtml(tense.negFormula)}</code></div>
              <div><span class="tc-type-badge">(?)</span> <code>${escapeHtml(tense.quesFormula)}</code></div>
            </div>

            <div class="tc-subheading">📌 ${isId ? 'Kapan Digunakan (Fungsi Standar)' : 'When to Use (Core Rules)'}</div>
            <ul>${uses.map(use => `<li>${escapeHtml(use)}</li>`).join('')}</ul>

            ${tense.signals && tense.signals.length ? `
              <div class="tc-subheading">⏱️ ${isId ? 'Kata Kunci / Sinyal Waktu' : 'Key Time Signals'}</div>
              <div class="tc-signals-list">
                ${tense.signals.map(sig => `<span class="signal-tag">${escapeHtml(sig)}</span>`).join('')}
              </div>
            ` : ''}

            <div class="tc-subheading">💡 ${isId ? 'Contoh Kalimat Nyata' : 'Real-World Examples'}</div>
            <div class="tc-examples">
              ${tense.ex.map(example => `<div class="tc-example">${escapeHtml(example)}</div>`).join('')}
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
  if (!grid || !tabs) return;

  const isId = state.lang === 'id';
  const categories = Object.keys(VOCAB);
  const category = tabs.dataset.active || categories[0];

  const catLabels = {
    'Daily life': isId ? 'Aktivitas Harian' : 'Daily life',
    'Work & study': isId ? 'Pekerjaan & Studi' : 'Work & study',
    'Travel': isId ? 'Perjalanan & Wisata' : 'Travel'
  };

  const posLabels = {
    'noun': isId ? 'kata benda (noun)' : 'noun',
    'verb': isId ? 'kata kerja (verb)' : 'verb',
    'noun / verb': isId ? 'kata benda / kerja (noun / verb)' : 'noun / verb',
    'adjective': isId ? 'kata sifat (adjective)' : 'adjective',
    'adverb': isId ? 'kata keterangan (adverb)' : 'adverb'
  };

  tabs.innerHTML = categories.map(cat => `
    <button class="pill ${cat === category ? 'active' : ''}" data-vocab-cat="${escapeHtml(cat)}">${escapeHtml(catLabels[cat] || cat)}</button>
  `).join('');

  grid.innerHTML = (VOCAB[category] || []).map((item, index) => {
    const posText = posLabels[item.p] || item.p;
    return `
      <div class="flashcard" data-flip="${index}">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="word">${escapeHtml(item.w)}</div>
            <div class="pos">${escapeHtml(posText)}</div>
            <div style="font-size:.74rem;color:var(--sky-bright);margin-top:.45rem;opacity:.9;">
              ${isId ? '↻ Klik untuk membalik kartu' : '↻ Tap to flip card'}
            </div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-bottom:.2rem;">
              ${isId ? 'Arti:' : 'Meaning:'}
            </div>
            <div class="mean">${escapeHtml(item.m)}</div>
            <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-dim);margin-top:.5rem;margin-bottom:.2rem;">
              ${isId ? 'Contoh Kalimat:' : 'Example Sentence:'}
            </div>
            <div class="ex">${escapeHtml(item.e)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  tabs.querySelectorAll('[data-vocab-cat]').forEach(btn => btn.addEventListener('click', () => {
    tabs.dataset.active = btn.dataset.vocabCat;
    renderVocabulary();
  }));

  grid.querySelectorAll('.flashcard').forEach(card => card.addEventListener('click', () => card.classList.toggle('flipped')));
}

function poolForCurrentSelection(topic = state.selectedTopic, difficulty = state.selectedDifficulty) {
  if (topic === 'mixed') {
    return Object.keys(BANK).flatMap(key =>
      (BANK[key][difficulty] || BANK[key].intermediate || []).map(q => ({ ...q, topic: key, difficulty }))
    ).sort(() => Math.random() - 0.5);
  }
  const topicBank = BANK[topic] || BANK.tenses;
  const list = topicBank[difficulty] || topicBank.intermediate || [];
  return list.map(q => ({ ...q, topic, difficulty })).sort(() => Math.random() - 0.5);
}

export function startQuickQuiz() {
  const questions = poolForCurrentSelection().slice(0, 6);
  state.quiz = {
    questions,
    current: 0,
    score: 0,
    isReviewMode: false,
    isAiMode: false
  };
  const setupBox = document.getElementById('quizSetupBox');
  if (setupBox) setupBox.classList.add('hidden');
  renderQuiz();
}

export function runAiAdaptiveTest() {
  const count = state.selectedAIQuestions || 5;
  const topic = state.selectedTopic || 'mixed';
  const difficulty = state.selectedDifficulty || 'intermediate';
  let questions = poolForCurrentSelection(topic, difficulty);

  // If pool has fewer than requested, cycle or fallback from other difficulties
  if (questions.length < count) {
    const fallback = Object.keys(BANK).flatMap(k =>
      Object.keys(BANK[k]).flatMap(d => (BANK[k][d] || []).map(q => ({ ...q, topic: k, difficulty: d })))
    ).sort(() => Math.random() - 0.5);
    questions = [...questions, ...fallback];
  }

  state.quiz = {
    questions: questions.slice(0, count),
    current: 0,
    score: 0,
    isReviewMode: false,
    isAiMode: true
  };
  const aiSetupBox = document.getElementById('aiSetupBox');
  if (aiSetupBox) aiSetupBox.classList.add('hidden');
  renderQuiz();
}

export function renderQuiz() {
  if (!state.quiz) return;
  const isAi = Boolean(state.quiz.isAiMode);
  const playArea = isAi
    ? document.getElementById('aiPlayArea')
    : document.getElementById('quizPlayArea');
  if (!playArea) return;

  const currentIdx = state.quiz.current;
  const q = state.quiz.questions[currentIdx];

  if (!q) {
    const total = state.quiz.questions.length;
    const score = total ? Math.round((state.quiz.score / total) * 100) : 100;
    const xp = Math.max(5, Math.round(score / 10));

    const isId = state.lang === 'id';
    playArea.innerHTML = `
      <div class="card quiz-results">
        <div class="score">${score}%</div>
        <div class="xp-earned">+${xp} XP</div>
        <p style="color:var(--muted);font-size:.9rem;margin-top:.4rem;">
          ${score >= 80 ? (isId ? '🎉 Luar biasa! Pemahaman materi Anda sangat baik.' : '🎉 Excellent mastery! Keep up the momentum.') : (isId ? 'Latihan yang bagus! Tinjau soal yang salah untuk memperkuat tata bahasa Anda.' : 'Good practice session! Review incorrect items to strengthen your grammar.')}
        </p>
        <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:var(--sp-4);">
          <button class="btn btn-primary" id="quizAgainBtn">
            ${state.quiz.isReviewMode ? (isId ? 'Kembali ke Review Dashboard' : 'Back to Dashboard Review') : (isAi ? (isId ? '⚡ Buat Tes Lainnya' : '⚡ Generate Another Test') : (isId ? 'Coba Kuis Lainnya' : 'Try Another Quiz'))}
          </button>
          <button class="btn btn-ghost" id="quizDashboardBtn">${isId ? 'Kembali ke Beranda' : 'Go to Dashboard'}</button>
        </div>
      </div>
    `;

    state.xp += xp;
    state.history.unshift({
      label: state.quiz.isReviewMode ? 'Review quiz' : (isAi ? `AI Test (${capitalize(q?.topic || state.selectedTopic)})` : `Quick quiz (${capitalize(state.selectedTopic)})`),
      score,
      timestamp: Date.now()
    });
    state.streak += 1;
    saveState();

    if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
    if (typeof window.renderBadges === 'function') window.renderBadges();
    if (typeof window.renderHistory === 'function') window.renderHistory();

    document.getElementById('quizAgainBtn')?.addEventListener('click', () => {
      if (state.quiz?.isReviewMode) {
        window.setView?.('dashboard');
      } else if (isAi) {
        document.getElementById('aiSetupBox')?.classList.remove('hidden');
        playArea.innerHTML = '';
        runAiAdaptiveTest();
      } else {
        document.getElementById('quizSetupBox')?.classList.remove('hidden');
        playArea.innerHTML = '';
        startQuickQuiz();
      }
    });

    document.getElementById('quizDashboardBtn')?.addEventListener('click', () => {
      document.getElementById('quizSetupBox')?.classList.remove('hidden');
      document.getElementById('aiSetupBox')?.classList.remove('hidden');
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
