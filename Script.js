
(function () {
  'use strict';

  /* Content: tenses */
  const TENSES = [
    { time:'Present', aspect:'Simple', name:'Present Simple', formula:'S + V1 (+ s/es)',
      uses:['Habits and routines','General facts and truths','Fixed schedules'],
      ex:['She works at a hospital.','Water boils at 100°C.','The train leaves at 7 a.m.'] },
    { time:'Present', aspect:'Continuous', name:'Present Continuous', formula:'S + am/is/are + V-ing',
      uses:['Happening right now','Temporary situations','Fixed future arrangements'],
      ex:['I am studying for an exam.','He is staying with friends this month.','We are meeting them tomorrow.'] },
    { time:'Present', aspect:'Perfect', name:'Present Perfect', formula:'S + have/has + V3',
      uses:['Past action with a present result','Experience, time unspecified','Started in the past, still true'],
      ex:['I have finished the report.','She has visited Japan twice.','They have lived here since 2019.'] },
    { time:'Present', aspect:'Perfect Continuous', name:'Present Perfect Continuous', formula:'S + have/has been + V-ing',
      uses:['Action that began in the past and continues','Emphasis on duration','Recent activity with visible effect'],
      ex:['I have been waiting for an hour.','He has been working here since June.','You look tired — have you been running?'] },

    { time:'Past', aspect:'Simple', name:'Past Simple', formula:'S + V2',
      uses:['Finished action at a known past time','A sequence of past events','Past habits'],
      ex:['We watched a film last night.','She opened the door and walked in.','He played football every Sunday.'] },
    { time:'Past', aspect:'Continuous', name:'Past Continuous', formula:'S + was/were + V-ing',
      uses:['In progress at a moment in the past','Background to a shorter action','Two actions happening together'],
      ex:['At 8 p.m. I was cooking dinner.','I was reading when the phone rang.','She was talking while he was driving.'] },
    { time:'Past', aspect:'Perfect', name:'Past Perfect', formula:'S + had + V3',
      uses:['An action completed before another past action','Reason for a past situation','Reported speech'],
      ex:['The train had left before we arrived.','He was tired because he had slept badly.','She said she had seen the film.'] },
    { time:'Past', aspect:'Perfect Continuous', name:'Past Perfect Continuous', formula:'S + had been + V-ing',
      uses:['Duration up to a point in the past','Cause of a past result'],
      ex:['They had been driving for six hours before they stopped.','The ground was wet because it had been raining.'] },

    { time:'Future', aspect:'Simple', name:'Future Simple', formula:'S + will + V1',
      uses:['Decision made at the moment of speaking','Prediction','Promise or offer'],
      ex:['I will call you back.','It will probably rain tonight.','We will help you move.'] },
    { time:'Future', aspect:'Continuous', name:'Future Continuous', formula:'S + will be + V-ing',
      uses:['In progress at a future moment','Expected or routine future action'],
      ex:['This time tomorrow I will be flying to Bali.','She will be waiting at the gate.'] },
    { time:'Future', aspect:'Perfect', name:'Future Perfect', formula:'S + will have + V3',
      uses:['Completed before a future deadline'],
      ex:['By Friday I will have finished the project.','They will have arrived by the time you wake up.'] },
    { time:'Future', aspect:'Perfect Continuous', name:'Future Perfect Continuous', formula:'S + will have been + V-ing',
      uses:['Duration up to a future point'],
      ex:['In May I will have been working here for ten years.','By noon he will have been driving for five hours.'] }
  ];

  /* Content: vocabulary */
  const VOCAB = {
    'Daily life': [
      { w:'commute', p:'verb', m:'to travel regularly between home and work', e:'I commute to the office by bus every morning.' },
      { w:'errand', p:'noun', m:'a short trip to do a small job', e:'She ran a few errands after lunch.' },
      { w:'tidy', p:'verb / adjective', m:'to put things in order; neat', e:'Please tidy your desk before you leave.' },
      { w:'routine', p:'noun', m:'a fixed way of doing things regularly', e:'My morning routine starts at six.' },
      { w:'chore', p:'noun', m:'a small, regular household job', e:'Washing the dishes is my least favourite chore.' },
      { w:'spare', p:'adjective', m:'extra; not being used', e:'I read in my spare time.' },
      { w:'grab', p:'verb', m:'to take something quickly (informal)', e:'Let me grab a coffee before we start.' },
      { w:'nearby', p:'adjective / adverb', m:'a short distance away', e:'There is a market nearby.' }
    ],
    'Work & study': [
      { w:'deadline', p:'noun', m:'the latest time something must be finished', e:'The deadline is Friday at noon.' },
      { w:'assign', p:'verb', m:'to give someone a task or duty', e:'The manager assigned the report to me.' },
      { w:'feedback', p:'noun', m:'comments about how well something was done', e:'Thanks for your feedback on the draft.' },
      { w:'draft', p:'noun / verb', m:'an early version of a piece of writing', e:'I sent you the first draft yesterday.' },
      { w:'schedule', p:'noun / verb', m:'a plan of times for events; to arrange a time', e:'Can we schedule the call for Monday?' },
      { w:'overview', p:'noun', m:'a short general description', e:'Give me a quick overview of the results.' },
      { w:'workload', p:'noun', m:'the amount of work a person has', e:'My workload is heavier this month.' },
      { w:'proficiency', p:'noun', m:'a high level of skill in something', e:'The job requires proficiency in English.' }
    ],
    'Travel': [
      { w:'departure', p:'noun', m:'the act of leaving, especially on a journey', e:'Departure is at 9:15 from gate 4.' },
      { w:'itinerary', p:'noun', m:'a plan of a journey and its stops', e:'Our itinerary includes two nights in Lombok.' },
      { w:'accommodation', p:'noun', m:'a place to stay', e:'The price includes flights and accommodation.' },
      { w:'delay', p:'noun / verb', m:'a period of waiting; to make something late', e:'There was a two-hour delay.' },
      { w:'fare', p:'noun', m:'the money you pay for a journey', e:'The bus fare went up last year.' },
      { w:'book', p:'verb', m:'to reserve something in advance', e:'We booked a room near the beach.' },
      { w:'luggage', p:'noun', m:'the bags you take when travelling', e:'Leave your luggage by the door.' },
      { w:'landmark', p:'noun', m:'a well-known building or feature of a place', e:'The mosque is the city’s best-known landmark.' }
    ],
    'Feelings': [
      { w:'grateful', p:'adjective', m:'thankful for something', e:'I am grateful for your help.' },
      { w:'anxious', p:'adjective', m:'worried and uneasy', e:'She felt anxious before the interview.' },
      { w:'relieved', p:'adjective', m:'glad that something bad is over', e:'I was relieved when the results came.' },
      { w:'confident', p:'adjective', m:'sure of yourself or your ability', e:'He is confident about the presentation.' },
      { w:'frustrated', p:'adjective', m:'annoyed because you cannot do something', e:'I get frustrated when the wifi drops.' },
      { w:'content', p:'adjective', m:'quietly happy with what you have', e:'They seem content with the decision.' },
      { w:'overwhelmed', p:'adjective', m:'feeling there is too much to handle', e:'I felt overwhelmed by the emails.' },
      { w:'eager', p:'adjective', m:'very keen to do something', e:'She is eager to start the course.' }
    ],
    'Academic': [
      { w:'analyse', p:'verb', m:'to examine something in detail', e:'We analysed the survey data.' },
      { w:'evidence', p:'noun', m:'facts that support a claim', e:'There is strong evidence for this theory.' },
      { w:'summarise', p:'verb', m:'to state the main points briefly', e:'Summarise the article in one paragraph.' },
      { w:'significant', p:'adjective', m:'important enough to be noticed', e:'The study found a significant difference.' },
      { w:'approach', p:'noun / verb', m:'a way of dealing with something', e:'We took a different approach this time.' },
      { w:'conclude', p:'verb', m:'to decide after thinking; to end', e:'The authors conclude that more research is needed.' },
      { w:'consistent', p:'adjective', m:'staying the same over time; in agreement', e:'Her results were consistent across all tests.' },
      { w:'contrast', p:'noun / verb', m:'a clear difference between two things', e:'In contrast, the second group improved.' }
    ],
    'Phrasal verbs': [
      { w:'look up', p:'phrasal verb', m:'to search for information', e:'Look up the word in a dictionary.' },
      { w:'give up', p:'phrasal verb', m:'to stop trying', e:'Don’t give up after one mistake.' },
      { w:'find out', p:'phrasal verb', m:'to discover a fact', e:'I found out that the office is closed.' },
      { w:'carry on', p:'phrasal verb', m:'to continue', e:'Carry on reading from page ten.' },
      { w:'turn down', p:'phrasal verb', m:'to refuse; to lower volume', e:'He turned down the offer.' },
      { w:'come up with', p:'phrasal verb', m:'to think of an idea or plan', e:'She came up with a better solution.' },
      { w:'put off', p:'phrasal verb', m:'to postpone', e:'They put off the meeting until Thursday.' },
      { w:'get along', p:'phrasal verb', m:'to have a good relationship', e:'I get along well with my colleagues.' }
    ]
  };

  /* Content: quiz question bank */
  const Q = (q, o, a, x) => ({ q, options: o, answer: a, explain: x });

  const BANK = {
    tenses: {
      beginner: [
        Q('She ____ to school every day.', ['go','goes','going','gone'], 1, 'Present Simple with he/she/it adds -s: "She goes."'),
        Q('Right now, they ____ football in the park.', ['play','plays','are playing','played'], 2, 'An action happening now uses Present Continuous: are + V-ing.'),
        Q('Yesterday I ____ a new book.', ['buy','buys','bought','buying'], 2, '"Yesterday" is finished past time, so use Past Simple: bought.'),
        Q('We ____ visit my grandmother tomorrow.', ['will','are','was','have'], 0, 'A future plan or prediction uses will + V1.'),
        Q('He ____ TV when I arrived.', ['watch','watches','was watching','has watched'], 2, 'Past Continuous shows an action in progress when a shorter action interrupted it.'),
        Q('I ____ already finished my homework.', ['has','have','had been','am'], 1, 'Present Perfect with "I" uses have + V3: "I have already finished."'),
        Q('The sun ____ in the east.', ['rise','rises','is rising','rose'], 1, 'General truths take Present Simple; "sun" is third person singular, so "rises".'),
        Q('They ____ dinner at 7 p.m. last night.', ['have','has','had','having'], 2, 'A completed past event at a stated time uses Past Simple: "had dinner".')
      ],
      intermediate: [
        Q('By the time we arrived, the film ____.', ['started','has started','had started','was starting'], 2, 'Past Perfect shows the film started before the other past action (our arrival).'),
        Q('I ____ here since 2020.', ['work','worked','have been working','will work'], 2, '"Since 2020" means it began in the past and continues — Present Perfect Continuous.'),
        Q('This time next week, I ____ on a beach.', ['will lie','will be lying','will have lain','lie'], 1, 'Future Continuous describes an action in progress at a specific future moment.'),
        Q('She ____ the report before the deadline on Friday.', ['will finish','will have finished','finishes','is finishing'], 1, 'Future Perfect = completed before a future point: "will have finished."'),
        Q('He was exhausted because he ____ all night.', ['drove','was driving','had been driving','has driven'], 2, 'Past Perfect Continuous explains the duration causing a past result.'),
        Q('Look at those clouds — it ____.', ['rains','is going to rain','rained','has rained'], 1, 'Present evidence about the near future takes "going to", not Present Simple.'),
        Q('I ____ that film three times.', ['saw','have seen','had seen','was seeing'], 1, 'Experience with no stated time uses Present Perfect: "have seen".'),
        Q('While she ____ , the lights went out.', ['cooked','was cooking','has cooked','had cooked'], 1, '"While" + a longer background action takes Past Continuous.')
      ],
      advanced: [
        Q('Hardly ____ the door when the phone rang.', ['I had closed','had I closed','I closed','did I close'], 1, 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".'),
        Q('By next June, they ____ together for a decade.', ['will work','will be working','will have been working','have worked'], 2, 'Duration up to a future point takes Future Perfect Continuous.'),
        Q('If I ____ about the delay, I would have left earlier.', ['knew','had known','have known','would know'], 1, 'Third conditional: if + Past Perfect, would have + V3.'),
        Q('She said she ____ the documents the previous week.', ['sends','sent','had sent','has sent'], 2, 'Reported speech shifts Past Simple back to Past Perfect.'),
        Q('It is the first time I ____ such a thing.', ['hear','heard','have heard','had heard'], 2, 'After "It is the first time", English uses Present Perfect.'),
        Q('No sooner had the meeting started ____ the power failed.', ['when','than','then','that'], 1, 'The fixed pattern is "No sooner … than".'),
        Q('The bridge ____ by the end of next year.', ['will complete','will be completed','will have completed','completes'], 1, 'Future passive: will be + past participle, because the bridge receives the action.'),
        Q('I would rather you ____ that to anyone.', ['don’t mention','didn’t mention','haven’t mentioned','won’t mention'], 1, 'After "would rather + subject", use the past form for the preference.')
      ]
    },
    tobe: {
      beginner: [
        Q('I ____ a student.', ['am','is','are','be'], 0, '"I" always takes "am".'),
        Q('They ____ in the classroom.', ['am','is','are','was'], 2, 'Plural subjects (they, we, you) take "are".'),
        Q('She ____ tired yesterday.', ['is','was','were','are'], 1, 'Past of "is" for she/he/it is "was".'),
        Q('____ you ready?', ['Is','Am','Are','Be'], 2, 'Questions with "you" use "Are you …?"'),
        Q('It ____ not expensive.', ['am','is','are','be'], 1, '"It" takes "is"; the negative is "is not / isn’t".'),
        Q('We ____ at the beach last Sunday.', ['was','were','are','is'], 1, '"We" takes "were" in the past.'),
        Q('There ____ two books on the table.', ['is','are','am','was'], 1, '"Two books" is plural, so "there are".'),
        Q('He ____ my brother.', ['are','am','is','be'], 2, '"He" takes "is".')
      ],
      intermediate: [
        Q('The letters ____ sent last Monday.', ['was','were','are','is'], 1, 'Passive in the past with a plural subject: "were sent".'),
        Q('____ there any milk left?', ['Are','Is','Were','Am'], 1, '"Milk" is uncountable, so it takes the singular "Is there".'),
        Q('Neither of the answers ____ correct.', ['are','were','is','be'], 2, '"Neither of" is treated as singular in formal English: "is".'),
        Q('The news ____ surprising.', ['are','were','is','be'], 2, '"News" looks plural but is an uncountable singular noun.'),
        Q('If I ____ you, I would apologise.', ['was','were','am','be'], 1, 'The unreal conditional uses "were" for all subjects.'),
        Q('Everyone in the two teams ____ present.', ['are','were','was','be'], 2, '"Everyone" is singular, so it takes "was" regardless of what follows.'),
        Q('The team ____ being interviewed at the moment.', ['is','are','was','be'], 0, 'Present continuous passive with a singular collective noun: "is being interviewed".'),
        Q('There ____ a problem and several delays.', ['were','was','are','be'], 1, 'With "there was/were", the verb agrees with the first noun — "a problem" is singular.')
      ],
      advanced: [
        Q('By the time the project was reviewed, several issues ____ already ____.', ['had','been found','were','found','have','been found','are','finding'], 0, 'Past perfect passive: had been found.'),
        Q('No sooner ____ the statement than the room exploded into debate.', ['had they heard','they had heard','they heard','have they heard'], 0, 'The fixed pattern is "No sooner had they heard..."'),
        Q('If it ____ for your help, I would still be trying to sort it out.', ['wasn’t','weren’t','isn’t','hadn’t been'], 0, 'Third conditional with a real past cause: if it hadn’t been for...'),
        Q('The committee, together with its advisers, ____ expected to issue a report next week.', ['is','are','were','be'], 0, 'The subject is the singular committee.'),
        Q('Had the documents been submitted earlier, the decision ____ different.', ['would be','would have been','will be','is'], 1, 'This is a mixed conditional with the past perfect in the if-clause.'),
        Q('Neither the sales team nor the support team ____ happy with the outcome.', ['was','were','are','be'], 0, 'The verb agrees with the closest subject: team (singular).'),
        Q('The reason she left so suddenly was that she ____ all day and was exhausted.', ['worked','had been working','has been working','works'], 1, 'A past cause with duration leading to a result uses Past Perfect Continuous.'),
        Q('It is essential that everyone ____ informed before the meeting starts.', ['is','be','was','has been'], 1, 'After “essential that,” use the subjunctive “be.”')
      ]
    }
  };

  /* App state */
  const STORAGE_KEY = 'engsphere-state';
  const state = {
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    history: [],
    profiles: [
      { name: null, initials: null, }
    ],
    activeProfile: 0,
    currentView: 'dashboard',
    selectedMaterial: 'tenses',
    selectedPracticeTab: 'quiz',
    selectedTopic: 'mixed',
    selectedDifficulty: 'intermediate',
    selectedAIQuestions: 5,
    openTense: null,
    quiz: null,
    ai: null
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      Object.assign(state, parsed);
      if (!Array.isArray(state.history)) state.history = [];
      if (!Array.isArray(state.profiles)) state.profiles = [{ name: 'Guest', initials: 'G' }];
    } catch (e) {
      console.warn('Could not read state', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  function applyStreak() {
    const today = new Date();
    const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    if (state.lastActiveDay && Math.abs(todayKey - state.lastActiveDay) > 86400000 * 1.5) {
      state.streak = 0;
    }
    state.lastActiveDay = todayKey;
  }

  function levelForXp(xp) {
    return Math.max(1, Math.min(9, Math.floor(xp / 100) + 1));
  }

  function syncLevelUI() {
    const level = levelForXp(state.xp);
    state.level = level;
    const ring = 351.9 * (1 - ((state.xp % 100) / 100));
    const miniPct = (state.xp % 100) / 100;
    document.getElementById('bigRingFg').style.strokeDashoffset = String(ring);
    document.getElementById('miniRingFg').style.strokeDashoffset = String(65.9 * (1 - miniPct));
    document.getElementById('progRingFg').style.strokeDashoffset = String(ring);
    document.getElementById('bigRingLevel').textContent = String(level);
    document.getElementById('miniLevelLabel').textContent = 'Lv ' + level;
    document.getElementById('progRingLevel').textContent = String(level);
    document.getElementById('dashXpText').textContent = state.xp + ' / 100 XP';
    document.getElementById('progXpText').textContent = state.xp + ' / 100 XP';
    document.getElementById('dashStreak').textContent 
    document.getElementById('progStreak').textContent = String(state.streak);
    document.getElementById('miniStreak').textContent = String(state.streak);
    document.getElementById('dashLevelWord').textContent = levelLabel(level);
    const profile = state.profiles[state.activeProfile] || state.profiles[0];
    document.getElementById('profileNameLabel').textContent = profile.name;
    document.getElementById('profileAvatar').textContent = profile.initials;
  }

  function levelLabel(level) {
    if (level <= 2) return 'Beginner';
    if (level <= 5) return 'Intermediate';
    return 'Advanced';
  }

  function renderTenses() {
    const grid = document.getElementById('tenseGrid');
    if (!grid) return;
    grid.innerHTML = '';
    TENSES.forEach((tense, index) => {
      const card = document.createElement('div');
      card.className = 'card tense-card' + (state.openTense === index ? ' open' : '');
      card.innerHTML = `
        <div class="tc-top">
          <div>
            <div class="tc-aspect">${tense.aspect}</div>
            <h4>${tense.name}</h4>
          </div>
          <span class="chev">▼</span>
        </div>
        <div class="tc-formula">${tense.formula}</div>
        <div class="tense-detail" style="max-height:${state.openTense === index ? '420px' : '0px'};">
          <div class="tense-detail-inner">
            <ul>
              ${tense.uses.map(u => `<li>${u}</li>`).join('')}
            </ul>
            <div class="tc-examples">
              ${tense.ex.map(e => `<div class="tc-example">${e}</div>`).join('')}
            </div>
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

  function renderVocabulary() {
    const grid = document.getElementById('vocabGrid');
    const tabs = document.getElementById('vocabCategoryTabs');
    if (!grid || !tabs) return;
    const categories = Object.keys(VOCAB);
    tabs.innerHTML = categories.map((cat, idx) => `<button class="pill ${idx === 0 ? 'active' : ''}" data-vocab-cat="${cat}">${cat}</button>`).join('');
    const category = tabs.dataset.active || categories[0];
    const activeWords = VOCAB[category] || VOCAB[categories[0]];
    grid.innerHTML = activeWords.map((item, idx) => `
      <div class="flashcard" data-flip="${idx}">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="word">${item.w}</div>
            <div class="pos">${item.p}</div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="mean">${item.m}</div>
            <div class="ex">${item.e}</div>
          </div>
        </div>
      </div>
    `).join('');
    tabs.querySelectorAll('[data-vocab-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.dataset.active = btn.dataset.vocabCat;
        renderVocabulary();
      });
    });
    grid.querySelectorAll('.flashcard').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  }

  function setView(name) {
    state.currentView = name;
    document.querySelectorAll('.view').forEach(view => {
      view.classList.toggle('hidden', view.dataset.view !== name);
    });
    document.querySelectorAll('[data-view]').forEach(btn => {
      const isActive = btn.dataset.view === name;
      btn.classList.toggle('active', isActive);
    });
                             
