import React, { useState, useEffect } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { call } from '../../service/ApiService';
const LoadingBarExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgURL] = useState(null);

  useEffect(() => {
    // API 요청을 위한 useEffect 훅
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await sendText()
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const sendText = async () => {
    try {
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
      {isLoading && <LoadingModal message='AI가 열심히 그림을 그리는 중입니다.' />}
      {<div><p>hello</p></div>}
      <img src={imgUrl} />
    </div>
  );
};

export default LoadingBarExample;
