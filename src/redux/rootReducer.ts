import { combineReducers } from '@reduxjs/toolkit';
import questionnaireSlice from './slices/questionnaire';

export const reducer = combineReducers({
  questionnaire: questionnaireSlice,
  // Add other reducers here
});
