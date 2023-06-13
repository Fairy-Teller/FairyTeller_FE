import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useRecoilCallback } from "recoil";
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
  const [selectedKeywords, setSelectedKeywords] = useRecoilState(SelectedKeywords);
  const [savedStory, setSavedStory] = useRecoilState(GeneratedStoryState);
  const [dataIdx, setDataIdx] = useState(0);
  const [texts, setTexts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    console.log(savedStory.text["text"]);
    console.log(selectedKeywords); // {keywords: Array(3)} // [{key: undefined, theme: 'ANIMAL', title: '공룡'}, {key: undefined, theme: 'PEOPLE', title: '의사'}, {key: undefined, theme: 'ANIMAL', title: '개구리'}]
  }, [selectedKeywords]);

  const fetchData = async () => {
    try {
      setTexts(savedStory.text["text"]);
      // setSelectedKeywords(() => {
      //   return selectedKeywords.map((item) => ({
      //     key: setDataIdx((prev) => prev + 1),
      //   }));
      // });
      setLoading(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onChangeHandler = (e) => {
    setTexts(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSavedStory(texts);
    sendtext({
      text: texts,
    });
  };

  const sendtext = async (userDTO) => {
    await call("/chat-gpt/summarize", "POST", userDTO).then((response) => {
      console.log(response);
      window.location.href = "/f-edit";
    });
  };

  const regenerateHandler = (e) => {
    e.preventDefault();

    resendkeyword({
      parameter1: selectedKeywords.keywords[0].title,
      parameter2: selectedKeywords.keywords[1].title,
      parameter3: selectedKeywords.keywords[2].title,
    });
  };

  const resendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      const response = await call("/chat-gpt/question", "POST", userDTO);
      await set(GeneratedStoryState, { text: response });
      await set(SelectedKeywords, { keywords: selectedKeywords.keywords });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/story-generated");
    }
  });

  const callbackSavedStory = useRecoilCallback(({ set }) => async (response) => {
    await set(GeneratedStoryState, { text: response });
  });

  const resetSelectedKeywords = useResetRecoilState(SelectedKeywords);

  return (
    <div>
      {loading ? (
        <Container className={""}>
          <h1>만들어진 시나리오를 확인하고 수정해보아요</h1>
          <form onSubmit={onSubmitHandler}>
            <Section className={""}>
              <TextArea
                value={texts}
                placeholder='만들어진 시나리오를 확인하고 수정해보아요'
                onChange={(e) => onChangeHandler(e)}
              />
            </Section>
            <ButtonWrap>
              <Link
                to='/keyword'
                onClick={resetSelectedKeywords}
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
      ) : (
        <div>되는 중...</div>
      )}
    </div>
  );
}

export default StoryGenerated;
