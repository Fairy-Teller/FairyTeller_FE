import '../../assets/css/header.scss';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { UserInfo } from '../../recoil/FairytaleState';
import { styled } from 'styled-components';
import { signout, currentUser } from '../../service/UserService';
import { useEffect, useState } from 'react';

const ButtonWrap = styled.div`
    min-width: 375px;
    display: flex;
`;
const UserAction = styled.button`
    flex: 1;
    color: white;
    font-size: 1rem;
`;
const UserNickname = styled.button`
    flex: 1 1 auto;
    max-width: 180px;
    padding: 0 0.4rem;
    margin: 0 0.4rem 0 0;
    color: white;
    font-size: 1rem;
`;

const Header = (props) => {
    const navigate = useNavigate();
    const [useInfo, setUseInfo] = useState(null);
    const userReset = useResetRecoilState(UserInfo);
    useEffect(() => {
        const userInfoSet = currentUser();
        userInfoSet.then((item) => {
            console.log('>>>>>>>>', item);
            setUseInfo(item.nickname);
        });
        console.log(userInfoSet);
    }, []);

    const handleClick = () => {
        navigate('/start');
    };

    const signoutClick = () => {
        userReset();
        signout();
    };
    const myPageClick = () => {
        navigate('/My');
    };
    const updateUserClick = () => {
        navigate('/updateUser');
    };

    return (
        <div className="header-wrap">
            <header className={`header ${props.className === undefined ? '' : props.className}`}>
                {/* <h1 className='logo'>{props.mode === "default" ? "FairyTeller" : "pagename..?"}</h1> */}
                <button id={'logo'} onClick={handleClick}>
                    <img src="../../logo-bright.png" />
                </button>
                <ButtonWrap>
                    <UserAction onClick={signoutClick}>로그아웃</UserAction>
                    <UserAction onClick={myPageClick}>마이페이지</UserAction>
                    <UserNickname onClick={updateUserClick}>{useInfo} 작가님</UserNickname>
                </ButtonWrap>

                {props.children}
            </header>
        </div>
    );
};

export default Header;
