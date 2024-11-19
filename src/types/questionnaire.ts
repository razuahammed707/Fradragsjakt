export type Questionnaire = {
  question: string;
  answers: string[];
};

export type AccordionItemData = {
  id: string;
  title: string;
  content: React.ReactNode | string;
};
