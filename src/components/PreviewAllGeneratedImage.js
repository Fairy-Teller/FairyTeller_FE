import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ImageTempState } from "../recoil/Fairytailstate";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;
const Text = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 110px;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 25px;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  width: 1000px; /* Sum of Image widths and gaps (350 * 3 + 30 * 2) */
`;
const Image = styled.img`
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  margin-bottom: 30px;

  &:nth-child(4),
  &:nth-child(5) {
    margin-right: auto;
    margin-left: auto;
  }

  &:hover {
    transform: scale(1.1);
  }
`;
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const Button = styled.button`
  width: 200px;
  height: 40px;
  background: #99f0cc;
  border-radius: 10px;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  text-align: center;
  color: #000000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background-color: #87dab3;
  }
`;

const PreviewAllGeneratedIamge = () => {
  const savedImageTemp = useRecoilValue(ImageTempState);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("savedImageTemp", savedImageTemp);
  }, []);

  const goEdit = () => {
    navigate("/f-edit");
  };

  return (
    <Div>
      <Text>AI가 만들어준 그림을 확인해보아요!</Text>
      <ImageContainer>
        {savedImageTemp.map((item, index) => (
          <Image
            key={index}
            src={item["url"]}
            alt={`Generated Image ${index + 1}`}
          />
        ))}
      </ImageContainer>
      <ButtonWrap>
        <Button onClick={goEdit}>동화책 꾸미기</Button>
      </ButtonWrap>
    </Div>
  );
};

export default PreviewAllGeneratedIamge;
