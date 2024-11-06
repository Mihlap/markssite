import { createSlice } from '@reduxjs/toolkit';

const cursorSlice = createSlice({
  name: 'cursor',
  initialState: 'default',
  reducers: {
    textEnter: () => 'text',
    textFooter: () => 'textFooter',
    textFooterWhite: () => 'textFooterWhite',
    textFooterEnter: () => 'textFooterEnter',
    textFooterWhiteEnter: () => 'textFooterWhiteEnter',
    imageHover: () => 'imageHover',
    specialHover: () => 'specialHover',
    textLeave: () => 'default',
    textLeaveFooter: () => 'textLeaveFooter',
    textLeaveWhiteFooter: () => 'textLeaveWhiteFooter',
    mouseDown: () => 'mouseDown',
    mouseUp: () => 'mouseUp',
  },
});

export const {
  textEnter,
  textFooter,
  textFooterWhite,
  textFooterEnter,
  textFooterWhiteEnter,
  textLeave,
  imageHover,
  specialHover,
  textLeaveFooter,
  textLeaveWhiteFooter,
  mouseDown,
  mouseUp,
} = cursorSlice.actions;

export default cursorSlice.reducer;
