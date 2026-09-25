import { TENSES, VOCAB, BANK } from './data.js';
import { state, levelForXp, levelLabel } from './state.js';
import { escapeHtml, formatTopic, capitalize } from './utils.js';
import { recordIncorrectQuestion } from './review.js';

export function renderTenses() {
  const grid = document.getElementById('tenseGrid');
  if (!grid) return;
  grid.innerHTML = '';
  TENSES.forEach((tense, index) => {
    const card = document.createElement('div');
    card.className = 'card tense-card' + (state.openTense === index ? ' open' : '');
    card.innerHTML = `
      <div class="tc-top">
        <div>
          <div class="tc-aspect">${escapeHtml(tense.aspect)}</div>
          <h4>${escapeHtml(tense.name)}</h4>
        </div>
        <span class="chev">▼</span>
      </div>
      <div class="tc-formula">${escapeHtml(tense.formula)}</div>
      <div class="tense-detail" style="max-height:${state.openTense === index ? '420px' : '0px'};">
        <div class="tense-detail-inner">
          <ul>${tense.uses.map(u => `<li>${escapeHtml(u)}</li>`).join('')}</ul>
          <div class="tc-examples">${tense.ex.map(e => `<div class="tc-example">${escapeHtml(e)}</div>`).join('')}</div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      state.openTense = state.openTense === index ? null : index;
      renderTenses();
    });
    grid.appendChild(card);
  });
}

export function renderVocabulary() {
  const grid = document.getElementById('vocabGrid');
  const tabs = document.getElementById('vocabCategoryTabs');
  if (!grid || !tabs) return;
  const categories = Object.keys(VOCAB);
  tabs.innerHTML = categories.map((cat, idx) => `<button class="pill ${idx === 0 ? 'active' : ''}" data-vocab-cat="${cat}">${escapeHtml(cat)}</button>`).join('');
  const category = tabs.dataset.active || categories[0];
  const activeWords = VOCAB[category] || VOCAB[categories[0]];
  grid.innerHTML = activeWords.map((item, idx) => `
    <div class="flashcard" data-flip="${idx}">
      <div class="flashcard-inner">
        <div class="flashcard-face flashcard-front">
          <div class="word">${escapeHtml(item.w)}</div>
          <div class="pos">${escapeHtml(item.p)}</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="mean">${escapeHtml(item.m)}</div>
          <div class="ex">${escapeHtml(item.e)}</div>
        </div>
      </div>
    </div>
  `).join('');

  tabs.querySelectorAll('[data-vocab-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.dataset.active = btn.dataset.vocabCat;
      tabs.querySelectorAll('[data-vocab-cat]').forEach(b => b.classList.toggle('active', b === btn));
      renderVocabulary();
    });
  });

  grid.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

export function startQuickQuiz() {
  const topic = state.selectedTopic;
  const difficulty = state.selectedDifficulty;
  let list = [];

  if (topic === 'mixed') {
    Object.keys(BANK).forEach(key => {
      if (BANK[key] && BANK[key][difficulty]) {
        list = list.concat(BANK[key][difficulty].map(q => ({ ...q, topic: key, difficulty })));
      }
    });
    list.sort(() => Math.random() - 0.5);
  } else {
    const topicBank = BANK[topic] || BANK.tenses;
    const questions = topicBank[difficulty] || topicBank.intermediate;
    list = questions.map(q => ({ ...q, topic, difficulty }));
  }

  state.quiz = {
    questions: list.slice(0, 6),
    current: 0,
    score: 0,
    isReviewMode: false
  };
  renderQuiz();
}

export function renderQuiz() {
  const playArea = document.getElementById('quizPlayArea');
  if (!state.quiz || !playArea) return;
  const q = state.quiz.questions[state.quiz.current];

  if (!q) {
    const totalQ = state.quiz.questions.length;
    const score = totalQ > 0 ? Math.round((state.quiz.score / totalQ) * 100) : 100;
    const earnedXp = Math.max(5, Math.round(score / 10));
    const wasReview = !!state.quiz.isReviewMode;

    playArea.innerHTML = `
      <div class="card quiz-results">
        <div style="font-size:2.4rem;margin-bottom:var(--sp-2);">${score >= 80 ? '🎉' : '💪'}</div>
        <div class="score">${score}%</div>
        <div class="xp-earned">+${earnedXp} XP</div>
        <p style="color:var(--muted);max-width:42ch;margin:0 auto var(--sp-4);">
          ${wasReview ? `You reviewed ${totalQ} questions and answered ${state.quiz.score} correctly!` : `Great practice session on ${formatTopic(state.selectedTopic)} (${capitalize(state.selectedDifficulty)}).`}
        </p>
        <div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" id="quizAgainBtn">${wasReview ? 'Back to Dashboard Review' : 'Try again'}</button>
          <button class="btn btn-ghost" id="quizDashboardBtn">Go to Dashboard</button>
        </div>
      </div>
    `;

    state.xp = Math.max(0, state.xp + earnedXp);
    state.streak = (state.streak || 0) + 1;

    document.getElementById('quizAgainBtn').addEventListener('click', () => {
      if (wasReview) {
        if (typeof window.setView === 'function') window.setView('dashboard');
      } else {
        startQuickQuiz();
      }
    });

    document.getElementById('quizDashboardBtn').addEventListener('click', () => {
      if (typeof window.setView === 'function') window.setView('dashboard');
    });

    state.quiz = null;
    return;
  }

  const isReview = !!state.quiz.isReviewMode;
  const progress = state.quiz.questions.map((_, i) => `<span class="dot ${i < state.quiz.current ? 'done' : i === state.quiz.current ? 'current' : ''}"></span>`).join('');

  playArea.innerHTML = `
    <div class="card quiz-stage quiz-question">
      ${isReview ? `<div style="display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .75rem;border-radius:var(--r-pill);background:rgba(79,195,255,.12);border:1px solid rgba(79,195,255,.3);color:var(--sky-bright);font-size:.78rem;font-weight:700;">🎯 Targeted Review Quiz · Question ${state.quiz.current + 1} of ${state.quiz.questions.length}</div>` : ''}
      <div class="quiz-progress">${progress}</div>
      <h3>${escapeHtml(q.q)}</h3>
      <div class="quiz-options">
        ${q.options.map((opt, idx) => `<button class="quiz-option" data-index="${idx}">${escapeHtml(opt)}</button>`).join('')}
      </div>
      <div class="quiz-actions">
        <button class="btn btn-ghost btn-sm" id="skipQuizBtn">Skip</button>
      </div>
    </div>
  `;

  playArea.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const pick = Number(btn.dataset.index);
      const correct = pick === q.answer;

      if (correct) {
        state.quiz.score += 1;
        if (isReview && q.id) {
          const revItem = state.reviewQuestions.find(item => item.id === q.id);
          if (revItem) revItem.mastered = true;
        }
      } else {
        recordIncorrectQuestion(q, pick, q.topic || state.selectedTopic, q.difficulty || state.selectedDifficulty);
      }

      playArea.innerHTML = `
        <div class="card quiz-stage quiz-question">
          ${isReview ? `<div style="display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .75rem;border-radius:var(--r-pill);background:rgba(79,195,255,.12);border:1px solid rgba(79,195,255,.3);color:var(--sky-bright);font-size:.78rem;font-weight:700;">🎯 Targeted Review Quiz</div>` : ''}
          <div class="quiz-progress">${progress}</div>
          <h3>${escapeHtml(q.q)}</h3>
          <div class="quiz-options">
            ${q.options.map((opt, idx) => {
              let classes = 'quiz-option';
              if (idx === q.answer) classes += ' correct';
              if (idx === pick && !correct) classes += ' incorrect';
              return `<button class="${classes}" disabled>${escapeHtml(opt)}</button>`;
            }).join('')}
          </div>
          <div class="quiz-feedback ${correct ? '' : 'wrong'}">
            ${correct ? '<strong>✓ Correct!</strong> ' : '<strong>✕ Incorrect.</strong> '}
            ${escapeHtml(q.explain)}
            ${!correct ? '<br><small style="color:var(--sky-bright);margin-top:.4rem;display:inline-block;">Added to your Dashboard Review for targeted study!</small>' : ''}
          </div>
          <div class="quiz-actions">
            <button class="btn btn-primary btn-sm" id="nextQuizBtn">${state.quiz.current === state.quiz.questions.length - 1 ? 'Finish' : 'Next question'}</button>
          </div>
        </div>
      `;

      document.getElementById('nextQuizBtn').addEventListener('click', () => {
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

export function runAiAdaptiveTest() {
  const topic = state.selectedTopic;
  const difficulty = state.selectedDifficulty;
  const count = Number(state.selectedAIQuestions) || 5;

  let pool = [];
  if (topic === 'mixed') {
    Object.keys(BANK).forEach(k => {
      if (BANK[k] && BANK[k][difficulty]) {
        pool = pool.concat(BANK[k][difficulty].map(q => ({ ...q, topic: k, difficulty })));
      }
    });
    pool.sort(() => Math.random() - 0.5);
  } else {
    const topicBank = BANK[topic] || BANK.tenses;
    pool = (topicBank[difficulty] || topicBank.intermediate).map(q => ({ ...q, topic, difficulty }));
  }

  const testQuestions = pool.slice(0, count);
  const area = document.getElementById('aiPlayArea');
  if (!area) return;

  let currentIndex = 0;
  let userScore = 0;

  const renderAiStep = () => {
    if (currentIndex >= testQuestions.length) {
      const pct = Math.round((userScore / testQuestions.length) * 100);
      const xp = Math.max(10, Math.round(pct / 8));
      area.innerHTML = `
        <div class="card quiz-results">
          <div style="font-size:2.4rem;margin-bottom:var(--sp-2);">✨</div>
          <div class="score">${pct}%</div>
          <div class="xp-earned">+${xp} XP</div>
          <p style="color:var(--muted);margin-bottom:var(--sp-4);">AI Adaptive Test completed! You got ${userScore} out of ${testQuestions.length} correct.</p>
          <div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary" id="aiPracticeAgainBtn">Generate another test</button>
            <button class="btn btn-ghost" id="aiDashBtn">View Review in Dashboard</button>
          </div>
        </div>
      `;
      state.xp = Math.max(0, state.xp + xp);
      document.getElementById('aiPracticeAgainBtn')?.addEventListener('click', runAiAdaptiveTest);
      document.getElementById('aiDashBtn')?.addEventListener('click', () => {
        if (typeof window.setView === 'function') window.setView('dashboard');
      });
      return;
    }

    const q = testQuestions[currentIndex];
    const progress = testQuestions.map((_, i) => `<span class="dot ${i < currentIndex ? 'done' : i === currentIndex ? 'current' : ''}"></span>`).join('');

    area.innerHTML = `
      <div class="card quiz-stage quiz-question">
        <div class="quiz-progress">${progress}</div>
        <div style="font-size:.78rem;color:var(--sky-bright);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:var(--sp-3);">
          ✨ AI Question ${currentIndex + 1} of ${testQuestions.length} · ${formatTopic(q.topic)}
        </div>
        <h3>${escapeHtml(q.q)}</h3>
        <div class="quiz-options">
          ${q.options.map((opt, idx) => `<button class="quiz-option" data-ai-index="${idx}">${escapeHtml(opt)}</button>`).join('')}
        </div>
      </div>
    `;

    area.querySelectorAll('[data-ai-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pick = Number(btn.dataset.aiIndex);
        const isCorrect = pick === q.answer;

        if (isCorrect) userScore += 1;
        else recordIncorrectQuestion(q, pick, q.topic, q.difficulty);

        area.innerHTML = `
          <div class="card quiz-stage quiz-question">
            <div class="quiz-progress">${progress}</div>
            <h3>${escapeHtml(q.q)}</h3>
            <div class="quiz-options">
              ${q.options.map((opt, idx) => {
                let cls = 'quiz-option';
                if (idx === q.answer) cls += ' correct';
                if (idx === pick && !isCorrect) cls += ' incorrect';
                return `<button class="${cls}" disabled>${escapeHtml(opt)}</button>`;
              }).join('')}
            </div>
            <div class="quiz-feedback ${isCorrect ? '' : 'wrong'}">
              ${isCorrect ? '<strong>✓ Correct!</strong> ' : '<strong>✕ Incorrect.</strong> '}
              ${escapeHtml(q.explain)}
              ${!isCorrect ? '<br><small style="color:var(--sky-bright);margin-top:.4rem;display:inline-block;">Added to your Dashboard Review list!</small>' : ''}
            </div>
            <div class="quiz-actions">
              <button class="btn btn-primary btn-sm" id="aiNextBtn">${currentIndex === testQuestions.length - 1 ? 'Finish Test' : 'Next Question'}</button>
            </div>
          </div>
        `;

        document.getElementById('aiNextBtn')?.addEventListener('click', () => {
          currentIndex += 1;
          renderAiStep();
        });
      });
    });
  };

  renderAiStep();
}
