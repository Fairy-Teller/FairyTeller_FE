import React, { useState } from "react";
import axios from "axios";
import { signup } from "../../service/UserService";
import { API_BASE_URL } from "../../api-config";
import LazyBackground from "../../components/common/LazyBackground";
import base64_Bg from "../../script/BASE64_Bg";

import "../../css/signup.css";

function SignUp() {
  const [userInputUserId, setUserInputUserId] = useState("");
  const [isUidAvailable, setIsUidAvailable] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userInputNickname, setUserInputNickname] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);

  const checkUidAvailability = async () => {
    try {
      if (userInputUserId === "") {
        alert("아이디를 입력해주세요");
        return;
      }
      const response = await axios.get(API_BASE_URL + "/auth/signup/check-userid", {
        params: { userid: userInputUserId },
      });
      setIsUidAvailable(response.data);
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response && error.response.status === 400) {
        setIsUidAvailable(true);
      } else {
        setIsUidAvailable(null);
      }
    }
  };

  const checkNicknameAvailability = async () => {
    try {
      if (userInputNickname === "") {
        alert("별명을 입력해주세요");
        return;
      }
      const response = await axios.get(API_BASE_URL + "/auth/signup/check-nickname", {
        params: { nickname: userInputNickname },
      });
      setIsNicknameAvailable(response.data);
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response && error.response.status === 400) {
        setIsNicknameAvailable(true);
      } else {
        setIsNicknameAvailable(null);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isUidAvailable !== true) {
      alert("아이디 중복확인을 해주세요");
      return;
    }

    if (isNicknameAvailable !== true) {
      alert("닉네임 중복확인을 해주세요");
      return;
    }

    const data = new FormData(event.target);
    const userid = data.get("userid");
    const nickname = data.get("nickname");
    const password = data.get("password");

    if (password !== confirmPassword) {
      alert("패스워드가 일치하지 않습니다.");
      return;
    }

    signup({ userid: userid, nickname: nickname, password: password }).then((response) => {
      window.location.href = "/login";
    });
  };

  return (
    <div id='background'>
      <LazyBackground
        type='default'
        src='https://ik.imagekit.io/hbcho/starrynight.png'
        placeholder={base64_Bg}
      />
      <div id='container'>
        <form
          noValidate
          onSubmit={handleSubmit}>
          <h1>계정 생성</h1>

          <div class='signup-input-container'>
            <label htmlFor='userid'>아이디</label>
            <input
              type='text'
              id='userid'
              name='userid'
              autoFocus
              onChange={(e) => setUserInputUserId(e.target.value)}
              required
            />
            <button
              onClick={checkUidAvailability}
              type='button'>
              중복확인
            </button>
            {isUidAvailable === false && <p>이미 존재하는 아이디입니다</p>}
            {isUidAvailable === true && <p>사용가능한 아이디입니다</p>}
            {isUidAvailable === null && <p>중복확인 버튼을 입력해주세요</p>}
          </div>
          <div class='signup-input-container'>
            <label htmlFor='password'>패스워드</label>
            <input
              type='password'
              id='password'
              name='password'
              required
            />
          </div>
          <div class='signup-input-container'>
            <label htmlFor='confirmPassword'>패스워드 확인</label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div class='signup-input-container'>
            <label htmlFor='nickname'>닉네임</label>
            <input
              type='text'
              id='nickname'
              name='nickname'
              onChange={(e) => setUserInputNickname(e.target.value)}
              required
            />
            <button
              onClick={checkNicknameAvailability}
              type='button'>
              중복확인
            </button>
            {isNicknameAvailable === false && <p>이미 존재하는 별명입니다</p>}
            {isNicknameAvailable === true && <p>사용가능한 별명입니다</p>}
            {isNicknameAvailable === null && <p>중복확인 버튼을 입력해주세요</p>}
          </div>
          <div>
            <button
              class='submit'
              type='submit'>
              계정 생성
            </button>
          </div>
        </form>

        <div class='linkContainer'>
          <a href='/login'>이미 계정이 있습니까? 로그인 하세요</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
