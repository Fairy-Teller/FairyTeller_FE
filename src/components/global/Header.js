import '../../assets/css/header.scss';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { UserInfo } from '../../recoil/FairytaleState';
import { styled } from 'styled-components';
import { signout } from '../../service/UserService';

const UserName = styled.button`
    /* Rectangle 277 */

    width: 50%;
    height: 100%;
    color: white;
    font-size: large;

    /* background: #ef9999; */
    border-radius: 10px;
`;

const Header = (props) => {
    const navigate = useNavigate();
    const useInfo = useRecoilValue(UserInfo);
    const userReset = useResetRecoilState(UserInfo);

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
                <div style={{ width: '350px', display: 'flex', flexDirection: 'row' }}>
                    <UserName onClick={signoutClick}>로그아웃</UserName>
                    <UserName onClick={myPageClick}>마이페이지</UserName>
                    <UserName onClick={updateUserClick}>{useInfo} 작가님</UserName>
                </div>

                {props.children}
            </header>
        </div>
    );
};

export default Header;
