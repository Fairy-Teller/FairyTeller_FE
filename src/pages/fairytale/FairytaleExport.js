import React, { useState, useEffect } from 'react';
import { call } from '../../service/ApiService';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FairytaleShow from './FairytaleShow';

const FairytaleTitle = styled.div`
    font-weight: 400;
    font-size: 45px;

    text-align: center;
`;

const ButtonFrame = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 5%;
    margin-bottom: 10px;
`;

const Button = styled(Link)`
    width: 15%;
    height: 104px;
    background-color: #99f0cc;
    font-size: 150%;
    border-radius: 51.5px;
    margin-right: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
`;

const Bar = styled.div`
    width: 100hw;
    height: 99px;
    text-align: left;
    background: #fcdede;

    font-family: 'Amiri';
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 88px;

    color: #000000;
`;

const BookCover = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100vw;
    height: 100vh;
    background-size: cover;
`;
const Container = styled.div``;

function FairytaleExport() {
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [BookId, setBookId] = useState('');
    const [Title, setTitle] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    // const fetchData = async () => {
    //     try {
    //         const response = await call('/book/my-newest', 'GET', null);
    //         setThumbnailUrl('https://s3.ap-northeast-2.amazonaws.com/' + response.thumbnailUrl);
    //         setBookId(response.bookId);
    //         console.log(BookId);
    //         // const boardresponse = await call('/board/save', 'POST', { bookId: '11' });
    //         // console.log(boardresponse);
    //     } catch (error) {
    //         console.log('Error fetching data:', error);
    //     }
    // };

    const fetchData = async () => {
        try {
            const data = await call('/book/my-newest', 'GET', null);
            setThumbnailUrl('https://s3.ap-northeast-2.amazonaws.com/' + data.thumbnailUrl);
            await setBookId(data.bookId);
            setTitle(data.title);
            console.log('확인해보자!', BookId);
            console.log(thumbnailUrl);

            // await call('/book/create/story', 'POST', {
            //     fullStory: 'ha ha ha ha ha ha ha',
            // });
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const gotoBoard = async () => {
        try {
            await call('/board/save', 'POST', { bookId: BookId });
            alert('등록되었습니다');
            window.location.href = '/board';
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    const exportPDF = async () => {
        const data = { thumbnailUrl };
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = 'image.jpg';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    };

    return (
        <Container>
            <Bar>FairyTeller</Bar>
            <BookCover>
                <img src="/images/loding_4.png" style={{ marginTop: '2%' }} />
                <FairytaleTitle>{Title}</FairytaleTitle>
                <FairytaleShow props={BookId}></FairytaleShow>
                <div style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
                    <ButtonFrame>
                        <Button onClick={gotoBoard}>게시판 전시하기</Button>
                        <Button to={thumbnailUrl}>파일 저장하기</Button>
                    </ButtonFrame>
                </div>
            </BookCover>
        </Container>
    );
}

export default FairytaleExport;
