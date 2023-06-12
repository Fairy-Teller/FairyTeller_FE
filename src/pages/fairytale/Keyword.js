import React, { useState, useEffect } from "react";
import { call } from "../../service/ApiService";
import { sendkeyword } from "../../service/MainService";
import Container from "../../components/layout/Container";
import Row from "../../components/layout/Row";
import Section from "../../components/layout/Section";
import ButtonWrap from "../../components/common/ButtonWrap";
import styled from "styled-components";

const ANIMAL = "animal";
const PEOPLE = "people";

// const options = [
//   { key: 0, theme: ANIMAL, title: "강아지" },
//   { key: 1, theme: ANIMAL, title: "고양이" },
//   { key: 2, theme: ANIMAL, title: "쥐" },
//   { key: 3, theme: ANIMAL, title: "개구리" },
//   { key: 4, theme: ANIMAL, title: "여우" },
//   { key: 5, theme: ANIMAL, title: "판다" },
//   { key: 10, theme: PEOPLE, title: "엄마" },
//   { key: 11, theme: PEOPLE, title: "아빠" },
//   { key: 12, theme: PEOPLE, title: "경찰관" },
//   { key: 13, theme: PEOPLE, title: "의사" },
//   { key: 14, theme: PEOPLE, title: "요리사" },
//   { key: 15, theme: PEOPLE, title: "선생님" },
// ];

const Keywords = styled.ul``;

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
  const [checkedValues, setCheckedValues] = useState([]);
  const [dataIdx, setDataIdx] = useState(1);
  const [options, setOptions] = useState([
    {
      key: 0,
      theme: ANIMAL,
      title: "테스트",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await call("/keyword", "GET", null);
      const dataArray = response.data;
      setOptions(() => {
        dataArray.map(
          (item) =>
            setDataIdx((prev) => prev + 1)[
              { key: dataIdx, theme: item.keywordEnum, title: item.title }
            ]
        );
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleChecked = (title) => {
    const bool = checkedValues.some((item) => item.title === title);
    if (bool) {
      const updated = checkedValues.filter((item) => item.title !== title);
      setCheckedValues(updated);
    } else {
      const selected = options.find((item) => item.title === title);
      setCheckedValues([...checkedValues, selected]);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // const data = new FormData(e.target);

    sendkeyword({
      parameter1: checkedValues[0].title,
      parameter2: checkedValues[1].title,
      parameter3: checkedValues[2].title,
    });
    console.log(checkedValues);

    // fetch("http://localhost:8080/chat-gpt/question", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     parameter1: checkedValues[0].title,
    //     parameter2: checkedValues[1].title,
    //     parameter3: checkedValues[2].title,
    //   }),
    // });
  };

  return (
    <div>
      <Container className={""}>
        <h1>
          추천 키워드<p>최대 3개</p>
        </h1>
        <form onSubmit={onSubmitHandler}>
          <Section className={ANIMAL}>
            <h2>{ANIMAL}</h2>
            <Keywords>
              <Row>
                {options.map((item) =>
                  item.theme === ANIMAL ? (
                    <KeywordItem>
                      <ItemInput
                        id={`keyword${item.key}`}
                        name={item.title}
                        type='checkbox'
                        checked={item.checked}
                        className='ItemInput'
                        onChange={(e) => handleChecked(e.target.name)}
                      />
                      <ItemTitle>{item.title}</ItemTitle>
                    </KeywordItem>
                  ) : null
                )}
              </Row>
            </Keywords>
          </Section>
          <Section className={PEOPLE}>
            <h2>{PEOPLE}</h2>
            <Keywords>
              <Row>
                {options.map((item) =>
                  item.theme === PEOPLE ? (
                    <KeywordItem>
                      <ItemInput
                        id={`keyword${item.key}`}
                        name={item.title}
                        type='checkbox'
                        checked={item.checked}
                        className='ItemInput'
                        onChange={(e) => handleChecked(e.target.name)}
                      />
                      <ItemTitle>{item.title}</ItemTitle>
                    </KeywordItem>
                  ) : null
                )}
              </Row>
            </Keywords>
          </Section>
          <ButtonWrap>
            <button
              type='submit'
              className='button'>
              이야기 만들러 가기
            </button>
          </ButtonWrap>
        </form>
      </Container>
    </div>
  );
}

export default Keyword;
