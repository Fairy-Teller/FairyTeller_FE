import React, { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import { SelectedKeywords, StoryState, ImageState, ImageFix } from "../../recoil/Fairytailstate";
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

const [PREV, NEXT] = ["prev", "next"];

const IamgeGenerated = () => {
  const savedStory = useRecoilValue(StoryState);
  const [page, setPage] = useState(0);

  useEffect(() => {
    console.log("savedStory", savedStory);
  }, []);

  const handleControl = (mode) => {
    if (mode === PREV) {
      if (0 < page) {
        setPage(page - 1);
      }
    } else if (mode === NEXT) {
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
        {page < 4 ? (
          <Control
            mode={NEXT}
            onControl={handleControl}
          />
        ) : (
          <div style={{ marginRight: "10rem" }}></div>
        )}
      </ContentContainer>
      {page === 5 && <PreviewAllGeneratedImage />}
    </Div>
  );
};

export default IamgeGenerated;
