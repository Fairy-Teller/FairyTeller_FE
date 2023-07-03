import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/PopularBoard.css';

const PopularBoard = ({ board }) => {
    return (
        <Link to={`/board/${board.boardId}`} style={{ textDecoration: 'none' }}>
            <div className="popular-board">
                <img src={board.thumbnailUrl} alt={board.title} className="board-image"/>
                <h3 className="board-title">{board.title}</h3>
            </div>
        </Link>
    );
};

export default PopularBoard;

