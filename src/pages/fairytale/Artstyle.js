import React, { useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/global/Header';

import ContentCover from '../../components/global/ContentCover';
import ContentTitle from '../../components/global/ContentTitle';

import { useNavigate } from 'react-router-dom';

import { useRecoilState } from 'recoil';
import { Imagetheme } from '../../recoil/FairytaleState';

const SampleImg = styled.img`
    display: flex;
    width: 200px;
    height: 200px;
    border-radius: 50%;
`;

const StyleImg = styled.img`
    width: 350px;
    height: 350px;
    border-radius: 10%;
    border: 1px solid gray;
    margin: 10px;
`;

const SampleDiv = styled.div`
    display: flex;
    flex-direction: column; /* Set the direction to column */
    justify-content: center; /* Horizontal center alignment */
    align-items: center; /* Vertical center alignment */
`;

const StyleDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

function Artstyle() {
    const [imageState, setImageState] = useRecoilState(Imagetheme);
    const navigate = useNavigate();

    const IamgestateChange = (e) => {
        setImageState(e);
        navigate('/image-generated');
    };
    // useEffect(() => {
    //     document.body.style.overflow = 'hidden';
    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, []);
    console.log(imageState);
    return (
        <div>
            <Header mode={'default'} />
            <ContentCover>
                <SampleDiv>
                    <div style={{ margin: '1.5rem auto' }}>
                        <ContentTitle>그림체 선택</ContentTitle>
                    </div>

                    <SampleImg src="./images/artstyle/sample.png" />
                    <p style={{ margin: '5% 0 5% 0 ', textAlign: 'center' }}>
                        위 이미지를 각각의 테마별로 그려보았어요 <br />
                        마음에 드는 그림체를 선택해 보세요!
                    </p>
                </SampleDiv>
                <StyleDiv>
                    <SampleDiv>
                        <StyleImg src="./images/artstyle/style2.png" onClick={() => IamgestateChange(1)} />
                        <h2>애니메이션</h2>
                    </SampleDiv>
                    <SampleDiv>
                        <StyleImg src="./images/artstyle/style1.png" onClick={() => IamgestateChange(2)} />
                        <h2>미국 카툰</h2>
                    </SampleDiv>

                    <SampleDiv>
                        <StyleImg src="./images/artstyle/style3.png" onClick={() => IamgestateChange(3)} />
                        <h2>스케치</h2>
                    </SampleDiv>
                    <SampleDiv>
                        <StyleImg src="./images/artstyle/style4.png" onClick={() => IamgestateChange(4)} />
                        <h2>극화체</h2>
                    </SampleDiv>
                </StyleDiv>
            </ContentCover>
        </div>
    );
}

export default Artstyle;
