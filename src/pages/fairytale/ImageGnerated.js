import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TextArea = styled.textarea`
    width: calc(100% - 0.25rem);
    height: 10rem;
    background-color: lightgray;
`;

const ImageGenerated = () => {
    return (
        <div className="story story-generated">
            <h1> hello i'm image generated</h1>
        </div>
    );
};

export default ImageGenerated;
