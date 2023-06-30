import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { call } from '../service/ApiService';
import LoadingModal from './LoadingModal';

import { SaveState, Canvasexport, TitleSave } from '../recoil/FairytaleState';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';


const Modal = styled.div`
    //   color: white;
    width: 30%;
    height: 30%;
    display: flex;
    opacity: 1;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    flex-direction: column; /* 요소를 세로로 배치 */
    background-color: white;
    border-radius: 50px; /* 모달 주위를 10px 둥글게 깎음 */
`;

const Div = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    top: 0;
    left: 0;
    z-index: 99999;
`;
const InputTitle = styled.input`
    width: 60%;
    height: 50%;
    border: 3px solid #000000;
    font-size: 40px;
`;
const Commit = styled.button`
    margin-top: 3%;
    width: 60%;
    height: 15%;
    border-radius: 20px;
    background: #f0a6a6;
    font-size: 35px;
`;
const bookData = {
    bookId: 0,
    title: 'this is final title',
    pages: [
        {
            pageNo: 1,
            fullStory: '줄거리1',
            finalImageUrl: '',
        },
        {
            pageNo: 2,
            fullStory: '줄거리2',
            finalImageUrl: '',
        },
    ],
};

const TitleModal = (bookid) => {
    const navigate = useNavigate();
    const [titles, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const saveState = useSetRecoilState(SaveState);
    const canvasExport = useRecoilValue(Canvasexport);
    const [titleSave, setTitleSave] = useRecoilState(TitleSave);

    useEffect(() => {
        saveState('save');
        bookData.bookId = bookid.props;

        if (canvasExport.length !== 0) {
            canvasExport.forEach((canvas, index) => {
                if (index <= 2) {
                    if (bookData.pages[index]) {
                        bookData.pages[index].finalImageUrl = canvas.img;
                    }
                } else {
                    bookData.pages.push({
                        pageNo: index + 1,
                        fullStory: `줄거리${index + 1}`,
                        finalImageUrl: canvas.img,
                    });
                }
            });
        }
    }, [canvasExport]);

    const allsave = async () => {
        setIsLoading(true);
        try {
            const response = await call('/book/create/final', 'POST', bookData);
        } catch (error) {
            console.error(error);
        }

        navigate('/f-export');
    };

    const onChangeHandler = (e) => {
        const { value } = e.target;
        setTitle(value);
        bookData.title = value;
    };

    return (
        <Div>
            {!isLoading && (
                <Modal>
                    <p style={{ fontSize: '35px', marginBottom: '2%' }}>동화제목을 입력하세요</p>
                    <InputTitle onChange={(e) => onChangeHandler(e)} placeholder="제목을 입력해주세요"></InputTitle>
                    <Commit onClick={allsave}>확인</Commit>
                    <Commit onClick={() => setTitleSave(true)}>취소하기</Commit>
                </Modal>
            )}
            {isLoading && <LoadingModal message="동화나라로 편지를 보내는 중입니다." />}
        </Div>
    );
};

export default TitleModal;
