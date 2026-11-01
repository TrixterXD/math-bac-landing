import type { Messages } from "../../i18n/messages.types";

export const heroBenefits = [
  {
    id: "explanation",
    icon: "M2 9 12 4l10 5-10 5L2 9Zm4 3v6c4 3 8 3 12 0v-6M22 9v8",
  },
  {
    id: "preparation",
    icon: "M4 20v-6h4v6H4Zm6 0V9h4v11h-4Zm6 0V4h4v16h-4ZM3 10l6-5 4 1 6-4",
  },
  {
    id: "support",
    icon: "M12 21 3.5 12.5C-2 7 6 0 12 7c6-7 14 0 8.5 5.5L12 21Z",
  },
] satisfies { id: keyof Messages["hero"]["benefits"]; icon: string }[];
