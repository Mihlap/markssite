import React, { useState } from "react";
import styles from "../ConstructorPage.module.scss";
import icon from "../icon/Frame4684.png";
import { changeHandler } from "../../../add-project/formAdd/formHelpers";

export default function ImageToDescriptionArticles({
  isFullWidth4,
  setIsFullWidth4,
  inputData,
  setInputData,
}) {
  const [openInput, setOpenInput] = useState(false);

  const handlerOpenInput = () => {
    setIsFullWidth4(!isFullWidth4);
    setOpenInput(!openInput);
  };

  // console.log(previewImgConstructorVisible);
  return (
    <div>
      {!openInput ? (
        <div
          className={styles.ImageToDescriptionArticles_btn}
          onClick={handlerOpenInput}
        >
          <svg
            width="76"
            height="73"
            viewBox="0 0 76 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Group 4650">
              <rect
                id="Rectangle 4013"
                y="58"
                width="76"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <rect
                id="Rectangle 4014"
                y="67"
                width="41"
                height="6"
                rx="3"
                fill="#F6F6F6"
              />
              <g id="Group 4639">
                <path
                  id="Subtract"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 8C0 3.58172 3.58172 0 8 0H68C72.4183 0 76 3.58172 76 8V45C76 49.4183 72.4183 53 68 53H8C3.58172 53 0 49.4183 0 45V8ZM32.8986 30.2047L34.8353 27.3589C40.1342 19.573 51.5926 19.5166 56.9678 27.2501L66.1348 40.4389C67.7664 42.7865 66.0865 46 63.2276 46H11.0552C8.75292 46 7.55846 43.2543 9.128 41.5699L18.385 31.6355C20.8829 28.9548 25.0264 28.657 27.882 30.9528C29.4521 32.2151 31.7651 31.8702 32.8986 30.2047ZM23.8146 8C21.9467 8 20.3751 8.61645 19.1016 9.85003C17.8281 11.0836 17.1916 12.6058 17.1916 14.415C17.1916 16.142 17.8281 17.6214 19.1016 18.855C20.3751 20.0886 21.9467 20.705 23.8146 20.705C25.5976 20.705 27.1251 20.0885 28.3987 18.855C29.6723 17.6215 30.3087 16.1419 30.3087 14.415C30.3087 12.6058 29.6722 11.0836 28.3987 9.85003C27.1252 8.61645 25.5976 8 23.8146 8Z"
                  fill="#F6F6F6"
                />
              </g>
            </g>
          </svg>
        </div>
      ) : (
        <>
          <div
            className={styles.ImageToDescriptionArticles_btn__checkbox_block}
          >
            <div>Картинка с описанием</div>
          </div>
          <label className={styles.slider_container__customFileUpload}>
            <input
              type="file"
              name="imageToDescriptionArticlesImg"
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                )
              }
              style={{
                // display: previewImgConstructorVisible ? "block" : "none",
              }}
            />
            <div className={styles.slider_container__uploadIcon}>
              <img src={icon} alt="icon" />
            </div>
            <div className={styles.slider_container__uploadText}>
              Загрузить изображения
            </div>
          </label>
          {/* <div className={styles.preview_photos_container}>
            {previewImgConstructor?.map((preview, index) => (
              <div
                key={index}
                className={styles.preview_photos_container__block}
              >
                <img
                  className={styles.preview_photos_container__img}
                  src={preview}
                  alt={`Preview ${index}`}
                />
                <div
                  className={styles.preview_photos_container__remove_icon}
                  //   onClick={() => handleRemovePreviewPhotoClose(index)}
                >
                  <span></span>
                </div>
              </div>
            ))}
          </div> */}
          <div className={styles.ImageToDescriptionArticles_btn__heading_block}>
            <input
              type="input"
              className={
                styles.ImageToDescriptionArticles_btn__heading_block_input
              }
              placeholder="Описание картинки"
              name="imageToDescriptionArticlesText"
              id="imageToDescriptionArticlesText"
              maxLength="56"
              value={inputData.imageToDescriptionArticlesText}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 56) {
                  setInputData({
                    ...inputData,
                    imageToDescriptionArticlesText: value,
                  });
                }
              }}
              required
            />
            <label
              htmlFor="imageToDescriptionArticlesText"
              className={
                styles.ImageToDescriptionArticles_btn__heading_block_label
              }
            >
              Описание картинки
            </label>
            <div
              className={
                styles.ImageToDescriptionArticles_btn__heading_block_input_length
              }
            >
              {`${inputData.imageToDescriptionArticlesText.length}/56`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
