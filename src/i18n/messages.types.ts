import type {
  ContactFieldErrors,
  FieldError,
} from "../lib/validateContactForm";
import type { Locale } from "./locales";

type CountryCode =
  | "AT"
  | "AZ"
  | "AL"
  | "AD"
  | "AM"
  | "BY"
  | "BE"
  | "BG"
  | "BA"
  | "VA"
  | "GB"
  | "HU"
  | "DE"
  | "GR"
  | "GE"
  | "DK"
  | "IE"
  | "IS"
  | "ES"
  | "IT"
  | "KZ"
  | "CY"
  | "LV"
  | "LT"
  | "LI"
  | "LU"
  | "MT"
  | "MD"
  | "MC"
  | "NL"
  | "NO"
  | "PL"
  | "PT"
  | "RU"
  | "RO"
  | "SM"
  | "MK"
  | "RS"
  | "SK"
  | "SI"
  | "TR"
  | "UA"
  | "FI"
  | "FR"
  | "HR"
  | "ME"
  | "CZ"
  | "CH"
  | "SE"
  | "EE";

export type Messages = {
  metadata: { title: string; description: string };
  header: {
    homeLabel: string;
    openMenu: string;
    closeMenu: string;
    navigationLabel: string;
    navigation: Record<
      "about" | "advantages" | "programs" | "reviews" | "faq" | "contact",
      string
    >;
    cta: string;
    languageLabel: string;
    languages: Record<Locale, string>;
    discardDraft: string;
    switchUnavailable: string;
    switchFailed: string;
  };
  hero: {
    pill: string;
    heading: string;
    headingEmphasis: string;
    description: string;
    benefits: {
      explanation: { text: string; detail: string };
      preparation: { text: string; detail: string };
      support: { text: string; detail: string; ending: string };
    };
    cta: string;
    demo: string;
    portraitAlt: string;
  };
  team: {
    heading: string;
    headingEmphasis: string;
    description: string;
    demo: string;
    listLabel: string;
    portraits: Record<
      "nastya" | "teacher-glasses" | "teacher-woman" | "teacher-curly",
      string
    >;
    profile: {
      title: string;
      badge: string;
      close: string;
      demoHeading: string;
      notice: string;
      latinPlaceholder: string;
    };
  };
  advantages: {
    heading: string;
    demo: string;
    items: Record<
      "focus" | "support" | "format",
      { title: string; description: string }
    >;
  };
  faq: {
    heading: string;
    demo: string;
    answerPrefix: string;
    items: Record<
      | "lessons"
      | "group-size"
      | "online-format"
      | "languages"
      | "starting-level"
      | "payment",
      { question: string; answer: string }
    >;
  };
  contact: {
    heading: string;
    headingEmphasis: string;
    description: string;
    form: {
      legend: string;
      name: string;
      phone: string;
      comment: string;
      required: string;
      optional: string;
      namePlaceholder: string;
      phonePlaceholder: string;
      commentPlaceholder: string;
      countryLabel: string;
      submit: string;
      submitAgain: string;
      pendingButton: string;
      successHeading: string;
      preview: string;
    };
    errors: Record<keyof ContactFieldErrors, Record<FieldError, string>>;
    feedback: {
      pending: string;
      accepted: string;
      fieldErrors: string;
      verification_error: string;
      delivery_error: string;
      server_error: string;
      network_error: string;
    };
  };
  turnstile: {
    unavailable: string;
    loading: string;
    loadError: string;
    renderError: string;
    interactionRequired: string;
    verificationError: string;
    expired: string;
    timeout: string;
    retry: string;
  };
  countries: Record<CountryCode, string>;
};
