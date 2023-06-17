import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
//import "./styles.css";
import json from "./dummy.json";

import { call } from '../../service/ApiService';
export default function TestCanvas() {
  const { editor, onReady } = useFabricJSEditor();

  const history = [];
  const [color, setColor] = useState("#35363a");
  const [cropImage, setCropImage] = useState(true);
  useEffect(() => {
    // API 요청을 위한 useEffect 훅
    const fetchData = async () => {
      try {
        await sendText()
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  const sendText = async () => {
    try {
        console.log("이미지 요청")
        const response = await call('/chat-gpt/summarize', 'POST', { text: "happy cute cat" });
        const imageData = response; // 응답 데이터 - Base64 문자열
        const byteCharacters = atob(imageData); // Base64 디코딩
        const byteArrays = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays[i] = byteCharacters.charCodeAt(i);
        }
        const imageBlob = new Blob([byteArrays], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        addImageUrl(imageUrl)
    } catch (error) {
        console.log('Error fetching data:', error);
    }
};

  const addImageUrl = (url) => {
    if (!editor || !fabric) {
      return;
    }

    fabric.Image.fromURL(
      url, 
      function (myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({ left: 0, top: 0, width: 600, height: 700 });
        // img1.crossOrigin = `Anonymous`;
        // img1.setAttribute("crossOrigin", "");
        editor.canvas.add(img1);
        editor.canvas.renderAll();
      }
    );
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (cropImage) {
        editor.canvas.__eventListeners = {};
        return;
      }
    if (cropImage) {
      editor.canvas.__eventListeners = {};
      return;
    }

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
          var e = opt.e;
          var vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });
    }

    editor.canvas.renderAll();
  }, [editor]);

  const addBackground = () => {
    if (!editor || !fabric) {
      return;
    }

    fabric.Image.fromURL(
      "https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg",
      (image) => {
        editor.canvas.setBackgroundImage(
          image,
          editor.canvas.renderAll.bind(editor.canvas)
        );
      }
    );
  };

  const addImage = () => {
    if (!editor || !fabric) {
      return;
    }

    fabric.Image.fromURL(
      "https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-lovely-cute-illustration-illustration-hand-drawn-illustration-png-image_490451.jpg",
      function (myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({ left: 0, top: 0, width: 600, height: 700 });
        // img1.crossOrigin = `Anonymous`;
        // img1.setAttribute("crossOrigin", "");
        editor.canvas.add(img1);
        editor.canvas.renderAll();
      }
    );
  };

  const fromSvg = () => {
    // fabric.loadSVGFromString(
    //   `<svg id="ePEHpGgNmtl1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M221.59777,65.3796v135.73374h-95.35507c12.08635-16.70139,19.67108-40.76347,19.67108-67.51155c0-27.12987-7.80279-51.49651-20.19136-68.2222l95.87535.00001Z" fill="#d2dbed" stroke-width="0"/></svg>`,
    //   (objects, options) => {
    //     editor.canvas._objects.splice(0, editor.canvas._objects.length);
    //     editor.canvas.backgroundImage = objects[0];
    //     const newObj = objects.filter((_, index) => index !== 0);
    //     newObj.forEach((object) => {
    //       editor.canvas.add(object);
    //     });

    //     editor.canvas.renderAll();
    //   }
    // );

    fabric.loadSVGFromString(
      `<svg id="ePEHpGgNmtl1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M221.59777,65.3796v135.73374h-95.35507c12.08635-16.70139,19.67108-40.76347,19.67108-67.51155c0-27.12987-7.80279-51.49651-20.19136-68.2222l95.87535.00001Z" fill="#d2dbed" stroke-width="0"/></svg>`,
      function (objs, options) {
        var group = fabric.util.groupSVGElements(objs, options);
        editor.canvas.add(group);
        editor.canvas.calcOffset();
        editor.canvas.renderAll();
      }
    );
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(400);
    editor.canvas.setWidth(750);
    //addBackground();
    // fromJson();
    editor.canvas.renderAll();
  }, [editor?.canvas.backgroundImage]);

  const toggleSize = () => {
    editor.canvas.freeDrawingBrush.width === 12
      ? (editor.canvas.freeDrawingBrush.width = 5)
      : (editor.canvas.freeDrawingBrush.width = 12);
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
    editor.setFillColor(color);
  }, [color]);

  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
  };
  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };
  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };

  const onAddCircle = () => {
    editor.addCircle();
    editor.addLine();
  };
  const onAddRectangle = () => {
    editor.addRectangle();
  };
  const addText = () => {
    editor.addText("inset text");
    editor.canvas.getActiveObject();
  };

  const exportSVG = () => {
    const svg = editor.canvas.toSVG();
    console.info(svg);
  };

  const changeBackgroundText = (value) => {
    //debugger;
    editor.canvas.getActiveObject().fontSize = value;
    editor.canvas.renderAll();
  };

  const changeFontStyle = (value) => {
    editor.canvas.getActiveObject().fontStyle = value;
    editor.canvas.renderAll();
  };

  const changeFontType = (value) => {
    editor.canvas.getActiveObject().fontWeight = value;
    editor.canvas.renderAll();
  };

  const toFront = () => {
    editor.canvas.bringToFront(editor.canvas.getActiveObject());
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll();
  };

  const toBack = () => {
    editor.canvas.sendBackwards(editor.canvas.getActiveObject());
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll();
  };

  const changeLineHeight = (value) => {
    editor.canvas.getActiveObject().lineHeight = value;
    editor.canvas.renderAll();
  };

  const toJson = () => {
    var json = editor.canvas.toJSON();
    console.log(json);
  };

  const fromJson = () => {
    console.log(json);
    editor.canvas.loadFromJSON(
      json,
      editor.canvas.renderAll.bind(editor.canvas)
    );
  };

  return (
    <>
      <div className="App">
        <h1>FabricJS React Sample</h1>
        <button onClick={onAddCircle}>Add circle</button>
        <button onClick={onAddRectangle} disabled={!cropImage}>
          Add Rectangle
        </button>
        <button onClick={addText} disabled={!cropImage}>
          Add Text
        </button>
        <button onClick={toggleDraw} disabled={!cropImage}>
          Toggle draw
        </button>
        <button onClick={clear} disabled={!cropImage}>
          Clear
        </button>
        <button onClick={undo} disabled={!cropImage}>
          Undo
        </button>
        <button onClick={redo} disabled={!cropImage}>
          Redo
        </button>
        <button onClick={toggleSize} disabled={!cropImage}>
          ToggleSize
        </button>
        <button onClick={removeSelectedObject} disabled={!cropImage}>
          Delete
        </button>
        <button onClick={(e) => setCropImage(!cropImage)}>Crop</button>
        <label disabled={!cropImage}>
          <input
            disabled={!cropImage}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button onClick={exportSVG} disabled={!cropImage}>
          {" "}
          ToSVG
        </button>
        <button onClick={fromSvg} disabled={!cropImage}>
          fromsvg
        </button>

        <button onClick={addImage} disabled={!cropImage}>
          Add image
        </button>

        <button onClick={toFront} disabled={!cropImage}>
          To Front
        </button>

        <button onClick={toBack} disabled={!cropImage}>
          To Back
        </button>

        <button onClick={toJson} disabled={!cropImage}>
          To JSON
        </button>

        <div
          style={{
            border: `1px ${!cropImage ? "dotted" : "solid"} Green`,
            width: "750px",
            height: "400px"
          }}
        >
          <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </div>
      </div>
      <div>
        <div>
          <label for="text-lines-bg-color">Text Size :</label>
          <input
            onChange={(e) => changeBackgroundText(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <label>Change Font Style</label>
          <select onChange={(e) => changeFontStyle(e.target.value)}>
            <option></option>
            <option value="normal">normal</option>
            <option value="italic">italic</option>
          </select>
        </div>

        <div>
          <label>Change Font Type</label>
          <select onChange={(e) => changeFontType(e.target.value)}>
            <option></option>
            <option value="bold">bold</option>
            <option value="normal">normal</option>
          </select>
        </div>

        <div>
          <label for="text-lines-bg-color">Change lineheight of text</label>
          <input
            onChange={(e) => changeLineHeight(e.target.value)}
            type="text"
          />
        </div>
      </div>
    </>
  );
}
