// searchPublicationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverHost = process.env.REACT_APP_SERVER_HOST;
const searchPublicationSlice = createSlice({
  name: "search",
  initialState: {
    foundObject: null,
  },
  reducers: {
    setFoundObject(state, action) {
      state.foundObject = action.payload;
    },
    clearFoundObject(state) {
      state.foundObject = null;
    },
  },
});

export const { setFoundObject, clearFoundObject } = searchPublicationSlice.actions;

export const searchPublicationOne = (filteredObject) => async (dispatch) => {
  try {
       await axios.post(
         `${serverHost}/search/search-publication-one`,
         { publication: filteredObject } // Оборачиваем filteredObject в объект
       );

    // Диспатчим какие-то дополнительные actions, если необходимо
    // dispatch(someAction(response.data));
    // dispatch(anotherAction());
  } catch (error) {
    console.error("Ошибка при отправке на бекенд:", error);
    // Можно диспатчить action, чтобы обработать ошибку, если необходимо
    // dispatch(errorAction(error.message));
  }
};
export default searchPublicationSlice.reducer;
