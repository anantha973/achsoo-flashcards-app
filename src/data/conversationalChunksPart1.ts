import type { VocabCard } from './vocabData';

/**
 * Curated A1–A2 Conversational Chunks & Social Reactions (Part 1: 001–032)
 * - Mini-Deck 1 (chat-chunk-001 .. chat-chunk-016): Einstieg, Check-in & Abschied
 * - Mini-Deck 2 (chat-chunk-017 .. chat-chunk-032): Reaktionen, Zustimmung & Neckerei
 */
export const CONVERSATIONAL_CHUNKS_PART_1: VocabCard[] = [
  // =========================================================================
  // MINI-DECK 1: EINSTIEG, CHECK-IN & ABSCHIED (001–016)
  // =========================================================================
  {
    id: 'chat-chunk-001',
    lemma: 'Ich wollte nur kurz fragen, ob …',
    spokenText: 'Ich wollte nur kurz fragen, ob',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Einstieg · Kurz nachfragen',
    translation: 'I just wanted to quickly ask if …',
    highlightTarget: 'Ich wollte nur kurz fragen, ob',
    phraseDetails: {
      framePattern: 'Ich wollte nur kurz fragen, ob + [Subjekt] … [Verb am Ende]',
      casePattern: 'Indirekter Fragesatz mit „ob“ (Verb am Satzende)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich wollte mich kurz erkundigen, ob der Termin morgen noch steht.',
        textEn: 'I wanted to briefly check whether tomorrow’s appointment still stands.',
        contextNote: 'Höflich / Kollegen oder Kontakte mit „Sie“',
      },
      informalVariant: {
        textDe: 'Hey, ich wollte nur kurz fragen, ob du meine Nummer richtig gespeichert hast.',
        textEn: 'Hey, I just wanted to quickly check if you saved my number right.',
        contextNote: 'Locker unter Freunden mit „nur kurz“ als Weichmacher',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hallo Lena, ich wollte nur kurz fragen, ob du heute Abend Zeit hast.',
        promptEn: 'Hi Lena, I just wanted to quickly ask if you’re free tonight.',
        speakerB: 'Lena',
        replyDe: 'Ja klar, ab acht Uhr passt es mir super!',
        replyEn: 'Yeah sure, anytime from eight works great for me!',
      },
    },
    exampleDe:
      'Felix: Ich wollte nur kurz fragen, ob du meine Nummer richtig gespeichert hast.\nLena: Ja, zum Glück habe ich das hinbekommen!',
    exampleEn:
      'Felix: I just wanted to quickly ask if you saved my number right.\nLena: Yes, luckily I managed to get it right!',
    anatomy: {
      caseGovernanceNote:
        'Using the past tense „ich wollte“ plus „nur kurz“ softens a direct question in German. After „ob“, the conjugated verb always moves to the very end of the clause.',
      synonyms: [
        'Darf ich kurz fragen, ob …',
        'Wollte mal eben nachfragen, ob …',
      ],
      antonyms: ['Sag mir sofort, ob …'],
      collocations: [
        'Ich wollte nur kurz fragen, ob alles geklappt hat.',
        'Ich wollte nur kurz fragen, ob du schon unterwegs bist.',
      ],
      wordFamily: [
        'fragen (to ask)',
        'nachfragen (to follow up)',
        'die Frage (question)',
      ],
      b1ExamTip:
        'Everyday reflex: „Ich wollte nur kurz …“ makes any casual message or question sound warm and low-pressure.',
    },
  },
  {
    id: 'chat-chunk-002',
    lemma: 'Komm gut an!',
    spokenText: 'Komm gut an!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Abschied · Reisewunsch',
    translation: 'Have a safe trip! · Get there safely!',
    highlightTarget: 'Komm gut an',
    phraseDetails: {
      framePattern: 'Komm / Kommt gut (nach Hause / in …) an!',
      casePattern: 'Imperativ von „ankommen“ (trennbares Verb)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich wünsche Ihnen eine angenehme Reise und kommen Sie gut an!',
        textEn: 'I wish you a pleasant journey and a safe arrival!',
        contextNote: 'Höflich / Kollegen oder Bekannte',
      },
      informalVariant: {
        textDe: 'Komm gut an und schreib mir kurz, wenn du da bist!',
        textEn: 'Get there safely and text me quick once you’re there!',
        contextNote: 'Sehr häufig unter Freunden beim Verabschieden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich fahre heute Abend noch mit dem Zug nach Hause.',
        promptEn: 'I’m taking the train home later this evening.',
        speakerB: 'Lena',
        replyDe: 'Alles klar, komm gut an und melde dich morgen!',
        replyEn: 'Alright, have a safe trip and message me tomorrow!',
      },
    },
    exampleDe:
      'Felix: Ich fahre heute Abend noch nach Hause.\nLena: Alles klar, komm gut an und schick mir dann ein Foto!',
    exampleEn:
      'Felix: I’m heading home tonight.\nLena: Alright, get home safely and send me a photo afterwards!',
    anatomy: {
      caseGovernanceNote:
        'Separable verb „ankommen“ splits in the imperative: „Komm … an!“ (for one friend), „Kommt … an!“ (for a group), „Kommen Sie … an!“ (formal).',
      synonyms: ['Gute Fahrt!', 'Komm gut heim!', 'Gute Reise!'],
      antonyms: ['Bis gleich!'],
      collocations: [
        'Komm gut nach Hause!',
        'Kommt alle gut an!',
        'Seid ihr gut angekommen?',
      ],
      wordFamily: [
        'ankommen (to arrive)',
        'die Ankunft (arrival)',
        'heimkommen (to come home)',
      ],
      b1ExamTip:
        'Germans say „Komm gut an!“ or „Komm gut heim!“ almost every single time a friend heads home or boards a train.',
    },
  },
  {
    id: 'chat-chunk-003',
    lemma: 'Ich bin eben angekommen.',
    spokenText: 'Ich bin eben angekommen.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Check-in · Ankunft melden',
    translation: 'I just got here. · I just arrived.',
    highlightTarget: 'bin eben angekommen',
    phraseDetails: {
      framePattern: 'Ich bin eben / gerade (zu Hause / im Hotel) angekommen.',
      casePattern: 'Perfekt mit „sein“ (Bewegung / Ortswechsel)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin soeben im Hotel eingetroffen.',
        textEn: 'I have just arrived at the hotel.',
        contextNote: 'Formell / Geschäftliche Nachricht',
      },
      informalVariant: {
        textDe: 'Ich bin eben angekommen und mache jetzt erst mal Pause.',
        textEn: 'I just got in and I’m taking a break first.',
        contextNote: 'Natürliche Alltagssprache mit „eben“ = „gerade eben“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich bin eben angekommen. Ich schaue morgen mal nach dem Buch.',
        promptEn: 'I just got home. I’ll look for the book tomorrow.',
        speakerB: 'Lena',
        replyDe: 'Super, schlaf erst mal gut!',
        replyEn: 'Great, get some good sleep first!',
      },
    },
    exampleDe:
      'Felix: Ich bin eben angekommen. Ich suche die Vase morgen raus.\nLena: Super, gar kein Stress!',
    exampleEn:
      'Felix: I just got home. I’ll dig out the vase tomorrow.\nLena: Great, no stress at all!',
    anatomy: {
      caseGovernanceNote:
        '„Eben“ here is an adverb meaning „just now / moments ago“ (synonym of „gerade“). Because „ankommen“ expresses a change of location, it always takes „sein“ in Perfekt.',
      synonyms: ['Ich bin gerade da.', 'Ich bin soeben angekommen.'],
      antonyms: ['Ich fahre gleich erst los.'],
      collocations: [
        'Ich bin eben erst zur Tür rein.',
        'Wir sind eben im Hotel angekommen.',
      ],
      wordFamily: [
        'ankommen (to arrive)',
        'eben erst (just barely / just now)',
        'gerade eben (just a moment ago)',
      ],
      b1ExamTip:
        'Notice how „eben“ has two common jobs in German: „just now“ („Ich bin eben angekommen“) and the modal particle „just / simply“ („Das ist eben so“).',
    },
  },
  {
    id: 'chat-chunk-004',
    lemma: 'So spät erst?',
    spokenText: 'So spät erst?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Überraschung über Zeit',
    translation: 'Only this late? · Really that late?',
    highlightTarget: 'So spät erst',
    phraseDetails: {
      framePattern: 'So + [Adjektiv / Uhrzeit] + erst?',
      casePattern: 'Zeitpartikel „erst“ betont, dass etwas später passiert als erwartet',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sind Sie tatsächlich erst so spät angekommen?',
        textEn: 'Did you really only arrive that late?',
        contextNote: 'Höflich / Vollständige Frage',
      },
      informalVariant: {
        textDe: 'Oh je, so spät erst? Dann schlaf heute bloß aus!',
        textEn: 'Oh dear, only that late? Then definitely sleep in today!',
        contextNote: 'Spontane, sehr natürliche Kurzreaktion',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich war gestern erst um halb zwei zu Hause.',
        promptEn: 'I didn’t get home until 1:30 last night.',
        speakerB: 'Lena',
        replyDe: 'So spät erst? War die Feier so gut?',
        replyEn: 'Only that late? Was the party that good?',
      },
    },
    exampleDe:
      'Felix: Ich bin gestern Nacht um kurz vor zwei angekommen.\nLena: So spät erst? Da bist du heute bestimmt müde!',
    exampleEn:
      'Felix: I got in just before two last night.\nLena: Really that late? You must be tired today!',
    anatomy: {
      caseGovernanceNote:
        'In German, „erst“ before or after a time means „not until / only then“ (later than expected). Compare „schon“ (already, earlier than expected): „So früh schon?“ vs. „So spät erst?“.',
      synonyms: ['Erst so spät?', 'Wirklich so spät?'],
      antonyms: ['So früh schon?'],
      collocations: [
        'Um zwei Uhr erst?',
        'Wir sind erst um Mitternacht losgefahren.',
      ],
      wordFamily: ['erst (only / not until)', 'spät (late)', 'zu spät (too late)'],
      b1ExamTip:
        'Short 3-word reactions like „So spät erst?“ or „So früh schon?“ make you sound instantly fluent at the dinner table.',
    },
  },
  {
    id: 'chat-chunk-005',
    lemma: 'Gar kein Stress!',
    spokenText: 'Gar kein Stress!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Entwarnung & Gelassenheit',
    translation: 'No stress at all! · No rush!',
    highlightTarget: 'Gar kein Stress',
    phraseDetails: {
      framePattern: '(Ach,) gar kein Stress! / Kein Stress!',
      casePattern: 'Negation mit „gar kein“ zur freundlichen Verstärkung',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Bitte machen Sie sich deswegen keinerlei Umstände.',
        textEn: 'Please don’t go to any trouble over this.',
        contextNote: 'Formell / Beruf & Kundenkontakt',
      },
      informalVariant: {
        textDe: 'Gar kein Stress, schreib mir einfach, wenn du Zeit hast!',
        textEn: 'No rush at all, just text me whenever you have time!',
        contextNote: 'Super häufige Entwarnung unter Freunden',
      },
      miniDialog: {
        speakerA: 'Mia',
        promptDe: 'Tut mir leid, ich kann dir die Fotos erst morgen schicken.',
        promptEn: 'Sorry, I can only send you the photos tomorrow.',
        speakerB: 'Jonas',
        replyDe: 'Gar kein Stress, ich habe es überhaupt nicht eilig.',
        replyEn: 'No stress at all, I’m in no hurry whatsoever.',
      },
    },
    exampleDe:
      'Lena: Hey, ich antworte dir später, ich telefoniere gerade!\nFelix: Gar kein Stress, melde dich einfach danach.',
    exampleEn:
      'Lena: Hey, I’ll reply later, I’m on the phone right now!\nFelix: No stress at all, just message me afterwards.',
    anatomy: {
      caseGovernanceNote:
        'Adding „gar“ before „kein“ intensifies the negation warmly („none at all“). Compare „Gar kein Problem!“ and „Gar keine Eile!“.',
      synonyms: ['Kein Problem!', 'Mach dir keinen Stress!', 'Alles entspannt!'],
      antonyms: ['Beeil dich bitte!', 'Es ist dringend!'],
      collocations: [
        'Gar kein Stress, wir haben Zeit.',
        'Gar kein Problem, passiert jedem mal.',
      ],
      wordFamily: ['der Stress (stress)', 'stressig (stressful)', 'gestresst (stressed)'],
      b1ExamTip:
        'Your #1 everyday reassurance chunk when someone apologizes for being late or replying slowly.',
    },
  },
  {
    id: 'chat-chunk-006',
    lemma: 'Kein Druck!',
    spokenText: 'Kein Druck!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Locker bleiben',
    translation: 'No pressure!',
    highlightTarget: 'Kein Druck',
    phraseDetails: {
      framePattern: 'Nur wenn du magst, kein Druck!',
      casePattern: 'Nominativ Maskulin (der Druck → kein Druck)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Fühlen Sie sich bitte zu nichts verpflichtet.',
        textEn: 'Please do not feel obligated in any way.',
        contextNote: 'Formell / Höfliches Angebot',
      },
      informalVariant: {
        textDe: 'Komm einfach mit, wenn du Lust hast – aber wirklich kein Druck!',
        textEn: 'Just come along if you feel like it—seriously no pressure though!',
        contextNote: 'Warm und rücksichtsvoll unter Freunden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Willst du am Samstag mit zum Karaoke kommen? Aber nur wenn du magst, kein Druck!',
        promptEn: 'Do you want to come to karaoke on Saturday? Only if you want to though, no pressure!',
        speakerB: 'Lena',
        replyDe: 'Danke dir, ich überlege es mir bis Freitag.',
        replyEn: 'Thanks, I’ll think it over by Friday.',
      },
    },
    exampleDe:
      'Felix: Du schaffst das! Aber natürlich nur, wenn du magst – kein Druck.\nLena: Danke, ich setze es mir mal als Ziel.',
    exampleEn:
      'Felix: You’ve got this! Only if you want to, of course—no pressure.\nLena: Thanks, I’ll set it as a little goal for myself.',
    anatomy: {
      caseGovernanceNote:
        '„Der Druck“ literally means „pressure“ (masculine). Used elliptically without a verb as a gentle reassurance after an invitation or suggestion.',
      synonyms: ['Ganz ohne Druck!', 'Nur wenn du Lust hast.', 'Kein Zwang!'],
      antonyms: ['Du musst unbedingt mitkommen!'],
      collocations: [
        'Mach dir keinen Druck!',
        'Kein Druck, sag einfach Bescheid.',
      ],
      wordFamily: ['der Druck (pressure)', 'drücken (to press)', 'unter Druck stehen (to be under pressure)'],
      b1ExamTip:
        'Pair „Nur wenn du magst, kein Druck!“ whenever you invite someone so the invitation feels relaxed and genuine.',
    },
  },
  {
    id: 'chat-chunk-007',
    lemma: 'Ich bin gerade nicht zu Hause.',
    spokenText: 'Ich bin gerade nicht zu Hause.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Check-in · Aktueller Ort',
    translation: 'I’m not at home right now.',
    highlightTarget: 'bin gerade nicht zu Hause',
    phraseDetails: {
      framePattern: 'Ich bin gerade nicht zu Hause / unterwegs.',
      casePattern: 'Feste Ortsangabe „zu Hause“ (Wo?) · Zeitadverb „gerade“ (= im Moment)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin im Moment leider nicht erreichbar.',
        textEn: 'I am unfortunately unavailable at the moment.',
        contextNote: 'Formell / Berufliche Nachricht',
      },
      informalVariant: {
        textDe: 'Ich bin gerade nicht zu Hause, ich schaue nachher mal nach.',
        textEn: 'I’m not home right now, I’ll check later.',
        contextNote: 'Alltag / Typische kurze Statusmeldung',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Kannst du mir kurz ein Foto von deiner Zeichnung schicken?',
        promptEn: 'Can you quickly send me a photo of your drawing?',
        speakerB: 'Lena',
        replyDe: 'Ich bin gerade nicht zu Hause, ich schicke es dir später!',
        replyEn: 'I’m not home right now, I’ll send it to you later!',
      },
    },
    exampleDe:
      'Felix: Wie sieht deine Zeichnung eigentlich aus?\nLena: Ich bin gerade nicht zu Hause, ich schicke dir später ein Foto.',
    exampleEn:
      'Felix: What does your drawing actually look like?\nLena: I’m not home right now, I’ll send you a photo later.',
    anatomy: {
      caseGovernanceNote:
        'Always distinguish „zu Hause“ (being at home, static location) from „nach Hause“ (heading home, direction). „Gerade“ expresses the English present progressive („right now“).',
      synonyms: ['Ich bin gerade unterwegs.', 'Ich bin momentan nicht daheim.'],
      antonyms: ['Ich bin schon zu Hause.'],
      collocations: [
        'Bist du gerade zu Hause?',
        'Ich komme erst spät nach Hause.',
      ],
      wordFamily: ['das Haus (house)', 'zu Hause (at home)', 'nach Hause (homeward)'],
      b1ExamTip:
        'German has no „-ing“ form—adding „gerade“ („Ich bin gerade…“, „Ich telefoniere gerade“) is how you express „right now“ naturally.',
    },
  },
  {
    id: 'chat-chunk-008',
    lemma: 'Schicke ich dir später.',
    spokenText: 'Schicke ich dir später.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Alltag · Etwas später zusagen',
    translation: 'I’ll send it to you later.',
    highlightTarget: 'Schicke ich dir später',
    phraseDetails: {
      framePattern: '(Das) schicke ich dir später / nachher / morgen.',
      casePattern: 'schicken + Dativ (Person: dir) + Akkusativ (Sache: es / das)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich sende Ihnen die Unterlagen im Laufe des Tages zu.',
        textEn: 'I will send you the documents later today.',
        contextNote: 'Formell / E-Mail im Beruf',
      },
      informalVariant: {
        textDe: 'Schicke ich dir später, sobald ich wieder im Hotel bin!',
        textEn: 'I’ll send it to you later as soon as I’m back at the hotel!',
        contextNote: 'Natürliche Vorfeld-Auslassung von „Das“ im gesprochenen Deutsch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Hast du zufällig ein Foto von dem Essen gemacht?',
        promptEn: 'Did you happen to take a photo of the food?',
        speakerB: 'Felix',
        replyDe: 'Ja, klar! Schicke ich dir später.',
        replyEn: 'Yeah, of course! I’ll send it to you later.',
      },
    },
    exampleDe:
      'Lena: Schick mir unbedingt die Bilder von eurem Ausflug!\nFelix: Schicke ich dir später, versprochen.',
    exampleEn:
      'Lena: Definitely send me the pictures from your trip!\nFelix: I’ll send them to you later, promise.',
    anatomy: {
      caseGovernanceNote:
        'In natural spoken German, dropping the implied object „Das“ at the start of a sentence is super common: „(Das) schicke ich dir später“, „(Das) mache ich morgen“. Notice „dir“ is Dative (to you).',
      synonyms: ['Ich schicke es dir nachher.', 'Kommt später!'],
      antonyms: ['Ich schicke es dir sofort.'],
      collocations: [
        'Mache ich morgen.',
        'Schicke ich dir gleich.',
        'Sag ich dir später.',
      ],
      wordFamily: ['schicken (to send)', 'zuschicken (to send over)', 'verschicken (to ship/mail)'],
      b1ExamTip:
        'Spoken shortcut: „Mache ich!“, „Schicke ich dir!“, „Sage ich dir!“—dropping leading „Das“ sounds effortlessly native.',
    },
  },
  {
    id: 'chat-chunk-009',
    lemma: 'Gib mir ein bisschen Zeit.',
    spokenText: 'Gib mir ein bisschen Zeit.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Bitte · Um Geduld bitten',
    translation: 'Give me a little time.',
    highlightTarget: 'Gib mir ein bisschen Zeit',
    phraseDetails: {
      framePattern: 'Gib mir (bitte) noch ein bisschen Zeit.',
      casePattern: 'Imperativ von „geben“ (e → i: Gib!) + Dativ (mir)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Bitte geben Sie mir noch etwas Bedenkzeit.',
        textEn: 'Please give me a little more time to consider.',
        contextNote: 'Formell / Beruf & Entscheidungen',
      },
      informalVariant: {
        textDe: 'Ich bin einfach zu langsam beim Tippen – gib mir ein bisschen Zeit!',
        textEn: 'I’m just too slow at typing—give me a little time!',
        contextNote: 'Locker & spielerisch im Chat oder Gespräch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Du hast auf meine letzten fünf Fragen noch gar nicht geantwortet!',
        promptEn: 'You haven’t even answered my last five questions yet!',
        speakerB: 'Felix',
        replyDe: 'Haha, gib mir ein bisschen Zeit, ich lese eine nach der anderen.',
        replyEn: 'Haha, give me a little time, I’m reading them one by one.',
      },
    },
    exampleDe:
      'Lena: Wir haben gerade so viele Themen gleichzeitig!\nFelix: Ja, ich bin zu langsam beim Schreiben – gib mir ein bisschen Zeit.',
    exampleEn:
      'Lena: We have so many topics going at once right now!\nFelix: Yeah, I’m too slow at writing—give me a little time.',
    anatomy: {
      caseGovernanceNote:
        'Irregular imperative of „geben“ changes e → i („Gib!“, never „Gebe!“). „Mir“ is Dative (to me), and „ein bisschen“ is invariable before uncountable nouns like „Zeit“.',
      synonyms: ['Warte kurz!', 'Ich brauche noch einen Moment.'],
      antonyms: ['Ich bin sofort fertig.'],
      collocations: [
        'Gib mir noch fünf Minuten.',
        'Gib mir kurz Bescheid.',
      ],
      wordFamily: ['geben (to give)', 'ein bisschen (a little bit)', 'die Zeit (time)'],
      b1ExamTip:
        'Remember the e → i shift for everyday imperatives: „Gib mir…!“, „Nimm dir…!“, „Sprich langsamer!“.',
    },
  },
  {
    id: 'chat-chunk-010',
    lemma: 'Nimm dir die Zeit, die du brauchst.',
    spokenText: 'Nimm dir die Zeit, die du brauchst.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Großzügig Zeit geben',
    translation: 'Take all the time you need.',
    highlightTarget: 'Nimm dir die Zeit, die du brauchst',
    phraseDetails: {
      framePattern: 'Nimm dir (ruhig) die Zeit, die du brauchst.',
      casePattern: 'Imperativ „nehmen“ (Nimm!) + reflexives Dativpronomen „dir“ + Relativsatz',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Nehmen Sie sich gerne so viel Zeit, wie Sie benötigen.',
        textEn: 'Please feel free to take as much time as you need.',
        contextNote: 'Höflich / Kollegen oder Kunden',
      },
      informalVariant: {
        textDe: 'War nur Spaß – nimm dir die Zeit, die du brauchst!',
        textEn: 'Just joking—take all the time you need!',
        contextNote: 'Sehr herzliche Antwort, wenn jemand sich beeilen will',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Tut mir leid, dass ich heute so langsam antworte.',
        promptEn: 'Sorry for replying so slowly today.',
        speakerB: 'Lena',
        replyDe: 'Alles gut, nimm dir die Zeit, die du brauchst.',
        replyEn: 'All good, take all the time you need.',
      },
    },
    exampleDe:
      'Felix: Ich brauche manchmal etwas länger zum Antworten.\nLena: War nur Spaß, nimm dir die Zeit, die du brauchst!',
    exampleEn:
      'Felix: I sometimes take a bit longer to reply.\nLena: Just joking, take all the time you need!',
    anatomy: {
      caseGovernanceNote:
        '„Sich Zeit nehmen“ uses a dative reflexive pronoun („ich nehme mir Zeit“, „nimm dir Zeit“). The relative pronoun „die“ matches feminine „die Zeit“ in the accusative.',
      synonyms: ['Lass dir ruhig Zeit!', 'Keine Eile!'],
      antonyms: ['Mach mal schneller!'],
      collocations: [
        'Lass dir Zeit!',
        'Ich nehme mir heute Zeit für mich.',
      ],
      wordFamily: ['nehmen (to take)', 'sich Zeit nehmen (to take time)', 'brauchen (to need)'],
      b1ExamTip:
        'A warm, natural follow-up right after teasing a friend—it immediately signals „no hard feelings“.',
    },
  },
  {
    id: 'chat-chunk-011',
    lemma: 'Ich sage dir Bescheid.',
    spokenText: 'Ich sage dir Bescheid.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Absprache · Rückmeldung zusagen',
    translation: 'I’ll let you know.',
    highlightTarget: 'sage dir Bescheid',
    phraseDetails: {
      framePattern: 'Ich sage dir Bescheid / Sag mir Bescheid, wenn …',
      casePattern: 'jemandem (Dativ: dir / mir) Bescheid sagen',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich gebe Ihnen gerne Bescheid, sobald ich genauere Informationen habe.',
        textEn: 'I will gladly let you know as soon as I have more exact details.',
        contextNote: 'Formell / Beruf & Termine',
      },
      informalVariant: {
        textDe: 'Mal schauen, ob es klappt – ich sage dir Bescheid!',
        textEn: 'Let’s see if it works out—I’ll let you know!',
        contextNote: 'Unverzichtbare Wendung im Alltag',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Weißt du schon, wann du nächste Woche wieder in der Stadt bist?',
        promptEn: 'Do you already know when you’re back in town next week?',
        speakerB: 'Felix',
        replyDe: 'Noch nicht genau, aber ich sage dir Bescheid!',
        replyEn: 'Not quite yet, but I’ll let you know!',
      },
    },
    exampleDe:
      'Lena: Gibst du mir kurz ein Zeichen, wenn du im Café bist?\nFelix: Klar, ich sage dir Bescheid, sobald ich losgehe.',
    exampleEn:
      'Lena: Will you give me a quick ping when you’re at the café?\nFelix: Sure, I’ll let you know as soon as I head out.',
    anatomy: {
      caseGovernanceNote:
        '„Bescheid sagen“ or „Bescheid geben“ always takes a Dative person („dir“, „euch“, „Ihnen“). Never translate „let you know“ literally as „lassen wissen“ in casual speech.',
      synonyms: ['Ich gebe dir Bescheid.', 'Ich melde mich bei dir.'],
      antonyms: ['Ich weiß es noch nicht.'],
      collocations: [
        'Sag Bescheid, wenn du es probiert hast!',
        'Ich gebe dir morgen Bescheid.',
        'Weißt du schon Bescheid?',
      ],
      wordFamily: ['der Bescheid (notice / word)', 'Bescheid wissen (to be in the know)', 'Bescheid geben (to let know)'],
      b1ExamTip:
        'Memorize both sides of this pair: „Ich sage dir Bescheid“ (I’ll let you know) and „Sag mir Bescheid!“ (Let me know!).',
    },
  },
  {
    id: 'chat-chunk-012',
    lemma: 'Ich antworte dir in einer ruhigen Minute.',
    spokenText: 'Ich antworte dir in einer ruhigen Minute.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Check-in · Später in Ruhe antworten',
    translation: 'I’ll reply when I get a quiet moment.',
    highlightTarget: 'in einer ruhigen Minute',
    phraseDetails: {
      framePattern: 'Ich antworte dir / melde mich in einer ruhigen Minute.',
      casePattern: 'antworten + Dativ (dir) · in + Dativ Feminin (einer ruhigen Minute)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich melde mich ausführlich bei Ihnen, sobald ich etwas Zeit finde.',
        textEn: 'I will get back to you in detail as soon as I find some time.',
        contextNote: 'Formell / Berufliche Korrespondenz',
      },
      informalVariant: {
        textDe: 'Wir sind schon wieder unterwegs – ich antworte dir in einer ruhigen Minute!',
        textEn: 'We’re already out and about again—I’ll reply once I get a quiet moment!',
        contextNote: 'Sehr höflich und sympathisch unter Freunden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir sind gerade im Museum unterwegs. Ich antworte dir in einer ruhigen Minute!',
        promptEn: 'We’re currently walking around the museum. I’ll reply in a quiet moment!',
        speakerB: 'Lena',
        replyDe: 'Alles klar, viel Spaß euch beiden!',
        replyEn: 'All good, have fun you two!',
      },
    },
    exampleDe:
      'Felix: Wir sind schon wieder unterwegs, ich antworte dir in einer ruhigen Minute.\nLena: Alles klar, gar kein Stress!',
    exampleEn:
      'Felix: We’re already out and about again, I’ll reply when I have a quiet moment.\nLena: Alright, no stress at all!',
    anatomy: {
      caseGovernanceNote:
        '„Antworten“ always governs Dative for the person („ich antworte dir“). „In einer ruhigen Minute“ is an idiomatic Dative time expression meaning „when things calm down“.',
      synonyms: ['Ich melde mich, wenn ich kurz Ruhe habe.', 'Ich schreibe dir später in Ruhe.'],
      antonyms: ['Ich habe gerade alle Zeit der Welt.'],
      collocations: [
        'In einer ruhigen Minute lese ich alles genau.',
        'Wir sprechen in einer ruhigen Minute darüber.',
      ],
      wordFamily: ['ruhig (calm / quiet)', 'die Ruhe (calm)', 'antworten (to answer)'],
      b1ExamTip:
        'A super charming, authentic German idiom—much warmer than a blunt „Ich habe keine Zeit“.',
    },
  },
  {
    id: 'chat-chunk-013',
    lemma: 'Ich mache kurz die Augen zu.',
    spokenText: 'Ich mache kurz die Augen zu.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Alltag · Kurz ausruhen',
    translation: 'I’m going to close my eyes for a bit.',
    highlightTarget: 'mache kurz die Augen zu',
    phraseDetails: {
      framePattern: 'Ich mache (vielleicht gleich mal) kurz die Augen zu.',
      casePattern: 'trennbares Verb „zumachen“ + Akkusativ Plural (die Augen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich werde mich für einen kurzen Moment ausruhen.',
        textEn: 'I am going to rest for a brief moment.',
        contextNote: 'Formell / Ruhig',
      },
      informalVariant: {
        textDe: 'Der Zug ist echt entspannt – ich mache gleich mal kurz die Augen zu.',
        textEn: 'The train is really relaxing—I might shut my eyes for a quick bit.',
        contextNote: 'Natürliche Kombination aus „gleich mal kurz“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Die Zugfahrt dauert noch drei Stunden. Ich mache mal kurz die Augen zu.',
        promptEn: 'The train ride still takes three hours. I’m going to shut my eyes for a bit.',
        speakerB: 'Lena',
        replyDe: 'Gute Idee, schlaf ein bisschen!',
        replyEn: 'Good idea, get a little sleep!',
      },
    },
    exampleDe:
      'Felix: Im Zug ist es echt entspannt, ich mache kurz die Augen zu.\nLena: Mach das, Schlaf ist gut für den Kopf!',
    exampleEn:
      'Felix: It’s really relaxing on the train, I’m going to close my eyes for a bit.\nLena: Go for it, sleep is good for your brain!',
    anatomy: {
      caseGovernanceNote:
        'Notice German uses the definite article „die Augen“ (not „meine Augen“) with body parts when the owner is already the subject. „Zumachen“ is a separable verb („ich mache … zu“).',
      synonyms: ['Ich mache ein kurzes Nickerchen.', 'Ich ruhe mich kurz aus.'],
      antonyms: ['Ich bleibe noch wach.'],
      collocations: [
        'Ich muss erst mal kurz die Augen zumachen.',
        'Mach ruhig mal kurz die Augen zu!',
      ],
      wordFamily: ['das Auge, -n (eye)', 'zumachen (to close)', 'aufmachen (to open)'],
      b1ExamTip:
        'Germans prefer „kurz die Augen zumachen“ over stiff words like „einen Mittagsschlaf halten“ when chatting casually.',
    },
  },
  {
    id: 'chat-chunk-014',
    lemma: 'Mir fallen die Augen zu.',
    spokenText: 'Mir fallen die Augen zu.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Befinden · Sehr müde sein',
    translation: 'I can barely keep my eyes open. · I’m nodding off.',
    highlightTarget: 'Mir fallen die Augen zu',
    phraseDetails: {
      framePattern: 'Mir fallen (langsam / ein bisschen) die Augen zu.',
      casePattern: 'Dativ-Erfahrungssubjekt „Mir“ + trennbares Verb „zufallen“ (Plural)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich merke, dass ich langsam sehr müde werde.',
        textEn: 'I notice that I am slowly getting very tired.',
        contextNote: 'Neutral / Formell',
      },
      informalVariant: {
        textDe: 'Ich würde gern weiterreden, aber mir fallen langsam die Augen zu.',
        textEn: 'I’d love to keep talking, but I can barely keep my eyes open.',
        contextNote: 'Sehr bildhaftes, alltägliches Deutsch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Mir fallen langsam die Augen zu, ich gehe jetzt schlafen.',
        promptEn: 'My eyes are starting to close on me, I’m heading to sleep now.',
        speakerB: 'Lena',
        replyDe: 'Natürlich, schlaf gut und bis morgen!',
        replyEn: 'Of course, sleep well and talk tomorrow!',
      },
    },
    exampleDe:
      'Felix: Ich würde gerne weiter schreiben, aber mir fallen die Augen zu.\nLena: Natürlich, schlaf gut!',
    exampleEn:
      'Felix: I’d love to keep texting, but I can barely keep my eyes open.\nLena: Of course, sleep well!',
    anatomy: {
      caseGovernanceNote:
        'Literally „To me, the eyes fall shut“. The subject is plural „die Augen“ (so the verb is „fallen“), while the tired person is in the Dative („mir“).',
      synonyms: ['Ich bin todmüde.', 'Ich kann kaum noch die Augen offen halten.'],
      antonyms: ['Ich bin hellwach!'],
      collocations: [
        'Mir fallen gleich die Augen zu.',
        'Nach dem Essen fallen mir immer die Augen zu.',
      ],
      wordFamily: ['zufallen (to fall shut)', 'das Auge (eye)', 'einschlafen (to fall asleep)'],
      b1ExamTip:
        'Put „Mir“ in Position 1 to sound super natural—this Dative pattern also powers „Mir ist kalt“ and „Mir gefällt das“.',
    },
  },
  {
    id: 'chat-chunk-015',
    lemma: 'Ruh dich schön aus!',
    spokenText: 'Ruh dich schön aus!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Abschied · Fürsorge & Erholung',
    translation: 'Get some good rest! · Rest up!',
    highlightTarget: 'Ruh dich schön aus',
    phraseDetails: {
      framePattern: 'Ruh dich (erst mal / schön / gut) aus!',
      casePattern: 'Imperativ reflexiv „sich ausruhen“ (trennbar: Ruh dich … aus!)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Erholen Sie sich gut am Wochenende!',
        textEn: 'Have a restful weekend!',
        contextNote: 'Höflich / Kollegen oder Bekannte',
      },
      informalVariant: {
        textDe: 'Das war echt ein langer Tag – ruh dich schön aus!',
        textEn: 'That was a really long day—get some good rest!',
        contextNote: 'Warmherzige Verabschiedung mit „schön“ als freundlicher Verstärkung',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir sind endlich im Hotel angekommen, die Fahrt war ganz schön lang.',
        promptEn: 'We finally made it to the hotel, the trip was pretty long.',
        speakerB: 'Lena',
        replyDe: 'Zum Glück seid ihr da! Dann ruh dich schön aus.',
        replyEn: 'Glad you’re there! Go get some good rest then.',
      },
    },
    exampleDe:
      'Felix: Wir sind endlich im Hotel und haben den Anschluss gerade so geschafft!\nLena: Zum Glück! Dann ruh dich schön aus.',
    exampleEn:
      'Felix: We’re finally at the hotel and we just barely caught our connection!\nLena: Thank goodness! Get some good rest then.',
    anatomy: {
      caseGovernanceNote:
        '„Sich ausruhen“ is both reflexive (Accusative „dich“) and separable („aus-“ goes to the end). Here „schön“ doesn’t mean „pretty“—it means „properly / nicely / thoroughly“.',
      synonyms: ['Erhol dich gut!', 'Schlaf dich richtig aus!'],
      antonyms: ['Mach dich gleich an die Arbeit!'],
      collocations: [
        'Ruh dich erst mal aus!',
        'Ich muss mich am Sonntag mal richtig ausruhen.',
      ],
      wordFamily: ['sich ausruhen (to rest up)', 'die Ruhe (rest / quiet)', 'erholsam (restful)'],
      b1ExamTip:
        'Notice the warm filler „schön“ in imperatives: „Schlaf schön!“, „Ruh dich schön aus!“, „Feier schön!“.',
    },
  },
  {
    id: 'chat-chunk-016',
    lemma: 'Dir auch einen schönen Abend!',
    spokenText: 'Dir auch einen schönen Abend!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Abschied · Freundlicher Gruß',
    translation: 'Have a lovely evening too!',
    highlightTarget: 'Dir auch einen schönen Abend',
    phraseDetails: {
      framePattern: 'Dir / Euch auch einen schönen Abend (noch)!',
      casePattern: 'Dativ „Dir“ + Akkusativ Maskulin „einen schönen Abend“ (verkürzt aus „Ich wünsche dir …“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich wünsche Ihnen ebenfalls einen schönen Abend!',
        textEn: 'I wish you a pleasant evening as well!',
        contextNote: 'Formell / Geschäftlich oder im Laden',
      },
      informalVariant: {
        textDe: 'Danke, bis später! Dir auch erst mal einen schönen Abend!',
        textEn: 'Thanks, talk later! Have a great evening for now too!',
        contextNote: 'Sehr natürliche Verabschiedung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich gehe jetzt mit Mia essen. Schlaf nachher gut!',
        promptEn: 'I’m heading out for dinner with Mia now. Sleep well later!',
        speakerB: 'Felix',
        replyDe: 'Danke! Dir auch einen schönen Abend!',
        replyEn: 'Thanks! Have a lovely evening too!',
      },
    },
    exampleDe:
      'Lena: Viel Spaß heute Abend und bis später!\nFelix: Danke, dir auch einen schönen Abend!',
    exampleEn:
      'Lena: Have fun tonight and talk later!\nFelix: Thanks, have a lovely evening too!',
    anatomy: {
      caseGovernanceNote:
        'Even though „Ich wünsche“ is omitted, the grammar remains: „dir“ (Dative) + „einen schönen Abend“ (Accusative masculine). Same pattern for „Schönes Wochenende!“ (neuter) and „Gute Nacht!“ (feminine).',
      synonyms: ['Schönen Abend dir noch!', 'Einen schönen Abend noch!'],
      antonyms: ['Guten Morgen!'],
      collocations: [
        'Dir auch eine gute Nacht!',
        'Euch auch ein schönes Wochenende!',
      ],
      wordFamily: ['der Abend (evening)', 'schön (nice / lovely)', 'wünschen (to wish)'],
      b1ExamTip:
        'Always use „einen schönen“ (Accusative) for masculine times of day: „einen schönen Tag“, „einen schönen Abend“.',
    },
  },

  // =========================================================================
  // MINI-DECK 2: REAKTIONEN, ZUSTIMMUNG & NECKEREI (017–032)
  // =========================================================================
  {
    id: 'chat-chunk-017',
    lemma: 'Gar nicht mal so schlecht!',
    spokenText: 'Gar nicht mal so schlecht!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Anerkennung & Lob',
    translation: 'Not bad at all! · Pretty decent actually!',
    highlightTarget: 'gar nicht mal so schlecht',
    phraseDetails: {
      framePattern: 'Das ist / Das hast du ja gar nicht mal so schlecht hinbekommen!',
      casePattern: 'Abgeschwächtes Lob mit „gar nicht mal so …“ (typisch deutsch!)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das Ergebnis ist wirklich sehr gelungen.',
        textEn: 'The result turned out really well.',
        contextNote: 'Höflich / Direktes Lob',
      },
      informalVariant: {
        textDe: 'Die Schriftzeichen hast du ja gar nicht mal so schlecht hinbekommen!',
        textEn: 'You actually got the characters looking not bad at all!',
        contextNote: 'Typisch deutsches, leicht neckendes Kompliment',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich habe zum ersten Mal selbst Pizza gebacken – was meinst du?',
        promptEn: 'I baked pizza from scratch for the first time—what do you think?',
        speakerB: 'Lena',
        replyDe: 'Oh, gar nicht mal so schlecht! Schmeckt echt gut.',
        replyEn: 'Oh, not bad at all! It actually tastes really good.',
      },
    },
    exampleDe:
      'Lena: Die Schriftzeichen hast du ja gar nicht mal so schlecht hinbekommen!\nFelix: „Gar nicht so schlecht“ klingt aber auch nicht nach einem riesigen Lob!',
    exampleEn:
      'Lena: You actually got the calligraphy looking not bad at all!\nFelix: “Not that bad” doesn’t exactly sound like huge praise though!',
    anatomy: {
      caseGovernanceNote:
        'Understatement is huge in German: „nicht schlecht“ or „gar nicht mal so schlecht“ is genuinely positive praise—often delivered with a playful grin.',
      synonyms: ['Echt nicht schlecht!', 'Ziemlich gut!', 'Kann sich sehen lassen!'],
      antonyms: ['Das ging leider daneben.'],
      collocations: [
        'Gar nicht mal so schlecht für den ersten Versuch!',
        'Gar nicht mal so teuer!',
      ],
      wordFamily: ['schlecht (bad)', 'gar nicht (not at all)', 'einmal / mal (even / just)'],
      b1ExamTip:
        'Don’t take „gar nicht mal so schlecht“ as criticism—in German everyday culture, it often means „surprisingly good!“.',
    },
  },
  {
    id: 'chat-chunk-018',
    lemma: 'Das reicht mir.',
    spokenText: 'Das reicht mir.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Zufriedenheit zeigen',
    translation: 'That’s good enough for me. · That’s plenty for me.',
    highlightTarget: 'Das reicht mir',
    phraseDetails: {
      framePattern: 'Das reicht mir (schon / völlig).',
      casePattern: 'reichen + Dativ (Person: mir / dir / uns)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist für mich vollkommen ausreichend.',
        textEn: 'That is completely sufficient for me.',
        contextNote: 'Formell / Beruf & Service',
      },
      informalVariant: {
        textDe: 'Halbwegs süß? Das reicht mir schon!',
        textEn: 'Somewhat cute? That’s good enough for me!',
        contextNote: 'Locker & schlagfertig im Gespräch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Möchtest du noch etwas Nachschlag oder noch ein Stück Kuchen?',
        promptEn: 'Would you like seconds or another piece of cake?',
        speakerB: 'Felix',
        replyDe: 'Danke, das reicht mir – ich bin schon richtig satt.',
        replyEn: 'Thanks, that’s plenty for me—I’m already really full.',
      },
    },
    exampleDe:
      'Lena: Na gut, deine Vase ist zumindest halbwegs niedlich.\nFelix: Das reicht mir völlig!',
    exampleEn:
      'Lena: Alright, your vase is at least somewhat cute.\nFelix: That’s plenty good enough for me!',
    anatomy: {
      caseGovernanceNote:
        '„Reichen“ takes a Dative person („mir“ = for me). Watch the intonation: warm tone means „I’m happy with that“, whereas an angry „Jetzt reicht es mir!“ means „I’ve had enough!“.',
      synonyms: ['Das genügt mir.', 'Damit bin ich zufrieden.'],
      antonyms: ['Das ist mir noch zu wenig.'],
      collocations: [
        'Danke, das reicht mir schon.',
        'Reicht dir das?',
        'Das reicht für heute.',
      ],
      wordFamily: ['reichen (to be enough)', 'ausreichen (to suffice)', 'ausreichend (sufficient)'],
      b1ExamTip:
        'Super handy at the dinner table: „Danke, das reicht mir!“ politely says you have enough food or drink.',
    },
  },
  {
    id: 'chat-chunk-019',
    lemma: 'Gut zu wissen!',
    spokenText: 'Gut zu wissen!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Info aufnehmen',
    translation: 'Good to know!',
    highlightTarget: 'Gut zu wissen',
    phraseDetails: {
      framePattern: '(Aha / Oh,) gut zu wissen!',
      casePattern: 'Infinitiv mit „zu“ als kurze Standardreaktion',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Vielen Dank für den Hinweis, das ist sehr gut zu wissen.',
        textEn: 'Thank you for the tip, that is very good to know.',
        contextNote: 'Höflich / Kollegen oder Beratung',
      },
      informalVariant: {
        textDe: 'Ach so, du kannst überall schlafen? Haha, gut zu wissen!',
        textEn: 'Oh really, you can sleep anywhere? Haha, good to know!',
        contextNote: 'Alltag / Oft auch leicht augenzwinkernd',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Am Sonntag hat die Bäckerei an der Ecke übrigens schon ab sieben Uhr auf.',
        promptEn: 'By the way, the bakery on the corner opens at seven on Sundays.',
        speakerB: 'Lena',
        replyDe: 'Oh, gut zu wissen! Dann hole ich morgen früh frische Brötchen.',
        replyEn: 'Oh, good to know! I’ll grab fresh rolls tomorrow morning then.',
      },
    },
    exampleDe:
      'Felix: Bei meinen bescheidenen Malkünsten gebe ich mich schnell zufrieden.\nLena: Haha, gut zu wissen!',
    exampleEn:
      'Felix: Given my modest painting skills, I’m easily satisfied.\nLena: Haha, good to know!',
    anatomy: {
      caseGovernanceNote:
        'Fixed infinitive expression: „gut zu wissen“ (good to know). You can also expand it with „dass“: „Gut zu wissen, dass der Zug Verspätung hat.“',
      synonyms: ['Danke für den Tipp!', 'Merke ich mir!'],
      antonyms: ['Das wusste ich schon.'],
      collocations: [
        'Gut zu wissen, danke!',
        'Gut zu wissen, dass du morgen Zeit hast.',
      ],
      wordFamily: ['wissen (to know)', 'das Wissen (knowledge)', 'bewusst (conscious)'],
      b1ExamTip:
        'One of the easiest conversation glue phrases—gives you an instant, natural reaction while keeping the chat moving.',
    },
  },
  {
    id: 'chat-chunk-020',
    lemma: 'Da hast du auf jeden Fall recht.',
    spokenText: 'Da hast du auf jeden Fall recht.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Zustimmung · Klar beipflichten',
    translation: 'You’re definitely right about that.',
    highlightTarget: 'Da hast du auf jeden Fall recht',
    phraseDetails: {
      framePattern: 'Da hast du (auf jeden Fall / völlig / absolut) recht.',
      casePattern: 'Pronominaladverb „da“ (= dabei) + recht haben + auf + Akkusativ (jeden Fall)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'In diesem Punkt gebe ich Ihnen vollkommen recht.',
        textEn: 'On that point I completely agree with you.',
        contextNote: 'Formell / Diskussion & Beruf',
      },
      informalVariant: {
        textDe: 'Da hast du auf jeden Fall recht – spontan wird es immer am besten!',
        textEn: 'You’re definitely right about that—spontaneous always turns out best!',
        contextNote: 'Warm und überzeugend zustimmen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Spontan entstehen doch meistens die schönsten Erinnerungen.',
        promptEn: 'The best memories usually happen spontaneously anyway.',
        speakerB: 'Felix',
        replyDe: 'Da hast du auf jeden Fall recht, und wir haben keinen Zeitdruck.',
        replyEn: 'You’re definitely right about that, and we’re not on a schedule.',
      },
    },
    exampleDe:
      'Lena: Spontan entstehen doch immer die besten Erinnerungen!\nFelix: Da hast du auf jeden Fall recht.',
    exampleEn:
      'Lena: The best memories always happen spontaneously!\nFelix: You’re definitely right about that.',
    anatomy: {
      caseGovernanceNote:
        'In German you „have right“ („recht haben“, never „recht sein“!). „Auf jeden Fall“ (masculine Accusative) means „definitely / in any case“.',
      synonyms: ['Das stimmt absolut!', 'Du hast völlig recht!'],
      antonyms: ['Da bin ich anderer Meinung.', 'Das sehe ich anders.'],
      collocations: [
        'Auf jeden Fall!',
        'Da hast du recht.',
        'Da muss ich dir recht geben.',
      ],
      wordFamily: ['recht haben (to be right)', 'der Fall (case)', 'auf keinen Fall (no way)'],
      b1ExamTip:
        'Great dinner-table reflex: starting with „Da hast du…“ refers right back to what your friend just said.',
    },
  },
  {
    id: 'chat-chunk-021',
    lemma: 'Auch wahr!',
    spokenText: 'Auch wahr!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Zustimmung · Kurzer Einwurf',
    translation: 'Fair point! · True as well!',
    highlightTarget: 'Auch wahr',
    phraseDetails: {
      framePattern: '(Stimmt,) auch wahr! / Das ist auch wieder wahr.',
      casePattern: 'Verkürzte Reaktion (aus „Das ist auch wahr“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist ebenfalls ein guter Punkt.',
        textEn: 'That is a good point as well.',
        contextNote: 'Formell / Gesprächsrunde',
      },
      informalVariant: {
        textDe: 'Auch wahr, im Rucksack ist ja kaum noch Platz!',
        textEn: 'True as well, there’s barely any room left in the backpack!',
        contextNote: 'Knapp und natürlich beim Zuhören',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich würde dir gern etwas mitbringen, aber mein Rucksack ist schon voll.',
        promptEn: 'I’d love to bring you something back, but my backpack is already full.',
        speakerB: 'Lena',
        replyDe: 'Auch wahr! Genieß einfach deinen Urlaub.',
        replyEn: 'Fair point! Just enjoy your vacation.',
      },
    },
    exampleDe:
      'Felix: Das eine schließt das andere zum Glück nicht aus – nur der Platz im Rucksack ist knapp.\nLena: Auch wahr!',
    exampleEn:
      'Felix: Luckily one doesn’t rule out the other—it’s just the space in my backpack that’s tight.\nLena: Fair point!',
    anatomy: {
      caseGovernanceNote:
        'A classic spoken ellipsis dropping „Das ist“. Germans also love the slight expansion „Das ist auch wieder wahr“ („Actually, that’s true too“).',
      synonyms: ['Stimmt auch wieder.', 'Da ist was dran.', 'Guter Punkt!'],
      antonyms: ['Das stimmt so nicht.'],
      collocations: [
        'Stimmt, auch wahr!',
        'Das ist auch wieder wahr.',
      ],
      wordFamily: ['wahr (true)', 'die Wahrheit (truth)', 'wahrscheinlich (probably)'],
      b1ExamTip:
        'Active listening cue: dropping a quick „Auch wahr!“ shows you’re genuinely following a friend’s story.',
    },
  },
  {
    id: 'chat-chunk-022',
    lemma: 'Verständlich!',
    spokenText: 'Verständlich!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Verständnis zeigen',
    translation: 'Totally understandable! · Makes sense!',
    highlightTarget: 'Verständlich',
    phraseDetails: {
      framePattern: '(Total / Absolut) verständlich! / Verständlich, dass …',
      casePattern: 'Adjektiv als Ein-Wort-Reaktion oder mit „dass“-Nebensatz',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist absolut nachvollziehbar.',
        textEn: 'That is completely understandable.',
        contextNote: 'Formell / Beruf & Diskussion',
      },
      informalVariant: {
        textDe: 'Verständlich, dass man nach dreißigtausend Schritten komplett kaputt ist!',
        textEn: 'Totally understandable that you’re completely wiped out after 30,000 steps!',
        contextNote: 'Empathisch und locker im Gespräch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Mir hat es immer mehr Spaß gemacht, selbst zu spielen als zuzuschauen.',
        promptEn: 'I always enjoyed playing myself more than watching.',
        speakerB: 'Lena',
        replyDe: 'Verständlich! Selbst aktiv sein ist viel spannender.',
        replyEn: 'Totally understandable! Being active yourself is much more exciting.',
      },
    },
    exampleDe:
      'Felix: Irgendwie hat es mir mehr Spaß gemacht, selbst Fußball zu spielen als zuzuschauen.\nLena: Verständlich!',
    exampleEn:
      'Felix: Somehow I had more fun playing soccer myself than watching it.\nLena: Totally understandable!',
    anatomy: {
      caseGovernanceNote:
        'Derived from „verstehen“ (to understand) + „-lich“ (-able). Can stand alone as a one-word empathy reaction or open a clause: „Verständlich, dass …“.',
      synonyms: ['Klar, verstehe ich.', 'Nachvollziehbar!', 'Macht Sinn!'],
      antonyms: ['Unverständlich!', 'Das verstehe ich nicht.'],
      collocations: [
        'Total verständlich!',
        'Absolut verständlich, dass du müde bist.',
      ],
      wordFamily: ['verstehen (to understand)', 'das Verständnis (understanding)', 'verständlich (understandable)'],
      b1ExamTip:
        'Quick empathy booster—use „Verständlich!“ whenever someone explains a personal preference or feeling.',
    },
  },
  {
    id: 'chat-chunk-023',
    lemma: 'Alles gut!',
    spokenText: 'Alles gut!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Beruhigen & Verzeihen',
    translation: 'All good! · No worries!',
    highlightTarget: 'Alles gut',
    phraseDetails: {
      framePattern: '(Ach,) alles gut! / Alles gut, verstehe ich.',
      casePattern: 'Kurze Entwarnung (auch als Frage: „Alles gut?“ = „Everything okay?“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das macht überhaupt nichts, kein Grund zur Sorge.',
        textEn: 'That doesn’t matter at all, no reason to worry.',
        contextNote: 'Formell / Höfliche Entwarnung',
      },
      informalVariant: {
        textDe: 'Ach, alles gut, du hast doch gar nichts Schlimmes gesagt!',
        textEn: 'Aw, all good, you didn’t say anything bad at all!',
        contextNote: 'Eine der häufigsten Wendungen im jungen Deutsch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Oh nein, tut mir leid, das wusste ich gar nicht!',
        promptEn: 'Oh no, I’m sorry, I didn’t know that at all!',
        speakerB: 'Felix',
        replyDe: 'Alles gut, du konntest es ja nicht wissen.',
        replyEn: 'All good, there’s no way you could have known.',
      },
    },
    exampleDe:
      'Lena: Oh nein, tut mir leid, das habe ich ganz vergessen!\nFelix: Ach, alles gut, ist überhaupt kein Problem.',
    exampleEn:
      'Lena: Oh no, I’m sorry, I completely forgot about that!\nFelix: Aw, all good, it’s not a problem at all.',
    anatomy: {
      caseGovernanceNote:
        'Works both as a statement („Alles gut!“ = No worries!) and as a gentle check-in question („Alles gut bei dir?“ = Everything alright with you?).',
      synonyms: ['Kein Problem!', 'Schon gut!', 'Macht nichts!'],
      antonyms: ['Gar nichts ist gut!'],
      collocations: [
        'Alles gut, mach dir keinen Kopf!',
        'Alles gut bei dir?',
      ],
      wordFamily: ['alles (everything)', 'gut (good)', 'schon gut (never mind / it’s fine)'],
      b1ExamTip:
        'You will hear „Alles gut!“ ten times a day in Germany—for minor bumps, late replies, and friendly check-ins.',
    },
  },
  {
    id: 'chat-chunk-024',
    lemma: 'Ich nehme meine Aussage zurück.',
    spokenText: 'Ich nehme meine Aussage zurück.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Sich korrigieren',
    translation: 'I take that back! · I retract my statement.',
    highlightTarget: 'nehme meine Aussage zurück',
    phraseDetails: {
      framePattern: 'Oh, das wusste ich nicht – ich nehme meine Aussage zurück!',
      casePattern: 'trennbares Verb „zurücknehmen“ + Akkusativ Feminin (meine Aussage)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Entschuldigen Sie bitte, da lag ich falsch – ich nehme das zurück.',
        textEn: 'Please excuse me, I was mistaken—I take that back.',
        contextNote: 'Höflich / Diskussion',
      },
      informalVariant: {
        textDe: 'Oh nein, das wusste ich nicht – ich nehme meine Aussage sofort zurück!',
        textEn: 'Oh no, I didn’t know that—I take my comment back immediately!',
        contextNote: 'Spielerisch-dramatisch und sympathisch im Gespräch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Die Weisheitszahn-OP hat sich damals leider entzündet und hat Monate gedauert.',
        promptEn: 'The wisdom tooth surgery got infected back then and dragged on for months.',
        speakerB: 'Lena',
        replyDe: 'Oh nein, das wusste ich nicht! Ich nehme meine Aussage zurück.',
        replyEn: 'Oh no, I didn’t know that! I take back what I said.',
      },
    },
    exampleDe:
      'Felix: Nach der OP war ich leider monatelang raus aus dem Training.\nLena: Oh nein, das wusste ich nicht – ich nehme meine Aussage zurück!',
    exampleEn:
      'Felix: After the surgery I was sadly out of training for months.\nLena: Oh no, I didn’t know that—I take that back!',
    anatomy: {
      caseGovernanceNote:
        '„Zurücknehmen“ is separable („ich nehme … zurück“) and takes an Accusative object („meine Aussage“ or simply „das“: „Ich nehme alles zurück“).',
      synonyms: ['Ich nehme alles zurück!', 'Da habe ich mich geirrt.'],
      antonyms: ['Ich bleibe bei meiner Meinung.'],
      collocations: [
        'Ich nehme alles zurück!',
        'Tut mir leid, das nehme ich zurück.',
      ],
      wordFamily: ['zurücknehmen (to take back)', 'die Aussage (statement)', 'aussagen (to state)'],
      b1ExamTip:
        'Using „meine Aussage“ adds a fun, slightly mock-serious tone when you walk back a playful tease.',
    },
  },
  {
    id: 'chat-chunk-025',
    lemma: 'Du hast doch nichts Schlimmes gesagt.',
    spokenText: 'Du hast doch nichts Schlimmes gesagt.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Modalpartikel „doch“',
    translation: 'You didn’t say anything bad! · Come on, you said nothing wrong.',
    highlightTarget: 'hast doch nichts Schlimmes gesagt',
    phraseDetails: {
      framePattern: 'Du hast doch nichts Schlimmes / Falsches gesagt!',
      casePattern: 'Modalpartikel „doch“ (beruhigend) + „nichts“ + nominalisiertes Adjektiv (Schlimmes)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sie haben wirklich nichts Unangemessenes gesagt.',
        textEn: 'You really did not say anything inappropriate.',
        contextNote: 'Formell / Beruhigend',
      },
      informalVariant: {
        textDe: 'Du hast doch nichts Schlimmes gesagt, alles gut!',
        textEn: 'Hey, you didn’t say anything bad, it’s all good!',
        contextNote: 'Warm und beruhigend durch die Partikel „doch“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Tut mir leid, das war vielleicht etwas unsensibel von mir.',
        promptEn: 'Sorry, that might have been a bit insensitive of me.',
        speakerB: 'Felix',
        replyDe: 'Ach was, du hast doch nichts Schlimmes gesagt!',
        replyEn: 'Not at all, you didn’t say anything bad!',
      },
    },
    exampleDe:
      'Lena: Oh je, ich nehme meine Aussage sofort zurück!\nFelix: Du hast doch nichts Schlimmes gesagt, alles gut.',
    exampleEn:
      'Lena: Oh dear, I take back what I said right away!\nFelix: You didn’t say anything bad, it’s all good.',
    anatomy: {
      caseGovernanceNote:
        'Two key A2 patterns in one chunk: (1) After „nichts / etwas / viel“, adjectives become capitalized neuter nouns ending in „-es“ („nichts Schlimmes“, „etwas Gutes“). (2) Modal particle „doch“ gently reassures the listener.',
      synonyms: ['War doch gar nicht schlimm!', 'Kein Problem, wirklich!'],
      antonyms: ['Das war wirklich gemein.'],
      collocations: [
        'Nichts Schlimmes passiert.',
        'Das ist doch nicht schlimm!',
      ],
      wordFamily: ['schlimm (bad / serious)', 'nichts (nothing)', 'sagen (to say)'],
      b1ExamTip:
        'Capitalize adjectives after „nichts / etwas / viel“: „nichts Schlimmes“, „etwas Leckeres“, „viel Neues“.',
    },
  },
  {
    id: 'chat-chunk-026',
    lemma: 'Stimmt!',
    spokenText: 'Stimmt!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Spontanes Erinnern',
    translation: 'True! · Oh right, that’s right!',
    highlightTarget: 'Stimmt',
    phraseDetails: {
      framePattern: '(Oh / Ach,) stimmt! / Stimmt, das habe ich ganz vergessen.',
      casePattern: '3. Person Singular von „stimmen“ (verkürzt aus „Das stimmt!“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Da haben Sie recht, das stimmt.',
        textEn: 'You are right about that, that is true.',
        contextNote: 'Höflich / Zustimmung',
      },
      informalVariant: {
        textDe: 'Oh, stimmt! Das habe ich neulich wirklich gesagt!',
        textEn: 'Oh, right! I really did say that the other day!',
        contextNote: 'Spontaner Aha-Moment im Gespräch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Du meintest doch auch, dass Stricken gut für das Gehirn ist.',
        promptEn: 'You also said that knitting is good for the brain, didn’t you?',
        speakerB: 'Lena',
        replyDe: 'Oh, stimmt! Dein Gedächtnis ist echt besser als meins.',
        replyEn: 'Oh, right! Your memory is seriously better than mine.',
      },
    },
    exampleDe:
      'Felix: Du hast doch neulich erzählt, dass du einen jüngeren Bruder hast.\nLena: Ach, stimmt! Dein Gedächtnis ist echt gut.',
    exampleEn:
      'Felix: You mentioned the other day that you have a younger brother.\nLena: Oh, right! Your memory is really good.',
    anatomy: {
      caseGovernanceNote:
        '„Stimmen“ literally means „to be in tune / to match / to be correct“. Saying „Stimmt!“ works both for agreeing with someone AND for sudden realization („Oh right!“).',
      synonyms: ['Genau!', 'Das stimmt!', 'Richtig!'],
      antonyms: ['Stimmt nicht!', 'Das kann nicht sein.'],
      collocations: [
        'Ach, stimmt ja!',
        'Stimmt genau!',
        'Stimmt schon, aber …',
      ],
      wordFamily: ['stimmen (to be right)', 'zustimmen (to agree)', 'die Stimme (voice)'],
      b1ExamTip:
        'Try „Ach, stimmt ja!“ when someone reminds you of something you forgot—the „ja“ adds natural „oh of course!“ warmth.',
    },
  },
  {
    id: 'chat-chunk-027',
    lemma: 'Oh Mann, typisch!',
    spokenText: 'Oh Mann, typisch!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Spielendes Kopfschütteln',
    translation: 'Oh man, typical!',
    highlightTarget: 'Oh Mann, typisch',
    phraseDetails: {
      framePattern: 'Oh Mann, typisch (für …)!',
      casePattern: 'Ausruf + Adjektiv „typisch“ (oft mit „für + Akkusativ“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das war fast zu erwarten.',
        textEn: 'That was almost to be expected.',
        contextNote: 'Neutral / Formell',
      },
      informalVariant: {
        textDe: 'Einen Beutel nur spontan eingepackt? Oh Mann, typisch!',
        textEn: 'Just threw a tote bag in spontaneously? Oh man, typical!',
        contextNote: 'Freundliches Necken unter Freunden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich war überhaupt nicht vorbereitet, ich habe den Beutel nur zufällig eingepackt.',
        promptEn: 'I wasn’t prepared at all, I just threw the tote bag in by chance.',
        speakerB: 'Lena',
        replyDe: 'Oh Mann, typisch! Hauptsache, es passt alles rein.',
        replyEn: 'Oh man, typical! Main thing is everything fits.',
      },
    },
    exampleDe:
      'Felix: Ich habe überhaupt nicht geplant, sondern alles ganz spontan eingepackt.\nLena: Oh Mann, typisch!',
    exampleEn:
      'Felix: I didn’t plan at all, I just packed everything totally spontaneously.\nLena: Oh man, typical!',
    anatomy: {
      caseGovernanceNote:
        '„Oh Mann!“ is gender-neutral in German—said to anyone as an exclamation of playful exasperation or sympathy (just like „Oh man!“). Note the spelling: double „n“ („Mann“).',
      synonyms: ['War ja klar!', 'Typisch für dich!'],
      antonyms: ['Das hätte ich nicht gedacht!'],
      collocations: [
        'Typisch für mich!',
        'Typisch deutsches Wetter!',
      ],
      wordFamily: ['typisch (typical)', 'untypisch (atypical)', 'der Typ (type / guy)'],
      b1ExamTip:
        'Add „für + Akkusativ“ when specifying who or what: „Typisch für Felix!“, „Typisch für Montagmorgen!“.',
    },
  },
  {
    id: 'chat-chunk-028',
    lemma: 'Das spreche ich jetzt nicht aus.',
    spokenText: 'Das spreche ich jetzt nicht aus.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Etwas offen lassen',
    translation: 'I’m not going to say that out loud.',
    highlightTarget: 'spreche ich jetzt nicht aus',
    phraseDetails: {
      framePattern: 'Das spreche ich (jetzt) lieber nicht aus.',
      casePattern: 'trennbares Verb „aussprechen“ + Objekt „Das“ auf Position 1 (Inversion)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Dazu möchte ich mich lieber nicht äußern.',
        textEn: 'I would rather not comment on that.',
        contextNote: 'Formell / Diplomatisch',
      },
      informalVariant: {
        textDe: 'Typisch für wen? Haha, das spreche ich jetzt nicht aus!',
        textEn: 'Typical for whom? Haha, I’m not saying that out loud!',
        contextNote: 'Augenzwinkernde Neckerei am Tisch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wie meinst du das – typisch für wen denn genau?',
        promptEn: 'What do you mean—typical for whom exactly?',
        speakerB: 'Lena',
        replyDe: 'Haha, das spreche ich jetzt nicht aus!',
        replyEn: 'Haha, I’m not going to say that out loud!',
      },
    },
    exampleDe:
      'Felix: „Typisch“ – für wen denn genau?\nLena: Das spreche ich jetzt nicht aus!',
    exampleEn:
      'Felix: “Typical”—for whom exactly?\nLena: I’m not going to say that out loud!',
    anatomy: {
      caseGovernanceNote:
        'Placing „Das“ in Position 1 emphasizes the unspoken thought and triggers subject-verb inversion („spreche ich“). Separable prefix „aus“ lands at the end.',
      synonyms: ['Das sage ich jetzt lieber nicht.', 'Kein Kommentar!'],
      antonyms: ['Ich sage es dir ganz offen.'],
      collocations: [
        'Sprich es ruhig aus!',
        'Einen Gedanken laut aussprechen.',
      ],
      wordFamily: ['aussprechen (to pronounce / say out loud)', 'die Aussprache (pronunciation)', 'sprechen (to speak)'],
      b1ExamTip:
        'Great playful comeback when teasing a friend without giving away the punchline.',
    },
  },
  {
    id: 'chat-chunk-029',
    lemma: 'Sagt mir leider nichts.',
    spokenText: 'Sagt mir leider nichts.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Etwas nicht kennen',
    translation: 'Doesn’t ring a bell, sorry. · Never heard of it.',
    highlightTarget: 'sagt mir leider nichts',
    phraseDetails: {
      framePattern: '(Das / Der Name) sagt mir (glaube ich / leider) nichts.',
      casePattern: 'jemandem (Dativ: mir) nichts sagen = unbekannt sein',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Dieser Name ist mir leider nicht bekannt.',
        textEn: 'I am unfortunately not familiar with that name.',
        contextNote: 'Formell / Beruf & Kontakte',
      },
      informalVariant: {
        textDe: 'Jonas aus dem Sportkurs? Hmm, sagt mir glaube ich nichts.',
        textEn: 'Jonas from the sports class? Hmm, doesn’t ring a bell I think.',
        contextNote: 'Super natürlich, wenn man eine Person, Serie oder ein Lokal nicht kennt',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Kennst du Jonas aus dem Sportkurs? Den hast du neulich bestimmt gesehen.',
        promptEn: 'Do you know Jonas from the sports class? You must have seen him the other day.',
        speakerB: 'Lena',
        replyDe: 'Hmm, sagt mir leider nichts.',
        replyEn: 'Hmm, doesn’t ring a bell, sorry.',
      },
    },
    exampleDe:
      'Felix: Kennst du Mia aus dem Sportkurs?\nLena: Hmm, der Name sagt mir leider nichts.',
    exampleEn:
      'Felix: Do you know Mia from the sports class?\nLena: Hmm, the name doesn’t ring a bell, sorry.',
    anatomy: {
      caseGovernanceNote:
        'Idiomatic use of „sagen + Dativ“: „Das sagt mir was“ (That rings a bell) vs. „Das sagt mir nichts“ (That doesn’t ring a bell). Works for people, movies, restaurants, and bands!',
      synonyms: ['Kenne ich leider nicht.', 'Habe ich noch nie gehört.'],
      antonyms: ['Ja, das sagt mir was!', 'Kenne ich!'],
      collocations: [
        'Sagt dir der Film etwas?',
        'Der Name sagt mir irgendwas.',
      ],
      wordFamily: ['sagen (to say)', 'etwas (something)', 'nichts (nothing)'],
      b1ExamTip:
        'Essential dinner-table survival phrase whenever friends drop names of bands, cafés, or acquaintances you don’t know.',
    },
  },
  {
    id: 'chat-chunk-030',
    lemma: 'Du gibst dich damit schon zufrieden?',
    spokenText: 'Du gibst dich damit schon zufrieden?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Ungläubig nachhaken',
    translation: 'You’re already satisfied with that? · You’re settling for that?',
    highlightTarget: 'gibst dich damit schon zufrieden',
    phraseDetails: {
      framePattern: 'Du gibst dich mit … / damit schon zufrieden?',
      casePattern: 'sich zufrieden geben mit + Dativ (Pronominaladverb: damit)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sind Sie mit diesem Ergebnis bereits zufrieden?',
        textEn: 'Are you already satisfied with this result?',
        contextNote: 'Formell / Sachliche Rückfrage',
      },
      informalVariant: {
        textDe: 'Du gibst dich mit „halbwegs gut“ schon zufrieden?',
        textEn: 'You’re already happy with “sort of good”?',
        contextNote: 'Neckende Aussagefrage mit steigender Intonation',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wenn die Note einfach zum Bestehen reicht, bin ich glücklich.',
        promptEn: 'If the grade is just enough to pass, I’m happy.',
        speakerB: 'Lena',
        replyDe: 'Echt? Du gibst dich damit schon zufrieden?',
        replyEn: 'Really? You’re already satisfied with that?',
      },
    },
    exampleDe:
      'Felix: „Nicht schlecht“ reicht mir völlig!\nLena: Echt jetzt? Du gibst dich damit schon zufrieden?',
    exampleEn:
      'Felix: “Not bad” is plenty for me!\nLena: Seriously? You’re already satisfied with that?',
    anatomy: {
      caseGovernanceNote:
        '„Sich mit etwas zufrieden geben“ (to settle for / be satisfied with). Notice how turning a statement into a question with rising intonation („Du gibst dich…?“ instead of „Gibst du dich…?“ expresses playful disbelief.',
      synonyms: ['Das reicht dir wirklich schon?', 'Bist du damit echt zufrieden?'],
      antonyms: ['Du willst immer mehr!'],
      collocations: [
        'Ich gebe mich nicht so leicht zufrieden.',
        'Bist du damit zufrieden?',
      ],
      wordFamily: ['zufrieden (satisfied)', 'die Zufriedenheit (satisfaction)', 'sich zufrieden geben (to settle for)'],
      b1ExamTip:
        'Rising-intonation questions („Du gehst schon?“, „Du gibst dich damit zufrieden?“) are a huge part of spoken German surprise.',
    },
  },
  {
    id: 'chat-chunk-031',
    lemma: 'Ist auch egal.',
    spokenText: 'Ist auch egal.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Thema locker abhaken',
    translation: 'Doesn’t matter anyway. · Never mind, no big deal.',
    highlightTarget: 'Ist auch egal',
    phraseDetails: {
      framePattern: '(Na ja,) ist auch egal. / Ist mir eigentlich egal.',
      casePattern: 'Verkürzt aus „Das ist auch egal“ · mit „auch“ freundlich abgemildert',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das spielt letztlich keine große Rolle.',
        textEn: 'That ultimately does not play a big role.',
        contextNote: 'Formell / Sachlich',
      },
      informalVariant: {
        textDe: 'Hmm, na ja, ist auch egal – Hauptsache, du hattest Recht!',
        textEn: 'Hmm, oh well, doesn’t matter anyway—main thing is you were right!',
        contextNote: 'Lockeres Weitergehen im Gespräch ohne Schroffheit',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich kann gar nicht genau erklären, warum du wie ein großer Bruder wirkst.',
        promptEn: 'I can’t even explain why you give off older-brother energy.',
        speakerB: 'Felix',
        replyDe: 'Na ja, ist auch egal – du hast scheinbar einen guten Instinkt!',
        replyEn: 'Oh well, doesn’t matter anyway—you seem to have good instincts!',
      },
    },
    exampleDe:
      'Lena: Ich weiß gar nicht mehr genau, warum ich das dachte.\nFelix: Na ja, ist auch egal, du hast ja richtig geraten!',
    exampleEn:
      'Lena: I don’t even remember exactly why I thought that.\nFelix: Oh well, doesn’t matter anyway, you guessed right!',
    anatomy: {
      caseGovernanceNote:
        'Adding „auch“ („Ist auch egal“) softens „egal“ so it sounds lighthearted and breezy rather than dismissive or annoyed.',
      synonyms: ['Macht nichts.', 'Nicht so wichtig.', 'Schwamm drüber!'],
      antonyms: ['Das ist mir sehr wichtig!'],
      collocations: [
        'Mir ist es egal, wo wir essen.',
        'Egal, passiert mal!',
      ],
      wordFamily: ['egal (doesn’t matter)', 'gleichgültig (indifferent)'],
      b1ExamTip:
        'A plain „Egal.“ can sound blunt, whereas „Na ja, ist auch egal“ keeps the conversation warm and upbeat.',
    },
  },
  {
    id: 'chat-chunk-032',
    lemma: 'Das klingt richtig gut!',
    spokenText: 'Das klingt richtig gut!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Begeisterung zeigen',
    translation: 'That sounds really good!',
    highlightTarget: 'Das klingt richtig gut',
    phraseDetails: {
      framePattern: 'Das klingt / Das hört sich richtig gut an!',
      casePattern: 'klingen + Adjektiv (richtig = verstärkend „sehr / wirklich“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das klingt nach einem sehr guten Plan.',
        textEn: 'That sounds like a very good plan.',
        contextNote: 'Höflich / Beruf & Planung',
      },
      informalVariant: {
        textDe: 'Das klingt richtig gut, freut mich total!',
        textEn: 'That sounds really good, I’m super happy to hear that!',
        contextNote: 'Natürliche positive Reaktion',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Am Wochenende fahren wir an den See und abends wird gegrillt.',
        promptEn: 'This weekend we’re heading to the lake and barbecuing in the evening.',
        speakerB: 'Felix',
        replyDe: 'Oh, das klingt richtig gut! Ich wünsche euch tolles Wetter.',
        replyEn: 'Oh, that sounds really good! I hope you get great weather.',
      },
    },
    exampleDe:
      'Lena: Ich habe mir vorgenommen, das bald mal auszuprobieren.\nFelix: Das klingt richtig gut, sag Bescheid, wie es war!',
    exampleEn:
      'Lena: I’ve decided to give it a try sometime soon.\nFelix: That sounds really good, let me know how it went!',
    anatomy: {
      caseGovernanceNote:
        'In spoken German, „richtig“ before an adjective works just like „really / super“ („richtig gut“, „richtig lecker“, „richtig anstrengend“). Compare „klingen“ and „sich anhören“.',
      synonyms: ['Das hört sich super an!', 'Klingt toll!'],
      antonyms: ['Das klingt nicht so toll.'],
      collocations: [
        'Klingt nach einem Plan!',
        'Das klingt super entspannt.',
        'Das hört sich richtig lecker an!',
      ],
      wordFamily: ['klingen (to sound)', 'der Klang (sound)', 'sich anhören (to sound like)'],
      b1ExamTip:
        'Use „Das klingt richtig gut!“ or „Klingt nach einem Plan!“ whenever a friend suggests dinner, a trip, or a weekend activity.',
    },
  },
];
