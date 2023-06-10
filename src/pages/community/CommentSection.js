import React, { useState } from "react";

const CommentSection = ({ comments, setComments, onCommentSubmit }) => {
  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
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
          <li key={comment.commentId}>
            <strong>{comment.author}</strong>: {comment.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
