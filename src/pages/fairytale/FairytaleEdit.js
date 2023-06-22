import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { SaveState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import styled, { css } from "styled-components";

import TryCanvas from "../../components/TryCanvas";
import TitleModal from "../../components/TitleModal";

import PageSelectionFrame from "../../components/PageSelectionFrame";
import PageSelection from "../../components/PageSelection";

const Frame = styled.div`
  position: relative;
  // width: 95vw;
  // height: 100vh;
`;
const Savebutton = styled.button`
  width: 362px;
  height: 83px;
  border-radius: 10px;
  background: #80f06e;
  margin-top: 28px;
  margin-right: 38px;
  font-size: 30px;
  float: right;
`;

const FairytaleEdit = () => {
  const [canvasVisibility, setCanvasVisibility] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [saveAll, setSaveall] = useState(false);
  const [showImage, setShowImage] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const saveState = useResetRecoilState(SaveState);

  const toggleCanvasVisibility = (id) => {
    setActiveTab(id);
    setCanvasVisibility((prevState) => {
      const updatedVisibility = { ...prevState };
      Object.keys(updatedVisibility).forEach((key) => {
        updatedVisibility[key] = key == id ? true : false;
      });
      return updatedVisibility;
    });

    console.log(id);
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
      await setShowImage(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  console.log(canvasVisibility);

  const saveClick = () => {
    setSaveall(true);
  };

  console.log(">>>", showImage);

  return (
    <div className='edit'>
      <div
        style={{
          position: "absolute",
          width: "100%",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <img
          src='/images/loding_4.png'
          style={{ marginTop: "2%" }}
        />
      </div>

      <div>
        <Frame>
          <Savebutton onClick={saveClick}>동화 완성하기</Savebutton>
          {Object.keys(canvasVisibility).map((key) => (
            <div
              key={key}
              style={{
                display: canvasVisibility[key] ? "block" : "none",
                textAlign: "center",
              }}>
              <TryCanvas
                props={Number(key)}
                BookInfo={showImage}
              />
            </div>
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
    </div>
  );
};

export default FairytaleEdit;
