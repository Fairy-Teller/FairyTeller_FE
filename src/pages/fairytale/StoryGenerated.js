import React, { useState, useEffect, useContext } from "react";
import { SelectedKeywordsContext } from "../../context/SelectedKeywordsContext";
import { Link } from "react-router-dom";
import { call } from "../../service/ApiService";
import { sendkeyword, sendtext } from "../../service/MainService";
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
  const { selectedKeywords, setSelectedKeywords } = useContext(SelectedKeywordsContext);
  const [dataIdx, setDataIdx] = useState(0);
  const [textareas, setTextareas] = useState([]);

  useEffect(() => {
    fetchData();
    console.log(selectedKeywords); // undefined
  }, []);

  const fetchData = async () => {
    try {
      const data = await call("/chat-gpt/question", "GET", null);
      setTextareas(() => {
        return data.map((item) => ({
          key: setDataIdx((prev) => prev + 1),
          text: item.text,
        }));
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onChangeHandler = (e) => {
    setTextareas(e.target.value);
  };

  const onSubmitHandler = (i, e) => {
    e.preventDefault();

    sendtext({
      parameter1: textareas[i].text,
      // parameter2: textareas[i].text,
      // parameter3: textareas[i].text,
    });
    console.log(textareas);
  };

  const resendKeyword = (e) => {
    e.preventDefault();

    sendkeyword({
      parameter1: selectedKeywords[0],
      parameter2: selectedKeywords[1],
      parameter3: selectedKeywords[2],
    });
    console.log(selectedKeywords);
  };

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();
  //   fetch("http://localhost:8080/images/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       parameter1: textareas[0].text,
  //       parameter2: textareas[1].text,
  //       parameter3: textareas[2].text,
  //     }),
  //   });
  //   setTextareas([]);
  // };

  return (
    <div>
      <Container className={""}>
        <h1>만들어진 시나리오를 확인하고 수정해보아요</h1>
        <form onSubmit={onSubmitHandler}>
          <Section className={""}>
            <TextArea
              value={textareas}
              // placeholder={textareas[0].key + 1 + "번째 문단"}
              onChange={(e) => onChangeHandler(e)}></TextArea>
          </Section>
          <ButtonWrap>
            <Link
              to='/keyword'
              className='button'>
              키워드 다시 고르기
            </Link>
            <button
              type='button'
              onClick={(e) => {
                resendKeyword(e);
              }}
              className='button'>
              이야기 다시 만들기
            </button>
            <button
              type='submit'
              className='button'>
              동화책 만들러 가기(or 동화책 테마 정하기)
            </button>
          </ButtonWrap>
        </form>
      </Container>
    </div>
  );
}

export default StoryGenerated;
