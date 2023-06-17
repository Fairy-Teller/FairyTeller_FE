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
        </div>
    );
};

export default ImageGenerated;
