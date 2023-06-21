import React from "react";
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

const ImgSelect = (props) => {
  const onClickHandler = () => {
    props.onSave();
  };

  return (
    <Button
      type='button'
      onClick={onClickHandler}>
      이 이미지 선택하기
    </Button>
  );
};

export default ImgSelect;
