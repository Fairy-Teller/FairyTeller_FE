import styled, { css } from "styled-components";

const [IMAGE, USERIMAGE, TEXT, TEXTSTYLE, DELETE, STICKER] = [
  "AI삽화",
  "사용자이미지",
  "텍스트추가",
  "글씨스타일",
  "삭제",
  "스티커추가",
];

const Selection = styled.div`
  // flex: 1;
  margin: 1.2rem 0;
  padding: 0.2rem;
  box-sizing: border-box;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SelItem = styled.div`
  height: 6rem;
  ${(props) =>
    props.src &&
    css`
      background-image: url(${props.src});
    `}
  background-size: cover;
  border-radius: 0.4rem;
`;

const TabSelection = (props) => {
  return (
    <Selection onClick={props.onClick}>
      {props.name === STICKER + "-tab" ? (
        <SelItem
          id={props.name + props.idx + "-tabitem"}
          src={props.src}
        />
      ) : props.name === TEXTSTYLE + "-tab" ? (
        <div>{props.stylename}</div>
      ) : (
        <p>안 나와</p>
      )}
    </Selection>
  );
};

export default TabSelection;
