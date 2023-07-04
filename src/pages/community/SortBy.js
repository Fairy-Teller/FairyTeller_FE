import React from "react";

const SortBy = ({ handleSort }) => {
  const handleSortChange = (e) => {
    const sortType = e.target.value;
    handleSort(sortType);
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem 0' }}>
      <select onChange={handleSortChange} style={{ width: '200px' }}>
        <option value="createdDatetime">최신순</option>
        <option value="likes">좋아요순</option>
      </select>
    </div>
  );
};

export default SortBy;
