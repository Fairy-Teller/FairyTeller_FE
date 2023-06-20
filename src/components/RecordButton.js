import React, { useRef, useState, useEffect } from "react";

const buttonStyle = {
  backgroundColor: "#70a5e3",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
  marginRight: "10px",
};

const recordInfoStyle = {
  marginTop: "10px",
  fontWeight: "bold",
};

const RecordButton = ({
  pageNumber,
  onRecordingComplete,
  initialAudioUrl,
  audioRef,
  onCloseAndRefresh,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const mediaRecorder = useRef(null);

  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
      audioRef.current.play();
      setShouldAutoPlay(false);
    }
  }, [shouldAutoPlay, audioRef]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    const audioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const newAudioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioBlob(newAudioBlob);
      onRecordingComplete(pageNumber, newAudioBlob);
      audioRef.current.src = URL.createObjectURL(newAudioBlob);
      setShouldAutoPlay(true);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const handleSaveRecording = async () => {
    console.log("Saving to the backend server");

    if (onCloseAndRefresh) {
      onCloseAndRefresh();
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {!isRecording && (
          <button style={buttonStyle} onClick={handleStartRecording}>
            녹음시작 {pageNumber}
          </button>
        )}
        {audioBlob && (
          <button style={buttonStyle} onClick={handleSaveRecording}>
            저장
          </button>
        )}
      </div>
      {isRecording && (
        <div>
          <div style={recordInfoStyle}>녹음중입니다... {pageNumber}</div>
          <button style={buttonStyle} onClick={handleStopRecording}>
            녹음종료
          </button>
        </div>
      )}

      {/* Dropdown to select the version of audio if available */}
      {initialAudioUrl && (
        <select onChange={(e) => (audioRef.current.src = e.target.value)}>
          <option value={initialAudioUrl}>Original Audio</option>
          {audioBlob && (
            <option value={URL.createObjectURL(audioBlob)}>User Audio</option>
          )}
        </select>
      )}

      <audio ref={audioRef} controls style={{ marginTop: "10px" }} />
    </div>
  );
};

export default RecordButton;
