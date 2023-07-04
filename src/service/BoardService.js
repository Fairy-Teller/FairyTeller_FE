import { call } from './ApiService';

export function topAuthorsData() {
    return call('/board/topAuthors', 'GET', null)
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

export function pageShowData(currentPage) {
    let endpoint = '/board';
    return call(endpoint + currentPage, 'GET', null);
}

export function BoardDetailShow(boardIdDTO) {
    return call(`/board/${boardIdDTO}`, 'GET', null);
}

export function BoardCommentSubmit(boardId, commantDTO) {
    return call(`/board/${boardId}/comment`, 'POST', commantDTO);
}

export function BoardDelete(boardId, commentId) {
    return call(`/board/${boardId}/comment/${commentId}`, 'DELETE', null);
}

export function LikeCommit(boardId) {
    return call(`/board/${boardId}/like`, 'POST', null);
}

export function modifyCommit(boardId, page, pageSize) {
    return call(`/board/${boardId}/comment?page=${page}&size=${pageSize}`, 'GET', null);
}

export function DeleteBoard(boardId) {
    return call(`/board/${boardId}`, 'DELETE', null);
}

export function commentUpdate(boardId, commentId, editedComment) {
    return call(`/board/${boardId}/comment/${commentId}`, 'PUT', { content: editedComment });
}
