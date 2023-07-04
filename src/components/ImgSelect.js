import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 8rem;
  height: 3.2rem;
  padding: 0.4rem 2.4rem;
  font-style: normal;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  color: #000000;
  background-color: pink;
  border-radius: 0.8rem;
  background-color: violet;
`;

const ImgSelect = (props) => {
  const onClickHandler = () => {
    props.onSave();
  };

  return (
    <Button
      type='button'
      onClick={onClickHandler}>
      이 이미지 선택
    </Button>
  );
};

export default ImgSelect;
