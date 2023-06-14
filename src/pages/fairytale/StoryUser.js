import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { StoryState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import Container from "../../components/global/Container";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: calc(100% - 0.25rem);
  height: 10rem;
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StoryUser = () => {
  const [loading, setLoading] = useState(false);
  const [writtenStory, setWrittenStory] = useRecoilState(StoryState);
  const [texts, setTexts] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
  }, []);

  const onChangeHandler = (e) => {
    setTexts(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setWrittenStory(texts);
    // sendtext({
    //   text: texts,
    // });
    console.log(writtenStory);
  };

  // const sendtext = useRecoilCallback(({ set }) => async (userDTO) => {
  //   try {
  //     const response = await call("/chat-gpt/summarize", "POST", userDTO);
  //     await set(StoryState, { text: texts });

  //     const imageData = response; // 응답 데이터 - Base64 문자열
  //     const byteCharacters = atob(imageData); // Base64 디코딩
  //     const byteArrays = [];

  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteArrays.push(byteCharacters.charCodeAt(i));
  //     }

  //     const imageBlob = new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" });
  //     const imageUrl = URL.createObjectURL(imageBlob);

  //     setUrl(imageUrl);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     // navigate("/f-edit");
  //   }
  // });

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
    <div className='story story-user'>
      {loading ? (
        <Container className={"fixed narrow"}>
          <h1>
            내가 생각한 이야기를 <br />
            작성해보아요
          </h1>
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
                className='button'
                onClick={gotoEdit}>
                동화책 만들러 가기
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
};

export default StoryUser;
