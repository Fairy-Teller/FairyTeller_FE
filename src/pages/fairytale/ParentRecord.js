import React, { useState, useRef } from "react";
import { sendAudioData } from "../../service/FairytaleService";

const ParentRecord = () => {
  const [isRecording, setIsRecording] = useState({});
  const [recordings, setRecordings] = useState([]);
  const mediaRecorder = useRef({});

  const handleStartRecording = async (pageNumber) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current[pageNumber] = new MediaRecorder(stream);

    const audioChunks = [];
    mediaRecorder.current[pageNumber].ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.current[pageNumber].onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setRecordings((prevRecordings) => [
        ...prevRecordings,
        { no: pageNumber, audio: audioBlob },
      ]);
    };

    mediaRecorder.current[pageNumber].start();
    setIsRecording((prevState) => ({ ...prevState, [pageNumber]: true }));
  };

  const handleStopRecording = (pageNumber) => {
    mediaRecorder.current[pageNumber].stop();
    setIsRecording((prevState) => ({ ...prevState, [pageNumber]: false }));
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendRecording = async (recording) => {
    try {
      const base64Audio = await convertBlobToBase64(recording.audio);
      const payload = {
        bookId: 34,
        pages: [
          {
            pageNo: recording.no,
            audioUrl: base64Audio,
          },
        ],
      };
      sendAudioData(payload); // Make sure sendAudioData sends a POST request with Content-Type set to 'application/json'
    } catch (error) {
      console.error("Error converting audio blob to base64", error);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((pageNumber) => (
        <div key={pageNumber}>
          {!isRecording[pageNumber] && (
            <button onClick={() => handleStartRecording(pageNumber)}>
              녹음시작 {pageNumber}
            </button>
          )}
          {isRecording[pageNumber] && (
            <div>
              <div>녹음중입니다... {pageNumber}</div>
              <button onClick={() => handleStopRecording(pageNumber)}>
                녹음종료
              </button>
            </div>
          )}
        </div>
      ))}

      {recordings.map((recording, index) => (
        <div key={index}>
          <p>Recording {recording.no}</p>
          <audio src={URL.createObjectURL(recording.audio)} controls />
          <button onClick={() => handleSendRecording(recording)}>
            Send Recording {recording.no} to Backend
          </button>
        </div>
      ))}
    </div>
  );
};

export default ParentRecord;
