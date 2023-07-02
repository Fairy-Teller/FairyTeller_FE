import "../../css/Book.css";

import PageFlip from "react-pageflip";
import LazyImage from "../../components/common/LazyImage";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { BookPage } from "../../recoil/FairytaleState";
import { useEffect } from "react";

function Book({ bookInfo }) {
  const imageUrls = bookInfo;
  const bookPage = useSetRecoilState(BookPage);
  const bookpageReset = useResetRecoilState(BookPage);
  useEffect(() => {
    bookpageReset();
  }, []);

  const handlePageClick = (i, state) => {
    if (state === "next") {
      if (i < imageUrls.length - 1) {
        bookPage(i);
      } else {
        bookPage(imageUrls.length - 2);
      }
    } else if (state === "prev") {
      if (i >= 2) {
        bookPage(i - 2);
      } else {
        bookPage(-1);
      }
    }
  };

  const windowW = window.innerWidth;
  let width, height;
  if (windowW >= 1920) {
    width = 1280 / 2;
    height = 720;
  } else {
    width = 1024 / 2;
    height = 576;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <PageFlip
        width={width}
        height={height}>
        {imageUrls.flatMap((url, i) => [
          <div
            className='flip-paper-page'
            key={`left-${i}`}
            onClick={() => handlePageClick(i, "prev")}>
            <div className='half-image-container'>
              {i === 0 ? (
                <LazyImage
                  className='left-half-image'
                  src={url}
                  alt={`Left Half ${i}`}
                />
              ) : (
                <img
                  src={url}
                  alt={`Left Half ${i}`}
                  className='left-half-image'
                />
              )}
            </div>
          </div>,
          <div
            className='flip-paper-page'
            key={`right-${i}`}
            onClick={() => handlePageClick(i, "next")}>
            <div className='half-image-container'>
              {i === 0 ? (
                <LazyImage
                  className='right-half-image'
                  src={url}
                  alt={`Right Half ${i}`}
                />
              ) : (
                <img
                  src={url}
                  alt={`Right Half ${i}`}
                  className='right-half-image'
                />
              )}
            </div>
          </div>,
        ])}
      </PageFlip>
    </div>
  );
}

export default Book;
