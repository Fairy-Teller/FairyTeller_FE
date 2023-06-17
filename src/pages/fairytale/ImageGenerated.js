import React, { useState, useEffect } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { call } from '../../service/ApiService';
import ButtonWrap from '../../components/common/ButtonWrap';
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { SelectedKeywords, StoryState, ImageState, ImageFix } from '../../recoil/Fairytailstate';

const IamgeGenerated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgURL] = useState(null);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  
  useEffect(() => {
    console.log('saveStory', savedStory);
  }, []);

  const createImg = async () => {
    try {
        setIsLoading(true);
        console.log("이미지 요청")
        const response = await call('/chat-gpt/summarize', 'POST', { text: "happy cute cat" });
        const imageData = response; // 응답 데이터 - Base64 문자열
        const byteCharacters = atob(imageData); // Base64 디코딩
        const byteArrays = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays[i] = byteCharacters.charCodeAt(i);
        }
        const imageBlob = new Blob([byteArrays], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImgURL(imageUrl);
        setIsLoading(false)
    } catch (error) {
        console.log('Error fetching data:', error);
    }
};

  return (
    <div>
      {/* JSX 내부에서 isLoading 상태 확인하여 로딩 모달 렌더링 */}
      {/* message에 원하는 text 입력하기 */}
      <div>

      </div>
      {isLoading && <LoadingModal message='AI가 열심히 그림을 그리는 중입니다.' />}
      <div>
        <p>동화 내용 들어갈 텍스트 창</p>
      </div>

      <ButtonWrap>
        <button type="submit" className="button" onClick={createImg}>
                    이미지 생성하기
        </button>
      </ButtonWrap>  
      <div>
      <img src={imgUrl} />
      </div>
      <button type="submit" className="button" >
                    다시 뽑기
        </button>
      <button type="submit" className="button" >
                  삽화 선택
      </button>
    </div>
  );
};

export default IamgeGenerated;
