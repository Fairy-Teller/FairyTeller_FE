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
        <h1>{page}</h1>
        {0 < page && (<button onClick={onClickHandlerBefore}> 이전 </button>)}
        {savedStory.map((item, index) => (
           item['paragraph'] && page == index && (
            <PreviewGeneratedIamge index={index}/>
        )
        ))}
        {page < 5 && (<button onClick={onClickHandlerAfter}> 다음 </button>)}
      
    </Div>
  );
}

export default IamgeGenerated;
