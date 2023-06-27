import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { StoryState, BookState } from "../../recoil/FairytaleState";
import { call } from "../../service/ApiService";
import Header from "../../components/global/Header";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import LoadingModal from "../../components/LoadingModal";
import styled from "styled-components";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

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
  const navigate = useNavigate();

  useEffect(() => {
    setSavedStory([
      { paragraph: "" },
      { paragraph: "" },
      { paragraph: "" },
      { paragraph: "" },
      { paragraph: "" },
    ]);
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

  const onChangeHandler = (e, index) => {
    const updatedStory = [...savedStory];

    updatedStory[index] = { ...updatedStory[index], paragraph: e.target.value };
    setSavedStory(updatedStory);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsBlockingKey(true);

    for (let i = 0; i < 5; i++) {
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
      console.log(savedStory);
      setIsLoading(false);
      setIsBlockingKey(false);
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
    <div className='story story-user'>
      {isLoading && <LoadingModal message='AI가 그림 그릴 준비를 합니다!' />}
      <Container>
        <Header mode={"default"} />
        <ContentCover>
          <ContentTitle>동화를 직접 써볼 수 있어요!</ContentTitle>
          <InnerCover>
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
  );
};

export default StoryGenerated;
