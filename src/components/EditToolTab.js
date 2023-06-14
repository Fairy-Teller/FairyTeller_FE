import styled, { css } from "styled-components";

const Title = styled.h1`
  color: white;
`;
const Div = styled.div`
  width: 22.5vw;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: black;
`;

const EditToolTab = (props) => {
  return (
    <Div id='edit-tool-tab'>
      <Title>{props.title}</Title>
      {props.children}
    </Div>
  );
};

export default EditToolTab;
