import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { call } from "../../service/ApiService";
import CommentSection from "./CommentSection";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import '../../css/BoardDetail.css';
import FairytaleShow from '../fairytale/FairytaleShow';


const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await call(`/board/${boardId}`, "GET", null);
      const boardData = response.data[0];
      setBoard(boardData);
      setComments(boardData.comments);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleCommentSubmit = async (comment) => {
    try {
      await call(`/board/${boardId}/comment`, "POST", comment);
      fetchDataComments(currentPage);
    } catch (error) {
      console.log("Error submitting comment:", error);
    }
  };


  const handleDeleteComment = async (comment) => {};


//   const handleDeleteComment = async (commentId) => {
//     try {
//       await call(`/board/${boardId}/comment/${commentId}`, "DELETE", null);
//       fetchDataComments(currentPage);
//     } catch (error) {
//       console.log("Error deleting comment:", error);
//     }
//   };


  const handleLike = async () => {
    try {
      await call(`/board/${boardId}/like`, "POST", null);
      setIsLiked((prevIsLiked) => !prevIsLiked);
    } catch (error) {
      console.log("Error liking the board:", error);
    }
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDataComments(page);
  };

  const fetchDataComments = async (page) => {
    try {
      const pageSize = 10;
      const response = await call(`/board/${boardId}/comment?page=${page}&size=${pageSize}`, "GET", null);
      setComments(response.data);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };


  const handleDeleteBoard = async () => {
    try {
      await call(`/board/${boardId}`, "DELETE", null);
      navigate("/board"); // 삭제 후 게시판 목록 페이지로 이동
    } catch (error) {
      console.log("Error deleting board:", error);
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bar">FairyTeller</div>
      <div>
        <div className="deleteButtonContainer">
          {board.editable && (
            <button className="deleteButton" onClick={handleDeleteBoard}>
              Delete
            </button>
          )}
        </div>
        <div>
        <h2 className="title center" style={{ fontSize: '25px' }}>{board.title}</h2>
          <div className="author center" style={{ fontSize: '20px'}}>Author: {board.nickname}</div>
          <div>
            <FairytaleShow props={board.bookId} />
          </div>
          <div className="action-section">
          <div className="like-button">
            <button class="like-btn"
              onClick={handleLike}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              {isLiked ? (
                <FontAwesomeIcon icon={solidHeart}  class="fa-heart" style={{ color: "red" }} />
              ) : (
                <FontAwesomeIcon icon={regularHeart}  class="fa-heart" style={{ color: "red" }} />
              )}
              <span style={{ marginLeft: "5px"}}>
                {isLiked ? "동화가 마음에 들었어요!" : "동화가 마음에 드시나요?"}
              </span>
            </button>
          </div>
          <div class="comment-section">
                      <CommentSection
            comments={comments}
            setComments={setComments}
            onCommentSubmit={handleCommentSubmit}
            onDeleteComment={handleDeleteComment}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            boardId={boardId}
            isBoardOwner={board.editable}
          />
          </div>
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button 
                key={index}
                className={currentPage === index ? "activePageButton" : "pageButton"}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
};

  export default BoardDetail;