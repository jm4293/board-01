import axios from "axios";

export const tokenAxios = axios.create();

tokenAxios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

tokenAxios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      axios
        .post("http://localhost:8080/auth/refresh", { user: "333" }, { withCredentials: true })
        .then(res => {
          console.log("res111", res);
        });
    }
    return Promise.reject(error);
  }
);
