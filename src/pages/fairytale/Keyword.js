import React, { useState, useEffect } from "react";
import { device } from "../../assets/css/devices";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilCallback } from "recoil";
import { SelectedKeywordsState, StoryState } from "../../recoil/FairytaleState";
import { call } from "../../service/ApiService";
import styled from "styled-components";
import Header from "../../components/global/Header";
import Container from "../../components/global/Container";
import Row from "../../components/global/Row";
import Section from "../../components/global/Section";
import LoadingModal from "../../components/LoadingModal";
import ContentCover from "../../components/global/ContentCover";
import ContentTitle from "../../components/global/ContentTitle";
import InnerCover from "../../components/global/InnerCover";

const KeywordItem = styled.div`
  width: 100%;
  max-width: 17.5%;
  @media ${device.tablet} {
    max-width: 33.333%;
  }
  margin: 0.4rem auto 0.4rem;
`;
const KeywordInner = styled.div`
  width: 8rem;
  padding: 0.4rem 0.8rem 0.8rem;
  margin: 0 auto 0.8rem;
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  transition: background 0.24s ease-in-out;
  &:hover {
    color: white;
    background-color: #edaeae;
  }
`;
const ItemTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
`;
const ItemTitleText = styled.p`
  padding: 0.4rem 0 0;
  margin: 0.8rem auto 0;
  font-size: 1.6rem;
`;
const ItemInput = styled.input`
  width: 10.4rem;
  height: 12.8rem;
  @media ${device.tablet} {
    width: 8.4rem;
    height: 10.4rem;
  }
  position: absolute;
  top: 0;
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  appearance: none;
`;
const SectionKeyword = styled.div`
  padding: 0 2rem 2rem 2rem;
  margin: 0 1.2rem 2rem;
  border: 0.4rem solid #edaeae;
  border-radius: 2rem;

  &:first-of-type {
    padding: 0 2rem 0.4rem;
    margin-top: 2rem;
  }
`;
const InputLabel = styled.div`
  font-size: 1.4rem;
  text-align: center;
`;
const InputWrap = styled.div`
  margin: 2rem auto 0;
  text-align: center;
`;
const InputKeyword = styled.input`
  padding: 0.8rem 1.2rem;
  margin: 0 2rem 0 0;
  @media ${device.tablet} {
    margin: 0 0 0.8rem 0;
  }
  font-size: 1.4rem;
  text-align: left;
  border-radius: 0.4rem;
  border: 0.2rem pink solid;
`;
const InputSubmit = styled.button`
  padding: 1.2rem 1.6rem;
  font-size: 1.4rem;
  text-align: center;
  border-radius: 2rem;
  background-color: pink;
`;
const NoticeText = styled.p`
  font-size: 1.6rem;
`;

const Keyword = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlockingKey, setIsBlockingKey] = useState(false);
  const [keywords, setKeywords] = useRecoilState(SelectedKeywordsState);
  const [dataIdx, setDataIdx] = useState(0);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([{}]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    setInput("");
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

  const fetchData = async () => {
    try {
      const data = await call("/keyword", "GET", null);

      setOptions(() => {
        return data.map((item) => ({
          key: setDataIdx((prev) => prev + 1),
          titles: item.titles,
          theme: item.theme,
        }));
      });
      setKeywords([]);
      setLoaded(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleInputed = () => {
    if (input === "" || null || undefined) {
      alert("단어를 다시 입력해주세요!");
    } else {
      setKeywords((prev) => {
        let updatedValues = [...prev];

        if (updatedValues.length < 5) {
          updatedValues.push(input);
        } else {
          alert("단어는 최대 5개까지 선택할 수 있어요!");
        }
        return updatedValues;
      });
    }
    setInput("");
  };

  const handleChecked = (target) => {
    setKeywords((prev) => {
      let updatedValues = [...prev];

      if (target.checked) {
        const selected = options.find((item) => item.titles.includes(target.name));
        if (selected && updatedValues.length < 5) {
          updatedValues.push(target.name);
        } else {
          target.checked = false;
          alert("단어는 최대 5개까지 선택할 수 있어요!");
        }
      } else {
        updatedValues = updatedValues.filter((item) => item !== target.name);
      }

      return updatedValues;
    });
  };

  const handleCurrClicked = (target) => {
    const name = target.getAttribute("name");
    setKeywords((prev) => {
      let updatedValues = [...prev];
      updatedValues = updatedValues.filter((item) => item !== name);

      return updatedValues;
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsBlockingKey(true);

    keywords.length < 3
      ? alert("단어는 3개 이상 선택해주세요!")
      : sendkeyword({
          parameter1: keywords[0],
          parameter2: keywords[1],
          parameter3: keywords[2],
          parameter4: keywords[3] == null || undefined ? "" : keywords[3],
          parameter5: keywords[4] == null || undefined ? "" : keywords[4],
        });
  };

  const sendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
    try {
      setIsLoading(true);
      const response = await call("/chat-gpt/question", "POST", userDTO);
      set(StoryState, response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBlockingKey(false);
      navigate("/story-generated");
    }
  });

  useEffect(() => {
    const target = document.querySelector(".current");

    if (target !== null) {
      const handleScroll = () => {
        const scrollThreshold = 300;

        if (window.scrollY > scrollThreshold) {
          target.classList.add("fixed");
        } else {
          target.classList.remove("fixed");
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  });

  return (
    <div className='story keyword'>
      {isLoading && <LoadingModal message='AI가 열심히 이야기를 만드는 중입니다.' />}

      <Container className={"an1"}>
        <Header mode={"default"} />
        <ContentCover>
          <ContentTitle>단어를 3개부터 5개까지 선택해보아요!</ContentTitle>
          {loaded ? (
            <InnerCover>
              <form onSubmit={onSubmitHandler}>
                <Row className='current'>
                  <div>
                    {keywords.length > 0 ? (
                      keywords.map((item) => {
                        return (
                          <div
                            key={item + "-inputed"}
                            name={item}
                            onClick={(e) => handleCurrClicked(e.target)}>
                            {item}
                          </div>
                        );
                      })
                    ) : (
                      <NoticeText>동화에 넣을 키워드를 골라보아요</NoticeText>
                    )}
                  </div>
                  <button
                    type='submit'
                    className='button'>
                    이야기 만들러 가기
                  </button>
                </Row>
                <SectionKeyword>
                  <Section>
                    <InputLabel>
                      동화에 넣을 단어가 떠올랐다면, 직접 적어서 넣을 수도 있어요
                    </InputLabel>
                    <InputWrap>
                      <InputKeyword
                        id='keyword-inputed'
                        type='text'
                        name='keyword-inputed'
                        placeholder='단어를 직접 넣어보아요'
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <InputSubmit
                        type='button'
                        onClick={handleInputed}>
                        내가 쓴 단어 넣기
                      </InputSubmit>
                    </InputWrap>
                  </Section>
                </SectionKeyword>
                {options.map((item, index) => (
                  <SectionKeyword>
                    <Section key={index}>
                      <h2 style={{ paddingBottom: "1rem" }}>{item.theme}</h2>
                      <Row className={"wrap"}>
                        {item.titles.map((title, subIndex) => (
                          <KeywordItem key={subIndex + "-options"}>
                            <KeywordInner>
                              <img
                                src={`./images/keywords/${title}.png`}
                                alt={`recommandation keyword - ${title}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                              <ItemTitle>
                                <ItemInput
                                  type='checkbox'
                                  name={title}
                                  checked={title.checked}
                                  onChange={(e) => handleChecked(e.target)}
                                />
                                <ItemTitleText>{title}</ItemTitleText>
                              </ItemTitle>
                            </KeywordInner>
                          </KeywordItem>
                        ))}
                      </Row>
                    </Section>
                  </SectionKeyword>
                ))}
              </form>
            </InnerCover>
          ) : (
            <div>되는 중...</div>
          )}
        </ContentCover>
      </Container>
    </div>
  );
};

export default Keyword;
