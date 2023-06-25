import React from "react";
import styled from 'styled-components';

const SampleImg = styled.img`
    display: flex;
    width : 200px;
    height : 200px;
    border-radius: 50%; /* 50%를 사용하여 이미지를 둥글게 만듭니다 */
`;
const StyleImg = styled.img`
    width : 200px;
    height : 200px;
    border-radius: 10%; /* 50%를 사용하여 이미지를 둥글게 만듭니다 */
    border: 1px solid gray; /* 회색 테두리 설정 */
    margin : 10px;
`;

const SampleDiv = styled.div`
    display: flex;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    padding : 100px;
`;

const StyleDiv = styled.div`
    display: flex;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
`;


function Artstyle() {
  return (
    <div>
        <SampleDiv>
            <SampleImg src={`./images/artstyle/sample.png`}/>
        </SampleDiv>
        <StyleDiv>
            <StyleImg src={`./images/artstyle/style1.png`}/>
            <StyleImg src={`./images/artstyle/style2.png`}/>
            <StyleImg src={`./images/artstyle/style3.png`}/>
            <StyleImg src={`./images/artstyle/style4.png`}/>
        </StyleDiv>
    </div>
  );
}

export default Artstyle;
