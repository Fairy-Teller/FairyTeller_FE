import React, { useRef, useState, useEffect } from 'react';
import { sendAudioData } from '../service/FairytaleService';
import HighlightedText from './HightlightedText';
import styled from 'styled-components';
const buttonStyle = {
    backgroundColor: '#70A5E3',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease-in-out',
    marginRight: '10px',
};
const buttonStyles = {
    backgroundColor: '#70A5E3',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease-in-out',
};
const recordInfoStyle = {
    marginTop: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
};
const VerticallyCenteredDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;
const RecordButton = ({
    pageNumber,
    onRecordingComplete,
    initialAudioUrl,
    audioRef,
    onCloseAndRefresh,
    bookid,
    bookstory,
}) => {
    console.log('bookstory>>> ', bookstory);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [stopwatch, setStopwatch] = useState(0);
    const mediaRecorder = useRef(null);
    const stopwatchInterval = useRef(null);

    useEffect(() => {
        const handleStartRecording = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            const audioChunks = [];
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.current.onstop = () => {
                const newAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setAudioBlob(newAudioBlob);
                onRecordingComplete(pageNumber, newAudioBlob);
                if (audioRef.current) {
                    audioRef.current.src = URL.createObjectURL(newAudioBlob);
                }
            };
            mediaRecorder.current.start();
            setIsRecording(true);
            // Start the stopwatch
            setStopwatch(0);
            stopwatchInterval.current = setInterval(() => {
                setStopwatch((prevStopwatch) => prevStopwatch + 1);
            }, 1000);
        };
        const countdownTimeout = setTimeout(() => {
            handleStartRecording();
            setCountdown(0);
        }, 3000);

        return () => {
            clearTimeout(countdownTimeout);
            if (isRecording) {
                mediaRecorder.current.stop();
                setIsRecording(false);
                clearInterval(stopwatchInterval.current);
            }
        };
    }, []);
    const handleStartRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        const audioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
            const newAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            setAudioBlob(newAudioBlob);
            onRecordingComplete(pageNumber, newAudioBlob);
            audioRef.current.src = URL.createObjectURL(newAudioBlob);
        };
        mediaRecorder.current.start();
        setIsRecording(true);
        // Start the stopwatch
        setStopwatch(0);
        stopwatchInterval.current = setInterval(() => {
            setStopwatch((prevStopwatch) => prevStopwatch + 1);
        }, 1000);
    };
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    const handleSaveRecording = async () => {
        try {
            const base64Audio = await convertBlobToBase64(audioBlob);
            const payload = {
                bookId: bookid,
                pages: [
                    {
                        pageNo: pageNumber,
                        audioUrl: base64Audio,
                    },
                ],
            };
            await sendAudioData(payload);
            if (onCloseAndRefresh) {
                onCloseAndRefresh();
            }
        } catch (error) {
            console.error('Error converting audio blob to base64', error);
        }
    };
    const handleRecordAgain = () => {
        setAudioBlob(null);
        setIsRecording(false);
        if (audioRef.current) {
            handleStartRecording();
        }
    };

    // Format stopwatch time to HH:MM:SS
    const formatStopwatchTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <VerticallyCenteredDiv>
                {audioBlob ? (
                    <div style={{ display: 'float', marginBottom: '2%' }}>
                        <button style={buttonStyle} onClick={handleSaveRecording}>
                            저장
                        </button>
                        <button style={buttonStyle} onClick={handleRecordAgain}>
                            다시 녹음하기
                        </button>
                    </div>
                ) : null}
            </VerticallyCenteredDiv>
            {isRecording && !audioBlob ? (
                <div>
                    <div
                        style={{
                            width: '100vw',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2%',
                        }}
                    >
                        <button
                            style={buttonStyles}
                            onClick={() => {
                                mediaRecorder.current.stop();
                            }}
                        >
                            녹음 완료
                        </button>
                    </div>
                    <div style={recordInfoStyle}>{pageNumber} 페이지 녹음중입니다.</div>
                    <div style={recordInfoStyle}>경과 시간: {formatStopwatchTime(stopwatch)}</div>

                    <HighlightedText bookstorys={bookstory} />
                </div>
            ) : null}
            {!isRecording && countdown > 0 && (
                <>
                    <div style={recordInfoStyle}>
                        ⚠️ {countdown}초 뒤 녹음이 시작됩니다! <br />
                        긴장을 풀고 녹음해보세요
                    </div>
                    <br />
                    <img src="images/calmdown.gif" alt="침착하세여"></img>
                </>
            )}
            {initialAudioUrl && (
                <select onChange={(e) => (audioRef.current.src = e.target.value)}>
                    <option value={initialAudioUrl}>Original Audio</option>
                    {audioBlob && <option value={URL.createObjectURL(audioBlob)}>User Audio</option>}
                </select>
            )}
            <audio ref={audioRef} controls style={{ marginTop: '10px', display: audioBlob ? 'block' : 'none' }} />
            {audioBlob && <h1 style={{ marginTop: '3%' }}>스토리: {bookstory}</h1>}
        </div>
    );
};
export default RecordButton;
