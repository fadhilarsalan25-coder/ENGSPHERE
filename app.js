(() => {
  'use strict';

  const SELECTORS = Object.freeze({
    navigation: '.nav-link, [data-view]',
    flashcard: '.flashcard',
    quizOption: '.quiz-option',
    quizFeedback: '.quiz-feedback',
    nextQuestion: '[data-next-question]'
  });

  const QUIZ_MESSAGES = Object.freeze({
    initial: 'Choose the best answer to continue.',
    correct: 'Correct — this answer matches the rule and the sentence pattern.',
    incorrect: 'Not quite — the correct form is based on the tense and subject pattern.'
  });

  /**
   * Return the quiz scope for an element. Generated quiz content can be
   * replaced at runtime, so event delegation is used instead of cached nodes.
   */
  const getQuizScope = (element) => (
    element.closest('.quiz-question, .quiz-stage, [data-quiz]') || document
  );

  const getQuizOptions = (scope) => (
    [...scope.querySelectorAll(SELECTORS.quizOption)]
  );

  const getQuizFeedback = (scope) => scope.querySelector(SELECTORS.quizFeedback);

  const setActiveNavigation = (activeLink, navigationLinks) => {
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link === activeLink);
    });
  };

  const toggleFlashcard = (card) => {
    // `.flipped` is the class used by the existing EngSphere stylesheet.
    card.classList.toggle('flipped');
  };

  const answerQuiz = (option) => {
    const scope = getQuizScope(option);
    const options = getQuizOptions(scope);
    const feedback = getQuizFeedback(scope);

    if (option.disabled || options.some((item) => item.disabled)) return;

    const isCorrect = option.dataset.correct === 'true';

    options.forEach((item) => {
      item.disabled = true;
      item.classList.toggle('correct', item.dataset.correct === 'true');
      item.classList.remove('incorrect');
    });

    if (!isCorrect) {
      option.classList.add('incorrect');
    }

    if (feedback) {
      feedback.textContent = isCorrect ? QUIZ_MESSAGES.correct : QUIZ_MESSAGES.incorrect;
      feedback.classList.toggle('wrong', !isCorrect);
    }
  };

  const resetQuiz = (button) => {
    const scope = getQuizScope(button);
    const feedback = getQuizFeedback(scope);

    getQuizOptions(scope).forEach((option) => {
      option.disabled = false;
      option.classList.remove('correct', 'incorrect');
    });

    if (feedback) {
      feedback.textContent = QUIZ_MESSAGES.initial;
      feedback.classList.remove('wrong');
    }
  };

  const init = () => {
    const navigationLinks = [...document.querySelectorAll(SELECTORS.navigation)];

    document.addEventListener('click', (event) => {
      const navigationLink = event.target.closest(SELECTORS.navigation);
      if (navigationLink && navigationLinks.includes(navigationLink)) {
        setActiveNavigation(navigationLink, navigationLinks);
        return;
      }

      const flashcard = event.target.closest(SELECTORS.flashcard);
      if (flashcard) {
        toggleFlashcard(flashcard);
        return;
      }

      const quizOption = event.target.closest(SELECTORS.quizOption);
      if (quizOption) {
        answerQuiz(quizOption);
        return;
      }

      const nextQuestion = event.target.closest(SELECTORS.nextQuestion);
      if (nextQuestion) {
        resetQuiz(nextQuestion);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
