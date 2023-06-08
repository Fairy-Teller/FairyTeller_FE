import React from 'react';
import App from './App';
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';
import SocialLogin from './pages/user/SocialLogin';
import Logout from './pages/user/Logout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="sociallogin" element={<SocialLogin />} />
                <Route path="Logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
