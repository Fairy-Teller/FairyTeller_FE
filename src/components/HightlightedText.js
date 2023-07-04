import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const underlineAnimation = keyframes`
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
`;

const Wrapper = styled.h1`
    font-size: 30px;
    font-weight: bold;
    color: black;
    position: relative;
    display: inline-block;
    overflow: hidden;

    &.hide-overflow {
        overflow: hidden;
    }

    &::after {
        /* Rectangle 762 */

        content: '';
        position: absolute;
        bottom: -2px; /* Half the thickness of the underline */
        left: 0;
        width: 0;
        height: 8px; /* Thickness of the underline */
        background-color: rgba(254, 224, 128, 0.53);
        animation: ${underlineAnimation} 5s linear forwards;

        ${(props) =>
            props.delay &&
            css`
                animation-delay: ${props.delay};
            `}
    }

    br {
        animation: ${underlineAnimation} 0.5s linear forwards;
    }
`;

const HighlightedText = (props) => {
    const textRefs = useRef([]);
    const [sentences, setSentences] = useState([]);

    useEffect(() => {
        const { bookstorys } = props;

        const sentences = bookstorys.split(/(?<=[.?!])\s+/);
        setSentences(sentences);
    }, [props.bookstorys]);

    useEffect(() => {
        textRefs.current = new Array(sentences.length).fill(null);
    }, [sentences]);

    useEffect(() => {
        const textElements = textRefs.current;

        textElements.forEach((textElement, index) => {
            if (textElement) {
                setTimeout(() => {
                    textElement.innerHTML = '';
                    textElement.classList.add('hide-overflow');

                    const span = document.createElement('span');
                    span.textContent = sentences[index];

                    const paragraph = document.createElement('p');
                    paragraph.appendChild(span);

                    textElement.appendChild(paragraph);
                }, index * 4000); // Delay based on the index of the sentence
            }
        });
    }, [sentences]);

    const renderHighlightedText = () => {
        return sentences.map((sentence, index) => (
            <Wrapper
                key={index}
                className="highlighted-text hide-overflow"
                ref={(el) => (textRefs.current[index] = el)}
                delay={`${index * 5}s`} // Delay based on the index of the sentence
            >
                {sentence}
            </Wrapper>
        ));
    };

    return (
        <>
            <div style={{ marginTop: '10%', marginLeft: '15%' }}>{renderHighlightedText()}</div>
        </>
    );
};

export default HighlightedText;
