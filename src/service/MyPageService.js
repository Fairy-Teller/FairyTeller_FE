import { call } from './ApiService';

export function mineFinal() {
    return call('/book/mine/final', 'GET', null)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            if (error.response.status === 403) {
                window.location.href = '/forbidden';
            }
            console.error(error);
            throw error;
        });
}

export function bookShowInfo(bookId) {
    return call(`/book/${bookId}`, 'GET', null);
}
