import React from "react";

const PopularAuthor = ({ author }) => {
  return (
    <div className="author-container">
      <div className="author-nickname">{author.nickname}</div>
      <div className="author-total-heart">{author.totalHeart}</div>
    </div>
  );
};

export default PopularAuthor;
