import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import { SelectedKeywords, GeneratedStoryState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 10rem;
  background-color: lightgray;
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

function StoryGenerated() {
  const [loading, setLoading] = useState(false);
  const selectedKeywords = useRecoilValue(SelectedKeywords);
  const [savedStory, setSavedStory] = useRecoilState(GeneratedStoryState);
  const [dataIdx, setDataIdx] = useState(0);
  const [texts, setTexts] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    console.log(savedStory.text["text"]);
    console.log(selectedKeywords); // {keywords: Array(3)} // [{key: undefined, theme: 'ANIMAL', title: '공룡'}, {key: undefined, theme: 'PEOPLE', title: '의사'}, {key: undefined, theme: 'ANIMAL', title: '개구리'}]
  }, [selectedKeywords]);

  const fetchData = async () => {
    try {
      setTexts(savedStory.text["text"]);
      // setSelectedKeywords(() => {
      //   return selectedKeywords.map((item) => ({
      //     key: setDataIdx((prev) => prev + 1),
      //   }));
      // });

      setLoading(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onChangeHandler = (e) => {
    setTexts(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSavedStory(texts);
    // sendtext({
    //     text: texts,
    // });
  };

  // const sendtext = useRecoilCallback(({ set }) => async (userDTO) => {
  //     try {
  //         const response = await call('/chat-gpt/summarize', 'POST', userDTO);
  //         await set(GeneratedStoryState, { text: texts });

  //         const imageData = response; // 응답 데이터 - Base64 문자열
  //         const byteCharacters = atob(imageData); // Base64 디코딩
  //         const byteArrays = [];

  //         for (let i = 0; i < byteCharacters.length; i++) {
  //             byteArrays.push(byteCharacters.charCodeAt(i));
  //         }

  //         const imageBlob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
  //         const imageUrl = URL.createObjectURL(imageBlob);

  //         setUrl(imageUrl);
  //     } catch (error) {
  //         console.log(error);
  //     } finally {
  //         // navigate("/f-edit");
  //     }
  // });

  const regenerateHandler = (e) => {
    e.preventDefault();

    resendkeyword({
      parameter1: selectedKeywords.keywords[0].title,
      parameter2: selectedKeywords.keywords[1].title,
      parameter3: selectedKeywords.keywords[2].title,
    });
  };

  const resendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      const response = await call("/chat-gpt/question", "POST", userDTO);
      await set(GeneratedStoryState, { text: response });
      await set(SelectedKeywords, { keywords: selectedKeywords.keywords });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/story-generated");
    }
  });

  const callbackSavedStory = useRecoilCallback(({ set }) => async (response) => {
    await set(GeneratedStoryState, { text: response });
  });

  const resetSelectedKeywords = useResetRecoilState(SelectedKeywords);

  const gotoEdit = async () => {
    try {
      const savedStorys = await call("/book/create/story", "POST", {
        fullStory: texts,
      });
      console.log(savedStorys);
      navigate("/f-edit");
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <div className='story story-generated'>
      {loading ? (
        <Container className={"fixed narrow"}>
          <h1>
            만들어진 시나리오를 확인하고 <br />
            수정해보아요
          </h1>
          <form onSubmit={onSubmitHandler}>
            <Section className={""}>
              <TextArea
                value={texts}
                placeholder='만들어진 시나리오를 확인하고 수정해보아요'
                onChange={(e) => onChangeHandler(e)}
              />
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
                className='button'
                onClick={gotoEdit}>
                그림 뽑기
              </button>
            </ButtonWrap>
          </form>
          {/* <Link
            to='/keyword'
            onClick={resetSelectedKeywords}
            className='button'
          /> */}
          <form onSubmit={regenerateHandler}>
            <ButtonWrap>
              <button
                type='submit'
                className='button'>
                이야기 다시 만들기
              </button>
            </ButtonWrap>
          </form>

          {url && (
            <ImageContainer>
              <img
                src={url}
                alt='AI-generated'
              />
            </ImageContainer>
          )}
        </Container>
      ) : (
        <div>되는 중...</div>
      )}
    </div>
  );
}

export default StoryGenerated;
