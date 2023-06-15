import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const TryCanvas = (props) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1280,
      hieght: 720,
      backgroundColor: "ivory",
      opacity: 0.01,
    });

    var rect1 = new fabric.Rect({
      width: 200,
      height: 100,
      left: 700,
      top: 50,
      angle: 30,
      fill: "rgba(255,0,0,0.5)",
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
      left: 50,
      top: 100,
      fill: "#cca",
    });

    fabricCanvas.add(rect1, circle, triangle);
    fabricCanvasRef.current = fabricCanvas; // Store fabric.Canvas instance in ref
  }, []);

  return (
    <canvas
      id={props.canvasid}
      ref={canvasRef}
    />
  );
};

export default TryCanvas;
