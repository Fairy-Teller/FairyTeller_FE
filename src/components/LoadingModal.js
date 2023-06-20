import React, { useEffect } from "react";
import styled from "styled-components";

const ModalWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Modal = styled.div`
  width: 36rem;
  height: 24rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  border-radius: 4rem;
`;

const MoveImg = styled.img`
  width: 30%;
  height: 30%;
  margin: 0 0 2rem 0;
`;

const LoadingModal = ({ message }) => {
  useEffect(() => {
    document.body.classList.add("noscroll");

    return () => {
      document.body.classList.remove("noscroll");
    };
  }, []);

  return (
    <ModalWrap>
      <Modal>
        <MoveImg
          src='giphy.gif'
          alt='로딩 모달 이미지'
        />
        <p>{message}</p>
      </Modal>
    </ModalWrap>
  );
};

export default LoadingModal;
