import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface QuestionnaireState {
  isModalOpen: boolean;
}

const initialState: QuestionnaireState = {
  isModalOpen: false,
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    showModal(state, { payload }) {
      state.isModalOpen = payload;
    },
    closeModal(state, { payload }) {
      state.isModalOpen = payload;
    },
  },
});

export const { showModal, closeModal } = questionnaireSlice.actions;
export const questionnaireSelector = (state: RootState) => state.questionnaire;
export default questionnaireSlice.reducer;
