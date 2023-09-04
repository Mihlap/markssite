import React, { useState } from "react";
import styles from "./ConstructorPage.module.scss";

import svg1 from "./svg/Group4650.svg";
import svg2 from "./svg/Group4648.svg";
import svg3 from "./svg/Group4651.svg";
import svg4 from "./svg/Group4652.svg";
import svg5 from "./svg/Group4649.svg";
import svg6 from "./svg/Group4641.svg";

export default function ConstructorPage({ handleClick }) {
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
      {/* видео */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
        onClick={() =>
          handleClick([
            {
              type: "file",
              label: "Слайдер *допускается загрузка 8ми изображений",
            },
          ])
        }
      >
        <img src={svg6} alt="svg_three_icon" />
      </div>
    </div>
  );
}
