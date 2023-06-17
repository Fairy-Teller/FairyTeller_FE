import React,{useEffect} from 'react';
import styled from "styled-components";

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

const MoveImg = styled.img`
    width: 30%;
    height: 30%;
`;

const Div = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은색 배경 */
  top: 0;
  left: 0;
  overflow: hidden; /* 스크롤 막기 */
  z-index: 9999; /* 모달의 z-index 값을 높은 값으로 설정 */
`;

const LoadingModal = ({ message }) => {
  const handleScroll = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: false });

    // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 해제
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <Div>
      <Modal>
        <MoveImg src="giphy.gif" alt="로딩 모달 이미지" />
        <p>{ message }</p>
      </Modal>
    </Div>
  );
};

export default LoadingModal;
