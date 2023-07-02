import React, { useState, useEffect } from "react";
import { updateUser, fetchUserData } from "../../service/UserService";
import { API_BASE_URL } from "../../api-config";
import axios from "axios";
import LazyBackground from "../../components/common/LazyBackground";
import base64_Bg from "../../script/BASE64_Bg";
import "../../css/updateUser.css";

function UpdateUser() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [isSocialLoginUser, setIsSocialLoginUser] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nickname) {
      alert("별명을 입력해주세요.");
      return;
    }

    if (!isSocialLoginUser && (!password || !confirmPassword)) {
      alert("패스워드를 입력해주세요.");
      return;
    }

    if (!isSocialLoginUser && password !== confirmPassword) {
      alert("패스워드가 일치하지 않습니다.");
      return;
    }

    const userData = isSocialLoginUser
      ? { nickname: nickname }
      : { nickname: nickname, password: password };

    updateUser(userData)
      .then(() => {
        alert("회원 정보가 수정되었습니다.");
      })
      .catch((error) => {
        alert("회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
        console.error("Error:", error);
      });
  };

  const checkNicknameAvailability = async () => {
    try {
      if (nickname === "") {
        alert("별명을 입력해주세요");
        return;
      }
      const response = await axios.get(
        API_BASE_URL + "/auth/signup/check-nickname",
        {
          params: { nickname: nickname },
        }
      );
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

  useEffect(() => {
    fetchUserData(setIsSocialLoginUser);
  }, []);

  return (
    <div id="background">
      <div id="container" style={{ marginTop: "8%" }}>
        <h1>회원 정보 수정</h1>
        <div id="update-container">
          <form noValidate onSubmit={handleSubmit}>
            {!isSocialLoginUser && (
              <>
                <div class="update-form">
                  <label htmlFor="password">새로운 패스워드</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div class="update-form">
                  <label htmlFor="confirmPassword">패스워드 확인</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div class="update-form">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
              <button onClick={checkNicknameAvailability} type="button">
                중복확인
              </button>
              {isNicknameAvailable === false && <p>이미 존재하는 별명입니다</p>}
              {isNicknameAvailable === true && <p>사용가능한 별명입니다</p>}
              {isNicknameAvailable === null && (
                <p>중복확인 버튼을 입력해주세요</p>
              )}
            </div>
            <div>
              <button class="submit" type="submit">
                정보 수정
              </button>
            </div>
          </form>
        </div>
      </div>
      <LazyBackground
        type="default"
        src="https://ik.imagekit.io/hbcho/StarryNight_start.jpg"
        placeholder={base64_Bg}
      />
    </div>
  );
}

export default UpdateUser;
