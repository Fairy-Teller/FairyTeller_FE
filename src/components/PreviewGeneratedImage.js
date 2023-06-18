import React, { useState, useEffect } from 'react';
import { call } from '../service/ApiService';
import ButtonWrap from '../components/common/ButtonWrap';
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { StoryState, ImageTempState } from '../recoil/Fairytailstate';
import styled from "styled-components";
import LoadingModal from './LoadingModal';
const Div = styled.div`
//   color: white;
`; 
const Img = styled.img`
    //   color: white;
    width: 1416px;
    height: 589px;
    background: #D9D9D9;
    border-radius: 20px;
    
`;

const Text = styled.p`
    display: flex;
    text-align: center; /* 가운데 정렬 속성 추가 */
    align-items: center; /* 세로 가운데 정렬 */
    width: 1416px;
    height: 185px;
    background: #FCDEDE;
    border-radius: 20px;
    width: 1509px;
    height: 161px;
    font-family: 'Amiri';
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 44px;
    color: #000000;
`
const Button = styled.button`
    width: 400px;
    height: 81px;
    background: #99F0CC;
    border-radius: 10px;
    font-family: 'Amiri';
    font-style: normal;
    font-weight: 400;
    font-size: 36px;
    line-height: 63px;
    text-align: center !important; /* 가운데 정렬 속성 추가 */
    color: #000000;
    justify-content: center; /* 가로 가운데 정렬 */
    align-items: center; /* 세로 가운데 정렬 */
`;
const PreviewGeneratedIamge = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgURL] = useState(null);
  const [savedStory, setSavedStory]  = useRecoilState(StoryState);
  const [savedImageTemp, setSavedImageTemp] = useRecoilState(ImageTempState);
  
    console.log("렌더링");

    useEffect(()=>{
        console.log(savedStory)
        console.log(savedImageTemp)
        console.log(props.index)
        console.log(savedStory[props.index]["paragraph"])
    },[])

  const createImg = async () => {
    try {
        setIsLoading(true);
        console.log("이미지 요청")
        const response = await call('/chat-gpt/summarize', 'POST', { text: savedStory[props.index]["paragraph"] });
        const imageData = response; // 응답 데이터 - Base64 문자열
        const byteCharacters = atob(imageData); // Base64 디코딩
        const byteArrays = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays[i] = byteCharacters.charCodeAt(i);
        }
        const imageBlob = new Blob([byteArrays], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setIsLoading(false)
        onChangeHandler(imageUrl, props.index)
        console.log(savedImageTemp)
        
    } catch (error) {
        console.log('Error fetching data:', error);
        setIsLoading(false)
    }
    };

    const onChangeHandler = (imgUrl, index) => {
        const newImage = [...savedImageTemp];
        newImage[index] = { ...newImage[index], url: imgUrl};
        setSavedImageTemp(newImage);
    };

  return (
    <Div>
      {/* JSX 내부에서 isLoading 상태 확인하여 로딩 모달 렌더링 */}
      {/* message에 원하는 text 입력하기 */}
      {isLoading && <LoadingModal message='AI가 열심히 그림을 그리는 중입니다.' />}
      <div>
        <Text>{savedStory[props.index]["paragraph"]}</Text>
      </div>

      <ButtonWrap>
        <Button className="button" onClick={createImg}>
                    이미지 생성하기
        </Button>
      </ButtonWrap>  
      <div>
      <Img src={savedImageTemp[props.index] && savedImageTemp[props.index]["url"]} />
      </div>
      <ButtonWrap>  
      <Button className="button" >
                    다시 뽑기
        </Button>
      <Button className="button" >
                  삽화 선택
      </Button>
      </ButtonWrap>  
    </Div>
  );
};

export default PreviewGeneratedIamge;
