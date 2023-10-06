import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ConstructorPage.module.scss";

import svg1 from "./svg/Group4650.svg";
import svg2 from "./svg/Group4648.svg";
import svg3 from "./svg/Group4651.svg";
import svg4 from "./svg/Group4652.svg";
import svg5 from "./svg/Group4649.svg";
import svg6 from "./svg/Group4641.svg";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function ConstructorPage({ handleClick }) {
   const [showNotification, setShowNotification] = useState(false);
   const [selectedVideo, setSelectedVideo] = useState(null);

   const handleVideoChange = (event) => {
    setSelectedVideo(event.target.files[0]);
    handleVideoUpload(event.target.files[0]);
  };

  const handleVideoUpload = async (video) => {
    if (video) {
      const formData = new FormData();
      formData.append("video", video);

      try {
        const response = await axios.post(
          `${Host}/api/video/upload-video`,
          formData
        );
        console.log("Video uploaded successfully!", response.data);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };


 

  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Уведомление исчезнет через 2 секунды
    }
  }, [showNotification]);

  // const handleVideoClick = () => {
  //   setShowNotification(true);
  // };

  return (
    <div className={styles.div_conteiner}>
      {/* блок с картинкой и описание картинки  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne}`}
        onClick={() =>
          handleClick([
            { type: "file", label: "Картинка с описанием" },
            { type: "text", label: "Описание картинки" },
          ])
        }
      >
        <img src={svg1} alt="svg_one_icon" />
      </div>
      {/* блок заголовок и описание  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTwo}`}
        onClick={() =>
          handleClick([
            { type: "text", label: "Заголовок" },
            { type: "textarea", label: "Текстовый блок" },
          ])
        }
      >
        <img src={svg2} alt="svg_two_icon" />
      </div>
      {/* блок с тремя картинками где горизонтальные, одна вертикальная  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockThree}`}
        onClick={() =>
          handleClick([{ type: "file", label: "Блок 3 картинки" }])
        }
      >
        <img src={svg3} alt="svg_three_icon" />
      </div>
      {/* блок с двумя вертикальными картинками  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFour}`}
        onClick={() =>
          handleClick([
            { type: "file", label: "Блок 2е вертикальные картинки" },
          ])
        }
      >
        <img src={svg4} alt="svg_three_icon" />
      </div>
      {/* слайдер с картинками  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
        onClick={() =>
          handleClick([
            {
              type: "file",
              label: "Слайдер *допускается загрузка 8ми изображений",
            },
          ])
        }
      >
        <img src={svg5} alt="svg_three_icon" />
      </div>
       <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
        >
         <label>
          <input
            type="file"
            accept="video/*"
            onClick={() => handleClick([ {type: "video", label: "video"} ])}
            onChange={handleVideoChange}
            style={{ display: "none" }}
          />
          <img
            src={svg6}
            alt="svg_six_icon"
          />
        </label>
      </div>
      {/* <div
        className={`${styles.notification} ${
          showNotification ? styles.showNotification : ""
        }`}
      >
        Сейчас загрузка видео недоступна 😢
      </div> */}
    </div>
  );
}
