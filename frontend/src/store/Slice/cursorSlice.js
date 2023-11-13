import { createSlice } from "@reduxjs/toolkit";

const cursorSlice = createSlice({
  name: "cursor",
  initialState: "default",
  reducers: {
    textEnter: () => "text",
    imageHover: () => "imageHover",
    specialHover: () => "specialHover",
    textLeave: () => "default",
    mouseDown: () => "mouseDown",
    mouseUp: () => "mouseUp",
  },
});

export const { textEnter, textLeave, imageHover,specialHover, mouseDown, mouseUp } =
  cursorSlice.actions;

  export default cursorSlice.reducer;