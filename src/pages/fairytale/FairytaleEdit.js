import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { call } from '../../service/ApiService';
import styled, { css } from 'styled-components';

import TryCanvas from '../../components/TryCanvas';
import TitleModal from './TitleModal';

import PageSelectionFrame from '../../components/PageSelectionFrame';
import PageSelection from '../../components/PageSelection';

import { SampleDataState, SaveState } from '../../recoil/Fairytailstate';
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';

const NULL = 'NULL';
const Container = styled.div`
    display: flex;
    position: relative;
`;

const Frame = styled.div`
    position: relative;
    width: 95vw;
    // height: 100vh;
`;

const Savebutton = styled.button`
    width: 362px;
    height: 83px;
    border-radius: 10px;
    background: #80f06e;
    margin-top: 28px;
    margin-right: 38px;
    font-size: 30px;
`;

const FairytaleEdit = () => {
    const [canvasVisibility, setCanvasVisibility] = useState({
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
    });
    const [saveAll, setSaveall] = useState(false);
    const [showImage, setShowImage] = useState([]);

    const sampleDataStucure = useRecoilValue(SampleDataState);
    const setSampleDataState = useSetRecoilState(SampleDataState);
    const saveState = useResetRecoilState(SaveState);

    const toggleCanvasVisibility = (id) => {
        setCanvasVisibility((prevState) => {
            const updatedVisibility = { ...prevState };
            Object.keys(updatedVisibility).forEach((key) => {
                updatedVisibility[key] = key == id ? true : false;
            });
            return updatedVisibility;
        });

        console.log(id);
    };
    useEffect(() => {
        getNewest();
    }, []);

    const getNewest = async () => {
        try {
            const data = await call('/book/my-newest', 'GET', null);
            await setShowImage(data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const [canvasWidth, canvasHeight] = [1280, 720];
    console.log(canvasVisibility);
    const saveClick = () => {
        setSaveall(true);
    };
    console.log(showImage);

    return (
        <div className="edit">
            <Container>
                <Frame>
                    {Object.keys(canvasVisibility).map((key) => (
                        <div
                            key={key}
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                display: canvasVisibility[key] ? 'block' : 'none',
                            }}
                        >
                            <TryCanvas props={Number(key)} BookInfo={showImage} />
                        </div>
                    ))}

                    <PageSelectionFrame>
                        {showImage.pages && showImage.pages.length > 0 ? (
                            showImage.pages.map((page, index) => (
                                <PageSelection
                                    key={index}
                                    idx={page.pageNo}
                                    src={'https://s3.ap-northeast-2.amazonaws.com/' + page.originalImageUrl}
                                    onClick={() => toggleCanvasVisibility(page.pageNo)}
                                    style={{
                                        border: '20px solid red',
                                    }}
                                />
                            ))
                        ) : (
                            <div>가져오는 중...</div>
                        )}
                    </PageSelectionFrame>
                </Frame>

                {saveAll && <TitleModal props={showImage.bookId} />}
                <Savebutton onClick={saveClick}>동화 완성하기</Savebutton>
            </Container>
        </div>
    );
};

export default FairytaleEdit;
