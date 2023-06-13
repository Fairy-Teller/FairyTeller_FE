import React, { useState, useRef } from "react";

const MusicBar = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  if (audioUrl === null) {
    return null; // audioUrl is null
  }

  return (
    <div style={styles.musicBarContainer}>
      <button
        style={styles.playButton}
        onClick={isPlaying ? handlePause : handlePlay}
        disabled={!audioUrl} //if audioUrl is null
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

const styles = {
  musicBarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  playButton: {
    fontSize: "16px",
    padding: "10px 20px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default MusicBar;
