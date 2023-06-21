import React, { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { StoryState, ImageTempState, BookState } from "../recoil/Fairytailstate";
import { call } from "../service/ApiService";
import styled from "styled-components";
import LoadingModal from "./LoadingModal";
import ButtonWrap from "../components/common/ButtonWrap";
import ImgSelect from "../components/ImgSelect";
import ImgGenerate from "../components/ImgGenerate";

const Div = styled.div`
  margin-bottom: 6rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 896px;
  height: 504px;
  padding: 0;
  margin: 0;
  background-color: #d9d9d9;
`;
const Text = styled.p`
  display: flex;
  text-align: center;
  align-items: center;
  width: 800px;
  height: 100px;
  background: #fcdede;
  border-radius: 20px;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  color: #000000;
  margin: 10px;
  padding: 0 10px;
`;
const P = styled.p`
  display: flex;
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  color: #000000;
  margin-top: 20px;
`;

const PreviewGeneratedIamge = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const savedStory = useRecoilValue(StoryState);
  const [savedImageTemp, setSavedImageTemp] = useRecoilState(ImageTempState);
  const [savedBook, setSavedBook] = useRecoilState(BookState);
  const [imgUrl, setImgURL] = useState(null);
  const [isSaveImage, setIsSaveImage] = useState([false, false, false, false, false]);

  useEffect(() => {
    // console.log(savedStory);
    // console.log(savedImageTemp);
    // console.log(props.index);
    // console.log(savedBook);
    // console.log(savedStory[props.index]["paragraph"]);
  }, []);

  const createImg = async () => {
    try {
      setIsLoading(true);

      const imageData = await call("/chat-gpt/textToImage", "POST", {
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

      setSavedBook({ ...savedBook, pages: newPage });
      onChangeHandler(imageUrl, props.index);

      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const onChangeHandler = (imgUrl, index) => {
    const newImage = [...savedImageTemp];
    newImage[index] = { ...newImage[index], url: imgUrl };
    setSavedImageTemp(newImage);
  };

  const saveImg = async () => {
    try {
      alert("saved");

      const bookDTO = {
        bookId: savedBook["bookId"],
        pages: [
          {
            pageNo: savedBook["pages"][props.index]["pageNo"],
            originalImageUrl: savedBook["pages"][props.index]["imageBase64"],
          },
        ],
      };
      const imageData = await call("/book/create/image", "POST", bookDTO);
      console.log(imageData);

      const newIsSaveImage = [...isSaveImage];
      newIsSaveImage[props.index] = true;
      setIsSaveImage(newIsSaveImage);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <Div>
      {isLoading && <LoadingModal message='AI가 열심히 그림을 그리는 중입니다.' />}
      <div>
        <Text>{savedStory[props.index]["paragraph"]}</Text>
      </div>

      <P>동화책의 {props.index + 1}번째 페이지에 들어가는 이미지입니다.</P>
      <ImageWrap>
        <Img src={savedImageTemp[props.index] && savedImageTemp[props.index]["url"]} />
      </ImageWrap>

      {isSaveImage[props.index] && (
        <ButtonWrap>
          <ImgSelect disabled={true} />
        </ButtonWrap>
      )}
      {!isSaveImage[props.index] && (
        <ButtonWrap>
          <ImgGenerate
            onCreate={createImg}
            index={props.index}
          />
          <ImgSelect onSave={saveImg} />
        </ButtonWrap>
      )}
    </Div>
  );
};

export default PreviewGeneratedIamge;
