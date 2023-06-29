import { call } from './ApiService';
import { API_BASE_URL } from '../api-config';

export function FairytaleNew() {
    return call('/book/my-newest', 'GET', null)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
}

export function sendAudioData(audioDTO) {
    console.log(audioDTO);
    return call('/audio/user-record', 'POST', audioDTO);
}

export function ImageTheme(audioDTO) {
    console.log(audioDTO);
    return call('/book/create/theme', 'POST', audioDTO);
}
