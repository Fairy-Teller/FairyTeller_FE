import { atom, selector } from "recoil";
import { call } from "../service/ApiService";

// 로그인 체크
// export const FairytailImg = atom({
//   key: "IMG_FILE",
//   default: "default",
// });

export const SelectedKeywords = atom({ key: "SelectedKeywords", default: [] });

export const GeneratedStoryState = atom({
  key: "GeneratedStoryState",
  default: { text: "" },
});

export const WrittenStoryState = atom({
  key: "WrittenStoryState",
  default: { text: "" },
});
