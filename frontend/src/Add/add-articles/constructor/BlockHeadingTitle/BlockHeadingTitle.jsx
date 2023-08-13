import React, { useState } from "react";
import styles from "../ConstructorPage.module.scss"

export default function BlockHeadingTitle({
  isFullWidth,
  setIsFullWidth,
  inputData,
  setInputData,
}) {
  const [openInput, setOpenInput] = useState(false);

  const handlerOpenInput = () => {
    setIsFullWidth(!isFullWidth);
    setOpenInput(!openInput);
  };

  return (
    <div>
      {!openInput ? (
        <div
          className={styles.BlockHeadingTitle_btn}
          onClick={handlerOpenInput}
        >
          <svg
            width="76"
            height="50"
            viewBox="0 0 76 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Group 4648">
              <rect
                id="Rectangle 4013"
                y="35"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4017"
                y="26"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4018"
                y="17"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4014"
                y="44"
                width="41"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4019"
                width="58"
                height="12"
                rx="6"
                fill="#F6F6F6"
              />
            </g>
          </svg>
        </div>
      ) : (
        <div className={styles.BlockHeadingTitle_btn_container}>
          <div className={styles.BlockHeadingTitle_btn__heading_block}>
            <input
              type="input"
              className={styles.BlockHeadingTitle_btn__heading_block_input}
              placeholder="Заголовок"
              name="blockHeadingTitle"
              id="blockHeadingTitle"
              maxLength="56"
              value={inputData.blockHeadingTitle}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 56) {
                  setInputData({ ...inputData, blockHeadingTitle: value });
                }
              }}
              required
            />
            <label
              htmlFor="blockHeadingTitle"
              className={styles.BlockHeadingTitle_btn__heading_block_label}
            >
              Заголовок
            </label>
            <div
              className={
                styles.BlockHeadingTitle_btn__heading_block_input_length
              }
            >
              {`${inputData.blockHeadingTitle.length}/56`}
            </div>
          </div>

          <div className={styles.BlockHeadingTitle_btn__description_text}>
            <div className={styles.BlockHeadingTitle_btn__textarea_length}>
              {`${inputData.blockHeadingText.length}/260`}
            </div>
            <textarea
              className={styles.BlockHeadingTitle_btn__textarea}
              name="blockHeadingText"
              id="blockHeadingText"
              cols="30"
              rows="10"
              placeholder="Текст"
              value={inputData.blockHeadingText}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 260) {
                  setInputData({ ...inputData, blockHeadingText: value });
                }
              }}
            ></textarea>
            <label
              htmlFor=""
              className={styles.BlockHeadingTitle_btn__textarea_label}
            >
              Текст
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
