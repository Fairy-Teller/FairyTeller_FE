import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/global/Container";
import CenteredWrap from "../components/global/CenteredWrap";
import { styled } from "styled-components";

const Button = styled.button`
  color: #000000;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 3rem;
  margin: 1em;
  border-radius: 0.4em;
  padding: 1em;
  background-color: #f1a0a0;
  position: relative;
  bottom: -6em;
`;

const Bar = styled.div`
    width: 100hw;
    height: 99px;
    text-align: left;
    background: #FCDEDE;
    font-family: 'Amiri';
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 88px;
    color: #000000;
`;
// ./public/images/tmp_background.jpg
const Start = () => {
  return (
    <div className='start'>
      <Bar>FairyTeller</Bar>
      <Container>
        <CenteredWrap>
          <Button>
            <Link to='/story-user'>
              스스로 동화 이야기 만들기
              </Link>
          </Button>
          <Button>
            <Link to='/keyword'>
              AI한테 이야기 부탁하기
            </Link>
          </Button>
        </CenteredWrap>
      </Container>
    </div>
  );
};

export default Start;
