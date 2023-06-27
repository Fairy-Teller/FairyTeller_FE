import React, { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { GeneratedBoolState, GeneratedCountState } from "../recoil/FairytaleState";
import styled from "styled-components";

const Button = styled.button`
  width: 16rem;
  height: 3.6rem;
  font-style: normal;
  font-weight: 400;
  font-size: 1.4rem;
  text-align: center;
  color: #000000;
  border-radius: 0.8rem;
  word-break: keep-all;
  background-color: pink;
`;

const ImgGenerate = (props) => {
  const [isFirstCreated, setIsFirstCreated] = useRecoilState(GeneratedBoolState);
  const [imgCount, setImgCount] = useRecoilState(GeneratedCountState);

  useEffect(() => {
    if (imgCount[props.index] === 0) {
      document.querySelector(`button[name=idx${props.index}]`).disabled = true;
    }
  }, [imgCount]);

  const onClickHandler = (e) => {
    props.onCreate();

    const newImgCount = [...imgCount];
    --newImgCount[props.index];
    setImgCount(newImgCount);
  };

  if (isFirstCreated[props.index]) {
    return (
      <Button
        type='button'
        name={"idx" + props.index}
        onClick={(e) => {
          onClickHandler(e);
        }}>
        다시 뽑기 {imgCount[props.index]}
      </Button>
    );
  }
  if (!isFirstCreated[props.index]) {
    return (
      <Button
        type='button'
        onClick={(e) => {
          onClickHandler(e);

          const newIsFirstCreated = [...isFirstCreated];
          newIsFirstCreated[props.index] = true;
          setIsFirstCreated(newIsFirstCreated);

          console.log(props.index, isFirstCreated);
        }}>
        이미지 생성
      </Button>
    );
  }
};

export default ImgGenerate;
