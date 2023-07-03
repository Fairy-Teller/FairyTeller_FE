import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NewestTemp, getBookById, deleteTemp } from '../service/FairytaleService';
import { useRecoilState } from 'recoil';
import { BookId } from '../recoil/FairytaleState';

const Modal = styled.div`
    width: 50%;
    height: 50%;
    display: flex;
    opacity: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: white;
    border-radius: 50px;
    position: relative;
    overflow: hidden;
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

const ScrollableDiv = styled.div`
    height: 70%;
    overflow: auto;

    /* Styling the scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
const Story = styled.div`
    max-height: 50px;
    max-width: 550px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
`;
const DashedLine = styled.div`
    margin: 2% 0 2% 0;
    border: none;
    border-top: 2px solid rgba(0, 0, 0, 0.65);
`;

const TempModal = () => {
    const [tempList, setTemplist] = useState();
    const [bookId, setBookId] = useRecoilState(BookId);
    const navigate = useNavigate();

    useEffect(() => {
        TempListSet();
    }, []);

    const TempListSet = async () => {
        const response = await NewestTemp();
        setTemplist(response);
    };

    const gotoEdit = async (bookid) => {
        console.log(bookid);
        setBookId(bookid);
        const tempInfo = await getBookById({ bookId: bookid });
        const theme = tempInfo.theme;
        // const originalImageUrl =  tempInfo.pages.some((item) => item.originalImageUrl === null);
        // console.log('originalImageUrl', originalImageUrl);
        const title = tempInfo.title;
        if (theme) {
            navigate(title ? '/f-edit' : '/image-generated');
        } else {
            navigate('/artstyle');
        }
    };
    const deleteTempSet = (book) => {
        deleteTemp({ bookId: book });
        setTemplist(tempList.filter((item) => item.bookId !== book));
    };

    return (
        <Div>
            <Modal>
                <p style={{ fontSize: '35px', marginBottom: '1%' }}>임시 저장된 동화 목록입니다.</p>
                <p style={{ marginBottom: '2%', color: 'red' }}>⚠️ 저장된 동화는 48시간 뒤에 사라집니다.</p>
                <ScrollableDiv>
                    {tempList && tempList.length !== 0 ? (
                        tempList.map((book) => (
                            <>
                                <div style={{ marginBottom: '5%' }} onClick={() => gotoEdit(book.bookId)}>
                                    <h3>{book.lastModifiedDate.slice(0, 16)} 에 저장된 동화입니다.</h3>
                                    <br />
                                    <Story>{book.pages.slice(0, 99)} ...</Story>
                                </div>
                                <div
                                    onClick={() => deleteTempSet(book.bookId)}
                                    style={{ color: 'red', fontSize: '15px' }}
                                >
                                    삭제
                                </div>
                                <DashedLine />
                            </>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center' }}>게시물이 없습니다.</p>
                    )}
                </ScrollableDiv>
            </Modal>
        </Div>
    );
};

export default TempModal;
