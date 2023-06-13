import React, { useEffect, useState, startTransition } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WrittenStoryState, summarizedResponseSelector } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 10rem;
`;

function StoryUser() {
  const [writtenStory, setWrittenStory] = useRecoilState(WrittenStoryState);
  const [res, setRes] = useRecoilState(summarizedResponseSelector);
  const [texts, setTexts] = useState("");

  const onChangeHandler = (e) => {
    setTexts(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setWrittenStory({ text: texts });
    await sendtext({
      text: writtenStory.text,
    });
  };

  const sendtext = async (userDTO) => {
    await call("/chat-gpt/summarize", "POST", userDTO).then((response) => {
      setRes(response);
      console.log("summarize: ", res);
    });
    // .finally(() => {
    //   console.log(summarizedResponse);
    //   window.location.href = "/f-edit";
    // });
  };

  return (
    <div>
      <Container className={""}>
        <h1>내가 생각한 이야기를 작성해보아요</h1>
        <form onSubmit={onSubmitHandler}>
          <Section className={""}>
            <TextArea
              value={texts}
              placeholder='동화책에 넣을 첫번째 문단을 작성해보아요'
              onChange={(e) => onChangeHandler(e)}
            />
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
