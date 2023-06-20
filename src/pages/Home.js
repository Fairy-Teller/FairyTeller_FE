import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

const Home = () => {
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    setShowMain(true);
  }, []);

  return (
    <div id="main-background" className={showMain ? "show" : ""}>
      <div id="main-logo">
        <h1>fairyTeller</h1>
        <h3>AI를 활용한 나만의 동화 만들기</h3>
      </div>
      <div id="main-button">
        <Link to="/login">
          <button>동화 만들기</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
