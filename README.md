# ENGSPHERE

PRACTICE ENGLISH UNTIL IT CLICKS.

ENGSPHERE is a lightweight browser-based English learning app designed to help learners practice grammar, vocabulary, and sentence structure through a simple study loop: read the rule, complete a short exercise, and review the explanation. The project is a static single-page app that runs directly in the browser without a backend or dependency installation.

## What this project does

ENGSPHERE focuses on practical English learning through:

- grammar explanations and examples
- vocabulary flashcards by category
- multiple-choice practice questions
- topic-based quiz flow with selectable difficulty
- progress tracking using XP, streaks, and badges

It is intended for learners who are past the absolute beginner stage but still need structured repetition and feedback.

## Main features

### Materials

The app includes learning content for:

- 12 English tenses
- "to be" forms (am / is / are / was / were)
- vocabulary categories
- grammar basics such as parts of speech and sentence structure

### Practice

Users can take:

- a quick quiz with topic and difficulty selection
- a topic-based test flow that draws from the local question bank in the app

### Progress tracking

The app tracks:

- current learner level
- XP earned from completed quizzes
- daily streaks
- achievement badges
- recent test history

## Repository structure

```text
README.md
index.html
```

The full app is contained in `index.html`, including:

- HTML structure
- CSS styling
- JavaScript logic
- lesson data for tenses and vocabulary
- quiz question bank
- UI logic for practice and progress tracking

## How it works

When the page loads, the user sees a landing page introducing the app and its method. After clicking "Get Started", the app opens the main interface with four main sections:

- Dashboard
- Materials
- Practice
- Progress

From there, the learner can:

1. study grammar or vocabulary
2. answer short practice questions
3. read explanations for each answer
4. track progress over time

## App flow

### Dashboard

The dashboard shows:

- a greeting message
- current level
- XP progress
- streak count
- shortcut cards for lessons and practice

### Materials

The app includes four learning tabs:

- Tenses
- To Be
- Vocabulary
- Grammar

Each section includes explanations and examples.

### Practice

Users can choose a topic and difficulty and start a quiz.

Available topics include:

- Mixed
- Tenses
- To Be
- Vocabulary
- Grammar

Difficulty levels include:

- Beginner
- Intermediate
- Advanced

### Progress

The progress page tracks:

- XP and level
- daily streak
- badges
- recent test history
- reset progress option

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

- word
- part of speech
- meaning
- example sentence

## Grammar topics included

The app introduces grammar fundamentals, including:

- noun
- verb
- adjective
- adverb
- pronoun
- preposition
- conjunction
- article
- subject-verb agreement
- sentence structure
- negative and question forms

## Intended use

This project is meant to support self-paced English learning, especially for:

- students reviewing grammar basics
- learners practicing regular vocabulary recall
- people who want short, focused study sessions
- anyone who wants a simple English practice tool without extra setup

## Notes

- This repository is intentionally minimal and static.
- It does not require Node.js, npm, a database, or a backend server for the basic experience.
- The project is best suited as a frontend demo or lightweight learning app.
- The app contains UI elements for profile/login flows, but no real authentication system or backend is implemented in this repository.
- The question generation flow is driven by client-side data and UI logic rather than a live AI service.

## Future improvements

Possible upgrades for this project include:

- splitting CSS and JavaScript into separate files
- adding real persistence for user progress
- integrating a real AI or backend service for adaptive questions
- adding authentication and user accounts
- supporting multi-language interface options
- adding export/import of study data

## Summary

ENGSPHERE is a simple English-learning app that combines grammar explanations, vocabulary practice, and interactive quizzes in one browser-based experience. It is best described as a lightweight static study tool for learners who want clear explanations, repetition, and short practice sessions without a complicated setup.
