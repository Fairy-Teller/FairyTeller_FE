import React from "react";
import { Link } from "react-router-dom";

const Book = ({ book, truncateTitle, linkPath, idProperty }) => {
  const title = truncateTitle ? truncateTitle(book.title) : book.title;
  const author = truncateTitle ? truncateTitle(book.nickname) : book.nickname;

  const id = book[idProperty];

  return (
    <Link
      to={`/${linkPath}/${id}`} // Use linkPath prop to set the URL
      key={id}
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
              <h6 className="book__title">{title}</h6>
              <h6 className="book__author">{author}</h6>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Book;
