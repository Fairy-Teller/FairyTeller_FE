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
  font-size: 6rem;
`;

function Home() {
  return (
    <div>
      <Container className={"home"}>
        <CenteredWrap>
          <Link to='/login'>
            <Button>Login</Button>
          </Link>
        </CenteredWrap>
      </Container>
    </div>
  );
}

export default Home;
