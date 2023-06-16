import React, { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { atomFamily, useRecoilState } from 'recoil';

const canvasState = atomFamily({
    key: 'canvasState',
    default: null,
});

const TryCanvas = (props) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    // const [canvasStates, setCanvasStates] = useState({});

    const [savedCanvasState, setSavedCanvasState] = useRecoilState(canvasState(props.canvasid));

    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 1280,
            height: 500,
            backgroundColor: props.bgcolor,
        });

        if (savedCanvasState) {
            fabricCanvas.loadFromJSON(savedCanvasState);
        }

        var rect1 = new fabric.Rect({
            width: 200,
            height: 100,
            left: 700,
            top: 50,
            angle: 30,
            fill: 'rgba(255,0,0,0.5)',
        });

        var circle = new fabric.Circle({
            radius: 50,
            left: 975,
            top: 75,
            fill: '#aac',
        });

        var triangle = new fabric.Triangle({
            width: 100,
            height: 100,
            left: 550,
            top: 300,
            fill: '#cca',
        });

        fabricCanvas.add(rect1, circle, triangle);
        fabricCanvasRef.current = fabricCanvas;

        return () => {
            // setCanvasStates((prevStates) => ({
            //   ...prevStates,
            //   [props.canvasid]: fabricCanvas.toJSON(),
            // }));
            console.log('언마운트', fabricCanvas.toJSON());
        };
    }, []);

    return <canvas key={props.canvasid + 'c'} id={props.canvasid} ref={canvasRef} />;
};

export default TryCanvas;
