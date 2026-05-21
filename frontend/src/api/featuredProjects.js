import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const fetchFeaturedProjects = async () => {
  const response = await axios.get(`${serverHost}/api-project/featured`);
  return response.data;
};

export const addFeaturedProject = async (project) => {
  await axios.post(`${serverHost}/api-project/featured`, { project });
};

export const deleteFeaturedProject = async (id) => {
  await axios.delete(`${serverHost}/api-project/featured/${id}`);
};

export const updateFeaturedOrder = async (projects) => {
  const response = await axios.put(`${serverHost}/api-project/featured/order`, projects);
  return response.data;
};
