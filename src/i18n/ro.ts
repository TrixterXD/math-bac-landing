import type { Messages } from "./messages.types";

// Draft translations: native-speaker review is required before publication.
export const ro = {
  metadata: {
    title: "EasyMath — Prototip educațional",
    description:
      "Prototip educațional de site despre pregătirea online pentru BAC la matematică. Conținutul este demonstrativ și nu este aprobat pentru utilizare comercială.",
  },
  header: {
    homeLabel: "EasyMath — pagina principală",
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
    discardDraft: "Schimbați limba și ștergeți datele introduse în formular?",
    switchUnavailable:
      "Schimbarea limbii este blocată cât timp solicitarea se trimite sau rezultatul trimiterii este incert.",
  },
  hero: {
    pill: "Școală online · Matematică · Pregătire pentru BAC",
    heading: "Meditații individuale la matematică",
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
    heading: "Despre Anastasia",
    reviewsHeading: "Recenzii",
    reviewsNavigation: {
      previous: "Pagina anterioară de recenzii",
      next: "Pagina următoare de recenzii",
    },
    reviews: {
      parent: {
        fullName: "Anonim",
        role: "Părinte al unui elev de clasa a VI-a",
        text: "Bună ziua, sunt foarte bucuroasă să aud că azi a mai luat încă o notă pozitivă. Artiom e foarte entuziasmat de succesele lui. Mi-a spus că de când face ore cu dvs. înțelege altfel decât de la profesoară. Vă mulțumim pentru contribuția adusă lui cu ajutorul vostru și pentru încrederea că poate.",
      },
      bianca: {
        fullName: "Bianca",
        role: "Elevă în clasa a X-a",
        text: "Profesoara explică subiectele pe înțelesul copilului și nivelul acestuia, am avut de fiecare dată sentimente pozitive după ore. M-a ajutat să înțeleg mai bine temele și mi-a dat mai multă încredere în mine 💋",
      },
      andreea: {
        fullName: "Andreea",
        role: "Elevă în clasa a X-a",
        text: "Îți mulțumesc enorm, ești extrem de drăguță, am rămas cu niște impresii foarte plăcute.",
      },
      corina: {
        fullName: "Corina",
        role: "Elevă în clasa a IX-a",
        text: "Salut. Am o veste bună. Am aflat rezultatele de la examene și la matematică am obținut punctaj maxim. ☺️",
      },
      dumitru: {
        fullName: "Dumitru",
        role: "Absolvent, clasa a XII-a",
        text: "O profesoară de nota 10! Explică totul foarte clar și pe înțelesul tuturor. Am început pregătirea știind practic nimic la matematică, iar cu ajutorul ei am reușit să ajung la susținerea BAC-ului după doar două săptămâni de pregătire. Sunt foarte recunoscător pentru tot ajutorul oferit și o recomand cu toată încrederea!",
      },
      milenaMother: {
        fullName: "Mama Milenei",
        role: "Părinte, clasa a IX-a",
        text: "Domnișoara Anastasia, bună seara!\n\nVă mulțumesc din suflet pentru ajutor 🙏\n\nȘi sper că pe viitor, o să mai aveți posibilitatea de a petrece lecții cu Milena.\n\nChiar ați făcut o muncă enormă 🌷",
      },
      elena: {
        fullName: "Elena",
        role: "Elevă, clasa a XI-a",
        text: "Am cunoscut-o pe Nastia în 2024, când mă pregăteam pentru examenul de matematică din clasa a IX-a. Am încercat și alți profesori, dar nimeni nu a reușit să-mi explice matematica atât de clar și să-mi ofere atâta încredere.",
        expansion: {
          text: "Pentru mine, Nastia a devenit mai mult decât o profesoară — a devenit și o prietenă cu care puteam vorbi deschis. Îi voi fi mereu recunoscătoare pentru răbdare, sprijin și toate lecțiile noastre! ❤️🫶🏻",
          expandLabel: "Citește mai mult",
          collapseLabel: "Arată mai puțin",
        },
      },
    },
    description:
      "Cred că fiecare elev poate avea succes la matematică. Are nevoie doar de îndrumare bine organizată, explicații clare și sprijin.",
    listLabel: "Profilul Anastasiei",
    portraits: {
      nastya: "Nastya — fondatoare și profesoară de matematică",
      "teacher-glasses": "Portret demonstrativ al unui profesor cu ochelari",
      "teacher-woman": "Portret demonstrativ al unei profesoare",
      "teacher-curly": "Portret demonstrativ al unui profesor cu părul creț",
    },
    profile: {
      title: "Despre Anastasia",
      badge: "Despre Anastasia ↗",
      close: "Închide",
      biography: [
        "Bună! Sunt Anastasia, fondatoarea acestui proiect educațional și profesor de matematică cu peste 5 ani de experiență.",
        "Povestea mea în lumea matematicii a început încă din perioada liceului, când am descoperit cât de mult îmi place să explic, să ajut și să fac lucrurile complicate mai ușor de înțeles.",
        "De-a lungul anilor, am lucrat cu zeci de elevi, fiecare cu propriul ritm, propriile dificultăți și obiective.",
        "Am creat acest proiect din dorința de a oferi elevilor mai mult decât simple lecții de matematică: un mediu în care pot pune întrebări fără rețineri, pot învăța în ritmul lor și își pot dezvolta încrederea în propriile capacități.",
        "Cred că fiecare elev poate obține rezultate frumoase atunci când beneficiază de îndrumarea potrivită!",
      ],
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
