import React from "react";
import styles from "./Videoplayer.module.css";

const VideoPlayer = React.memo(({ videoSource }) => {
  let sourceURL = videoSource.large; 

  // if (window.matchMedia("(max-width: 767px)").matches) {
  //   sourceURL = videoSource.small; 
  // } else if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches) {
  //   sourceURL = videoSource.medium; 
  // }
  return (
    <video className={styles.video_player} playsInline autoPlay muted loop>
      <source
        src={sourceURL}
        type="video/mp4"
        className={styles.video_header}
      />
    </video>
  );
});

export default VideoPlayer;
