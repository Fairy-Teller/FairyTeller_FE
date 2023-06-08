import React, { useState } from 'react';
import { TextField, Typography, Grid, Button, Container } from '@mui/material';
import axios from 'axios';
import { signup } from '../../service/UserService';
import { Link } from 'react-router-dom';

function SignUp() {
    const [uid, setUid] = useState('');
    const [isUidAvailable, setIsUidAvailable] = useState(null);

    const checkUidAvailability = async () => {
        if (uid === '') {
            alert('아이디를 입력해주세요');
        }
        try {
            const response = await axios.get('http://localhost:8080/auth/signup/check-userid', {
                params: { uid },
            });
            setIsUidAvailable(response.data);
        } catch (error) {
            console.error('There was an error!', error);
            setIsUidAvailable(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const userid = data.get('userid');
        const nickname = data.get('nickname');
        const password = data.get('password');

        signup({ userid: userid, nickname: nickname, password: password }).then((response) => {
            window.location.href = '/login';
        });
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '8%' }}>
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
                            onChange={(e) => setUid(e.target.value)}
                        />
                        <Button onClick={checkUidAvailability} type="button" variant="contained" color="primary">
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
                            name="nickname"
                            label="닉네임"
                            id="nickname"
                            autoComplete="current-password"
                        />
                        <Button type="button" variant="contained" color="primary">
                            중복확인
                        </Button>
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
