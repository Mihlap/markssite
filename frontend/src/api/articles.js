import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const fetchArticles = async ({ page = 1, limit = 6, type = 'Все' } = {}) => {
  const params = { page, limit };
  if (type && type !== 'Все') params.type = type;

  const response = await axios.get(`${serverHost}/api-article/getzapros`, { params });
  return response.data;
};
