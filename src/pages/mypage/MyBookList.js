import React, { useState, useEffect } from 'react';
import { mineFinal } from '../../service/MyPageService';
import Container from '../../components/global/Container';
import Header from '../../components/global/Header';
import ContentCover from '../../components/global/ContentCover';
import ContentTitle from '../../components/global/ContentTitle';
import InnerCover from '../../components/global/InnerCover';
import BookContainer from '../../components/global/BookContainer';
import Book from '../../components/global/Book';

const MyBookList = () => {
    const [finalBooks, setFinalBooks] = useState([]);

    // const truncateTitle = (title) => {
    //     if (title.length > 10) {
    //         return title.substring(0, 10) + '...';
    //     }
    //     return title;
    // };

    useEffect(() => {
        const respoone = mineFinal();
        respoone.then((respoone) => {
            setFinalBooks(respoone.data);
        });
    }, []);

    return (
        <Container>
            <Header mode={'default'} />
            <ContentCover>
                <div style={{ height: '35px' }}></div>
                <ContentTitle>내가 만든 책 모음</ContentTitle>
                <InnerCover>
                    <BookContainer>
                        {finalBooks ? (
                            finalBooks.map((book) => (
                                <Book
                                    book={book}
                                    linkPath="myBookList"
                                    idProperty="bookId" // Use the 'bookId' property
                                    key={book.bookId}
                                    showSub={false}
                                />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center' }}>게시물이 없습니다.</p>
                        )}
                    </BookContainer>
                </InnerCover>
            </ContentCover>
        </Container>
    );
};

export default MyBookList;
