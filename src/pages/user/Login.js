import React, { useState } from "react";
import { signin, socialLogin } from "../../service/UserService";
import { Link } from "react-router-dom";
import LazyBackground from "../../components/common/LazyBackground";
import base64_Bg from "../../script/BASE64_Bg";


import "../../css/login.css";

const Login = () => {

  const [isSocialLogin, setIsSocialLogin] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSocialLogin) return;

    const data = new FormData(event.target);
    const userid = data.get("userid");
    const password = data.get("password");

    if (userid === "" || password === "") {
      alert("아이디 혹은 비밀번호를 입력해주세요");
      return;
    }
    signin({ userid: userid, password: password })
      .then((response) => {
        
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const handleSocialLogin = (provider) => {
    setIsSocialLogin(true);
    socialLogin(provider);
  };

  return (
    <div>
      <div id='background'>
        <LazyBackground
          type='default'
          src='https://ik.imagekit.io/hbcho/starrynight.png'
          placeholder={base64_Bg}
        />
        <div
          id='container'
          style={{ marginTop: "8%" }}>
          <h1>로그인</h1>
          <form
            noValidate
            onSubmit={handleSubmit}>
            <div className='textContainer'>
              <label htmlFor='userid'>아이디</label>
              <input
                className='textField'
                type='text'
                id='userid'
                name='userid'
                autoComplete='userid'
              />
            </div>
            <div className='textContainer'>
              <label htmlFor='password'>패스워드</label>
              <input
                className='textField'
                type='password'
                id='password'
                name='password'
                autoComplete='current-password'
              />
            </div>
            <div>
              <button
                className='submit'
                type='submit'>
                로그인
              </button>
            </div>
            <div>
              <button
                type='button'
                className='submit'
                onClick={() => {
                  setIsSocialLogin(true);
                  handleSocialLogin("kakao");
                }}
                style={{ backgroundColor: "#FEE501" }}>
                카카오로 로그인하기
              </button>
            </div>
            <div>
              <button
                type='button'
                className='submit'
                onClick={() => {
                  setIsSocialLogin(true);
                  handleSocialLogin("naver");
                }}
                style={{ backgroundColor: "#50CA7E" }}>
                네이버로 로그인하기
              </button>
            </div>
            <div>
              <button
                type='button'
                className='submit'
                onClick={() => {
                  setIsSocialLogin(true);
                  handleSocialLogin("google");
                }}
                style={{ backgroundColor: "#EA4335" }}>
                구글로 로그인하기
              </button>
            </div>
            <div className='linkContainer'>
              <Link to='/signup'>계정이 없습니까? 여기서 가입하세요</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
