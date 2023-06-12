import React, { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { call } from '../../service/ApiService';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BookCover = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: url(https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg);
    background-size: cover;
`;
const FairytaleTitle = styled.div`
    font-weight: 400;
    font-size: 96px;
    line-height: 162px;
    text-align: left;
    color: #ffffff;
    padding-left: 5%;
`;
const ButtomFrame = styled.div`
    width: 100vw;
    display: flex;
    justify-content: flex-end;
    padding-right: 5%;
    margin-bottom: 10px;
`;
const Button = styled.button`
    width: 15%;
    height: 104px;
    left: 375px;
    top: 873px;
    background-color: white;
    font-size: 150%;
    border-radius: 51.5px;
    margin-right: 1%;
`;
function FairytaleShow() {
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await call('/book/my-newest', 'GET', null);
            console.log(response.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    return (
        <div>
            <Container className={''}>
                <BookCover>
                    <div style={{ position: 'absolute', bottom: '0px' }}>
                        <FairytaleTitle>My Little Fairytale </FairytaleTitle>

                        <ButtomFrame>
                            <Button>게시판 전시하기</Button>
                            <Button>PDF로 내보내기</Button>
                            <Button>동화책 보기</Button>
                        </ButtomFrame>
                    </div>
                </BookCover>
            </Container>
        </div>
    );
}

export default FairytaleShow;
