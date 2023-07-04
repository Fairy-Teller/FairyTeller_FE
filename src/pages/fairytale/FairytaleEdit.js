import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BookId, TitleSave } from '../../recoil/FairytaleState';
import { getBookByIdTemp } from '../../service/FairytaleService';
import styled, { keyframes } from 'styled-components';
import Canvas from '../../components/Canvas';
import TitleModal from '../../components/TitleModal';
import Header from '../../components/global/Header';
import PageSelectionFrame from '../../components/PageSelectionFrame';
import PageSelection from '../../components/PageSelection';

const Frame = styled.div`
    height: calc(100vh - 2.4rem);
`;
const FrameInner = styled.div``;
const Savebutton = styled.button`
    height: 16rem;
    width: 4.8rem;
    padding: 1.2rem 1.6rem;
    margin: 0;
    box-sizing: border-box;
    font-size: 1.6rem;
    position: fixed;
    top: 4.8rem;
    right: 2.4rem;
    border-radius: 1.2rem;
    background-color: white;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
    z-index: 98;
`;

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 0;
    }
`;

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
`;

const AnimatedTempAlert = styled.div`
    position: absolute;
    width: 250px;
    height: 50px;
    top: 4.8rem;
    right: 2.4rem;
    font-size: 20px;
    text-align: center;
    background: #fe5c6b;
    box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.25);
    border-radius: 183px;
    z-index: 100;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${(props) => (props.show ? 1 : 0)};

    animation: ${(props) => (props.show ? fadeIn : fadeOut)} 2s ease;
`;

const FairytaleEdit = () => {
    const [saveAll, setSaveAll] = useState(false);
    const [showImage, setShowImage] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [titleSave, setTitleSave] = useRecoilState(TitleSave);
    const [canvasVisibility, setCanvasVisibility] = useState({
        1: true,
    });
    const bookIdshow = useRecoilValue(BookId);
    const [showTempAlert, setShowTempAlert] = useState(false);

    const addCanvasVisibilityValue = (page) => {
        setCanvasVisibility((prevState) => ({
            ...prevState,
            [page]: false,
        }));
    };

    const toggleCanvasVisibility = (id) => {
        setActiveTab(id);
        setCanvasVisibility((prevState) => {
            const updatedVisibility = {};

            for (let key in prevState) {
                updatedVisibility[key] = Number(key) === id;
            }

            return updatedVisibility;
        });
    };

    useEffect(() => {
        getNewest();
        window.scrollTo(0, 0);

        const showTimeout = setTimeout(() => {
            setShowTempAlert(true);
            const hideTimeout = setTimeout(() => {
                setShowTempAlert(false);
            }, 5000);
            return () => clearTimeout(hideTimeout);
        }, 20000);

        const interval = setInterval(() => {
            clearTimeout(showTimeout);
            setShowTempAlert(true);
            const hideTimeout = setTimeout(() => {
                setShowTempAlert(false);
            }, 5000);
            return () => clearTimeout(hideTimeout);
        }, 20000);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(interval);
        };
    }, []);

    const getNewest = async () => {
        try {
            const data = await getBookByIdTemp({ bookId: bookIdshow });
            setShowImage(data);
            if (data.pages.length > 1) {
                for (let i = 2; i <= data.pages.length; i++) {
                    addCanvasVisibilityValue(i);
                }
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const usePreventRefresh = () => {
        const preventClose = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        useEffect(() => {
            window.addEventListener('beforeunload', preventClose);

            return () => {
                window.removeEventListener('beforeunload', preventClose);
            };
        });
    };

    usePreventRefresh();

    const saveClick = () => {
        setSaveAll(true);
        setTitleSave(false);
    };

    return (
        <div className="edit">
            <Header />
            <Savebutton onClick={saveClick}>완성하기</Savebutton>
            {showTempAlert && <AnimatedTempAlert show={showTempAlert}>임시 저장되었습니다 💾</AnimatedTempAlert>}
            <Frame>
                {Object.keys(canvasVisibility).map((key) => (
                    <FrameInner
                        key={key}
                        style={{
                            display: canvasVisibility[key] ? 'block' : 'none',
                        }}
                    >
                        <Canvas idx={Number(key)} BookInfo={showImage} />
                    </FrameInner>
                ))}

                <PageSelectionFrame>
                    {showImage.pages && showImage.pages.length > 0 ? (
                        showImage.pages.map((page, index) => (
                            <PageSelection
                                key={index}
                                idx={page.pageNo}
                                src={page.originalImageUrl}
                                onClick={() => toggleCanvasVisibility(page.pageNo)}
                            />
                        ))
                    ) : (
                        <div>가져오는 중...</div>
                    )}
                </PageSelectionFrame>
            </Frame>
            {saveAll && !titleSave && <TitleModal props={showImage.bookId} />}
        </div>
    );
};

export default FairytaleEdit;
