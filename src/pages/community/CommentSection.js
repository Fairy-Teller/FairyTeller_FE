import React, { useState } from "react";
import { call } from "../../service/ApiService";
import '../../css/CommentSection.css';
const CommentSection = ({ comments, setComments, onCommentSubmit, onDeleteComment, boardId, isBoardOwner }) => {
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");
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
    setComment(""); // 댓글 입력칸 비우기
  };
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditedComment(comment.content);
  };
  const handleUpdate = async (comment) => {
    try {
      await call(`/board/${boardId}/comment/${comment.commentId}`, "PUT", { content: editedComment });
      const updatedComments = comments.map((c) =>
        c.commentId === comment.commentId ? { ...c, content: editedComment } : c
      );
      setComments(updatedComments);
      setEditingComment(null);
      setEditedComment("");
    } catch (error) {
      console.log("Error updating comment:", error);
    }
  };
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedComment("");
  };
  const handleDelete = (comment) => {
    onDeleteComment(comment.commentId);
  };
  return (
    <div className="commentSection">
      <h3>댓글</h3>
      <form className="commentForm" onSubmit={handleSubmit}>
        
        <input
          className="commentInput"
          type="text"
          style={{ flex: 1, width: "100%", height: "30px", fontSize: "15px" }}
          value={comment}
          onChange={handleChange}
          placeholder="댓글을 입력하세요..."
        />
        <button className="commentSubmitButton" type="submit" style={{ marginLeft: "10px" }}>등록</button>
      </form>
      <ul className="commentList">
        {comments.map((comment) => (
          <li key={comment.commentId} className={`commentItem ${editingComment === comment ? "editing" : ""}`}>
            {editingComment === comment ? (
              <>
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                />
                <div className="buttonContainer">
                  <button onClick={() => handleUpdate(comment)} className="smallButton">저장</button>
                  <button onClick={() => handleCancelEdit()} className="smallButton">취소</button>
                </div>
              </>
            ) : (
              <>
                <strong>{comment.nickname}</strong>: {comment.content}
                {(comment.editable || isBoardOwner) && (
                  <div className="buttonContainer">
                    {comment.editable && (
                      <button onClick={() => handleEdit(comment)} className="smallButton">수정</button>
                    )}
                    <button onClick={() => handleDelete(comment)} className="smallButton">삭제</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default CommentSection;