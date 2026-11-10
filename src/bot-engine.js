/**
 * Paracelsus Kliniken — Digitaler Wegweiser & Clinical Triage Engine
 * Version: 4.0.0 (Enterprise Smart Intent Matching, Stopwords Filter & Clinical FAQ)
 * 
 * Compliance & Standards:
 * - MDR (EU 2017/745): Reines Orientierungs- und Navigationssystem (keine Diagnostik / Therapie)
 * - DSGVO Art. 9: Strikte Client-Side PII-Anonymisierung sensibler Gesundheitsdaten
 * - Gleichbehandlung: Keine Zweiklassengesellschaft, keine interne Hierarchie-Kommunikation
 */

// 1. Detaillierter Notfallkatalog (112 / Krisen-Hotlines)
const EMERGENCY_CATEGORIES = {
  CARDIOVASCULAR: {
    pattern: /herzinfarkt|stechen\s+in\s+der\s+brust|enge\s+in\s+der\s+brust|brustenge|brustschmerz[a-z]*|schmerzen?\s*(in\s*der\s*)?brust|engegefühl\s*brust|druck\s*auf\s*der\s*brust|(ausstrahl[a-z]*.*(arm|kiefer))|((arm|kiefer).*ausstrahl[a-z]*)|herzrasen\s*akut|heart\s*attack|chest\s*pain/i,
    title: "VERDACHT AUF HERZINFARKT / AKUTES KORONARSYNDROM",
    title_en: "SUSPECTED HEART ATTACK (ACUTE CORONARY SYNDROME)",
    title_tr: "KALP KRİZİ ŞÜPHESİ (ACİL DURUM)",
    title_uk: "ПІДОЗРА НА ІНФАРКТ МІОКАРДА",
    action: "Sofort Rettungsdienst 112 rufen!",
    action_en: "Call Emergency 112 immediately!",
    action_tr: "Derhal 112 Acil Servisi arayın!",
    action_uk: "Негайно викликайте швидку 112!",
    hotline: "112",
    guidance: "Oberkörper leicht erhöht lagern. Enge Kleidung lockern. Ruhe bewahren und auf das Eintreffen des Notarztes warten."
  },
  STROKE: {
    pattern: /schlaganfall|vernichtungskopfschmerz[a-z]*|donnerschlagkopfschmerz[a-z]*|(?:stärkste[rn]?|schlimmste[rn]?|heftigste[rn]?)\s+kopfschmerz[a-z]*\s+(?:meines|seines|ihres|deines)\s+lebens|(?:plötzlich|schlagartig)[a-z]*\s+(?:extrem[a-z]*|stärkste[a-z]*|heftigste[a-z]*|unerträgliche[a-z]*|schlimmste[a-z]*)\s+kopfschmerz[a-z]*|kopfschmerz[a-z]*\s+wie\s+(?:noch\s+)?nie|sieht\s+plötzlich\s+(?:doppelt|nichts)|sehe\s+plötzlich\s+(?:doppelt|nichts)|plötzlich\s+(?:blind|auf\s+einem\s+auge)|gesicht\s+(?:ist\s+)?(?:plötzlich\s+)?(?:taub|schief)|(?:körper|gesichts)hälfte\s+(?:ist\s+)?(?:plötzlich\s+)?(?:taub|gelähmt)|hängt\s+(?:der|ein|sein|ihr)\s+mundwinkel|hängender\s+mundwinkel|gesicht(?:shälfte)?\s+hängt|kann\s+(?:plötzlich\s+)?nicht\s+(?:mehr\s+)?(?:richtig\s+)?sprechen|spricht\s+(?:plötzlich\s+)?(?:verwaschen|undeutlich)|arm\s+(?:ist\s+)?plötzlich\s+(?:taub|gelähmt|schwach)|kann\s+(?:den\s+|einen\s+)?arm\s+nicht\s+(?:mehr\s+)?heben|lähmung|halbseitig|herabhängend[a-z]*\s*mundwinkel|mundwinkel\s*hängt|sprachstörung|plötzlich\s*nicht\s*mehr\s*sprechen|sehstörung\s*plötzlich|stroke/i,
    title: "VERDACHT AUF SCHLAGANFALL (FAST-SYMPTOME)",
    title_en: "SUSPECTED STROKE (FAST SYMPTOMS)",
    title_tr: "İNME / FELÇ ŞÜPHESİ (FAST)",
    title_uk: "ПІДОЗРА НА ІНСУЛЬТ",
    action: "Sofort Notruf 112 wählen!",
    action_en: "Dial 112 immediately!",
    action_tr: "Derhal 112'yi arayın!",
    action_uk: "Негайно дзвоніть 112!",
    hotline: "112",
    guidance: "Jede Minute zählt (Time is Brain). Flach lagern, nicht essen oder trinken lassen. Den genauen Zeitpunkt des Symptombeginns notieren."
  },
  RESPIRATORY: {
    pattern: /keine\s*luft|bekomm[a-z]*\s+(?:kaum|keine|schlecht)\s+luft|krieg[a-z]*\s+keine\s+luft|zunge\s+schwillt|hals\s+schwillt|am\s+ersticken|atmet\s+(?:nicht|kaum)|nicht\s+mehr\s+atmen|krieg[a-z]*\s+(?:kaum|schlecht)\s+luft|luftnot|wird\s+(?:ganz\s+)?blau|läuft\s+blau\s+an|röchel[a-z]*|allergischer\s+schock|anaphyla[a-z]*|schwere\s*atemnot|erstickungsgefühl|ersticke|erstickung|blau\s*anlaufen|cannot\s*breathe|shortness\s*of\s*breath/i,
    title: "AKUTE VITAL BEDROHLICHE ATEMNOT",
    title_en: "ACUTE SEVERE RESPIRATORY DISTRESS",
    title_tr: "CİDDİ NEFES DARLIĞI / BOĞULMA TEHLİKESİ",
    title_uk: "ГОСТРА ДИХАЛЬНА НЕДОСТАТНІСТЬ",
    action: "Unverzüglich Notruf 112 rufen!",
    action_en: "Call 112 immediately!",
    action_tr: "Derhal 112'yi arayın!",
    action_uk: "Терміново викликайте 112!",
    hotline: "112",
    guidance: "Fenster für Frischluft öffnen. Aufrechte Sitzhaltung einnehmen, Arme aufstützen (Kutschersitz)."
  },
  SEVERE_BLEEDING: {
    pattern: /starke\s*blutung|blutet\s+(?:sehr\s+|ganz\s+)?(?:stark|heftig|extrem)|hört\s+nicht\s+auf\s+zu\s+bluten|blutung\s+(?:hört|stoppt)\s+nicht|erbricht\s+blut|blut\s+(?:erbrochen|gespuckt)|spuckt\s+blut|unstillbare\s*blutung|arterielle\s*blutung|blutverlust|spritzende\s*blutung|severe\s*bleeding|hemorrhage/i,
    title: "SCHWERE, AKUTE BLUTUNG",
    title_en: "SEVERE ACUTE BLEEDING",
    title_tr: "AĞIR KANAMA TEHLİKESİ",
    title_uk: "ГОСТРА СИЛЬНА КРОВОТЕЧА",
    action: "Sofort Notruf 112 wählen!",
    action_en: "Call Emergency 112 immediately!",
    action_tr: "Derhal 112 Acil Servisi arayın!",
    action_uk: "Негайно викликайте 112!",
    hotline: "112",
    guidance: "Druckverband anlegen. Betroffene Extremität wenn möglich hochlagern. Wunde mit sauberem Tuch fest abdrücken bis der Notarzt eintrifft."
  },
  SUICIDE_CRISIS: {
    pattern: /suizid|alles\s+zu\s+viel|weiß\s+nicht\s+mehr\s+weiter|ich\s+kann\s+nicht\s+mehr[\s.!]*$|das\s+leben\s+nehmen|selbst\s+(?:was|etwas)\s+antun|will\s+sterben|möchte\s+sterben|mich\s+umbringen|bring[e]?\s+mich\s+um|mir\s+(?:etwas|was)\s+antun|will\s+nicht\s+mehr\s+(?:da\s+sein|aufwachen)|keinen\s+sinn\s+mehr|überdosis|zu\s+viele\s+tabletten|lebensmüde|selbstmord|nicht\s*mehr\s*leben|kann\s*nicht\s*mehr\s*weiter|suicide|depression\s*crisis/i,
    title: "AKUTE SEELISCHE KRISE / HILFE IN NOTLAGEN",
    title_en: "MENTAL HEALTH CRISIS & SUPPORT",
    title_tr: "PSİKOLOJİK KRİZ VE DESTEK HATTI",
    title_uk: "ПСИХОЛОГІЧНА КРИЗА ТА ПІДТРИМКА",
    action: "Telefonseelsorge rund um die Uhr erreichbar",
    action_en: "24/7 Crisis Hotline available",
    action_tr: "7/24 Kriz Destek Hattı",
    action_uk: "Цілодобова кризова лінія",
    hotline: "0800 111 0 111",
    altHotline: "112",
    guidance: "Du bist nicht allein. Die Telefonseelsorge hilft kostenlos, anonym und 24/7 unter 0800 111 0 111 oder 0800 111 0 222. Bei unmittelbarer Lebensgefahr wählen Sie bitte die 112."
  },
  POISON: {
    pattern: /vergiftung|(?:putzmittel|spülmittel|reiniger|batterie|knopfzelle|waschmittel|frostschutz[a-z]*)\s+(?:getrunken|geschluckt|verschluckt)|chemikalie\s*(getrunken|geschluckt)|reiniger\s*geschluckt|gift\s*geschluckt|poison/i,
    title: "VERDACHT AUF AKUTE VERGIFTUNG",
    title_en: "SUSPECTED ACUTE POISONING",
    title_tr: "ZEHİRLENME ŞÜPHESİ",
    title_uk: "ПІДОЗРА НА ОТРУЄННЯ",
    action: "Giftnotruf oder 112 kontaktieren",
    action_en: "Call Poison Control or 112",
    action_tr: "Zehir Danışma veya 112'yi arayın",
    action_uk: "Зателефонуйте до токсикологічного центру або 112",
    hotline: "030 19240",
    guidance: "Giftnotruf anrufen (Berlin: 030 19240, NRW/Bonn: 0228 19240, Göttingen: 0551 19240, München: 089 19240). Kein Erbrechen herbeiführen! Verpackung bereithalten."
  },
  ACUTE_ABDOMEN: {
    pattern: /brettharter\s*bauch|unerträgliche\s*bauchschmerzen|bauchdecke\s*hart/i,
    title: "VERDACHT AUF AKUTES ABDOMEN",
    title_en: "ACUTE ABDOMEN SUSPECTED",
    title_tr: "AKUT BATIN ŞÜPHESİ",
    title_uk: "ПІДОЗРА НА ГОСТРИЙ ЖИВІТ",
    action: "Sofort ärztliche Notfallversorgung / 112",
    action_en: "Immediate emergency hospital care / 112",
    action_tr: "Acil tıbbi müdahale / 112",
    action_uk: "Невідкладна медична допомога / 112",
    hotline: "112",
    guidance: "Keine Schmerzmittel oder Nahrung einnehmen. Unverzügliche Vorstellung in der Notaufnahme oder Rettungsdienst verständigen."
  },
  UNCONSCIOUSNESS: {
    pattern: /\b(?:bewusstlos[a-z]*|(?:kopf\s+(?:gestoßen|gestossen|angeschlagen|aufgeschlagen)|auf\s+den\s+kopf\s+gefallen).*(?:erbr[a-z]*|überg[a-z]*|bricht|benommen|schläfrig|verwirrt)|umgekippt|krampft|zuckt\s+am\s+ganzen\s+körper|bewegt\s+sich\s+nicht\s+mehr|wacht\s+nicht\s+(?:mehr\s+)?auf|kein(?:en)?\s+puls|herzstillstand|wiederbeleb[a-z]*|leblos|ohnmächtig|ohnmacht|krampfanfall|epileptischer\s+anfall|reagiert\s+nicht\s+mehr|nicht\s+ansprechbar|kollabiert|zusammengebrochen)\b/i,
    title: "AKUTE BEWUSSTLOSIGKEIT / NEUROLOGISCHER NOTFALL",
    title_en: "ACUTE UNCONSCIOUSNESS / SEIZURE EMERGENCY",
    title_tr: "AKUT BİLİNÇ KAYBI / NÖBET ACİL DURUMU",
    title_uk: "ГОСТРА ВТРАТА СВІДОМОСТІ / НЕВІДКЛАДНИЙ СТАН",
    action: "Sofort Notruf 112 wählen!",
    action_en: "Call Emergency 112 immediately!",
    action_tr: "Derhal 112 Acil Servisi arayın!",
    action_uk: "Негайно викликайте 112!",
    hotline: "112",
    guidance: "Atmung prüfen. Bei vorhandener Atmung in die stabile Seitenlage bringen, Atemwege freihalten und Verletzungsgefahren in der Umgebung sichern."
  }
};

// 3. Strikte Deutsche Stoppwörter (verhindert Fehl-Matches wie "haben" -> "Hagen", "mein" -> "Peine")
const STOPWORDS = new Set([
  "ich", "du", "er", "sie", "es", "wir", "ihr", "mein", "meine", "meinen", "meinem", "meiner", "meines",
  "haben", "habe", "hast", "hat", "hatte", "hatten", "sein", "bin", "bist", "ist", "sind", "war", "waren",
  "werden", "wird", "wurde", "wurden", "können", "kann", "kannst", "könnt", "müssen", "muss", "musst",
  "sollen", "soll", "sollte", "wollen", "will", "willst", "dürfen", "darf", "bitte", "danke", "vielen",
  "hallo", "guten", "tag", "morgen", "abend", "servus", "moin", "hi", "hey",
  "wo", "wie", "was", "wann", "warum", "wer", "wohin", "woher", "welche", "welcher", "welches",
  "ein", "eine", "einer", "eines", "einem", "einen", "der", "die", "das", "den", "dem", "des",
  "und", "oder", "aber", "denn", "für", "mit", "nach", "von", "bei", "seit", "über", "unter", "vor", "zwischen",
  "sehr", "viel", "viele", "etwas", "schon", "noch", "auch", "immer", "wieder", "hier", "dort", "jetzt", "mal",
  "zimmer", "zimmern", "klinik", "kliniken", "krankenhaus", "hospital", "arzt", "ärzte", "doktor", "fragen",
  "hilfe", "suchen", "suche", "suchte", "beratung", "behandlung", "anfrage", "anliegen", "information",
  "gehe", "gehen", "geht", "ging", "komme", "kommen", "kommt", "kam"
]);

// 4. PII-Scrubber (Strikte Anonymisierung nach DSGVO Art. 9)
function scrubPII(text) {
  if (text === null || text === undefined) return "";
  let clean = typeof text === "string" ? text : (typeof text === "number" || typeof text === "boolean" ? String(text) : "");
  if (!clean) return "";
  clean = clean.normalize("NFC");

  // 1. Geburts- & Kalenderdaten (vor Telefonnummern matchen)
  // Deutsches Textdatum: 14. Juli 1985 / 14.Juli 1985
  clean = clean.replace(/\b\d{1,2}\.\s*(?:Januar|Februar|März|Maerz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s*\d{2,4}\b/gi, "[DATUM ANONYMISIERT]");
  // ISO-Datum: 1985-07-14
  clean = clean.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "[DATUM ANONYMISIERT]");
  // Slash-Datum: 14/07/1985
  clean = clean.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, "[DATUM ANONYMISIERT]");
  // Punkt-Datum: 14.07.1985 (zwei Punkte erforderlich, um Dezimalwerte wie 4.5 ng/ml zu schützen)
  clean = clean.replace(/\b\d{1,2}\.\d{1,2}\.\d{2,4}\b/g, "[DATUM ANONYMISIERT]");

  // 2. Gesetzliche Krankenversichertennummer (1 Buchstabe + 9 Ziffern, auch mit Leerzeichen)
  clean = clean.replace(/\b[A-Za-z]\s*\d(?:\s*\d){8}\b/g, "[VERSICHERTEN-NR ANONYMISIERT]");

  // 3. E-Mail-Adressen
  clean = clean.replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, "[E-MAIL ANONYMISIERT]");

  // 4. Straßenadressen (deutsche Straßennamen mit Hausnummer)
  clean = clean.replace(/\b(?:am\s+[A-Za-zÄÖÜäöüßà-öø-ÿ]+|[A-Za-zÄÖÜäöüßà-öø-ÿ]+(?:-[A-Za-zÄÖÜäöüßà-öø-ÿ]+)*(?:-)?(?:straße|str\.|weg|gasse|platz|allee|ring|chaussee|damm|ufer|berg|hang|markt|steig|kamp|zeil|wall))\s+\d+[a-zA-Z]?(?:\s*-\s*\d+[a-zA-Z]?)?\b/gi, "[ADRESSE ANONYMISIERT]");

  // 5. Telefonnummern (5-stellige deutsche PLZ wie 40213 oder 01067 werden geschützt)
  const phonePattern = /(?:\+(?:[0-9][-.\s/()]*){6,15}[0-9]|\(?\b0[1-9][0-9]{1,4}\)?[-.\s/]+[0-9]{2,10}\b|\(?\b0[1-9][0-9]{1,4}\)?[-.\s/]*[0-9]{3,10}\b|\b[0-9]{6,12}\b)/g;
  clean = clean.replace(phonePattern, "[TELEFON ANONYMISIERT]");

  // 6. Personennamen (Titel, Anrede, Einführungsmuster, Doppelnamen)
  const piiStopWords = new Set([
    "und", "oder", "aber", "hat", "hatte", "habe", "haben", "ist", "sind", "war", "waren",
    "aus", "an", "am", "in", "im", "von", "vom", "mit", "bei", "nach", "seit", "zu", "zum", "zur", "für",
    "über", "unter", "vor", "zwischen", "durch",
    "der", "die", "das", "dem", "den", "des", "ein", "eine", "einer", "eines", "einem", "einen",
    "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "mir", "dich", "dir", "ihn", "ihm", "uns", "euch", "ihnen",
    "mein", "meine", "meinen", "meiner", "sein", "seine", "seinen", "seiner", "ihr", "ihre",
    "suche", "suchen", "sucht", "brauche", "brauchen", "braucht", "möchte", "will", "kann", "muss",
    "schmerzen", "beschwerden", "probleme", "hilfe", "behandlung", "klinik", "krankenhaus", "arzt", "überwiesen", "empfahl",
    "auf", "dem", "krank", "schwanger", "versichert", "gesetzlich", "privat", "nicht", "nur", "schon"
  ]);

  const nobleParticles = new Set(["von", "zu", "van", "de", "der", "den", "vom"]);
  const roleStopWords = new Set(["doktor", "arzt", "ärzte", "ärztin", "klinik", "krankenhaus"]);

  function cleanNameMatch(match, prefix, namePart) {
    const words = namePart.trim().split(/\s+/);
    const validNames = [];
    const restWords = [];
    let collecting = true;
    const hasExplicitPrefix = /\b(?:herr|frau|patient(?:in)?|dr|prof|priv\.-doz)\b/i.test(prefix);

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const lower = w.toLowerCase();
      const isCapitalized = /^[A-ZÄÖÜÀ-ÖØ-ß]/.test(w);

      if (collecting) {
        // Adelspartikel ("von", "zu", "van", "de") in Nachnamen schützen, falls weiterer Name folgt
        if (validNames.length > 0 && nobleParticles.has(lower)) {
          let hasFollowingName = false;
          for (let j = i + 1; j < words.length; j++) {
            const nextLower = words[j].toLowerCase();
            if (/^[A-ZÄÖÜÀ-ÖØ-ß]/.test(words[j]) && !piiStopWords.has(nextLower)) {
              hasFollowingName = true;
              break;
            }
            if (!nobleParticles.has(nextLower) && nextLower !== "und") {
              break;
            }
          }
          if (hasFollowingName) {
            validNames.push(w);
            continue;
          }
        }

        if (!piiStopWords.has(lower)) {
          validNames.push(w);
        } else if (validNames.length === 0 && hasExplicitPrefix && isCapitalized && !roleStopWords.has(lower)) {
          // Kurze Namen, die mit Stoppwörtern kollidieren (z. B. "Frau An") nach explizitem Präfix akzeptieren
          validNames.push(w);
        } else {
          collecting = false;
          restWords.push(w);
        }
      } else {
        restWords.push(w);
      }
    }

    if (validNames.length > 0) {
      return "[NAME ANONYMISIERT]" + (restWords.length > 0 ? " " + restWords.join(" ") : "");
    }
    return match;
  }

  const titlePattern = "(?:(?:(?:prof(?:essor)?\\.?(?:\\s*dr\\.?)?|dr\\.?|doktor|priv\\.-doz\\.?|pd\\.?)(?:\\s*(?:med|dent|habil|h\\.\\s*c|rer\\.\\s*nat)\\.?)*\\s*)+)";
  const nameWord = "[a-zäöüßà-öø-ÿ]+(?:-[a-zäöüßà-öø-ÿ]+)*";
  const candidateNames = "\\b" + nameWord + "(?:\\s+" + nameWord + "){0,4}\\b";

  // A. Intro-Phrasen: "ich heiße", "mein name ist/lautet", "hier ist", "hier spricht", "patient(in):"
  clean = clean.replace(new RegExp("((?:ich\\s+heiße|ich\\s+bin|mein\\s+name\\s+(?:ist|lautet)|hier\\s+(?:ist|spricht)|patient(?:in)?(?::|\\s+ist:?)?)\\s+(?:" + titlePattern + ")?(?:(?:herr|frau)\\s+)?(?:" + titlePattern + ")?)(" + candidateNames + ")", "gi"), cleanNameMatch);

  // B. Anrede "Herr" / "Frau" mit Namen
  clean = clean.replace(new RegExp("((?:herr|frau)\\s+(?:" + titlePattern + ")?)(" + candidateNames + ")", "gi"), cleanNameMatch);

  // C. Freistehende akademische Titel: "Dr. Thomas Müller", "Prof. Dr. Schmidt", "Priv.-Doz. Dr. Schmidt"
  clean = clean.replace(new RegExp("(\\b" + titlePattern + ")(" + candidateNames + ")", "gi"), cleanNameMatch);

  // D. "Ich bin [Name]"
  clean = clean.replace(new RegExp("(\\bich\\s+bin\\s+)(" + candidateNames + ")", "gi"), cleanNameMatch);

  return clean;
}

// 5. UTM-Link-Generator
function buildMarketingUrl(baseUrl, clinicId, intent) {
  if (!baseUrl) return "#";
  try {
    let url;
    try {
      url = new URL(baseUrl);
    } catch (e) {
      url = new URL(baseUrl, "https://www.paracelsus-kliniken.de/");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "#";
    }
    url.searchParams.set("utm_source", "paracelsus_wegweiser");
    url.searchParams.set("utm_medium", "chatbot");
    url.searchParams.set("utm_campaign", `routing_${clinicId || "general"}`);
    if (intent) {
      url.searchParams.set("utm_content", String(intent));
    }
    return url.toString();
  } catch (e) {
    return "#";
  }
}

// 6. Kalender-Export (.ics iCalendar Generator für das Smartphone)
function createCalendarEventContent(clinic) {
  if (!clinic) return null;
  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Morgen
  start.setHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 Stunde

  function formatDate(d) {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Paracelsus Kliniken//Digitaler Wegweiser//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:Paracelsus Klinik ${clinic.city} - Kontakt / Sprechstunde`,
    `DESCRIPTION:Klinik: ${clinic.name}\\nTelefon Sekretariat: ${clinic.phone}\\nAdresse: ${clinic.address || clinic.city}\\nWebsite: ${clinic.url}\\n\\nBitte mitbringen: Versichertenkarte, Einweisungsschein, Medikamentenplan.`,
    `LOCATION:${clinic.address || clinic.city}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return ics;
}

// 7. Metropolregionen- & Umland-Mapping (Exakte Wortgrenzen)
const REGION_MAPPING = {
  "duesseldorf-golzheim": [
    "köln", "cologne", "bonn", "dortmund", "essen", "duisburg", "bochum",
    "wuppertal", "krefeld", "mönchengladbach", "neuss", "solingen", "oberhausen",
    "mülheim", "hagen", "leverkusen", "niederrhein", "ruhrpott", "ruhrgebiet"
  ],
  "henstedt-ulzburg": [
    "hamburg", "norderstedt", "kaltenkirchen", "quickborn", "pinneberg",
    "elmshorn", "bad segeberg", "neumünster", "kiel", "lübeck", "ahrensburg",
    "wedel", "alstertal", "schleswig-holstein"
  ],
  "kassel-elena": [
    "göttingen", "fulda", "marburg", "paderborn", "nordhessen", "bad hersfeld",
    "baunatal", "eisenach", "waldeck", "fritzlar", "korbach"
  ],
  "bremen": [
    "oldenburg", "delmenhorst", "bremerhaven", "verden", "vegesack", "osterholz",
    "achim", "syke", "stuhr"
  ],
  "langenhagen-silbersee": [
    "hannover", "celle", "burgwedel", "wedemark", "garbsen", "wunstorf",
    "peine", "hildesheim"
  ],
  "schoeneck": [
    "plauen", "vogtland", "auerbach", "reichenbach", "oelsnitz", "klingenthal",
    "zwickau", "chemnitz", "hof"
  ],
  "muenchen": [
    "augsburg", "rosenheim", "starnberg", "dachau", "freising", "erding",
    "fürstenfeldbruck", "landshut", "oberbayern"
  ]
};

// 8. Sicheres Levenshtein & Fuzzy-Matching
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function safeFuzzyMatch(queryWords, term) {
  if (!term || typeof term !== "string") return false;
  const cleanTerm = term.toLowerCase().trim();
  if (cleanTerm.length < 5) return false;

  for (const word of queryWords) {
    if (STOPWORDS.has(word)) continue;
    if (word.length < 5) continue;
    // Erster Buchstabe muss zwingend übereinstimmen (verhindert cross-topic Verwechslungen)
    if (word[0] !== cleanTerm[0]) continue;

    if (cleanTerm.length <= 7) {
      if (Math.abs(word.length - cleanTerm.length) <= 1 && getLevenshteinDistance(word, cleanTerm) <= 1) {
        return true;
      }
    } else {
      if (Math.abs(word.length - cleanTerm.length) <= 2 && getLevenshteinDistance(word, cleanTerm) <= 2) {
        return true;
      }
    }
  }
  return false;
}

function hasWordBoundary(text, word) {
  if (!text || !word) return false;
  const reg = new RegExp("(?:^|[^a-zäöüß])" + word.toLowerCase().trim() + "(?:[^a-zäöüß]|$)", "i");
  return reg.test(text);
}

function safeIncrement(obj, key) {
  if (!obj || typeof key !== "string" || key === "__proto__") return;
  const current = Object.prototype.hasOwnProperty.call(obj, key) ? Number(obj[key]) || 0 : 0;
  Object.defineProperty(obj, key, {
    value: current + 1,
    writable: true,
    enumerable: true,
    configurable: true
  });
}

// 9. DSGVO-konformer Analytics-Store mit dezentem Feedback
class ParacelsusAnalyticsStore {
  constructor() {
    this.storageKey = "paracelsus_analytics_v4";
    this.data = this.load();
  }

  load() {
    const defaults = {
      totalQueries: 0,
      emergencyAlerts: 0,
      intentCounts: Object.create(null),
      clinicRoutingCounts: Object.create(null),
      contentGaps: [],
      linkClicks: 0,
      calendarDownloads: 0,
      feedback: { ja: 0, maessig: 0, nein: 0 },
      voiceQueries: 0,
      zuweiserQueries: 0,
      languageCounts: { de: 0, en: 0, tr: 0, uk: 0 }
    };
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return Object.assign({}, defaults, parsed, {
            clinicRoutingCounts: Object.assign(Object.create(null), defaults.clinicRoutingCounts, parsed.clinicRoutingCounts),
            intentCounts: Object.assign(Object.create(null), defaults.intentCounts, parsed.intentCounts),
            contentGaps: Array.isArray(parsed.contentGaps) ? parsed.contentGaps : [],
            feedback: Object.assign({}, defaults.feedback, parsed.feedback),
            languageCounts: Object.assign(Object.create(null), defaults.languageCounts, parsed.languageCounts)
          });
        }
      }
    } catch (e) {}
    return defaults;
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {}
  }

  recordQuery(anonymizedQuery, resultType, clinicId, category, isVoice = false, lang = "de") {
    if (!this.data || typeof this.data !== "object") {
      this.data = this.load();
    }
    this.data.totalQueries = (Number(this.data.totalQueries) || 0) + 1;
    if (isVoice) this.data.voiceQueries = (Number(this.data.voiceQueries) || 0) + 1;

    this.data.languageCounts = this.data.languageCounts || {};
    safeIncrement(this.data.languageCounts, lang);

    if (resultType === "emergency") {
      this.data.emergencyAlerts = (Number(this.data.emergencyAlerts) || 0) + 1;
    }
    if (clinicId) {
      this.data.clinicRoutingCounts = this.data.clinicRoutingCounts || {};
      safeIncrement(this.data.clinicRoutingCounts, clinicId);
    }
    if (category) {
      this.data.intentCounts = this.data.intentCounts || {};
      safeIncrement(this.data.intentCounts, category);
    }
    if (category === "Zuweiser & Ärzte") {
      this.data.zuweiserQueries = (Number(this.data.zuweiserQueries) || 0) + 1;
    }
    if (resultType === "fallback") {
      this.data.contentGaps = Array.isArray(this.data.contentGaps) ? this.data.contentGaps : [];
      let scrubbedSnippet = scrubPII(anonymizedQuery || "").substring(0, 50).trim();
      // Mask any residual standalone 2-3 word capitalized person names in fallback queries
      scrubbedSnippet = scrubbedSnippet.replace(/\b[A-ZÄÖÜÀ-ÖØ-ß][a-zäöüßà-öø-ÿ]+(?:\s+[A-ZÄÖÜÀ-ÖØ-ß][a-zäöüßà-öø-ÿ]+){1,2}\b/g, () => "[NAME ANONYMISIERT]");
      if (scrubbedSnippet && !this.data.contentGaps.includes(scrubbedSnippet)) {
        this.data.contentGaps.push(scrubbedSnippet);
        if (this.data.contentGaps.length > 30) this.data.contentGaps.shift();
      }
    }
    this.save();
  }

  recordFeedback(rating) {
    if (!this.data || typeof this.data !== "object") this.data = this.load();
    this.data.feedback = this.data.feedback || { ja: 0, maessig: 0, nein: 0 };
    if (["ja", "maessig", "nein"].includes(rating)) {
      this.data.feedback[rating] = (Number(this.data.feedback[rating]) || 0) + 1;
      this.save();
    }
  }

  recordCalendarDownload() {
    if (!this.data || typeof this.data !== "object") this.data = this.load();
    this.data.calendarDownloads = (Number(this.data.calendarDownloads) || 0) + 1;
    this.save();
  }

  recordClick(type, label) {
    if (!this.data || typeof this.data !== "object") this.data = this.load();
    this.data.linkClicks = (Number(this.data.linkClicks) || 0) + 1;
    this.save();
  }

  getMetrics() {
    return this.data;
  }

  reset() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
    this.data = this.load();
  }
}

/**
 * Semantische Konzept-Expansion für freie Alltagssprache, Laienbeschreibungen & wirre Sätze.
 * Übersetzt umschreibende Patientenformulierungen ohne Fachbegriffe in präzise klinische Konzepte.
 */
const SEMANTIC_CONCEPT_RULES = [
  {
    concept: "Miktions-/Harnwegsbeschwerden → Urologie",
    expansion: "urologie prostata harnblase wasserlassen",
    pattern: /(?:(?:\bpinkel[n]?|\bpipi\b|\bwasser\s*lassen|\bwasserlassen|\burinieren|\bwasser\s*halten|\bharnstrahl|\btröpfelt|\btropft)\b.*?(?:\btut\s*weh|\bschmerz[a-z]*|\bbrennt|\bkaum|\bschwierig[a-z]*|\bnicht\s*richtig|\bschwach|\bständig|\bnachts|\boft|\bproblem[a-z]*))|(?:\b(?:brennt|schmerz[a-z]*|sticht|probleme|schwierigkeiten|kaum)\b.*?\b(?:beim\s*)?(?:pinkeln|wasser\s*lassen|wasserlassen|urinieren))|(?:\bnachts\s+(?:ständig|oft|immer|\d+\s*mal)\s+(?:raus|auf\s*toilette|aufs\s*klo|pinkeln|wasser\s*lassen))|(?:\btröpfelt\s+nur\s+noch\b|\bschwacher\s+harnstrahl\b|\bblut\s+im\s+urin\b|\burin\s+ist\s+(?:rot|blutig)\b|\bkann\s+(?:das\s+|den\s+)?(?:wasser|urin)\s+nicht\s+halten\b|\bunfreiwillig[a-z]*\s+urin[a-z]*\b|\bvorsteherdrüse\b|\bmeine\s+blase\b|\bblasenentzündung\b|\bnierenschmerz[a-z]*\b|\bflankenschmerz[a-z]*\b|\bblase,\s*niere\s+oder\s+prostata\b|\bbeim\s+wasserlassen\b)/i
  },
  {
    concept: "Bewegungsstörung / Tremor → Neurologie & Parkinson",
    expansion: "parkinson neurologie tremor bewegungsstörung",
    pattern: /\b(?:hände\s+zittern|hand\s+zittert|arm\s+zittert|beine\s+zittern|zittern\s+in\s+ruhe|wackelt\s+mit\s+den\s+händen|läuft\s+(?:ganz\s+)?(?:steif|kleinschrittig|gebückt|langsam)|kleine\s+schritte|trippelschritte|friert\s+beim\s+gehen\s+ein|bleibt\s+wie\s+angewurzelt\s+stehen|maskengesicht|schrift\s+wird\s+(?:immer\s+)?kleiner|spricht\s+immer\s+leiser|muskelsteifheit|mein\s+kopf|kopfschmerz[a-z]*|migräne|gleichgewichtsstörung[a-z]*|schwindel,\s*kopf\s+oder\s+zittern)\b/i
  },
  {
    concept: "Gelenkverschleiß & Mobilität → Orthopädie & Endoprothetik",
    expansion: "orthopädie endoprothetik gelenkersatz kniearthrose coxarthrose",
    pattern: /\b(?:kann\s+kaum\s+(?:noch\s+)?(?:laufen|gehen)|kann\s+keine\s+treppen\s+(?:mehr\s+)?steigen|knochen\s+auf\s+knochen|neues\s+knie(?:gelenk)?|neue\s+hüfte|neues\s+hüftgelenk|knie\s+(?:knirscht|blockiert|ist\s+dick|gibt\s+nach|sticht|tut\s+weh)|hüfte\s+(?:sticht|tut\s+weh)|mein\s+knie|meine\s+hüfte|meine\s+schulter|anlaufschmerz[a-z]*\s+(?:im\s+knie|in\s+der\s+hüfte)|schmerzen\s+in\s+der\s+leiste\s+beim\s+gehen)\b/i
  },
  {
    concept: "Rückenschmerz mit Ausstrahlung → Wirbelsäulenzentrum",
    expansion: "wirbelsäulenchirurgie bandscheibenvorfall spinalkanalstenose",
    pattern: /\b(?:hexenschuss|bandscheibe\s+(?:raus[a-z]*|kaputt|verschoben)|wirbel\s+verschoben|schmerz[a-z]*\s+zieht\s+ins\s+bein|beine\s+schlafen\s+beim\s+gehen\s+ein|schaufensterkrankheit|mein\s+rücken|im\s+rücken|rücken\s+tut\s+weh|kreuzschmerz[a-z]*|im\s+kreuz|nackenschmerz[a-z]*|rücken,\s*knie\s+oder\s+hüfte)\b/i
  },
  {
    concept: "Sportverletzung / Gelenktrauma → Sportorthopädie",
    expansion: "sportmedizin sportorthopädie kreuzband meniskus schulter",
    pattern: /\b(?:beim\s+(?:fußball|skifahren|sport|joggen|tennis|handball)\s+.*?(?:knie|schulter|gelenk|verdreht|gerissen|umgeknickt)|sportverletzung|sportunfall|sehne\s+gerissen|bänderriss|schulter\s+ausgekugelt|schulter\s+ausgerenkt)\b/i
  },
  {
    concept: "Bauchwand- / Viszeralbeschwerden → Allgemein- & Viszeralchirurgie",
    expansion: "allgemeinchirurgie viszeralchirurgie hernienchirurgie bauchschmerzen",
    pattern: /\b(?:beule\s+in\s+der\s+leiste|beule\s+am\s+bauchnabel|darm\s+drückt\s+raus|steine\s+in\s+der\s+galle|gallenkolik|knoten\s+an\s+der\s+schilddrüse|kalter\s+knoten|mein\s+bauch|im\s+bauch|bauch\s+tut\s+weh|unterbauch[a-z]*|oberbauch[a-z]*|bauchweh|magenschmerz[a-z]*|magenkrämpfe|magenprobleme|verdauungsprobleme|bauch,\s*magen\s+oder\s+übelkeit)\b/i
  },
  {
    concept: "Entzündliche Gelenkbeschwerden → Internistische Rheumatologie",
    expansion: "rheumatologie polyarthritis",
    pattern: /\b(?:alle\s+gelenke\s+tun\s+weh|finger\s+sind\s+morgens\s+steif|morgensteifigkeit|gelenke\s+geschwollen\s+und\s+(?:heiß|warm)|rheumaschub|entzündete\s+gelenke)\b/i
  },
  {
    concept: "Chronisches Schmerzsyndrom → Multimodale Schmerztherapie",
    expansion: "multimodale schmerztherapie chronische schmerzen",
    pattern: /\b(?:schmerzmittel\s+helfen\s+nicht\s+mehr|schmerzen\s+seit\s+(?:monaten|jahren)|dauerhafte\s+schmerzen\s+am\s+ganzen\s+körper|austherapiert\s+mit\s+schmerzen)\b/i
  },
  {
    concept: "Herz-Kreislauf & Innere Beschwerden → Innere Medizin & Akutversorgung",
    expansion: "innere medizin kardiologie",
    pattern: /\b(?:kreislaufprobleme|bluthochdruck|hoher\s+blutdruck|herzstolpern|herzrhythmus[a-z]*)\b/i
  }
];

function expandSemanticConcepts(query) {
  let expandedQuery = query;
  const detectedConcepts = [];
  for (const rule of SEMANTIC_CONCEPT_RULES) {
    if (rule.pattern.test(query)) {
      detectedConcepts.push(rule.concept);
      expandedQuery += " " + rule.expansion;
    }
  }
  return { expandedQuery, detectedConcepts };
}

/**
 * Phonetische & gesprochene Sprach-Normalisierung (Voice-First / Web Speech API STT).
 * Bereinigt gesprochene Füllwörter, wandelt gesprochene Notrufnummern um und korrigiert
 * typische Spracherkennungs-Hörfehler bei Klinik- und Fachnamen.
 */
function normalizeSpokenAndPhoneticInput(rawQuery) {
  if (!rawQuery || typeof rawQuery !== "string") return "";
  let q = rawQuery;

  // 1. Gesprochene Fülllaute & Einleitungsfloskeln am Satzanfang glätten
  q = q.replace(/^(?:(?:ähm+|äh+|hm+|mh+|naja|nun\s*ja|also|ja\s+hallo|sag\s+mal|entschuldigung|verzeihung)[,.\s!]+)+/i, "");
  q = q.replace(/^(?:ich\s+hätte\s+(?:da\s+)?mal\s+eine\s+frage(?:\s+und\s+zwar)?|ich\s+wollte\s+(?:nur\s+)?mal\s+(?:kurz\s+)?(?:fragen|wissen)|können\s+sie\s+mir\s+(?:bitte\s+)?(?:mal\s+)?sagen|wissen\s+sie\s+vielleicht)[,:.\s]+/i, "");

  // 2. Gesprochene Zahlen für Notruf & Bereitschaftsdienst
  q = q
    .replace(/\b(?:eins\s+eins\s+zwei|hundertzwölf|ein\s*hundert\s*zwölf)\b/gi, "112")
    .replace(/\b(?:eins\s+eins\s+sechs\s+eins\s+eins\s+sieben|elf\s+sechs\s+elf\s+sieben)\b/gi, "116 117");

  // 3. Phonetische STT-Korrekturen für Paracelsus-Kliniken & Medizinbegriffe
  q = q
    .replace(/\b(?:parazelsus|para\s*celsus|paracelsius)\b/gi, "paracelsus")
    .replace(/\b(?:goldheim|golds\s*heim|golz\s*heim)\b/gi, "golzheim")
    .replace(/\b(?:helene[\s-]*klinik|ellena[\s-]*klinik|elena\s+klinik)\b/gi, "elena-klinik")
    .replace(/\b(?:hennstedt|hänstedt|hensted)(?:[\s-]*ulzburg)?\b/gi, "henstedt-ulzburg")
    .replace(/\bsilber\s+see\b/gi, "silbersee")
    .replace(/\b(?:schönegg|schönek)\b/gi, "schöneck")
    .replace(/\b(?:dawinschi|da\s+vinci|davinschi)\b/gi, "davinci")
    .replace(/\bprostata\s+krebs\b/gi, "prostatakrebs")
    .replace(/\bbandscheiben\s+vorfall\b/gi, "bandscheibenvorfall")
    .replace(/\bendo\s*prothetik\b/gi, "endoprothetik");

  return q.trim();
}

/**
 * Granularer 8-Kategorien-Klassifikator für fachfremde & sicherheitskritische Anfragen (Closed-World-Firewall).
 * Trennt sauber zwischen Klinik-/Gesundheitsthemen und externen Alltagsthemen oder Prompt-Injections.
 */
const UNRELATED_QUERY_CATEGORIES = [
  {
    id: "prompt-injection-security",
    categoryLabel: "Sicherheits-Firewall: Rollenwechsel / Prompt-Injection abgewehrt",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:ignoriere\s+(?:alle\s+)?(?:vorherigen\s+|bisherigen\s+|obigen\s+)?(?:anweisungen|regeln|instruktionen)|ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions|forget\s+(?:all\s+)?instructions|system\s*prompt|systemprompt|du\s+bist\s+jetzt\s+(?:ein|kein)|act\s+as\s+(?:a|an)|jailbreak|dan\s+mode|developer\s+mode|verrate\s+mir\s+deine\s+(?:internen\s+)?regeln|bypass\s+safety)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "weather-travel-traffic",
    categoryLabel: "Nicht-klinische Anfrage: Wetter, Urlaub & Reise",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:wetter(?:bericht|vorhersage)?|wird\s+es\s+(?:heute\s+|morgen\s+)?regnen|sonnenschein|außentemperatur|urlaubsreise|flug\s+buchen|flugbuchung|hotel\s+buchen|pauschalreise|sommerzeit|winterzeit|zeitumstellung)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "cooking-food-shopping",
    categoryLabel: "Nicht-klinische Anfrage: Kochen, Rezepte & Shopping",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:backrezept[a-z]*|kochrezept[a-z]*|pfannkuchen|kuchen\s+backen|pizza\s+bestellen|rezept\s+für\s+(?:kuchen|pfannkuchen|torte|suppe|pasta|nudeln|brot|kekse|plätzchen)|nudeln\s+kochen|supermarkt|onlineshop|rabattcode|gutscheincode|amazon|zalando|ikea|ebay)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "sports-entertainment-jokes",
    categoryLabel: "Nicht-klinische Anfrage: Sport, Unterhaltung & Witze",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:fußball(?:spiel|ergebnis|meister|tabelle)?|bundesliga|champions\s+league|weltmeister(?:schaft)?|erzähl\s+(?:mir\s+)?einen\s+witz|kennst\s+du\s+einen\s+witz|witz\s+erzählen|schreib\s+(?:mir\s+)?ein\s+gedicht|gedicht\s+schreiben|kinoprogramm|netflix|spotify|horoskop|sternzeichen|lottozahlen)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "finance-tax-legal",
    categoryLabel: "Nicht-klinische Anfrage: Finanzen, Steuern & Behörden",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:steuererklärung|finanzamt|aktienkurs[a-z]*|dax(?:-kurs)?|kryptowährung[a-z]*|bitcoin|ethereum|etf(?:-sparplan)?|baufinanzierung|kredit\s+aufnehmen|mietvertrag|strafzettel|bußgeldbescheid|reisepass\s+beantragen)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "school-homework-trivia",
    categoryLabel: "Nicht-klinische Anfrage: Schule, Hausaufgaben & Allgemeinwissen",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:hausaufgaben|matheaufgabe[a-z]*|quadratwurzel|satz\s+des\s+pythagoras|hauptstadt\s+von\s+[a-zäöüß]+|wer\s+war\s+(?:napoleon|caesar|goethe|einstein)|wie\s+hoch\s+ist\s+der\s+mount\s+everest|wie\s+weit\s+ist\s+der\s+mond|aufsatz\s+schreiben|referat\s+schreiben)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "it-coding-techsupport",
    categoryLabel: "Nicht-klinische Anfrage: Programmierung & allgemeiner IT-Support",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:programmier[a-z]*|python(?:\s*-?script|\s*-?code)?|javascript|typescript|html\s*code|sql\s*datenbank|excel\s*formel|windows\s*update|mein\s+drucker\s+geht\s+nicht|grafikkarte|playstation|xbox)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  },
  {
    id: "politics-world-affairs",
    categoryLabel: "Nicht-klinische Anfrage: Politik & Weltgeschehen",
    title: "Paracelsus Klinik-Assistent",
    pattern: /\b(?:politik|bundestagswahl|landtagswahl|parteiprogramm|wahlprogramm|bundeskanzler[a-z]*|außenpolitik|wer\s+gewinnt\s+die\s+wahl|klimakonferenz)\b/i,
    reason: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid."
  }
];

function classifyUnrelatedQuery(query) {
  if (!query || typeof query !== "string") return null;
  for (const cat of UNRELATED_QUERY_CATEGORIES) {
    if (cat.pattern.test(query)) {
      return cat;
    }
  }
  return null;
}

/**
 * Erzeugt eine natürlich sprechbare Kurzfassung (Spoken Summary) für Sprachausgabe / Vorlesefunktion (TTS).
 */
function stripHtmlAndMarkdownForSpeech(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/li>/gi, ". ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[•→🔒🧠]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generateSpokenSummary(res) {
  if (!res || typeof res !== "object") return "";
  if (res.spokenSummary && typeof res.spokenSummary === "string") return res.spokenSummary;

  if (res.type === "emergency") {
    return stripHtmlAndMarkdownForSpeech(
      `Achtung, medizinischer Notfall: ${res.alertTitle || ""}. ${res.message || ""} ${res.guidance || ""}`
    );
  }

  if (res.type === "match" && res.clinic) {
    const cleanMsg = stripHtmlAndMarkdownForSpeech(res.message || "");
    return `${res.title || res.clinic.name}. ${cleanMsg} Du erreichst uns telefonisch unter ${res.clinic.phone}.`;
  }

  const cleanBody = stripHtmlAndMarkdownForSpeech(res.message || "");
  const sentences = cleanBody.split(/(?<=[.!?])\s+/).filter(Boolean);
  const conciseBody = sentences.slice(0, 3).join(" ");
  const prefix = res.title ? `${stripHtmlAndMarkdownForSpeech(res.title)}. ` : "";
  const clinicSuffix = (res.clinic && res.clinic.phone) ? ` Zuständiger Standort: ${res.clinic.name}, Telefon ${res.clinic.phone}.` : "";
  return (prefix + (conciseBody || cleanBody) + clinicSuffix).trim();
}

// 10. Wissenssuche über die Website-Wissensbasis (data/website-wissen.js)
// Grundsatz: Der Wegweiser sagt nur, was auf paracelsus-kliniken.de steht. Fakten
// (Namen, Titel, Telefonnummern, Texte, Links) kommen ausschließlich aus dem
// Website-Abgleich. Hier steht nur, wie eine Frage verstanden und zugeordnet wird.

let LOADED_WEBSITE_WISSEN = null;
if (typeof window !== "undefined" && window.PARACELSUS_WEBSITE_WISSEN) {
  LOADED_WEBSITE_WISSEN = window.PARACELSUS_WEBSITE_WISSEN;
} else if (typeof require === "function") {
  try {
    LOADED_WEBSITE_WISSEN = require("../data/website-wissen.js");
  } catch (e) {
    LOADED_WEBSITE_WISSEN = null;
  }
}

const SUCH_STOPP = new Set((
  "ich du er sie es wir ihr mein meine meinen meinem meiner dein deine deinen deinem deiner euch euer eure uns unser unsere " +
  "habe hab hast hat haben hatte bin bist ist sind war waren werde wird werden wurde kann kannst koennen koennte muss musst muessen " +
  "soll sollte will willst wollen moechte moechten darf duerfen brauche brauchen brauch suche suchen such gibt gebe geben geht gehen " +
  "bitte danke hallo guten tag morgen abend moin hi hey servus " +
  "wo wie was wann warum wer wohin woher welche welcher welches welchen wem wen wieso " +
  "ein eine einer eines einem einen der die das den dem des und oder aber denn fuer mit nach von vom bei beim seit ueber unter vor " +
  "zwischen zu zum zur in im an am auf aus als ob dass da dort hier jetzt mal schon noch auch immer wieder sehr viel viele etwas " +
  "nicht kein keine keinen nur so ja nein doch man mir mich dir dich ihm ihn ihnen " +
  "wochen woche tagen tage monaten monate jahren jahre lange laenger heute gestern " +
  "wohne wohnen wohnt lebe leben komme kommen kommt bekomme bekommen " +
  "frage fragen wissen sagen sag info infos information informationen thema neue neuen neues " +
  "paracelsus klinik kliniken krankenhaus hospital hilfe helfen hilft gerne gern eigentlich genau wegen " +
  "vater mutter papa mama oma opa frau mann sohn tochter bruder schwester partner partnerin freund freundin angehoerige angehoeriger " +
  "hin her hingehen gut besser bald schnell dringend unbedingt irgendwie leider ganz ziemlich total stark starke starken schlimm schlimme " +
  "krass krasse krassen krasser heftig heftige heftigen arg arge extrem extreme extremen richtig echt wirklich einfach voll mega gerade grad tierisch hoellisch weh fies fiese fiesen starker starkes schlimmen schlimmer " +
  "sich offen geoeffnet laeuft ablauf jetzt eigentlich mehr kostet kosten preis preise teuer bringt um heben dauernd nachts aufs behandelt behandeln beim " +
  "seitdem ploetzlich oft manchmal staendig geboren heisse name tut tun macht machen kriege kriegen anonymisiert datum habt hattet seid nen son bringen bringe euch auch"
).split(" "));

// Alltagswörter -> Begriffe, die auf der Website vorkommen (nur Verständnis, keine Fakten)
const LAIEN_BEGRIFFE = {
  herz: ["kardiologie", "gefaesse"], kardiologie: ["herz", "gefaesse", "innere"], kardiologe: ["herz", "kardiologie"],
  herzstolpern: ["herz", "kardiologie"], blutdruck: ["herz", "gefaesse", "innere"],
  zittern: ["parkinson", "tremor", "bewegungsstoerungen"], zittert: ["parkinson", "tremor"], tremor: ["parkinson"],
  pinkeln: ["blase", "urologie", "prostata"], wasserlassen: ["blase", "urologie", "prostata"], urin: ["blase", "niere", "urologie"],
  harn: ["blase", "urologie"], urologe: ["urologie"], potenz: ["andrologie", "urologie"], erektion: ["andrologie", "urologie"],
  bandscheibe: ["ruecken", "wirbelsaeule", "bandscheibenvorfall"], hexenschuss: ["ruecken", "wirbelsaeule"], kreuz: ["ruecken"],
  ischias: ["ruecken", "wirbelsaeule"], nacken: ["ruecken", "wirbelsaeule", "hals"],
  gelenk: ["gelenkersatz", "endoprothetik", "orthopaedie"], prothese: ["gelenkersatz", "endoprothetik"],
  kunstgelenk: ["gelenkersatz", "endoprothetik"], arthrose: ["orthopaedie", "gelenkersatz"],
  orthopaede: ["orthopaedie"], orthopaedisch: ["orthopaedie"], neurologisch: ["neurologie"], neurologe: ["neurologie"],
  magen: ["bauch", "darm", "gastroenterologie"], bauch: ["magen", "darm"], bauchschmerzen: ["bauch", "magen", "darm"],
  darmspiegelung: ["darm", "gastroenterologie", "koloskopie"], magenspiegelung: ["magen", "gastroenterologie", "gastroskopie"],
  galle: ["bauch", "gallenblase", "viszeralchirurgie"], leistenbruch: ["hernie", "hernien", "viszeralchirurgie"], blinddarm: ["bauch", "viszeralchirurgie"],
  krebs: ["onkologie", "tumor"], tumor: ["krebs", "onkologie"], chemo: ["onkologie", "krebs"],
  op: ["operation", "operieren"], operation: ["operieren", "chirurgie"], narkose: ["anaesthesie", "anaesthesiologie"],
  betaeubung: ["narkose", "anaesthesie"], schmerzen: ["schmerz"], schmerz: ["schmerztherapie", "schmerzmedizin"],
  besuch: ["besuchszeiten", "besucher"], besuchen: ["besuchszeiten", "besucher"], besuchszeit: ["besuchszeiten"],
  bus: ["anfahrt"], bahn: ["anfahrt"], zug: ["anfahrt"], oepnv: ["anfahrt"], weg: ["anfahrt"], hinkommen: ["anfahrt"],
  parken: ["parkplatz", "parkplaetze", "anfahrt"], parkplatz: ["parken", "anfahrt"], auto: ["anfahrt", "parken"],
  essen: ["verpflegung", "speisen", "mahlzeiten"], wlan: ["internet", "wifi"], internet: ["wlan"], fernsehen: ["fernseher", "tv"],
  einzelzimmer: ["wahlleistungen", "komfort", "zimmer"], privat: ["wahlleistungen", "komfort"],
  mitbringen: ["aufnahme", "unterlagen"], checkliste: ["aufnahme", "mitbringen", "unterlagen"], kofferliste: ["aufnahme", "mitbringen"], packliste: ["aufnahme", "mitbringen"], koffer: ["aufnahme", "unterlagen", "mitbringen"], einweisung: ["aufnahme", "krankenhauseinweisung"],
  entlassung: ["entlassmanagement", "entlassen"], reha: ["rehabilitation", "anschlussheilbehandlung", "entlassmanagement"],
  beschweren: ["lob", "kritik", "beschwerde"], beschwerde: ["lob", "kritik"], feedback: ["lob", "kritik"],
  kind: ["kinder", "jugendliche"], kinder: ["jugendliche"], hno: ["hals", "nase", "ohren", "ohr"], ohr: ["ohren", "hno"],
  kiefer: ["mund", "kieferchirurgie"], zahn: ["mund", "kiefer"], haut: ["gewebe"], lunge: ["atmung", "pneumologie"],
  husten: ["lunge", "atmung"], atemnot: ["lunge", "atmung"], luft: ["lunge", "atmung"],
  diabetes: ["stoffwechsel", "druesen", "innere"], schilddruese: ["stoffwechsel", "druesen"], zucker: ["diabetes", "stoffwechsel"],
  alter: ["geriatrie", "akutgeriatrie"], senioren: ["geriatrie"], sterben: ["palliativmedizin"], palliativ: ["palliativmedizin"],
  roboter: ["robotik", "davinci", "mako"], davinci: ["robotik"], sport: ["sportmedizin", "sportverletzungen"],
  fuss: ["bein"], hand: ["arm"], schulter: ["ellenbogen"], huefte: ["becken", "hueftgelenk"], knie: ["kniegelenk"],
  roentgen: ["radiologie"], mrt: ["radiologie"], ct: ["radiologie"], physio: ["physiotherapie"], krankengymnastik: ["physiotherapie"],
  gestuerzt: ["sturz", "unfallchirurgie", "verletzungen"], sturz: ["unfallchirurgie", "verletzungen"], hingefallen: ["sturz", "unfallchirurgie", "verletzungen"],
  gefallen: ["sturz", "unfallchirurgie"], laufen: ["gehen", "bein"], brust: ["herz", "lunge"], stechen: ["schmerz"], schwindel: ["neurologie", "hals"],
  kopfschmerzen: ["neurologie", "schmerz"], migraene: ["neurologie", "schmerz"], vergesslich: ["demenz", "geriatrie"], demenz: ["geriatrie", "neurologie"],
  schlaganfall: ["neurologie"], gicht: ["gelenk", "rheuma"], rheuma: ["rheumaorthopaedie", "gelenk"], steine: ["nierensteine", "steinzentrum"],
  notaufnahme: ["notfall", "notfallmedizin"], unfall: ["unfallchirurgie", "verletzungen"], gebrochen: ["bruch", "unfallchirurgie"],
  taub: ["taubheitsgefuehle", "nerv", "neurologie"], taube: ["taubheitsgefuehle", "nerv", "neurologie"], taubheit: ["taubheitsgefuehle", "nerv", "neurologie"], kribbeln: ["taubheitsgefuehle", "nerv"],
  blasenentzuendung: ["urologie", "harnwege"], harnwegsinfekt: ["urologie", "harnwege"],
  fussball: ["sportverletzungen", "sportmedizin"], handball: ["sportverletzungen", "sportmedizin"], joggen: ["sportverletzungen", "sportmedizin"],
  herzrasen: ["herz", "kardiologie", "herzrhythmus"], handy: ["telefon", "mobiltelefon"],
  ruecken: ["rueckenschmerzen", "wirbelsaeule"], pinkel: ["urin", "blase", "urologie"], pinkle: ["urin", "blase", "urologie"], pipi: ["urin", "blase", "urologie"],
  klo: ["harndrang", "wasserlassen", "blase"], toilette: ["harndrang", "wasserlassen", "blase"], verwirrt: ["demenz", "geriatrie"], stuerzt: ["sturz", "geriatrie"],
  ohrenschmerzen: ["ohren", "hno", "hals", "nase"], ohren: ["hno", "hals", "nase"], tep: ["endoprothetik", "gelenkersatz"],
  uebernachten: ["begleitperson"], begleitung: ["begleitperson"], kardiologe: ["kardiologie", "herz"], kardiologen: ["kardiologie", "herz"],
  job: ["karriere"], ausbildung: ["karriere"], bewerbung: ["karriere"], stelle: ["karriere"]
};

function wsFalte(text) {
  return String(text || "").toLowerCase().normalize("NFC")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

function wsStamm(w) {
  if (w.length <= 5) return w;
  for (const e of ["ungen", "innen", "ern", "en", "er", "es", "em", "e", "n", "s"]) {
    if (w.endsWith(e) && w.length - e.length >= 4) return w.slice(0, -e.length);
  }
  return w;
}

function wsWoerter(text) {
  return wsFalte(text).split(" ").filter((w) => w.length >= 2 && !/^\d+$/.test(w));
}

function wsHtml(text) {
  return String(text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wsKuerze(text, max) {
  const t = String(text || "").trim();
  if (t.length <= max) return t;
  const schnitt = t.slice(0, max);
  const ende = Math.max(schnitt.lastIndexOf(". "), schnitt.lastIndexOf("\n"));
  return (ende > max * 0.5 ? schnitt.slice(0, ende + 1) : schnitt.slice(0, schnitt.lastIndexOf(" ")) + " …").trim();
}

// Zusammengesetzte Wörter: „Besuchs|zeiten“, „Zahn|schmerzen“ zählen als Treffer für den Wortanfang, „Rest|less“ nicht
const WS_ENDUNGEN = "schmerz weh beschwerd problem zeit krebs operation verletz bruch arzt aerzt klinik praxis zentrum therap behandl untersuch chirurg spiegel erkrank platz plaetz gelenk stoer station abteil termin sprechstund rasen stolper schwaech".split(" ");
function wsEndungBekannt(rest) {
  if (/^(?:ung|ungen|en|er|es|em|e|n|s|ern|in|innen|ion|ionen)$/.test(rest)) return true; // bloße Beugung
  for (const r of [rest, rest.replace(/^(?:es|en|s|n)/, "")]) {
    for (const e of WS_ENDUNGEN) {
      if (r === "op" || r.startsWith(e)) return true;
      if (e.length >= 6 && r.length >= e.length && getLevenshteinDistance(r.slice(0, e.length + 1), e) <= 1) return true;
    }
  }
  return false;
}

function wsGross(text) {
  const t = String(text || "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function wsKm(a, b) {
  const r = Math.PI / 180;
  const x = (b[1] - a[1]) * r * Math.cos(((a[0] + b[0]) / 2) * r);
  const y = (b[0] - a[0]) * r;
  return Math.sqrt(x * x + y * y) * 6371;
}

const AUFENTHALT_TYPEN = ["a-z", "aufenthalt", "kontakt", "startseite", "leitung"];
const KEIN_NAME = new Set("prof univ mudr medic chefarzt chefaerztin oberarzt oberaerztin leitender leitende leiter leiterin facharzt fachaerztin aerztlicher aerztliche direktor direktorin sektionsleiter sektionsleiterin abteilung klinik zentrum fuer und team sekretariat praxis orthopaedie urologie chirurgie neurologie anaesthesie anaesthesiologie innere medizin geriatrie radiologie kardiologie pflege pflegedirektor pflegedirektorin geschaeftsfuehrer geschaeftsfuehrerin verwaltung paracelsus unfallchirurgie allgemein viszeralchirurgie".split(" "));

class ParacelsusWissensSuche {
  constructor(wissen) {
    this.wissen = wissen && Array.isArray(wissen.seiten) ? wissen : { meta: {}, standorte: [], seiten: [] };
    this.standorte = this.wissen.standorte || [];
    this.staedte = (this.wissen.meta && this.wissen.meta.staedte) || {};
    this.personenNamen = new Set();
    this.docs = [];
    this.index = new Map(); // Wort -> [[docNr, Gewicht], …]
    this._trefferCache = new Map();
    this._baue();
  }

  _baue() {
    const fuege = (karte, text, gewicht) => {
      for (const w of wsWoerter(text)) {
        if (SUCH_STOPP.has(w)) continue;
        const s = wsStamm(w);
        karte.set(s, (karte.get(s) || 0) + gewicht);
      }
    };
    this.wissen.seiten.forEach((seite, si) => {
      seite.e.forEach((e, ei) => {
        if (!e.t && !e.x) return;
        const karte = new Map();
        fuege(karte, e.t, 3);
        fuege(karte, seite.titel, 1.2);
        const imTitel = new Set(karte.keys());
        fuege(karte, e.x, 1);
        if (karte.size === 0) return;
        const nr = this.docs.length;
        this.docs.push({ si, ei, s: seite.s, typ: seite.typ, p: e.p });
        if (e.p && e.t) for (const w of wsFalte(e.t).split(" ")) if (w.length >= 4 && !KEIN_NAME.has(w)) this.personenNamen.add(w);
        for (const [w, g] of karte) {
          if (!this.index.has(w)) this.index.set(w, []);
          this.index.get(w).push([nr, Math.min(g, 3) + Math.log(1 + Math.max(0, g - 3)) * 0.5, imTitel.has(w) ? 1 : 0]);
        }
      });
    });
    this.vokabular = [...this.index.keys()];
  }

  standort(id) {
    return this.standorte.find((s) => s.id === id) || null;
  }

  seitenVon(standortId, typ) {
    return this.wissen.seiten.filter((s) => s.s === standortId && (!typ || s.typ === typ));
  }

  /** Erkennt den Standort aus der Frage: direkt genannt oder nächstgelegene Klinik zu einer Stadt. */
  erkenneStandort(frage) {
    const f = " " + wsFalte(frage) + " ";
    const willMvz = /\b(mvz|praxis|praxen|sprechstunde)\b/.test(f);
    let direkt = null;
    for (const st of this.standorte) {
      const namen = (st.ortsnamen || []).concat([st.ort]).map(wsFalte);
      if (namen.some((n) => n && f.includes(" " + n + " "))) {
        if (!direkt || (willMvz && st.art === "mvz") || (!willMvz && st.art === "klinik" && direkt.art !== "klinik")) direkt = st;
      }
    }
    if (direkt) return { id: direkt.id, art: "direkt", woerter: (direkt.ortsnamen || []).concat([direkt.ort]).map(wsFalte) };

    // Tippfehler im Ortsnamen („Brmen“): nur lange Namen, ein Buchstabe Abweichung
    const NICHT_ORT = new Set(["kasse", "kassen", "kessel", "kassiert", "bremse", "bremsen"]);
    for (const w of f.trim().split(" ")) {
      if (w.length < 5 || NICHT_ORT.has(w)) continue;
      for (const st of this.standorte) {
        if (st.art !== "klinik") continue;
        for (const name of (st.ortsnamen || []).concat([st.ort]).map(wsFalte)) {
          if (name.length >= 6 && !name.includes(" ") && name[0] === w[0] && Math.abs(name.length - w.length) <= 1 && getLevenshteinDistance(name, w) === 1) {
            return { id: st.id, art: "direkt", woerter: (st.ortsnamen || []).concat([st.ort]).map(wsFalte).concat([w]) };
          }
        }
      }
    }

    // Städtenamen, die auch Alltagswörter sind, gelten nur mit Ortsangabe davor („in Essen“, „aus Halle“)
    const DOPPELDEUTIG = new Set(["essen", "halle", "hagen", "hof", "verden"]);
    for (const [stadt, pos] of Object.entries(this.staedte)) {
      const n = wsFalte(stadt);
      if (!f.includes(" " + n + " ")) continue;
      if (DOPPELDEUTIG.has(n) && !new RegExp(" (?:aus|in|bei|nach|von|um|naehe|nahe|raum|richtung) (?:der |dem |von )?" + n + " ").test(f)) continue;
      const naechste = this.standorte
        .filter((s) => s.art === "klinik" && typeof s.lat === "number")
        .map((s) => ({ s, km: wsKm(pos, [s.lat, s.lon]) }))
        .sort((a, b) => a.km - b.km);
      if (naechste.length) {
        return { id: naechste[0].s.id, art: "naehe", stadt, km: Math.round(naechste[0].km), reihenfolge: naechste.map((x) => x.s.id), woerter: [n] };
      }
    }
    return null;
  }

  _vokabelTreffer(q) {
    if (this._trefferCache.has(q)) return this._trefferCache.get(q);
    const liste = [];
    for (const v of this.vokabular) {
      let g = 0;
      if (v === q) g = 1;
      else if (q.length >= 4 && v.length >= 4 && v.startsWith(q)) g = 0.7;
      else if (q.length >= 4 && v.length >= 4 && q.startsWith(v)) g = (q.length - v.length >= 3 && !wsEndungBekannt(q.slice(v.length))) ? 0.35 : 0.7;
      else if (q.length >= 5 && v.length >= 5 && (v.includes(q) || q.includes(v))) g = 0.5;
      else if (q.length >= 6 && Math.abs(v.length - q.length) <= 1 && v[0] === q[0] && getLevenshteinDistance(v, q) <= 1) g = 0.6;
      if (g) liste.push([v, g]);
    }
    this._trefferCache.set(q, liste);
    return liste;
  }

  /** Zerlegt die Frage in Suchwörter (ohne Füllwörter und Ortsnamen), ergänzt um Alltagsbegriffe. */
  suchwoerter(frage, ohne) {
    const raus = new Set((ohne || []).flatMap((o) => o.split(" ")));
    const kern = [];
    for (const w of wsWoerter(frage)) {
      if (SUCH_STOPP.has(w) || raus.has(w)) continue;
      if (!kern.includes(w)) kern.push(w);
    }
    const zusatz = [];
    for (const w of kern) {
      const mehr = LAIEN_BEGRIFFE[w] || LAIEN_BEGRIFFE[wsStamm(w)];
      if (mehr) for (const m of mehr) if (!kern.includes(m) && !zusatz.includes(m)) zusatz.push(m);
    }
    return { kern, zusatz };
  }

  /**
   * Sucht Einträge. optionen: { standort, verwandte:[ids], nurPersonen, nurStandort, typen:[…], ohneWoerter, max }
   * Liefert [{ seite, eintrag, punkte, abdeckung }] absteigend.
   */
  suche(frage, optionen = {}) {
    const { kern, zusatz } = this.suchwoerter(frage, optionen.ohneWoerter);
    if (kern.length === 0) return [];
    const N = this.docs.length || 1;
    const punkte = new Map();
    const getroffen = new Map();
    const titelTreffer = new Map();
    const lauf = (wort, faktor, kernNr, guete) => {
      const proDoc = new Map();
      const qual = new Map();
      for (const [v, g] of this._vokabelTreffer(wsStamm(wort))) {
        const post = this.index.get(v);
        const idf = Math.log(1 + N / post.length);
        for (const [nr, gew, tit] of post) {
          if (tit && g >= 0.6) {
            if (!titelTreffer.has(nr)) titelTreffer.set(nr, new Set());
            titelTreffer.get(nr).add(kernNr);
          }
          const p = idf * gew * g * faktor;
          if (p > (proDoc.get(nr) || 0)) proDoc.set(nr, p);
          const q = g * guete;
          if (q > (qual.get(nr) || 0)) qual.set(nr, q);
        }
      }
      for (const [nr, p] of proDoc) {
        punkte.set(nr, (punkte.get(nr) || 0) + p);
        if (!getroffen.has(nr)) getroffen.set(nr, new Map());
        const m = getroffen.get(nr);
        if ((qual.get(nr) || 0) > (m.get(kernNr) || 0)) m.set(kernNr, qual.get(nr));
      }
    };
    kern.forEach((w, i) => {
      lauf(w, 1, i, 1);
      // Alltagsbegriffe zählen für dasselbe Kernwort mit („Herz“ trifft auch „Kardiologie“)
      const mehr = LAIEN_BEGRIFFE[w] || LAIEN_BEGRIFFE[wsStamm(w)] || [];
      for (const m of mehr) lauf(m, 0.5, i, 0.9);
    });

    // Für die Abdeckung zählen nur Wörter, die die Website überhaupt kennt (nicht bloß als Wortteil)
    const kennt = (w) => this._vokabelTreffer(wsStamm(w)).some((v) => v[1] >= 0.6);
    const zaehlt = kern.map((w) => kennt(w) || (LAIEN_BEGRIFFE[w] || LAIEN_BEGRIFFE[wsStamm(w)] || []).some(kennt));
    const bekannt = zaehlt.filter(Boolean).length;
    if (bekannt === 0) return [];
    // Wörter, die die Website gar nicht kennt, zählen halb mit: „Restless Legs“ ist kein Treffer für „Rest“
    const nenner = bekannt + 0.5 * (zaehlt.length - bekannt);
    const verwandte = new Set(optionen.verwandte || []);
    const fragtNachKrebs = /tumor|krebs|karzinom|metastas|onkolog|chemo|bestrahl/.test(wsFalte(frage));
    const ergebnis = [];
    for (const [nr, p0] of punkte) {
      const d = this.docs[nr];
      if (optionen.nurPersonen && !d.p) continue;
      if (optionen.typen && !optionen.typen.includes(d.typ)) continue;
      let p = p0;
      let summe = 0;
      for (const [k, q] of getroffen.get(nr)) if (zaehlt[k]) summe += q;
      const abdeckung = summe / nenner;
      p *= 0.35 + 0.65 * abdeckung;
      let imTitel = 0;
      if (titelTreffer.has(nr)) for (const k of titelTreffer.get(nr)) if (zaehlt[k]) imTitel++;
      const titel = imTitel / bekannt;
      p *= 0.8 + 0.5 * titel;
      if (optionen.standort) {
        if (d.s === optionen.standort) p *= 1.7;
        else if (verwandte.has(d.s)) p *= 1.35;
        else if (d.s) p *= optionen.nurStandort ? 0 : 0.45;
      } else if (d.typ === "allgemein") {
        p *= 1.25; // ohne Ort ist die standortübergreifende Seite die bessere Antwort
      }
      if (d.p && !optionen.nurPersonen) p *= 0.5;
      if (!fragtNachKrebs && /tumor|krebs|karzinom|metastas|onkolog/i.test(this.wissen.seiten[d.si].e[d.ei].t || "")) continue;
      if (d.typ === "startseite" || d.typ === "leitung") p *= 0.75;
      if (p <= 0) continue;
      const seite = this.wissen.seiten[d.si];
      ergebnis.push({ seite, eintrag: seite.e[d.ei], punkte: p, abdeckung, titel });
    }
    ergebnis.sort((a, b) => b.punkte - a.punkte);
    return ergebnis.slice(0, optionen.max || 12);
  }
}

// 11. Haupt-Bot-Engine
const HINWEIS_WEGWEISER = "Ich bin ein Wegweiser und ersetze kein ärztliches Gespräch. Im Notfall wähle 112.";
const ABSICHTS_WOERTER = /^(telefon|telefonnummer|nummer|anrufen|erreichen|erreiche|adresse|anschrift|kontakt|zentrale|ansprechpartner|termin|termine|terminvereinbarung|buchen|vereinbaren|doctolib|online|chefarzt|chefaerztin|chefaerzte|oberarzt|oberaerztin|arzt|aerztin|aerzte|doktor|leiter|leiterin|leitung|leitet|team|fachbereich|fachbereiche|abteilung|abteilungen|leistungen|angebot|standort|standorte|alle|anzeigen|uebersicht|mvz|praxis|praxen|anderer|andere)$/;

class ParacelsusBotEngine {
  /**
   * @param {Array|Object} standorteOderWissen  Altes Format (Standortliste) oder direkt die Website-Wissensbasis
   * @param {Object} [wissen]                   Website-Wissensbasis (data/website-wissen.js)
   */
  constructor(standorteOderWissen, wissen) {
    let w = wissen;
    if (!w || !Array.isArray(w.seiten)) {
      w = standorteOderWissen && Array.isArray(standorteOderWissen.seiten) ? standorteOderWissen : LOADED_WEBSITE_WISSEN;
    }
    this.suche = new ParacelsusWissensSuche(w);
    this.wissen = this.suche.wissen;
    this.standorte = this.suche.standorte.map((s) => this._klinikKarte(s));
    this.analytics = new ParacelsusAnalyticsStore();
    this.currentLanguage = "de";
    this.context = { lastClinicId: null, lastClinicName: null, lastThema: null, turnCount: 0 };
  }

  setLanguage(lang) {
    if (["de", "en", "tr", "uk"].includes(lang)) this.currentLanguage = lang;
    return this.currentLanguage;
  }

  setClinicContext(idOderOrt) {
    if (!idOderOrt) { this.context.lastClinicId = null; this.context.lastClinicName = null; return null; }
    const erkannt = this.suche.standort(String(idOderOrt)) || this.suche.erkenneStandort(String(idOderOrt)) || {};
    const st = erkannt.id ? this.suche.standort(erkannt.id) : null;
    if (st) { this.context.lastClinicId = st.id; this.context.lastClinicName = st.name; }
    return st ? this._klinikKarte(st) : null;
  }

  resetContext() {
    this.context = { lastClinicId: null, lastClinicName: null, lastThema: null, turnCount: 0 };
  }

  getHealthCheck() {
    const m = this.wissen.meta || {};
    return {
      status: this.wissen.seiten.length > 0 ? "ok" : "keine-wissensbasis",
      version: "6.0.0",
      standorteCount: this.standorte.length,
      knowledgeEntriesCount: m.eintraege || 0,
      seiten: m.seiten || 0,
      wissensstand: m.erzeugt || null,
      quelle: m.quelle || null
    };
  }

  // ---------------------------------------------------------------- Bausteine

  _klinikKarte(st) {
    if (!st) return null;
    const adresse = [st.strasse, st.plzOrt].filter(Boolean).join(", ");
    const fach = this.suche.seitenVon(st.id, "fachbereich").map((s) => s.titel.replace(/^Fachbereich\s*/i, "")).filter(Boolean).slice(0, 3);
    return {
      id: st.id,
      name: st.name || ("Paracelsus " + st.ort),
      type: st.art === "mvz" ? "Medizinisches Versorgungszentrum" : "Klinik",
      city: st.ort,
      address: adresse,
      phone: st.telefonAnzeige || st.telefon || "",
      visitingHours: "",
      url: st.kontaktUrl || st.url || (this.wissen.meta && this.wissen.meta.quelle) || "",
      startUrl: st.url,
      mapsUrl: adresse ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((st.name || "") + " " + adresse) : "",
      specialties: fach,
      keywords: []
    };
  }

  _verwandte(id) {
    const paare = { bremen: ["mvz-bremen"], "mvz-bremen": ["bremen"], kassel: ["mvz-kassel"], "mvz-kassel": ["kassel"], schoeneck: ["mvz-adorf"], "mvz-adorf": ["schoeneck"] };
    return paare[id] || [];
  }

  _antwort(felder) {
    return Object.assign({ type: "info", grounded: true, title: "Paracelsus Wegweiser", message: "", chips: [], secondaryNotice: HINWEIS_WEGWEISER }, felder);
  }

  _ortsChips(praefix) {
    return this.suche.standorte.filter((s) => s.art === "klinik").map((s) => (praefix ? praefix + " " : "") + s.ort);
  }

  _standortChips(st) {
    return ["Fachbereiche " + st.ort, "Termin " + st.ort, "Kontakt " + st.ort, "Klinik A–Z " + st.ort];
  }

  _themenChips() {
    const namen = [];
    for (const seite of this.wissen.seiten) {
      if (seite.typ !== "allgemein" || !seite.id.endsWith("-allgemein")) continue;
      const n = seite.id.replace(/-allgemein$/, "").replace(/-/g, " ")
        .replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü").replace(/\bfuss\b/g, "fuß")
        .split(" ").map((w) => (w === "und" ? w : wsGross(w))).join(" ");
      namen.push(n);
    }
    return namen.slice(0, 14);
  }

  // ---------------------------------------------------------------- Hauptablauf

  processQuery(rawUserInput, isVoice = false) {
    const res = this._verarbeite(rawUserInput, isVoice);
    if (res && typeof res === "object") {
      if (res.clinic && res.clinic.id) {
        this.context.lastClinicId = res.clinic.id;
        this.context.lastClinicName = res.clinic.name;
      } else if (res.standortId) {
        const st = this.suche.standort(res.standortId);
        if (st) { this.context.lastClinicId = st.id; this.context.lastClinicName = st.name; }
      }
      this.context.offenesThema = res.offenesThema || null;
      this.context.turnCount = (this.context.turnCount || 0) + 1;
      res.spokenSummary = generateSpokenSummary(res);
    }
    return res;
  }

  _verarbeite(rawUserInput, isVoice) {
    if (rawUserInput === null || rawUserInput === undefined) rawUserInput = "";
    else if (typeof rawUserInput !== "string") {
      rawUserInput = (typeof rawUserInput === "number" || typeof rawUserInput === "boolean") ? String(rawUserInput) : "";
    }
    rawUserInput = rawUserInput.normalize("NFC").slice(0, 2000);
    const bereinigt = scrubPII(rawUserInput);
    let frage = normalizeSpokenAndPhoneticInput(bereinigt.replace(/\[[^\]]*ANONYMISIERT[^\]]*\]/g, " ").trim().toLowerCase());
    // Ärzte, die auf der Website stehen, dürfen beim Namen gesucht werden: Namensfilter für diese Nachnamen aufheben
    const piiEntfernt = /ANONYMISIERT/.test(bereinigt);
    if (piiEntfernt) {
      const rohGefaltet = wsFalte(rawUserInput).split(" ");
      if ((rohGefaltet.length <= 3 || /\b(?:dr|doktor|prof|professor|herr|frau|chefarzt|chefärztin|oberarzt|arzt|ärztin)\b/i.test(rawUserInput)) && rohGefaltet.some((w) => w.length >= 4 && this.suche.personenNamen.has(w))) {
        frage = normalizeSpokenAndPhoneticInput(rawUserInput.trim().toLowerCase());
      }
    }
    // Alltagsformulierungen für Gelenkersatz
    frage = frage
      .replace(/\b(?:neues|künstliches|kuenstliches)\s+knie(?:gelenk)?\b|\bknie\s*(?:tep|prothese|ersatz)\b/g, "knieendoprothetik")
      .replace(/\b(?:schmerzen|brennen|brennt|tut\s+weh)\s+beim\s+(?:wasserlassen|pinkeln|urinieren)\b/g, "wasserlassen harndrang")
      .replace(/\b(?:arm|bein|hand|fuß|fuss|finger|handgelenk|knöchel|zeh|rippe|schlüsselbein|ellenbogen)\s+(?:ist\s+)?gebrochen\b/g, "knochenbruch")
      .replace(/\b(?:neue|künstliche|kuenstliche)\s+hüfte\b|\b(?:neues|künstliches)\s+hüftgelenk\b|\bhüft\s*(?:tep|prothese|ersatz)\b/g, "hüftendoprothetik");
    const lang = this.currentLanguage;
    const merke = (typ, klinik, kategorie) => this.analytics.recordQuery(bereinigt, typ, klinik || null, kategorie || typ, isVoice, lang);

    if (!frage) {
      return { type: "empty", grounded: true, message: "Wobei kann ich Dir helfen? Nenn mir Dein Anliegen, einen Fachbereich oder einen Ort.", secondaryNotice: HINWEIS_WEGWEISER };
    }

    // 1. Notfall hat immer Vorrang
    for (const [key, em] of Object.entries(EMERGENCY_CATEGORIES)) {
      if (em.pattern.test(frage)) {
        merke("emergency", null, "Notfall: " + key);
        let title = em.title, action = em.action;
        if (lang === "en") { title = em.title_en || title; action = em.action_en || action; }
        else if (lang === "tr") { title = em.title_tr || title; action = em.action_tr || action; }
        else if (lang === "uk") { title = em.title_uk || title; action = em.action_uk || action; }
        return {
          type: "emergency", isEmergency: true, alertTitle: title, message: action, guidance: em.guidance,
          emergencyCall: em.hotline, altCall: em.altHotline, actionText: "Notruf " + em.hotline + " wählen",
          secondaryNotice: HINWEIS_WEGWEISER
        };
      }
    }

    // 2. Begrüßung, Dank, Fragen zum Wegweiser selbst
    const nurText = frage.replace(/[^a-zäöüß\s]/gi, "").trim();
    if (/^(?:hallo|hi|hey|guten\s*(?:tag|morgen|abend)|moin(?:\s+moin)?|servus|grüß\s*gott|neue\s+frage(?:\s+stellen)?|\s)+$/i.test(nurText)) {
      merke("info", null, "Begrüßung");
      return this._antwort({
        title: "Hallo!",
        message: "Ich bin der Wegweiser der Paracelsus Kliniken. Sag mir, worum es geht, zum Beispiel „Knieschmerzen in Bremen“ oder „Besuchszeiten Kassel“. Ich zeige Dir die passende Klinik, den Fachbereich und den Kontakt.",
        chips: ["Alle Standorte", "Ich habe Beschwerden", "Termin vereinbaren", "Mein Aufenthalt"]
      });
    }
    frage = frage.replace(/^(?:hallo|hi|hey|guten\s*(?:tag|morgen|abend)|moin(?:\s+moin)?|servus|grüß\s*gott)[,!\s]+/i, "").trim();

    if (/^(?:danke|vielen dank|dankeschön|dankeschoen|super danke|danke schön|tschüss|tschuess|auf wiedersehen|bis bald|ciao|thx|merci)[\s!.]*$/i.test(nurText)) {
      merke("info", null, "Dank");
      return this._antwort({ title: "Gern geschehen", message: "Alles Gute für Dich. Wenn noch etwas offen ist, frag einfach.", chips: ["Alle Standorte", "Neue Frage stellen"] });
    }

    if (/\b(?:wer|was)\s+bist\s+du\b|\bwas\s+kannst\s+du\b|\bbist\s+du\s+(?:eine?\s+)?(?:echter\s+)?(?:mensch|bot|chatbot|roboter|ki|maschine|computer)\b|\bwie\s+funktionierst\s+du\b/i.test(frage)) {
      merke("info", null, "Über den Wegweiser");
      return this._antwort({
        title: "Was ich kann",
        message: "Ich bin ein digitaler Wegweiser, kein Mensch und kein Arzt. Ich suche für Dich auf der Website der Paracelsus Kliniken: welche Klinik zu Deinem Anliegen passt, wer dort zuständig ist und wie Du einen Termin bekommst. Diagnosen oder Behandlungsempfehlungen gebe ich nicht.",
        chips: ["Alle Standorte", "Ich habe Beschwerden", "Termin vereinbaren"]
      });
    }

    // 3. Keine medizinische Beratung
    if (/\b(?:darf|kann|soll|sollte|muss)\s+ich\b.*\b(?:nehmen|einnehmen|absetzen|kombinieren|schlucken)\b|\bdosis\b|\bdosierung\b|nebenwirkung|wechselwirkung|\bwas\s+hab(?:e)?\s+ich\b|\bist\s+das\s+(?:gefährlich|schlimm|normal|krebs)\b|\bist\s+(?:mein|meine|ein|eine|das|der|die)\b.*\b(?:gefährlich|schlimm|normal|bedenklich|zu\s+hoch|zu\s+niedrig)\b|\bdiagnose\s+stellen\b|\bbefund\s+(?:erklären|deuten|lesen)\b|\bwelches\s+medikament\b/i.test(frage)) {
      merke("info", null, "Medizinische Frage");
      return this._antwort({
        title: "Das gehört in ärztliche Hände",
        message: "Das kann und darf ich nicht beurteilen. Bitte besprich es mit Deinem Arzt. Außerhalb der Sprechzeiten erreichst Du den ärztlichen Bereitschaftsdienst unter **116 117**, im Notfall den Rettungsdienst unter **112**.<br><br>Ich zeige Dir gern, welcher Fachbereich bei uns für Dein Anliegen zuständig ist.",
        chips: ["Alle Standorte", "Ich habe Beschwerden"],
        closedWorldBoundary: true
      });
    }

    // 4. Themen, die nichts mit den Kliniken zu tun haben
    const fremd = /verletz|schmerz|\bweh\b|gebrochen|unfall|gestürzt|umgeknickt|arzt|ärztin|klinik|termin|krank|behandl|\bop\b|operation/.test(frage) ? null : classifyUnrelatedQuery(frage);
    if (fremd) {
      merke("info", null, fremd.categoryLabel);
      return this._antwort({
        title: "Dabei kann ich nicht helfen", unrelatedCategory: fremd.category, closedWorldBoundary: true,
        message: "Damit kenne ich mich nicht aus. Ich weiß nur über die Paracelsus Kliniken Bescheid: Standorte, Fachbereiche, Deinen Aufenthalt und Kontakt.",
        chips: ["Alle Standorte", "Ich habe Beschwerden", "Mein Aufenthalt"]
      });
    }

    // 5. Standort bestimmen (genannt, in der Nähe einer Stadt oder aus dem Gesprächsverlauf)
    let ort = this.suche.erkenneStandort(frage);
    const bezug = /\b(?:dort|da|dahin|in dieser klinik|in der klinik|an dem standort|am standort)\b/i.test(frage);
    const kurz = wsWoerter(frage).filter((w) => !SUCH_STOPP.has(w)).length <= 3;
    if (!ort && this.context.lastClinicId && (bezug || kurz) && !/\b(alle|anderer|andere)\b/.test(frage)) {
      ort = { id: this.context.lastClinicId, art: "verlauf", woerter: [] };
    }
    const st = ort ? this.suche.standort(ort.id) : null;
    const ohne = ort ? ort.woerter : [];
    const { kern } = this.suche.suchwoerter(frage, ohne);
    const gefaltet = " " + wsFalte(frage) + " ";
    const hat = (re) => re.test(gefaltet);
    const absicht = {
      standorte: hat(/ (standorte?|alle kliniken|welche kliniken|kliniken anzeigen|wo seid ihr|wo gibt es euch|uebersicht|anderer standort|andere standorte) /),
      kontakt: hat(/ (telefon|telefonnummer|nummer|anrufen|erreichen|erreiche|adresse|anschrift|kontakt|zentrale|ansprechpartner|mitarbeiter sprechen|mit einem menschen|rueckruf) /),
      termin: hat(/ (termin|termine|terminvereinbarung|buchen|vereinbaren|doctolib) /),
      arzt: hat(/ (chefarzt|chefaerztin|chefaerzte|oberarzt|oberaerztin|arzt|aerztin|aerzte|doktor|leiter|leiterin|leitung|leitet|operiert|team|spezialist|spezialisten) /),
      fachbereiche: hat(/ (fachbereich|fachbereiche|abteilung|abteilungen|leistungen|angebot|was behandelt ihr|was macht ihr|schwerpunkte|praxen) /),
      aufenthalt: hat(/ (klinik a z|a z|mein aufenthalt|aufenthalt) /)
    };
    const themaWoerter = kern.filter((w) => !ABSICHTS_WOERTER.test(w));
    const roh = frage.split(/[^a-zäöüß0-9]+/i);
    const stichwortAus = (liste) => liste.slice(0, 3).map((w, i) => { const o = roh.find((x) => wsFalte(x) === w) || w; return /^(?:mrt|ct|hno|op|ths|mvz|ekg|eeg|ms)$/i.test(o) ? o.toUpperCase() : (i === 0 ? wsGross(o) : o); }).join(" ");

    // 5b. Allgemeiner Einstieg „Ich habe Beschwerden“: nach der Körperregion fragen
    const FUELL = "(?:(?:gar|überhaupt|echt|richtig|total|sehr|so|heute|gerade|grad|irgendwie|wirklich|einfach|ziemlich|voll|mega|ganz|leider|seit\\s+\\S+)\\s+)*";
    const BEFINDEN = new RegExp("^(?:(?:hallo|hi|hey|moin|guten\\s+tag)[,!.]?\\s+)?(?:ich\\s+habe?\\s+" + FUELL + "(?:beschwerden|schmerzen)|beschwerden|schmerzen|mir\\s+geht\\s*(?:es|'s|s)?\\s+" + FUELL + "(?:nicht\\s+(?:so\\s+)?gut|schlecht|mies|dreckig|beschissen|scheiße|elend)|(?:ich\\s+)?fühle?\\s+mich\\s+" + FUELL + "(?:nicht\\s+(?:so\\s+)?(?:gut|wohl)|schlecht|krank|mies|elend|unwohl|schlapp)|(?:ich\\s+)?bin\\s+" + FUELL + "krank|ich\\s+glaube?,?\\s+ich\\s+bin\\s+krank|mir\\s+tut\\s+(?:alles|was|etwas)\\s+weh|ich\\s+habe?\\s+(?:was|etwas))[\\s.!]*$", "i");
    if (BEFINDEN.test(frage.replace(/\s+/g, " ").trim())) {
      merke("info", null, "Beschwerden allgemein");
      return this._antwort({
        title: "Wo hast Du Beschwerden?",
        message: "Sag mir, um welche Körperregion oder welches Thema es geht. Dann zeige ich Dir, welche unserer Kliniken das behandelt.",
        chips: this._themenChips()
      });
    }

    // 5b2. „Ich brauche Hilfe“ ohne Thema: nach dem Anliegen fragen statt Standorte aufzulisten
    if (/^(?:(?:hallo|hi|hey|moin)[,!.]?\s+)?(?:(?:ich\s+)?(?:brauche?|benötige|suche)\s+(?:bitte\s+|mal\s+|dringend\s+|kurz\s+)*(?:hilfe|unterstützung|(?:einen\s+)?rat)|(?:kannst\s+du|können\s+sie|könnt\s+ihr)\s+mir\s+(?:bitte\s+|mal\s+)*helfen|hilfe|help)[\s.!?]*$/i.test(frage.replace(/\s+/g, " ").trim())) {
      merke("info", null, "Hilfe allgemein");
      return this._antwort({
        title: "Wobei kann ich Dir helfen?",
        message: "Sag mir kurz, worum es geht: Beschwerden, ein Termin, Dein Aufenthalt oder ein bestimmter Standort. Im Notfall wähle bitte sofort die **112**.",
        chips: ["Ich habe Beschwerden", "Termin vereinbaren", "Mein Aufenthalt", "Alle Standorte"]
      });
    }

    // 5b3. Englische Frage: ehrlich sagen, dass es den Wegweiser derzeit nur auf Deutsch gibt
    {
      const en = (frage.match(/\b(?:the|you|your|need|appointment|speak|english|where|how|can|doctor|hospital|have|please|help|pain|my|are|does|what|want|with|for)\b/g) || []).length;
      const de = (frage.match(/\b(?:ich|du|der|die|das|ein|eine|und|ist|nicht|mir|habe|wo|wie|was|für|mit|bei|termin)\b/g) || []).length;
      if ((en >= 2 && de === 0) || /\b(?:kein|nicht\s+gut|wenig|schlecht)\s+deutsch\b|\bno\s+german\b/.test(frage)) {
        merke("info", null, "Englisch");
        return this._antwort({
          title: "Deutsch / German",
          message: "I can only answer in German at the moment. In an emergency, please call **112**.<br><br>Ich antworte derzeit nur auf Deutsch. Nenn mir gern einen Standort oder ein Thema.",
          chips: ["Alle Standorte"]
        });
      }
    }

    // 5b3b. Allgemeine Infekt-Beschwerden: dafür ist die Hausarztpraxis zuständig, nicht eine Fachklinik
    if (/\b(?:fieber|schüttelfrost|erkältung|erkältet|grippe|durchfall|magen-?darm-?grippe)\b/.test(frage) && !st) {
      merke("info", null, "Allgemeine Beschwerden");
      return this._antwort({
        title: "Allgemeine Beschwerden",
        message: "Bei Beschwerden wie Fieber, Erkältung oder Durchfall ist Deine Hausarztpraxis die erste Anlaufstelle. Außerhalb der Sprechzeiten erreichst Du den ärztlichen Bereitschaftsdienst unter **116 117**. Im Notfall wähle die **112**.",
        chips: ["Alle Standorte", "Ich habe Beschwerden"]
      });
    }

    // 5b4. Termin absagen oder verschieben: geht nur direkt am Standort
    if (hat(/ (absagen|absage|verschieben|verlegen|stornieren|umbuchen|ausfallen) /) && (absicht.termin || themaWoerter.length <= 1)) {
      if (!st) { merke("info", null, "Termin ändern ohne Ort"); return this._frageNachOrt("An welchem Standort ist Dein Termin?", "Termin absagen"); }
      merke("match", st.id, "Termin ändern");
      const r = this._standortAntwort(st, ort, "Kontakt");
      r.message = "Absagen oder verschieben kannst Du einen Termin nur direkt am Standort. So erreichst Du ihn:<br><br>" + r.message;
      return r;
    }

    // 5b5. Kosten und Kostenübernahme: dazu macht die Website keine Angaben
    if (hat(/ (kosten|kostet|preis|preise|teuer|bezahlen|zahlen|zuzahlung|kasse|krankenkasse|kostenuebernahme) /) && !hat(/ (parken|parkplatz|wlan|internet|fernsehen|fernseher|telefon|einzelzimmer|wahlleistung|wahlleistungen|cafeteria|essen) /)) {
      merke("info", st ? st.id : null, "Kosten");
      return this._antwort({
        title: "Kosten und Kostenübernahme",
        message: "Zu Kosten und zur Übernahme durch die Krankenkasse finde ich auf unserer Website keine Angaben. Das klärst Du am besten direkt mit dem Standort oder mit Deiner Krankenkasse.",
        standortId: st ? st.id : null,
        chips: st ? ["Kontakt " + st.ort] : this._ortsChips("Kontakt")
      });
    }

    // 5c. Aufenthalt und Klinik A–Z
    if (absicht.aufenthalt && themaWoerter.filter((w) => w !== "aufenthalt").length === 0) {
      if (!st) { merke("info", null, "Aufenthalt ohne Ort"); return this._frageNachOrt("In welcher Klinik bist Du oder wirst Du sein?", "Klinik A–Z"); }
      merke("match", st.id, "Aufenthalt");
      return this._aufenthaltAntwort(st);
    }

    // 6. Standortübersicht
    if (absicht.standorte && themaWoerter.length === 0 && (!st || ort.art === "verlauf")) {
      merke("info", null, "Standorte");
      return this._standortListe("Unsere Standorte", "Wähle einen Standort, dann zeige ich Dir Fachbereiche, Kontakt und Termine.");
    }
    if (!st && kern.length === 0) {
      if (piiEntfernt) {
        merke("info", null, "Person nicht auf der Website");
        return this._antwort({
          title: "Zu einzelnen Personen",
          message: "Über einzelne Personen kann ich nur sagen, was auf unserer Website steht, und ich bewerte niemanden. Nenn mir einen Standort, dann zeige ich Dir die Ärzte dort.",
          chips: this._ortsChips("Ärzte")
        });
      }
      merke("info", null, "Hilfe allgemein");
      return this._antwort({
        title: "Wobei kann ich Dir helfen?",
        message: "Sag mir kurz, worum es geht: Beschwerden, ein Termin, Dein Aufenthalt oder ein bestimmter Standort. Im Notfall wähle bitte sofort die **112**.",
        chips: ["Ich habe Beschwerden", "Termin vereinbaren", "Mein Aufenthalt", "Alle Standorte"]
      });
    }

    // 6b. Karriere und Ausbildung
    if (hat(/ (karriere|job|jobs|stelle|stellen|stellenangebote|stellenangebot|ausbildung|bewerbung|bewerben|praktikum|fsj|arbeiten bei euch) /)) {
      let url = null;
      for (const seite of this.wissen.seiten) { for (const e of seite.e) for (const l of e.l) if (/\/karriere/i.test(l[1])) { url = l[1]; break; } if (url) break; }
      if (url) {
        merke("info", null, "Karriere");
        return this._antwort({ title: "Karriere und Ausbildung", message: "Offene Stellen, Ausbildungsplätze und alles zur Bewerbung findest Du in unserem Karriereportal.", links: [{ label: "Zum Karriereportal", url }], chips: ["Alle Standorte", "Neue Frage stellen"] });
      }
    }

    // 7. Nur ein Ort genannt
    if (st && kern.length === 0 && this.context.offenesThema && ort.art !== "verlauf") {
      const thema = this.context.offenesThema;
      this.context.offenesThema = null;
      return this._verarbeite(thema + " " + rawUserInput, isVoice);
    }
    if (st && kern.length === 0 && ort.art === "direkt" && this.context.lastThema && /^(?:und|auch|wie)\b/.test(frage.trim()) && !this._inVerlauf) {
      this._inVerlauf = true;
      try { return this._verarbeite(this.context.lastThema + " " + rawUserInput.replace(/^\s*(?:und|auch|wie)\b/i, ""), isVoice); } finally { this._inVerlauf = false; }
    }
    if (st && kern.length === 0) {
      merke("match", st.id, "Standort");
      return this._standortAntwort(st, ort);
    }

    // 8. Fachbereiche eines Standorts
    if (absicht.fachbereiche && themaWoerter.length === 0) {
      if (!st) { merke("info", null, "Fachbereiche ohne Ort"); return this._frageNachOrt("Für welchen Standort möchtest Du die Fachbereiche sehen?", "Fachbereiche"); }
      merke("match", st.id, "Fachbereiche");
      return this._fachbereicheAntwort(st);
    }

    // 9. Kontakt
    if (absicht.kontakt && themaWoerter.length === 0) {
      if (!st) { merke("info", null, "Kontakt ohne Ort"); return this._frageNachOrt("Für welchen Standort brauchst Du den Kontakt?", "Kontakt"); }
      merke("match", st.id, "Kontakt");
      return this._standortAntwort(st, ort, "Kontakt");
    }

    // 10. Termin
    if (absicht.termin) {
      if (!st) {
        // Mit Thema, aber ohne Ort: erst zeigen, wo es das gibt
        if (themaWoerter.length === 0) { merke("info", null, "Termin ohne Ort"); return this._frageNachOrt("An welchem Standort möchtest Du einen Termin?", "Termin"); }
      } else {
        const amOrt = themaWoerter.length === 0 ? [] : this.suche.suche(themaWoerter.join(" "), { standort: st.id, verwandte: this._verwandte(st.id), nurStandort: true, max: 1 });
        if (themaWoerter.length === 0 || (amOrt[0] && amOrt[0].seite.s && amOrt[0].abdeckung >= 0.9)) {
          merke("match", st.id, "Termin");
          return this._terminAntwort(st, themaWoerter.join(" "));
        }
      }
    }

    // 11. Ärzte und Leitung
    if (absicht.arzt) {
      const r = this._arztAntwort(st, themaWoerter.join(" "), hat(/ (chefarzt|chefaerztin|chefaerzte|leiter|leiterin|leitung|leitet|direktor) /));
      if (r) { merke("match", st ? st.id : null, "Ärzte"); return r; }
    }

    // 12. Freie Suche in der Website-Wissensbasis
    const suchText = themaWoerter.length ? themaWoerter.join(" ") : kern.join(" ");
    let treffer = this.suche.suche(suchText, { standort: st ? st.id : null, verwandte: st ? this._verwandte(st.id) : [] });
    if (st) {
      // Angaben zu Aufenthalt, Anfahrt und Kontakt gelten nur für die jeweilige Klinik: nie von einem anderen Standort übernehmen
      const eigene = [st.id].concat(this._verwandte(st.id));
      treffer = treffer.filter((t) => !t.seite.s || eigene.includes(t.seite.s) || !["a-z", "aufenthalt", "kontakt", "startseite", "leitung"].includes(t.seite.typ));
    }
    if (st && (!treffer[0] || treffer[0].titel < 1)) {
      // Am genannten Standort steht das Thema nur am Rand: lieber zeigen, wo es wirklich behandelt wird
      const ueberall = this.suche.suche(suchText, {});
      const hier = treffer[0] || { titel: 0, abdeckung: 0 };
      if (ueberall[0] && ueberall[0].abdeckung >= 0.6 && ueberall[0].abdeckung >= hier.abdeckung && ueberall[0].titel > hier.titel + 0.3 && !AUFENTHALT_TYPEN.includes(ueberall[0].seite.typ)) treffer = ueberall;
    }
    // Beiwörter wie „OP“ oder „operiert“ tragen das Thema nicht
    const WEICH = /^(op|operation|operationen|operiert|operieren|operiere|eingriff|untersuchung|behandlung|therapie|problem|probleme|kaputt|gerissen|verletzt|entzuendet|geschwollen|spezialist|spezialisten|arzt|aerztin|aerzte|doktor)$/;
    const basis = themaWoerter.length ? themaWoerter : kern;
    const ohneWeich = basis.filter((w) => !WEICH.test(w));
    const hatBeiwort = ohneWeich.length > 0 && ohneWeich.length < basis.length;
    if (st && hatBeiwort) {
      // Trägt nur das Beiwort den Treffer am genannten Standort („Schulter OP Kassel“ -> THS-Operation), zählt das eigentliche Thema
      const hierKern = this.suche.suche(ohneWeich.join(" "), { standort: st.id, verwandte: this._verwandte(st.id), nurStandort: true, max: 15 });
      const kernPasst = hierKern[0] && hierKern[0].abdeckung >= 0.6 && hierKern[0].punkte >= 4 && hierKern[0].titel >= 1;
      if (kernPasst) {
        if (treffer[0] && !hierKern.some((t) => t.eintrag === treffer[0].eintrag)) treffer = hierKern;
      } else {
        const ueberallKern = this.suche.suche(ohneWeich.join(" "), {}).filter((t) => !["a-z", "aufenthalt", "kontakt", "startseite", "leitung"].includes(t.seite.typ));
        treffer = (ueberallKern[0] && ueberallKern[0].abdeckung >= 0.6 && ueberallKern[0].punkte >= 4) ? ueberallKern : [];
        treffer.fremd = true;
      }
    }
    // Zweiter Versuch ohne Beiwörter, wenn die Frage sonst ins Leere läuft
    if (!(treffer[0] && treffer[0].abdeckung >= 0.6 && treffer[0].punkte >= 4)) {
      if (hatBeiwort) {
        let t2 = this.suche.suche(ohneWeich.join(" "), { standort: st ? st.id : null, verwandte: st ? this._verwandte(st.id) : [] });
        if (st) {
          const eigene = [st.id].concat(this._verwandte(st.id));
          t2 = t2.filter((t) => !t.seite.s || eigene.includes(t.seite.s) || !["a-z", "aufenthalt", "kontakt", "startseite", "leitung"].includes(t.seite.typ));
        }
        if (t2[0] && t2[0].abdeckung >= 0.6 && t2[0].punkte >= 4) treffer = t2;
      }
    }
    const bester = treffer[0];
    if (bester && bester.abdeckung >= 0.6 && bester.punkte >= 4) {
      // Fragen zum Aufenthalt (Besuch, Parken, Aufnahme) sind je Klinik verschieden: erst den Ort klären
      if (!st && ["a-z", "aufenthalt", "kontakt"].includes(bester.seite.typ)) {
        merke("info", null, "Aufenthalt ohne Ort");
        const stichwort = bester.eintrag.t && bester.eintrag.t.length <= 32 ? bester.eintrag.t.replace(/:$/, "") : stichwortAus(themaWoerter);
        const r0 = this._frageNachOrt("Das ist je Klinik verschieden. Um welchen Standort geht es?", stichwort);
        r0.offenesThema = suchText;
        return r0;
      }
      const r = this._trefferAntwort(treffer, st, ort, absicht.termin, stichwortAus(hatBeiwort ? ohneWeich : themaWoerter));
      if (!r.clinic) r.offenesThema = suchText;
      merke(r.clinic ? "match" : "info", r.standortId || null, "Website: " + bester.seite.id);
      this.context.lastThema = themaWoerter.join(" ") || this.context.lastThema;
      return r;
    }

    // 13. Nichts gefunden: ehrlich sagen und Kontakt anbieten
    merke("fallback", st ? st.id : null, "Nicht gefunden");
    if (st) {
      const karte = this._klinikKarte(st);
      return this._antwort({
        type: "fallback", title: "Dazu finde ich nichts", standortId: st.id,
        message: "Dazu finde ich auf unserer Website nichts für " + wsHtml(st.ort) + ". Am schnellsten hilft Dir das Team vor Ort" + (karte.phone ? " unter **" + wsHtml(karte.phone) + "**" : "") + ".",
        links: [st.kontaktUrl && { label: "Kontakt " + st.ort, url: st.kontaktUrl }, st.fachbereicheUrl && { label: "Fachbereiche " + st.ort, url: st.fachbereicheUrl }].filter(Boolean),
        chips: this._standortChips(st)
      });
    }
    return this._antwort({
      type: "fallback", title: "Dazu finde ich nichts",
      message: "Dazu finde ich auf unserer Website nichts. Beschreib Dein Anliegen gern mit anderen Worten, zum Beispiel die betroffene Körperregion oder den Fachbereich, oder wähle einen Standort.",
      chips: ["Alle Standorte", "Ich habe Beschwerden", "Termin vereinbaren"]
    });
  }

  // ---------------------------------------------------------------- Antworten

  _standortListe(titel, text) {
    const zeilen = this.suche.standorte.filter((s) => s.url).map((s) => ({ label: s.name || s.ort, url: s.url }));
    return this._antwort({ title: titel, message: text, links: zeilen, chips: this._ortsChips("") });
  }

  _frageNachOrt(text, praefix) {
    return this._antwort({ title: "Welcher Standort?", message: text, chips: this._ortsChips(praefix) });
  }

  _standortAntwort(st, ort, schwerpunkt) {
    const karte = this._klinikKarte(st);
    let text = "";
    if (ort && ort.art === "naehe") text += "Von " + wsHtml(wsGross(ort.stadt)) + " aus liegt dieser Standort am nächsten (rund " + ort.km + " km Luftlinie).<br><br>";
    text += "**" + wsHtml(karte.name) + "**";
    if (karte.address) text += "<br>" + wsHtml(karte.address);
    if (karte.phone) text += "<br>Telefon: **" + wsHtml(karte.phone) + "**";
    const links = [
      st.kontaktUrl && { label: "Kontakt und Ansprechpartner", url: st.kontaktUrl },
      st.fachbereicheUrl && { label: "Fachbereiche", url: st.fachbereicheUrl },
      st.azUrl && { label: "Klinik von A bis Z (Anfahrt, Aufnahme, Besuch)", url: st.azUrl }
    ].filter(Boolean);
    return this._antwort({ type: "match", title: schwerpunkt ? schwerpunkt + " " + st.ort : karte.name, message: text, clinic: karte, standortId: st.id, links, chips: this._standortChips(st) });
  }

  _aufenthaltAntwort(st) {
    const az = this.wissen.seiten.find((s) => s.s === st.id && s.typ === "a-z");
    const links = [];
    if (st.azUrl) links.push({ label: "Klinik von A bis Z", url: st.azUrl });
    for (const s of this.suche.seitenVon(st.id, "aufenthalt")) links.push({ label: s.titel.replace(/\s+/g, " "), url: s.url });
    const themen = az ? az.e.map((e) => e.t).filter((t) => t && t.length < 34 && !/:$/.test(t)).slice(0, 6) : [];
    return this._antwort({
      title: "Dein Aufenthalt in " + st.ort, standortId: st.id,
      message: "Alles rund um Deinen Aufenthalt in **" + wsHtml(st.name || st.ort) + "** steht in der Klinik von A bis Z. Frag mich einfach nach einem Stichwort.",
      links: links.slice(0, 5),
      chips: themen.length ? themen.map((t) => t + " " + st.ort) : this._standortChips(st)
    });
  }

  _fachbereicheAntwort(st) {
    const seiten = this.suche.seitenVon(st.id, "fachbereich");
    const verw = this._verwandte(st.id).flatMap((id) => this.suche.seitenVon(id, "fachbereich"));
    const links = seiten.concat(verw).map((s) => ({ label: s.titel.replace(/\s+/g, " "), url: s.url })).slice(0, 24);
    if (links.length === 0 && st.fachbereicheUrl) links.push({ label: "Fachbereiche " + st.ort, url: st.fachbereicheUrl });
    return this._antwort({
      title: "Fachbereiche " + st.ort, standortId: st.id,
      message: "Diese Fachbereiche und Zentren stehen auf unserer Website für **" + wsHtml(st.name || st.ort) + "**:",
      links, chips: ["Termin " + st.ort, "Kontakt " + st.ort, "Anderer Standort"]
    });
  }

  _doctolibLinks(st, thema) {
    const ids = [st.id].concat(this._verwandte(st.id));
    const gefunden = [];
    for (const seite of this.wissen.seiten) {
      if (!ids.includes(seite.s)) continue;
      for (const e of seite.e) for (const [, url] of e.l) {
        if (!/doctolib\.de/i.test(url) || gefunden.some((g) => g.url === url)) continue;
        gefunden.push({ url, seite });
      }
    }
    if (thema && gefunden.length > 1) {
      const w = wsWoerter(thema).flatMap((x) => [x].concat(LAIEN_BEGRIFFE[x] || [])).map(wsStamm);
      const passend = gefunden.filter((g) => w.some((x) => wsFalte(g.seite.titel + " " + g.seite.id + " " + g.url).includes(x)));
      if (passend.length) return passend;
    }
    return gefunden;
  }

  _terminAntwort(st, thema) {
    const karte = this._klinikKarte(st);
    const links = this._doctolibLinks(st, thema).slice(0, 6).map((g) => ({ label: "Online-Termin: " + g.seite.titel.replace(/\s+/g, " "), url: g.url }));
    let text;
    if (links.length) {
      text = "Für **" + wsHtml(st.ort) + "** kannst Du online über Doctolib buchen. Wähle die passende Praxis:";
    } else {
      text = "Einen Online-Kalender finde ich für **" + wsHtml(st.ort) + "** auf unserer Website nicht. Termine vereinbarst Du direkt mit dem zuständigen Fachbereich" + (karte.phone ? " oder über die Zentrale unter **" + wsHtml(karte.phone) + "**" : "") + ".";
    }
    if (thema) {
      const fach = this.suche.suche(thema, { standort: st.id, verwandte: this._verwandte(st.id), nurStandort: true, typen: ["fachbereich"], max: 1 })[0];
      if (fach && fach.abdeckung >= 0.6) {
        const name = fach.seite.titel.replace(/\s+/g, " ");
        const tel = (fach.seite.e.find((x) => x.tel.length && !x.p) || { tel: [] }).tel[0];
        text += "<br><br>Zuständig ist: **" + wsHtml(name) + "**" + (tel ? ", Telefon **" + wsHtml(tel[1]) + "**" : "") + ".";
        links.unshift({ label: name, url: fach.seite.url });
      }
    }
    if (st.kontaktUrl) links.push({ label: "Kontakt und Terminvereinbarung " + st.ort, url: st.kontaktUrl });
    if (st.fachbereicheUrl) links.push({ label: "Fachbereiche " + st.ort, url: st.fachbereicheUrl });
    return this._antwort({ title: "Termin in " + st.ort, standortId: st.id, message: text, links, chips: ["Fachbereiche " + st.ort, "Kontakt " + st.ort, "Anderer Standort"] });
  }

  _arztAntwort(st, thema, nurLeitung) {
    let treffer;
    if (thema) {
      treffer = this.suche.suche(thema, { standort: st ? st.id : null, verwandte: st ? this._verwandte(st.id) : [], nurPersonen: true, nurStandort: !!st, max: 40 }).filter((t) => t.abdeckung >= 0.6);
    } else if (st) {
      // ohne Thema: die auf der Website genannten leitenden Ärzte des Standorts
      treffer = [];
      for (const seite of this.suche.seitenVon(st.id)) for (const e of seite.e) {
        if (e.p && /chef|leit|direktor/i.test(e.x)) treffer.push({ seite, eintrag: e });
      }
    } else {
      return this._frageNachOrt("Für welchen Standort suchst Du die Ärzte?", "Ärzte");
    }
    let vorspann = "So steht es auf unserer Website:";
    // Einträge, deren „Funktion“ selbst ein Name ist, sind keine Personen-Einträge (z. B. Krankheitsbild mit Ansprechpartner)
    treffer = treffer.filter((t) => !/^(univ\.|prof\.|dr\.|pd\b|priv\.)/i.test(t.eintrag.x.trim()));
    if (nurLeitung) {
      let leitend = treffer.filter((t) => /chef|leit|direktor/i.test(t.eintrag.x));
      const staemme = wsWoerter(thema || "").map(wsStamm);
      const zumThema = leitend.filter((t) => staemme.some((s) => wsFalte(t.eintrag.x).includes(s)));
      if (zumThema.length) leitend = zumThema;
      const rang = (t) => (/chef|direktor/i.test(t.eintrag.x) && !/stellv|vertret|oberarzt|oberärzt/i.test(t.eintrag.x) ? 0 : 1);
      leitend.sort((a, b) => rang(a) - rang(b));
      if (leitend.length) treffer = leitend;
      else if (treffer.length) vorspann = "Eine Chefärztin oder einen Chefarzt nennt unsere Website dafür nicht ausdrücklich. Genannt werden:";
    }
    const gesehen = new Set();
    const personen = [];
    for (const t of treffer) {
      const schluessel = wsFalte(t.eintrag.t);
      if (gesehen.has(schluessel)) continue;
      gesehen.add(schluessel);
      personen.push(t);
      if (personen.length >= 6) break;
    }
    if (personen.length === 0) return null;
    const zeilen = personen.map((p) => {
      const funktion = (p.eintrag.x.split("\n").find((z) => !/^Telefon/i.test(z)) || "").trim();
      const wo = p.seite.s && (!st || p.seite.s !== st.id) ? " (" + ((this.suche.standort(p.seite.s) || {}).ort || "") + ")" : "";
      return "• **" + wsHtml(p.eintrag.t) + "**" + (funktion ? ", " + wsHtml(wsKuerze(funktion, 140)) : "") + wsHtml(wo);
    });
    const links = [];
    for (const p of personen) if (!links.some((l) => l.url === p.seite.url)) links.push({ label: p.seite.titel.replace(/\s+/g, " "), url: p.seite.url });
    return this._antwort({
      title: st ? "Ärzte in " + st.ort : "Ärzte", standortId: st ? st.id : null,
      message: vorspann + "<br>" + zeilen.join("<br>") + "<br><br>Termine und Rückfragen laufen über den jeweiligen Fachbereich.",
      links: links.slice(0, 5),
      chips: st ? ["Termin " + st.ort, "Fachbereiche " + st.ort, "Kontakt " + st.ort] : this._ortsChips("Ärzte")
    });
  }

  _trefferAntwort(treffer, st, ort, willTermin, stichwort) {
    const bester = treffer[0];
    const seite = bester.seite;
    const e = bester.eintrag;
    const links = [];
    const dazu = (label, url) => { if (url && !links.some((l) => l.url === url)) links.push({ label, url }); };
    const seitenName = seite.titel.replace(/\s+/g, " ");
    const titel = e.t ? e.t.replace(/:$/, "") : seitenName;
    let text = e.x ? wsHtml(wsKuerze(e.x, 520)).replace(/\n/g, "<br>") : "";

    // Übersichtsseite mit „Wir helfen Dir vor Ort in …“
    if (e.o && e.o.length) {
      const orte = e.o.map((o) => o[0]);
      const idVon = (name) => (this.suche.erkenneStandort(name) || {}).id;
      let hinweis;
      if (st) {
        const dabei = e.o.some((o) => idVon(o[0]) === st.id || this._verwandte(st.id).includes(idVon(o[0])));
        hinweis = dabei
          ? "Das behandeln wir in **" + wsHtml(st.ort) + "**."
          : "Für " + wsHtml(st.ort) + " steht das nicht auf unserer Website. Wir behandeln es in: **" + wsHtml(orte.join(", ")) + "**.";
      } else {
        hinweis = "Das behandeln wir in: **" + wsHtml(orte.join(", ")) + "**.";
      }
      text = text.replace(/(<br>)?Wir helfen Dir vor Ort in:?\s*$/i, "");
      text += (text ? "<br><br>" : "") + hinweis;
      const reihenfolge = e.o.slice();
      const rangListe = ort && ort.reihenfolge ? ort.reihenfolge : (st ? [st.id] : []);
      const rang = (o) => { const i = rangListe.indexOf(idVon(o[0])); return i < 0 ? 99 : i; };
      reihenfolge.sort((a, b) => rang(a) - rang(b));
      for (const [name, url] of reihenfolge) dazu("Fachbereich in " + name, url);
      dazu("Mehr dazu: " + seitenName, seite.url);
      return this._antwort({
        title: titel, message: text, links: links.slice(0, 8), standortId: st ? st.id : null,
        sources: [{ label: seitenName.slice(0, 60), url: seite.url }],
        chips: reihenfolge.slice(0, 5).map((o) => (stichwort || titel.split(/[ (]/)[0]) + " " + o[0])
      });
    }

    const zustaendig = seite.s ? this.suche.standort(seite.s) : null;
    if (willTermin && zustaendig) {
      for (const g of this._doctolibLinks(zustaendig, titel + " " + seite.id).slice(0, 3)) dazu("Online-Termin: " + g.seite.titel.replace(/\s+/g, " "), g.url);
    }
    for (const [label, url] of e.l) dazu(label || "Mehr erfahren", url);
    dazu("Zur Seite: " + seitenName, seite.url);

    // Telefonnummer aus dem Eintrag oder vom Fachbereich auf derselben Seite
    const tel = e.tel[0] || (seite.e.find((x) => x.tel.length && !x.p) || seite.e.find((x) => x.tel.length) || { tel: [] }).tel[0];
    if (tel) text += (text ? "<br><br>" : "") + "Telefon: **" + wsHtml(tel[1]) + "**";

    // Ohne genannten Ort: zeigen, wo es das Thema noch gibt
    let chips = [];
    if (!st && zustaendig) {
      const andere = [];
      for (const t of treffer.slice(1)) {
        if (t.seite.s && t.seite.s !== seite.s && t.abdeckung >= bester.abdeckung && t.punkte >= bester.punkte * 0.6) {
          const name = (this.suche.standort(t.seite.s) || {}).ort;
          if (name && name !== zustaendig.ort && !andere.includes(name)) andere.push(name);
        }
      }
      if (andere.length) {
        const alle = [zustaendig.ort].concat(andere).slice(0, 6);
        const wort = stichwort || titel.split(/[ (]/)[0];
        return this._antwort({
          title: wort,
          message: "Dazu finde ich etwas an mehreren Standorten: **" + wsHtml(alle.join(", ")) + "**. Welcher liegt für Dich am nächsten? Du kannst mir auch Deinen Wohnort nennen.",
          standortId: null,
          sources: [{ label: seitenName.slice(0, 60), url: seite.url }],
          chips: alle.slice(0, 5).map((n) => wort + " " + n)
        });
      }
    }
    if (zustaendig && chips.length === 0) chips = this._standortChips(zustaendig);
    if (st && ort && ort.art !== "naehe" && zustaendig && zustaendig.id !== st.id && !this._verwandte(st.id).includes(zustaendig.id)) {
      text = "Für " + wsHtml(st.ort) + " finde ich das auf unserer Website nicht, aber in " + wsHtml(zustaendig.ort) + ":<br><br>" + text;
    }
    if (st && !zustaendig && treffer.fremd) {
      text = "Für " + wsHtml(st.ort) + " finde ich dazu nichts auf unserer Website. Allgemein steht dort:<br><br>" + text;
    }
    if (ort && ort.art === "naehe" && zustaendig && zustaendig.id !== ort.id) {
      text = "In der Nähe von " + wsHtml(wsGross(ort.stadt)) + " finde ich das nicht, aber in " + wsHtml(zustaendig.ort) + ":<br><br>" + text;
    }

    return this._antwort({
      type: zustaendig ? "match" : "info",
      title: titel + (zustaendig && !wsFalte(titel).includes(wsFalte(zustaendig.ort)) ? " (" + zustaendig.ort + ")" : ""),
      message: text,
      clinic: zustaendig ? this._klinikKarte(zustaendig) : undefined,
      standortId: zustaendig ? zustaendig.id : null,
      links: links.slice(0, 5),
      sources: [{ label: seitenName.slice(0, 60), url: seite.url }],
      chips
    });
  }
}

if (typeof window !== "undefined") {
  window.ParacelsusBotEngine = ParacelsusBotEngine;
  window.ParacelsusWissensSuche = ParacelsusWissensSuche;
  window.ParacelsusAnalyticsStore = ParacelsusAnalyticsStore;
  window.createCalendarEventContent = createCalendarEventContent;
  window.scrubPII = scrubPII;
  window.buildMarketingUrl = buildMarketingUrl;
  window.REGION_MAPPING = REGION_MAPPING;
  window.getLevenshteinDistance = getLevenshteinDistance;
  window.safeFuzzyMatch = safeFuzzyMatch;
  window.fuzzyContains = safeFuzzyMatch; // Kompatibilität
  window.expandSemanticConcepts = expandSemanticConcepts;
  window.SEMANTIC_CONCEPT_RULES = SEMANTIC_CONCEPT_RULES;
  window.normalizeSpokenAndPhoneticInput = normalizeSpokenAndPhoneticInput;
  window.classifyUnrelatedQuery = classifyUnrelatedQuery;
  window.UNRELATED_QUERY_CATEGORIES = UNRELATED_QUERY_CATEGORIES;
  window.generateSpokenSummary = generateSpokenSummary;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ParacelsusBotEngine,
    ParacelsusWissensSuche,
    ParacelsusAnalyticsStore,
    scrubPII,
    buildMarketingUrl,
    createCalendarEventContent,
    EMERGENCY_CATEGORIES,
    REGION_MAPPING,
    getLevenshteinDistance,
    safeFuzzyMatch,
    fuzzyContains: safeFuzzyMatch,
    expandSemanticConcepts,
    SEMANTIC_CONCEPT_RULES,
    normalizeSpokenAndPhoneticInput,
    classifyUnrelatedQuery,
    UNRELATED_QUERY_CATEGORIES,
    generateSpokenSummary
  };
}
