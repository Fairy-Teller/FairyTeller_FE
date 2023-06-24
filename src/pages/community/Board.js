import "../../css/Board.css";
import React, { useState, useEffect, useCallback } from "react";
import { call } from "../../service/ApiService";

import Container from "../../components/global/Container";
import Header from "../../components/global/Header";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";
import BookContainer from "../../components/global/BookContainer";
import Book from "../../components/global/Book";

const Board = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await call(
        `/board?page=${currentPage}&size=8`,
        "GET",
        null
      );
      if (response && response.data) {
        setBooks(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const truncateTitle = (title) => {
    if (title.length > 10) {
      return title.substring(0, 10) + "...";
    }
    return title;
  };

  useEffect(() => {
    console.log("Books:", books);
  }, [books]);

  return (
    <Container>
      <Header mode={"default"} />
      <ContentCover>
      <div id="board-title"
        style={{
          margin: "2rem auto",
          fontWeight: 400,
          fontSize: "2.8rem",
          textAlign: "left"
        }}
        >우리들의 도서관</div>
        <InnerCover>
          <BookContainer>
            {books.length > 0 ? (
              books.map((book) => (
                <Book
                  book={book}
                  linkPath="board"
                  idProperty="boardId" // Use the 'boardId' property
                  truncateTitle={truncateTitle}
                  key={book.boardId}
                />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>게시물이 없습니다.</p>
            )}
          </BookContainer>
          {/* 페이지네이션 컴포넌트 */}
          {totalPages > 0 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className="board-page-button"
                  style={{
                    backgroundColor:
                      currentPage === index ? "#99F0CC" : "white",
                  }}
                >
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