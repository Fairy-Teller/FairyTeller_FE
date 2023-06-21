import React from "react";
import { Link } from "react-router-dom";

const Book = ({ book, truncateTitle }) => {
  return (
    <Link
      to={`/board/${book.boardId}`}
      key={book.boardId}
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
              <h6 className="book__title">{truncateTitle(book.title)}</h6>
              <h6 className="book__author">{truncateTitle(book.nickname)}</h6>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Book;
