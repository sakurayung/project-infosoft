import axios, {AxiosError, type AxiosRequestConfig, type AxiosResponse} from "axios";
import type { ApiError } from "@/app/types/api/types";

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_LOCAL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});


api.interceptors.request.use(
    //@ts-ignore
    (config: AxiosRequestConfig): AxiosRequestConfig => {
        console.log('Making request to:', `${config.baseURL}${config.url}`);
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);


api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        console.log('Response received:', response.status);
        return response;
    },
    (error: AxiosError<ApiError>): Promise<never> => {
       
        console.error('API Error:', error.response?.data || error.message);
        
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - likely CORS issue');
        }
        
        return Promise.reject(error);
    }
);

export default api;