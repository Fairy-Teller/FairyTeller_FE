import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const BookSub = ({ book, formattedDate, author, likeCount, comments, liked: initialLikeState }) => {
  const [liked, setLiked] = useState(initialLikeState);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="book__info">
      <div className="author-likes">
        <div className="author">
          <span className="author-name">{author}</span>
        </div>
        <div className="likes" onClick={handleLike}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className="heart-icon" />
          <span className="like-count">{likeCount ? likeCount : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default BookSub;
