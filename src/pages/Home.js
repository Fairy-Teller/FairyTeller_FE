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
    position: absolute;
    width: 100%;
    height: 100vh;
    object-fit: cover;
    opacity: 0;
    animation: containerFadeIn 1s ease-in forwards;
  `;
  const Image = styled.img`
    position: absolute;
    width: 100%;
    height: 100vh;
    object-fit: cover;
    filter: drop-shadow(5px 5px 5px #000);
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
    background: linear-gradient(180deg, #fee080 0%, rgba(254, 224, 128, 0) 100%);
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

  return (
    <div>
      <LazyBackgroundHome
        src='images/CartoonStarryNight.png'
        placeholder='https://ik.imagekit.io/hbcho/CartoonStarryNight.png?tr=w-512,h-288,bl-25,q-25'>
        <LazyBackground
          type='home'
          src='images/HomeGirl.png'
          placeholder='https://ik.imagekit.io/hbcho/HomeGirl.png?tr=bl-25,q-25'
        />
        <FixedContainer>
          <StartButton onClick={gotoLogin}>시작하기</StartButton>
          <ImageLogo
            src='images/logo_home.png'
            style={{ zIndex: 3 }}
          />
        </FixedContainer>
      </LazyBackgroundHome>
    </div>
  );
};

export default Home;
