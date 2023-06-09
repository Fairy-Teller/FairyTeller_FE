import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { call } from "../../service/ApiService";

const BoardDetail = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await call(`/board/${boardId}`, "GET", null);
      setBoard(response.data[0]);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{board.title}</h2>
      <p>Author: {board.author}</p>
      <p>{board.content}</p>
    </div>
  );
};

export default BoardDetail;
