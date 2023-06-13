import React, { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { call } from '../../service/ApiService';
import styled from 'styled-components';

const FairytaleTitle = styled.div`
    font-weight: 400;
    font-size: 96px;
    line-height: 162px;
    text-align: left;
    color: #ffffff;
    padding-left: 5%;
`;

const ButtonFrame = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 5%;
    margin-bottom: 10px;
`;

const Button = styled.button`
    width: 15%;
    height: 104px;
    background-color: white;
    font-size: 150%;
    border-radius: 51.5px;
    margin-right: 1%;
`;

const BookCover = styled.div`
    width: 100vw;
    height: 100vh;
    background-size: cover;
`;

function FairytaleExport() {
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [BookId, setBookId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await call('/book/my-newest', 'GET', null);
            setThumbnailUrl(response.thumbnailUrl);
            setBookId(response.bookId);
            const boardresponse = await call('/board/save', 'POST', { bookId: BookId });
            console.log(boardresponse);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    return (
        <Container className="">
            <BookCover style={{ backgroundImage: `url(${thumbnailUrl})` }}>
                <div style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
                    <FairytaleTitle>My Little Fairytale</FairytaleTitle>
                    <ButtonFrame>
                        <Button>게시판 전시하기</Button>
                        <Button>PDF로 내보내기</Button>
                        <Button>동화책 보기</Button>
                    </ButtonFrame>
                </div>
            </BookCover>
        </Container>
    );
}

export default FairytaleExport;
