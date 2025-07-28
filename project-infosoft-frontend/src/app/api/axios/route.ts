import axios, {AxiosError, type AxiosRequestConfig, type AxiosResponse} from "axios";
import type { ApiError } from "../types/api/types";



/**
 * Create axios instance with default configuration
 */

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_LOCAL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    //@ts-ignore
    (config: AxiosRequestConfig): AxiosRequestConfig => {
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
)

api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError<ApiError>): Promise<never> => {
      // Handle errors globally
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  export default api;
