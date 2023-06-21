import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 8rem;
  height: 3.2rem;
  padding: 0.25rem 0.5rem;
  font-family: "Amiri";
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
  const [isFirstCreated, setIsFirstCreated] = useState([false, false, false, false, false]);

  useEffect(() => {
    console.log(isFirstCreated);
  }, []);

  const onClickHandler = () => {
    props.onCreate();
  };

  if (isFirstCreated[props.index]) {
    return (
      <Button
        type='button'
        onClick={onClickHandler}
        style={{ marginRight: "2rem" }}>
        다시 뽑기
      </Button>
    );
  }
  if (!isFirstCreated[props.index]) {
    return (
      <Button
        type='button'
        onClick={() => {
          onClickHandler();
          setIsFirstCreated(!isFirstCreated[props.index]);

          const newIsFirstCreated = [...isFirstCreated];
          newIsFirstCreated[props.index] = true;
          setIsFirstCreated(newIsFirstCreated);

          console.log(props.index, isFirstCreated);
        }}>
        이미지 생성하기
      </Button>
    );
  }
};

export default ImgGenerate;
