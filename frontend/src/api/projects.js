import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const fetchProjects = async ({ page = 1, limit = 12, view = '', city = '' } = {}) => {
  const params = { page, limit };
  if (view && view !== 'Все') params.view = view;
  if (city) params.city = city;

  const response = await axios.get(`${serverHost}/api-project/all`, { params });
  return response.data;
};

export const deleteProject = async (id) => {
  await axios.delete(`${serverHost}/api-project/${id}`);
};

export const fetchProject = async (id) => {
  const response = await axios.get(`${serverHost}/api-project/${id}`);
  return response.data;
};

const appendPhotoAva = (formData, value) => {
  if (value[0] instanceof File) {
    formData.append('photoAva', value[0]);
  } else {
    formData.append('imageProject', value[0]);
  }
};

const appendDropPhoto = (formData, value) => {
  const existingUrls = value.filter((f) => !(f instanceof File));
  const newFiles = value.filter((f) => f instanceof File);
  if (existingUrls.length > 0) {
    formData.append('imageTitle', existingUrls.join(','));
  }
  newFiles.forEach((file) => formData.append('dropPhoto', file));
};

const appendDynamicBlocks = (formData, value) => {
  const photos = value.flatMap((outerArr) =>
    outerArr.flatMap((obj) =>
      obj.type === 'file' && obj.value?.length > 0 ? obj.value : []
    )
  );

  const blocksWithFileNames = value.map((outerArr) =>
    outerArr.map((obj) => {
      if (obj.type === 'file' && obj.value?.length > 0) {
        return {
          ...obj,
          value: obj.value.map((file) => (file && typeof file === 'object' ? file.name : file)),
        };
      }
      return obj;
    })
  );

  formData.append('dynamicBlocksJSON', JSON.stringify(blocksWithFileNames));
  photos.forEach((photo) => formData.append('dynamicImages', photo));
};

const buildProjectFormData = (formattedData) => {
  const formData = new FormData();

  for (const key in formattedData) {
    if (!formattedData.hasOwnProperty(key)) continue;
    const value = formattedData[key];

    if (value === null || typeof value !== 'object') {
      formData.append(key, value);
      continue;
    }

    if (!value?.length) continue;

    if (key === 'photoAva') appendPhotoAva(formData, value);
    else if (key === 'dropPhoto') appendDropPhoto(formData, value);
    else if (key === 'imageOpen') formData.append('imageOpen', value[0]);
    else if (key === 'imageClose') formData.append('imageClose', value[0]);
    else if (key === 'dynamicBlocks') appendDynamicBlocks(formData, value);
    else value.forEach((file) => formData.append(key, file));
  }

  return formData;
};

export const createProject = async (formattedData) => {
  await axios.post(`${serverHost}/api-project`, buildProjectFormData(formattedData), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProject = async (id, formattedData) => {
  await axios.put(`${serverHost}/api-project/${id}`, buildProjectFormData(formattedData), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
