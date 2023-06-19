import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import ButtonWrap from "../components/common/ButtonWrap";
import {
  useRecoilState,
  useResetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";
import {
  StoryState,
  ImageTempState,
  BookState,
} from "../recoil/Fairytailstate";
import styled from "styled-components";
import LoadingModal from "./LoadingModal";
const Div = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center; // Align child elements (including the Img) to the center horizontally
`;

const Img = styled.img`
  width: 1416px;
  height: 650px;
  background: #d9d9d9;
  border-radius: 20px;
  margin-top: 20px; // Optional: add some margin at the top for some spacing
`;

const Text = styled.p`
  display: flex;
  text-align: center; // Center text horizontally
  align-items: center; // Center text vertically
  width: 1509px;
  height: 280px; // Increased the height here
  background: #fcdede;
  border-radius: 20px;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 60px;
  color: #000000;
  margin: 20px; // Optional: add some margin at the bottom for some spacing
  padding: 0 30px;
`;

const P = styled.p`
  display: flex;
  text-align: center; /* 가운데 정렬 속성 추가 */
  align-items: center; /* 세로 가운데 정렬 */
  width: 1416px;
  height: 185px;
  border-radius: 20px;
  width: 300px;
  height: 161px;
  font-weight: 600;
  font-size: 50px;
  line-height: 44px;
  color: #000000;
`;
const Button = styled.button`
  width: 400px;
  height: 81px;
  background: #99f0cc;
  border-radius: 10px;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
  line-height: 63px;
  text-align: center !important; /* 가운데 정렬 속성 추가 */
  color: #000000;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  margin-right: 20px; /* Add margin to the right of each button */
`;

const PreviewGeneratedIamge = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgURL] = useState(null);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const [savedImageTemp, setSavedImageTemp] = useRecoilState(ImageTempState);
  const [savedBook, setSavedBook] = useRecoilState(BookState);
  const [isSaveImage, setIsSaveImage] = useState(false);

  useEffect(() => {
    console.log(savedStory);
    console.log(savedImageTemp);
    console.log(props.index);
    console.log(savedBook);
    console.log(savedStory[props.index]["paragraph"]);
  }, []);

  const createImg = async () => {
    try {
      setIsLoading(true);
      console.log("이미지 요청");
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

      setIsLoading(false);

      const newPage = [...savedBook["pages"]];
      newPage[props.index] = {
        ...newPage[props.index],
        imageBase64: imageData,
      };
      setSavedBook({ ...savedBook, pages: newPage });

      onChangeHandler(imageUrl, props.index);
    } catch (error) {
      console.log("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const saveImg = async () => {
    try {
      // 이미지 저장하기
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
      alert("이미지 등록 성공!");
      setIsSaveImage(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onChangeHandler = (imgUrl, index) => {
    const newImage = [...savedImageTemp];
    newImage[index] = { ...newImage[index], url: imgUrl };
    setSavedImageTemp(newImage);
  };

  return (
    <Div>
      {isLoading && (
        <LoadingModal message="AI가 열심히 그림을 그리는 중입니다." />
      )}
      <div>
        <Text>{savedStory[props.index]["paragraph"]}</Text>
      </div>

      <ButtonWrap>
        {!isSaveImage && (
          <Button className="button" onClick={createImg}>
            이미지 생성하기
          </Button>
        )}
      </ButtonWrap>
      <P>{props.index + 1}번째 페이지</P>
      <div>
        <Img
          src={
            savedImageTemp[props.index] && savedImageTemp[props.index]["url"]
          }
        />
      </div>
      <ButtonWrap>
        <Button className="button">다시 뽑기</Button>
        {isSaveImage && (
          <Button className="button" style={{ backgroundColor: "gray" }}>
            삽화 선택 완료
          </Button>
        )}
        {!isSaveImage && (
          <Button className="button" onClick={saveImg}>
            삽화 선택
          </Button>
        )}
      </ButtonWrap>
    </Div>
  );
};

export default PreviewGeneratedIamge;
