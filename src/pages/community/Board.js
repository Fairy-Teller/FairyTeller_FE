import '../../css/Board.css';
import React, { useState, useEffect, useCallback } from 'react';
import { call } from '../../service/ApiService';
import { Link } from 'react-router-dom';

const Board = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await call(`/board?page=${currentPage}&size=8`, 'GET', null);
      if (response && response.data) {
        setBooks(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const truncateTitle = (title) => {
    if (title.length > 10) {
      return title.substring(0, 10) + '...';
    }
    return title;
  };

  useEffect(() => {
    console.log('Books:', books);
  }, [books]);

  return (
    <div className="board-container">
      <h4 className="board-title">게시판</h4>
      {books.length > 0 ? (
        <div className="books-grid">
          {books.map((book) => (
            <Link to={`/board/${book.boardId}`} key={book.boardId} className="book-link">
              <div className="book-item">
                <img src={book.thumbnailUrl} alt={book.title} className="book-image" />
                <h6 className="book-title">{truncateTitle(book.title)}</h6>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-books">게시물이 없습니다.</p>
      )}
      {totalPages > 0 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`page-button ${currentPage === index ? 'active-page' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;
