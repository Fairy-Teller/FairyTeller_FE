import React, { useRef, useState, useEffect } from 'react';
import { sendAudioData } from '../service/FairytaleService';

const buttonStyle = {
    backgroundColor: '#70a5e3',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
    marginRight: '10px',
};

const recordInfoStyle = {
    marginTop: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
};

const RecordButton = ({
    pageNumber,
    onRecordingComplete,
    initialAudioUrl,
    audioRef,
    onCloseAndRefresh,
    bookid,
    bookstory,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const mediaRecorder = useRef(null);

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
                audioRef.current.src = URL.createObjectURL(newAudioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
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
            }
        };
    }, []);
    console.log(countdown);
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
            console.log('bookid', bookid);
            const payload = {
                bookId: bookid,
                pages: [
                    {
                        pageNo: pageNumber,
                        audioUrl: base64Audio,
                    },
                ],
            };
            console.log(payload);
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {audioBlob ? (
                    <>
                        <button style={buttonStyle} onClick={handleSaveRecording}>
                            저장
                        </button>
                        <button style={buttonStyle} onClick={handleRecordAgain}>
                            다시 녹음하기
                        </button>
                    </>
                ) : null}
            </div>

            {isRecording && !audioBlob ? (
                <div>
                    <button
                        style={buttonStyle}
                        onClick={() => {
                            mediaRecorder.current.stop();
                        }}
                    >
                        녹음 완료
                    </button>
                    <div style={recordInfoStyle}>{pageNumber} 녹음중입니다.</div>
                    <br />
                    <img src="rec.gif" alt="녹화중"></img>
                    <br />
                    <div>스토리: {bookstory}</div>
                </div>
            ) : null}

            {/* Countdown */}
            {!isRecording && countdown > 0 && (
                <>
                    <div style={recordInfoStyle}>
                        ⚠️ 3초뒤 녹음이 시작됩니다! <br />
                        긴장을 풀고 녹음해보세요
                    </div>
                    <br />
                    <img src="calmdown.gif" alt="침착하세여"></img>
                </>
            )}
            {/* Dropdown to select the version of audio if available */}
            {initialAudioUrl && (
                <select onChange={(e) => (audioRef.current.src = e.target.value)}>
                    <option value={initialAudioUrl}>Original Audio</option>
                    {audioBlob && <option value={URL.createObjectURL(audioBlob)}>User Audio</option>}
                </select>
            )}
            <audio ref={audioRef} controls style={{ marginTop: '10px', display: 'none' }} />
        </div>
    );
};

export default RecordButton;
