import React from "react";
import App from "./App";
import Login from "./Login";
import SignUp from "./SignUp";
import SocialLogin from "./SocialLogin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="sociallogin" element={<SocialLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
