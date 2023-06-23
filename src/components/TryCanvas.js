import React, { useEffect, useState, useRef } from "react";
import {
  atomFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from "recoil";
import { SelectStickers, SaveState, Canvasexport } from "../recoil/Fairytailstate";
import { call } from "../service/ApiService";
import styled, { css } from "styled-components";
import { fabric } from "fabric";
import PageSelection from "../components/PageSelection";
import TabSelection from "../components/TabSelection";

const [IMAGE, USERIMAGE, TEXT, TEXTSTYLE, DELETE, STICKER] = [
  "AI삽화",
  "사용자이미지",
  "텍스트추가",
  "글씨스타일",
  "삭제",
  "스티커추가",
];
const [NOTO, TAEB] = ["Noto Sans KR", "TAEBAEK milkyway"];
const fonts = [NOTO, TAEB];
const [LEFT, CENTER, RIGHT] = ["left", "center", "right"];
const aligns = [LEFT, CENTER, RIGHT];

const canvasState = atomFamily({
  key: "canvasState",
  default: null,
});

const CanvasFrame = styled.div`
  display: flex;
  height: 100vh;
`;
const Nav = styled.nav`
  width: 2.5vw;
  height: 100vh;
  padding: 0 0 0 1.2rem;
  flex-direction: column;
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
`;
const Tooltab = styled.div`
  width: 12.5vw;
  min-height: 100%;
  padding: 2rem 0.4rem;
  margin: 0 0 0 2rem;
  overflow-y: scroll;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));

  ${({ visible }) =>
    !visible &&
    css`
      display: none;
    `}
`;
const Item = styled.div`
  margin: 0 0 4rem 0;
  * {
    font-size: 1.6rem;
  }
`;
const ItemTitle = styled.div`
  padding: 0 0 1.2rem 0;
  font-size: 2.4rem;
`;

const TryCanvas = (props) => {
  const btnLabels = [USERIMAGE, TEXT, TEXTSTYLE, DELETE, STICKER];
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  // const [canvasStates, setCanvasStates] = useState({});

  const [activeTab, setActiveTab] = useState(null); // 수정탭 출력 여부를 위한 state
  const selectStickers = useRecoilValue(SelectStickers); // 선택한 스티커의 정보 state
  const saveState = useRecoilValue(SaveState); // 캔버스 저장 버튼 useEffect에 쓰기 위함 state
  const setCanvasExport = useSetRecoilState(Canvasexport); // 캔버스 내보내기 state
  const showCanvasExport = useRecoilValue(Canvasexport); // console.log 용 state
  const resetCanvasexport = useResetRecoilState(Canvasexport); // 첫 랜더링 될 때, 이전 저장된 이미지 state삭제

  const [savedCanvasState, setSavedCanvasState] = useRecoilState(canvasState(props.canvasid));
  const [showButtonFunction, setShowButtonFunctiontion] = useState(false);
  const [showImage, setShowImage] = useState(props.BookId);

  const [canvas, setCanvas] = useState();
  const bookInfo = useRef(null);
  const [showEditToolTab, setShowEditToolTab] = useState(false); // Add new state variable

  // 최신 저장 가져오기
  useEffect(() => {
    getNewest();
  }, []);

  const getNewest = async () => {
    try {
      const data = await call("/book/my-newest", "GET", null);
      setShowImage(data);

      const initializedCanvas = initCanvas(data);
      setCanvas(initializedCanvas);
      resetCanvasexport();
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
    } else {
      console.log("없나?");
    }
  };

  // 캔버스 초기화
  const initCanvas = (data) => {
    console.log("data", data);

    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 720,
      width: 1280,
    });

    canvas.index = 0;
    canvas.state = [];
    canvas.stateaction = true;

    fabric.Image.fromURL(
      data.pages[props.idx - 1].originalImageUrl + "?timestamp=" + new Date().getTime(),
      (image) => {
        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / image.width,
          scaleY: canvas.height / image.height,
        });
      },
      { crossOrigin: "anonymous" }
    );

    let text = new fabric.Textbox(data.pages[props.idx - 1].fullStory, {
      selectable: true,
      originX: "center",
      originY: "center",
      textAlign: "right",
      top: canvas.height / 1.4,
      left: canvas.width / 1.4,
      width: 640,
      fontFamily: TAEB,
      fontSize: 32,
      lineHeight: 1.4,
      fill: "white",
      shadow: new fabric.Shadow({
        color: "rgba(34, 34, 100, 0.4)",
        blur: 1,
        offsetX: -4,
        offsetY: 4,
      }),
    });

    canvas.add(text);

    return canvas;
  };

  // 탭
  const handleButtonClick = (label) => {
    setActiveTab(label === activeTab ? null : label);
    setShowButtonFunctiontion(!showButtonFunction);
    if (label === TEXT) {
      addTextBox();
    } else if (label === DELETE) {
      deleteObject();
    } else if (label === STICKER) {
      setShowEditToolTab(true);
    } else {
      setShowEditToolTab(false);
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
      shadow: new fabric.Shadow({
        color: "rgba(34, 34, 100, 0.4)",
        blur: 1,
        offsetX: -4,
        offsetY: 4,
      }),
    });

    canvas.add(text);
  };

  // 폰트
  const selectFontStyle = (item) => {
    const activeObject = canvas.getActiveObject();

    if (activeObject && (activeObject.type === "textbox" || "text")) {
      activeObject.set("fontFamily", item);

      canvas.requestRenderAll();
    } else if (!activeObject) {
      alert("VACANT");
    } else {
      alert("NOT A TEXT");
    }
  };

  // 얼라인
  const selectAlignStyle = (item) => {
    const activeObject = canvas.getActiveObject();

    if (activeObject && (activeObject.type === "textbox" || "text")) {
      activeObject.set("textAlign", item);

      canvas.requestRenderAll();
    } else if (!activeObject) {
      alert("VACANT");
    } else {
      alert("NOT A TEXT");
    }
  };

  const [selcolor, setSelColor] = useState(true);

  // 색
  const selectColorStyle = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject.type === "textbox" || "text")) {
      const nextColor = selcolor ? "black" : "white";

      activeObject.set({ fill: nextColor });
      canvas.requestRenderAll();

      setSelColor(!selcolor);
    } else if (!activeObject) {
      alert("VACANT");
    } else {
      alert("NOT A TEXT");
    }
  };

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
          left: 0,
          top: 0,
          angle: 0,
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
        img.scale(0.5).set({
          left: 150,
          top: 150,
          angle: -15,
        });

        // img.getElement().setAttribute('crossOrigin', 'anonymous');
        // canvas.add(img).setActiveObject(img);

        canvas.add(img).setActiveObject(img);
      },
      { crossOrigin: "anonymous" }
    );
  };

  return (
    <CanvasFrame>
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
      {!activeTab && <Tooltab visible></Tooltab>}

      <Tooltab visible={activeTab === TEXT}></Tooltab>

      <Tooltab visible={activeTab === TEXTSTYLE}>
        <Item>
          <ItemTitle>글씨체</ItemTitle>
          {fonts.map((item) =>
            fonts.length > 0 ? (
              <TabSelection
                name={TEXTSTYLE + "-tab"}
                stylename={item}
                onClick={(e) => {
                  selectFontStyle(item);
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
                onClick={(e) => {
                  selectAlignStyle(item);
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
            stylename={selcolor ? "black" : "white"}
            onClick={(e) => {
              selectColorStyle(selcolor);
            }}
          />
        </Item>
      </Tooltab>

      <Tooltab visible={activeTab === DELETE}></Tooltab>

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
        style={{ margin: "2rem 0 0 0" }}
      />
    </CanvasFrame>
  );
};

export default TryCanvas;
