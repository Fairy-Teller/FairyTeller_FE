import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { StoryState } from "../../recoil/FairytaleState";
import styled from "styled-components";
import { history } from "../../history/history";
// import useToast from "../../components/global/useToast";
import Header from "../../components/global/Header";
// import LoadingModal from "../../components/LoadingModal";
// import ButtonWrap from "../../components/common/ButtonWrap";
import PreviewGeneratedImage from "../../components/PreviewGeneratedImage";
import PreviewAllGeneratedImage from "../../components/PreviewAllGeneratedImage";
import Container from "../../components/global/Container";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";
import Control from "../../components/Control";

const [PREV, NEXT] = ["prev", "next"];

const IamgeGenerated = () => {
  const savedStory = useRecoilValue(StoryState);
  const [page, setPage] = useState(0);

  const usePreventGoBack = () => {
    const preventGoBack = () => {
      history.push(null, "", history.location.href);
      alert("현재 화면에서는 뒤로 갈 수 없어요");
    };

    useEffect(() => {
      (() => {
        history.push(null, "", history.location.href);
        window.addEventListener("popstate", preventGoBack);
      })();

      return () => {
        window.removeEventListener("popstate", preventGoBack);
      };
    }, []);

    useEffect(() => {
      history.push(null, "", history.location.href);
    }, [history.location]);
  };

  const usePreventRefresh = () => {
    const preventClose = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    useEffect(() => {
      (() => {
        window.addEventListener("beforeunload", preventClose);
      })();

      return () => {
        window.removeEventListener("beforeunload", preventClose);
      };
    });
  };

  usePreventGoBack();
  usePreventRefresh();

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
              <div style={{ marginLeft: "4.8rem", flexShrink: 0 }}></div>
            )}
            {savedStory.map(
              (item, index) => item && page === index && <PreviewGeneratedImage index={index} />
            )}
            {page < 4 ? (
              <Control
                mode={NEXT}
                onControl={handleControl}
              />
            ) : page === 4 ? (
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
