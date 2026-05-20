import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const fetchProjects = async ({ page = 1, limit = 12, view = '', city = '' } = {}) => {
  const params = { page, limit };
  if (view && view !== 'Все') params.view = view;
  if (city) params.city = city;

  const response = await axios.get(`${serverHost}/api-project/all`, { params });
  return response.data;
};

export const fetchAdminProjects = async () => {
  const response = await axios.get(`${serverHost}/api-project/getzapros`);
  return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
};

export const deleteAdminProject = async (id) => {
  await axios.delete(`${serverHost}/api-project/deletezapros/${id}`);
};
