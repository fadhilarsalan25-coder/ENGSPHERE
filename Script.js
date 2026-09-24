
/* EngSphere application logic */
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
      uses:['Duration up to now','Recent activity explaining a current state'],
      ex:['It has been raining for two hours.','I am tired because I have been running.'] },
    { time:'Past', aspect:'Simple', name:'Past Simple', formula:'S + V2 (regular: -ed)',
      uses:['Completed past action','Series of past events','Past habit (or with "used to")'],
      ex:['We saw a film yesterday.','He woke up, had breakfast and left.','I lived abroad as a child.'] },
    { time:'Past', aspect:'Continuous', name:'Past Continuous', formula:'S + was/were + V-ing',
      uses:['Action in progress at a past point','Interrupted past action','Two simultaneous past actions'],
      ex:['At 8 p.m. last night I was cooking.','She was reading when the phone rang.','While he was driving, I was sleeping.'] },
    { time:'Past', aspect:'Perfect', name:'Past Perfect', formula:'S + had + V3',
      uses:['Action completed before another past event','Past cause of a past situation'],
      ex:['When we arrived, the train had left.','She was relieved because she had passed the test.'] },
    { time:'Past', aspect:'Perfect Continuous', name:'Past Perfect Continuous', formula:'S + had been + V-ing',
      uses:['Duration of an action up to a past moment','Ongoing cause of a past result'],
      ex:['They had been waiting for an hour before the bus arrived.','His hands were dirty; he had been gardening.'] },
    { time:'Future', aspect:'Simple', name:'Future Simple (will)', formula:'S + will + V1',
      uses:['Spontaneous decision','Prediction without present evidence','Promise or offer'],
      ex:['I’ll answer the door.','It will probably rain later.','I will help you with that.'] },
    { time:'Future', aspect:'Continuous', name:'Future Continuous', formula:'S + will be + V-ing',
      uses:['Action in progress at a future moment','Routine or scheduled future event'],
      ex:['This time tomorrow, I’ll be flying to Rome.','I will be seeing her at the office anyway.'] },
    { time:'Future', aspect:'Perfect', name:'Future Perfect', formula:'S + will have + V3',
      uses:['Completed before a specific point in the future'],
      ex:['By Friday, she will have finished the assignment.','They will have lived here for ten years by June.'] },
    { time:'Future', aspect:'Perfect Continuous', name:'Future Perfect Continuous', formula:'S + will have been + V-ing',
      uses:['Duration of an action up to a specific future point'],
      ex:['By next month, I will have been working here for five years.'] }
  ];

  /* Content: vocabulary */
  const VOCAB = {
    'Daily life': [
      { w:'chore', p:'noun', m:'a routine task, especially a household one', e:'Doing the laundry is my least favorite chore.' },
      { w:'errand', p:'noun', m:'a short trip to do a job or buy something', e:'I have to run a few errands before dinner.' },
      { w:'commute', p:'noun / verb', m:'the journey between home and work', e:'Her morning commute takes about forty minutes.' },
      { w:'tidy', p:'adj / verb', m:'neat and in good order; to arrange neatly', e:'Please keep your workspace tidy.' },
      { w:'grab', p:'verb', m:'to quickly take or get something (informal)', e:'Let’s grab a quick coffee before the lecture.' },
      { w:'spare', p:'adj', m:'extra, available for use if needed', e:'Do you have a spare pen I could borrow?' }
    ],
    'Work & study': [
      { w:'deadline', p:'noun', m:'the latest time by which something must be done', e:'The deadline for the report is 5 p.m. tomorrow.' },
      { w:'workload', p:'noun', m:'the amount of work to be done by a person', e:'Her workload has increased significantly this quarter.' },
      { w:'overview', p:'noun', m:'a short description that gives the main ideas', e:'He gave a brief overview of the project scope.' },
      { w:'assign', p:'verb', m:'to give someone a particular job or task', e:'The manager assigned the research task to Sarah.' },
      { w:'draft', p:'noun / verb', m:'a preliminary version of a piece of writing', e:'She sent the first draft of the proposal for review.' },
      { w:'feedback', p:'noun', m:'helpful information or criticism about performance', e:'constructive feedback helps learners improve quickly.' }
    ],
    'Travel': [
      { w:'itinerary', p:'noun', m:'a planned route or journey', e:'Our itinerary includes three days in Tokyo and two in Kyoto.' },
      { w:'departure', p:'noun', m:'the act of leaving a place', e:'The flight departure has been delayed by twenty minutes.' },
      { w:'luggage', p:'noun', m:'bags and suitcases containing belongings', e:'Passengers are allowed one piece of carry-on luggage.' },
      { w:'book', p:'verb', m:'to reserve a seat, room or ticket in advance', e:'It is wise to book train tickets several weeks ahead.' },
      { w:'delay', p:'noun / verb', m:'a period of time by which something is late', e:'Fog caused a two-hour delay at the airport.' },
      { w:'fare', p:'noun', m:'the money paid for a journey on public transport', e:'Bus fares are discounted for students and seniors.' }
    ],
    'Feelings': [
      { w:'relieved', p:'adj', m:'happy that something unpleasant has not happened or has ended', e:'She was relieved to hear the exam had been postponed.' },
      { w:'anxious', p:'adj', m:'feeling worried, nervous or uneasy', e:'He felt anxious before giving his first presentation.' },
      { w:'grateful', p:'adj', m:'feeling or showing an appreciation of kindness', e:'I am deeply grateful for all your support this year.' },
      { w:'frustrated', p:'adj', m:'feeling upset or annoyed because you cannot achieve what you want', e:'He became frustrated when the software crashed again.' },
      { w:'eager', p:'adj', m:'wanting very much to do or have something', e:'The students were eager to begin their science experiment.' },
      { w:'overwhelmed', p:'adj', m:'feeling unable to cope with a huge amount of something', e:'She was overwhelmed by the generosity of the community.' }
    ],
    'Academic': [
      { w:'hypothesis', p:'noun', m:'an explanation made on limited evidence as a starting point for investigation', e:'Their hypothesis was confirmed by subsequent laboratory tests.' },
      { w:'evidence', p:'noun', m:'facts or information indicating whether a belief is true', e:'There is no compelling evidence to support that conclusion.' },
      { w:'analyse', p:'verb', m:'to examine the structure of something methodically', e:'Researchers analyzed data collected over ten years.' },
      { w:'significant', p:'adj', m:'sufficiently great or important to be worthy of attention', e:'The study showed a significant improvement in reading skills.' },
      { w:'contrast', p:'noun / verb', m:'the state of being strikingly different from something else', e:'In contrast to the first experiment, the second yielded clear results.' },
      { w:'conclude', p:'verb', m:'to arrive at an opinion or decision by reasoning', e:'The authors concluded that more research was necessary.' }
    ],
    'Phrasal verbs': [
      { w:'give up', p:'phrasal verb', m:'to stop trying or doing something', e:'Never give up, even when the task seems difficult.' },
      { w:'look forward to', p:'phrasal verb', m:'to await eagerly', e:'I look forward to hearing from you soon.' },
      { w:'figure out', p:'phrasal verb', m:'to understand or solve something', e:'It took hours to figure out what was causing the error.' },
      { w:'come up with', p:'phrasal verb', m:'to think of an idea or plan', e:'She came up with a better solution.' },
      { w:'put off', p:'phrasal verb', m:'to postpone', e:'They put off the meeting until Thursday.' },
      { w:'get along', p:'phrasal verb', m:'to have a good relationship', e:'I get along well with my colleagues.' }
    ]
  };

  /* Content: quiz question bank */
  const Q = (q, o, a, x, id) => ({
    id: id || (q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36)),
    q,
    options: o,
    answer: a,
    explain: x
  });

  const BANK = {
    tenses: {
      beginner: [
        Q('She ____ to school every day.', ['go','goes','going','gone'], 1, 'Present Simple with he/she/it adds -s: "She goes."', 'ten-b-1'),
        Q('Right now, they ____ football in the park.', ['play','plays','are playing','played'], 2, 'An action happening now uses Present Continuous: are + V-ing.', 'ten-b-2'),
        Q('Yesterday I ____ a new book.', ['buy','buys','bought','buying'], 2, '"Yesterday" indicates finished past time, so use Past Simple: bought.', 'ten-b-3'),
        Q('We ____ visit my grandmother tomorrow.', ['will','are','was','have'], 0, 'A future plan or prediction uses will + V1.', 'ten-b-4'),
        Q('He ____ TV when I arrived.', ['watch','watches','was watching','has watched'], 2, 'Past Continuous shows an action in progress when a shorter action interrupted it.', 'ten-b-5'),
        Q('I ____ already finished my homework.', ['has','have','had been','am'], 1, 'Present Perfect with "I" uses have + V3: "I have already finished."', 'ten-b-6'),
        Q('The sun ____ in the east.', ['rise','rises','is rising','rose'], 1, 'General truths take Present Simple; "sun" is third person singular, so "rises".', 'ten-b-7'),
        Q('They ____ dinner at 7 p.m. last night.', ['have','has','had','having'], 2, 'A completed past event at a stated time uses Past Simple: "had dinner".', 'ten-b-8')
      ],
      intermediate: [
        Q('By the time we arrived, the film ____.', ['started','has started','had started','was starting'], 2, 'Past Perfect shows the film started before the other past action (our arrival).', 'ten-i-1'),
        Q('I ____ here since 2020.', ['work','worked','have been working','will work'], 2, '"Since 2020" means it began in the past and continues — Present Perfect Continuous.', 'ten-i-2'),
        Q('This time next week, I ____ on a beach.', ['will lie','will be lying','will have lain','lie'], 1, 'Future Continuous describes an action in progress at a specific future moment.', 'ten-i-3'),
        Q('She ____ the report before the deadline on Friday.', ['will finish','will have finished','finishes','is finishing'], 1, 'Future Perfect = completed before a future point: "will have finished."', 'ten-i-4'),
        Q('He was exhausted because he ____ all night.', ['drove','was driving','had been driving','has driven'], 2, 'Past Perfect Continuous explains the duration causing a past result.', 'ten-i-5'),
        Q('Look at those clouds — it ____.', ['rains','is going to rain','rained','has rained'], 1, 'Present evidence about the near future takes "going to", not Present Simple.', 'ten-i-6'),
        Q('I ____ that film three times.', ['saw','have seen','had seen','was seeing'], 1, 'Experience with no stated time uses Present Perfect: "have seen".', 'ten-i-7'),
        Q('While she ____ , the lights went out.', ['cooked','was cooking','has cooked','had cooked'], 1, '"While" + a longer background action takes Past Continuous.', 'ten-i-8')
      ],
      advanced: [
        Q('Hardly ____ the door when the phone rang.', ['I had closed','had I closed','I closed','did I close'], 1, 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".', 'ten-a-1'),
        Q('By next June, they ____ together for a decade.', ['will work','will be working','will have been working','have worked'], 2, 'Duration up to a future point takes Future Perfect Continuous.', 'ten-a-2'),
        Q('If I ____ about the delay, I would have left earlier.', ['knew','had known','have known','would know'], 1, 'Third conditional: if + Past Perfect, would have + V3.', 'ten-a-3'),
        Q('She said she ____ the documents the previous week.', ['sends','sent','had sent','has sent'], 2, 'Reported speech shifts Past Simple back to Past Perfect.', 'ten-a-4'),
        Q('It is the first time I ____ such a thing.', ['hear','heard','have heard','had heard'], 2, 'After "It is the first time", English uses Present Perfect.', 'ten-a-5'),
        Q('No sooner had the meeting started ____ the power failed.', ['when','than','then','that'], 1, 'The fixed pattern is "No sooner … than".', 'ten-a-6'),
        Q('The bridge ____ by the end of next year.', ['will complete','will be completed','will have completed','completes'], 1, 'Future passive: will be + past participle, because the bridge receives the action.', 'ten-a-7'),
        Q('I would rather you ____ that to anyone.', ['don’t mention','didn’t mention','haven’t mentioned','won’t mention'], 1, 'After "would rather + subject", use the past form for the preference.', 'ten-a-8')
      ]
    },
    tobe: {
      beginner: [
        Q('I ____ a student.', ['am','is','are','be'], 0, '"I" always takes "am".', 'tb-b-1'),
        Q('They ____ in the classroom.', ['am','is','are','was'], 2, 'Plural subjects (they, we, you) take "are".', 'tb-b-2'),
        Q('She ____ tired yesterday.', ['is','was','were','are'], 1, 'Past of "is" for she/he/it is "was".', 'tb-b-3'),
        Q('____ you ready?', ['Is','Am','Are','Be'], 2, 'Questions with "you" use "Are you …?"', 'tb-b-4'),
        Q('It ____ not expensive.', ['am','is','are','be'], 1, '"It" takes "is"; the negative is "is not / isn’t".', 'tb-b-5'),
        Q('We ____ at the beach last Sunday.', ['was','were','are','is'], 1, '"We" takes "were" in the past.', 'tb-b-6'),
        Q('There ____ two books on the table.', ['is','are','am','was'], 1, '"Two books" is plural, so "there are".', 'tb-b-7'),
        Q('He ____ my brother.', ['are','am','is','be'], 2, '"He" takes "is".', 'tb-b-8')
      ],
      intermediate: [
        Q('The letters ____ sent last Monday.', ['was','were','are','is'], 1, 'Passive in the past with a plural subject: "were sent".', 'tb-i-1'),
        Q('____ there any milk left?', ['Are','Is','Were','Am'], 1, '"Milk" is uncountable, so it takes the singular "Is there".', 'tb-i-2'),
        Q('Neither of the answers ____ correct.', ['are','were','is','be'], 2, '"Neither of" is treated as singular in formal English: "is".', 'tb-i-3'),
        Q('The news ____ surprising.', ['are','were','is','be'], 2, '"News" looks plural but is an uncountable singular noun.', 'tb-i-4'),
        Q('If I ____ you, I would apologise.', ['was','were','am','be'], 1, 'The unreal conditional uses "were" for all subjects.', 'tb-i-5'),
        Q('Everyone in the two teams ____ present.', ['are','were','was','be'], 2, '"Everyone" is singular, so it takes "was" regardless of what follows.', 'tb-i-6'),
        Q('The team ____ being interviewed at the moment.', ['is','are','was','be'], 0, 'Present continuous passive with a singular collective noun: "is being interviewed".', 'tb-i-7'),
        Q('There ____ a problem and several delays.', ['were','was','are','be'], 1, 'With "there was/were", the verb agrees with the first noun — "a problem" is singular.', 'tb-i-8')
      ],
      advanced: [
        Q('By the time the project was reviewed, several issues ____ already been found.', ['had','were','have','are'], 0, 'Past perfect passive: had been found.', 'tb-a-1'),
        Q('No sooner ____ the statement than the room exploded into debate.', ['had they heard','they had heard','they heard','have they heard'], 0, 'The fixed pattern is "No sooner had they heard..."', 'tb-a-2'),
        Q('If it ____ for your help, I would still be trying to sort it out.', ['wasn’t','weren’t','isn’t','hadn’t been'], 3, 'Third conditional with a real past cause: if it hadn’t been for...', 'tb-a-3'),
        Q('The committee, together with its advisers, ____ expected to issue a report next week.', ['is','are','were','be'], 0, 'The subject is the singular committee.', 'tb-a-4'),
        Q('Had the documents been submitted earlier, the decision ____ different.', ['would be','would have been','will be','is'], 1, 'This is a mixed conditional with the past perfect in the if-clause.', 'tb-a-5'),
        Q('Neither the sales team nor the support team ____ happy with the outcome.', ['was','were','are','be'], 0, 'The verb agrees with the closest subject: team (singular).', 'tb-a-6'),
        Q('The reason she left so suddenly was that she ____ all day and was exhausted.', ['worked','had been working','has been working','works'], 1, 'A past cause with duration leading to a result uses Past Perfect Continuous.', 'tb-a-7'),
        Q('It is essential that everyone ____ informed before the meeting starts.', ['is','be','was','has been'], 1, 'After "essential that," use the subjunctive "be."', 'tb-a-8')
      ]
    },
    vocabulary: {
      beginner: [
        Q('I need to run a few ____ before going home.', ['chores','errands','routines','tasks'], 1, '"Run errands" is the natural collocation for short trips to do small jobs.', 'voc-b-1'),
        Q('Can I ____ a cup of coffee before the meeting starts?', ['grab','tidy','commute','spare'], 0, '"Grab a coffee" is an everyday informal phrase meaning to quickly get a coffee.', 'voc-b-2'),
        Q('Please ____ your desk before you leave the office.', ['tidy','commute','fare','luggage'], 0, '"Tidy" means to make a place or object neat and clean.', 'voc-b-3'),
        Q('How much is the bus ____ to the city center?', ['delay','fare','luggage','booking'], 1, '"Fare" is the money paid for a journey on public transport.', 'voc-b-4'),
        Q('She felt very ____ to all her friends for their support.', ['anxious','grateful','frustrated','overwhelmed'], 1, '"Grateful" means feeling or showing appreciation and thankfulness.', 'voc-b-5'),
        Q('We need to ____ a hotel room near the conference hall.', ['book','delay','tidy','commute'], 0, '"To book" means to reserve accommodation, flights, or tickets.', 'voc-b-6')
      ],
      intermediate: [
        Q('The manager ____ the new marketing project to Sarah.', ['assigned','analysed','concluded','delayed'], 0, '"To assign" means to give someone a particular task, duty, or project.', 'voc-i-1'),
        Q('Our flight was held up by a two-hour ____ due to heavy fog.', ['itinerary','delay','departure','workload'], 1, 'A "delay" is a period of waiting or when something is postponed.', 'voc-i-2'),
        Q('He was greatly ____ after receiving news that the test was postponed.', ['relieved','anxious','eager','frustrated'], 0, '"Relieved" means feeling happy and relaxed because a worry or problem has passed.', 'voc-i-3'),
        Q('Could you please provide a brief ____ of the meeting outcomes?', ['overview','deadline','workload','proficiency'], 0, 'An "overview" is a short summary or general review of key points.', 'voc-i-4'),
        Q('The company expects all applicants to have high ____ in written English.', ['proficiency','evidence','routine','errand'], 0, '"Proficiency" refers to a high degree of competence and skill.', 'voc-i-5'),
        Q('She felt ____ by the sheer volume of unread emails after her holiday.', ['overwhelmed','content','grateful','tidy'], 0, '"Overwhelmed" describes having too much to deal with emotionally or mentally.', 'voc-i-6')
      ],
      advanced: [
        Q('The research team must ____ the survey data before publishing conclusions.', ['analyse','summarise','commute','contrast'], 0, '"Analyse" means examining data or information in careful detail.', 'voc-a-1'),
        Q('The scientists found no compelling ____ to support the initial hypothesis.', ['evidence','feedback','itinerary','overview'], 0, '"Evidence" refers to facts, documents, or data supporting an argument.', 'voc-a-2'),
        Q('We need to ____ a creative solution to address this budget shortfall.', ['come up with','put off','look up to','get along with'], 0, '"Come up with" means to produce or invent an idea, thought, or plan.', 'voc-a-3'),
        Q('Due to unforeseen circumstances, the committee decided to ____ the conference until next spring.', ['put off','tidy up','look down on','get by'], 0, '"Put off" is a phrasal verb meaning to postpone or delay an event.', 'voc-a-4'),
        Q('Her experimental findings were remarkably ____ with earlier published literature.', ['consistent','significant','eager','anxious'], 0, '"Consistent" means in agreement or displaying steady uniformity with something else.', 'voc-a-5'),
        Q('In marked ____ to his predecessor, the new director prefers collaborative decision-making.', ['contrast','approach','evidence','overview'], 0, '"In contrast to" is a standard phrase highlighting clear differences.', 'voc-a-6')
      ]
    },
    grammar: {
      beginner: [
        Q('She bought ____ apple and two oranges at the supermarket.', ['a','an','the','some'], 1, 'Use "an" before words starting with a vowel sound: "an apple".', 'grm-b-1'),
        Q('They arrived in London ____ Friday afternoon.', ['at','on','in','by'], 1, 'Use the preposition "on" for days of the week: "on Friday".', 'grm-b-2'),
        Q('This is the ____ movie I have ever seen.', ['good','better','best','more good'], 2, 'Superlative form of "good" is "the best".', 'grm-b-3'),
        Q('He doesn\'t have ____ money left in his wallet.', ['some','any','many','few'], 1, 'In negative sentences, use "any" for uncountable nouns: "doesn\'t have any money".', 'grm-b-4'),
        Q('Look at those birds! ____ are flying south for the winter.', ['They','Them','Their','Theirs'], 0, 'The subject pronoun for plural animals or things is "They".', 'grm-b-5'),
        Q('The train leaves ____ 8:30 a.m. sharp.', ['at','in','on','to'], 0, 'Use the preposition "at" for specific clock times.', 'grm-b-6')
      ],
      intermediate: [
        Q('If I ____ you, I would consult a professional before deciding.', ['am','was','were','had been'], 2, 'In second (unreal) conditionals, "were" is conventionally used for all subjects.', 'grm-i-1'),
        Q('The package was delivered to someone ____ didn\'t live in this building.', ['which','who','whose','whom'], 1, 'Use the relative pronoun "who" when referring to people as subjects.', 'grm-i-2'),
        Q('Despite ____ early, they still missed the opening speech.', ['to leave','leaving','left','having leave'], 1, 'The preposition "despite" must be followed by a noun or a gerund (V-ing): "despite leaving".', 'grm-i-3'),
        Q('You ____ wear a helmet when riding a motorbike — it is required by law.', ['must','might','could','would'], 0, '"Must" conveys mandatory obligation or legal requirement.', 'grm-i-4'),
        Q('She avoided ____ to the press about the confidential agreement.', ['to speak','speaking','speak','spoken'], 1, 'The verb "avoid" is followed by a gerund: "avoided speaking".', 'grm-i-5'),
        Q('Neither the teacher nor the students ____ aware of the timetable change.', ['was','were','is','be'], 1, 'When connecting subjects with "neither... nor", the verb agrees with the subject closest to it: "students were".', 'grm-i-6')
      ],
      advanced: [
        Q('Scarcely ____ the station when the train pulled away from the platform.', ['had we reached','we had reached','we reached','did we reach'], 0, 'Negative inversions with "scarcely... when" require inversion of auxiliary and subject: "scarcely had we reached".', 'grm-a-1'),
        Q('The proposal was approved on condition that further funding ____ secured.', ['be','is','was','were'], 0, 'In formal English with conditions or stipulations, the present subjunctive "be" is used.', 'grm-a-2'),
        Q('Had you warned me beforehand, I ____ such a costly mistake.', ['would not make','would not have made','will not make','had not made'], 1, 'Inverted third conditional: "Had you warned me... I would not have made...".', 'grm-a-3'),
        Q('The manager insisted that every employee ____ punctual for the audit.', ['is','be','was','must be'], 1, 'Verbs of demand like "insist that" take the subjunctive base form: "be".', 'grm-a-4'),
        Q('She was accused of ____ confidential company files to a competitor.', ['leaking','to leak','leak','having leaked'], 0, 'The preposition "of" takes a gerund: "accused of leaking".', 'grm-a-5'),
        Q('Not until the following morning ____ the full extent of the damage.', ['did they realize','they realized','had they realize','they did realize'], 0, 'Fronted negative phrase "Not until..." requires subject-auxiliary inversion.', 'grm-a-6')
      ]
    }
  };

  /* App state */
  const STORAGE_KEY = 'engsphere-state';
  const state = {
    isLoggedIn: false,
    theme: 'dark',
    lang: 'en',
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    history: [],
    users: [
      { id: 'usr_default', name: 'Learner', initials: 'L', email: 'learner@engsphere.app', password: '', level: 'intermediate', goal: 'conversation' }
    ],
    profiles: [
      { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' }
    ],
    activeProfile: 0,
    personalizedLearning: {
      goal: 'conversation',
      level: 'intermediate',
      dailyXpGoal: 100,
      customNotes: 'Focus on everyday speaking tenses and clear explanations for incorrect choices.'
    },
    currentView: 'dashboard',
    selectedMaterial: 'tenses',
    selectedPracticeTab: 'quiz',
    selectedTopic: 'mixed',
    selectedDifficulty: 'intermediate',
    selectedAIQuestions: 5,
    openTense: null,
    quiz: null,
    ai: null,
    reviewQuestions: [],
    reviewFilter: 'all'
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatTopic(topic) {
    const map = {
      tenses: 'Tenses',
      tobe: 'To Be',
      vocabulary: 'Vocabulary',
      grammar: 'Grammar',
      mixed: 'Mixed'
    };
    return map[topic] || capitalize(topic) || 'General';
  }

  function formatTimeAgo(ts) {
    if (!ts) return 'recently';
    const diff = Math.max(0, Date.now() - ts);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function showToast(message, isWarn) {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (isWarn ? ' warn' : '');
    toast.innerHTML = `<span>${isWarn ? '⚠️' : '✨'}</span><span>${escapeHtml(message)}</span>`;
    wrap.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      toast.style.transition = 'all .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      Object.assign(state, parsed);
      if (!Array.isArray(state.history)) state.history = [];
      if (!Array.isArray(state.users) || !state.users.length) {
        state.users = [
          { id: 'usr_default', name: 'Learner', initials: 'L', email: 'learner@engsphere.app', password: '', level: 'intermediate', goal: 'conversation' }
        ];
      }
      if (!Array.isArray(state.profiles) || !state.profiles.length) {
        state.profiles = [{ name: 'Learner', initials: 'L', email: 'learner@engsphere.app' }];
      } else {
        state.profiles.forEach(p => {
          if (!p.email) p.email = `${(p.name || 'learner').toLowerCase().replace(/\s+/g,'')}@engsphere.app`;
          if (!p.initials) p.initials = (p.name || 'L').charAt(0).toUpperCase();
        });
      }
      if (!Array.isArray(state.reviewQuestions)) {
        state.reviewQuestions = [];
      }
      if (!state.personalizedLearning) {
        state.personalizedLearning = {
          goal: 'conversation',
          level: 'intermediate',
          dailyXpGoal: 100,
          customNotes: ''
        };
      }
      if (!state.theme) {
        state.theme = 'dark';
      }
      if (!state.lang || (state.lang !== 'id' && state.lang !== 'en')) {
        state.lang = 'en';
      }
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

  function levelLabel(level) {
    if (level <= 2) return 'Beginner';
    if (level <= 5) return 'Intermediate';
    return 'Advanced';
  }

  function applyTheme(theme, save = true) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    if (state.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
    }
    const themeLabel = document.getElementById('themeStatusLabel');
    if (themeLabel) {
      themeLabel.textContent = state.theme === 'light' ? 'Crisp Light Mode' : 'Dark Navy Mode';
    }
    const themeToggle = document.getElementById('themeToggleBtn');
    if (themeToggle) {
      themeToggle.setAttribute('aria-checked', state.theme === 'light' ? 'true' : 'false');
    }
    if (save) saveState();
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme, true);
    showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`);
  }

  /* LANGUAGE / I18N SUPPORT (English & Bahasa Indonesia) */
  const I18N = {
    en: {
      langCode: 'EN',
      langTitle: 'English (EN)',
      switchMsg: 'Switched language to English 🇬🇧',
      nav_dashboard: '🏠 Dashboard',
      nav_materials: '📘 Materials',
      nav_practice: '🎯 Practice',
      nav_progress: '📈 Progress',
      landing_login: 'Log in',
      landing_signup: 'Sign up / Get Started',
      landing_cta_start: '🚀 Sign up / Get Started',
      landing_cta_login: 'Log in to account',
      landing_cta_inside: "See what's inside",
      final_start: '🚀 Sign up / Get Started Free',
      final_login: 'I already have an account',
      dash_start_quiz: 'Start a quiz',
      dash_browse_mat: 'Browse materials',
      landing_hero_title: 'Practice English until it clicks.',
      landing_hero_lede: 'Clear lessons on tenses, verb forms, vocabulary and grammar — paired with quizzes that adjust to your level so practice never feels too easy or too hard.',
      ls_label_1: 'tenses, each with formula, usage and examples',
      ls_label_2: 'levels — Beginner, Intermediate, Advanced',
      ls_label_3: 'AI-generated questions, never the same test twice',
      final_cta_h2: 'Pick a level and start a round.',
      final_cta_p: 'It takes about three minutes. Your progress saves on this device.',
      landing_footer: 'EngSphere — built for focused, self-paced English practice.',
      dash_greeting: 'Welcome back',
      dash_desc_prefix: "You're set to",
      dash_desc_suffix: 'level. Jump back into a lesson or run a quick quiz to keep your streak alive.'
    },
    id: {
      langCode: 'ID',
      langTitle: 'Bahasa Indonesia (ID)',
      switchMsg: 'Bahasa berhasil diubah ke Bahasa Indonesia 🇮🇩',
      nav_dashboard: '🏠 Dasbor',
      nav_materials: '📘 Materi',
      nav_practice: '🎯 Latihan',
      nav_progress: '📈 Progres',
      landing_login: 'Masuk',
      landing_signup: 'Daftar / Mulai',
      landing_cta_start: '🚀 Daftar / Mulai Sekarang',
      landing_cta_login: 'Masuk ke Akun',
      landing_cta_inside: 'Lihat Isi Materi',
      final_start: '🚀 Daftar & Mulai Gratis',
      final_login: 'Saya sudah punya akun',
      dash_start_quiz: 'Mulai Kuis',
      dash_browse_mat: 'Telusuri Materi',
      landing_hero_title: 'Latihan Bahasa Inggris sampai benar-benar paham.',
      landing_hero_lede: 'Pelajaran tenses, bentuk kata kerja, kosakata, dan tata bahasa — dipadukan kuis adaptif sesuai level kemampuan Anda.',
      ls_label_1: 'tenses, lengkap rumus, fungsi & contoh',
      ls_label_2: 'tingkat — Pemula, Menengah, Mahir',
      ls_label_3: 'soal latihan berbasis AI tanpa batas',
      final_cta_h2: 'Pilih tingkat dan mulai latihan sekarang.',
      final_cta_p: 'Hanya butuh 3 menit. Progres Anda otomatis tersimpan di perangkat ini.',
      landing_footer: 'EngSphere — dirancang untuk latihan mandiri bahasa Inggris secara fokus.',
      dash_greeting: 'Selamat datang kembali',
      dash_desc_prefix: 'Level Anda saat ini:',
      dash_desc_suffix: '. Lanjutkan materi atau mulai kuis cepat untuk menjaga streak harian Anda.'
    }
  };

  function closeAllLangDropdowns() {
    document.querySelectorAll('.lang-dropdown').forEach(dd => dd.classList.add('hidden'));
    document.querySelectorAll('.lang-switcher-wrap').forEach(w => {
      w.classList.remove('open');
      const btn = w.querySelector('.lang-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function applyLanguage(lang, save = true) {
    if (lang !== 'id' && lang !== 'en') lang = 'en';
    state.lang = lang;
    const t = I18N[lang] || I18N.en;

    document.documentElement.lang = lang;

    // Update switcher labels
    ['landingLangLabel', 'appLangLabel', 'modalLangLabel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = t.langCode;
    });

    // Update modal language status description
    const modalStatus = document.getElementById('modalLangStatusLabel');
    if (modalStatus) modalStatus.textContent = t.langTitle;

    // Update active state in dropdown options
    document.querySelectorAll('.lang-opt').forEach(opt => {
      const isMatch = opt.dataset.setLang === lang;
      opt.classList.toggle('active', isMatch);
    });

    // Update checkmarks in dropdowns
    const isEn = lang === 'en';
    const isId = lang === 'id';
    const checkEnIds = ['checkLandingEn', 'checkAppEn', 'checkModalEn'];
    const checkIdIds = ['checkLandingId', 'checkAppId', 'checkModalId'];
    checkEnIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', !isEn);
    });
    checkIdIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', !isId);
    });

    // Update data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update specific landing elements
    const heroTitle = document.getElementById('landingHeroTitle');
    if (heroTitle) heroTitle.textContent = t.landing_hero_title;

    const heroLede = document.getElementById('landingHeroLede');
    if (heroLede) heroLede.textContent = t.landing_hero_lede;

    const ls1 = document.getElementById('lsLabel1');
    if (ls1) ls1.textContent = t.ls_label_1;

    const ls2 = document.getElementById('lsLabel2');
    if (ls2) ls2.textContent = t.ls_label_2;

    const ls3 = document.getElementById('lsLabel3');
    if (ls3) ls3.textContent = t.ls_label_3;

    const finalH2 = document.getElementById('finalCtaH2');
    if (finalH2) finalH2.textContent = t.final_cta_h2;

    const finalP = document.getElementById('finalCtaP');
    if (finalP) finalP.textContent = t.final_cta_p;

    const footer = document.getElementById('landingFooter');
    if (footer) footer.textContent = t.landing_footer;

    const dashGreeting = document.getElementById('dashGreeting');
    if (dashGreeting) dashGreeting.textContent = t.dash_greeting;

    const dashDesc = document.getElementById('dashDesc');
    if (dashDesc) {
      const lvl = levelLabel(state.level || 1);
      dashDesc.innerHTML = `${t.dash_desc_prefix} <strong id="dashLevelWord">${lvl}</strong> ${t.dash_desc_suffix}`;
    }

    // Update Materials Subtabs
    const msubTenses = document.querySelector('[data-msub="tenses"]');
    if (msubTenses) msubTenses.textContent = lang === 'id' ? 'Tata Bahasa (Tenses)' : 'Tenses';
    const msubTobe = document.querySelector('[data-msub="tobe"]');
    if (msubTobe) msubTobe.textContent = 'To Be';
    const msubVocab = document.querySelector('[data-msub="vocabulary"]');
    if (msubVocab) msubVocab.textContent = lang === 'id' ? 'Kosakata (Vocabulary)' : 'Vocabulary';
    const msubGrammar = document.querySelector('[data-msub="grammar"]');
    if (msubGrammar) msubGrammar.textContent = lang === 'id' ? 'Aturan Tata Bahasa' : 'Grammar Rules';

    // Update Practice Subtabs
    const ptabQuiz = document.querySelector('[data-ptab="quiz"]');
    if (ptabQuiz) ptabQuiz.textContent = lang === 'id' ? '🎯 Kuis Cepat' : '🎯 Quick Quiz';
    const ptabAi = document.querySelector('[data-ptab="ai"]');
    if (ptabAi) ptabAi.textContent = lang === 'id' ? '✨ Kuis Adaptif AI' : '✨ AI Adaptive Test';

    // Close any open dropdowns
    closeAllLangDropdowns();

    if (save) {
      saveState();
      showToast(t.switchMsg);
    }
  }

  function initLanguageSwitcher() {
    const pairs = [
      { btn: 'landingLangBtn', dd: 'landingLangDropdown', wrap: 'landingLangWrap' },
      { btn: 'appLangBtn', dd: 'appLangDropdown', wrap: 'appLangWrap' },
      { btn: 'modalLangBtn', dd: 'modalLangDropdown', wrap: 'modalLangWrap' }
    ];

    pairs.forEach(({ btn, dd, wrap }) => {
      const buttonEl = document.getElementById(btn);
      const dropdownEl = document.getElementById(dd);
      const wrapEl = document.getElementById(wrap);

      if (buttonEl && dropdownEl && wrapEl) {
        buttonEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasOpen = !dropdownEl.classList.contains('hidden');
          closeAllLangDropdowns();
          if (!wasOpen) {
            dropdownEl.classList.remove('hidden');
            wrapEl.classList.add('open');
            buttonEl.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });

    // Option clicks
    document.querySelectorAll('.lang-opt[data-set-lang]').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetLang = opt.dataset.setLang;
        applyLanguage(targetLang, true);
      });
    });

    // Document click closes all
    document.addEventListener('click', () => {
      closeAllLangDropdowns();
    });

    // ESC key closes all
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllLangDropdowns();
      }
    });
  }

  function syncProfileHubUI() {
    const profile = state.profiles[state.activeProfile] || state.profiles[0] || { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' };
    const nameLabel = document.getElementById('profileNameLabel');
    if (nameLabel) nameLabel.textContent = profile.name || 'Learner';
    const avatar = document.getElementById('profileAvatar');
    if (avatar) avatar.textContent = profile.initials || 'L';

    // Hub modal elements
    const hubAvatar = document.getElementById('hubAvatar');
    if (hubAvatar) hubAvatar.textContent = profile.initials || 'L';
    const hubName = document.getElementById('hubNameLabel');
    if (hubName) hubName.textContent = profile.name || 'Learner';
    const hubEmail = document.getElementById('hubEmailLabel');
    if (hubEmail) hubEmail.textContent = profile.email || `${(profile.name || 'learner').toLowerCase().replace(/\s+/g,'')}@engsphere.app`;
    const hubBadge = document.getElementById('hubLevelBadge');
    if (hubBadge) hubBadge.textContent = `Level ${state.level} · ${levelLabel(state.level)}`;

    // Metrics: Amount of XP for streak
    const hubStreak = document.getElementById('hubMetricStreak');
    if (hubStreak) hubStreak.textContent = `🔥 ${state.streak}`;
    const hubXp = document.getElementById('hubMetricXp');
    if (hubXp) hubXp.textContent = `⚡ ${state.xp}`;
    const hubLevel = document.getElementById('hubMetricLevel');
    if (hubLevel) hubLevel.textContent = `Lv ${state.level}`;

    const xpInLevel = state.xp % 100;
    const hubXpBar = document.getElementById('hubXpBar');
    if (hubXpBar) hubXpBar.style.width = `${xpInLevel}%`;
    const hubXpText = document.getElementById('hubXpProgressText');
    if (hubXpText) hubXpText.textContent = `${xpInLevel} / 100 XP to Level ${state.level + 1}`;

    const hubStreakText = document.getElementById('hubStreakStatusText');
    if (hubStreakText) {
      if (state.streak > 0) {
        hubStreakText.textContent = `🔥 Active ${state.streak}-day streak! Keep up your daily momentum.`;
      } else {
        hubStreakText.textContent = `Complete today's quiz to build your daily streak flame!`;
      }
    }

    const hubReviewCount = document.getElementById('hubReviewCountText');
    if (hubReviewCount) {
      const count = (state.reviewQuestions || []).length;
      hubReviewCount.textContent = `${count} question${count === 1 ? '' : 's'}`;
    }

    // Personalized inputs sync
    if (state.personalizedLearning) {
      const persGoal = document.getElementById('persGoalSelect');
      if (persGoal && state.personalizedLearning.goal) persGoal.value = state.personalizedLearning.goal;

      const persNotes = document.getElementById('persNotesInput');
      if (persNotes && state.personalizedLearning.customNotes !== undefined) persNotes.value = state.personalizedLearning.customNotes;

      document.querySelectorAll('#persLevelChips button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.persLevel === state.personalizedLearning.level);
      });

      document.querySelectorAll('#persGoalChips button').forEach(btn => {
        btn.classList.toggle('active', String(btn.dataset.dailyXp) === String(state.personalizedLearning.dailyXpGoal));
      });
    }
  }

  function syncLevelUI() {
    const level = levelForXp(state.xp);
    state.level = level;
    const ring = 351.9 * (1 - ((state.xp % 100) / 100));
    const miniPct = (state.xp % 100) / 100;
    const bigRingFg = document.getElementById('bigRingFg');
    if (bigRingFg) bigRingFg.style.strokeDashoffset = String(ring);
    const miniRingFg = document.getElementById('miniRingFg');
    if (miniRingFg) miniRingFg.style.strokeDashoffset = String(65.9 * (1 - miniPct));
    const progRingFg = document.getElementById('progRingFg');
    if (progRingFg) progRingFg.style.strokeDashoffset = String(ring);

    const bigLevel = document.getElementById('bigRingLevel');
    if (bigLevel) bigLevel.textContent = String(level);
    const miniLevel = document.getElementById('miniLevelLabel');
    if (miniLevel) miniLevel.textContent = 'Lv ' + level;
    const progLevel = document.getElementById('progRingLevel');
    if (progLevel) progLevel.textContent = String(level);

    const dashXp = document.getElementById('dashXpText');
    if (dashXp) dashXp.textContent = (state.xp % 100) + ' / 100 XP (Total: ' + state.xp + ')';
    const progXp = document.getElementById('progXpText');
    if (progXp) progXp.textContent = (state.xp % 100) + ' / 100 XP (Total: ' + state.xp + ')';

    const dashStreak = document.getElementById('dashStreak');
    if (dashStreak) dashStreak.textContent = String(state.streak);
    const progStreak = document.getElementById('progStreak');
    if (progStreak) progStreak.textContent = String(state.streak);
    const miniStreak = document.getElementById('miniStreak');
    if (miniStreak) miniStreak.textContent = String(state.streak);

    const dashLevelWord = document.getElementById('dashLevelWord');
    if (dashLevelWord) dashLevelWord.textContent = levelLabel(level);

    syncProfileHubUI();
  }

  function addXp(amount, label) {
    const oldLevel = levelForXp(state.xp);
    state.xp = Math.max(0, state.xp + amount);
    const newLevel = levelForXp(state.xp);

    if (newLevel > oldLevel) {
      showToast(`Level Up! You reached Level ${newLevel}! 🎉`);
    }

    state.history.unshift({
      label,
      score: amount ? 100 : 0,
      timestamp: Date.now()
    });
    state.history = state.history.slice(0, 10);

    syncLevelUI();
    renderBadges();
    renderHistory();
    saveState();
  }

  /* REVIEW SECTION LOGIC */
  function recordIncorrectQuestion(question, userPickIndex, topic, difficulty) {
    if (!question) return;
    if (!Array.isArray(state.reviewQuestions)) {
      state.reviewQuestions = [];
    }

    const qId = question.id || question.q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36);
    const existingIndex = state.reviewQuestions.findIndex(item => item.id === qId || item.q === question.q);
    const userOption = (question.options && question.options[userPickIndex] !== undefined)
      ? question.options[userPickIndex]
      : 'No answer';
    const correctOption = (question.options && question.options[question.answer] !== undefined)
      ? question.options[question.answer]
      : '';

    if (existingIndex >= 0) {
      const existing = state.reviewQuestions[existingIndex];
      existing.timesIncorrect = (existing.timesIncorrect || 1) + 1;
      existing.userPick = userPickIndex;
      existing.userOption = userOption;
      existing.timestamp = Date.now();
      existing.mastered = false;
      // Move to top of the queue
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

    saveState();
    renderReviewSection();
  }

  function markQuestionMastered(id) {
    const item = state.reviewQuestions.find(q => q.id === id);
    if (!item) return;
    item.mastered = true;
    addXp(5, 'Review mastery');
    showToast('Question marked as mastered! +5 XP');
    saveState();
    renderReviewSection();
  }

  function removeReviewQuestion(id) {
    state.reviewQuestions = state.reviewQuestions.filter(q => q.id !== id);
    showToast('Question removed from review list.');
    saveState();
    renderReviewSection();
  }

  function clearMasteredReviewQuestions() {
    const initialCount = state.reviewQuestions.length;
    state.reviewQuestions = state.reviewQuestions.filter(q => !q.mastered);
    const removed = initialCount - state.reviewQuestions.length;
    showToast(`Cleared ${removed} mastered question${removed === 1 ? '' : 's'}.`);
    saveState();
    renderReviewSection();
  }

  function seedSampleReviewQuestions() {
    state.reviewQuestions = [
      {
        id: 'sample-ten-i-1',
        q: 'By the time we arrived, the film ____.',
        options: ['started', 'has started', 'had started', 'was starting'],
        answer: 2,
        correctOption: 'had started',
        userPick: 0,
        userOption: 'started',
        explain: 'Past Perfect shows the film started before the other past action (our arrival): "had started".',
        topic: 'tenses',
        difficulty: 'intermediate',
        timesIncorrect: 2,
        timestamp: Date.now() - 3600000,
        mastered: false
      },
      {
        id: 'sample-ten-a-1',
        q: 'Hardly ____ the door when the phone rang.',
        options: ['I had closed', 'had I closed', 'I closed', 'did I close'],
        answer: 1,
        correctOption: 'had I closed',
        userPick: 0,
        userOption: 'I had closed',
        explain: 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".',
        topic: 'tenses',
        difficulty: 'advanced',
        timesIncorrect: 1,
        timestamp: Date.now() - 7200000,
        mastered: false
      }
    ];
    saveState();
    renderReviewSection();
    showToast('Loaded 2 sample missed questions for review!');
  }

  function startReviewQuiz() {
    const unmastered = state.reviewQuestions.filter(q => !q.mastered);
    const pool = unmastered.length ? unmastered : state.reviewQuestions;
    if (!pool.length) {
      showToast('No review questions available right now!', true);
      return;
    }

    state.quiz = {
      questions: pool.map(item => ({
        id: item.id,
        q: item.q,
        options: [...item.options],
        answer: item.answer,
        explain: item.explain,
        topic: item.topic,
        difficulty: item.difficulty,
        isReviewItem: true
      })),
      current: 0,
      score: 0,
      isReviewMode: true
    };

    setView('practice');
    const qNode = document.getElementById('ptab-quiz');
    const aNode = document.getElementById('ptab-ai');
    if (qNode) qNode.classList.remove('hidden');
    if (aNode) aNode.classList.add('hidden');
    document.querySelectorAll('[data-ptab]').forEach(t => {
      t.classList.toggle('active', t.dataset.ptab === 'quiz');
    });

    renderQuiz();
    const playArea = document.getElementById('quizPlayArea');
    if (playArea) {
      playArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function renderReviewSection() {
    const listEl = document.getElementById('reviewQuestionsList');
    const countBadge = document.getElementById('reviewCountBadge');
    const filtersBar = document.getElementById('reviewFiltersBar');
    const startQuizBtn = document.getElementById('startReviewQuizBtn');
    const clearMasteredBtn = document.getElementById('clearMasteredBtn');
    const summaryEl = document.getElementById('reviewStatsSummary');
    if (!listEl) return;

    if (!Array.isArray(state.reviewQuestions)) {
      state.reviewQuestions = [];
    }

    const allItems = state.reviewQuestions;
    const activeItems = allItems.filter(i => !i.mastered);
    const masteredItems = allItems.filter(i => i.mastered);

    if (countBadge) {
      countBadge.textContent = String(activeItems.length);
      countBadge.style.display = activeItems.length > 0 ? 'inline-flex' : 'none';
    }

    if (allItems.length === 0) {
      if (filtersBar) filtersBar.style.display = 'none';
      if (startQuizBtn) startQuizBtn.style.display = 'none';
      if (clearMasteredBtn) clearMasteredBtn.style.display = 'none';

      listEl.innerHTML = `
        <div class="card review-empty-state">
          <div class="review-empty-icon">🎯</div>
          <h4>All Caught Up! No Questions Need Review</h4>
          <p>Whenever you answer a question incorrectly during a Quick Quiz or AI Adaptive Test, EngSphere automatically logs it here along with the grammatical explanation and an instant retry option.</p>
          <div class="review-empty-actions">
            <button class="btn btn-primary btn-sm" id="emptyPracticeBtn">Start a Practice Quiz</button>
            <button class="btn btn-ghost btn-sm" id="seedReviewSampleBtn">Load 2 Sample Mistakes to Test</button>
          </div>
        </div>
      `;

      const emptyPracticeBtn = document.getElementById('emptyPracticeBtn');
      if (emptyPracticeBtn) {
        emptyPracticeBtn.addEventListener('click', () => {
          setView('practice');
        });
      }
      const seedBtn = document.getElementById('seedReviewSampleBtn');
      if (seedBtn) {
        seedBtn.addEventListener('click', seedSampleReviewQuestions);
      }
      return;
    }

    // Has items
    if (filtersBar) filtersBar.style.display = 'flex';
    if (startQuizBtn) {
      startQuizBtn.style.display = activeItems.length > 0 ? 'inline-flex' : 'none';
      startQuizBtn.textContent = `⚡ Start Review Quiz (${activeItems.length})`;
    }
    if (clearMasteredBtn) {
      clearMasteredBtn.style.display = masteredItems.length > 0 ? 'inline-flex' : 'none';
    }

    const filter = state.reviewFilter || 'all';
    const filtered = allItems.filter(item => {
      if (filter === 'all') return true;
      return (item.topic || '').toLowerCase() === filter.toLowerCase();
    });

    if (summaryEl) {
      summaryEl.textContent = `${filtered.length} of ${allItems.length} question${allItems.length === 1 ? '' : 's'} (${masteredItems.length} mastered)`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="card empty-state" style="padding:var(--sp-6);">
          No review questions found under topic <strong>"${formatTopic(filter)}"</strong>.
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => {
      const isMastered = !!item.mastered;
      const timeAgo = formatTimeAgo(item.timestamp);
      const timesText = item.timesIncorrect > 1 ? `Missed ${item.timesIncorrect}×` : 'Missed 1×';
      const topicName = formatTopic(item.topic);

      return `
        <div class="card review-card ${isMastered ? 'mastered' : ''}" id="review-card-${item.id}">
          <div class="review-card-top">
            <div class="review-meta">
              <span class="review-topic-tag">${escapeHtml(topicName)}</span>
              <span class="review-meta-dot">·</span>
              <span>${capitalize(item.difficulty || 'Intermediate')}</span>
              <span class="review-meta-dot">·</span>
              <span class="review-meta-missed">${timesText}</span>
              <span class="review-meta-dot">·</span>
              <span>${timeAgo}</span>
              ${isMastered ? '<span class="review-meta-dot">·</span><span style="color:var(--success);font-weight:700;">✓ Mastered</span>' : ''}
            </div>
            <div class="review-card-top-actions">
              ${!isMastered ? `
                <button class="btn-text-action master-btn" data-action="master" data-id="${item.id}" title="Mark this question as mastered">
                  ✓ Mark Mastered
                </button>
              ` : ''}
              <button class="btn-text-action" data-action="remove" data-id="${item.id}" title="Remove question from review">
                ✕ Remove
              </button>
            </div>
          </div>

          <h4 class="review-q-text">${escapeHtml(item.q)}</h4>

          <div class="review-answers-comparison">
            <div class="review-ans-box your-pick">
              <span class="review-ans-label">
                <span style="font-weight:800;">✕</span> Your Answer
              </span>
              <span class="review-ans-val">${escapeHtml(item.userOption || '(incorrect)')}</span>
            </div>
            <div class="review-ans-box correct-pick">
              <span class="review-ans-label">
                <span style="font-weight:800;">✓</span> Correct Answer
              </span>
              <span class="review-ans-val">${escapeHtml(item.correctOption)}</span>
            </div>
          </div>

          <div class="review-explain-callout">
            <strong>💡 Rule & Explanation:</strong> ${escapeHtml(item.explain)}
          </div>

          <div class="review-card-footer">
            <button class="btn btn-ghost btn-sm review-toggle-practice-btn" data-action="toggle-practice" data-id="${item.id}">
              🔄 Practice this question now
            </button>
            ${isMastered ? '<span style="font-size:.82rem;color:var(--success);font-weight:600;">✨ You mastered this item!</span>' : ''}
          </div>

          <div class="review-practice-box hidden" id="practice-box-${item.id}">
            <div class="review-practice-header">Select the correct option to test yourself:</div>
            <div class="review-practice-options">
              ${item.options.map((opt, idx) => `
                <button class="review-practice-btn" data-q-id="${item.id}" data-opt-idx="${idx}">
                  ${escapeHtml(opt)}
                </button>
              `).join('')}
            </div>
            <div class="review-practice-feedback hidden" id="practice-feedback-${item.id}"></div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card action handlers
    listEl.querySelectorAll('[data-action="master"]').forEach(btn => {
      btn.addEventListener('click', () => markQuestionMastered(btn.dataset.id));
    });

    listEl.querySelectorAll('[data-action="remove"]').forEach(btn => {
      btn.addEventListener('click', () => removeReviewQuestion(btn.dataset.id));
    });

    listEl.querySelectorAll('[data-action="toggle-practice"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const box = document.getElementById(`practice-box-${id}`);
        if (box) {
          box.classList.toggle('hidden');
          btn.textContent = box.classList.contains('hidden') ? '🔄 Practice this question now' : '▲ Close practice';
        }
      });
    });

    listEl.querySelectorAll('.review-practice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.qId;
        const pickIdx = Number(btn.dataset.optIdx);
        const item = state.reviewQuestions.find(q => q.id === qId);
        if (!item) return;

        const box = document.getElementById(`practice-box-${qId}`);
        const feedback = document.getElementById(`practice-feedback-${qId}`);
        const allBtns = box.querySelectorAll('.review-practice-btn');

        const isCorrect = pickIdx === item.answer;

        if (isCorrect) {
          btn.classList.add('correct');
          allBtns.forEach(b => { b.disabled = true; });
          if (feedback) {
            feedback.className = 'review-practice-feedback success';
            feedback.innerHTML = '🎉 <strong>Correct!</strong> You mastered this question. +5 XP earned!';
            feedback.classList.remove('hidden');
          }
          item.mastered = true;
          addXp(5, 'Review practice');
          showToast('Mastered! +5 XP');
          saveState();
          setTimeout(() => {
            renderReviewSection();
          }, 1400);
        } else {
          btn.classList.add('incorrect');
          item.timesIncorrect = (item.timesIncorrect || 1) + 1;
          saveState();
          if (feedback) {
            feedback.className = 'review-practice-feedback wrong';
            feedback.innerHTML = '✕ <strong>Not quite.</strong> Read the explanation above and try another option!';
            feedback.classList.remove('hidden');
          }
        }
      });
    });
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
            <div class="tc-aspect">${escapeHtml(tense.aspect)}</div>
            <h4>${escapeHtml(tense.name)}</h4>
          </div>
          <span class="chev">▼</span>
        </div>
        <div class="tc-formula">${escapeHtml(tense.formula)}</div>
        <div class="tense-detail" style="max-height:${state.openTense === index ? '420px' : '0px'};">
          <div class="tense-detail-inner">
            <ul>
              ${tense.uses.map(u => `<li>${escapeHtml(u)}</li>`).join('')}
            </ul>
            <div class="tc-examples">
              ${tense.ex.map(e => `<div class="tc-example">${escapeHtml(e)}</div>`).join('')}
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

  function setView(name) {
    state.currentView = name;
    document.querySelectorAll('.view').forEach(view => {
      const isTarget = view.dataset.view === name;
      if (isTarget) {
        view.classList.remove('hidden');
        view.classList.remove('view-enter');
        void view.offsetWidth;
        view.classList.add('view-enter');
      } else {
        view.classList.add('hidden');
        view.classList.remove('view-enter');
      }
    });
    document.querySelectorAll('.topnav button[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === name);
    });
    document.querySelectorAll('.pill[data-msub]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.msub === state.selectedMaterial);
    });
    if (name === 'dashboard') {
      renderReviewSection();
    }
    if (window.scrollY > 40) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function renderBadges() {
    const shelf = document.getElementById('badgeShelf');
    if (!shelf) return;
    const badges = [
      { name: 'First quiz', unlocked: state.history.length >= 1 },
      { name: '10 XP', unlocked: state.xp >= 10 },
      { name: 'Streak 3', unlocked: state.streak >= 3 },
      { name: 'Mastery', unlocked: state.reviewQuestions.some(q => q.mastered) }
    ];
    shelf.innerHTML = badges.map(b => `
      <div class="badge-item ${b.unlocked ? 'unlocked' : 'locked'}">
        <div class="b-ic">${b.unlocked ? '🏆' : '🔒'}</div>
        <div class="b-name">${b.name}</div>
      </div>
    `).join('');
  }

  function renderHistory() {
    const rows = document.getElementById('historyRows');
    if (!rows) return;
    if (!state.history.length) {
      rows.innerHTML = '<div class="empty-state">No recent quiz attempts yet. Complete a quiz to build your history!</div>';
      return;
    }
    rows.innerHTML = state.history.slice(0, 8).map(item => `
      <div class="history-row">
        <span>${escapeHtml(item.label)}</span>
        <span class="h-score">${item.score}%</span>
      </div>
    `).join('');
  }

  function startQuickQuiz() {
    const topic = state.selectedTopic;
    const difficulty = state.selectedDifficulty;
    let list = [];

    if (topic === 'mixed') {
      Object.keys(BANK).forEach(key => {
        if (BANK[key] && BANK[key][difficulty]) {
          list = list.concat(BANK[key][difficulty].map(q => ({ ...q, topic: key, difficulty })));
        }
      });
      // Shuffle list
      list.sort(() => Math.random() - 0.5);
    } else {
      const topicBank = BANK[topic] || BANK.tenses;
      const questions = topicBank[difficulty] || topicBank.intermediate;
      list = questions.map(q => ({ ...q, topic, difficulty }));
    }

    const questions = list.slice(0, 6);
    state.quiz = {
      questions,
      current: 0,
      score: 0,
      isReviewMode: false
    };
    renderQuiz();
  }

  function renderQuiz() {
    const playArea = document.getElementById('quizPlayArea');
    if (!state.quiz || !playArea) return;
    const q = state.quiz.questions[state.quiz.current];

    if (!q) {
      // Quiz finished
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
            ${wasReview
              ? `You reviewed ${totalQ} questions and answered ${state.quiz.score} correctly!`
              : `Great practice session on ${formatTopic(state.selectedTopic)} (${capitalize(state.selectedDifficulty)}).`}
          </p>
          <div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary" id="quizAgainBtn">${wasReview ? 'Back to Dashboard Review' : 'Try again'}</button>
            <button class="btn btn-ghost" id="quizDashboardBtn">Go to Dashboard</button>
          </div>
        </div>
      `;

      addXp(earnedXp, wasReview ? 'Review quiz' : 'Quick quiz');
      state.streak = (state.streak || 0) + 1;
      applyStreak();
      syncLevelUI();

      document.getElementById('quizAgainBtn').addEventListener('click', () => {
        if (wasReview) {
          setView('dashboard');
          renderReviewSection();
        } else {
          startQuickQuiz();
        }
      });
      document.getElementById('quizDashboardBtn').addEventListener('click', () => {
        setView('dashboard');
      });

      state.quiz = null;
      return;
    }

    const isReview = !!state.quiz.isReviewMode;
    const progress = state.quiz.questions.map((_, i) => `<span class="dot ${i < state.quiz.current ? 'done' : i === state.quiz.current ? 'current' : ''}"></span>`).join('');

    playArea.innerHTML = `
      <div class="card quiz-stage quiz-question">
        ${isReview ? `
          <div style="display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .75rem;border-radius:var(--r-pill);background:rgba(79,195,255,.12);border:1px solid rgba(79,195,255,.3);color:var(--sky-bright);font-size:.78rem;font-weight:700;margin-bottom:var(--sp-4);">
            🎯 Targeted Review Quiz · Question ${state.quiz.current + 1} of ${state.quiz.questions.length}
          </div>
        ` : ''}
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
            saveState();
          }
        } else {
          // Record incorrect question for targeted study
          recordIncorrectQuestion(q, pick, q.topic || state.selectedTopic, q.difficulty || state.selectedDifficulty);
        }

        playArea.innerHTML = `
          <div class="card quiz-stage quiz-question">
            ${isReview ? `
              <div style="display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .75rem;border-radius:var(--r-pill);background:rgba(79,195,255,.12);border:1px solid rgba(79,195,255,.3);color:var(--sky-bright);font-size:.78rem;font-weight:700;margin-bottom:var(--sp-4);">
                🎯 Targeted Review Quiz
              </div>
            ` : ''}
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

    document.getElementById('skipQuizBtn').addEventListener('click', () => {
      state.quiz.current += 1;
      renderQuiz();
    });
  }

  function runAiAdaptiveTest() {
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

    function renderAiStep() {
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
        addXp(xp, 'AI Adaptive Test');
        document.getElementById('aiPracticeAgainBtn').addEventListener('click', runAiAdaptiveTest);
        document.getElementById('aiDashBtn').addEventListener('click', () => {
          setView('dashboard');
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

          if (isCorrect) {
            userScore += 1;
          } else {
            recordIncorrectQuestion(q, pick, q.topic, q.difficulty);
          }

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

          document.getElementById('aiNextBtn').addEventListener('click', () => {
            currentIndex += 1;
            renderAiStep();
          });
        });
      });
    }

    renderAiStep();
  }

  function bindChipSelectors() {
    document.querySelectorAll('[data-topic]').forEach(btn => {
      btn.addEventListener('click', () => {
        const actual = btn.dataset.topic;
        document.querySelectorAll('[data-topic]').forEach(i => {
          i.classList.toggle('active', i === btn && (i.closest('#quizTopicChips') || i.closest('#aiTopicChips')));
        });
        state.selectedTopic = actual;
      });
    });

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedDifficulty = btn.dataset.diff;
        document.querySelectorAll('[data-diff]').forEach(i => i.classList.toggle('active', i === btn));
      });
    });

    document.querySelectorAll('[data-count]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedAIQuestions = Number(btn.dataset.count);
        document.querySelectorAll('[data-count]').forEach(i => i.classList.toggle('active', i === btn));
      });
    });

    document.querySelectorAll('[data-msub]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedMaterial = btn.dataset.msub;
        document.querySelectorAll('[data-msub]').forEach(i => i.classList.toggle('active', i === btn));
        const hideMap = { tenses: 'msub-tenses', tobe: 'msub-tobe', vocabulary: 'msub-vocabulary', grammar: 'msub-grammar' };
        Object.entries(hideMap).forEach(([key, id]) => {
          const node = document.getElementById(id);
          if (node) {
            const isMatch = key === state.selectedMaterial;
            node.classList.toggle('hidden', !isMatch);
            if (isMatch) {
              node.classList.remove('tab-pane-enter');
              void node.offsetWidth;
              node.classList.add('tab-pane-enter');
            }
          }
        });
      });
    });

    // Practice tabs: quiz vs AI
    document.querySelectorAll('[data-ptab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.ptab;
        document.querySelectorAll('[data-ptab]').forEach(b => b.classList.toggle('active', b === btn));
        const qNode = document.getElementById('ptab-quiz');
        const aNode = document.getElementById('ptab-ai');
        if (qNode) {
          const isQ = tab === 'quiz';
          qNode.classList.toggle('hidden', !isQ);
          if (isQ) {
            qNode.classList.remove('tab-pane-enter');
            void qNode.offsetWidth;
            qNode.classList.add('tab-pane-enter');
          }
        }
        if (aNode) {
          const isA = tab === 'ai';
          aNode.classList.toggle('hidden', !isA);
          if (isA) {
            aNode.classList.remove('tab-pane-enter');
            void aNode.offsetWidth;
            aNode.classList.add('tab-pane-enter');
          }
        }
      });
    });

    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) startQuizBtn.addEventListener('click', startQuickQuiz);

    const generateAiBtn = document.getElementById('generateAiBtn');
    if (generateAiBtn) {
      generateAiBtn.addEventListener('click', () => {
        const area = document.getElementById('aiPlayArea');
        if (!area) return;
        area.innerHTML = `
          <div class="card quiz-question" style="text-align:center;padding:var(--sp-6);">
            <div style="font-size:2rem;margin-bottom:var(--sp-3);">✨</div>
            <h3>${formatTopic(state.selectedTopic)} · ${capitalize(state.selectedDifficulty)} Test</h3>
            <p style="color:var(--muted);max-width:44ch;margin:0 auto var(--sp-5);">An adaptive quiz configured with ${state.selectedAIQuestions} questions tailored to your current level.</p>
            <button class="btn btn-primary" id="aiStartBtn">Start Test</button>
          </div>
        `;
        document.getElementById('aiStartBtn').addEventListener('click', runAiAdaptiveTest);
      });
    }

    // Review Filters
    document.querySelectorAll('[data-review-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.reviewFilter = btn.dataset.reviewFilter;
        document.querySelectorAll('[data-review-filter]').forEach(b => b.classList.toggle('active', b === btn));
        renderReviewSection();
      });
    });

    const startRevBtn = document.getElementById('startReviewQuizBtn');
    if (startRevBtn) {
      startRevBtn.addEventListener('click', startReviewQuiz);
    }

    const clearMastBtn = document.getElementById('clearMasteredBtn');
    if (clearMastBtn) {
      clearMastBtn.addEventListener('click', clearMasteredReviewQuestions);
    }
  }

  function initNavigation() {
    document.querySelectorAll('.topnav button[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        setView(btn.dataset.view);
      });
    });

    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        setView(btn.dataset.goto);
      });
    });

    // Quick links in Dashboard
    document.querySelectorAll('[data-goto-material]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedMaterial = btn.dataset.gotoMaterial;
        document.querySelectorAll('[data-msub]').forEach(i => {
          i.classList.toggle('active', i.dataset.msub === state.selectedMaterial);
        });
        const hideMap = { tenses: 'msub-tenses', tobe: 'msub-tobe', vocabulary: 'msub-vocabulary', grammar: 'msub-grammar' };
        Object.entries(hideMap).forEach(([key, id]) => {
          const node = document.getElementById(id);
          if (node) {
            const isMatch = key === state.selectedMaterial;
            node.classList.toggle('hidden', !isMatch);
            if (isMatch) {
              node.classList.remove('tab-pane-enter');
              void node.offsetWidth;
              node.classList.add('tab-pane-enter');
            }
          }
        });
        setView('materials');
      });
    });

    document.querySelectorAll('[data-goto-practice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.gotoPractice;
        setView('practice');
        document.querySelectorAll('[data-ptab]').forEach(t => {
          t.classList.toggle('active', t.dataset.ptab === tab);
        });
        const qNode = document.getElementById('ptab-quiz');
        const aNode = document.getElementById('ptab-ai');
        if (qNode) {
          const isQ = tab === 'quiz';
          qNode.classList.toggle('hidden', !isQ);
          if (isQ) {
            qNode.classList.remove('tab-pane-enter');
            void qNode.offsetWidth;
            qNode.classList.add('tab-pane-enter');
          }
        }
        if (aNode) {
          const isA = tab === 'ai';
          aNode.classList.toggle('hidden', !isA);
          if (isA) {
            aNode.classList.remove('tab-pane-enter');
            void aNode.offsetWidth;
            aNode.classList.add('tab-pane-enter');
          }
        }
      });
    });

    document.querySelectorAll('[data-goto-review]').forEach(btn => {
      btn.addEventListener('click', () => {
        setView('dashboard');
        const reviewEl = document.getElementById('reviewSection');
        if (reviewEl) {
          reviewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const appHomeBtn = document.getElementById('appHomeBtn');
    if (appHomeBtn) {
      appHomeBtn.addEventListener('click', () => setView('dashboard'));
    }

    // Modal close buttons
    const closeAuthBtn = document.getElementById('closeAuthModalBtn');
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAllModals);

    const closeProfBtn = document.getElementById('closeProfileModalBtn');
    if (closeProfBtn) closeProfBtn.addEventListener('click', closeAllModals);

    const closeProfBtn2 = document.getElementById('closeProfileModalBtn2');
    if (closeProfBtn2) closeProfBtn2.addEventListener('click', closeAllModals);

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Auth Modal tab switching
    const authTabSignUp = document.getElementById('authTabSignUp');
    const authTabLogin = document.getElementById('authTabLogin');
    if (authTabSignUp) {
      authTabSignUp.addEventListener('click', () => openAuthModal('signup'));
    }
    if (authTabLogin) {
      authTabLogin.addEventListener('click', () => openAuthModal('login'));
    }

    // Auth chip selectors
    document.querySelectorAll('#authLevelChips .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#authLevelChips .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
    document.querySelectorAll('#authGoalChips .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#authGoalChips .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Landing Page Action buttons (Sign Up / Get Started & Log In)
    const landingLoginBtn = document.getElementById('landingLoginBtn');
    if (landingLoginBtn) {
      landingLoginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    const landingSignUpBtn = document.getElementById('landingSignUpBtn');
    if (landingSignUpBtn) {
      landingSignUpBtn.addEventListener('click', () => openAuthModal('signup'));
    }

    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => openAuthModal('signup'));
    }
    const landingHeroLoginBtn = document.getElementById('landingHeroLoginBtn');
    if (landingHeroLoginBtn) {
      landingHeroLoginBtn.addEventListener('click', () => openAuthModal('login'));
    }

    const getStartedBtn2 = document.getElementById('getStartedBtn2');
    if (getStartedBtn2) {
      getStartedBtn2.addEventListener('click', () => openAuthModal('signup'));
    }
    const landingBottomLoginBtn = document.getElementById('landingBottomLoginBtn');
    if (landingBottomLoginBtn) {
      landingBottomLoginBtn.addEventListener('click', () => openAuthModal('login'));
    }

    // Submit Sign Up via Form submission (click or Enter key)
    const signUpForm = document.getElementById('authSignUpForm');
    if (signUpForm) {
      signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('authSignUpName');
        const emailInput = document.getElementById('authSignUpEmail');
        const passwordInput = document.getElementById('authSignUpPassword');
        const activeLevel = document.querySelector('#authLevelChips .pill.active')?.dataset.level || 'intermediate';
        const activeGoal = document.querySelector('#authGoalChips .pill.active')?.dataset.goal || 'conversation';
        signUpUser(nameInput?.value, emailInput?.value, passwordInput?.value, activeLevel, activeGoal);
      });
    }

    // Submit Log In via Form submission (click or Enter key)
    const loginForm = document.getElementById('authLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifierInput = document.getElementById('authLoginIdentifier');
        const passwordInput = document.getElementById('authLoginPassword');
        loginUser(identifierInput?.value, passwordInput?.value);
      });
    }

    // Toggle Password Visibility buttons
    const toggleSignUpPwBtn = document.getElementById('toggleSignUpPwBtn');
    if (toggleSignUpPwBtn) {
      toggleSignUpPwBtn.addEventListener('click', () => {
        const input = document.getElementById('authSignUpPassword');
        if (input) {
          const isPw = input.type === 'password';
          input.type = isPw ? 'text' : 'password';
          toggleSignUpPwBtn.textContent = isPw ? '🙈' : '👁️';
        }
      });
    }
    const toggleLoginPwBtn = document.getElementById('toggleLoginPwBtn');
    if (toggleLoginPwBtn) {
      toggleLoginPwBtn.addEventListener('click', () => {
        const input = document.getElementById('authLoginPassword');
        if (input) {
          const isPw = input.type === 'password';
          input.type = isPw ? 'text' : 'password';
          toggleLoginPwBtn.textContent = isPw ? '🙈' : '👁️';
        }
      });
    }

    // Switch between Sign Up & Log In within modal
    const switchToLoginBtn = document.getElementById('switchToLoginBtn');
    if (switchToLoginBtn) {
      switchToLoginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    const switchToSignUpBtn = document.getElementById('switchToSignUpBtn');
    if (switchToSignUpBtn) {
      switchToSignUpBtn.addEventListener('click', () => openAuthModal('signup'));
    }

    // Quick Guest buttons
    const quickGuestBtn = document.getElementById('authQuickGuestBtn');
    if (quickGuestBtn) {
      quickGuestBtn.addEventListener('click', continueAsGuest);
    }
    const loginGuestBtn = document.getElementById('authLoginGuestBtn');
    if (loginGuestBtn) {
      loginGuestBtn.addEventListener('click', continueAsGuest);
    }

    // Top Right Profile Pill Trigger
    const profilePillBtn = document.getElementById('profilePillBtn');
    if (profilePillBtn) {
      profilePillBtn.addEventListener('click', openProfileModal);
    }

    // Edit Name in Profile Hub
    const hubEditNameBtn = document.getElementById('hubEditNameBtn');
    const hubNameEditForm = document.getElementById('hubNameEditForm');
    const hubNameEditInput = document.getElementById('hubNameEditInput');
    const hubSaveNameBtn = document.getElementById('hubSaveNameBtn');
    const hubCancelNameBtn = document.getElementById('hubCancelNameBtn');

    if (hubEditNameBtn && hubNameEditForm) {
      hubEditNameBtn.addEventListener('click', () => {
        const currentProfile = state.profiles[state.activeProfile] || state.profiles[0];
        if (hubNameEditInput) hubNameEditInput.value = currentProfile.name || 'Learner';
        hubNameEditForm.classList.remove('hidden');
        if (hubNameEditInput) hubNameEditInput.focus();
      });
    }
    if (hubCancelNameBtn && hubNameEditForm) {
      hubCancelNameBtn.addEventListener('click', () => {
        hubNameEditForm.classList.add('hidden');
      });
    }
    if (hubSaveNameBtn && hubNameEditForm) {
      hubSaveNameBtn.addEventListener('click', () => {
        const newName = (hubNameEditInput?.value || '').trim();
        if (newName) {
          const currentProfile = state.profiles[state.activeProfile] || state.profiles[0];
          currentProfile.name = newName;
          currentProfile.initials = newName.charAt(0).toUpperCase();
          saveState();
          syncLevelUI();
          hubNameEditForm.classList.add('hidden');
          showToast(`Display name updated to "${newName}"`);
        }
      });
    }

    // Switched Left-Right Theme Button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
      themeToggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      });
    }

    // Profile Subtabs (Data Control, Personalized, Help)
    document.querySelectorAll('.prof-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.profTab;
        document.querySelectorAll('.prof-subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const panelData = document.getElementById('profPanelDataControl');
        const panelPers = document.getElementById('profPanelPersonalized');
        const panelHelp = document.getElementById('profPanelHelp');

        if (panelData) panelData.classList.toggle('hidden', targetTab !== 'data-control');
        if (panelPers) panelPers.classList.toggle('hidden', targetTab !== 'personalized');
        if (panelHelp) panelHelp.classList.toggle('hidden', targetTab !== 'help-center');
      });
    });

    // Data Control: Export JSON
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
      exportDataBtn.addEventListener('click', exportUserData);
    }

    // Data Control: Import Backup
    const importBackupInput = document.getElementById('importBackupInput');
    if (importBackupInput) {
      importBackupInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          importUserData(file);
          e.target.value = '';
        }
      });
    }

    // Data Control: Clear Review Mistakes
    const clearReviewQueueBtn = document.getElementById('clearReviewQueueBtn');
    if (clearReviewQueueBtn) {
      clearReviewQueueBtn.addEventListener('click', () => {
        if (confirm('Clear all questions currently in your targeted review mistake queue?')) {
          state.reviewQuestions = [];
          saveState();
          renderReviewSection();
          syncProfileHubUI();
          showToast('Review mistake queue cleared.');
        }
      });
    }

    // Data Control: Clear Quiz History
    const clearQuizHistoryBtn = document.getElementById('clearQuizHistoryBtn');
    if (clearQuizHistoryBtn) {
      clearQuizHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear your past quiz results history?')) {
          state.history = [];
          saveState();
          renderHistory();
          showToast('Quiz history cleared.');
        }
      });
    }

    // Data Control: Reset All Learning Progress
    const hubResetAllBtn = document.getElementById('hubResetAllBtn');
    if (hubResetAllBtn) {
      hubResetAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to permanently reset all progress, XP, streak, badges, and review data?')) {
          state.xp = 0;
          state.streak = 0;
          state.level = 1;
          state.history = [];
          state.reviewQuestions = [];
          saveState();
          syncLevelUI();
          renderBadges();
          renderHistory();
          renderReviewSection();
          showToast('All learning data has been reset.');
        }
      });
    }

    // Personalized Learning Chip Handlers
    document.querySelectorAll('#persLevelChips button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#persLevelChips button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.querySelectorAll('#persGoalChips button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#persGoalChips button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Save Personalized Preferences
    const savePersonalizedBtn = document.getElementById('savePersonalizedBtn');
    if (savePersonalizedBtn) {
      savePersonalizedBtn.addEventListener('click', () => {
        const goal = document.getElementById('persGoalSelect')?.value || 'conversation';
        const level = document.querySelector('#persLevelChips button.active')?.dataset.persLevel || 'intermediate';
        const dailyXp = Number(document.querySelector('#persGoalChips button.active')?.dataset.dailyXp || 100);
        const notes = document.getElementById('persNotesInput')?.value || '';

        state.personalizedLearning = {
          goal,
          level,
          dailyXpGoal: dailyXp,
          customNotes: notes
        };
        state.selectedDifficulty = level;
        saveState();
        showToast('Personalized learning preferences saved! 🎯');
      });
    }

    // Help Center Accordion
    document.querySelectorAll('.help-summary').forEach(item => {
      item.addEventListener('click', () => {
        const parent = item.closest('.help-item');
        if (parent) {
          const isOpen = parent.classList.toggle('open');
          const content = parent.querySelector('.help-content');
          if (content) {
            content.style.display = isOpen ? 'block' : 'none';
          }
        }
      });
    });

    // Sign Out Button in Profile Hub
    const hubSignOutBtn = document.getElementById('hubSignOutBtn');
    if (hubSignOutBtn) {
      hubSignOutBtn.addEventListener('click', () => {
        signOutUser();
      });
    }

    // Reset button in progress view
    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const confirmed = confirm('Are you sure you want to reset your progress, streak, and review queue?');
        if (confirmed) {
          state.xp = 0;
          state.streak = 0;
          state.history = [];
          state.reviewQuestions = [];
          saveState();
          syncLevelUI();
          renderBadges();
          renderHistory();
          renderReviewSection();
          showToast('Progress and review queue have been reset.');
        }
      });
    }
  }

  function setAuthAlert(msg, type = 'error') {
    const alertBox = document.getElementById('authAlertBox');
    if (!alertBox) return;
    if (!msg) {
      alertBox.textContent = '';
      alertBox.className = 'auth-alert hidden';
      return;
    }
    alertBox.className = `auth-alert ${type}`;
    const icon = type === 'error' ? '⚠️' : (type === 'success' ? '✅' : 'ℹ️');
    alertBox.innerHTML = `<span>${icon}</span> <span>${escapeHtml(msg)}</span>`;
  }

  function openAuthModal(mode = 'signup') {
    const modal = document.getElementById('authModalOverlay');
    if (!modal) return;
    setAuthAlert('');
    modal.classList.remove('hidden');

    const tabSignUp = document.getElementById('authTabSignUp');
    const tabLogin = document.getElementById('authTabLogin');
    const paneSignUp = document.getElementById('authPaneSignUp');
    const paneLogin = document.getElementById('authPaneLogin');

    if (mode === 'signup') {
      if (tabSignUp) tabSignUp.classList.add('active');
      if (tabLogin) tabLogin.classList.remove('active');
      if (paneSignUp) paneSignUp.classList.remove('hidden');
      if (paneLogin) paneLogin.classList.add('hidden');
      setTimeout(() => {
        const nameInput = document.getElementById('authSignUpName');
        if (nameInput) nameInput.focus();
      }, 60);
    } else {
      if (tabSignUp) tabSignUp.classList.remove('active');
      if (tabLogin) tabLogin.classList.add('active');
      if (paneSignUp) paneSignUp.classList.add('hidden');
      if (paneLogin) paneLogin.classList.remove('hidden');
      setTimeout(() => {
        const idInput = document.getElementById('authLoginIdentifier');
        if (idInput) idInput.focus();
      }, 60);
    }
    renderAuthSavedProfiles();
  }

  function openProfileModal() {
    const modal = document.getElementById('profileModalOverlay');
    if (!modal) return;
    syncProfileHubUI();
    modal.classList.remove('hidden');
  }

  function closeAllModals() {
    const authModal = document.getElementById('authModalOverlay');
    if (authModal) authModal.classList.add('hidden');
    const profModal = document.getElementById('profileModalOverlay');
    if (profModal) profModal.classList.add('hidden');
    const hubNameEditForm = document.getElementById('hubNameEditForm');
    if (hubNameEditForm) hubNameEditForm.classList.add('hidden');
    setAuthAlert('');
  }

  function renderAuthSavedProfiles() {
    const list = document.getElementById('authProfileList');
    if (!list) return;
    list.innerHTML = '';
    const profiles = state.profiles || [];
    if (!profiles.length) {
      list.innerHTML = '<div style="font-size:.82rem;color:var(--muted-dim);padding:.4rem;">No saved profiles on this browser yet.</div>';
      return;
    }
    profiles.forEach((p, idx) => {
      const row = document.createElement('div');
      row.className = 'profile-row' + (idx === state.activeProfile ? ' selected' : '');
      row.innerHTML = `
        <div class="avatar sm">${escapeHtml(p.initials || 'L')}</div>
        <div class="profile-row-info">
          <strong>${escapeHtml(p.name || 'Learner')}</strong>
          <span>${escapeHtml(p.email || 'learner@engsphere.app')} · Level ${state.level}</span>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" style="font-size:.74rem;padding:.2rem .5rem;" title="Select profile">Use</button>
      `;
      row.addEventListener('click', () => {
        const idInput = document.getElementById('authLoginIdentifier');
        if (idInput) idInput.value = p.email || p.name;
        const pwInput = document.getElementById('authLoginPassword');

        const matchedUser = (state.users || []).find(u =>
          (u.email && u.email.toLowerCase() === (p.email || '').toLowerCase()) ||
          (u.name && u.name.toLowerCase() === (p.name || '').toLowerCase())
        );

        if (matchedUser && matchedUser.password) {
          if (pwInput) {
            pwInput.value = '';
            pwInput.focus();
          }
          setAuthAlert(`Please enter password for ${p.name}.`, 'info');
        } else {
          state.activeProfile = idx;
          loginUser(p.email || p.name, '');
        }
      });
      list.appendChild(row);
    });
  }

  function signUpUser(name, email, password, level, goal) {
    const cleanName = (name || '').trim();
    if (!cleanName || cleanName.length < 2) {
      setAuthAlert('Please enter your full name or nickname (at least 2 characters).');
      const input = document.getElementById('authSignUpName');
      if (input) input.focus();
      return;
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setAuthAlert('Please enter a valid email address (e.g. alex@example.com).');
      const input = document.getElementById('authSignUpEmail');
      if (input) input.focus();
      return;
    }

    const cleanPw = (password || '').trim();
    if (!cleanPw || cleanPw.length < 8) {
      setAuthAlert('Please create a password with at least 8 characters.');
      const input = document.getElementById('authSignUpPassword');
      if (input) input.focus();
      return;
    }

    if (!Array.isArray(state.users)) state.users = [];
    const existingUser = state.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      setAuthAlert(`An account with email "${cleanEmail}" already exists. Please log in instead.`);
      return;
    }

    const initials = cleanName.charAt(0).toUpperCase();
    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      initials,
      email: cleanEmail,
      password: cleanPw,
      level: level || 'intermediate',
      goal: goal || 'conversation',
      createdAt: new Date().toISOString()
    };
    state.users.unshift(newUser);

    if (!Array.isArray(state.profiles)) state.profiles = [];
    const newProfile = { name: cleanName, initials, email: cleanEmail };
    state.profiles.unshift(newProfile);
    state.activeProfile = 0;

    if (!state.personalizedLearning) state.personalizedLearning = {};
    state.personalizedLearning.level = level || 'intermediate';
    state.personalizedLearning.goal = goal || 'conversation';
    state.personalizedLearning.dailyXpGoal = 100;
    state.selectedDifficulty = level || 'intermediate';

    state.isLoggedIn = true;
    saveState();
    closeAllModals();

    document.getElementById('landing').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    setView('dashboard');
    syncLevelUI();
    showToast(`🎉 Welcome to EngSphere, ${cleanName}! Your profile is ready.`);
  }

  function loginUser(identifier, password) {
    const cleanId = (identifier || '').trim();
    if (!cleanId) {
      setAuthAlert('Please enter your email or username to log in.');
      const input = document.getElementById('authLoginIdentifier');
      if (input) input.focus();
      return;
    }

    if (!Array.isArray(state.users)) state.users = [];
    const matchedUser = state.users.find(u =>
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) ||
      (u.name && u.name.toLowerCase() === cleanId.toLowerCase())
    );

    const cleanPw = (password || '').trim();
    if (matchedUser && matchedUser.password) {
      if (matchedUser.password !== cleanPw) {
        setAuthAlert('Incorrect password. Please verify and try again.');
        const input = document.getElementById('authLoginPassword');
        if (input) input.focus();
        return;
      }
    }

    const userName = matchedUser ? matchedUser.name : cleanId;
    const userEmail = matchedUser ? matchedUser.email : `${cleanId.toLowerCase().replace(/\s+/g,'')}@engsphere.app`;
    const initials = userName.charAt(0).toUpperCase();

    if (!Array.isArray(state.profiles)) state.profiles = [];
    const existingIndex = state.profiles.findIndex(p =>
      (p.email && p.email.toLowerCase() === userEmail.toLowerCase()) ||
      (p.name && p.name.toLowerCase() === userName.toLowerCase())
    );

    if (existingIndex >= 0) {
      state.activeProfile = existingIndex;
    } else {
      state.profiles.unshift({ name: userName, initials, email: userEmail });
      state.activeProfile = 0;
    }

    if (matchedUser && matchedUser.level) {
      if (!state.personalizedLearning) state.personalizedLearning = {};
      state.personalizedLearning.level = matchedUser.level;
      state.selectedDifficulty = matchedUser.level;
      if (matchedUser.goal) state.personalizedLearning.goal = matchedUser.goal;
    }

    state.isLoggedIn = true;
    saveState();
    closeAllModals();

    document.getElementById('landing').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    setView('dashboard');
    syncLevelUI();
    showToast(`Welcome back, ${userName}!`);
  }

  function continueAsGuest() {
    loginUser('Guest Learner', '');
  }

  function signOutUser() {
    state.isLoggedIn = false;
    saveState();
    closeAllModals();
    document.getElementById('app').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Signed out successfully. See you next time!');
  }

  function exportUserData() {
    try {
      const backupData = {
        app: 'EngSphere',
        version: '1.2.0',
        exportedAt: new Date().toISOString(),
        state: state
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `engsphere-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Learning data exported as JSON!');
    } catch (err) {
      console.error(err);
      showToast('Could not export backup data', true);
    }
  }

  function importUserData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        const importedState = parsed.state || parsed;
        if (typeof importedState.xp !== 'number' && typeof importedState.level !== 'number') {
          showToast('Invalid backup file format', true);
          return;
        }
        Object.assign(state, importedState);
        saveState();
        applyTheme(state.theme || 'dark', false);
        syncLevelUI();
        renderBadges();
        renderHistory();
        renderReviewSection();
        showToast('Backup restored successfully!');
      } catch (err) {
        console.error(err);
        showToast('Could not parse backup JSON', true);
      }
    };
    reader.readAsText(file);
  }

  /* Landing page scroll-reveal ("animasi terbit"), animated counters, & scroll progress */
  function initLandingScrollAnimations() {
    const landing = document.getElementById('landing');
    if (!landing) return;

    // 1. Reading / Scroll Progress Bar
    const progressBar = document.getElementById('progress-bar');
    let ticking = false;

    function updateScrollProgress() {
      if (!progressBar) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrolled = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    }, { passive: true });
    updateScrollProgress();

    // 2. Animated Counter for Landing Strip Stats (.ls-n)
    let countersStarted = false;

    function startCounterAnimation() {
      if (countersStarted) return;
      countersStarted = true;

      const items = [
        { selector: '.ls-item:nth-child(1) .ls-n', end: 12, duration: 1600 },
        { selector: '.ls-item:nth-child(2) .ls-n', end: 3, duration: 1200 }
      ];

      items.forEach(cfg => {
        const el = landing.querySelector(cfg.selector);
        if (!el) return;

        let start = 0;
        const startTime = performance.now();

        function updateNumber(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / cfg.duration, 1);
          // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (cfg.end - start) * ease);
          el.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = cfg.end;
          }
        }
        requestAnimationFrame(updateNumber);
      });
    }

    // 3. Scroll Reveal Observer ("Animasi Terbit")
    const revealTargets = landing.querySelectorAll(
      '.landing-strip, .lsec-head, .about-text, .about-card, .lf-item, .moat-row, .method-card, .final-cta'
    );

    // Apply staggered delays for grid items
    const staggerGroups = [
      landing.querySelectorAll('.landing-strip .ls-item'),
      landing.querySelectorAll('.landing-features .lf-item'),
      landing.querySelectorAll('.moat-list .moat-row'),
      landing.querySelectorAll('.method-grid .method-card')
    ];

    staggerGroups.forEach(group => {
      group.forEach((item, idx) => {
        const delay = (idx % 3) * 160;
        if (delay > 0) {
          item.style.transitionDelay = delay + 'ms';
        }
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // Trigger counter if landing-strip comes into view
            if (entry.target.classList.contains('landing-strip') || entry.target.closest('.landing-strip')) {
              startCounterAnimation();
            }

            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      });

      revealTargets.forEach(el => {
        el.classList.add('reveal-init');
        observer.observe(el);
      });
    } else {
      // Fallback
      revealTargets.forEach(el => el.classList.add('revealed'));
      startCounterAnimation();
    }
  }

  function init() {
    loadState();
    applyTheme(state.theme || 'dark', false);
    applyLanguage(state.lang || 'en', false);
    initLanguageSwitcher();
    applyStreak();
    syncLevelUI();
    renderTenses();
    renderVocabulary();
    renderBadges();
    renderHistory();
    renderReviewSection();
    initNavigation();
    bindChipSelectors();
    initLandingScrollAnimations();

    // Check auth status
    if (state.isLoggedIn) {
      document.getElementById('landing').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      setView(state.currentView || 'dashboard');
    } else {
      document.getElementById('landing').classList.remove('hidden');
      document.getElementById('app').classList.add('hidden');
    }

    saveState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
