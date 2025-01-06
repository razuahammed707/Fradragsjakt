import { useState } from 'react';

export function useQuestionnaireState() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  return {
    currentStepIndex,
    setCurrentStepIndex,
  };
}
