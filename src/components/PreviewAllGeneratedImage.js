import React, { useState, useEffect } from 'react';
import { call } from '../service/ApiService';
import ButtonWrap from './common/ButtonWrap';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { StoryState, ImageTempState, BookState } from '../recoil/Fairytailstate';
import styled from "styled-components";
import LoadingModal from './LoadingModal';
const Div = styled.div`
//   color: white;
`; 

const Text = styled.p`
    display: flex;
    text-align: center; /* 가운데 정렬 속성 추가 */
    align-items: center; /* 세로 가운데 정렬 */
    width: 1416px;
    height: 185px;
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
const PreviewAllGeneratedIamge = () => {
  const [savedImageTemp, setSavedImageTemp] = useRecoilState(ImageTempState);
  const navigate = useNavigate();
  useEffect(()=>{
    console.log('savedImageTemp', savedImageTemp);
  }, [])


  const gotoEdit = () => {
    navigate('/f-edit'); // 이미지 선택 화면으로 가기
  };

  return (
    <Div>
      <div>
        <Text>AI가 만들어준 그림을 확인해보아요!</Text>
      </div>
      <div>
        {savedImageTemp.map((item, index) => (
            <img src={item["url"]}/>
        )
        )}
      </div>
      <ButtonWrap>  
      <Button className="button" onClick={gotoEdit}>
                  동화책 꾸미기
      </Button>
      </ButtonWrap>  
    </Div>
  );
};

export default PreviewAllGeneratedIamge;
