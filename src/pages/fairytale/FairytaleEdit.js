import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
const PageFrame = styled.div`
  background: red;
  display: flex;
  position: relative;
  height: 20vh;
  padding: 10px 10% 0 5%;
`;
const Page = styled.div`
  background: white;
  width: 10vw;
  height: 16vh;
  margin-left: 5%;
`;
const NextPage = styled.div`
  background: white;
  width: 10vw;
  height: 16vh;
  margin-left: 5%;
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
  const printRef = React.useRef();

  const [showButtonFunction, setShowButtonFunctiontion] = useState(false);
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
    } else {
      setShowButtonFunctiontion(!showButtonFunction);
    }
  };

  const handleDownloadImage = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: "none",
      logging: true,
      useCORS: true,
    });

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
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

  const handleExportPDF = () => {
    // Canverce 컴포넌트를 HTML 요소로 변환합니다.
    const canvasElement = document.getElementById("canvas");

    // html2canvas을 사용하여 Canverce 컴포넌트의 스크린샷을 생성합니다.
    html2canvas(canvasElement).then((canvas) => {
      // 스크린샷을 이미지 데이터로 변환합니다.
      const imageData = canvas.toDataURL("image/png");

      // jspdf를 사용하여 PDF 문서를 생성합니다.
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 이미지를 PDF에 추가합니다.
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // PDF를 다운로드합니다.
      pdf.save("exported.pdf");
    });
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

        {activeTab === IMAGE && (
          <EditTools>
            <button
              className='create-button'
              onClick={() => {
                handleExportPDF();
              }}
              style={{
                width: "200px",
                height: "50px",
                display: "block",
                backgroundColor: "lightGray",
                borderRadius: "25%",
              }}>
              Export Pdf
            </button>
          </EditTools>
        )}
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
          <button
            // style={{
            //   position: "absolute",
            // }}
            type='button'
            onClick={handleDownloadImage}>
            Download as Image
          </button>
          <PageFrame>
            <Page>1</Page>
            <Page>2</Page>
            <Page>3</Page>
            <Page>4</Page>
            <Page>5</Page>
            <NextPage>next</NextPage>
          </PageFrame>
        </Frame>
      </Container>
    </div>
  );
}

export default FairytaleEdit;
