import React, { useState, useEffect, useCallback } from "react";
import { call } from "../../service/ApiService";
import { Link } from "react-router-dom";

import { API_BASE_URL } from "../../api-config";

const Board = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await call(
        `/board/paged?page=${currentPage}&size=8&sort=boardId,desc`,
        "GET",
        null
      );
      if (response && response.content) {
        setBooks(response.content);
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
    <div style={{ marginTop: "8%" }}>
      <h4 style={{ textAlign: "center", marginBottom: "20px" }}>게시판</h4>
      {books.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            maxHeight: "calc(100vh - 200px)",
            gridAutoFlow: "dense",
          }}
        >
          {books.map((book) => (
            <Link
              to={`/board/${book.boardId}`}
              key={book.boardId}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={book.thumbnailUrl}
                  alt={book.title}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                <h6 style={{ fontSize: "18px", marginTop: "10px" }}>
                  {truncateTitle(book.title)}
                </h6>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>게시물이 없습니다.</p>
      )}
      {/* 페이지네이션 컴포넌트 */}
      {totalPages > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              style={{
                margin: "5px",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: currentPage === index ? "lightblue" : "white",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;
