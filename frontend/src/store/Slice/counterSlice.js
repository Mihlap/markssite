import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countDepartment: 0,
  countGap: 0,
  countScient: 0,
  countScienceDegree: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incrementDepartment: (state) => {
      if (state.countDepartment < 10) {
        state.countDepartment += 1;
      }
    },
    incrementGap: (state) => {
      if (state.countGap < 80) {
        state.countGap += 2;
      }
    },
    incrementScient: (state) => {
      if (state.countScient < 50) {
        state.countScient += 2;
      }
    },
    incrementScienceDegree: (state) => {
      if (state.countScienceDegree < 30) {
        state.countScienceDegree += 2;
      }
    },
  },
});

export const {
  incrementDepartment,
  incrementGap,
  incrementScient,
  incrementScienceDegree,
} = counterSlice.actions;

export default counterSlice.reducer;