import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Header from "../components/global/Header";
import Container from "../components/global/Container";
import CenteredWrap from "../components/global/CenteredWrap";
import LazyBackground from "../components/common/LazyBackground";
import base64_bg_start from "../script/base64_bg_start";

const Button = styled.button`
  padding: 2rem 3.6rem;
  margin: 0 1.2rem;
  color: #fff;
  font-size: 2.4rem;
  line-height: 1.4;
  font-weight: 600;
  background-color: #ef9999;
  border-radius: 2.4rem;
  transition: all 0.24s ease-in-out;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.012);
  }
`;

const Start = () => {
  const navigate = useNavigate();

  return (
    <div>
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

      <LazyBackground
        type='bg'
        src='https://ik.imagekit.io/hbcho/StarryNight_start.jpg'
        placeholder={base64_bg_start}
      />
    </div>
  );
};

export default Start;
