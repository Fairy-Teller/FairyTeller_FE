import React, { useState, useEffect } from "react";
import { call } from "../../service/ApiService";
import { Link } from "react-router-dom";

const BoardBookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await call("/board", "GET", null);
      setBooks(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const truncateTitle = (title) => {
    if (title.length > 10) {
      return title.substring(0, 10) + "...";
    }
    return title;
  };

  return (
    <div style={{ marginTop: "8%" }}>
      <h4 style={{ textAlign: "center", marginBottom: "20px" }}>게시판</h4>
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
        {books.map((book, index) => (
          <Link to={`/board/${book.boardId}`} key={book.boardId} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                order: index + 1,
              }}
            >
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
              <h6 style={{ fontSize: "18px", marginTop: "10px" }}>{truncateTitle(book.title)}</h6>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BoardBookList;
