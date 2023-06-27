import React from 'react';
import { signin, socialLogin } from '../../service/UserService';
import { Link } from 'react-router-dom';

// UserInfo
import { useSetRecoilState } from 'recoil';
import { UserInfo } from '../../recoil/FairytaleState';

import '../../css/login.css';

const Login = () => {
    const userInfo = useSetRecoilState(UserInfo);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const userid = data.get('userid');
        const password = data.get('password');

        if (userid === '' || password === '') {
            alert('아이디 혹은 비밀번호를 입력해주세요');
            return;
        }
        signin({ userid: userid, password: password }).then((response) => {
            userInfo(response.nickname);
        });

        // userInfo(signin({ userid: userid, password: password }));
    };



    const handleSocialLogin = (provider) => {
        socialLogin(provider);
    };

    return (
        <div id="background">
            <div id="container" style={{ marginTop: '8%' }}>
                <h1>로그인</h1>
                <form noValidate onSubmit={handleSubmit}>
                    <div class="textContainer">
                        <label htmlFor="userid">아이디</label>
                        <input class="textField" type="text" id="userid" name="userid" autoComplete="userid" />
                    </div>
                    <div class="textContainer">
                        <label htmlFor="password">패스워드</label>
                        <input
                            class="textField"
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <button class="submit" type="submit">
                            로그인
                        </button>
                    </div>
                    <div>
                        <button
                            class="submit"
                            onClick={() => handleSocialLogin('kakao')}
                            style={{ backgroundColor: '#FEE501' }}
                        >
                            카카오로 로그인하기
                        </button>
                    </div>
                    <div>
                        <button
                            class="submit"
                            onClick={() => handleSocialLogin('naver')}
                            style={{ backgroundColor: '#50CA7E' }}
                        >
                            네이버로 로그인하기
                        </button>
                    </div>
                    <div>
                        <button
                            class="submit"
                            onClick={() => handleSocialLogin('google')}
                            style={{ backgroundColor: '#EA4335' }}
                        >
                            구글로 로그인하기
                        </button>
                    </div>
                    <div class="linkContainer">
                        <Link to="/signup">계정이 없습니까? 여기서 가입하세요</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
