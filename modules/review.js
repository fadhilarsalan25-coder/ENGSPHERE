import { state, levelForXp, levelLabel } from './state.js';
import { escapeHtml, formatTopic, formatTimeAgo } from './utils.js';

export function recordIncorrectQuestion(question, userPickIndex, topic, difficulty) {
  if (!question) return;
  const qId = question.id || question.q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36);
  if (!Array.isArray(state.reviewQuestions)) state.reviewQuestions = [];

  const existingIndex = state.reviewQuestions.findIndex(item => item.id === qId || item.q === question.q);
  const userOption = question.options && question.options[userPickIndex] !== undefined ? question.options[userPickIndex] : 'No answer';
  const correctOption = question.options && question.options[question.answer] !== undefined ? question.options[question.answer] : '';

  if (existingIndex >= 0) {
    const existing = state.reviewQuestions[existingIndex];
    existing.timesIncorrect = (existing.timesIncorrect || 1) + 1;
    existing.userPick = userPickIndex;
    existing.userOption = userOption;
    existing.timestamp = Date.now();
    existing.mastered = false;
    state.reviewQuestions.splice(existingIndex, 1);
    state.reviewQuestions.unshift(existing);
  } else {
    state.reviewQuestions.unshift({
      id: qId,
      q: question.q,
      options: [...question.options],
      answer: question.answer,
      correctOption,
      userPick: userPickIndex,
      userOption,
      explain: question.explain || 'Review this rule to reinforce proper English usage.',
      topic: topic || state.selectedTopic || 'mixed',
      difficulty: difficulty || state.selectedDifficulty || 'intermediate',
      timesIncorrect: 1,
      timestamp: Date.now(),
      mastered: false
    });
  }

  renderReviewSection();
}

export function markQuestionMastered(id) {
  const item = state.reviewQuestions.find(q => q.id === id);
  if (!item) return;
  item.mastered = true;
  renderReviewSection();
}

export function removeReviewQuestion(id) {
  state.reviewQuestions = state.reviewQuestions.filter(q => q.id !== id);
  renderReviewSection();
}

export function clearMasteredReviewQuestions() {
  state.reviewQuestions = state.reviewQuestions.filter(q => !q.mastered);
  renderReviewSection();
}

export function seedSampleReviewQuestions() {
  state.reviewQuestions = [
    {
      id: 'sample-ten-i-1', q: 'By the time we arrived, the film ____.',
      options: ['started', 'has started', 'had started', 'was starting'], answer: 2, correctOption: 'had started', userPick: 0, userOption: 'started',
      explain: 'Past Perfect shows the film started before the other past action (our arrival): "had started".',
      topic: 'tenses', difficulty: 'intermediate', timesIncorrect: 2, timestamp: Date.now() - 3600000, mastered: false
    },
    {
      id: 'sample-ten-a-1', q: 'Hardly ____ the door when the phone rang.',
      options: ['I had closed', 'had I closed', 'I closed', 'did I close'], answer: 1, correctOption: 'had I closed', userPick: 0, userOption: 'I had closed',
      explain: 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".',
      topic: 'tenses', difficulty: 'advanced', timesIncorrect: 1, timestamp: Date.now() - 7200000, mastered: false
    }
  ];
  renderReviewSection();
}

export function startReviewQuiz() {
  const unmastered = state.reviewQuestions.filter(q => !q.mastered);
  const pool = unmastered.length ? unmastered : state.reviewQuestions;
  if (!pool.length) return;

  state.quiz = {
    questions: pool.map(item => ({
      id: item.id, q: item.q, options: [...item.options], answer: item.answer, explain: item.explain, topic: item.topic, difficulty: item.difficulty, isReviewItem: true
    })),
    current: 0,
    score: 0,
    isReviewMode: true
  };
  renderQuiz();
}

export function renderReviewSection() {
  const listEl = document.getElementById('reviewQuestionsList');
  if (!listEl) return;

  if (!Array.isArray(state.reviewQuestions)) state.reviewQuestions = [];
  const allItems = state.reviewQuestions;
  const activeItems = allItems.filter(i => !i.mastered);
  const masteredItems = allItems.filter(i => i.mastered);
  const filter = state.reviewFilter || 'all';
  const filtered = allItems.filter(item => filter === 'all' ? true : (item.topic || '').toLowerCase() === filter.toLowerCase());

  if (!allItems.length) {
    listEl.innerHTML = `<div class="card review-empty-state"><h4>All Caught Up! No Questions Need Review</h4></div>`;
    return;
  }

  listEl.innerHTML = filtered.map(item => {
    const isMastered = !!item.mastered;
    const timeAgo = formatTimeAgo(item.timestamp);
    const topicName = formatTopic(item.topic);
    return `
      <div class="card review-card ${isMastered ? 'mastered' : ''}" id="review-card-${item.id}">
        <div class="review-card-top">
          <div class="review-meta">
            <span class="review-topic-tag">${escapeHtml(topicName)}</span>
            <span class="review-meta-dot">·</span>
            <span>${item.difficulty ? capitalize(item.difficulty) : 'Intermediate'}</span>
            <span class="review-meta-dot">·</span>
            <span>${timeAgo}</span>
          </div>
        </div>
        <h4 class="review-q-text">${escapeHtml(item.q)}</h4>
        <div class="review-answers-comparison">
          <div class="review-ans-box your-pick"><span class="review-ans-label">Your Answer</span><span class="review-ans-val">${escapeHtml(item.userOption || '(incorrect)')}</span></div>
          <div class="review-ans-box correct-pick"><span class="review-ans-label">Correct Answer</span><span class="review-ans-val">${escapeHtml(item.correctOption)}</span></div>
        </div>
        <div class="review-explain-callout"><strong>💡 Rule & Explanation:</strong> ${escapeHtml(item.explain)}</div>
        <div class="review-card-footer">
          <button class="btn btn-ghost btn-sm review-toggle-practice-btn" data-action="toggle-practice" data-id="${item.id}">🔄 Practice this question now</button>
          ${isMastered ? '<span style="font-size:.82rem;color:var(--success);font-weight:600;">✨ You mastered this item!</span>' : ''}
        </div>
      </div>
    `;
  }).join('');

  const countBadge = document.getElementById('reviewCountBadge');
  if (countBadge) {
    countBadge.textContent = String(activeItems.length);
    countBadge.style.display = activeItems.length > 0 ? 'inline-flex' : 'none';
  }
  const summaryEl = document.getElementById('reviewStatsSummary');
  if (summaryEl) {
    summaryEl.textContent = `${filtered.length} of ${allItems.length} question${allItems.length === 1 ? '' : 's'} (${masteredItems.length} mastered)`;
  }
}
