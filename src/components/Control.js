import React from "react";
import styled from "styled-components";
import "../assets/css/control.scss";

const [PREV, NEXT, DONE] = ["prev", "next", "done"];

const Button = styled.button`
  width: 8rem;
  height: 3.2rem;
  margin: -8rem 0 0;
  font-style: normal;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  color: #000000;
  background-color: pink;
  border-radius: 0.8rem;
`;

const Control = (props) => {
  const onClickHandler = () => {
    props.onControl(props.mode);
  };

  if (props.mode === PREV) {
    return (
      <Button
        type='button'
        onClick={onClickHandler}
        style={{ marginRight: "2rem" }}>
        이전
      </Button>
    );
  } else if (props.mode === NEXT) {
    return (
      <Button
        type='button'
        onClick={onClickHandler}
        style={{ marginLeft: "2rem" }}>
        다음
      </Button>
    );
  } else if (props.mode === DONE) {
    <Button
      type='button'
      onClick={onClickHandler}
      style={{ marginLeft: "2rem" }}>
      확인하러 가기
    </Button>;
  } else {
    return <div>Loading...</div>;
  }
};

export default Control;
