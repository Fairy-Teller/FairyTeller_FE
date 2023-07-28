import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  position: fixed;
  bottom: calc(50% - 4rem);
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
`;
const Message = styled.span`
  font-size: 1.6rem;
  text-align: center;
  color: white;
  padding: 1.6rem 2rem;
  background-color: black;
  border-radius: 4rem;
  overflow: hidden;
  opacity: 0.8;
`;

const ToastPopup = (props) => {
  const [display, setDisplay] = useState(props.show);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplay(false);
    }, 2400);

    return () => {
      clearTimeout(timer);
    };
  }, [props]);

  return display ? (
    <Wrap>
      <Message>{props.message}</Message>
    </Wrap>
  ) : null;
};

export default ToastPopup;
