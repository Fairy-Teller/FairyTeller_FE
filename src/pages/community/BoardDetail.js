import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { call } from "../../service/ApiService";
import CommentSection from "./CommentSection";

const BoardDetail = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await call(`/board/${boardId}`, "GET", null);
      setBoard(response.data[0]);
      setComments(response.data[0].comments);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  
  const handleCommentSubmit = async (comment) => {
    try {
      const response = await call(`/board/${boardId}/comment`, "POST", comment);
      const savedComment = response?.data?.[0]; // 유효성을 확인하고 필요한 값을 추출
      if (savedComment) {
        setComments((prevComments) => [...prevComments, savedComment]);
      }
    } catch (error) {
      console.log("Error submitting comment:", error);
    }
  };
  
  
  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{board.title}</h2>
      <div style={styles.center}>
        <p style={styles.author}>Author: {board.author}</p>
        <div style={styles.thumbnailContainer}>
          <img src={board.thumbnailUrl} alt="Thumbnail" style={styles.thumbnail} />
        </div>
        <p style={styles.content}>{board.content}</p>
        <CommentSection
          comments={comments}
          setComments={setComments}
          onCommentSubmit={handleCommentSubmit}
        />
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
};

export default BoardDetail;
