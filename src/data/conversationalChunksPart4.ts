import type { VocabCard } from './vocabData';

/**
 * Curated A1–A2 Conversational Chunks & Social Reactions (Part 4: 097–128)
 * - Mini-Deck 2 expansion finish (chat-chunk-097 .. chat-chunk-112): Reaktionen, Zustimmung & Neckerei
 * - Mini-Deck 3 expansion start (chat-chunk-113 .. chat-chunk-128): Unterwegs, Pläne & Reisen
 */
export const CONVERSATIONAL_CHUNKS_PART_4: VocabCard[] = [
  // =========================================================================
  // MINI-DECK 2 EXPANSION FINISH: REAKTIONEN, ZUSTIMMUNG & NECKEREI (097–112)
  // =========================================================================
  {
    id: 'chat-chunk-097',
    lemma: 'Das hätte ich mir denken können!',
    spokenText: 'Das hätte ich mir denken können!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Nicht überrascht sein',
    translation: 'I could’ve guessed that! · Figures!',
    highlightTarget: 'hätte ich mir denken können',
    phraseDetails: {
      framePattern: '(Das) hätte ich mir (ja) denken können!',
      casePattern: 'Feste Alltagsformel „sich (Dativ: mir) etwas denken können“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das hatte ich mir beinahe schon gedacht.',
        textEn: 'I had almost figured as much.',
        contextNote: 'Höflich / Neutral',
      },
      informalVariant: {
        textDe: 'Aha, Fußball spielst du auch noch – hätte ich mir ja denken können!',
        textEn: 'Aha, you play soccer too—I could’ve guessed that!',
        contextNote: 'Sehr verbreitete, leicht neckende Reaktion',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Früher habe ich jahrelang im Verein Fußball gespielt.',
        promptEn: 'I used to play club soccer for years.',
        speakerB: 'Lena',
        replyDe: 'Haha, das hätte ich mir denken können!',
        replyEn: 'Haha, I could’ve guessed that!',
      },
    },
    exampleDe:
      'Felix: Ich habe früher auch Fußball gespielt.\nLena: Aha, das hätte ich mir denken können!',
    exampleEn:
      'Felix: I used to play soccer too.\nLena: Aha, I could’ve guessed that!',
    anatomy: {
      caseGovernanceNote:
        'Treat this as one fixed rhythm chunk („Das hätte ich mir denken können“). Notice reflexive Dative „mir“ („think to myself“).',
      synonyms: ['War ja klar!', 'Habe ich mir schon gedacht!'],
      antonyms: ['Damit hätte ich nie gerechnet!'],
      collocations: [
        'Hätte ich mir ja denken können!',
        'Das habe ich mir fast gedacht.',
      ],
      wordFamily: ['denken (to think)', 'sich etwas denken (to figure / guess)'],
      b1ExamTip:
        'Learn this as a single unbreakable chunk—you’ll hear it constantly in casual German storytelling.',
    },
  },
  {
    id: 'chat-chunk-098',
    lemma: 'Wieso, sieht man das?',
    spokenText: 'Wieso, sieht man das?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Nachfrage · Neugierig zurückfragen',
    translation: 'Why, can you tell? · Does it show?',
    highlightTarget: 'Wieso, sieht man das',
    phraseDetails: {
      framePattern: 'Wieso, sieht man / merkt man das?',
      casePattern: 'Fragewort „wieso“ (= warum) + unpersönliches „man“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Woran erkennen Sie das denn?',
        textEn: 'How can you tell?',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Wieso, sieht man das? Ich spiele schon seit Jahren gar nicht mehr!',
        textEn: 'Why, can you tell? I haven’t even played in years!',
        contextNote: 'Spontane, amüsierte Rückfrage',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Dass du gern Sport machst, hätte ich mir ja denken können!',
        promptEn: 'I could’ve guessed that you like doing sports!',
        speakerB: 'Felix',
        replyDe: 'Wieso, sieht man das etwa so deutlich?',
        replyEn: 'Why, is it really that obvious?',
      },
    },
    exampleDe:
      'Lena: Du wirkst total wie jemand, der früher Fußball gespielt hat.\nFelix: Wieso, sieht man das?',
    exampleEn:
      'Lena: You totally give off the impression of someone who used to play soccer.\nFelix: Why, can you tell?',
    anatomy: {
      caseGovernanceNote:
        '„Wieso?“ is a super natural everyday synonym of „Warum?“. Using „man“ („sieht man das?“ / „merkt man das?“) means „can people / can you tell?“.',
      synonyms: ['Woran merkst du das?', 'Ist das so offensichtlich?'],
      antonyms: ['Das sieht man gar nicht.'],
      collocations: [
        'Merkt man mir an, dass ich müde bin?',
        'Wieso fragst du?',
      ],
      wordFamily: ['wieso (why)', 'sehen (to see)', 'man (one / you)'],
      b1ExamTip:
        'Also handy when you’re tired or nervous: „Sieht man mir das an?“ (Can you tell by looking at me?).',
    },
  },
  {
    id: 'chat-chunk-099',
    lemma: 'Das ist eine gute Frage!',
    spokenText: 'Das ist eine gute Frage!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Bedenkzeit gewinnen',
    translation: 'That’s a good question!',
    highlightTarget: 'Das ist eine gute Frage',
    phraseDetails: {
      framePattern: '(Tja / Hmm,) das ist eine gute Frage!',
      casePattern: 'Nominativ Feminin (die Frage → eine gute Frage)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist wirklich eine sehr gute Frage, lassen Sie mich kurz überlegen.',
        textEn: 'That really is a very good question, let me think for a moment.',
        contextNote: 'Formell / Beruf & Diskussion',
      },
      informalVariant: {
        textDe: 'Tja, das ist eine gute Frage – so richtig geplant haben wir noch gar nichts!',
        textEn: 'Well, that’s a good question—we haven’t really planned anything yet!',
        contextNote: 'Die perfekte Brücke, wenn man kurz überlegen muss',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Was genau wollt ihr euch in Amsterdam alles anschauen?',
        promptEn: 'What exactly do you want to see in Amsterdam?',
        speakerB: 'Felix',
        replyDe: 'Tja, das ist eine gute Frage! Wir schauen einfach vor Ort.',
        replyEn: 'Well, that’s a good question! We’ll just see once we’re there.',
      },
    },
    exampleDe:
      'Lena: Wo wollt ihr heute Abend eigentlich essen gehen?\nFelix: Tja, das ist eine gute Frage – hast du eine Idee?',
    exampleEn:
      'Lena: Where do you actually want to go for dinner tonight?\nFelix: Well, that’s a good question—do you have an idea?',
    anatomy: {
      caseGovernanceNote:
        'Starting with „Tja“ (a wry, thoughtful „well…“) + „Das ist eine gute Frage“ gives you two effortless seconds to gather your German words!',
      synonyms: ['Gute Frage!', 'Da fragst du mich was!'],
      antonyms: ['Das kann ich dir sofort sagen!'],
      collocations: [
        'Gute Frage, nächste Frage!',
        'Da muss ich kurz überlegen.',
      ],
      wordFamily: ['die Frage, -n (question)', 'fragen (to ask)', 'tja (well…)'],
      b1ExamTip:
        'Your #1 thinking-time buffer in any real German conversation—never freeze in silence when you can say „Hmm, gute Frage!“.',
    },
  },
  {
    id: 'chat-chunk-100',
    lemma: 'Das hast du dir gut gemerkt!',
    spokenText: 'Das hast du dir gut gemerkt!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Kompliment fürs Zuhören',
    translation: 'You remembered that well! · Good memory!',
    highlightTarget: 'hast du dir gut gemerkt',
    phraseDetails: {
      framePattern: 'Das hast du dir (echt) gut gemerkt!',
      casePattern: 'sich (Dativ: dir) etwas merken = etwas im Gedächtnis behalten',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie aufmerksam, dass Sie sich das gemerkt haben!',
        textEn: 'How attentive of you to have remembered that!',
        contextNote: 'Höflich / Wertschätzend',
      },
      informalVariant: {
        textDe: 'Ich lese das Wort Essen und muss grinsen – das hast du dir gut gemerkt!',
        textEn: 'I see the word food and immediately grin—you remembered that well!',
        contextNote: 'Warmherzige Anerkennung unter Freunden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich habe extra Hafermilch für deinen Kaffee besorgt!',
        promptEn: 'I specially got oat milk for your coffee!',
        speakerB: 'Lena',
        replyDe: 'Oh wie lieb, das hast du dir gut gemerkt!',
        replyEn: 'Oh how sweet, you remembered that well!',
      },
    },
    exampleDe:
      'Felix: Keine Sorge, wir testen im Urlaub auch viel lokales Essen!\nLena: Haha, das hast du dir gut gemerkt!',
    exampleEn:
      'Felix: Don’t worry, we’re also testing lots of local food on vacation!\nLena: Haha, you remembered that well!',
    anatomy: {
      caseGovernanceNote:
        'Watch the difference: „merken“ (without reflexive) = „to notice“ („Ich merke schon!“), whereas „sich (Dat.) etwas merken“ = „to memorize / remember a fact“ („Ich merke mir das!“).',
      synonyms: ['Du hast ja ein super Gedächtnis!', 'Wie aufmerksam!'],
      antonyms: ['Das habe ich komplett vergessen.'],
      collocations: [
        'Merke ich mir!',
        'Ich kann mir Namen so schlecht merken.',
      ],
      wordFamily: ['sich merken (to remember / keep in mind)', 'merken (to notice)', 'das Gedächtnis (memory)'],
      b1ExamTip:
        '„Merke ich mir!“ (I’ll keep that in mind / Noted!) is a crisp 3-word companion phrase for everyday chats.',
    },
  },
  {
    id: 'chat-chunk-101',
    lemma: 'Das freut mich!',
    spokenText: 'Das freut mich!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Mitfreude zeigen',
    translation: 'I’m glad to hear that! · That makes me happy!',
    highlightTarget: 'Das freut mich',
    phraseDetails: {
      framePattern: 'Das freut mich (sehr / total / zu hören)!',
      casePattern: 'freuen + Akkusativ (mich / uns)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das freut mich sehr zu hören!',
        textEn: 'I am very glad to hear that!',
        contextNote: 'Höflich / Universell einsetzbar',
      },
      informalVariant: {
        textDe: 'Deine Prüfung lief gut? Oh, das freut mich richtig!',
        textEn: 'Your exam went well? Oh, I’m really happy to hear that!',
        contextNote: 'Warm und ehrlich unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich habe endlich eine tolle neue Wohnung gefunden!',
        promptEn: 'I finally found a great new apartment!',
        speakerB: 'Felix',
        replyDe: 'Oh, das freut mich! Herzlichen Glückwunsch!',
        replyEn: 'Oh, I’m so glad to hear that! Congratulations!',
      },
    },
    exampleDe:
      'Lena: Ich bin gestern Abend richtig schnell eingeschlafen.\nFelix: Das freut mich, dann bist du heute ausgeruht!',
    exampleEn:
      'Lena: I fell asleep really quickly last night.\nFelix: I’m glad to hear that, you’ll be well-rested today!',
    anatomy: {
      caseGovernanceNote:
        'Literally „That pleases me“. „Das“ is the subject and „mich“ is Accusative. Compare „Ich freue mich auf + Akk.“ (I’m looking forward to…).',
      synonyms: ['Wie schön!', 'Super, freut mich für dich!'],
      antonyms: ['Das tut mir leid.'],
      collocations: [
        'Freut mich sehr!',
        'Ich freue mich schon auf dich!',
      ],
      wordFamily: ['freuen (to please)', 'sich freuen (to be glad)', 'die Freude (joy)'],
      b1ExamTip:
        'When someone shares ANY good news, „Oh, das freut mich!“ is always the right warm reflex.',
    },
  },
  {
    id: 'chat-chunk-102',
    lemma: 'Na ja, irgendwie schon.',
    spokenText: 'Na ja, irgendwie schon.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Zustimmung · Vorsichtig bejahen',
    translation: 'Well, kind of, yeah. · I guess so, in a way.',
    highlightTarget: 'Na ja, irgendwie schon',
    phraseDetails: {
      framePattern: 'Na ja, irgendwie schon / eigentlich schon.',
      casePattern: 'Gesprächspartikel „Na ja“ + „irgendwie“ + bestätigendes „schon“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'In gewisser Weise trifft das durchaus zu.',
        textEn: 'In a certain way that is certainly true.',
        contextNote: 'Formell / Abwägend',
      },
      informalVariant: {
        textDe: 'War das nicht ein bisschen verrückt? – Na ja, irgendwie schon!',
        textEn: 'Wasn’t that a bit crazy?—Well, kind of, yeah!',
        contextNote: 'Super idiomatische, abgemilderte Zustimmung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Eigentlich magst du Sport ja doch lieber als ich, oder?',
        promptEn: 'You actually do like sports more than I do, right?',
        speakerB: 'Felix',
        replyDe: 'Na ja, irgendwie schon – aber ich brauche auch mal Pause!',
        replyEn: 'Well, kind of, yeah—but I need a break sometimes too!',
      },
    },
    exampleDe:
      'Lena: Hast du dir am Ende doch alles für die letzte Woche aufgehoben?\nFelix: Na ja, irgendwie schon!',
    exampleEn:
      'Lena: Did you end up leaving everything for the last week after all?\nFelix: Well, kind of, yeah!',
    anatomy: {
      caseGovernanceNote:
        '„Irgendwie“ (somehow / kind of) + stressed „schon“ (yes, in a way / actually yes) lets you agree softly without being 100% black-and-white.',
      synonyms: ['Eigentlich schon.', 'Ja, schon ein bisschen.'],
      antonyms: ['Nein, überhaupt nicht!'],
      collocations: [
        'Ja, irgendwie schon.',
        'Irgendwie hat es mir Spaß gemacht.',
      ],
      wordFamily: ['irgendwie (somehow / kind of)', 'schon (actually yes)', 'na ja (well)'],
      b1ExamTip:
        'In casual conversations, „schon“ after „ja“ or „irgendwie“ means „yeah, I suppose so“—super helpful for nuanced answers!',
    },
  },
  {
    id: 'chat-chunk-103',
    lemma: 'Ich merke schon!',
    spokenText: 'Ich merke schon!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Etwas bemerken',
    translation: 'I can tell! · Yeah, I noticed!',
    highlightTarget: 'Ich merke schon',
    phraseDetails: {
      framePattern: 'Ich merke schon (, dass …)!',
      casePattern: 'merken (= bemerken / spüren) + Partikel „schon“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich sehe schon, das Thema liegt Ihnen am Herzen.',
        textEn: 'I can tell this topic is close to your heart.',
        contextNote: 'Höflich / Gespräch',
      },
      informalVariant: {
        textDe: 'Du bist zu langsam beim Schreiben? Haha, ich merke schon!',
        textEn: 'You’re too slow at typing? Haha, I can tell!',
        contextNote: 'Amüsierter kleiner Seitenhieb',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Tut mir leid, ich komme heute beim Tippen gar nicht hinterher!',
        promptEn: 'Sorry, I really can’t keep up with typing today!',
        speakerB: 'Lena',
        replyDe: 'Haha, ich merke schon! Lass dir ruhig Zeit.',
        replyEn: 'Haha, I can tell! Take your time.',
      },
    },
    exampleDe:
      'Felix: Ich bin heute leider etwas langsam beim Antworten.\nLena: Haha, ich merke schon!',
    exampleEn:
      'Felix: Sadly I’m a bit slow at replying today.\nLena: Haha, I can tell!',
    anatomy: {
      caseGovernanceNote:
        'Here „merken“ has no reflexive pronoun and means „to notice / to tell“. Pairing it with „schon“ conveys a knowing, playful smile („Yeah, I’ve noticed!“).',
      synonyms: ['Das sehe ich schon!', 'Ist mir schon aufgefallen!'],
      antonyms: ['Das habe ich gar nicht gemerkt.'],
      collocations: [
        'Ich merke schon, du hast heute gute Laune!',
        'Merkt man das so sehr?',
      ],
      wordFamily: ['merken (to notice)', 'bemerken (to notice)', 'aufmerken (to pay attention)'],
      b1ExamTip:
        'Great playful reaction whenever a friend confesses something you already spotted five minutes ago.',
    },
  },
  {
    id: 'chat-chunk-104',
    lemma: 'Das hast du jetzt nicht wirklich gesagt!',
    spokenText: 'Das hast du jetzt nicht wirklich gesagt!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Ungläubiges Lachen',
    translation: 'You didn’t actually just say that!',
    highlightTarget: 'hast du jetzt nicht wirklich gesagt',
    phraseDetails: {
      framePattern: 'Das hast du jetzt nicht wirklich gesagt / gemacht!',
      casePattern: 'Objekt „Das“ auf Position 1 + Perfekt + Partikel „jetzt nicht wirklich“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das meinen Sie jetzt aber nicht im Ernst, oder?',
        textEn: 'You cannot be serious about that, right?',
        contextNote: 'Formell / Überrascht',
      },
      informalVariant: {
        textDe: 'Haha, nein! Das hast du jetzt nicht wirklich gesagt!',
        textEn: 'Haha, no way! You didn’t actually just say that!',
        contextNote: 'Klassische Lach-Reaktion bei witzigen Sprüchen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Mit dreiundzwanzig fühle ich mich heute schon wie ein Rentner!',
        promptEn: 'At twenty-three I already feel like a retiree today!',
        speakerB: 'Lena',
        replyDe: 'Haha, das hast du jetzt nicht wirklich gesagt!',
        replyEn: 'Haha, you didn’t actually just say that!',
      },
    },
    exampleDe:
      'Felix: Ich glaube, ich werde langsam alt für so lange Zugfahrten.\nLena: Haha, das hast du jetzt nicht wirklich gesagt!',
    exampleEn:
      'Felix: I think I’m slowly getting too old for train rides this long.\nLena: Haha, you didn’t actually just say that!',
    anatomy: {
      caseGovernanceNote:
        '„Jetzt“ here isn’t strictly about clock time—it adds vivid „wait, right here in front of me?!“ surprise to the teasing reaction.',
      synonyms: ['Das meinst du jetzt nicht ernst!', 'Nicht dein Ernst!'],
      antonyms: ['Doch, genau das habe ich gesagt!'],
      collocations: [
        'Das hast du jetzt nicht wirklich gemacht!',
        'Nicht dein Ernst, oder?',
      ],
      wordFamily: ['wirklich (really / actually)', 'sagen (to say)', 'ernst meinen (to mean seriously)'],
      b1ExamTip:
        'Also memorize the punchy 3-word cousin: „Nicht dein Ernst!“ (No way / You’re kidding me!).',
    },
  },
  {
    id: 'chat-chunk-105',
    lemma: 'Und wie!',
    spokenText: 'Und wie!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Starke Bestätigung',
    translation: 'And how! · You bet! · Oh, big time!',
    highlightTarget: 'Und wie',
    phraseDetails: {
      framePattern: 'Und wie! (als begeisterte Bestätigung auf eine Frage)',
      casePattern: 'Kurzer Ausruf der starken Zustimmung',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ja, in der Tat, ganz genau so ist es!',
        textEn: 'Yes, indeed, that is exactly how it is!',
        contextNote: 'Formell / Bestätigend',
      },
      informalVariant: {
        textDe: 'Brauchst du wirklich neun Stunden Schlaf? – Und wie!',
        textEn: 'Do you really need nine hours of sleep?—You bet!',
        contextNote: 'Kurz, temperamentvoll und 100 % idiomatisch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hat dir der Urlaub am Meer gutgetan?',
        promptEn: 'Did the vacation by the sea do you good?',
        speakerB: 'Lena',
        replyDe: 'Und wie! Ich fühle mich wie ein neuer Mensch.',
        replyEn: 'Oh, big time! I feel like a brand-new person.',
      },
    },
    exampleDe:
      'Felix: War das Essen in der Markthalle wirklich so lecker?\nLena: Und wie! Da müssen wir nächstes Mal zusammen hin.',
    exampleEn:
      'Felix: Was the food at the market hall really that good?\nLena: You bet! We have to go there together next time.',
    anatomy: {
      caseGovernanceNote:
        'Literally „And how!“. Two tiny words that carry way more warmth and punch than a plain „Ja“.',
      synonyms: ['Auf jeden Fall!', 'Aber hallo!', 'Total!'],
      antonyms: ['Überhaupt nicht!'],
      collocations: [
        'Und wie das Spaß gemacht hat!',
        'Freust du dich schon? – Und wie!',
      ],
      wordFamily: ['wie (how)', 'und (and)'],
      b1ExamTip:
        'Instant fluency upgrade: next time someone asks „War es gut?“ or „Bist du müde?“, fire back „Und wie!“.',
    },
  },
  {
    id: 'chat-chunk-106',
    lemma: 'Warum so überrascht?',
    spokenText: 'Warum so überrascht?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Neckerei · Auf Staunen reagieren',
    translation: 'Why so surprised?',
    highlightTarget: 'Warum so überrascht',
    phraseDetails: {
      framePattern: 'Warum (bist du) so überrascht / skeptisch / müde?',
      casePattern: 'Verkürzte Frage mit Partizip-Adjektiv „überrascht“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Darf ich fragen, warum Sie so überrascht sind?',
        textEn: 'May I ask why you are so surprised?',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Haha, warum so überrascht? Ich kenne durchaus auch moderne Ausdrücke!',
        textEn: 'Haha, why so surprised? I definitely know modern expressions too!',
        contextNote: 'Schlagfertige, charmante Gegenfrage',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Was, du hast gestern selbst Brot gebacken?!',
        promptEn: 'What, you baked bread from scratch yesterday?!',
        speakerB: 'Felix',
        replyDe: 'Haha, warum so überrascht? Ich kann auch kochen!',
        replyEn: 'Haha, why so surprised? I can cook too!',
      },
    },
    exampleDe:
      'Lena: Oh, das hätte ich von dir gar nicht erwartet!\nFelix: Haha, warum so überrascht?',
    exampleEn:
      'Lena: Oh, I wouldn’t have expected that from you at all!\nFelix: Haha, why so surprised?',
    anatomy: {
      caseGovernanceNote:
        'Dropping „bist du“ makes „Warum so + Adjektiv?“ crisp and lively: „Warum so still?“, „Warum so spät?“, „Warum so überrascht?“.',
      synonyms: ['Wieso schaust du so erstaunt?', 'Hättest du das nicht gedacht?'],
      antonyms: ['Das überrascht mich gar nicht.'],
      collocations: [
        'Warum so still heute?',
        'Ich bin positiv überrascht!',
      ],
      wordFamily: ['überraschen (to surprise)', 'überrascht (surprised)', 'die Überraschung (surprise)'],
      b1ExamTip:
        'Great dinner-table comeback whenever friends act amazed by a hobby or skill of yours.',
    },
  },
  {
    id: 'chat-chunk-107',
    lemma: 'Absolut nicht!',
    spokenText: 'Absolut nicht!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Klar verneinen',
    translation: 'Not at all! · Definitely not!',
    highlightTarget: 'Absolut nicht',
    phraseDetails: {
      framePattern: 'Absolut nicht! / Überhaupt nicht!',
      casePattern: 'Verstärkte Verneinung mit „absolut“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Nein, ganz und gar nicht.',
        textEn: 'No, not at all.',
        contextNote: 'Formell / Klar',
      },
      informalVariant: {
        textDe: 'Perfekt vorbereitet? Haha, absolut nicht – eher spontan eingepackt!',
        textEn: 'Perfectly prepared? Haha, not at all—more like thrown in last minute!',
        contextNote: 'Knackige, ehrliche Verneinung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Du bist beim Reisen immer perfekt vorbereitet, oder?',
        promptEn: 'You’re always perfectly prepared when traveling, right?',
        speakerB: 'Felix',
        replyDe: 'Absolut nicht! Ich packe meistens fünf Minuten vor Abfahrt.',
        replyEn: 'Not at all! I usually pack five minutes before departure.',
      },
    },
    exampleDe:
      'Lena: War der Film gestern wirklich so gruselig?\nFelix: Absolut nicht, wir haben die ganze Zeit gelacht!',
    exampleEn:
      'Lena: Was the movie yesterday really that scary?\nFelix: Not at all, we laughed the whole time!',
    anatomy: {
      caseGovernanceNote:
        'A crisp, emphatic „no“. Works both to deny an assumption playfully AND to reassure someone („Stört es dich?“ – „Absolut nicht!“).',
      synonyms: ['Überhaupt nicht!', 'Auf keinen Fall!', 'Gar nicht!'],
      antonyms: ['Absolut!', 'Auf jeden Fall!'],
      collocations: [
        'Das stimmt absolut nicht.',
        'Macht mir absolut nichts aus!',
      ],
      wordFamily: ['absolut (absolutely)', 'nicht (not)'],
      b1ExamTip:
        'Works solo as a positive too: „Absolut!“ (= Totally! / Absolutely!).',
    },
  },
  {
    id: 'chat-chunk-108',
    lemma: 'Was soll das denn heißen?',
    spokenText: 'Was soll das denn heißen?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Spielerisch protestieren',
    translation: 'What’s that supposed to mean?',
    highlightTarget: 'Was soll das denn heißen',
    phraseDetails: {
      framePattern: 'Hey, was soll das denn heißen?',
      casePattern: 'Modalverb „sollen“ + Fragepartikel „denn“ + „heißen“ (= bedeuten)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie genau meinen Sie diese Bemerkung?',
        textEn: 'What exactly do you mean by that remark?',
        contextNote: 'Formell / Rückfrage',
      },
      informalVariant: {
        textDe: '„Wenn du so früh schlafen gehst“ – hey, was soll das denn heißen?',
        textEn: '“Since you go to bed so early”—hey, what’s that supposed to mean?',
        contextNote: 'Mit Lächeln eine der lustigsten Neck-Reaktionen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wenn du immer schon um zehn im Bett liegst, brauchst du natürlich viel Schlaf!',
        promptEn: 'When you’re always in bed by ten, of course you get lots of sleep!',
        speakerB: 'Felix',
        replyDe: 'Haha, was soll das denn heißen? Guter Schlaf ist wichtig!',
        replyEn: 'Haha, what’s that supposed to mean? Good sleep is important!',
      },
    },
    exampleDe:
      'Lena: Typisch, dass du dir den ganzen Urlaub nicht durchgeplant hast!\nFelix: Hey, was soll das denn heißen?',
    exampleEn:
      'Lena: Typical that you didn’t plan out the whole vacation!\nFelix: Hey, what’s that supposed to mean?',
    anatomy: {
      caseGovernanceNote:
        '„Was soll … heißen?“ = „What is … supposed to mean?“. Watch your tone: with a grin or laugh it’s classic playful banter; with a sharp tone it’s serious pushback.',
      synonyms: ['Wie meinst du das denn?', 'Was willst du damit sagen?'],
      antonyms: ['War doch nur Spaß!'],
      collocations: [
        'Was soll das heißen?',
        'Was soll das denn bedeuten?',
      ],
      wordFamily: ['sollen (supposed to)', 'heißen (to mean)', 'denn (question particle)'],
      b1ExamTip:
        'Essential phrase for teasing back at the dinner table—shows you caught the joke and can play along!',
    },
  },
  {
    id: 'chat-chunk-109',
    lemma: 'Wichtig und richtig!',
    spokenText: 'Wichtig und richtig!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Zustimmung · Reimende Bestätigung',
    translation: 'Important and right! · Totally valid and spot on!',
    highlightTarget: 'Wichtig und richtig',
    phraseDetails: {
      framePattern: 'Wichtig und richtig! (kurze, sympathische Zustimmung)',
      casePattern: 'Reimende Paarformel aus zwei Adjektiven',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist ein sehr wichtiger und richtiger Punkt.',
        textEn: 'That is a very important and valid point.',
        contextNote: 'Formell / Diskussion',
      },
      informalVariant: {
        textDe: 'Genug Schlaf und gutes Essen sind das A und O. – Wichtig und richtig!',
        textEn: 'Enough sleep and good food are essential.—Important and right!',
        contextNote: 'Extrem beliebte moderne Alltagsreaktion im Deutschen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Guter Schlaf und ordentliche Mahlzeiten sind mir einfach wichtig.',
        promptEn: 'Good sleep and proper meals are just really important to me.',
        speakerB: 'Lena',
        replyDe: 'Wichtig und richtig! Da stimme ich dir voll zu.',
        replyEn: 'Spot on and so important! I completely agree with you.',
      },
    },
    exampleDe:
      'Felix: Im Urlaub schalte ich das Handy auch mal für einen Tag aus.\nLena: Wichtig und richtig!',
    exampleEn:
      'Felix: On vacation I even turn my phone off for a day sometimes.\nLena: Spot on and so important!',
    anatomy: {
      caseGovernanceNote:
        'A catchy rhyming phrase („wichtig“ / „richtig“) widely used by young German speakers to enthusiastically endorse a healthy habit, smart decision, or good boundary.',
      synonyms: ['Vollkommen richtig!', 'Ganz genau!', 'Sehr vernünftig!'],
      antonyms: ['Das sehe ich ganz anders.'],
      collocations: [
        'Kurz und knapp!',
        'Klein, aber fein!',
      ],
      wordFamily: ['wichtig (important)', 'richtig (right / correct)'],
      b1ExamTip:
        'German speakers adore short rhyming pairs—drop „Wichtig und richtig!“ when a friend makes a sensible life choice and watch them smile.',
    },
  },
  {
    id: 'chat-chunk-110',
    lemma: 'Zum Glück!',
    spokenText: 'Zum Glück!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Erleichterung',
    translation: 'Thank goodness! · Luckily!',
    highlightTarget: 'Zum Glück',
    phraseDetails: {
      framePattern: '(Oh,) zum Glück! / Zum Glück + [Verb an Position 2] …',
      casePattern: 'zu + dem (zum) + Dativ Neutrum (Glück)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Erfreulicherweise hat alles rechtzeitig geklappt.',
        textEn: 'Fortunately everything worked out in time.',
        contextNote: 'Formell / Schriftlich',
      },
      informalVariant: {
        textDe: 'Ihr habt den Anschluss noch bekommen? Oh, zum Glück!',
        textEn: 'You still caught your connection? Oh, thank goodness!',
        contextNote: 'Sofort-Reflex bei jeder guten Wendung',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir hatten nur zwei Minuten zum Umsteigen, aber der andere Zug hat gewartet!',
        promptEn: 'We only had two minutes to transfer, but the other train waited!',
        speakerB: 'Lena',
        replyDe: 'Oh, zum Glück! Sonst hättet ihr noch eine Stunde warten müssen.',
        replyEn: 'Oh, thank goodness! Otherwise you’d have had to wait another hour.',
      },
    },
    exampleDe:
      'Felix: Der Film war am Ende zum Glück gar nicht so gruselig.\nLena: Zum Glück, sonst hätte ich nicht schlafen können!',
    exampleEn:
      'Felix: Luckily the movie wasn’t that scary in the end.\nLena: Thank goodness, otherwise I wouldn’t have been able to sleep!',
    anatomy: {
      caseGovernanceNote:
        'Works standalone („Zum Glück!“) OR at Position 1 of a sentence, triggering verb inversion: „Zum Glück HAT es nicht geregnet“.',
      synonyms: ['Gott sei Dank!', 'Glücklicherweise!', 'Ein Glück!'],
      antonyms: ['Leider!', 'So ein Pech!'],
      collocations: [
        'Zum Glück war ich pünktlich!',
        'Zum Glück ist nichts passiert.',
      ],
      wordFamily: ['das Glück (luck / happiness)', 'glücklich (happy)', 'glücklicherweise (luckily)'],
      b1ExamTip:
        'Much easier to pronounce on the fly than „glücklicherweise“—use „Zum Glück!“ daily.',
    },
  },
  {
    id: 'chat-chunk-111',
    lemma: 'Ach so, verstehe!',
    spokenText: 'Ach so, verstehe!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Aha-Moment',
    translation: 'Oh I see, got it! · Ah, that makes sense!',
    highlightTarget: 'Ach so, verstehe',
    phraseDetails: {
      framePattern: 'Ach so, verstehe! / Ach so, na dann!',
      casePattern: 'Ausruf „Ach so“ (= jetzt ist es mir klar) + verkürztes „(Ich) verstehe“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ach so, jetzt verstehe ich, was Sie meinen.',
        textEn: 'Oh I see, now I understand what you mean.',
        contextNote: 'Höflich / Gespräch',
      },
      informalVariant: {
        textDe: 'Ach so, verstehe – du warst gar nicht mit deinem Vater, sondern mit Jonas unterwegs!',
        textEn: 'Oh I see, got it—you weren’t with your dad, you were with Jonas!',
        contextNote: 'Der Klassiker bei jedem kleinen Missverständnis',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich habe gestern so lange mit meiner Cousine telefoniert, nicht mit Mia.',
        promptEn: 'I was on the phone so long with my cousin yesterday, not Mia.',
        speakerB: 'Felix',
        replyDe: 'Ach so, verstehe! Und was gibt es bei ihr Neues?',
        replyEn: 'Oh I see, got it! And what’s new with her?',
      },
    },
    exampleDe:
      'Lena: Ich musste vor dem Master erst noch mein Praktikum abschließen.\nFelix: Ach so, verstehe! Deshalb hattest du eine Pause von Prüfungen.',
    exampleEn:
      'Lena: Before my master’s I first had to finish my internship.\nFelix: Oh I see, got it! That’s why you had a break from exams.',
    anatomy: {
      caseGovernanceNote:
        '„Ach so!“ is the single most iconic German „ohhh, now I get it!“ sound (literally the spirit behind „Achsoo“!). Pairing it with „verstehe“ shows active listening.',
      synonyms: ['Aha, alles klar!', 'Jetzt verstehe ich!'],
      antonyms: ['Wie bitte? Das habe ich nicht verstanden.'],
      collocations: [
        'Ach so, alles klar!',
        'Ach so, nein, dann nicht.',
      ],
      wordFamily: ['verstehen (to understand)', 'verständlich (understandable)'],
      b1ExamTip:
        'Whenever something clicks mid-conversation, „Ach so, verstehe!“ sounds 10x more natural than „Ich verstehe es jetzt“.',
    },
  },
  {
    id: 'chat-chunk-112',
    lemma: 'Ich dachte schon!',
    spokenText: 'Ich dachte schon!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Kurze Verwunderung',
    translation: 'I thought for a second! · I was about to say!',
    highlightTarget: 'Ich dachte schon',
    phraseDetails: {
      framePattern: '(Ach so,) ich dachte schon!',
      casePattern: 'Präteritum von „denken“ (dachte) + Partikel „schon“ (= fast / einen Moment lang)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich hatte für einen Moment schon befürchtet, dass es ein Missverständnis gab.',
        textEn: 'For a moment I had feared there was a misunderstanding.',
        contextNote: 'Formell / Ausgeschrieben',
      },
      informalVariant: {
        textDe: 'Ach so, nur wenn du müde bist – ich dachte schon, das wäre ja verrückt!',
        textEn: 'Oh okay, only when you’re tired—I thought for a second, that would’ve been wild!',
        contextNote: 'Sehr lebendige Reaktion, wenn etwas aufgeklärt wird',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Nein, ich kann natürlich nur überall einschlafen, wenn ich wirklich müde bin!',
        promptEn: 'No, of course I can only fall asleep anywhere when I’m actually tired!',
        speakerB: 'Felix',
        replyDe: 'Haha, ich dachte schon! Alles andere wäre echt verrückt.',
        replyEn: 'Haha, I was about to say! Anything else would be truly wild.',
      },
    },
    exampleDe:
      'Lena: Keine Sorge, wir treffen uns erst morgen, nicht heute!\nFelix: Puh, ich dachte schon, ich hätte den Termin verpasst!',
    exampleEn:
      'Lena: Don’t worry, we’re meeting tomorrow, not today!\nFelix: Phew, I thought for a second I had missed our plans!',
    anatomy: {
      caseGovernanceNote:
        '„Ich dachte schon!“ expresses relief or amusement when a surprising misunderstanding gets cleared up. You can end right after „schon!“ or add what you feared.',
      synonyms: ['Na, da bin ich beruhigt!', 'Ich habe schon einen Schreck bekommen!'],
      antonyms: ['Genau das habe ich gemeint!'],
      collocations: [
        'Ich dachte schon, du kommst nicht mehr!',
        'Ich dachte schon, ich bin zu spät.',
      ],
      wordFamily: ['denken (to think)', 'dachte (thought)', 'schon (already / for a second)'],
      b1ExamTip:
        'Always use Präteritum „Ich dachte“ (not „Ich habe gedacht“) in spoken German—it’s shorter and far more natural.',
    },
  },

  // =========================================================================
  // MINI-DECK 3 EXPANSION START: UNTERWEGS, PLÄNE & REISEN (113–128)
  // =========================================================================
  {
    id: 'chat-chunk-113',
    lemma: 'Ich war vorher noch bei einer Feier.',
    spokenText: 'Ich war vorher noch bei einer Feier.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Erzählen · Zeitliche Abfolge',
    translation: 'Before that I was still at a party.',
    highlightTarget: 'war vorher noch bei einer Feier',
    phraseDetails: {
      framePattern: 'Ich war vorher noch bei + [Dativ] (einer Feier / Freunden / der Arbeit).',
      casePattern: 'Präteritum „war“ + „vorher noch“ + bei + Dativ Feminin (einer Feier)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Zuvor war ich noch auf einer Abschlussfeier eingeladen.',
        textEn: 'Beforehand I had been invited to a graduation celebration.',
        contextNote: 'Formell / Bericht',
      },
      informalVariant: {
        textDe: 'Ja, es wurde spät, aber ich war vorher noch bei einer Feier!',
        textEn: 'Yeah, it got late, because before that I was still at a party!',
        contextNote: 'Alltägliches Erzählen mit „vorher noch“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wieso bist du gestern erst um eins nach Hause gekommen?',
        promptEn: 'How come you didn’t get home until one last night?',
        speakerB: 'Felix',
        replyDe: 'Ich war vorher noch bei einer Feier von einem Studienfreund.',
        replyEn: 'Before that I was still at a party for a uni friend.',
      },
    },
    exampleDe:
      'Lena: So spät erst zu Hause?\nFelix: Ja, ich war vorher noch bei einer Feier!',
    exampleEn:
      'Lena: Home only this late?\nFelix: Yeah, before that I was still at a party!',
    anatomy: {
      caseGovernanceNote:
        '„Vorher noch“ (beforehand / earlier still) smoothly explains why something happened late. After „bei“, feminine „eine Feier“ becomes Dative „einer Feier“.',
      synonyms: ['Davor war ich noch auf einer Party.'],
      antonyms: ['Danach bin ich direkt heimgefahren.'],
      collocations: [
        'Vorher noch schnell einkaufen.',
        'Nachher gehen wir noch was essen.',
      ],
      wordFamily: ['vorher (beforehand)', 'die Feier (celebration / party)', 'feiern (to celebrate)'],
      b1ExamTip:
        'Pair „vorher“ (before) and „nachher / danach“ (afterwards) to tell clear, chronological stories in German.',
    },
  },
  {
    id: 'chat-chunk-114',
    lemma: 'Ich bin erst spät losgefahren.',
    spokenText: 'Ich bin erst spät losgefahren.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reisen · Abfahrt erzählen',
    translation: 'I only headed out late.',
    highlightTarget: 'erst spät losgefahren',
    phraseDetails: {
      framePattern: 'Ich bin erst + [Uhrzeit / spät] losgefahren.',
      casePattern: 'Perfekt mit „sein“ (losfahren → bin losgefahren) + „erst“ (= nicht früher als)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin erst relativ spät abgefahren.',
        textEn: 'I departed relatively late.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Ich bin erst um halb eins losgefahren und war dann gegen halb zwei da.',
        textEn: 'I only left at 12:30 and then got there around 1:30.',
        contextNote: 'Typischer Reisebericht im Perfekt',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'War viel Verkehr auf der Autobahn?',
        promptEn: 'Was there a lot of traffic on the highway?',
        speakerB: 'Felix',
        replyDe: 'Gar nicht, ich bin erst spät losgefahren, da waren die Straßen leer.',
        replyEn: 'Not at all, I only headed out late, so the roads were empty.',
      },
    },
    exampleDe:
      'Lena: Hat die Heimfahrt so lange gedauert?\nFelix: Nein, ich bin einfach erst spät losgefahren.',
    exampleEn:
      'Lena: Did the drive home take that long?\nFelix: No, I just only headed out late.',
    anatomy: {
      caseGovernanceNote:
        '„Losfahren“ (to head out by car/train/bike) takes „sein“ in Perfekt and puts „-ge-“ between the separable prefix and stem: „los-ge-fahren“.',
      synonyms: ['Ich bin erst spät los.', 'Ich bin spät aufgebrochen.'],
      antonyms: ['Ich bin schon ganz früh losgefahren.'],
      collocations: [
        'Wann fahrt ihr los?',
        'Wir sind gegen Mittag losgefahren.',
      ],
      wordFamily: ['losfahren (to drive off)', 'losgehen (to walk off / start)', 'abfahren (to depart)'],
      b1ExamTip:
        'In casual speech, Germans even drop „gefahren“ and say „Ich bin erst um eins los!“—knowing the full „losgefahren“ helps you understand both.',
    },
  },
  {
    id: 'chat-chunk-115',
    lemma: 'So rund eine Stunde.',
    spokenText: 'So rund eine Stunde.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Zeit · Ungefähre Dauer nennen',
    translation: 'Roughly an hour. · About an hour or so.',
    highlightTarget: 'So rund eine Stunde',
    phraseDetails: {
      framePattern: 'So rund / ungefähr + [Zeit oder Zahl].',
      casePattern: 'Adverb „rund“ (= circa / etwa) + Akkusativ Feminin (eine Stunde)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Die Fahrt dauert etwa eine Stunde.',
        textEn: 'The journey takes approximately one hour.',
        contextNote: 'Formell / Auskunft',
      },
      informalVariant: {
        textDe: 'Also so rund eine Stunde, je nach Verkehr.',
        textEn: 'So roughly an hour, depending on traffic.',
        contextNote: 'Lockeres Schätzen mit „so rund“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wie lange fährst du mit dem Zug zu deinen Eltern?',
        promptEn: 'How long is your train ride to your parents’ place?',
        speakerB: 'Felix',
        replyDe: 'So rund eine Stunde, das geht eigentlich ganz schnell.',
        replyEn: 'Roughly an hour, it actually goes pretty fast.',
      },
    },
    exampleDe:
      'Lena: Wie lange brauchst du bis in die Innenstadt?\nFelix: So rund eine Stunde mit der Bahn.',
    exampleEn:
      'Lena: How long does it take you to get downtown?\nFelix: Roughly an hour by train.',
    anatomy: {
      caseGovernanceNote:
        '„Rund“ before a number or duration means „roughly / around“ (just like „ungefähr“ or „etwa“). Adding „so“ in front („so rund“, „so ungefähr“) makes estimates sound super conversational.',
      synonyms: ['Ungefähr eine Stunde.', 'Etwa eine Stunde.', 'Knapp eine Stunde.'],
      antonyms: ['Auf die Minute genau eine Stunde.'],
      collocations: [
        'So rund zwanzig Minuten.',
        'So ungefähr zehn Euro.',
      ],
      wordFamily: ['rund (roughly / round)', 'ungefähr (approximately)', 'die Stunde (hour)'],
      b1ExamTip:
        'Use „so rund …“ or „so gegen …“ (for clock times: „so gegen sieben“) to sound effortlessly relaxed when estimating.',
    },
  },
  {
    id: 'chat-chunk-116',
    lemma: 'Je nachdem, wann wir losfahren.',
    spokenText: 'Je nachdem, wann wir losfahren.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Abwägen · Abhängigkeiten nennen',
    translation: 'Depending on when we head out.',
    highlightTarget: 'Je nachdem, wann wir losfahren',
    phraseDetails: {
      framePattern: 'Je nachdem, wann / wo / wie / ob + [Nebensatz mit Verb am Ende].',
      casePattern: 'Konnektor „je nachdem“ + indirekter Fragesatz (Verb am Satzende)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Die Dauer richtet sich danach, zu welcher Uhrzeit wir abfahren.',
        textEn: 'The duration depends on what time we depart.',
        contextNote: 'Formell / Schriftlich',
      },
      informalVariant: {
        textDe: 'Wir sind gegen acht da – je nachdem, wann wir losfahren!',
        textEn: 'We’ll be there around eight—depending on when we leave!',
        contextNote: 'Extrem häufiger Alltags-Baustein',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Braucht man mit dem Auto lange bis an die Nordsee?',
        promptEn: 'Does it take long by car to get to the North Sea?',
        speakerB: 'Felix',
        replyDe: 'Je nachdem, wann wir losfahren – morgens geht es super schnell.',
        replyEn: 'Depending on when we leave—in the morning it’s super fast.',
      },
    },
    exampleDe:
      'Lena: Wann seid ihr morgen ungefähr im Café?\nFelix: Gegen zehn – je nachdem, wann wir losfahren.',
    exampleEn:
      'Lena: Roughly when will you be at the café tomorrow?\nFelix: Around ten—depending on when we head out.',
    anatomy: {
      caseGovernanceNote:
        '„Je nachdem“ works both standalone („Je nachdem!“ = „Depends!“) and before any question word („wann“, „wo“, „wie“, „ob“), which kicks the conjugated verb to the end.',
      synonyms: ['Es kommt darauf an, wann wir losfahren.'],
      antonyms: ['Egal, wann wir losfahren.'],
      collocations: [
        'Je nachdem, wie das Wetter ist.',
        'Je nachdem, worauf wir Lust haben.',
      ],
      wordFamily: ['je nachdem (depending on)', 'nachdem (after)'],
      b1ExamTip:
        'Just saying „Je nachdem!“ is a super crisp one-chunk answer when someone asks „How much does it cost?“ or „How long does it take?“.',
    },
  },
  {
    id: 'chat-chunk-117',
    lemma: 'Es war zwar spät, aber echt schön.',
    spokenText: 'Es war zwar spät, aber echt schön.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Erzählen · Abwägen mit „zwar …, aber …“',
    translation: 'It was late, sure, but really lovely.',
    highlightTarget: 'war zwar spät, aber echt schön',
    phraseDetails: {
      framePattern: 'Es war zwar …, aber (trotzdem) …',
      casePattern: 'Zweiteiliger Konnektor „zwar …, aber …“ (beide Teile bleiben Hauptsätze)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Der Abend war zwar recht lang, aber ausgesprochen angenehm.',
        textEn: 'The evening was admittedly quite long, yet thoroughly pleasant.',
        contextNote: 'Formell / Ausgewogen',
      },
      informalVariant: {
        textDe: 'Es waren zwar viele da, die ich nicht kannte, aber es war echt schön!',
        textEn: 'Sure, there were lots of people I didn’t know, but it was really lovely!',
        contextNote: 'Perfekte A2-Struktur zum Erzählen von Erlebnissen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'War die Fahrt in die Niederlande nicht ganz schön anstrengend?',
        promptEn: 'Wasn’t the trip to the Netherlands pretty exhausting?',
        speakerB: 'Felix',
        replyDe: 'Es war zwar lang, aber echt schön und super entspannt!',
        replyEn: 'It was long, sure, but really lovely and super chill!',
      },
    },
    exampleDe:
      'Lena: Bist du froh, dass du gestern noch zur Feier gegangen bist?\nFelix: Ja, es war zwar spät, aber echt schön!',
    exampleEn:
      'Lena: Are you glad you still went to the party yesterday?\nFelix: Yes, it was late, sure, but really lovely!',
    anatomy: {
      caseGovernanceNote:
        '„Zwar …, aber …“ is one of the easiest and smartest-sounding A2 connectors: „zwar“ concedes a small downside, and „aber“ brings the positive twist—without changing verb position!',
      synonyms: ['Es war spät, aber trotzdem super!'],
      antonyms: ['Es war nicht nur spät, sondern auch langweilig.'],
      collocations: [
        'Zwar teuer, aber richtig lecker.',
        'Ich bin zwar müde, aber glücklich.',
      ],
      wordFamily: ['zwar (admittedly / sure)', 'aber (but)', 'echt (really)'],
      b1ExamTip:
        'Use „zwar …, aber …“ whenever you review a restaurant, movie, or trip—it makes your German sound effortlessly structured.',
    },
  },
  {
    id: 'chat-chunk-118',
    lemma: 'Wir waren erst im Café und dann noch in einer Bar.',
    spokenText: 'Wir waren erst im Café und dann noch in einer Bar.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Erzählen · Abendablauf schildern',
    translation: 'First we went to a café and then we also hit a bar.',
    highlightTarget: 'erst im Café und dann noch in einer Bar',
    phraseDetails: {
      framePattern: 'Wir waren erst + [Ort 1] und dann noch + [Ort 2].',
      casePattern: 'Zeitfolge „erst … und dann noch …“ + Dativ (Wo?: im Café, in einer Bar)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Zunächst haben wir ein Café besucht und anschließend noch eine Bar.',
        textEn: 'First we visited a café and afterwards a bar as well.',
        contextNote: 'Formell / Bericht',
      },
      informalVariant: {
        textDe: 'Wir waren erst essen und dann noch in einer kleinen Bar mit Karaoke!',
        textEn: 'First we went for food and then also to a little bar with karaoke!',
        contextNote: 'Der natürliche Rhythmus für jede Wochenendgeschichte',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Was habt ihr gestern Abend auf der Feier alles gemacht?',
        promptEn: 'What all did you guys do at the party last night?',
        speakerB: 'Felix',
        replyDe: 'Wir waren erst im Café und dann noch in einer Bar!',
        replyEn: 'First we were at a café and then we also went to a bar!',
      },
    },
    exampleDe:
      'Lena: Wie sah euer Abend gestern aus?\nFelix: Wir waren erst im Café und dann noch in einer Bar.',
    exampleEn:
      'Lena: What did your evening look like yesterday?\nFelix: First we went to a café and then also to a bar.',
    anatomy: {
      caseGovernanceNote:
        'Notice „erst … und dann noch …“ (first … and then on top of that …). With „sein“ („Wir waren …“), static locations take Dative: „im Café“ (in dem), „in einer Bar“ (feminine).',
      synonyms: ['Zuerst waren wir im Café, danach noch in einer Bar.'],
      antonyms: ['Wir sind direkt nach Hause gegangen.'],
      collocations: [
        'Erst essen und dann noch spazieren gehen.',
        'Erst im Museum und dann noch im Park.',
      ],
      wordFamily: ['erst (first)', 'dann noch (and then also)'],
      b1ExamTip:
        'Adding „noch“ after „dann“ („und dann noch…“) gives your weekend stories natural German momentum.',
    },
  },
  {
    id: 'chat-chunk-119',
    lemma: 'Wenn wir Zeit finden.',
    spokenText: 'Wenn wir Zeit finden.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Pläne · Lockeres Vorhaben',
    translation: 'Whenever we find time. · If we manage to find the time.',
    highlightTarget: 'Wenn wir Zeit finden',
    phraseDetails: {
      framePattern: 'Wenn wir Zeit finden, + [Verb an Position 2] …',
      casePattern: 'Nebensatz mit „wenn“ (Verb am Ende) · „Zeit finden“ (ohne Artikel)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sofern es unsere Zeit zulässt, treffen wir uns sehr gerne.',
        textEn: 'Provided our schedule allows, we would love to meet.',
        contextNote: 'Formell / Geschäftlich',
      },
      informalVariant: {
        textDe: 'Wenn wir Zeit finden, gehen wir am Wochenende wieder zusammen joggen.',
        textEn: 'Whenever we find time, we go jogging together again on the weekend.',
        contextNote: 'Realistischer Alltagsplan unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Schafft ihr es diese Woche, mal wieder zusammen zu kochen?',
        promptEn: 'Will you guys manage to cook together again this week?',
        speakerB: 'Felix',
        replyDe: 'Sehr gern – wenn wir Zeit finden, machen wir das am Freitag!',
        replyEn: 'Would love to—if we find the time, let’s do it Friday!',
      },
    },
    exampleDe:
      'Lena: Geht ihr eigentlich oft zusammen ins Kino?\nFelix: Immer am Wochenende, wenn wir Zeit finden.',
    exampleEn:
      'Lena: Do you guys actually go to the movies together often?\nFelix: Always on the weekend, whenever we find time.',
    anatomy: {
      caseGovernanceNote:
        '„Zeit finden“ (to find time) takes no article. If „Wenn wir Zeit finden“ comes FIRST, the main clause starts immediately with the conjugated verb: „Wenn wir Zeit finden, GEHEN wir …“.',
      synonyms: ['Wenn es zeitlich passt.', 'Sobald wir Zeit haben.'],
      antonyms: ['Ich habe gerade überhaupt keine Zeit.'],
      collocations: [
        'Hoffentlich finden wir bald mal Zeit!',
        'Ich finde momentan kaum Zeit dafür.',
      ],
      wordFamily: ['die Zeit (time)', 'finden (to find)', 'zeitlich (time-wise)'],
      b1ExamTip:
        'Remember „wenn“ = both „if“ and „whenever“ for present/repeated actions!',
    },
  },
  {
    id: 'chat-chunk-120',
    lemma: 'Wir sind schon über die Grenze.',
    spokenText: 'Wir sind schon über die Grenze.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reisen · Reise-Meilenstein',
    translation: 'We’re already across the border.',
    highlightTarget: 'schon über die Grenze',
    phraseDetails: {
      framePattern: 'Wir sind gerade / schon über die Grenze (gefahren).',
      casePattern: 'über + Akkusativ Feminin (die Grenze) wegen Bewegung (Wohin?)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir haben die Grenze bereits passiert.',
        textEn: 'We have already crossed the border.',
        contextNote: 'Formell / Reisebericht',
      },
      informalVariant: {
        textDe: 'Noch nicht am Ziel, aber wir sind schon über die Grenze!',
        textEn: 'Not at our destination yet, but we’re already across the border!',
        contextNote: 'Typisches Zug- oder Auto-Update in Europa',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Oh, seid ihr schon in den Niederlanden angekommen?',
        promptEn: 'Oh, have you already arrived in the Netherlands?',
        speakerB: 'Felix',
        replyDe: 'Wir sind schon über die Grenze, sitzen aber noch im Zug!',
        replyEn: 'We’re already across the border, still sitting on the train though!',
      },
    },
    exampleDe:
      'Lena: Seid ihr schon in Amsterdam?\nFelix: Noch nicht ganz, aber wir sind schon über die Grenze!',
    exampleEn:
      'Lena: Are you in Amsterdam yet?\nFelix: Not quite yet, but we’re already across the border!',
    anatomy: {
      caseGovernanceNote:
        '„Über“ is a two-way preposition: crossing a border implies motion across, so it takes Accusative („über die Grenze“). The participle „gefahren“ is often implied and dropped in speech.',
      synonyms: ['Wir haben die Grenze gerade überquert.'],
      antonyms: ['Wir sind noch in Deutschland.'],
      collocations: [
        'Über die Grenze fahren.',
        'Kurz hinter der Grenze.',
      ],
      wordFamily: ['die Grenze, -n (border)', 'überqueren (to cross)'],
      b1ExamTip:
        'Super relatable in Europe where train rides cross borders all the time!',
    },
  },
  {
    id: 'chat-chunk-121',
    lemma: 'Wir sitzen noch im Zug.',
    spokenText: 'Wir sitzen noch im Zug.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Unterwegs · Status aus der Bahn',
    translation: 'We’re still sitting on the train.',
    highlightTarget: 'sitzen noch im Zug',
    phraseDetails: {
      framePattern: 'Ich sitze / Wir sitzen noch im Zug (nach …).',
      casePattern: 'in + Dativ Maskulin (in dem → im Zug) bei statischer Position (Wo?)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir befinden uns derzeit noch auf der Zugfahrt.',
        textEn: 'We are currently still on the train journey.',
        contextNote: 'Formell / Geschäftsreise',
      },
      informalVariant: {
        textDe: 'Wir sitzen noch im Zug, das Internet funktioniert erstaunlich gut!',
        textEn: 'We’re still on the train, the internet is working surprisingly well!',
        contextNote: 'Alltägliches Bahn-Update',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Bist du schon im Hotel eingecheckt?',
        promptEn: 'Have you already checked into the hotel?',
        speakerB: 'Felix',
        replyDe: 'Nein, wir sitzen noch im Zug – noch etwa eine Stunde.',
        replyEn: 'No, we’re still on the train—about another hour.',
      },
    },
    exampleDe:
      'Lena: Seid ihr schon da?\nFelix: Nein, wir sitzen noch im Zug nach Rotterdam.',
    exampleEn:
      'Lena: Are you there yet?\nFelix: No, we’re still sitting on the train to Rotterdam.',
    anatomy: {
      caseGovernanceNote:
        'In German you sit „in“ a train/bus/car (not „on“!): „im Zug“, „im Bus“, „im Auto“ (all Dative because „sitzen“ answers „Wo?“).',
      synonyms: ['Wir sind noch im Zug.', 'Wir sind noch mit der Bahn unterwegs.'],
      antonyms: ['Wir sind gerade ausgestiegen.'],
      collocations: [
        'Im Zug ein bisschen lesen.',
        'Der Zug hat leider Verspätung.',
      ],
      wordFamily: ['der Zug, Züge (train)', 'sitzen (to sit)', 'einsteigen / aussteigen (to board / get off)'],
      b1ExamTip:
        'Avoid translating English „on the train“ as „auf dem Zug“ (that means on the roof!)—always say „im Zug“.',
    },
  },
  {
    id: 'chat-chunk-122',
    lemma: 'War die Fahrt anstrengend?',
    spokenText: 'War die Fahrt anstrengend?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reisen · Nach der Reise fragen',
    translation: 'Was the trip tiring?',
    highlightTarget: 'War die Fahrt anstrengend',
    phraseDetails: {
      framePattern: 'War die Fahrt / der Flug / der Tag anstrengend?',
      casePattern: 'Präteritum „war“ + Nomen Feminin „die Fahrt“ + prädikatives Adjektiv',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Hatten Sie eine angenehme Anreise oder war die Fahrt anstrengend?',
        textEn: 'Did you have a pleasant journey or was the trip tiring?',
        contextNote: 'Höflich / Gastgeber',
      },
      informalVariant: {
        textDe: 'Wie lange dauert die ganze Fahrt eigentlich? War die Fahrt anstrengend?',
        textEn: 'How long is the whole ride actually? Was the trip tiring?',
        contextNote: 'Fürsorgliche Frage bei Ankunft',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Schön, dass ihr da seid! War die Fahrt anstrengend?',
        promptEn: 'So glad you’re here! Was the trip tiring?',
        speakerB: 'Felix',
        replyDe: 'Ging eigentlich, der Zug war zum Glück schön leer.',
        replyEn: 'Actually it was fine, luckily the train was nice and empty.',
      },
    },
    exampleDe:
      'Lena: Ihr wart ja fast zehn Stunden unterwegs – war die Fahrt anstrengend?\nFelix: Eigentlich nicht, im ICE war es total entspannt.',
    exampleEn:
      'Lena: You were on the road for almost ten hours—was the trip tiring?\nFelix: Actually not, it was totally chill on the ICE.',
    anatomy: {
      caseGovernanceNote:
        '„Anstrengend“ (tiring / exhausting) is an essential A2 adjective for trips, workouts, workdays, and exams. Notice „die Fahrt“ covers train, bus, and car rides.',
      synonyms: ['War es sehr stressig unterwegs?', 'Seid ihr sehr kaputt von der Fahrt?'],
      antonyms: ['War die Fahrt entspannt?'],
      collocations: [
        'Ein anstrengender Tag.',
        'Eine lange Fahrt.',
      ],
      wordFamily: ['die Fahrt (ride / trip)', 'anstrengend (tiring)', 'sich anstrengen (to make an effort)'],
      b1ExamTip:
        'Pair with „Wie war denn die Fahrt?“ whenever greeting friends who just traveled to visit you.',
    },
  },
  {
    id: 'chat-chunk-123',
    lemma: 'So richtig noch gar nichts.',
    spokenText: 'So richtig noch gar nichts.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Pläne · Noch nichts Festes',
    translation: 'Nothing really yet. · Nothing concrete so far.',
    highlightTarget: 'So richtig noch gar nichts',
    phraseDetails: {
      framePattern: 'So richtig noch gar nichts – wir haben nur einen groben Plan.',
      casePattern: 'Abgeschwächte Verneinung „so richtig“ + verstärktes „noch gar nichts“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Konkret haben wir bislang noch nichts festgelegt.',
        textEn: 'We have not fixed anything concrete so far.',
        contextNote: 'Formell / Planung',
      },
      informalVariant: {
        textDe: 'Was ist geplant? Haha, so richtig noch gar nichts!',
        textEn: 'What’s planned? Haha, nothing really yet!',
        contextNote: 'Sehr natürliche, ehrliche Antwort',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Was habt ihr euch für das lange Wochenende alles vorgenommen?',
        promptEn: 'What all have you planned for the long weekend?',
        speakerB: 'Felix',
        replyDe: 'So richtig noch gar nichts – wir lassen es auf uns zukommen.',
        replyEn: 'Nothing really yet—we’re just going to see what comes up.',
      },
    },
    exampleDe:
      'Lena: Habt ihr für morgen schon Tickets oder Museen gebucht?\nFelix: So richtig noch gar nichts, wir entscheiden das beim Frühstück.',
    exampleEn:
      'Lena: Have you already booked tickets or museums for tomorrow?\nFelix: Nothing really yet, we’ll decide over breakfast.',
    anatomy: {
      caseGovernanceNote:
        '„Noch gar nichts“ (nothing at all yet) + „so richtig“ (really/properly) is a super idiomatic spoken phrase for „nothing set in stone yet“.',
      synonyms: ['Noch nichts Konkretes.', 'Bisher noch gar nichts.'],
      antonyms: ['Wir haben schon alles genau geplant.'],
      collocations: [
        'Ich weiß es noch gar nicht so richtig.',
        'So richtig Lust habe ich heute nicht.',
      ],
      wordFamily: ['richtig (really / properly)', 'gar nichts (nothing at all)', 'noch nicht (not yet)'],
      b1ExamTip:
        'Notice how „so richtig“ softens negatives across German: „Ich habe noch nicht so richtig Hunger“ (I’m not really hungry yet).',
    },
  },
  {
    id: 'chat-chunk-124',
    lemma: 'Wir sind gegen zwölf losgefahren.',
    spokenText: 'Wir sind gegen zwölf losgefahren.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Zeit · Ungefähre Uhrzeit',
    translation: 'We headed out around twelve.',
    highlightTarget: 'gegen zwölf losgefahren',
    phraseDetails: {
      framePattern: 'Wir sind gegen + [Uhrzeit] losgefahren / angekommen.',
      casePattern: 'Präposition „gegen“ + Uhrzeit (= ungefähr um) · Perfekt mit „sein“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir sind gegen zwölf Uhr mittags abgereist.',
        textEn: 'We departed around twelve noon.',
        contextNote: 'Formell / Reisebericht',
      },
      informalVariant: {
        textDe: 'Wir sind gegen zwölf losgefahren und hoffentlich gegen zehn da!',
        textEn: 'We headed out around twelve and should hopefully be there around ten!',
        contextNote: 'Alltagsstandard für ungefähre Uhrzeiten',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wann seid ihr heute früh eigentlich gestartet?',
        promptEn: 'When did you guys actually set off earlier today?',
        speakerB: 'Felix',
        replyDe: 'Wir sind gegen zwölf losgefahren, ganz ohne Hektik.',
        replyEn: 'We headed out around twelve, completely without rushing.',
      },
    },
    exampleDe:
      'Lena: Wann seid ihr heute Morgen los?\nFelix: Wir sind gegen zwölf losgefahren und waren abends am Ziel.',
    exampleEn:
      'Lena: When did you leave this morning?\nFelix: We headed out around twelve and reached our destination in the evening.',
    anatomy: {
      caseGovernanceNote:
        'Compare „um zwölf“ (at twelve sharp) vs. „gegen zwölf“ (around twelve). You don’t even need „Uhr“ after „gegen“ in spoken German!',
      synonyms: ['Wir sind so um zwölf los.', 'Gegen Mittag sind wir gestartet.'],
      antonyms: ['Wir sind punkt zwölf abgefahren.'],
      collocations: [
        'Wir treffen uns gegen sieben.',
        'Gegen Abend wird es kühler.',
      ],
      wordFamily: ['gegen (around / toward)', 'losfahren (to drive off)'],
      b1ExamTip:
        'Use „gegen + Uhrzeit“ when making relaxed dinner plans with friends („Komm einfach gegen sieben vorbei!“).',
    },
  },
  {
    id: 'chat-chunk-125',
    lemma: 'Hoffentlich sind wir pünktlich da.',
    spokenText: 'Hoffentlich sind wir pünktlich da.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reisen · Hoffnung ausdrücken',
    translation: 'Hopefully we’ll get there on time.',
    highlightTarget: 'Hoffentlich sind wir pünktlich da',
    phraseDetails: {
      framePattern: 'Hoffentlich + [Verb an Position 2] + [Subjekt] …',
      casePattern: 'Satzadverb „hoffentlich“ auf Position 1 → Inversion (sind wir)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir hoffen, dass wir pünktlich eintreffen werden.',
        textEn: 'We hope that we will arrive on time.',
        contextNote: 'Formell / Geschäftlich',
      },
      informalVariant: {
        textDe: 'Hoffentlich sind wir pünktlich da, der Umstieg ist nämlich ziemlich knapp!',
        textEn: 'Hopefully we get there on time, because the connection is pretty tight!',
        contextNote: 'Viel kürzer und natürlicher als „Ich hoffe, dass…“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Unser Zug steht gerade kurz vor dem Bahnhof – hoffentlich sind wir pünktlich da!',
        promptEn: 'Our train is stopped right outside the station—hopefully we’ll get there on time!',
        speakerB: 'Lena',
        replyDe: 'Ich drücke die Daumen, wird schon passen!',
        replyEn: 'Fingers crossed, it’ll work out fine!',
      },
    },
    exampleDe:
      'Felix: Wir haben in Köln nur vier Minuten Umstieg – hoffentlich sind wir pünktlich da.\nLena: Viel Glück, das klappt bestimmt!',
    exampleEn:
      'Felix: We only have a four-minute transfer in Cologne—hopefully we’ll get there on time.\nLena: Good luck, I’m sure it’ll work out!',
    anatomy: {
      caseGovernanceNote:
        'Using „Hoffentlich“ at Position 1 skips the „dass“-clause completely—just put the verb right in Position 2: „Hoffentlich klappt es!“, „Hoffentlich regnet es nicht!“.',
      synonyms: ['Ich hoffe, wir schaffen es pünktlich.'],
      antonyms: ['Wir kommen leider zu spät.'],
      collocations: [
        'Hoffentlich klappt es!',
        'Hoffentlich bis bald!',
      ],
      wordFamily: ['hoffentlich (hopefully)', 'hoffen (to hope)', 'pünktlich (on time)'],
      b1ExamTip:
        'Swap „Ich hoffe, dass…“ for „Hoffentlich + Verb…“ in fast conversation—way snappier!',
    },
  },
  {
    id: 'chat-chunk-126',
    lemma: 'Das ist echt entspannt.',
    spokenText: 'Das ist echt entspannt.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Bewertung · Locker & angenehm',
    translation: 'That’s really chill. · That’s super relaxed.',
    highlightTarget: 'ist das echt entspannt',
    phraseDetails: {
      framePattern: 'Das ist / Der Zug ist echt entspannt.',
      casePattern: 'Verstärker „echt“ (= wirklich) + Partizip-Adjektiv „entspannt“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Die Reise verläuft wirklich sehr angenehm und ruhig.',
        textEn: 'The journey is going really pleasantly and calmly.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Zehn Stunden klingen lang, aber im Zug ist es echt entspannt!',
        textEn: 'Ten hours sounds long, but on the train it’s really chill!',
        contextNote: 'Eines der wichtigsten positiven Alltagswörter im Deutschen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wie ist die Stimmung in eurer neuen WG?',
        promptEn: 'What’s the vibe like in your new shared apartment?',
        speakerB: 'Felix',
        replyDe: 'Super angenehm, alle sind echt entspannt!',
        replyEn: 'Super pleasant, everyone is really chill!',
      },
    },
    exampleDe:
      'Lena: Ist so eine lange Zugfahrt nicht total nervig?\nFelix: Gar nicht, im ICE ist das echt entspannt!',
    exampleEn:
      'Lena: Isn’t such a long train ride totally annoying?\nFelix: Not at all, on the ICE it’s really relaxed!',
    anatomy: {
      caseGovernanceNote:
        '„Entspannt“ is the natural German word for English „chill / laid-back / relaxed“—works for train rides, people, weekends, and workdays!',
      synonyms: ['Das ist richtig locker.', 'Das ist total angenehm.'],
      antonyms: ['Das ist total stressig!'],
      collocations: [
        'Ein entspanntes Wochenende.',
        'Ganz entspannt bleiben!',
      ],
      wordFamily: ['entspannt (relaxed / chill)', 'sich entspannen (to relax)', 'die Entspannung (relaxation)'],
      b1ExamTip:
        'Use „echt entspannt“ instead of English „chill“ when speaking German—it sounds 100% native and clean.',
    },
  },
  {
    id: 'chat-chunk-127',
    lemma: 'Das hört sich ganz schön anstrengend an.',
    spokenText: 'Das hört sich ganz schön anstrengend an.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Mitgefühl zeigen',
    translation: 'That sounds pretty exhausting.',
    highlightTarget: 'hört sich ganz schön anstrengend an',
    phraseDetails: {
      framePattern: 'Das hört sich (ganz schön / super) + [Adjektiv] + an.',
      casePattern: 'trennbares reflexives Verb „sich anhören“ + „ganz schön“ (= ziemlich)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das klingt nach einer recht anstrengenden Reise.',
        textEn: 'That sounds like quite a strenuous journey.',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Zehn Stunden Fahrt mit kurzem Umstieg? Das hört sich ganz schön anstrengend an!',
        textEn: 'A ten-hour ride with a tight transfer? That sounds pretty exhausting!',
        contextNote: 'Idiomatisches „ganz schön“ = „ziemlich / echt“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir sind heute den ganzen Tag mit vollem Rucksack durch die Stadt gelaufen.',
        promptEn: 'We walked around the city all day today with full backpacks.',
        speakerB: 'Lena',
        replyDe: 'Puh, das hört sich ganz schön anstrengend an!',
        replyEn: 'Phew, that sounds pretty exhausting!',
      },
    },
    exampleDe:
      'Felix: Wir fahren von zwölf bis zweiundzwanzig Uhr mit dem Zug.\nLena: Oh, das hört sich ganz schön anstrengend an!',
    exampleEn:
      'Felix: We’re on the train from twelve to ten p.m.\nLena: Oh, that sounds pretty exhausting!',
    anatomy: {
      caseGovernanceNote:
        'Big German false-friend alert: „ganz schön“ before an adjective NEVER means „quite pretty“—it means „pretty / quite / seriously“ („ganz schön kalt“, „ganz schön teuer“, „ganz schön anstrengend“)!',
      synonyms: ['Das klingt echt hart.', 'Das klingt nach viel Stress.'],
      antonyms: ['Das hört sich richtig entspannt an!'],
      collocations: [
        'Ganz schön kalt heute!',
        'Das war ganz schön knapp!',
      ],
      wordFamily: ['sich anhören (to sound)', 'ganz schön (pretty / quite)', 'anstrengend (exhausting)'],
      b1ExamTip:
        'Start noticing „ganz schön“ in spoken German—you’ll hear it everywhere once you know it means „pretty / quite“!',
    },
  },
  {
    id: 'chat-chunk-128',
    lemma: 'Vielleicht bringe ich ja etwas mit.',
    spokenText: 'Vielleicht bringe ich ja etwas mit.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reisen · Mitbringsel andeuten',
    translation: 'Maybe I’ll bring something back for you.',
    highlightTarget: 'bringe ich ja etwas mit',
    phraseDetails: {
      framePattern: 'Vielleicht bringe ich (dir) ja etwas (Leckeres) mit!',
      casePattern: 'trennbares Verb „mitbringen“ + Inversion nach „Vielleicht“ + warmes „ja“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Vielleicht bringe ich Ihnen eine kleine Aufmerksamkeit von der Reise mit.',
        textEn: 'Perhaps I will bring you back a small souvenir from the trip.',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Du liebst niederländische Kekse? Vielleicht bringe ich ja etwas mit!',
        textEn: 'You love Dutch cookies? Maybe I’ll bring something back!',
        contextNote: 'Freundlich-zwangloses Angebot dank „ja“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hier gibt es überall frische Waffeln – vielleicht bringe ich ja etwas mit!',
        promptEn: 'There are fresh waffles everywhere here—maybe I’ll bring some back!',
        speakerB: 'Lena',
        replyDe: 'Oh wie süß, aber genieß einfach deinen Urlaub!',
        replyEn: 'Oh how sweet, just enjoy your vacation though!',
      },
    },
    exampleDe:
      'Felix: Es gibt hier so tolle kleine Läden – vielleicht bringe ich ja etwas mit!\nLena: Ach wie lieb von dir!',
    exampleEn:
      'Felix: There are such great little shops here—maybe I’ll bring something back!\nLena: Aw, how sweet of you!',
    anatomy: {
      caseGovernanceNote:
        '„Mitbringen“ (separable) means „to bring along / bring back as a gift“. Putting „Vielleicht“ in Position 1 puts „bringe“ in Position 2, and „ja“ makes the suggestion sound lighthearted.',
      synonyms: ['Ich schaue mal, ob ich dir etwas Schönes finde.'],
      antonyms: ['Im Rucksack ist leider kein Platz mehr.'],
      collocations: [
        'Soll ich heute Abend etwas mitbringen?',
        'Ich bringe Kuchen mit!',
      ],
      wordFamily: ['mitbringen (to bring along)', 'das Mitbringsel (small souvenir)', 'bringen (to bring)'],
      b1ExamTip:
        'At dinner invitations, always ask: „Soll ich etwas mitbringen?“ (Should I bring anything?).',
    },
  },
];
