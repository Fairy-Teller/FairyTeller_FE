import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { SelectedKeywords, StoryState, ImageState, ImageFix } from '../../recoil/Fairytailstate';

import { call } from '../../service/ApiService';
import Container from '../../components/global/Container';
import Section from '../../components/global/Section';
import ButtonWrap from '../../components/common/ButtonWrap';
import styled from 'styled-components';

const TextArea = styled.textarea`
    width: calc(100% - 0.25rem);
    height: 10rem;
    background-color: lightgray;
    overflow: auto;
`;
const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;
const ScrollContainer = styled.div`
    overflow: scroll;
    height: 100vh; // 또는 적절한 높이 값
`;

const StoryGenerated = () => {
    const [loading, setLoading] = useState(false);
    const selectedKeywords = useRecoilValue(SelectedKeywords);
    const showImage = useRecoilValue(ImageFix);
    const [savedStory, setSavedStory] = useRecoilState(StoryState);
    const [dataIdx, setDataIdx] = useState(0);
    const [texts, setTexts] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
        console.log('???????');
        console.log('saveStory.text', savedStory.text['text']);
        console.log(selectedKeywords); // {keywords: Array(3)} // [{key: undefined, theme: 'ANIMAL', title: '공룡'}, {key: undefined, theme: 'PEOPLE', title: '의사'}, {key: undefined, theme: 'ANIMAL', title: '개구리'}]
    }, [selectedKeywords]);

    const fetchData = async () => {
        try {
            setTexts(savedStory.text['text']);
            // console.log(savedStory)
            // setSelectedKeywords(() => {
            //   return selectedKeywords.map((item) => ({
            //     key: setDataIdx((prev) => prev + 1),
            //   }));
            // });
            setLoading(true);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const onChangeHandler = (e) => {
        setTexts(e.target.value);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        setSavedStory(texts);
        console.log(savedStory);
    };

    const regenerateHandler = (e) => {
        e.preventDefault();

        resendkeyword({
            parameter1: selectedKeywords.keywords[0].title,
            parameter2: selectedKeywords.keywords[1].title,
            parameter3: selectedKeywords.keywords[2].title,
            parameter3: selectedKeywords.keywords[3].title,
            parameter3: selectedKeywords.keywords[4].title,
        });
    };

    const resendkeyword = useRecoilCallback(({ set }) => async (userDTO) => {
        try {
            const response = await call('/chat-gpt/question', 'POST', userDTO);
            
            await set(StoryState, { text: response });
            await set(SelectedKeywords, { keywords: selectedKeywords.keywords });
        } catch (error) {
            console.log(error);
        } finally {
            navigate('/story-generated');
        }
    });

    const resetSelectedKeywords = useResetRecoilState(SelectedKeywords);

    const gotoEdit = async () => {
        try {
            // await sendtext({
            //   text: texts,
            // });
        } catch (error) {
            console.log('Error fetching data:', error);
        } finally {
            await call('/book/create/story', 'POST', {
                fullStory: texts,
            });
            await navigate('/f-edit');
        }
    };


    return (
        <ScrollContainer className="story story-generated">
            {loading ? (
                <Container className={'fixed narrow'}>
                    <h1>
                        만들어진 시나리오를 확인하고 <br />
                        수정해보아요
                    </h1>
                    <form onSubmit={onSubmitHandler}>
                        <Section className={''}>
                            {savedStory.text.map((item, index) => (
                               item['paragraph'] && (
                                <TextArea
                                    key={index}
                                    value={item['paragraph']}
                                    placeholder="만들어진 시나리오를 확인하고 수정해보아요"
                                    onChange={(e) => onChangeHandler(e)}
                                />
                            )
                            ))}
                        </Section>
                        <ButtonWrap>
                            <Link to="/keyword" onClick={resetSelectedKeywords} className="button">
                                키워드 다시 고르기
                            </Link>

                            <button type="submit" className="button" onClick={gotoEdit}>
                                동화 만들러 가기
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
                            <button type="submit" className="button">
                                이야기 다시 만들기
                            </button>
                        </ButtonWrap>
                    </form>

                    {url && (
                        <ImageContainer>
                            <img src={url} alt="AI-generated" />
                        </ImageContainer>
                    )}
                </Container>
            ) : (
                <div>되는 중...</div>
            )}
        </ScrollContainer>
    );
};

export default StoryGenerated;
