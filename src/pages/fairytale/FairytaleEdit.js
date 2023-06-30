import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { SaveState, TitleSave } from '../../recoil/FairytaleState';
import { call } from '../../service/ApiService';
import { history } from '../../history/history';
import styled, { css } from 'styled-components';
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

const FairytaleEdit = () => {
    const [saveAll, setSaveall] = useState(false);

    const [showImage, setShowImage] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const saveState = useResetRecoilState(SaveState);
    const [titleSave, setTitleSave] = useRecoilState(TitleSave);
    const [canvasVisibility, setCanvasVisibility] = useState({
        1: true,
    });

    const addCanvasVisibilityValue = (page) => {
        setCanvasVisibility((prevState) => {
            return {
                ...prevState,
                [page]: false,
            };
        });
    };

    const toggleCanvasVisibility = (id) => {
        setActiveTab(id);
        setCanvasVisibility((prevState) => {
            const updatedVisibility = { ...prevState };

            Object.keys(updatedVisibility).forEach((key) => {
                updatedVisibility[key] = Number(key) === id ? true : false;
            });
            return updatedVisibility;
        });
        console.log('id', id, activeTab);
    };
    console.log(canvasVisibility);

    useEffect(() => {
        getNewest();
        window.scrollTo(0, 0);
    }, []);

    const getNewest = async () => {
        try {
            const data = await call('/book/my-newest', 'GET', null);
            setShowImage(data);
            if (data.pages.length > 1) {
                for (let i = 2; i <= data.pages.length; i++) {
                    addCanvasVisibilityValue(i);
                }
            }

            console.log('data', data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const usePreventGoBack = () => {
        const preventGoBack = () => {
            history.push(null, '', history.location.href);
            alert('현재 화면에서 이탈 시 생성된 데이터가 모두 사라집니다.');
        };

        useEffect(() => {
            (() => {
                history.push(null, '', history.location.href);
                window.addEventListener('popstate', preventGoBack);
            })();

            return () => {
                window.removeEventListener('popstate', preventGoBack);
            };
        }, []);

        useEffect(() => {
            history.push(null, '', history.location.href);
        }, [history.location]);
    };

    const usePreventRefresh = () => {
        const preventClose = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        useEffect(() => {
            (() => {
                window.addEventListener('beforeunload', preventClose);
            })();

            return () => {
                window.removeEventListener('beforeunload', preventClose);
            };
        });
    };

    usePreventGoBack();
    usePreventRefresh();

    const saveClick = () => {
        setSaveall(true);
        setTitleSave(false);
    };

    return (
        <div className="edit">
            <Header />
            <Savebutton onClick={saveClick}>완성하기</Savebutton>
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
