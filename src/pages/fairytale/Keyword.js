import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { SelectedKeywords, StoryState } from "../../recoil/Fairytailstate";
import { call } from "../../service/ApiService";
import Container from "../../components/global/Container";
import Row from "../../components/global/Row";
import Section from "../../components/global/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";
import LoadingModal from '../../components/LoadingModal';

// const [ANIMAL, PEOPLE, COLOR, THING, PLACE] = ["ANIMAL", "PEOPLE", "COLOR", "THING", "PLACE"];

const Keywords = styled.ul`
  background-color: pink;
`;
const KeywordItem = styled.li`
  list-style: none;
  flex: 1 0 auto;
  padding: 0.625rem;
`;
const ItemTitle = styled.p`
  font-size: 14px;
`;
const ItemInput = styled.input`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

function Keyword() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedValues, setCheckedValues] = useRecoilState(SelectedKeywords);
  const [savedStory, setSavedStory] = useRecoilState(StoryState);
  const [dataIdx, setDataIdx] = useState(0);
  const [options, setOptions] = useState([{}]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await call("/keyword", "GET", null);
      setOptions(() => {
        return data.map((item) => ({
          key: setDataIdx((prev) => prev + 1),
          theme: item.keywordEnum,
          titles: item.titles,
        }));
      });
      setCheckedValues([]);
      setLoading(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleChecked = (target) => {
    setCheckedValues((prevValues) => {
      let updatedValues = [...prevValues];

      if (target.checked) {
        const selected = options.find((item) => item.titles.includes(target.name));
        if (selected && updatedValues.length < 5) {
          updatedValues.push(target.name);
        } else {
          target.checked = false;
          alert("5개까지 고를 수 있어요!");
        }
      } else {
        updatedValues = updatedValues.filter((item) => item !== target.name);
      }

      console.log(updatedValues);
      return updatedValues;
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    sendkeyword({
      parameter1: checkedValues[0],
      parameter2: checkedValues[1],
      parameter3: checkedValues[2],
      parameter4: checkedValues[3],
      parameter5: checkedValues[4],
    });
  };

  const sendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      setIsLoading(true); 
      const response = await call("/chat-gpt/question", "POST", userDTO);
      set(StoryState, { text: response });
      set(SelectedKeywords, { keywords: checkedValues });
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      navigate("/story-generated");
    }
  });

  return (
    <div className='story keyword'>
      {isLoading && <LoadingModal message='AI가 열심히 그림을 그리는 중입니다.' />}
      {loading ? (
        <Container className={"wide"}>
          <h1>
            고를 수 있는 키워드
            <br />
            최대 5개
          </h1>
          <form onSubmit={onSubmitHandler}>
            {options.map((item, index) => (
              <Section key={index}>
                <h2>{item.theme}</h2>
                <Keywords>
                  <Row>
                    {item.titles.map((title, subIndex) => (
                      <KeywordItem key={subIndex}>
                        <ItemInput
                          id={`keyword${title.key}`}
                          className='ItemInput'
                          type='checkbox'
                          name={title}
                          checked={title.checked}
                          onChange={(e) => handleChecked(e.target)}
                        />
                        <ItemTitle>{title}</ItemTitle>
                      </KeywordItem>
                    ))}
                  </Row>
                </Keywords>
              </Section>
            ))}
            <ButtonWrap>
              <button
                type='submit'
                className='button'>
                이야기 만들러 가기
              </button>
            </ButtonWrap>
          </form>
        </Container>
      ) : (
        <div>되는 중...</div>
      )}
    </div>
  );
}

export default Keyword;
