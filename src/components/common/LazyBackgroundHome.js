import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const homeBgAnimation = keyframes`
  0% {   
    transform: translateX(0);
  }
  100% {
    transform: translateX(50%);
  }
`;

const ImageContainer = styled.div`
  height: 100vh;
  position: relative;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.4s ease-in-out;
`;
const OriginImg = styled(Img)`
  width: auto;
  max-width: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  animation: ${homeBgAnimation} 240s infinite linear;
`;

function LazyBackgroundHome(props) {
  const [src, setSrc] = useState(props.placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
    });
  };

  useEffect(() => {
    if (!props.src) {
      return;
    }
    loadImage(props.src)
      .then((img) => {
        setTimeout(() => {
          setSrc(img.src);
        }, 240);
      })
      .catch((err) => {
        console.error("Failed to load image at " + props.src, err);
      });
  }, [props.src, props.placeholder]);

  return (
    <ImageContainer>
      <Img
        src={props.placeholder}
        alt='bg'
        style={{ opacity: isLoaded ? 0 : 1 }}
      />
      <OriginImg
        src={src}
        alt='bg'
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </ImageContainer>
  );
}

export default LazyBackgroundHome;
