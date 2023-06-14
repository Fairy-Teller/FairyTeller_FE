import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { call } from '../service/ApiService';
import { ImageState, StoryState } from '../recoil/Fairytailstate';
import { fabric } from 'fabric';

const canvasWidth = 1280;
const canvasHeight = 720;

const CanvasFabric = () => {
    const [fabricObjects, setFabricObjects] = useState([]);
    const [storyText, setStoryText] = useRecoilState(StoryState);
    const [imgURL, setImgURL] = useRecoilState(ImageState);
    const [canvas, setCanvas] = useState(null);
    const SRC_LINK = '/images/img-default.png';
    const [contentImg, setContentImg] = useState(SRC_LINK);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        cinit();
    }, [contentImg]);

    console.log('랜더링이 몇번 되는가?');

    const init = async () => {
        try {
            await getNewest();
            await sendText();
        } catch (error) {
            console.log(error);
        }
    };

    const cinit = () => {
        const canvas = new fabric.Canvas('c', {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: 'pink',
            opacity: 0.5,
        });

        const deftxt1 = new fabric.Text(storyText, { left: 50, top: 140 });
        canvas.add(deftxt1);

        var rect1 = new fabric.Rect({
            width: 200,
            height: 100,
            left: 700,
            top: 50,
            angle: 30,
            fill: 'rgba(255,0,0,0.5)',
        });

        var rect3 = new fabric.Rect({
            width: 50,
            height: 100,
            left: 975,
            top: 350,
            angle: 45,
            stroke: '#eee',
            strokeWidth: 10,
            fill: 'rgba(0,0,200,0.5)',
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

        canvas.add(rect1, rect3, circle, triangle);

        fabric.Image.fromURL(contentImg, (defimg) => {
            console.log('contentImg 상태 >>>>>>>>>>>', contentImg);
            if (defimg == null) {
                alert('Error: No Default Image');
            } else {
                defimg.scale(0.75);
                canvas.add(defimg);
                setImgURL(defimg.toDataURL()); // 이미지 URL을 저장
                canvas.renderAll();
            }
        });

        const onChangeDetect = (options) => {
            options.target.setCoords();
            canvas.forEachObject((obj) => {
                if (obj === options.target) return;
                obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.75 : 1);
            });
        };

        canvas.on({
            'object:moving': onChangeDetect,
            'object:scaling': onChangeDetect,
            'object:rotating': onChangeDetect,
        });

        setCanvas(canvas);
    };

    const getNewest = async () => {
        try {
            const data = await call('/book/my-newest', 'GET', null);
            setStoryText(data.fullStory);
            setImgURL(data.thumbnailUrl);
            console.log(storyText);
            console.log(imgURL.url);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const sendText = async () => {
        try {
            const response = await call('/chat-gpt/summarize', 'POST', { text: storyText });
            const imageData = response; // 응답 데이터 - Base64 문자열
            const byteCharacters = atob(imageData); // Base64 디코딩
            const byteArrays = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays[i] = byteCharacters.charCodeAt(i);
            }
            const imageBlob = new Blob([byteArrays], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setContentImg(imageUrl);
            setImgURL(imageUrl);
            // set(ImageState, { url: imageUrl });
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const bringToFront = (e) => {
        e.preventDefault();
        let activeObj = canvas.getActiveObject();
        activeObj && canvas.bringToFront(activeObj).discardActiveObject(activeObj).renderAll();
    };

    const exportSVG = (e) => {
        e.preventDefault();
        fabric.log('Normal SVG output: ', canvas.toSVG());
    };

    const addRect = () => {
        const rect = new fabric.Rect({
            height: 30,
            width: 300,
            fill: 'yellow',
        });
        canvas.add(rect);
        setFabricObjects([...fabricObjects, rect]);
        canvas.renderAll();
    };

    const addImg = (e) => {
        e.preventDefault();
        new fabric.Image.fromURL(imgURL, (img) => {
            img.scale(0.75);
            canvas.add(img);
            setFabricObjects([...fabricObjects, img]);
            setImgURL('');
        });
        canvas.renderAll();
    };

    return (
        <div>
            <canvas id="c" />
        </div>
    );
};

export default CanvasFabric;
