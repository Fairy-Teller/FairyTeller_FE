import React, { memo } from "react";
import { Link } from "react-router-dom";
import BookSub from "./BookSub";
import LazyImage from "../common/LazyImage";

const Book = ({ book, truncateTitle, linkPath, idProperty, showSub }) => {
  const title = truncateTitle ? truncateTitle(book.title) : book.title;
  const author = truncateTitle ? truncateTitle(book.nickname) : book.nickname;
  const { comments, likeCount, createdDatetime } = book;

  const id = book[idProperty];

  const formattedDate = new Date(createdDatetime).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Link
      to={`/${linkPath}/${id}`}
      key={id}
      style={{ textDecoration: "none" }}>
      <div className='book'>
        <div className='book__cover'>
          <div className='book__page book__page--front'>
            <div className='book__content'>
              <h4 className='book__title'>{title}</h4>
              {/* <div className="book__info">
                <div className="sub-info">
                  <span>{formattedDate}</span>
                  <span className="separator">·</span>
                  <span>{comments ? `${comments.length}개의 댓글` : ""}</span>
                </div>
                <div className="author-likes">
                  <span className="author-name">{author}</span>
                  <div className="likes">
                    <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                    <span className="like-count">
                      {likeCount ? likeCount : ""}
                    </span>
                  </div>
                </div>
              </div> */}
              {showSub && (
                <BookSub
                  book={book}
                  formattedDate={formattedDate}
                  author={author}
                  likeCount={likeCount}
                  comments={comments}
                />
              )}
              <LazyImage
                className='book__thumbnail'
                src={book.thumbnailUrl}
                alt={title + " created by " + author}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Book;
