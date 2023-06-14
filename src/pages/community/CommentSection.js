import React, { useState } from "react";

const CommentSection = ({ comments, setComments, onCommentSubmit, onDeleteComment }) => {
  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() !== "") {
      const newComment = {
        content: comment,
      };

      try {
        const response = await onCommentSubmit(newComment);
        const savedComment = response?.data?.[0];
        if (savedComment) {
          setComments((prevComments) => [...prevComments, savedComment]);
          setComment("");
        }
      } catch (error) {
        console.log("Error submitting comment:", error);
      }
    }
  };

  // 수정 버튼 핸들러
  const handleEdit = (comment) => {
    console.log("수정 버튼 클릭:", comment);
  };

  // 삭제 버튼 핸들러
  const handleDelete = (comment) => {
    // 서버에서 해당 댓글 삭제
    onDeleteComment(comment.commentId);
  };

  return (
    <div>
      <h3>댓글</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={comment}
          onChange={handleChange}
          placeholder="댓글을 입력하세요..."
        />
        <button type="submit">등록</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.commentId} style={styles.comment}>
            <strong>{comment.author}</strong>: {comment.content}
            {comment.editable && (
              <div style={styles.buttonContainer}>
                <button onClick={() => handleEdit(comment)} style={styles.button}>수정</button>
                <button onClick={() => handleDelete(comment)} style={styles.button}>삭제</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  comment: {
    marginBottom: "10px",
  },
  buttonContainer: {
    display: "inline-block",
    marginLeft: "10px",
  },
  button: {
    marginRight: "5px",
  },
};

export default CommentSection;
