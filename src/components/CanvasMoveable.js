import React from "react";
import Moveable from "react-moveable";
import keycon from "keycon";
import { throttle } from "@daybrush/utils";

const CanvasMoveable = (props) => {
  const handleClick = (tar) => {
    props.onUpdate(tar);
  };

  const Editable = {
    name: "editable",
    props: [],
    events: [],
    render(moveable, React) {
      const rect = moveable.getRect();
      const { pos2 } = moveable.state;

      const EditableViewer = moveable.useCSS(
        "div",
        `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .custom-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #4af;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: white;
            font-weight: bold;
        }
        `
      );

      return (
        <EditableViewer
          key={"editable-viewer"}
          className={"moveable-editable"}
          style={{
            transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
          }}>
          <button
            className='custom-button'
            onClick={(e) => {
              handleClick(e.target.parentElement.parentElement.parentElement.children[0].className);
            }}>
            X
          </button>
        </EditableViewer>
      );
    },
  };

  return (
    <Moveable
      ref={props.ref}
      target={props.target}
      ables={[Editable]}
      props={{
        editable: true,
      }}
      draggable={true}
      resizable={true}
      rotatable={true}
      snappable={true}
      onResizeStart={(e) => {
        e.setFixedDirection([0, 0]);
      }}
      onDrag={(e) => {
        e.target.style.transform = e.transform;
      }}
      onBeforeResize={(e) => {
        if (keycon.global.shiftKey) {
          e.setFixedDirection([-1, -1]);
        } else {
          e.setFixedDirection([0, 0]);
        }
      }}
      onResize={(e) => {
        e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
        e.target.style.transform = e.drag.transform;
      }}
      onBeforeRotate={(e) => {
        e.setRotation(throttle(e.rotation, 22.5));
      }}
      onRotate={(e) => {
        e.target.style.transform = e.drag.transform;
      }}
    />
  );
};

export default CanvasMoveable;
