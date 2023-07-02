import { call } from './ApiService';

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
    return call('/audio/user-record', 'POST', audioDTO);
}

export function ImageTheme(audioDTO) {
    return call('/book/create/theme', 'POST', audioDTO);
}

export function ImageAll(audioDTO) {
    return call('/book/create/imageAll', 'POST', audioDTO);
}

export function NewestTemp() {
    return call('/book/find/newestTemp', 'GET', null)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
}

export function getBookById(audioDTO) {
    return call('/book/getBookById/temp', 'POST', audioDTO);
}

export function tempCreate(audioDTO) {
    return call('/book/create/temp', 'POST', audioDTO);
}
