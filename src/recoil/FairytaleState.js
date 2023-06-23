import { atom, selector } from "recoil";
import { call } from "../service/ApiService";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 로그인 체크
// export const FairytailImg = atom({
//   key: "IMG_FILE",
//   default: "default",
// });

export const SelectedKeywordsState = atom({
  key: "SelectedKeywordsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const StoryState = atom({
  key: "StoryState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const ImageTempState = atom({
  key: "ImageTempState",
  default: [],
});

export const BookState = atom({
  key: "BookState",
  default: {
    bookId: null,
    author: null,
    title: null,
    thumbnailUrl: "",
    pages: [],
  },
});

export const SavedBoolState = atom({
  key: "SavedBoolState",
  default: [false, false, false, false, false],
});

export const AllSavedBoolState = atom({
  key: "AllSavedBoolState",
  default: false,
});

export const GeneratedBoolState = atom({
  key: "GeneratedBoolState",
  default: [false, false, false, false, false],
});

export const GeneratedCountState = atom({
  key: "GeneratedCountState",
  default: [3, 3, 3, 3, 3],
});

// ==============================================

// 스티커 저장하는 state - edit페이지에서 사용
// (추후 DB에서 관리될 예정 백엔드 작업이 선제되어야 함)
export const SelectStickers = atom({
  key: "SelectStickers",
  default: [
    {
      id: 1,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/01.png",
    },
    {
      id: 2,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/02.png",
    },
    {
      id: 3,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/03.png",
    },
    {
      id: 4,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/04.png",
    },
    {
      id: 5,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/05.png",
    },
    {
      id: 6,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/06.png",
    },
    {
      id: 7,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/07.png",
    },
    {
      id: 8,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/08.png",
    },
    {
      id: 9,
      src: "https://fairyteller-dev.s3.ap-northeast-2.amazonaws.com/stickers/09.png",
    },
  ],
});

// 각 캔버스를 통합할 수 있는 전역적 save state
// Canvas에서 사용
export const SaveState = atom({
  key: "SaveState",
  default: "none",
});

// Canvas에서 사용
export const Canvasexport = atom({
  key: "Canvasexport",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const BookPage = atom({
  key: "BookPage",
  default: 0,
});
