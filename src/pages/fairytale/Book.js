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
        if (state == 'next' && i != 4) {
            bookPage(i + 1);
        } else if (state == 'prev' && i != 0) {
            bookPage(i - 1);
        } else if (i <= 4 && i != 0) {
            bookPage(4);
        } else if (i == 0 && showBook == 0) {
            bookPage(0);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PageFlip width={515} height={580}>
                {imageUrls.flatMap((url, i) => [
                    <div className="flip-paper-page" key={`left-${i + 1}`} onClick={() => handlePageClick(i, 'prev')}>
                        <div className="half-image-container">
                            <img src={url} alt={`Left Half ${i}`} className="left-half-image" />
                        </div>
                    </div>,
                    <div className="flip-paper-page" key={`right-${i + 1}`} onClick={() => handlePageClick(i, 'next')}>
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
