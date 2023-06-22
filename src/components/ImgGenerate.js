import React, { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { GeneratedBoolState, GeneratedCountState } from "../recoil/Fairytailstate";
import styled from "styled-components";

const Button = styled.button`
  width: 8rem;
  height: 3.2rem;
  padding: 0.25rem 0.5rem;

  font-style: normal;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  color: #000000;
  background-color: #99f0cc;
  border-radius: 0.8rem;
  word-break: keep-all;
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

    console.log(e.target.name, imgCount);
  };

  if (isFirstCreated[props.index]) {
    return (
      <Button
        type='button'
        name={"idx" + props.index}
        onClick={(e) => {
          onClickHandler(e);
        }}
        style={{ marginRight: "2rem" }}>
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
        }}
        style={{ marginRight: "2rem" }}>
        이미지 생성하기
      </Button>
    );
  }
};

export default ImgGenerate;
