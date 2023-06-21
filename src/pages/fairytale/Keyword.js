import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { SelectedKeywordsState, StoryState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import Header from "../../components/global/Header";
import ProgressBar from "../../components/global/ProgressBar";
import Container from "../../components/global/Container";
import Row from "../../components/global/Row";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import LoadingModal from "../../components/LoadingModal";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

const KeywordItem = styled.div`
  padding: 0.625rem;
  margin: 0.4rem auto 0.4rem;
  border-radius: 2rem;
  overflow: hidden;
  transition: background 0.4s;
  &:hover {
    background-color: #edaeae;
  }
`;
const KeywordInner = styled.div`
  width: 8rem;
  margin: 0 1.2rem;
  padding: 0;
  position: relative;
`;
const ItemTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
`;
const ItemTitleText = styled.p`
  padding: 0;
  margin: 0.8rem auto 0;
  font-size: 1.6rem;
`;
const ItemInput = styled.input`
  width: 8rem;
  height: 9.2rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  appearance: none;
`;
const SectionKeyword = styled.div`
  border: 0.3em solid #edaeae;
  padding: 0 2em 2em 2em;
  margin: 1em;
  border-radius: 2em;
`;

const Keyword = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useRecoilState(SelectedKeywordsState);
  const [dataIdx, setDataIdx] = useState(0);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([{}]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await call("/keyword", "GET", null);
      setOptions(() => {
        return data.map((item) => ({
          key: setDataIdx((prev) => prev + 1),
          theme: item.keywordEnum,
          titles: item.titles,
        }));
      });
      setKeywords([]);
      setLoaded(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleInputed = () => {
    if (input === "" || null || undefined) {
      alert("단어를 다시 입력해주세요!");
    } else {
      setKeywords((prev) => {
        let updatedValues = [...prev];

        if (updatedValues.length < 5) {
          updatedValues.push(input);
        } else {
          alert("단어는 최대 5개까지 선택할 수 있어요!");
        }

        console.log(updatedValues);
        return updatedValues;
      });
    }
    setInput("");
  };

  const handleChecked = (target) => {
    setKeywords((prev) => {
      let updatedValues = [...prev];

      if (target.checked) {
        const selected = options.find((item) => item.titles.includes(target.name));
        if (selected && updatedValues.length < 5) {
          updatedValues.push(target.name);
        } else {
          target.checked = false;
          alert("단어는 최대 5개까지 선택할 수 있어요!");
        }
      } else {
        updatedValues = updatedValues.filter((item) => item !== target.name);
      }

      console.log(updatedValues);
      return updatedValues;
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    keywords.length < 3
      ? alert("단어는 3개 이상 선택해주세요!")
      : sendkeyword({
          parameter1: keywords[0],
          parameter2: keywords[1],
          parameter3: keywords[2],
          parameter4: keywords[3] == null || undefined ? "" : keywords[3],
          parameter5: keywords[4] == null || undefined ? "" : keywords[4],
        });
    console.log(keywords);
  };

  const sendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      setIsLoading(true);
      const response = await call("/chat-gpt/question", "POST", userDTO);
      set(StoryState, response);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
      navigate("/story-generated");
    }
  });

  return (
    <div className='story keyword'>
      {isLoading && <LoadingModal message='AI가 열심히 이야기를 만드는 중입니다.' />}
      {loaded ? (
        <Container>
          <Header mode={"default"} />
          <ContentCover>
            <ProgressBar step={1} />
            <ContentTitle>단어를 3개부터 5개까지 선택해보아요!</ContentTitle>
            <InnerCover>
              <Row className='current'>
                {keywords
                  ? keywords.map((item) => {
                      return <div key={item}>{item}</div>;
                    })
                  : null}
              </Row>
              <form onSubmit={onSubmitHandler}>
                <Section>
                  <p>맘에 드는 단어가 없다면, 직접 넣어보아요</p>
                  <div>
                    <input
                      id='keyword-inputed'
                      type='text'
                      name='keyword-inputed'
                      placeholder='단어를 직접 넣어보아요'
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                      type='button'
                      onClick={handleInputed}>
                      내가 쓴 단어 넣기
                    </button>
                  </div>
                </Section>
                {options.map((item, index) => (
                  <SectionKeyword>
                    <Section key={index}>
                      <h2 style={{ paddingBottom: "1rem" }}>{item.theme} 분류</h2>
                      <Row className={"wrap"}>
                        {item.titles.map((title, subIndex) => (
                          <KeywordItem key={subIndex}>
                            <KeywordInner>
                              <img
                                src={`./images/keywords/${title}.png`}
                                alt={`recommandation keyword - ${title}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                              <ItemTitle>
                                <ItemInput
                                  type='checkbox'
                                  name={title}
                                  checked={title.checked}
                                  onChange={(e) => handleChecked(e.target)}
                                />
                                <ItemTitleText>{title}</ItemTitleText>
                              </ItemTitle>
                            </KeywordInner>
                          </KeywordItem>
                        ))}
                      </Row>
                    </Section>
                  </SectionKeyword>
                ))}
                <ButtonWrap>
                  <button
                    type='submit'
                    className='button'>
                    이야기 만들러 가기
                  </button>
                </ButtonWrap>
              </form>
            </InnerCover>
          </ContentCover>
        </Container>
      ) : (
        <div>되는 중...</div>
      )}
    </div>
  );
};

export default Keyword;
