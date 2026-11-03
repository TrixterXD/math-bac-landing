export type Review = {
  id: string;
  fullName: string;
  role: "Student" | "Parent";
  initials: string;
  text: string;
};

export const reviews: Review[] = [
  {
    id: "elena",
    fullName: "Elena Popescu",
    role: "Student",
    initials: "EP",
    text: "Working through examples step by step helped me feel more comfortable asking questions about mathematics.",
  },
  {
    id: "andrei",
    fullName: "Andrei Rusu",
    role: "Student",
    initials: "AR",
    text: "I liked having time to discuss mistakes and try a different approach when an exercise felt difficult.",
  },
  {
    id: "maria",
    fullName: "Maria Munteanu",
    role: "Parent",
    initials: "MM",
    text: "The online format would make it easier for our family to include mathematics practice in the weekly routine.",
  },
];
