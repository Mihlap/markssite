import React, { useEffect, useState } from "react";
import styles from "./ConstructorPage.module.scss";

import svg1 from "./svg/Group4650.svg";
import svg2 from "./svg/Group4648.svg";
import svg3 from "./svg/Group4651.svg";
import svg4 from "./svg/Group4652.svg";
import svg5 from "./svg/Group4649.svg";
import svg6 from "./svg/Group4641.svg";
import svg7 from './svg/Group4348.svg';
import quoteRight from "./svg/icomoon-free_quotes-right.svg";
import quoteLeft from "./svg/icomoon-free_quotes-right2.svg";
import svg8 from "./svg/Group4348.svg";
import svg9 from "./svg/Group46412.svg";

export default function ConstructorPage({ handleClick }) {
  // const handleVideoClick = () => {
  //   window.alert("Сейчас загрузка видео недоступна.");
  // };

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Уведомление исчезнет через 2 секунды
    }
  }, [showNotification]);

  const handleVideoClick = () => {
    setShowNotification(true);
  };
  return (
    <div className={styles.div_conteiner}>
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

      {/* блок описание */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSeven}`}
        onClick={() =>
          handleClick([{ type: "textarea", label: "Блок описание" }])
        }
      >
        <img src={svg7} alt="svg_two_icon" />
      </div>

      {/* Текст в рамочке */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockEight}`}
        onClick={() =>
          handleClick([{ type: "textarea", label: "Текст в рамочке" }])
        }
      >
        <img
          className={styles.div_conteiner__blockEight_img}
          src={svg7}
          alt="svg_two_icon"
        />
      </div>

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

      {/* блок с цитала с фио, описание, картинка  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockNine}`}
        onClick={() =>
          handleClick([
            { type: "text", label: "Автор цитаты ( ФИО должность )" },
            { type: "textarea", label: "Текст цитаты" },
            { type: "file", label: "Фото автора статьи" },
          ])
        }
      >
        <div className={styles.block_quote_img}>
          <img
            className={styles.div_conteiner__blockNine_imgLeft}
            src={quoteLeft}
            alt="ковычки вверх"
          />
          <img src={svg8} alt="svg_one_icon" />
          <img
            src={quoteRight}
            className={styles.div_conteiner__blockNine_imgRight}
            alt="ковычки вниз"
          />
        </div>
      </div>

      {/* Текст заметки */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTen}`}
        onClick={() =>
          handleClick([{ type: "textarea", label: "Текст заметки" }])
        }
      >
        <img
          // className={styles.div_conteiner__blockEight_img}
          src={svg9}
          alt="svg_two_icon"
        />
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
      {/* видео */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
        onClick={() => handleVideoClick()}
      >
        <img src={svg6} alt="svg_three_icon" />
      </div>
      <div
        className={`${styles.notification} ${
          showNotification ? styles.showNotification : ""
        }`}
      >
        Сейчас загрузка видео недоступна 😢
      </div>
    </div>
  );
}
