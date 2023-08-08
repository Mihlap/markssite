import { createSlice } from "@reduxjs/toolkit";

const cursorSlice = createSlice({
  name: "cursor",
  initialState: "default",
  reducers: {
    textEnter: () => "text",
    imageHover: () => "imageHover",
    textLeave: () => "default",
  },
});

export const { textEnter, textLeave, imageHover } = cursorSlice.actions;

export default cursorSlice.reducer;
