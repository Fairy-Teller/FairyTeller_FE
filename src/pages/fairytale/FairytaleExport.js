import React, { useState, useEffect } from "react";
import Container from "../../components/global/Container";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";

const FairytaleTitle = styled.div`
  font-weight: 400;
  font-size: 96px;
  line-height: 162px;
  text-align: left;
  color: #ffffff;
  padding-left: 5%;
`;

const ButtonFrame = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
  margin-bottom: 10px;
`;

const Button = styled(Link)`
  width: 15%;
  height: 104px;
  background-color: white;
  font-size: 150%;
  border-radius: 51.5px;
  margin-right: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

const BookCover = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-color: black;
`;

function FairytaleExport() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [BookId, setBookId] = useState("");
  const [Title, setTitle] = useState("");

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
      setThumbnailUrl("https://s3.ap-northeast-2.amazonaws.com/" + data.thumbnailUrl);
      setBookId(data.bookId);
      setTitle(data.title);
      console.log(data);
      console.log(thumbnailUrl);
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
    const data = { thumbnailUrl };
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  return (
    <Container className=''>
      <BookCover style={{ backgroundImage: `url(${thumbnailUrl})` }}>
        <div style={{ position: "absolute", bottom: "0px", width: "100%" }}>
          <FairytaleTitle>{Title}</FairytaleTitle>
          <ButtonFrame>
            <Button onClick={gotoBoard}>게시판 전시하기</Button>
            <Button onClick={exportPDF}>PDF로 내보내기</Button>

            <Button
              to='/f-show'
              state={BookId}>
              동화보기
            </Button>
          </ButtonFrame>
        </div>
      </BookCover>
    </Container>
  );
}

export default FairytaleExport;
