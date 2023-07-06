import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const SortBy = ({ handleSort }) => {
  const handleSortChange = (e) => {
    const sortType = e.target.value;
    handleSort(sortType);
  };

  return (
    <div style={styles.container}>
      <select onChange={handleSortChange} style={styles.select}>
        <option value="createdDatetime">최신순</option>
        <option value="likes">좋아요순</option>
      </select>
      <span style={styles.icon}>
        <FontAwesomeIcon icon={faSort} />
      </span>
    </div>
  );
};const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "2rem 0 1rem 0",
    width: "77%",
  },
  select: {
    width: "170px",
    padding: "9px",
    border: "none",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#f1f1f1",
    color: "#666",
    fontSize: "16px",
    appearance: "none",
    outline: "none",
    marginRight: "10px",
  },
  icon: {
    color: "#ef9999",
    fontSize: "16px",
  },
};

export default SortBy;