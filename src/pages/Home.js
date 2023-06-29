import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import "../css/home.css";

const Home = () => {
  const [showMain, setShowMain] = useState(false);
  const navigation = useNavigate();

  const ImagesContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center; /* Center horizontally */

    width: 100vw;
    height: 100vh;
  `;

  const slideAnimation = keyframes`
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-20%);
    }
  `;
  const ImageLogo = styled.img`
    filter: drop-shadow(5px 5px 5px #000);
    position: absolute;
    width: 100%;
    height: 100vh;
    object-fit: cover;

    opacity: 0;
    animation: containerFadeIn 1s ease-in forwards;
  `;
  const Image = styled.img`
    filter: drop-shadow(5px 5px 5px #000);
    position: absolute;
    width: 100%;
    height: 100vh;
    object-fit: cover;
  `;

  const containerFadeIn = keyframes`
       0% {
      opacity: 0;
      transform: translateY(-25px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }

  `;

  const BackImage = styled.div`
    filter: drop-shadow(5px 5px 5px #000);
    position: absolute;
    width: 200%;
    height: 100vh;
    object-fit: cover;
    animation: ${slideAnimation} 30s infinite linear;
    background-repeat: repeat;
    background-image: url("images/CartoonStarryNight.png");
  `;

  const StartButton = styled.button`
    /* Star 1 */

    box-sizing: border-box;

    position: absolute;
    width: 207px;
    height: 40px;

    /* 시작하기 */

    color: #ffffff;
    font-size: large;
    margin-top: 15%;
    background: linear-gradient(
      180deg,
      #fee080 0%,
      rgba(254, 224, 128, 0) 100%
    );
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 22px;
    animation: containerFadeIn 1s ease-in forwards;
    z-index: 4;
  `;
  const gotoLogin = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    console.log(token);
    if (token === null) {
      navigation("/Login");
    } else {
      navigation("/start");
    }
  };

  useEffect(() => {
    setShowMain(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <ImagesContainer>
      {showMain && (
        <>
          <StartButton onClick={gotoLogin}>시작하기</StartButton>
          <BackImage
            src="images/CartoonStarryNight.png"
            style={{ zIndex: 1 }}
          />
          <Image src="images/girl.png" style={{ zIndex: 2 }} />
          <ImageLogo src="images/logo_home.png" style={{ zIndex: 3 }} />
        </>
      )}
    </ImagesContainer>
  );
};

export default Home;
