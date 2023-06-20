import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { call } from '../../service/ApiService';

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CardContainer = styled.img`
    width: 1250px;
    height: 720px;
    margin-left: 2%;
    margin-right: 2%;
    src: '/images/prev.png';
`;

const AudioContainer = styled.div`
    bottom: 0;
    text-align: center;
    padding: 20px;
`;

const FairyPage = styled.div`
    display: flex;
`;

const Arrow = styled.button`
    ${(props) =>
        props.disabled &&
        css`
            opacity: 0.5;
            pointer-events: none;
        `}
`;

function FairytaleShow(bookid) {
    const [Audio, setAudio] = useState('');
    const audioRef = useRef(null);
    const [bookInfo, setBookInfo] = useState([]);
    const [audioInfo, setAudioInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (bookid.props !== '') {
            console.log('>>>>', bookid.props);
            showBook(bookid.props);
        }
    }, [bookid]);

    const showBook = async (props) => {
        try {
            const bookinfos = await call('/book/getBookById', 'POST', { bookId: props });
            const imgearr = [];
            const audioarr = [];
            for (let i = 0; i < bookinfos.pages.length; i++) {
                imgearr[i] = bookinfos.pages[i].finalImageUrl;
                audioarr[i] = bookinfos.pages[i].audioUrl;
            }
            setBookInfo(imgearr);
            setAudioInfo(audioarr);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < bookInfo.length - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    console.log(audioInfo[currentPage]);

    return (
        <CenteredContainer>
            {bookInfo.length > 0 && (
                <div>
                    <AudioContainer>
                        <audio ref={audioRef} src={audioInfo[currentPage]} controls></audio>
                    </AudioContainer>
                    <FairyPage>
                        <Arrow className="prevButton" disabled={currentPage === 0} onClick={handlePrevPage}>
                            <img src="/images/prev.png" />
                        </Arrow>
                        <img src={bookInfo[currentPage]} style={{margin:"0 10px 0 10px"}} />
                        <Arrow
                            className="nextButton"
                            disabled={currentPage === bookInfo.length - 1}
                            onClick={handleNextPage}
                        >
                            <img src="/images/next.png" />
                        </Arrow>
                    </FairyPage>
                </div>
            )}
        </CenteredContainer>
    );
}

export default FairytaleShow;
