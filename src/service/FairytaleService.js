import { call } from './ApiService';

export function FairytaleNew() {
    return call('/book/my-newest', 'GET', null)
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

export function sendAudioData(audioDTO) {
    return call('/audio/user-record', 'POST', audioDTO);
}

export function ImageTheme(themeDTO) {
    return call('/book/create/theme', 'POST', themeDTO);
}

export function ImageAll(imageDTO) {
    return call('/book/create/imageAll', 'POST', imageDTO);
}

export function NewestTemp() {
    return call('/book/find/newestTemp', 'GET', null)
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

export function getBookByIdTemp(getbookDTO) {
    return call('/book/getBookById/temp', 'POST', getbookDTO)
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
export function getBookById(getbookDTO) {
    return call('/book/getBookById', 'POST', getbookDTO);
}
export function tempCreate(createDTO) {
    return call('/book/create/temp', 'POST', createDTO);
}

export function deleteTemp(deleteDTO) {
    return call('/book/delete/temp', 'POST', deleteDTO);
}

export function textToImage(textToImageDTO) {
    return call('/chat-gpt/textToImage/v2', 'POST', textToImageDTO);
}

export function createImageDTO(createImageDTO) {
    return call('/book/create/image', 'POST', createImageDTO);
}

export function createFinalDTO(createFinalDTO) {
    return call('/book/create/final', 'POST', createFinalDTO);
}

export function boardSave(boardSaveDTO) {
    return call('/board/save', 'POST', boardSaveDTO)
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

export function imageToImage(imageToImageDTO) {
    return call('/images/imageToImage', 'POST', imageToImageDTO);
}

export function createStoryBook(bookDTO) {
    return call('/book/create/story', 'POST', bookDTO)
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

export function keyword(keywordDTO) {
    return call('/keyword', 'GET', keywordDTO)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            if (error.response.status === 403) {
                window.location.href = '/forbidden'; // 403 오류 발생 시 예외를 throw
            }
            console.error(error);
            throw error; // 다른 오류의 경우 예외를 다시 throw
        });
}

export function recreate(userDTO) {
    return call('/chat-gpt/question/recreate', 'POST', userDTO);
}

export function question(questionDTO) {
    return call('/chat-gpt/question', 'POST', questionDTO);
}
