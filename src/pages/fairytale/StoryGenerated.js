import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useRecoilState,
  useResetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useSetRecoilState,
} from "recoil";
import { SelectedKeywordsState, StoryState, BookState, BookId } from "../../recoil/FairytaleState";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import Header from "../../components/global/Header";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import LoadingModal from "../../components/LoadingModal";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus as plus } from "@fortawesome/free-solid-svg-icons";
import { faCircleMinus as minus } from "@fortawesome/free-solid-svg-icons";

const TextArea = styled.textarea`
  width: calc(100% - 8rem);
  min-height: 8rem;
  height: auto;
  resize: none;
  font-size: 1.4rem;
  line-height: 1.6;
  border-radius: 2rem;
  box-sizing: content-box;
  padding: 2rem 4rem;
  text-align: center;
`;

const StoryGenerated = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const [isBlockingKey, setIsBlockingKey] = useState(false);
  const [paraCount, setParaCount] = useState(savedStory.length);
  const keywords = useRecoilValue(SelectedKeywordsState);
  const setBookId = useSetRecoilState(BookId);

  // const showImage = useRecoilValue(ImageFix);
  // const [savedBook, setSavedBook] = useRecoilState(BookState);
  // const textAreaRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, [keywords]);

  useEffect(() => {
    window.addEventListener("keydown", disableKeyboardEvents);

    return () => {
      window.removeEventListener("keydown", disableKeyboardEvents);
    };
  }, [isBlockingKey]);

  const disableKeyboardEvents = (event) => {
    if (isBlockingKey) {
      event.preventDefault();
    }
  };

  const fetchData = async () => {
    try {
      setLoaded(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const plusPageLength = () => {
    if (paraCount >= 7) {
      alert("동화책의 페이지는 최대 7장까지에요!");
    } else {
      setParaCount((prev) => ++prev);
      setSavedStory((prev) => [...prev, { paragraph: "" }]);
    }
  };

  const minusPageLength = () => {
    if (paraCount <= 3) {
      alert("동화책의 페이지는 최소 3장까지에요!");
    } else {
      setParaCount((prev) => --prev);
      setSavedStory((prev) => prev.slice(0, -1));
    }
  };

  const onChangeHandler = useCallback(
    (e, index) => {
      const updatedStory = [...savedStory];
      updatedStory[index] = { ...updatedStory[index], paragraph: e.target.value };
      setSavedStory(updatedStory);
    },
    [savedStory, setSavedStory]
  );

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsBlockingKey(true);

    for (let i = 0; i < savedStory.length; i++) {
      if (savedStory[i]["paragraph"].length === 0) {
        alert("모든 페이지에 대한 내용을 입력해주세요");
        setIsBlockingKey(false);
        return;
      }
    }

    setIsLoading(true);
    window.scrollTo(0, document.body.scrollHeight);

    try {
      const bookDTO = savedStory.map((item, index) => ({
        pageNo: index + 1,
        fullStory: item["paragraph"],
      }));
      await createBook({ pages: bookDTO });
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsBlockingKey(false);
      navigate("/artstyle");
    }
  };

  const regenerateHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

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
      const response = await call("/chat-gpt/question/recreate", "POST", userDTO);
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
      const pages = savedStory.map((item, index) => ({
        pageNo: index + 1,
        fullStory: item["paragraph"],
        imageUrl: null,
        imageBase64: null,
        audioUrl: null,
      }));
      setBookId(response.bookId);
      set(BookState, { bookId: response["bookId"], pages: pages });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='story story-generated '>
      {isLoading && <LoadingModal message='AI가 그림 그릴 준비를 합니다!' />}
      {loaded ? (
        <Container className={"an1"}>
          <Header mode={"default"} />
          <ContentCover>
            <ContentTitle>AI가 만든 동화를 수정할 수 있어요!</ContentTitle>
            <InnerCover>
              <ButtonWrap>
                <FontAwesomeIcon
                  onClick={plusPageLength}
                  icon={plus}
                  size='2xl'
                />
                <FontAwesomeIcon
                  style={{ marginLeft: "0.8rem" }}
                  onClick={minusPageLength}
                  icon={minus}
                  size='2xl'
                />
              </ButtonWrap>
              <form onSubmit={onSubmitHandler}>
                <Section>
                  {savedStory.map((item, index) => {
                    return (
                      <TextArea
                        key={"paragraph-" + index}
                        value={item["paragraph"] !== "" ? item["paragraph"] : ""}
                        placeholder='만들어진 시나리오를 확인하고 수정해보아요'
                        maxLength={200}
                        onChange={(e) => onChangeHandler(e, index)}
                        style={{ margin: "1.2rem 0" }}
                      />
                    );
                  })}
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
                    동화 만들러 가기
                  </button>
                </ButtonWrap>
              </form>
              <form onSubmit={regenerateHandler}>
                <ButtonWrap>
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
