import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SelectedKeywords, GeneratedStoryState } from "../../recoil/Fairytailstate";
import { Link } from "react-router-dom";
import { call } from "../../service/ApiService";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 10rem;
  background-color: lightgray;
`;

function StoryGenerated() {
  const [loading, setLoading] = useState(false);
  const selectedKeywords = useRecoilValue(SelectedKeywords);
  const [savedStory, setSavedStory] = useRecoilState(GeneratedStoryState);
  const [dataIdx, setDataIdx] = useState(0);
  const [textareas, setTextareas] = useState("");

  useEffect(() => {
    fetchData();
  }, [savedStory]);

  const fetchData = async () => {
    try {
      const data = await call("/chat-gpt/question", "GET", null);
      setTextareas(() => {
        return data.map((item) => ({
          key: setDataIdx((prev) => prev + 1),
          text: item.text,
        }));
      });
      setLoading(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onChangeHandler = (e) => {
    setTextareas(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSavedStory(textareas);
    sendtext({
      text: textareas,
    });
  };

  const sendtext = async (userDTO) => {
    await call("/chat-gpt/summarize", "POST", userDTO).then((response) => {
      console.log(response);
      window.location.href = "/f-edit";
    });
  };

  const resendkeyword = async (userDTO) => {
    await call("/chat-gpt/question", "POST", userDTO).then((response) => {
      setSavedStory(response);
    });
  };

  const regenerateHandler = (e) => {
    e.preventDefault();

    console.log(selectedKeywords);
    resendkeyword(SelectedKeywords);
  };

  return (
    <div>
      <Container className={""}>
        <h1>만들어진 시나리오를 확인하고 수정해보아요</h1>
        <form onSubmit={onSubmitHandler}>
          <Section className={""}>
            <TextArea
              value={textareas}
              placeholder='만들어진 시나리오를 확인하고 수정해보아요'
              onChange={(e) => onChangeHandler(e)}
            />
          </Section>
          <ButtonWrap>
            <Link
              to='/keyword'
              className='button'>
              키워드 다시 고르기
            </Link>
            <button
              type='submit'
              className='button'>
              동화책 만들러 가기(or 동화책 테마 정하기)
            </button>
          </ButtonWrap>
        </form>
        <form onSubmit={regenerateHandler}>
          <button
            type='submit'
            className='button'>
            이야기 다시 만들기
          </button>
        </form>
      </Container>
    </div>
  );
}

export default StoryGenerated;
