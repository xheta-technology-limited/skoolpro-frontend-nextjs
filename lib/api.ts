import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

//const BASE_CLIENT = process.env.NEXT_PUBLIC_BACKEND_API;
const BASE_CLIENT = "";

export const api = axios.create({
  baseURL: BASE_CLIENT,
  timeout: 90000,
});
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  config.withCredentials = true;
  config.withXSRFToken = true;
  return config;
}
api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    toast.error("Error", {
      position: "top-right",
      description: message,
      className: "bg-[#FBD6D45C] border-[1px] border-error text-black",
    });

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
