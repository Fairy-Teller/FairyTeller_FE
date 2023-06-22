import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    cursor: url(images/rocket.png) 2 2, auto !important;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <GlobalStyle />
    <RecoilRoot>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </RecoilRoot>
  </React.Fragment>
);

reportWebVitals();
