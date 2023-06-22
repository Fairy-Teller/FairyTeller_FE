import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { SavedBoolState, AllSavedBoolState, StoryState } from "../../recoil/Fairytailstate";
import styled from "styled-components";
import Header from "../../components/global/Header";
import ProgressBar from "../../components/global/ProgressBar";
// import LoadingModal from "../../components/LoadingModal";
// import ButtonWrap from "../../components/common/ButtonWrap";
import PreviewGeneratedImage from "../../components/PreviewGeneratedImage";
import PreviewAllGeneratedImage from "../../components/PreviewAllGeneratedImage";
import Container from "../../components/global/Container";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";
import Control from "../../components/Control";

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Div = styled.div`
  width: 100%;
  max-width: 100vw;
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

  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  text-align: center;
  color: #000000;
`;

const [PREV, NEXT, DONE] = ["prev", "next", "done"];
const ALLTRUE = [true, true, true, true, true];

const IamgeGenerated = () => {
  const savedStory = useRecoilValue(StoryState);
  const isSaveImage = useRecoilValue(SavedBoolState);
  const [page, setPage] = useState(0);
  const [allSelectDone, setAllSelectDone] = useRecoilState(AllSavedBoolState);

  useEffect(() => {
    console.log("isSaveImage", isSaveImage);

    if (isSaveImage.every((item, index) => item === ALLTRUE[index])) {
      setAllSelectDone(!allSelectDone);
      console.log(allSelectDone);
    }
  }, [isSaveImage]);

  const handleControl = (mode) => {
    if (mode === PREV) {
      if (0 < page) {
        setPage(page - 1);
      }
    }
    if (mode === NEXT) {
      setPage(page + 1);
    }
  };

  return (
    <div className='illu'>
      <Container>
        <Header mode={"default"} />
        <ContentCover>
          <ProgressBar step={2} />
          <ContentTitle>
            {page < 5
              ? `AI가 동화책의 ${page + 1}번째 페이지에 들어가는 이미지를 그려줘요!`
              : `고른 이미지들을 확인해주세요! 이제 동화책을 만들러 가볼까요?`}
          </ContentTitle>
          <InnerCover className={"row"}>
            {page > 0 ? (
              <Control
                mode={PREV}
                onControl={handleControl}
              />
            ) : (
              <div style={{ marginLeft: "10rem" }}></div>
            )}
            {savedStory.map(
              (item, index) => item && page === index && <PreviewGeneratedImage index={index} />
            )}
            {page < 4 && !allSelectDone ? (
              <Control
                mode={NEXT}
                onControl={handleControl}
              />
            ) : page === 4 && !allSelectDone ? (
              <div style={{ marginRight: "10rem" }}></div>
            ) : page === 4 && allSelectDone ? (
              <Control
                mode={NEXT}
                onControl={handleControl}
              />
            ) : null}
            {page === 5 && <PreviewAllGeneratedImage />}
          </InnerCover>
        </ContentCover>
      </Container>
    </div>
  );
};

export default IamgeGenerated;
