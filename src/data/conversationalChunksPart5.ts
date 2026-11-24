import type { VocabCard } from './vocabData';

/**
 * Curated A1–A2 Conversational Chunks & Social Reactions (Part 5: 129–160)
 * - Mini-Deck 3 expansion finish (chat-chunk-129 .. chat-chunk-136): Unterwegs, Pläne & Reisen
 * - Mini-Deck 4 expansion (chat-chunk-137 .. chat-chunk-160): Alltag, Essen & Freundeskreis
 */
export const CONVERSATIONAL_CHUNKS_PART_5: VocabCard[] = [
  // =========================================================================
  // MINI-DECK 3 EXPANSION FINISH: UNTERWEGS, PLÄNE & REISEN (129–136)
  // =========================================================================
  {
    id: 'chat-chunk-129',
    lemma: 'Das hat nicht mehr reingepasst.',
    spokenText: 'Das hat nicht mehr reingepasst.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reisen · Packen & Platzmangel',
    translation: 'That didn’t fit in anymore.',
    highlightTarget: 'nicht mehr reingepasst',
    phraseDetails: {
      framePattern: '[Etwas] hat leider nicht mehr in den Rucksack / Koffer reingepasst.',
      casePattern: 'trennbares Verb „reinpassen“ (Perfekt mit „haben“: reingepasst)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Der Pullover hat leider nicht mehr in mein Gepäck gepasst.',
        textEn: 'The sweater unfortunately no longer fit into my luggage.',
        contextNote: 'Formell / Reisebericht',
      },
      informalVariant: {
        textDe: 'Einen Pullover musste ich schon anziehen, weil er nicht mehr reingepasst hat!',
        textEn: 'I already had to wear one sweater because it didn’t fit in anymore!',
        contextNote: 'Super alltägliches gesprochenes Verb „reinpassen“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Warum trägst du bei dem warmen Wetter einen dicken Pullover?',
        promptEn: 'Why are you wearing a thick sweater in this warm weather?',
        speakerB: 'Felix',
        replyDe: 'Haha, der hat einfach nicht mehr in meinen Rucksack reingepasst!',
        replyEn: 'Haha, it just didn’t fit into my backpack anymore!',
      },
    },
    exampleDe:
      'Lena: Ist dein Rucksack wirklich schon komplett voll?\nFelix: Ja, mein dicker Pullover hat gar nicht mehr reingepasst!',
    exampleEn:
      'Lena: Is your backpack really completely full already?\nFelix: Yeah, my thick sweater didn’t even fit in anymore!',
    anatomy: {
      caseGovernanceNote:
        '„Reinpassen“ (spoken form of „hineinpassen“) means „to fit inside“. Notice „nicht mehr“ = „no longer / not anymore“.',
      synonyms: ['Dafür war kein Platz mehr.', 'Es passt nicht mehr rein.'],
      antonyms: ['Es ist noch genug Platz im Koffer.'],
      collocations: [
        'Passt das noch rein?',
        'Mein Koffer geht kaum noch zu!',
      ],
      wordFamily: ['reinpassen (to fit in)', 'passen (to fit)', 'der Platz (space)'],
      b1ExamTip:
        'Useful both for suitcases and for a full stomach after dinner: „Es passt nichts mehr rein!“ (I’m completely stuffed!).',
    },
  },
  {
    id: 'chat-chunk-130',
    lemma: 'Das war eigentlich nicht geplant.',
    spokenText: 'Das war eigentlich nicht geplant.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Pläne · Spontane Wendung',
    translation: 'That wasn’t actually planned.',
    highlightTarget: 'war eigentlich nicht geplant',
    phraseDetails: {
      framePattern: 'Das war eigentlich gar nicht geplant, aber …',
      casePattern: 'Präteritum „war“ + „eigentlich“ + Partizip „geplant“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Dies war ursprünglich nicht so vorgesehen.',
        textEn: 'This was originally not planned that way.',
        contextNote: 'Formell / Beruf',
      },
      informalVariant: {
        textDe: 'Einkaufen war eigentlich nicht geplant, aber ich habe zum Glück noch einen Beutel dabei!',
        textEn: 'Shopping wasn’t actually planned, but luckily I still have a tote bag with me!',
        contextNote: 'Alltagssprache bei spontanen Änderungen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Oh, ihr seid spontan noch ans Meer gefahren?',
        promptEn: 'Oh, you drove to the sea spontaneously too?',
        speakerB: 'Felix',
        replyDe: 'Ja, das war eigentlich nicht geplant, aber das Wetter war zu gut!',
        replyEn: 'Yeah, that wasn’t actually planned, but the weather was too good!',
      },
    },
    exampleDe:
      'Lena: Wolltest du heute Abend nicht eigentlich zu Hause bleiben?\nFelix: Ja, das war eigentlich nicht geplant, aber Jonas hat spontan angerufen.',
    exampleEn:
      'Lena: Didn’t you actually want to stay home tonight?\nFelix: Yeah, that wasn’t actually planned, but Jonas called out of the blue.',
    anatomy: {
      caseGovernanceNote:
        '„Eigentlich“ + „nicht“ („actually not“) gently explains a change of plans or surprise without sounding defensive.',
      synonyms: ['Das hat sich spontan ergeben.', 'Das hatte ich gar nicht vor.'],
      antonyms: ['Das war von Anfang an so geplant.'],
      collocations: [
        'Eigentlich wollte ich früh schlafen.',
        'Das war so nicht geplant!',
      ],
      wordFamily: ['planen (to plan)', 'geplant (planned)', 'eigentlich (actually)'],
      b1ExamTip:
        'Starting a sentence with „Eigentlich …“ almost always signals a coming „aber …“ twist in German!',
    },
  },
  {
    id: 'chat-chunk-131',
    lemma: 'Perfekt vorbereitet!',
    spokenText: 'Perfekt vorbereitet!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Reaktion · Lobend oder neckend',
    translation: 'Perfectly prepared!',
    highlightTarget: 'Perfekt vorbereitet',
    phraseDetails: {
      framePattern: '(Du bist ja) perfekt / bestens vorbereitet!',
      casePattern: 'Partizip II „vorbereitet“ als Adjektiv (trennbares Verb „vorbereiten“)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sie sind hervorragend auf das Gespräch vorbereitet.',
        textEn: 'You are excellently prepared for the conversation.',
        contextNote: 'Formell / Beruf & Prüfung',
      },
      informalVariant: {
        textDe: 'Du hast extra noch einen Beutel eingepackt? Perfekt vorbereitet!',
        textEn: 'You even packed an extra tote bag? Perfectly prepared!',
        contextNote: 'Kommt sowohl ernst als auch neckend super an',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich habe Regenschirm, Wasserflasche und eine kleine Jacke dabei.',
        promptEn: 'I’ve got an umbrella, a water bottle, and a light jacket with me.',
        speakerB: 'Lena',
        replyDe: 'Haha, perfekt vorbereitet wie immer!',
        replyEn: 'Haha, perfectly prepared as always!',
      },
    },
    exampleDe:
      'Felix: Keine Sorge, ich habe sogar noch einen extra Beutel im Rucksack!\nLena: Perfekt vorbereitet!',
    exampleEn:
      'Felix: Don’t worry, I even have an extra tote bag in my backpack!\nLena: Perfectly prepared!',
    anatomy: {
      caseGovernanceNote:
        '„Vorbereiten“ takes no extra „-ge-“ because „be-“ is an inseparable prefix inside the verb: „vor-bereitet“. Pair with „auf + Akk.“ („auf die Prüfung vorbereitet“).',
      synonyms: ['Bestens vorbereitet!', 'Du hast an alles gedacht!'],
      antonyms: ['Völlig unvorbereitet!'],
      collocations: [
        'Gut auf die Reise vorbereitet sein.',
        'Sich auf eine Prüfung vorbereiten.',
      ],
      wordFamily: ['vorbereiten (to prepare)', 'die Vorbereitung (preparation)', 'vorbereitet (prepared)'],
      b1ExamTip:
        'Fun short reaction whenever a friend pulls out snacks, tissues, or an umbrella right when needed.',
    },
  },
  {
    id: 'chat-chunk-132',
    lemma: 'Das geht natürlich auch!',
    spokenText: 'Das geht natürlich auch!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Absprache · Vorschlag annehmen',
    translation: 'That works too, of course!',
    highlightTarget: 'Das geht natürlich auch',
    phraseDetails: {
      framePattern: '(Oh ja,) das geht natürlich auch!',
      casePattern: 'gehen (= funktionieren / möglich sein) + „natürlich auch“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Diese Alternative ist selbstverständlich ebenfalls möglich.',
        textEn: 'That alternative is of course possible as well.',
        contextNote: 'Formell / Terminabsprache',
      },
      informalVariant: {
        textDe: 'Ach, du willst lieber zusammen hingehen? Das geht natürlich auch!',
        textEn: 'Oh, you’d rather go together? That works too, of course!',
        contextNote: 'Sehr flexibel und freundlich beim Planen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Können wir statt Pizza heute Abend auch einfach Thai bestellen?',
        promptEn: 'Instead of pizza, could we also just order Thai tonight?',
        speakerB: 'Felix',
        replyDe: 'Klar, das geht natürlich auch!',
        replyEn: 'Sure, that works too, of course!',
      },
    },
    exampleDe:
      'Lena: Ach, ich dachte, wir probieren das zusammen aus!\nFelix: Das geht natürlich auch, dann warten wir noch ein bisschen.',
    exampleEn:
      'Lena: Oh, I thought we were going to try that together!\nFelix: That works too, of course—we’ll just wait a little bit then.',
    anatomy: {
      caseGovernanceNote:
        '„Gehen“ is German’s Swiss-army verb for „to work / be possible“: „Geht es am Freitag?“ (Does Friday work?), „Das geht klar!“ (Sounds good / consider it done!).',
      synonyms: ['Das passt natürlich auch!', 'Das können wir gern so machen!'],
      antonyms: ['Das geht leider nicht.'],
      collocations: [
        'Geht bei dir Donnerstag?',
        'Das geht klar!',
      ],
      wordFamily: ['gehen (to go / work)', 'natürlich (of course)'],
      b1ExamTip:
        'Use „Das geht!“ / „Das geht leider nicht“ for every scheduling conversation—simple and 100% idiomatic.',
    },
  },
  {
    id: 'chat-chunk-133',
    lemma: 'Da musst du nur ein bisschen warten.',
    spokenText: 'Da musst du nur ein bisschen warten.',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Pläne · Vertrösten',
    translation: 'You’ll just have to wait a little bit for that.',
    highlightTarget: 'musst du nur ein bisschen warten',
    phraseDetails: {
      framePattern: 'Da / Dann musst du nur ein bisschen / ein paar Tage warten.',
      casePattern: 'Inversion nach „Da“ + Modalverb „musst“ + Infinitiv „warten“ am Ende',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Dafür müssten Sie sich bitte noch etwas gedulden.',
        textEn: 'For that you would please have to be patient a little longer.',
        contextNote: 'Formell / Service & Beruf',
      },
      informalVariant: {
        textDe: 'Zusammen kochen? Sehr gern – da musst du nur ein bisschen warten, bis ich wieder da bin!',
        textEn: 'Cook together? Would love to—you’ll just have to wait a bit until I’m back!',
        contextNote: 'Lockeres Vertrösten unter Freunden',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wann gehst du endlich mal mit mir in das neue Café?',
        promptEn: 'When are you finally going to that new café with me?',
        speakerB: 'Felix',
        replyDe: 'Sobald ich aus dem Urlaub zurück bin – da musst du nur ein bisschen warten!',
        replyEn: 'As soon as I’m back from vacation—you just have to wait a little bit!',
      },
    },
    exampleDe:
      'Lena: Wollen wir nach deinem Urlaub zusammen trainieren gehen?\nFelix: Klar, da musst du nur ein bisschen warten!',
    exampleEn:
      'Lena: Want to go work out together after your vacation?\nFelix: Sure, you’ll just have to wait a little bit!',
    anatomy: {
      caseGovernanceNote:
        '„Da“ at Position 1 acts like „for that / in that case“, putting the modal verb „musst“ in Position 2 and pushing the infinitive „warten“ to the very end.',
      synonyms: ['Dafür brauchst du nur etwas Geduld.'],
      antonyms: ['Wir können sofort loslegen!'],
      collocations: [
        'Warte mal kurz!',
        'Ich warte auf dich (+ Akk.).',
      ],
      wordFamily: ['warten (to wait)', 'abwarten (to wait and see)', 'die Geduld (patience)'],
      b1ExamTip:
        'Remember „warten auf + Akkusativ“ when naming who/what you’re waiting for: „Ich warte auf den Zug“.',
    },
  },
  {
    id: 'chat-chunk-134',
    lemma: 'Das ging aber lange!',
    spokenText: 'Das ging aber lange!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Staunen mit „aber“',
    translation: 'That went on for a long time! · Wow, that took a while!',
    highlightTarget: 'ging aber lange',
    phraseDetails: {
      framePattern: 'Das ging aber lange / schnell!',
      casePattern: 'Präteritum „ging“ (= dauerte) + Staun-Partikel „aber“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das Gespräch hat ja wirklich recht lange gedauert.',
        textEn: 'The conversation really lasted quite a long time.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Endlich fertig telefoniert? Oha, das ging aber lange!',
        textEn: 'Finally done with the phone call? Whoa, that went on for a long time!',
        contextNote: 'Modalpartikel „aber“ drückt freundliches Staunen aus',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'So, jetzt bin ich endlich fertig mit meinem Telefonat!',
        promptEn: 'Alright, I’m finally done with my phone call!',
        speakerB: 'Felix',
        replyDe: 'Ui, das ging aber lange! Habt ihr alles aufgeholt?',
        replyEn: 'Whoa, that went on for a long time! Did you catch up on everything?',
      },
    },
    exampleDe:
      'Lena: Wir haben von acht bis Mitternacht gequatscht!\nFelix: Oh wow, das ging aber lange!',
    exampleEn:
      'Lena: We chatted from eight until midnight!\nFelix: Oh wow, that went on for a long time!',
    anatomy: {
      caseGovernanceNote:
        'Inside a statement (not at the start!), „aber“ is NOT „but“—it’s an exclamation particle of pleasant surprise! Compare „Das ging aber schnell!“ (Wow, that was fast!) and „Das schmeckt aber gut!“ (Mmm, that tastes so good!).',
      synonyms: ['Das hat aber lange gedauert!'],
      antonyms: ['Das ging aber schnell!'],
      collocations: [
        'Das ging aber schnell!',
        'Heute ist es aber kalt!',
      ],
      wordFamily: ['gehen / ging (to go / last)', 'aber (surprise particle)', 'lange (long)'],
      b1ExamTip:
        'Unlock surprise-„aber“ at the dinner table: „Das schmeckt aber lecker!“ makes any host beam with joy.',
    },
  },
  {
    id: 'chat-chunk-135',
    lemma: 'So ab und zu mal.',
    spokenText: 'So ab und zu mal.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Häufigkeit · Gelegentlich',
    translation: 'Every now and then. · Once in a while.',
    highlightTarget: 'So ab und zu mal',
    phraseDetails: {
      framePattern: '(Ja,) so ab und zu mal. / Ich mache das ab und zu.',
      casePattern: 'Feste Zeitangabe „ab und zu“ (= manchmal / gelegentlich) + lockeres „so … mal“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Gelegentlich mache ich das durchaus ganz gerne.',
        textEn: 'Occasionally I quite enjoy doing that.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Ja, so ab und zu mal, aber nicht jede Woche.',
        textEn: 'Yeah, every now and then, but not every week.',
        contextNote: 'Viel natürlicher als lehrbuchhaftes „manchmal“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Triffst du dich oft mit Freunden zum Kaffeeklatsch?',
        promptEn: 'Do you often meet up with friends to catch up over coffee?',
        speakerB: 'Felix',
        replyDe: 'So ab und zu mal, wenn es sich gerade ergibt.',
        replyEn: 'Every now and then, whenever the chance comes up.',
      },
    },
    exampleDe:
      'Lena: Gehst du eigentlich oft ins Kino?\nFelix: So ab und zu mal, wenn ein richtig guter Film läuft.',
    exampleEn:
      'Lena: Do you actually go to the movies often?\nFelix: Every now and then, when a really good movie is playing.',
    anatomy: {
      caseGovernanceNote:
        '„Ab und zu“ (every now and then) is a fixed adverbial chunk. Framing it with „so … mal“ softens it into effortless spoken German.',
      synonyms: ['Hin und wieder.', 'Ab und an.', 'Gelegentlich.'],
      antonyms: ['Ständig!', 'Jeden Tag!'],
      collocations: [
        'Ab und zu tut eine Pause gut.',
        'Wir sehen uns ab und zu.',
      ],
      wordFamily: ['ab und zu (now and then)', 'hin und wieder (occasionally)'],
      b1ExamTip:
        'Upgrade your frequency answers beyond „manchmal“—„ab und zu“ sounds instantly more natural!',
    },
  },
  {
    id: 'chat-chunk-136',
    lemma: 'Wann warst du zuletzt im Urlaub?',
    spokenText: 'Wann warst du zuletzt im Urlaub?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Smalltalk · Nach letztem Erlebnis fragen',
    translation: 'When was the last time you went on vacation?',
    highlightTarget: 'Wann warst du zuletzt',
    phraseDetails: {
      framePattern: 'Wann warst du zuletzt + [Ort / Aktivität]?',
      casePattern: 'Präteritum „warst“ + Zeitadverb „zuletzt“ (= das letzte Mal)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Wann waren Sie das letzte Mal im Urlaub?',
        textEn: 'When were you on vacation the last time?',
        contextNote: 'Höflich / Kollegen',
      },
      informalVariant: {
        textDe: 'Wann warst du denn zuletzt Snowboard fahren? Das klingt richtig toll!',
        textEn: 'When was the last time you went snowboarding? That sounds really awesome!',
        contextNote: 'Super Gesprächsstarter für Reisen & Hobbys',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wann warst du zuletzt im Urlaub am Meer?',
        promptEn: 'When was the last time you went on vacation by the sea?',
        speakerB: 'Felix',
        replyDe: 'Das war im Februar dieses Jahres mit meiner Familie.',
        replyEn: 'That was in February of this year with my family.',
      },
    },
    exampleDe:
      'Lena: Wann warst du zuletzt im Urlaub in den Bergen?\nFelix: Im Februar, zusammen mit meiner Familie!',
    exampleEn:
      'Lena: When was the last time you went on vacation in the mountains?\nFelix: In February, together with my family!',
    anatomy: {
      caseGovernanceNote:
        '„Zuletzt“ is the sleek one-word equivalent of „das letzte Mal“ (the last time). Notice „im Urlaub“ = „in dem Urlaub“ (Dative masculine).',
      synonyms: ['Wann warst du das letzte Mal …?'],
      antonyms: ['Wann fährst du das nächste Mal …?'],
      collocations: [
        'Wann warst du zuletzt im Kino?',
        'Wann haben wir uns zuletzt gesehen?',
      ],
      wordFamily: ['zuletzt (last / most recently)', 'das letzte Mal (the last time)', 'der Urlaub (vacation)'],
      b1ExamTip:
        'Swap the ending to spark great dinner-table stories: „Wann warst du zuletzt auf einem Konzert / in den Bergen?“.',
    },
  },

  // =========================================================================
  // MINI-DECK 4 EXPANSION: ALLTAG, ESSEN & FREUNDESKREIS (137–160)
  // =========================================================================
  {
    id: 'chat-chunk-137',
    lemma: 'Das hat leider ein bisschen gelitten.',
    spokenText: 'Das hat leider ein bisschen gelitten.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Kleines Missgeschick schildern',
    translation: 'That unfortunately took a bit of a beating.',
    highlightTarget: 'hat leider ein bisschen gelitten',
    phraseDetails: {
      framePattern: '[Etwas] hat leider ein bisschen gelitten.',
      casePattern: 'Perfekt von „leiden“ (unregelmäßig: hat gelitten)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das Stück wurde beim Brennen leider leicht beschädigt.',
        textEn: 'The piece was unfortunately slightly damaged during firing.',
        contextNote: 'Formell / Sachlich',
      },
      informalVariant: {
        textDe: 'Hier ist das Foto – das Auge auf der Vase hat im Ofen leider ein bisschen gelitten!',
        textEn: 'Here’s the photo—the eye on the vase sadly took a little beating in the kiln!',
        contextNote: 'Humorvoll-charmante Art, ein Missgeschick zu beschreiben',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich habe dir meinen selbst gebackenen Kuchen mitgebracht – er hat im Rucksack leider ein bisschen gelitten.',
        promptEn: 'I brought you my homemade cake—it sadly took a bit of a beating in my backpack.',
        speakerB: 'Lena',
        replyDe: 'Ach, egal, der schmeckt bestimmt trotzdem super!',
        replyEn: 'Aw, doesn’t matter, I’m sure it still tastes amazing!',
      },
    },
    exampleDe:
      'Felix: Hier ist meine selbst getöpferte Vase – die Farbe hat leider ein bisschen gelitten.\nLena: Ach, die Schriftzeichen hast du trotzdem gut hinbekommen!',
    exampleEn:
      'Felix: Here’s the vase I made in pottery—the paint sadly took a bit of a beating.\nLena: Aw, you still pulled off the lettering nicely!',
    anatomy: {
      caseGovernanceNote:
        'Irregular Perfekt: „leiden → hat gelitten“. Used playfully for objects (a squished cake, a dented suitcase, messy pottery) just as much as for people!',
      synonyms: ['Das hat etwas abbekommen.', 'Das ist leider ein bisschen schiefgegangen.'],
      antonyms: ['Das ist perfekt geworden!'],
      collocations: [
        'Meine Schuhe haben im Regen ganz schön gelitten.',
        'Der Kuchen hat auf dem Weg etwas gelitten.',
      ],
      wordFamily: ['leiden (to suffer)', 'gelitten (suffered)', 'leider (unfortunately)'],
      b1ExamTip:
        'A charming, slightly understated way to laugh off small everyday mishaps.',
    },
  },
  {
    id: 'chat-chunk-138',
    lemma: 'Sollte ich den kennen?',
    spokenText: 'Sollte ich den kennen?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Freunde · Nach jemandem fragen',
    translation: 'Should I know him? · Am I supposed to know him?',
    highlightTarget: 'Sollte ich den kennen',
    phraseDetails: {
      framePattern: 'Sollte ich den / die / das kennen?',
      casePattern: 'Modalverb „sollte“ + Demonstrativpronomen „den“ (Akk. Mask.) + „kennen“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Müsste mir diese Person bekannt sein?',
        textEn: 'Should this person be familiar to me?',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Karaoke mit Jonas? Haha, sollte ich den kennen?',
        textEn: 'Karaoke with Jonas? Haha, am I supposed to know him?',
        contextNote: 'Super nützlich, wenn Freunde plötzlich unbekannte Namen nennen',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Gestern hat Jonas die ganze Bar mit Karaoke unterhalten!',
        promptEn: 'Yesterday Jonas entertained the whole bar with karaoke!',
        speakerB: 'Lena',
        replyDe: 'Haha, sollte ich den kennen?',
        replyEn: 'Haha, should I know him?',
      },
    },
    exampleDe:
      'Felix: Jonas hat gestern alle zum Lachen gebracht!\nLena: Warte kurz – sollte ich den kennen?',
    exampleEn:
      'Felix: Jonas had everyone laughing yesterday!\nLena: Wait a second—should I know him?',
    anatomy: {
      caseGovernanceNote:
        'In spoken German, „den / die / das“ is frequently used instead of „ihn / sie / es“ when pointing back to a name or movie just mentioned: „Sollte ich den kennen?“ (him), „Sollte ich die kennen?“ (her).',
      synonyms: ['Müsste ich ihn kennen?', 'Wer ist das denn?'],
      antonyms: ['Klar, den kenne ich!'],
      collocations: [
        'Sollte ich den Film kennen?',
        'Den kenne ich noch gar nicht.',
      ],
      wordFamily: ['kennen (to know a person/place)', 'sollen (should)', 'bekannt (known)'],
      b1ExamTip:
        'Great social rescue line when someone drops a friend’s name mid-story without introducing who they are!',
    },
  },
  {
    id: 'chat-chunk-139',
    lemma: 'Kannte ich vorher auch nicht.',
    spokenText: 'Kannte ich vorher auch nicht.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Freunde · Locker aufklären',
    translation: 'I didn’t know him before either.',
    highlightTarget: 'Kannte ich vorher auch nicht',
    phraseDetails: {
      framePattern: '(Den / Die / Das) kannte ich vorher auch nicht.',
      casePattern: 'Präteritum von „kennen“ (kannte) · Vorfeld-Auslassung von „Den / Das“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich kannte ihn zuvor ebenfalls noch nicht.',
        textEn: 'I did not know him beforehand either.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Nee, das war der beste Freund von Mia – kannte ich vorher auch nicht!',
        textEn: 'Nah, that was Mia’s best friend—I didn’t know him before either!',
        contextNote: 'Entspannte Antwort, damit sich niemand ausgeschlossen fühlt',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Oh, sollte ich das Lokal kennen?',
        promptEn: 'Oh, should I know that place?',
        speakerB: 'Felix',
        replyDe: 'Nee, kannte ich vorher auch nicht – war aber super gemütlich!',
        replyEn: 'Nah, I didn’t know it before either—it was super cozy though!',
      },
    },
    exampleDe:
      'Lena: Sollte ich Jonas kennen?\nFelix: Nein, keine Sorge – kannte ich vorher auch nicht!',
    exampleEn:
      'Lena: Should I know Jonas?\nFelix: No, don’t worry—I didn’t know him before either!',
    anatomy: {
      caseGovernanceNote:
        'Irregular Präteritum „kannte“ (from „kennen“) is very common in speech because it’s much shorter than „habe gekannt“. Works for people, cafés, bands, and dishes!',
      synonyms: ['Habe ich vorher auch nicht gekannt.'],
      antonyms: ['Den kenne ich schon ewig!'],
      collocations: [
        'Kannte ich noch gar nicht!',
        'Woher kennst du ihn?',
      ],
      wordFamily: ['kennen (to know)', 'kannte (knew)', 'vorher (beforehand)'],
      b1ExamTip:
        'Using „kannte“ instead of „habe gekannt“ is one of the few Präteritum verbs Germans prefer even in casual chat (alongside „war“, „hatte“, „wusste“, „dachte“).',
    },
  },
  {
    id: 'chat-chunk-140',
    lemma: 'Und wer ist das genau?',
    spokenText: 'Und wer ist das genau?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Freunde · Nachfragen',
    translation: 'And who is that exactly?',
    highlightTarget: 'Und wer ist das genau',
    phraseDetails: {
      framePattern: 'Und wer ist [Name / das] genau?',
      casePattern: 'Fragewort „wer“ + „genau“ am Satzende zum freundlichen Nachfragen',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Darf ich fragen, wer genau damit gemeint ist?',
        textEn: 'May I ask who exactly is meant by that?',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Ach so, der Freund von Mia – und wer ist das genau?',
        textEn: 'Oh I see, Mia’s friend—and who is that exactly?',
        contextNote: 'Natürliches Nachfragen bei Freundeskreis-Geschichten',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Ich gehe am Samstag mit Mia und Jonas laufen.',
        promptEn: 'I’m going running with Mia and Jonas on Saturday.',
        speakerB: 'Lena',
        replyDe: 'Und wer ist das genau? Kennst du die beiden aus der Uni?',
        replyEn: 'And who is that exactly? Do you know those two from uni?',
      },
    },
    exampleDe:
      'Felix: Das ist der beste Freund von Mia.\nLena: Ach so, und wer ist das genau?',
    exampleEn:
      'Felix: That’s Mia’s best friend.\nLena: Oh I see, and who is that exactly?',
    anatomy: {
      caseGovernanceNote:
        'Adding „genau“ at the end of any W-question („Wer ist das genau?“, „Was machst du da genau?“, „Wo wohnt er genau?“) shows engaged curiosity.',
      synonyms: ['Woher kennst du ihn?', 'Wer ist denn das?'],
      antonyms: ['Ach, die kenne ich ja!'],
      collocations: [
        'Was meinst du genau?',
        'Wo ist das genau?',
      ],
      wordFamily: ['wer (who)', 'genau (exactly)'],
      b1ExamTip:
        '„Was machst du da genau?“ is one of the best follow-up questions when someone tells you about their job or internship.',
    },
  },
  {
    id: 'chat-chunk-141',
    lemma: 'Ich bin eher schlecht darin.',
    spokenText: 'Ich bin eher schlecht darin.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Bescheiden über sich reden',
    translation: 'I’m pretty bad at it.',
    highlightTarget: 'bin eher schlecht darin',
    phraseDetails: {
      framePattern: 'Ich bin eher schlecht / gut darin (, … zu + Infinitiv).',
      casePattern: 'gut / schlecht sein in + Dativ → Pronominaladverb „darin“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das gehört leider nicht zu meinen Stärken.',
        textEn: 'That is unfortunately not one of my strengths.',
        contextNote: 'Formell / Beruf & Bewerbung',
      },
      informalVariant: {
        textDe: 'Singen? Nee, ich bin eher schlecht darin, das will niemand hören!',
        textEn: 'Singing? Nah, I’m pretty bad at it, nobody wants to hear that!',
        contextNote: 'Sympathisch-selbstironisch dank „eher“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Kannst du eigentlich gut malen oder zeichnen?',
        promptEn: 'Are you actually good at painting or drawing?',
        speakerB: 'Felix',
        replyDe: 'Haha, ich bin eher schlecht darin, aber es macht trotzdem Spaß!',
        replyEn: 'Haha, I’m pretty bad at it, but it’s still fun!',
      },
    },
    exampleDe:
      'Lena: Gehst du oft Karaoke singen?\nFelix: Nein, ich bin eher schlecht darin.',
    exampleEn:
      'Lena: Do you go sing karaoke often?\nFelix: No, I’m pretty bad at it.',
    anatomy: {
      caseGovernanceNote:
        'In German you are good/bad „in“ something („gut im Kochen“, „schlecht im Singen“), so „at it“ becomes „darin“ („Ich bin gut darin / schlecht darin“).',
      synonyms: ['Das kann ich nicht so gut.', 'Das ist nicht meine Stärke.'],
      antonyms: ['Ich bin richtig gut darin!'],
      collocations: [
        'Bist du gut darin?',
        'Ich bin total schlecht darin, mir Namen zu merken.',
      ],
      wordFamily: ['darin (at it / in it)', 'eher (rather / pretty)', 'schlecht (bad)'],
      b1ExamTip:
        'Swap „schlecht“ for „gut“ when complimenting a friend: „Du bist echt gut darin!“ (You’re really good at it!).',
    },
  },
  {
    id: 'chat-chunk-142',
    lemma: 'Den kenne ich vom Sport.',
    spokenText: 'Den kenne ich vom Sport.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Freunde · Bekanntschaft erklären',
    translation: 'I know him from sports.',
    highlightTarget: 'Den kenne ich vom Sport',
    phraseDetails: {
      framePattern: 'Den / Die kenne ich vom Sport / aus der Uni / von der Arbeit.',
      casePattern: 'Demonstrativpronomen „Den“ (Akk. Mask.) auf Position 1 + von + dem (vom) Dativ',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich kenne ihn aus meinem Sportkurs.',
        textEn: 'I know him from my sports class.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Jonas? Den kenne ich vom Sport, er ist auch mit im Kurs!',
        textEn: 'Jonas? I know him from sports, he’s in the class too!',
        contextNote: 'Sehr idiomatische Wortstellung mit „Den“ vorne',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Woher kennst du eigentlich Jonas?',
        promptEn: 'Where do you actually know Jonas from?',
        speakerB: 'Felix',
        replyDe: 'Den kenne ich vom Sport – wir gehen manchmal zusammen joggen.',
        replyEn: 'I know him from sports—we sometimes go jogging together.',
      },
    },
    exampleDe:
      'Lena: Woher kennst du Mia und Jonas?\nFelix: Den kenne ich vom Sport, und Mia ist seine Freundin.',
    exampleEn:
      'Lena: Where do you know Mia and Jonas from?\nFelix: I know him from sports, and Mia is his girlfriend.',
    anatomy: {
      caseGovernanceNote:
        'Putting „Den“ (him) or „Die“ (her) in Position 1 connects directly to the name your friend just asked about! Use „von + Dat.“ for activities/work („vom Sport“, „von der Arbeit“) and „aus + Dat.“ for institutions („aus der Schule / Uni“).',
      synonyms: ['Wir kennen uns vom Sport.', 'Ich habe ihn beim Sport kennengelernt.'],
      antonyms: ['Den habe ich heute zum ersten Mal gesehen.'],
      collocations: [
        'Die kenne ich aus der Uni.',
        'Woher kennt ihr euch?',
      ],
      wordFamily: ['kennen (to know)', 'kennenlernen (to meet)', 'der Sport (sports)'],
      b1ExamTip:
        '„Woher kennt ihr euch?“ (How do you guys know each other?) is one of the top icebreakers at any German party!',
    },
  },
  {
    id: 'chat-chunk-143',
    lemma: 'Wenn mein Knie mitmacht.',
    spokenText: 'Wenn mein Knie mitmacht.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Bedingung mit „mitmachen“',
    translation: 'If my knee cooperates. · Provided my knee holds up.',
    highlightTarget: 'Wenn mein Knie mitmacht',
    phraseDetails: {
      framePattern: 'Wenn + [mein Knie / das Wetter / mein Rücken] + mitmacht.',
      casePattern: 'Nebensatz mit „wenn“ · trennbares Verb „mitmachen“ zusammen am Satzende',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sofern das Wetter es zulässt, findet die Tour statt.',
        textEn: 'Provided the weather allows, the tour will take place.',
        contextNote: 'Formell / Ankündigung',
      },
      informalVariant: {
        textDe: 'Wenn mein Knie mitmacht, gehe ich am Sonntag wieder joggen.',
        textEn: 'If my knee cooperates, I’m going jogging again on Sunday.',
        contextNote: 'Super idiomatische Verwendung von „mitmachen“ für Körper & Wetter',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Gehst du morgen wieder mit den anderen laufen?',
        promptEn: 'Are you going running with the others again tomorrow?',
        speakerB: 'Felix',
        replyDe: 'Wenn mein Knie mitmacht, auf jeden Fall!',
        replyEn: 'If my knee cooperates, definitely!',
      },
    },
    exampleDe:
      'Lena: Gehst du am Sonntag wieder mit uns wandern?\nFelix: Sehr gern – wenn mein Knie mitmacht!',
    exampleEn:
      'Lena: Are you coming hiking with us again on Sunday?\nFelix: Would love to—if my knee cooperates!',
    anatomy: {
      caseGovernanceNote:
        '„Mitmachen“ means „to join in“ for people, AND „to cooperate / hold up“ for weather, body parts, or old cars („Wenn das Wetter mitmacht“, „Wenn das Auto mitmacht“)!',
      synonyms: ['Wenn alles gut geht.', 'Wenn das Wetter mitspielt.'],
      antonyms: ['Mein Knie streikt heute leider.'],
      collocations: [
        'Wenn das Wetter mitmacht, grillen wir!',
        'Machst du beim Spiel mit?',
      ],
      wordFamily: ['mitmachen (to join in / cooperate)', 'mitspielen (to play along)'],
      b1ExamTip:
        'Swap „mein Knie“ for „das Wetter“ („Wenn das Wetter mitmacht!“)—you’ll use that every single spring and summer in Germany.',
    },
  },
  {
    id: 'chat-chunk-144',
    lemma: 'Hast du noch Prüfungen?',
    spokenText: 'Hast du noch Prüfungen?',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Studium · Nach Prüfungen fragen',
    translation: 'Do you still have exams?',
    highlightTarget: 'Hast du noch Prüfungen',
    phraseDetails: {
      framePattern: 'Hast du noch Prüfungen? / Für welches Fach musst du lernen?',
      casePattern: 'haben + „noch“ + Akkusativ Plural ohne Artikel (Prüfungen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Stehen bei Ihnen in nächster Zeit noch Prüfungen an?',
        textEn: 'Do you still have any exams coming up soon?',
        contextNote: 'Höflich / Uni & Beruf',
      },
      informalVariant: {
        textDe: 'Oh nein, du bist am Lernen? Hast du noch Prüfungen?',
        textEn: 'Oh no, you’re studying? Do you still have exams?',
        contextNote: 'Typische mitfühlende Frage unter Studierenden',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Oh je, du sitzt am Wochenende am Schreibtisch – hast du noch Prüfungen?',
        promptEn: 'Oh dear, you’re at your desk on the weekend—do you still have exams?',
        speakerB: 'Lena',
        replyDe: 'Ja, leider noch zwei Stück nächste Woche!',
        replyEn: 'Yes, sadly still two left next week!',
      },
    },
    exampleDe:
      'Felix: Hast du noch Prüfungen diesen Monat?\nLena: Ja, am Dienstag und Freitag noch – dann bin ich endlich durch!',
    exampleEn:
      'Felix: Do you still have exams this month?\nLena: Yes, Tuesday and Friday—then I’m finally done!',
    anatomy: {
      caseGovernanceNote:
        'Plural indefinite nouns take zero article in German („Prüfungen“, „Fragen“, „Pläne“). Notice also Lena’s great follow-up: „dann bin ich durch!“ = „then I’m done with them!“.',
      synonyms: ['Schreibst du noch Klausuren?'],
      antonyms: ['Bist du schon mit allen Prüfungen fertig?'],
      collocations: [
        'Eine Prüfung schreiben / bestehen.',
        'Wann ist deine letzte Prüfung?',
      ],
      wordFamily: ['die Prüfung, -en (exam)', 'prüfen (to test / check)', 'die Klausur (written uni exam)'],
      b1ExamTip:
        'At German universities, written exams are often called „Klausuren“ („Ich schreibe eine Klausur“).',
    },
  },
  {
    id: 'chat-chunk-145',
    lemma: 'Das ist eh langweilig.',
    spokenText: 'Das ist eh langweilig.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Meinung · Lässige Partikel „eh“',
    translation: 'That’s boring anyway.',
    highlightTarget: 'ist eh langweilig',
    phraseDetails: {
      framePattern: '[Etwas] ist eh + [Adjektiv] / Das macht eh keinen Unterschied.',
      casePattern: 'Umgangssprachliches Adverb „eh“ (= sowieso / ohnehin)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das finde ich ohnehin nicht besonders spannend.',
        textEn: 'I do not find that particularly exciting anyway.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Laufen ist eh langweilig – spazieren im Urlaub macht viel mehr Spaß!',
        textEn: 'Running is boring anyway—walking on vacation is way more fun!',
        contextNote: 'Freche, ehrliche Meinung mit „eh“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Willst du nicht mal mit uns fünf Kilometer joggen gehen?',
        promptEn: 'Don’t you want to come jog five kilometers with us sometime?',
        speakerB: 'Lena',
        replyDe: 'Haha, nein danke, Laufen ist eh langweilig!',
        replyEn: 'Haha, no thanks, running is boring anyway!',
      },
    },
    exampleDe:
      'Felix: Tut dir nicht leid, dass du das Fußballspiel verpasst hast?\nLena: Ach, das ist eh langweilig!',
    exampleEn:
      'Felix: Aren’t you sorry you missed the soccer game?\nLena: Nah, that’s boring anyway!',
    anatomy: {
      caseGovernanceNote:
        '„Eh“ is the ultra-common 2-letter spoken twin of „sowieso“ (anyway). You’ll hear it everywhere in everyday German: „Hier kennt mich eh keiner!“, „Spontan ist eh am besten!“.',
      synonyms: ['Das ist sowieso langweilig.'],
      antonyms: ['Das ist richtig spannend!'],
      collocations: [
        'Das merkt eh keiner.',
        'Das ist eh viel besser!',
      ],
      wordFamily: ['eh (anyway, spoken)', 'langweilig (boring)', 'die Langeweile (boredom)'],
      b1ExamTip:
        'Recognizing „eh“ = „sowieso“ will immediately clarify hundreds of fast casual German sentences.',
    },
  },
  {
    id: 'chat-chunk-146',
    lemma: 'Was findest du daran denn schlimm?',
    spokenText: 'Was findest du daran denn schlimm?',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Nachfrage · Nach Gründen fragen',
    translation: 'What do you find so bad about it?',
    highlightTarget: 'findest du daran denn schlimm',
    phraseDetails: {
      framePattern: 'Was findest du daran denn so schlimm / toll / spannend?',
      casePattern: 'finden + Pronominaladverb „daran“ (= an dieser Sache) + Fragepartikel „denn“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Was genau stört Sie daran?',
        textEn: 'What exactly bothers you about it?',
        contextNote: 'Formell / Diskussion',
      },
      informalVariant: {
        textDe: 'Du magst kein Joggen? Was findest du daran denn schlimm?',
        textEn: 'You don’t like jogging? What do you find so bad about it?',
        contextNote: 'Neugieriges, lockeres Nachfragen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich bin ehrlich gesagt überhaupt kein Fan von Camping.',
        promptEn: 'To be honest, I’m really not a fan of camping at all.',
        speakerB: 'Felix',
        replyDe: 'Oh, was findest du daran denn schlimm?',
        replyEn: 'Oh, what do you find so bad about it?',
      },
    },
    exampleDe:
      'Lena: Allein ins Restaurant zu gehen finde ich irgendwie komisch.\nFelix: Wieso, was findest du daran denn schlimm?',
    exampleEn:
      'Lena: Going to a restaurant alone feels kinda weird to me.\nFelix: Why, what do you find so bad about it?',
    anatomy: {
      caseGovernanceNote:
        '„Daran“ combines „an + das“ to refer back to an idea or activity („about it“). „Denn“ keeps the question genuinely curious instead of confrontational.',
      synonyms: ['Was stört dich daran?', 'Warum magst du das nicht?'],
      antonyms: ['Was gefällt dir daran so gut?'],
      collocations: [
        'Was findest du daran so lustig?',
        'Daran ist doch nichts schlimm!',
      ],
      wordFamily: ['finden (to find / think)', 'daran (about it)', 'schlimm (bad)'],
      b1ExamTip:
        'Great way to keep a lighthearted debate going over dinner—works with any adjective: „gut“, „lustig“, „schlimm“, „nervig“.',
    },
  },
  {
    id: 'chat-chunk-147',
    lemma: 'Das mache ich schon seit Jahren nicht mehr.',
    spokenText: 'Das mache ich schon seit Jahren nicht mehr.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Alltag · Frühere Hobbys',
    translation: 'I haven’t done that in years.',
    highlightTarget: 'schon seit Jahren nicht mehr',
    phraseDetails: {
      framePattern: '[Aktivität] mache / spiele ich schon seit Jahren nicht mehr.',
      casePattern: 'Präsens (für bis heute anhaltenden Zustand!) + seit + Dativ Plural (Jahren)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Dieser Tätigkeit gehe ich bereits seit einigen Jahren nicht mehr nach.',
        textEn: 'I have not pursued that activity for several years now.',
        contextNote: 'Formell / Schriftlich',
      },
      informalVariant: {
        textDe: 'Fußball? Das spiele ich schon seit Jahren nicht mehr aktiv!',
        textEn: 'Soccer? I haven’t played that actively in years!',
        contextNote: 'Wichtige Zeitform-Falle: Deutsch nutzt Präsens, nicht Perfekt!',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Spielst du eigentlich noch Klavier?',
        promptEn: 'Do you actually still play the piano?',
        speakerB: 'Felix',
        replyDe: 'Leider nein, das mache ich schon seit Jahren nicht mehr.',
        replyEn: 'Sadly no, I haven’t done that in years.',
      },
    },
    exampleDe:
      'Lena: Spielst du noch jedes Wochenende im Verein?\nFelix: Nein, das mache ich schon seit Jahren nicht mehr.',
    exampleEn:
      'Lena: Do you still play for a club every weekend?\nFelix: No, I haven’t done that in years.',
    anatomy: {
      caseGovernanceNote:
        'Classic A2 grammar win: English says „I HAVEN’T done that in years“, but German uses PRESENT TENSE with „seit“ because the state still continues now! „Seit“ always takes Dative („seit Jahren“).',
      synonyms: ['Damit habe ich vor Jahren aufgehört.'],
      antonyms: ['Das mache ich immer noch jede Woche.'],
      collocations: [
        'Seit fünf Jahren nicht mehr.',
        'Ich wohne seit zwei Jahren hier.',
      ],
      wordFamily: ['seit (since / for)', 'das Jahr, -e (year)', 'nicht mehr (no longer)'],
      b1ExamTip:
        'Remember: „seit + Dativ“ + PRESENT tense („Ich mache das seit Jahren nicht mehr“) for anything still true today.',
    },
  },
  {
    id: 'chat-chunk-148',
    lemma: 'Ich habe kaum Ahnung davon.',
    spokenText: 'Ich habe kaum Ahnung davon.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Ehrlichkeit · Wenig über etwas wissen',
    translation: 'I barely know anything about it.',
    highlightTarget: 'kaum Ahnung davon',
    phraseDetails: {
      framePattern: 'Ich habe kaum / keine Ahnung davon (oder von + Dativ).',
      casePattern: 'Ahnung haben von + Dativ → Pronominaladverb „davon“ · „kaum“ (= fast nicht)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Mit diesem Thema kenne ich mich leider kaum aus.',
        textEn: 'I am unfortunately barely familiar with this topic.',
        contextNote: 'Formell / Beruf',
      },
      informalVariant: {
        textDe: 'Ich habe früher zwar gespielt, hatte aber kaum Ahnung von der Bundesliga!',
        textEn: 'I played back then, sure, but I barely knew anything about the Bundesliga!',
        contextNote: 'Sehr ehrliche, alltägliche Aussage',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Welche Kamera würdest du mir für Reisen empfehlen?',
        promptEn: 'Which camera would you recommend to me for traveling?',
        speakerB: 'Felix',
        replyDe: 'Ehrlich gesagt habe ich kaum Ahnung davon – ich fotografiere nur mit dem Handy!',
        replyEn: 'Honestly I barely know anything about it—I only take photos with my phone!',
      },
    },
    exampleDe:
      'Lena: Kennst du dich mit moderner Kunst aus?\nFelix: Nein, ich habe kaum Ahnung davon, aber Museen mag ich trotzdem.',
    exampleEn:
      'Lena: Do you know your way around modern art?\nFelix: No, I barely know anything about it, but I still like museums.',
    anatomy: {
      caseGovernanceNote:
        '„Keine Ahnung!“ = „No idea!“, while „kaum Ahnung davon“ = „barely any clue about it“. Always pair „Ahnung“ with „von + Dativ“ or „davon“.',
      synonyms: ['Ich weiß kaum etwas darüber.', 'Keine Ahnung!'],
      antonyms: ['Damit kenne ich mich super aus!'],
      collocations: [
        'Keine Ahnung, wie das heißt!',
        'Hast du eine Ahnung, wo Mia ist?',
      ],
      wordFamily: ['die Ahnung (clue / idea)', 'ahnen (to suspect)', 'kaum (barely)'],
      b1ExamTip:
        'Also memorize the 2-word giant: „Keine Ahnung!“ (No idea / Beats me!)—used dozens of times a week.',
    },
  },
  {
    id: 'chat-chunk-149',
    lemma: 'Damit kennst du dich gut aus!',
    spokenText: 'Damit kennst du dich gut aus!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Kompliment · Wissen anerkennen',
    translation: 'You really know your stuff with that!',
    highlightTarget: 'kennst du dich gut aus',
    phraseDetails: {
      framePattern: 'Damit / Mit + [Dativ] kennst du dich (scheinbar) gut aus!',
      casePattern: 'sich auskennen mit + Dativ (trennbar + reflexiv) · Pronominaladverb „damit“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Auf diesem Gebiet kennen Sie sich offensichtlich sehr gut aus.',
        textEn: 'You obviously know your way around this field very well.',
        contextNote: 'Formell / Anerkennend',
      },
      informalVariant: {
        textDe: 'Mit solchen Sachen kennst du dich scheinbar richtig gut aus!',
        textEn: 'You really seem to know your stuff with these things!',
        contextNote: 'Tolles Kompliment im Gespräch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Kurze Pausen und Stricken sind beide richtig gut für das Gehirn!',
        promptEn: 'Short breaks and knitting are both really good for the brain!',
        speakerB: 'Felix',
        replyDe: 'Haha, damit kennst du dich gut aus!',
        replyEn: 'Haha, you really know your stuff with that!',
      },
    },
    exampleDe:
      'Lena: In Hamburg gibt es die besten Fischbrötchen direkt am Hafen.\nFelix: Aha, damit kennst du dich gut aus!',
    exampleEn:
      'Lena: In Hamburg the best fish sandwiches are right by the harbor.\nFelix: Aha, you really know your stuff with that!',
    anatomy: {
      caseGovernanceNote:
        '„Sich auskennen“ is reflexive (Accusative: „mich / dich / sich“) and separable („kennst … aus“). Use „mit + Dativ“ for topics („mit Kaffee“) and „in + Dativ“ for cities („in Berlin“).',
      synonyms: ['Da bist du ja richtig Profi!', 'Da weißt du super Bescheid!'],
      antonyms: ['Damit kenne ich mich gar nicht aus.'],
      collocations: [
        'Kennst du dich hier in der Stadt aus?',
        'Ich kenne mich damit leider nicht aus.',
      ],
      wordFamily: ['sich auskennen (to know one’s way around)', 'kennen (to know)'],
      b1ExamTip:
        'Works equally well for asking locals for directions: „Entschuldigung, kennen Sie sich hier aus?“.',
    },
  },
  {
    id: 'chat-chunk-150',
    lemma: 'Das hat sich ganz schön gezogen.',
    spokenText: 'Das hat sich ganz schön gezogen.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Erzählen · Etwas dauerte ewig',
    translation: 'That really dragged on.',
    highlightTarget: 'hat sich ganz schön gezogen',
    phraseDetails: {
      framePattern: '[Etwas] hat sich (ganz schön / ewig) gezogen.',
      casePattern: 'reflexiv „sich ziehen“ (Perfekt: hat sich gezogen) = sehr lange dauern',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Die Heilung hat sich leider über mehrere Monate hingezogen.',
        textEn: 'The recovery unfortunately dragged on over several months.',
        contextNote: 'Formell / Bericht („sich hinziehen“)',
      },
      informalVariant: {
        textDe: 'Meine Zahn-OP hat sich damals ganz schön gezogen, ich war monatelang raus!',
        textEn: 'My tooth surgery really dragged on back then, I was out for months!',
        contextNote: 'Sehr natürliches Bild im gesprochenen Deutsch',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Wie war das Meeting heute Nachmittag?',
        promptEn: 'How was the meeting this afternoon?',
        speakerB: 'Felix',
        replyDe: 'Puh, das hat sich ganz schön gezogen – fast drei Stunden!',
        replyEn: 'Phew, it really dragged on—almost three hours!',
      },
    },
    exampleDe:
      'Lena: Bist du deine Erkältung endlich losgeworden?\nFelix: Ja, zum Glück, aber das hat sich ganz schön gezogen!',
    exampleEn:
      'Lena: Did you finally get rid of your cold?\nFelix: Yes, thankfully, but it really dragged on!',
    anatomy: {
      caseGovernanceNote:
        'Idiomatic reflexive „sich ziehen“ (literally „to stretch itself out“) means „to drag on forever“. Irregular participle: „ziehen → gezogen“.',
      synonyms: ['Das hat ewig gedauert!', 'Das wollte gar nicht aufhören.'],
      antonyms: ['Die Zeit verging wie im Flug!'],
      collocations: [
        'Die Zugfahrt hat sich gezogen.',
        'Der Winter zieht sich dieses Jahr ganz schön.',
      ],
      wordFamily: ['sich ziehen (to drag on)', 'ziehen (to pull)', 'gezogen (pulled / dragged)'],
      b1ExamTip:
        'Relatable phrase for long meetings, slow winters, stubborn colds, or endless train delays.',
    },
  },
  {
    id: 'chat-chunk-151',
    lemma: 'Das habe ich gar nicht mitbekommen!',
    spokenText: 'Das habe ich gar nicht mitbekommen!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Etwas nicht bemerkt haben',
    translation: 'I didn’t even catch that! · I completely missed that!',
    highlightTarget: 'gar nicht mitbekommen',
    phraseDetails: {
      framePattern: 'Das habe ich (gar nicht / wohl) mitbekommen!',
      casePattern: 'trennbares Verb „mitbekommen“ (Partizip ohne -ge-: mitbekommen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das ist mir leider entgangen.',
        textEn: 'That unfortunately escaped my notice.',
        contextNote: 'Formell / Beruf',
      },
      informalVariant: {
        textDe: 'Oh, ihr seid schon umgezogen? Das habe ich gar nicht mitbekommen!',
        textEn: 'Oh, you already moved? I didn’t even catch that!',
        contextNote: 'Eines der wichtigsten Alltagswörter für „bemerken / hören“',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hast du gehört, dass es gestern Nacht ein riesiges Gewitter gab?',
        promptEn: 'Did you hear there was a huge thunderstorm last night?',
        speakerB: 'Lena',
        replyDe: 'Was? Das habe ich gar nicht mitbekommen, ich habe tief geschlafen!',
        replyEn: 'What? I didn’t even notice that, I was fast asleep!',
      },
    },
    exampleDe:
      'Felix: Mia fliegt nächste Woche für ein Semester nach Spanien!\nLena: Echt? Das habe ich gar nicht mitbekommen!',
    exampleEn:
      'Felix: Mia is flying to Spain next week for a semester!\nLena: Really? I didn’t even catch that!',
    anatomy: {
      caseGovernanceNote:
        '„Mitbekommen“ (= to notice / catch / hear about something happening around you). Like „hinbekommen“, there is NO „-ge-“ in Perfekt: „Ich habe es mitbekommen“.',
      synonyms: ['Das habe ich gar nicht gehört!', 'Das ist völlig an mir vorbeigegangen.'],
      antonyms: ['Ja, das habe ich schon mitbekommen!'],
      collocations: [
        'Hast du mitbekommen, was passiert ist?',
        'Ich habe es im Zug gar nicht mitbekommen.',
      ],
      wordFamily: ['mitbekommen (to catch / notice)', 'mitkriegen (casual synonym)'],
      b1ExamTip:
        'Also works affirmatively: „Du hast dir echt viel gemerkt, das habe ich mitbekommen!“ (I noticed!).',
    },
  },
  {
    id: 'chat-chunk-152',
    lemma: 'Du schaffst das!',
    spokenText: 'Du schaffst das!',
    cefr: 'A1',
    category: 'phrase',
    grammarLabel: 'Aufmunterung · Anfeuern',
    translation: 'You’ve got this! · You can do it!',
    highlightTarget: 'Du schaffst das',
    phraseDetails: {
      framePattern: 'Du schaffst das! / Wir schaffen das!',
      casePattern: 'schaffen + Akkusativ (das) = etwas bewältigen / erreichen',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich bin sicher, Sie werden das hervorragend meistern!',
        textEn: 'I am sure you will master that wonderfully!',
        contextNote: 'Formell / Ermutigung',
      },
      informalVariant: {
        textDe: 'Du schaffst das – und danach feiern wir erst mal!',
        textEn: 'You’ve got this—and afterwards we’re going to celebrate!',
        contextNote: 'Die beliebteste Anfeuerung im Deutschen',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich bin echt nervös wegen meiner mündlichen Prüfung morgen.',
        promptEn: 'I’m really nervous about my oral exam tomorrow.',
        speakerB: 'Felix',
        replyDe: 'Du hast so viel gelernt – du schaffst das!',
        replyEn: 'You’ve studied so much—you’ve got this!',
      },
    },
    exampleDe:
      'Lena: Ich weiß nicht, ob ich mich traue, allein zu verreisen.\nFelix: Du schaffst das! Und es wird bestimmt großartig.',
    exampleEn:
      'Lena: I don’t know if I’m brave enough to travel alone.\nFelix: You’ve got this! And I’m sure it’ll be amazing.',
    anatomy: {
      caseGovernanceNote:
        'Regular verb „schaffen → du schaffst → hat geschafft“ means „to manage / pull off / make it“. Simple, punchy, and universally encouraging.',
      synonyms: ['Das packst du!', 'Ich glaube an dich!'],
      antonyms: ['Das schaffe ich niemals.'],
      collocations: [
        'Wir schaffen das zusammen!',
        'Ich habe es geschafft!',
      ],
      wordFamily: ['schaffen (to manage / succeed)', 'geschafft (made it / exhausted)'],
      b1ExamTip:
        'Fun double meaning of „geschafft“: „Ich habe es geschafft!“ (I did it!) vs. „Ich bin total geschafft!“ (I’m totally worn out!).',
    },
  },
  {
    id: 'chat-chunk-153',
    lemma: 'Das habe ich schon lange nicht mehr gehört.',
    spokenText: 'Das habe ich schon lange nicht mehr gehört.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Reaktion · Nostalgie & Staunen',
    translation: 'I haven’t heard that in a long time.',
    highlightTarget: 'schon lange nicht mehr gehört',
    phraseDetails: {
      framePattern: '[Wort / Lied / Das] habe ich schon lange nicht mehr gehört!',
      casePattern: 'Perfekt mit „haben“ + „schon lange nicht mehr“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Diesen Ausdruck habe ich bereits sehr lange nicht mehr gehört.',
        textEn: 'I have not heard this expression in a very long time.',
        contextNote: 'Formell / Neutral',
      },
      informalVariant: {
        textDe: 'Haha, das Wort habe ich schon lange nicht mehr gehört – das sagt sonst nur mein Bruder!',
        textEn: 'Haha, I haven’t heard that word in ages—usually only my brother says that!',
        contextNote: 'Perfekte Reaktion auf alte Lieder, Sprüche oder Jugendwörter',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Hör mal, im Radio läuft gerade unser altes Lieblingslied aus der Schulzeit!',
        promptEn: 'Listen, our old favorite song from school days is playing on the radio right now!',
        speakerB: 'Lena',
        replyDe: 'Oh wow, das habe ich schon lange nicht mehr gehört!',
        replyEn: 'Oh wow, I haven’t heard that in a long time!',
      },
    },
    exampleDe:
      'Felix: Kennst du diesen alten Spruch eigentlich noch?\nLena: Haha, ja – das habe ich schon lange nicht mehr gehört!',
    exampleEn:
      'Felix: Do you actually still remember that old saying?\nLena: Haha, yes—I haven’t heard that in a long time!',
    anatomy: {
      caseGovernanceNote:
        'Adding „schon“ before „lange nicht mehr“ emphasizes how long it’s been („already a long time“). Great rhythm for music, movies, jokes, or slang.',
      synonyms: ['Das habe ich ewig nicht mehr gehört!'],
      antonyms: ['Das höre ich jeden Tag!'],
      collocations: [
        'Den Song habe ich ewig nicht mehr gehört!',
        'Von ihm habe ich lange nichts gehört.',
      ],
      wordFamily: ['hören (to hear)', 'lange nicht mehr (not in a long time)'],
      b1ExamTip:
        'Works great at parties or cafés whenever a throwback song comes on the speakers!',
    },
  },
  {
    id: 'chat-chunk-154',
    lemma: 'Ich lege viel Wert auf guten Schlaf.',
    spokenText: 'Ich lege viel Wert auf guten Schlaf.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Werte · Was einem wichtig ist',
    translation: 'I put a lot of value on good sleep.',
    highlightTarget: 'lege viel Wert auf guten Schlaf',
    phraseDetails: {
      framePattern: 'Ich lege viel Wert auf + [Akkusativ] (guten Schlaf / Pünktlichkeit / gutes Essen).',
      casePattern: 'Wert legen auf + Akkusativ Maskulin (guten Schlaf)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich lege großen Wert auf Zuverlässigkeit und gute Zusammenarbeit.',
        textEn: 'I place great value on reliability and good collaboration.',
        contextNote: 'Formell / Beruf & Bewerbung',
      },
      informalVariant: {
        textDe: 'Du legst halt viel Wert auf guten Schlaf, oder?',
        textEn: 'You just really value good sleep, right?',
        contextNote: 'Starke Wendung, die sowohl locker als auch seriös glänzt',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Du gehst sogar im Urlaub immer vor Mitternacht ins Bett?',
        promptEn: 'You even go to bed before midnight on vacation?',
        speakerB: 'Felix',
        replyDe: 'Ja, ich lege viel Wert auf guten Schlaf und ordentliche Mahlzeiten!',
        replyEn: 'Yes, I put a lot of value on good sleep and proper meals!',
      },
    },
    exampleDe:
      'Lena: Du legst wirklich viel Wert auf deine acht Stunden, oder?\nFelix: Ja, ich lege viel Wert auf guten Schlaf, sonst bin ich den ganzen Tag müde.',
    exampleEn:
      'Lena: You really value your eight hours, right?\nFelix: Yes, I put a lot of value on good sleep, otherwise I’m tired all day.',
    anatomy: {
      caseGovernanceNote:
        'Fixed verb-noun combo: „Wert legen auf + Akkusativ“ (to value / care deeply about). Masculine „guter Schlaf“ takes the Accusative „-en“ ending: „auf guten Schlaf“.',
      synonyms: ['Guter Schlaf ist mir sehr wichtig.'],
      antonyms: ['Darauf lege ich keinen großen Wert.'],
      collocations: [
        'Viel Wert auf gutes Essen legen.',
        'Darauf lege ich großen Wert.',
      ],
      wordFamily: ['der Wert (value)', 'legen (to lay / place)', 'wertvoll (valuable)'],
      b1ExamTip:
        'A powerhouse phrase that works equally well chatting about lifestyle with friends OR talking about priorities in an exam!',
    },
  },
  {
    id: 'chat-chunk-155',
    lemma: 'Du klingst nicht so begeistert.',
    spokenText: 'Du klingst nicht so begeistert.',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Empathie · Stimmung erkennen',
    translation: 'You don’t sound all that thrilled.',
    highlightTarget: 'klingst nicht so begeistert',
    phraseDetails: {
      framePattern: 'Du klingst nicht so / richtig + [Adjektiv] (begeistert / überzeugt).',
      casePattern: 'klingen + „nicht so“ (höfliche Abschwächung) + Partizip „begeistert“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Sie klingen noch nicht ganz überzeugt von dem Vorschlag.',
        textEn: 'You do not sound completely convinced by the proposal yet.',
        contextNote: 'Formell / Gespräch',
      },
      informalVariant: {
        textDe: 'Haha, du klingst nicht so begeistert von deiner nächsten Prüfung!',
        textEn: 'Haha, you don’t sound all that thrilled about your next exam!',
        contextNote: 'Aufmerksame, charmante Beobachtung',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Nächste Woche habe ich schon wieder zwei riesige Prüfungen…',
        promptEn: 'Next week I have two huge exams all over again…',
        speakerB: 'Felix',
        replyDe: 'Du klingst nicht so begeistert – aber viel Erfolg schon mal!',
        replyEn: 'You don’t sound too thrilled—best of luck in advance though!',
      },
    },
    exampleDe:
      'Lena: Morgen muss ich um sechs Uhr aufstehen für ein Seminar.\nFelix: Oh je, du klingst nicht so begeistert!',
    exampleEn:
      'Lena: Tomorrow I have to wake up at six for a seminar.\nFelix: Oh dear, you don’t sound all that thrilled!',
    anatomy: {
      caseGovernanceNote:
        '„Nicht so begeistert“ is classic German understatement for „not thrilled at all / dreading it“. Works both over the phone and when reading a text!',
      synonyms: ['Du wirkst nicht gerade begeistert.', 'Hast du keine Lust darauf?'],
      antonyms: ['Du klingst ja total begeistert!'],
      collocations: [
        'Ich bin total begeistert!',
        'Klingt nicht gerade nach Spaß.',
      ],
      wordFamily: ['begeistert (thrilled / enthusiastic)', 'die Begeisterung (enthusiasm)', 'klingen (to sound)'],
      b1ExamTip:
        'Use „Du klingst…“ to show empathy and attentiveness in voice calls, texts, and face-to-face chats.',
    },
  },
  {
    id: 'chat-chunk-156',
    lemma: 'Ich muss zugeben, dass …',
    spokenText: 'Ich muss zugeben, dass',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Ehrlichkeit · Etwas eingestehen',
    translation: 'I have to admit that …',
    highlightTarget: 'Ich muss zugeben, dass',
    phraseDetails: {
      framePattern: 'Ich muss zugeben, dass + [Subjekt] … [Verb am Ende].',
      casePattern: 'Modalverb „muss“ + trennbares Verb „zugeben“ + „dass“-Nebensatz',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Ich muss offen zugeben, dass ich das anfangs unterschätzt habe.',
        textEn: 'I must openly admit that I underestimated that at first.',
        contextNote: 'Formell / Diskussion',
      },
      informalVariant: {
        textDe: 'Ich muss zugeben, dass ich das Lernen ein bisschen verlernt habe!',
        textEn: 'I have to admit that I’ve kinda forgotten how to study!',
        contextNote: 'Ehrliche, sympathische Selbstreflexion',
      },
      miniDialog: {
        speakerA: 'Felix',
        promptDe: 'Und, gefällt dir der neue Sportkurs jetzt doch?',
        promptEn: 'So, do you end up liking the new sports class after all?',
        speakerB: 'Lena',
        replyDe: 'Ich muss zugeben, dass es zusammen echt Spaß macht!',
        replyEn: 'I have to admit that doing it together is genuinely fun!',
      },
    },
    exampleDe:
      'Felix: War der Film am Ende doch besser als gedacht?\nLena: Ich muss zugeben, dass er richtig lustig war!',
    exampleEn:
      'Felix: Was the movie better than expected in the end?\nLena: I have to admit that it was really funny!',
    anatomy: {
      caseGovernanceNote:
        '„Zugeben“ means „to admit / confess“. You can also tack it onto the end of a sentence as a spoken tag: „Das mag ich nicht so gern, muss ich leider zugeben.“',
      synonyms: ['Ehrlich gesagt …', 'Zugegeben, …'],
      antonyms: ['Das würde ich nie zugeben!'],
      collocations: [
        'Muss ich leider zugeben.',
        'Zugegeben, das war mein Fehler.',
      ],
      wordFamily: ['zugeben (to admit)', 'zugegeben (admittedly)', 'geben (to give)'],
      b1ExamTip:
        'Putting „muss ich zugeben“ at the end of a sentence is super conversational and lets you avoid „dass“ word order when talking fast!',
    },
  },
  {
    id: 'chat-chunk-157',
    lemma: 'Das war besser, als ich dachte!',
    spokenText: 'Das war besser, als ich dachte!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Bewertung · Positiv überrascht',
    translation: 'That was better than I thought!',
    highlightTarget: 'besser, als ich dachte',
    phraseDetails: {
      framePattern: 'Das war / Die Nacht war besser, als ich dachte!',
      casePattern: 'Komparativ „besser“ + „als“ + Präteritum „dachte“',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das Ergebnis war deutlich besser als erwartet.',
        textEn: 'The result was significantly better than expected.',
        contextNote: 'Formell / Bericht',
      },
      informalVariant: {
        textDe: 'Ich bin schnell eingeschlafen – die Nacht im Hotel war besser, als ich dachte!',
        textEn: 'I fell asleep fast—the night at the hotel was better than I thought!',
        contextNote: 'Perfekt für positive Überraschungen im Alltag',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Hast du die erste Nacht im Hotel denn gut geschlafen?',
        promptEn: 'Did you sleep well on your first night at the hotel?',
        speakerB: 'Felix',
        replyDe: 'Ja, die Nacht war viel besser, als ich dachte!',
        replyEn: 'Yes, the night was way better than I thought!',
      },
    },
    exampleDe:
      'Lena: Wie war deine erste Nacht im neuen Hotel?\nFelix: Ehrlich gesagt war sie viel besser, als ich dachte!',
    exampleEn:
      'Lena: How was your first night in the new hotel?\nFelix: Honestly it was way better than I thought!',
    anatomy: {
      caseGovernanceNote:
        'Pair comparative „besser“ with „als“ (never „wie“!) and crisp spoken Präteritum „ich dachte“. Also works with „schöner“, „einfacher“, „schneller“.',
      synonyms: ['Das war echt positiv überraschend!', 'Besser als erwartet!'],
      antonyms: ['Das war leider schlechter als gedacht.'],
      collocations: [
        'Das ging schneller, als ich dachte!',
        'Das war einfacher, als ich dachte.',
      ],
      wordFamily: ['besser (better)', 'denken / dachte (to think / thought)', 'erwarten (to expect)'],
      b1ExamTip:
        'Swap the adjective to describe almost any surprise: „schneller / leckerer / lustiger, als ich dachte!“.',
    },
  },
  {
    id: 'chat-chunk-158',
    lemma: 'Am besten nicht so viel nachdenken!',
    spokenText: 'Am besten nicht so viel nachdenken!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Ratschlag · Locker bleiben',
    translation: 'Best not to overthink it!',
    highlightTarget: 'Am besten nicht so viel nachdenken',
    phraseDetails: {
      framePattern: 'Am besten (dann) nicht so viel nachdenken / einfach machen!',
      casePattern: 'Superlativ-Ausdruck „am besten“ + Infinitiv als lockerer Ratschlag',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Es ist am besten, wenn man sich nicht zu viele Gedanken macht.',
        textEn: 'It is best not to worry too much about it.',
        contextNote: 'Formell / Ratschlag',
      },
      informalVariant: {
        textDe: 'Am besten nicht so viel nachdenken – mir hat das zumindest geholfen!',
        textEn: 'Best not to overthink it—at least that helped me!',
        contextNote: 'Entspannter, freundschaftlicher Tipp',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Der Gedanke, allein ins Kino zu gehen, macht mir irgendwie Angst.',
        promptEn: 'The thought of going to the movies alone somehow scares me.',
        speakerB: 'Felix',
        replyDe: 'Am besten nicht so viel nachdenken und einfach mal ausprobieren!',
        replyEn: 'Best not to overthink it and just give it a try!',
      },
    },
    exampleDe:
      'Lena: Ich bin total unsicher, ob ich beim Kurs mitmachen soll.\nFelix: Am besten nicht so viel nachdenken – mir hat das zumindest geholfen!',
    exampleEn:
      'Lena: I’m super unsure whether I should join the class.\nFelix: Best not to overthink it—at least that helped me!',
    anatomy: {
      caseGovernanceNote:
        '„Am besten + Infinitiv“ is a breezy, zero-pressure way to give advice without sounding bossy („Am besten früh losfahren!“, „Am besten eine Jacke mitnehmen!“).',
      synonyms: ['Mach dir nicht so viele Gedanken!', 'Einfach mal machen!'],
      antonyms: ['Überlege dir das ganz genau!'],
      collocations: [
        'Am besten gleich morgen anrufen.',
        'Am besten sagst du kurz Bescheid.',
      ],
      wordFamily: ['am besten (best)', 'nachdenken (to think over)', 'der Gedanke (thought)'],
      b1ExamTip:
        'Notice „nachdenken“ = to think deeply / overthink, whereas „denken“ = to think / hold an opinion.',
    },
  },
  {
    id: 'chat-chunk-159',
    lemma: 'So kommst du gar nicht rüber!',
    spokenText: 'So kommst du gar nicht rüber!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Eindruck · Wie jemand wirkt',
    translation: 'You don’t come across that way at all!',
    highlightTarget: 'kommst du gar nicht rüber',
    phraseDetails: {
      framePattern: 'So kommst du / kommt er (gar nicht / total nett) rüber!',
      casePattern: 'trennbares Verb „rüberkommen“ (= einen bestimmten Eindruck machen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Diesen Eindruck machen Sie überhaupt nicht.',
        textEn: 'You do not give that impression at all.',
        contextNote: 'Formell / Höflich',
      },
      informalVariant: {
        textDe: 'Wie eine kleine Schwester kommst du gar nicht rüber – eher wie die große!',
        textEn: 'You don’t come across like a little sister at all—more like the older one!',
        contextNote: 'Super geläufiges gesprochenes Verb „rüberkommen“',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Ich habe manchmal Angst, dass ich auf neue Leute zu streng wirke.',
        promptEn: 'I sometimes worry that I come across as too strict to new people.',
        speakerB: 'Felix',
        replyDe: 'Quatsch, so kommst du gar nicht rüber – du bist total herzlich!',
        replyEn: 'Nonsense, you don’t come across that way at all—you’re super warm!',
      },
    },
    exampleDe:
      'Lena: Wirke ich wirklich so schüchtern?\nFelix: Nein, so kommst du gar nicht rüber!',
    exampleEn:
      'Lena: Do I really seem that shy?\nFelix: No, you don’t come across that way at all!',
    anatomy: {
      caseGovernanceNote:
        '„Rüberkommen“ (spoken form of „herüberkommen“) means „to come across / make an impression“ AND also literally „to come over to someone’s place“ („Kommst du heute Abend rüber?“).',
      synonyms: ['So wirkst du überhaupt nicht!', 'Den Eindruck machst du gar nicht!'],
      antonyms: ['Genau so kommst du rüber!'],
      collocations: [
        'Er kommt total sympathisch rüber.',
        'Komm heute Abend gern rüber!',
      ],
      wordFamily: ['rüberkommen (to come across / come over)', 'wirken (to seem)'],
      b1ExamTip:
        'High-value spoken verb—especially when talking about first impressions or describing people you met!',
    },
  },
  {
    id: 'chat-chunk-160',
    lemma: 'Das kann ich mir gut vorstellen!',
    spokenText: 'Das kann ich mir gut vorstellen!',
    cefr: 'A2',
    category: 'phrase',
    grammarLabel: 'Empathie · Mitfühlend zustimmen',
    translation: 'I can totally picture that! · I can well imagine!',
    highlightTarget: 'kann ich mir gut vorstellen',
    phraseDetails: {
      framePattern: 'Das kann ich mir gut vorstellen (, dass …)!',
      casePattern: 'sich (Dativ: mir) etwas vorstellen können (= sich im Kopf ausmalen)',
      registerLabel: 'Alltag & Gespräch',
      formalVariant: {
        textDe: 'Das kann ich mir sehr gut vorstellen.',
        textEn: 'I can very well imagine that.',
        contextNote: 'Universell / Höflich & Alltag',
      },
      informalVariant: {
        textDe: 'Nach anderthalb Jahren Pause? Ja, das kann ich mir gut vorstellen, dass man rauskommt!',
        textEn: 'After a year-and-a-half break? Yeah, I can totally imagine getting out of practice!',
        contextNote: 'Warmherzige Bestätigung beim Zuhören',
      },
      miniDialog: {
        speakerA: 'Lena',
        promptDe: 'Nach dem langen Umzug war ich abends so müde, ich bin sofort eingeschlafen.',
        promptEn: 'After the long move I was so tired in the evening I fell asleep immediately.',
        speakerB: 'Felix',
        replyDe: 'Das kann ich mir gut vorstellen! Umziehen ist echt anstrengend.',
        replyEn: 'I can totally imagine! Moving is really exhausting.',
      },
    },
    exampleDe:
      'Lena: Nach anderthalb Jahren ohne Klausuren ist man beim Lernen echt raus.\nFelix: Das kann ich mir gut vorstellen!',
    exampleEn:
      'Lena: After a year and a half without exams you really get out of practice studying.\nFelix: I can totally imagine!',
    anatomy: {
      caseGovernanceNote:
        'Watch the reflexive case of „vorstellen“: „sich (Akk.) vorstellen“ = to introduce oneself („Ich stelle mich vor“), while „sich (Dat.) etwas vorstellen“ = to imagine („Ich stelle MIR das vor“)!',
      synonyms: ['Das glaube ich dir sofort!', 'Absolut nachvollziehbar!'],
      antonyms: ['Das kann ich mir gar nicht vorstellen!'],
      collocations: [
        'Stell dir mal vor! (Imagine that!)',
        'Ich kann mir das gut vorstellen.',
      ],
      wordFamily: ['sich vorstellen (to imagine)', 'die Vorstellung (idea / imagination)'],
      b1ExamTip:
        'Also learn its exciting storytelling twin: „Stell dir mal vor, …!“ (Just imagine, …!).',
    },
  },
];
