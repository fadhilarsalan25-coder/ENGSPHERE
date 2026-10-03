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

export function getAdaptiveQuestionSet(topic = 'mixed', difficulty = 'intermediate', count = 5, recentIds = []) {
  // 1. Get base pool for requested topic and difficulty
  const basePool = getPoolForCategoryAndDifficulty(topic, difficulty);

  // 2. Filter out questions seen recently to avoid repetition
  let freshPool = basePool.filter(q => !recentIds.includes(q.id));

  // 3. If freshPool is smaller than requested count, pull fresh questions from adjacent difficulty levels
  if (freshPool.length < count) {
    const diffHierarchy = ['beginner', 'intermediate', 'advanced'];
    const currentDiffIdx = diffHierarchy.indexOf(difficulty);
    const adjacentDiffs = diffHierarchy.filter((_, idx) => Math.abs(idx - currentDiffIdx) === 1);

    for (const adjDiff of adjacentDiffs) {
      const adjPool = getPoolForCategoryAndDifficulty(topic, adjDiff)
        .filter(q => !recentIds.includes(q.id) && !freshPool.some(fq => fq.id === q.id));
      freshPool = [...freshPool, ...adjPool];
      if (freshPool.length >= count) break;
    }
  }

  // 4. If still not enough, take the least-recently used questions from basePool
  if (freshPool.length < count) {
    const fallback = basePool.filter(q => !freshPool.some(fq => fq.id === q.id));
    fallback.sort(() => Math.random() - 0.5);
    freshPool = [...freshPool, ...fallback];
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
  freshPool.sort(() => Math.random() - 0.5);

  const selected = freshPool.slice(0, count);

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
