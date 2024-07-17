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
      if (state.countDepartment < 20) {
        state.countDepartment += 2;
      }
    },
    incrementGap: (state) => {
      if (state.countGap < 40) {
        state.countGap += 4;
      }
    },
    incrementScient: (state) => {
      if (state.countScient < 150) {
        state.countScient += 10;
      }
    },
    incrementScienceDegree: (state) => {
      if (state.countScienceDegree < 90) {
        state.countScienceDegree += 6;
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