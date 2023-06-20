import React, { useState, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLocation } from "react-router-dom";
import RecordButton from "../../components/RecordButton";
import { call } from "../../service/ApiService";
import { sendAudioData } from "../../service/FairytaleService";
import Modal from "react-modal";

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
  src: "/images/prev.png";
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

function FairytaleShow(bookid) {
  const audioRef = useRef(null);
  const [bookInfo, setBookInfo] = useState([]);
  const [audioInfo, setAudioInfo] = useState([]);
  const [userAudioInfo, setUserAudioInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordingInProgress, setRecordingInProgress] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);

  useEffect(() => {
    if (bookid.props !== "") {
      console.log(">>>>", bookid.props);
      showBook(bookid.props);
    }
  }, [bookid]);

  const showBook = async (props) => {
    try {
      const bookinfos = await call("/book/getBookById", "POST", {
        bookId: props,
      });
      const imgearr = [];
      const audioarr = [];
      const userAudioarr = [];
      for (let i = 0; i < bookinfos.pages.length; i++) {
        imgearr[i] = bookinfos.pages[i].finalImageUrl;
        audioarr[i] = bookinfos.pages[i].audioUrl;
        userAudioarr[i] = bookinfos.pages[i].userAudioUrl;
      }
      setBookInfo(imgearr);
      setAudioInfo(audioarr);
      setUserAudioInfo(userAudioarr);
    } catch (error) {
      console.log("Error fetching data:", error);
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

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleRecordingComplete = async (pageNumber, audioBlob) => {
    console.log("Recording completed for page:", pageNumber);
    setRecordedAudioBlob(audioBlob);
    setRecordingInProgress(false);

    if (audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;

      const handleLoadedData = () => {
        audioRef.current.play();
        audioRef.current.removeEventListener("loadeddata", handleLoadedData);
      };

      audioRef.current.addEventListener("loadeddata", handleLoadedData);
    }
  };

  const handleSaveRecording = async () => {
    try {
      const base64Audio = await convertBlobToBase64(recordedAudioBlob);
      const payload = {
        bookId: bookid.props,
        pages: [
          {
            pageNo: currentPage + 1,
            audioUrl: base64Audio,
          },
        ],
      };
      console.log(payload);
      sendAudioData(payload);
      setIsModalOpen(false);

      showBook(bookid.props);
    } catch (error) {
      console.error("Error converting audio blob to base64", error);
    }
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
            <audio
              ref={audioRef}
              src={audioInfo[currentPage]}
              controls
              preload="auto"
            />
            <button onClick={() => setIsModalOpen(true)}>녹음하기</button>
            {userAudioInfo[currentPage] && (
              <select
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.src = e.target.value;
                    audioRef.current.load();
                  }
                }}
              >
                <option value={audioInfo[currentPage]}>Original Audio</option>
                <option value={userAudioInfo[currentPage]}>User Audio</option>
              </select>
            )}
          </AudioContainer>
          <div>
            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
              >
                <RecordButton
                  pageNumber={currentPage + 1}
                  onRecordingComplete={handleRecordingComplete}
                  audioRef={audioRef}
                  onCloseAndRefresh={() => {
                    setIsModalOpen(false);
                    showBook(bookid.props);
                  }}
                />
              </Modal>
            )}
          </div>

          <FairyPage>
            <Arrow
              className="prevButton"
              disabled={currentPage === 0}
              onClick={handlePrevPage}
            >
              <img src="/images/prev.png" />
            </Arrow>
            <img
              src={bookInfo[currentPage]}
              style={{ margin: "0 10px 0 10px" }}
            />
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
