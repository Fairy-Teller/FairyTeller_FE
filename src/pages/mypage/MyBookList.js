import React, { useState, useEffect } from "react";
import { call } from "../../service/ApiService";
import {
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";

const MyBookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    call("/book/mine", "GET", null).then((response) => {
      setBooks(response.data);
    });
  }, []);

  return (
    <Container component="main" maxWidth="2xl" style={{ marginTop: "8%" }}>
      <h2>내가 만든 책 모음</h2>
      <ImageList variant="masonry" cols={3} gap={8}>
        {books.map((book, index) => (
          <ImageListItem key={index}>
            <img
              src={book.thumbnailUrl}
              alt={book.title}
              loading="lazy"
              className="MuiImageListItem-img"
              style={{ objectFit: "cover" }}
            />
            <ImageListItemBar title={book.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
};

export default MyBookList;
