import React, { useState, useEffect } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { call } from '../../service/ApiService';
import ButtonWrap from '../../components/common/ButtonWrap';
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { SelectedKeywords, StoryState, ImageState, ImageFix } from '../../recoil/Fairytailstate';
import PreviewGeneratedIamge from '../../components/PreviewGeneratedImage';

import styled from "styled-components";

const Div = styled.div`
//   color: white;
  width: 100vw;
  height: 100vh; 
  display: flex; justify-content: center;
  align-items: center;
`;

const Button = styled.button`
    width: 100px;
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

const IamgeGenerated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgURL] = useState(null);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const [page, setPage] = useState(0)
  
  useEffect(() => {
    console.log('saveStory', savedStory);
  }, []);
  const onClickHandlerBefore = ()=>{
    if(0 < page){
      setPage(page - 1)
    }
    console.log(page)
  }
  const onClickHandlerAfter = ()=>{
    setPage(page + 1)
    console.log(page)
  }


  return (
    <Div>
        {0 < page && (<Button onClick={onClickHandlerBefore}> 이전 </Button>)}
        {savedStory.map((item, index) => (
           item['paragraph'] && page == index && (
            <PreviewGeneratedIamge index={index}/>
        )
        ))}
        {page < 4 && (<Button onClick={onClickHandlerAfter}> 다음 </Button>)}
      
    </Div>
  );
}

export default IamgeGenerated;
