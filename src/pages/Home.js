import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LazyBackground from "../components/common/LazyBackground";
import LazyBackgroundHome from "../components/common/LazyBackgroundHome";

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
    z-index: 1;
    background-color: transparent;
  `;
  const ImageLogo = styled.img`
    object-fit: cover;
    opacity: 0;
    animation: containerFadeIn 1s ease-in forwards;
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

  return (
    <div>
      <LazyBackgroundHome
        src='images/CartoonStarryNight.png'
        placeholder='https://ik.imagekit.io/hbcho/CartoonStarryNight.png?tr=w-512,h-288,bl-40,q-20'>
        <LazyBackground
          type='home'
          src='images/HomeGirl.png'
          placeholder='https://ik.imagekit.io/hbcho/HomeGirl.png?updatedAt=1688197920710?tr=bl-40,q-20'
        />
        <FixedContainer>
          <HeadWrap>
            <ImageLogo
              src='../../logo-bright.png'
              style={{ zIndex: 3 }}
            />
            <StartButton onClick={gotoLogin}>시작하기</StartButton>
          </HeadWrap>
        </FixedContainer>
      </LazyBackgroundHome>
    </div>
  );
};

export default Home;
