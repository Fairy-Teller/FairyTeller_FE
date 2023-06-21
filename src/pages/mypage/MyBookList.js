import React, { useState, useEffect } from "react";
import { call } from "../../service/ApiService";
import { Link } from "react-router-dom";

const MyBookList = () => {
  const [books, setBooks] = useState([]);

  const truncateTitle = (title) => {
    if (title.length > 10) {
      return title.substring(0, 10) + "...";
    }
    return title;
  };

  useEffect(() => {
    call("/book/mine", "GET", null).then((response) => {
      setBooks(response.data);
    });
  }, []);

  return (
    <div style={{ marginTop: "8%" }}>
      <h4 style={{ textAlign: "center", marginBottom: "2%", fontSize: "20px" }}>
        내가 만든 책 모음
      </h4>
      <div className="book-container">
        {books.length > 0 ? (
          books.map((book) => (
            <Link
              to={`/myBookList/${book.bookId}`}
              key={book.bookId}
              style={{ textDecoration: "none" }}
            >
              <div className="book">
                <div className="book__cover">
                  <div className="book__page book__page--front">
                    <div className="book__content">
                      <img
                        src={book.thumbnailUrl}
                        alt={book.title}
                        className="book__image"
                      />
                      <h6 className="book__title">{book.title}</h6>
                      <h6 className="book__author">{book.nickname}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookList;
