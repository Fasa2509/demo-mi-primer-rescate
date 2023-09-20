import axios from 'axios';

export type ApiResponse = { error: boolean; message: string; }

export type ApiResponsePayload<T = {}> = { error: boolean; message: string; payload?: T }

export const mprApi = axios.create({
    baseURL: '/api'
});