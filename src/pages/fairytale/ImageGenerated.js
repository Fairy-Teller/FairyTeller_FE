import React, { useState, useEffect } from "react";
import LoadingModal from "../../components/LoadingModal";
import { call } from "../../service/ApiService";
import ButtonWrap from "../../components/common/ButtonWrap";
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
import PreviewGeneratedIamge from "../../components/PreviewGeneratedImage";
import PreviewAllGeneratedIamge from "../../components/PreviewAllGeneratedImage";

import styled from "styled-components";

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

const PreviewImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
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
    <Div>
      <Bar>FairyTeller</Bar>
      <BookCover>
        <img
          src="/images/loding_2.png"
          style={{ marginTop: "2%", maxWidth: "100%", maxHeight: "100%" }}
        />
      </BookCover>
      <ContentContainer>
        {0 < page && <Button onClick={onClickHandlerBefore}> 이전 </Button>}
        {savedStory.map(
          (item, index) =>
            item["paragraph"] &&
            page == index && <PreviewGeneratedIamge index={index} />
        )}
        {page == 5 && <PreviewAllGeneratedIamge />}
        {page < 5 && <Button onClick={onClickHandlerAfter}> 다음 </Button>}
      </ContentContainer>
    </Div>
  );
};

export default IamgeGenerated;
