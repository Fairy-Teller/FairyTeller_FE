import "../../css/Book.css";
import PageFlip from "react-pageflip";
import LazyBackground from "../../components/common/LazyBackground";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { BookPage } from "../../recoil/FairytaleState";
import { useEffect, useState} from "react";
import base64_Default from "../../script/BASE64_Default";

function Book({ bookInfo }) {
  const imageUrls = bookInfo;
  const bookPage = useSetRecoilState(BookPage);
  const bookpageReset = useResetRecoilState(BookPage);

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    bookpageReset();

    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  let width, height, objectPosition;

  if (windowDimensions.width >= 1920) {
    width = 1280 / 2;
    height = 720;
    objectPosition = 'center';
  } else if (windowDimensions.width >= 1024) {
    width = 1024 / 2;
    height = 576;
    objectPosition = 'center';
  } else if (windowDimensions.width >= 768) {
    // iPad, landscape
    width = 768 / 2;
    height = 432;
    objectPosition = 'center';
  } else if (windowDimensions.width >= 592) {
    // iPad Mini, portrait
    width = 592 / 2;
    height = 333;
    objectPosition = 'center';
  } else if (windowDimensions.width >= 592) {
    // iPad Mini, portrait
    width = 592 / 2;
    height = 333;
    objectPosition = 'center';
  } else {
    // Mobile
    width = windowDimensions.width / 2;
    height = (windowDimensions.width / 2) * (9 / 16);
    objectPosition = 'center';
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <PageFlip width={width} height={height}>
        {imageUrls.flatMap((url, i) => [
          <div
            className='flip-paper-page'
            key={`left-${i}`}
            onClick={() => handlePageClick(i, "prev")}
          >
            <div className='half-image-container'>
              {i === 0 ? (
                // <LazyImage
                //   className='left-half-image'
                //   src={url}
                //   alt={`Left Half ${i}`}
                // />
                <LazyBackground
                  type='book-left'
                  src={url}
                  alt={`Left Half ${i}`}
                  style={{ '--objectPosition': objectPosition }}
                  className='left-half-image'
                  placeholder={base64_Default}
                />
              ) : (
                <img
                  src={url}
                  alt={`Left Half ${i}`}
                  className='left-half-image'
                  style={{ '--objectPosition': objectPosition }}
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
                // <LazyImage
                //   className='right-half-image'
                //   src={url}
                //   alt={`Right Half ${i}`}
                // />
                <LazyBackground
                  type='book-right'
                  src={url}
                  alt={`Right Half ${i}`}
                  style={{ '--objectPosition': objectPosition }}
                  className='right-half-image'
                  placeholder={base64_Default}
                />
              ) : (
                <img
                  src={url}
                  alt={`Right Half ${i}`}
                  className='right-half-image'
                  style={{ '--objectPosition': objectPosition }}
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
