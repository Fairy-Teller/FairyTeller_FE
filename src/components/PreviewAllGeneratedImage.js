import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ImageTempState, BookId } from '../recoil/FairytaleState';
import styled from 'styled-components';
import { ImageAll, getBookByIdTemp } from '../service/FairytaleService';

const ImageContainerFrame = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
`;
const ImageContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 1000px; /* Sum of Image widths and gaps (350 * 3 + 30 * 2) */
`;
const Image = styled.img`
    width: 100%;
    height: 240px;
    margin-bottom: 0.8rem;
    object-fit: cover;
    border-radius: 0.8rem;
    box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
    transition: all 0.24s ease-in-out;

    &:hover {
        height: 520px;
        transform: scale(1.012);
    }
`;
const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1.6rem;
`;
const Button = styled.button`
    width: 24rem;
    height: 4rem;
    background: pink;
    border-radius: 0.8rem;
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    text-align: center;
    color: #000000;
    box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.16);
    cursor: pointer;

    &:hover {
        background-color: #87dab3;
    }
`;

const PreviewAllGeneratedIamge = (props) => {
    const savedImageTemp = useRecoilValue(ImageTempState);
    const navigate = useNavigate();
    const bookIdShow = useRecoilValue(BookId);

    const goEdit = () => {
        getBookByIdTemp({ bookId: bookIdShow }).then((reponse) => {
            console.log('reponse', reponse.pages);
            const ImageAllCheck = reponse.pages.every((item) => item.originalImageUrl !== null);
            if (ImageAllCheck) {
                ImageAll({ bookId: bookIdShow });
                navigate('/f-edit');
            } else {
                alert('모든 페이지에 대한 이미지를 생성해주세요!');
            }
        });
    };

    return (
        <>
            <ImageContainerFrame>
                <ImageContainer>
                    {savedImageTemp.map((item, index) => (
                        <Image
                            key={index + '-generated'}
                            src={
                                item['originalImageUrl'] !== '' ? item['originalImageUrl'] : '/images/default-image.jpg'
                            }
                            alt={`Generated-Image-${index + 1}`}
                        />
                    ))}
                </ImageContainer>
                <ButtonWrap>
                    <Button onClick={goEdit}>동화책 꾸미기</Button>
                </ButtonWrap>
            </ImageContainerFrame>
        </>
    );
};

export default PreviewAllGeneratedIamge;
