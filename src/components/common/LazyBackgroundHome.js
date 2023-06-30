import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";

const homeBgAnimation = keyframes`
  0% {
    background-position-x: 0%;
  }
  100% {
    background-position-x: 10%;
  }
`;

const Background = styled.div`
  height: 100vh;
  object-fit: cover;
  background-size: cover;
  background-repeat: no-repeat;
  animation: ${homeBgAnimation} 30s infinite linear;
`;

function LazyBackgroundHome(props) {
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
    <Background
      {...props}
      style={{
        backgroundImage: `url(${isLoaded ? src : props.placeholder})`,
      }}
    />
  );
}

export default LazyBackgroundHome;
