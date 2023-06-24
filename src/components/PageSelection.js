import styled, { css } from "styled-components";

const Selection = styled.div`
  flex: 1;
  margin: 0 0.2rem;
  padding: 0 0.2rem;
  box-sizing: border-box;

  &:first-of-type {
    margin-left: 0;
  }
`;

const Image = styled.div`
  width: ${(props) => (props.isHovered ? "104%" : "100%")};
  min-height: ${(props) => (props.isHovered ? "160px" : "40px")};
  ${(props) =>
    props.src &&
    css`
      background-image: url(${props.src});
    `}
  background-size: cover;
  border-radius: 0.4rem;
  transition: all 0.4s ease-in-out;
  box-shadow: ${(props) =>
    props.isHovered
      ? "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.8)"
      : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.4)"};
`;

const PageSelection = (props) => {
  return (
    <Selection onClick={props.onClick}>
      <div className='image-frame'>
        <Image
          className='image'
          id={props.idx + "-page"}
          src={props.src}
          alt={props.idx + " image generated by AI"}
          isHovered={props.isHovered}
        />
      </div>
    </Selection>
  );
};

export default PageSelection;
