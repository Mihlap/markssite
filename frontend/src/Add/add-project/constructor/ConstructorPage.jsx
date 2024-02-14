import React from "react";
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
      {/* Блок с картинкой и описанием картинки */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne}`}
        onClick={() =>
          handleClick(
            [
              { type: "file", label: "Картинка с описанием", required: true },
              { type: "text", label: "Описание картинки", required: false },
            ],
            0
          )
        }        
      >
        <img src={svg1} alt="svg_one_icon" />
      </div>

      {/* Блок заголовка и описания */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTwo}`}
        onClick={() =>
          handleClick(
            [
              { type: "text", label: "Заголовок", required: false },
              { type: "textarea", label: "Текстовый блок", required: true },
            ],
            1
          )
        }        
      >
        <img src={svg2} alt="svg_two_icon" />
      </div>

      {/* Блок с тремя картинками (горизонтальные и вертикальная) */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockThree}`}
        onClick={() =>
          handleClick(
            [{ type: "file", label: "Блок 3 картинки", required: true }],
            2
          )
        }        
      >
        <img src={svg3} alt="svg_three_icon" />
      </div>

      {/* Блок с двумя вертикальными картинками */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFour}`}
        onClick={() =>
          handleClick(
            [{ type: "file", label: "Блок 2е вертикальные картинки", required: true }],
            3
          )
        }   
      >
        <img src={svg4} alt="svg_four_icon" />
      </div>

      {/* Слайдер с картинками */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
        onClick={() =>
          handleClick(
            [
              {
                type: "file",
                label: "Слайдер *допускается загрузка 8ми изображений",
                required: true,
              },
            ],
            4
          )
        }        
      >
        <img src={svg5} alt="svg_five_icon" />
      </div>

      {/* Блок с видеороликом */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
        onClick={() =>
          handleClick(
            [{ type: "file", label: "Видеоролик", required: true }],
            5
          )
        }        
      >
        <img src={svg6} alt="svg_six_icon" />
      </div>
    </div>
  );
}
