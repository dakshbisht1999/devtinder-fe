import axios from 'axios';
import { handleApiError, isLoginRequest } from './errorHandler';
import { BASE_URL } from './constants';

// Vite will automatically inject the correct URL here
// const baseURL = import.meta.env.VITE_BASE_URL || "/api/v1";

// Ek global 'instance' banaya hai, jisme saari default settings hai
const axiosInstance = axios.create({
    baseURL: BASE_URL+"/api/v1", // Aapka backend URL
    withCredentials: true // automatically sends everytime, also I send withCredentials true so that browser security engine completely allows Set-Cookie headers from cross-origin APIs
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // A 401 from login means bad credentials, not an expired session.
        // AuthBootstrap opts out because a missing session on first load is normal.
        if (
            error.response?.status === 401 &&
            !isLoginRequest(error) &&
            !error.config?.skipGlobalAuthErrorHandling
        ) {
            handleApiError(error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
