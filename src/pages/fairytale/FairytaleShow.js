import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { call } from '../../service/ApiService';

function FairytaleShow() {
    const [isContentUp, setIsContentUp] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    const location = useLocation();
    const propValue = location.state;
    const CardContainer = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        position: relative;
    `;

    const BackgroundImage = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${thumbnailUrl});
        background-size: cover;
        background-position: center;
        filter: blur(8px);
    `;

    const contentAnimation = keyframes`
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

    const Content = styled.img`
        max-width: 100%;
        max-height: 100%;
        position: relative;
        z-index: 1;
        border: 2px solid black;
        opacity: ${(props) => (props.isContentUp ? 1 : 0)};
        transform: translateY(${(props) => (props.isContentUp ? '0' : '100%')});
        animation: ${(props) =>
            props.isContentUp
                ? css`
                      ${contentAnimation} 0.5s ease forwards;
                  `
                : 'none'};
    `;

    useEffect(() => {
        gotoBoard();
        const handleKeyPress = (event) => {
            if (event.code === 'Space' && !isContentUp) {
                setIsContentUp(true);
            } else if (event.code === 'Space' && isContentUp) {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isContentUp]);

    const gotoBoard = async () => {
        try {
            const image = await call('/book/getBookById', 'POST', { bookId: propValue });
            setThumbnailUrl('https://s3.ap-northeast-2.amazonaws.com/' + image.thumbnailUrl);
            console.log(thumbnailUrl);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    console.log(propValue); // 이걸로 동화정보 가져오기

    return (
        <CardContainer>
            <BackgroundImage />
            <Content className="phoneImage" src="images/baebang.jpg" isContentUp={isContentUp} />
        </CardContainer>
    );
}

export default FairytaleShow;
