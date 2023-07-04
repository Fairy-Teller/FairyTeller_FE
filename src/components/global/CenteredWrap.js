import { styled } from "styled-components";

const Wrap = styled.div`
  margin: 0 3.2rem;
`;

const CenteredWrap = (props) => {
  return <Wrap className='centered-wrap'>{props.children}</Wrap>;
};

export default CenteredWrap;
