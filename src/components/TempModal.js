import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NewestTemp } from '../service/FairytaleService';
import { useRecoilState } from 'recoil';
import { BookId } from '../recoil/FairytaleState';

const Modal = styled.div`
    //   color: white;
    width: 50%;
    height: 50%;
    display: flex;
    opacity: 1;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    flex-direction: column; /* 요소를 세로로 배치 */
    background-color: white;
    border-radius: 50px; /* 모달 주위를 10px 둥글게 깎음 */
    position: relative; /* 부모 요소로부터 상대적 위치 설정 */
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

const TempModal = () => {
    const [tempList, setTemplist] = useState();
    const [bookId, setBookId] = useRecoilState(BookId);
    useEffect(() => {
        TempListSet();
    }, []);

    const TempListSet = async () => {
        const response = await NewestTemp();
        await setTemplist(response);
    };
    const gotoEdit = (bookid) => {
        setBookId(bookid);
        // 어디까지 왔는지 확인하는 로직 필요
    };
    console.log(bookId);

    return (
        <Div>
            <Modal>
                <p style={{ fontSize: '35px', marginBottom: '2%' }}>임시 저장된 동화 목록입니다.</p>
                {tempList ? (
                    tempList.map((book) => <div onClick={() => gotoEdit(book.bookId)}>{book}</div>)
                ) : (
                    <p style={{ textAlign: 'center' }}>게시물이 없습니다.</p>
                )}
            </Modal>
        </Div>
    );
};

export default TempModal;
