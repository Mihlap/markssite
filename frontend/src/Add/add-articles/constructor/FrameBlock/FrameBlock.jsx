import React, { useState } from 'react'
import styles from "../ConstructorPage.module.scss";


export default function FrameBlock({
  isFullWidth3,
  setIsFullWidth3,
  inputData,
  setInputData,
}) {
  const [openInput, setOpenInput] = useState(false);

  const handlerOpenInput = () => {
    setIsFullWidth3(!isFullWidth3);
    setOpenInput(!openInput);
  };
  return (
    <div>
      {!openInput ? (
        <div className={styles.QuoteBlock_btn} onClick={handlerOpenInput}>
          <div className={styles.QuoteBlock_btn__border}>
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
        </div>
      ) : (
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
      )}
    </div>
  );
}
