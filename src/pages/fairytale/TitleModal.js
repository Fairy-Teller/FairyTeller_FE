import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { SaveState } from '../../recoil/Fairytailstate';
import { useSetRecoilState } from 'recoil';

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
    background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은색 배경 */
    top: 0;
    left: 0;
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

//여기서 save state바꾸고 난 다음에 제목 입력 후, 최종 저장이 이뤄지는 프로세스로 가야합니다.
// 저장이 이뤄지고 난 다음엔 네비게이트로 export를 실행합니다.
// 캔버스내에서 저장된 이미지를 리코일로 저장한다음 이쪽에서 저장을 할지 아님 저쪽에서 저장을 할지 아직 안정했어요

const TitleModal = ({ message }) => {
    const navigate = useNavigate();
    const saveState = useSetRecoilState(SaveState);

    const allsave = () => {
        saveState('save');
        // navigate('/f-export');
    };

    return (
        <Div>
            <Modal>
                <p style={{ fontSize: '35px', marginBottom: '2%' }}>동화제목을 입력하세요</p>
                <InputTitle></InputTitle>
                <Commit onClick={allsave}>확인</Commit>
            </Modal>
        </Div>
    );
};

export default TitleModal;
