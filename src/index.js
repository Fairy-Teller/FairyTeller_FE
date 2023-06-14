import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </RecoilRoot>
  </React.StrictMode>
);

reportWebVitals();
