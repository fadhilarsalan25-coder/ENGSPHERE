export const TENSES = [
  { time: 'Present', aspect: 'Simple', name: 'Present Simple', formula: 'S + V1 (+ s/es)', uses: ['Habits and routines', 'General facts and truths', 'Fixed schedules'], ex: ['She works at a hospital.', 'Water boils at 100°C.', 'The train leaves at 7 a.m.'] },
  { time: 'Present', aspect: 'Continuous', name: 'Present Continuous', formula: 'S + am/is/are + V-ing', uses: ['Happening right now', 'Temporary situations', 'Fixed future arrangements'], ex: ['I am studying for an exam.', 'He is staying with friends this month.', 'We are meeting them tomorrow.'] },
  { time: 'Present', aspect: 'Perfect', name: 'Present Perfect', formula: 'S + have/has + V3', uses: ['Past action with a present result', 'Experience, time unspecified', 'Started in the past, still true'], ex: ['I have finished the report.', 'She has visited Japan twice.', 'They have lived here since 2019.'] },
  { time: 'Future', aspect: 'Simple', name: 'Future Simple (will)', formula: 'S + will + V1', uses: ['Spontaneous decision', 'Prediction without present evidence', 'Promise or offer'], ex: ['I’ll answer the door.', 'It will probably rain later.', 'I will help you with that.'] }
];

export const VOCAB = {
  'Daily life': [
    { w: 'chore', p: 'noun', m: 'a routine task, especially a household one', e: 'Doing the laundry is my least favorite chore.' },
    { w: 'errand', p: 'noun', m: 'a short trip to do a job or buy something', e: 'I have to run a few errands before dinner.' },
    { w: 'commute', p: 'noun / verb', m: 'the journey between home and work', e: 'Her morning commute takes about forty minutes.' }
  ],
  'Work & study': [
    { w: 'deadline', p: 'noun', m: 'the latest time by which something must be done', e: 'The deadline for the report is 5 p.m. tomorrow.' },
    { w: 'workload', p: 'noun', m: 'the amount of work to be done by a person', e: 'Her workload has increased significantly this quarter.' },
    { w: 'overview', p: 'noun', m: 'a short description that gives the main ideas', e: 'He gave a brief overview of the project scope.' }
  ],
  Travel: [
    { w: 'itinerary', p: 'noun', m: 'a planned route or journey', e: 'Our itinerary includes three days in Tokyo and two in Kyoto.' },
    { w: 'departure', p: 'noun', m: 'the act of leaving a place', e: 'The flight departure has been delayed by twenty minutes.' },
    { w: 'luggage', p: 'noun', m: 'bags and suitcases containing belongings', e: 'Passengers are allowed one piece of carry-on luggage.' }
  ]
};

export const Q = (q, o, a, x, id) => ({
  id: id || (q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36)),
  q,
  options: o,
  answer: a,
  explain: x
});

export const BANK = {
  tenses: {
    beginner: [
      Q('She ____ to school every day.', ['go', 'goes', 'going', 'gone'], 1, 'Present Simple with he/she/it adds -s: "She goes."', 'ten-b-1'),
      Q('Right now, they ____ football in the park.', ['play', 'plays', 'are playing', 'played'], 2, 'An action happening now uses Present Continuous: are + V-ing.', 'ten-b-2'),
      Q('Yesterday I ____ a new book.', ['buy', 'buys', 'bought', 'buying'], 2, '"Yesterday" indicates finished past time, so use Past Simple: bought.', 'ten-b-3'),
      Q('We ____ visit my grandmother tomorrow.', ['will', 'are', 'was', 'have'], 0, 'A future plan or prediction uses will + V1.', 'ten-b-4')
    ],
    intermediate: [
      Q('By the time we arrived, the film ____.', ['started', 'has started', 'had started', 'was starting'], 2, 'Past Perfect shows the film started before the other past action (our arrival).', 'ten-i-1'),
      Q('I ____ here since 2020.', ['work', 'worked', 'have been working', 'will work'], 2, '"Since 2020" means it began in the past and continues — Present Perfect Continuous.', 'ten-i-2'),
      Q('This time next week, I ____ on a beach.', ['will lie', 'will be lying', 'will have lain', 'lie'], 1, 'Future Continuous describes an action in progress at a specific future moment.', 'ten-i-3')
    ],
    advanced: [
      Q('Hardly ____ the door when the phone rang.', ['I had closed', 'had I closed', 'I closed', 'did I close'], 1, 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".', 'ten-a-1'),
      Q('By next June, they ____ together for a decade.', ['will work', 'will be working', 'will have been working', 'have worked'], 2, 'Duration up to a future point takes Future Perfect Continuous.', 'ten-a-2')
    ]
  },
  tobe: {
    beginner: [
      Q('I ____ a student.', ['am', 'is', 'are', 'be'], 0, '"I" always takes "am".', 'tb-b-1'),
      Q('They ____ in the classroom.', ['am', 'is', 'are', 'was'], 2, 'Plural subjects (they, we, you) take "are".', 'tb-b-2'),
      Q('She ____ tired yesterday.', ['is', 'was', 'were', 'are'], 1, 'Past of "is" for she/he/it is "was".', 'tb-b-3')
    ],
    intermediate: [
      Q('The letters ____ sent last Monday.', ['was', 'were', 'are', 'is'], 1, 'Passive in the past with a plural subject: "were sent".', 'tb-i-1'),
      Q('____ there any milk left?', ['Are', 'Is', 'Were', 'Am'], 1, '"Milk" is uncountable, so it takes the singular "Is there".', 'tb-i-2')
    ],
    advanced: [
      Q('By the time the project was reviewed, several issues ____ already been found.', ['had', 'were', 'have', 'are'], 0, 'Past perfect passive: had been found.', 'tb-a-1')
    ]
  },
  vocabulary: {
    beginner: [
      Q('I need to run a few ____ before going home.', ['chores', 'errands', 'routines', 'tasks'], 1, '"Run errands" is the natural collocation for short trips to do small jobs.', 'voc-b-1'),
      Q('Can I ____ a cup of coffee before the meeting starts?', ['grab', 'tidy', 'commute', 'spare'], 0, '"Grab a coffee" is an everyday informal phrase meaning to quickly get a coffee.', 'voc-b-2')
    ],
    intermediate: [
      Q('The manager ____ the new marketing project to Sarah.', ['assigned', 'analysed', 'concluded', 'delayed'], 0, '"To assign" means to give someone a particular task, duty, or project.', 'voc-i-1'),
      Q('Our flight was held up by a two-hour ____ due to heavy fog.', ['itinerary', 'delay', 'departure', 'workload'], 1, 'A "delay" is a period of waiting or when something is postponed.', 'voc-i-2')
    ],
    advanced: [
      Q('The research team must ____ the survey data before publishing conclusions.', ['analyse', 'summarise', 'commute', 'contrast'], 0, '"Analyse" means examining data or information in careful detail.', 'voc-a-1')
    ]
  },
  grammar: {
    beginner: [
      Q('She bought ____ apple and two oranges at the supermarket.', ['a', 'an', 'the', 'some'], 1, 'Use "an" before words starting with a vowel sound: "an apple".', 'grm-b-1'),
      Q('They arrived in London ____ Friday afternoon.', ['at', 'on', 'in', 'by'], 1, 'Use the preposition "on" for days of the week: "on Friday".', 'grm-b-2')
    ],
    intermediate: [
      Q('If I ____ you, I would consult a professional before deciding.', ['am', 'was', 'were', 'had been'], 2, 'In second (unreal) conditionals, "were" is conventionally used for all subjects.', 'grm-i-1'),
      Q('The package was delivered to someone ____ didn\'t live in this building.', ['which', 'who', 'whose', 'whom'], 1, 'Use the relative pronoun "who" when referring to people as subjects.', 'grm-i-2')
    ],
    advanced: [
      Q('Scarcely ____ the station when the train pulled away from the platform.', ['had we reached', 'we had reached', 'we reached', 'did we reach'], 0, 'Negative inversions with "scarcely... when" require inversion.', 'grm-a-1')
    ]
  }
};

export const STORAGE_KEY = 'engsphere-state';
