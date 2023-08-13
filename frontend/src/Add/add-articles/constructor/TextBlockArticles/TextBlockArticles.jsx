import React, { useState } from 'react'
import styles from "../ConstructorPage.module.scss";

export default function TextBlockArticles({
  isFullWidth2,
  setIsFullWidth2,
  inputData,
  setInputData,
}) {
  const [openInput, setOpenInput] = useState(false);

  const handlerOpenInput = () => {
    setIsFullWidth2(!isFullWidth2);
    setOpenInput(!openInput);
  };

  return (
    <div>
      {!openInput ? (
        <div
          className={styles.TextBlockArticles_btn}
          onClick={handlerOpenInput}
        >
          <svg
            width="76"
            height="33"
            viewBox="0 0 76 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Group 4648">
              <rect
                id="Rectangle 4013"
                y="18"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4017"
                y="9"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4018"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4014"
                y="27"
                width="41"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
            </g>
          </svg>
        </div>
      ) : (
        <div className={styles.TextBlockArticles_btn__description_text}>
          <div className={styles.TextBlockArticles_btn__textarea_length}>
            {`${inputData.textBlockArticles.length}/260`}
          </div>
          <textarea
            className={styles.TextBlockArticles_btn__textarea}
            name="textBlockArticles"
            id="textBlockArticles"
            cols="30"
            rows="10"
            placeholder="Текст"
            value={inputData.textBlockArticles}
            onChange={(event) => {
              const value = event.target.value;
              if (value.length <= 260) {
                setInputData({ ...inputData, textBlockArticles: value });
              }
            }}
          ></textarea>
          <label
            htmlFor=""
            className={styles.TextBlockArticles_btn__textarea_label}
          >
            Текст
          </label>
        </div>
      )}
    </div>
  );
}
