import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { SelectedKeywords, GeneratedStoryState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import Container from "../../components/layout/Container";
import Row from "../../components/layout/Row";
import Section from "../../components/layout/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const [ANIMAL, PEOPLE] = ["ANIMAL", "PEOPLE"];

const Keywords = styled.ul`
  background-color: pink;
`;
const KeywordItem = styled.li`
  list-style: none;
  flex: 1 0 auto;
  padding: 0.625rem;
`;
const ItemTitle = styled.p`
  font-size: 14px;
`;
const ItemInput = styled.input`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

function Keyword() {
  const [loading, setLoading] = useState(false);
  const [checkedValues, setCheckedValues] = useRecoilState(SelectedKeywords);
  const [savedStory, setSavedStory] = useRecoilState(GeneratedStoryState);
  const [dataIdx, setDataIdx] = useState(0);
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
          title: item.title,
        }));
      });
      setLoading(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleChecked = (title) => {
    const bool = checkedValues.some((item) => item.title === title);
    if (bool) {
      const updated = checkedValues.filter((item) => item.title !== title);
      setCheckedValues(updated);
    } else {
      const selected = options.find((item) => item.title === title);
      setCheckedValues([...checkedValues, selected]);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setCheckedValues((prev) => [
      ...prev,
      checkedValues[0].title,
      checkedValues[1].title,
      checkedValues[2].title,
    ]);
    sendkeyword({
      parameter1: checkedValues[0].title,
      parameter2: checkedValues[1].title,
      parameter3: checkedValues[2].title,
    });
  };

  const sendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      const response = await call("/chat-gpt/question", "POST", userDTO);
      await setSavedStory(response);
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/story-generated");
    }
  });

  const callbackSavedStory = useRecoilCallback(({ set }) => async (response) => {
    await set(GeneratedStoryState, { text: response });
    console.log(GeneratedStoryState);
  });

  return (
    <div>
      {loading ? (
        <Container className={""}>
          <h1>
            추천 키워드<p>최대 3개</p>
          </h1>
          <form onSubmit={onSubmitHandler}>
            <Section className={ANIMAL}>
              <h2>{ANIMAL}</h2>
              <Keywords>
                <Row>
                  {options.map((item) =>
                    item.theme === ANIMAL ? (
                      <KeywordItem>
                        <ItemInput
                          id={`keyword${item.key}`}
                          name={item.title}
                          type='checkbox'
                          checked={item.checked}
                          className='ItemInput'
                          onChange={(e) => handleChecked(e.target.name)}
                        />
                        <ItemTitle>{item.title}</ItemTitle>
                      </KeywordItem>
                    ) : null
                  )}
                </Row>
              </Keywords>
            </Section>
            <Section className={PEOPLE}>
              <h2>{PEOPLE}</h2>
              <Keywords>
                <Row>
                  {options.map((item) =>
                    item.theme === PEOPLE ? (
                      <KeywordItem>
                        <ItemInput
                          id={`keyword${item.key}`}
                          name={item.title}
                          type='checkbox'
                          checked={item.checked}
                          className='ItemInput'
                          onChange={(e) => handleChecked(e.target.name)}
                        />
                        <ItemTitle>{item.title}</ItemTitle>
                      </KeywordItem>
                    ) : null
                  )}
                </Row>
              </Keywords>
            </Section>
            <ButtonWrap>
              <button
                type='submit'
                className='button'>
                이야기 만들러 가기
              </button>
            </ButtonWrap>
          </form>
        </Container>
      ) : (
        <div>되는 중...</div>
      )}
    </div>
  );
}

export default Keyword;
