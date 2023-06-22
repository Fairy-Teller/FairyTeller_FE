import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { call } from "../../service/ApiService";
import FairytaleShow from "../fairytale/FairytaleShow";

const MyBookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState([]);

  useEffect(() => {
    call(`/book/${bookId}`, "GET", null).then((response) => {
      console.log(response.data);
      setBook(response.data[0]);
      console.log(book);
    });
  }, []);

  return (
    <div>
      <div>
        <h2 className="title center" style={{ fontSize: "28px" }}>
          {book.title}
        </h2>
      </div>
      <div>
        <FairytaleShow props={bookId} />
      </div>
    </div>
  );
};

export default MyBookDetail;
