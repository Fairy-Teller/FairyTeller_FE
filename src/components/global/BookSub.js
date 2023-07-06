import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BookSub = ({ book, formattedDate, author, likeCount, comments }) => {
  return (
    <div className="book__info">
      <div className="author-likes">
        <div className="author">
          <span className="author-name">{author}</span>
        </div>
        <div className="likes">
          <FontAwesomeIcon icon={faHeart} className="heart-icon" />
          <span className="like-count">{likeCount ? likeCount : ""}</span>
        </div>
      </div>
    </div>
  );
};


export default BookSub;
