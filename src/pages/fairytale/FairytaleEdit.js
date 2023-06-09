import * as React from 'react';
import Moveable from 'react-moveable';
import keycon from 'keycon';
import styled, { css } from 'styled-components';
import { throttle } from '@daybrush/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Container = styled.div`
    display: flex;
    position: relative;
`;
const Nav = styled.div`
    width: 5%;
    margin-top: 10%;
`;
const ButtonFunction = styled.div`
    width: 15%;
    height: 100vh;
    left: 128px;
    background: black;
    display: show;
`;
const Button = styled.button`
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
const Frame = styled.div`
    position: relative;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
`;
const Canverce = styled.div`
    background: pink;
    position: relative;
    align-items: center;
    height: 80vh;
`;
const Page = styled.div`
    background: red;
    flex-direction: column;
    height: 20vh;
`;

function FairytaleEdit() {
    const [showButtonFunction, setShowButtonFunction] = React.useState(false);
    const [buttonClicked, setButtonClicked] = React.useState(false);
    const [activeButton, setActiveButton] = React.useState(null);
    const printRef = React.useRef();

    const buttonLabels = ['그림', '배경', '글꼴', '채도', '스티커'];

    const handleButtonClick = (label) => {
        setButtonClicked(!buttonClicked);
        setActiveButton(label === activeButton ? null : label);

        if (label === '배경') {
            console.log(label);
            const randomColor = getRandomColor();
            const buttonFunctionDiv = document.querySelector('.background');

            if (buttonFunctionDiv) {
                buttonFunctionDiv.style.background = randomColor;
            }
        } else if (label === '그림') {
            handleExportPDF();
        } else {
            setShowButtonFunction(!showButtonFunction);
        }
    };

    const handleDownloadImage = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, {
            backgroundColor: 'none',
            logging: true,
            useCORS: true,
        });

        const data = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            console.log('');
            link.download = 'image.jpg';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleExportPDF = () => {
        // Canverce 컴포넌트를 HTML 요소로 변환합니다.
        const canverceElement = document.getElementById('canverce');

        // html2canvas을 사용하여 Canverce 컴포넌트의 스크린샷을 생성합니다.
        html2canvas(canverceElement).then((canvas) => {
            // 스크린샷을 이미지 데이터로 변환합니다.
            const imageData = canvas.toDataURL('image/png');

            // jspdf를 사용하여 PDF 문서를 생성합니다.
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // 이미지를 PDF에 추가합니다.
            pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // PDF를 다운로드합니다.
            pdf.save('exported.pdf');
        });
    };

    return (
        <div>
            <Container>
                <Nav>
                    {buttonLabels.map((label) => (
                        <Button
                            key={label}
                            clicked={buttonClicked && activeButton === label}
                            onClick={() => handleButtonClick(label)}
                        >
                            {label}
                        </Button>
                    ))}
                </Nav>
                <ButtonFunction style={{ display: showButtonFunction ? 'block' : 'none' }}></ButtonFunction>
                <Frame>
                    <Canverce>
                        <div
                            ref={printRef}
                            class="background"
                            style={{
                                width: `80%`,
                                height: '90%',
                                backgroundColor: `white`,
                                border: '1px solid black',
                                top: `auto`,
                                left: `10%`,
                                position: `absolute`,
                                marginTop: `2%`,
                            }}
                        >
                            <img
                                className="target resizable"
                                style={{
                                    position: 'absolute',
                                    width: '200px',
                                    height: '100px',
                                    top: '50px',
                                }}
                                src="/images/sad_face.png"
                            ></img>

                            <Moveable
                                target={'.target.resizable'}
                                resizable={true}
                                // keepRatio={true}
                                draggable={true}
                                rotatable={true}
                                snappable={true}
                                bounds={{ left: 0, top: 0, bottom: 0, right: 0, position: 'css' }}
                                onResizeStart={(e) => {
                                    e.setFixedDirection([0, 0]);
                                }}
                                onDrag={(e) => {
                                    e.target.style.transform = e.transform;
                                }}
                                onBeforeResize={(e) => {
                                    if (keycon.global.shiftKey) {
                                        e.setFixedDirection([-1, -1]);
                                    } else {
                                        e.setFixedDirection([0, 0]);
                                    }
                                }}
                                onResize={(e) => {
                                    e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
                                    e.target.style.transform = e.drag.transform;
                                }}
                                onBeforeRotate={(e) => {
                                    e.setRotation(throttle(e.rotation, 45));
                                }}
                                onRotate={(e) => {
                                    e.target.style.transform = e.drag.transform;
                                }}
                            />
                        </div>
                    </Canverce>
                    <Page>
                        <button type="button" onClick={handleDownloadImage}>
                            Download as Image
                        </button>
                    </Page>
                </Frame>
            </Container>
        </div>
    );
}

export default FairytaleEdit;
