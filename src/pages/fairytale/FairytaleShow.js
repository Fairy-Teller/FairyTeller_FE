import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import RecordButton from '../../components/RecordModal';
import { call } from '../../service/ApiService';
import { sendAudioData } from '../../service/FairytaleService';
import Modal from 'react-modal';
import Book from './Book.js';

import { useRecoilValue } from 'recoil';
import { BookPage } from '../../recoil/FairytaleState';

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CardContainer = styled.img`
    width: 1250px;
    height: 720px;
    margin-left: 2%;
    margin-right: 2%;
    src: '/images/prev.png';
`;

const AudioContainer = styled.div`
    text-align: center;
    padding: 20px;
`;

const FairyPage = styled.div`
    display: flex;
`;

const Arrow = styled.button`
    ${(props) =>
        props.disabled &&
        css`
            opacity: 0.5;
            pointer-events: none;
        `}
`;

const VoiceButton = styled.button`
    width: 54px;
    height: 53px;
    left: 528px;
    top: 200px;
    margin-left: 30px;
    margin-bottom: 25px;

    background-image: url('/images/mic.png');
    background-size: cover;
`;

const Voicechange = styled.button`
    width: 54px;
    height: 53px;
    left: 528px;
    top: 200px;
    margin-left: 30px;
    margin-bottom: 25px;
    background-image: url('/images/tts.png');
    background-size: cover;
`;

const Voiceuserchange = styled.button`
    width: 54px;
    height: 53px;
    left: 528px;
    top: 200px;
    margin-left: 30px;
    margin-bottom: 25px;
    background-image: url('/images/uservoice.png');
    background-size: cover;
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
`;

function FairytaleShow(bookid) {
    const audioRef = useRef(null);
    const [bookInfo, setBookInfo] = useState([]);
    const [audioInfo, setAudioInfo] = useState([]);
    const [bookStory, setBookStory] = useState(null);
    const [userAudioInfo, setUserAudioInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordingInProgress, setRecordingInProgress] = useState(false);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
    const [check, setCheck] = useState('user');

    const bookPage = useRecoilValue(BookPage);

    useEffect(() => {
        if (bookid.props !== '') {
            showBook(bookid.props);
        }
    }, [bookid]);

    const showBook = async (props) => {
        try {
            const bookinfos = await call('/book/getBookById', 'POST', {
                bookId: props,
            });

            const imgearr = [];
            const audioarr = [];
            const userAudioarr = [];
            const story = [];

            imgearr[0] = bookinfos.thumbnailUrl;
            for (let i = 0; i < bookinfos.pages.length; i++) {
                const page = bookinfos.pages[i];
                audioarr[i] = page.audioUrl;
                userAudioarr[i] = page.userAudioUrl;
                story[i] = page.fullStory;
                imgearr[i + 1] = page.finalImageUrl;
            }
            setBookInfo(imgearr);
            setAudioInfo(audioarr);
            setUserAudioInfo(userAudioarr);
            setBookStory(story);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const Text = styled.p`
        color: white;
    `;

    const handleRecordingComplete = async (pageNumber, audioBlob) => {
        setRecordedAudioBlob(audioBlob);
        setRecordingInProgress(false);

        if (audioRef.current) {
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;

            const handleLoadedData = () => {
                audioRef.current.play();
                audioRef.current.removeEventListener('loadeddata', handleLoadedData);
            };

            audioRef.current.addEventListener('loadeddata', handleLoadedData);
        }
    };
    const handleToggleAudio = () => {
        setCheck((prevCheck) => (prevCheck == 'tts' ? 'user' : 'tts'));
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <div>
            <CenteredContainer>
                {bookInfo.length > 0 && (
                    <div>
                        <AudioContainer>
                            {bookPage !== -1 ? (
                                <>
                                    {!userAudioInfo[bookPage] && !bookid.state ? (
                                        <>
                                            <audio ref={audioRef} src={audioInfo[bookPage]} controls preload="auto" />
                                            <VoiceButton onClick={() => setIsModalOpen(true)}></VoiceButton>
                                            <Text>마이크 버튼을 눌러 나만의 동화를 녹음해 보세요</Text>
                                        </>
                                    ) : !userAudioInfo[bookPage] && bookid.state ? (
                                        <>
                                            <audio ref={audioRef} src={audioInfo[bookPage]} controls preload="auto" />
                                            <Voicechange></Voicechange>
                                            <Text>동화를 읽어드립니다! 재생버튼을 클릭해 보세요</Text>
                                        </>
                                    ) : null}
                                    {userAudioInfo[bookPage] && (
                                        <>
                                            <audio
                                                ref={audioRef}
                                                src={check === 'tts' ? audioInfo[bookPage] : userAudioInfo[bookPage]}
                                                controls
                                                preload="auto"
                                            />
                                            {check === 'user' ? (
                                                <>
                                                    <Voicechange onClick={handleToggleAudio}></Voicechange>
                                                    <Text>로봇 버튼을 누르시면 기계음성으로 변환합니다.</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Voiceuserchange onClick={handleToggleAudio}></Voiceuserchange>
                                                    <Text>사람 버튼을 누르시면 녹음 음성으로 변환합니다.</Text>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div style={{ height: '95px' }}></div>
                            )}
                        </AudioContainer>

                        <div>
                            {isModalOpen && (
                                <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                                    <CloseButton onClick={closeModal}>
                                        <img src="/images/closeicon.png" alt="Close" />
                                    </CloseButton>
                                    <RecordButton
                                        pageNumber={bookPage + 1}
                                        onRecordingComplete={handleRecordingComplete}
                                        audioRef={audioRef}
                                        onCloseAndRefresh={() => {
                                            setIsModalOpen(false);
                                            showBook(bookid.props);
                                        }}
                                        bookid={bookid.props}
                                        bookstory={bookStory[bookPage]}
                                    />
                                </Modal>
                            )}
                        </div>
                    </div>
                )}
            </CenteredContainer>
            <Book bookInfo={bookInfo} />
        </div>
    );
}

export default FairytaleShow;
