import React, { useState, useEffect } from "react";
import { atom } from "recoil";
import { fabric } from "fabric";

const fabricObjectsState = atom({
  key: "fabricObjectsState",
  default: [],
});

const SRC_LINK = "/images/img-default.png";
const SRC_TEXT_1 = "이것은 1번 문단\nchat gpt가 만들어준\n동화 텍스트입니다.";
const SRC_TEXT_2 = "그리고 2번 문단 chat gpt가\n만들어준 동화 텍스트입니다.";
const SRC_TEXT_3 = "마침내 3번 문단 chat\ngpt가 만들어준 동화 텍스트입니다.";
const STI_LINKS = [
  { key: 1, link: "/images/st1.png" },
  { key: 2, link: "/images/st2.png" },
  { key: 3, link: "/images/st3.png" },
];
const [canvasWidth, canvasHeight] = [1280, 720];

const CanvasFabric = () => {
  const [fabricObjects, setFabricObjects] = useState([]);
  const [text, setText] = useState("");
  const [imgURL, setImgURL] = useState(SRC_LINK);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let canvas = new fabric.Canvas("c", {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "pink",
      opacity: 0.5,
    });

    const deftxt1 = new fabric.Text(SRC_TEXT_1, { left: 50, top: 140 });
    const deftxt2 = new fabric.Text(SRC_TEXT_2, { left: 50, top: 350 });
    const deftxt3 = new fabric.Text(SRC_TEXT_3, { left: 50, top: 500 });
    canvas.add(deftxt1);
    canvas.add(deftxt2);
    canvas.add(deftxt3);

    var rect1 = new fabric.Rect({
      width: 200,
      height: 100,
      left: 700,
      top: 50,
      angle: 30,
      fill: "rgba(255,0,0,0.5)",
    });

    var rect3 = new fabric.Rect({
      width: 50,
      height: 100,
      left: 975,
      top: 350,
      angle: 45,
      stroke: "#eee",
      strokeWidth: 10,
      fill: "rgba(0,0,200,0.5)",
    });

    var circle = new fabric.Circle({
      radius: 50,
      left: 975,
      top: 75,
      fill: "#aac",
    });

    var triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      left: 550,
      top: 300,
      fill: "#cca",
    });

    canvas.add(rect1, rect3, circle, triangle);

    fabric.Image.fromURL(imgURL, (defimg, { imgsrc }) => {
      if (defimg == null) {
        alert("Error: No Default Image");
      } else {
        defimg.scale(0.75);
        canvas.add(defimg);
        setImgURL(imgsrc);
        canvas.renderAll();
      }
    });

    const onChangDetect = (options) => {
      options.target.setCoords();
      canvas.forEachObject((obj) => {
        if (obj === options.target) return;
        obj.set("opacity", options.target.intersectsWithObject(obj) ? 0.75 : 1);
      });
    };

    canvas.on({
      "object:moving": onChangDetect,
      "object:scaling": onChangDetect,
      "object:rotating": onChangDetect,
    });

    setCanvas(canvas);
  };

  const bringToFront = (e) => {
    e.preventDefault();
    let activeObj = canvas.getActiveObject();
    activeObj && canvas.bringToFront(activeObj).discardActiveObject(activeObj).renderAll();
  };

  const exportSVG = (e) => {
    e.preventDefault();
    fabric.log("Normal SVG output: ", canvas.toSVG());
  };

  const addRect = () => {
    const rect = new fabric.Rect({
      height: 30,
      width: 300,
      fill: "yellow",
    });

    canvas.add(rect);
    setFabricObjects([...fabricObjects, rect]);
    canvas.renderAll();
  };

  const addImg = (e) => {
    e.preventDefault();
    const { imgURL } = this.state;
    new fabric.Image.fromURL(imgURL, (img) => {
      img.scale(0.75);
      canvas.add(img);
      setFabricObjects([...fabricObjects, img]);
      setImgURL("");
    });
    canvas.renderAll();
  };

  const addText = (e) => {
    e.preventDefault();
    const txt = new fabric.Text(text, { left: 50, top: 50 });
    canvas.add(txt);
    setFabricObjects([...fabricObjects, txt]);
    setText("");
    canvas.renderAll();
  };

  const handleChangeText = (e) => {
    setText(e.target.value);
  };

  const handleChangeImgURL = (e) => {
    setImgURL(e.target.value);
  };

  return (
    <div>
      <canvas id='c' />
      <div>
        <button onClick={bringToFront}>Bring to front</button>
        <button onClick={exportSVG}>exportSVG</button>
        <button onClick={addRect}>Rectangle</button>
        <form onSubmit={addText}>
          <div>
            <input
              type='text'
              value={text}
              onChange={handleChangeText}
            />
            <button type='submit'>Add Text</button>
          </div>
        </form>
        <form onSubmit={addImg}>
          <div>
            <input
              type='text'
              value={imgURL}
              onChange={handleChangeImgURL}
            />
            <button type='submit'>Add Image</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CanvasFabric;
