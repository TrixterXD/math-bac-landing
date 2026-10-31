import type { Messages } from "./messages.types";

// Draft translations: native-speaker review is required before publication.
export const ro = {
  metadata: {
    title: "Math BAC — Prototip educațional",
    description:
      "Prototip educațional de site despre pregătirea online pentru BAC la matematică. Conținutul este demonstrativ și nu este aprobat pentru utilizare comercială.",
  },
  header: {
    homeLabel: "Math BAC — pagina principală",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
    navigationLabel: "Navigare principală",
    navigation: {
      about: "Despre noi",
      advantages: "Avantaje",
      programs: "Programe",
      reviews: "Recenzii",
      faq: "Întrebări frecvente",
      contact: "Contacte",
    },
    cta: "Lasă o solicitare",
    languageLabel: "Limba site-ului",
    switchFailed: "Nu s-a putut schimba limba. Încercați din nou.",
    languages: { ro: "Română", ru: "Русский" },
    switchUnavailable:
      "După începerea completării formularului, schimbarea limbii nu este disponibilă, pentru a păstra datele și rezultatul trimiterii.",
  },
  hero: {
    pill: "Școală online · Matematică · Pregătire pentru BAC",
    heading: "Pregătire pentru BAC",
    headingEmphasis: "la matematică, online",
    description:
      "Cunoștințe solide. Părinți liniștiți.\nRezultate înalte la examen.",
    benefits: {
      explanation: {
        text: "Explicații clare",
        detail: " pentru subiecte dificile",
      },
      preparation: {
        text: "Pregătire sistematică",
        detail: " conform programei de BAC",
      },
      support: {
        text: "Sprijin",
        detail: " și motivație",
        ending: " la fiecare etapă",
      },
    },
    cta: "Lasă o solicitare",
    demo: "Prototip educațional: descrierea și avantajele sunt demonstrative.",
    portraitAlt: "Nastya stă la masă cu un caiet și un pix",
  },
  team: {
    heading: "Nastya",
    headingEmphasis: "și echipa",
    description:
      "Credem că fiecare elev poate obține o notă mare la BAC — are nevoie doar de îndrumare bine organizată, explicații clare și sprijin.",
    demo: "Prototip educațional: textul și portretele echipei sunt demonstrative și nu reprezintă componența confirmată a școlii.",
    listLabel: "Profesori — demonstrație",
    portraits: {
      nastya: "Nastya — fondatoare și profesoară de matematică",
      "teacher-glasses": "Portret demonstrativ al unui profesor cu ochelari",
      "teacher-woman": "Portret demonstrativ al unei profesoare",
      "teacher-curly": "Portret demonstrativ al unui profesor cu părul creț",
    },
    profile: {
      title: "Despre Nastya",
      badge: "Despre Nastya ↗",
      close: "Închide",
      demoHeading: "Biografie demonstrativă",
      notice:
        "Text provizoriu pentru prototipul educațional. Nu conține informații reale despre Nastya; biografia va fi adăugată după aprobare.",
      latinPlaceholder:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo eget magna fermentum iaculis. Donec vel sapien at quam tincidunt viverra.",
    },
  },
  advantages: {
    heading: "Avantaje",
    demo: "Prototip educațional: avantajele și descrierile sunt variante demonstrative propuse spre aprobare, nu promisiuni confirmate ale școlii.",
    items: {
      focus: {
        title: "Accent pe rezultat",
        description:
          "Abordare propusă: analizarea formatului BAC și exersarea subiectelor de examen, cu consolidarea treptată a cunoștințelor.",
      },
      support: {
        title: "Sprijin și motivație",
        description:
          "Abordare propusă: discutarea dificultăților fără teama de a greși, încurajarea întrebărilor și observarea propriului progres.",
      },
      format: {
        title: "Format modern și comod",
        description:
          "Abordare propusă: combinarea lecțiilor online, a materialelor didactice și a exercițiului individual între lecții.",
      },
    },
  },
  faq: {
    heading: "Întrebări frecvente",
    demo: "Prototip educațional: răspunsurile de mai jos sunt texte demonstrative provizorii, nu condiții confirmate ale școlii.",
    answerPrefix: "Răspuns demonstrativ. ",
    items: {
      lessons: {
        question: "Cum se desfășoară lecțiile?",
        answer:
          "Aici va apărea descrierea lecțiilor online: platforma, durata și modul de lucru. Detaliile urmează să fie stabilite împreună cu școala.",
      },
      "group-size": {
        question: "Câți elevi sunt într-o grupă?",
        answer:
          "Aici vor fi informații despre mărimea grupelor și formatele de studiu disponibile. Numărul concret de elevi nu este încă confirmat.",
      },
      "online-format": {
        question: "Este formatul online potrivit pentru copilul meu?",
        answer:
          "Aici vor fi explicate cerințele privind dispozitivul, conexiunea la internet și lucrul individual al elevului. Recomandările vor fi precizate după aprobare.",
      },
      languages: {
        question: "În ce limbi se desfășoară lecțiile?",
        answer:
          "Aici va apărea lista limbilor de predare și ale materialelor didactice. Opțiunile disponibile nu sunt încă confirmate.",
      },
      "starting-level": {
        question: "Ce nivel inițial este necesar?",
        answer:
          "Aici vor fi descrise cerințele privind cunoștințele inițiale și modul posibil de alegere a programului. Condițiile urmează să fie stabilite împreună cu școala.",
      },
      payment: {
        question: "Cum se efectuează plata?",
        answer:
          "Aici vor apărea condițiile de plată aprobate. Costul, metodele de plată și termenele nu sunt încă stabilite pentru acest prototip.",
      },
    },
  },
  contact: {
    heading: "Ai întrebări",
    headingEmphasis: "sau vrei să te înscrii?",
    description:
      "Lasă o solicitare pentru a discuta despre pregătirea online pentru BAC la matematică.",
    form: {
      legend: "Solicitare pentru pregătire",
      name: "Nume",
      phone: "Telefon",
      comment: "Comentariu",
      required: "(obligatoriu)",
      optional: "(opțional)",
      namePlaceholder: "Cum să ne adresăm?",
      phonePlaceholder: "69 123 456",
      commentPlaceholder:
        "Clasa, dificultățile la matematică sau scopul pregătirii",
      countryLabel: "Țara și prefixul telefonic",
      submit: "Trimite solicitarea",
      submitAgain: "Trimite încă o solicitare",
      pendingButton: "Se trimite…",
      successHeading: "Mulțumim! Solicitarea a fost trimisă",
      preview:
        "Prototip educațional: formularul trimite un e-mail de test real. În timpul testării controlate, nu introduce date personale reale.",
    },
    errors: {
      name: {
        required: "Indică cum să ne adresăm.",
        too_long: "Scurtează numele la cel mult 100 de caractere.",
        invalid:
          "Introdu numele folosind litere. Între părțile numelui se permite un spațiu, o cratimă sau un apostrof, fără repetări.",
      },
      country: {
        required: "Selectează o țară din listă.",
        too_long: "Selectează o țară din listă.",
        invalid: "Selectează o țară din listă.",
      },
      phone: {
        required: "Indică numărul de telefon.",
        too_long: "Verifică numărul de telefon și prefixul țării.",
        invalid:
          "Introdu un număr valid pentru una dintre țările din listă. Pentru un număr internațional, indică prefixul cu +.",
      },
      comment: {
        required: "Comentariul poate rămâne necompletat.",
        too_long: "Scurtează comentariul la cel mult 1000 de caractere.",
        invalid: "Introdu comentariul ca text sau lasă câmpul necompletat.",
      },
    },
    feedback: {
      pending: "Se trimite solicitarea…",
      accepted: "Solicitarea a fost acceptată. Așteaptă să te contactăm.",
      fieldErrors: "Verifică câmpurile marcate: {count}.",
      verification_error:
        "Verificarea de securitate nu a fost confirmată. Datele au fost păstrate. Efectuează o nouă verificare și trimite din nou solicitarea.",
      delivery_error:
        "Nu s-a putut confirma trimiterea solicitării. Datele au fost păstrate. Este posibil ca solicitarea să fi fost acceptată — nu o trimite din nou până când rezultatul nu este clarificat.",
      server_error:
        "Solicitarea nu a putut fi procesată pe server. Datele au fost păstrate. Încearcă mai târziu.",
      network_error:
        "Conexiunea cu serverul s-a întrerupt. Nu s-a putut confirma rezultatul trimiterii. Datele au fost păstrate; nu trimite din nou solicitarea până când rezultatul nu este clarificat.",
    },
  },
  turnstile: {
    unavailable:
      "Verificarea de securitate nu este configurată. Trimiterea nu este disponibilă.",
    loading: "Verificarea de securitate este încă în curs…",
    loadError:
      "Verificarea nu s-a încărcat. Verifică conexiunea și repetă verificarea.",
    renderError: "Verificarea nu a putut fi încărcată. Încearcă să o repeți.",
    interactionRequired:
      "Efectuează verificarea de securitate înainte de trimitere.",
    verificationError:
      "Verificarea nu a reușit. Repetă verificarea de securitate.",
    expired: "Verificarea a expirat. Efectueaz-o din nou înainte de trimitere.",
    timeout:
      "Timpul alocat verificării a expirat. Repetă verificarea de securitate.",
    retry: "Repetă verificarea",
  },
  countries: {
    AT: "Austria",
    AZ: "Azerbaidjan",
    AL: "Albania",
    AD: "Andorra",
    AM: "Armenia",
    BY: "Belarus",
    BE: "Belgia",
    BG: "Bulgaria",
    BA: "Bosnia și Herțegovina",
    VA: "Vatican",
    GB: "Regatul Unit",
    HU: "Ungaria",
    DE: "Germania",
    GR: "Grecia",
    GE: "Georgia",
    DK: "Danemarca",
    IE: "Irlanda",
    IS: "Islanda",
    ES: "Spania",
    IT: "Italia",
    KZ: "Kazahstan",
    CY: "Cipru",
    LV: "Letonia",
    LT: "Lituania",
    LI: "Liechtenstein",
    LU: "Luxemburg",
    MT: "Malta",
    MD: "Moldova",
    MC: "Monaco",
    NL: "Țările de Jos",
    NO: "Norvegia",
    PL: "Polonia",
    PT: "Portugalia",
    RU: "Rusia",
    RO: "România",
    SM: "San Marino",
    MK: "Macedonia de Nord",
    RS: "Serbia",
    SK: "Slovacia",
    SI: "Slovenia",
    TR: "Turcia",
    UA: "Ucraina",
    FI: "Finlanda",
    FR: "Franța",
    HR: "Croația",
    ME: "Muntenegru",
    CZ: "Cehia",
    CH: "Elveția",
    SE: "Suedia",
    EE: "Estonia",
  },
} satisfies Messages;
