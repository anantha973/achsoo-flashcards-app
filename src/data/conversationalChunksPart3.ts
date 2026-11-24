import type { VocabCard } from './vocabData';

/**
 * Curated A1–A2 Conversational Chunks & Social Reactions (Part 3: 065–096)
 * - Mini-Deck 1 expansion (chat-chunk-065 .. chat-chunk-088): Einstieg, Check-in & Abschied
 * - Mini-Deck 2 expansion start (chat-chunk-089 .. chat-chunk-096): Reaktionen, Zustimmung & Neckerei
 */
export const CONVERSATIONAL_CHUNKS_PART_3: VocabCard[] = [
  // =========================================================================
  // MINI-DECK 1 EXPANSION: EINSTIEG, CHECK-IN & ABSCHIED (065–088)
  // =========================================================================
  {
    id: 'chat-chunk-065',
    lemma: 'Ich fahre heute Abend heim.',
    spokenText: 'Ich fahre heute Abend heim.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Abschied · Heimfahrt ankündigen',
    translation: 'I’m heading home tonight.',
    highlightTarget: 'fahre heute Abend heim',
    phraseDetails: {
      framePattern: 'Ich fahre heute Abend / morgen früh heim.',
      casePattern: 'trennbares Verb „heimfahren“ (= nach Hause fahren)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich trete heute Abend die Heimreise an.',
        textEn: 'I am starting my journey home this evening.',
        contextNote: 'Formell / Schriftlich',
      },
      informalVariant: {
        textDe: 'Ich fahre heute Abend dann heim und melde mich, wenn ich da bin.',
        textEn: 'I’m heading home tonight then and will text once I’m there.',
        contextNote: 'Sehr natürliches Alltagswort „heim“ statt „nach Hause“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich fahre heute Abend heim – hast du davor noch kurz Zeit auf einen Kaffee?',
        promptEn: 'I’m heading home tonight—do you still have a quick minute for a coffee before then?',
        speakerB: 'Lena',
        replyDe: 'Ja klar, komm um fünf einfach vorbei!',
        replyEn: 'Yeah sure, just swing by at five!',
      },
    },
    exampleDe:
      'Felix: Ich fahre heute Abend heim.\nLena: Alles klar, komm gut an!',
    exampleEn:
      'Felix: I’m heading home tonight.\nLena: Alright, have a safe trip!',
    anatomy: {
      caseGovernanceNote:
        '„Heimfahren / heimgehen / heimkommen“ are super common, compact synonyms for „nach Hause fahren / gehen / kommen“. As separable verbs, „heim“ goes to the end.',
      synonyms: ['Ich fahre heute Abend nach Hause.', 'Ich mache mich später auf den Heimweg.'],
      antonyms: ['Ich bleibe noch über Nacht hier.'],
      collocations: [
        'Wann fährst du heim?',
        'Komm gut heim!',
      ],
      wordFamily: ['heimfahren (to drive home)', 'heimgehen (to go home)', 'der Heimweg (way home)'],
      b1ExamTip:
        'Using „heim“ („Ich gehe heim“, „Komm gut heim!“) sounds warmly natural across Germany and Austria.',
    },
  },
  {
    id: 'chat-chunk-066',
    lemma: 'Das werde ich tun!',
    spokenText: 'Das werde ich tun!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Zusage · Freundlich versprechen',
    translation: 'I’ll do that! · Will do!',
    highlightTarget: 'Das werde ich tun',
    phraseDetails: {
      framePattern: 'Danke, das werde ich tun / mache ich!',
      casePattern: 'Futur I „werden“ + Infinitiv „tun“ · Objekt „Das“ auf Position 1',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Vielen Dank, das werde ich sehr gerne tun.',
        textEn: 'Thank you very much, I will gladly do that.',
        contextNote: 'Höflich / Formell & Warm',
      },
      informalVariant: {
        textDe: 'Dankeschön, das werde ich tun – ich schicke dir morgen ein Foto!',
        textEn: 'Thanks a lot, will do—I’ll send you a photo tomorrow!',
        contextNote: 'Freundliche, klare Bestätigung auf eine Bitte',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Komm gut an und zeig mir morgen dein fertiges Bild!',
        promptEn: 'Get home safely and show me your finished painting tomorrow!',
        speakerB: 'Felix',
        replyDe: 'Dankeschön, das werde ich tun!',
        replyEn: 'Thanks a lot, I will do that!',
      },
    },
    exampleDe:
      'Lena: Grüß bitte Mia ganz lieb von mir!\nFelix: Dankeschön, das werde ich tun!',
    exampleEn:
      'Lena: Please say a big hi to Mia from me!\nFelix: Thanks, I’ll definitely do that!',
    anatomy: {
      caseGovernanceNote:
        'Putting „Das“ in Position 1 emphasizes the promise („That I will do!“). In ultra-casual speech, „Mache ich!“ is an even shorter sibling.',
      synonyms: ['Mache ich!', 'Wird gemacht!', 'Sehr gern!'],
      antonyms: ['Das schaffe ich leider nicht.'],
      collocations: [
        'Danke, das mache ich gern.',
        'Das werde ich auf jeden Fall tun.',
      ],
      wordFamily: ['tun (to do)', 'machen (to do / make)', 'werden (will)'],
      b1ExamTip:
        'A polite, reliable reply whenever someone asks you to send something, say hello to a friend, or take care of yourself.',
    },
  },
  {
    id: 'chat-chunk-067',
    lemma: 'Ich suche das morgen raus.',
    spokenText: 'Ich suche das morgen raus.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Etwas heraussuchen',
    translation: 'I’ll dig that out tomorrow. · I’ll look it up tomorrow.',
    highlightTarget: 'suche das morgen raus',
    phraseDetails: {
      framePattern: 'Ich suche (mir / dir) das morgen / später raus.',
      casePattern: 'trennbares Verb „raussuchen“ (= heraussuchen) + Akkusativ',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich werde die passenden Informationen morgen für Sie heraussuchen.',
        textEn: 'I will look up the relevant information for you tomorrow.',
        contextNote: 'Formell / Beruf („heraussuchen“)',
      },
      informalVariant: {
        textDe: 'Ich bin eben angekommen – ich suche das morgen raus und schicke es dir!',
        textEn: 'I just got in—I’ll dig that out tomorrow and send it to you!',
        contextNote: 'Gesprochenes Standarddeutsch nutzt fast immer „raus-“ statt „heraus-“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Hast du noch das Rezept für den Zitronenkuchen?',
        promptEn: 'Do you still have the recipe for the lemon cake?',
        speakerB: 'Felix',
        replyDe: 'Ja, irgendwo im Regal – ich suche das morgen raus!',
        replyEn: 'Yeah, somewhere on the shelf—I’ll dig it out tomorrow!',
      },
    },
    exampleDe:
      'Lena: Weißt du noch, wie das kleine Restaurant in Hamburg hieß?\nFelix: Ich suche das morgen raus und schicke dir den Namen.',
    exampleEn:
      'Lena: Do you still remember what that little restaurant in Hamburg was called?\nFelix: I’ll look it up tomorrow and send you the name.',
    anatomy: {
      caseGovernanceNote:
        '„Raussuchen“ (spoken form of „heraussuchen“) works both for physically digging an object out of a box/closet AND for looking up an address, link, or train connection.',
      synonyms: ['Ich schaue morgen mal nach.', 'Ich finde das morgen raus.'],
      antonyms: ['Ich habe es sofort griffbereit.'],
      collocations: [
        'Eine gute Verbindung raussuchen.',
        'Ein schönes Foto raussuchen.',
      ],
      wordFamily: ['raussuchen (to dig out / look up)', 'suchen (to search)', 'rausfinden (to find out)'],
      b1ExamTip:
        'Mastering „raus-“ / „rein-“ / „rüber-“ verbs immediately makes your spoken German sound authentic rather than stiff.',
    },
  },
  {
    id: 'chat-chunk-068',
    lemma: 'Wie sieht es bei dir aus?',
    spokenText: 'Wie sieht es bei dir aus?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Check-in · Nach Plänen oder Lage fragen',
    translation: 'How are things looking on your end?',
    highlightTarget: 'Wie sieht es bei dir aus',
    phraseDetails: {
      framePattern: 'Wie sieht es (heute Abend / am Wochenende) bei dir aus?',
      casePattern: 'trennbares Verb „aussehen“ + bei + Dativ (dir / euch)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wie sieht es terminlich diese Woche bei Ihnen aus?',
        textEn: 'How is your schedule looking this week?',
        contextNote: 'Höflich / Beruf & Terminabsprache',
      },
      informalVariant: {
        textDe: 'Wie sieht es am Samstag bei dir aus – wollen wir kochen?',
        textEn: 'How’s Saturday looking for you—want to cook together?',
        contextNote: 'Die perfekte Frage zum Verabreden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wie sieht es am Sonntag bei dir aus? Lust auf einen Spaziergang?',
        promptEn: 'How’s Sunday looking for you? Up for a walk?',
        speakerB: 'Lena',
        replyDe: 'Nachmittags sieht es bei mir richtig gut aus!',
        replyEn: 'Afternoon is looking really good for me!',
      },
    },
    exampleDe:
      'Felix: Wie sieht es bei dir aus am Wochenende?\nLena: Am Samstag habe ich Zeit, da können wir gern etwas machen.',
    exampleEn:
      'Felix: How are things looking on your end this weekend?\nLena: I’m free on Saturday, we can definitely do something then.',
    anatomy: {
      caseGovernanceNote:
        'Literally „How does it look at yours?“. Works both for checking someone’s availability AND checking how a project, task, or drawing looks („Wie sieht deine Zeichnung aus?“).',
      synonyms: ['Wie schaut es bei dir aus?', 'Hast du am Wochenende Zeit?'],
      antonyms: ['Bei mir sieht es schlecht aus.'],
      collocations: [
        'Sieht gut aus!',
        'Bei mir sieht es zeitlich gerade knapp aus.',
      ],
      wordFamily: ['aussehen (to look)', 'das Aussehen (appearance)', 'ausschauen (southern synonym)'],
      b1ExamTip:
        'In southern Germany and Austria you will also hear „Wie schaut es aus?“—exact same meaning!',
    },
  },
  {
    id: 'chat-chunk-069',
    lemma: 'Wie ist es bei dir?',
    spokenText: 'Wie ist es bei dir?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Gespräch · Ball zurückspielen',
    translation: 'How about you? · How is it for you?',
    highlightTarget: 'Wie ist es bei dir',
    phraseDetails: {
      framePattern: 'Ich mag das sehr – und wie ist es bei dir?',
      casePattern: 'Fragewort „wie“ + „sein“ + bei + Dativ (dir / euch)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Und wie ist es bei Ihnen?',
        textEn: 'And how is it with you?',
        contextNote: 'Höflich / Smalltalk',
      },
      informalVariant: {
        textDe: 'Ich bin eher schlecht im Singen – wie ist es bei dir?',
        textEn: 'I’m pretty bad at singing—how about you?',
        contextNote: 'Einfachster Gesprächs-Pass zurück zum Gegenüber',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich brauche mindestens acht Stunden Schlaf – wie ist es bei dir?',
        promptEn: 'I need at least eight hours of sleep—how about you?',
        speakerB: 'Lena',
        replyDe: 'Bei mir sind neun Stunden am besten!',
        replyEn: 'For me nine hours is best!',
      },
    },
    exampleDe:
      'Felix: Ich bin beim Singen eher nicht so talentiert – wie ist es bei dir?\nLena: Meine Stimme hört sich auch nicht viel besser an!',
    exampleEn:
      'Felix: I’m not really that talented at singing—how about you?\nLena: My voice doesn’t sound much better either!',
    anatomy: {
      caseGovernanceNote:
        '„Bei dir“ (Dative) means „in your case / for you“. A super clean way to bounce any topic back to your conversation partner.',
      synonyms: ['Und bei dir?', 'Und wie siehst du das?'],
      antonyms: ['Bei mir ist es genauso.'],
      collocations: [
        'Und wie ist es bei euch?',
        'Bei mir ist das ganz anders.',
      ],
      wordFamily: ['bei (with / for)', 'dir (you, dative)'],
      b1ExamTip:
        'Whenever you finish answering a question at the dinner table, toss back „Und wie ist es bei dir?“ to keep the flow effortless.',
    },
  },
  {
    id: 'chat-chunk-070',
    lemma: 'Bist du etwa schon unterwegs?',
    spokenText: 'Bist du etwa schon unterwegs?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Nachfrage · Überraschung mit „etwa“',
    translation: 'Don’t tell me you’re already out? · Are you actually out already?',
    highlightTarget: 'etwa schon unterwegs',
    phraseDetails: {
      framePattern: 'Bist du / Hast du etwa schon …?',
      casePattern: 'Modalpartikel „etwa“ in Ja/Nein-Fragen (= ungläubige / neckende Vermutung)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sind Sie tatsächlich bereits unterwegs?',
        textEn: 'Are you actually already on your way?',
        contextNote: 'Formell / Sachliche Nachfrage',
      },
      informalVariant: {
        textDe: 'Nicht zu Hause? Bist du etwa schon wieder unterwegs?',
        textEn: 'Not at home? Don’t tell me you’re out and about again?',
        contextNote: 'Spielerisch-neugierig dank „etwa“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Du bist gar nicht zu Hause – bist du etwa schon unterwegs?',
        promptEn: 'You’re not home at all—are you already out and about?',
        speakerB: 'Lena',
        replyDe: 'Ich wünschte! Ich sitze in der Bibliothek und lerne.',
        replyEn: 'I wish! I’m sitting in the library studying.',
      },
    },
    exampleDe:
      'Felix: Bist du etwa schon unterwegs?\nLena: Ich wünschte! Ich sitze leider noch am Schreibtisch.',
    exampleEn:
      'Felix: Don’t tell me you’re already out and about?\nLena: I wish! Sadly I’m still stuck at my desk.',
    anatomy: {
      caseGovernanceNote:
        'In yes/no questions, modal particle „etwa“ expresses playful disbelief or surprise („surely not…?“ / „don’t tell me…?“). Outside questions, „etwa“ means „approximately“.',
      synonyms: ['Etwa schon unterwegs?', 'Bist du wirklich schon los?'],
      antonyms: ['Du bist bestimmt noch zu Hause.'],
      collocations: [
        'Hast du etwa schon gegessen?',
        'Schläfst du etwa noch?',
      ],
      wordFamily: ['etwa (modal particle / approximately)', 'unterwegs (out / on the way)'],
      b1ExamTip:
        '„Hast du etwa …?“ is gold for lighthearted banter with friends—it adds instant personality to a plain question.',
    },
  },
  {
    id: 'chat-chunk-071',
    lemma: 'Ich bin gerade am Lernen.',
    spokenText: 'Ich bin gerade am Lernen.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Gerade dabei sein',
    translation: 'I’m in the middle of studying right now.',
    highlightTarget: 'gerade am Lernen',
    phraseDetails: {
      framePattern: 'Ich bin gerade am + [großgeschriebener Infinitiv] (Lernen / Kochen / Packen).',
      casePattern: 'Verlaufsform „am + nominalisierter Infinitiv“ (immer großgeschrieben!)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bereite mich gerade auf meine Prüfung vor.',
        textEn: 'I am currently preparing for my exam.',
        contextNote: 'Formell / Standardsprache',
      },
      informalVariant: {
        textDe: 'Ich bin gerade am Lernen und mache gleich eine kurze Pause.',
        textEn: 'I’m right in the middle of studying and will take a quick break soon.',
        contextNote: 'Sehr beliebte gesprochene Verlaufsform im Deutschen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Was machst du gerade Schönes?',
        promptEn: 'What nice things are you up to right now?',
        speakerB: 'Lena',
        replyDe: 'Ich bin gerade am Lernen, leider noch zwei Prüfungen!',
        replyEn: 'I’m in the middle of studying, sadly still two exams left!',
      },
    },
    exampleDe:
      'Felix: Bist du heute Nachmittag draußen unterwegs?\nLena: Leider nicht, ich bin gerade am Lernen.',
    exampleEn:
      'Felix: Are you out and about this afternoon?\nLena: Sadly not, I’m right in the middle of studying.',
    anatomy: {
      caseGovernanceNote:
        'The „am + Infinitiv“ structure (called the „am-Progressiv“) is German’s closest equivalent to English „-ing“! Because „am“ = „an dem“, the verb turns into a capitalized neuter noun: „am Kochen“, „am Arbeiten“, „am Lernen“.',
      synonyms: ['Ich lerne gerade.', 'Ich bin gerade dabei zu lernen.'],
      antonyms: ['Ich bin schon fertig mit dem Lernen.'],
      collocations: [
        'Ich bin gerade am Kochen.',
        'Wir sind noch am Überlegen.',
      ],
      wordFamily: ['lernen (to study / learn)', 'das Lernen (studying)', 'gerade (right now)'],
      b1ExamTip:
        'Use „Ich bin am Kochen / Packen / Überlegen“ in spoken conversation—it sounds 100% natural!',
    },
  },
  {
    id: 'chat-chunk-072',
    lemma: 'Ich bin schon dran!',
    spokenText: 'Ich bin schon dran!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Aktiv an etwas arbeiten',
    translation: 'I’m already on it! · I’m working on it!',
    highlightTarget: 'bin schon dran',
    phraseDetails: {
      framePattern: 'Ich bin (schon) dran / an + [Dativ] dran.',
      casePattern: 'umgangssprachlich „dran sein“ (= an einer Sache arbeiten / aktiv dabei sein)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich kümmere mich bereits darum.',
        textEn: 'I am already taking care of it.',
        contextNote: 'Formell / Beruf',
      },
      informalVariant: {
        textDe: 'Mein Knie zwickt noch etwas, aber ich bin am Training dran, damit es besser wird!',
        textEn: 'My knee still twinges a bit, but I’m working on training so it gets better!',
        contextNote: 'Kurz und tatkräftig im Alltag',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Hast du schon nach Zügen für unser Wochenende geschaut?',
        promptEn: 'Have you looked up trains for our weekend yet?',
        speakerB: 'Felix',
        replyDe: 'Ja, ich bin schon dran! Ich schicke dir gleich zwei Optionen.',
        replyEn: 'Yes, I’m already on it! I’ll send you two options in a second.',
      },
    },
    exampleDe:
      'Lena: Hast du schon einen Tisch für heute Abend reserviert?\nFelix: Keine Sorge, ich bin schon dran!',
    exampleEn:
      'Lena: Have you reserved a table for tonight yet?\nFelix: Don’t worry, I’m already on it!',
    anatomy: {
      caseGovernanceNote:
        '„Dran“ is the everyday spoken form of „daran“. Note two key meanings: „Ich bin schon dran“ (I’m already working on it) AND „Du bist dran!“ (It’s your turn!).',
      synonyms: ['Ich kümmere mich schon darum.', 'Ich bin dabei!'],
      antonyms: ['Ich habe noch gar nicht angefangen.'],
      collocations: [
        'Du bist dran! (It’s your turn!)',
        'Bleib dran! (Keep at it!)',
      ],
      wordFamily: ['dran / daran (on it / at it)', 'dranbleiben (to stick with it)'],
      b1ExamTip:
        'Two-for-one reflex: „Ich bin schon dran!“ (I’m on it) and at game night: „Du bist dran!“ (Your turn!).',
    },
  },
  {
    id: 'chat-chunk-073',
    lemma: 'Seid ihr schon angekommen?',
    spokenText: 'Seid ihr schon angekommen?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Check-in · Nach Ankunft fragen',
    translation: 'Have you arrived already?',
    highlightTarget: 'schon angekommen',
    phraseDetails: {
      framePattern: 'Bist du / Seid ihr schon (gut) angekommen?',
      casePattern: 'Perfekt mit „sein“ (ihr seid … angekommen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sind Sie gut an Ihrem Zielort angekommen?',
        textEn: 'Did you arrive safely at your destination?',
        contextNote: 'Höflich / Kollegen oder Gäste',
      },
      informalVariant: {
        textDe: 'Oh, schon angekommen? Wie war die Fahrt?',
        textEn: 'Oh, arrived already? How was the trip?',
        contextNote: 'Typische Nachfrage nach einer Reise-Nachricht',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Seid ihr schon angekommen in Rotterdam?',
        promptEn: 'Have you arrived in Rotterdam already?',
        speakerB: 'Felix',
        replyDe: 'Noch nicht ganz, wir sitzen noch eine Stunde im Zug.',
        replyEn: 'Not quite yet, we’re still on the train for another hour.',
      },
    },
    exampleDe:
      'Lena: Seid ihr schon angekommen?\nFelix: Nein, wir sind erst über die Grenze und sitzen noch im Zug.',
    exampleEn:
      'Lena: Have you arrived already?\nFelix: No, we just crossed the border and are still on the train.',
    anatomy: {
      caseGovernanceNote:
        'Remember „ihr seid“ (with „d“, from „sein“) vs. „seit“ (with „t“, since/for). „Ankommen“ always builds Perfekt with „sein“.',
      synonyms: ['Seid ihr schon da?', 'Bist du gut angekommen?'],
      antonyms: ['Seid ihr überhaupt schon losgefahren?'],
      collocations: [
        'Bist du gut zu Hause angekommen?',
        'Wir sind gerade erst angekommen.',
      ],
      wordFamily: ['ankommen (to arrive)', 'die Ankunft (arrival)', 'schon (already)'],
      b1ExamTip:
        'Quick spelling check: „Seid ihr…?“ (verb „sein“ = d) vs. „Seit wann…?“ (time = t).',
    },
  },
  {
    id: 'chat-chunk-074',
    lemma: 'Ich berichte dir dann!',
    spokenText: 'Ich berichte dir dann!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Absprache · Später erzählen',
    translation: 'I’ll fill you in afterwards! · I’ll report back to you!',
    highlightTarget: 'berichte dir dann',
    phraseDetails: {
      framePattern: 'Ich berichte dir dann (wie es war)!',
      casePattern: 'berichten + Dativ (Person: dir) · Präsens mit Zukunftsbedeutung („dann“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich werde Ihnen im Anschluss gerne davon berichten.',
        textEn: 'I will gladly report back to you about it afterwards.',
        contextNote: 'Formell / Beruf & Projekte',
      },
      informalVariant: {
        textDe: 'Wir probieren heute Abend das neue Restaurant aus – ich berichte dir dann!',
        textEn: 'We’re trying out the new restaurant tonight—I’ll report back to you!',
        contextNote: 'Sehr beliebt, wenn man ein Erlebnis später teilen will',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Probier unbedingt die niederländischen Pommes dort!',
        promptEn: 'Definitely try the Dutch fries over there!',
        speakerB: 'Felix',
        replyDe: 'Keine Sorge, das machen wir – ich berichte dir dann!',
        replyEn: 'Don’t worry, we will—I’ll fill you in afterwards!',
      },
    },
    exampleDe:
      'Lena: Sag mir unbedingt, wie der neue Film war!\nFelix: Klar, ich berichte dir dann morgen.',
    exampleEn:
      'Lena: Definitely tell me how the new movie was!\nFelix: Sure, I’ll fill you in tomorrow.',
    anatomy: {
      caseGovernanceNote:
        'German frequently uses the present tense + „dann“ (then/afterwards) instead of Futur I for promises: „Ich berichte dir dann“, „Ich erzähle dir dann alles“.',
      synonyms: ['Ich erzähle dir dann, wie es war!', 'Ich halte dich auf dem Laufenden.'],
      antonyms: ['Das bleibt mein Geheimnis.'],
      collocations: [
        'Berichte mal, wie es war!',
        'Ich berichte dir morgen ausführlich.',
      ],
      wordFamily: ['berichten (to report / tell)', 'der Bericht (report)'],
      b1ExamTip:
        'Sounds slightly livelier and more vivid than plain „Ich erzähle dir“, especially for trips, restaurants, or dates.',
    },
  },
  {
    id: 'chat-chunk-075',
    lemma: 'Keine Sorge!',
    spokenText: 'Keine Sorge!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Beruhigen',
    translation: 'Don’t worry! · No worries!',
    highlightTarget: 'Keine Sorge',
    phraseDetails: {
      framePattern: 'Keine Sorge, + [Hauptsatz]!',
      casePattern: 'Negation Feminin Singular (die Sorge → keine Sorge)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Machen Sie sich bitte keine Sorgen, alles läuft nach Plan.',
        textEn: 'Please do not worry, everything is going according to plan.',
        contextNote: 'Höflich / Beruf & Alltag',
      },
      informalVariant: {
        textDe: 'Keine Sorge, gutes Essen probieren wir im Urlaub auf jeden Fall aus!',
        textEn: 'Don’t worry, we’re definitely trying great food on vacation!',
        contextNote: 'Lockeres Beruhigen mit Augenzwinkern',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Vergiss aber nicht, im Urlaub auch richtig lecker essen zu gehen!',
        promptEn: 'Don’t forget to go eat some really good food on vacation too!',
        speakerB: 'Felix',
        replyDe: 'Keine Sorge, das steht ganz oben auf unserer Liste!',
        replyEn: 'Don’t worry, that’s right at the top of our list!',
      },
    },
    exampleDe:
      'Lena: Verpass bloß deinen Anschlusszug nicht!\nFelix: Keine Sorge, ich bin extra früh am Gleis.',
    exampleEn:
      'Lena: Just don’t miss your connecting train!\nFelix: Don’t worry, I’m at the platform extra early.',
    anatomy: {
      caseGovernanceNote:
        'Short fixed phrase in singular („Keine Sorge!“), whereas the full verb phrase uses plural („Mach dir keine Sorgen!“).',
      synonyms: ['Mach dir keine Sorgen!', 'Alles entspannt!', 'Kein Problem!'],
      antonyms: ['Da mache ich mir echt Sorgen.'],
      collocations: [
        'Keine Sorge, ich vergesse es nicht!',
        'Mach dir keinen Kopf!',
      ],
      wordFamily: ['die Sorge, -n (worry)', 'sich sorgen um (to worry about)', 'sorglos (carefree)'],
      b1ExamTip:
        'Notice singular vs. plural: „Keine Sorge!“ (standalone) vs. „Mach dir keine Sorgen!“ (with verb).',
    },
  },
  {
    id: 'chat-chunk-076',
    lemma: 'Das mache ich sowieso.',
    spokenText: 'Das mache ich sowieso.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Zusage · Selbstverständlich',
    translation: 'I’ll do that anyway. · I was going to do that regardless.',
    highlightTarget: 'mache ich sowieso',
    phraseDetails: {
      framePattern: 'Das mache ich / werde ich sowieso!',
      casePattern: 'Adverb „sowieso“ (= ohnehin / auf jeden Fall) · Objekt „Das“ auf Position 1',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das hatte ich ohnehin bereits vor.',
        textEn: 'I was already planning to do that anyway.',
        contextNote: 'Formell / Schriftlich („ohnehin“)',
      },
      informalVariant: {
        textDe: 'Meinen Urlaub genießen? Na, das mache ich sowieso!',
        textEn: 'Enjoy my vacation? Oh, I’ll do that anyway!',
        contextNote: 'Sehr wichtiges Alltagswort „sowieso“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Vergiss nicht, heute Abend mal früh ins Bett zu gehen!',
        promptEn: 'Don’t forget to go to bed early tonight!',
        speakerB: 'Felix',
        replyDe: 'Das mache ich sowieso, ich bin total müde.',
        replyEn: 'I’ll do that anyway, I’m super tired.',
      },
    },
    exampleDe:
      'Lena: Genieß aber vor allem erst mal deinen Urlaub!\nFelix: Na klar, das mache ich sowieso.',
    exampleEn:
      'Lena: Above all, just enjoy your vacation first!\nFelix: Of course, I’ll do that anyway.',
    anatomy: {
      caseGovernanceNote:
        '„Sowieso“ is one of the highest-frequency spoken German words (= „anyway / regardless“). Compare its even shorter colloquial twin „eh“.',
      synonyms: ['Das mache ich eh.', 'Das habe ich ohnehin vor.'],
      antonyms: ['Das hätte ich sonst gar nicht gemacht.'],
      collocations: [
        'Ich bin sowieso gleich in der Stadt.',
        'Das klappt sowieso!',
      ],
      wordFamily: ['sowieso (anyway)', 'ohnehin (anyway, formal)', 'eh (anyway, casual)'],
      b1ExamTip:
        'Drop „sowieso“ into sentences to explain effortless favors: „Ich fahre sowieso am Bahnhof vorbei, ich nehme dich mit!“.',
    },
  },
  {
    id: 'chat-chunk-077',
    lemma: 'Sag Bescheid, wenn du es probiert hast!',
    spokenText: 'Sag Bescheid, wenn du es probiert hast!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Absprache · Rückmeldung wünschen',
    translation: 'Let me know once you’ve tried it!',
    highlightTarget: 'Sag Bescheid, wenn du es probiert hast',
    phraseDetails: {
      framePattern: 'Sag Bescheid, wenn du + [Perfekt mit Verb am Ende]!',
      casePattern: 'Imperativ „Sag Bescheid“ + Nebensatz mit „wenn“ (Verb am Ende)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Geben Sie mir gerne eine Rückmeldung, sobald Sie es ausprobiert haben.',
        textEn: 'Please feel free to give me feedback once you have tried it out.',
        contextNote: 'Formell / Beruf & Empfehlungen',
      },
      informalVariant: {
        textDe: 'Das neue Café ist super – sag Bescheid, wenn du es probiert hast!',
        textEn: 'The new café is awesome—let me know once you’ve tried it!',
        contextNote: 'Schöne Art, nach einem Tipp im Gespräch zu bleiben',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich habe dir mein Lieblingsrezept geschickt. Sag Bescheid, wenn du es probiert hast!',
        promptEn: 'I sent you my favorite recipe. Let me know once you’ve tried it!',
        speakerB: 'Lena',
        replyDe: 'Mache ich! Am Sonntag koche ich es gleich mal nach.',
        replyEn: 'Will do! I’ll cook it this Sunday.',
      },
    },
    exampleDe:
      'Lena: Ich nehme mir vor, nächste Woche mal allein ins Café zu gehen.\nFelix: Das klingt super – sag Bescheid, wenn du es probiert hast!',
    exampleEn:
      'Lena: I’m going to make it a goal to go to a café alone next week.\nFelix: That sounds great—let me know once you’ve tried it!',
    anatomy: {
      caseGovernanceNote:
        '„Wenn“ introduces a conditional/temporal clause („when / if“), pushing the conjugated auxiliary „hast“ to the very end after the participle „probiert“.',
      synonyms: ['Melde dich, wenn du es getestet hast!', 'Erzähl mir dann, wie es war!'],
      antonyms: ['Du brauchst dich nicht zu melden.'],
      collocations: [
        'Sag Bescheid, wenn du Hilfe brauchst!',
        'Sag Bescheid, wenn du da bist!',
      ],
      wordFamily: ['Bescheid sagen (to let know)', 'probieren (to try)', 'ausprobieren (to try out)'],
      b1ExamTip:
        'A friendly conversation hook—great for keeping in touch after sharing a restaurant, book, or movie tip.',
    },
  },
  {
    id: 'chat-chunk-078',
    lemma: 'Immer eins nach dem anderen!',
    spokenText: 'Immer eins nach dem anderen!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Ruhe bewahren',
    translation: 'One thing at a time!',
    highlightTarget: 'eins nach dem anderen',
    phraseDetails: {
      framePattern: '(Immer) eins nach dem anderen!',
      casePattern: 'nach + Dativ Neutrum (dem anderen) · feste Redewendung',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Lassen Sie uns Schritt für Schritt vorgehen.',
        textEn: 'Let us proceed step by step.',
        contextNote: 'Formell / Beruf & Planung',
      },
      informalVariant: {
        textDe: 'Ich lese die Nachrichten halt eine nach der anderen – immer eins nach dem anderen!',
        textEn: 'I just read messages one after another—one thing at a time!',
        contextNote: 'Entspannte Alltagsweisheit',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich habe diese Woche zwei Prüfungen, einen Umzug und noch einen Arzttermin!',
        promptEn: 'This week I have two exams, a move, and a doctor’s appointment!',
        speakerB: 'Felix',
        replyDe: 'Tief durchatmen – immer eins nach dem anderen!',
        replyEn: 'Take a deep breath—one thing at a time!',
      },
    },
    exampleDe:
      'Lena: Du antwortest auf alles so schön der Reihe nach!\nFelix: Klar, immer eins nach dem anderen!',
    exampleEn:
      'Lena: You answer everything so neatly in order!\nFelix: Sure, one thing at a time!',
    anatomy: {
      caseGovernanceNote:
        'Neuter „eins“ (one thing) + „nach + Dativ“ („dem anderen“). For feminine nouns like „die Nachricht“, the gender adjusts: „eine nach der anderen“.',
      synonyms: ['Schritt für Schritt!', 'Ganz in Ruhe!'],
      antonyms: ['Alles auf einmal!'],
      collocations: [
        'Immer schön eins nach dem anderen.',
        'Eine Nachricht nach der anderen lesen.',
      ],
      wordFamily: ['eins (one)', 'ander- (other)', 'nacheinander (one after another)'],
      b1ExamTip:
        'Great calming phrase when a friend feels overwhelmed by exams, packing, or busy weeks.',
    },
  },
  {
    id: 'chat-chunk-079',
    lemma: 'Ist das in Ordnung für dich?',
    spokenText: 'Ist das in Ordnung für dich?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Absprache · Höflich rückversichern',
    translation: 'Is that okay with you? · Does that work for you?',
    highlightTarget: 'in Ordnung für dich',
    phraseDetails: {
      framePattern: 'Ist das (so) in Ordnung für dich / für euch?',
      casePattern: 'in Ordnung sein + für + Akkusativ (dich / euch)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wäre das so für Sie in Ordnung?',
        textEn: 'Would that be alright with you?',
        contextNote: 'Formell / Termine & Beruf',
      },
      informalVariant: {
        textDe: 'Ich antworte dir später aus dem Hotel – ist das in Ordnung für dich?',
        textEn: 'I’ll reply later from the hotel—is that okay with you?',
        contextNote: 'Rücksichtsvolle Rückfrage im Alltag',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Können wir uns morgen erst um sieben treffen? Ist das in Ordnung für dich?',
        promptEn: 'Can we meet at seven instead tomorrow? Is that okay with you?',
        speakerB: 'Lena',
        replyDe: 'Ja klar, das passt mir sogar noch besser!',
        replyEn: 'Yeah sure, that actually works even better for me!',
      },
    },
    exampleDe:
      'Felix: Ich mache kurz Pause und schreibe dir nachher – ist das in Ordnung für dich?\nLena: Natürlich, ruh dich gut aus!',
    exampleEn:
      'Felix: I’m going to take a quick break and text you later—is that okay with you?\nLena: Of course, rest up well!',
    anatomy: {
      caseGovernanceNote:
        '„Für“ ALWAYS governs the Accusative („für mich“, „für dich“, „für uns“). „In Ordnung“ is a clean, universal German alternative to „okay“.',
      synonyms: ['Passt das für dich?', 'Ist das okay für dich?'],
      antonyms: ['Das passt mir leider gar nicht.'],
      collocations: [
        'Alles in Ordnung!',
        'Völlig in Ordnung.',
      ],
      wordFamily: ['die Ordnung (order)', 'in Ordnung (alright / fine)'],
      b1ExamTip:
        'Use „Ist das in Ordnung für dich?“ when shifting meeting times or ending a chat early—always comes across polite.',
    },
  },
  {
    id: 'chat-chunk-080',
    lemma: 'Schlaf gut!',
    spokenText: 'Schlaf gut!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Abschied · Gute Nacht wünschen',
    translation: 'Sleep well!',
    highlightTarget: 'Schlaf gut',
    phraseDetails: {
      framePattern: 'Schlaf gut! / Schlaft gut!',
      casePattern: 'Imperativ von „schlafen“ (kein Umlaut im Imperativ: Schlaf!, nicht Schläf!)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich wünsche Ihnen eine erholsame Nacht!',
        textEn: 'I wish you a restful night!',
        contextNote: 'Formell / Hotel oder Gastgeber',
      },
      informalVariant: {
        textDe: 'Natürlich, mach die Augen zu – schlaf gut!',
        textEn: 'Of course, close your eyes—sleep well!',
        contextNote: 'Warm und alltäglich abends oder vor einem Nickerchen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich bin heute so müde, ich gehe jetzt ins Bett.',
        promptEn: 'I’m so tired today, I’m heading to bed now.',
        speakerB: 'Lena',
        replyDe: 'Schlaf gut und träum schön!',
        replyEn: 'Sleep well and sweet dreams!',
      },
    },
    exampleDe:
      'Felix: Mir fallen langsam die Augen zu, bis morgen!\nLena: Schlaf gut!',
    exampleEn:
      'Felix: I can barely keep my eyes open, talk tomorrow!\nLena: Sleep well!',
    anatomy: {
      caseGovernanceNote:
        'Crucial A1 imperative rule: Verbs with „a → ä“ stem changes („schlafen → du schläfst“, „fahren → du fährst“) NEVER take an umlaut in the du-imperative: „Schlaf gut!“, „Fahr vorsichtig!“.',
      synonyms: ['Gute Nacht!', 'Träum schön!'],
      antonyms: ['Guten Morgen!'],
      collocations: [
        'Schlaf gut und bis morgen!',
        'Hast du gut geschlafen?',
      ],
      wordFamily: ['schlafen (to sleep)', 'der Schlaf (sleep)', 'ausschlafen (to sleep in)'],
      b1ExamTip:
        'Unlike English, Germans also say „Schlaf gut!“ when someone is just taking an afternoon nap on a train.',
    },
  },
  {
    id: 'chat-chunk-081',
    lemma: 'Bis später!',
    spokenText: 'Bis später!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Abschied · Kurze Pause',
    translation: 'See you later! · Talk later!',
    highlightTarget: 'Bis später',
    phraseDetails: {
      framePattern: 'Bis später / gleich / morgen / bald!',
      casePattern: 'Präposition „bis“ + Zeitadverb ohne Artikel',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Bis später am Nachmittag, auf Wiederhören!',
        textEn: 'Until later this afternoon, goodbye!',
        contextNote: 'Höflich / Kollegen',
      },
      informalVariant: {
        textDe: 'Danke dir, bis später!',
        textEn: 'Thanks, talk to you later!',
        contextNote: 'Standard-Abschied für denselben Tag',
      },
      miniDialog: {
        speakerA: 'Mia',
        promptDe: 'Ich muss kurz in eine Vorlesung, ich melde mich danach!',
        promptEn: 'I have to duck into a lecture, I’ll text you afterwards!',
        speakerB: 'Jonas',
        replyDe: 'Alles klar, bis später!',
        replyEn: 'Alright, talk later!',
      },
    },
    exampleDe:
      'Felix: Ich mache kurz die Augen zu und melde mich nachher.\nLena: Alles klar, bis später!',
    exampleEn:
      'Felix: I’m going to close my eyes for a bit and message you afterwards.\nLena: Alright, talk later!',
    anatomy: {
      caseGovernanceNote:
        'Pick your time window right after „Bis“: „Bis gleich!“ (in a few minutes), „Bis später!“ (later today), „Bis morgen!“ (tomorrow), „Bis dann!“ (until then / catch you later).',
      synonyms: ['Bis nachher!', 'Bis dann!', 'Mach es gut!'],
      antonyms: ['Hallo!', 'Schön, dich zu sehen!'],
      collocations: [
        'Bis gleich!',
        'Bis morgen früh!',
        'Bis die Tage!',
      ],
      wordFamily: ['spät (late)', 'später (later)', 'bis (until)'],
      b1ExamTip:
        'Use „Bis gleich!“ if you’ll see them within ~30 minutes, and „Bis später!“ for a few hours later.',
    },
  },
  {
    id: 'chat-chunk-082',
    lemma: 'Ich telefoniere gerade.',
    spokenText: 'Ich telefoniere gerade.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Check-in · Kurz beschäftigt sein',
    translation: 'I’m on the phone right now.',
    highlightTarget: 'telefoniere gerade',
    phraseDetails: {
      framePattern: 'Ich telefoniere gerade (mit + Dativ) und melde mich später.',
      casePattern: 'telefonieren mit + Dativ · Zeitadverb „gerade“ (= im Moment)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin gerade in einem Gespräch und rufe Sie anschließend zurück.',
        textEn: 'I am currently on a call and will call you back afterwards.',
        contextNote: 'Formell / Beruf',
      },
      informalVariant: {
        textDe: 'Hey, ich antworte dir später – ich telefoniere gerade!',
        textEn: 'Hey, I’ll reply later—I’m on the phone right now!',
        contextNote: 'Typische kurze Zwischenmeldung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Hey, ich antworte dir später, ich telefoniere gerade mit meiner Cousine.',
        promptEn: 'Hey, I’ll reply later, I’m on the phone with my cousin right now.',
        speakerB: 'Felix',
        replyDe: 'Gar kein Stress, grüß sie schön!',
        replyEn: 'No stress at all, say hi to her!',
      },
    },
    exampleDe:
      'Lena: Hey, ich antworte dir gleich – ich telefoniere gerade.\nFelix: Gar kein Stress, lass dir Zeit!',
    exampleEn:
      'Lena: Hey, I’ll reply in a bit—I’m on the phone right now.\nFelix: No stress at all, take your time!',
    anatomy: {
      caseGovernanceNote:
        '„Telefonieren“ is a single verb in German (no need for „auf dem Telefon sein“!). To say who you’re talking to, always use „mit + Dativ“: „Ich telefoniere mit meiner Schwester“.',
      synonyms: ['Ich bin gerade am Telefon.', 'Ich spreche gerade mit Mia.'],
      antonyms: ['Ich bin endlich fertig mit dem Telefonieren.'],
      collocations: [
        'Wir haben zwei Stunden telefoniert!',
        'Wollen wir heute Abend kurz telefonieren?',
      ],
      wordFamily: ['telefonieren (to be on the phone)', 'das Telefonat (phone call)', 'anrufen (to call)'],
      b1ExamTip:
        'Remember: „anrufen + Akk.“ = to dial/call someone („Ich rufe dich an“), while „telefonieren mit + Dat.“ = to talk on the phone („Ich telefoniere mit dir“).',
    },
  },
  {
    id: 'chat-chunk-083',
    lemma: 'Ich habe lange nicht mehr mit ihr gesprochen.',
    spokenText: 'Ich habe lange nicht mehr mit ihr gesprochen.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Freunde · Kontakt pflegen',
    translation: 'I haven’t talked to her in a long time.',
    highlightTarget: 'lange nicht mehr mit ihr gesprochen',
    phraseDetails: {
      framePattern: 'Ich habe lange nicht mehr mit + [Dativ] gesprochen / telefoniert.',
      casePattern: 'Perfekt (haben + gesprochen) + „nicht mehr“ + mit + Dativ (ihr / ihm / ihnen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wir hatten schon längere Zeit keinen Kontakt mehr.',
        textEn: 'We have not been in touch for quite some time.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Das Gespräch ging so lang, weil ich lange nicht mehr mit ihr gesprochen habe!',
        textEn: 'The call went so long because I hadn’t talked to her in ages!',
        contextNote: 'Sehr geläufige Begründung im Alltag',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ui, euer Telefonat ging aber richtig lange!',
        promptEn: 'Whoa, your phone call went on for a really long time!',
        speakerB: 'Lena',
        replyDe: 'Ja, ich habe lange nicht mehr mit ihr gesprochen – wir hatten viel nachzuholen!',
        replyEn: 'Yeah, I haven’t talked to her in ages—we had a lot to catch up on!',
      },
    },
    exampleDe:
      'Felix: Ihr habt ja fast zwei Stunden telefoniert!\nLena: Ja, ich habe lange nicht mehr mit ihr gesprochen.',
    exampleEn:
      'Felix: You guys were on the phone for almost two hours!\nLena: Yeah, I haven’t talked to her in a long time.',
    anatomy: {
      caseGovernanceNote:
        'German uses „lange nicht mehr“ (literally „long not anymore“) for English „haven’t … in a long time“. Note Dative pronouns after „mit“: „mit ihr“ (her), „mit ihm“ (him), „mit ihnen“ (them).',
      synonyms: ['Wir haben ewig nicht mehr gequatscht.', 'Ich habe sie lange nicht gesehen.'],
      antonyms: ['Wir telefonieren fast jeden Tag.'],
      collocations: [
        'Ich habe ihn schon ewig nicht mehr gesehen.',
        'Mal wieder ein kleines Lebenszeichen geben.',
      ],
      wordFamily: ['sprechen (to speak)', 'das Gespräch (conversation)', 'lange nicht mehr (not in a long time)'],
      b1ExamTip:
        'Swap the participle to reuse this everywhere: „lange nicht mehr gesehen / gehört / gemacht / gegessen“.',
    },
  },
  {
    id: 'chat-chunk-084',
    lemma: 'Mache ich die Tage!',
    spokenText: 'Mache ich die Tage!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Absprache · In den nächsten Tagen',
    translation: 'I’ll do that in the next few days!',
    highlightTarget: 'Mache ich die Tage',
    phraseDetails: {
      framePattern: '(Das) mache ich / schicke ich dir die Tage!',
      casePattern: 'Umgangssprachliche Zeitangabe „die Tage“ (= in den nächsten Tagen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich werde mich in den nächsten Tagen darum kümmern.',
        textEn: 'I will take care of it in the coming days.',
        contextNote: 'Formell / Beruf',
      },
      informalVariant: {
        textDe: 'Die Urlaubsfotos? Mache ich die Tage, sobald ich sie sortiert habe!',
        textEn: 'The vacation photos? I’ll send them over the next few days once I sort them!',
        contextNote: 'Ultra-authentisches Alltagsdeutsch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Schick mir unbedingt ein paar schöne Bilder, die du gemacht hast!',
        promptEn: 'Definitely send me a few nice pictures that you took!',
        speakerB: 'Felix',
        replyDe: 'Mache ich die Tage! Gute Nacht dir erst mal.',
        replyEn: 'I’ll do that in the next few days! Good night to you for now.',
      },
    },
    exampleDe:
      'Lena: Schickst du mir noch die Fotos aus Rotterdam?\nFelix: Klar, mache ich die Tage!',
    exampleEn:
      'Lena: Will you still send me the photos from Rotterdam?\nFelix: Sure, I’ll do that in the next few days!',
    anatomy: {
      caseGovernanceNote:
        '„Die Tage“ is a very natural spoken time expression meaning „sometime over the next couple of days“ (just like „Bis die Tage!“ = „See you in a few days!“).',
      synonyms: ['Mache ich in den nächsten Tagen.', 'Schicke ich dir bald.'],
      antonyms: ['Mache ich sofort.'],
      collocations: [
        'Wir sehen uns die Tage!',
        'Ich melde mich die Tage bei dir.',
      ],
      wordFamily: ['der Tag, -e (day)', 'die Tage (in the next few days)'],
      b1ExamTip:
        'Saying „Ich melde mich die Tage!“ is one of the most natural, low-pressure sign-offs in German.',
    },
  },
  {
    id: 'chat-chunk-085',
    lemma: 'Hast du nicht zufällig ein Foto davon?',
    spokenText: 'Hast du nicht zufällig ein Foto davon?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Bitte · Beiläufig fragen',
    translation: 'You don’t happen to have a photo of it, do you?',
    highlightTarget: 'nicht zufällig ein Foto davon',
    phraseDetails: {
      framePattern: 'Hast du nicht zufällig + [Akkusativ] (oder)?',
      casePattern: 'höfliche Negativfrage mit „nicht zufällig“ + Pronominaladverb „davon“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Haben Sie zufällig noch ein Foto davon?',
        textEn: 'Do you happen to still have a photo of it?',
        contextNote: 'Höflich / Formell',
      },
      informalVariant: {
        textDe: 'Das klingt so lecker – hast du nicht zufällig ein Foto davon?',
        textEn: 'That sounds so delicious—you don’t happen to have a photo of it, do you?',
        contextNote: 'Charmante, indirekte Bitte unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Das georgische Brot klingt himmlisch! Hast du nicht zufällig ein Foto davon?',
        promptEn: 'The Georgian bread sounds heavenly! You don’t happen to have a photo of it, do you?',
        speakerB: 'Felix',
        replyDe: 'Doch, warte – ich habe tatsächlich eins gemacht!',
        replyEn: 'Actually yes, wait—I did take one!',
      },
    },
    exampleDe:
      'Lena: Das Essen hört sich richtig lecker an! Hast du nicht zufällig ein Foto davon?\nFelix: Doch, warte kurz, ich schicke es dir gleich!',
    exampleEn:
      'Lena: The food sounds really delicious! You don’t happen to have a photo of it, do you?\nFelix: Actually I do, hold on, I’ll send it right over!',
    anatomy: {
      caseGovernanceNote:
        'To answer YES to a negative question („Hast du nicht…?“), German ALWAYS uses „Doch!“ instead of „Ja!“! Look at Felix’s reply: „Doch, ich habe eins!“.',
      synonyms: ['Hast du vielleicht ein Foto gemacht?', 'Zeig mal, falls du ein Foto hast!'],
      antonyms: ['Ich habe leider kein Foto gemacht.'],
      collocations: [
        'Hast du nicht zufällig Zeit heute?',
        'Weißt du zufällig, wann der Bus kommt?',
      ],
      wordFamily: ['zufällig (by chance / happen to)', 'der Zufall (coincidence)', 'davon (of it)'],
      b1ExamTip:
        'Master the „Doch!“ reflex: whenever someone asks a question containing „nicht“ or „kein“, answer „Doch!“ to say „Actually, yes!“.',
    },
  },
  {
    id: 'chat-chunk-086',
    lemma: 'Tut mir leid, das wollte ich nicht!',
    spokenText: 'Tut mir leid, das wollte ich nicht!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Entschuldigung · Schnell einlenken',
    translation: 'I’m sorry, I didn’t mean to!',
    highlightTarget: 'Tut mir leid, das wollte ich nicht',
    phraseDetails: {
      framePattern: '(Oh,) tut mir leid, das wollte ich nicht / ich versuche es zu vermeiden.',
      casePattern: 'leidtun + Dativ (mir) · Präteritum Modalverb „wollte“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Entschuldigen Sie bitte, das war keineswegs meine Absicht.',
        textEn: 'Please excuse me, that was not my intention at all.',
        contextNote: 'Formell / Höfliche Entschuldigung',
      },
      informalVariant: {
        textDe: 'Oh, tut mir leid, das wollte ich nicht – dann lasse ich es lieber!',
        textEn: 'Oh, sorry, I didn’t mean to—I’ll skip it then!',
        contextNote: 'Schnelles, ehrliches Einlenken',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Huch, jetzt hast du mich richtig erschreckt!',
        promptEn: 'Whoa, you really startled me just now!',
        speakerB: 'Felix',
        replyDe: 'Oh, tut mir leid, das wollte ich nicht!',
        replyEn: 'Oh, I’m sorry, I didn’t mean to!',
      },
    },
    exampleDe:
      'Lena: Hey, du hast mir gerade das letzte Stück Kuchen weggeschnappt!\nFelix: Oh, tut mir leid, das wollte ich nicht – wir teilen es!',
    exampleEn:
      'Lena: Hey, you just grabbed the last piece of cake on me!\nFelix: Oh, sorry, I didn’t mean to—let’s split it!',
    anatomy: {
      caseGovernanceNote:
        '„Es tut mir leid“ drops „Es“ in casual speech („Tut mir leid!“). Remember „wollte“ without an infinitive means „didn’t mean to / didn’t want that“.',
      synonyms: ['Entschuldigung, war keine Absicht!', 'Sorry, das war nicht so gemeint!'],
      antonyms: ['Das war volle Absicht!'],
      collocations: [
        'Tut mir echt leid!',
        'Das war nicht böse gemeint.',
      ],
      wordFamily: ['leidtun (to be sorry)', 'wollen (to want / mean to)'],
      b1ExamTip:
        'Add „echt“ or „wirklich“ („Tut mir echt leid!“) when you want your apology to sound extra sincere.',
    },
  },
  {
    id: 'chat-chunk-087',
    lemma: 'Viel Spaß dabei!',
    spokenText: 'Viel Spaß dabei!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Wunsch · Freude wünschen',
    translation: 'Have fun with that! · Enjoy!',
    highlightTarget: 'Viel Spaß dabei',
    phraseDetails: {
      framePattern: 'Viel Spaß dabei / heute Abend / im Urlaub!',
      casePattern: 'Pronominaladverb „dabei“ (= bei der genannten Aktivität)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich wünsche Ihnen viel Freude dabei!',
        textEn: 'I wish you much enjoyment with that!',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Ihr schaut zusammen einen Film? Oh, viel Spaß dabei!',
        textEn: 'You’re watching a movie together? Oh, have fun with that!',
        contextNote: 'Sofort-Reflex auf jede Freizeitankündigung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich bin gerade bei Freunden und wir schauen zusammen eine Komödie.',
        promptEn: 'I’m at my friends’ place right now and we’re watching a comedy together.',
        speakerB: 'Felix',
        replyDe: 'Oh schön, viel Spaß dabei!',
        replyEn: 'Oh nice, have fun with that!',
      },
    },
    exampleDe:
      'Lena: Ich gehe heute Abend mit Mia ins Kino.\nFelix: Oh toll, viel Spaß dabei!',
    exampleEn:
      'Lena: I’m going to the movies with Mia tonight.\nFelix: Oh awesome, have fun with that!',
    anatomy: {
      caseGovernanceNote:
        '„Dabei“ refers back to whatever activity your friend just mentioned (a movie, cooking, concert, trip). Works with no extra noun needed!',
      synonyms: ['Habt viel Spaß!', 'Genießt den Abend!'],
      antonyms: ['Hoffentlich wird es nicht langweilig!'],
      collocations: [
        'Viel Spaß euch!',
        'Viel Spaß beim Kochen!',
      ],
      wordFamily: ['der Spaß (fun)', 'dabei (at it / with that)'],
      b1ExamTip:
        'Use „Viel Spaß dabei!“ for fun activities and „Viel Erfolg dabei!“ for exams or work projects.',
    },
  },
  {
    id: 'chat-chunk-088',
    lemma: 'Lief es gut heute?',
    spokenText: 'Lief es gut heute?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Check-in · Nach Verlauf fragen',
    translation: 'Did things go well today? · Did it go smoothly today?',
    highlightTarget: 'Lief es gut heute',
    phraseDetails: {
      framePattern: 'Lief es / Lief das Lernen / die Prüfung gut heute?',
      casePattern: 'Präteritum von „laufen“ (lief) = funktionieren / verlaufen',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ist heute alles gut verlaufen?',
        textEn: 'Did everything go well today?',
        contextNote: 'Formell / Kollegen',
      },
      informalVariant: {
        textDe: 'Und, lief das Lernen gut heute?',
        textEn: 'So, did studying go well today?',
        contextNote: 'Sehr natürliche, interessierte Abendfrage',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Und, lief es gut heute beim Lernen?',
        promptEn: 'So, did studying go well today?',
        speakerB: 'Lena',
        replyDe: 'Ja, deutlich besser als gestern! Ich bin gut vorangekommen.',
        replyEn: 'Yeah, way better than yesterday! I made good progress.',
      },
    },
    exampleDe:
      'Felix: Lief es gut heute bei deiner Präsentation?\nLena: Ja, zum Glück lief alles richtig entspannt!',
    exampleEn:
      'Felix: Did things go well today with your presentation?\nLena: Yes, luckily everything went super smoothly!',
    anatomy: {
      caseGovernanceNote:
        'In German, „laufen“ doesn’t just mean „to run“—it means „to go / run smoothly“ („Wie läuft es?“, „Es lief super!“). In past tense, short „lief“ is used way more than „ist gelaufen“.',
      synonyms: ['Wie lief es heute?', 'Hat heute alles geklappt?'],
      antonyms: ['Es lief heute gar nicht gut.'],
      collocations: [
        'Wie läuft es bei dir?',
        'Läuft bei dir! (Things are going great for you!)',
      ],
      wordFamily: ['laufen (to run / go)', 'lief (went)', 'verlaufen (to proceed)'],
      b1ExamTip:
        'Memorize „Wie läuft’s?“ (How’s it going?) and „Lief es gut?“ (Did it go well?)—two daily German staples.',
    },
  },

  // =========================================================================
  // MINI-DECK 2 EXPANSION START: REAKTIONEN, ZUSTIMMUNG & NECKEREI (089–096)
  // =========================================================================
  {
    id: 'chat-chunk-089',
    lemma: 'Das muss ja heißen, dass es gut war!',
    spokenText: 'Das muss ja heißen, dass es gut war!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Schlussfolgerung · Modalpartikel „ja“',
    translation: 'That must mean it was good!',
    highlightTarget: 'muss ja heißen, dass es gut war',
    phraseDetails: {
      framePattern: 'Das muss ja heißen, dass + [Nebensatz mit Verb am Ende]!',
      casePattern: 'Modalverb „muss“ (Vermutung) + Partikel „ja“ + „dass“-Satz',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das spricht eindeutig dafür, dass der Abend sehr gelungen war.',
        textEn: 'That clearly suggests that the evening was a great success.',
        contextNote: 'Formell / Gehoben',
      },
      informalVariant: {
        textDe: 'Bis kurz vor eins geblieben? Das muss ja heißen, dass es gut war!',
        textEn: 'Stayed until almost one? That must mean it was good!',
        contextNote: 'Lebendige Reaktion beim Zuhören',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Wir sind gestern erst um ein Uhr nachts von der Feier nach Hause gefahren.',
        promptEn: 'We didn’t head home from the party until one in the morning last night.',
        speakerB: 'Lena',
        replyDe: 'Haha, das muss ja heißen, dass es gut war!',
        replyEn: 'Haha, that must mean it was good!',
      },
    },
    exampleDe:
      'Felix: Wir haben bis kurz vor eins gefeiert.\nLena: Das muss ja heißen, dass es gut war!',
    exampleEn:
      'Felix: We celebrated until almost one.\nLena: That must mean it was good!',
    anatomy: {
      caseGovernanceNote:
        '„Heißen“ here means „to mean / signify“ (not „to be named“). Adding „ja“ turns the deduction into a warm, obvious conclusion shared with your friend.',
      synonyms: ['Dann war es ja bestimmt super!', 'Das spricht ja für sich!'],
      antonyms: ['Dann war es wohl nicht so toll.'],
      collocations: [
        'Das heißt, wir sehen uns morgen!',
        'Was soll das heißen?',
      ],
      wordFamily: ['heißen (to mean / be called)', 'müssen (must)', 'ja (shared-fact particle)'],
      b1ExamTip:
        '„Das heißt, …“ (That means…) is an essential connector for checking you understood someone correctly.',
    },
  },
  {
    id: 'chat-chunk-090',
    lemma: 'Heißt also, …?',
    spokenText: 'Heißt also?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Spielerisch nachhaken',
    translation: 'So does that mean …?',
    highlightTarget: 'Heißt also',
    phraseDetails: {
      framePattern: 'Heißt also, + [Hauptsatz als Frage]?',
      casePattern: 'Verkürzt aus „Das heißt also, …?“ · lockere Nachfrage',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Bedeutet das also, dass wir den Plan ändern?',
        textEn: 'Does that mean we are changing the plan?',
        contextNote: 'Formell / Klärung',
      },
      informalVariant: {
        textDe: 'Heißt also, jetzt findest du meine Vase nicht mehr niedlich?',
        textEn: 'So does that mean you don’t think my vase is cute anymore?',
        contextNote: 'Schlagfertiges Nachhaken unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ohne das kleine Missgeschick im Ofen wäre die Figur total süß gewesen!',
        promptEn: 'Without the little oven mishap, the figurine would’ve been super cute!',
        speakerB: 'Felix',
        replyDe: 'Heißt also, jetzt ist sie nicht mehr süß?',
        replyEn: 'So does that mean it’s not cute anymore now?',
      },
    },
    exampleDe:
      'Lena: Ich bin heute Abend leider schon verabredet.\nFelix: Heißt also, wir verschieben unseren Filmabend auf Sonntag?',
    exampleEn:
      'Lena: Sadly I already have plans tonight.\nFelix: So does that mean we’re moving our movie night to Sunday?',
    anatomy: {
      caseGovernanceNote:
        'Spoken ellipsis dropping „Das“: „(Das) heißt also, …?“. Because it’s treated as an introductory tag, normal main-clause word order follows after the comma!',
      synonyms: ['Das heißt also, …?', 'Also bedeutet das, …?'],
      antonyms: ['Genau das Gegenteil!'],
      collocations: [
        'Heißt also, du kommst mit?',
        'Heißt also, wir treffen uns später?',
      ],
      wordFamily: ['heißen (to mean)', 'also (so / therefore)'],
      b1ExamTip:
        'A brilliant spoken shortcut for confirming plans OR teasing someone about what they just implied.',
    },
  },
  {
    id: 'chat-chunk-091',
    lemma: 'Das klingt jetzt aber auch nicht so gut.',
    spokenText: 'Das klingt jetzt aber auch nicht so gut.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Spielerisch widersprechen',
    translation: 'That doesn’t sound all that great either, though.',
    highlightTarget: 'klingt jetzt aber auch nicht so gut',
    phraseDetails: {
      framePattern: 'Das klingt jetzt aber auch nicht so + [Adjektiv].',
      casePattern: 'Partikelkette „jetzt aber auch“ (= spielerischer Widerspruch / Einwand)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das klingt allerdings ebenfalls nicht besonders überzeugend.',
        textEn: 'That does not sound particularly convincing either, however.',
        contextNote: 'Formell / Sachlich',
      },
      informalVariant: {
        textDe: '„Gar nicht so schlecht“? Das klingt jetzt aber auch nicht so gut!',
        textEn: '“Not that bad”? Well, that doesn’t sound all that great either!',
        contextNote: 'Typisch deutsche Partikel-Kombination im Wortgefecht',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Dein Kuchen ist gar nicht mal so schlecht geworden!',
        promptEn: 'Your cake turned out not bad at all!',
        speakerB: 'Felix',
        replyDe: 'Hey, „nicht schlecht“ – das klingt jetzt aber auch nicht so gut!',
        replyEn: 'Hey, “not bad”—that doesn’t sound all that great either!',
      },
    },
    exampleDe:
      'Lena: Deine Zeichnung ist gar nicht so schlecht!\nFelix: Das klingt jetzt aber auch nicht so gut!',
    exampleEn:
      'Lena: Your drawing isn’t that bad!\nFelix: Well, that doesn’t sound all that great either!',
    anatomy: {
      caseGovernanceNote:
        'Notice how Germans stack modal particles effortlessly: „jetzt“ (well now) + „aber“ (contrasting) + „auch“ (either/also). Together they create lighthearted, friendly pushback.',
      synonyms: ['Das ist aber kein großes Lob!', 'Das klingt auch nicht gerade begeistert.'],
      antonyms: ['Das klingt fantastisch!'],
      collocations: [
        'Das klingt jetzt aber komisch.',
        'Das ist jetzt aber auch nicht fair!',
      ],
      wordFamily: ['klingen (to sound)', 'aber (but / though)', 'auch (also / either)'],
      b1ExamTip:
        'Don’t translate every modal particle word-for-word—feel the melody of „jetzt aber auch“ as a playful „hey now, come on!“.',
    },
  },
  {
    id: 'chat-chunk-092',
    lemma: 'Da kann wohl wer singen!',
    spokenText: 'Da kann wohl wer singen!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Neckerei · Vermutung mit „wohl“',
    translation: 'Looks like someone can sing! · Someone’s got pipes!',
    highlightTarget: 'Da kann wohl wer singen',
    phraseDetails: {
      framePattern: 'Da kann wohl wer / jemand gut + [Infinitiv]!',
      casePattern: 'Modalpartikel „wohl“ (= vermutlich) + umgangssprachliches „wer“ (= jemand)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sie scheinen ja ein echtes Gesangstalent zu haben!',
        textEn: 'You seem to have a real talent for singing!',
        contextNote: 'Höflich / Kompliment',
      },
      informalVariant: {
        textDe: 'Du liebst Karaoke? Oho, da kann wohl wer singen!',
        textEn: 'You love karaoke? Oho, looks like someone can sing!',
        contextNote: 'Charmant-neckendes Kompliment unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Oh wie toll, ich liebe Karaoke!',
        promptEn: 'Oh how awesome, I love karaoke!',
        speakerB: 'Felix',
        replyDe: 'Oho, da kann wohl wer singen!',
        replyEn: 'Oho, looks like someone can sing!',
      },
    },
    exampleDe:
      'Lena: Ich liebe es, abends mit Freunden Karaoke zu singen!\nFelix: Aha, da kann wohl wer singen!',
    exampleEn:
      'Lena: I love singing karaoke with friends in the evening!\nFelix: Aha, looks like someone can sing!',
    anatomy: {
      caseGovernanceNote:
        'In casual German, „wer“ in the middle of a statement means „jemand“ (someone)! Paired with „wohl“ (presumably), „Da + Verb + wohl wer…“ is a beloved teasing structure.',
      synonyms: ['Da hat wohl jemand Talent!', 'Du kannst bestimmt gut singen!'],
      antonyms: ['Ich kann leider gar nicht singen.'],
      collocations: [
        'Da hat wohl wer Hunger!',
        'Da ist wohl wer richtig müde!',
      ],
      wordFamily: ['wohl (presumably)', 'wer (someone, casual)', 'können (to be able to)'],
      b1ExamTip:
        'Reuse this golden teasing template anywhere: „Da hat wohl wer Hunger!“, „Da freut sich wohl jemand!“.',
    },
  },
  {
    id: 'chat-chunk-093',
    lemma: 'Das will ich mal hören!',
    spokenText: 'Das will ich mal hören!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Neckerei · Neugierig herausfordern',
    translation: 'I want to hear that! · Let’s hear it sometime!',
    highlightTarget: 'Das will ich mal hören',
    phraseDetails: {
      framePattern: 'Das will ich mal hören / sehen / probieren!',
      casePattern: 'Objekt „Das“ auf Position 1 + Modalverb „will“ + Partikel „mal“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das würde ich mir sehr gerne einmal anhören.',
        textEn: 'I would very much like to hear that sometime.',
        contextNote: 'Höflich / Formell',
      },
      informalVariant: {
        textDe: 'Du sagst, du kannst nicht singen? Haha, das will ich mal hören!',
        textEn: 'You say you can’t sing? Haha, I’ve got to hear that sometime!',
        contextNote: 'Locker-herausfordernd mit freundlichem „mal“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Meine Stimme ist wirklich nicht hörenswert beim Karaoke.',
        promptEn: 'My voice is really not worth listening to at karaoke.',
        speakerB: 'Lena',
        replyDe: 'Haha, das will ich mal hören! Meine klingt auch nicht besser.',
        replyEn: 'Haha, I want to hear that sometime! Mine doesn’t sound any better.',
      },
    },
    exampleDe:
      'Felix: Beim Singen bin ich leider total talentfrei.\nLena: Das will ich mal hören!',
    exampleEn:
      'Felix: When it comes to singing I’m completely talent-free.\nLena: I’d love to hear that sometime!',
    anatomy: {
      caseGovernanceNote:
        'Without „mal“, „Das will ich hören!“ can sound demanding. Adding „mal“ (just once / sometime) instantly makes it light, curious, and playful!',
      synonyms: ['Da bin ich ja mal gespannt!', 'Zeig mal!'],
      antonyms: ['Das will ich lieber gar nicht hören!'],
      collocations: [
        'Das will ich mal sehen!',
        'Das will ich mal probieren!',
      ],
      wordFamily: ['wollen (to want)', 'hören (to hear)', 'mal (softening particle)'],
      b1ExamTip:
        'Whenever you use „ich will“ with friends, adding „mal“ turns a blunt demand into friendly enthusiasm.',
    },
  },
  {
    id: 'chat-chunk-094',
    lemma: 'Ich wünschte!',
    spokenText: 'Ich wünschte!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Sehnsüchtig seufzen',
    translation: 'I wish!',
    highlightTarget: 'Ich wünschte',
    phraseDetails: {
      framePattern: 'Ich wünschte! / Ich wünschte, ich hätte frei.',
      casePattern: 'Feste Kurzform im Konjunktiv II von „wünschen“ (als Einzelreaktion A2-tauglich)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das wäre wirklich schön, leider habe ich noch zu tun.',
        textEn: 'That would be really nice, unfortunately I still have work to do.',
        contextNote: 'Formell / Ausgeschrieben',
      },
      informalVariant: {
        textDe: 'Bist du etwa unterwegs? – Ich wünschte! Ich sitze am Schreibtisch und lerne.',
        textEn: 'Are you out and about?—I wish! I’m at my desk studying.',
        contextNote: 'Super knappe, sofort verständliche Reaktion',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Machst du heute Nachmittag frei und gehst in die Sonne?',
        promptEn: 'Are you taking the afternoon off and heading into the sun?',
        speakerB: 'Lena',
        replyDe: 'Ich wünschte! Ich muss noch für meine Prüfung lernen.',
        replyEn: 'I wish! I still have to study for my exam.',
      },
    },
    exampleDe:
      'Felix: Bist du heute schon am See unterwegs?\nLena: Ich wünschte! Ich sitze leider noch in der Bibliothek.',
    exampleEn:
      'Felix: Are you already out at the lake today?\nLena: I wish! Sadly I’m still sitting in the library.',
    anatomy: {
      caseGovernanceNote:
        'A two-word fixed chunk you can memorize right away without worrying about complex subjunctive clauses—just drop „Ich wünschte!“ and then state your actual reality.',
      synonyms: ['Schön wär’s!', 'Leider nicht!'],
      antonyms: ['Ja, zum Glück!'],
      collocations: [
        'Ich wünschte! Aber leider nein.',
        'Schön wäre es!',
      ],
      wordFamily: ['wünschen (to wish)', 'der Wunsch (wish)'],
      b1ExamTip:
        'Instant reflex whenever someone guesses you’re relaxing, on vacation, or sleeping in—while you’re actually working!',
    },
  },
  {
    id: 'chat-chunk-095',
    lemma: 'Das ist eben das Problem.',
    spokenText: 'Das ist eben das Problem.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Erklären · Modalpartikel „eben“',
    translation: 'That’s just the problem. · That’s the catch.',
    highlightTarget: 'ist eben das Problem',
    phraseDetails: {
      framePattern: 'Aber das ist eben / halt (auch) das Problem.',
      casePattern: 'Modalpartikel „eben / halt“ (= lässt sich leider nicht ändern)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Genau darin liegt leider die Schwierigkeit.',
        textEn: 'That is unfortunately precisely where the difficulty lies.',
        contextNote: 'Formell / Sachlich',
      },
      informalVariant: {
        textDe: 'Eigentlich gehen wir jedes Wochenende joggen, aber Zeit zu finden ist eben das Problem!',
        textEn: 'We’re supposed to jog every weekend, but finding the time is just the problem!',
        contextNote: 'Sehr natürlicher Einsatz der Partikel „eben“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wie oft geht ihr denn wirklich zusammen laufen?',
        promptEn: 'How often do you actually go running together?',
        speakerB: 'Felix',
        replyDe: 'Wenn wir alle Zeit haben – aber das ist eben das Problem!',
        replyEn: 'Whenever we all have time—but that’s just the problem!',
      },
    },
    exampleDe:
      'Lena: Ihr wolltet doch jedes Wochenende joggen gehen!\nFelix: Ja, wenn mein Knie mitmacht – aber das ist eben das Problem.',
    exampleEn:
      'Lena: Didn’t you want to go jogging every weekend?\nFelix: Yeah, if my knee cooperates—but that’s just the problem.',
    anatomy: {
      caseGovernanceNote:
        'As a modal particle, „eben“ (or southern/colloquial „halt“) signals a matter-of-fact shrug: „that’s just how it is“. Compare „Das ist halt so“ = „That’s just the way it is“.',
      synonyms: ['Das ist halt das Problem.', 'Genau da liegt der Haken.'],
      antonyms: ['Das ist gar kein Problem!'],
      collocations: [
        'Das ist halt so.',
        'So ist das eben!',
      ],
      wordFamily: ['eben (just / simply)', 'halt (just, casual)', 'das Problem (problem)'],
      b1ExamTip:
        'Learning „eben“ and „halt“ unlocks huge listening comprehension—Germans use them constantly to express a casual shrug.',
    },
  },
  {
    id: 'chat-chunk-096',
    lemma: 'Besser, als du denkst!',
    spokenText: 'Besser, als du denkst!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Aufmunterung · Vergleich mit „als“',
    translation: 'Better than you think!',
    highlightTarget: 'Besser, als du denkst',
    phraseDetails: {
      framePattern: 'Das ist / Du kannst das besser, als du denkst!',
      casePattern: 'Komparativ „besser“ + Vergleichspartikel „als“ (niemals „wie“!)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Es wird sicher besser gelingen, als Sie im Moment vermuten.',
        textEn: 'It will surely turn out better than you currently expect.',
        contextNote: 'Formell / Ermutigend',
      },
      informalVariant: {
        textDe: 'Vielleicht kannst du ja doch besser singen, als du denkst!',
        textEn: 'Maybe you can actually sing better than you think!',
        contextNote: 'Freundliche Ermutigung im Gespräch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich glaube, mein Deutsch klingt im Gespräch noch ziemlich holprig.',
        promptEn: 'I think my German still sounds pretty bumpy in conversation.',
        speakerB: 'Felix',
        replyDe: 'Quatsch, du sprichst viel besser, als du denkst!',
        replyEn: 'Nonsense, you speak way better than you think!',
      },
    },
    exampleDe:
      'Lena: Ich glaube, meine Prüfung lief heute nicht so toll.\nFelix: Warte ab – bestimmt lief es besser, als du denkst!',
    exampleEn:
      'Lena: I don’t think my exam went too great today.\nFelix: Just wait—it probably went better than you think!',
    anatomy: {
      caseGovernanceNote:
        'After any comparative adjective („besser“, „schneller“, „einfacher“), Standard German always uses „als“ („besser als“). Put a comma before „als“ when a full verb clause follows („als du denkst“).',
      synonyms: ['Du unterschätzt dich!', 'Gar nicht so schlimm, wie du denkst!'],
      antonyms: ['Schlimmer, als ich dachte!'],
      collocations: [
        'Einfacher, als man denkt.',
        'Schneller, als du denkst!',
      ],
      wordFamily: ['gut / besser (good / better)', 'denken (to think)', 'als (than)'],
      b1ExamTip:
        'Easy rule: „so gut WIE“ (equal) vs. „besser ALS“ (comparative).',
    },
  },
];
