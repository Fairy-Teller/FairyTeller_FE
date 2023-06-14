import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { call } from '../../service/ApiService';

function FairytaleShow() {
  const [isContentUp, setIsContentUp] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [Audio, setAudio] = useState('');
  const audioRef = useRef(null);

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
      transform: translateY(1%);
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
            ${contentAnimation} 3.0s ease forwards;
          `
        : 'none'};
  `;

  const AudioContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    padding: 20px;
  `;

  useEffect(() => {
    showBook();

    const handleKeyPress = (event) => {
      if (event.code === 'Space' && !isContentUp) {
        setIsContentUp(true);
        audioRef.current.play();
      } else if (event.code === 'Space' && isContentUp) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isContentUp]);

  const showBook = async () => {
    try {
      const image = await call('/book/getBookById', 'POST', { bookId: propValue });
      setThumbnailUrl('https://s3.ap-northeast-2.amazonaws.com/' + image.thumbnailUrl);
      setAudio('https://s3.ap-northeast-2.amazonaws.com/' + image.audioUrl);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  console.log(propValue); // Use propValue to fetch fairy tale information

  return (
    <CardContainer>
      <BackgroundImage />
      <Content className="phoneImage" src={thumbnailUrl} isContentUp={isContentUp} />
      <AudioContainer>
        <audio ref={audioRef} controls>
          <source src={Audio} type="audio/mpeg" />
        </audio>
      </AudioContainer>
    </CardContainer>
  );
}

export default FairytaleShow;
