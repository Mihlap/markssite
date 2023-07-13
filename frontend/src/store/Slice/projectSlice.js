import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;


const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchProjectStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProjectSuccess(state, action) {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProjectSuccess(state, action) {
      const projectId = action.payload;
      state.projects = state.projects.filter((el) => el.id !== projectId);
    },
    deleteProjectFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
    fetchProjectStart,
    fetchProjectSuccess,
    fetchProjectFailure,
} = projectSlice.actions;



export const fetchProject = (formattedData, setInputData) => async (dispatch) => {
  dispatch(fetchProjectStart());
  const formData = new FormData();
  for (const key in formattedData) {
    if (typeof formattedData[key] === "object") {
      if (key === "photoAva" && formattedData[key].length > 0) {
        formData.append("photoAva", formattedData[key][0]);
      } else {
        for (const file of formattedData[key]) {
          formData.append(key, file);
        }
      }
    } else {
      formData.append(key, formattedData[key]);
    }
  }

  
  axios.post(`${serverHost}/api-project/postzapros`, formData).then(() => {
    setInputData({
      title: "",
      selectCompetencies: "",
      countryCity: "",
      monthYear: "",
      viewConstruction: "",
      dropPhoto: [],
      photoAva: [],
    });
    dispatch(getFetchForm()); // Добавлен этот вызов для получения обновленных данных после успешной отправки формы
  });
  console.log(formattedData, "REDUX");
};

export const getFetchForm = () => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(
      `${serverHost}/api-project/getzapros`
    );
   dispatch(fetchProjectSuccess(response.data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};


export default projectSlice.reducer;