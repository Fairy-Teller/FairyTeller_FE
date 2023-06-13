import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { styled } from 'styled-components';

const Button = styled.button`
    width: 525px;
    height: 91px;
    background: #f09159;
    border-radius: 40px;

    font-family: 'Amiri';
    font-style: normal;
    font-weight: 400;
    font-size: 80px;

    color: #ffffff;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Adjust this if necessary */
`;

function Home() {
    return (
        <Container className={''}>
            <h1></h1>
            <CenteredDiv>
                <Link to="/login">
                    <Button>Login</Button>
                </Link>
            </CenteredDiv>
        </Container>
    );
}

export default Home;
