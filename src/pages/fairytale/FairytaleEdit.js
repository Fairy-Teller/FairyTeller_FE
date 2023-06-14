import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { RecoilRoot } from 'recoil';
import EditToolTab from '../../components/EditToolTab';
import CanvasFabric from '../../components/CanvasFabric';
import html2canvas from 'html2canvas';
import { call } from '../../service/ApiService';

const NULL = 'NULL';

const [IMAGE, USERIMAGE, BG, TEXT, FILTER, STICKER, DOWNLOAD] = [
    'AI삽화',
    '유저이미지',
    '배경',
    '텍스트',
    '채도',
    '스티커',
    '다운로드',
];
const [AI, USER, STI] = ['AI', 'USER', 'STI'];
const SRC_LINK = '/images/img-default.png';
const STI_LINKS = [
    { key: 1, link: '/images/st1.png' },
    { key: 2, link: '/images/st2.png' },
    { key: 3, link: '/images/st3.png' },
];

const Container = styled.div`
    display: flex;
    position: relative;
`;
const Nav = styled.nav`
    width: 5vw;
    display: flex;
    flex-direction: column;
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
const Frame = styled.div`
    position: relative;
    width: 95vw;
    // height: 100vh;
`;
const Canvas = styled.canvas`
    width: 100%;
    height: 100%;
`;
const PageFrame = styled.div`
    background-color: red;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20vh;
    padding: 10px 10% 0 5%;
`;
const Page = styled.div`
    background-color: white;
    width: 10vw;
    height: 16vh;
    margin-left: 5%;
`;
const NextPage = styled.button`
    background-color: white;
    width: 10vw;
    height: 16vh;
    margin-left: 5%;
    border-radius: 700px;
`;

const classNameCleaner = (str) => {
    let arr = document.querySelectorAll('.' + str);
    for (let i = 0; i < arr.length; i++) {
        arr[i].classList.remove(str);
    }
};

const TitleInputWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const TitleInput = styled.input`
    width: 150px;
    height: 30px;
`;

//   const [fabricObjects, setFabricObjects] = useRecoilState(fabricObjectsState);

function FairytaleEdit() {
    const btnLabels = [IMAGE, USERIMAGE, BG, TEXT, FILTER, STICKER, DOWNLOAD];
    const imgLabels = [AI, USER, STI];

    const printRef = React.useRef();

    const [showButtonFunction, setShowButtonFunctiontion] = useState(false);
    // const [buttonClicked, setButtonClicked] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [selectedSti, setSelectedSti] = useState(NULL);
    const [imageLink, setimageLink] = useState(NULL);
    const [title, setTitle] = useState('');

    const handlehowTitleInpuClick = () => {
        setActiveTab(null);
        // Perform additional actions here if needed
    };

    const [canvasWidth, canvasHeight] = [1280, 720];

    useEffect(() => {
        if (imageLink !== NULL) {
            fetchData();
        }
    }, [imageLink]);

    const handleButtonClick = (label) => {
        // setButtonClicked(!buttonClicked);
        setActiveTab(label === activeTab ? null : label);
        // if (label === BG) {
        //   // setActiveTab(null);
        // } else {
        setShowButtonFunctiontion(!showButtonFunction);
        // }
    };

    const handleDownloadImage = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, {
            backgroundColor: 'none',
            logging: true,
            useCORS: true,
        });

        const data = canvas.toDataURL('image/jpg');
        setimageLink(data);
    };

    const fetchData = async () => {
        try {
            console.log(imageLink);
            await call('/book/create/final', 'POST', {
                bookId: '172',
                title: title,
                thumbnailUrl: imageLink,
            });
            window.location.href = '/f-export';
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImportFile(file);
    };

    const [tarIdx, setTarIdx] = useState(1);
    const [targets, setTargets] = useState([{ key: 0, class: 'target0', src: SRC_LINK, label: AI }]); // DEFAULT: parsed AI illustration

    const handleCreate = () => {
        setTarIdx((prev) => prev + 1);
        setTargets(
            selectedSti !== NULL
                ? [...targets, { key: tarIdx, class: `target${tarIdx}`, src: selectedSti, label: STI }]
                : importFile !== NULL
                ? [
                      ...targets,
                      {
                          key: tarIdx,
                          class: `target${tarIdx}`,
                          src: URL.createObjectURL(importFile),
                          label: USERIMAGE,
                      },
                  ]
                : [...targets, { key: tarIdx, class: `target${tarIdx}`, src: SRC_LINK, label: AI }]
        );
        setSelectedSti(NULL);
        classNameCleaner('selected');
        setImportFile(null);
    };

    const handleDelete = (clicked) => {
        const updated_targets = [...targets].filter((item) => item.class !== clicked);
        setTargets(updated_targets);
    };

    const handleStiSelect = (ele, elename, src) => {
        if (ele.classList.contains('selected')) {
            setSelectedSti((prev) => {
                return NULL;
            });
            classNameCleaner('selected');
        } else {
            classNameCleaner('selected');
            ele.classList.add('selected');
            setSelectedSti((prev) => {
                return src;
            });
        }
    };
    const nextPage = async () => {
        await handleDownloadImage();
    };

    // const HandleRandomBg = () => {
    //   useEffect(() => {
    //     const letters = "0123456789ABCDEF";
    //     let result = "#";
    //     for (let i = 0; i < 6; i++) {
    //       result += letters[Math.floor(Math.random() * 16)];
    //     }
    //     setBgColor(result);
    //     const buttonFunctionDiv = document.querySelector("#c");
    //     if (buttonFunctionDiv) {
    //       buttonFunctionDiv.style.background = result;
    //     }
    //   });
    // };

    return (
        <div>
            <Container>
                <Nav>
                    {btnLabels.map((label) => (
                        <Tab
                            key={label}
                            clicked={activeTab === label} // buttonClicked && activeTab
                            onClick={() => handleButtonClick(label)}
                        >
                            <h2>{label}</h2>
                        </Tab>
                    ))}
                </Nav>
                <Frame>
                    <div
                        ref={printRef}
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            marginLeft: '15%',
                            marginTop: '0.5%',
                        }}
                    >
                        <CanvasFabric />
                    </div>

                    <div id="edit-tools">
                        {activeTab === IMAGE && (
                            <EditToolTab title={IMAGE}>
                                {/* <button onClick={undo}>Undo</button>
                  <button onClick={redo}>Redo</button> */}
                            </EditToolTab>
                        )}
                        {activeTab === USERIMAGE && <EditToolTab title={USERIMAGE}></EditToolTab>}
                        {activeTab === BG && (
                            <EditToolTab title={BG}>
                                <button
                                    className="create-button"
                                    // onClick={() => {
                                    //   HandleRandomBg();
                                    // }}
                                    style={{
                                        width: '200px',
                                        height: '50px',
                                        display: 'block',
                                        backgroundColor: 'lightGray',
                                        borderRadius: '25%',
                                    }}
                                >
                                    handleRandomBg
                                </button>
                            </EditToolTab>
                        )}
                        {activeTab === TEXT && (
                            <TitleInputWrapper style={{ border: '4px solid black' }}>
                                <TitleInput
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="제목을 입력해 주세요"
                                    style={{ width: '700px', height: '100px' }}
                                />
                                <button
                                    className="create-button"
                                    onClick={handlehowTitleInpuClick}
                                    style={{
                                        width: '700px',
                                        height: '50px',
                                        display: 'block',
                                        backgroundColor: 'lightGray',
                                    }}
                                >
                                    Submit
                                </button>
                            </TitleInputWrapper>
                        )}
                        {activeTab === FILTER && <EditToolTab title={FILTER}></EditToolTab>}
                        {activeTab === STICKER && (
                            <EditToolTab title={STICKER}>
                                <ul>
                                    {STI_LINKS.map((item) => (
                                        <li
                                            key={item.key}
                                            onClick={(e) => {
                                                handleStiSelect(e.target, e.target.className, item.link);
                                            }}
                                        >
                                            <img
                                                className={'sti' + item.key}
                                                src={item.link}
                                                alt={STI}
                                                style={{ width: '200px', height: '100px' }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="create-button"
                                    onClick={() => {
                                        handleCreate();
                                    }}
                                    style={{
                                        width: '200px',
                                        height: '50px',
                                        display: 'block',
                                        backgroundColor: 'lightGray',
                                        borderRadius: '25%',
                                    }}
                                >
                                    Create Target
                                </button>
                            </EditToolTab>
                        )}
                        {activeTab === DOWNLOAD && (
                            <EditToolTab title={DOWNLOAD}>
                                <button
                                    className="create-button"
                                    type="button"
                                    onClick={() => {
                                        handleDownloadImage();
                                    }}
                                    style={{
                                        width: '200px',
                                        height: '50px',
                                        display: 'block',
                                        backgroundColor: 'lightGray',
                                        borderRadius: '25%',
                                    }}
                                >
                                    DownloadImage
                                </button>
                            </EditToolTab>
                        )}
                    </div>
                    <PageFrame>
                        <Page>1</Page>
                        <Page>2</Page>
                        <Page>3</Page>
                        <Page>4</Page>
                        <Page>5</Page>
                        <NextPage onClick={nextPage}>next</NextPage>
                    </PageFrame>
                </Frame>
            </Container>
        </div>
    );
}

export default FairytaleEdit;
