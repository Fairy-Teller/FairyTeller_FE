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

    const sampleDataStucure = useRecoilValue(SampleDataState);
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
        console.log(canvasVisibility);
    };

    const [canvasWidth, canvasHeight] = [1280, 720];

    const saveClick = () => {
        setSaveall(true);
    };

    return (
        <div className="edit">
            <Container>
                <Frame>
                    <div
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            display: canvasVisibility[1] ? 'block' : 'none',
                        }}
                    >
                        <TryCanvas props={1} />
                    </div>
                    <div
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            display: canvasVisibility[2] ? 'block' : 'none',
                        }}
                    >
                        <TryCanvas props={2} />
                    </div>
                    <div
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            display: canvasVisibility[3] ? 'block' : 'none',
                        }}
                    >
                        <TryCanvas props={3} />
                    </div>
                    <div
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            display: canvasVisibility[4] ? 'block' : 'none',
                        }}
                    >
                        <TryCanvas props={4} />
                    </div>
                    <div
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            display: canvasVisibility[5] ? 'block' : 'none',
                        }}
                    >
                        <TryCanvas props={5} />
                    </div>

                    <PageSelectionFrame>
                        {sampleDataStucure[0].pages.map((item) =>
                            sampleDataStucure[0].pages.length > 0 ? (
                                <PageSelection
                                    idx={item.id}
                                    src={item.src}
                                    onClick={(e) => {
                                        toggleCanvasVisibility(item.id);
                                    }}
                                    style={{
                                        border: '20px solid red',
                                    }}
                                />
                            ) : (
                                <div>가져오는 중...</div>
                            )
                        )}
                    </PageSelectionFrame>
                </Frame>

                {saveAll && <TitleModal />}
                <Savebutton onClick={saveClick}>동화 완성하기</Savebutton>
            </Container>
        </div>
    );
};

export default FairytaleEdit;
