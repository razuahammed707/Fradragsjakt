import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface SubAnswer {
  [subQuestion: string]: string;
}

interface Answer {
  [mainQuestion: string]: SubAnswer[];
}

interface QuestionnaireItem {
  question: string;
  answers: Answer[];
}

interface QuestionnaireState {
  isModalOpen: boolean;
  questionnaires: QuestionnaireItem[];
}

const initialState: QuestionnaireState = {
  isModalOpen: false,
  questionnaires: [],
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    showModal(state, { payload }: PayloadAction<boolean>) {
      state.isModalOpen = payload;
    },
    addQuestionnaire(
      state,
      action: PayloadAction<{ question: string; answers: Answer[] }>
    ) {
      const existingIndex = state.questionnaires.findIndex(
        (item) => item.question === action.payload.question
      );

      if (existingIndex !== -1) {
        // Replace existing question's answers
        state.questionnaires[existingIndex] = {
          ...state.questionnaires[existingIndex],
          answers: action.payload.answers,
        };
      } else {
        // Add new question
        state.questionnaires.push(action.payload);
      }
    },
  },
});

export const { showModal, addQuestionnaire } = questionnaireSlice.actions;

export const questionnaireSelector = (state: RootState) => state.questionnaire;

export default questionnaireSlice.reducer;
