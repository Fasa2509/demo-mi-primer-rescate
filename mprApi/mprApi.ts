import axios from 'axios';

export const mprApi = axios.create({
    baseURL: '/api'
});