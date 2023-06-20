import '../../css/Board.css';
import '../../css/HeaderExample.css';
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
    <div>
      <div className="board-bar">
      <Link to="/home" className="title-link">
    <div className="title">FairyTeller</div>
  </Link>
      <div className="username">윤땡땡</div>
      </div>
      <div style={{ marginTop: '1%' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '2%', fontSize: '20px' }}>우리들의 도서관</h4>
        <div className="book-container">
          {books.length > 0 ? (
            books.map((book) => (
              <Link to={`/board/${book.boardId}`} key={book.boardId} style={{ textDecoration: 'none' }}>
                <div className="book">
                  <div className="book__cover">
                    <div className="book__page book__page--front">
                      <div className="book__content">
                        <img src={book.thumbnailUrl} alt={book.title} className="book__image" />
                        <h6 className="book__title">{truncateTitle(book.title)}</h6>
                        <h6 className="book__author">{truncateTitle(book.nickname)}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>게시물이 없습니다.</p>
          )}
        </div>
        {/* 페이지네이션 컴포넌트 */}
        {totalPages > 0 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className="board-page-button"
                style={{ backgroundColor: currentPage === index ? '#99F0CC' : 'white' }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  
            }
  
export default Board;