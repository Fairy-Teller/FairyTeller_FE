
import { Link } from "react-router-dom";
import Container from "../components/global/Container";
import CenteredWrap from "../components/global/CenteredWrap";
import { styled } from "styled-components";
import React, { useState, useEffect } from "react";

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


const Bar = styled.div`
    width: 100hw;
    height: 60px;
    text-align: left;
    background: #FCDEDE;
    font-family: 'Amiri';
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 60px;
    color: #000000;
`;

// ./public/images/tmp_background.jpg
const Start = () => {
  useEffect(() => {
    
    document.body.style.overflow = 'hidden';
    return () => {
        // 컴포넌트가 언마운트될 때 스크롤 가능하게 되돌림
        document.body.style.overflow = 'auto';
    };
  }, []);

  return (
      <Container>
      <Bar>FairyTeller</Bar>  
        <div className="start">
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
        </div> 
      </Container>
  );
};

export default Start;