import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;


const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: [],
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
      state.articles = action.payload;
    },
    fetchProjectFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProjectSuccess(state, action) {
      const prjectId = action.payload;
      state.project = state.project.filter((el) => el.id !== prjectId);
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
      for (const file in formattedData[key]) {
        formData.append("dropPhoto", formattedData[key][file]);
      }
    } else {
      formData.append(key, formattedData[key]);
    }
  }

  
  axios
  .post(`${serverHost}/api-project/postzapros`, formData) // Использование { inputData } вместо { data: inputData }
  .then(() => {
    setInputData({
      title: "",
      selectCompetencies: "",
      countryCity: "",
      monthYear: "",
      viewConstruction: "",
      dropPhoto: [],
      radioValue: "",
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
    console.log(response.data);
    dispatch(fetchProjectSuccess(response.data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};


export default projectSlice.reducer;