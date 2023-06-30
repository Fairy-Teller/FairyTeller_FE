import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";

const BackGround = styled.div`
  ${({ type }) =>
    type === "bg" &&
    css`
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-attachment: fixed;
      min-height: 100vh;
    `}
  ${({ type }) =>
    type === "home" &&
    css`
      background-repeat: no-repeat;
      background-position: center bottom;
      position: fixed;
      left: 0;
      right: 0;
      bottom: -80px;
      overflow: visible;
      padding-top: 40%;
    `}
`;

function LazyBackground(props) {
  const [src, setSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const imageLoader = new Image();
    imageLoader.src = props.src;
    imageLoader.onload = () => {
      setSrc(props.src);
      setTimeout(() => {
        setIsLoaded(true);
      }, 400);
    };
  }, [props.src]);

  return (
    <BackGround
      {...props}
      type={props.type}
      style={{
        backgroundImage: `url(${isLoaded ? src : props.placeholder})`,
      }}
    />
  );
}

export default LazyBackground;
