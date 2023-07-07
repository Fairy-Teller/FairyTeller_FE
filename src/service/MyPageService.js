import { call } from './ApiService';

export function mineFinal() {
    return call('/book/mine/final', 'GET', null);
}

export function bookShowInfo(bookId) {
    return call(`/book/${bookId}`, 'GET', null);
}
