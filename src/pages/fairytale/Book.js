
import '../../css/Book.css';

import React from 'react';
import PageFlip from 'react-pageflip';


function Book() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <PageFlip width={515} height={580}>
                {/* 첫 번째 페이지 */}
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_1.png"} alt="Left Half" className="left-half-image" />
                    </div>
                </div>
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_1.png"} alt="Right Half" className="right-half-image" />
                    </div>
                </div>

                {/* 두 번째 페이지 */}
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_2.png"} alt="Left Half" className="left-half-image" />
                    </div>
                </div>
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_2.png"} alt="Right Half" className="right-half-image" />
                    </div>
                </div>

                {/* 세 번째 페이지 */}
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_3.png"} alt="Left Half" className="left-half-image" />
                    </div>
                </div>
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_3.png"} alt="Right Half" className="right-half-image" />
                    </div>
                </div>

                {/* 네 번째 페이지 */}
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_4.png"} alt="Left Half" className="left-half-image" />
                    </div>
                </div>
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_4.png"} alt="Right Half" className="right-half-image" />
                    </div>
                </div>
                {/* 다섯 번째 페이지 */}
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_5.png"} alt="Left Half" className="left-half-image" />
                    </div>
                </div>
                <div className="flip-paper-page">
                    <div className="half-image-container">
                        <img src={"https://s3.ap-northeast-2.amazonaws.com/fairyteller-dev/1103_5.png"} alt="Right Half" className="right-half-image" />
                    </div>
                </div>
            </PageFlip>
        </div>
    );
}
export default Book;