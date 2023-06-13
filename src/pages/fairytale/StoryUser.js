import React, { useState } from "react";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 10rem;
`;

function StoryUser() {
  const [textareas, setTextareas] = useState(["", "", ""]);

  const onChangeHandler = (e, idx) => {
    const updatedTextareas = [...textareas];
    updatedTextareas[idx] = e.target.value;
    setTextareas(updatedTextareas);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/chat-gpt/????", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parameter1: textareas[0],
        parameter2: textareas[1],
        parameter3: textareas[2],
      }),
    });
    setTextareas(["", "", ""]);
  };

  return (
    <div>
      <Container className={""}>
        <h1>내가 생각한 이야기를 작성해보아요</h1>
        <form onSubmit={onSubmitHandler}>
          <Section className={""}>
            <TextArea
              value={textareas[0]}
              placeholder={0 + "번째 페이지"}
              onChange={(e) => onChangeHandler(e, 0)}></TextArea>
            <TextArea
              value={textareas[1]}
              placeholder={1 + "번째 페이지"}
              onChange={(e) => onChangeHandler(e, 1)}></TextArea>
            <TextArea
              value={textareas[2]}
              placeholder={2 + "번째 페이지"}
              onChange={(e) => onChangeHandler(e, 2)}></TextArea>
          </Section>
          <ButtonWrap>
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

export default StoryUser;
