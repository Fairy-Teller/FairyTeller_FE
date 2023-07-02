import "../../css/Board.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { call } from "../../service/ApiService";
import BoardSearch from "./BoardSearch";
import Container from "../../components/global/Container";
import Header from "../../components/global/Header";
import ContentCover from "../../components/global/ContentCover";
import InnerCover from "../../components/global/InnerCover";
import BookContainer from "../../components/global/BookContainer";
import Book from "../../components/global/Book";
import PopularBoard from "./PopularBoard";
import SortBy from "./SortBy";

const Board = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("");
  const [popularBoards, setPopularBoards] = useState([]);
  const [sortType, setSortType] = useState("");

  const handleBoardTitleClick = () => {
    setKeyword("");
    setSearchType("");
    setCurrentPage(0);
    navigate("/board");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = "/board";
        let params = `?page=${currentPage}&size=8`;
        // Add sortType to params
        if (sortType) {
          params += `&sort=${sortType}`;
        }
        if (searchType === "author") {
          params += `&author=${encodeURIComponent(keyword)}`;
        } else if (searchType === "title") {
          params += `&title=${encodeURIComponent(keyword)}`;
        } else {
          params += `&keyword=${encodeURIComponent(keyword)}`;
        }
        const response = await call(endpoint + params, "GET", null);
        // console.log("Board API Response:", response); // API 응답 확인
        if (response && response.data) {
          // console.log("Board Data:", response.data); // 데이터 확인
          setBooks(response.data);
          setTotalPages(response.totalPages);
          setPopularBoards(response.popularBoards);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentPage, keyword, searchType, sortType]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async (keyword, searchType) => {
    try {
      setKeyword(keyword);
      setSearchType(searchType);
      setCurrentPage(0); // 검색어가 변경되면 페이지 번호를 0으로 초기화
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const truncateTitle = (title) => {
    if (title?.length && title.length > 15) {
      return title.substring(0, 10) + "...";
    }
    return title;
  };

  const handleSort = (selectedSort) => {
    setSortType(selectedSort);
    setCurrentPage(0);
    console.log("Selected sort:", selectedSort);
  };

  return (
    <Container>
      <Header mode={"default"} />
      <ContentCover>
        <div
          id='board-title'
          style={{
            margin: "2rem auto",
            fontWeight: 400,
            fontSize: "2.8rem",
            textAlign: "left",
            cursor: "pointer",
            transition: "font-size 0.3s ease",
          }}
          onClick={handleBoardTitleClick}
          onMouseEnter={(e) => (e.target.style.fontSize = "2.9rem")}
          onMouseLeave={(e) => (e.target.style.fontSize = "2.8rem")}>
          우리들의 도서관
        </div>
        <BoardSearch handleSearch={handleSearch} />

        <div className='popularBoards-container'>
          <div>인기 게시글</div>
          <div className='boards-row'>
            {popularBoards &&
              popularBoards.slice(0, 3).map((board) => (
                <PopularBoard
                  board={board}
                  key={board.boardId}
                />
              ))}
          </div>
        </div>

        {/* BoardSort 컴포넌트 추가 */}
        <SortBy handleSort={handleSort} />
        <InnerCover>
          <BookContainer>
            {books &&
              books.length > 0 &&
              books.map((book) => (
                <Book
                  book={book}
                  linkPath='board'
                  idProperty='boardId'
                  truncateTitle={truncateTitle}
                  key={book.boardId}
                  showSub={true}
                />
              ))}
          </BookContainer>
          {/* 페이지네이션 컴포넌트 */}
          {totalPages > 0 && (
            <div className='pagination'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className='board-page-button'
                  style={{
                    backgroundColor: currentPage === index ? "#99F0CC" : "white",
                  }}>
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </InnerCover>
      </ContentCover>
    </Container>
  );
};
export default Board;
