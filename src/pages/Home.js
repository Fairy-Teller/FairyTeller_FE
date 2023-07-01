import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LazyBackground from "../components/common/LazyBackground";
import LazyBackgroundHome from "../components/common/LazyBackgroundHome";
import BASE64_StarryNight from "../script/BASE64_StarryNight";
import BASE64_Girl from "../script/BASE64_Girl";

const Home = () => {
  const navigation = useNavigate();

  const FixedContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    z-index: 3;
    background-color: transparent;
  `;
  const ImageLogo = styled.img`
    object-fit: cover;
    opacity: 0;
    animation: containerFadeIn 0.4s ease-in forwards;
  `;
  const HeadWrap = styled.div`
    width: 20%;
    height: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;
  const StartButton = styled.button`
    width: 207px;
    height: 40px;
    color: #ffffff;
    font-size: 1.2rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background: linear-gradient(180deg, #fee080 0%, rgba(254, 224, 128, 0) 100%);
    border-radius: 1.6rem;
    animation: containerFadeIn 0.4s ease-in forwards;
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

  return (
    <div>
      <FixedContainer>
        <HeadWrap>
          <ImageLogo src='../../logo-bright.png' />
          <StartButton onClick={gotoLogin}>시작하기</StartButton>
        </HeadWrap>
      </FixedContainer>

      <LazyBackground
        type='home'
        src='https://ik.imagekit.io/hbcho/Girl.png'
        placeholder={BASE64_Girl}
      />
      <LazyBackgroundHome
        src='https://ik.imagekit.io/hbcho/CartoonStarryNight.png'
        placeholder={BASE64_StarryNight}
      />
    </div>
  );
};

export default Home;
