import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback, useSetRecoilState } from "recoil";
import { StoryState, BookState, BookId } from "../../recoil/FairytaleState";
import { createStoryBook } from "../../service/FairytaleService";
import Header from "../../components/global/Header";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import ToastPopup from "../../components/common/ToastPopup";
import LoadingModal from "../../components/LoadingModal";
import styled from "styled-components";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus as plus } from "@fortawesome/free-solid-svg-icons";
import { faCircleMinus as minus } from "@fortawesome/free-solid-svg-icons";

const TextArea = styled.textarea`
  width: calc(100% - 8rem);
  min-height: 6.4rem;
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
  const [isLoading, setIsLoading] = useState(false);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const [isBlockingKey, setIsBlockingKey] = useState(false);
  const [paraCount, setParaCount] = useState(3);
  const navigate = useNavigate();
  const setBookId = useSetRecoilState(BookId);
  const token = localStorage.getItem("ACCESS_TOKEN");

  useEffect(() => {
    setSavedStory([{ paragraph: "" }, { paragraph: "" }, { paragraph: "" }]);
    setIsLoading(false);
  }, []);

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

  const [showToast, setShowToast] = useState(false);

  const plusPageLength = () => {
    if (paraCount >= 7) {
      alert("동화책의 페이지는 최대 7장까지에요!");
    } else {
      setParaCount((prev) => ++prev);
      setSavedStory((prev) => [...prev, { paragraph: "" }]);
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2400);
      return () => {
        clearTimeout(timer);
      };
    }
  };

  const minusPageLength = () => {
    if (paraCount <= 3) {
      alert("동화책의 페이지는 최소 3장까지에요!");
    } else {
      setParaCount((prev) => --prev);
      setSavedStory((prev) => prev.slice(0, -1));
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2400);
      return () => {
        clearTimeout(timer);
      };
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

    for (let i = 0; i < 3; i++) {
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
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsBlockingKey(false);
      navigate("/artstyle");
    }
  };

  const createBook = useRecoilCallback(({ set }) => async (bookDTO) => {
    try {
      const response = await createStoryBook(bookDTO);
      const pages = savedStory.map((text, index) => ({
        pageNo: index + 1,
        fullStory: text["paragraph"],
        imageUrl: null,
        imageBase64: null,
        audioUrl: null,
      }));
      set(BookState, { bookId: response["bookId"], pages: pages });
      setBookId(response.bookId);
    } catch (error) {
      console.log(error);
    }
  });

  return token ? (
    <div className='story story-user'>
      {isLoading && <LoadingModal message='AI가 그림 그릴 준비를 합니다!' />}
      {showToast && (
        <ToastPopup
          show={showToast}
          message={`동화책의 페이지가 총 ${paraCount} 장입니다!`}
        />
      )}
      <Container className={"an1"}>
        <Header mode={"default"} />
        <ContentCover>
          <ContentTitle>동화를 직접 써볼 수 있어요!</ContentTitle>
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
                {savedStory.map((item, index) => (
                  <TextArea
                    key={index}
                    value={item["paragraph"]}
                    placeholder='재미있는 이야기를 작성해볼까요?'
                    maxLength={200}
                    onChange={(e) => onChangeHandler(e, index)}
                    style={{ margin: "1.2rem 0 0" }}
                  />
                ))}
              </Section>
              <ButtonWrap>
                <button
                  type='submit'
                  className='button'>
                  동화 만들러 가기
                </button>
              </ButtonWrap>
            </form>
          </InnerCover>
        </ContentCover>
      </Container>
    </div>
  ) : (
    (window.location.href = "/forbidden")
  );
};

export default StoryGenerated;
