import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const ImageContainer = styled.div`
  position: relative;
  ${({ type }) =>
    type === "default" &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `}
  ${({ type }) =>
    type === "home" &&
    css`
      img {
        z-index: 1;
        height: 100vh;
        position: fixed;
        bottom: -20px;
      }
    `}
  ${({ type }) =>
    type === "show" &&
    css`
      z-index: -1;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `}
  ${({ type }) =>
    type === "book" &&
    css`
      width: 100%;
      height: 450px;
      border-radius: 2%;
      transition: transform 0.4s ease;
    `}
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  transition: opacity 0.4s ease-in-out;
`;

function LazyBackground(props) {
  const [src, setSrc] = useState(null);
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
    <ImageContainer type={props.type}>
      <Img
        src={props.placeholder}
        alt=''
        style={{ opacity: isLoaded ? 0 : 1 }}
      />
      <Img
        src={src}
        alt=''
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </ImageContainer>
  );
}

export default LazyBackground;
