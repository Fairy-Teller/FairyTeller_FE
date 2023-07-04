import { call } from './ApiService';

export function mineFinal() {
    return call('/book/mine/final', 'GET', null)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            if (error.request.status === 403) {
                window.location.href = '/forbidden';
            }
            console.error(error);
        });
}

export function bookShow(bookId) {
    return call(`/book/${bookId}`, 'GET', null);
}
