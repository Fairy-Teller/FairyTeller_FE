import React, { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { SavedBoolState, AllSavedBoolState, StoryState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import styled from "styled-components";
// import LoadingModal from "../../components/LoadingModal";
// import ButtonWrap from "../../components/common/ButtonWrap";
import Control from "../../components/Control";
import PreviewGeneratedImage from "../../components/PreviewGeneratedImage";
import PreviewAllGeneratedImage from "../../components/PreviewAllGeneratedImage";

const Bar = styled.div`
  width: 100%;
  height: 60px;
  background: #fcdede;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 60px;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align items to the left */
`;
const BookCover = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15vw;
  height: 5vw;
  background-size: cover;
  margin-top: 10px;
`;
const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Div = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
    <Div>
      <Bar>FairyTeller</Bar>
      <BookCover>
        <img
          src='/images/loding_2.png'
          style={{ marginTop: "2%", maxWidth: "100%", maxHeight: "100%" }}
          alt='loding'
        />
      </BookCover>
      <ContentContainer>
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
      </ContentContainer>
    </Div>
  );
};

export default IamgeGenerated;
