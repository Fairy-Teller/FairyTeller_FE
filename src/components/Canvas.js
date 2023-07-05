import React, { useEffect, useState, useRef, useReducer } from "react";
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { SelectStickers, SaveState, Canvasexport, BookId } from "../recoil/FairytaleState";
import { getBookById, tempCreate } from "../service/FairytaleService";
import styled, { css } from "styled-components";
import { device } from "../assets/css/devices";
import { fabric } from "fabric";
import { Slider } from "@mui/material";
import TabSelection from "./TabSelection";
import LoadingModal from "./LoadingModal";
import StickerCanvas from "./StickerCanvas";
import { call } from '../service/ApiService';

const [OBJECTS, USERIMAGE, TEXT, TEXTSTYLE, DRAWING, STICKER, CUST_STICKER] = [
  "선택",
  "사용자이미지",
  "텍스트추가",
  "글씨스타일",
  "손그림",
  "스티커추가",
  "커스텀 스티커"
];
const [NOTO, NAMJ, KATU, TAEB] = ["NotoSansKR", "NanumMyeongjo", "Katuri", "TAEBAEK"];
const fonts = [NOTO, NAMJ, KATU, TAEB];
const [LEFT, CENTER, RIGHT] = ["left", "center", "right"];
const aligns = [LEFT, CENTER, RIGHT];

const CanvasFrame = styled.div`
  height: calc(100vh - 40px);
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
`;
const Nav = styled.nav`
  width: 5vw;
  height: calc(100vh - 40px);
  padding: 0 1.2rem 3.6rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 99;
  position: relative;
`;
const Tab = styled.button`
  width: 100%;
  padding: 1.2rem 0.6rem;
  margin: 0.8rem 0;
  border-radius: 1.2rem;
  background-color: white;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));

  ${({ clicked }) =>
    clicked &&
    css`
      background-color: black;
      color: white;
    `}

  @media ${device.tablet} {
    width: auto;
  }
`;
const Tooltab = styled.div`
  width: 15vw;
  height: calc(100vh - 12.8rem);
  padding: 2rem 0.4rem;
  margin: 0;
  position: absolute;
  top: 2rem;
  left: 5vw;
  background-color: rgba(255, 255, 255, 0.8);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
  overflow-y: scroll;
  z-index: 98;

  ${({ visible }) =>
    !visible &&
    css`
      display: none;
    `}
`;
const Item = styled.div`
  margin: 0 0 2.4rem 0;
  * {
    font-size: 1.6rem;
    line-height: 1.4;
    word-break: keep-all;
  }
`;
const ItemTitle = styled.div`
  padding: 0 0 1.2rem 0.8rem;
  font-size: 2rem;
  font-weight: 900;
`;
const ItemButton = styled.button`
  max-width: 100%;
  width: 100%;
  display: block;
  margin: 0.4rem 0;
  padding: 0.8rem 0.4rem;
  box-sizing: border-box;
  font-size: 1.6rem;
  text-align: left;
  border-radius: 0.4rem;
  overflow: hidden;
  transition: background-color 0.24s ease-in-out, color 0.24s ease-in-out;

  &:first-of-type {
    margin-top: 0;
  }

  &:hover {
    background-color: white;
  }
`;

const ColorPicker = styled.input`
  width: 100%;
  max-width: 100%;
  height: 3.6rem;
  padding: 0.8rem 0.4rem;
  box-sizing: border-box;
`;

const tempPost = {
  bookId: 0,
  pages: [
    {
      pageNo: 0,
      objects: null,
    },
  ],
};

const Canvas = (props) => {
  const btnLabels = [TEXTSTYLE, TEXT, OBJECTS, USERIMAGE, STICKER, DRAWING, CUST_STICKER];
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // 수정탭 출력 여부를 위한 state
  const [showButtonFunction, setShowButtonFunctiontion] = useState(false);

  const selectStickers = useRecoilValue(SelectStickers); // 선택한 스티커의 정보 state
  const saveState = useRecoilValue(SaveState); // 캔버스 저장 버튼 useEffect에 쓰기 위함 state
  const setCanvasExport = useSetRecoilState(Canvasexport); // 캔버스 내보내기 state
  const resetCanvasexport = useResetRecoilState(Canvasexport); // 첫 랜더링 될 때, 이전 저장된 이미지 state 삭제
  const bookIdshow = useRecoilValue(BookId);

  useEffect(() => {
    getNewest();
  }, []);

  useEffect(() => {
    if (canvas) {
      const logToConsoleEveryMinute = async () => {
        // 제이슨 저장 로직이 들어갈 곳
        tempPost.bookId = props.BookInfo.bookId;
        tempPost.pages[0].pageNo = props.idx;
        tempPost.pages[0].objects = JSON.stringify(canvas);
        await tempCreate(tempPost);
      };

      // 1분마다 함수를 실행하기 위한 타이머를 설정합니다.
      const intervalId = setInterval(logToConsoleEveryMinute, 20000);

      //컴포넌트가 언마운트되면 타이머를 해제합니다.
      return () => clearInterval(intervalId);
    }
  }, [canvas]);

  // 최신 저장 가져오기
  const getNewest = async () => {
    try {
      // newest 삭제
      const data = await getBookById({ bookId: bookIdshow });

      const initializedCanvas = initCanvas(data);
      setCanvas(initializedCanvas);

      resetCanvasexport(null);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // 이미지 저장하기
  useEffect(() => {
    if (saveState === "save") {
      saveAsImage("jpeg");
    }
  }, [saveState]);

  const saveAsImage = (format) => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0,
        format: format,
      });

      const link = document.createElement("a");

      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCanvasExport((prev) => [...prev, { id: props.idx, img: link.href }]);
    }
  };

  // 캔버스 초기화
  const initCanvas = (data) => {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const canvas = new fabric.Canvas(
      canvasRef.current,
      windowW >= 1920
        ? {
            width: 1280,
            height: 720,
            preserveObjectStacking: true,
          }
        : {
            width: 1024,
            height: 576,
            preserveObjectStacking: true,
          }
    );

    let left, top;
    if (windowW >= 1920) {
      left = windowW / 2 - 640 + "px";
      top = windowH / 2 - 360 - 30 + "px";
    } else {
      left = windowW / 2 - 512 + "px";
      top = windowH / 2 - 300 - 30 + "px";
    }

    const canvasContainer = document.querySelectorAll(".canvas-container");
    for (let i = 0; i < canvasContainer.length; i++) {
      canvasContainer[i].style.position = "absolute";
      canvasContainer[i].style.left = left;
      canvasContainer[i].style.top = top;
    }

    canvas.index = 0;
    canvas.state = [];
    canvas.stateaction = true;

    // 저장된 오브젝트가 있으면 이걸로 되게끔 분기처리

    if (data.pages[props.idx - 1].objects) {
      const canvasState = data.pages[props.idx - 1].objects;
      canvas.loadFromJSON(canvasState, () => {
        canvas.renderAll();
      });
    } else {
      fabric.Image.fromURL(
        data.pages[props.idx - 1].originalImageUrl + "?timestamp=" + new Date().getTime(),
        (defimage) => {
          canvas.setBackgroundImage(defimage, canvas.requestRenderAll.bind(canvas), {
            scaleX: canvas.width / defimage.width,
            scaleY: canvas.height / defimage.height,
          });
        },
        { crossOrigin: "anonymous" }
      );

      let deftext = new fabric.Textbox(data.pages[props.idx - 1].fullStory, {
        selectable: true,
        originX: "center",
        originY: "center",
        textAlign: "right",
        top: canvas.height / 2,
        left: canvas.width / 2,
        width: 640,
        fontFamily: TAEB,
        fontSize: 32,
        lineHeight: 1.4,
        fill: !data.pages[props.idx - 1].dark ? "white" : "black",
        shadow: new fabric.Shadow(
          !data.pages[props.idx - 1].dark
            ? {
                color: "rgba(34, 34, 34, 1)",
                blur: 8,
                offsetX: 4,
                offsetY: 4,
              }
            : {
                color: "rgba(255, 255, 255, 0.8)",
                blur: 8,
                offsetX: 4,
                offsetY: 4,
              }
        ),
      });
      canvas.add(deftext);
    }

    return canvas;
  };

  // 탭
  const handleButtonClick = (label) => {
    setActiveTab(label === activeTab ? null : label);
    setShowButtonFunctiontion(!showButtonFunction);
    if (label === TEXT) {
      addTextBox();
    }
  };
  const handleActivateTapNull =() =>{
    setActiveTab(null);
  };

  const makeSticker = async (customStickerTitle, dataURL) => {
    console.log(dataURL);
    console.log(customStickerTitle)
    setActiveTab(null);
    setIsLoading(true);
    try {
      const stickerData = {
        prompt: customStickerTitle,
        img: dataURL, // 추출한 base64 이미지를 stickerData의 img 속성에 할당합니다.
      };
      const response = await call('/images/imageToImage', 'POST', stickerData);
      selectCustomStickersShow(response);
      
    } catch (error) {
        console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  };
  // 텍스트 박스
  const addTextBox = () => {
    let text = new fabric.Textbox("원하는 내용을 추가하세요", {
      selectable: true,
      originX: "center",
      originY: "center",
      textAlign: "center",
      top: canvas.height / 2,
      left: canvas.width / 2,
      width: 640,
      fontFamily: TAEB,
      fontSize: 32,
      lineHeight: 1.4,
      fill: "white",
      shadow: new fabric.Shadow({
        color: "rgba(34, 34, 34, 1)",
        blur: 8,
        offsetX: 4,
        offsetY: 4,
      }),
    });

    canvas.add(text);
  };

  // 텍스트 스타일링
  const stylesReducer = (state, action) => {
    const activeObject = action.canvas.getActiveObject();

    if (!activeObject || !(activeObject.type === "textbox" || "text")) {
      return null;
    }

    switch (action.type) {
      case "fontStyle":
        activeObject.set("fontFamily", action.payload);
        action.canvas.renderAll();
        return state;
      case "alignStyle":
        activeObject.set("textAlign", action.payload);
        action.canvas.requestRenderAll();
        return state;
      case "colorStyle":
        activeObject.set({
          fill: action.payload ? "white" : "black",
          shadow: new fabric.Shadow(
            action.payload
              ? {
                  color: "rgba(34, 34, 34, 1)",
                  blur: 8,
                  offsetX: 4,
                  offsetY: 4,
                }
              : {
                  color: "rgba(255, 255, 255, 0.8)",
                  blur: 8,
                  offsetX: 4,
                  offsetY: 4,
                }
          ),
        });
        action.canvas.requestRenderAll();
        return {
          ...state,
          selectColor: !action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(stylesReducer, { selectColor: true });

  // 삭제
  const deleteObject = () => {
    canvas.remove(canvas.getActiveObject());
  };

  // 파일 불러와서 이미지 첨부
  const readImage = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function (f) {
      let data = f.target.result;

      fabric.Image.fromURL(data, function (img) {
        let oImg = img.set({
          angle: -22.5,
        });

        canvas.add(oImg).renderAll();
        canvas.centerObject(oImg);
      });
    };

    reader.readAsDataURL(file);
  };

  // 스티커 투입
  const selectStickersShow = (item) => {
    fabric.Image.fromURL(
      item + "?timestamp=" + new Date().getTime(),
      function (img) {
        // img.crossOrigin = `Anonymous`;
        // img.setAttribute('crossOrigin', '');
        img.scale(0.25).set({
          left: 150,
          top: 150,
          angle: -22.5,
        });

        // img.getElement().setAttribute('crossOrigin', 'anonymous');
        // canvas.add(img).setActiveObject(img);
        canvas.add(img).setActiveObject(img);
      },
      { crossOrigin: "anonymous" }
    );
  };


  // 커스텀 스티커 투입
  const selectCustomStickersShow = (item) => {
    const base64 = "data:image/png;base64," + item;
    console.log(base64);
    fabric.Image.fromURL(
      base64,
      function (img) {
        img.scale(1).set({
          left: 150,
          top: 150,
          angle: -22.5,
        });
        canvas.add(img).setActiveObject(img);
      }
    );
  };

  // 손그림
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#FFaaFF");
  const [brushWidth, setBrushWidth] = useState(1);
  const [originLength, setOriginLength] = useState(0);

  const startDrawing = (c) => {
    setIsDrawing(true);
    setOriginLength(c._objects.length);
    c.isDrawingMode = true;
    c.freeDrawingBrush.color = brushColor;
    c.requestRenderAll();
  };

  const stopDrawing = (c) => {
    setIsDrawing(false);
    c.isDrawingMode = false;
    c.requestRenderAll();
  };

  //brush change
  const handleBrushWidth = (e) => {
    canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
    setBrushWidth(canvas.freeDrawingBrush.width);
    canvas.renderAll();
  };

  const handleBrushColor = (e) => {
    canvas.freeDrawingBrush.color = e.target.value;
    setBrushColor(e.target.value);
    canvas.renderAll();
  };

  // undo/redo
  let objHistory = [];
  let undoHistory = [];

  const undo = (c) => {
    let objLength = c._objects.length;
    if (objLength === 0) {
      return null;
    }
    let popData = c._objects.pop();
    undoHistory.push(popData);
    c.renderAll();
  };

  const redo = (c) => {
    if (undoHistory.length === 0) {
      return null;
    }
    let popData = undoHistory.pop();
    objHistory.push(popData);
    c._objects.push(popData);
    c.renderAll();
  };

  // 맨앞으로 가져오기
  const bringToFront = (c) => {
    let obj = canvas.getActiveObject();
    c.bringToFront(obj);
    c.renderAll();
  };

  // 맨뒤로 보내기
  const sendToBack = (c) => {
    let obj = c.getActiveObject();
    c.sendToBack(obj);
    c.renderAll();
  };

  // 앞으로 가져오기
  const bringForward = (c) => {
    let obj = canvas.getActiveObject();
    c.bringForward(obj);
    c.renderAll();
  };

  // 뒤로 보내기
  const sendBackwards = (c) => {
    let obj = c.getActiveObject();
    c.sendBackwards(obj);
    c.renderAll();
  };

  return (
    <CanvasFrame>
      {isLoading && <LoadingModal message='AI가 스티커를 만들고 있습니다!' />}
      <Nav>
        {btnLabels.map((label) => (
          <Tab
            key={label}
            clicked={activeTab === label}
            onClick={() => handleButtonClick(label)}>
            <h2>{label}</h2>
          </Tab>
        ))}
      </Nav>
      {activeTab == CUST_STICKER && <StickerCanvas handleActivateTapNull={handleActivateTapNull} makeSticker={makeSticker}  />}
      <div visible={activeTab === CUST_STICKER}></div>
      <Tooltab visible={activeTab === TEXTSTYLE}>
        <Item>
          <ItemTitle>글씨체</ItemTitle>
          {fonts.map((item) =>
            fonts.length > 0 ? (
              <TabSelection
                name={TEXTSTYLE + "-tab"}
                stylename={item}
                onClick={() => {
                  dispatch({ type: "fontStyle", payload: item, canvas: canvas });
                }}
              />
            ) : (
              <div>폰트</div>
            )
          )}
        </Item>
        <Item>
          <ItemTitle>정렬</ItemTitle>
          {aligns.map((item) =>
            aligns.length > 0 ? (
              <TabSelection
                name={TEXTSTYLE + "-tab"}
                stylename={item}
                onClick={() => {
                  dispatch({ type: "alignStyle", payload: item, canvas: canvas });
                }}
              />
            ) : (
              <div>얼라인</div>
            )
          )}
        </Item>
        <Item>
          <ItemTitle>색</ItemTitle>
          <TabSelection
            name={TEXTSTYLE + "-tab"}
            stylename='white'
            onClick={(e) => {
              dispatch({
                type: "colorStyle",
                payload: true,
                canvas: canvas,
              });
            }}
          />
          <TabSelection
            name={TEXTSTYLE + "-tab"}
            stylename='black'
            onClick={() => {
              dispatch({
                type: "colorStyle",
                payload: false,
                canvas: canvas,
              });
            }}
          />
        </Item>
      </Tooltab>

      <Tooltab visible={activeTab === DRAWING}>
        <Item>
          <ItemTitle>직접 손그림을 그리거나 손글씨를 쓸 수 있어요</ItemTitle>
          <ItemButton onClick={() => undo(canvas)}>뒤로가기</ItemButton>
          <ItemButton onClick={() => redo(canvas)}>복구하기</ItemButton>
          <ItemButton onClick={deleteObject}>삭제하기</ItemButton>
          {isDrawing ? (
            <ItemButton
              onClick={() => {
                stopDrawing(canvas);
              }}>
              손그림 모드 OFF
            </ItemButton>
          ) : (
            <ItemButton
              onClick={() => {
                startDrawing(canvas);
              }}>
              손그림 모드 ON
            </ItemButton>
          )}
          <ColorPicker
            type='color'
            value={brushColor}
            onChange={handleBrushColor}
          />
          <Slider
            min={5}
            max={50}
            sx={{
              width: 180,
              height: 8,
              margin: "0.4rem 0 0 1.2rem",
              color: "pink",
            }}
            value={brushWidth}
            onChange={handleBrushWidth}
          />
        </Item>
      </Tooltab>

      <Tooltab visible={activeTab === OBJECTS}>
        <Item>
          <ItemTitle>선택한 객체를</ItemTitle>
          <ItemButton onClick={() => bringForward(canvas)}>앞으로 가져오기</ItemButton>
          <ItemButton onClick={() => sendBackwards(canvas)}>뒤로 보내기</ItemButton>
          <ItemButton onClick={() => bringToFront(canvas)}>맨앞으로 가져오기</ItemButton>
          <ItemButton onClick={() => sendToBack(canvas)}>맨뒤로 보내기</ItemButton>
          <ItemButton onClick={deleteObject}>삭제하기</ItemButton>
        </Item>
      </Tooltab>

      <Tooltab visible={activeTab === STICKER}>
        {selectStickers.map((item) =>
          selectStickers.length > 0 ? (
            <TabSelection
              name={STICKER + "-tab"}
              idx={item.id}
              src={item.src}
              onClick={() => {
                selectStickersShow(item.src);
              }}
            />
          ) : null
        )}
      </Tooltab>

      <Tooltab visible={activeTab === USERIMAGE}>
        <input
          type='file'
          onChange={readImage}
        />
      </Tooltab>

      <canvas
        id='canvas'
        key={props.canvasid + "c"}
        ref={canvasRef}
      />
    </CanvasFrame>
  );
};

export default Canvas;
