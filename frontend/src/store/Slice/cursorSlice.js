import { createSlice } from "@reduxjs/toolkit";

const cursorSlice = createSlice({
  name: "cursor",
  initialState: "default",
  reducers: {
    textEnter: () => "text",
    textFooter: () => "textFooter",
    textFooterEnter: () => "textFooterEnter",
    imageHover: () => "imageHover",
    specialHover: () => "specialHover",
    textLeave: () => "default",
    textLeaveFooter: () => "textLeaveFooter",
    mouseDown: () => "mouseDown",
    mouseUp: () => "mouseUp",
  },
});

export const {
  textEnter,
  textFooter,
  textFooterEnter,
  textLeave,
  imageHover,
  specialHover,
  textLeaveFooter,
  mouseDown,
  mouseUp,
} = cursorSlice.actions;

export default cursorSlice.reducer;
