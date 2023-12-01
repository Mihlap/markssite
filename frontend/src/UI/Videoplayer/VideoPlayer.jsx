import React from "react";
import styles from "./Videoplayer.module.css";

const VideoPlayer = (({ videoSource }) => {
  let sourceURL = videoSource.large; 

  if (window.matchMedia("(max-width: 767px)").matches) {
    sourceURL = videoSource.small; 
  } else if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches) {
    sourceURL = videoSource.medium; 
  }
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

// import React, { useState } from 'react';

// const VideoPlayer = ({ videoSource }) => {
//   const [videoUrl, setVideoUrl] = useState(null);

//    const getVideoUrl = async () => {
//     try {
//       const response = await fetch(videoSource.large);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const videoBlob = await response.blob();
//       const url = URL.createObjectURL(videoBlob);
//       setVideoUrl(url);
//     } catch (error) {
//       console.error('Error fetching video:', error);
//     }
//   };

//   if (!videoUrl) {
//     getVideoUrl();
//     return null; 
//   }

//   return (
//     <div>
//       {videoUrl && (
//         <video className={styles.video_player}>
//           <source src={videoUrl} type="video/mp4" className={styles.video_header} />
//         </video>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;







