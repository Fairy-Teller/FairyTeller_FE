import React, { useState, useEffect, useRef } from "react";

const MusicBar = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const audioRef = useRef(null);
  const seekSliderRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audioElement.currentTime);
      }
      if (audioElement.currentTime === audioElement.duration) {
        setIsPlaying(false);
      }
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isSeeking]);

  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    audioRef.current.currentTime = seekTime;
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
  };

  const getSeekSliderWidth = () => {
    return duration > 0 ? `${(currentTime / duration) * 100}%` : "0%";
  };

  const getSeekSliderValue = () => {
    return isSeeking ? currentTime : currentTime.toFixed(2);
  };

  const styles = {
    musicBarContainer: {
      display: "flex",
      flexDirection: "row",
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
      marginRight: "10px", // Add some right margin for spacing
    },
    seekSliderContainer: {
      flex: 1, // Expand to fill the remaining space
      position: "relative",
      height: "4px",
      background: "#ddd",
      borderRadius: "2px",
      overflow: "hidden",
    },
    seekSlider: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      background: "#007bff",
      borderRadius: "2px",
    },
    inputRange: {
      width: "100%",
      opacity: 0,
      cursor: "pointer",
    },
  };
  
  return (
    <div style={styles.musicBarContainer}>
      <button style={styles.playButton} onClick={isPlaying ? handlePause : handlePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div style={styles.seekSliderContainer}>
        <div
          ref={seekSliderRef}
          style={{ ...styles.seekSlider, width: getSeekSliderWidth() }}
          onMouseDown={handleSeekMouseDown}
          onMouseUp={handleSeekMouseUp}
        ></div>
        <input
          type="range"
          min={0}
          max={duration}
          value={getSeekSliderValue()}
          onChange={handleSeek}
          step={0.01}
          style={styles.inputRange}
        />
      </div>
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default MusicBar;

