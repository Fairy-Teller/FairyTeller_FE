import React, { useState, useEffect } from "react";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import { Link } from "react-router-dom";
import FairytaleShow from "./FairytaleShow";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Container from "../../components/global/Container";
import Header from "../../components/global/Header";
import ContentCover from "../../components/global/ContentCover";
import ProgressBar from "../../components/global/ProgressBar";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

const ButtonFrame = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 15%;
  height: 104px;
  background-color: #99f0cc;
  font-size: 150%;
  border-radius: 51.5px;
  margin-right: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

const BookCover = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100vw;
  height: 100vh;
  background-size: cover;
`;

function FairytaleExport() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [BookId, setBookId] = useState("");
  const [Title, setTitle] = useState("");
  const [Image, setImage] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData = async () => {
  //     try {
  //         const response = await call('/book/my-newest', 'GET', null);
  //         setThumbnailUrl('https://s3.ap-northeast-2.amazonaws.com/' + response.thumbnailUrl);
  //         setBookId(response.bookId);
  //         console.log(BookId);
  //         // const boardresponse = await call('/board/save', 'POST', { bookId: '11' });
  //         // console.log(boardresponse);
  //     } catch (error) {
  //         console.log('Error fetching data:', error);
  //     }
  // };

  const fetchData = async () => {
    try {
      const data = await call("/book/my-newest", "GET", null);
      await setBookId(data.bookId);
      setTitle(data.title);

      const imgearr = [];
      for (let i = 0; i < data.pages.length; i++) {
        imgearr[i] = data.pages[i].finalImageUrl;
      }
      setImage(imgearr);

      // await call('/book/create/story', 'POST', {
      //     fullStory: 'ha ha ha ha ha ha ha',
      // });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const gotoBoard = async () => {
    try {
      await call("/board/save", "POST", { bookId: BookId });
      alert("등록되었습니다");
      window.location.href = "/board";
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const exportPDF = async () => {
    for (var i = 0; i < Image.length; i++) {
      (function (index) {
        var link = document.createElement("a");
        link.href = Image[index];
        link.download = Title + ".png";
        link.style.display = "none";
        document.body.appendChild(link);

        setTimeout(function () {
          link.click();
          document.body.removeChild(link);
        }, index * 1000);
      })(i);
    }
  };

  return (
    <Container>
      <Header mode={"default"} />
      <ContentCover>
        <ProgressBar step={4} />
        <ContentTitle>{Title}</ContentTitle>
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
    </Container>
  );
}

export default FairytaleExport;
