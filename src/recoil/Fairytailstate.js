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
  key: "SelectedImageState",
  default: [
    {
      id: 1,
      src: "./images/sample.jpg",
    },
    {
      id: 2,
      src: "./images/sample.jpg",
    },
    {
      id: 3,
      src: "./images/sample.jpg",
    },
    {
      id: 4,
      src: "./images/sample.jpg",
    },
    {
      id: 5,
      src: "./images/sample.jpg",
    },
  ],
});

export const SampleDataState = atom({
  key: "SampleDataState",
  default: [
    {
      id: 1,
      bookId: 1,
      title: null,
      thumbnailUrl: null,
      pages: [
        {
          id: 1,
          src: "./images/sample.jpg",
          sampledata: "ivory",
        },
        {
          id: 2,
          src: "./images/sample.png",
          sampledata: "orange",
        },
        {
          id: 3,
          src: "./images/img-default.png",
          sampledata: "yellow",
        },
        {
          id: 4,
          src: "./images/sample.jpg",
          sampledata: "green",
        },
        {
          id: 5,
          src: "./images/sample.png",
          sampledata: "skyblue",
        },
      ],
    },
  ],
});
