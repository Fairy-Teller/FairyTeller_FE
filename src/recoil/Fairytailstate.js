import { atom, selector } from "recoil";
import { call } from "../service/ApiService";

// 로그인 체크
// export const FairytailImg = atom({
//   key: "IMG_FILE",
//   default: "default",
// });

export const SelectedKeywords = atom({ key: "SelectedKeywords", default: [] });

export const StoryState = atom({
  key: "StoryState",
  default: { text: "" },
});

export const ImageState = atom({
  key: "ImageState",
  default: { url: "" },
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
      title: "sample-data",
      thumbnailUrl: null,
      pages: [
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
    },
  ],
});
