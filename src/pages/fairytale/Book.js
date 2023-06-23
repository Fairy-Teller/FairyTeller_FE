
import '../../css/Book.css';

import React from 'react';
import PageFlip from 'react-pageflip';


function Book({ bookInfo }) {
    const imageUrls = bookInfo;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '78vh' }}>
            <PageFlip width={515} height={580}>
            {imageUrls.flatMap((url, i) => [
                    <div className="flip-paper-page" key={`left-${i}`}>
                        <div className="half-image-container">
                            <img src={url} alt={`Left Half ${i+1}`} className="left-half-image" />
                        </div>
                    </div>,
                    <div className="flip-paper-page" key={`right-${i}`}>
                        <div className="half-image-container">
                            <img src={url} alt={`Right Half ${i+1}`} className="right-half-image" />
                        </div>
                    </div>
                ])}
            </PageFlip>
        </div>
    );
}
export default Book;