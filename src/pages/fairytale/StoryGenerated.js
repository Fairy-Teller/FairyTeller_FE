import React, { useState } from "react";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const dummytext = {
  text: "\n\n1문단\n무지개는 고양이를 따라가며 장난감을 찾아 다니는데, 갑자기 눈앞에 토끼가 나타났다. 토끼는 무지개에게 놀이를 해줄래? 무지개는 기뻐하며 토끼와 함께 놀이를 시작했다.\n\n2문단\n토끼는 무지개에게 달리기를 해보라고 했다. 무지개는 기뻐하며 달려갔다. 그러나 무지개는 달리는 것이 어려웠다. 그래서 토끼는 무지개를 도와주기 위해 달려갔다.\n\n3문단\n무지개와 토끼는 기쁨을 나누며 놀이를 하다가 고양이가 나타났다. 고양이는 무지개와 토끼를 따라가며 놀이를 하는 것을 보고 기뻤다. 그리고 무지개, 토끼, 고양이는 함께 놀이를 하며 즐거움을 나누었다.",
};

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 10rem;
`;

function StoryGenerated() {
  const [textareas, setTextareas] = useState([dummytext.text, "", ""]);

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

  // function TextAreaComponent() {
  //   var arr = [];
  //   for (var i = 0; i < 3; i++) {
  //     arr.push(
  //       <TextArea
  //         value={textareas[i]}
  //         placeholder={i + "번째 페이지"}
  //         onChange={(e) => onChangeHandler(e, i)}></TextArea>
  //     );
  //   }
  //   return arr;
  // }

  return (
    <div>
      <Container className={""}>
        <h1>만들어진 시나리오를 확인하고 수정해보아요</h1>
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
            <a
              link={"/keyword"}
              className='button'>
              키워드 다시 고르기
            </a>
            <a
              link={"/????"}
              className='button'>
              이야기 다시 만들기
            </a>
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
