document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const flashcards = document.querySelectorAll('.flashcard');
  flashcards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });

  const quizOptions = document.querySelectorAll('.quiz-option');
  const quizFeedback = document.querySelector('.quiz-feedback');
  const nextBtn = document.querySelector('[data-next-question]');

  let answered = false;

  quizOptions.forEach((option) => {
    option.addEventListener('click', () => {
      if (answered) return;

      answered = true;
      const isCorrect = option.dataset.correct === 'true';

      quizOptions.forEach((item) => {
        item.disabled = true;
        if (item.dataset.correct === 'true') {
          item.classList.add('is-correct');
        }
      });

      if (isCorrect) {
        option.classList.add('is-correct');
        if (quizFeedback) {
          quizFeedback.textContent = 'Correct — this answer matches the rule and the sentence pattern.';
          quizFeedback.classList.remove('is-wrong');
        }
      } else {
        option.classList.add('is-wrong');
        if (quizFeedback) {
          quizFeedback.textContent = 'Not quite — the correct form is based on the tense and subject pattern.';
          quizFeedback.classList.add('is-wrong');
        }
      }
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      answered = false;
      quizOptions.forEach((option) => {
        option.disabled = false;
        option.classList.remove('is-correct', 'is-wrong');
      });

      if (quizFeedback) {
        quizFeedback.textContent = 'Choose the best answer to continue.';
        quizFeedback.classList.remove('is-wrong');
      }
    });
  }
});
