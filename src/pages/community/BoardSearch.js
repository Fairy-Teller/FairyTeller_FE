import React, { useState } from "react";
import "../../css/BoardSearch.css";
const BoardSearch = ({ handleSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("all");

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchInput, searchType);
  };

  return (
    <div className="board-search-container"style={{ marginBottom: '20px' }}>
      <form className="board-search" onSubmit={handleFormSubmit}>
        <select
          className="board-search__select"
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <option value="all">전체</option>
          <option value="author">작가</option>
          <option value="title">제목</option>
        </select>
        <input
          className="board-search__input"
          type="text"
          placeholder="검색어를 입력하세요."
          value={searchInput}
          onChange={handleInputChange}
        />
        <button className="board-search__button" type="submit">
          검색
        </button>
      </form>
    </div>
  );
  
};

export default BoardSearch;
