import type { VocabCard } from './vocabData';

/**
 * Curated A1–A2 Conversational Chunks & Social Reactions (Part 2: 033–064)
 * - Mini-Deck 3 (chat-chunk-033 .. chat-chunk-048): Unterwegs, Pläne & Reisen
 * - Mini-Deck 4 (chat-chunk-049 .. chat-chunk-064): Alltag, Essen & Freundeskreis
 */
export const CONVERSATIONAL_CHUNKS_PART_2: VocabCard[] = [
  // =========================================================================
  // MINI-DECK 3: UNTERWEGS, PLÄNE & REISEN (033–048)
  // =========================================================================
  {
    id: 'chat-chunk-033',
    lemma: 'Wie war es denn?',
    spokenText: 'Wie war es denn?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Nachfrage · Interesse zeigen',
    translation: 'So how was it?',
    highlightTarget: 'Wie war es denn',
    phraseDetails: {
      framePattern: 'Wie war es denn (gestern / auf der Feier / im Urlaub)?',
      casePattern: 'Präteritum von „sein“ (war) + freundliche Modalpartikel „denn“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie hat Ihnen die Veranstaltung gefallen?',
        textEn: 'How did you enjoy the event?',
        contextNote: 'Höflich / Beruf & Bekannte',
      },
      informalVariant: {
        textDe: 'Wie war es denn auf der Abschlussfeier? Bis eins muss es ja gut gewesen sein!',
        textEn: 'So how was the graduation party? Staying till one must mean it was good!',
        contextNote: 'Durch „denn“ klingt die Frage sofort warm und interessiert',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Du warst gestern auf einer Feier – wie war es denn?',
        promptEn: 'You went to a party yesterday—so how was it?',
        speakerB: 'Felix',
        replyDe: 'Richtig schön! Wir haben sogar noch Karaoke gesungen.',
        replyEn: 'Really nice! We even sang karaoke afterwards.',
      },
    },
    exampleDe:
      'Lena: Wie war es denn auf der Feier gestern?\nFelix: Echt schön! Ich habe viele nette neue Leute kennengelernt.',
    exampleEn:
      'Lena: So how was the party yesterday?\nFelix: Really nice! I met lots of great new people.',
    anatomy: {
      caseGovernanceNote:
        'Modal particle „denn“ in questions turns a bare interrogation („Wie war es?“) into warm, genuine curiosity („So how was it?“). Always use Präteritum „war“ for „sein“ in spoken past tense.',
      synonyms: ['Wie hat es dir gefallen?', 'Erzähl mal, wie es war!'],
      antonyms: ['Wie wird es wohl?'],
      collocations: [
        'Wie war denn die Fahrt?',
        'Wie war dein Wochenende?',
      ],
      wordFamily: ['sein (to be)', 'war (was)', 'denn (modal particle in questions)'],
      b1ExamTip:
        'Sprinkle „denn“ into W-questions („Wie war es denn?“, „Wo warst du denn?“) to immediately sound warm and conversational.',
    },
  },
  {
    id: 'chat-chunk-034',
    lemma: 'Wie lange brauchst du nach Hause?',
    spokenText: 'Wie lange brauchst du nach Hause?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reisen · Fahrzeit erfragen',
    translation: 'How long does it take you to get home?',
    highlightTarget: 'Wie lange brauchst du nach Hause',
    phraseDetails: {
      framePattern: 'Wie lange brauchst du (ungefähr) nach Hause / bis zum Bahnhof?',
      casePattern: 'brauchen (für eine Wegzeit) + Richtungsangabe „nach Hause“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie lange dauert Ihre Heimfahrt ungefähr?',
        textEn: 'Approximately how long does your trip home take?',
        contextNote: 'Höflich / Kollegen',
      },
      informalVariant: {
        textDe: 'Wie lange brauchst du nochmal nach Hause? Rund eine Stunde, oder?',
        textEn: 'How long does it take you to get home again? Around an hour, right?',
        contextNote: 'Alltagssprache: „brauchen“ für persönliche Fahrzeit',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wie lange brauchst du nach Hause, wenn du den Zug nimmst?',
        promptEn: 'How long does it take you to get home when you take the train?',
        speakerB: 'Felix',
        replyDe: 'So rund eine Stunde, je nachdem, wo ich losfahre.',
        replyEn: 'Around an hour or so, depending on where I leave from.',
      },
    },
    exampleDe:
      'Lena: Wie lange brauchst du nach Hause?\nFelix: Ungefähr eine Stunde, je nachdem, wann ich losfahre.',
    exampleEn:
      'Lena: How long does it take you to get home?\nFelix: About an hour, depending on when I head out.',
    anatomy: {
      caseGovernanceNote:
        'In German, a person „needs“ travel time („Ich brauche eine Stunde“), whereas an event or trip „lasts“ („Die Fahrt dauert eine Stunde“). Use „nach Hause“ for movement toward home.',
      synonyms: ['Wie lange dauert die Fahrt?', 'Wie weit hast du es nach Hause?'],
      antonyms: ['Ich wohne gleich um die Ecke.'],
      collocations: [
        'Ich brauche zwanzig Minuten mit dem Rad.',
        'Wie lange dauert die gesamte Fahrt?',
      ],
      wordFamily: ['brauchen (to need / take time)', 'dauern (to last)', 'nach Hause (homeward)'],
      b1ExamTip:
        'Avoid saying „Es nimmt mir eine Stunde“—always use „Ich brauche eine Stunde“ or „Es dauert eine Stunde“.',
    },
  },
  {
    id: 'chat-chunk-035',
    lemma: 'Wann geht es eigentlich los?',
    spokenText: 'Wann geht es eigentlich los?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Pläne · Startzeit fragen',
    translation: 'When do you actually head off? · When does it actually start?',
    highlightTarget: 'Wann geht es eigentlich los',
    phraseDetails: {
      framePattern: 'Wann geht es (denn) eigentlich los?',
      casePattern: 'trennbares Verb „losgehen“ + Modalpartikel „eigentlich“ (beiläufiges Nachfragen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wann beginnt Ihre Reise genau?',
        textEn: 'When exactly does your trip begin?',
        contextNote: 'Formell / Sachlich',
      },
      informalVariant: {
        textDe: 'Ich wollte noch fragen: Wann geht es bei euch eigentlich los?',
        textEn: 'I meant to ask: when are you guys actually heading off?',
        contextNote: 'Perfekte Gesprächsüberleitung mit „eigentlich“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich wollte noch fragen, wann geht es eigentlich los in den Urlaub?',
        promptEn: 'I still wanted to ask, when are you actually heading off on vacation?',
        speakerB: 'Felix',
        replyDe: 'Heute früh schon – wir sitzen gerade schon im Zug!',
        replyEn: 'This morning already—we’re actually sitting on the train right now!',
      },
    },
    exampleDe:
      'Lena: Ich wollte noch fragen: Wann geht es eigentlich los?\nFelix: Schon heute früh – wir sind gerade über die Grenze gefahren!',
    exampleEn:
      'Lena: I still meant to ask: when do you actually head out?\nFelix: Early this morning already—we just crossed the border!',
    anatomy: {
      caseGovernanceNote:
        '„Losgehen“ (separable) means „to start / to head off“. Modal particle „eigentlich“ („actually / by the way“) introduces a curious side question smoothly.',
      synonyms: ['Wann fahrt ihr los?', 'Wann fängt es an?'],
      antonyms: ['Wann kommt ihr zurück?'],
      collocations: [
        'Es geht gleich los!',
        'Wann geht der Film eigentlich los?',
      ],
      wordFamily: ['losgehen (to start / head off)', 'losfahren (to drive off)', 'eigentlich (actually)'],
      b1ExamTip:
        '„Es geht los!“ works for everything: trips, concerts, movies, dinners, and games.',
    },
  },
  {
    id: 'chat-chunk-036',
    lemma: 'Was ist alles geplant?',
    spokenText: 'Was ist alles geplant?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Pläne · Nach Programm fragen',
    translation: 'What all is planned? · What’s on the agenda?',
    highlightTarget: 'Was ist alles geplant',
    phraseDetails: {
      framePattern: 'Was ist (bei euch / für das Wochenende) alles geplant?',
      casePattern: 'Zustandspassiv „ist geplant“ + „alles“ (= welche verschiedenen Dinge)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Welche Programmpunkte sind für die Reise vorgesehen?',
        textEn: 'Which itinerary items are planned for the trip?',
        contextNote: 'Formell / Reiseplanung',
      },
      informalVariant: {
        textDe: 'Oh wie toll, ihr seid schon da! Was ist alles geplant?',
        textEn: 'Oh how awesome, you’re already there! What all is planned?',
        contextNote: 'Klassische Folgefrage bei Urlaubs- oder Wochenendplänen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ihr seid eine ganze Woche in den Niederlanden – was ist alles geplant?',
        promptEn: 'You’re in the Netherlands for a whole week—what all is planned?',
        speakerB: 'Felix',
        replyDe: 'Noch gar nicht so viel, wir haben nur einen groben Plan.',
        replyEn: 'Not that much yet, we only have a rough plan.',
      },
    },
    exampleDe:
      'Lena: Ihr seid ja schon in den Niederlanden! Was ist alles geplant?\nFelix: So richtig noch gar nichts, wir machen das eher spontan.',
    exampleEn:
      'Lena: You’re already in the Netherlands! What all is planned?\nFelix: Nothing set in stone yet, we’re mostly playing it by ear.',
    anatomy: {
      caseGovernanceNote:
        'Adding „alles“ to „Was …?“ („Was ist alles geplant?“, „Was hast du alles gekauft?“) invites a full list of highlights rather than just one thing.',
      synonyms: ['Was habt ihr alles vor?', 'Was steht auf dem Plan?'],
      antonyms: ['Wir haben noch keinen Plan.'],
      collocations: [
        'Was habt ihr am Wochenende vor?',
        'Wir haben einen groben Plan.',
      ],
      wordFamily: ['planen (to plan)', 'der Plan (plan)', 'geplant (planned)'],
      b1ExamTip:
        'Great open-ended question to keep someone talking about their trip, birthday, or weekend!',
    },
  },
  {
    id: 'chat-chunk-037',
    lemma: 'Wir machen das eher spontan.',
    spokenText: 'Wir machen das eher spontan.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Pläne · Flexibel bleiben',
    translation: 'We’re playing it by ear. · We’re keeping it pretty spontaneous.',
    highlightTarget: 'machen das eher spontan',
    phraseDetails: {
      framePattern: 'Wir machen das eher / ganz spontan.',
      casePattern: 'Adverb „eher“ (= lieber / tendenziell) + „spontan“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir möchten vor Ort flexibel entscheiden.',
        textEn: 'We would like to decide flexibly on site.',
        contextNote: 'Formell / Reise & Projekte',
      },
      informalVariant: {
        textDe: 'Wir haben einen groben Plan, aber machen das eher spontan.',
        textEn: 'We’ve got a rough outline, but we’re mostly playing it by ear.',
        contextNote: 'Sehr geläufig unter Freunden',
      },
      miniDialog: {
        speakerA: 'Mia',
        promptDe: 'Habt ihr für Samstagabend schon einen Tisch reserviert?',
        promptEn: 'Did you already reserve a table for Saturday night?',
        speakerB: 'Jonas',
        replyDe: 'Nee, wir machen das eher spontan und schauen, worauf wir Lust haben.',
        replyEn: 'Nah, we’re playing it by ear and seeing what we feel like.',
      },
    },
    exampleDe:
      'Lena: Habt ihr schon einen festen Zeitplan für Amsterdam?\nFelix: Nein, wir machen das eher spontan und lassen uns treiben.',
    exampleEn:
      'Lena: Do you already have a fixed schedule for Amsterdam?\nFelix: No, we’re mostly playing it by ear and going with the flow.',
    anatomy: {
      caseGovernanceNote:
        '„Eher“ is a high-frequency German softener meaning „more / rather / tending toward“ („eher spontan“, „eher ruhig“, „eher schlecht“).',
      synonyms: ['Wir entscheiden das spontan.', 'Wir schauen einfach vor Ort.'],
      antonyms: ['Alles ist genau durchgeplant.'],
      collocations: [
        'Lass uns das spontan entscheiden.',
        'Wir müssen uns an keinen Zeitplan halten.',
      ],
      wordFamily: ['spontan (spontaneous)', 'die Spontaneität (spontaneity)', 'eher (rather)'],
      b1ExamTip:
        'Pair „Wir machen das eher spontan“ with „Mal schauen, was wird“ for an effortless A2 conversation combo.',
    },
  },
  {
    id: 'chat-chunk-038',
    lemma: 'Mal schauen, was wird.',
    spokenText: 'Mal schauen, was wird.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Pläne · Offen lassen',
    translation: 'Let’s see how it goes. · We’ll see what happens.',
    highlightTarget: 'Mal schauen, was wird',
    phraseDetails: {
      framePattern: 'Mal schauen, was wird / was es gibt / ob es klappt.',
      casePattern: 'Kurzer Infinitiv „Mal schauen“ + indirekter Fragesatz (Verb am Ende)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir werden sehen, wie sich die Situation entwickelt.',
        textEn: 'We shall see how the situation develops.',
        contextNote: 'Formell / Abwartend',
      },
      informalVariant: {
        textDe: 'Wir haben keinen festen Zeitplan – mal schauen, was wird!',
        textEn: 'We don’t have a strict schedule—let’s see what happens!',
        contextNote: 'Extrem beliebt im gesprochenen Deutsch (auch „Mal sehen“)',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Glaubst du, es regnet morgen beim Ausflug?',
        promptEn: 'Do you think it’ll rain tomorrow on the excursion?',
        speakerB: 'Felix',
        replyDe: 'Mal schauen, was wird – ich packe einfach eine Jacke ein.',
        replyEn: 'Let’s see what happens—I’ll just pack a jacket.',
      },
    },
    exampleDe:
      'Felix: Wir müssen uns an keinen Zeitplan halten – mal schauen, was wird!\nLena: Das klingt nach einem richtig entspannten Urlaub.',
    exampleEn:
      'Felix: We don’t have to stick to any timetable—let’s see how it goes!\nLena: That sounds like a really relaxing vacation.',
    anatomy: {
      caseGovernanceNote:
        '„Mal schauen“ (or „Mal sehen“) literally means „just have a look“, functioning as „Let’s see“. You can plug any question word after it: „Mal schauen, was es in der Markthalle gibt.“',
      synonyms: ['Mal sehen!', 'Schauen wir mal!', 'Lassen wir uns überraschen.'],
      antonyms: ['Das steht schon fest.'],
      collocations: [
        'Mal schauen, was es heute zu essen gibt.',
        'Mal schauen, ob ich es schaffe.',
      ],
      wordFamily: ['schauen (to look)', 'sehen (to see)', 'werden (to become / turn out)'],
      b1ExamTip:
        'Saying „Mal schauen!“ is the ultimate relaxed German bridge when you don’t want to commit to an exact answer yet.',
    },
  },
  {
    id: 'chat-chunk-039',
    lemma: 'Es kommt immer darauf an.',
    spokenText: 'Es kommt immer darauf an.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Abwägen · Einordnen',
    translation: 'It always depends.',
    highlightTarget: 'kommt immer darauf an',
    phraseDetails: {
      framePattern: 'Es kommt immer darauf an, worum es geht / wie …',
      casePattern: 'ankommen auf + Akkusativ (Pronominaladverb „darauf“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das hängt jeweils von den Umständen ab.',
        textEn: 'That depends on the circumstances in each case.',
        contextNote: 'Formell / Sachlich',
      },
      informalVariant: {
        textDe: 'Sonst kommt es immer darauf an, wie dunkel und leise das Zimmer ist.',
        textEn: 'Otherwise it always depends on how dark and quiet the room is.',
        contextNote: 'Natürliches Abwägen im Gespräch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Schläfst du in Hotels eigentlich meistens gut oder schlecht?',
        promptEn: 'Do you usually sleep well or poorly in hotels?',
        speakerB: 'Felix',
        replyDe: 'Es kommt immer darauf an, wie ruhig die Umgebung ist.',
        replyEn: 'It always depends on how quiet the surroundings are.',
      },
    },
    exampleDe:
      'Lena: Bist du eigentlich schnell zufrieden oder eher anspruchsvoll?\nFelix: Es kommt immer darauf an, worum es geht.',
    exampleEn:
      'Lena: Are you usually easily pleased or pretty picky?\nFelix: It always depends on what it’s about.',
    anatomy: {
      caseGovernanceNote:
        'Separable verb „ankommen auf + Akkusativ“. When followed by a question clause („wie“, „ob“, „worum“), „auf“ fuses into „darauf“, and the verb in the second clause moves to the end.',
      synonyms: ['Das hängt davon ab.', 'Je nachdem!'],
      antonyms: ['Das ist immer gleich.'],
      collocations: [
        'Kommt darauf an, wann wir losfahren.',
        'Es kommt darauf an, wie das Wetter wird.',
      ],
      wordFamily: ['ankommen auf (to depend on)', 'darauf (on that)', 'je nachdem (depending on)'],
      b1ExamTip:
        'Buys you instant thinking time in any German conversation when a yes/no question needs nuance.',
    },
  },
  {
    id: 'chat-chunk-040',
    lemma: 'Wir haben es gerade so geschafft!',
    spokenText: 'Wir haben es gerade so geschafft!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reisen · Knappes Glück',
    translation: 'We just barely made it!',
    highlightTarget: 'gerade so geschafft',
    phraseDetails: {
      framePattern: 'Wir haben es / den Zug gerade so geschafft!',
      casePattern: 'Perfekt mit „haben“ + Adverb „gerade so“ (= ganz knapp)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir haben den Anschlusszug gerade noch rechtzeitig erreicht.',
        textEn: 'We reached the connecting train just in time.',
        contextNote: 'Formell / Bericht',
      },
      informalVariant: {
        textDe: 'Wir sind im Hotel und haben den Umstieg mit zwei Minuten gerade so geschafft!',
        textEn: 'We’re at the hotel and we just barely made the two-minute transfer!',
        contextNote: 'Lebendige Alltagsgeschichte mit Erleichterung',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir hatten nur zwei Minuten zum Umsteigen, aber wir haben es gerade so geschafft!',
        promptEn: 'We only had two minutes to change trains, but we just barely made it!',
        speakerB: 'Lena',
        replyDe: 'Oh, zum Glück! Richtig gut!',
        replyEn: 'Oh, thank goodness! Awesome!',
      },
    },
    exampleDe:
      'Felix: Wir sind im Hotel – wir haben den Umstieg gerade so geschafft!\nLena: Zum Glück, das war ja richtig knapp!',
    exampleEn:
      'Felix: We’re at the hotel—we just barely made the train connection!\nLena: Thank goodness, that was super close!',
    anatomy: {
      caseGovernanceNote:
        '„Gerade so“ means „just barely / by the skin of our teeth“. „Etwas schaffen“ (Perfekt: „hat geschafft“) is the go-to A2 verb for succeeding, catching trains, or finishing tasks.',
      synonyms: ['Das war ganz knapp!', 'Gerade noch rechtzeitig!'],
      antonyms: ['Wir haben den Zug leider verpasst.'],
      collocations: [
        'Ich habe die Prüfung gerade so geschafft.',
        'Du schaffst das!',
      ],
      wordFamily: ['schaffen (to manage / make it)', 'gerade so (just barely)', 'der Umstieg (transfer)'],
      b1ExamTip:
        'Every train story in Germany needs „Wir haben es gerade so geschafft!“—instant relatable storytelling.',
    },
  },
  {
    id: 'chat-chunk-041',
    lemma: 'Wird schon passen!',
    spokenText: 'Wird schon passen!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Aufmunterung · Optimismus mit „schon“',
    translation: 'It’ll work out fine! · It’ll be fine!',
    highlightTarget: 'Wird schon passen',
    phraseDetails: {
      framePattern: '(Das) wird schon passen / klappen!',
      casePattern: 'Futur I mit „werden“ + beruhigende Modalpartikel „schon“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das wird sicher gut funktionieren.',
        textEn: 'That will surely work out well.',
        contextNote: 'Höflich / Zuversichtlich',
      },
      informalVariant: {
        textDe: 'Viel Glück beim Umsteigen – wird schon passen mit den vier Minuten!',
        textEn: 'Good luck changing trains—it’ll work out fine with the four minutes!',
        contextNote: 'Sehr beruhigender, optimistischer Reflex',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich hoffe, wir kriegen den Anschlusszug trotz der kleinen Verspätung.',
        promptEn: 'I hope we catch the connecting train despite the small delay.',
        speakerB: 'Lena',
        replyDe: 'Drücke die Daumen, wird schon passen!',
        replyEn: 'Fingers crossed, it’ll work out fine!',
      },
    },
    exampleDe:
      'Felix: Hoffentlich klappt der Umstieg mit vier Minuten!\nLena: Viel Glück, wird schon passen!',
    exampleEn:
      'Felix: Hopefully the four-minute transfer works out!\nLena: Good luck, it’ll work out fine!',
    anatomy: {
      caseGovernanceNote:
        'Here „schon“ is NOT „already“—it is a reassuring modal particle meaning „don’t worry, it will turn out okay“! Same magic in „Das wird schon klappen“ and „Das wird schon wieder“.',
      synonyms: ['Das klappt schon!', 'Mach dir keine Sorgen!'],
      antonyms: ['Das wird bestimmt schiefgehen.'],
      collocations: [
        'Passt schon!',
        'Das wird schon gut gehen.',
        'Wird schon schiefgehen! (ironic good luck)',
      ],
      wordFamily: ['passen (to fit / work out)', 'schon (reassuring particle)', 'klappen (to work out)'],
      b1ExamTip:
        'Learn the „schon“ comfort trio: „Passt schon!“ (It’s fine), „Wird schon passen!“ (It’ll work out), „Das wird schon wieder!“ (Things will bounce back).',
    },
  },
  {
    id: 'chat-chunk-042',
    lemma: 'Wie viele Tage bleibt ihr dort?',
    spokenText: 'Wie viele Tage bleibt ihr dort?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reisen · Aufenthaltsdauer fragen',
    translation: 'How many days are you staying there?',
    highlightTarget: 'Wie viele Tage bleibt ihr dort',
    phraseDetails: {
      framePattern: 'Wie viele Tage / Wie lange bleibt ihr (in … / dort)?',
      casePattern: 'Akkusativ der Zeitdauer (Wie viele Tage) + „bleiben“ (ihr bleibt)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie viele Tage bleiben Sie insgesamt vor Ort?',
        textEn: 'How many days are you staying on site in total?',
        contextNote: 'Formell / Hotel oder Kollegen',
      },
      informalVariant: {
        textDe: 'Wie viele Tage bleibt ihr in den Niederlanden, bevor es weitergeht?',
        textEn: 'How many days are you staying in the Netherlands before heading on?',
        contextNote: 'Alltägliche Reise-Rückfrage',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wie viele Tage bleibt ihr dort eigentlich?',
        promptEn: 'How many days are you actually staying there?',
        speakerB: 'Felix',
        replyDe: 'Bis nächsten Sonntag, und danach fliege ich noch mit meinem Vater weg.',
        replyEn: 'Until next Sunday, and after that I’m flying away with my dad.',
      },
    },
    exampleDe:
      'Lena: Wie viele Tage bleibt ihr dort, bevor es weiter nach Ägypten geht?\nFelix: Ich bin mit Jonas bis zum siebenundzwanzigsten hier.',
    exampleEn:
      'Lena: How many days are you staying there before heading on to Egypt?\nFelix: I’m here with Jonas until the twenty-seventh.',
    anatomy: {
      caseGovernanceNote:
        '„Wie viele“ takes a plural countable noun („Wie viele Tage / Wochen“). Compare uncountable „Wie viel Zeit“. Note that „bleiben“ uses „ihr bleibt“ for addressing friends.',
      synonyms: ['Wie lange bleibt ihr?', 'Bis wann seid ihr dort?'],
      antonyms: ['Wann fahrt ihr wieder heim?'],
      collocations: [
        'Wir bleiben fünf Tage in Rotterdam.',
        'Wie lange bleibst du noch?',
      ],
      wordFamily: ['bleiben (to stay)', 'der Tag, -e (day)', 'der Aufenthalt (stay)'],
      b1ExamTip:
        'Easy A1 small-talk follow-up whenever someone mentions a trip or visiting family.',
    },
  },
  {
    id: 'chat-chunk-043',
    lemma: 'Es dauert noch eine Stunde bis …',
    spokenText: 'Es dauert noch eine Stunde bis',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Unterwegs · Restzeit nennen',
    translation: 'It’s still another hour to …',
    highlightTarget: 'dauert noch eine Stunde bis',
    phraseDetails: {
      framePattern: '(Es) dauert noch + [Zeitdauer] + bis [Ort / Ereignis].',
      casePattern: 'dauern + Akkusativ der Zeitdauer (eine Stunde) + bis',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Die Weiterfahrt bis Amsterdam dauert noch etwa eine Stunde.',
        textEn: 'The onward journey to Amsterdam will take about another hour.',
        contextNote: 'Formell / Durchsage oder Bericht',
      },
      informalVariant: {
        textDe: 'Dauert noch eine Stunde bis Amsterdam, der Zug ist aber super entspannt.',
        textEn: 'Still another hour to Amsterdam, though the train is super chill.',
        contextNote: 'Kurzes Reise-Update unterwegs',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Seid ihr schon fast da?',
        promptEn: 'Are you almost there yet?',
        speakerB: 'Felix',
        replyDe: 'Es dauert noch eine Stunde bis Amsterdam.',
        replyEn: 'It’s still another hour to Amsterdam.',
      },
    },
    exampleDe:
      'Lena: Seid ihr schon im Hotel angekommen?\nFelix: Noch nicht, es dauert noch eine Stunde bis Amsterdam.',
    exampleEn:
      'Lena: Have you arrived at the hotel yet?\nFelix: Not yet, it’s still another hour to Amsterdam.',
    anatomy: {
      caseGovernanceNote:
        '„Noch“ before a time span means „another / left to go“ („noch zehn Minuten“, „noch eine Stunde“). „Dauern“ takes the Accusative feminine „eine Stunde“.',
      synonyms: ['In einer Stunde sind wir da.', 'Wir fahren noch eine Stunde.'],
      antonyms: ['Wir sind gleich da!'],
      collocations: [
        'Es dauert nicht mehr lange.',
        'Wie lange dauert es noch?',
      ],
      wordFamily: ['dauern (to take / last)', 'die Dauer (duration)', 'die Stunde (hour)'],
      b1ExamTip:
        'Swap in any duration: „Es dauert noch zehn Minuten“, „Es dauert noch eine halbe Stunde“.',
    },
  },
  {
    id: 'chat-chunk-044',
    lemma: 'Bist du noch unterwegs?',
    spokenText: 'Bist du noch unterwegs?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Check-in · Nachfragen wo jemand ist',
    translation: 'Are you still out and about? · Still on the road?',
    highlightTarget: 'noch unterwegs',
    phraseDetails: {
      framePattern: 'Bist du / Seid ihr (schon wieder / noch) unterwegs?',
      casePattern: 'Adverb „unterwegs“ (= auf dem Weg / außer Haus)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Befinden Sie sich noch auf dem Weg?',
        textEn: 'Are you still on your way?',
        contextNote: 'Formell / Geschäftlich',
      },
      informalVariant: {
        textDe: 'Schon wieder zurück im Hotel oder noch unterwegs?',
        textEn: 'Already back at the hotel or still out and about?',
        contextNote: 'Lockeres Abend-Check-in',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Seid ihr schon wieder im Hotel oder bist du noch unterwegs?',
        promptEn: 'Are you back at the hotel already or are you still out and about?',
        speakerB: 'Felix',
        replyDe: 'Wir sind gerade zurückgekommen und packen schon für morgen.',
        replyEn: 'We just got back and are already packing for tomorrow.',
      },
    },
    exampleDe:
      'Lena: Bist du noch unterwegs oder schon wieder im Hotel?\nFelix: Wir sind wieder zurück, ich habe gerade erst mal geduscht.',
    exampleEn:
      'Lena: Are you still out and about or already back at the hotel?\nFelix: We’re back again, I just took a shower first.',
    anatomy: {
      caseGovernanceNote:
        '„Unterwegs“ is an invariable adverb covering both „in transit / on the way“ AND „out and about doing errands or sightseeing“.',
      synonyms: ['Bist du noch draußen?', 'Bist du auf dem Weg?'],
      antonyms: ['Bist du schon zu Hause?'],
      collocations: [
        'Ich bin gerade unterwegs.',
        'Wir sind den ganzen Tag unterwegs.',
      ],
      wordFamily: ['unterwegs (on the way / out)', 'der Weg (way / path)'],
      b1ExamTip:
        '„Ich bin schon unterwegs!“ is the classic phrase to send when heading to meet friends at a restaurant.',
    },
  },
  {
    id: 'chat-chunk-045',
    lemma: 'Wir waren den ganzen Tag draußen.',
    spokenText: 'Wir waren den ganzen Tag draußen.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Erzählen · Vom Tag berichten',
    translation: 'We were outside all day.',
    highlightTarget: 'waren den ganzen Tag draußen',
    phraseDetails: {
      framePattern: 'Wir waren den ganzen Tag draußen / unterwegs.',
      casePattern: 'Präteritum „waren“ + Akkusativ der Zeitdauer (den ganzen Tag)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir haben den gesamten Tag im Freien verbracht.',
        textEn: 'We spent the entire day outdoors.',
        contextNote: 'Formell / Schriftlich',
      },
      informalVariant: {
        textDe: 'Wir waren einfach den ganzen Tag draußen am Herumlaufen!',
        textEn: 'We were just walking around outside all day long!',
        contextNote: 'Natürliches Erzählen am Abend',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir waren den ganzen Tag draußen und haben dreißigtausend Schritte gesammelt.',
        promptEn: 'We were outside all day and racked up thirty thousand steps.',
        speakerB: 'Lena',
        replyDe: 'Wahnsinn! Ich liebe es, im Urlaub so viel zu Fuß zu gehen.',
        replyEn: 'Whoa! I love walking that much on vacation.',
      },
    },
    exampleDe:
      'Felix: Wir waren den ganzen Tag draußen und haben viele Enten am Kanal gesehen.\nLena: Wie schön! Nach so viel Laufen bist du bestimmt müde.',
    exampleEn:
      'Felix: We were outside all day and saw lots of ducks by the canal.\nLena: How lovely! After so much walking you must be tired.',
    anatomy: {
      caseGovernanceNote:
        'Time duration without a preposition ALWAYS takes the Accusative: masculine „der ganze Tag“ → „den ganzen Tag“, „den ganzen Abend“, „die ganze Woche“.',
      synonyms: ['Wir waren von morgens bis abends unterwegs.'],
      antonyms: ['Wir waren den ganzen Tag drinnen.'],
      collocations: [
        'Den ganzen Tag unterwegs sein.',
        'Den ganzen Abend gelacht.',
      ],
      wordFamily: ['draußen (outside)', 'drinnen (inside)', 'der Tag (day)'],
      b1ExamTip:
        'Memorize „den ganzen Tag“ (Accusative masculine) as one fixed rhythm block—you’ll use it constantly when recounting your day.',
    },
  },
  {
    id: 'chat-chunk-046',
    lemma: 'Ich bin so durch heute!',
    spokenText: 'Ich bin so durch heute!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Befinden · Völlig erschöpft sein',
    translation: 'I’m completely wiped out today!',
    highlightTarget: 'bin so durch heute',
    phraseDetails: {
      framePattern: 'Ich bin (heute) so durch / richtig kaputt!',
      casePattern: 'Umgangssprachlich: „durch sein“ = völlig erschöpft / erledigt sein',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin heute Abend wirklich sehr erschöpft.',
        textEn: 'I am really very exhausted this evening.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Dreißigtausend Schritte gesammelt – ich bin so durch heute!',
        textEn: 'Thirty thousand steps logged—I’m completely wiped out today!',
        contextNote: 'Authentischer junger Alltagston',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Nach dem langen Tag in der Stadt bin ich so durch heute!',
        promptEn: 'After the long day in the city I’m completely wiped out today!',
        speakerB: 'Lena',
        replyDe: 'Verständlich! Dann schlaf heute Nacht richtig gut.',
        replyEn: 'Totally understandable! Get a really good sleep tonight then.',
      },
    },
    exampleDe:
      'Felix: Wir sind heute dreißigtausend Schritte gelaufen – ich bin so durch heute!\nLena: Verständlich, dass man danach richtig kaputt ist.',
    exampleEn:
      'Felix: We walked thirty thousand steps today—I’m completely wiped out today!\nLena: Totally understandable to be dead tired after that.',
    anatomy: {
      caseGovernanceNote:
        'In casual German, „durch sein“ or „kaputt sein“ means „to be totally drained / exhausted“ (both physically and mentally). Notice „heute“ placed at the end for spoken emphasis.',
      synonyms: ['Ich bin richtig kaputt.', 'Ich bin völlig platt.', 'Ich bin fix und fertig.'],
      antonyms: ['Ich bin voller Energie!', 'Ich bin topfit.'],
      collocations: [
        'Nach der Prüfung war ich komplett durch.',
        'Ich bin heute richtig platt.',
      ],
      wordFamily: ['durch (through / drained)', 'kaputt (broken / exhausted)', 'erschöpft (exhausted)'],
      b1ExamTip:
        'Hearing „Ich bin so durch“ or „Ich bin voll kaputt“ from German friends just means they’re exhausted, not broken!',
    },
  },
  {
    id: 'chat-chunk-047',
    lemma: 'Genieß einfach deinen Urlaub!',
    spokenText: 'Genieß einfach deinen Urlaub!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Wunsch · Entspanntes Genießen',
    translation: 'Just enjoy your vacation!',
    highlightTarget: 'Genieß einfach deinen Urlaub',
    phraseDetails: {
      framePattern: 'Genieß einfach deinen Urlaub / dein Wochenende!',
      casePattern: 'Imperativ „genießen“ + Partikel „einfach“ + Akkusativ Maskulin (deinen Urlaub)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Genießen Sie Ihren Urlaub in vollen Zügen!',
        textEn: 'Enjoy your vacation to the fullest!',
        contextNote: 'Formell / Kollegen',
      },
      informalVariant: {
        textDe: 'Ach wie lieb, aber du brauchst mir nichts mitzubringen – genieß einfach deinen Urlaub!',
        textEn: 'Aw how sweet, you don’t need to bring me anything—just enjoy your vacation!',
        contextNote: 'Herzlich und zwanglos durch „einfach“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Vielleicht bringe ich dir aus den Niederlanden eine Kleinigkeit mit.',
        promptEn: 'Maybe I’ll bring you back a little something from the Netherlands.',
        speakerB: 'Lena',
        replyDe: 'Oh, wie lieb! Aber genieß einfach deinen Urlaub.',
        replyEn: 'Oh, how sweet! Just enjoy your vacation though.',
      },
    },
    exampleDe:
      'Felix: Vielleicht bringe ich dir ja etwas Leckeres mit!\nLena: Oh, wie lieb – aber genieß einfach deinen Urlaub!',
    exampleEn:
      'Felix: Maybe I’ll bring you back something tasty!\nLena: Oh, how sweet—just enjoy your vacation though!',
    anatomy: {
      caseGovernanceNote:
        '„Genießen“ takes an Accusative object („deinen Urlaub“, „das Wetter“, „das Leben“). Modal particle „einfach“ („just / simply“) takes off any pressure.',
      synonyms: ['Hab eine tolle Zeit!', 'Lass es dir gut gehen!'],
      antonyms: ['Mach dir keinen Stress im Urlaub!'],
      collocations: [
        'Das Leben ein bisschen genießen.',
        'Genieß den Abend!',
      ],
      wordFamily: ['genießen (to enjoy)', 'der Genuss (enjoyment)', 'der Urlaub (vacation)'],
      b1ExamTip:
        'Works for any occasion by swapping the noun: „Genieß einfach das Wochenende!“, „Genieß einfach den Abend!“.',
    },
  },
  {
    id: 'chat-chunk-048',
    lemma: 'Morgen geht es weiter.',
    spokenText: 'Morgen geht es weiter.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reisen · Nächster Schritt',
    translation: 'Tomorrow we’re heading on. · Tomorrow we continue.',
    highlightTarget: 'morgen geht es weiter',
    phraseDetails: {
      framePattern: 'Morgen / Gleich geht es weiter (nach …).',
      casePattern: 'trennbares Verb „weitergehen“ · Zeitangabe auf Position 1 (Inversion)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Am morgigen Tag setzen wir unsere Reise fort.',
        textEn: 'Tomorrow we will continue our journey.',
        contextNote: 'Formell / Reisebericht',
      },
      informalVariant: {
        textDe: 'Ich habe schon alles gepackt, weil es morgen ja weitergeht.',
        textEn: 'I already packed everything since we’re heading on tomorrow.',
        contextNote: 'Mit Modalpartikel „ja“ für bereits bekanntes Wissen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Geht ihr heute Abend noch mal aus?',
        promptEn: 'Are you heading out again tonight?',
        speakerB: 'Felix',
        replyDe: 'Nein, ich habe schon gepackt – morgen geht es weiter!',
        replyEn: 'No, I’ve already packed—tomorrow we’re moving on!',
      },
    },
    exampleDe:
      'Lena: Was macht ihr heute Abend noch im Hotel?\nFelix: Ich habe schon alles gepackt, denn morgen geht es weiter.',
    exampleEn:
      'Lena: What else are you doing at the hotel tonight?\nFelix: I’ve already packed everything, because tomorrow we’re heading on.',
    anatomy: {
      caseGovernanceNote:
        '„Weitergehen“ is separable in a main clause („Morgen geht es weiter“), and joins back together at the end of a „weil“ subordinate clause („weil es morgen weitergeht“).',
      synonyms: ['Morgen fahren wir weiter.', 'Morgen steht die nächste Etappe an.'],
      antonyms: ['Wir bleiben noch einen Tag hier.'],
      collocations: [
        'Weiter geht es!',
        'Wann geht es weiter?',
      ],
      wordFamily: ['weitergehen (to continue / move on)', 'weiterfahren (to drive on)', 'weiter (further)'],
      b1ExamTip:
        'Notice the difference in word order: „denn morgen geht es weiter“ (Position 0) vs. „weil es morgen weitergeht“ (verb at the end).',
    },
  },

  // =========================================================================
  // MINI-DECK 4: ALLTAG, ESSEN & FREUNDESKREIS (049–064)
  // =========================================================================
  {
    id: 'chat-chunk-049',
    lemma: 'Was hast du heute so gemacht?',
    spokenText: 'Was hast du heute so gemacht?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Smalltalk · Nach dem Tag fragen',
    translation: 'What have you been up to today?',
    highlightTarget: 'Was hast du heute so gemacht',
    phraseDetails: {
      framePattern: 'Was hast du heute / am Wochenende so gemacht?',
      casePattern: 'Perfekt mit „haben“ + lockere Partikel „so“ (= ungefähr / generell)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie ist Ihr Tag heute verlaufen?',
        textEn: 'How did your day go today?',
        contextNote: 'Formell / Kollegen',
      },
      informalVariant: {
        textDe: 'Was gab es bei dir zu essen und was hast du heute so gemacht?',
        textEn: 'What did you have to eat and what have you been up to today?',
        contextNote: 'Durch „so“ klingt die Frage sofort entspannt statt wie ein Verhör',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hey Lena, was hast du heute so gemacht?',
        promptEn: 'Hey Lena, what have you been up to today?',
        speakerB: 'Lena',
        replyDe: 'Wieder viel gelernt, und jetzt schaue ich bei Freunden einen Film.',
        replyEn: 'Studied a lot again, and now I’m watching a movie at my friends’ place.',
      },
    },
    exampleDe:
      'Felix: Was hast du heute so gemacht?\nLena: Wieder gelernt, und jetzt bin ich bei Freunden.',
    exampleEn:
      'Felix: What have you been up to today?\nLena: Studied again, and now I’m over at my friends’ place.',
    anatomy: {
      caseGovernanceNote:
        'The little word „so“ in „Was hast du heute so gemacht?“ or „Was machst du am Wochenende so?“ makes casual questions sound relaxed and open-ended, just like English „up to“.',
      synonyms: ['Wie war dein Tag?', 'Was stand heute bei dir an?'],
      antonyms: ['Was machst du morgen?'],
      collocations: [
        'Was machst du am Wochenende so?',
        'Was liest du gerade so?',
      ],
      wordFamily: ['machen (to do / make)', 'heute (today)', 'so (casual filler)'],
      b1ExamTip:
        'Adding „so“ to everyday questions („Was machst du so?“, „Was hörst du so für Musik?“) is a hallmark of natural spoken German.',
    },
  },
  {
    id: 'chat-chunk-050',
    lemma: 'Was gab es bei dir zu essen?',
    spokenText: 'Was gab es bei dir zu essen?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Essen · Nach der Mahlzeit fragen',
    translation: 'What did you have to eat?',
    highlightTarget: 'Was gab es bei dir zu essen',
    phraseDetails: {
      framePattern: 'Was gab es / gibt es (heute) bei dir zu essen?',
      casePattern: 'Präteritum „es gab“ + bei + Dativ (dir) + „zu essen“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Was haben Sie heute zu Mittag gegessen?',
        textEn: 'What did you have for lunch today?',
        contextNote: 'Höflich / Kollegen in der Pause',
      },
      informalVariant: {
        textDe: 'Bei uns gab es etwas aus der Markthalle – was gab es bei dir zu essen?',
        textEn: 'We had something from the market hall—what did you have to eat?',
        contextNote: 'Super idiomatische Essensfrage im Alltag',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Was gab es bei dir heute eigentlich zu essen?',
        promptEn: 'What did you actually have to eat today?',
        speakerB: 'Lena',
        replyDe: 'Ich habe mir schnell Pasta mit Pesto gekocht.',
        replyEn: 'I quickly cooked myself pasta with pesto.',
      },
    },
    exampleDe:
      'Felix: Wir waren in der Markthalle essen. Was gab es bei dir zu essen?\nLena: Bei mir gab es heute leckere Gemüsesuppe.',
    exampleEn:
      'Felix: We ate at the market hall. What did you have to eat?\nLena: I had tasty vegetable soup today.',
    anatomy: {
      caseGovernanceNote:
        'Germans constantly use „es gibt / es gab“ for meals: „Was gibt es heute?“ (What’s for dinner?), „Bei uns gab es Pizza“ (We had pizza). Much more idiomatic than „Was hast du gehabt?“.',
      synonyms: ['Was hast du heute gegessen?', 'Was hast du gekocht?'],
      antonyms: ['Ich habe heute noch nichts gegessen.'],
      collocations: [
        'Was gibt es heute Abend?',
        'Bei uns gab es gestern Raclette.',
      ],
      wordFamily: ['es gibt / es gab (there is / was)', 'essen (to eat)', 'das Essen (food / meal)'],
      b1ExamTip:
        'Use „Bei uns gab es …“ instead of „Wir hatten …“ when talking about meals—native speakers use it all the time!',
    },
  },
  {
    id: 'chat-chunk-051',
    lemma: 'Erzähl mal, was ihr gegessen habt!',
    spokenText: 'Erzähl mal, was ihr gegessen habt!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Essen · Neugierig nachfragen',
    translation: 'Tell me what you guys ate!',
    highlightTarget: 'Erzähl mal, was ihr gegessen habt',
    phraseDetails: {
      framePattern: 'Erzähl mal, was / wie / wo + [Subjekt] … [Verb am Ende]!',
      casePattern: 'Imperativ „erzählen“ + Partikel „mal“ + indirekter Fragesatz',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Berichten Sie doch gerne, welche Spezialitäten Sie probiert haben.',
        textEn: 'Please do tell us which specialties you tried.',
        contextNote: 'Formell / Höfliches Interesse',
      },
      informalVariant: {
        textDe: 'Dann erzähl mal, was ihr so Leckeres gegessen habt!',
        textEn: 'Go on, tell me what delicious things you guys ate!',
        contextNote: 'Super lebendig durch „mal“ und „so Leckeres“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Dann erzähl mal, was ihr im Urlaub Leckeres gegessen habt!',
        promptEn: 'Tell me what delicious food you guys ate on vacation!',
        speakerB: 'Felix',
        replyDe: 'Wir waren georgisch essen – es gab ein Brot wie ein Boot mit Käse und Ei.',
        replyEn: 'We went for Georgian food—there was a boat-shaped bread with cheese and egg.',
      },
    },
    exampleDe:
      'Lena: Erzähl mal, was ihr gegessen habt!\nFelix: Wir waren georgisch essen, mit warmem Käsebrot und Butter.',
    exampleEn:
      'Lena: Tell me what you guys ate!\nFelix: We went for Georgian food, with warm cheese bread and butter.',
    anatomy: {
      caseGovernanceNote:
        '„Erzähl mal!“ is a friendly, inviting imperative—„mal“ removes any bossy tone. In the following „was“-clause, the conjugated auxiliary „habt“ moves to the very end.',
      synonyms: ['Schieß los!', 'Was habt ihr denn probiert?'],
      antonyms: ['Verrate mir nichts!'],
      collocations: [
        'Erzähl mal, wie war es?',
        'Erzähl mal von deinem Urlaub!',
      ],
      wordFamily: ['erzählen (to tell / recount)', 'die Erzählung (story)', 'mal (friendly particle)'],
      b1ExamTip:
        '„Erzähl mal!“ is one of the warmest conversation openers in German—it signals you actually want to hear the whole story.',
    },
  },
  {
    id: 'chat-chunk-052',
    lemma: 'Gönnt euch!',
    spokenText: 'Gönnt euch!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Jemandem etwas gönnen',
    translation: 'Treat yourselves! · Enjoy it!',
    highlightTarget: 'Gönnt euch',
    phraseDetails: {
      framePattern: 'Gönn dir! (Singular) / Gönnt euch! (Plural)',
      casePattern: 'Imperativ reflexiv „sich etwas gönnen“ (Dativ: dir / euch)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Lassen Sie es sich gut schmecken!',
        textEn: 'Enjoy your meal!',
        contextNote: 'Höflich / Klassischer Essenswunsch',
      },
      informalVariant: {
        textDe: 'Ihr geht in die Markthalle essen? Gönnt euch!',
        textEn: 'You’re heading to the market hall for food? Treat yourselves!',
        contextNote: 'Sehr beliebte, herzliche Reaktion unter jungen Erwachsenen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir gehen jetzt erst mal in der Markthalle etwas Leckeres suchen.',
        promptEn: 'We’re going to look for something tasty in the market hall now.',
        speakerB: 'Lena',
        replyDe: 'Gönnt euch! Und schickt mir ein Foto!',
        replyEn: 'Treat yourselves! And send me a photo!',
      },
    },
    exampleDe:
      'Felix: Wir holen uns jetzt erst mal etwas Warmes in der Markthalle.\nLena: Gönnt euch! Das habt ihr euch verdient.',
    exampleEn:
      'Felix: We’re going to grab something warm at the market hall first.\nLena: Treat yourselves! You’ve earned it.',
    anatomy: {
      caseGovernanceNote:
        '„Sich etwas gönnen“ means „to treat oneself to something nice“ (Dative reflexive: „ich gönne mir ein Eis“, „gönn dir!“, „gönnt euch!“). Used enthusiastically when friends are enjoying food, rest, or travel.',
      synonyms: ['Lasst es euch schmecken!', 'Genießt es!', 'Lass es dir gut gehen!'],
      antonyms: ['Sei nicht so streng mit dir!'],
      collocations: [
        'Gönn dir eine Pause!',
        'Heute Abend gönne ich mir ein gutes Essen.',
      ],
      wordFamily: ['gönnen (to treat / not begrudge)', 'sich etwas gönnen (to treat oneself)'],
      b1ExamTip:
        'Say „Gönn dir!“ to one friend and „Gönnt euch!“ to two or more—Germans love hearing learners use this naturally.',
    },
  },
  {
    id: 'chat-chunk-053',
    lemma: 'Einfach mal abschalten.',
    spokenText: 'Einfach mal abschalten.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Pause vom Kopf machen',
    translation: 'Just switch off and unwind for a bit.',
    highlightTarget: 'einfach mal abschalten',
    phraseDetails: {
      framePattern: 'Man muss / Ich möchte einfach mal abschalten.',
      casePattern: 'trennbares Verb „abschalten“ (übertragen: den Kopf frei bekommen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Es ist wichtig, im Urlaub einmal vollständig abzuschalten.',
        textEn: 'It is important to completely unwind during vacation.',
        contextNote: 'Formell / Beruf & Gesundheit',
      },
      informalVariant: {
        textDe: 'Im Urlaub einfach mal abschalten – das tut richtig gut!',
        textEn: 'Just switching off on vacation—that feels really good!',
        contextNote: 'Klassische Alltagsphrase mit „einfach mal“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Es sind doch nur zwei Wochen Urlaub, da darfst du das Leben auch mal genießen.',
        promptEn: 'It’s only two weeks of vacation, you’re allowed to enjoy life a little.',
        speakerB: 'Felix',
        replyDe: 'Ja, das ist echt gut – einfach mal abschalten.',
        replyEn: 'Yeah, that’s really good—just switch off for a bit.',
      },
    },
    exampleDe:
      'Lena: Zwei Wochen ohne Trainingsplan sind doch völlig in Ordnung!\nFelix: Ja, denke ich auch – einfach mal abschalten.',
    exampleEn:
      'Lena: Two weeks without a workout plan is totally fine!\nFelix: Yeah, I think so too—just switch off for a bit.',
    anatomy: {
      caseGovernanceNote:
        'Literally „to turn off (a device)“, „abschalten“ is the everyday German verb for mentally unplugging from work, exams, or stress. „Einfach mal“ adds a relaxed „just for once“ vibe.',
      synonyms: ['Den Kopf frei bekommen.', 'Die Seele baumeln lassen.'],
      antonyms: ['Dauernd unter Strom stehen.'],
      collocations: [
        'Am Wochenende kann ich gut abschalten.',
        'Im Urlaub einfach mal den Kopf abschalten.',
      ],
      wordFamily: ['abschalten (to switch off / unwind)', 'einschalten (to turn on)', 'der Schalter (switch)'],
      b1ExamTip:
        'Great for talking about weekends, vacations, or work-life balance in everyday German conversations.',
    },
  },
  {
    id: 'chat-chunk-054',
    lemma: 'Ich habe es glücklicherweise hinbekommen.',
    spokenText: 'Ich habe es glücklicherweise hinbekommen.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Erfolg · Etwas gelöst haben',
    translation: 'Luckily I managed to pull it off.',
    highlightTarget: 'glücklicherweise hinbekommen',
    phraseDetails: {
      framePattern: 'Ich habe es (glücklicherweise / zum Glück) hinbekommen.',
      casePattern: 'Perfekt von „hinbekommen“ (trennbar, untrennbares Partizip: hinbekommen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Es ist mir glücklicherweise gelungen, das Problem zu lösen.',
        textEn: 'I fortunately succeeded in solving the problem.',
        contextNote: 'Formell / Beruf & Schriftlich',
      },
      informalVariant: {
        textDe: 'Ja, ich habe es glücklicherweise hinbekommen!',
        textEn: 'Yes, luckily I managed to get it done!',
        contextNote: 'Sehr gebräuchliches gesprochenes Verb „hinbekommen“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hast du das mit der neuen Handynummer gestern noch geschafft?',
        promptEn: 'Did you manage to sort out the new phone number yesterday?',
        speakerB: 'Lena',
        replyDe: 'Ja, ich habe es glücklicherweise hinbekommen!',
        replyEn: 'Yes, luckily I managed to get it sorted!',
      },
    },
    exampleDe:
      'Felix: Hast du meine Nummer richtig eingespeichert?\nLena: Ja, ich habe es glücklicherweise hinbekommen!',
    exampleEn:
      'Felix: Did you save my number correctly?\nLena: Yes, luckily I managed to get it right!',
    anatomy: {
      caseGovernanceNote:
        '„Hinbekommen“ (to manage / get something right) has no extra „-ge-“ in the past participle because „bekommen“ already has an inseparable prefix „be-“: „Ich habe es hinbekommen“.',
      synonyms: ['Ich habe es zum Glück geschafft.', 'Ich habe es hingekriegt.'],
      antonyms: ['Das habe ich leider nicht hinbekommen.'],
      collocations: [
        'Das bekommen wir schon hin!',
        'Das hast du super hinbekommen!',
      ],
      wordFamily: ['hinbekommen (to manage / pull off)', 'das Glück (luck)', 'zum Glück (luckily)'],
      b1ExamTip:
        'Remember: „hinbekommen“ is super versatile—use it for cooking a dish, fixing a setting, or finishing a craft project.',
    },
  },
  {
    id: 'chat-chunk-055',
    lemma: 'Das ist nicht so meins.',
    spokenText: 'Das ist nicht so meins.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Vorlieben · Freundlich ablehnen',
    translation: 'That’s not really my thing.',
    highlightTarget: 'ist nicht so meins',
    phraseDetails: {
      framePattern: '[Aktivität / Das] ist nicht (so) meins / deins.',
      casePattern: 'Possessivpronomen Neutrum „meins / deins“ (= mein Ding / mein Geschmack)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das entspricht nicht ganz meinem Geschmack.',
        textEn: 'That does not quite match my taste.',
        contextNote: 'Formell / Diplomatisch',
      },
      informalVariant: {
        textDe: 'Singen ist nicht so deins, oder? – Nein, wirklich nicht so meins.',
        textEn: 'Singing isn’t really your thing, right?—No, not really my thing.',
        contextNote: 'Sehr natürliche, höfliche Art, Abneigung auszudrücken',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Singen ist nicht so deins, oder?',
        promptEn: 'Singing isn’t really your thing, right?',
        speakerB: 'Felix',
        replyDe: 'Nein, das ist nicht so meins – meine Stimme ist eher nicht hörenswert.',
        replyEn: 'No, that’s not really my thing—my voice isn’t exactly worth listening to.',
      },
    },
    exampleDe:
      'Lena: Gehst du gern joggen?\nFelix: Laufen ist nicht so meins, ich spiele lieber Fußball.',
    exampleEn:
      'Lena: Do you like going jogging?\nFelix: Running isn’t really my thing, I prefer playing soccer.',
    anatomy: {
      caseGovernanceNote:
        '„Meins / deins“ (neuter possessive pronoun standing alone) is shorthand for „mein Ding / mein Fall“. Adding „so“ softens the refusal politely („not really my thing“).',
      synonyms: ['Das ist nicht mein Fall.', 'Das liegt mir nicht so.'],
      antonyms: ['Das ist genau meins!', 'Das liebe ich!'],
      collocations: [
        'Singen ist nicht so meins.',
        'Horrorfilme sind gar nicht meins.',
        'Das ist genau meins!',
      ],
      wordFamily: ['meins (mine / my thing)', 'deins (yours / your thing)', 'der Geschmack (taste)'],
      b1ExamTip:
        'A polite lifesaver when talking about food, sports, or music—much softer than saying „Ich hasse das!“.',
    },
  },
  {
    id: 'chat-chunk-056',
    lemma: 'Das liegt außerhalb meiner Komfortzone.',
    spokenText: 'Das liegt außerhalb meiner Komfortzone.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Gefühle · Grenzen benennen',
    translation: 'That’s outside my comfort zone.',
    highlightTarget: 'außerhalb meiner Komfortzone',
    phraseDetails: {
      framePattern: 'Das liegt außerhalb meiner Komfortzone / Ich muss aus meiner Komfortzone raus.',
      casePattern: 'außerhalb + Genitiv (oder umgangssprachlich Dativ) Feminin: meiner Komfortzone',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist für mich eine ungewohnte Herausforderung.',
        textEn: 'That is an unfamiliar challenge for me.',
        contextNote: 'Formell / Beruf & Entwicklung',
      },
      informalVariant: {
        textDe: 'Vor anderen singen? Nee, das liegt definitiv außerhalb meiner Komfortzone!',
        textEn: 'Singing in front of others? Nah, that’s definitely outside my comfort zone!',
        contextNote: 'Sehr gebräuchlich bei Hobbys & persönlichen Zielen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Du liebst Karaoke – das liegt also nicht außerhalb deiner Komfortzone?',
        promptEn: 'You love karaoke—so that’s not outside your comfort zone?',
        speakerB: 'Lena',
        replyDe: 'Oh doch, das liegt definitiv außerhalb meiner Komfortzone! Aber es macht Spaß.',
        replyEn: 'Oh it definitely is outside my comfort zone! Still fun though.',
      },
    },
    exampleDe:
      'Felix: Singst du beim Karaoke einfach drauflos?\nLena: Nein, das liegt definitiv außerhalb meiner Komfortzone – aber ich mag es trotzdem!',
    exampleEn:
      'Felix: Do you just jump right in and sing at karaoke?\nLena: No, that’s definitely outside my comfort zone—but I still like it!',
    anatomy: {
      caseGovernanceNote:
        'Feminine „die Komfortzone“ turns into „meiner Komfortzone“ after „außerhalb“ (both Genitive and Dative feminine take „meiner“!). Also learn „aus der Komfortzone herauskommen“.',
      synonyms: ['Das traue ich mich noch nicht.', 'Das ist ganz schön ungewohnt für mich.'],
      antonyms: ['Da fühle ich mich pudelwohl.'],
      collocations: [
        'Aus der Komfortzone rauskommen.',
        'Das liegt weit außerhalb meiner Komfortzone.',
      ],
      wordFamily: ['die Komfortzone (comfort zone)', 'außerhalb (outside of)', 'sich trauen (to dare)'],
      b1ExamTip:
        'Super handy for explaining why something makes you nervous while still showing you’re open to trying it.',
    },
  },
  {
    id: 'chat-chunk-057',
    lemma: 'Irgendwann ist immer das erste Mal.',
    spokenText: 'Irgendwann ist immer das erste Mal.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Aufmunterung · Mut machen',
    translation: 'There’s always a first time for everything.',
    highlightTarget: 'Irgendwann ist immer das erste Mal',
    phraseDetails: {
      framePattern: 'Irgendwann ist immer das erste Mal!',
      casePattern: 'Zeitadverb „irgendwann“ (= eines Tages) + Ordinalzahl „das erste Mal“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Jeder fängt irgendwann einmal neu an.',
        textEn: 'Everyone starts something new at some point.',
        contextNote: 'Neutral / Ermutigend',
      },
      informalVariant: {
        textDe: 'Du warst noch nie allein im Café? Irgendwann ist immer das erste Mal!',
        textEn: 'You’ve never gone to a café by yourself? There’s always a first time!',
        contextNote: 'Freundlicher kleiner Schubs unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich habe mich bisher noch nie getraut, allein ins Kino zu gehen.',
        promptEn: 'I’ve never dared to go to the movies by myself so far.',
        speakerB: 'Felix',
        replyDe: 'Irgendwann ist immer das erste Mal! Am besten gar nicht so viel nachdenken.',
        replyEn: 'There’s always a first time! Best not to overthink it.',
      },
    },
    exampleDe:
      'Lena: Ich habe mich bisher nie überwunden, allein wegzugehen.\nFelix: Irgendwann ist immer das erste Mal!',
    exampleEn:
      'Lena: So far I’ve never brought myself to go out alone.\nFelix: There’s always a first time!',
    anatomy: {
      caseGovernanceNote:
        '„Irgendwann“ means „at some point / someday“. Because „irgendwann“ takes Position 1, the verb „ist“ comes straight into Position 2.',
      synonyms: ['Einmal ist immer das erste Mal.', 'Probier es einfach mal aus!'],
      antonyms: ['Das mache ich schon ewig.'],
      collocations: [
        'Zum ersten Mal etwas probieren.',
        'Irgendwann klappt es bestimmt.',
      ],
      wordFamily: ['irgendwann (someday)', 'das Mal (time / instance)', 'erst- (first)'],
      b1ExamTip:
        'A classic, feel-good German saying that encourages friends whenever they hesitate to try something new.',
    },
  },
  {
    id: 'chat-chunk-058',
    lemma: 'Das wird schon wieder!',
    spokenText: 'Das wird schon wieder!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Aufmunterung · Trost & Zuversicht',
    translation: 'You’ll get back into it! · Things will get better!',
    highlightTarget: 'Das wird schon wieder',
    phraseDetails: {
      framePattern: 'Das wird schon wieder (gut / besser)!',
      casePattern: 'werden (ohne Adjektiv = „wieder gut werden“) + beruhigendes „schon“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sie finden sicher bald wieder gut hinein.',
        textEn: 'You will surely get right back into the swing of things soon.',
        contextNote: 'Höflich / Ermutigend',
      },
      informalVariant: {
        textDe: 'Das wird schon wieder – am Anfang fühlt es sich immer erst mal ungewohnt an.',
        textEn: 'You’ll get back into it—at first it always feels a bit weird.',
        contextNote: 'Warmherzige Aufmunterung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich hatte anderthalb Jahre keine Prüfungen und habe das Lernen fast verlernt.',
        promptEn: 'I had no exams for a year and a half and basically forgot how to study.',
        speakerB: 'Felix',
        replyDe: 'Das wird schon wieder! Nach ein paar Tagen bist du wieder voll drin.',
        replyEn: 'You’ll get back into it! After a few days you’ll be right back in the groove.',
      },
    },
    exampleDe:
      'Lena: Das Lernen fällt mir nach der langen Pause echt schwer!\nFelix: Das wird schon wieder, du machst das bestimmt super.',
    exampleEn:
      'Lena: Studying feels really hard after the long break!\nFelix: You’ll get back into it, I’m sure you’re doing great.',
    anatomy: {
      caseGovernanceNote:
        'One of the warmest idioms in German: „werden“ + reassuring „schon“ + „wieder“ (again) implies „it will return to being good/normal“ without needing to spell out „gut“.',
      synonyms: ['Kopf hoch!', 'Du kommst da schnell wieder rein!'],
      antonyms: ['Das wird nichts mehr.'],
      collocations: [
        'Kopf hoch, das wird schon wieder!',
        'Gute Besserung, das wird schon wieder!',
      ],
      wordFamily: ['werden (to become)', 'wieder (again)', 'schon (reassuring particle)'],
      b1ExamTip:
        'Works equally well for exams, minor illnesses, sports comebacks, or bad days!',
    },
  },
  {
    id: 'chat-chunk-059',
    lemma: 'Viel Erfolg auf jeden Fall!',
    spokenText: 'Viel Erfolg auf jeden Fall!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Wunsch · Prüfungen & Projekte',
    translation: 'Best of luck either way! · Wishing you lots of success!',
    highlightTarget: 'Viel Erfolg auf jeden Fall',
    phraseDetails: {
      framePattern: 'Viel Erfolg auf jeden Fall (schon mal)!',
      casePattern: 'Unzählbares Nomen „Erfolg“ ohne Artikel + auf + Akkusativ (jeden Fall)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich wünsche Ihnen viel Erfolg für Ihre bevorstehenden Prüfungen!',
        textEn: 'I wish you much success for your upcoming exams!',
        contextNote: 'Formell / Uni & Beruf',
      },
      informalVariant: {
        textDe: 'Du klingst ja nicht so begeistert von der Prüfung – viel Erfolg auf jeden Fall schon mal!',
        textEn: 'You don’t sound too thrilled about the exam—best of luck either way!',
        contextNote: 'Sehr beliebt vor Prüfungen, Bewerbungen oder Terminen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Nächste Woche schreibe ich noch zwei schwierige Prüfungen.',
        promptEn: 'Next week I still have two tough exams to take.',
        speakerB: 'Felix',
        replyDe: 'Viel Erfolg auf jeden Fall schon mal – du schaffst das!',
        replyEn: 'Best of luck either way in advance—you’ve got this!',
      },
    },
    exampleDe:
      'Lena: Ich schreibe am Dienstag und Freitag noch meine letzten Prüfungen.\nFelix: Viel Erfolg auf jeden Fall schon mal!',
    exampleEn:
      'Lena: I’m taking my last exams on Tuesday and Friday.\nFelix: Best of luck either way in advance!',
    anatomy: {
      caseGovernanceNote:
        'For exams or job interviews, Germans prefer „Viel Erfolg!“ (wishing success from your effort) over „Viel Glück!“ (pure luck). Adding „schon mal“ means „in advance“.',
      synonyms: ['Ich drücke dir die Daumen!', 'Viel Glück!'],
      antonyms: ['Schade, beim nächsten Mal!'],
      collocations: [
        'Viel Erfolg bei der Prüfung!',
        'Ich drücke dir ganz fest die Daumen!',
      ],
      wordFamily: ['der Erfolg (success)', 'erfolgreich (successful)', 'auf jeden Fall (definitely)'],
      b1ExamTip:
        'Cultural pro tip: „Viel Erfolg!“ before tests and interviews sounds thoughtful because it honors the person’s preparation.',
    },
  },
  {
    id: 'chat-chunk-060',
    lemma: 'Das fällt mir zurzeit schwer.',
    spokenText: 'Das fällt mir zurzeit schwer.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Gefühle · Schwierigkeiten teilen',
    translation: 'I’m finding that hard lately.',
    highlightTarget: 'fällt mir zurzeit schwer',
    phraseDetails: {
      framePattern: '[Etwas] fällt mir (zurzeit / gerade) schwer / leicht.',
      casePattern: 'jemandem (Dativ: mir) schwerfallen (trennbares Verb: fällt … schwer)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Die Umstellung fällt mir momentan noch etwas schwer.',
        textEn: 'I am still finding the adjustment somewhat difficult at the moment.',
        contextNote: 'Formell / Studium & Beruf',
      },
      informalVariant: {
        textDe: 'Ich muss zugeben, das Lernen fällt mir zurzeit noch ein bisschen schwer.',
        textEn: 'I have to admit, studying still feels a bit hard for me lately.',
        contextNote: 'Ehrlich und natürlich im Gespräch',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wie läuft die Vorbereitung auf deine Prüfung?',
        promptEn: 'How is the preparation for your exam going?',
        speakerB: 'Lena',
        replyDe: 'Das Thema mag ich, aber das Lernen fällt mir zurzeit schwer.',
        replyEn: 'I like the topic, but I’m finding it hard to study lately.',
      },
    },
    exampleDe:
      'Felix: Lief das Lernen heute gut?\nLena: Ehrlich gesagt: Das Lernen fällt mir zurzeit schwer.',
    exampleEn:
      'Felix: Did studying go well today?\nLena: Honestly, I’m finding studying hard lately.',
    anatomy: {
      caseGovernanceNote:
        '„Schwerfallen“ (and its opposite „leichtfallen“) works backwards from English: the difficult thing is the subject („Das Lernen“), and you are in the Dative („mir“).',
      synonyms: ['Das ist gerade gar nicht leicht für mich.', 'Ich tue mich damit schwer.'],
      antonyms: ['Das fällt mir richtig leicht!'],
      collocations: [
        'Früh aufstehen fällt mir schwer.',
        'Sprachen fallen ihr total leicht.',
      ],
      wordFamily: ['schwerfallen (to be hard for)', 'leichtfallen (to come easily to)', 'zurzeit (currently / lately)'],
      b1ExamTip:
        'Swap „schwer“ for „leicht“ to flip the meaning instantly: „Deutsch sprechen fällt mir immer leichter!“.',
    },
  },
  {
    id: 'chat-chunk-061',
    lemma: 'Ich bin gerade bei Freunden.',
    spokenText: 'Ich bin gerade bei Freunden.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Freizeit · Besuch erzählen',
    translation: 'I’m over at my friends’ place right now.',
    highlightTarget: 'bin gerade bei Freunden',
    phraseDetails: {
      framePattern: 'Ich bin gerade bei Freunden / bei Lena / bei meinen Eltern.',
      casePattern: 'Präposition „bei“ + Dativ Plural (Freunden) = bei jemandem zu Hause',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin heute Abend bei Bekannten eingeladen.',
        textEn: 'I am invited over to acquaintances’ tonight.',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Ich bin gerade bei Freunden, wir schauen zusammen einen Film.',
        textEn: 'I’m over at my friends’ place right now, we’re watching a movie together.',
        contextNote: 'Alltägliche Freizeit-Aussage',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Was machst du heute Abend Schönes?',
        promptEn: 'What nice things are you up to tonight?',
        speakerB: 'Lena',
        replyDe: 'Ich bin gerade bei Freunden und wir machen einen Filmabend.',
        replyEn: 'I’m over at my friends’ place right now and we’re having a movie night.',
      },
    },
    exampleDe:
      'Felix: Was treibst du heute Abend noch?\nLena: Ich bin gerade bei Freunden, wir schauen einen Gruselfilm.',
    exampleEn:
      'Felix: What else are you up to tonight?\nLena: I’m over at my friends’ place right now, we’re watching a scary movie.',
    anatomy: {
      caseGovernanceNote:
        '„Bei“ ALWAYS takes the Dative and means „at someone’s home / with someone“ (static location). Notice the Dative plural „-n“ on „Freunde“ → „bei Freunden“.',
      synonyms: ['Ich bin bei Freunden zu Besuch.', 'Ich hänge gerade mit Freunden ab.'],
      antonyms: ['Ich bin heute Abend allein zu Hause.'],
      collocations: [
        'Ich gehe nachher zu Freunden. (Wohin?)',
        'Ich bin bei Freunden. (Wo?)',
      ],
      wordFamily: ['der Freund, -e (friend)', 'bei (at someone’s place)', 'zu Besuch (visiting)'],
      b1ExamTip:
        'Never say „an meinem Freunds Haus“—in German, „at someone’s place“ is always „bei + Dativ“ („bei Mia“, „bei Freunden“).',
    },
  },
  {
    id: 'chat-chunk-062',
    lemma: 'Neue Leute kennenlernen macht Spaß.',
    spokenText: 'Neue Leute kennenlernen macht Spaß.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Gesellschaft · Über Menschen reden',
    translation: 'Meeting new people is fun.',
    highlightTarget: 'Neue Leute kennenlernen macht Spaß',
    phraseDetails: {
      framePattern: '[Aktivität im Infinitiv] macht immer Spaß.',
      casePattern: 'Infinitivgruppe als Subjekt → Verb im Singular („macht Spaß“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Es ist immer bereichernd, neue Kontakte zu knüpfen.',
        textEn: 'It is always enriching to make new contacts.',
        contextNote: 'Formell / Beruf & Netzwerk',
      },
      informalVariant: {
        textDe: 'Neue Leute kennenlernen macht einfach immer Spaß!',
        textEn: 'Meeting new people is just always fun!',
        contextNote: 'Super leicht übertragbares Satzmuster für Hobbys',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Auf der Feier kannte ich viele nicht, aber neue Leute kennenlernen macht Spaß.',
        promptEn: 'I didn’t know a lot of people at the party, but meeting new people is fun.',
        speakerB: 'Lena',
        replyDe: 'Ja, total! Man hört immer so spannende Geschichten.',
        replyEn: 'Yeah, totally! You always hear such interesting stories.',
      },
    },
    exampleDe:
      'Felix: Auf der Feier waren viele Fremde, aber es war super.\nLena: Ja, neue Leute kennenlernen macht Spaß!',
    exampleEn:
      'Felix: There were lots of strangers at the party, but it was great.\nLena: Yeah, meeting new people is fun!',
    anatomy: {
      caseGovernanceNote:
        'In German, „something is fun“ is always „etwas macht Spaß“ (never „ist Spaß“). When an infinitive phrase acts as the subject, the verb is always singular („macht“).',
      synonyms: ['Es ist immer schön, neue Leute kennenzulernen.'],
      antonyms: ['Das macht mir keinen Spaß.'],
      collocations: [
        'Mit anderen Sport machen macht Spaß.',
        'Viel Spaß dabei!',
      ],
      wordFamily: ['kennenlernen (to get to know / meet)', 'die Leute (people, plural)', 'der Spaß (fun)'],
      b1ExamTip:
        '„Viel Spaß dabei!“ (Have fun with that!) is another instant reflex whenever a friend tells you about evening plans.',
    },
  },
  {
    id: 'chat-chunk-063',
    lemma: 'Ich kann immer und überall einschlafen.',
    spokenText: 'Ich kann immer und überall einschlafen.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Persönliche Eigenart teilen',
    translation: 'I can fall asleep anytime and anywhere.',
    highlightTarget: 'immer und überall einschlafen',
    phraseDetails: {
      framePattern: 'Ich kann immer und überall + [Infinitiv am Ende].',
      casePattern: 'Modalverb „kann“ + Paarformel „immer und überall“ + Infinitiv „einschlafen“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich habe keinerlei Schwierigkeiten, an fremden Orten einzuschlafen.',
        textEn: 'I have no trouble at all falling asleep in unfamiliar places.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Ich brauche viel Schlaf, aber ich kann auch immer und überall einschlafen!',
        textEn: 'I need lots of sleep, but I can also fall asleep anytime and anywhere!',
        contextNote: 'Lebendige Paarformel für lockere Tischgespräche',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hast du eigentlich Probleme, in einem fremden Bett einzuschlafen?',
        promptEn: 'Do you ever have trouble falling asleep in an unfamiliar bed?',
        speakerB: 'Lena',
        replyDe: 'Gar nicht! Ich kann immer und überall einschlafen.',
        replyEn: 'Not at all! I can fall asleep anytime and anywhere.',
      },
    },
    exampleDe:
      'Felix: Brauchst du es zum Schlafen immer komplett dunkel und leise?\nLena: Überhaupt nicht, ich kann immer und überall einschlafen!',
    exampleEn:
      'Felix: Do you always need it completely dark and quiet to sleep?\nLena: Not at all, I can fall asleep anytime and anywhere!',
    anatomy: {
      caseGovernanceNote:
        'Distinguish „schlafen“ (to sleep) from „einschlafen“ (to fall asleep, separable verb that stays joined after modal verb „kann“). „Immer und überall“ is a rhythmic German pair.',
      synonyms: ['Ich schlafe überall problemlos ein.'],
      antonyms: ['Ich kann an fremden Orten schlecht einschlafen.'],
      collocations: [
        'Sofort einschlafen.',
        'Im Zug kurz einschlafen.',
        'Ich brauche mindestens acht Stunden Schlaf.',
      ],
      wordFamily: ['einschlafen (to fall asleep)', 'ausschlafen (to sleep in)', 'der Schlaf (sleep)'],
      b1ExamTip:
        'Learn the sleep trio: „einschlafen“ (fall asleep), „schlafen“ (sleep), „ausschlafen“ (sleep in)—comes up in almost every casual chat!',
    },
  },
  {
    id: 'chat-chunk-064',
    lemma: 'Das klingt nach einem Haufen Arbeit.',
    spokenText: 'Das klingt nach einem Haufen Arbeit.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Mitgefühl bei Stress',
    translation: 'That sounds like a ton of work.',
    highlightTarget: 'klingt nach einem Haufen Arbeit',
    phraseDetails: {
      framePattern: 'Das klingt nach einem Haufen Arbeit / einer Menge Arbeit.',
      casePattern: 'klingen nach + Dativ Maskulin (einem Haufen) + Arbeit',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das klingt nach einem sehr großen Arbeitsaufwand.',
        textEn: 'That sounds like a very heavy workload.',
        contextNote: 'Formell / Beruf & Projekte',
      },
      informalVariant: {
        textDe: 'So viele Messungen für das Praktikum? Das klingt nach einem Haufen Arbeit!',
        textEn: 'That many measurements for your internship? That sounds like a ton of work!',
        contextNote: 'Sehr authentisches Mitgefühl unter Freunden oder Kommilitonen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich musste erst ein Vorpraktikum machen, dann das Praktikum und dann meine Abschlussarbeit.',
        promptEn: 'First I had to do a pre-internship, then the internship, and then my thesis.',
        speakerB: 'Felix',
        replyDe: 'Oh wow, das klingt nach einem Haufen Arbeit!',
        replyEn: 'Oh wow, that sounds like a ton of work!',
      },
    },
    exampleDe:
      'Lena: In meinem Praktikum habe ich wochenlang Daten ausgewertet.\nFelix: Puh, das klingt nach einem Haufen Arbeit!',
    exampleEn:
      'Lena: During my internship I analyzed data for weeks.\nFelix: Phew, that sounds like a ton of work!',
    anatomy: {
      caseGovernanceNote:
        '„Klingen nach + Dativ“ means „to sound like“ (always followed by a noun: „Das klingt nach einem Plan“, „Das klingt nach Stress“). „Ein Haufen“ (literally „a pile“) idiomatically means „a ton / loads of“.',
      synonyms: ['Das klingt nach richtig viel Arbeit!', 'Das hört sich anstrengend an.'],
      antonyms: ['Das klingt super entspannt!'],
      collocations: [
        'Ein Haufen Arbeit.',
        'Das klingt nach einem guten Plan.',
        'Das klingt nach Spaß!',
      ],
      wordFamily: ['der Haufen (pile / ton)', 'die Arbeit (work)', 'klingen nach (to sound like)'],
      b1ExamTip:
        'Use „Das klingt nach + Dativ“ for instant reactions: „Das klingt nach Spaß!“, „Das klingt nach einem guten Plan!“, „Das klingt nach einem Haufen Arbeit!“.',
    },
  },
];
