import { state } from './state.js';
import { saveState } from './storage.js';
import { escapeHtml, formatTopic, formatTimeAgo, capitalize } from './utils.js';
import { renderQuiz } from './quiz.js';

export function recordIncorrectQuestion(question, userPickIndex, topic, difficulty) {
  if (!question) return;
  const qId = question.id || question.q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36);
  if (!Array.isArray(state.reviewQuestions)) state.reviewQuestions = [];
  const existingIndex = state.reviewQuestions.findIndex(item => item.id === qId || item.q === question.q);
  const userOption = question.options?.[userPickIndex] ?? 'No answer';
  const correctOption = question.options?.[question.answer] ?? '';

  if (existingIndex >= 0) {
    const item = state.reviewQuestions[existingIndex];
    item.timesIncorrect = (item.timesIncorrect || 1) + 1;
    item.userPick = userPickIndex;
    item.userOption = userOption;
    item.timestamp = Date.now();
    item.mastered = false;
    state.reviewQuestions.splice(existingIndex, 1);
    state.reviewQuestions.unshift(item);
  } else {
    state.reviewQuestions.unshift({
      id: qId, q: question.q, options: [...question.options], answer: question.answer,
      correctOption, userPick: userPickIndex, userOption,
      explain: question.explain || 'Review this rule to reinforce proper English usage.',
      topic: topic || state.selectedTopic || 'mixed',
      difficulty: difficulty || state.selectedDifficulty || 'intermediate',
      timesIncorrect: 1, timestamp: Date.now(), mastered: false
    });
  }
  saveState();
  renderReviewSection();
}

export function markQuestionMastered(id) {
  const item = state.reviewQuestions.find(q => q.id === id);
  if (!item) return;
  item.mastered = true;
  saveState();
  renderReviewSection();
}

export function removeReviewQuestion(id) {
  state.reviewQuestions = state.reviewQuestions.filter(q => q.id !== id);
  saveState();
  renderReviewSection();
}

export function clearMasteredReviewQuestions() {
  state.reviewQuestions = state.reviewQuestions.filter(q => !q.mastered);
  saveState();
  renderReviewSection();
}

export function seedSampleReviewQuestions() {
  state.reviewQuestions = [
    { id: 'sample-ten-i-1', q: 'By the time we arrived, the film ____.', options: ['started', 'has started', 'had started', 'was starting'], answer: 2, correctOption: 'had started', userPick: 0, userOption: 'started', explain: 'Past Perfect shows the film started before the other past action (our arrival): "had started".', topic: 'tenses', difficulty: 'intermediate', timesIncorrect: 2, timestamp: Date.now() - 3600000, mastered: false },
    { id: 'sample-ten-a-1', q: 'Hardly ____ the door when the phone rang.', options: ['I had closed', 'had I closed', 'I closed', 'did I close'], answer: 1, correctOption: 'had I closed', userPick: 0, userOption: 'I had closed', explain: 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".', topic: 'tenses', difficulty: 'advanced', timesIncorrect: 1, timestamp: Date.now() - 7200000, mastered: false }
  ];
  saveState();
  renderReviewSection();
}

export function startReviewQuiz() {
  const pool = state.reviewQuestions.filter(q => !q.mastered);
  if (!pool.length) return;
  state.quiz = { questions: pool.map(item => ({ ...item, options: [...item.options], isReviewItem: true })), current: 0, score: 0, isReviewMode: true };
  if (typeof window.setView === 'function') window.setView('practice');
  renderQuiz();
}

export function renderReviewSection() {
  const listEl = document.getElementById('reviewQuestionsList');
  if (!listEl) return;
  const items = Array.isArray(state.reviewQuestions) ? state.reviewQuestions : [];
  state.reviewQuestions = items;
  const active = items.filter(item => !item.mastered);
  const mastered = items.filter(item => item.mastered);
  const filter = state.reviewFilter || 'all';
  const filtered = items.filter(item => filter === 'all' || (item.topic || '').toLowerCase() === filter.toLowerCase());

  const badge = document.getElementById('reviewCountBadge');
  if (badge) { badge.textContent = String(active.length); badge.style.display = active.length ? 'inline-flex' : 'none'; }
  const summary = document.getElementById('reviewStatsSummary');
  if (summary) summary.textContent = `${filtered.length} of ${items.length} question${items.length === 1 ? '' : 's'} (${mastered.length} mastered)`;

  if (!items.length) {
    listEl.innerHTML = '<div class="card review-empty-state"><h4>All Caught Up! No Questions Need Review</h4><p>Incorrect answers from quizzes will appear here.</p></div>';
    return;
  }
  listEl.innerHTML = filtered.map(item => `
    <div class="card review-card ${item.mastered ? 'mastered' : ''}" id="review-card-${item.id}">
      <div class="review-card-top"><div class="review-meta"><span class="review-topic-tag">${escapeHtml(formatTopic(item.topic))}</span><span class="review-meta-dot">·</span><span>${capitalize(item.difficulty || 'intermediate')}</span><span class="review-meta-dot">·</span><span>${formatTimeAgo(item.timestamp)}</span></div><div class="review-card-top-actions"><button class="btn-text-action" data-review-master="${item.id}">✓ Mark Mastered</button><button class="btn-text-action" data-review-remove="${item.id}">✕ Remove</button></div></div>
      <h4 class="review-q-text">${escapeHtml(item.q)}</h4>
      <div class="review-answers-comparison"><div class="review-ans-box your-pick"><span class="review-ans-label">Your Answer</span><span class="review-ans-val">${escapeHtml(item.userOption || '(incorrect)')}</span></div><div class="review-ans-box correct-pick"><span class="review-ans-label">Correct Answer</span><span class="review-ans-val">${escapeHtml(item.correctOption)}</span></div></div>
      <div class="review-explain-callout"><strong>💡 Rule & Explanation:</strong> ${escapeHtml(item.explain)}</div>
    </div>`).join('');
  listEl.querySelectorAll('[data-review-master]').forEach(button => button.addEventListener('click', () => markQuestionMastered(button.dataset.reviewMaster)));
  listEl.querySelectorAll('[data-review-remove]').forEach(button => button.addEventListener('click', () => removeReviewQuestion(button.dataset.reviewRemove)));
}
