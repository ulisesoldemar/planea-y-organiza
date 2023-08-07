import axios from "axios";

const backendUrl = process.env.VUE_APP_BACKEND_URL;

const api = axios.create({
    baseURL: backendUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export default api