import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { BookId } from '../recoil/FairytaleState';
import Header from '../components/global/Header';
import Container from '../components/global/Container';
import CenteredWrap from '../components/global/CenteredWrap';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NewestTemp } from '../service/FairytaleService';
import LazyBackground from "../components/common/LazyBackground";
import base64_bg_start from "../script/base64_bg_start";
import Modal from '../components/TempModal';

const Button = styled.button`
  padding: 2rem 3.6rem;
  margin: 0 1.2rem;
  color: #fff;
  font-size: 2.4rem;
  line-height: 1.4;
  font-weight: 600;
  background-color: #ef9999;
  border-radius: 2.4rem;
  transition: all 0.24s ease-in-out;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.012);
  }
`;
const TempButton = styled.button`
    border-radius: 100px;
    width: 50%;
    height: 20%;
    margin-top: 5%;
    font-size: 20px;
    z-index: 9999;
`;

const Tempalert = styled.div`
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 150px;
    background: rgba(255, 255, 255, 0.56);
    border-radius: 34px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 20px;
    padding: 10px;
    z-index: 0;
`;
const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    z-index: 999999;
`;

const Start = () => {
    const navigate = useNavigate();
    const [tempState, setTempState] = useState(null);
    const [bookId, setBookId] = useRecoilState(BookId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        NewestTemp().then((response) => {
            setTempState(response);
        });

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const gotoPage = () => {
        const hasNullImageUrl = tempState.pages.some((item) => item.originalImageUrl === null);

        if (hasNullImageUrl) {
            navigate('/image-generated');
        }
        setBookId(tempState.bookId);
        // originalImageUrl중에 하나라도 null 일경우 /image-generated
        // 모두 다 있을 경우, finalImageUrl
    };

    return (
        <div
            style={{
                backgroundImage: 'url("/images/background_start.png")',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', // 배경 이미지를 스크롤에 고정
                minHeight: '100vh',
            }}
        >
            <Container>
                <Header mode={'default'} />

                <div className="start an1">
                    <CenteredWrap>
                        {tempState && (
                            <Tempalert>
                                📔 임시 저장된 동화책이 있습니다. <br />
                                해당 동화책 수정화면으로 이동할까요?
                                <TempButton onClick={() => setIsModalOpen(true)}>수정하러 가기</TempButton>
                            </Tempalert>
                        )}

                        {isModalOpen && (
                            <>
                                <CloseButton onClick={() => setIsModalOpen(false)}>
                                    <img src="/images/closeicon.png" alt="Close" />
                                </CloseButton>
                                <Modal></Modal>
                            </>
                        )}
                        <Button onClick={() => navigate('/story-user')}>스스로 동화 이야기 만들기</Button>
                        <Button onClick={() => navigate('/keyword')}>AI한테 이야기 부탁하기</Button>
                        <Button onClick={() => navigate('/board')}>우리들의 도서관 가기</Button>
                    </CenteredWrap>
                </div>
            </Container>
        </div>
    );
};

export default Start;
