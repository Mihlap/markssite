import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    currentPage: null,
    showNavbarFooter: true,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    resetCurrentPage(state) {
      // Добавленное действие для сброса currentPage
      state.currentPage = null;
    },
  },
});

export const { setUser, setCurrentPage, resetCurrentPage } = userSlice.actions;

export default userSlice.reducer;


// этот слайс нужен для того, чтоб скрывать и показывать navbar && footer когда мы переходим или выходим из админки 