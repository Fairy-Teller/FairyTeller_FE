import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { SelectedKeywordsState, StoryState, BookState } from "../../recoil/FairytaleState";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import Header from "../../components/global/Header";
import ProgressBar from "../../components/global/ProgressBar";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import LoadingModal from "../../components/LoadingModal";

import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

const TextArea = styled.textarea`
  width: calc(100% - 8rem);
  min-height: 8rem;
  height: auto;
  background-color: pink;
  resize: none;
  font-size: 1.6rem;
  line-height: 1.4;
  border-radius: 2rem;
  box-sizing: content-box;
  padding: 2rem 4rem;
  text-align: center;
`;

const StoryGenerated = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const keywords = useRecoilValue(SelectedKeywordsState);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  // const showImage = useRecoilValue(ImageFix);
  // const [savedBook, setSavedBook] = useRecoilState(BookState);
  const textAreaRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [keywords]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  const fetchData = async () => {
    try {
      setLoaded(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onChangeHandler = (e, index) => {
    const newStory = [...savedStory];
    newStory[index] = { ...newStory[index], paragraph: e.target.value };
    setSavedStory(newStory);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    window.scrollTo(0, document.body.scrollHeight);

    try {
      setIsLoading(true);
      const bookDTO = savedStory.map((item, index) => ({
        pageNo: index + 1,
        fullStory: item["paragraph"],
      }));
      await createBook({ pages: bookDTO });
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      navigate("/image-generated");
    }
  };

  const regenerateHandler = (e) => {
    e.preventDefault();

    resendkeyword({
      parameter1: keywords[0],
      parameter2: keywords[1],
      parameter3: keywords[2],
      parameter4: keywords[3] == null || undefined ? "" : keywords[3],
      parameter5: keywords[4] == null || undefined ? "" : keywords[4],
    });
  };

  const resendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      setIsLoading(true);
      const response = await call("/chat-gpt/question", "POST", userDTO);
      set(StoryState, response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  });

  const resetSelectedKeywords = useResetRecoilState(SelectedKeywordsState);

  const createBook = useRecoilCallback(({ set }) => async (bookDTO) => {
    try {
      const response = await call("/book/create/story", "POST", bookDTO);
      console.log(response);
      const pages = savedStory.map((item, index) => ({
        pageNo: index + 1,
        fullStory: item["paragraph"],
        imageUrl: null,
        imageBase64: null,
        audioUrl: null,
      }));
      set(BookState, { bookId: response["bookId"], pages: pages });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='story story-generated '>
      {isLoading && <LoadingModal message='AI가 그림 그릴 준비를 합니다!' />}
      {loaded ? (
        <Container>
          <Header mode={"default"} />
          <ContentCover>
            <ProgressBar step={1} />
            <ContentTitle>AI가 만든 동화를 수정할 수 있어요!</ContentTitle>
            <InnerCover>
              <form onSubmit={onSubmitHandler}>
                <Section>
                  {savedStory.map(
                    (item, index) =>
                      item && (
                        <div style={{ margin: "1.2rem 0" }}>
                          <TextArea
                            key={"paragraph" + index}
                            value={item["paragraph"]}
                            placeholder='만들어진 시나리오를 확인하고 수정해보아요'
                            onChange={(e) => onChangeHandler(e, index)}
                          />
                        </div>
                      )
                  )}
                </Section>
                <ButtonWrap className='button-wrap'>
                  <Link
                    to='/keyword'
                    onClick={resetSelectedKeywords}
                    className='button'>
                    키워드 다시 고르기
                  </Link>
                  <button
                    type='submit'
                    className='button'>
                    동화 만들러 가기
                  </button>
                </ButtonWrap>
              </form>
              <form onSubmit={regenerateHandler}>
                <ButtonWrap className='button-wrap'>
                  <button
                    type='submit'
                    className='button'>
                    이야기 다시 만들기
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

export default StoryGenerated;
