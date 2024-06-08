import axios from "axios";
import AccountService from "./AccountService";

const httpClient = axios.create({
    baseURL: 'https://jepolevirtualme.azurewebsites.net/api/v1/',
});

httpClient.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('jwt');
        
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "application/json";
        config.headers.Accept = "application/json";
        
        return config;
    },
    error => Promise.reject(error)
);

httpClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await AccountService.refreshJwt();
            const token = localStorage.getItem('jwt');
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default httpClient;
