import { createSlice } from "@reduxjs/toolkit";

const cursorSlice = createSlice({
  name: "cursor",
  initialState: "default",
  reducers: {
    textEnter: () => "text",
    textLeave: () => "default",
  },
});

export const { textEnter, textLeave } = cursorSlice.actions;

export default cursorSlice.reducer;
