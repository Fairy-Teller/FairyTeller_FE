import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { call } from "../../service/ApiService";
import CommentSection from "./CommentSection";
import MusicBar from "./MusicBar";

const BoardDetail = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      fetchDataComments(currentPage); // 새로운 댓글이 추가된 후 전체 댓글 목록을 다시 가져옴
    } catch (error) {
      console.log("Error submitting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await call(`/board/${boardId}/comment/${commentId}`, "DELETE", null);
      fetchDataComments(currentPage);
    } catch (error) {
      console.log("Error deleting comment:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDataComments(page);
  };

  const fetchDataComments = async (page) => {
    try {
      const pageSize = 10;
      const response = await call(`/board/${boardId}/comments?page=${page}&size=${pageSize}`, "GET", null);
      setComments(response.data);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };
  
  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{board.title}</h2>
      <div style={styles.center}>
        <p style={styles.author}>Author: {board.nickname}</p>
        <div style={styles.thumbnailContainer}>
          <img src={board.thumbnailUrl} alt="Thumbnail" style={styles.thumbnail} />
        </div>
        <p style={styles.content}>{board.content}</p>
        {board.audioUrl !== null && <MusicBar audioUrl={board.audioUrl} />}
        <CommentSection
          comments={comments}
          setComments={setComments}
          onCommentSubmit={handleCommentSubmit}
          onDeleteComment={handleDeleteComment}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              style={currentPage === index ? styles.activePageButton : styles.pageButton}
              onClick={() => handlePageChange(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  author: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "5px",
  },
  thumbnailContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  thumbnail: {
    maxWidth: "100%",
    maxHeight: "400px",
  },
  content: {
    fontSize: "18px",
    lineHeight: "1.4",
  },
  pagination: {
    marginTop: "20px",
  },
  pageButton: {
    marginLeft: "5px",
    padding: "5px 10px",
    border: "none",
    background: "#eee",
    cursor: "pointer",
  },
  activePageButton: {
    marginLeft: "5px",
    padding: "5px 10px",
    border: "none",
    background: "blue",
    color: "#fff",
    cursor: "pointer",
  },
};

export default BoardDetail;

