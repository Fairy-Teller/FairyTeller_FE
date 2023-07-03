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

export function getBookById(getbookDTO) {
    return call('/book/getBookById/temp', 'POST', getbookDTO);
}

export function tempCreate(createDTO) {
    return call('/book/create/temp', 'POST', createDTO);
}

export function deleteTemp(deleteDTO) {
    return call('/book/delete/temp', 'POST', deleteDTO);
}
