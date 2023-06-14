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
    default: { text: '' },
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
