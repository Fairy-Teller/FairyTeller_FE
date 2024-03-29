import React, { useEffect, useState, useRef, useReducer } from "react";
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { SelectStickers, SaveState, Canvasexport, BookId } from "../recoil/FairytaleState";
import { getBookByIdTemp, tempCreate, imageToImage } from "../service/FairytaleService";
import styled, { css } from "styled-components";
import { device } from "../assets/css/devices";
import { fabric } from "fabric";
import { Slider } from "@mui/material";
import TabSelection from "./TabSelection";
import LoadingModal from "./LoadingModal";
import StickerCanvas from "./StickerCanvas";

const [OBJECTS, USERIMAGE, TEXT, TEXTSTYLE, DRAWING, STICKER, CUST_STICKER] = [
  "선택",
  "사용자이미지",
  "텍스트추가",
  "글씨스타일",
  "손그림",
  "스티커추가",
  "커스텀 스티커",
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
const FloatButton = styled(ItemButton)`
  margin: 0;
  position: fixed;
  height: 4rem;
  top: 3.2rem;
  right: 30.4rem;
  text-align: center;
  border-radius: 1.2rem;
  background-color: white;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
  z-index: 98;
  &:first-of-type {
    width: 16rem;
  }
  &:last-of-type {
    width: 8rem;
    right: 20.8rem;
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

let objJson = {};
let undoJsonHistory = {};

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
        tempPost.bookId = props.BookInfo.bookId;
        tempPost.pages[0].pageNo = props.idx;

        let stringifiedCanvas = JSON.stringify(canvas);
        tempPost.pages[0].objects = stringifiedCanvas;

        await tempCreate(tempPost);
      };

      const historyEverySecond = async () => {
        let stringifiedCanvas = JSON.stringify(canvas);

        if (!objJson[props.idx]) objJson[props.idx] = [];
        if (!undoJsonHistory[props.idx]) undoJsonHistory[props.idx] = [];

        if (
          objJson[props.idx].length === 0 ||
          objJson[props.idx][parseInt(objJson[props.idx].length - 1)].length !==
            stringifiedCanvas.length
        ) {
          await objJson[props.idx].push(stringifiedCanvas);
          // console.log("objJson saved : \n", objJson);
        }
      };

      const intervalId = setInterval(logToConsoleEveryMinute, 20000);
      const intervalHistory = setInterval(historyEverySecond, 2000);

      return () => {
        clearInterval(intervalId);
        clearInterval(intervalHistory);
      };
    }
  }, [canvas]);

  // 최신 저장 가져오기
  const getNewest = async () => {
    try {
      // newest 삭제
      const data = await getBookByIdTemp({ bookId: bookIdshow });

      const initializedCanvas = initCanvas(data);
      setCanvas(initializedCanvas);

      resetCanvasexport(null);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const loadFromJSONPromise = (c, json) => {
    return new Promise((resolve, reject) => {
      c.loadFromJSON(
        json,
        function () {
          resolve();
        },
        function (o, error) {
          reject(error);
        }
      );
    });
  };

  // 캔버스 undo/redo
  const undo = async (c) => {
    if (!objJson[props.idx] || objJson[props.idx].length === 0) {
      return null;
    }

    try {
      setIsLoading(true);
      let popData = objJson[props.idx].pop();
      undoJsonHistory[props.idx].push(popData);

      await loadFromJSONPromise(c, JSON.parse(popData));
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      c.renderOnAddRemove = false;
      c.renderAll.bind(c);
      c.renderOnAddRemove = true;
      setIsLoading(false);
    }
  };

  const redo = async (c) => {
    if (!undoJsonHistory[props.idx] || undoJsonHistory[props.idx].length === 0) {
      return null;
    }

    try {
      setIsLoading(true);
      let popData = undoJsonHistory[props.idx].pop();
      objJson[props.idx].push(popData);

      // c.clear();
      // await c.loadFromJSON(JSON.parse(popData), () => {
      //   c.renderAll();
      // });

      // fabric.util.enlivenObjects(c.objects, function (objects) {
      //   c.add(...objects);
      // });

      await loadFromJSONPromise(c, JSON.parse(popData));

      // await new Promise((resolve, reject) => {
      //   c.loadFromJSON(
      //     JSON.parse(popData),
      //     function () {
      //       resolve();
      //     },
      //     function (o, object) {
      //       console.error("에러~ Error parsing object: ", o, object);
      //     }
      //   );
      // });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      c.renderOnAddRemove = false;
      c.renderAll.bind(c);
      c.renderOnAddRemove = true;
      setIsLoading(false);
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
    canvas.selection = true;

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
    if (label === DRAWING) {
      startDrawing(canvas);
    }
    if (label !== DRAWING) {
      stopDrawing(canvas);
    }
  };
  const handleActivateTapNull = () => {
    setActiveTab(null);
  };

  const makeSticker = async (customStickerTitle, dataURL) => {
    setActiveTab(null);
    setIsLoading(true);
    try {
      const stickerData = {
        prompt: customStickerTitle,
        img: dataURL, // 추출한 base64 이미지를 stickerData의 img 속성에 할당합니다.
      };
      const response = await imageToImage(stickerData);
      selectCustomStickersShow(response);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
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
    const activeObjects = canvas.getActiveObjects();
    canvas.discardActiveObject();
    if (activeObjects.length) {
      canvas.remove.apply(canvas, activeObjects);
    }
    canvas.renderAll();
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
    fabric.Image.fromURL(base64, function (img) {
      img.scale(1).set({
        left: 150,
        top: 150,
        angle: -22.5,
      });
      canvas.add(img).setActiveObject(img);
    });
  };

  // 손그림
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#FFaaFF");
  const [brushWidth, setBrushWidth] = useState(1);

  const startDrawing = (c) => {
    c.isDrawingMode = true;
    c.freeDrawingBrush.color = brushColor;
    c.freeDrawingBrush.width = brushWidth;
    c.requestRenderAll();
  };

  const stopDrawing = (c) => {
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

  // 손그림 undoD/redoD
  let objDrawing = [];
  let undoDrawingHistory = [];

  const undoD = (c) => {
    objDrawing = c.getObjects().filter((obj) => obj instanceof fabric.Path && obj.type === "path");

    if (objDrawing.length === 0) {
      return null;
    }

    let popData;

    for (let i = c._objects.length - 1; i >= 0; i--) {
      if (c._objects[i] instanceof fabric.Path && c._objects[i].type === "path") {
        popData = c._objects[i];
        c._objects.splice(i, 1);
        break;
      }
    }

    undoDrawingHistory.push(popData);
    c.renderAll();
  };

  const redoD = (c) => {
    if (undoDrawingHistory.length === 0) {
      return null;
    }
    let popData = undoDrawingHistory.pop();
    objDrawing.push(popData);
    c.add(popData);
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
      {isLoading && <LoadingModal message='잠시만 기다려 주세요!' />}
      <FloatButton onClick={() => undo(canvas)}>이전으로 되돌리기</FloatButton>
      <FloatButton onClick={() => redo(canvas)}>복구하기</FloatButton>
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

      {activeTab === CUST_STICKER && (
        <StickerCanvas
          handleActivateTapNull={handleActivateTapNull}
          makeSticker={makeSticker}
        />
      )}
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
          <ItemButton onClick={() => undoD(canvas)}>손그림 되돌리기</ItemButton>
          <ItemButton onClick={() => redoD(canvas)}>손그림 복구하기</ItemButton>
          <ItemButton onClick={deleteObject}>삭제하기</ItemButton>
          <ColorPicker
            type='color'
            value={brushColor}
            onChange={handleBrushColor}
          />
          <Slider
            min={10}
            max={50}
            sx={{
              width: 180,
              height: 8,
              margin: "0.4rem 0 0 1.2rem",
              color: brushColor,
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
        id={props.canvasid + "c"}
        key={props.canvasid + "c"}
        ref={canvasRef}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      />
    </CanvasFrame>
  );
};

export default Canvas;
