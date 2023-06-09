import React from 'react';
import Container from '../../components/layout/Container';
import styled from 'styled-components';


const BookCover = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: url(https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg);
`;

function FairytaleShow() {
    return (
        <div>
            <Container className={''}>
                <BookCover>

                </BookCover>
            </Container>
        </div>
    );
}

export default FairytaleShow;
