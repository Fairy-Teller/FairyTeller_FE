import axios from 'axios';
import { API_BASE_URL } from '../api-config';

export function call(api, method, request) {
    let headers = {
        'Content-Type': 'application/json',
    };

    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    if (accessToken && accessToken !== null) {
        headers['Authorization'] = 'Bearer ' + accessToken;
    }

    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
    };
    if (request) {
        options.data = JSON.stringify(request);
    }

    return axios(options)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            if (error.request.status === 403) {
                // 에러 처리 로직
                return window.location.replace('/forbidden'); // 현재 페이지를 '/new-page'로 대체하여 페이지 이동
              
            }
            return Promise.reject(error);
        });
}
