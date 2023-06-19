import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { SelectedKeywords, StoryState, ImageState, ImageFix, BookState } from '../../recoil/Fairytailstate';

import { call } from '../../service/ApiService';
import Container from '../../components/global/Container';
import Section from '../../components/global/Section';
import ButtonWrap from '../../components/common/ButtonWrap';
import styled from 'styled-components';

const TextArea = styled.textarea`
    width: calc(100% - 0.25rem);
    height: 13rem;
    background-color: #efd3d3;
    overflow: auto;
    resize: none;
    font-size: 1.8em;
    border-radius: 1em;
    padding: 0.2em;
    font-family: emoji;
    text-align: center;
`;
const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Bar = styled.div`
    width: 100hw;
    height: 99px;
    text-align: left;
    background: #FCDEDE;
    font-family: 'Amiri';
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 88px;
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

const FormDiv= styled.div`
    width:80%;
    margin : auto;
`; 

const StoryGenerated = () => {
    const [loading, setLoading] = useState(false);
    const selectedKeywords = useRecoilValue(SelectedKeywords);
    const showImage = useRecoilValue(ImageFix);
    const [savedStory, setSavedStory] = useRecoilState(StoryState);
    const [savedBook, setSavedBook] = useRecoilState(BookState);
    // const [dataIdx, setDataIdx] = useState(0);
    // const [texts, setTexts] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
        console.log('saveStory', savedStory);
        console.log(selectedKeywords); // {keywords: Array(3)} // [{key: undefined, theme: 'ANIMAL', title: '공룡'}, {key: undefined, theme: 'PEOPLE', title: '의사'}, {key: undefined, theme: 'ANIMAL', title: '개구리'}]
    }, [selectedKeywords]);

    const fetchData = async () => {
        try {
            // setTexts(savedStory.text['text']);
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

    const onChangeHandler = (e, index) => {
        const newStory = [...savedStory];
        newStory[index] = { ...newStory[index], paragraph: e.target.value };
        setSavedStory(newStory);
      };
    const onSubmitHandler = (e) => {
        e.preventDefault();
        // setSavedStory(texts);
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
            const bookDTO = savedStory.map((text, index) => ({
                pageNo: index + 1,
                fullStory: text["paragraph"]
              }));

            console.log('bookDTO',bookDTO)
            await createBook({pages : bookDTO});
        } catch (error) {
            console.log('Error fetching data:', error);
        } finally {
            await navigate('/image-generated'); // 이미지 선택 화면으로 가기
        }
    };
    const createBook = useRecoilCallback(({ set }) => async (bookDTO) => {
        try {
            const response = await call('/book/create/story', 'POST', bookDTO);
            console.log(response)
            const pages = savedStory.map((text, index) => ({
                pageNo: index + 1,
                fullStory: text["paragraph"],
                imageUrl: null,
                imageBase64 : null,
                audioUrl: null
              }));
            await set(BookState, { bookId: response["bookId"], pages : pages });
        } catch (error) {
            console.log(error);
        }
    });
    

    return (
        <div className="tmp_story tmp_story-generated"> 
            {loading ? (
                <Container>
                    <Bar>FairyTeller</Bar>
                    <BookCover>
                    <img src="/images/loding_1.png" style={{ marginTop: '2%' }} />
                        <FairytaleTitle>AI가 만든 동화를 수정할 수 있어요!</FairytaleTitle>                        
                    <FormDiv>
                    <form onSubmit={onSubmitHandler}>
                        <Section className={''}>
                            {savedStory.map((item, index) => (
                               item['paragraph'] && (
                                <div style={{margin:'1em'}}>
                                <TextArea
                                    key={index}
                                    value={item['paragraph']}
                                    placeholder="만들어진 시나리오를 확인하고 수정해보아요"
                                    onChange={(e) => onChangeHandler(e, index)}
                                />                                    
                                </div>
                            )
                            ))}                                
                        </Section>
                        <ButtonWrap className="button-wrap">
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
                        <ButtonWrap className="button-wrap">
                            <button type="submit" className="button">
                                이야기 다시 만들기
                            </button>
                        </ButtonWrap>
                    </form>
                    </FormDiv>
                    {url && (
                        <ImageContainer>
                            <img src={url} alt="AI-generated" />
                        </ImageContainer>
                    )}
                </BookCover>
                </Container>
            ) : (
                <div>되는 중...</div>
            )}
        </div>
    );
};

export default StoryGenerated;
