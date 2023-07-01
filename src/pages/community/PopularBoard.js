import React from 'react';
import '../../css/PopularBoard.css';

const PopularBoard = ({ board }) => {
    return (
        <div className="popular-board">
            <img src={board.thumbnailUrl} alt={board.title} className="board-image"/>
            <h3 className="board-title">{board.title}</h3>
            <p className="board-price">{board.price}</p>
            <p className="board-region-name">{board.location}</p>
            <div className="board-counts">
                <span>좋아요 {board.likes}</span> ∙ <span>댓글 {board.chats}</span>
            </div>
        </div>
    );
};

export default PopularBoard;
