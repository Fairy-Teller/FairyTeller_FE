import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  height: 100vh;
  position: relative;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  // transition: opacity 0.4s ease-in-out;
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
    loadImage(props.src)
      .then((img) => {
        setTimeout(() => {
          setSrc(img.src);
        }, 120);
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
      <Img
        src={src}
        alt='bg'
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </ImageContainer>
  );
}

export default LazyBackgroundHome;
