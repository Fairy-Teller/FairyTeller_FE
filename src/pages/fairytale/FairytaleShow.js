import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import RecordButton from '../../components/RecordButton';
import { call } from '../../service/ApiService';
import { sendAudioData } from '../../service/FairytaleService';
import Modal from 'react-modal';

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
    bottom: 0;
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
    width: 15%;
    height: 59px;
    left: 528px;
    top: 200px;
    border-radius: 16px;

    background: rgba(252, 222, 222, 1);
`;

const Voicechange = styled.button`
    width: 15%;
    height: 59px;
    left: 528px;
    top: 200px;
    border-radius: 16px;

    background: rgba(239, 153, 153, 1);
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
            for (let i = 0; i < bookinfos.pages.length; i++) {
                imgearr[i] = bookinfos.pages[i].finalImageUrl;
                audioarr[i] = bookinfos.pages[i].audioUrl;
                userAudioarr[i] = bookinfos.pages[i].userAudioUrl;
                story[i] = bookinfos.pages[i].fullStory;
            }
            setBookInfo(imgearr);
            setAudioInfo(audioarr);
            setUserAudioInfo(userAudioarr);
            setBookStory(story);
            console.log('story', story);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < bookInfo.length - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRecordingComplete = async (pageNumber, audioBlob) => {
        console.log('Recording completed for page:', pageNumber);
        console.log('audioBlob', audioBlob);
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
        <CenteredContainer>
            {bookInfo.length > 0 && (
                <div>
                    <AudioContainer>
                        {!userAudioInfo[currentPage] && (
                            <>
                                <audio ref={audioRef} src={audioInfo[currentPage]} controls preload="auto" />
                                <VoiceButton onClick={() => setIsModalOpen(true)}>내 목소리로 녹음하기</VoiceButton>
                            </>
                        )}
                        {userAudioInfo[currentPage] && (
                            <>
                                <audio
                                    ref={audioRef}
                                    src={check === 'tts' ? audioInfo[currentPage] : userAudioInfo[currentPage]}
                                    controls
                                    preload="auto"
                                />

                                {check === 'user' ? (
                                    <Voicechange onClick={handleToggleAudio}>자동음성 변환</Voicechange>
                                ) : (
                                    <Voicechange onClick={handleToggleAudio}>유저 음성변환</Voicechange>
                                )}
                            </>
                        )}
                    </AudioContainer>

                    <div>
                        {isModalOpen && (
                            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                                <CloseButton onClick={closeModal}>
                                    <img src="/images/closeicon.png" alt="Close" />
                                </CloseButton>
                                <RecordButton
                                    pageNumber={currentPage + 1}
                                    onRecordingComplete={handleRecordingComplete}
                                    audioRef={audioRef}
                                    onCloseAndRefresh={() => {
                                        setIsModalOpen(false);
                                        showBook(bookid.props);
                                    }}
                                    bookid={bookid.props}
                                    bookstory={bookStory[currentPage]}
                                />
                            </Modal>
                        )}
                    </div>

                    <FairyPage>
                        <Arrow className="prevButton" disabled={currentPage === 0} onClick={handlePrevPage}>
                            <img src="/images/prev.png" />
                        </Arrow>
                        <img src={bookInfo[currentPage]} style={{ margin: '0 10px 0 10px' }} />
                        <Arrow
                            className="nextButton"
                            disabled={currentPage === bookInfo.length - 1}
                            onClick={handleNextPage}
                        >
                            <img src="/images/next.png" />
                        </Arrow>
                    </FairyPage>
                </div>
            )}
        </CenteredContainer>
    );
}

export default FairytaleShow;
