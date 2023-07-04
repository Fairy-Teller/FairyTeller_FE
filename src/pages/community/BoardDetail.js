import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BoardDetailShow,
    BoardCommentSubmit,
    BoardDelete,
    LikeCommit,
    modifyCommit,
    DeleteBoard,
} from '../../service/BoardService';
import CommentSection from './CommentSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import '../../css/BoardDetail.css';
import FairytaleShow from '../fairytale/FairytaleShow';
import Header from '../../components/global/Header';
import { faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useSetRecoilState } from 'recoil';
import { BookId } from '../../recoil/FairytaleState';

const BoardDetail = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const bookIdSet = useSetRecoilState(BookId);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await BoardDetailShow(boardId);
            const boardData = response.data[0];
            bookIdSet(boardData.bookId);
            setBoard(boardData);
            setComments(boardData.comments);
            setCommentCount(boardData.comments.length);
            setLikeCount(boardData.likeCount);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setIsLiked(boardData.liked);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleCommentSubmit = async (comment) => {
        try {
            await BoardCommentSubmit(boardId, comment);
            fetchDataComments(currentPage);
        } catch (error) {
            console.log('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await BoardDelete(boardId, commentId);
            fetchDataComments(currentPage);
        } catch (error) {
            console.log('Error deleting comment:', error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await LikeCommit(boardId);

            // 응답에서 'likeCount'와 'liked'를 사용하여 상태를 업데이트
            if (response) {
                setIsLiked(response.liked);
                setLikeCount(response.likeCount);
            }
        } catch (error) {
            console.log('Error liking the board:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchDataComments(page);
    };

    const fetchDataComments = async (page) => {
        try {
            const pageSize = 10;
            const response = await modifyCommit(boardId, page, pageSize);

            setComments(response.data);
            setCommentCount(response.data.length);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.log('Error fetching comments:', error);
        }
    };

    const handleDeleteBoard = async () => {
        try {
            await DeleteBoard(boardId);
            navigate('/board'); // 삭제 후 게시판 목록 페이지로 이동
        } catch (error) {
            console.log('Error deleting board:', error);
        }
    };

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header mode={'default'} />
            <div>
                <div className="deleteButtonContainer">
                    <button className="goBoardButton" onClick={() => navigate('/board')}>
                        도서관 가기
                    </button>
                    <button
                        className={`deleteButton ${board.editable ? 'visible' : 'hidden'}`}
                        onClick={handleDeleteBoard}
                    >
                        Delete
                    </button>
                </div>
                <div>
                    <div className="title-container">
                        <h2 className="title">{board.title}</h2>
                        <div className="author">Author: {board.nickname}</div>
                        <div className="info">
                            <div className="dateCreated">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <div>
                                    작성일:{' '}
                                    {new Date(board.createdDatetime).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    })}
                                </div>
                            </div>
                            <div className="viewCount">
                                <FontAwesomeIcon icon={faEye} />
                                <div>조회수: {board.viewCount}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <FairytaleShow props={board.bookId} state="board" />
                    </div>
                    <div className="action-section">
                        <div className="like-button">
                            <button
                                className="like-btn"
                                onClick={handleLike}
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                            >
                                {isLiked ? (
                                    <FontAwesomeIcon icon={solidHeart} className="fa-heart" style={{ color: 'red' }} />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={regularHeart}
                                        className="fa-heart"
                                        style={{ color: 'red' }}
                                    />
                                )}
                                <span style={{ marginLeft: '5px' }}>
                                    {isLiked ? '동화가 마음에 들었어요!' : '동화가 마음에 드시나요?'}
                                </span>
                            </button>
                        </div>
                        <div className="action-icons" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
                            <div className="like-icon" style={{ marginRight: '15px' }}>
                                <FontAwesomeIcon icon={solidHeart} className="fa-heart" style={{ color: 'red' }} />
                                <span>{likeCount}명이 좋아합니다.</span>
                            </div>

                            <div className="comment-icon">
                                <FontAwesomeIcon icon={faComment} className="fa-comment" style={{ color: '#808080' }} />
                                <span>{commentCount}개의 댓글이 있습니다.</span>
                            </div>
                        </div>

                        <div className="comment-section">
                            <CommentSection
                                comments={comments}
                                setComments={setComments}
                                onCommentSubmit={handleCommentSubmit}
                                onDeleteComment={handleDeleteComment}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                boardId={boardId}
                                isBoardOwner={board.editable}
                            />
                        </div>
                    </div>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={currentPage === index ? 'activePageButton' : 'pageButton'}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardDetail;
