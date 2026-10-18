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
    ],
    ex_id: [
      'Dia bekerja di rumah sakit kota setiap hari kerja.',
      'Air mendidih pada suhu 100°C di bawah tekanan atmosfer normal.',
      'Kereta pagi berangkat tepat waktu pada pukul 07.15.'
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
    ],
    ex_id: [
      'Saya saat ini sedang bersiap untuk presentasi bahasa Inggris.',
      'Dia tinggal sementara bersama sepupunya di Jakarta pekan ini.',
      'Kami sudah menjadwalkan pertemuan dengan tim desain besok siang.'
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
    ],
    ex_id: [
      'Saya sudah mengumpulkan laporan proyek kepada atasan saya.',
      'Dia sudah mengunjungi Jepang tiga kali dan menyukai kulinernya.',
      'Mereka telah tinggal di Jakarta sejak tahun 2019 (dan masih tinggal hingga kini).'
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
    ],
    ex_id: [
      'Saya telah belajar aturan tata bahasa selama tiga jam tanpa istirahat.',
      'Hujan turun terus sepanjang pagi, jadi jalanan masih licin.',
      'Dia kelelahan karena telah bekerja tanpa henti.'
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
    ],
    ex_id: [
      'Kami mengunjungi museum nasional kemarin sore.',
      'Dia menutup laptopnya, mengambil kuncinya, lalu keluar kantor.',
      'Saya bermain bulu tangkis setiap akhir pekan saat masih bersekolah.'
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
    ],
    ex_id: [
      'Pada pukul 8 malam kemarin, saya sedang mengulang kartu flashcard kosakata saya.',
      'Ketika saya sedang memasak makan malam, seseorang mengetuk pintu.',
      'Dia sedang membaca novel sementara saudara laki-lakinya sedang belajar.'
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
    ],
    ex_id: [
      'Saat manajer tiba, tim sudah lebih dahulu menyelesaikan masalah tersebut.',
      'Dia merasa percaya diri saat wawancara karena telah mempersiapkan diri dengan matang sebelumnya.',
      'Kereta telah berangkat sebelum kami sampai di peron stasiun.'
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
    ],
    ex_id: [
      'Mereka telah bernegosiasi selama dua jam sebelum mencapai kata sepakat.',
      'Matanya lelah karena telah membaca di tempat yang redup sepanjang waktu sebelumnya.',
      'Dia telah menunggu selama empat puluh menit sebelum bus akhirnya tiba.'
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
    ],
    ex_id: [
      'Teleponnya berdering; saya akan langsung mengangkatnya.',
      'Saya yakin cuaca akan menyenangkan akhir pekan ini.',
      'Saya akan membantumu memeriksa latihan tata bahasamu setelah makan siang.'
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
    ],
    ex_id: [
      'Jam segini besok, saya akan sedang dalam penerbangan melintasi negeri.',
      'Pukul 9 pagi besok, kami dipastikan sedang menghadiri lokakarya orientasi.',
      'Jangan menelepon pada tengah hari; dia akan sedang makan siang bersama klien.'
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
    ],
    ex_id: [
      'Menjelang Desember tahun depan, dia akan sudah menyelesaikan gelar sarjananya.',
      'Kita akan sudah menguasai seluruh 12 tenses sebelum akhir bulan ini.',
      'Sebelum pukul 5 sore, para teknisi akan sudah merampungkan pemeliharaan sistem.'
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
    ],
    ex_id: [
      'Menjelang Juni tahun depan, mereka akan sudah genap bekerja sama selama satu dekade penuh.',
      'Bulan depan, saya akan sudah genap belajar bersama EngSphere selama satu tahun penuh.',
      'Menjelang tengah malam, pengemudi tersebut akan sudah berkendara selama delapan jam berturut-turut.'
    ]
  }
];

export { VOCAB, EXTENDED_OXFORD_LEXICON, LEMMA_MAP } from './vocab-data.js';

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
      Q('We ____ visit my grandmother tomorrow.', ['will', 'are', 'was', 'have'], 0, 'A future plan or prediction uses will + V1.', 'ten-b-4', 'Rencana masa depan atau prediksi menggunakan will + V1: "will visit".'),
      Q('My father ____ coffee every morning before work.', ['drink', 'drinks', 'drinking', 'drank'], 1, 'Habits and routines in the Present Simple add -s for singular third-person subjects: "drinks".', 'ten-b-5', 'Kebiasaan rutin dalam Present Simple menambahkan akhiran -s untuk subjek orang ketiga tunggal (he/she/it): "drinks".'),
      Q('Listen! Someone ____ at the front door.', ['knocks', 'is knocking', 'knock', 'knocked'], 1, '"Listen!" indicates an event happening right at this moment: Present Continuous ("is knocking").', 'ten-b-6', 'Kata seru "Listen!" menandakan kejadian yang sedang berlangsung saat diucapkan: Present Continuous ("is knocking").'),
      Q('They ____ in Tokyo for two years before moving to Osaka.', ['live', 'lived', 'lives', 'living'], 1, 'A completed period in the past uses Past Simple: "lived".', 'ten-b-7', 'Kejadian atau masa tinggal yang sudah selesai di masa lampau menggunakan Past Simple: "lived".'),
      Q('The sun ____ in the east.', ['rise', 'rises', 'rising', 'rose'], 1, 'Universal truths and scientific facts always use Present Simple: "rises".', 'ten-b-8', 'Kebenaran umum atau fakta alamiah selalu menggunakan Present Simple: "rises".'),
      Q('I ____ you an email as soon as I finish the report tomorrow.', ['send', 'will send', 'sent', 'am sending'], 1, 'Promising a future action uses "will + V1": "will send".', 'ten-b-9', 'Menyatakan janji aksi di masa depan menggunakan modal future "will send".')
    ],
    intermediate: [
      Q('By the time we arrived, the film ____.', ['started', 'has started', 'had started', 'was starting'], 2, 'Past Perfect shows the film started before the other past action (our arrival).', 'ten-i-1', 'Past Perfect (had + V3) digunakan karena film sudah dimulai sebelum kejadian lampau lainnya (kedatangan kami): "had started".'),
      Q('I ____ here since 2020.', ['work', 'worked', 'have been working', 'will work'], 2, '"Since 2020" means it began in the past and continues — Present Perfect Continuous.', 'ten-i-2', 'Keterangan waktu "since 2020" menandakan aksi yang dimulai di masa lampau dan masih berlanjut hingga sekarang — gunakan Present Perfect Continuous: "have been working".'),
      Q('This time next week, I ____ on a beach.', ['will lie', 'will be lying', 'will have lain', 'lie'], 1, 'Future Continuous describes an action in progress at a specific future moment.', 'ten-i-3', 'Future Continuous (will be + V-ing) menggambarkan aksi yang sedang berlangsung pada waktu tertentu di masa depan: "will be lying".'),
      Q('While I ____ to work, it suddenly started to pour with rain.', ['drove', 'was driving', 'drive', 'had driven'], 1, 'Past Continuous (was driving) describes the longer background action interrupted by a shorter action.', 'ten-i-4', 'Past Continuous (was driving) menggambarkan aksi latar yang sedang berlangsung saat diinterupsi oleh kejadian lain di masa lampau.'),
      Q('She has lived in this city ____ almost ten years.', ['since', 'for', 'during', 'while'], 1, 'Use "for" with periods/duration of time ("for ten years"), and "since" with specific starting points.', 'ten-i-5', 'Gunakan "for" untuk periode atau durasi waktu ("for ten years"), dan "since" untuk titik awal waktu.'),
      Q('When we got to the station, we realized the train ____.', ['left', 'had already left', 'has left', 'was leaving'], 1, 'Past Perfect ("had already left") shows an action occurred prior to another past event.', 'ten-i-6', 'Past Perfect ("had already left") digunakan untuk aksi yang telah terjadi lebih dahulu sebelum kejadian masa lampau lainnya.'),
      Q('He ____ three cups of coffee this morning, and the meeting is still going on.', ['has drunk', 'drank', 'drinks', 'was drinking'], 0, 'Present Perfect connects an action within an unfinished time frame (this morning) to the present.', 'ten-i-7', 'Present Perfect digunakan ketika jangka waktu (this morning) masih relevan dengan saat ini.'),
      Q('They ____ for over forty minutes before the bus finally arrived.', ['had been waiting', 'were waiting', 'have waited', 'wait'], 0, 'Past Perfect Continuous emphasizes duration leading up to a specific moment in the past.', 'ten-i-8', 'Past Perfect Continuous ("had been waiting") menekankan durasi aksi yang berlangsung sebelum kejadian lain terjadi di masa lampau.')
    ],
    advanced: [
      Q('Hardly ____ the door when the phone rang.', ['I had closed', 'had I closed', 'I closed', 'did I close'], 1, 'After a negative adverbial like "hardly", the subject and auxiliary invert: "had I closed".', 'ten-a-1', 'Setelah kata keterangan negatif seperti "hardly", posisi subjek dan kata kerja bantu dibalik (inversi): "had I closed".'),
      Q('By next June, they ____ together for a decade.', ['will work', 'will be working', 'will have been working', 'have worked'], 2, 'Duration up to a future point takes Future Perfect Continuous.', 'ten-a-2', 'Durasi yang berlanjut hingga titik waktu tertentu di masa depan menggunakan Future Perfect Continuous: "will have been working".'),
      Q('Seldom ____ such extraordinary resilience in the face of adversity.', ['have we witnessed', 'we have witnessed', 'we witnessed', 'did we witnessed'], 0, 'Negative frequency adverbial "Seldom" triggers subject-auxiliary inversion: "have we witnessed".', 'ten-a-3', 'Kata keterangan frekuensi negatif "Seldom" memicu pembalikan struktur (inversi): "have we witnessed".'),
      Q('If she ____ the warning signs earlier, the catastrophe could have been averted.', ['heeded', 'had heeded', 'has heeded', 'would heed'], 1, 'Third conditional uses Past Perfect in the if-clause: "had heeded".', 'ten-a-4', 'Third Conditional (pengandaian masa lampau) menggunakan Past Perfect di anak kalimat: "had heeded".'),
      Q('No sooner ____ the podium than the audience broke into applause.', ['did he step onto', 'had he stepped onto', 'he had stepped onto', 'he stepped onto'], 1, 'Inversion structure with "No sooner ... than" requires "had + subject + V3": "had he stepped onto".', 'ten-a-5', 'Pola inversi "No sooner ... than" mengharuskan susunan kata bantu "had + subjek + V3": "had he stepped onto".'),
      Q('Had the committee ____ of the conflicts, they would have postponed the vote.', ['known', 'knew', 'know', 'been knowing'], 0, 'Inverted conditional without "if" starts with "Had + subject + V3": "Had the committee known".', 'ten-a-6', 'Inversi kalimat pengandaian tipe 3 tanpa "if" diawali dengan "Had + subjek + V3": "Had the committee known".')
    ]
  },
  tobe: {
    beginner: [
      Q('I ____ a student.', ['am', 'is', 'are', 'be'], 0, '"I" always takes "am".', 'tb-b-1', 'Subjek "I" dalam Simple Present selalu berpasangan dengan to be "am".'),
      Q('They ____ in the classroom.', ['am', 'is', 'are', 'was'], 2, 'Plural subjects (they, we, you) take "are".', 'tb-b-2', 'Subjek jamak (they, we, you) dalam Simple Present berpasangan dengan "are".'),
      Q('She ____ tired yesterday.', ['is', 'was', 'were', 'are'], 1, 'Past of "is" for she/he/it is "was".', 'tb-b-3', 'Bentuk lampau (past tense) dari "is" untuk subjek she/he/it adalah "was".'),
      Q('We ____ very excited about our upcoming holiday trip.', ['am', 'is', 'are', 'be'], 2, 'Subjek jamak "We" menggunakan to be "are" dalam Present Tense.', 'tb-b-4', 'Subjek jamak "We" menggunakan to be "are" dalam Present Tense.'),
      Q('Where ____ my car keys? I cannot find them anywhere.', ['is', 'are', 'am', 'was'], 1, '"Keys" is plural, so use the plural to be "are": "Where are my car keys?"', 'tb-b-5', 'Kata benda "keys" berbentuk jamak (plural), sehingga gunakan to be "are".'),
      Q('The weather ____ surprisingly warm last Sunday.', ['is', 'was', 'were', 'are'], 1, 'Singular subject "The weather" in past time ("last Sunday") takes "was".', 'tb-b-6', 'Subjek tunggal "The weather" dengan keterangan lampau ("last Sunday") menggunakan to be "was".'),
      Q('Marcus and Sarah ____ not at the meeting this morning.', ['was', 'were', 'is', 'are'], 1, 'Two people joined by "and" form a plural subject in the past: "were".', 'tb-b-7', 'Dua orang yang dihubungkan dengan "and" membentuk subjek jamak lampau: "were not".'),
      Q('____ you ready to order dinner now?', ['Are', 'Is', 'Am', 'Was'], 0, 'Questions addressing "you" in the present take "Are": "Are you ready?"', 'tb-b-8', 'Pertanyaan untuk subjek "you" di waktu sekarang menggunakan to be "Are".')
    ],
    intermediate: [
      Q('The letters ____ sent last Monday.', ['was', 'were', 'are', 'is'], 1, 'Passive in the past with a plural subject: "were sent".', 'tb-i-1', 'Bentuk pasif masa lampau dengan subjek jamak ("The letters") menggunakan "were + V3": "were sent".'),
      Q('____ there any milk left?', ['Are', 'Is', 'Were', 'Am'], 1, '"Milk" is uncountable, so it takes the singular "Is there".', 'tb-i-2', '"Milk" adalah kata benda tak dapat dihitung (uncountable noun), sehingga menggunakan bentuk tunggal "Is there".'),
      Q('The historical cathedral ____ built in the seventeenth century.', ['was', 'were', 'is', 'has'], 0, 'Singular subject in past passive takes "was + past participle": "was built".', 'tb-i-3', 'Kalimat pasif lampau untuk subjek tunggal menggunakan "was + V3": "was built".'),
      Q('You are coming with us to the cinema, ____ you?', ['aren\'t', 'isn\'t', 'don\'t', 'won\'t'], 0, 'Positive statement with "are" takes negative tag "aren\'t you?".', 'tb-i-4', 'Pernyataan positif dengan to be "are" menggunakan question tag negatif "aren\'t you?".'),
      Q('There ____ several unexpected delays during our flight.', ['was', 'were', 'is', 'has been'], 1, '"Delays" is plural, requiring the plural past form "There were".', 'tb-i-5', 'Kata "delays" berbentuk jamak, sehingga memerlukan bentuk lampau jamak "There were".'),
      Q('The new bridge is currently ____ constructed across the bay.', ['been', 'being', 'be', 'is'], 1, 'Present continuous passive uses "is/are being + V3": "is being constructed".', 'tb-i-6', 'Bentuk pasif continuous yang sedang berlangsung menggunakan "is being + V3": "is being constructed".'),
      Q('Neither of the proposals ____ acceptable to the board.', ['were', 'was', 'are', 'have been'], 1, 'Formal grammar treats "neither of..." with a singular verb: "was acceptable".', 'tb-i-7', 'Secara tata bahasa baku, frasa "neither of..." berpasangan dengan kata kerja/to be tunggal: "was acceptable".')
    ],
    advanced: [
      Q('By the time the project was reviewed, several issues ____ already been found.', ['had', 'were', 'have', 'are'], 0, 'Past perfect passive: had been found.', 'tb-a-1', 'Bentuk kalimat pasif Past Perfect: "had been found" (sudah ditemukan sebelum proses evaluasi selesai).'),
      Q('The confidential files ought to ____ stored in the secure vault.', ['be', 'been', 'being', 'are'], 0, 'Modal "ought to" takes the bare infinitive "be + past participle" in passive voice: "ought to be stored".', 'tb-a-2', 'Modal "ought to" dalam kalimat pasif diikuti oleh bentuk dasar "be + V3": "ought to be stored".'),
      Q('Were the director ____ to resign, the vice president would step in immediately.', ['be', 'to be', 'being', 'been'], 1, 'Formal conditional inversion: "Were [subject] to be / to do" expresses hypothetical future.', 'tb-a-3', 'Pola inversi pengandaian formal: "Were [subjek] to be / to [verb]" menyatakan situasi hipotesis.'),
      Q('The suspect was reported to ____ seen boarding an international flight.', ['have been', 'be', 'being', 'having'], 0, 'Perfect passive infinitive "to have been + V3" refers to an action prior to the reporting.', 'tb-a-4', 'Infinitive pasif sempurna ("to have been seen") merujuk pada peristiwa yang terjadi sebelum laporan dibuat.'),
      Q('Far from ____ discouraged by the rejection, she redoubled her efforts.', ['been', 'being', 'be', 'to be'], 1, 'Prepositions like "from" take a gerund form: "being discouraged".', 'tb-a-5', 'Setelah preposisi (seperti "from"), gunakan bentuk gerund: "being discouraged".')
    ]
  },
  vocabulary: {
    beginner: [
      Q('I need to run a few ____ before going home.', ['chores', 'errands', 'routines', 'tasks'], 1, '"Run errands" is the natural collocation for short trips to do small jobs.', 'voc-b-1', 'Kolokasi alami dalam bahasa Inggris adalah "run errands" (pergi sebentar untuk mengurus keperluan atau tugas belanja singkat).'),
      Q('Can I ____ a cup of coffee before the meeting starts?', ['grab', 'tidy', 'commute', 'spare'], 0, '"Grab a coffee" is an everyday informal phrase meaning to quickly get a coffee.', 'voc-b-2', '"Grab a coffee" adalah frasa percakapan sehari-hari yang artinya membeli atau mengambil secangkir kopi dengan cepat.'),
      Q('She always ____ her bed right after waking up.', ['does', 'makes', 'fixes', 'puts'], 1, 'The standard English collocation is "make the bed".', 'voc-b-3', 'Kolokasi baku dalam bahasa Inggris untuk merapikan tempat tidur adalah "make the bed".'),
      Q('Could you please ____ me a favor and carry this parcel?', ['make', 'do', 'give', 'take'], 1, 'The idiomatic English phrase is "do someone a favor".', 'voc-b-4', 'Frasa idiomatis yang benar untuk meminta bantuan adalah "do me a favor".'),
      Q('We usually ____ a taxi when it rains heavily.', ['catch', 'hold', 'drive', 'pick'], 0, 'Natural collocations include "catch a taxi" or "take a taxi".', 'voc-b-5', 'Kolokasi yang tepat untuk naik taksi atau transportasi umum adalah "catch a taxi" atau "take a taxi".'),
      Q('He was so ____ about the test that he could hardly sleep.', ['anxious', 'delighted', 'confident', 'fluent'], 0, '"Anxious" means feeling worried, nervous, or uneasy.', 'voc-b-6', '"Anxious" berarti merasa cemas, gelisah, atau khawatir terhadap sesuatu.'),
      Q('He decided to ____ a new non-profit foundation to support youth education.', ['set up', 'take after', 'break down', 'give in'], 0, 'To "set up" means to establish or create an organization.', 'voc-b-7', '"Set up" berarti mendirikan, membangun, atau membentuk suatu organisasi/usaha.'),
      Q('Please make sure you have all pieces of your ____ before leaving the terminal.', ['luggage', 'customs', 'itinerary', 'fare'], 0, '"Luggage" refers to suitcases and bags for travel.', 'voc-b-8', '"Luggage" adalah barang bawaan koper atau tas penumpang selama perjalanan.'),
      Q('Rice is the essential dietary ____ for millions of people across Asia.', ['staple', 'appetizer', 'recipe', 'flavor'], 0, 'A "staple" is a basic, principal food consumed regularly.', 'voc-b-9', '"Staple" adalah makanan pokok yang dikonsumsi secara rutin oleh masyarakat.'),
      Q('She felt noticeably ____ before delivering her speech in front of hundreds.', ['anxious', 'punctual', 'frugal', 'tidy'], 0, '"Anxious" describes feeling nervous or uneasy about an upcoming challenge.', 'voc-b-10', '"Anxious" menyatakan rasa cemas atau gugup menghadapi tantangan di depan umum.'),
      Q('The train was running late, so we had to ____ for twenty minutes on the platform.', ['hold on', 'run out', 'figure out', 'get along'], 0, '"Hold on" or wait briefly.', 'voc-b-11', '"Hold on" berarti menunggu sejenak.'),
      Q('His new sports shoes are very ____ for long-distance morning runs.', ['comfortable', 'unforeseen', 'hostile', 'obsolete'], 0, '"Comfortable" provides physical ease and relaxation.', 'voc-b-12', '"Comfortable" berarti nyaman dan memberikan keleluasaan gerak.')
    ],
    intermediate: [
      Q('The manager ____ the new marketing project to Sarah.', ['assigned', 'analysed', 'concluded', 'delayed'], 0, '"To assign" means to give someone a particular task, duty, or project.', 'voc-i-1', '"Assign" berarti menugaskan atau mempercayakan suatu proyek/tugas kepada seseorang.'),
      Q('Our flight was held up by a two-hour ____ due to heavy fog.', ['itinerary', 'delay', 'departure', 'workload'], 1, 'A "delay" is a period of waiting or when something is postponed.', 'voc-i-2', '"Delay" adalah penundaan atau keterlambatan keberangkatan akibat cuaca atau kabut tebal.'),
      Q('Due to unforeseen circumstances, we had to ____ our scheduled workshop.', ['postpone', 'allocate', 'scrutinize', 'mitigate'], 0, '"Postpone" means to arrange for an event to take place at a later date.', 'voc-i-3', '"Postpone" berarti menunda suatu acara atau kegiatan ke waktu yang lebih lambat.'),
      Q('She managed to ____ all the obstacles and graduate with highest honors.', ['overcome', 'overlook', 'overtake', 'overhear'], 0, '"Overcome" means to successfully deal with or defeat a problem or difficulty.', 'voc-i-4', '"Overcome" berarti berhasil mengatasi rintangan atau kesulitan yang menghadang.'),
      Q('Finding a sustainable work-life ____ is vital for long-term health.', ['balance', 'itinerary', 'luggage', 'schedule'], 0, '"Work-life balance" is the standard collocation for dividing time between job and personal life.', 'voc-i-5', '"Work-life balance" adalah istilah baku untuk keseimbangan antara karier dan kehidupan pribadi.'),
      Q('The company launched an initiative to ____ plastic waste across all branches.', ['diminish', 'curtail', 'eliminate', 'deteriorate'], 2, '"Eliminate" means to completely remove or get rid of something undesirable.', 'voc-i-6', '"Eliminate" berarti meniadakan atau menyingkirkan sesuatu hingga tuntas.'),
      Q('The company agreed to ____ thirty percent of its annual profits to green research.', ['allocate', 'scrutinize', 'postpone', 'corroborate'], 0, 'To "allocate" means to designate or set aside funds for a specific purpose.', 'voc-i-7', '"Allocate" berarti mengalokasikan atau mencadangkan dana untuk tujuan khusus.'),
      Q('They had to ____ the outdoor football tournament due to severe torrential rain.', ['call off', 'look into', 'put up with', 'bring about'], 0, '"Call off" means to cancel an event.', 'voc-i-8', '"Call off" berarti membatalkan suatu agenda atau acara yang telah dijadwalkan.'),
      Q('Solar and wind power are leading sources of ____ energy.', ['renewable', 'vulnerable', 'tedious', 'obsolete'], 0, '"Renewable" refers to natural energy sources that replenish over time.', 'voc-i-9', '"Renewable" berarti energi terbarukan yang tidak akan habis seperti matahari dan angin.'),
      Q('The doctor wrote a medical ____ for antibiotics to clear the infection.', ['prescription', 'diagnosis', 'symptom', 'remedy'], 0, 'A "prescription" is an authorized written order for medicine.', 'voc-i-10', '"Prescription" adalah resep obat resmi yang ditulis oleh dokter berlisensi.'),
      Q('Her detailed master’s thesis provides ____ evidence supporting bilingual education.', ['empirical', 'cynical', 'frugal', 'fragile'], 0, '"Empirical" means based on observed facts and scientific evidence.', 'voc-i-11', '"Empirical" berarti didasarkan pada data pengamatan dan bukti nyata di lapangan.'),
      Q('It took weeks for the arbitration team to ____ the complicated boundary dispute.', ['sort out', 'turn down', 'take after', 'give up'], 0, '"Sort out" means to resolve or find a solution to a problem.', 'voc-i-12', '"Sort out" berarti mengurai, menyelesaikan, atau mencari jalan keluar sengketa.')
    ],
    advanced: [
      Q('The research team must ____ the survey data before publishing conclusions.', ['analyse', 'summarise', 'commute', 'contrast'], 0, '"Analyse" means examining data or information in careful detail.', 'voc-a-1', '"Analyse" berarti menganalisis data atau informasi survei secara mendalam sebelum menarik kesimpulan.'),
      Q('The government implemented urgent measures to ____ the economic crisis.', ['mitigate', 'exacerbate', 'proliferate', 'allocate'], 0, '"Mitigate" means to make something bad less severe, serious, or painful.', 'voc-a-2', '"Mitigate" berarti mengurangi tingkat keparahan, meredakan, atau memperkecil dampak negatif.'),
      Q('Her inflammatory remarks served only to ____ the existing dispute.', ['exacerbate', 'ameliorate', 'placate', 'attenuate'], 0, '"Exacerbate" means to make a problem, bad situation, or negative feeling worse.', 'voc-a-3', '"Exacerbate" berarti memperburuk atau memperkeruh situasi/masalah yang sudah ada.'),
      Q('The architect was praised for her ____ and practical approach to urban design.', ['pragmatic', 'dogmatic', 'ephemeral', 'capricious'], 0, '"Pragmatic" means dealing with things sensibly and realistically based on practical conditions.', 'voc-a-4', '"Pragmatic" berarti praktis, realistis, dan berorientasi pada hasil nyata.'),
      Q('Investigators were asked to ____ every financial transaction made by the firm.', ['scrutinize', 'obfuscate', 'improvise', 'condone'], 0, '"Scrutinize" means to examine or inspect closely and thoroughly.', 'voc-a-5', '"Scrutinize" berarti memeriksa atau menyelidiki dengan sangat teliti dan mendalam.'),
      Q('The defense attorney presented newly discovered documents to ____ the witness statement.', ['corroborate', 'exacerbate', 'obfuscate', 'plagiarize'], 0, 'To "corroborate" means to confirm or give support with evidence.', 'voc-a-6', '"Corroborate" berarti memperkuat atau memvalidasi kesaksian dengan bukti otentik.'),
      Q('Rising inflation threatens to ____ the living conditions of lower-income families.', ['exacerbate', 'mitigate', 'ameliorate', 'synthesize'], 0, 'To "exacerbate" means to make a bad situation even worse.', 'voc-a-7', '"Exacerbate" berarti memperburuk atau memperparah keadaan yang sudah sulit.'),
      Q('The auditor conducted a ____ review of all international transactions.', ['meticulous', 'gullible', 'superficial', 'capricious'], 0, '"Meticulous" means showing great attention to detail and precision.', 'voc-a-8', '"Meticulous" berarti sangat teliti, cermat, dan saksama dalam memeriksa tiap detail.'),
      Q('The landmark Supreme Court ruling established an enduring legal ____ for future trials.', ['precedent', 'verdict', 'acquittal', 'felony'], 0, 'A "precedent" is an earlier judicial decision that serves as a guide.', 'voc-a-9', '"Precedent" adalah yurisprudensi putusan terdahulu yang dijadikan acuan hukum baku.'),
      Q('Overfishing in unregulated waters continues to ____ deep-sea marine stocks.', ['deplete', 'allocate', 'rehabilitate', 'commence'], 0, 'To "deplete" means to severely reduce or exhaust resources.', 'voc-a-10', '"Deplete" berarti menguras atau menghabiskan cadangan sumber daya hingga kritis.')
    ]
  },
  grammar: {
    beginner: [
      Q('She bought ____ apple and two oranges at the supermarket.', ['a', 'an', 'the', 'some'], 1, 'Use "an" before words starting with a vowel sound: "an apple".', 'grm-b-1', 'Gunakan artikel "an" di depan kata yang berawalan bunyi huruf vokal: "an apple".'),
      Q('They arrived in London ____ Friday afternoon.', ['at', 'on', 'in', 'by'], 1, 'Use the preposition "on" for days of the week: "on Friday".', 'grm-b-2', 'Gunakan kata depan (preposisi) "on" untuk nama-nama hari dan bagian hari tertentu: "on Friday".'),
      Q('My uncle is a surgeon. ____ works at the national hospital.', ['He', 'Him', 'His', 'Himself'], 0, 'Subject pronouns replace the subject: "He works".', 'grm-b-3', 'Kata ganti subjek (subject pronoun) yang tepat untuk orang ketiga tunggal pria adalah "He".'),
      Q('There are five ____ playing in the community playground.', ['childs', 'children', 'childrens', 'child'], 1, 'The irregular plural of "child" is "children".', 'grm-b-4', 'Bentuk jamak tidak beraturan (irregular plural) dari "child" adalah "children".'),
      Q('The lecture starts promptly ____ 9:00 AM.', ['at', 'on', 'in', 'for'], 0, 'Specific clock times take the preposition "at": "at 9:00 AM".', 'grm-b-5', 'Keterangan waktu jam yang spesifik menggunakan preposisi "at": "at 9:00 AM".'),
      Q('The keys are resting ____ the wooden coffee table.', ['on', 'in', 'at', 'into'], 0, 'Physical contact on a surface uses "on": "on the table".', 'grm-b-6', 'Posisi benda yang berada di atas permukaan menggunakan preposisi "on".')
    ],
    intermediate: [
      Q('If I ____ you, I would consult a professional before deciding.', ['am', 'was', 'were', 'had been'], 2, 'In second (unreal) conditionals, "were" is conventionally used for all subjects.', 'grm-i-1', 'Dalam Second Conditional (pengandaian situasi tak nyata), kata kerja bantu "were" digunakan secara baku untuk semua subjek: "If I were you".'),
      Q('The package was delivered to someone ____ didn\'t live in this building.', ['which', 'who', 'whose', 'whom'], 1, 'Use the relative pronoun "who" when referring to people as subjects.', 'grm-i-2', 'Gunakan kata ganti penghubung (relative pronoun) "who" untuk merujuk pada orang sebagai subjek kalimat.'),
      Q('We don\'t have ____ time left before the gates close.', ['much', 'many', 'few', 'a few'], 0, '"Time" as duration is uncountable, so use "much" in negative sentences: "not much time".', 'grm-i-3', '"Time" sebagai waktu tak terhitung (uncountable noun) menggunakan "much" dalam kalimat negatif: "not much time".'),
      Q('She is clearly the ____ qualified candidate for the leadership role.', ['most', 'more', 'much', 'as'], 0, 'Superlative degree with "the" takes "the most qualified".', 'grm-i-4', 'Bentuk superlatif dengan kata sifat panjang diawali dengan "the most": "the most qualified".'),
      Q('They avoided ____ through the city center during rush hour.', ['driving', 'to drive', 'drive', 'driven'], 0, 'The verb "avoid" is followed by a gerund (-ing form): "avoided driving".', 'grm-i-5', 'Kata kerja "avoid" selalu diikuti oleh gerund (V-ing): "avoided driving".'),
      Q('Visitors ____ not smoke anywhere inside the terminal premises.', ['must', 'might', 'should', 'would'], 0, '"Must not" expresses strict prohibition or rule.', 'grm-i-6', '"Must not" menyatakan larangan mutlak atau aturan yang tidak boleh dilanggar.')
    ],
    advanced: [
      Q('Scarcely ____ the station when the train pulled away from the platform.', ['had we reached', 'we had reached', 'we reached', 'did we reach'], 0, 'Negative inversions with "scarcely... when" require inversion.', 'grm-a-1', 'Pola inversi negatif dengan frasa "scarcely... when" mengharuskan susunan kata kerja bantu sebelum subjek: "had we reached".'),
      Q('It was not until midnight ____ the final election results were confirmed.', ['that', 'when', 'which', 'than'], 0, 'Cleft sentence structure: "It was not until [time] that [clause]".', 'grm-a-2', 'Struktur kalimat cleft: "It was not until [waktu] that [klausa]".'),
      Q('The magistrate demanded that the defendant ____ in court tomorrow.', ['appear', 'appears', 'appeared', 'is appearing'], 0, 'The subjunctive mood in that-clauses after verbs of demand/order takes the base form: "appear".', 'grm-a-3', 'Subjunctive mood setelah kata kerja perintah/tuntutan ("demand that...") menggunakan kata kerja bentuk dasar (base form): "appear".'),
      Q('Not only ____ the international prize, but she was also offered a professorship.', ['did she win', 'she won', 'had she won', 'she did win'], 0, 'Inversion after correlative "Not only" at the beginning of a clause: "did she win".', 'grm-a-4', 'Inversi setelah "Not only" di awal kalimat memerlukan kata bantu sebelum subjek: "did she win".'),
      Q('The contract was awarded to the consortium, ____ expertise was undisputed.', ['whose', 'which', 'whom', 'where'], 0, 'Possessive relative pronoun "whose" can refer to organizations and things as well as people.', 'grm-a-5', 'Kata ganti kepemilikan "whose" digunakan untuk menghubungkan subjek dengan kepemilikan/atribut ("whose expertise").')
    ]
  }
};

export const STORAGE_KEY = 'engsphere-state';

// ===================================================================
// GRAMMAR DATA FOR INDONESIAN NATIONAL EDUCATION STANDARDS
// Aligned with Kurikulum Merdeka (Fase D SMP & Fase E/F SMA) & UTBK/SNBT
// ===================================================================

export const GRAMMAR_PARTS_OF_SPEECH = [
  {
    id: 'noun',
    name: 'Noun (Kata Benda)',
    fase: 'Fase D (SMP)',
    desc: 'Nama orang, tempat, benda konkret, atau gagasan abstrak.',
    formula: 'Article / Determiner + Noun',
    ex: 'teacher, Jakarta, laptop, freedom, education',
    sentence: 'The dedicated teacher inspired students across Jakarta.',
    sentence_id: 'Guru yang berdedikasi itu menginspirasi para siswa di seluruh Jakarta.'
  },
  {
    id: 'verb',
    name: 'Verb (Kata Kerja)',
    fase: 'Fase D (SMP)',
    desc: 'Menyatakan tindakan, proses, peristiwa, atau keadaan mental.',
    formula: 'Subject + Verb (+ Object)',
    ex: 'develop, study, believe, communicate, transform',
    sentence: 'Regular practice transforms learning into lasting skill.',
    sentence_id: 'Latihan rutin mengubah proses belajar menjadi keterampilan yang bertahan lama.'
  },
  {
    id: 'adjective',
    name: 'Adjective (Kata Sifat)',
    fase: 'Fase D (SMP)',
    desc: 'Menerangkan sifat, kondisi, ukuran, atau karakter kata benda.',
    formula: 'Adjective + Noun ATAU Be + Adjective',
    ex: 'diligent, effective, sustainable, crucial, innovative',
    sentence: 'Diligent students achieve remarkable results in national exams.',
    sentence_id: 'Siswa yang tekun meraih hasil luar biasa dalam ujian nasional.'
  },
  {
    id: 'adverb',
    name: 'Adverb (Kata Keterangan)',
    fase: 'Fase D (SMP)',
    desc: 'Menerangkan cara, waktu, frekuensi, tempat, atau intensitas kata kerja/sifat.',
    formula: 'Verb + Adverb ATAU Adverb + Adjective',
    ex: 'fluently, rigorously, extremely, yesterday, rarely',
    sentence: 'She explained the complex grammar formula extremely clearly.',
    sentence_id: 'Dia menjelaskan rumus tata bahasa yang rumit itu dengan sangat jelas.'
  },
  {
    id: 'pronoun',
    name: 'Pronoun (Kata Ganti)',
    fase: 'Fase D (SMP)',
    desc: 'Menggantikan kata benda agar kalimat tidak repetitif (Subject, Object, Possessive, Reflexive).',
    formula: 'Subject: I, you, we, they, he, she, it · Object: me, him, them',
    ex: 'they, ourselves, someone, anyone, which',
    sentence: 'Although the questions were challenging, they solved them independently.',
    sentence_id: 'Meskipun soal-soal tersebut menantang, mereka menyelesaikannya secara mandiri.'
  },
  {
    id: 'preposition',
    name: 'Preposition (Kata Depan)',
    fase: 'Fase D (SMP)',
    desc: 'Menunjukkan hubungan posisi, tempat, waktu, arah, atau metode antar kata.',
    formula: 'Preposition + Noun Phrase / Gerund (V-ing)',
    ex: 'in, on, at, between, despite, throughout',
    sentence: 'We will gather at the auditorium in the morning for orientation.',
    sentence_id: 'Kita akan berkumpul di auditorium pada pagi hari untuk masa orientasi.'
  },
  {
    id: 'conjunction',
    name: 'Conjunction (Kata Sambung)',
    fase: 'Fase E (SMA)',
    desc: 'Menghubungkan kata, frasa, atau klausa (koordinatif, subordinatif, korelatif).',
    formula: 'FANBOYS (for, and, nor, but, or, yet, so) · Subordinatif (because, although, if)',
    ex: 'and, although, because, however, nevertheless',
    sentence: 'Although Indonesian grammar has no tenses, students can master English patterns rapidly.',
    sentence_id: 'Meskipun tata bahasa Indonesia tidak memiliki tenses, siswa dapat menguasai pola bahasa Inggris dengan cepat.'
  },
  {
    id: 'article',
    name: 'Article & Determiner',
    fase: 'Fase D (SMP)',
    desc: 'Menentukan apakah kata benda bersifat spesifik (the) atau umum/pertama kali disebut (a/an).',
    formula: 'a + konsonan bunyi · an + vokal bunyi · the + spesifik',
    ex: 'a university (bunyi /juː/), an honest man (bunyi /ɒ/), the sun',
    sentence: 'An honest student received a university scholarship yesterday.',
    sentence_id: 'Seorang siswa yang jujur menerima beasiswa universitas kemarin.'
  }
];

export const GRAMMAR_CURRICULUM_MODULES = [
  {
    id: 'passive-voice',
    title: '1. Passive Voice (Kalimat Pasif)',
    fase: 'Fase E (SMA Kelas X) & Langganan Soal UTBK/SNBT',
    tag: 'Sangat Sering Diuji',
    summary: 'Digunakan saat fokus utama kalimat tertuju pada objek/hasil tindakan, atau ketika pelaku tindakan tidak diketahui/tidak penting.',
    formula: 'Subject (Objek asal) + To Be (disesuaikan tenses) + Past Participle (V3) (+ by Agent)',
    table: [
      { tense: 'Present Simple', active: 'Active: The teacher explains the rule.', passive: 'Passive: The rule is explained by the teacher.' },
      { tense: 'Past Simple', active: 'Active: The government built the bridge.', passive: 'Passive: The bridge was built by the government.' },
      { tense: 'Present Continuous', active: 'Active: Technicians are fixing the server.', passive: 'Passive: The server is being fixed by technicians.' },
      { tense: 'Present Perfect', active: 'Active: Scientists have discovered a cure.', passive: 'Passive: A cure has been discovered by scientists.' },
      { tense: 'Modals (Can/Must/Should)', active: 'Active: You must submit the form today.', passive: 'Passive: The form must be submitted today.' }
    ],
    tips: 'Kunci Ujian: Perhatikan subjek kalimat pasif (tunggal vs jamak) untuk menentukan to be (is vs are / was vs were). Pastikan kata kerja utama selalu berbentuk Verb 3!',
    example: 'Active: "Alexander Fleming discovered penicillin in 1928." → Passive: "Penicillin was discovered by Alexander Fleming in 1928."',
    example_id: 'Penisilin ditemukan oleh Alexander Fleming pada tahun 1928.'
  },
  {
    id: 'conditional-sentences',
    title: '2. Conditional Sentences (Kalimat Pengandaian)',
    fase: 'Fase F (SMA Kelas XI-XII) & Seleksi PTN/Kedinasan',
    tag: 'Wajib Ujian Nasional & UTBK',
    summary: 'Struktur pengandaian yang menyatakan situasi nyata, kebiasaan ilmiah, kondisi masa depan, situasi imajinatif saat ini, atau penyesalan masa lalu.',
    formula: 'If + Condition Clause, Main / Result Clause',
    table: [
      {
        tense: 'Type 0 (Fakta / Kebenaran Ilmiah)',
        active: 'Rumus: If + Simple Present (V1), Simple Present (V1)',
        passive: 'Contoh: If you heat water to 100°C, it boils. (Pasti terjadi secara ilmiah).'
      },
      {
        tense: 'Type 1 (Peluang Nyata Masa Depan)',
        active: 'Rumus: If + Simple Present (V1), Subject + will + V1',
        passive: 'Contoh: If she studies diligently, she will pass the national entrance exam.'
      },
      {
        tense: 'Type 2 (Pengandaian Tak Nyata Saat Ini)',
        active: 'Rumus: If + Past Simple (V2/were), Subject + would + V1',
        passive: 'Contoh: If I were the minister of education, I would improve teacher welfare. (Fakta: I am not).'
      },
      {
        tense: 'Type 3 (Penyesalan / Kontrafaktual Masa Lampau)',
        active: 'Rumus: If + Past Perfect (had + V3), Subject + would have + V3',
        passive: 'Contoh: If we had left earlier, we would not have missed the morning flight.'
      }
    ],
    tips: 'Jebakan Soal: Pada Type 2, to be lampau yang digunakan selalu "WERE" untuk semua subjek (If I were, If he were, If she were), bukan "was" dalam ragam formal standar!',
    example: 'If they had followed the safety guidelines, the incident would not have occurred.',
    example_id: 'Seandainya mereka mematuhi pedoman keselamatan, insiden itu tidak akan terjadi.'
  },
  {
    id: 'relative-clauses',
    title: '3. Relative Clauses / Adjective Clauses',
    fase: 'Fase E (SMA Kelas X-XI) & Reading Comprehension',
    tag: 'Struktur Kalimat Majemuk',
    summary: 'Klausa penjelas yang berfungsi seperti kata sifat untuk mendeskripsikan kata benda tanpa harus membuat dua kalimat terpisah.',
    formula: 'Noun Head + [Who / Whom / Whose / Which / That] + Clause',
    table: [
      { tense: 'Who (Subjek Orang)', active: 'The student won the competition. The student studies here.', passive: 'Gabungan: The student WHO won the competition studies here.' },
      { tense: 'Whom (Objek Orang)', active: 'The lecturer is respected. We interviewed him yesterday.', passive: 'Gabungan: The lecturer WHOM we interviewed yesterday is respected.' },
      { tense: 'Whose (Kepemilikan)', active: 'The author gave a lecture. Her book became a bestseller.', passive: 'Gabungan: The author WHOSE book became a bestseller gave a lecture.' },
      { tense: 'Which / That (Benda/Hewan)', active: 'The vaccine was approved. It was developed locally.', passive: 'Gabungan: The vaccine WHICH / THAT was developed locally was approved.' }
    ],
    tips: 'Defining vs Non-Defining: Jika klausa memberi informasi tambahan yang bukan penentu identitas utama (pakai koma), gunakan "which", JANGAN gunakan "that"!',
    example: 'The laboratory which was inaugurated last month is equipped with modern spectrometers.',
    example_id: 'Laboratorium yang diresmikan bulan lalu itu dilengkapi dengan spektrometer modern.'
  },
  {
    id: 'reported-speech',
    title: '4. Reported Speech (Direct to Indirect Speech)',
    fase: 'Fase F (SMA Kelas XI-XII) & Narrative / News Texts',
    tag: 'Komunikasi Formal',
    summary: 'Cara melaporkan perkataan orang lain dengan menyesuaikan perubahan waktu (tenses), kata ganti orang (pronouns), dan keterangan waktu/tempat.',
    formula: 'Reporting Verb (said / told) + (that) + Backshifted Tense',
    table: [
      { tense: 'Present Simple → Past Simple', active: 'Direct: "I work at a hospital," Maria said.', passive: 'Reported: Maria said that she worked at a hospital.' },
      { tense: 'Present Continuous → Past Continuous', active: 'Direct: "We are developing an app," they said.', passive: 'Reported: They said that they were developing an app.' },
      { tense: 'Past Simple → Past Perfect', active: 'Direct: "I finished the report," David said.', passive: 'Reported: David said that he had finished the report.' },
      { tense: 'Modals Shift (Will → Would, Can → Could)', active: 'Direct: "I will call you tomorrow," Kenji promised.', passive: 'Reported: Kenji promised that he would call me the next day.' }
    ],
    tips: 'Keterangan Waktu: Ingat perubahan keterangan: now → then, today → that day, yesterday → the day before, tomorrow → the following/next day, here → there.',
    example: 'The principal announced that all classes would resume in the main campus next week.',
    example_id: 'Kepala sekolah mengumumkan bahwa seluruh kelas akan kembali diadakan di kampus utama minggu depan.'
  },
  {
    id: 'gerund-infinitive',
    title: '5. Gerunds vs. To-Infinitives',
    fase: 'Fase E-F SMA & Soal Error Recognition',
    tag: 'Pilihan Kata Kerja Spesifik',
    summary: 'Kapan kata kerja kedua berbentuk V-ing (Gerund) dan kapan wajib berbentuk To + V1 (Infinitive) setelah kata kerja tertentu atau preposisi.',
    formula: 'Verb + Gerund (V-ing) ATAU Verb + To-Infinitive (to + V1) ATAU Preposition + Gerund',
    table: [
      {
        tense: 'Wajib Diikuti Gerund (V-ing)',
        active: 'Verbs: enjoy, avoid, consider, practice, suggest, mind, postpone, finish, admit, deny',
        passive: 'Contoh: We should avoid making hasty conclusions without empirical data.'
      },
      {
        tense: 'Wajib Diikuti To-Infinitive (to + V1)',
        active: 'Verbs: decide, hope, plan, refuse, promise, offer, agree, afford, manage, prepare',
        passive: 'Contoh: The committee decided to postpone the conference until next semester.'
      },
      {
        tense: 'Semua Preposisi Wajib Gerund!',
        active: 'Rumus: Preposisi (of, in, at, on, by, for, about, without) + V-ing',
        passive: 'Contoh: Thank you for listening. · She succeeded by studying consistently.'
      },
      {
        tense: 'Perubahan Makna (Stop / Remember)',
        active: 'Stop to V1: berhenti sejenak untuk melakukan hal lain · Stop V-ing: berhenti total dari kebiasaan',
        passive: 'Contoh: He stopped smoking (berhenti merokok selamanya). He stopped to smoke (berhenti jalan untuk merokok).'
      }
    ],
    tips: 'Hafalan Cepat: Rumus emas ujian: "Preposisi SELALU diikuti Gerund (V-ing)". Tidak pernah ada preposisi diikuti V1 polos!',
    example: 'She is interested in pursuing a doctoral degree in renewable energy engineering.',
    example_id: 'Dia tertarik untuk menempuh gelar doktoral di bidang teknik energi terbarukan.'
  },
  {
    id: 'degrees-comparison',
    title: '6. Degrees of Comparison (Tingkat Perbandingan)',
    fase: 'Fase D (SMP) & Descriptive / Analytical Texts',
    tag: 'Struktur Deskriptif',
    summary: 'Membandingkan sifat atau kualitas antara dua hal (Comparative) atau satu hal di antara seluruh kelompok (Superlative).',
    formula: 'Positive (as ... as) · Comparative (-er than / more ... than) · Superlative (the -est / the most ...)',
    table: [
      { tense: '1 Suku Kata (Syllable)', active: 'tall → taller than → the tallest', passive: 'fast → faster than → the fastest' },
      { tense: '2 Suku Kata berakhiran -y', active: 'easy → easier than → the easiest', passive: 'happy → happier than → the happiest' },
      { tense: '2+ Suku Kata', active: 'crucial → more crucial than → the most crucial', passive: 'intelligent → more intelligent than → the most intelligent' },
      { tense: 'Bentuk Tidak Beraturan (Irregular)', active: 'good → better than → the best', passive: 'bad → worse than → the worst · far → farther/further than → farthest/furthest' }
    ],
    tips: 'Jebakan Double Comparative: Jangan gunakan kata ganda seperti "more better" ❌ (cukup "better" ✅) atau "most highest" ❌ (cukup "highest" ✅).',
    example: 'Public transportation is far more environmentally friendly than private vehicles.',
    example_id: 'Transportasi umum jauh lebih ramah lingkungan daripada kendaraan pribadi.'
  },
  {
    id: 'conjunctions-connectors',
    title: '7. Conjunctions & Connectors of Logic',
    fase: 'Fase E (SMA Kelas X) & Argumentative Writing',
    tag: 'Kohesi Paragraf Ujian',
    summary: 'Kata hubung yang memperlihatkan hubungan logika antar klausa: sebab-akibat, kontras/pertentangan, penambahan, dan kesimpulan.',
    formula: 'Clause Connectors (Although, Because) vs Prepositional Connectors (Despite, Because of)',
    table: [
      {
        tense: 'Sebab-Akibat (Clause vs Noun Phrase)',
        active: 'Because / Since / As + Subject + Verb (Klausa Lengkap)',
        passive: 'Because of / Due to / Owing to + Noun Phrase (Frasa Benda tanpa kata kerja)'
      },
      {
        tense: 'Kontras / Pertentangan',
        active: 'Although / Even though / Though + Subject + Verb',
        passive: 'In spite of / Despite + Noun Phrase / Gerund (Jangan tambahkan "of" setelah despite!)'
      },
      {
        tense: 'Transisi Antarkalimat',
        active: 'However (namun), Therefore (oleh karena itu), Furthermore (selain itu), In contrast',
        passive: 'Contoh: The experiment was risky. However, the team proceeded cautiously.'
      }
    ],
    tips: 'Jebakan Soal: "Despite" TIDAK PERNAH diikuti "of" ("Despite the rain" ✅, BUKAN "Despite of the rain" ❌). Sedangkan "In spite" WAJIB pakai "of" ("In spite of the rain" ✅).',
    example: 'Despite the heavy rain, all candidates arrived punctually for the national scholarship interview.',
    example_id: 'Meskipun hujan deras, seluruh kandidat tiba tepat waktu untuk wawancara beasiswa nasional.'
  },
  {
    id: 'modals-past',
    title: '8. Modals of Deduction & Past Regret',
    fase: 'Fase F (SMA Kelas XII) & Soal Penalaran SNBT',
    tag: 'Tingkat Lanjut (Advanced)',
    summary: 'Menyatakan tingkat keyakinan (deduksi logis) atau penyesalan atas peristiwa yang sudah terjadi di masa lampau.',
    formula: 'Modal Verb + have + Past Participle (V3)',
    table: [
      { tense: 'Must have + V3', active: 'Artinya: "Pasti dulu telah..." (Keyakinan 95%+ masa lalu)', passive: 'The ground is soaked; it must have rained heavily last night.' },
      { tense: 'Cannot have / Couldn’t have + V3', active: 'Artinya: "Mustahil dulu telah..." (Ketidakyakinan mutlak)', passive: 'He couldn’t have stolen the file because he was in Surabaya.' },
      { tense: 'Should have + V3', active: 'Artinya: "Seharusnya dulu dilakukan (tapi tidak dilakukan)"', passive: 'We should have double-checked the flight departure time.' },
      { tense: 'Might / May have + V3', active: 'Artinya: "Mungkin saja dulu..." (Kemungkinan 50%)', passive: 'She didn’t answer; she might have left her phone at the office.' }
    ],
    tips: 'Kunci SNBT: "Should have + V3" selalu menyiratkan fakta sebaliknya: "I should have studied" berarti faktanya "I did not study" (penyesalan).',
    example: 'The team should have substantiated their claims with peer-reviewed statistical evidence.',
    example_id: 'Tim tersebut seharusnya memperkuat klaim mereka dengan bukti statistik yang telah ditelaah sejawat.'
  }
];

export const INDONESIAN_LEARNER_PITFALLS = [
  {
    id: 'pitfall-agree',
    title: '1. "She is agree" vs "She agrees"',
    category: 'Word Class Confusion (Verb vs Adjective)',
    wrong: 'She is agree with our proposal.',
    correct: 'She agrees with our proposal.',
    explanation: 'Dalam bahasa Indonesia, kata "setuju" sering diperlakukan setara kata sifat sehingga siswa terbiasa menambahkan "to be (is/are)". Namun dalam bahasa Inggris, "agree" adalah Kata Kerja murni (Verb), sehingga langsung dikonjugasikan dengan subjek tanpa to be!',
    rule: 'Subject + Verb (agree / agrees / agreed)',
    note: 'Kecuali Anda menggunakan bentuk frasa sifat: "She is in agreement with our proposal."'
  },
  {
    id: 'pitfall-very-like',
    title: '2. "I very like it" vs "I really like it"',
    category: 'L1 Direct Translation (Adverb Placement)',
    wrong: 'I very like this English learning app.',
    correct: 'I really like this app. / I like this app very much.',
    explanation: 'Kata "sangat" dalam bahasa Indonesia diletakkan di depan kata kerja ("sangat suka"). Namun dalam bahasa Inggris, kata keterangan "very" HANYA bisa memodifikasi kata sifat atau kata keterangan lain (contoh: very good, very fast), BUKAN kata kerja. Untuk kata kerja, gunakan "really" atau letakkan "very much" di akhir kalimat!',
    rule: 'really + Verb ATAU Verb + Object + very much',
    note: 'Contoh benar: "I really appreciate your guidance." ATAU "I appreciate your guidance very much."'
  },
  {
    id: 'pitfall-modal-to',
    title: '3. "Must to study" vs "Must study"',
    category: 'Modal Auxiliary Error',
    wrong: 'Every student must to obey the school regulations.',
    correct: 'Every student must obey the school regulations.',
    explanation: 'Modal verbs murni dalam bahasa Inggris (can, could, may, might, must, should, will, would, shall) WAJIB diikuti oleh kata kerja bentuk dasar tanpa "to" (Bare Infinitive).',
    rule: 'Modal (can/must/should/will) + Base Verb (V1 murni tanpa to dan tanpa -s/-ed/-ing)',
    note: 'Bandingkan dengan semi-modal yang memang memiliki "to" dari rumusnya: have to, ought to, be able to.'
  },
  {
    id: 'pitfall-double-conjunction',
    title: '4. "Although..., but..." (Konektor Ganda Redundan)',
    category: 'Redundant Conjunctions',
    wrong: 'Although it rained heavily, but we arrived on time.',
    correct: 'Although it rained heavily, we arrived on time.',
    explanation: 'Dalam percakapan bahasa Indonesia sering terdengar: "Meskipun hujan, tetapi kami tetap datang". Namun dalam bahasa Inggris, jika anak kalimat sudah diawali konjungsi subordinatif "Although" atau "Even though", induk kalimat TIDAK BOLEH lagi memakai kata "but"!',
    rule: 'Pilih salah satu: "Although [Klausa 1], [Klausa 2]" ATAU "[Klausa 1], but [Klausa 2]"',
    note: 'Aturan serupa berlaku untuk "Because..., so..." ❌ → Cukup gunakan "Because [Klausa 1], [Klausa 2]" ✅.'
  },
  {
    id: 'pitfall-transitive-wait',
    title: '5. "Wait you" vs "Wait for you"',
    category: 'Preposition Omission (Intransitive Verbs)',
    wrong: 'Please wait me in front of the library.',
    correct: 'Please wait for me in front of the library.',
    explanation: 'Dalam bahasa Indonesia, kata "menunggu" adalah kata kerja transitif langsung ("menunggumu"). Tetapi dalam bahasa Inggris, kata kerja "wait" adalah intransitif dan WAJIB dipasangkan dengan preposisi "for" sebelum menyebutkan orang atau benda yang ditunggu.',
    rule: 'wait for + someone / something (Bandingkan dengan kata "await" yang bersifat transitif: "await your reply")',
    note: 'Pasangan kata lain yang sering tertinggal preposisinya: "listen to" (bukan listen me ❌), "pay for" (bukan pay the ticket ❌).'
  },
  {
    id: 'pitfall-advices',
    title: '6. "An advice / many advices" vs "Some advice"',
    category: 'Uncountable Noun Pluralization',
    wrong: 'The counselor gave me many useful advices.',
    correct: 'The counselor gave me a lot of useful advice / many pieces of advice.',
    explanation: 'Kata "advice" (nasihat), "information" (informasi), "homework" (PR), "furniture" (perabot), dan "baggage" (bagasi) dalam bahasa Inggris adalah Uncountable Noun (benda tak terhitung). Kata-kata ini TIDAK PERNAH memiliki bentuk jamak dengan akhiran -s, dan tidak boleh diawali artikel "an"!',
    rule: 'Uncountable: some advice, a piece of advice, valuable advice (TIDAK ADA "advices")',
    note: 'Untuk menghitung, gunakan partitif: "a piece of advice" (satu nasihat) atau "two pieces of advice" (dua nasihat).'
  },
  {
    id: 'pitfall-borrow-lend',
    title: '7. "Borrow me money" vs "Lend me money"',
    category: 'Directional Verb Confusion',
    wrong: 'Could you please borrow me twenty thousand rupiahs?',
    correct: 'Could you please lend me twenty thousand rupiahs?',
    explanation: 'Bahasa Indonesia sering memakai kata dasar "pinjam" untuk kedua arah ("pinjam" dan "meminjamkan"). Dalam bahasa Inggris: BORROW berarti mengambil pinjaman dari orang lain (take from), sedangkan LEND berarti meminjamkan barang kepada orang lain (give to).',
    rule: 'Can I BORROW your pen? (Bolehkah saya meminjam penamu?) VS Could you LEND me your pen? (Bisakah kamu meminjamkan penamu ke saya?)',
    note: 'Pasangan serupa: "learn" (belajar) vs "teach" (mengajar).'
  },
  {
    id: 'pitfall-subject-preposition',
    title: '8. "The price of these items are..." vs "is..."',
    category: 'Subject-Verb Agreement with Prepositional Phrases',
    wrong: 'The price of these high-end smartphones are very expensive.',
    correct: 'The price of these high-end smartphones is very high.',
    explanation: 'Siswa Indonesia sering terjebak melihat kata benda jamak tepat sebelum kata kerja ("smartphones are"). Padahal subjek sejatinya adalah kata "The price" (Tunggal), sedangkan "of these high-end smartphones" hanyalah frasa preposisi pelengkap! Selain itu, harga diungkapkan dengan "high/low", bukan "expensive".',
    rule: 'Subjek tunggal (The price) + Verb tunggal (is). Abaikan kata benda di dalam frasa preposisi (of ...)!',
    note: 'Contoh lain: "The quality of the modules IS (bukan are) guaranteed."'
  },
  {
    id: 'pitfall-look-forward',
    title: '9. "Look forward to meet you" vs "to meeting you"',
    category: 'Preposition "To" followed by Gerund',
    wrong: 'I look forward to hear from you soon.',
    correct: 'I look forward to hearing from you soon.',
    explanation: 'Banyak orang mengira "to" pada kalimat selalu berupa penanda infinitive (to + V1). Namun pada frasa "look forward to", kata "to" berkedudukan sebagai PREPOSISI (menuju ke arah). Karena merupakan preposisi, maka kata kerja setelahnya WAJIB berbentuk Gerund (V-ing)!',
    rule: 'look forward to + Gerund (V-ing) / Noun Phrase',
    note: 'Frasa serupa: "be used to + V-ing", "object to + V-ing", "committed to + V-ing".'
  },
  {
    id: 'pitfall-ever-visited',
    title: '10. "I have ever gone" vs "I have been to"',
    category: 'Tense & Adverb Nuance in Affirmative Sentences',
    wrong: 'I have ever gone to Bali three years ago.',
    correct: 'I visited Bali three years ago. / I have been to Bali before.',
    explanation: 'Kata "pernah" dalam bahasa Indonesia sering diterjemahkan mentah-mentah menjadi "ever". Namun dalam bahasa Inggris baku, "ever" umumnya HANYA digunakan pada kalimat tanya ("Have you ever been to Bali?") atau kalimat superlatif. Pada kalimat positif, cukup gunakan Present Perfect ("I have been to Bali") atau Simple Past jika ada keterangan waktu lampau spesifik ("I visited Bali three years ago").',
    rule: 'Tanya: "Have you ever...?" · Afirmatif Pengalaman: "I have been to..." · Waktu Lampau Tertentu: Past Simple (V2)',
    note: 'Kata "have gone" berarti orang tersebut pergi dan SAAT INI BELUM KEMBALI, sedangkan "have been" berarti sudah pergi dan sudah kembali.'
  }
];

export const INTERACTIVE_SENTENCE_PATTERNS = [
  {
    id: 'active-passive',
    name: 'Transformasi Kalimat Aktif ➔ Pasif',
    desc: 'Lihat bagaimana objek kalimat aktif berpindah menjadi fokus subjek pada kalimat pasif dengan penyesuaian to be dan Verb 3.',
    templates: [
      {
        type: 'Active',
        label: 'Kalimat Aktif (Focus on Agent)',
        chips: [
          { text: 'The teacher', role: 'Subject (Pelaku)', color: 'blue' },
          { text: 'explains', role: 'Active Verb (V1)', color: 'green' },
          { text: 'the grammar rule', role: 'Object (Penerima)', color: 'yellow' },
          { text: 'in class every day', role: 'Adverbial of Place & Time', color: 'purple' }
        ],
        sentence: 'The teacher explains the grammar rule in class every day.',
        translation: 'Guru menjelaskan aturan tata bahasa itu di kelas setiap hari.'
      },
      {
        type: 'Passive',
        label: 'Kalimat Pasif (Focus on Result / Object)',
        chips: [
          { text: 'The grammar rule', role: 'New Subject (Objek asal)', color: 'yellow' },
          { text: 'is', role: 'To Be (Present Singular)', color: 'cyan' },
          { text: 'explained', role: 'Past Participle (V3)', color: 'green' },
          { text: 'by the teacher', role: 'Agent (Pelaku)', color: 'blue' },
          { text: 'in class every day', role: 'Adverbial', color: 'purple' }
        ],
        sentence: 'The grammar rule is explained by the teacher in class every day.',
        translation: 'Aturan tata bahasa itu dijelaskan oleh guru di kelas setiap hari.'
      }
    ]
  },
  {
    id: 'conditional-type2',
    name: 'Conditional Sentence Type 2 (Pengandaian Sekarang)',
    desc: 'Pola pengandaian situasi yang bertolak belakang dengan kenyataan saat ini menggunakan bentuk Past Simple (were) dan Would + V1.',
    templates: [
      {
        type: 'Hypothetical Condition',
        label: 'Klausa Pengandaian (If-Clause)',
        chips: [
          { text: 'If', role: 'Conditional Marker', color: 'orange' },
          { text: 'I', role: 'Subject', color: 'blue' },
          { text: 'were', role: 'Past Subjunctive (Bukan was)', color: 'cyan' },
          { text: 'fluent in English', role: 'Complement (Sifat)', color: 'yellow' }
        ],
        sentence: 'If I were fluent in English,',
        translation: 'Seandainya saya fasih berbahasa Inggris saat ini (faktanya: belum fasih),'
      },
      {
        type: 'Hypothetical Result',
        label: 'Klausa Hasil (Result Clause)',
        chips: [
          { text: 'I', role: 'Subject', color: 'blue' },
          { text: 'would apply', role: 'Modal Past (would) + V1', color: 'green' },
          { text: 'for international scholarships', role: 'Object', color: 'yellow' },
          { text: 'with high confidence', role: 'Adverbial', color: 'purple' }
        ],
        sentence: 'I would apply for international scholarships with high confidence.',
        translation: 'saya akan melamar beasiswa internasional dengan rasa percaya diri tinggi.'
      }
    ]
  },
  {
    id: 'question-inversion',
    name: 'Pola Kalimat Tanya dengan Kata Kerja Bantu (Inversion)',
    desc: 'Bahasa Inggris memindahkan kata kerja bantu (auxiliary do/does/did) ke posisi sebelum subjek saat membentuk pertanyaan.',
    templates: [
      {
        type: 'Statement',
        label: 'Kalimat Pernyataan (S + V + O)',
        chips: [
          { text: 'You', role: 'Subject', color: 'blue' },
          { text: 'understand', role: 'Main Verb (V1)', color: 'green' },
          { text: 'this sentence structure', role: 'Object', color: 'yellow' }
        ],
        sentence: 'You understand this sentence structure.',
        translation: 'Anda memahami struktur kalimat ini.'
      },
      {
        type: 'Question',
        label: 'Kalimat Tanya (Auxiliary + S + V1 + O?)',
        chips: [
          { text: 'Do', role: 'Auxiliary Verb (Depan)', color: 'cyan' },
          { text: 'you', role: 'Subject', color: 'blue' },
          { text: 'understand', role: 'Base Verb (V1 murni)', color: 'green' },
          { text: 'this sentence structure?', role: 'Object', color: 'yellow' }
        ],
        sentence: 'Do you understand this sentence structure?',
        translation: 'Apakah Anda memahami struktur kalimat ini?'
      }
    ]
  }
];

export const EXAM_GRAMMAR_HACKS = [
  {
    title: 'Hack 1: Aturan Kesejajaran (The Parallelism Rule)',
    tag: 'Trik Paling Sering di UTBK/SNBT',
    rule: 'Bila ada kata penghubung "and", "or", atau "but", kelas kata dan struktur gramatikal sebelum dan sesudah WAJIB setara.',
    wrong: 'She enjoys reading novels, swimming, and to cook delicious meals. ❌',
    correct: 'She enjoys reading novels, swimming, and cooking delicious meals. ✅',
    tip: 'Jika kata sebelumnya berbentuk gerund (-ing), kata berikutnya juga harus berbentuk gerund (-ing), bukan to-infinitive!'
  },
  {
    title: 'Hack 2: Indefinite Pronouns Selalu Dianggap Tunggal (Singular)',
    tag: 'Jebakan Soal Pilihan Ganda',
    rule: 'Subjek yang berakhiran -body, -one, -thing (Everybody, Everyone, Someone, Anyone, Each) selalu berpasangan dengan kata kerja tunggal (singular verb).',
    wrong: 'Everybody in this conference have submitted their papers. ❌',
    correct: 'Everybody in this conference has submitted their paper. ✅',
    tip: 'Jangan terkecoh oleh banyaknya orang yang hadir; "Everybody" berarti setiap orang secara individual, sehingga predikatnya adalah "has" atau "is", bukan "have" atau "are"!'
  },
  {
    title: 'Hack 3: Preposisi Wajib Diikuti Gerund (Preposition + V-ing)',
    tag: 'Rumus Emas Tata Bahasa',
    rule: 'Setiap kata kerja yang berada tepat setelah preposisi (in, on, at, by, for, about, without, before, after) SELALU berakhiran -ing.',
    wrong: 'He improved his English by listen to daily podcasts. ❌',
    correct: 'He improved his English by listening to daily podcasts. ✅',
    tip: 'Ingat rumus kilat: Preposition + Noun / Gerund. Tidak ada preposisi yang diikuti kata kerja bentuk pertama polos!'
  },
  {
    title: 'Hack 4: Inversi Kata Keterangan Negatif (Negative Inversion)',
    tag: 'Soal Tingkat Lanjut (Advanced)',
    rule: 'Jika sebuah kalimat diawali kata keterangan bernada negatif atau restriktif (Rarely, Seldom, Never, Scarcely, Not only), susunan kata kerja bantu dan subjek WAJIB dibalik seperti kalimat tanya.',
    wrong: 'Rarely we have seen such impressive academic progress. ❌',
    correct: 'Rarely have we seen such impressive academic progress. ✅',
    tip: 'Pola: Negative Adverb + Auxiliary Verb (have/do/did/was) + Subject + Main Verb.'
  },
  {
    title: 'Hack 5: Waspadai Jebakan Pemborosan Kata (Redundancy Traps)',
    tag: 'Ketepatan Kosakata Ujian',
    rule: 'Soal ujian bahasa Inggris sering menyisipkan kata yang bermakna ganda yang dianggap tidak baku dalam standar formal.',
    wrong: 'Please repeat again your statement. ❌ · He returned back home. ❌ · She is more better. ❌',
    correct: 'Please repeat your statement. ✅ · He returned home. ✅ · She is much better. ✅',
    tip: '"Repeat" sudah berarti mengatakan kembali, jadi tidak perlu "again". "Return" sudah berarti kembali, jadi tidak perlu "back".'
  }
];

