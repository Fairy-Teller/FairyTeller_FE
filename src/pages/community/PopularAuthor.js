import React from "react";
import '../../css/PopularAuthor.css';

const PopularAuthor = ({ author }) => {
  return (
    <div className="author-container">
      <div className="author-nickname">{author.nickname}</div>
      <div className="author-total-heart">Total Heart {author.totalHeart}</div>
    </div>
  );
};

export default PopularAuthor;
