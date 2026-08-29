/**
 * Configurazione del sito — modifica questo file per prezzi, contatti e contenuti.
 */

export const SITE = {
  name: "Claudio Asaro",
  shortName: "Claudio",
  brand: "Claudio | Ripetizioni STEM",
  footerBrand: "Claudio — Ripetizioni STEM online",
  title: "Claudio Asaro | Ripetizioni online di Analisi, Fisica e Chimica",
  description:
    "Ripetizioni online di Analisi 1, Analisi 2, Algebra Lineare, Fisica e Chimica. Oltre 2.600 lezioni con studenti di università e superiori. Lezioni individuali su Google Meet, con lavagna digitale e materiale inviato dopo la lezione.",
  url: "https://claudio-tutoring.vercel.app",
  locale: "it_IT",
} as const;

export const PRICING = {
  currency: "€",
  amount: 25,
  unit: "ora",
  label: "A partire da",
} as const;

export const PRICING_PACKAGES = [
  {
    id: "single",
    name: "Lezione singola",
    priceLabel: "€25",
    priceSuffix: "/ ora",
    detail: null as string | null,
    description: "Per dubbi, singoli argomenti o una lezione occasionale.",
    featured: false,
  },
  {
    id: "pack-5",
    name: "Pacchetto 5 ore",
    priceLabel: "€110",
    priceSuffix: " totali",
    detail: "€22 / ora",
    description: "Per lavorare su più argomenti o preparare una parte dell'esame.",
    featured: false,
  },
  {
    id: "pack-10",
    name: "Pacchetto 10 ore",
    priceLabel: "€200",
    priceSuffix: " totali",
    detail: "€20 / ora",
    description: "Per una preparazione completa e continuativa.",
    featured: true,
    badge: "Più conveniente",
  },
] as const;

/**
 * URL centrale per i CTA di prenotazione (es. Google Calendar Appointment Schedule).
 * Se vuoto, i pulsanti aprono il form di contatto.
 */
export const BOOKING_URL = "https://calendar.app.google/MKYm8xV3Ve7PkZWJ6";

/** Video di presentazione (YouTube) — non caricare mp4 nel repo */
export const INTRO_VIDEO = {
  youtubeId: "Frio8iyitb4",
  url: "https://youtu.be/Frio8iyitb4",
  poster: "/images/video-poster.png",
} as const;

export const CONTACT = {
  phoneDisplay: "+39 366 322 0855",
  whatsapp: "https://wa.me/393663220855",
  telegram: "https://t.me/+393663220855",
  email: "klaudio.asaro5@gmail.com",
  bookingUrl: BOOKING_URL,
  instagram: "",
  linkedin: "",
} as const;

export const STATS = {
  lessonsTaught: "2.600+",
  lessonsLabel: "Lezioni svolte",
  experienceValue: "4+ anni",
  experienceLabel: "Di esperienza",
  audienceValue: "Università + superiori",
  audienceLabel: "Livelli seguiti",
  reachValue: "100% online",
  reachLabel: "Da dove vuoi",
} as const;

export const NAV_LINKS = [
  { href: "#subjects", label: "Materie" },
  { href: "#how-it-works", label: "Come funziona" },
  { href: "#results", label: "Esperienza" },
  { href: "#about", label: "Chi sono" },
  { href: "#pricing", label: "Prezzi" },
] as const;

export const SUBJECTS = [
  {
    id: "analisi-1",
    title: "Analisi 1",
    description:
      "Limiti, derivate, integrali, funzioni, successioni — e preparazione all'esame.",
    icon: "integral" as const,
  },
  {
    id: "analisi-2",
    title: "Analisi 2",
    description:
      "Funzioni di più variabili, equazioni differenziali, integrali multipli e dintorni.",
    icon: "surface" as const,
  },
  {
    id: "linear-algebra",
    title: "Algebra Lineare",
    description: "Matrici, sistemi, vettori, autovalori, spazi vettoriali.",
    icon: "matrix" as const,
  },
  {
    id: "physics",
    title: "Fisica",
    description:
      "Cinematica, dinamica, termodinamica e meccanica — per università o superiori.",
    icon: "atom" as const,
  },
  {
    id: "chemistry",
    title: "Chimica",
    description:
      "Moli, struttura atomica, legami, reazioni, equilibri — scuola e università.",
    icon: "flask" as const,
  },
] as const;

/** Materie secondarie — chip sotto le card principali */
export const ADDITIONAL_SUBJECTS = [
  {
    category: "Matematica",
    items: ["Metodi Numerici"],
  },
  {
    category: "Fisica & Ingegneria",
    items: [
      "Meccanica Razionale",
      "Meccanica Applicata alle Macchine",
      "Termodinamica Applicata",
      "Fluidodinamica",
      "Scienza dei Materiali",
      "Scienza delle Costruzioni",
      "Teoria dei Segnali",
    ],
  },
  {
    category: "Programmazione",
    items: ["Python", "MATLAB"],
  },
] as const;

/**
 * Esperienza verificabile — screenshot / documenti reali.
 * GoStudent: crop della dashboard (solo conteggio sessioni, niente guadagni).
 * Pisa / Classgap: documenti o profilo con ID privati rimossi.
 * `images` può avere più file: nello scroll della sezione no; nel lightbox sì.
 */
export const PROOF_ITEMS = [
  {
    id: "gostudent",
    title: "GoStudent",
    highlight: "2.500+ sessioni",
    description:
      "Dashboard con il conteggio delle sessioni svolte — senza dati di guadagno.",
    images: [
      {
        src: "/images/proof-gostudent.png",
        label: "Dashboard sessioni",
      },
      {
        src: "/images/proof-gostudent-certificate.png",
        label: "Certificato 500 sessioni",
      },
    ],
    placeholderLabel: "Screenshot dashboard",
  },
  {
    id: "unipi",
    title: "Università di Pisa",
    highlight: "Ingegneria Aerospaziale",
    description:
      "Documento ufficiale di percorso accademico, con dati privati rimossi.",
    images: [
      {
        src: "/images/proof-unipi.png",
        label: "Portale ALICE",
      },
      {
        src: "/images/proof-unipi-exams.png",
        label: "Esami sostenuti",
      },
    ],
    placeholderLabel: "Documento ufficiale",
  },
  {
    id: "classgap",
    title: "Classgap",
    highlight: "Esperienza verificabile",
    description:
      "Profilo o dashboard con attività, lezioni o recensioni verificabili.",
    images: [
      {
        src: "/images/proof-classgap.png",
        label: "Profilo Classgap",
      },
    ],
    placeholderLabel: "Profilo / dashboard",
  },
] as const;

/**
 * Testimonianze — solo feedback veri. Non inventare recensioni.
 */
export const TESTIMONIALS = [
  {
    id: "davide-t",
    name: "Davide T.",
    subject: "Matematica · Algebra Lineare",
    quote:
      "Claudio è un tutor straordinario! Grazie alle sue ripetizioni di matematica di base e algebra lineare, ho finalmente affrontato queste materie con sicurezza. È chiaro e paziente nell'esplicare i concetti complessi, rendendo l'apprendimento piacevole. Le sue lezioni sono state fondamentali per approfondire lo studio in tali materie. Consiglio vivamente Claudio come tutor per chiunque abbia bisogno di supporto in matematica.",
    result: "",
    rating: 5,
  },
  {
    id: "federico-m",
    name: "Federico M.",
    subject: "Analisi 1",
    quote:
      "Ragazzo molto preparato e alla mano, già dalla prima lezione ho visto dei miglioramenti. Lo consiglio a chi, come me, ha avuto delle difficoltà in Analisi 1.",
    result: "",
    rating: 5,
  },
  {
    id: "gabriele",
    name: "Gabriele",
    subject: "",
    quote:
      "Claudio è abbastanza preparato e molto smart, va subito al dunque e conosce bene mi sembra la materia senza nessun tentennamento.",
    result: "",
    rating: 5,
  },
  {
    id: "omar",
    name: "Omar",
    subject: "",
    quote:
      "Buon insegnante e anche molto simpatico, ti spiega bene gli argomenti in modo in cui tu possa comprendere e si adatta ai tuoi orari.",
    result: "",
    rating: 5,
  },
  {
    id: "frans",
    name: "Frans",
    subject: "",
    quote:
      "Davvero utile molto disponibile e sopratutto chiaro e formale davvero bravo",
    result: "",
    rating: 5,
  },
  {
    id: "giulia-c",
    name: "Giulia C.",
    subject: "",
    quote: "Ottimo e comprensibile",
    result: "",
    rating: 5,
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Posso mandarti materiale prima della lezione?",
    answer:
      "Sì, anzi è consigliato. Puoi inviarmi esercizi, teoria, tracce d'esame o materiale del corso così so già da dove partire.",
  },
  {
    question: "Dove si fanno le lezioni?",
    answer:
      "Online tramite Google Meet. Prenoti l'orario e ti mando il link: ti basta aprirlo.",
  },
  {
    question: "Come funziona la lavagna?",
    answer:
      "Condivido lo schermo e uso iDroo per teoria, formule, grafici ed esercizi. A fine lezione salvo la lavagna e te la mando in PDF o immagine.",
  },
  {
    question: "Possiamo fare più di un'ora?",
    answer:
      "Sì. Possiamo organizzare lezioni da 1, 2 o più ore quando ha senso per il lavoro da fare.",
  },
  {
    question: "Posso preparare uno scritto o un orale specifico?",
    answer:
      "Sì. Se mi mandi programma, materiale e informazioni sull'esame, possiamo impostare la preparazione proprio su quella prova.",
  },
  {
    question: "E se le basi sono un disastro?",
    answer:
      "Nessun problema. Prima capiamo dove hai i buchi, poi ricostruiamo con calma. Non serve fingere di sapere già tutto.",
  },
  {
    question: "Posso spostare una lezione?",
    answer:
      "Certo. Scrivimi e troviamo insieme un altro giorno e orario disponibile.",
  },
  {
    question: "Come posso pagare?",
    answer:
      "Puoi pagare tramite bonifico bancario o PayPal. Per esigenze particolari possiamo concordare anche altre modalità.",
  },
  {
    question: "Quando si paga?",
    answer:
      "Per le lezioni singole possiamo concordare il pagamento prima o al termine della lezione. I pacchetti vengono invece concordati al momento della prenotazione.",
  },
  {
    question: "Posso fare una singola lezione senza acquistare un pacchetto?",
    answer:
      "Assolutamente sì. I pacchetti sono solo un'opzione per chi vuole lavorare con più continuità.",
  },
] as const;

export function formatPrice() {
  return `${PRICING.currency}${PRICING.amount}`;
}

export function hasBookingUrl() {
  return Boolean(BOOKING_URL.trim());
}

export function hasDirectContact() {
  return Boolean(
    CONTACT.email?.trim() ||
      CONTACT.whatsapp?.trim() ||
      CONTACT.telegram?.trim()
  );
}
