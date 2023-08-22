import React, { useState } from "react";
import styles from "../ConstructorPage.module.scss";
import icon from "../icon/Frame4684.png";


export default function QuoteBlock({
  isFullWidth5,
  setIsFullWidth5,
  inputData,
  setInputData,
  handleImageUploadQuote,
}) {
  const [openInput, setOpenInput] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);


  const handlerOpenInput = () => {
    setIsFullWidth5(!isFullWidth5);
    setOpenInput(!openInput);
  };


  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
      handleImageUploadQuote(selectedFile);
    }
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    document.querySelector(
      'input[name="imageToDescriptionArticlesText"]'
    ).value = "";
    handleImageUploadQuote("");
  };
  return (
    <div>
      {!openInput ? (
        <div className={styles.QuoteBlock_btn} onClick={handlerOpenInput}>
          <div className={styles.QuoteBlock_btn_block}>
            <svg
              className={styles.QuoteBlock_btn_block__svg_one}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="icomoon-free:quotes-right"
                clipPath="url(#clip0_2459_16751)"
              >
                <path
                  id="Vector"
                  d="M3.5 6C4.19223 6 4.86892 6.20527 5.44449 6.58985C6.02007 6.97444 6.46867 7.52106 6.73358 8.16061C6.99848 8.80015 7.0678 9.50388 6.93275 10.1828C6.7977 10.8617 6.46436 11.4854 5.97487 11.9749C5.48539 12.4644 4.86175 12.7977 4.18281 12.9327C3.50388 13.0678 2.80015 12.9985 2.16061 12.7336C1.52106 12.4687 0.97444 12.0201 0.589854 11.4445C0.205269 10.8689 -1.66189e-06 10.1922 -1.60137e-06 9.5L-0.0160023 9C-0.0160022 8.08074 0.165059 7.17049 0.516842 6.32121C0.868624 5.47193 1.38424 4.70026 2.03425 4.05025C2.68426 3.40024 3.45594 2.88462 4.30521 2.53284C5.15449 2.18106 6.06475 2 6.984 2L6.984 4C6.3271 3.99823 5.67637 4.12671 5.06943 4.378C4.4625 4.62928 3.9114 4.9984 3.448 5.464C3.26789 5.64376 3.10175 5.83699 2.951 6.042C3.13261 6.01346 3.31616 5.99908 3.5 5.999L3.5 6ZM12.5 6C13.1922 6 13.8689 6.20527 14.4445 6.58985C15.0201 6.97444 15.4687 7.52106 15.7336 8.16061C15.9985 8.80015 16.0678 9.50388 15.9327 10.1828C15.7977 10.8617 15.4644 11.4854 14.9749 11.9749C14.4854 12.4644 13.8617 12.7977 13.1828 12.9327C12.5039 13.0678 11.8001 12.9985 11.1606 12.7336C10.5211 12.4687 9.97444 12.0201 9.58985 11.4445C9.20527 10.8689 9 10.1922 9 9.5L8.984 9C8.984 7.14348 9.7215 5.36301 11.0343 4.05025C12.347 2.7375 14.1275 2 15.984 2L15.984 4C15.3271 3.99823 14.6764 4.12671 14.0694 4.378C13.4625 4.62928 12.9114 4.9984 12.448 5.464C12.2679 5.64376 12.1017 5.83699 11.951 6.042C12.1326 6.01346 12.3162 5.99908 12.5 5.999L12.5 6Z"
                  fill="#F6F6F6"
                />
              </g>
              <defs>
                <clipPath id="clip0_2459_16751">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(16 16) rotate(-180)"
                  />
                </clipPath>
              </defs>
            </svg>
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
            <svg
              className={styles.QuoteBlock_btn_block__svg_two}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="icomoon-free:quotes-right"
                clipPath="url(#clip0_2459_16749)"
              >
                <path
                  id="Vector"
                  d="M12.5 10C11.8078 10 11.1311 9.79473 10.5555 9.41015C9.97993 9.02556 9.53133 8.47894 9.26642 7.83939C9.00152 7.19985 8.93221 6.49612 9.06725 5.81719C9.2023 5.13825 9.53564 4.51461 10.0251 4.02513C10.5146 3.53564 11.1383 3.2023 11.8172 3.06725C12.4961 2.9322 13.1999 3.00152 13.8394 3.26642C14.4789 3.53133 15.0256 3.97993 15.4101 4.55551C15.7947 5.13108 16 5.80777 16 6.5L16.016 7C16.016 7.91925 15.8349 8.82951 15.4832 9.67879C15.1314 10.5281 14.6158 11.2997 13.9657 11.9497C13.3157 12.5998 12.5441 13.1154 11.6948 13.4672C10.8455 13.8189 9.93526 14 9.016 14V12C9.6729 12.0018 10.3236 11.8733 10.9306 11.622C11.5375 11.3707 12.0886 11.0016 12.552 10.536C12.7321 10.3562 12.8983 10.163 13.049 9.958C12.8674 9.98654 12.6838 10.0009 12.5 10.001V10ZM3.5 10C2.80777 10 2.13108 9.79473 1.55551 9.41015C0.979934 9.02556 0.53133 8.47894 0.266423 7.83939C0.00151652 7.19985 -0.0677952 6.49612 0.0672531 5.81719C0.202301 5.13825 0.535644 4.51461 1.02513 4.02513C1.51461 3.53564 2.13825 3.2023 2.81719 3.06725C3.49612 2.9322 4.19985 3.00152 4.83939 3.26642C5.47894 3.53133 6.02556 3.97993 6.41015 4.55551C6.79473 5.13108 7 5.80777 7 6.5L7.016 7C7.016 8.85652 6.2785 10.637 4.96575 11.9497C3.65299 13.2625 1.87252 14 0.0160016 14V12C0.6729 12.0018 1.32363 11.8733 1.93057 11.622C2.5375 11.3707 3.08861 11.0016 3.552 10.536C3.73211 10.3562 3.89825 10.163 4.049 9.958C3.86739 9.98654 3.68384 10.0009 3.5 10.001V10Z"
                  fill="#F6F6F6"
                />
              </g>
              <defs>
                <clipPath id="clip0_2459_16749">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.QuoteBlock_btn__heading_block}>
            <input
              type="input"
              className={styles.QuoteBlock_btn__heading_block_input}
              placeholder="ФИО должность"
              name="quoteBlockTitle"
              id="quoteBlockTitle"
              maxLength="56"
              value={inputData.quoteBlockTitle}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 56) {
                  setInputData({ ...inputData, quoteBlockTitle: value });
                }
              }}
              required
            />
            <label
              htmlFor="quoteBlockTitle"
              className={styles.QuoteBlock_btn__heading_block_label}
            >
              Автор цитаты
            </label>
            <div className={styles.QuoteBlock_btn__heading_block_input_length}>
              {`${inputData.quoteBlockTitle.length}/56`}
            </div>
          </div>

          <div className={styles.QuoteBlock_btn__description_text}>
            <div className={styles.QuoteBlock_btn__textarea_length}>
              {`${inputData.quoteBlockText.length}/260`}
            </div>
            <textarea
              className={styles.QuoteBlock_btn__textarea}
              name="quoteBlockText"
              id="quoteBlockText"
              cols="30"
              rows="10"
              placeholder="Текст"
              value={inputData.quoteBlockText}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 260) {
                  setInputData({ ...inputData, quoteBlockText: value });
                }
              }}
            ></textarea>
            <label htmlFor="" className={styles.QuoteBlock_btn__textarea_label}>
                Текст цитаты
            </label>
          </div>

          <div className={styles.QuoteBlock_btn__textarea_label}>
            <span>Фото автора статьи</span>
          </div>
          <label className={styles.slider_container__customFileUpload}>
            <input
              type="file"
              name="imageToDescriptionArticlesText"
              onChange={handleImageUpload}
            />
            <div className={styles.slider_container__uploadIcon}>
              <img src={icon} alt="icon" />
            </div>
            <div className={styles.slider_container__uploadText}>
              Загрузить изображения
            </div>
          </label>
          {previewImage && (
            <div className={styles.preview_photos_container}>
              <div className={styles.preview_photos_container__block}>
                <img
                  className={styles.preview_photos_container__img}
                  src={previewImage}
                  alt="Preview"
                />
                <div
                  onClick={handleRemovePreview}
                  className={styles.preview_photos_container__remove_icon}
                >
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
