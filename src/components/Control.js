import React from "react";
import styled from "styled-components";
import "../assets/css/control.scss";

const [PREV, NEXT] = ["prev", "next"];

const Button = styled.button`
  width: 8rem;
  height: 3.2rem;
  margin: 12rem 0 0;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  color: #000000;
  background-color: #99f0cc;
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
  } else {
    return <div>Loading...</div>;
  }
};

export default Control;
