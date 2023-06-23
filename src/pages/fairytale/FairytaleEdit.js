import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { SaveState } from "../../recoil/FairytaleState";
import { call } from "../../service/ApiService";
import styled, { css } from "styled-components";
import Canvas from "../../components/Canvas";
import TitleModal from "../../components/TitleModal";
import Header from "../../components/global/Header";
import PageSelectionFrame from "../../components/PageSelectionFrame";
import PageSelection from "../../components/PageSelection";

const Frame = styled.div`
  position: relative;
`;
const FrameInner = styled.div``;
const Savebutton = styled.button`
  width: 12rem;
  height: 3.6rem;
  border-radius: 0.4rem;
  background: pink;
  margin-top: 28px;
  margin-right: 38px;
  font-size: 1.2rem;
  float: right;
`;

const FairytaleEdit = () => {
  const [saveAll, setSaveall] = useState(false);
  const [showImage, setShowImage] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const saveState = useResetRecoilState(SaveState);
  const [canvasVisibility, setCanvasVisibility] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const toggleCanvasVisibility = (id) => {
    setActiveTab(id);
    setCanvasVisibility((prevState) => {
      const updatedVisibility = { ...prevState };

      Object.keys(updatedVisibility).forEach((key) => {
        updatedVisibility[key] = Number(key) === id ? true : false;
      });
      return updatedVisibility;
    });
    console.log("id", id, activeTab);
  };

  useEffect(() => {
    getNewest();
    document.body.style.overflow = "hidden";

    return () => {
      // 컴포넌트가 언마운트될 때 스크롤 가능하게 되돌림
      document.body.style.overflow = "auto";
    };
  }, []);

  const getNewest = async () => {
    try {
      const data = await call("/book/my-newest", "GET", null);
      setShowImage(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const saveClick = () => {
    setSaveall(true);
  };

  return (
    <div className='edit'>
      <Header />
      <Frame>
        <Savebutton onClick={saveClick}>동화 완성하기</Savebutton>

        {Object.keys(canvasVisibility).map((key) => (
          <FrameInner
            key={key}
            style={{
              display: canvasVisibility[key] ? "block" : "none",
            }}>
            <Canvas
              idx={Number(key)}
              BookInfo={showImage}
            />
          </FrameInner>
        ))}

        <PageSelectionFrame>
          {showImage.pages && showImage.pages.length > 0 ? (
            showImage.pages.map((page, index) => (
              <PageSelection
                key={index}
                idx={page.pageNo}
                src={page.originalImageUrl}
                onClick={() => toggleCanvasVisibility(page.pageNo)}
              />
            ))
          ) : (
            <div>가져오는 중...</div>
          )}
        </PageSelectionFrame>
      </Frame>
      {saveAll && <TitleModal props={showImage.bookId} />}
    </div>
  );
};

export default FairytaleEdit;
