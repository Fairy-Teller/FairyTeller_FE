import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
// import Moveable from "react-moveable";
// import keycon from "keycon";
import EditTools from "../../components/EditTools";
import CanvasMoveable from "../../components/CanvasMoveable";

const NULL = "NULL";

const [IMAGE, USERIMAGE, BG, TEXT, FILTER, STICKER] = [
  "삽화",
  "유저이미지",
  "배경",
  "글꼴",
  "채도",
  "스티커",
];
const [AI, USER, STI] = ["AI", "USER", "STI"];

const Container = styled.div`
  display: flex;
  position: relative;
`;
const Nav = styled.nav`
  width: 5%;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
`;
const Tab = styled.button`
  width: 100%;
  margin-top: 4px;
  height: 9%;
  top: 216px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  ${({ clicked }) =>
    clicked &&
    css`
      background-color: black;
      color: white;
    `}
`;
const Frame = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;
const Canvas = styled.div`
  background: pink;
  position: relative;
  align-items: center;
  height: 80vh;
`;
const Background = styled.div`
  width: 80%;
  height: 90%;
  position: absolute;
  top: auto;
  left: 10%;
  margin-top: 2%;
  background-color: white;
  border: 1px solid black;
`;
const Pages = styled.div`
  background: red;
  height: 20vh;
`;

const classNameCleaner = (str) => {
  let arr = document.querySelectorAll("." + str);
  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.remove(str);
  }
};

function FairytaleEdit() {
  const SRC_LINK = "/images/sad_face.png";
  const STI_LINKS = [
    { key: 1, link: "/images/st1.png" },
    { key: 2, link: "/images/st2.png" },
    { key: 3, link: "/images/st3.png" },
  ];

  const buttonLabels = [IMAGE, USERIMAGE, BG, TEXT, FILTER, STICKER];
  const imageLabels = [AI, USER, STI];

  const moveableRef = useRef(null);
  const selectoRef = useRef(null);

  // const [showButtonFunc, setShowButtonFunc] = useState(false);
  // const [buttonClicked, setButtonClicked] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [selectedSti, setSelectedSti] = useState(NULL);

  const handleButtonClick = (label) => {
    // setButtonClicked(!buttonClicked);
    setActiveTab(label === activeTab ? null : label);
    if (label === BG) {
      setActiveTab(null);
      const randomColor = getRandomColor();
      const buttonFunctionDiv = document.querySelector("#bg");
      if (buttonFunctionDiv) {
        buttonFunctionDiv.style.background = randomColor;
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImportFile(file);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [tarIdx, setTarIdx] = useState(1);
  const [targets, setTargets] = useState([{ key: 0, class: "target0", src: SRC_LINK, label: AI }]); // DEFAULT: parsed AI illustration

  const handleCreate = () => {
    setTarIdx((prev) => prev + 1);
    setTargets(
      selectedSti !== NULL
        ? [...targets, { key: tarIdx, class: `target${tarIdx}`, src: selectedSti, label: STI }]
        : importFile !== NULL
        ? [
            ...targets,
            {
              key: tarIdx,
              class: `target${tarIdx}`,
              src: URL.createObjectURL(importFile),
              label: USERIMAGE,
            },
          ]
        : [...targets, { key: tarIdx, class: `target${tarIdx}`, src: SRC_LINK, label: AI }]
    );
    setSelectedSti(NULL);
    classNameCleaner("selected");
    setImportFile(null);
  };

  const handleDelete = (clicked) => {
    const updated_targets = [...targets].filter((item) => item.class !== clicked);
    setTargets(updated_targets);
  };

  const handleStiSelect = (ele, elename, src) => {
    console.log(moveableRef, selectoRef);
    if (ele.classList.contains("selected")) {
      setSelectedSti((prev) => {
        return NULL;
      });
      classNameCleaner("selected");
    } else {
      classNameCleaner("selected");
      ele.classList.add("selected");
      setSelectedSti((prev) => {
        return src;
      });
    }
  };

  return (
    <div>
      <Container>
        <Nav>
          {buttonLabels.map((label) => (
            <Tab
              key={label}
              clicked={activeTab === label} // buttonClicked && activeTab
              onClick={() => handleButtonClick(label)}>
              <h2>{label}</h2>
            </Tab>
          ))}
        </Nav>

        {activeTab === IMAGE && <EditTools>ai생성일러리스트</EditTools>}
        {activeTab === USERIMAGE && (
          <EditTools>
            <input
              type='file'
              onChange={handleFileChange}
              style={{
                width: "200px",
                height: "50px",
                display: "block",
                backgroundColor: "lightGray",
                borderRadius: "25%",
              }}
            />
            {importFile !== null && (
              <div className='preview'>
                <p>미리보기</p>
                <img
                  src={URL.createObjectURL(importFile)}
                  alt={USERIMAGE}
                />
              </div>
            )}
            <button
              className='create-button'
              onClick={() => {
                handleCreate();
              }}
              style={{
                width: "200px",
                height: "50px",
                display: "block",
                backgroundColor: "lightGray",
                borderRadius: "25%",
              }}>
              Create Target
            </button>
          </EditTools>
        )}
        {activeTab === BG && <EditTools>랜덤BG</EditTools>}
        {activeTab === TEXT && <EditTools>텍스트편집</EditTools>}
        {activeTab === FILTER && <EditTools>필터</EditTools>}
        {activeTab === STICKER && (
          <EditTools>
            <ul>
              {STI_LINKS.map((item) => (
                <li
                  key={item.key}
                  onClick={(e) => {
                    handleStiSelect(e.target, e.target.className, item.link);
                  }}>
                  <img
                    className={"sti" + item.key}
                    src={item.link}
                    alt={STI}
                    style={{ width: "200px", height: "100px" }}
                  />
                </li>
              ))}
            </ul>
            <button
              className='create-button'
              onClick={() => {
                handleCreate();
              }}
              style={{
                width: "200px",
                height: "50px",
                display: "block",
                backgroundColor: "lightGray",
                borderRadius: "25%",
              }}>
              Create Target
            </button>
          </EditTools>
        )}

        <Frame>
          <Canvas id='canvas'>
            <Background id='bg'>
              {targets.map((item) => (
                <div className='movable-kit'>
                  <img
                    key={item.key}
                    className={item.class}
                    src={item.src}
                    alt={item.label}
                    style={{
                      width: "200px",
                      height: "160px",
                      position: "absolute",
                      backgroundColor: "transparent",
                    }}
                  />
                  <CanvasMoveable
                    ref={moveableRef}
                    target={["." + item.class]}
                    onUpdate={handleDelete}
                  />
                </div>
              ))}
            </Background>
          </Canvas>
          <Pages></Pages>
        </Frame>
      </Container>
    </div>
  );
}

export default FairytaleEdit;
