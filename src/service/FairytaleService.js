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
            console.error(error);
        });
}

export function getBookByIdTemp(getbookDTO) {
    return call('/book/getBookById/temp', 'POST', getbookDTO);
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
    return call('/board/save', 'POST', boardSaveDTO);
}

export function imageToImage(imageToImageDTO) {
    return call('/images/imageToImage', 'POST', imageToImageDTO);
}

export function createStoryBook(bookDTO) {
    return call('/book/create/story', 'POST', bookDTO);
}

export function keyword(keywordDTO) {
    return call('/keyword', 'GET', keywordDTO);
}

export function recreate(userDTO) {
    return call('/chat-gpt/question/recreate', 'POST', userDTO);
}

export function question(questionDTO) {
    return call('/chat-gpt/question', 'POST', questionDTO);
}
