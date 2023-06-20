import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import {
  SelectedKeywordsState,
  StoryState,
  ImageState,
  ImageFix,
  BookState,
} from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import LoadingModal from "../../components/LoadingModal";

const TextArea = styled.textarea`
  width: calc(100% - 8rem);
  min-height: 16rem;
  background-color: #efd3d3;
  overflow: auto;
  resize: none;
  font-size: 2rem;
  border-radius: 2rem;
  box-sizing: content-box;
  padding: 2rem 4rem;
  font-family: emoji;
  text-align: center;
`;
const Bar = styled.div`
  width: 100hw;
  height: 60px;
  text-align: left;
  background: #fcdede;
  font-family: "Amiri";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 60px;
  color: #000000;
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
const FormWrap = styled.div`
  width: 80%;
  margin: auto;
`;

const StoryGenerated = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const keywords = useRecoilValue(SelectedKeywordsState);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  // const showImage = useRecoilValue(ImageFix);
  // const [savedBook, setSavedBook] = useRecoilState(BookState);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [keywords]);

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
    try {
      const bookDTO = savedStory.map((item, index) => ({
        pageNo: index + 1,
        fullStory: item["paragraph"],
      }));
      await createBook({ pages: bookDTO });
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
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
    <div className='write tmp_story-generated'>
      {isLoading && <LoadingModal message='AI가 열심히 이야기를 만드는 중입니다.' />}
      {loaded ? (
        <Container>
          <Bar>FairyTeller</Bar>
          <BookCover>
            <img
              src='/images/loding_1.png'
              style={{ marginTop: "2%" }}
              alt='loading bar'
            />
            <FairytaleTitle>AI가 만든 동화를 수정할 수 있어요!</FairytaleTitle>
            <FormWrap>
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
            </FormWrap>
          </BookCover>
        </Container>
      ) : (
        <div>되는 중...</div>
      )}
    </div>
  );
};

export default StoryGenerated;
