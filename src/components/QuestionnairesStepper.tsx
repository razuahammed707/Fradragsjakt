import { Dispatch, SetStateAction, useState } from 'react';
import { questionnaires } from '@/lib/questionnaires';
import { SelectedAnswer } from './layout/auth/VerifyEmail';
import QuestionnairesStepperContent from './QuestionnairesStepperContent';

type QuestionnairesStepperProps = {
  selectedAnswers: SelectedAnswer[];
  handleComplete?: () => void;
  setSelectedAnswers: Dispatch<SetStateAction<SelectedAnswer[]>>;
  loading?: boolean;
};

export default function QuestionnairesStepper({
  selectedAnswers,
  handleComplete,
  setSelectedAnswers,
  loading,
}: QuestionnairesStepperProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const step = questionnaires[currentStepIndex];

  const handleAnswerClick = (answer: string, question: string): void => {
    setSelectedAnswers((prev) => {
      const existingQuestion = prev.find((item) => item.question === question);
      if (existingQuestion) {
        const isAnswerSelected = existingQuestion.answers.includes(answer);
        const updatedAnswers = isAnswerSelected
          ? existingQuestion.answers.filter((ans) => ans !== answer)
          : [...existingQuestion.answers, answer];

        return prev.map((item) =>
          item.question === question
            ? { ...item, answers: updatedAnswers }
            : item
        );
      } else {
        return [...prev, { question, answers: [answer] }];
      }
    });
  };

  const goToNextStep = () => setCurrentStepIndex((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStepIndex((prev) => prev - 1);

  return (
    <>
      <div className="py-4 px-12">
        <span className="text-sm text-[#71717A] font-medium">
          Step {currentStepIndex + 1}/{questionnaires.length}
        </span>
      </div>
      <div className="flex h-[calc(100vh-64px)] justify-center items-center">
        <QuestionnairesStepperContent
          step={step}
          selectedAnswers={selectedAnswers}
          currentStepIndex={currentStepIndex}
          questionnaires={questionnaires}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          handleComplete={handleComplete}
          loading={loading}
          handleAnswerClick={handleAnswerClick}
        />
      </div>
    </>
  );
}
