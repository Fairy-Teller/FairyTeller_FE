import React, { useRef, useEffect, useState } from "react";
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
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 999999;
`;
const Modal = styled.div`
  width: 70rem;
  height: 50rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  border-radius: 2rem;
  z-index: 99999;
  border: 1px solid gray;
  position: relative; /* 추가: close 버튼을 포지션:absolute로 정렬하기 위해 필요합니다. */
`;

const Message = styled.p`
  font-size: 1.6rem;
  color: black;
  padding: 30px;
`;

const Canvas = styled.canvas`
  margin: 10px;
  border-radius: 2rem;
  border: 1px solid gray;
`;
const Input = styled.input`
  border: 1px solid gray;
  padding: 10px;
  width: 500px;
  height: 30px;
  font-size: 25px;
`;
const SaveButton = styled.button`
  border: 1px solid gray;
  padding: 10px;
  height: 30px;
  font-size: 16px;
`;
const Button = styled.button`
  border: 1px solid gray;
  padding: 20px;
  font-size: 20px;
`;
const Palette = styled.div`
  /* 팔레트 컨테이너의 스타일링을 여기에 추가합니다. */
  display: flex;
`;

const ColorButton = styled.button`
  /* 원하는 색상 버튼의 스타일링을 여기에 추가합니다. */
  background-color: "red";
`;

const StickerCanvas = ({ handleActivateTapNull, makeSticker }) => {
  // useRef
  const canvasRef = useRef(null);
  // getCtx
  const [getCtx, setGetCtx] = useState(null);
  // painting state
  const [painting, setPainting] = useState(false);
  const [penColor, setPenColor] = useState("#000000"); // 펜 색상 상태 추가
  const [showPalette, setShowPalette] = useState(false); // 팔레트 표시 여부 상태 추가

  const handlePaletteToggle = () => {
    setShowPalette(!showPalette); // 팔레트 표시 여부를 토글합니다.
  };

  const handleColorChange = (color) => {
    setPenColor(color); // 선택한 색상으로 펜 색상을 설정합니다.
    setShowPalette(false); // 팔레트를 닫습니다.
  };

  useEffect(() => {
    // canvas useRef
    const canvas = canvasRef.current;
    canvas.width = 650;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = penColor; // 펜 색상을 설정합니다.
    setGetCtx(ctx);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = penColor; // 펜 색상을 설정합니다.
    setGetCtx(ctx);
  }, [penColor]);

  const drawFn = (e) => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (!painting) {
      getCtx.beginPath();
      getCtx.moveTo(mouseX, mouseY);
    } else {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.stroke();
    }
  };

  const readMakeSticker = () => {
    const title = document.getElementById("sticker-title").value;
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    makeSticker(title, dataURL);
  };

  return (
    <ModalWrap>
      <Modal>
        <CloseButton onClick={handleActivateTapNull}>
          <img
            src='/images/closeicon.png'
            alt='Close'
          />
        </CloseButton>
        <Message>원하는 스티커를 만들어보아요!</Message>
        <Palette>
          <Button
            onClick={() => handleColorChange("#FF5555")}
            style={{ backgroundColor: "#FF5555" }}
          />
          <Button
            onClick={() => handleColorChange("#FF9999")}
            style={{ backgroundColor: "#FF9999" }}
          />
          <Button
            onClick={() => handleColorChange("#FFFF55")}
            style={{ backgroundColor: "#FFFF55" }}
          />
          <Button
            onClick={() => handleColorChange("#55FF55")}
            style={{ backgroundColor: "#55FF55" }}
          />
          <Button
            onClick={() => handleColorChange("#5555ff")}
            style={{ backgroundColor: "#5555ff" }}
          />
          <Button
            onClick={() => handleColorChange("#333333")}
            style={{ backgroundColor: "#333333" }}
          />
        </Palette>
        <div className='view'>
          <div className='canvasWrap'>
            <Canvas
              className='canvas'
              ref={canvasRef}
              onMouseDown={() => setPainting(true)}
              onMouseUp={() => setPainting(false)}
              onMouseMove={(e) => drawFn(e)}
              onMouseLeave={() => setPainting(false)}
            />
          </div>
        </div>
        <div>
          {/* <Button onClick={handlePaletteToggle}>색상 선택</Button> */}
          <Input
            id='sticker-title'
            placeholder='어떤 그림인가요?'
          />
          <SaveButton onClick={readMakeSticker}>스티커 만들기!</SaveButton>
        </div>
      </Modal>
    </ModalWrap>
  );
};

export default StickerCanvas;
