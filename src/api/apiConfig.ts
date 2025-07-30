import axios from "axios";

const apiAxios = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {'Authorization': ''}
});

apiAxios.interceptors.request.use(
  config => {
    if (!config.headers) {
      config.headers = {}; 
    }
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiAxios;
