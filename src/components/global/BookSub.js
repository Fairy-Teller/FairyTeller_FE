import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BookSub = ({ book, formattedDate, author, likeCount, comments }) => {
  return (
    <div className="book__info">
      <div className="sub-info">
        <span>{formattedDate}</span>
        <span className="separator">·</span>
        <span>{comments ? `${comments.length}개의 댓글` : ""}</span>
      </div>
      <div className="author-likes">
        <span className="author-name">{author}</span>
        <div className="likes">
          <FontAwesomeIcon icon={faHeart} className="heart-icon" />
          <span className="like-count">{likeCount ? likeCount : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default BookSub;
