import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const underlineAnimation = keyframes`
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
`;

const HighlightedTextWrapper = styled.h1`
    font-size: 48px;
    font-weight: bold;
    color: black;
    position: relative;
    display: inline-block;
    overflow: hidden;

    &.hide-overflow {
        overflow: hidden;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -2px; /* 형광펜의 두께의 절반 */
        left: 0;
        width: 0;
        height: 8px; /* 형광펜의 두께 */
        background-color: yellow;
        animation: ${underlineAnimation} 5s linear;
        animation-fill-mode: forwards;
    }
`;

const HighlightedText = (props) => {
    const textRef = useRef(null);

    useEffect(() => {
        const textElement = textRef.current;
        const textContent = textElement.textContent;

        textElement.textContent = '';
        textElement.classList.add('hide-overflow');

        for (let i = 0; i < textContent.length; i++) {
            const span = document.createElement('span');
            span.textContent = textContent[i];
            span.style.animationDelay = `${i * 0.1}s`;
            textElement.appendChild(span);
        }
    }, []);

    return (
        <HighlightedTextWrapper className="highlighted-text" ref={textRef}>
            {props.bookstorys}
        </HighlightedTextWrapper>
    );
};

export default HighlightedText;
