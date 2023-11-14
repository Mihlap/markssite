import { createSlice } from "@reduxjs/toolkit";

const cursorAdminSlice = createSlice({
  name: "cursorAdmin",
  initialState: "adminDefault",
  reducers: {
    textLeave: () => "adminDefault",
    adminMouseDown: () => "mouseDown",
    adminMouseUp: () => "mouseUp",
  },
});

export const { textLeave, adminMouseDown, adminMouseUp } = cursorAdminSlice.actions;

export default cursorAdminSlice.reducer;
