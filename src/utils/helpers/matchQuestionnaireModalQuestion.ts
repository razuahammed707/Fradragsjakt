import { AccordionItemData } from '@/types/questionnaire';

export const matchQuestionnaireModalQuestion = ({
  questionnaire,
  accordionData,
}: {
  questionnaire: string[];
  accordionData: AccordionItemData[];
}) => {
  const matchedAccordionData = questionnaire
    ? questionnaire
        .map((answer) =>
          accordionData.find((accordion) => {
            // Normalize function to decompose combined characters and remove special characters
            const normalize = (str: string) =>
              str
                .toLowerCase()
                .normalize('NFKD')
                .replace(/[^\w\s]/g, '');

            const normalizedAnswer = normalize(answer); // Normalize the answer
            const normalizedTitle = normalize(accordion.title); // Normalize the title

            // Check if the normalized title contains the normalized answer (partial match)
            return normalizedTitle.includes(normalizedAnswer);
          })
        )
        .filter((item): item is AccordionItemData => item !== undefined)
    : accordionData;

  return matchedAccordionData;
};
