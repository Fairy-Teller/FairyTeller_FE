import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/global/Container";
import CenteredWrap from "../components/global/CenteredWrap";
import { styled } from "styled-components";

const Button = styled.button`
  color: #fff;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  background-color: transparent;
`;

const Start = () => {
  return (
    <div className='start'>
      <Container>
        <CenteredWrap>
          <Link to='/story-user'>
            <Button>
              input <br />
              scenario
            </Button>
          </Link>
          <Link to='/keyword'>
            <Button>
              input <br />
              keywords
            </Button>
          </Link>
        </CenteredWrap>
      </Container>
    </div>
  );
};

export default Start;
