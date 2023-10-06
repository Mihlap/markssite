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
      if (state.countDepartment < 95) {
        state.countDepartment += 3;
      }
    },
    incrementGap: (state) => {
      if (state.countGap < 44) {
        state.countGap += 2;
      }
    },
    incrementScient: (state) => {
      if (state.countScient < 100) {
        state.countScient += 4;
      }
    },
    incrementScienceDegree: (state) => {
      if (state.countScienceDegree < 3300000) {
        state.countScienceDegree += 100000;
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