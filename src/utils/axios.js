import axios from 'axios';

// Ek global 'instance' banaya hai, jisme saari default settings hai
const axiosInstance = axios.create({
    baseURL: "http://localhost:7777/api/v1", // Aapka backend URL
    withCredentials: true // automatically sends everytime, also I send withCredentials true so that browser security engine completely allows Set-Cookie headers from cross-origin APIs
});

export default axiosInstance;