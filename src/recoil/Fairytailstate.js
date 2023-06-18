import { atom, selector } from 'recoil';
import { call } from '../service/ApiService';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// 로그인 체크
// export const FairytailImg = atom({
//   key: "IMG_FILE",
//   default: "default",
// });

export const SelectedKeywords = atom({ key: 'SelectedKeywords', default: [] });

export const StoryState = atom({
    key: 'StoryState',
    default: [],
});
export const ImageTempState = atom({
    key: 'ImageTempState',
    default: [],
});

export const BookState = atom({
    key: 'BookState',
    default: {
        bookId: null,
        author: null,
        title: null,
        thumbnailUrl: '',
        pages: [],
    },
});

export const ImageState = atom({
    key: 'ImageState',
    default: { url: '' },
});

export const ImageFix = atom({
    key: 'userId',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const SelectedImageState = atom({
    key: 'SelectedImageState',
    default: [
        {
            id: 1,
            src: './images/sample.jpg',
        },
        {
            id: 2,
            src: './images/sample.jpg',
        },
        {
            id: 3,
            src: './images/sample.jpg',
        },
        {
            id: 4,
            src: './images/sample.jpg',
        },
        {
            id: 5,
            src: './images/sample.jpg',
        },
    ],
});

export const SampleDataState = atom({
    key: 'SampleDataState',
    default: [
        {
            id: 1,
            bookId: 1,
            title: null,
            thumbnailUrl: null,
            pages: [
                {
                    id: 1,
                    src: './images/sample.jpg',
                    sampledata: 'ivory',
                },
                {
                    id: 2,
                    src: './images/sample.png',
                    sampledata: 'orange',
                },
                {
                    id: 3,
                    src: './images/img-default.png',
                    sampledata: 'yellow',
                },
                {
                    id: 4,
                    src: './images/sample.jpg',
                    sampledata: 'green',
                },
                {
                    id: 5,
                    src: './images/sample.png',
                    sampledata: 'skyblue',
                },
            ],
        },
    ],
});

export const SelectStickers = atom({
    key: 'SelectStickers',
    default: [
        {
            id: 1,
            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQshoMsYa1hFvjaMAwebiP2l99ssM_XWVrp7g&usqp=CAU',
        },
        {
            id: 2,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/02.png',
        },
        {
            id: 3,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/03.png',
        },
        {
            id: 4,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/04.png',
        },
        {
            id: 5,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/05.png',
        },
        {
            id: 6,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/06.png',
        },
        {
            id: 7,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/07.png',
        },
        {
            id: 8,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/08.png',
        },
        {
            id: 9,
            src: 'https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/09.png',
        },
    ],
});

export const SaveState = atom({
    key: 'SaveState',
    default: 'none',
});

export const Canvasexport = atom({ key: 'Canvasexport', default: [], effects_UNSTABLE: [persistAtom] });
