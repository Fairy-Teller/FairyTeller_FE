import React, { memo } from "react";
import { Link } from "react-router-dom";
import BookSub from "./BookSub";
import LazyImage from "../common/LazyImage";
import '../../css/BoardBook.css';

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
      <div className='container'>
        <div className='book'>
          <div className='book__cover'>
            <div className='book__page book__page--front'>
              <div className='book__content'>
              <div className='book__title__container'>
                <h4 className='book__title'>{title}</h4>
                </div>
                {showSub && (
                  <div className='book__sub__container'>
                  <BookSub
                    className='book__sub'
                    book={book}
                    formattedDate={formattedDate}
                    author={author}
                    likeCount={likeCount}
                    comments={comments}
                  />
                  </div>
                )}
                <div className='book__thumbnail__container'>
                  <LazyImage
                   className='book__thumbnail'
                   src={book.thumbnailUrl}
                   alt={title + " created by " + author}
                 />
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Book;
