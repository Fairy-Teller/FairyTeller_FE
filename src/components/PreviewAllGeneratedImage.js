import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ImageTempState } from "../recoil/FairytaleState";
import styled from "styled-components";

const ImageContainerFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 1000px; /* Sum of Image widths and gaps (350 * 3 + 30 * 2) */
`;
const Image = styled.img`
  width: 100%;
  height: 240px;
  margin-bottom: 0.8rem;
  object-fit: cover;
  border-radius: 0.8rem;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
  transition: all 0.24s ease-in-out;

  &:hover {
    height: 520px;
    transform: scale(1.012);
  }
`;
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.6rem;
`;
const Button = styled.button`
  width: 24rem;
  height: 4rem;
  background: pink;
  border-radius: 0.8rem;
  font-style: normal;
  font-weight: 400;
  font-size: 1.6rem;
  text-align: center;
  color: #000000;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.16);
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
    <ImageContainerFrame>
      <ImageContainer>
        {savedImageTemp.map((item, index) => (
          <Image
            key={index + "-generated"}
            src={item["url"] ? item["url"] : "/images/default-image.jpg"}
            alt={`Generated-Image-${index + 1}`}
          />
        ))}
      </ImageContainer>
      <ButtonWrap>
        <Button onClick={goEdit}>동화책 꾸미기</Button>
      </ButtonWrap>
    </ImageContainerFrame>
  );
};

export default PreviewAllGeneratedIamge;
