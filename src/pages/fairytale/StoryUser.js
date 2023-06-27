import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { StoryState, BookState } from "../../recoil/FairytaleState";
import { call } from "../../service/ApiService";
import Header from "../../components/global/Header";
import ProgressBar from "../../components/global/ProgressBar";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import styled from "styled-components";

import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

const TextArea = styled.textarea`
  width: calc(100% - 8rem);
  min-height: 4rem;
  background-color: #f2c166;
  resize: none;
  font-size: 1.3rem;
  border-radius: 2rem;
  box-sizing: content-box;
  padding: 2rem 4rem;
  font-family: emoji;
  text-align: center;
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
const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-size: cover;
  padding-bottom: 80px;
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
      navigate("/artstyle");
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
        <Header mode={"default"} />
        <ContentCover>
          <ProgressBar step={1} />
          <ContentTitle>동화를 직접 써볼 수 있어요!</ContentTitle>
          <InnerCover>
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
          </InnerCover>
        </ContentCover>
      </Container>
    </div>
  );
};

export default StoryGenerated;
