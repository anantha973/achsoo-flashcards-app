import type { VocabCard } from './vocabData';

export const RAW_CARDS_DATA: VocabCard[] = [
  {
    "id": "v-ankommen",
    "lemma": "ankommen",
    "spokenText": "ankommen",
    "cefr": "A2",
    "category": "verb",
    "grammarLabel": "Verb · trennbar · unregelmäßig",
    "translation": "to arrive · to depend on",
    "highlightTarget": "angekommen",
    "verbDetails": {
      "praesens": "er/sie/es kommt an",
      "praeteritum": "kam an",
      "perfekt": "ist angekommen",
      "auxiliary": "sein",
      "rektion": "in/am + Dat. (Ort) · auf + Akk. (es kommt an auf)",
      "separablePrefix": "an",
      "verbStem": "kommen"
    },
    "exampleDe": "Wir sind gestern spät am Abend in Magdeburg angekommen.",
    "exampleEn": "We arrived in Magdeburg late yesterday evening.",
    "anatomy": {
      "ipa": "[ˈanˌkɔmən]",
      "conjugationTable": {
        "ich": "ich komme an",
        "du": "du kommst an",
        "erSieEs": "er/sie/es kommt an",
        "wir": "wir kommen an",
        "ihr": "ihr kommt an",
        "sieSie": "sie/Sie kommen an",
        "imperativ": "Komm an! / Kommen Sie an!",
        "konjunktiv2": "käme an (würde ankommen)",
        "praeteritumGrid": {
          "ich": "ich kam an",
          "du": "du kamst an",
          "erSieEs": "er/sie/es kam an",
          "wir": "wir kamen an",
          "ihr": "ihr kamt an",
          "sieSie": "sie/Sie kamen an"
        },
        "perfektGrid": {
          "ich": "ich bin angekommen",
          "du": "du bist angekommen",
          "erSieEs": "er/sie/es ist angekommen",
          "wir": "wir sind angekommen",
          "ihr": "ihr seid angekommen",
          "sieSie": "sie/Sie sind angekommen"
        },
        "konjunktiv2Grid": {
          "ich": "ich käme an",
          "du": "du kämest an",
          "erSieEs": "er/sie/es käme an",
          "wir": "wir kämen an",
          "ihr": "ihr kämet an",
          "sieSie": "sie/Sie kämen an"
        },
        "imperativForms": {
          "du": "Komm gut an!",
          "ihr": "Kommt gut an!",
          "Sie": "Kommen Sie gut an!",
          "wir": "Kommen wir pünktlich an!"
        },
        "futurNote": "Futur I: wird ankommen (werden + Infinitiv am Satzende)"
      },
      "caseGovernanceNote": "1. Literal arrival (\"ankommen in + Dativ\") takes auxiliary \"sein\" (\"ist angekommen\"). 2. Idiomatic \"es kommt auf + Akkusativ an\" (it depends on) takes \"haben\" (\"es ist/hat darauf angekommen\").",
      "synonyms": [
        "eintreffen",
        "erreichen (+ Akk.)",
        "abhängen von (+ Dat.)"
      ],
      "antonyms": [
        "abfahren",
        "abreisen",
        "losfahren"
      ],
      "collocations": [
        "pünktlich am Bahnhof ankommen (+ Dat.)",
        "gut zu Hause ankommen",
        "Es kommt ganz auf das Wetter an (+ Akk.)"
      ],
      "wordFamily": [
        "die Ankunft (arrival)",
        "die Ankunftszeit (arrival time)",
        "der Ankömmling (newcomer)"
      ],
      "b1ExamTip": "When asking or stating arrival location, always use \"Wo?\" (Dativ): \"Wann kommst du AM Bahnhof / IN der Stadt an?\""
    }
  },
  {
    "id": "v-sprechen",
    "lemma": "sprechen",
    "spokenText": "sprechen",
    "cefr": "A1",
    "category": "verb",
    "grammarLabel": "Verb · unregelmäßig (e → i)",
    "translation": "to speak · to talk · to converse",
    "highlightTarget": "gesprochen",
    "verbDetails": {
      "praesens": "er/sie/es spricht",
      "praeteritum": "sprach",
      "perfekt": "hat gesprochen",
      "auxiliary": "haben",
      "rektion": "mit + Dat. · über + Akk."
    },
    "exampleDe": "Wir haben gestern lange über unsere gemeinsamen Pläne gesprochen.",
    "exampleEn": "We spoke at length about our shared plans yesterday.",
    "anatomy": {
      "ipa": "[ˈʃpʁɛçn̩]",
      "conjugationTable": {
        "ich": "ich spreche",
        "du": "du sprichst",
        "erSieEs": "er/sie/es spricht",
        "wir": "wir sprechen",
        "ihr": "ihr sprecht",
        "sieSie": "sie/Sie sprechen",
        "imperativ": "Sprich! / Sprechen Sie!",
        "konjunktiv2": "spräche (würde sprechen)",
        "praeteritumGrid": {
          "ich": "ich sprach",
          "du": "du sprachst",
          "erSieEs": "er/sie/es sprach",
          "wir": "wir sprachen",
          "ihr": "ihr spracht",
          "sieSie": "sie/Sie sprachen"
        },
        "perfektGrid": {
          "ich": "ich habe gesprochen",
          "du": "du hast gesprochen",
          "erSieEs": "er/sie/es hat gesprochen",
          "wir": "wir haben gesprochen",
          "ihr": "ihr habt gesprochen",
          "sieSie": "sie/Sie haben gesprochen"
        },
        "konjunktiv2Grid": {
          "ich": "ich spräche",
          "du": "du sprächest",
          "erSieEs": "er/sie/es spräche",
          "wir": "wir sprächen",
          "ihr": "ihr sprächet",
          "sieSie": "sie/Sie sprächen"
        },
        "imperativForms": {
          "du": "Sprich langsamer!",
          "ihr": "Sprecht deutlich!",
          "Sie": "Sprechen Sie bitte lauter!"
        },
        "futurNote": "Futur I: wird sprechen (werden + Infinitiv)"
      },
      "caseGovernanceNote": "Takes auxiliary \"haben\" in Perfekt. Stem vowel changes e → i in 2nd & 3rd person singular (du sprichst, er spricht) and Imperativ (Sprich!). Prepositional valency: \"mit + Dativ\" (person) and \"über + Akkusativ\" (topic).",
      "synonyms": [
        "reden",
        "sich unterhalten",
        "kommunizieren"
      ],
      "antonyms": [
        "schweigen",
        "zuhören"
      ],
      "collocations": [
        "über ein Thema sprechen (+ Akk.)",
        "mit jemandem unter vier Augen sprechen",
        "fließend Deutsch sprechen"
      ],
      "wordFamily": [
        "das Gespräch (conversation)",
        "der Sprecher / die Sprecherin (speaker)",
        "die Sprache (language)",
        "versprechen (to promise)"
      ],
      "b1ExamTip": "In Goethe/Telc B1 speaking Part 2, open with \"Heute möchte ich über das Thema … sprechen\" (always Akkusativ after über!)."
    }
  },
  {
    "id": "v-bleiben",
    "lemma": "bleiben",
    "spokenText": "bleiben",
    "cefr": "A1",
    "category": "verb",
    "grammarLabel": "Verb · unregelmäßig · Perfekt mit sein",
    "translation": "to stay · to remain",
    "highlightTarget": "geblieben",
    "verbDetails": {
      "praesens": "er/sie/es bleibt",
      "praeteritum": "blieb",
      "perfekt": "ist geblieben",
      "auxiliary": "sein",
      "rektion": "bei + Dat. · in + Dat."
    },
    "exampleDe": "Wegen des Sturms sind wir den ganzen Abend zu Hause geblieben.",
    "exampleEn": "Because of the storm, we stayed at home the entire evening.",
    "anatomy": {
      "ipa": "[ˈblaɪ̯bn̩]",
      "conjugationTable": {
        "ich": "ich bleibe",
        "du": "du bleibst",
        "erSieEs": "er/sie/es bleibt",
        "wir": "wir bleiben",
        "ihr": "ihr bleibt",
        "sieSie": "sie/Sie bleiben",
        "imperativ": "Bleib! / Bleiben Sie!",
        "konjunktiv2": "bliebe",
        "praeteritumGrid": {
          "ich": "ich blieb",
          "du": "du bliebst",
          "erSieEs": "er/sie/es blieb",
          "wir": "wir blieben",
          "ihr": "ihr bliebt",
          "sieSie": "sie/Sie blieben"
        },
        "perfektGrid": {
          "ich": "ich bin geblieben",
          "du": "du bist geblieben",
          "erSieEs": "er/sie/es ist geblieben",
          "wir": "wir sind geblieben",
          "ihr": "ihr seid geblieben",
          "sieSie": "sie/Sie sind geblieben"
        },
        "konjunktiv2Grid": {
          "ich": "ich bliebe",
          "du": "du bliebest",
          "erSieEs": "er/sie/es bliebe",
          "wir": "wir blieben",
          "ihr": "ihr bliebet",
          "sieSie": "sie/Sie blieben"
        },
        "imperativForms": {
          "du": "Bleib ruhig!",
          "ihr": "Bleibt gesund!",
          "Sie": "Bleiben Sie bitte am Apparat!"
        },
        "futurNote": "Futur I: wird bleiben (werden + Infinitiv)"
      },
      "caseGovernanceNote": "Critical exception: Even though \"bleiben\" expresses zero movement (staying in one place), it ALWAYS forms the Perfekt with auxiliary \"sein\" (\"ist geblieben\"), just like \"sein\" and \"werden\".",
      "synonyms": [
        "verweilen",
        "übrig bleiben",
        "beharren"
      ],
      "antonyms": [
        "weggehen",
        "abreisen",
        "verlassen"
      ],
      "collocations": [
        "ruhig bleiben (to stay calm)",
        "in Kontakt bleiben (to stay in touch)",
        "es bleibt dabei (it is settled)"
      ],
      "wordFamily": [
        "der Verbleib (whereabouts)",
        "bleibend (lasting / permanent)",
        "überbleiben (to be left over)"
      ],
      "b1ExamTip": "Close informal letters in B1 writing with \"Lass uns auf jeden Fall in Kontakt bleiben!\" and never write \"habe geblieben\"."
    }
  },
  {
    "id": "v-umziehen",
    "lemma": "umziehen",
    "spokenText": "umziehen",
    "cefr": "A2",
    "category": "verb",
    "grammarLabel": "Verb · trennbar · unregelmäßig",
    "translation": "to move (residence) · to relocate",
    "highlightTarget": "ziehen",
    "verbDetails": {
      "praesens": "er/sie/es zieht um",
      "praeteritum": "zog um",
      "perfekt": "ist umgezogen",
      "auxiliary": "sein",
      "rektion": "nach + Dat. · in + Akk.",
      "separablePrefix": "um",
      "verbStem": "ziehen"
    },
    "exampleDe": "Nächsten Monat ziehen wir in eine hellere Wohnung in Berlin um.",
    "exampleEn": "Next month we are moving into a brighter apartment in Berlin.",
    "anatomy": {
      "ipa": "[ˈʊmˌt͡siːən]",
      "conjugationTable": {
        "ich": "ich ziehe um",
        "du": "du ziehst um",
        "erSieEs": "er/sie/es zieht um",
        "wir": "wir ziehen um",
        "ihr": "ihr zieht um",
        "sieSie": "sie/Sie ziehen um",
        "imperativ": "Zieh um! / Ziehen Sie um!",
        "konjunktiv2": "zöge um",
        "praeteritumGrid": {
          "ich": "ich zog um",
          "du": "du zogst um",
          "erSieEs": "er/sie/es zog um",
          "wir": "wir zogen um",
          "ihr": "ihr zogt um",
          "sieSie": "sie/Sie zogen um"
        },
        "perfektGrid": {
          "ich": "ich bin umgezogen",
          "du": "du bist umgezogen",
          "erSieEs": "er/sie/es ist umgezogen",
          "wir": "wir sind umgezogen",
          "ihr": "ihr seid umgezogen",
          "sieSie": "sie/Sie sind umgezogen"
        },
        "konjunktiv2Grid": {
          "ich": "ich zöge um",
          "du": "du zögest um",
          "erSieEs": "er/sie/es zöge um",
          "wir": "wir zögen um",
          "ihr": "ihr zöget um",
          "sieSie": "sie/Sie zögen um"
        },
        "imperativForms": {
          "du": "Zieh bald um!",
          "ihr": "Zieht zusammen um!",
          "Sie": "Ziehen Sie in Ruhe um!"
        },
        "futurNote": "Futur I: wird umziehen (werden + Infinitiv)"
      },
      "caseGovernanceNote": "Separable prefix \"um-\" goes to the end of main clauses. Auxiliaries: \"ist umgezogen\" (change of location = to move house), whereas reflexive \"hat sich umgezogen\" means to change one’s clothes!",
      "synonyms": [
        "übersiedeln",
        "den Wohnort wechseln"
      ],
      "antonyms": [
        "wohnen bleiben",
        "einziehen / ausziehen"
      ],
      "collocations": [
        "in eine neue Stadt umziehen (+ Akk.)",
        "aufs Land umziehen",
        "sich vor dem Sport umziehen (change clothes)"
      ],
      "wordFamily": [
        "der Umzug, die Umzüge (move / relocation)",
        "der Umzugskarton (moving box)",
        "einziehen / ausziehen (move in / move out)"
      ],
      "b1ExamTip": "Moving house (\"Umzug\") is one of the most frequent B1 letter prompts (inviting friends to a housewarming or asking for help moving)."
    }
  },
  {
    "id": "v-teilnehmen",
    "lemma": "teilnehmen",
    "spokenText": "teilnehmen",
    "cefr": "A2",
    "category": "verb",
    "grammarLabel": "Verb · trennbar · unregelmäßig",
    "translation": "to participate · to take part · to attend",
    "highlightTarget": "teilgenommen",
    "verbDetails": {
      "praesens": "er/sie/es nimmt teil",
      "praeteritum": "nahm teil",
      "perfekt": "hat teilgenommen",
      "auxiliary": "haben",
      "rektion": "an + Dativ (teilnehmen an)",
      "separablePrefix": "teil",
      "verbStem": "nehmen"
    },
    "exampleDe": "Über dreißig Studierende haben aktiv an dem Sprachseminar teilgenommen.",
    "exampleEn": "More than thirty students actively participated in the language seminar.",
    "anatomy": {
      "ipa": "[ˈtaɪ̯lˌneːmən]",
      "conjugationTable": {
        "ich": "ich nehme teil",
        "du": "du nimmst teil",
        "erSieEs": "er/sie/es nimmt teil",
        "wir": "wir nehmen teil",
        "ihr": "ihr nehmt teil",
        "sieSie": "sie/Sie nehmen teil",
        "imperativ": "Nimm teil! / Nehmen Sie teil!",
        "konjunktiv2": "nähme teil",
        "praeteritumGrid": {
          "ich": "ich nahm teil",
          "du": "du nahmst teil",
          "erSieEs": "er/sie/es nahm teil",
          "wir": "wir nahmen teil",
          "ihr": "ihr nahmt teil",
          "sieSie": "sie/Sie nahmen teil"
        },
        "perfektGrid": {
          "ich": "ich habe teilgenommen",
          "du": "du hast teilgenommen",
          "erSieEs": "er/sie/es hat teilgenommen",
          "wir": "wir haben teilgenommen",
          "ihr": "ihr habt teilgenommen",
          "sieSie": "sie/Sie haben teilgenommen"
        },
        "konjunktiv2Grid": {
          "ich": "ich nähme teil",
          "du": "du nähmest teil",
          "erSieEs": "er/sie/es nähme teil",
          "wir": "wir nähmen teil",
          "ihr": "ihr nähmet teil",
          "sieSie": "sie/Sie nähmen teil"
        },
        "imperativForms": {
          "du": "Nimm am Kurs teil!",
          "ihr": "Nehmt aktiv teil!",
          "Sie": "Nehmen Sie gerne teil!"
        },
        "futurNote": "Futur I: wird teilnehmen (werden + Infinitiv)"
      },
      "caseGovernanceNote": "Separable verb (\"nimmt … teil\", \"teilgenommen\"). Always governs the preposition \"an + Dativ\" (Wo? → an dem Kurs / an der Besprechung teilnehmen).",
      "synonyms": [
        "mitmachen bei (+ Dat.)",
        "sich beteiligen an (+ Dat.)",
        "besuchen"
      ],
      "antonyms": [
        "fernbleiben",
        "absagen",
        "verzichten auf (+ Akk.)"
      ],
      "collocations": [
        "an einem Sprachkurs teilnehmen (+ Dat.)",
        "an einer Veranstaltung teilnehmen",
        "erfolgreich an der Prüfung teilnehmen"
      ],
      "wordFamily": [
        "die Teilnahme (participation)",
        "der Teilnehmer / die Teilnehmerin (participant)",
        "die Teilnahmebestätigung (certificate of attendance)"
      ],
      "b1ExamTip": "Essential for formal B1 emails: \"Leider kann ich morgen nicht an dem Seminar teilnehmen, weil ich einen Arzttermin habe.\""
    }
  },
  {
    "id": "v-entscheiden",
    "lemma": "entscheiden",
    "spokenText": "entscheiden",
    "cefr": "B1",
    "category": "verb",
    "grammarLabel": "Verb · untrennbar · unregelmäßig",
    "translation": "to decide · to make up one’s mind",
    "highlightTarget": "entschieden",
    "verbDetails": {
      "praesens": "er/sie/es entscheidet",
      "praeteritum": "entschied",
      "perfekt": "hat entschieden",
      "auxiliary": "haben",
      "rektion": "sich entscheiden für + Akk. / gegen + Akk."
    },
    "exampleDe": "Nach langem Überlegen hat sie sich für das Stipendium in Wien entschieden.",
    "exampleEn": "After long consideration, she decided in favor of the scholarship in Vienna.",
    "anatomy": {
      "ipa": "[ɛntˈʃaɪ̯dn̩]",
      "conjugationTable": {
        "ich": "ich entscheide (mich)",
        "du": "du entscheidest (dich)",
        "erSieEs": "er/sie/es entscheidet (sich)",
        "wir": "wir entscheiden (uns)",
        "ihr": "ihr entscheidet (euch)",
        "sieSie": "sie/Sie entscheiden (sich)",
        "imperativ": "Entscheide dich! / Entscheiden Sie sich!",
        "konjunktiv2": "entschiede",
        "praeteritumGrid": {
          "ich": "ich entschied (mich)",
          "du": "du entschiedst (dich)",
          "erSieEs": "er/sie/es entschied (sich)",
          "wir": "wir entschieden (uns)",
          "ihr": "ihr entschiedet (euch)",
          "sieSie": "sie/Sie entschieden (sich)"
        },
        "perfektGrid": {
          "ich": "ich habe (mich) entschieden",
          "du": "du hast (dich) entschieden",
          "erSieEs": "er/sie/es hat (sich) entschieden",
          "wir": "wir haben (uns) entschieden",
          "ihr": "ihr habt (euch) entschieden",
          "sieSie": "sie/Sie haben (sich) entschieden"
        },
        "konjunktiv2Grid": {
          "ich": "ich entschiede (mich)",
          "du": "du entschiedest (dich)",
          "erSieEs": "er/sie/es entschiede (sich)",
          "wir": "wir entschieden (uns)",
          "ihr": "ihr entschiedet (euch)",
          "sieSie": "sie/Sie entschieden (sich)"
        },
        "imperativForms": {
          "du": "Entscheide dich jetzt!",
          "ihr": "Entscheidet euch gemeinsam!",
          "Sie": "Entscheiden Sie sich in Ruhe!"
        },
        "futurNote": "Futur I: wird (sich) entscheiden"
      },
      "caseGovernanceNote": "Inseparable prefix \"ent-\" (no \"ge-\" in Perfekt). Used reflexively (\"sich entscheiden für + Akkusativ\" or \"gegen + Akkusativ\") when choosing an option, or transitively (\"über + Akkusativ entscheiden\").",
      "synonyms": [
        "beschließen",
        "wählen",
        "festlegen"
      ],
      "antonyms": [
        "zögern",
        "schwanken",
        "offenlassen"
      ],
      "collocations": [
        "sich für ein Angebot entscheiden (+ Akk.)",
        "frei entscheiden können",
        "eine wichtige Frage entscheiden"
      ],
      "wordFamily": [
        "die Entscheidung, -en (decision)",
        "entscheidend (decisive / crucial)",
        "unentschieden (undecided / tied)"
      ],
      "b1ExamTip": "Remember the vowel shift ei → ie in Präteritum and Perfekt (\"entschied\", \"hat entschieden\")—never write \"entscheidet\" for past tense."
    }
  },
  {
    "id": "n-entscheidung",
    "lemma": "die Entscheidung",
    "spokenText": "die Entscheidung, die Entscheidungen",
    "cefr": "A2",
    "category": "noun",
    "grammarLabel": "Nomen · Feminin",
    "translation": "decision · resolution · choice",
    "highlightTarget": "Entscheidung",
    "nounDetails": {
      "gender": "die",
      "genderLabel": "Feminin",
      "plural": "die Entscheidungen",
      "pluralSuffix": "-en",
      "genitive": "der Entscheidung",
      "genusRule": "-ung, -heit, -keit, -schaft → immer feminin (die)"
    },
    "exampleDe": "Eine kluge Entscheidung erfordert sowohl Geduld als auch verlässliche Informationen.",
    "exampleEn": "A wise decision requires both patience and reliable information.",
    "anatomy": {
      "ipa": "[ɛntˈʃaɪ̯dʊŋ]",
      "nounDeclension": {
        "nominativ": "die Entscheidung · die Entscheidungen",
        "akkusativ": "die Entscheidung · die Entscheidungen",
        "dativ": "der Entscheidung · den Entscheidungen",
        "genitiv": "der Entscheidung · der Entscheidungen",
        "singular": {
          "nom": "die Entscheidung",
          "akk": "die Entscheidung",
          "dat": "der Entscheidung",
          "gen": "der Entscheidung"
        },
        "plural": {
          "nom": "die Entscheidungen",
          "akk": "die Entscheidungen",
          "dat": "den Entscheidungen",
          "gen": "der Entscheidungen"
        }
      },
      "caseGovernanceNote": "100% Rule: Every German noun ending in \"-ung\" is FEMININ (\"die\") and forms its plural with \"-ungen\".",
      "synonyms": [
        "der Beschluss",
        "die Wahl",
        "das Urteil"
      ],
      "antonyms": [
        "die Unentschlossenheit",
        "das Zögern"
      ],
      "collocations": [
        "eine Entscheidung treffen (to make a decision — never \"machen\"!)",
        "vor einer schweren Entscheidung stehen",
        "eine Entscheidung rückgängig machen"
      ],
      "wordFamily": [
        "entscheiden (to decide)",
        "entscheidend (decisive)",
        "entscheidungsfreudig (quick to decide)"
      ],
      "b1ExamTip": "Golden B1 rule: In German you do NOT \"make\" (*machen*) a decision—you \"meet\" (*treffen*) a decision: \"eine Entscheidung treffen\"!"
    }
  },
  {
    "id": "n-bahnhof",
    "lemma": "der Bahnhof",
    "spokenText": "der Bahnhof, die Bahnhöfe",
    "cefr": "A1",
    "category": "noun",
    "grammarLabel": "Nomen · Maskulin",
    "translation": "train station · railway station",
    "highlightTarget": "Hauptbahnhof",
    "nounDetails": {
      "gender": "der",
      "genderLabel": "Maskulin",
      "plural": "die Bahnhöfe",
      "pluralSuffix": "¨-e",
      "genitive": "des Bahnhofs",
      "genusRule": "Kompositum: die Bahn + der Hof → das Grundwort (der Hof) bestimmt das Genus"
    },
    "exampleDe": "Der Schnellzug nach München fährt pünktlich von Gleis vier am Hauptbahnhof ab.",
    "exampleEn": "The express train to Munich departs on time from platform four at the main station.",
    "anatomy": {
      "ipa": "[ˈbaːnˌhoːf]",
      "nounDeclension": {
        "nominativ": "der Bahnhof · die Bahnhöfe",
        "akkusativ": "den Bahnhof · die Bahnhöfe",
        "dativ": "dem Bahnhof · den Bahnhöfen",
        "genitiv": "des Bahnhofs · der Bahnhöfe",
        "singular": {
          "nom": "der Bahnhof",
          "akk": "den Bahnhof",
          "dat": "dem Bahnhof",
          "gen": "des Bahnhofs"
        },
        "plural": {
          "nom": "die Bahnhöfe",
          "akk": "die Bahnhöfe",
          "dat": "den Bahnhöfen",
          "gen": "der Bahnhöfe"
        }
      },
      "caseGovernanceNote": "Masculine compound noun (die Bahn + der Hof → gender determined by the final element \"der Hof\"). Takes umlaut in plural (\"die Bahnhöfe\"). Note preposition: \"am Bahnhof\" (at the station) vs \"zum Bahnhof\" (to the station).",
      "synonyms": [
        "die Bahnstation",
        "der Haltepunkt"
      ],
      "antonyms": [
        "der Flughafen (airport)",
        "die Bushaltestelle (bus stop)"
      ],
      "collocations": [
        "jemanden vom Bahnhof abholen",
        "am Hauptbahnhof umsteigen",
        "Ich verstehe nur Bahnhof! (idiom: It’s all Greek to me)"
      ],
      "wordFamily": [
        "der Hauptbahnhof (main station)",
        "der Busbahnhof (bus terminal)",
        "die Bahnhofshalle (station concourse)"
      ],
      "b1ExamTip": "Remember: \"jemanden VOM (von dem) Bahnhof abholen\" and \"ZUM (zu dem) Bahnhof bringen\" are classic travel dialogue phrases."
    }
  },
  {
    "id": "n-gespraech",
    "lemma": "das Gespräch",
    "spokenText": "das Gespräch, die Gespräche",
    "cefr": "A1",
    "category": "noun",
    "grammarLabel": "Nomen · Neutrum",
    "translation": "conversation · talk · interview",
    "highlightTarget": "Gespräch",
    "nounDetails": {
      "gender": "das",
      "genderLabel": "Neutrum",
      "plural": "die Gespräche",
      "pluralSuffix": "-e",
      "genitive": "des Gesprächs",
      "genusRule": "Präfix Ge- (das Gespräch, das Gebäude, das Gedächtnis) → fast immer neutrum (das)"
    },
    "exampleDe": "Ein offenes Gespräch hilft oft dabei, Missverständnisse schnell zu klären.",
    "exampleEn": "An open conversation often helps to clear up misunderstandings quickly.",
    "anatomy": {
      "ipa": "[ɡəˈʃpʁɛːç]",
      "nounDeclension": {
        "nominativ": "das Gespräch · die Gespräche",
        "akkusativ": "das Gespräch · die Gespräche",
        "dativ": "dem Gespräch · den Gesprächen",
        "genitiv": "des Gesprächs · der Gespräche",
        "singular": {
          "nom": "das Gespräch",
          "akk": "das Gespräch",
          "dat": "dem Gespräch",
          "gen": "des Gesprächs"
        },
        "plural": {
          "nom": "die Gespräche",
          "akk": "die Gespräche",
          "dat": "den Gesprächen",
          "gen": "der Gespräche"
        }
      },
      "caseGovernanceNote": "Collective neuter noun starting with prefix \"Ge-\" (almost all nouns starting with Ge- like das Gespräch, das Gebäude, das Gedächtnis are NEUTRUM \"das\").",
      "synonyms": [
        "die Unterhaltung",
        "der Dialog",
        "die Besprechung"
      ],
      "antonyms": [
        "das Schweigen",
        "die Funkstille"
      ],
      "collocations": [
        "ein Gespräch mit jemandem führen (to hold a conversation)",
        "ins Gespräch kommen (to strike up a conversation)",
        "das Vorstellungsgespräch (job interview)"
      ],
      "wordFamily": [
        "sprechen (to speak)",
        "der Gesprächspartner (interlocutor)",
        "gesprächig (talkative)"
      ],
      "b1ExamTip": "Use the Nomen-Verb-Verbindung \"ein Gespräch führen\" instead of simple \"sprechen\" to elevate your B1 writing score."
    }
  },
  {
    "id": "n-gedaechtnis",
    "lemma": "das Gedächtnis",
    "spokenText": "das Gedächtnis, die Gedächtnisse",
    "cefr": "B1",
    "category": "noun",
    "grammarLabel": "Nomen · Neutrum",
    "translation": "memory · remembrance · recollection",
    "highlightTarget": "Gedächtnis",
    "nounDetails": {
      "gender": "das",
      "genderLabel": "Neutrum",
      "plural": "die Gedächtnisse",
      "pluralSuffix": "-nisse",
      "genitive": "des Gedächtnisses",
      "genusRule": "Endung -nis & Präfix Ge- → meist neutrum (das); verdoppelt s im Plural (-nisse)"
    },
    "exampleDe": "Regelmäßiges Wiederholen im richtigen Abstand stärkt das langfristige Gedächtnis.",
    "exampleEn": "Regular repetition at the right interval strengthens long-term memory.",
    "anatomy": {
      "ipa": "[ɡəˈdɛçtnɪs]",
      "nounDeclension": {
        "nominativ": "das Gedächtnis · die Gedächtnisse",
        "akkusativ": "das Gedächtnis · die Gedächtnisse",
        "dativ": "dem Gedächtnis · den Gedächtnissen",
        "genitiv": "des Gedächtnisses · der Gedächtnisse",
        "singular": {
          "nom": "das Gedächtnis",
          "akk": "das Gedächtnis",
          "dat": "dem Gedächtnis",
          "gen": "des Gedächtnisses"
        },
        "plural": {
          "nom": "die Gedächtnisse",
          "akk": "die Gedächtnisse",
          "dat": "den Gedächtnissen",
          "gen": "der Gedächtnisse"
        }
      },
      "caseGovernanceNote": "Neuter noun with prefix \"Ge-\" and suffix \"-nis\". Nouns ending in \"-nis\" double the \"s\" in the Genitive singular (\"des Gedächtnisses\") and Plural (\"die Gedächtnisse\").",
      "synonyms": [
        "das Erinnerungsvermögen",
        "die Erinnerung"
      ],
      "antonyms": [
        "das Vergessen",
        "der Gedächtnisverlust"
      ],
      "collocations": [
        "ein gutes / schlechtes Gedächtnis haben",
        "etwas im Gedächtnis behalten (to keep in mind)",
        "das Kurzzeit- / Langzeitgedächtnis"
      ],
      "wordFamily": [
        "denken (to think) / gedenken (to commemorate)",
        "das Gedächtnistraining (memory training)",
        "die Gedächtnislücke (memory lapse)"
      ],
      "b1ExamTip": "Distinguish \"das Gedächtnis\" (the mental faculty/capacity to remember) from \"die Erinnerung\" (a specific memory or souvenir)."
    }
  },
  {
    "id": "n-fortschritt",
    "lemma": "der Fortschritt",
    "spokenText": "der Fortschritt, die Fortschritte",
    "cefr": "B1",
    "category": "noun",
    "grammarLabel": "Nomen · Maskulin",
    "translation": "progress · advancement · step forward",
    "highlightTarget": "Fortschritte",
    "nounDetails": {
      "gender": "der",
      "genderLabel": "Maskulin",
      "plural": "die Fortschritte",
      "pluralSuffix": "-e",
      "genitive": "des Fortschritts",
      "genusRule": "Abgeleitet vom Verb schreiten (der Schritt) → maskulin (der)"
    },
    "exampleDe": "Schon nach wenigen Wochen täglichen Übens merkt man deutliche Fortschritte.",
    "exampleEn": "Even after just a few weeks of daily practice, one notices clear progress.",
    "anatomy": {
      "ipa": "[ˈfɔʁtˌʃʁɪt]",
      "nounDeclension": {
        "nominativ": "der Fortschritt · die Fortschritte",
        "akkusativ": "den Fortschritt · die Fortschritte",
        "dativ": "dem Fortschritt · den Fortschritten",
        "genitiv": "des Fortschritts · der Fortschritte",
        "singular": {
          "nom": "der Fortschritt",
          "akk": "den Fortschritt",
          "dat": "dem Fortschritt",
          "gen": "des Fortschritts"
        },
        "plural": {
          "nom": "die Fortschritte",
          "akk": "die Fortschritte",
          "dat": "den Fortschritten",
          "gen": "der Fortschritte"
        }
      },
      "caseGovernanceNote": "Masculine noun (from \"der Schritt\" = step). When talking about personal learning progress, German usually uses the PLURAL: \"große Fortschritte machen\".",
      "synonyms": [
        "die Weiterentwicklung",
        "der Vormarsch",
        "die Verbesserung"
      ],
      "antonyms": [
        "der Rückschritt",
        "der Stillstand",
        "die Stagnation"
      ],
      "collocations": [
        "große Fortschritte beim Deutschlernen machen",
        "der technische / wissenschaftliche Fortschritt",
        "Fortschritte erzielen"
      ],
      "wordFamily": [
        "fortschrittlich (progressive / advanced)",
        "der Schritt (step)",
        "fortschreiten (to progress / advance)"
      ],
      "b1ExamTip": "Always use the plural in personal contexts: \"Ich habe im letzten Monat große Fortschritte gemacht.\""
    }
  },
  {
    "id": "n-zusammenhang",
    "lemma": "der Zusammenhang",
    "spokenText": "der Zusammenhang, die Zusammenhänge",
    "cefr": "B1",
    "category": "noun",
    "grammarLabel": "Nomen · Maskulin",
    "translation": "context · connection · correlation",
    "highlightTarget": "Zusammenhang",
    "nounDetails": {
      "gender": "der",
      "genderLabel": "Maskulin",
      "plural": "die Zusammenhänge",
      "pluralSuffix": "¨-e",
      "genitive": "des Zusammenhangs",
      "genusRule": "Verb-Stamm ohne Endung (hängen → der Hang / der Zusammenhang) → maskulin (der)"
    },
    "exampleDe": "Neue Wörter behält man am besten, wenn man sie im ganzen Zusammenhang lernt.",
    "exampleEn": "One retains new words best when learning them in full context.",
    "anatomy": {
      "ipa": "[t͡suˈzamənhaŋ]",
      "nounDeclension": {
        "nominativ": "der Zusammenhang · die Zusammenhänge",
        "akkusativ": "den Zusammenhang · die Zusammenhänge",
        "dativ": "dem Zusammenhang · den Zusammenhängen",
        "genitiv": "des Zusammenhangs · der Zusammenhänge",
        "singular": {
          "nom": "der Zusammenhang",
          "akk": "den Zusammenhang",
          "dat": "dem Zusammenhang",
          "gen": "des Zusammenhangs"
        },
        "plural": {
          "nom": "die Zusammenhänge",
          "akk": "die Zusammenhänge",
          "dat": "den Zusammenhängen",
          "gen": "der Zusammenhänge"
        }
      },
      "caseGovernanceNote": "Masculine noun derived from \"zusammenhängen\" (to be connected). Plural takes an umlaut: \"die Zusammenhänge\".",
      "synonyms": [
        "der Kontext",
        "die Verbindung",
        "die Beziehung"
      ],
      "antonyms": [
        "die Zusammenhanglosigkeit",
        "die Isolation"
      ],
      "collocations": [
        "in diesem Zusammenhang (in this context)",
        "im Zusammenhang mit (+ Dativ)",
        "aus dem Zusammenhang reißen (to take out of context)"
      ],
      "wordFamily": [
        "zusammenhängen mit (+ Dat.) (to be connected with)",
        "zusammenhängend (coherent / connected)",
        "unabhängig (independent)"
      ],
      "b1ExamTip": "Start a paragraph in your B1 opinion essay with \"In diesem Zusammenhang möchte ich auch erwähnen, dass …\" for seamless cohesion."
    }
  },
  {
    "id": "a-notwendig",
    "lemma": "notwendig",
    "spokenText": "notwendig, notwendiger, am notwendigsten",
    "cefr": "B1",
    "category": "adj",
    "grammarLabel": "Adjektiv · regelmäßig",
    "translation": "necessary · essential · required",
    "highlightTarget": "notwendig",
    "adjDetails": {
      "positiv": "notwendig",
      "komparativ": "notwendiger",
      "superlativ": "am notwendigsten",
      "opposite": "überflüssig · unnötig",
      "rektion": "für + Akk. (notwendig für den Beruf)",
      "declensionExamples": {
        "weak": {
          "nom": "der notwendige Schritt",
          "akk": "den notwendigen Schritt",
          "dat": "dem notwendigen Schritt",
          "gen": "des notwendigen Schritts"
        },
        "mixed": {
          "nom": "ein notwendiger Schritt",
          "akk": "einen notwendigen Schritt",
          "dat": "einem notwendigen Schritt",
          "gen": "eines notwendigen Schritts"
        },
        "strong": {
          "nom": "notwendiger Schritt (Pl: notwendige Schritte)",
          "akk": "notwendigen Schritt (Pl: notwendige Schritte)",
          "dat": "notwendigem Schritt (Pl: notwendigen Schritten)",
          "gen": "notwendigen Schritts (Pl: notwendiger Schritte)"
        }
      }
    },
    "exampleDe": "Für die Anmeldung zum B1-Prüfungstermin ist ein gültiger Ausweis unbedingt notwendig.",
    "exampleEn": "A valid ID is strictly necessary to register for the B1 exam date.",
    "anatomy": {
      "ipa": "[ˈnoːtˌvɛndɪç]",
      "caseGovernanceNote": "Adjectives ending in \"-ig\" are pronounced [-ɪç] in standard German, and insert \"-st-\" in the Superlativ only when ending in -d/-t/-s/-z (here regular: \"am notwendigsten\"). Often paired with \"für + Akkusativ\" or an infinitive clause with \"Es ist notwendig, … zu + Inf.\".",
      "synonyms": [
        "erforderlich",
        "nötig",
        "unerlässlich",
        "unverzichtbar"
      ],
      "antonyms": [
        "überflüssig",
        "unnötig",
        "entbehrlich"
      ],
      "collocations": [
        "unbedingt notwendig sein",
        "alle notwendigen Unterlagen mitbringen",
        "falls notwendig (if necessary)"
      ],
      "wordFamily": [
        "die Notwendigkeit (necessity)",
        "die Not (need / emergency)",
        "notwendigerweise (necessarily)"
      ],
      "b1ExamTip": "In formal B1 inquiry emails, ask: \"Welche Unterlagen sind für die Anmeldung notwendig?\""
    }
  },
  {
    "id": "a-verantwortlich",
    "lemma": "verantwortlich",
    "spokenText": "verantwortlich",
    "cefr": "B1",
    "category": "adj",
    "grammarLabel": "Adjektiv · Rektion mit für + Akk.",
    "translation": "responsible · accountable · in charge",
    "highlightTarget": "verantwortlich",
    "adjDetails": {
      "positiv": "verantwortlich",
      "komparativ": "verantwortlicher",
      "superlativ": "am verantwortlichsten",
      "opposite": "unverantwortlich · unbeteiligt",
      "rektion": "für + Akkusativ (verantwortlich sein für)",
      "declensionExamples": {
        "weak": {
          "nom": "die verantwortliche Leiterin",
          "akk": "die verantwortliche Leiterin",
          "dat": "der verantwortlichen Leiterin",
          "gen": "der verantwortlichen Leiterin"
        },
        "mixed": {
          "nom": "eine verantwortliche Leiterin",
          "akk": "eine verantwortliche Leiterin",
          "dat": "einer verantwortlichen Leiterin",
          "gen": "einer verantwortlichen Leiterin"
        },
        "strong": {
          "nom": "verantwortliche Mitarbeitende (Pl.)",
          "akk": "verantwortliche Mitarbeitende (Pl.)",
          "dat": "verantwortlichen Mitarbeitenden (Pl.)",
          "gen": "verantwortlicher Mitarbeitender (Pl.)"
        }
      }
    },
    "exampleDe": "In unserem Team ist jeder Einzelne für die Qualität seiner Arbeit selbst verantwortlich.",
    "exampleEn": "In our team, each individual is personally responsible for the quality of their work.",
    "anatomy": {
      "ipa": "[fɛɐ̯ˈʔantvɔʁtlɪç]",
      "caseGovernanceNote": "Fixed adjective valency: \"verantwortlich sein FÜR + Akkusativ\" (the task/outcome) and \"verantwortlich gegenüber + Dativ\" (the authority/person).",
      "synonyms": [
        "zuständig für (+ Akk.)",
        "haftbar",
        "federführend"
      ],
      "antonyms": [
        "unverantwortlich",
        "verantwortungslos",
        "unzuständig"
      ],
      "collocations": [
        "für ein Projekt verantwortlich sein (+ Akk.)",
        "jemanden für einen Fehler verantwortlich machen",
        "verantwortlich handeln"
      ],
      "wordFamily": [
        "die Verantwortung (responsibility)",
        "verantworten (to answer for / justify)",
        "verantwortungsbewusst (conscientious)"
      ],
      "b1ExamTip": "Pair with \"zuständig für + Akk.\" when describing your workplace duties in B1 Speaking Part 1 or job emails."
    }
  },
  {
    "id": "a-abhaengig",
    "lemma": "abhängig",
    "spokenText": "abhängig, abhängiger, am abhängigsten",
    "cefr": "B1",
    "category": "adj",
    "grammarLabel": "Adjektiv · Rektion mit von + Dat.",
    "translation": "dependent (on) · contingent (upon)",
    "highlightTarget": "abhängig",
    "adjDetails": {
      "positiv": "abhängig",
      "komparativ": "abhängiger",
      "superlativ": "am abhängigsten",
      "opposite": "unabhängig · selbstständig",
      "rektion": "von + Dativ (abhängig von)",
      "declensionExamples": {
        "weak": {
          "nom": "das abhängige Kind",
          "akk": "das abhängige Kind",
          "dat": "dem abhängigen Kind",
          "gen": "des abhängigen Kindes"
        },
        "mixed": {
          "nom": "ein abhängiges Kind",
          "akk": "ein abhängiges Kind",
          "dat": "einem abhängigen Kind",
          "gen": "eines abhängigen Kindes"
        },
        "strong": {
          "nom": "abhängiges Einkommen",
          "akk": "abhängiges Einkommen",
          "dat": "abhängigem Einkommen",
          "gen": "abhängigen Einkommens"
        }
      }
    },
    "exampleDe": "Der genaue Reisetermin ist noch von der Zustimmung aller Teilnehmenden abhängig.",
    "exampleEn": "The exact travel date is still dependent on the approval of all participants.",
    "anatomy": {
      "ipa": "[ˈapˌhɛŋɪç]",
      "caseGovernanceNote": "Always governs the preposition \"von + Dativ\" (\"abhängig sein von + Dativ\"). Its antonym \"unabhängig\" also takes \"von + Dativ\".",
      "synonyms": [
        "angewiesen auf (+ Akk.)",
        "bedingt durch (+ Akk.)"
      ],
      "antonyms": [
        "unabhängig von (+ Dat.)",
        "selbstständig",
        "autonom"
      ],
      "collocations": [
        "vom Wetter abhängig sein (+ Dat.)",
        "finanziell unabhängig von den Eltern sein",
        "Das hängt ganz davon ab, ob …"
      ],
      "wordFamily": [
        "abhängen von (+ Dat.) (to depend on)",
        "die Abhängigkeit (dependence)",
        "unabhängig (independent)"
      ],
      "b1ExamTip": "In B1 discussions on youth or work, contrast \"finanziell abhängig von den Eltern\" with \"finanziell unabhängig sein\"."
    }
  },
  {
    "id": "a-erfolgreich",
    "lemma": "erfolgreich",
    "spokenText": "erfolgreich, erfolgreicher, am erfolgreichsten",
    "cefr": "A2",
    "category": "adj",
    "grammarLabel": "Adjektiv · regelmäßig",
    "translation": "successful · thriving · effective",
    "highlightTarget": "erfolgreich",
    "adjDetails": {
      "positiv": "erfolgreich",
      "komparativ": "erfolgreicher",
      "superlativ": "am erfolgreichsten",
      "opposite": "erfolglos · vergeblich",
      "rektion": "bei / in + Dativ",
      "declensionExamples": {
        "weak": {
          "nom": "das erfolgreiche Projekt",
          "akk": "das erfolgreiche Projekt",
          "dat": "dem erfolgreichen Projekt",
          "gen": "des erfolgreichen Projekts"
        },
        "mixed": {
          "nom": "ein erfolgreiches Projekt",
          "akk": "ein erfolgreiches Projekt",
          "dat": "einem erfolgreichen Projekt",
          "gen": "eines erfolgreichen Projekts"
        },
        "strong": {
          "nom": "erfolgreiche Zusammenarbeit",
          "akk": "erfolgreiche Zusammenarbeit",
          "dat": "erfolgreicher Zusammenarbeit",
          "gen": "erfolgreicher Zusammenarbeit"
        }
      }
    },
    "exampleDe": "Dank der guten Vorbereitung haben alle Kursteilnehmenden die Prüfung erfolgreich bestanden.",
    "exampleEn": "Thanks to good preparation, all course participants passed the exam successfully.",
    "anatomy": {
      "ipa": "[ɛɐ̯ˈfɔlkˌʁaɪ̯ç]",
      "caseGovernanceNote": "Formed with suffix \"-reich\" (rich in success → der Erfolg + reich). Its direct opposite is formed with \"-los\" (\"erfolglos\"). Used both as an predicative/adverbial (\"erfolgreich abschließen\") and attributive adjective (\"ein erfolgreiches Jahr\").",
      "synonyms": [
        "gelungen",
        "wirksam",
        "fruchtbar"
      ],
      "antonyms": [
        "erfolglos",
        "vergeblich",
        "gescheitert"
      ],
      "collocations": [
        "eine Prüfung erfolgreich bestehen",
        "sich erfolgreich um eine Stelle bewerben",
        "ein erfolgreiches Unternehmen führen"
      ],
      "wordFamily": [
        "der Erfolg, -e (success)",
        "erfolglos (unsuccessful)",
        "erfolgen (to take place / ensue)"
      ],
      "b1ExamTip": "Remember: Suffixes \"-reich\" / \"-voll\" build positive adjectives, while \"-los\" / \"-arm\" build their opposites (erfolgreich ↔ erfolglos)."
    }
  },
  {
    "id": "p-zwischen",
    "lemma": "zwischen",
    "spokenText": "zwischen",
    "cefr": "A1",
    "category": "preposition",
    "grammarLabel": "Präposition · Wechselpräposition",
    "translation": "between · among",
    "highlightTarget": "zwischen dem",
    "prepDetails": {
      "governedCase": "Dativ (Wo? Ort) · Akkusativ (Wohin? Richtung)",
      "caseShort": "Dat / Akk",
      "questionPrompt": "Wo? → + Dativ  |  Wohin? → + Akkusativ",
      "isWechsel": true,
      "wechselDetails": {
        "woQuestion": "Wo? (Ruhe / Position)",
        "woRule": "zwischen + Dativ (dem, der, dem, den + -n)",
        "woExampleDe": "Die kleine Buchhandlung liegt direkt zwischen dem Café und der alten Bibliothek.",
        "woExampleEn": "The small bookstore is located right between the café and the old library.",
        "wohinQuestion": "Wohin? (Bewegung / Richtung)",
        "wohinRule": "zwischen + Akkusativ (den, die, das, die)",
        "wohinExampleDe": "Wir stellen den runden Lesetisch zwischen das Sofa und das große Fenster.",
        "wohinExampleEn": "We are placing the round reading table between the sofa and the large window."
      },
      "collocations": [
        "zwischen den Zeilen lesen (+ Dat.)",
        "sich zwischen zwei Stühle setzen (+ Akk.)",
        "der Unterschied zwischen (+ Dat.)"
      ]
    },
    "exampleDe": "Die kleine Buchhandlung liegt direkt zwischen dem Café und der alten Bibliothek.",
    "exampleEn": "The small bookstore is located right between the café and the old library.",
    "anatomy": {
      "ipa": "[ˈt͡svɪʃn̩]",
      "caseGovernanceNote": "Two-way preposition (Wechselpräposition): Use DATIV for static location or time (\"Wo? zwischen dem Café und der Bank\") and AKKUSATIV for directed movement (\"Wohin? Ich stelle den Tisch zwischen das Sofa und den Sessel\").",
      "synonyms": [
        "inmitten (+ Gen.)",
        "unter (+ Dat.)"
      ],
      "antonyms": [
        "außerhalb (+ Gen.)",
        "neben (+ Dat./Akk.)"
      ],
      "collocations": [
        "zwischen den Zeilen lesen (+ Dat.)",
        "der Unterschied zwischen (+ Dat.)",
        "in der Zwischenzeit (in the meantime)"
      ],
      "wordFamily": [
        "inzwischen (meanwhile)",
        "die Zwischenzeit (meantime)",
        "das Zwischenergebnis (interim result)"
      ],
      "b1ExamTip": "When comparing two things (\"der Unterschied zwischen + Dativ\"), always use Dativ even if an abstract verb follows!"
    }
  },
  {
    "id": "p-gegenueber",
    "lemma": "gegenüber",
    "spokenText": "gegenüber",
    "cefr": "A2",
    "category": "preposition",
    "grammarLabel": "Präposition · Dativ",
    "translation": "across from · opposite · towards",
    "highlightTarget": "Gegenüber dem",
    "prepDetails": {
      "governedCase": "+ Dativ (vor- oder nachgestellt)",
      "caseShort": "Dat",
      "questionPrompt": "Wo? / Wem gegenüber? → immer + Dativ",
      "collocations": [
        "dem Bahnhof gegenüber / gegenüber dem Bahnhof",
        "offen gegenüber neuen Ideen sein",
        "mir gegenüber (Pronomen steht davor)"
      ]
    },
    "exampleDe": "Gegenüber dem historischen Rathaus befindet sich ein beliebter Wochenmarkt.",
    "exampleEn": "Across from the historic town hall there is a popular weekly market.",
    "anatomy": {
      "ipa": "[ɡeːɡn̩ˈʔyːbɐ]",
      "caseGovernanceNote": "Always governs the DATIV case. With personal pronouns it is placed AFTER the pronoun (\"mir gegenüber\", \"ihm gegenüber\"); with nouns it can stand before or after (\"gegenüber dem Bahnhof\" or \"dem Bahnhof gegenüber\").",
      "synonyms": [
        "vis-à-vis",
        "auf der anderen Seite von (+ Dat.)"
      ],
      "antonyms": [
        "neben (+ Dat.)",
        "diesseits (+ Gen.)"
      ],
      "collocations": [
        "gegenüber dem Bahnhof liegen (+ Dat.)",
        "jemandem gegenüber freundlich / skeptisch sein",
        "im Vergleich gegenüber (+ Dat.)"
      ],
      "wordFamily": [
        "gegenüberliegen (to lie opposite)",
        "gegenüberstellen (to contrast / confront)",
        "das Gegenüber (counterpart / person opposite)"
      ],
      "b1ExamTip": "Great for B1 picture descriptions: \"Im Hintergrund, direkt gegenüber dem Café, sieht man …\" (always Dativ!)."
    }
  },
  {
    "id": "p-trotz",
    "lemma": "trotz",
    "spokenText": "trotz",
    "cefr": "B1",
    "category": "preposition",
    "grammarLabel": "Präposition · Genitiv",
    "translation": "despite · in spite of",
    "highlightTarget": "Trotz der",
    "prepDetails": {
      "governedCase": "+ Genitiv (ugs. Dativ)",
      "caseShort": "Gen / Dat",
      "questionPrompt": "Trotz wessen? → + Genitiv (des / der)",
      "collocations": [
        "trotz des starken Regens",
        "trotz aller Schwierigkeiten",
        "trotz allem (feste Dativ-Wendung)"
      ]
    },
    "exampleDe": "Trotz der kurzen Vorbereitungszeit verlief die Präsentation äußerst erfolgreich.",
    "exampleEn": "Despite the short preparation time, the presentation went extremely well.",
    "anatomy": {
      "ipa": "[tʁɔt͡s]",
      "caseGovernanceNote": "Concessive preposition governing the GENITIV case in standard written German (\"trotz des Wetters\", \"trotz der Verspätung\"). Fixed Dativ exception: \"trotz allem\" (despite everything).",
      "synonyms": [
        "ungeachtet (+ Gen.)",
        "obwohl (Nebensatz)",
        "trotzdem (Hauptsatz)"
      ],
      "antonyms": [
        "wegen (+ Gen.)",
        "aufgrund (+ Gen.)",
        "dank (+ Gen./Dat.)"
      ],
      "collocations": [
        "trotz des schlechten Wetters",
        "trotz großer Anstrengungen",
        "trotz allem positiv bleiben"
      ],
      "wordFamily": [
        "trotzdem (nevertheless — conjunctive adverb)",
        "trotzen (+ Dat.) (to defy / brave)",
        "der Trotz (defiance)"
      ],
      "b1ExamTip": "Do not confuse \"trotz + Noun (Genitiv)\" with \"obwohl + Subordinate Clause\" or \"trotzdem + Verb-Second Clause\"!"
    }
  },
  {
    "id": "p-waehrend",
    "lemma": "während",
    "spokenText": "während",
    "cefr": "B1",
    "category": "preposition",
    "grammarLabel": "Präposition · Genitiv",
    "translation": "during · in the course of",
    "highlightTarget": "Während des",
    "prepDetails": {
      "governedCase": "+ Genitiv (temporal)",
      "caseShort": "Gen",
      "questionPrompt": "Wann? → während + Genitiv (des / der)",
      "collocations": [
        "während des gesamten Semesters",
        "während der Arbeitszeit",
        "währenddessen (Adverb)"
      ]
    },
    "exampleDe": "Während des Sommers finden im Schlosspark jeden Freitag Konzerte im Freien statt.",
    "exampleEn": "During the summer, outdoor concerts take place in the palace park every Friday.",
    "anatomy": {
      "ipa": "[ˈvɛːʁənt]",
      "caseGovernanceNote": "Temporal preposition governing the GENITIV case (\"während des Urlaubs\", \"während der Pause\"). Note: \"während\" can also act as a subordinating conjunction (\"Während ich koche, deckt er den Tisch\").",
      "synonyms": [
        "im Laufe (+ Gen.)",
        "innerhalb (+ Gen.)",
        "zeitgleich mit (+ Dat.)"
      ],
      "antonyms": [
        "außerhalb (+ Gen.)",
        "vor / nach (+ Dat.)"
      ],
      "collocations": [
        "während des gesamten Jahres",
        "während der Öffnungszeiten",
        "während der Fahrt nicht mit dem Fahrer sprechen"
      ],
      "wordFamily": [
        "währenddessen (meanwhile)",
        "währen (to last)",
        "fortwährend (continual)"
      ],
      "b1ExamTip": "Remember the masculine/neuter Genitive \"-s / -es\" ending on both article and noun: \"während DES StudiumS\", \"während DES FlugES\"."
    }
  },
  {
    "id": "c-obwohl",
    "lemma": "obwohl",
    "spokenText": "obwohl",
    "cefr": "B1",
    "category": "conn",
    "grammarLabel": "Konnektor · Subordinierend (Nebensatz)",
    "translation": "although · even though · though",
    "highlightTarget": "obwohl",
    "connDetails": {
      "connectorClass": "Subordinierend (Nebensatz)",
      "verbPositionRule": "Nebensatz · konjugiertes Verb steht ganz am Ende",
      "hauptsatzFirstDe": "Wir gehen heute im Park spazieren, obwohl es seit heute Morgen leicht regnet.",
      "hauptsatzFirstEn": "We are going for a walk in the park today, although it has been raining lightly since this morning.",
      "nebensatzFirstDe": "Obwohl es seit heute Morgen leicht regnet, gehen wir heute im Park spazieren.",
      "nebensatzFirstEn": "Although it has been raining lightly since this morning, we are going for a walk in the park today.",
      "contrastPair": {
        "partnerWord": "trotzdem (Konjunktionaladverb) · trotz (+ Genitiv)",
        "partnerRule": "trotzdem steht im Hauptsatz mit Inversion (Position 1 + Verb + Subjekt)",
        "partnerExample": "Es regnet leicht; trotzdem gehen wir heute im Park spazieren."
      }
    },
    "exampleDe": "Wir gehen heute im Park spazieren, obwohl es seit heute Morgen leicht regnet.",
    "exampleEn": "We are going for a walk in the park today, although it has been raining lightly since this morning.",
    "anatomy": {
      "ipa": "[ɔpˈvoːl]",
      "caseGovernanceNote": "Subordinating conjunction (Konzessivsatz): Sends the conjugated verb to the very end of the clause. If the \"Obwohl\"-clause comes first, the main clause immediately starts with the conjugated verb (Verb-Verb collision across the comma: \"Obwohl er müde IST, HILFT er mir\").",
      "synonyms": [
        "obgleich",
        "obschon",
        "wenngleich"
      ],
      "antonyms": [
        "weil (because)",
        "da (since)"
      ],
      "collocations": [
        "Obwohl ich wenig Zeit habe, …",
        "…, obwohl das gar nicht einfach war.",
        "Obwohl die Preise gestiegen sind, …"
      ],
      "wordFamily": [
        "trotzdem (nevertheless — Hauptsatz)",
        "trotz (+ Genitiv — Präposition)",
        "wohl (well / probably)"
      ],
      "b1ExamTip": "Mastering the trio \"obwohl\" (Nebensatz) ↔ \"trotzdem\" (Hauptsatz-Inversion) ↔ \"trotz\" (+ Genitiv) is a guaranteed score booster in Goethe/Telc B1 Sprachbausteine and writing!"
    }
  },
  {
    "id": "c-deshalb",
    "lemma": "deshalb",
    "spokenText": "deshalb",
    "cefr": "A2",
    "category": "conn",
    "grammarLabel": "Konnektor · Konjunktionaladverb (Inversion)",
    "translation": "therefore · for that reason · that is why",
    "highlightTarget": "deshalb",
    "connDetails": {
      "connectorClass": "Konjunktionaladverb (Inversion)",
      "verbPositionRule": "Position 1 + Inversion (deshalb + Verb + Subjekt)",
      "hauptsatzFirstDe": "Der Zug hatte zwanzig Minuten Verspätung, deshalb habe ich den Anschluss verpasst.",
      "hauptsatzFirstEn": "The train was twenty minutes late, therefore I missed the connection.",
      "nebensatzFirstDe": "Ich habe den Anschluss verpasst, weil der Zug zwanzig Minuten Verspätung hatte.",
      "nebensatzFirstEn": "I missed the connection because the train was twenty minutes late.",
      "contrastPair": {
        "partnerWord": "weil / da (Subordinierend · Nebensatz)",
        "partnerRule": "weil nennt den Grund im Nebensatz (Verb am Ende); deshalb nennt die Folge mit Inversion",
        "partnerExample": "Weil der Zug Verspätung hatte, kam ich zu spät."
      }
    },
    "exampleDe": "Der Zug hatte zwanzig Minuten Verspätung, deshalb habe ich den Anschluss verpasst.",
    "exampleEn": "The train was twenty minutes late, therefore I missed the connection.",
    "anatomy": {
      "ipa": "[ˈdɛshalp]",
      "caseGovernanceNote": "Conjunctive adverb occupying Position 1 of the second clause, forcing Subject-Verb INVERSION: \"deshalb + VERB + SUBJEKT\" (\"…, deshalb HABE ich …\"). Can also stand in the Mittelfeld after the verb (\"Ich habe deshalb den Anschluss verpasst\").",
      "synonyms": [
        "deswegen",
        "daher",
        "darum",
        "aus diesem Grund"
      ],
      "antonyms": [
        "trotzdem (nevertheless)",
        "dennoch"
      ],
      "collocations": [
        "…, deshalb möchte ich Sie bitten, …",
        "Genau deshalb lerne ich jeden Tag Deutsch.",
        "…, deshalb schlage ich vor, dass …"
      ],
      "wordFamily": [
        "deswegen (therefore)",
        "daher (hence)",
        "weshalb (why / for what reason)"
      ],
      "b1ExamTip": "Never put a comma after \"deshalb\"! Write \"…, deshalb komme ich später\" (Verb immediately after deshalb!)."
    }
  },
  {
    "id": "c-denn",
    "lemma": "denn",
    "spokenText": "denn",
    "cefr": "A1",
    "category": "conn",
    "grammarLabel": "Konnektor · Koordinierend (Position 0)",
    "translation": "because · for",
    "highlightTarget": "denn",
    "connDetails": {
      "connectorClass": "Koordinierend (Position 0)",
      "verbPositionRule": "Position 0 (ADUSO) · Hauptsatz-Wortstellung (Subjekt + Verb)",
      "hauptsatzFirstDe": "Nimm auf jeden Fall eine Regenjacke mit, denn das Wetter im Gebirge wechselt rasch.",
      "hauptsatzFirstEn": "Definitely bring a rain jacket with you, for the weather in the mountains changes quickly.",
      "nebensatzFirstDe": "Nimm auf jeden Fall eine Regenjacke mit, weil das Wetter im Gebirge rasch wechselt.",
      "nebensatzFirstEn": "Definitely bring a rain jacket with you, because the weather in the mountains changes quickly.",
      "contrastPair": {
        "partnerWord": "weil (Subordinierend · Verb am Ende)",
        "partnerRule": "denn (Pos. 0) lässt das Verb an Position 2; weil schickt das Verb ans Satzende",
        "partnerExample": "…, denn das Wetter WECHSELT rasch. ↔ …, weil das Wetter rasch WECHSELT."
      }
    },
    "exampleDe": "Nimm auf jeden Fall eine Regenjacke mit, denn das Wetter im Gebirge wechselt rasch.",
    "exampleEn": "Definitely bring a rain jacket with you, because the weather in the mountains changes quickly.",
    "anatomy": {
      "ipa": "[dɛn]",
      "caseGovernanceNote": "Part of the 5 coordinating ADUSO conjunctions (Aber, Denn, Und, Sondern, Oder). Takes Position 0, meaning it does NOT change word order: \", denn + Subjekt + Verb (Pos. 2)\". Note: A \"denn\"-clause can NEVER stand first in a sentence!",
      "synonyms": [
        "weil (Nebensatz)",
        "da (Nebensatz)",
        "nämlich (Mittelfeld)"
      ],
      "antonyms": [
        "trotzdem",
        "obwohl"
      ],
      "collocations": [
        "…, denn ich habe morgen eine wichtige Prüfung.",
        "…, denn Gesundheit ist wichtiger als Stress.",
        "Was ist denn hier los? (Modalpartikel in Fragen)"
      ],
      "wordFamily": [
        "aber / denn / und / sondern / oder (ADUSO-Gruppe)",
        "es sei denn (unless)"
      ],
      "b1ExamTip": "If you start a causal clause mid-sentence and want normal main-clause word order without sending the verb to the end, use \", denn + Subjekt + Verb\"."
    }
  },
  {
    "id": "c-je-desto",
    "lemma": "je … desto …",
    "spokenText": "je mehr, desto besser",
    "cefr": "B1",
    "category": "conn",
    "grammarLabel": "Konnektor · Zweiteilig (Nebensatz + Inversion)",
    "translation": "the more … the more …",
    "highlightTarget": "desto",
    "connDetails": {
      "connectorClass": "Subordinierend (Nebensatz)",
      "verbPositionRule": "je + Komparativ … Verb am Ende, desto + Komparativ + Verb + Subjekt",
      "hauptsatzFirstDe": "Je regelmäßiger man neue Wörter im Kontext wiederholt, desto sicherer spricht man im Alltag.",
      "hauptsatzFirstEn": "The more regularly one repeats new words in context, the more confidently one speaks in everyday life.",
      "nebensatzFirstDe": "Je früher wir die Fahrkarten buchen, desto günstiger sind die Plätze im Zug.",
      "nebensatzFirstEn": "The earlier we book the tickets, the cheaper the seats on the train are.",
      "contrastPair": {
        "partnerWord": "je … umso … (identische Grammatik)",
        "partnerRule": "Im „je“-Teilsatz steht das Verb am Ende; im „desto/umso“-Teilsatz folgt sofort das Verb!",
        "partnerExample": "Je länger ich überlege, umso klarer wird die Entscheidung."
      }
    },
    "exampleDe": "Je regelmäßiger man neue Wörter im Kontext wiederholt, desto sicherer spricht man im Alltag.",
    "exampleEn": "The more regularly one repeats new words in context, the more confidently one speaks in everyday life.",
    "anatomy": {
      "ipa": "[jeː … ˈdɛsto …]",
      "caseGovernanceNote": "Two-part proportional connector ALWAYS requiring two Comparatives: 1st clause (\"Je + Komparativ + Subjekt + … + VERB AM ENDE\"), 2nd clause (\"desto/umso + Komparativ + VERB + SUBJEKT\").",
      "synonyms": [
        "je … umso …"
      ],
      "antonyms": [
        "weder … noch … (neither … nor)"
      ],
      "collocations": [
        "Je früher, desto besser! (The sooner, the better!)",
        "Je mehr man übt, desto leichter fällt es.",
        "Je länger es dauert, umso teurer wird es."
      ],
      "wordFamily": [
        "umso + Komparativ (all the more)",
        "der Komparativ (comparative form)"
      ],
      "b1ExamTip": "Using one well-formed \"Je + Komparativ …, desto + Komparativ …\" sentence in your B1 essay immediately signals upper-B1 syntactic mastery."
    }
  },
  {
    "id": "ph-es-kommt-darauf-an",
    "lemma": "Es kommt darauf an, ob …",
    "spokenText": "Es kommt darauf an, ob",
    "cefr": "B1",
    "category": "phrase",
    "grammarLabel": "Wendung · Meinungsäußerung & Abwägen",
    "translation": "It depends on whether / how …",
    "highlightTarget": "kommt ganz darauf an",
    "phraseDetails": {
      "framePattern": "Es kommt (ganz) darauf an, ob / wie / wer … [Verb am Ende]",
      "casePattern": "auf + Akkusativ (Pronominaladverb: darauf) · Indirekter Fragesatz",
      "registerLabel": "Alltag & Gespräch",
      "formalVariant": {
        "textDe": "Dies hängt maßgeblich davon ab, ob die Rahmenbedingungen stimmen.",
        "textEn": "This depends significantly on whether the framework conditions are right.",
        "contextNote": "Formell / Schriftliche Argumentation & B1/B2 Aufsatz"
      },
      "informalVariant": {
        "textDe": "Kommt ganz drauf an, worauf du heute Abend Lust hast!",
        "textEn": "Totally depends on what you feel like doing tonight!",
        "contextNote": "Umgangssprachlich / Gesprochener Alltag („drauf“ statt „darauf“)"
      },
      "miniDialog": {
        "speakerA": "Prüferin (B1 Diskussion)",
        "promptDe": "Sollte man Ihrer Meinung nach lieber in der Großstadt oder auf dem Land wohnen?",
        "promptEn": "In your opinion, should one rather live in a big city or in the countryside?",
        "speakerB": "Du",
        "replyDe": "Es kommt ganz darauf an, in welcher Lebensphase man sich gerade befindet.",
        "replyEn": "It really depends on which stage of life one is currently in."
      }
    },
    "exampleDe": "Es kommt ganz darauf an, wie viel Zeit wir am Wochenende für den Ausflug haben.",
    "exampleEn": "It really depends on how much time we have for the excursion on the weekend.",
    "anatomy": {
      "ipa": "[ɛs kɔmt daˈʁaʊ̯f an ɔp]",
      "caseGovernanceNote": "Derived from \"ankommen auf + Akkusativ\". When followed by a subordinate clause (\"ob …\" or a W-question like \"wie / wann / wo …\"), the preposition \"auf\" merges into the pronominal adverb \"darauf\" (\"Es kommt darauf an, ob …\").",
      "synonyms": [
        "Das hängt davon ab, ob …",
        "Je nachdem, ob / wie …"
      ],
      "antonyms": [
        "Auf jeden Fall!",
        "Unter allen Umständen"
      ],
      "collocations": [
        "Es kommt ganz darauf an, ob das Wetter mitspielt.",
        "Es kommt auf den Einzelnen an (+ Akk.).",
        "Darauf kommt es im Leben wirklich an!"
      ],
      "wordFamily": [
        "ankommen auf (+ Akk.)",
        "abhängen von (+ Dat.)",
        "je nachdem (depending on)"
      ],
      "b1ExamTip": "Use this phrase to buy thinking time and give a balanced answer in B1 Speaking Part 2 & 3!"
    }
  },
  {
    "id": "ph-meiner-meinung-nach",
    "lemma": "Meiner Meinung nach …",
    "spokenText": "Meiner Meinung nach",
    "cefr": "A2",
    "category": "phrase",
    "grammarLabel": "Wendung · Standpunkt formulieren",
    "translation": "In my opinion … · To my mind …",
    "highlightTarget": "Meiner Meinung nach",
    "phraseDetails": {
      "framePattern": "Meiner Meinung nach + [Verb an Position 2] + [Subjekt] …",
      "casePattern": "nach + Dativ (nachgestellt) · Position 1 mit Inversion",
      "registerLabel": "Formell & B1 Prüfung",
      "formalVariant": {
        "textDe": "Meiner Ansicht nach sollte der öffentliche Nahverkehr stärker gefördert werden.",
        "textEn": "In my view, public transport should be promoted more strongly.",
        "contextNote": "Formell / B1 Forumsbeitrag & Präsentation"
      },
      "informalVariant": {
        "textDe": "Ich finde, dass man am Wochenende einfach mal abschalten sollte.",
        "textEn": "I think that one should simply unwind on the weekend.",
        "contextNote": "Alltagssprachlich / Persönliches Gespräch"
      },
      "miniDialog": {
        "speakerA": "Gesprächspartner",
        "promptDe": "Was hältst du von Online-Sprachkursen im Vergleich zum Präsenzunterricht?",
        "promptEn": "What do you think of online language courses compared to in-person classes?",
        "speakerB": "Du",
        "replyDe": "Meiner Meinung nach bieten Online-Kurse eine hervorragende zeitliche Flexibilität.",
        "replyEn": "In my opinion, online courses offer excellent time flexibility."
      }
    },
    "exampleDe": "Meiner Meinung nach lernt man eine Fremdsprache am besten durch tägliche Anwendung.",
    "exampleEn": "In my opinion, one learns a foreign language best through daily application.",
    "anatomy": {
      "ipa": "[ˈmaɪ̯nɐ ˈmaɪ̯nʊŋ nax]",
      "caseGovernanceNote": "Postpositional Dativ phrase (\"die Meinung\" → Dativ Feminin \"meiner Meinung\" + \"nach\"). Because the whole 3-word block occupies Position 1 of the main clause, the conjugated VERB must follow immediately in Position 2 (\"Meiner Meinung nach LERNT man …\")—never put a comma or \"dass\" after it!",
      "synonyms": [
        "Meiner Ansicht nach (+ Verb)",
        "Meines Erachtens (+ Verb)",
        "Ich bin der Meinung, dass … (Nebensatz)"
      ],
      "antonyms": [
        "Im Gegenteil",
        "Da bin ich anderer Meinung"
      ],
      "collocations": [
        "Meiner Meinung nach ist das eine sehr gute Idee.",
        "Meiner persönlichen Meinung nach …",
        "Wie ist Ihre Meinung dazu?"
      ],
      "wordFamily": [
        "die Meinung, -en (opinion)",
        "meinen (to think / mean)",
        "der Meinungsaustausch (exchange of views)"
      ],
      "b1ExamTip": "Frequent exam trap: NEVER write \"Meiner Meinung nach, ich finde …\". Put the conjugated verb right after \"nach\": \"Meiner Meinung nach IST das …\"!"
    }
  },
  {
    "id": "ph-ich-schlage-vor",
    "lemma": "Ich schlage vor, dass …",
    "spokenText": "Ich schlage vor, dass wir",
    "cefr": "A2",
    "category": "phrase",
    "grammarLabel": "Wendung · Gemeinsam etwas planen",
    "translation": "I suggest / propose that we …",
    "highlightTarget": "schlage vor, dass",
    "phraseDetails": {
      "framePattern": "Ich schlage vor, dass wir … [Verb am Ende]  |  Wie wäre es, wenn …?",
      "casePattern": "vorschlagen (trennbar: schlägt … vor) + dass-Satz / Infinitiv mit zu",
      "registerLabel": "Formell & B1 Prüfung",
      "formalVariant": {
        "textDe": "Ich möchte vorschlagen, den Besprechungstermin auf kommenden Dienstag zu verlegen.",
        "textEn": "I would like to propose postponing the meeting to next Tuesday.",
        "contextNote": "Formell / Berufliche E-Mail & Besprechung"
      },
      "informalVariant": {
        "textDe": "Lass uns doch einfach am Samstag zusammen auf den Wochenmarkt gehen!",
        "textEn": "Why don’t we just go to the weekly market together on Saturday!",
        "contextNote": "Informell / Unter Freunden"
      },
      "miniDialog": {
        "speakerA": "Partner (B1 Teil 3 Planen)",
        "promptDe": "Wann und wo wollen wir uns für die Vorbereitung unserer Präsentation treffen?",
        "promptEn": "When and where do we want to meet to prepare our presentation?",
        "speakerB": "Du",
        "replyDe": "Ich schlage vor, dass wir uns am Freitagnachmittag in der Stadtbibliothek treffen.",
        "replyEn": "I suggest that we meet at the city library on Friday afternoon."
      }
    },
    "exampleDe": "Ich schlage vor, dass wir uns schon eine halbe Stunde vor Beginn am Eingang treffen.",
    "exampleEn": "I suggest that we meet at the entrance half an hour before the start.",
    "anatomy": {
      "ipa": "[ɪç ˈʃlaːɡə foːɐ̯ das]",
      "caseGovernanceNote": "Separable strong verb \"vorschlagen\" (er schlägt vor, schlug vor, hat vorgeschlagen). Can be followed by a \"dass\"-clause (when subjects differ or include \"wir\") or an infinitive clause with \"zu\" (\"Ich schlage vor, mit der Bahn zu fahren\").",
      "synonyms": [
        "Wie wäre es, wenn wir … (+ Konjunktiv II)?",
        "Wir könnten doch …",
        "Was hältst du davon, wenn wir …?"
      ],
      "antonyms": [
        "Davon rate ich eher ab",
        "Das halte ich für keine gute Idee"
      ],
      "collocations": [
        "Ich schlage vor, dass wir uns die Kosten teilen.",
        "Einen Kompromiss vorschlagen",
        "Was schlägst du vor?"
      ],
      "wordFamily": [
        "der Vorschlag, die Vorschläge (suggestion / proposal)",
        "vorschlagen (to suggest)",
        "der Verbesserungsvorschlag (suggestion for improvement)"
      ],
      "b1ExamTip": "Anchor phrase for Goethe/Telc B1 Speaking Part 3 (\"Gemeinsam etwas planen\"). Alternate it with \"Wie wäre es, wenn wir …?\" for top marks."
    }
  },
  {
    "id": "ph-auf-jeden-fall",
    "lemma": "auf jeden Fall",
    "spokenText": "auf jeden Fall",
    "cefr": "A2",
    "category": "phrase",
    "grammarLabel": "Wendung · Zustimmung & Nachdruck",
    "translation": "in any case · definitely · by all means",
    "highlightTarget": "auf jeden Fall",
    "phraseDetails": {
      "framePattern": "Das sollten wir auf jeden Fall + [Infinitiv am Ende]!",
      "casePattern": "auf + Akkusativ (der Fall → jeden Fall) · Feste Adverbialwendung",
      "registerLabel": "Alltag & Gespräch",
      "formalVariant": {
        "textDe": "Wir werden Ihre Anregung bei der weiteren Planung unter allen Umständen berücksichtigen.",
        "textEn": "We will definitely take your suggestion into account in further planning.",
        "contextNote": "Formell / Offizielle Korrespondenz"
      },
      "informalVariant": {
        "textDe": "Klar, da bin ich am Wochenende auf jeden Fall mit dabei!",
        "textEn": "Sure, I’m definitely in for that this weekend!",
        "contextNote": "Alltag / Freundschaftliche Zusage"
      },
      "miniDialog": {
        "speakerA": "Freundin",
        "promptDe": "Kommst du morgen Abend auch zu unserer kleinen Einweihungsparty?",
        "promptEn": "Are you coming to our little housewarming party tomorrow evening too?",
        "speakerB": "Du",
        "replyDe": "Ja, auf jeden Fall! Soll ich noch einen Salat oder Getränke mitbringen?",
        "replyEn": "Yes, definitely! Should I bring a salad or drinks?"
      }
    },
    "exampleDe": "Lass uns nach der Prüfung auf jeden Fall noch gemeinsam einen Kaffee trinken gehen!",
    "exampleEn": "Let’s definitely go grab a coffee together after the exam!",
    "anatomy": {
      "ipa": "[aʊ̯f ˈjeːdn̩ fal]",
      "caseGovernanceNote": "Fixed prepositional idiom with \"auf + Akkusativ\" (der Fall → jeden Fall). Does not change its case in a sentence; its direct negative counterpart is \"auf keinen Fall\" (by no means / under no circumstances).",
      "synonyms": [
        "unbedingt",
        "ganz bestimmt",
        "unter allen Umständen"
      ],
      "antonyms": [
        "auf keinen Fall",
        "keinesfalls",
        "niemals"
      ],
      "collocations": [
        "Das sollten wir auf jeden Fall ausprobieren!",
        "Ich komme auf jeden Fall pünktlich.",
        "Lass uns auf jeden Fall in Kontakt bleiben!"
      ],
      "wordFamily": [
        "der Fall, die Fälle (case / instance)",
        "falls (in case / if — Nebensatz)",
        "ebenfalls (likewise)"
      ],
      "b1ExamTip": "High-scoring natural expression for B1 oral partner dialogues when agreeing enthusiastically with your partner’s proposal."
    }
  }
];
