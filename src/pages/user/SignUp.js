import React, { useState } from "react";
import { TextField, Typography, Grid, Button, Container } from "@mui/material";
import axios from "axios";
import { signup } from "../../service/UserService";
import { Link } from "react-router-dom";

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
      const response = await axios.get(
        //"http://localhost:8080/auth/signup/check-userid",
        "http://52.79.227.173:8080/auth/signup/check-userid",
        {
          params: { userid: userInputUserId },
        }
      );
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
      const response = await axios.get(
        //"http://localhost:8080/auth/signup/check-nickname",
        "http://52.79.227.173:8080/auth/signup/check-nickname",
        {
          params: { nickname: userInputNickname },
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

    signup({ userid: userid, nickname: nickname, password: password }).then(
      (response) => {
        window.location.href = "/login";
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              계정 생성
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="userid"
              variant="outlined"
              required
              fullWidth
              id="userid"
              label="아이디"
              autoFocus
              onChange={(e) => setUserInputUserId(e.target.value)}
            />
            <Button
              onClick={checkUidAvailability}
              type="button"
              variant="contained"
              color="primary"
            >
              중복확인
            </Button>
            {isUidAvailable === false && <p>이미 존재하는 아이디입니다</p>}
            {isUidAvailable === true && <p>사용가능한 아이디입니다</p>}
            {isUidAvailable === null && <p>중복확인 버튼을 입력해주세요</p>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="패스워드"
              type="password"
              id="password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="confirmPassword"
              label="패스워드 확인"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="nickname"
              label="닉네임"
              id="nickname"
              onChange={(e) => setUserInputNickname(e.target.value)}
            />
            <Button
              onClick={checkNicknameAvailability}
              type="button"
              variant="contained"
              color="primary"
            >
              중복확인
            </Button>
            {isNicknameAvailable === false && <p>이미 존재하는 별명입니다</p>}
            {isNicknameAvailable === true && <p>사용가능한 별명입니다</p>}
            {isNicknameAvailable === null && (
              <p>중복확인 버튼을 입력해주세요</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <Link to="/login" variant="body2">
              이미 계정이 있습니까? 로그인 하세요
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default SignUp;
