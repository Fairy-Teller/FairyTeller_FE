import React, { useState } from "react";
import { call } from "../../service/ApiService";

const CommentSection = ({ comments, onCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState(comments);

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
        const response = await onCommentSubmit(newComment); // Call onCommentSubmit prop function
        const savedComment = response.data.data[0];
        setCommentList([...commentList, savedComment]);
        setComment("");
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
        {commentList.map((comment) => (
          <li key={comment.commentId}>
            <strong>{comment.author}</strong>: {comment.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
