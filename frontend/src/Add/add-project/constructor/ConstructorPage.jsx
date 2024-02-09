import React from "react";
import styles from "./ConstructorPage.module.scss";

import svg1 from "./svg/Group4650.svg";
import svg2 from "./svg/Group4648.svg";
import svg3 from "./svg/Group4651.svg";
import svg4 from "./svg/Group4652.svg";
import svg5 from "./svg/Group4649.svg";
import svg6 from "./svg/Group4641.svg";

export default function ConstructorPage({ blocks, handleClick, handleBlockClick }) {
 return (
    <div className={styles.div_conteiner}>
      {/* блок с картинкой и описание картинки  */}
      {blocks && blocks[0]?.length === 2 ? (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne}`}
          onClick={() =>
            handleBlockClick([
              { key: blocks[0][0].key, type: "file", label: "Картинка с описанием", required: true },
              { key: blocks[0][1].key, type: "text", label: "Описание картинки", required: false },
            ], blocks, 0)
          }
        >
          <img src={svg1} alt="svg_one_icon" />
        </div>
      ) : (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne}`}
          onClick={() =>
            handleClick([
              { type: "file", label: "Картинка с описанием", required: true },
              { type: "text", label: "Описание картинки", required: false },
            ])
          }
        >
          <img src={svg1} alt="svg_one_icon" />
        </div>
      )}

      {/* блок заголовок и описание  */}
      {blocks && blocks[1]?.length === 2 ? (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTwo}`}
          onClick={() =>
            handleBlockClick([
              { key: blocks[1][0].key, type: "text", label: "Заголовок", required: false },
              { key: blocks[1][1].key, type: "textarea", label: "Текстовый блок", required: true },
            ], blocks, 1)
          }
        >
          <img src={svg2} alt="svg_two_icon" />
        </div>
      ) : (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTwo}`}
          onClick={() =>
            handleClick([
              { type: "text", label: "Заголовок", required: false },
              { type: "textarea", label: "Текстовый блок", required: true },
            ])
          }
        >
          <img src={svg2} alt="svg_two_icon" />
        </div>
      )}

      {/* блок с тремя картинками где горизонтальные, одна вертикальная  */}
      {blocks && blocks[2]?.length === 1 ? (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockThree}`}
          onClick={() =>
            handleBlockClick([
              { key: blocks[2][0].key, type: "file", label: "Блок 3 картинки", required: true },
            ], blocks, 2)
          }
        >
          <img src={svg3} alt="svg_three_icon" />
        </div>
      ) : (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockThree}`}
          onClick={() =>
            handleClick([
              { type: "file", label: "Блок 3 картинки", required: true },
            ])
          }
        >
          <img src={svg3} alt="svg_three_icon" />
        </div>
      )}

      {/* блок с двумя вертикальными картинками  */}
      {blocks && blocks[3]?.length === 1 ? (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFour}`}
          onClick={() =>
            handleBlockClick([
              {
                key: blocks[3][0].key,
                type: "file",
                label: "Блок 2е вертикальные картинки",
                required: true,
              },
            ], blocks, 3)
          }
        >
          <img src={svg4} alt="svg_four_icon" />
        </div>
      ) : (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFour}`}
          onClick={() =>
            handleClick([
              {
                type: "file",
                label: "Блок 2е вертикальные картинки",
                required: true,
              },
            ])
          }
        >
          <img src={svg4} alt="svg_four_icon" />
        </div>
      )}

      {/* слайдер с картинками  */}
      {blocks && blocks[4]?.length === 1 ? (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
          onClick={() =>
            handleBlockClick([
              {
                key: blocks[4][0].key,
                type: "file",
                label: "Слайдер *допускается загрузка 8ми изображений",
                required: true
              },
            ], blocks, 4)
          }
        >
          <img src={svg5} alt="svg_five_icon" />
        </div>
      ) : (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
          onClick={() =>
            handleClick([
              {
                type: "file",
                label: "Слайдер *допускается загрузка 8ми изображений",
                required: true
              },
            ])
          }
        >
          <img src={svg5} alt="svg_five_icon" />
        </div>
      )}

      {/* блок с видеороликом */}
      {blocks && blocks[5]?.length === 1 ? (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
          onClick={() =>
            handleBlockClick([
              {
                key: blocks[5][0].key,
                type: "file",
                label: "Видеоролик",
                required: true
              },
            ],blocks, 5)
          }
        >
          <img src={svg6} alt="svg_six_icon" />
        </div>
      ) : (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
          onClick={() =>
            handleClick([
              {
                type: "file",
                label: "Видеоролик",
                required: true
              },
            ])
          }
        >
          <img src={svg6} alt="svg_six_icon" />
        </div>
      )}

      {/* Добавим вывод данных */}
      {/* {blockData && (
    <div className={styles.inputs_container}>
      {blockData.map((item, index) => (
        <div key={index} className={styles.input_block}>
    
          <p>{item.type}</p>
          <p>{item.label}:</p>
     
          <input
            type="text"
            value={item.value || ""}
            onChange={(e) => handleDynamicInputChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  )} */}
    </div>
  );
}
