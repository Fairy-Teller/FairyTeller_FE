import { call } from './ApiService';

export function mineFinal() {
    return call('/book/mine/final', 'GET', null);
}

export function bookShow(bookId) {
    return call(`/book/${bookId}`, 'GET', null)
}
