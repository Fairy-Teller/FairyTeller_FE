import '../../css/Book.css';

import React from 'react';
import PageFlip from 'react-pageflip';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { BookPage } from '../../recoil/FairytaleState';

function Book({ bookInfo }) {
    const imageUrls = bookInfo;
    const bookPage = useSetRecoilState(BookPage);
    const showBook = useRecoilValue(BookPage);

    const handlePageClick = (i, state) => {
        // if (i == imageUrls.length - 1 && state == 'next') {
        //     bookPage(imageUrls.length - 2);
        // } else if (i == imageUrls.length - 1 && state == 'prev') {
        //     bookPage(imageUrls.length - 3);
        // } else if (i == imageUrls.length - 2 && state == 'prev') {
        //     bookPage(imageUrls.length - 4);
        // } else if (i == imageUrls.length - 3 && state == 'prev') {
        //     bookPage(imageUrls.length - 5);
        // } else if (i == imageUrls.length - 4 && state == 'prev') {
        //     bookPage(imageUrls.length - 6);
        // } else if (i == imageUrls.length - 5 && state == 'prev') {
        //     bookPage(-1);
        // } else if (i == imageUrls.length - 6 && state == 'prev') {
        //     bookPage(-1);
        // } else bookPage(i);

        if (state === 'next') {
            if (i < imageUrls.length - 1) {
                bookPage(i);
            } else {
                bookPage(imageUrls.length - 2);
            }
        } else if (state === 'prev') {
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PageFlip width={width} height={height}>
                {imageUrls.flatMap((url, i) => [
                    <div className="flip-paper-page" key={`left-${i}`} onClick={() => handlePageClick(i, 'prev')}>
                        <div className="half-image-container">
                            <img src={url} alt={`Left Half ${i}`} className="left-half-image" />
                        </div>
                    </div>,
                    <div className="flip-paper-page" key={`right-${i}`} onClick={() => handlePageClick(i, 'next')}>
                        <div className="half-image-container">
                            <img src={url} alt={`Right Half ${i}`} className="right-half-image" />
                        </div>
                    </div>,
                ])}
            </PageFlip>
        </div>
    );
}

export default Book;
