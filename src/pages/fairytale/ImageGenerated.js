import React, { useState, useEffect } from "react";
import {
  useRecoilState,
  useResetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";
import {
  SelectedKeywords,
  StoryState,
  ImageState,
  ImageFix,
} from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import Header from "../../components/global/Header";
import ProgressBar from "../../components/global/ProgressBar";
import LoadingModal from "../../components/LoadingModal";
import ButtonWrap from "../../components/common/ButtonWrap";
import PreviewGeneratedIamge from "../../components/PreviewGeneratedImage";
import PreviewAllGeneratedIamge from "../../components/PreviewAllGeneratedImage";
import DirectionButton from "../../components/global/DirectionButton";

import Container from "../../components/global/Container";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;
const Div = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column; /* Added to stack elements vertically */
  align-items: center;
  justify-content: flex-start; /* Align items at the top */
`;
const Button = styled.button`
  width: 100px;
  height: 50px;
  background: #99f0cc;
  border-radius: 10px;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  text-align: center;
  color: #000000;
`;

const IamgeGenerated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgURL] = useState(null);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const [page, setPage] = useState(0);

  useEffect(() => {
    console.log("saveStory", savedStory);
  }, []);

  const onClickHandlerBefore = () => {
    if (0 < page) {
      setPage(page - 1);
    }
    console.log(page);
  };

  const onClickHandlerAfter = () => {
    setPage(page + 1);
    console.log(page);
  };


  return (
    <Container>
      <Header mode={"default"} />
      <ContentCover>
        <ProgressBar step={2} />
        <ContentTitle>제목와야하는자리</ContentTitle>
          <InnerCover>
          {0 < page && 
            <Button onClick={onClickHandlerBefore}> 
              이전 
            </Button>
          }
            {savedStory.map(
              (item, index) =>
                item["paragraph"] &&
                page == index && <PreviewGeneratedIamge index={index} />
            )}
            {page == 5 && <PreviewAllGeneratedIamge />}
            {page < 5 && <Button onClick={onClickHandlerAfter}> 다음 </Button>}
          </InnerCover>
      </ContentCover>
    </Container>
  );
};

export default IamgeGenerated;
