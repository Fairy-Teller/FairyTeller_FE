import React from "react";
import styled from "styled-components";
import "../assets/css/control.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft as prev } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleRight as next } from "@fortawesome/free-regular-svg-icons";

const [PREV, NEXT, DONE] = ["prev", "next", "done"];

const Button = styled.button`
  width: 4.4rem;
  height: 4.4rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  text-align: center;
  color: #edaeae;
  border-radius: 50%;
  transition: background 0.24s;
  background-color: #fff;
  &:hover {
    color: #fff;
    background-color: #edaeae;
  }
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
        style={{ marginRight: "0.4rem" }}>
        <FontAwesomeIcon icon={prev} />
      </Button>
    );
  } else if (props.mode === NEXT) {
    return (
      <Button
        type='button'
        onClick={onClickHandler}
        style={{ marginLeft: "0.4rem" }}>
        <FontAwesomeIcon icon={next} />
      </Button>
    );
  } else if (props.mode === DONE) {
    <Button
      type='button'
      onClick={onClickHandler}
      style={{ marginLeft: "0.4rem" }}>
      확인하러 가기
    </Button>;
  } else {
    return <div>Loading...</div>;
  }
};

export default Control;
