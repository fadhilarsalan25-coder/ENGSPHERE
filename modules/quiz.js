export const TENSES = [
  {
    time: 'Present',
    aspect: 'Simple',
    name: 'Present Simple',
    formula: 'S + V1 (+ s/es)',
    negFormula: 'S + do/does not + V1',
    quesFormula: 'Do/Does + S + V1?',
    signals: ['always', 'usually', 'often', 'every day', 'rarely', 'never', 'on Mondays'],
    uses: [
      'Habits, Routines & Repeated Actions: Describes activities performed regularly as part of daily life or lifestyle, often paired with adverbs of frequency (always, usually, every day).',
      'General Facts, Universal Truths & Scientific Laws: Expresses scientific principles, natural phenomena, and timeless realities that remain consistently true.',
      'Fixed Timetables & Scheduled Future Events: Refers to upcoming events that are set by an official schedule, calendar, or public transportation timetable (flights, classes, trains).',
      'Permanent States & Enduring Conditions: Describes long-lasting situations, residences, occupations, or character states that rarely change (She lives in London).'
    ],
    uses_id: [
      'Kebiasaan, Rutinitas & Pola Hidup: Menyatakan aktivitas yang dilakukan berulang kali secara teratur (sering disertai kata keterangan frekuensi seperti always, usually, every day).',
      'Fakta Umum & Kebenaran Ilmiah Mutlak: Menyatakan kenyataan umum, fenomena alam, atau hukum sains yang selalu berlaku dan tidak berubah (misal: air mendidih pada 100°C).',
      'Jadwal Resmi & Agenda Publik (Timetable): Menyatakan peristiwa masa depan yang sudah terikat jadwal resmi transportasi, jam kantor, atau agenda umum (misal: kereta berangkat pukul 07.15).',
      'Kondisi Menetap (Permanent States): Menggambarkan keadaan yang relatif permanen seperti profesi, tempat tinggal, atau sifat seseorang dalam jangka panjang.'
    ],
    ex: [
      'She works at a city hospital every weekday.',
      'Water boils at 100°C under normal atmospheric pressure.',
      'The morning train leaves promptly at 07:15.'
    ]
  },
  {
    time: 'Present',
    aspect: 'Continuous',
    name: 'Present Continuous',
    formula: 'S + am/is/are + V-ing',
    negFormula: 'S + am/is/are not + V-ing',
    quesFormula: 'Am/Is/Are + S + V-ing?',
    signals: ['now', 'right now', 'at the moment', 'currently', 'this week', 'Look!', 'Listen!'],
    uses: [
      'Actions Happening Right Now: Describes activities actively taking place at the exact moment of speaking (Look!, Listen!, at the moment).',
      'Temporary Situations & Habits: Expresses situations that are true for a limited period around now, contrasting with permanent habits (He is staying with cousins this week).',
      'Definite Personal Arrangements: Refers to fixed plans in the near future where time, place, and people involved have already been agreed upon.',
      'Developing Trends & Gradual Changes: Indicates conditions or habits that are progressively changing or shifting over time (Technology is improving rapidly).'
    ],
    uses_id: [
      'Aksi yang Sedang Berlangsung Saat Ini: Menyatakan perbuatan yang tepat sedang terjadi saat kalimat diucapkan (sering diawali penanda seperti now, at the moment, Look!).',
      'Situasi Sementara (Temporary Situations): Menyatakan keadaan yang berlangsung terbatas untuk periode tertentu dan bukan kebiasaan permanen (misal: ia tinggal bersama sepupunya pekan ini).',
      'Rencana Pasti di Masa Depan Dekat (Definite Arrangements): Menyatakan agenda masa depan yang sudah dipersiapkan dan disepakati waktunya bersama pihak lain.',
      'Tren & Perubahan yang Sedang Berkembang: Menggambarkan situasi yang bertahap berubah atau berkembang seiring berjalannya waktu.'
    ],
    ex: [
      'I am currently preparing for an English presentation.',
      'He is staying with his cousins in Jakarta this week.',
      'We are meeting the design team tomorrow afternoon.'
    ]
  },
  {
    time: 'Present',
    aspect: 'Perfect',
    name: 'Present Perfect',
    formula: 'S + have/has + V3',
    negFormula: 'S + have/has not + V3',
    quesFormula: 'Have/Has + S + V3?',
    signals: ['already', 'yet', 'just', 'ever', 'never', 'since 2020', 'for 5 years', 'so far'],
    uses: [
      'Past Action with Present Consequences: The action concluded in the past, but its result directly impacts the situation right now (I have lost my key — I cannot enter).',
      'Life Experiences Without Specific Time: Discusses accomplishments, visits, or activities experienced at unspecified times in one\'s lifetime up to the present.',
      'Continuity from Past into the Present: Used with "since" (starting point) and "for" (duration) for situations that started earlier and still continue today.',
      'Recent Completed Events (just, already, yet): Highlights newly finished tasks or actions that were expected to occur (She has already submitted the report).'
    ],
    uses_id: [
      'Peristiwa Lampau Berdampak Langsung ke Masa Kini: Menyatakan aksi lampau yang sudah selesai, namun hasil atau konsekuensinya terasa nyata sekarang (misal: kunci hilang sehingga sekarang tidak bisa masuk).',
      'Pengalaman Hidup Tanpa Waktu Spesifik: Menceritakan apa yang pernah atau belum pernah dialami seseorang sepanjang hidupnya hingga saat ini (misal: sudah pernah ke Jepang tiga kali).',
      'Aktivitas yang Dimulai Dulu & Masih Berlanjut: Digunakan bersama "since" (sejak titik waktu) atau "for" (selama durasi) untuk menyatakan hal yang masih berjalan hingga kini.',
      'Aksi yang Baru Saja Selesai (Recent Actions): Menggunakan kata just, already, atau yet untuk mengindikasikan pekerjaan yang baru saja tuntas.'
    ],
    ex: [
      'I have already submitted the project report to my supervisor.',
      'She has visited Japan three times and loves the cuisine.',
      'They have lived in Jakarta since 2019.'
    ]
  },
  {
    time: 'Present',
    aspect: 'Perfect Continuous',
    name: 'Present Perfect Continuous',
    formula: 'S + have/has + been + V-ing',
    negFormula: 'S + have/has not been + V-ing',
    quesFormula: 'Have/Has + S + been + V-ing?',
    signals: ['for 3 hours', 'since morning', 'all day', 'lately', 'recently', 'How long...?'],
    uses: [
      'Emphasising Duration of an Ongoing Process: Heavily stresses the elapsed length of time an activity has been unfolding from the past into the present moment.',
      'Recent Continuous Action with Observable Evidence: The action recently stopped, but tangible physical evidence is visibly noticeable right now (The roads are wet because it has been raining).',
      'Repeated Ongoing Activities Lately: Highlights fresh temporary routines that have been recurring repeatedly over recent days or weeks.'
    ],
    uses_id: [
      'Menekankan Durasi Panjang Aktivitas: Berfokus pada proses dan lamanya waktu suatu kegiatan yang dimulai di masa lalu dan masih terus berjalan saat ini (misal: sudah belajar selama 3 jam).',
      'Aksi Berdurasi yang Baru Berhenti dengan Bukti Nyata: Perbuatan yang baru tuntas sejenak, di mana tanda-tanda fisiknya masih tampak jelas (misal: jalanan basah karena hujan turun sepanjang pagi).',
      'Situasi Sementara yang Terus Diulang Akhir-akhir Ini: Mengungkapkan kebiasaan baru yang berlangsung berulang kali belakangan ini (lately / recently).'
    ],
    ex: [
      'I have been studying grammar rules for three hours without a break.',
      'It has been raining all morning, so the roads are still slippery.',
      'She is exhausted because she has been working non-stop.'
    ]
  },
  {
    time: 'Past',
    aspect: 'Simple',
    name: 'Past Simple',
    formula: 'S + V2',
    negFormula: 'S + did not + V1',
    quesFormula: 'Did + S + V1?',
    signals: ['yesterday', 'last night', 'two days ago', 'in 2019', 'when I was young'],
    uses: [
      'Completed Actions at a Definite Past Time: Expresses an event that began and concluded entirely at a specific finished point in the past (yesterday, in 2021).',
      'Chronological Sequence in Storytelling: Connects multiple completed actions in narrative order (He entered the room, opened the window, and sat down).',
      'Past Habits or Long-Term Finished States: Describes routines or personal facts in the past that are no longer true today (I played badminton every weekend as a student).'
    ],
    uses_id: [
      'Aksi Tuntas pada Waktu Lampau yang Spesifik: Menyatakan peristiwa yang dimulai dan sudah selesai seutuhnya di masa lampau dengan penanda waktu yang jelas (yesterday, last year, in 2019).',
      'Rangkaian Kronologis dalam Cerita (Narrative Chain): Menceritakan urutan kejadian masa lalu secara beruntun satu demi satu.',
      'Kebiasaan Masa Lalu yang Sudah Berakhir: Menceritakan rutinitas lama yang sekarang sudah tidak lagi dilakukan (sepadan dengan makna used to).'
    ],
    ex: [
      'We visited the national museum yesterday afternoon.',
      'He closed the laptop, grabbed his keys, and left the office.',
      'I played badminton every weekend when I was in school.'
    ]
  },
  {
    time: 'Past',
    aspect: 'Continuous',
    name: 'Past Continuous',
    formula: 'S + was/were + V-ing',
    negFormula: 'S + was/were not + V-ing',
    quesFormula: 'Was/Were + S + V-ing?',
    signals: ['at 8 p.m. yesterday', 'while', 'as', 'when', 'all night long'],
    uses: [
      'Action in Progress at a Specific Past Moment: Highlights an activity that was already underway at a designated exact time in the past (At 8 p.m., I was studying).',
      'Background Action Interrupted by Another Event: A longer ongoing background action is interrupted by a shorter, sudden simple past event (While I was cooking, the phone rang).',
      'Simultaneous Parallel Actions: Two separate continuous actions progressing concurrently at the same time in the past.'
    ],
    uses_id: [
      'Aksi yang Sedang Berjalan pada Jam Spesifik di Masa Lalu: Menunjukkan aktivitas yang tepat sedang berlangsung pada titik waktu lampau tertentu (misal: pukul 8 malam kemarin saya sedang belajar).',
      'Aktivitas Latar yang Disela Kejadian Lain: Menyatakan perbuatan berdurasi yang sedang berjalan, lalu terpotong atau disela aksi singkat lain (While I was cooking, someone knocked).',
      'Dua Aksi Berjalan Simultan di Masa Lalu: Menggambarkan dua aktivitas berbeda yang berlangsung secara bersamaan di masa lampau (She was reading while he was studying).'
    ],
    ex: [
      'At 8 p.m. yesterday, I was reviewing my vocabulary flashcards.',
      'While I was cooking dinner, someone knocked on the door.',
      'She was reading a novel while her brother was studying.'
    ]
  },
  {
    time: 'Past',
    aspect: 'Perfect',
    name: 'Past Perfect',
    formula: 'S + had + V3',
    negFormula: 'S + had not + V3',
    quesFormula: 'Had + S + V3?',
    signals: ['before', 'after', 'by the time', 'already', 'never before', 'until that day'],
    uses: [
      'Earlier Event Before Another Past Event ("Past of the Past"): Clarifies which of two past actions occurred first (The train had left before we reached the platform).',
      'Cause-and-Effect in Past Contexts: Explains the past reason behind a past condition or emotional state (She felt confident because she had prepared thoroughly).',
      'Unfulfilled or Novel Situations Before a Past Time: Notes conditions or states that had never occurred up to that designated past moment.'
    ],
    uses_id: [
      'Peristiwa yang Tuntas Sebelum Peristiwa Lampau Lainnya ("Past of the Past"): Menegaskan kejadian mana yang terjadi lebih awal di antara dua kejadian masa lalu (kereta sudah berangkat sebelum kami tiba).',
      'Menjelaskan Penyebab Lampau dari Kondisi Masa Lalu: Menjelaskan alasan atau sebab di balik situasi atau perasaan seseorang di masa lampau.',
      'Kondisi yang Belum Pernah Terjadi Sebelumnya: Menyatakan pengalaman pertama hingga titik waktu lampau tertentu.'
    ],
    ex: [
      'By the time the manager arrived, the team had already solved the issue.',
      'She felt confident during the interview because she had prepared thoroughly.',
      'The train had already left before we reached the platform.'
    ]
  },
  {
    time: 'Past',
    aspect: 'Perfect Continuous',
    name: 'Past Perfect Continuous',
    formula: 'S + had + been + V-ing',
    negFormula: 'S + had not been + V-ing',
    quesFormula: 'Had + S + been + V-ing?',
    signals: ['for two hours before', 'since morning until', 'before', 'all afternoon'],
    uses: [
      'Duration Before Another Defined Past Milestone: Stresses the continuous duration of an ongoing action before another past event took place (They had been negotiating for hours).',
      'Explaining Observable Past Conditions: Supplies the direct past cause for a visible physical or emotional state in the past (His eyes were sore because he had been reading in dim light).'
    ],
    uses_id: [
      'Durasi Aktivitas Berkelanjutan Sebelum Titik Lampau Lainnya: Menekankan berapa lama suatu kegiatan telah berlangsung tanpa putus sebelum kejadian lampau lain terjadi (mereka sudah bernegosiasi berjam-jam).',
      'Penyebab Langsung dari Kondisi Fisik di Masa Lalu: Menerangkan alasan di balik kondisi fisik atau emosional lampau yang terlihat (matanya lelah karena telah membaca seharian).'
    ],
    ex: [
      'They had been negotiating for two hours before reaching an agreement.',
      'His eyes were tired because he had been reading in dim light.',
      'She had been waiting for forty minutes before the bus arrived.'
    ]
  },
  {
    time: 'Future',
    aspect: 'Simple',
    name: 'Future Simple (will)',
    formula: 'S + will + V1',
    negFormula: 'S + will not (won\'t) + V1',
    quesFormula: 'Will + S + V1?',
    signals: ['tomorrow', 'next week', 'soon', 'in the future', 'probably', 'I think'],
    uses: [
      'Spontaneous Decisions at Speaking Time ("will"): Decisions made instantly without prior planning (The doorbell is ringing; I will answer it).',
      'Pre-decided Intentions & Plans ("be going to"): Intentions already settled upon before the present conversation (We are going to launch the module next week).',
      'Future Predictions: Uses "will" for personal opinions or guesses, and "be going to" when observable present clues exist (Look at the clouds; it is going to rain).',
      'Promises, Offers & Firm Refusals: Expresses commitments, helpful offers, or resolute refusals (I will help you review your work; I won\'t give up).'
    ],
    uses_id: [
      'Keputusan Spontan Saat Berbicara ("will"): Mengambil keputusan seketika tanpa perencanaan sebelumnya (bel berbunyi, saya akan membukakan pintu).',
      'Rencana & Niat yang Sudah Diputuskan Lebih Dulu ("be going to"): Menyatakan niat yang telah dipikirkan sebelum momen berbicara (kami berencana meluncurkan materi baru pekan depan).',
      'Prediksi Masa Depan: Menggunakan will untuk perkiraan berdasarkan opini pribadi, atau be going to jika ada bukti nyata yang tampak.',
      'Janji, Tawaran & Penolakan Tegas: Digunakan untuk berjanji (I will help you), menawarkan bantuan, atau menyatakan penolakan tegas.'
    ],
    ex: [
      'The phone is ringing; I will answer it right away.',
      'I believe the weather will be pleasant this weekend.',
      'I will help you review your grammar exercises after lunch.'
    ]
  },
  {
    time: 'Future',
    aspect: 'Continuous',
    name: 'Future Continuous',
    formula: 'S + will + be + V-ing',
    negFormula: 'S + will not be + V-ing',
    quesFormula: 'Will + S + be + V-ing?',
    signals: ['this time tomorrow', 'at 10 a.m. next Monday', 'in a few hours'],
    uses: [
      'Action in Progress at a Future Moment: Confirms you will be actively engaged in the middle of doing something at a specific upcoming time.',
      'Routine or Naturally Expected Events: Describes events that will unfold naturally as part of ordinary schedules without requiring special arrangement.',
      'Polite Inquiries About Others\' Plans: Gently inquires about someone\'s schedule to find out availability without exerting pressure.'
    ],
    uses_id: [
      'Aksi yang Sedang Berjalan pada Jam Tertentu di Masa Depan: Menegaskan bahwa pada waktu spesifik nanti, kita sedang berada di tengah-tengah melakukan aktivitas tersebut (jam begini besok saya sedang terbang ke Bali).',
      'Agenda Rutin yang Pasti Berjalan Sewajarnya: Menyatakan peristiwa yang akan berjalan alami sesuai jadwal rutin biasa tanpa perlu diatur ulang.',
      'Menanyakan Rencana Orang Lain Secara Sopan: Menanyakan agenda orang lain secara halus untuk memastikan ketersediaan waktu mereka.'
    ],
    ex: [
      'This time tomorrow, I will be flying across the country.',
      'At 9 a.m. tomorrow, we will be attending the orientation workshop.',
      'Don’t call at noon; he will be having lunch with clients.'
    ]
  },
  {
    time: 'Future',
    aspect: 'Perfect',
    name: 'Future Perfect',
    formula: 'S + will + have + V3',
    negFormula: 'S + will not have + V3',
    quesFormula: 'Will + S + have + V3?',
    signals: ['by next month', 'by the end of the year', 'by 5 p.m.', 'in two weeks'],
    uses: [
      'Action Completed Before a Future Deadline: Assures that an activity will be completely finished before a designated deadline arrives (by 5 p.m., by next month).',
      'Setting Measurable Goals & Milestones: Projects achievement targets completed ahead of a specific future moment in time.'
    ],
    uses_id: [
      'Pekerjaan yang Dipastikan Selesai Sebelum Tenggat Masa Depan: Menyatakan target atau pekerjaan yang akan sudah tuntas sebelum titik waktu tertentu (sering menggunakan by next week, by 5 p.m.).',
      'Menetapkan Milestone & Target Pencapaian Terukur: Menetapkan pencapaian target belajar atau proyek yang terselesaikan secara terukur.'
    ],
    ex: [
      'By next December, she will have completed her university degree.',
      'We will have mastered all 12 tenses by the end of this month.',
      'By 5 p.m., the technicians will have finished the system maintenance.'
    ]
  },
  {
    time: 'Future',
    aspect: 'Perfect Continuous',
    name: 'Future Perfect Continuous',
    formula: 'S + will + have + been + V-ing',
    negFormula: 'S + will not have been + V-ing',
    quesFormula: 'Will + S + have been + V-ing?',
    signals: ['by next year for 10 years', 'by next month for 6 months'],
    uses: [
      'Accumulated Duration Up to a Future Milestone: Stresses the total accumulated time of an ongoing effort when a designated future date is reached.',
      'Celebrating Long-Term Continuity: Highlights dedication and sustained practice projected into the future (In October, I will have been studying for a full year).'
    ],
    uses_id: [
      'Menghitung Akumulasi Durasi Panjang Hingga Titik Masa Depan: Menekankan berapa lama total waktu suatu kegiatan akan telah berlangsung saat mencapai titik masa depan tertentu (tahun depan genap 10 tahun bekerja sama).',
      'Merayakan Capaian Waktu / Konsistensi Belajar: Menggarisbawahi dedikasi dan konsistensi waktu yang terus berlanjut ke masa depan.'
    ],
    ex: [
      'By next June, they will have been working together for a full decade.',
      'Next month, I will have been studying with EngSphere for one full year.',
      'By midnight, the driver will have been driving for eight consecutive hours.'
    ]
  }
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

export const Q = (q, o, a, x, id, x_id) => ({
  id: id || (q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36)),
  q,
  options: o,
  answer: a,
  explain: x,
  explain_id: x_id || x
});

export const BANK = {
  tenses: {
    beginner: [
      Q('She ____ to school every day.', ['go', 'goes', 'going', 'gone'], 1, 'Present Simple with he/she/it adds -s: "She goes."', 'ten-b-1', 'Present Simple untuk subjek he/she/it mendapatkan tambahan -s/-es: "She goes."'),
      Q('Right now, they ____ football in the park.', ['play', 'plays', 'are playing', 'played'], 2, 'An action happening now uses Present Continuous: are + V-ing.', 'ten-b-2', 'Aktivitas yang sedang berlangsung saat ini menggunakan Present Continuous: are + V-ing ("are playing").'),
      Q('Yesterday I ____ a new book.', ['buy', 'buys', 'bought', 'buying'], 2, '"Yesterday" indicates finished past time, so use Past Simple: bought.', 'ten-b-3', 'Kata "yesterday" menandakan waktu lampau yang sudah selesai, sehingga gunakan Past Simple (V2): bought.'),
      Q('We ____ visit my grandmother tomorrow.', ['will', 'are', 'was', 'have'], 0, 'A future plan or prediction uses will + V1.', 'ten-b-4', 'Rencana masa depan atau prediksi menggunakan will + V1: "will visit".')
    ],
    intermediate: [
      Q('By the time we arrived, the film ____.', ['started', 'has started', 'had started', 'was starting'], 2, 'Past Perfect shows the film started before the other past action (our arrival).', 'ten-i-1', 'Past Perfect (had + V3) digunakan karena film sudah dimulai sebelum kejadian lampau lainnya (kedatangan kami): "had started".'),
      Q('I ____ here since 2020.', ['work', 'worked', 'have been working', 'will work'], 2, '"Since 2020" means it began in the past and continues — Present Perfect Continuous.', 'ten-i-2', 'Keterangan waktu "since 2020" menandakan aksi yang dimulai di masa lampau dan masih berlanjut hingga sekarang — gunakan Present Perfect Continuous: "have been working".'),
      Q('This time next week, I ____ on a beach.', ['will lie', 'will be lying', 'will have lain', 'lie'], 1, 'Future Continuous describes an action in progress at a specific future moment.', 'ten-i-3', 'Future Continuous (will be + V-ing) menggambarkan aksi yang sedang berlangsung pada waktu tertentu di masa depan: "will be lying".')
    ],
    advanced: [
      Q('Hardly ____ the door when the phone rang.', ['I had closed', 'had I closed', 'I closed', 'did I close'], 1, 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".', 'ten-a-1', 'Setelah kata keterangan negatif seperti "hardly", posisi subjek dan kata kerja bantu dibalik (inversi): "had I closed".'),
      Q('By next June, they ____ together for a decade.', ['will work', 'will be working', 'will have been working', 'have worked'], 2, 'Duration up to a future point takes Future Perfect Continuous.', 'ten-a-2', 'Durasi yang berlanjut hingga titik waktu tertentu di masa depan menggunakan Future Perfect Continuous: "will have been working".')
    ]
  },
  tobe: {
    beginner: [
      Q('I ____ a student.', ['am', 'is', 'are', 'be'], 0, '"I" always takes "am".', 'tb-b-1', 'Subjek "I" dalam Simple Present selalu berpasangan dengan to be "am".'),
      Q('They ____ in the classroom.', ['am', 'is', 'are', 'was'], 2, 'Plural subjects (they, we, you) take "are".', 'tb-b-2', 'Subjek jamak (they, we, you) dalam Simple Present berpasangan dengan "are".'),
      Q('She ____ tired yesterday.', ['is', 'was', 'were', 'are'], 1, 'Past of "is" for she/he/it is "was".', 'tb-b-3', 'Bentuk lampau (past tense) dari "is" untuk subjek she/he/it adalah "was".')
    ],
    intermediate: [
      Q('The letters ____ sent last Monday.', ['was', 'were', 'are', 'is'], 1, 'Passive in the past with a plural subject: "were sent".', 'tb-i-1', 'Bentuk pasif masa lampau dengan subjek jamak ("The letters") menggunakan "were + V3": "were sent".'),
      Q('____ there any milk left?', ['Are', 'Is', 'Were', 'Am'], 1, '"Milk" is uncountable, so it takes the singular "Is there".', 'tb-i-2', '"Milk" adalah kata benda tak dapat dihitung (uncountable noun), sehingga menggunakan bentuk tunggal "Is there".')
    ],
    advanced: [
      Q('By the time the project was reviewed, several issues ____ already been found.', ['had', 'were', 'have', 'are'], 0, 'Past perfect passive: had been found.', 'tb-a-1', 'Bentuk kalimat pasif Past Perfect: "had been found" (sudah ditemukan sebelum proses evaluasi selesai).')
    ]
  },
  vocabulary: {
    beginner: [
      Q('I need to run a few ____ before going home.', ['chores', 'errands', 'routines', 'tasks'], 1, '"Run errands" is the natural collocation for short trips to do small jobs.', 'voc-b-1', 'Kolokasi alami dalam bahasa Inggris adalah "run errands" (pergi sebentar untuk mengurus keperluan atau tugas belanja singkat).'),
      Q('Can I ____ a cup of coffee before the meeting starts?', ['grab', 'tidy', 'commute', 'spare'], 0, '"Grab a coffee" is an everyday informal phrase meaning to quickly get a coffee.', 'voc-b-2', '"Grab a coffee" adalah frasa percakapan sehari-hari yang artinya membeli atau mengambil secangkir kopi dengan cepat.')
    ],
    intermediate: [
      Q('The manager ____ the new marketing project to Sarah.', ['assigned', 'analysed', 'concluded', 'delayed'], 0, '"To assign" means to give someone a particular task, duty, or project.', 'voc-i-1', '"Assign" berarti menugaskan atau mempercayakan suatu proyek/tugas kepada seseorang.'),
      Q('Our flight was held up by a two-hour ____ due to heavy fog.', ['itinerary', 'delay', 'departure', 'workload'], 1, 'A "delay" is a period of waiting or when something is postponed.', 'voc-i-2', '"Delay" adalah penundaan atau keterlambatan keberangkatan akibat cuaca atau kabut tebal.')
    ],
    advanced: [
      Q('The research team must ____ the survey data before publishing conclusions.', ['analyse', 'summarise', 'commute', 'contrast'], 0, '"Analyse" means examining data or information in careful detail.', 'voc-a-1', '"Analyse" berarti menganalisis data atau informasi survei secara mendalam sebelum menarik kesimpulan.')
    ]
  },
  grammar: {
    beginner: [
      Q('She bought ____ apple and two oranges at the supermarket.', ['a', 'an', 'the', 'some'], 1, 'Use "an" before words starting with a vowel sound: "an apple".', 'grm-b-1', 'Gunakan artikel "an" di depan kata yang berawalan bunyi huruf vokal: "an apple".'),
      Q('They arrived in London ____ Friday afternoon.', ['at', 'on', 'in', 'by'], 1, 'Use the preposition "on" for days of the week: "on Friday".', 'grm-b-2', 'Gunakan kata depan (preposisi) "on" untuk nama-nama hari dan bagian hari tertentu: "on Friday".')
    ],
    intermediate: [
      Q('If I ____ you, I would consult a professional before deciding.', ['am', 'was', 'were', 'had been'], 2, 'In second (unreal) conditionals, "were" is conventionally used for all subjects.', 'grm-i-1', 'Dalam Second Conditional (pengandaian situasi tak nyata), kata kerja bantu "were" digunakan secara baku untuk semua subjek: "If I were you".'),
      Q('The package was delivered to someone ____ didn\'t live in this building.', ['which', 'who', 'whose', 'whom'], 1, 'Use the relative pronoun "who" when referring to people as subjects.', 'grm-i-2', 'Gunakan kata ganti penghubung (relative pronoun) "who" untuk merujuk pada orang sebagai subjek kalimat.')
    ],
    advanced: [
      Q('Scarcely ____ the station when the train pulled away from the platform.', ['had we reached', 'we had reached', 'we reached', 'did we reach'], 0, 'Negative inversions with "scarcely... when" require inversion.', 'grm-a-1', 'Pola inversi negatif dengan frasa "scarcely... when" mengharuskan susunan kata kerja bantu sebelum subjek: "had we reached".')
    ]
  }
};

export const STORAGE_KEY = 'engsphere-state';
