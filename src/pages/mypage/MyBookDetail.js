import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookShow } from '../../service/MyPageService';
import FairytaleShow from '../fairytale/FairytaleShow';
import { useSetRecoilState } from 'recoil';
import { BookId } from '../../recoil/FairytaleState';

import Container from '../../components/global/Container';
import Header from '../../components/global/Header';

const MyBookDetail = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState([]);
    const changeBookId = useSetRecoilState(BookId);
    changeBookId(bookId);

    useEffect(() => {
        const bookShow = bookShow(bookId);
        setBook(bookShow.data[0]);
    }, []);

    return (
        <Container>
            <Header mode={'default'} />
            <div>
                <h2 className="title center" style={{ fontSize: '28px' }}>
                    {book.title}
                </h2>
            </div>
            <div>
                <FairytaleShow props={bookId} />
            </div>
        </Container>
    );
};

export default MyBookDetail;
