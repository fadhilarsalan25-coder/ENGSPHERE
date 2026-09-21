# ENGSPHERE

A simple practice English until it clicks.

ENGSPHERE is a lightweight browser-based English learning app designed to help learners practice grammar, vocabulary, and sentence structure in a simple but effective loop: read the rule, do a quick quiz, and review the explanation. The app is built as a single-page static web app and runs directly in the browser without a backend or installation step.

## What this project does

ENGSPHERE teaches English through a focused study flow:

- Tenses and grammar explanations
- Vocabulary flashcards by category
- Multiple-choice practice questions
- AI-style adaptive test generation based on topic and level
- Progress tracking with XP, streaks, and badges

It is aimed at learners who are not complete beginners but are not fully fluent yet. The app is designed to make practice feel manageable, clear, and gradual.

## Main features

### Materials

The app includes learning content for:

- 12 English tenses
- "To be" forms (am / is / are / was / were)
- Vocabulary categories
- Grammar fundamentals such as parts of speech and sentence structure

### Practice

Users can do:

- Quick Quiz with topic and difficulty selection
- AI Adaptive Test with custom topic, level, and number of questions

### Progress tracking

The app tracks:

- Current learner level
- XP gained from tests
- Daily streaks
- Achievement badges
- Recent test history

## Repository structure

```text
README.md
index.html
```

The full application is contained in `index.html`, including:

- HTML structure
- CSS styling
- JavaScript logic
- Tense lesson data
- Vocabulary data
- Quiz question banks
- Progress logic and UI behavior

## How it works

When the page loads, the user sees a landing page introducing the app and its method. After pressing "Get Started", the app navigates to the main interface with four main sections:

- Dashboard
- Materials
- Practice
- Progress

From there, the learner can:

1. Study grammar or vocabulary
2. Answer quick practice questions
3. Review feedback for each answer
4. Build streaks and XP over time

## How to run

Because this project is a static HTML app, there is no build step or dependency installation required.

### Option 1: Open directly in a browser

1. Clone the repository:

```bash
git clone https://github.com/fadhilarsalan25-coder/ENGSPHERE.git
cd ENGSPHERE
```

2. Open `index.html` in your browser.

On macOS:

```bash
open index.html
```

On Linux:

```bash
xdg-open index.html
```

On Windows, double-click the file in File Explorer.

### Option 2: Serve locally with Python

```bash
cd ENGSPHERE
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## App flow

### Dashboard

The dashboard shows:

- User greeting
- Current level
- XP progress
- Streak count
- Shortcut cards for lessons and quizzes

### Materials

Contains four learning tabs:

- Tenses
- To Be
- Vocabulary
- Grammar

Each section includes explanations and examples.

### Practice

Users can choose a topic and difficulty and start a quiz.

Topics include:

- Mixed
- Tenses
- To Be
- Vocabulary
- Grammar

Difficulty options:

- Beginner
- Intermediate
- Advanced

### Progress

The progress page tracks:

- XP and level
- Daily streak
- Badges
- Recent test history
- Reset progress option

## Tense coverage

The app covers these 12 English tenses:

### Present

- Present Simple
- Present Continuous
- Present Perfect
- Present Perfect Continuous

### Past

- Past Simple
- Past Continuous
- Past Perfect
- Past Perfect Continuous

### Future

- Future Simple
- Future Continuous
- Future Perfect
- Future Perfect Continuous

## Vocabulary categories

The vocabulary section includes topics such as:

- Daily life
- Work & study
- Travel
- Feelings
- Academic vocabulary
- Phrasal verbs

Each vocabulary item includes:

- Word
- Part of speech
- Meaning
- Example sentence

## Grammar topics included

The app introduces fundamental grammar ideas, including:

- Noun
- Verb
- Adjective
- Adverb
- Pronoun
- Preposition
- Conjunction
- Article
- Subject-verb agreement
- Sentence structure
- Negative and question forms

## Intended use

This project is meant to support self-paced English learning, especially for:

- Students preparing grammar basics
- Learners practicing regular vocabulary recall
- People who want short, focused study sessions
- Anyone wanting a simple English practice tool without a complicated setup

## Notes

- This repository is intentionally minimal and static.
- It does not require Node.js, npm, a database, or a backend server for the basic experience.
- The project is best suited as a frontend demo or lightweight learning app.

## License

This repository does not currently include a license file. If you plan to publish or distribute it externally, you may want to add a license explicitly.

## Future improvements

Possible upgrades for this project include:

- Splitting CSS and JavaScript into separate files
- Adding real backend persistence for user progress
- Integrating a real AI API for adaptive questions
- Adding authentication and user accounts
- Supporting multi-language interface options
- Adding export/import of study data

## Summary

ENGSPHERE is a clean, simple English-learning app that combines grammar explanations, vocab practice, and interactive quizzes in one browser-based experience. It is especially useful as a lightweight study tool for learners who want direct, repetitive practice that reinforces understanding rather than just passive reading.
