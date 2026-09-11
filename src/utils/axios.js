import axios from 'axios';

// Vite will automatically inject the correct URL here
const baseURL = import.meta.env.VITE_BASE_URL;

// Ek global 'instance' banaya hai, jisme saari default settings hai
const axiosInstance = axios.create({
    baseURL: baseURL, // Aapka backend URL
    withCredentials: true // automatically sends everytime, also I send withCredentials true so that browser security engine completely allows Set-Cookie headers from cross-origin APIs
});

export default axiosInstance;