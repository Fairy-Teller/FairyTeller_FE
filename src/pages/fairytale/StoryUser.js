import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import {
  SelectedKeywordsState,
  StoryState,
  ImageState,
  ImageFix,
  BookState,
} from "../../recoil/Fairytailstate";

import { call } from "../../service/ApiService";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 13rem;
  background-color: #efd3d3;
  overflow: auto;
  resize: none;
  font-size: 1.8em;
  border-radius: 1em;
  padding: 0.7em;
  font-family: emoji;
  text-align: center;
`;

const Bar = styled.div`
  width: 100hw;
  height: 99px;
  text-align: left;
  background: #fcdede;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 700;
  font-size: 50px;
  line-height: 88px;
  color: #000000;
`;
const Button = styled.button`
  width: auto;
  height: auto;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 24px;
  word-break: keep-all;
  background-color: #ea6262;
  padding: 20px;
`;
const BookCover = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
`;
const FairytaleTitle = styled.div`
  font-weight: 400;
  font-size: 45px;
  text-align: center;
`;
const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-size: cover;
  padding-bottom: 80px;
`;
const FormWrap = styled.div`
  width: 80%;
`;

const StoryGenerated = () => {
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const navigate = useNavigate();

  useEffect(() => {
    setSavedStory([
      { paragraph: "" },
      { paragraph: "" },
      { paragraph: "" },
      { paragraph: "" },
      { paragraph: "" },
    ]);
  }, []);

  const onChangeHandler = (e, index) => {
    const updatedStory = [...savedStory];
    updatedStory[index] = { ...updatedStory[index], paragraph: e.target.value };
    setSavedStory(updatedStory);
    console.log(savedStory[index]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const bookDTO = savedStory.map((text, index) => ({
        pageNo: index + 1,
        fullStory: text["paragraph"],
      }));
      await createBook({ pages: bookDTO });
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      console.log(savedStory);
      navigate("/image-generated");
    }
  };

  const createBook = useRecoilCallback(({ set }) => async (bookDTO) => {
    try {
      const response = await call("/book/create/story", "POST", bookDTO);
      console.log(response);
      const pages = savedStory.map((text, index) => ({
        pageNo: index + 1,
        fullStory: text["paragraph"],
        imageUrl: null,
        imageBase64: null,
        audioUrl: null,
      }));
      await set(BookState, { bookId: response["bookId"], pages: pages });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='write tmp_story-generated'>
      <Container>
        <Bar>FairyTeller</Bar>
        <BookCover>
          <img
            src='/images/loding_1.png'
            style={{ marginTop: "2%" }}
            alt='loading bar'
          />
          <FairytaleTitle>동화를 직접 써볼 수 있어요!</FairytaleTitle>
          <FormWrap>
            <form onSubmit={onSubmitHandler}>
              <Section>
                {savedStory.map((item, index) => (
                  <div style={{ margin: "1em" }}>
                    <TextArea
                      key={index}
                      value={item["paragraph"]}
                      placeholder='재미있는 이야기를 작성해볼까요?'
                      onChange={(e) => onChangeHandler(e, index)}
                    />
                  </div>
                ))}
              </Section>
              <ButtonDiv>
                <Button type='submit'>동화 만들러 가기</Button>
              </ButtonDiv>
            </form>
          </FormWrap>
        </BookCover>
      </Container>
    </div>
  );
};

export default StoryGenerated;
