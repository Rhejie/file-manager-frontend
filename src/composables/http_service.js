import axios from 'axios';
import { accessToken } from './local_storage';

export function http() {
    return axios.create({
        baseURL: '/api',
        headers: {
            Authorization: 'Bearer ' + accessToken()
        }
    })
}

export function httpFile() {
    return axios.create({
        baseURL: '/api',
        headers: {
            Authorization: 'Bearer ' + accessToken()
        },
        responseType: 'blob'
    })
}