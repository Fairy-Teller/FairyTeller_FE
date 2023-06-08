import React from 'react';
import App from './App';
//home
import Home from './pages/Home';
import Start from './pages/Start';
//user
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';
import SocialLogin from './pages/user/SocialLogin';
import Logout from './pages/user/Logout';
//community
import Board from './pages/community/Board';
import BoardDetail from './pages/community/BoardDetail';
import My from './pages/community/My';
//fairytale
import Artstyle from './pages/fairytale/Artstyle';
import FairytaleEdit from './pages/fairytale/FairytaleEdit';
import FairytaleExport from './pages/fairytale/FairytaleExport';
import FairytaleShow from './pages/fairytale/FairytaleShow';
import Keyword from './pages/fairytale/Keyword';
import StoryGenerated from './pages/fairytale/StoryGenerated';
import StoryUser from './pages/fairytale/StoryUser';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function AppRouter() {
    return (
        // prettier-ignore
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="home" element={<Home />} />
                <Route path="start" element={<Start />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="sociallogin" element={<SocialLogin />} />
                <Route path="logout" element={<Logout />} />
                <Route path="board" element={<Board />} />
                <Route path="boarddetail" element={<BoardDetail />} />
                <Route path="my" element={<My />} />
                <Route path="artstyle" element={<Artstyle />} />
                <Route path="f-edit" element={<FairytaleEdit />} />
                <Route path="f-export" element={<FairytaleExport />} />
                <Route path="f-show" element={<FairytaleShow />} />
                <Route path="keyword" element={<Keyword />} />
                <Route path="story-generated" element={<StoryGenerated />} />
                <Route path="story-user" element={<StoryUser />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
