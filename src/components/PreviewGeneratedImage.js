import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isSaveImageState,
  StoryState,
  ImageTempState,
  BookState,
  Imagetheme,
} from "../recoil/FairytaleState";
import { call } from "../service/ApiService";
import { FairytaleNew, ImageTheme } from "../service/FairytaleService";
import styled from "styled-components";
import LoadingModal from "./LoadingModal";
import ButtonWrap from "../components/common/ButtonWrap";
// import ImgSelect from "../components/ImgSelect";
import ImgGenerate from "../components/ImgGenerate";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;
const ImageWrap = styled.div`
  padding: 0;
  margin: 1.6rem 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1.2rem;
  overflow: hidden;
`;
const Img = styled.img`
  // width: 960px;
  // height: 540px;
  width: 1024px;
  height: 576px;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
`;
const ImgArea = styled.div`
  // width: 960px;
  // height: 540px;
  width: 1024px;
  height: 576px;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  background-color: #d9d9d9;
`;
const StoryText = styled.div`
  width: 960px;
  padding: 1.2rem 1.6rem;
  margin: 0.4rem auto;
  color: black;
  line-height: 1.4;
  word-break: keep-all;
  background-color: pink;
`;
const Guide = styled.div`
  position: fixed;
  top: 4rem;
  left: ${(props) => (!props.isHovered ? "4rem" : "2.4rem")};
  z-index: 99;
  border-radius: 50%;
  transition: left 0.24s ease-in-out;
`;
const TextContent = styled.p`
  width: ${(props) => (!props.isHovered ? "88px" : "480px")};
  height: 88px;
  padding: ${(props) => (!props.isHovered ? "0" : "0.8rem 1.2rem")};
  font-size: ${(props) => (!props.isHovered ? "1.6rem" : "1.2rem")};
  display: ${(props) => (!props.isHovered ? "flex" : "block")};
  justify-content: ${(props) => (!props.isHovered ? "center" : "center")};
  align-items: ${(props) => (!props.isHovered ? "center" : "center")};
  box-sizing: border-box;
  text-align: left;
  line-height: 1.4;
  color: #000000;
  word-break: keep-all;
  border: 0.4rem solid #edaeae;
  background-color: white;
  border-radius: 12rem;
`;

const Text = (props) => {
  return <TextContent isHovered={props.isHovered}>{props.children}</TextContent>;
};

const PreviewGeneratedIamge = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBlockingKey, setIsBlockingKey] = useState(false);
  const [respones, setRespone] = useState(null);
  const savedStory = useRecoilValue(StoryState);
  const [savedImageTemp, setSavedImageTemp] = useRecoilState(ImageTempState);
  const savedBook = useRecoilValue(BookState);
  const [isSaveImage, setIsSaveImage] = useRecoilState(isSaveImageState);
  const [isHovered, setIsHovered] = useState(false);
  const imagetheme = useRecoilValue(Imagetheme);

  useEffect(() => {
    FairytaleNew().then((response) => {
      setRespone(response.bookId);
      const theme = {
        bookId: response.bookId,
        theme: imagetheme,
      };
      ImageTheme(theme);
    });
  }, [imagetheme]);

  useEffect(() => {
    window.addEventListener("keydown", disableKeyboardEvents);

    return () => {
      window.removeEventListener("keydown", disableKeyboardEvents);
    };
  }, [isBlockingKey]);


  const disableKeyboardEvents = (event) => {
    if (isBlockingKey) {
      event.preventDefault();
    }
  };


  const createImg = async () => {
    try {
      setIsLoading(true);
      setIsBlockingKey(true);
      const imageData = await call("/chat-gpt/textToImage/v2 ", "POST", {
        loraNo: imagetheme,
        text: savedStory[props.index]["paragraph"],
      });

      const byteCharacters = atob(imageData); // Base64 디코딩
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      const imageBlob = new Blob([byteArrays], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(imageBlob);

      const newPage = [...savedBook["pages"]];
      newPage[props.index] = {
        ...newPage[props.index],
        imageBase64: imageData,
      };
      // setSavedBook({ ...savedBook, pages: newPage });

      onChangeHandler(imageUrl, props.index);

      await saveImg(imageData);

      setIsLoading(false);
      setIsBlockingKey(false);
    } catch (error) {
      console.log("Error fetching data:", error);
      setIsLoading(false);
      setIsBlockingKey(false);
    }
  };

  const onChangeHandler = (targetUrl, index) => {
    const newImage = [...savedImageTemp];
    newImage[index] = { ...newImage[index], url: targetUrl };
    setSavedImageTemp(newImage);
  };

  const saveImg = async (image) => {
    try {
      const bookDTO = {
        bookId: respones,
        pages: [
          {
            pageNo: props.index + 1,
            originalImageUrl: image,
          },
        ],
      };
      const imageData = await call("/book/create/image", "POST", bookDTO);
      console.log("imageData", imageData);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      const newIsSaveImage = [...isSaveImage];
      newIsSaveImage[props.index] = true;
      setIsSaveImage(newIsSaveImage);
      console.log("isSaveImage", isSaveImage);
    }
  };

  return (
    <Div>
      <StoryText>{savedStory[props.index]["paragraph"]}</StoryText>
      {isLoading && <LoadingModal message='AI가 열심히 그림을 그리는 중입니다.' />}
      <Guide
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <Text isHovered={isHovered}>
          {isHovered
            ? "다섯 페이지에 대한 이미지를 모두 생성해주어야 동화책을 만들러 갈 수 있어요!"
            : "안내"}
        </Text>
      </Guide>

      <ImageWrap>
        {savedImageTemp[props.index]["url"] !== "" ? (
          <Img src={savedImageTemp[props.index] && savedImageTemp[props.index]["url"]} />
        ) : (
          <ImgArea />
        )}
      </ImageWrap>

      <ButtonWrap>
        <ImgGenerate
          onCreate={createImg}
          index={props.index}
        />
      </ButtonWrap>
    </Div>
  );
};

export default PreviewGeneratedIamge;
