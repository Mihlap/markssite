import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    loading: false,
    error: null,
    selectedViewConstruction: '',
    selectedCity: '',
  },
  reducers: {
    fetchProjectStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProjectSuccess(state, action) {
      state.loading = false;
      state.projects = Array.isArray(action.payload) ? action.payload : [];
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
    setSelectedViewConstruction(state, action) {
      state.selectedViewConstruction = action.payload;
    },
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
  },
});

export const {
  fetchProjectStart,
  fetchProjectSuccess,
  fetchProjectFailure,
  deleteProjectSuccess,
  deleteProjectFailure,
  setSelectedCity,
  setSelectedViewConstruction,
} = projectSlice.actions;

const buildProjectFormData = (formattedData) => {
  const formData = new FormData();

  for (const key in formattedData) {
    if (!formattedData.hasOwnProperty(key)) continue;
    const value = formattedData[key];

    if (value !== null && typeof value === 'object') {
      if (key === 'photoAva' && value?.length > 0) {
        if (value[0] instanceof File) {
          formData.append('photoAva', value[0]);
        } else {
          // Existing URL — send under the DB field name the backend expects
          formData.append('imageProject', value[0]);
        }
      } else if (key === 'dropPhoto' && value?.length > 0) {
        const existingUrls = value.filter((f) => !(f instanceof File));
        const newFiles = value.filter((f) => f instanceof File);
        if (existingUrls.length > 0) {
          // Send existing URLs as a comma-separated string under 'imageTitle'
          formData.append('imageTitle', existingUrls.join(','));
        }
        newFiles.forEach((file) => formData.append('dropPhoto', file));
      } else if (key === 'imageOpen' && value?.length > 0) {
        formData.append('imageOpen', value[0]);
      } else if (key === 'imageClose' && value?.length > 0) {
        formData.append('imageClose', value[0]);
      } else if (key === 'dynamicBlocks' && value?.length > 0) {
        let photosArray = [];

        value.forEach((outerObj) => {
          outerObj.forEach((innerObj) => {
            if (innerObj.type === 'file' && Array.isArray(innerObj.value) && innerObj.value.length > 0) {
              photosArray = photosArray.concat(innerObj.value);
            }
          });
        });

        const cloneDynamicBlocks = value.map((outerArray) =>
          outerArray.map((obj) => {
            if (obj.type === 'file' && Array.isArray(obj.value) && obj.value.length > 0) {
              return {
                ...obj,
                value: obj.value.map((file) => (file && typeof file === 'object' ? file.name : file)),
              };
            }
            return obj;
          })
        );

        formData.append('dynamicBlocksJSON', JSON.stringify(cloneDynamicBlocks));
        photosArray.forEach((photo) => formData.append('dynamicImages', photo));
      } else {
        for (const file of value) {
          formData.append(key, file);
        }
      }
    } else {
      formData.append(key, value);
    }
  }

  return formData;
};

// TODO: migrate to useMutation (useCreateProject hook)
export const createProject = (formattedData) => async (dispatch) => {
  dispatch(fetchProjectStart());
  try {
    await axios.post(`${serverHost}/api-project`, buildProjectFormData(formattedData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(getFetchForm());
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    dispatch(fetchProjectFailure(error.message));
  }
};

// TODO: migrate to useMutation (useUpdateProject hook)
export const updateProject = (id, formattedData) => async (dispatch) => {
  dispatch(fetchProjectStart());
  try {
    await axios.put(`${serverHost}/api-project/${id}`, buildProjectFormData(formattedData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(getFetchForm());
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    dispatch(fetchProjectFailure(error.message));
  }
};

// TODO: used in ProjectCard.jsx — replace with useProjects hook, then remove
export const getFetchForm = () => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(`${serverHost}/api-project/getzapros`);
    const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    dispatch(fetchProjectSuccess(data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
    dispatch(fetchProjectSuccess([]));
  }
};

// TODO: unused — remove
export const getFetchFormCityFilter = (page, projectsPerPage, countryCity) => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(
      `${serverHost}/api-project/getzapros?page=${page}&countryCity=${countryCity}&limit=${projectsPerPage}`
    );
    const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    dispatch(fetchProjectSuccess(data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
    dispatch(fetchProjectSuccess([]));
  }
};

// TODO: migrated to useDeleteProject hook — remove after cleanup
export const deleteForm = (id) => async (dispatch) => {
  try {
    await axios.delete(`${serverHost}/api-project/deletezapros/${id}`);
    dispatch(deleteProjectSuccess(id));
  } catch (error) {
    dispatch(deleteProjectFailure(error.message));
  }
};

export default projectSlice.reducer;
