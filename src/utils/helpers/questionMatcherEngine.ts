interface Questionnaire {
  question: string;
  answers: string[];
  // Add other properties if they exist
}

export const questionMatcherEngine = (
  question: string,
  questionnaires: Questionnaire[]
): Questionnaire | undefined => {
  console.log('incoming question', question);
  console.log('incoming questionnaires', questionnaires);
  if (!question || !questionnaires) return undefined;

  const matchedQuestion = questionnaires.find(
    (questionnaire) =>
      questionnaire.question.toLowerCase() === question.toLowerCase()
  );

  console.log('matchedQuestion', matchedQuestion);
  return matchedQuestion;
};
