import React from "react";
import styles from "./Videoplayer.module.css";

const VideoPlayer = React.memo(() => {
  return (
    <video className={styles.video_player} playsInline autoPlay muted loop>
      <source
        src="./assets/PrimePark.mp4"
        type="video/mp4"
        className={styles.video_header}
      />
    </video>
  );
});

export default VideoPlayer;
