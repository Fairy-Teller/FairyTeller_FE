import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { call } from '../../service/ApiService';
import styled, { css } from 'styled-components';

import TryCanvas from '../../components/TryCanvas';

import PageSelectionFrame from '../../components/PageSelectionFrame';
import PageSelection from '../../components/PageSelection';

import { SampleDataState, SaveState } from '../../recoil/Fairytailstate';
import { useRecoilValue, useSetRecoilState } from 'recoil';

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

const FairytaleEdit = () => {
    const [canvasVisibility, setCanvasVisibility] = useState({
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const sampleDataStucure = useRecoilValue(SampleDataState);
    const saveState = useSetRecoilState(SaveState);

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
    const navigate = useNavigate();
    const dddd = () => {
        // navigate('/start');
        saveState('save');
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
                            backgroundColor: 'pink',
                        }}
                    >
                        <TryCanvas props={1} />
                    </div>
                    <div
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            display: canvasVisibility[2] ? 'block' : 'none',
                            backgroundColor: 'black',
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
                                />
                            ) : (
                                <div>가져오는 중...</div>
                            )
                        )}
                    </PageSelectionFrame>
                </Frame>
                <button onClick={dddd}>언마운트!</button>
            </Container>
        </div>
    );
};

export default FairytaleEdit;
