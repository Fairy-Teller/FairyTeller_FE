import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/global/Header";
import Container from "../components/global/Container";
import CenteredWrap from "../components/global/CenteredWrap";
import LazyBackground from "../components/common/LazyBackground";
import { styled } from "styled-components";

const Button = styled.button`
  background: #ef9999;
  border-radius: 20px;
  padding: 30px 50px;
  border: none;
  margin: 1em;
  color: #fff;
  font-size: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Start = () => {
  const navigate = useNavigate();

  return (
    <LazyBackground
      type='bg'
      src='images/CartoonStarryNight.png'
      placeholder='https://ik.imagekit.io/hbcho/CartoonStarryNight.png?tr=w-512,h-288,bl-40,q-20'>
      <Container>
        <Header />
        <div className='start an1'>
          <CenteredWrap>
            <Button onClick={() => navigate("/story-user")}>스스로 동화 이야기 만들기</Button>
            <Button onClick={() => navigate("/keyword")}>AI한테 이야기 부탁하기</Button>
            <Button onClick={() => navigate("/board")}>우리들의 도서관 가기</Button>
          </CenteredWrap>
        </div>
      </Container>
    </LazyBackground>
  );
};

export default Start;
