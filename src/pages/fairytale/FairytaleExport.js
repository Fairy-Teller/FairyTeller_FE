import React, { useState, useEffect } from 'react';
import { call } from '../../service/ApiService';
import { getBookById } from '../../service/FairytaleService';
import styled from 'styled-components';
import FairytaleShow from './FairytaleShow';
import LazyBackground from '../../components/common/LazyBackground';
import Header from '../../components/global/Header';
import ContentCover from '../../components/global/ContentCover';
import InnerCover from '../../components/global/InnerCover';

import { useRecoilValue } from 'recoil';
import { BookId } from '../../recoil/FairytaleState';

const ButtonFrame = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 5%;
    margin-bottom: 10px;
`;

const Button = styled.button`
    width: 15%;
    height: 40px;
    margin-top: 2%;
    background-color: #ffde67;
    font-size: 150%;
    border-radius: 51.5px;
    margin-right: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
`;

// const PageWrapper = styled.div`
//     background-image: url('/images/StarryNight_export.jpg');
//     background-size: cover;
//     background-repeat: no-repeat;
//     background-position: center;
//     background-attachment: fixed; /* 배경 이미지를 스크롤에 고정 */
//     min-height: 100vh;
// `;

const FairytaleExport = () => {
    const [Title, setTitle] = useState('');
    const [Image, setImage] = useState([]);
    const bookIdshow = useRecoilValue(BookId);

    useEffect(() => {
        fetchData();
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const fetchData = async () => {
        try {
            console.log('bookIdshow>>', bookIdshow);
            const data = await getBookById({ bookId: bookIdshow });
            setTitle(data.title);

            const imgearr = [];
            for (let i = 0; i < data.pages.length; i++) {
                imgearr[i] = data.pages[i].finalImageUrl;
            }
            setImage(imgearr);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const gotoBoard = async () => {
        try {
            await call('/board/save', 'POST', { bookId: bookIdshow });
            alert('등록되었습니다');
            window.location.href = '/board';
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const exportPDF = async () => {
        for (var i = 0; i < Image.length; i++) {
            (function (index) {
                var link = document.createElement('a');
                link.href = Image[index];
                link.download = Title + '.png';
                link.style.display = 'none';
                document.body.appendChild(link);

                setTimeout(function () {
                    link.click();
                    document.body.removeChild(link);
                }, index * 1000);
            })(i);
        }
    };

    return (
        <LazyBackground
            type="bg"
            src="https://ik.imagekit.io/hbcho/StarryNight_export.jpg"
            placeholder="https://ik.imagekit.io/hbcho/CartoonStarryNight.png?tr=w-512,h-288,bl-40,q-20"
        >
            <Header mode={'default'} />
            <ContentCover>
                <InnerCover>
                    <FairytaleShow props={BookId}></FairytaleShow>

                    <div>
                        <ButtonFrame>
                            <Button onClick={gotoBoard}>게시판 전시하기</Button>
                            <Button onClick={exportPDF}>파일 저장하기</Button>
                        </ButtonFrame>
                    </div>
                </InnerCover>
            </ContentCover>
        </LazyBackground>
    );
};

export default FairytaleExport;
