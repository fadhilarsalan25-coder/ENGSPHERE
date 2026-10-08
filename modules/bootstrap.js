import { state, loadState, saveState, applyStreak, levelForXp, levelLabel, getProficiencyLevel } from './state.js';
import { escapeHtml, showToast, formatTopic, capitalize } from './utils.js';
import { renderReviewSection, seedSampleReviewQuestions, startReviewQuiz } from './review.js';
import { renderTenses, renderVocabulary, startQuickQuiz, runAiAdaptiveTest } from './quiz.js';
import { openAuthModal, openProfileModal, closeAllModals, signUpUser, loginUser, continueAsGuest, signOutUser, exportUserData, importUserData } from './auth.js';
import { initLandingScrollAnimations } from './landing.js';
import { bindNavigation, setView as navSetView } from './navigation.js';

export const I18N = {
  en: {
    langCode: 'EN',
    langTitle: 'English (EN)',
    switchMsg: 'Switched language to English 🇬🇧',
    hero_title: 'Practice English Until It Clicks.',
    hero_lede: 'Clear lessons on tenses, verb forms, vocabulary and grammar — paired with quizzes that adjust to your level so practice never feels too easy or too hard.',
    landing_login: 'Log in',
    landing_signup: 'Sign up / Get Started',
    landing_signup_short: 'Sign up',
    landing_cta_start: '🚀 Sign up / Get Started',
    landing_cta_login: 'Log in to account',
    landing_cta_inside: "See what's inside",
    final_start: '🚀 Sign up / Get Started Free',
    final_login: 'I already have an account',
    nav_dashboard: '🏠 Dashboard',
    nav_materials: '📘 Materials',
    nav_practice: '🎯 Practice',
    nav_progress: '📈 Progress',
    dash_start_quiz: 'Start a quiz',
    dash_browse_mat: 'Browse materials',
    dash_greeting: 'Welcome back',
    dash_level_label: 'Level',
    streak_suffix: '-day streak',
    targeted_review: 'Targeted Review',
    targeted_review_sub: 'Questions you answered incorrectly during quizzes. Study the grammar explanations and retry each question until it clicks.',
    start_review_quiz: '⚡ Start Review Quiz',
    clear_mastered: 'Clear Mastered',
    quick_links: 'Quick links',
    materials_title: 'Materials',
    materials_sub: 'Short, practical lessons — read the rule, then check the examples. Everything here also feeds the Practice quizzes.',
    practice_title: 'Practice',
    practice_sub: 'Pick a topic, difficulty, and question count to test your English skills with instant feedback.',
    tab_quick_quiz: 'Quiz',
    tab_ai_test: 'Quiz',
    tab_quiz: 'Quiz',
    start_quiz_btn: '🚀 Start Quiz',
    generate_ai_btn: '🚀 Start Quiz',
    ql_quiz_title: 'Quiz',
    ql_quiz_desc: 'Adaptive interactive practice with instant explanations.',
    quiz_adaptive_note: 'Questions adapt dynamically to your selected topic and difficulty level, with instant explanations on every answer.',
    topic_mixed: 'Mixed review',
    diff_beginner: 'Beginner',
    diff_intermediate: 'Intermediate',
    diff_advanced: 'Advanced',
    progress_title: 'Your progress',
    progress_sub: 'Every quiz round adds to your XP and streak.',
    recent_tests: 'Recent tests',
    reset_progress: 'Reset all progress',
    sub_tenses: 'Tenses',
    sub_tobe: 'To Be',
    sub_vocabulary: 'Vocabulary',
    sub_grammar: 'Grammar',
    vocab_oxford_heading: 'Oxford 3000™ & 5000™ Standard Core Vocabulary',
    vocab_intro: 'Tap any flashcard to flip between the word, phonetic transcription (IPA), CEFR proficiency level, Oxford definition, and authentic example sentence.',
    ql_review_desc: 'Review and retry questions you answered incorrectly.',
    ql_tenses_desc: 'All 12 tenses, explained with examples.',
    ql_tobe_desc: "Am, is, are — and how they're used.",
    ql_vocab_desc: '128 Oxford standard flashcards across 8 essential themes.',
    ql_grammar_desc: 'Parts of speech and sentence structure.',
    ql_ai_desc: 'Adaptive questions matched to your level.',

    // Landing strip
    ls_label1: 'tenses, each with formula, usage and examples',
    ls_label2: 'levels — Beginner, Intermediate, Advanced',
    ls_label3: 'AI-generated questions, never the same test twice',

    // What EngSphere is
    wi_title: 'What EngSphere is',
    wi_lede: 'A self-paced English tutor that fits in one browser tab. It takes the structure of a proper language course — a syllabus, graded practice, feedback on every answer — and puts it in front of you without the usual fluff.',
    wi_stuck_h3: "Built for the learner who's stuck in the middle",
    wi_stuck_p1: "Most people learning English aren't complete beginners and aren't fluent either. They know some words, half-remember the tenses, and freeze when it's time to actually produce a sentence.",
    wi_stuck_p2: 'EngSphere sits between the two. Read a short rule, see it used in a real sentence, then answer questions about it — and get told exactly why your answer was right or wrong before moving on.',
    wi_loop_h4: 'The three-step loop',
    wi_loop_li1: '<span>Read</span> a rule written in plain language, with its formula and examples.',
    wi_loop_li2: '<span>Practise</span> it in a quiz set to your level.',
    wi_loop_li3: '<span>Review</span> the explanation for every answer, then earn XP and keep your streak.',
    wi_loop_note: "Repeat on a topic until it stops feeling like guessing. That's the whole method.",

    // Main features
    mf_title: 'Main features',
    mf_lede: 'Four parts, each one feeding the next.',
    mf_tag_materials: 'Materials',
    mf_mat_h3: 'Grammar explained plainly',
    mf_mat_p: 'All 12 tenses in a time-by-aspect grid, the full <em>to be</em> conjugation, eight parts of speech, sentence structure and article rules — each with formula, usage notes and worked examples.',
    mf_tag_vocab: 'Vocabulary',
    mf_voc_h3: 'Flip cards by theme',
    mf_voc_p: 'Everyday sets — daily life, work, travel, feelings, academic and phrasal verbs — with meaning, part of speech and a sentence showing the word in use.',
    mf_tag_quiz: 'Quick quiz',
    mf_quiz_h3: 'Gamified practice on demand',
    mf_quiz_p: 'Choose a topic and difficulty and get an instant multiple-choice round. Every answer is explained the moment you pick it, and every round pays out XP.',
    mf_tag_ai: 'AI tutor',
    mf_ai_h3: 'Tests written for you, live',
    mf_ai_p: 'Set the topic, level and length, and an AI tutor writes a brand-new test on the spot — with a written explanation for each answer, pitched at the level you picked.',
    mf_tag_progress: 'Progress',
    mf_prog_h3: 'XP, streaks and badges',
    mf_prog_p: 'Every test adds XP and pushes your level ring forward. Miss a day and the streak resets — the one bit of pressure that actually helps.',
    mf_tag_levels: 'Levels',
    mf_levels_h3: 'The same topic, three depths',
    mf_levels_p: 'Beginner, Intermediate and Advanced change the questions, the vocabulary and how much the explanations assume you already know.',

    // Why this one
    why_title: 'Why this one, and not another app',
    why_lede: "Four things most English apps ask you to give up. EngSphere doesn't.",
    why_vs_label: 'Elsewhere',
    why_vs1_old: 'A fixed question bank you eventually memorise.',
    why_vs1_new_h4: 'Questions written fresh each time',
    why_vs1_new_p: "The AI tutor generates a new test for your chosen topic and level on every run, so you're tested on the rule — not on a memorised answer key.",
    why_vs2_old: '"Wrong." Next question.',
    why_vs2_new_h4: 'An explanation on every single answer',
    why_vs2_new_p: "Right or wrong, you're told which rule applies and why the other options fail. Getting it wrong is where the lesson actually happens.",
    why_vs3_old: 'Lessons in one app, practice in another.',
    why_vs3_new_h4: 'Material and practice in one loop',
    why_vs3_new_p: 'Every quiz topic maps to a lesson you can open in two taps, so you never have to leave to look something up mid-round.',
    why_vs4_old: 'Sign-up walls, subscriptions, ten-minute onboarding quizzes.',
    why_vs4_new_h4: 'Open it and start',
    why_vs4_new_p: 'No account, no email, no placement test. Pick a level, change it whenever it feels wrong, and your progress stays on your own device.',

    // Method
    meth_title: 'The course method behind it',
    meth_lede: 'EngSphere follows how well-run language courses actually teach, adapted for solo study.',
    meth_c1_h4: 'Present, practise, produce',
    meth_c1_p: 'The standard classroom sequence: meet the rule in context, drill it under guidance, then use it yourself. Materials presented in short chunks match how language sticks.',
    meth_c2_h4: 'Graded difficulty',
    meth_c2_p: 'Courses level learners so material sits just past what they can already do. Three difficulty settings do that here, and you can move up or down without losing progress.',
    meth_c3_h4: 'Feedback before the next question',
    meth_c3_p: 'Correction is most useful while the sentence is still in your head, which is why the explanation appears the moment you answer.',
    meth_c4_h4: 'Spaced, short sessions',
    meth_c4_p: 'Short rounds and a daily streak encourage returning tomorrow rather than cramming once — how vocabulary and grammar actually stick.',
    meth_c5_h4: 'Vocabulary in context',
    meth_c5_p: 'Words are taught with a part of speech and a full example sentence, not as isolated translations, so you learn how each word behaves in real use.',
    meth_c6_h4: 'All four skills in view',
    meth_c6_p: 'Reading and writing are covered directly; speaking and listening are supported by example sentences written the way people actually speak.',

    // Final CTA & Footer
    final_cta_h2: 'Pick a level and start a round.',
    final_cta_p: 'It takes about three minutes. Your progress saves on this device.',
    landing_footer: 'EngSphere — built for focused, self-paced English practice.',

    // Materials intros
    mat_tenses_desc: 'English tenses are organised by <strong>time</strong> (present, past, future) and <strong>aspect</strong> (simple, continuous, perfect, perfect continuous). Tap a card to expand formulas, usage rules, key signals, and examples.',
    tobe_intro: 'The verb <strong>to be</strong> (am / is / are / was / were) is the most common verb in English. It shows identity, description and location, and it also builds continuous and passive sentences.',
    tobe_pres_title: 'Present: am / is / are',
    th_subject: 'Subject',
    th_form: 'Form',
    th_example: 'Example',
    tobe_past_title: 'Past: was / were',
    tobe_neg_h4: 'Negative forms',
    tobe_neg_desc: "Contract naturally in speech: <em>isn't, aren't, wasn't, weren't</em>. \"It is not far\" → \"It isn't far.\"",
    tobe_q_h4: 'Question forms',
    tobe_q_desc: 'Move the be-verb before the subject: "You are ready." → "Are you ready?" · "She was late." → "Was she late?"',
    tobe_jobs_h4: 'Four everyday jobs of "to be"',
    tobe_job1: '<strong style="color:var(--text);">Identity</strong> — "I am Maria."',
    tobe_job2: '<strong style="color:var(--text);">Description</strong> — "The soup is hot."',
    tobe_job3: '<strong style="color:var(--text);">Location</strong> — "They are in Jakarta."',
    tobe_job4: '<strong style="color:var(--text);">Existence</strong> — "There is a problem." / "There are two options."',
    tobe_build_h4: 'Building block for other grammar',
    tobe_build_desc: '<strong style="color:var(--text);">Continuous tenses:</strong> be + verb-ing → "I am learning." &nbsp;·&nbsp; <strong style="color:var(--text);">Passive voice:</strong> be + past participle → "The door was opened."',

    vocab_intro: 'Tap any flashcard to flip between the word and its meaning with an example sentence. Browse everyday categories below.',

    grammar_intro: 'Grammar is just the set of patterns that hold a sentence together. Start with the building blocks (parts of speech), then the order they go in.',
    pos_heading: 'Parts of speech',
    pos_noun_h4: 'Noun',
    pos_noun_p: 'A person, place, thing or idea.',
    pos_verb_h4: 'Verb',
    pos_verb_p: 'An action or state.',
    pos_adj_h4: 'Adjective',
    pos_adj_p: 'Describes a noun.',
    pos_adv_h4: 'Adverb',
    pos_adv_p: 'Describes a verb, adjective, or another adverb.',
    pos_pron_h4: 'Pronoun',
    pos_pron_p: 'Replaces a noun.',
    pos_prep_h4: 'Preposition',
    pos_prep_p: 'Shows relation (place, time, direction).',
    pos_conj_h4: 'Conjunction',
    pos_conj_p: 'Joins words or clauses.',
    pos_art_h4: 'Article',
    pos_art_p: 'Marks a noun as specific or general.',

    grm_svo_h4: 'Basic sentence structure — SVO',
    grm_svo_p: 'English word order is fixed: "<strong style="color:var(--text);">She (S)</strong> <strong style="color:var(--sky-bright);">reads (V)</strong> <strong style="color:var(--text);">books (O)</strong>." Move the order and the meaning changes or the sentence becomes ungrammatical.',
    grm_sva_h4: 'Subject–verb agreement',
    grm_sva_p: 'A singular subject takes a singular verb, and a plural subject takes a plural verb: "He <strong style="color:var(--text);">runs</strong>" vs. "They <strong style="color:var(--text);">run</strong>."',
    grm_art_h4: 'A, an, or the?',
    grm_art_p: '<strong style="color:var(--text);">a / an</strong> introduce something not yet specific ("a dog", "an apple" — use <em>an</em> before a vowel sound). <strong style="color:var(--text);">the</strong> points to a particular one: "the dog", "the apple".',
    grm_negq_h4: 'Making a sentence negative or a question',
    grm_negq_p: 'Most verbs need a helper: <strong style="color:var(--text);">do / does / did</strong>. "I like tea" → "I <strong style="color:var(--text);">don\'t</strong> like tea." "You live here" → "<strong style="color:var(--text);">Do</strong> you live here?"'
  },
  id: {
    langCode: 'ID',
    langTitle: 'Bahasa Indonesia (ID)',
    switchMsg: 'Bahasa berhasil diubah ke Bahasa Indonesia 🇮🇩',
    hero_title: 'Latihan Bahasa Inggris Sampai Paham.',
    hero_lede: 'Pelajaran ringkas, umpan balik instan, dan kuis adaptif seiring kemajuan belajar Anda. Gratis berlatih, tanpa iklan, langsung coba.',
    landing_login: 'Masuk',
    landing_signup: 'Daftar / Mulai',
    landing_signup_short: 'Daftar',
    landing_cta_start: '🚀 Daftar / Mulai Sekarang',
    landing_cta_login: 'Masuk ke akun',
    landing_cta_inside: 'Lihat fitur di dalam',
    final_start: '🚀 Daftar / Mulai Gratis',
    final_login: 'Saya sudah punya akun',
    nav_dashboard: '🏠 Beranda',
    nav_materials: '📘 Materi',
    nav_practice: '🎯 Latihan',
    nav_progress: '📈 Kemajuan',
    dash_start_quiz: 'Mulai kuis',
    dash_browse_mat: 'Lihat materi',
    dash_greeting: 'Selamat datang kembali',
    dash_level_label: 'Tingkat',
    streak_suffix: '-hari streak',
    targeted_review: 'Review Bertarget',
    targeted_review_sub: 'Pertanyaan yang salah saat kuis. Pelajari penjelasan tata bahasanya dan coba lagi sampai paham.',
    start_review_quiz: '⚡ Mulai Kuis Review',
    clear_mastered: 'Hapus yang Dikuasai',
    quick_links: 'Tautan cepat',
    materials_title: 'Materi Belajar',
    materials_sub: 'Pelajaran ringkas & praktis — pelajari aturannya, lalu periksa contoh kalimatnya. Semua materi ini terhubung ke kuis latihan.',
    practice_title: 'Latihan Soal',
    practice_sub: 'Pilih topik, tingkat kesulitan, dan jumlah soal untuk menguji kemampuan bahasa Inggris Anda dengan umpan balik langsung.',
    tab_quick_quiz: 'Kuis',
    tab_ai_test: 'Kuis',
    tab_quiz: 'Kuis',
    start_quiz_btn: '🚀 Mulai Kuis',
    generate_ai_btn: '🚀 Mulai Kuis',
    ql_quiz_title: 'Kuis',
    ql_quiz_desc: 'Latihan interaktif adaptif dengan penjelasan langsung di setiap jawaban.',
    quiz_adaptive_note: 'Soal disesuaikan secara adaptif dengan topik dan tingkat kesulitan pilihan Anda, lengkap dengan penjelasan langsung di setiap jawaban.',
    topic_mixed: 'Campuran',
    diff_beginner: 'Pemula',
    diff_intermediate: 'Menengah',
    diff_advanced: 'Mahir',
    progress_title: 'Kemajuan Belajar Anda',
    progress_sub: 'Setiap putaran kuis menambah XP dan streak belajar Anda.',
    recent_tests: 'Tes Terakhir',
    reset_progress: 'Reset semua kemajuan',
    sub_tenses: 'Bentuk Waktu (Tenses)',
    sub_tobe: 'Kata Kerja To Be',
    sub_vocabulary: 'Kosakata (Vocabulary)',
    sub_grammar: 'Tata Bahasa (Grammar)',
    vocab_oxford_heading: 'Kosakata Inti Standar Oxford 3000™ & 5000™',
    vocab_intro: 'Ketuk kartu kosakata untuk membalik antara kata, transkripsi fonetik (IPA), tingkat kemahiran CEFR, definisi Oxford, dan contoh kalimat nyata.',
    ql_review_desc: 'Tinjau dan ulangi pertanyaan yang sebelumnya salah dijawab.',
    ql_tenses_desc: '12 macam tenses, lengkap dengan rumus dan contoh kalimat.',
    ql_tobe_desc: 'Am, is, are, was, were — fungsi dan cara penggunaannya.',
    ql_vocab_desc: '128 kartu kosakata standar Oxford dalam 8 tema esensial & akademis.',
    ql_grammar_desc: 'Bagian kalimat (Parts of Speech) dan aturan tata bahasa.',
    ql_ai_desc: 'Soal latihan yang disesuaikan dengan tingkat kemampuan Anda.',

    // Landing strip
    ls_label1: 'macam tenses, lengkap dengan rumus, fungsi, dan contoh kalimat',
    ls_label2: 'tingkatan — Pemula, Menengah, Mahir',
    ls_label3: 'soal adaptif AI, latihan bervariasi tanpa rasa bosan',

    // What EngSphere is
    wi_title: 'Mengenal EngSphere',
    wi_lede: 'Tutor bahasa Inggris mandiri dalam satu tab browser. Mengadopsi struktur kursus bahasa yang terarah — silabus terstruktur, latihan bertingkat, umpan balik di setiap jawaban — tanpa kerumitan yang tidak perlu.',
    wi_stuck_h3: 'Dirancang untuk pembelajar yang merasa mandek di tengah jalan',
    wi_stuck_p1: 'Banyak orang yang belajar bahasa Inggris bukan pemula total, tetapi juga belum fasih. Mengenal banyak kosakata, ingat sebagian tenses, namun sering bingung saat harus menyusun kalimat utuh.',
    wi_stuck_p2: 'EngSphere menjembatani keduanya. Pelajari aturan ringkas, lihat contoh penggunaannya dalam kalimat nyata, lalu jawab latihan soal — dan langsung ketahui alasan tepat mengapa jawaban Anda benar atau salah.',
    wi_loop_h4: 'Siklus 3 Langkah Belajar',
    wi_loop_li1: '<span>Baca</span> aturan tata bahasa yang ringkas, lengkap dengan rumus dan contohnya.',
    wi_loop_li2: '<span>Latihan</span> melalui kuis yang disesuaikan dengan tingkat kemampuan Anda.',
    wi_loop_li3: '<span>Tinjau</span> penjelasan di setiap jawaban, dapatkan XP, dan pertahankan streak belajar Anda.',
    wi_loop_note: 'Ulangi latihan pada topik tersebut hingga Anda benar-benar yakin tanpa menebak-nebak.',

    // Main features
    mf_title: 'Fitur Utama',
    mf_lede: 'Empat bagian pembelajaran yang saling melengkapi.',
    mf_tag_materials: 'Materi Belajar',
    mf_mat_h3: 'Tata Bahasa Dijelaskan dengan Ringkas',
    mf_mat_p: 'Semua 12 macam tenses dalam bagan waktu & aspek, konjugasi lengkap <em>to be</em>, 8 bagian kata, struktur kalimat, dan aturan artikel — lengkap dengan rumus, fungsi, dan contoh nyata.',
    mf_tag_vocab: 'Kosakata',
    mf_voc_h3: 'Kartu Kosakata Flip Interaktif',
    mf_voc_p: 'Koleksi tema sehari-hari — rutinitas, pekerjaan, liburan, perasaan, akademik, dan phrasal verbs — dilengkapi arti, kelas kata, dan contoh kalimat penggunaannya.',
    mf_tag_quiz: 'Kuis Cepat',
    mf_quiz_h3: 'Latihan Interaktif Berhadiah XP',
    mf_quiz_p: 'Pilih topik dan tingkat kesulitan untuk langsung memulai kuis pilihan ganda. Setiap jawaban langsung disertai pembahasan, dan setiap sesi memberikan bonus XP.',
    mf_tag_ai: 'Tutor AI',
    mf_ai_h3: 'Tes Dibuat Khusus Secara Dinamis',
    mf_ai_p: 'Tentukan topik, tingkat, dan jumlah soal, lalu tutor AI akan meracik tes baru seketika — lengkap dengan penjelasan detail yang sesuai dengan tingkat belajar Anda.',
    mf_tag_progress: 'Kemajuan',
    mf_prog_h3: 'Sistem XP, Streak Harian, dan Lencana',
    mf_prog_p: 'Setiap latihan kuis menambah perolehan XP dan meningkatkan level Anda. Jaga konsistensi belajar setiap hari untuk mempertahankan streak Anda.',
    mf_tag_levels: 'Tingkatan',
    mf_levels_h3: 'Satu Topik, Tiga Tingkat Kedalaman',
    mf_levels_p: 'Pilihan Pemula, Menengah, dan Mahir menyesuaikan bobot pertanyaan, perbendaharaan kata, dan detail penjelasan konsep sesuai kemampuan Anda.',

    // Why this one
    why_title: 'Mengapa Memilih EngSphere?',
    why_lede: 'Empat hal penting yang sering diabaikan aplikasi belajar lain, tapi EngSphere sediakan untuk Anda.',
    why_vs_label: 'Di Tempat Lain',
    why_vs1_old: 'Bank soal yang kaku sehingga Anda hanya menghafal kunci jawaban.',
    why_vs1_new_h4: 'Soal Segar yang Bervariasi Setiap Saat',
    why_vs1_new_p: 'Tutor AI menghasilkan soal baru untuk topik dan level pilihan Anda, sehingga Anda benar-benar menguji pemahaman aturan, bukan sekadar menghafal kunci.',
    why_vs2_old: '"Salah." Lalu lanjut ke pertanyaan berikutnya tanpa alasan.',
    why_vs2_new_h4: 'Penjelasan Tuntas di Setiap Jawaban',
    why_vs2_new_p: 'Benar ataupun salah, Anda diberitahu aturan grammar yang berlaku dan alasan mengapa opsi lain kurang tepat. Dari kesalahan itulah pemahaman sejati terbentuk.',
    why_vs3_old: 'Materi pelajaran di satu aplikasi, latihan soal di aplikasi lain.',
    why_vs3_new_h4: 'Materi dan Latihan Terintegrasi Rapi',
    why_vs3_new_p: 'Setiap topik kuis terhubung langsung ke modul materi yang bisa dibuka dengan dua ketukan, tanpa harus keluar aplikasi untuk mencari referensi.',
    why_vs4_old: 'Batas pendaftaran wajib, langganan berbayar, tes penempatan panjang.',
    why_vs4_new_h4: 'Buka dan Langsung Berlatih',
    why_vs4_new_p: 'Bisa langsung dicoba tanpa hambatan. Pilih tingkat belajar Anda, ubah kapan saja sesuai kebutuhan, dan kemajuan Anda tersimpan aman di perangkat Anda.',

    // Method
    meth_title: 'Metode Pengajaran di Balik EngSphere',
    meth_lede: 'EngSphere menerapkan kurikulum dan metode kursus bahasa Inggris berkualitas yang diadaptasi khusus untuk belajar mandiri.',
    meth_c1_h4: 'Presentasi, Latihan, Penerapan',
    meth_c1_p: 'Urutan belajar standar di kelas: kenali aturan dalam konteks, latih secara bertahap, lalu terapkan secara mandiri. Materi ringkas membuat tata bahasa lebih mudah melekat.',
    meth_c2_h4: 'Tingkat Kesulitan Bertahap',
    meth_c2_p: 'Menyesuaikan materi tepat di atas apa yang sudah Anda kuasai. Tersedia 3 tingkat kesulitan yang dapat Anda sesuaikan kapan saja tanpa kehilangan progres.',
    meth_c3_h4: 'Umpan Balik Sebelum Soal Berikutnya',
    meth_c3_p: 'Koreksi paling efektif ketika kalimat masih teringat jelas di ingatan Anda. Karena itulah pembahasan langsung muncul saat jawaban dipilih.',
    meth_c4_h4: 'Sesi Singkat Berkala',
    meth_c4_p: 'Latihan berdurasi singkat dengan streak harian mendorong kebiasaan belajar rutin setiap hari dibanding sistem kebut semalam.',
    meth_c5_h4: 'Kosakata Dalam Kalimat Nyata',
    meth_c5_p: 'Kosakata dipelajari bersama kelas kata dan contoh kalimat lengkap, bukan terjemahan kata tunggal, sehingga Anda paham cara memakainya dalam percakapan.',
    meth_c6_h4: 'Menunjang Kemampuan Berbahasa Lengkap',
    meth_c6_p: 'Membaca dan menulis dilatih secara langsung; percakapan dan pemahaman didukung kalimat contoh alami sebagaimana penutur asli berbicara.',

    // Final CTA & Footer
    final_cta_h2: 'Pilih tingkat kemampuan Anda dan mulai latihan.',
    final_cta_p: 'Hanya butuh sekitar 3 menit. Kemajuan belajar Anda tersimpan di perangkat ini.',
    landing_footer: 'EngSphere — dirancang untuk latihan bahasa Inggris mandiri yang terfokus dan efektif.',

    // Materials intros
    mat_tenses_desc: '12 tenses bahasa Inggris disusun sistematis berdasarkan <strong>waktu</strong> (present, past, future) dan <strong>aspek</strong> (simple, continuous, perfect, perfect continuous). Klik kartu untuk melihat rumus, fungsi, sinyal waktu, dan contoh kalimat.',
    tobe_intro: 'Kata kerja <strong>to be</strong> (am / is / are / was / were) adalah kata kerja paling mendasar dalam bahasa Inggris. Digunakan untuk identitas, deskripsi sifat/keadaan, lokasi, serta membentuk kalimat continuous dan pasif.',
    tobe_pres_title: 'Present: am / is / are',
    th_subject: 'Subjek',
    th_form: 'Bentuk',
    th_example: 'Contoh',
    tobe_past_title: 'Past: was / were',
    tobe_neg_h4: 'Bentuk Kalimat Negatif',
    tobe_neg_desc: 'Bentuk singkatan umum dalam percakapan: <em>isn\'t, aren\'t, wasn\'t, weren\'t</em>. "It is not far" → "It isn\'t far."',
    tobe_q_h4: 'Bentuk Kalimat Tanya',
    tobe_q_desc: 'Pindahkan to be ke depan subjek: "You are ready." → "Are you ready?" · "She was late." → "Was she late?"',
    tobe_jobs_h4: '4 Fungsi Utama "to be" Sehari-hari',
    tobe_job1: '<strong style="color:var(--text);">Identitas</strong> — "I am Maria."',
    tobe_job2: '<strong style="color:var(--text);">Deskripsi Sifat/Keadaan</strong> — "The soup is hot."',
    tobe_job3: '<strong style="color:var(--text);">Lokasi / Keberadaan</strong> — "They are in Jakarta."',
    tobe_job4: '<strong style="color:var(--text);">Keberadaan Objek</strong> — "There is a problem." / "There are two options."',
    tobe_build_h4: 'Fondasi Pembentuk Pola Tata Bahasa Lain',
    tobe_build_desc: '<strong style="color:var(--text);">Bentuk Continuous:</strong> be + verb-ing → "I am learning." &nbsp;·&nbsp; <strong style="color:var(--text);">Kalimat Pasif:</strong> be + past participle (V3) → "The door was opened."',

    vocab_intro: 'Klik kartu flashcard untuk membalik antara kosakata dan artinya beserta contoh kalimat. Pilih kategori tema di bawah.',

    grammar_intro: 'Tata bahasa (grammar) adalah pola baku penyusun kalimat agar terstruktur. Mulai dari jenis kata (Parts of Speech), lalu pelajari urutan susunannya.',
    pos_heading: 'Kelas Kata (Parts of Speech)',
    pos_noun_h4: 'Noun (Kata Benda)',
    pos_noun_p: 'Menamai orang, tempat, benda, atau konsep abstrak.',
    pos_verb_h4: 'Verb (Kata Kerja)',
    pos_verb_p: 'Menyatakan tindakan, proses, atau keadaan.',
    pos_adj_h4: 'Adjective (Kata Sifat)',
    pos_adj_p: 'Menjelaskan atau memberi sifat pada kata benda.',
    pos_adv_h4: 'Adverb (Kata Keterangan)',
    pos_adv_p: 'Menerangkan kata kerja, kata sifat, atau keterangan lain.',
    pos_pron_h4: 'Pronoun (Kata Ganti)',
    pos_pron_p: 'Menggantikan kata benda agar tidak berulang.',
    pos_prep_h4: 'Preposition (Kata Depan)',
    pos_prep_p: 'Menunjukkan hubungan ruang, waktu, atau arah.',
    pos_conj_h4: 'Conjunction (Kata Sambung)',
    pos_conj_p: 'Menghubungkan kata, frasa, atau antarklausa.',
    pos_art_h4: 'Article (Kata Sandang)',
    pos_art_p: 'Menandai kata benda bersifat spesifik atau umum.',

    grm_svo_h4: 'Struktur Kalimat Dasar — SVO',
    grm_svo_p: 'Urutan kata bahasa Inggris bersifat baku: "<strong style="color:var(--text);">She (S)</strong> <strong style="color:var(--sky-bright);">reads (V)</strong> <strong style="color:var(--text);">books (O)</strong>." Mengubah urutan akan mengubah arti kalimat atau menjadikannya tidak baku.',
    grm_sva_h4: 'Kesesuaian Subjek & Kata Kerja (Subject–Verb Agreement)',
    grm_sva_p: 'Subjek tunggal memerlukan kata kerja bentuk tunggal, dan subjek jamak menggunakan kata kerja jamak: "He <strong style="color:var(--text);">runs</strong>" vs. "They <strong style="color:var(--text);">run</strong>."',
    grm_art_h4: 'Penggunaan Artikel: a, an, atau the?',
    grm_art_p: '<strong style="color:var(--text);">a / an</strong> digunakan untuk kata benda umum yang belum spesifik ("a dog", "an apple" — gunakan <em>an</em> sebelum bunyi vokal). <strong style="color:var(--text);">the</strong> merujuk pada benda tertentu yang sudah jelas spesifik: "the dog", "the apple".',
    grm_negq_h4: 'Membentuk Kalimat Negatif atau Kalimat Tanya',
    grm_negq_p: 'Sebagian besar kata kerja membutuhkan kata kerja bantu: <strong style="color:var(--text);">do / does / did</strong>. "I like tea" → "I <strong style="color:var(--text);">don\'t</strong> like tea." "You live here" → "<strong style="color:var(--text);">Do</strong> you live here?"'
  }
};

export function closeAllLangDropdowns() {
  document.querySelectorAll('.lang-dropdown').forEach(dropdown => dropdown.classList.add('hidden'));
  document.querySelectorAll('.lang-switcher-wrap').forEach(wrapper => {
    wrapper.classList.remove('open');
    wrapper.querySelector('.lang-btn')?.setAttribute('aria-expanded', 'false');
  });
}

export function translateUI(lang, state) {
  const selected = lang === 'id' ? 'id' : 'en';
  const t = I18N[selected];
  if (!t) return;
  document.documentElement.lang = selected;

  // 1. All elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (t[key]) {
      if (t[key].includes('<')) {
        element.innerHTML = t[key];
      } else {
        element.textContent = t[key];
      }
    }
  });

  // 2. Language switcher button labels
  ['landingLangLabel', 'appLangLabel', 'modalLangLabel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t.langCode;
  });

  // 3. Language options checkmarks and active state
  document.querySelectorAll('.lang-opt').forEach(opt => {
    const isActive = opt.dataset.setLang === selected;
    opt.classList.toggle('active', isActive);
    const check = opt.querySelector('.lang-check');
    if (check) {
      check.classList.toggle('hidden', !isActive);
      check.style.display = isActive ? 'inline-block' : 'none';
    }
  });

  // 4. Subtabs pills
  const tensesTab = document.querySelector('[data-msub="tenses"]');
  if (tensesTab) tensesTab.textContent = t.sub_tenses;
  const tobeTab = document.querySelector('[data-msub="tobe"]');
  if (tobeTab) tobeTab.textContent = t.sub_tobe;
  const vocabTab = document.querySelector('[data-msub="vocabulary"]');
  if (vocabTab) vocabTab.textContent = t.sub_vocabulary;
  const grammarTab = document.querySelector('[data-msub="grammar"]');
  if (grammarTab) grammarTab.textContent = t.sub_grammar;

  // 5. Practice subtabs (if present)
  const quizTab = document.querySelector('[data-psub="quiz"]');
  if (quizTab) quizTab.textContent = t.tab_quiz || 'Quiz';
  const aiTab = document.querySelector('[data-psub="ai"]');
  if (aiTab) aiTab.textContent = t.tab_quiz || 'Quiz';

  // 6. Level ring text
  document.querySelectorAll('.ring-label .l').forEach(el => {
    el.textContent = t.dash_level_label;
  });

  // 7. Streak suffix
  document.querySelectorAll('.streak-line').forEach(el => {
    const streakNum = state?.streak || 0;
    el.innerHTML = `🔥 <span id="dashStreak">${streakNum}</span>${t.streak_suffix}`;
  });

  // 8. Dashboard description
  const dashDesc = document.getElementById('dashDesc');
  if (dashDesc && state) {
    const currentDiff = state.selectedDifficulty || 'intermediate';
    const diffWord = selected === 'id' ? (currentDiff === 'beginner' ? 'Pemula' : currentDiff === 'advanced' ? 'Mahir' : 'Menengah') : currentDiff;
    dashDesc.innerHTML = selected === 'id'
      ? `Tingkat belajar Anda: <strong id="dashLevelWord">${diffWord}</strong>. Buka materi pelajaran atau mulai kuis untuk menjaga streak Anda.`
      : `You're set to <strong id="dashLevelWord">${diffWord}</strong> level. Jump back into a lesson or start a quiz to keep your streak alive.`;
  }

  // 9. Quicklink card descriptions
  document.querySelectorAll('.ql-item').forEach(item => {
    const h3 = item.querySelector('h3');
    const p = item.querySelector('p');
    if (item.dataset.gotoReview) {
      if (h3) h3.textContent = t.targeted_review;
      if (p) p.textContent = t.ql_review_desc;
    } else if (item.dataset.gotoMaterial === 'tenses') {
      if (h3) h3.textContent = t.sub_tenses;
      if (p) p.textContent = t.ql_tenses_desc;
    } else if (item.dataset.gotoMaterial === 'tobe') {
      if (h3) h3.textContent = t.sub_tobe;
      if (p) p.textContent = t.ql_tobe_desc;
    } else if (item.dataset.gotoMaterial === 'vocabulary') {
      if (h3) h3.textContent = t.sub_vocabulary;
      if (p) p.textContent = t.ql_vocab_desc;
    } else if (item.dataset.gotoMaterial === 'grammar') {
      if (h3) h3.textContent = t.sub_grammar;
      if (p) p.textContent = t.ql_grammar_desc;
    } else if (item.dataset.gotoPractice === 'quiz' || item.dataset.gotoPractice === 'ai') {
      if (h3) h3.textContent = t.ql_quiz_title || 'Quiz';
      if (p) p.textContent = t.ql_quiz_desc;
    }
  });
}

export function setView(name) {
  navSetView(name, (currentView) => {
    state.currentView = currentView;
    if (currentView === 'dashboard') {
      renderReviewSection();
      renderHistory();
      renderBadges();
    }
  });
}

export function syncProfileHubUI() {
  const profile = state.profiles?.[state.activeProfile] || state.profiles?.[0] || { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' };
  [
    ['profileNameLabel', profile.name],
    ['profileAvatar', profile.initials],
    ['hubAvatar', profile.initials],
    ['hubNameLabel', profile.name],
    ['hubEmailLabel', profile.email]
  ].forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  });

  const badge = document.getElementById('hubLevelBadge');
  if (badge) {
    const prof = getProficiencyLevel();
    const isId = state.lang === 'id';
    let profTitle = 'Intermediate (B1-B2)';
    if (prof === 'beginner') profTitle = isId ? 'Pemula (A1-A2)' : 'Beginner (A1-A2)';
    else if (prof === 'advanced') profTitle = isId ? 'Mahir (C1-C2)' : 'Advanced (C1-C2)';
    else profTitle = isId ? 'Menengah (B1-B2)' : 'Intermediate (B1-B2)';

    badge.textContent = `${profTitle} · Level ${state.level}`;
    badge.title = isId ? 'Klik untuk mengubah tingkat di Pengaturan Personal' : 'Click to change level in Personalized Settings';
    badge.style.cursor = 'pointer';
  }

  const streak = document.getElementById('hubMetricStreak');
  if (streak) streak.textContent = `🔥 ${state.streak}`;

  const xp = document.getElementById('hubMetricXp');
  if (xp) xp.textContent = `⚡ ${state.xp}`;

  const hubLevel = document.getElementById('hubMetricLevel');
  if (hubLevel) hubLevel.textContent = `Lv ${state.level}`;

  const bar = document.getElementById('hubXpBar');
  if (bar) bar.style.width = `${state.xp % 100}%`;

  const progress = document.getElementById('hubXpProgressText');
  if (progress) progress.textContent = `${state.xp % 100} / 100 XP to Level ${state.level + 1}`;

  const reviewCountText = document.getElementById('hubReviewCountText');
  if (reviewCountText) {
    const unmastered = (state.reviewQuestions || []).filter(q => !q.mastered).length;
    reviewCountText.textContent = `${unmastered} question${unmastered === 1 ? '' : 's'}`;
  }

  // Sync personalized learning fields & chips
  const activeProfLevel = getProficiencyLevel();
  document.querySelectorAll('#persLevelChips .pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.persLevel === activeProfLevel);
  });
  const activeDailyXp = state.personalizedLearning?.dailyXpGoal || 100;
  document.querySelectorAll('#persGoalChips .pill').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.dailyXp) === Number(activeDailyXp));
  });

  if (state.personalizedLearning) {
    const goalSelect = document.getElementById('persGoalSelect');
    if (goalSelect && state.personalizedLearning.goal) {
      goalSelect.value = state.personalizedLearning.goal;
    }
    const notesInput = document.getElementById('persNotesInput');
    if (notesInput && state.personalizedLearning.customNotes !== undefined) {
      notesInput.value = state.personalizedLearning.customNotes;
    }
  }
}

export function syncLevelUI() {
  state.level = levelForXp(state.xp);
  const ring = 351.9 * (1 - ((state.xp % 100) / 100));
  document.getElementById('bigRingFg')?.style.setProperty('stroke-dashoffset', String(ring));
  document.getElementById('progRingFg')?.style.setProperty('stroke-dashoffset', String(ring));
  document.getElementById('miniRingFg')?.style.setProperty('stroke-dashoffset', String(65.9 * (1 - ((state.xp % 100) / 100))));

  ['bigRingLevel', 'progRingLevel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(state.level);
  });

  const mini = document.getElementById('miniLevelLabel');
  if (mini) mini.textContent = `Lv ${state.level}`;

  ['dashXpText', 'progXpText'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = `${state.xp % 100} / 100 XP (Total: ${state.xp})`;
  });

  ['dashStreak', 'progStreak', 'miniStreak'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(state.streak);
  });

  const word = document.getElementById('dashLevelWord');
  if (word) {
    const prof = getProficiencyLevel();
    if (state.lang === 'id') {
      word.textContent = prof === 'beginner' ? 'Pemula' : prof === 'advanced' ? 'Mahir' : 'Menengah';
    } else {
      word.textContent = prof === 'beginner' ? 'Beginner' : prof === 'advanced' ? 'Advanced' : 'Intermediate';
    }
  }

  syncProfileHubUI();
}

export function renderBadges() {
  const shelf = document.getElementById('badgeShelf');
  if (!shelf) return;
  const badges = [
    { name: 'First quiz', unlocked: (state.history || []).length >= 1 },
    { name: '10 XP', unlocked: state.xp >= 10 },
    { name: 'Streak 3', unlocked: state.streak >= 3 },
    { name: 'Mastery', unlocked: (state.reviewQuestions || []).some(q => q.mastered) }
  ];
  shelf.innerHTML = badges.map(b => `
    <div class="badge-item ${b.unlocked ? 'unlocked' : 'locked'}">
      <div class="b-ic">${b.unlocked ? '🏆' : '🔒'}</div>
      <div class="b-name">${b.name}</div>
    </div>
  `).join('');
}

export function renderHistory() {
  const rows = document.getElementById('historyRows');
  if (!rows) return;
  const historyList = state.history || [];
  rows.innerHTML = historyList.length
    ? historyList.slice(0, 8).map(item => `
        <div class="history-row">
          <span>${escapeHtml(item.label)}</span>
          <span class="h-score">${item.score}%</span>
        </div>
      `).join('')
    : '<div class="empty-state">No recent quiz attempts yet. Complete a quiz to build your history!</div>';
}

export function applyTheme(theme, persist = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  const light = state.theme === 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.body.setAttribute('data-theme', state.theme);
  const label = document.getElementById('themeStatusLabel');
  if (label) {
    if (state.lang === 'id') {
      label.textContent = light ? 'Mode Biru Muda Terang' : 'Mode Biru Navy';
    } else {
      label.textContent = light ? 'Crisp Light Blue Mode' : 'Dark Navy Mode';
    }
  }
  document.getElementById('themeToggleBtn')?.setAttribute('aria-checked', String(light));
  if (persist) saveState();
}

export function toggleTheme() {
  const next = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  const isId = state.lang === 'id';
  showToast(isId
    ? `Beralih ke ${next === 'light' ? 'Mode Biru Muda Terang' : 'Mode Biru Navy'}`
    : `Switched to ${next === 'light' ? 'Light Blue' : 'Dark Navy'} mode`
  );
}

export function applyLanguage(lang, persist = true, notify = false) {
  state.lang = lang === 'id' ? 'id' : 'en';
  translateUI(state.lang, state);
  closeAllLangDropdowns();
  applyTheme(state.theme, false);
  try {
    renderReviewSection();
    renderTenses();
    renderVocabulary();
  } catch (e) {}
  if (persist) saveState();
  if (notify) showToast(I18N[state.lang]?.switchMsg || 'Language updated');
}

export function initLanguageSwitcher() {
  document.querySelectorAll('.lang-opt[data-set-lang]').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage(opt.dataset.setLang, true, true);
    });
  });

  document.querySelectorAll('.lang-switcher-wrap').forEach(wrap => {
    const button = wrap.querySelector('.lang-btn');
    const dropdown = wrap.querySelector('.lang-dropdown');
    button?.addEventListener('click', e => {
      e.stopPropagation();
      const isHidden = dropdown?.classList.contains('hidden');
      closeAllLangDropdowns();
      if (isHidden) {
        dropdown?.classList.remove('hidden');
        wrap.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    closeAllLangDropdowns();
  });
}

export function bindChipSelectors() {
  // Topic chips (Quick quiz & AI)
  document.querySelectorAll('#quizTopicChips [data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedTopic = btn.dataset.topic;
      document.querySelectorAll('#quizTopicChips [data-topic]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });
  document.querySelectorAll('#aiTopicChips [data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedTopic = btn.dataset.topic;
      document.querySelectorAll('#aiTopicChips [data-topic]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });

  // Difficulty chips
  document.querySelectorAll('#quizDifficultyChips [data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedDifficulty = btn.dataset.diff;
      document.querySelectorAll('#quizDifficultyChips [data-diff]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });
  document.querySelectorAll('#aiDifficultyChips [data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedDifficulty = btn.dataset.diff;
      document.querySelectorAll('#aiDifficultyChips [data-diff]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });

  // Question count chips (Quiz)
  document.querySelectorAll('#quizCountChips [data-count], #aiCountChips [data-count]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCount = Number(btn.dataset.count);
      state.selectedAIQuestions = Number(btn.dataset.count);
      document.querySelectorAll('#quizCountChips [data-count], #aiCountChips [data-count]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });

  // Materials subtabs
  document.querySelectorAll('[data-msub]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedMaterial = btn.dataset.msub;
      document.querySelectorAll('[data-msub]').forEach(item => item.classList.toggle('active', item === btn));
      ['tenses', 'tobe', 'vocabulary', 'grammar'].forEach(key => {
        document.getElementById(`msub-${key}`)?.classList.toggle('hidden', key !== state.selectedMaterial);
      });
      if (state.selectedMaterial === 'vocabulary') {
        renderVocabulary();
      }
    });
  });

  // Practice subtabs (supports both data-psub and data-ptab)
  document.querySelectorAll('[data-psub], [data-ptab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.psub || btn.dataset.ptab;
      state.selectedPracticeTab = tab;
      document.querySelectorAll('[data-psub], [data-ptab]').forEach(item => item.classList.toggle('active', (item.dataset.psub || item.dataset.ptab) === tab));
      document.getElementById('psub-quiz')?.classList.toggle('hidden', tab !== 'quiz');
      document.getElementById('psub-ai')?.classList.toggle('hidden', tab !== 'ai');
      document.getElementById('ptab-quiz')?.classList.toggle('hidden', tab !== 'quiz');
      document.getElementById('ptab-ai')?.classList.toggle('hidden', tab !== 'ai');
    });
  });

  // Start Quick Quiz and Generate AI Test
  document.getElementById('startQuizBtn')?.addEventListener('click', startQuickQuiz);
  document.getElementById('generateAiBtn')?.addEventListener('click', runAiAdaptiveTest);

  // Review filters & actions
  document.querySelectorAll('[data-review-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.reviewFilter = btn.dataset.reviewFilter;
      document.querySelectorAll('[data-review-filter]').forEach(item => item.classList.toggle('active', item === btn));
      renderReviewSection();
    });
  });
  document.getElementById('startReviewQuizBtn')?.addEventListener('click', startReviewQuiz);
  document.getElementById('clearMasteredBtn')?.addEventListener('click', () => {
    state.reviewQuestions = (state.reviewQuestions || []).filter(q => !q.mastered);
    saveState();
    renderReviewSection();
    showToast('Cleared mastered questions');
  });

  // Quicklinks on Dashboard
  document.querySelectorAll('[data-goto-material]').forEach(card => {
    card.addEventListener('click', () => {
      const mat = card.dataset.gotoMaterial;
      setView('materials');
      const matBtn = document.querySelector(`[data-msub="${mat}"]`);
      if (matBtn) matBtn.click();
    });
  });
  document.querySelectorAll('[data-goto-practice]').forEach(card => {
    card.addEventListener('click', () => {
      const pTab = card.dataset.gotoPractice;
      setView('practice');
      const pBtn = document.querySelector(`[data-psub="${pTab}"], [data-ptab="${pTab}"]`);
      if (pBtn) pBtn.click();
    });
  });
  document.querySelectorAll('[data-goto-review]').forEach(card => {
    card.addEventListener('click', () => {
      setView('dashboard');
      document.getElementById('reviewSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Profile modal settings tabs
  document.querySelectorAll('.prof-subtab-btn[data-prof-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.profTab;
      document.querySelectorAll('.prof-subtab-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.getElementById('profPanelDataControl')?.classList.toggle('hidden', tab !== 'data-control');
      document.getElementById('profPanelPersonalized')?.classList.toggle('hidden', tab !== 'personalized');
      document.getElementById('profPanelHelp')?.classList.toggle('hidden', tab !== 'help-center');
    });
  });

  // Help center accordion
  document.querySelectorAll('.help-item .help-summary').forEach(summary => {
    summary.addEventListener('click', () => {
      const parent = summary.closest('.help-item');
      if (!parent) return;
      const isOpen = parent.classList.contains('open');
      parent.classList.toggle('open', !isOpen);
      const content = parent.querySelector('.help-content');
      if (content) content.style.display = isOpen ? 'none' : 'block';
    });
  });

  // Edit name in Profile Hub
  document.getElementById('hubEditNameBtn')?.addEventListener('click', () => {
    const form = document.getElementById('hubNameEditForm');
    const input = document.getElementById('hubNameEditInput');
    if (form && input) {
      form.classList.remove('hidden');
      const profile = state.profiles?.[state.activeProfile] || { name: 'Learner' };
      input.value = profile.name;
      input.focus();
    }
  });
  document.getElementById('hubCancelNameBtn')?.addEventListener('click', () => {
    document.getElementById('hubNameEditForm')?.classList.add('hidden');
  });
  document.getElementById('hubSaveNameBtn')?.addEventListener('click', () => {
    const input = document.getElementById('hubNameEditInput');
    const newName = (input?.value || '').trim();
    if (!newName) return;
    if (!state.profiles) state.profiles = [];
    if (!state.profiles[state.activeProfile]) {
      state.profiles[state.activeProfile] = { name: newName, initials: newName.charAt(0).toUpperCase(), email: 'learner@engsphere.app' };
    } else {
      state.profiles[state.activeProfile].name = newName;
      state.profiles[state.activeProfile].initials = newName.charAt(0).toUpperCase();
    }
    saveState();
    syncProfileHubUI();
    document.getElementById('hubNameEditForm')?.classList.add('hidden');
    showToast(`Display name updated to "${newName}"`);
  });

  // Settings Actions: Clear Review Mistakes, History, and Full Reset
  document.getElementById('clearReviewQueueBtn')?.addEventListener('click', () => {
    state.reviewQuestions = [];
    saveState();
    renderReviewSection();
    syncProfileHubUI();
    showToast('Review mistake queue cleared');
  });
  document.getElementById('clearQuizHistoryBtn')?.addEventListener('click', () => {
    state.history = [];
    saveState();
    renderHistory();
    renderBadges();
    showToast('Quiz history cleared');
  });
  const handleResetAll = () => {
    state.xp = 0;
    state.level = 1;
    state.streak = 0;
    state.history = [];
    state.reviewQuestions = [];
    saveState();
    syncLevelUI();
    renderBadges();
    renderHistory();
    renderReviewSection();
    showToast('All learning data has been reset');
  };
  document.getElementById('hubResetAllBtn')?.addEventListener('click', handleResetAll);
  document.getElementById('resetProgressBtn')?.addEventListener('click', handleResetAll);

  // Personalized Learning Save
  document.getElementById('savePersonalizedBtn')?.addEventListener('click', () => {
    const goalSelect = document.getElementById('persGoalSelect');
    const notesInput = document.getElementById('persNotesInput');
    const activeLevelBtn = document.querySelector('#persLevelChips .pill.active');
    const activeGoalBtn = document.querySelector('#persGoalChips .pill.active');

    const newLevel = activeLevelBtn?.dataset.persLevel || 'intermediate';
    const newGoal = goalSelect?.value || 'conversation';
    const newDailyXp = Number(activeGoalBtn?.dataset.dailyXp || 100);
    const newNotes = notesInput?.value || '';

    state.personalizedLearning = {
      goal: newGoal,
      level: newLevel,
      dailyXpGoal: newDailyXp,
      customNotes: newNotes
    };
    state.selectedDifficulty = newLevel;

    // Update active user in state.users
    const activeProf = state.profiles?.[state.activeProfile] || state.profiles?.[0];
    const user = (state.users || []).find(u =>
      (activeProf?.email && u.email && u.email.toLowerCase() === activeProf.email.toLowerCase()) ||
      (activeProf?.name && u.name && u.name.toLowerCase() === activeProf.name.toLowerCase())
    );
    if (user) {
      user.level = newLevel;
      user.goal = newGoal;
    }
    if (activeProf) {
      activeProf.level = newLevel;
    }

    saveState();
    syncLevelUI();
    syncProfileHubUI();
    document.querySelectorAll('#quizDifficultyChips [data-diff]').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.diff === newLevel);
    });
    document.querySelectorAll('#aiDifficultyChips [data-diff]').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.diff === newLevel);
    });
    // Close profile modal and suppress notification bubble with glitter emoji per user request
    closeAllModals();
  });

  document.getElementById('hubLevelBadge')?.addEventListener('click', () => {
    document.querySelector('.prof-subtab-btn[data-prof-tab="personalized"]')?.click();
  });

  // Auth chip selectors
  document.querySelectorAll('#authLevelChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#authLevelChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('#authGoalChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#authGoalChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('#persLevelChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#persLevelChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('#persGoalChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#persGoalChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // Password visibility toggles
  document.getElementById('toggleSignUpPwBtn')?.addEventListener('click', () => {
    const input = document.getElementById('authSignUpPassword');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });
  document.getElementById('toggleLoginPwBtn')?.addEventListener('click', () => {
    const input = document.getElementById('authLoginPassword');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });
}

export function initNavigation() {
  document.querySelectorAll('.topnav button[data-view], [data-goto]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view || btn.dataset.goto));
  });

  document.getElementById('appHomeBtn')?.addEventListener('click', () => setView('dashboard'));
  document.getElementById('dashStartQuizBtn')?.addEventListener('click', () => setView('practice'));
  document.getElementById('dashBrowseMatBtn')?.addEventListener('click', () => setView('materials'));

  document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn2')?.addEventListener('click', closeAllModals);

  document.getElementById('authModalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAllModals();
  });
  document.getElementById('profileModalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAllModals();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });

  document.getElementById('landingLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('landingSignUpBtn')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('getStartedBtn')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('getStartedBtn2')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('landingHeroLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('landingBottomLoginBtn')?.addEventListener('click', () => openAuthModal('login'));

  document.getElementById('authQuickGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('authLoginGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('profilePillBtn')?.addEventListener('click', openProfileModal);
  document.getElementById('hubSignOutBtn')?.addEventListener('click', () => {
    closeAllModals();
    signOutUser();
  });
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  document.getElementById('authTabSignUp')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('authTabLogin')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToSignUpBtn')?.addEventListener('click', () => openAuthModal('sign-up'));

  document.getElementById('authSignUpForm')?.addEventListener('submit', e => {
    e.preventDefault();
    signUpUser(
      document.getElementById('authSignUpName')?.value,
      document.getElementById('authSignUpEmail')?.value,
      document.getElementById('authSignUpPassword')?.value,
      document.querySelector('#authLevelChips .pill.active')?.dataset.level || 'intermediate',
      document.querySelector('#authGoalChips .pill.active')?.dataset.goal || 'conversation'
    );
  });

  document.getElementById('authLoginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    loginUser(
      document.getElementById('authLoginIdentifier')?.value,
      document.getElementById('authLoginPassword')?.value
    );
  });

  document.getElementById('exportDataBtn')?.addEventListener('click', exportUserData);
  document.getElementById('importBackupInput')?.addEventListener('change', e => importUserData(e.target.files?.[0]));
}

export function init() {
  window.setView = setView;
  window.loginUser = loginUser;
  window.openAuthModal = openAuthModal;
  window.syncLevelUI = syncLevelUI;
  window.syncProfileHubUI = syncProfileHubUI;
  window.renderBadges = renderBadges;
  window.renderHistory = renderHistory;
  window.applyLanguage = applyLanguage;
  window.translateUI = translateUI;

  loadState();
  applyTheme(state.theme, false);
  applyLanguage(state.lang, false);
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

  const isLogged = Boolean(state.isLoggedIn);
  if (isLogged) {
    setView(state.currentView || 'dashboard');
  } else {
    setView('landing');
  }
  saveState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
