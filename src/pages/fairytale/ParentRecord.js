import React, { useState } from "react";
import { sendAudioData } from "../../service/FairytaleService";
import RecordButton from "../../components/RecordButton";

const ParentRecord = () => {
  const [recordings, setRecordings] = useState([]);

  const handleRecordingComplete = (pageNumber, audioBlob) => {
    setRecordings((prevRecordings) => [
      ...prevRecordings,
      { no: pageNumber, audio: audioBlob },
    ]);
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
      sendAudioData(payload);
    } catch (error) {
      console.error("Error converting audio blob to base64", error);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((pageNumber) => (
        <RecordButton
          key={pageNumber}
          pageNumber={pageNumber}
          onRecordingComplete={handleRecordingComplete}
        />
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
