import React from "react";
import { Container, Grid, TextField, Typography, Button } from "@mui/material";
import { signin, socialLogin } from "../../service/UserService";
import { Link } from "react-router-dom";

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const userid = data.get("userid");
    const password = data.get("password");

    if (userid === "" || password === "") {
      alert("아이디 혹은 비밀번호를 입력해주세요");
      return;
    }
    signin({ userid: userid, password: password });
  };

  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
        </Grid>
      </Grid>
      <form noValidate onSubmit={handleSubmit}>
        {" "}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="userid"
              label="아이디"
              name="userid"
              autoComplete="userid"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="password"
              label="패스워드"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              로그인
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("kakao")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#FEE501" }}
            >
              카카오로 로그인하기
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("naver")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#50CA7E" }}
            >
              네이버로 로그인하기
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("google")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#EA4335" }}
            >
              구글로 로그인하기
            </Button>
          </Grid>
          <Grid item>
            <Link to="/signup" variant="body2">
              계정이 없습니까? 여기서 가입하세요
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
