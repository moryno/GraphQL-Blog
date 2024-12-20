import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const requestService = axios.create({ baseURL: BASE_URL });

requestService.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || null);

    if (user) {
      config.headers = {
        Authorization: `Bearer ${user.token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
requestService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response.status === 401 || response.status === 404) {
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export { requestService };
