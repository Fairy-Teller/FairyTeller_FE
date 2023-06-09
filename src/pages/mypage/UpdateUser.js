import React, { useState } from "react";
import { TextField, Typography, Grid, Button, Container } from "@mui/material";
import { updateUser } from "../../service/UserService";

function UpdateUser() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = () => {
    // 입력 값 유효성 검사
    if (!nickname || !password || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 패스워드 일치 검사
    if (password !== confirmPassword) {
      alert("패스워드가 일치하지 않습니다.");
      return;
    }

    // 회원 정보 업데이트 요청
    const userData = {
      nickname: nickname,
      password: password,
    };

    updateUser(userData)
      .then(() => {
        alert("회원 정보가 수정되었습니다.");
      })
      .catch((error) => {
        alert("회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
        console.error("Error:", error);
      });
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
      <form noValidate onSubmit={handleUpdate}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              회원 정보 수정
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="새로운 패스워드"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              autoComplete="current-password"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {/* 중복 확인 버튼 및 메시지 */}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              정보 수정
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default UpdateUser;
