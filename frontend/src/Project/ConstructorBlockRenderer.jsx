import React from "react";
import styles from "./ConstructorBlockRenderer.module.scss";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function ConstructorBlockRenderer({ block }) {
  const renderImageWithDescription = (block) => {
    let imageUrl = "";
    let description = "";

    block.forEach((item) => {
      if (item.label === "Картинка с описанием") imageUrl = item.value[0];
      if (item.label === "Описание картинки") description = item.value;
    });

    return (
      <div className={styles.containerImageToDescription}>
        <img
          className={styles.containerImageToDescription__img}
          src={`${Host}/images/imageAdd/${imageUrl}`}
          alt="Описание"
        />
        <div className={styles.containerImageToDescription__text}>
          {description}
        </div>
      </div>
    );
  };

  const renderHeaderWithText = (block) => {
    let header = "";
    let text = "";

    block.forEach((item) => {
      if (item.label === "Заголовок") header = item.value;
      if (item.label === "Текстовый блок") text = item.value;
    });

    return (
      <div className={styles.blockHeadingTitle}>
        <h2 className={styles.blockHeadingTitle__heading}>{header}</h2>
        <p className={styles.blockHeadingTitle__text}>{text}</p>
      </div>
    );
  };

  const renderThreeImages = (block, index) => {
    const images = block[0].value;
    return (
      <div className={styles.gridContainer}>
        {images.slice(0, 2).map((img, index) => (
          <img
            className={styles.horizontalImage}
            key={index}
            src={`${Host}/images/imageAdd/${img}`}
            alt="Horizontal_image"
          />
        ))}
        <img
          className={styles.verticalImage}
          src={`${Host}/images/imageAdd/${images[2]}`}
          alt="Vertical_image"
        />
      </div>
    );
  };

  const renderTwoImage = (block, index) => {
    const images = block[0].value;
    return (
      <div className={styles.imageBlockTwo}>
        {images.map((el, index) => (
          <img
            className={styles.imageBlockTwo__gridImage}
            key={index}
            src={`${Host}/images/imageAdd/${el}`}
            alt="img_two"
          />
        ))}
      </div>
    );
  };

  const renderImageSlider = (block) => {
    const images = block[0].value;
    return (
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
      >
        {images.map((img) => (
          <img key={img} src={img} alt="Slider image" />
        ))}
      </div>
    );
  };

  const renderVideoBlock = (block) => {
    return (
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
      >
        {/* Плейсхолдер для видео */}
        <p>Видео блок</p>
      </div>
    );
  };

  switch (block[0].label) {
    case "Картинка с описанием":
      return renderImageWithDescription(block);
    case "Заголовок":
      return renderHeaderWithText(block);
    case "Блок 3 картинки":
      return renderThreeImages(block);
    case "Блок 2е вертикальные картинки":
      return renderTwoImage(block);
    case "Слайдер *допускается загрузка 8ми изображений":
      return renderImageSlider(block);
    case "video":
      return renderVideoBlock(block);
    default:
      return null;
  }
}
