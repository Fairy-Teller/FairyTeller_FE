import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { styled } from 'styled-components';

const Button = styled.button`
    width: 500px;
    height: 500px;
    background: #f09159;
    border-radius: 700px;

    font-family: 'Amiri';
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    margin-left: 30px;

    color: #ffffff;
    margin-bottom: 20px;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Adjust this if necessary */
`;

function Start() {
    return (
        <Container className={''}>
            <h1></h1>
            <CenteredDiv>
                <Link to="/story-generated">
                    <Button>input scenario</Button>
                </Link>
                <Link to="/keyword">
                    <Button>input keywords</Button>
                </Link>
            </CenteredDiv>
        </Container>
    );
}

export default Start;
