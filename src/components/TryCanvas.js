import React, { useEffect, useState, useRef } from 'react';

import { atomFamily, useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';
import { SelectStickers, SaveState, Canvasexport } from '../recoil/Fairytailstate';

import styled, { css } from 'styled-components';
import { fabric } from 'fabric';

import PageSelection from '../components/PageSelection';

const [IMAGE, USERIMAGE, BG, FILTER, STICKER, DOWNLOAD] = [
    'AI삽화',
    '유저이미지',
    '텍스트',
    '삭제',
    '스티커',
    '다운로드',
];
const [AI, USER, STI] = ['AI', 'USER', 'STI'];

const canvasState = atomFamily({
    key: 'canvasState',
    default: null,
});
const Container = styled.div`
    display: flex;

    height: 100vh;
`;

const Nav = styled.nav`
    width: 5vw;

    height: 100vh;
    flex-direction: column;
    background-color: #d9d9d9;
`;
const Tab = styled.button`
    width: 100%;
    margin-top: 4px;
    height: 9%;
    top: 216px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    ${({ clicked }) =>
        clicked &&
        css`
            background-color: black;
            color: white;
        `}
`;
const Tooltab = styled.div`
    width: calc(95vw - 1280px);
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    background-color: rgba(217, 217, 217, 0.4);
    ${({ visible }) =>
        !visible &&
        css`
            display: none;
        `}
`;

const TryCanvas = (props) => {
    const btnLabels = [IMAGE, USERIMAGE, BG, FILTER, STICKER, DOWNLOAD];
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

    const [canvas, setCanvas] = useState();
    const [showEditToolTab, setShowEditToolTab] = useState(false); // Add new state variable

    const handleButtonClick = (label) => {
        setActiveTab(label === activeTab ? null : label);
        setShowButtonFunctiontion(!showButtonFunction);
        if (label === BG) {
            addTextBox();
        }
        if (label === FILTER) {
            deleteObject();
        }
        if (label === STICKER) {
            setShowEditToolTab(true);
        } else {
            setShowEditToolTab(false);
        }
        if (label === DOWNLOAD) {
            saveAsImage('jpeg');
        }
    };

    useEffect(() => {
        const initializedCanvas = initCanvas();
        setCanvas(initializedCanvas);
        resetCanvasexport();
    }, []);
    useEffect(() => {
        if (saveState == 'save') {
            saveAsImage('jpeg');
        }
    }, [saveState]);

    // 캔버스 세팅
    const initCanvas = () => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            height: 500,
            width: 1280,
            backgroundColor: '#D9D9D9',
        });
        canvas.state = [];
        canvas.index = 0;
        canvas.stateaction = true;

        var text = new fabric.Textbox(props.props + '번 시나리오 넣을 부분', {
            selectable: true,
        });
        canvas.add(text);
        return canvas;
    };

    // 텍스트 박스
    const addTextBox = () => {
        var text = new fabric.Textbox('텍스트를 추가하세요', {
            selectable: true,
        });
        canvas.add(text);
    };

    // 삭제
    const deleteObject = () => {
        canvas.remove(canvas.getActiveObject());
    };

    // 파일 불러와서 이미지 첨부
    const readImage = (e) => {
        var file = e.target.files[0];

        var reader = new FileReader();
        reader.onload = function (f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function (img) {
                var oImg = img.set({
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
            item + '?timestamp=' + new Date().getTime(),
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

            { crossOrigin: 'anonymous' }
        );
    };

    // 이미지 저장하기
    const saveAsImage = (format) => {
        if (canvas) {
            const dataURL = canvas.toDataURL({
                width: canvas.width,
                height: canvas.height,
                left: 0,
                top: 0,
                format: format,
            });
            const link = document.createElement('a');

            // link.download = `${props.props}image.${format}`;
            // link를 디비로 보내야 합니다.

            link.href = dataURL;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setCanvasExport((prev) => [...prev, { id: props.props, img: link.href }]);
        } else {
            console.log('없나?');
        }
    };

    return (
        <Container>
            <Nav>
                {btnLabels.map((label) => (
                    <Tab key={label} clicked={activeTab === label} onClick={() => handleButtonClick(label)}>
                        <h2>{label}</h2>
                    </Tab>
                ))}
            </Nav>

            <Tooltab visible={activeTab === STICKER}>
                {selectStickers.map((item) =>
                    selectStickers.length > 0 ? (
                        <PageSelection
                            idx={item.id}
                            src={item.src}
                            onClick={(e) => {
                                selectStickersShow(item.src);
                            }}
                        />
                    ) : (
                        <div>가져오는 중...</div>
                    )
                )}
            </Tooltab>
            <Tooltab visible={activeTab === USERIMAGE}>
                <input type="file" id="file" onChange={readImage} />
            </Tooltab>

            <canvas id="canvas" key={props.canvasid + 'c'} ref={canvasRef} />
        </Container>
    );
};

export default TryCanvas;
