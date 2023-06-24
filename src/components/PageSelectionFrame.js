import React, { useState, Children, cloneElement } from "react";
import styled from "styled-components";

const SelectionFrame = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0.8rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

const PageSelectionFrame = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SelectionFrame
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {Children.map(props.children, (child) => cloneElement(child, { isHovered: isHovered }))}
    </SelectionFrame>
  );
};

export default PageSelectionFrame;
