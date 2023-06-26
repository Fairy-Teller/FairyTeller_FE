import { Link } from 'react-router-dom';
import Header from '../components/global/Header';
import Container from '../components/global/Container';
import CenteredWrap from '../components/global/CenteredWrap';
import { styled } from 'styled-components';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    const navigate = useNavigate();

    return (
        <Container>
            <Header mode={'default'} />
            <div className="start an1">
                <CenteredWrap>
                    <Button onClick={() => navigate('/story-user')}>스스로 동화 이야기 만들기</Button>
                    <Button onClick={() => navigate('/keyword')}>AI한테 이야기 부탁하기</Button>
                    <Button onClick={() => navigate('/boar')}>우리들의 도서관 가기</Button>
                </CenteredWrap>
            </div>
        </Container>
    );
};

export default Start;
