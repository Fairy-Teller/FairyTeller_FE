import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RecoilRoot>
            <AppRouter />
        </RecoilRoot>
    </React.StrictMode>
);

reportWebVitals();
