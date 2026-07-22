import axios, { AxiosError } from "axios";

const BASE_CLIENT = process.env.NEXT_PUBLIC_BACKEND_API;

export const api = axios.create({
  baseURL: BASE_CLIENT,
  timeout: 90000,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    // This is where you'd typically log errors to a global toast or something like that.

    if (error.response?.status === 401) {
      if (window.location.pathname === "/login") {
        return Promise.reject(error);
      }
      //   const { logout } = useAuthStore.getState(); // Get logout function
      //   logout(); // Clear session
      //TODO: add logic to log the user out of the app here.
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
