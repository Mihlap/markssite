import { createSlice } from '@reduxjs/toolkit';

const previousPageSlice = createSlice({
  name: 'previousPage',
  initialState: '',
  reducers: {
    setPreviousPage: (state, action) => action.payload,
  },
});

export const { setPreviousPage } = previousPageSlice.actions;
export default previousPageSlice.reducer;
