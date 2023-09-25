import React, { useRef, useState } from "react";
import Slider from "react-slick";
import styles from "../../Project/ConstructorProject/ConstructorBlockRenderer.module.scss";
import "../../Project/stylePaginationSlider.css";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function ConstructorBlockRenderer({ block }) {
  const [activeSlide, setActiveSlide] = useState(0);

  // if (!block || !Array.isArray(block) || block.length === 0) {
  //   return null; 
  // }
  

  const renderImageWithDescription = (block) => {
    let imageUrl = "";
    let description = "";

    block?.forEach((item) => {     
    if (item?.label === "Картинка с описанием") imageUrl = item.value?.[0] || "";
    if (item?.label === "Описание картинки") description = item?.value || "";
    });

    return (
      <div className={styles.containerImageToDescription}>
        <img
          className={styles.containerImageToDescription__img}
          src={`${Host}/images/imageArticle/${imageUrl}`}
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

    block?.forEach((item) => {
      if (item?.label === "Заголовок") header = item?.value;
      if (item?.label === "Текстовый блок") text = item?.value;
    });

    return (
      <div className={styles.blockHeadingTitle}>
        <h2 className={styles.blockHeadingTitle__heading}>{header}</h2>
        <p className={styles.blockHeadingTitle__text}>{text}</p>
      </div>
    );
  };

  const renderThreeImages = (block, index) => {
    const images = block[0]?.value;
    return (
      <div className={styles.gridContainer}>
        {images?.slice(0, 2).map((img, index) => (
          <img
            className={styles.horizontalImage}
            key={index}
            src={`${Host}/images/imageArticle/${img}`}
            alt="Horizontal_image"
          />
        ))}
        <img
          className={styles.verticalImage}
          src={`${Host}/images/imageArticle/${images[2]}`}
          alt="Vertical_image"
        />
      </div>
    );
  };

  const renderTwoImage = (block, index) => {
    const images = block[0]?.value;
    return (
      <div className={styles.imageBlockTwo}>
        {images?.map((el, index) => (
          <img
            className={styles.imageBlockTwo__gridImage}
            key={index}
            src={`${Host}/images/imageArticle/${el}`}
            alt="img_two"
          />
        ))}
      </div>
    );
  };

  const renderImageSlider = (block) => {
    const images = block[0]?.value;

    const sliderImageContainerStyle = {
      borderRadius: "10px",
      overflow: "hidden",
    };

    const sliderImageStyle = {
      width: "100%",
      height: "810px",
      objectFit: "cover",
      borderRadius: "10px",
    };

    const activeDotStyle = {
      width: "40px",
      height: "4px",
      backgroundColor: "rgba(255, 127, 106, 1)",
      marginRight: "15px",
      transition: "width 0.5s, background-color 0.3s",
    };

    const inactiveDotStyle = {
      width: "15px",
      height: "4px",
      backgroundColor: "rgba(235, 236, 238, 1)",
    };

    // Настройки слайдера
    const settings = {
      dots: true, // Включение пагинации
      customPaging: (i) => (
        <div
          style={i === activeSlide ? activeDotStyle : inactiveDotStyle} // сравнение с активным слайдом
        />
      ),
      infinite: true,
      // speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true, // Включение стрелочек
      beforeChange: (oldIndex, newIndex) => {
        setActiveSlide(newIndex);
      },
      focusOnSelect: true,
      nextArrow: (
        <svg
          width="42"
          height="42"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="icon / 24 /  arrow /  normal">
            <rect
              x="32"
              width="32"
              height="32"
              rx="16"
              transform="rotate(90 32 0)"
              fill="url(#paint0_linear_565_7000)"
              fillOpacity="0.55"
            />
            <path
              id="Vector 30"
              d="M13.333 21.3335L19.9997 15.3335L13.333 9.3335"
              stroke="#F6F6F6"
              strokeWidth="1.33333"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_565_7000"
              x1="32"
              y1="2.18182"
              x2="87.3078"
              y2="58.3335"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BBDEFF" />
              <stop offset="1" stopColor="#FFBFB5" />
            </linearGradient>
          </defs>
        </svg>
      ),
      prevArrow: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="icon / 24 /  arrow /  normal">
            <rect
              y="32"
              width="32"
              height="32"
              rx="16"
              transform="rotate(-90 0 32)"
              fill="url(#paint0_linear_565_7001)"
              fillOpacity="0.55"
            />
            <path
              id="Vector 30"
              d="M18.667 10.6665L12.0003 16.6665L18.667 22.6665"
              stroke="#F6F6F6"
              strokeWidth="1.33333"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_565_7001"
              x1="-1.2528e-06"
              y1="34.1818"
              x2="55.3078"
              y2="90.3335"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BBDEFF" />
              <stop offset="1" stopColor="#FFBFB5" />
            </linearGradient>
          </defs>
        </svg>
      ),
    };

    return (
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive} ${styles.slider_container}`}
      >
        <Slider {...settings}>
          {images?.map((img, index) => (
            <div key={index} style={sliderImageContainerStyle}>
              <img
                style={sliderImageStyle}
                src={`${Host}/images/imageArticle/${img}`}
                alt="Slider_image"
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const renderTextBlock = (block) => {
    let descriptionTextBlock = "";

    block?.forEach((item) => {
      if (item.label === "Блок описание") descriptionTextBlock = item.value;
    });

    return <div className={styles.text_block}>{descriptionTextBlock}</div>;
  };

  const renderTextFramed = (block) => {
    let descriptionText = "";

    block?.forEach((item) => {
      if (item.label === "Текст в рамочке") descriptionText = item.value;
    });

    return (
      <div className={styles.text_framed}>
        <div className={styles.text_framed__text}>{descriptionText}</div>
      </div>
    );
  };

  const renderQuoteBlock = (block) => {
    let quote = "";
    let author = "";
    let imageUrl = "";

    block?.forEach((item) => {
      if (item.label === "Автор цитаты ( ФИО должность )") quote = item.value;
      if (item.label === "Текст цитаты") author = item.value;
      if (item.label === "Фото автора статьи") imageUrl = item.value[0];
    });

    return (
      <div className={styles.quote_block_constainer}>
        <div className={styles.quote_block_constainer__text_block}>
          <div className={styles.quote_block_constainer__quote_text}>
            {quote}
          </div>
          <div className={styles.quote_block_constainer__quote_author}>
            {author}
          </div>
        </div>
        <div className={styles.quote_block_constainer__author_block}>
          <img className={styles.quote_block_constainer__img} src={`${Host}/images/imageArticle/${imageUrl}`} alt={author} />
          <div className={styles.quote_block_constainer__quote}>{quote}</div>
          <div className={styles.quote_block_constainer__author}>{author}</div>
        </div>
      </div>
    );
  };

  const renderNoteBlock = (block) => {
    let noteBlockText = "";

    block?.forEach((item) => {
      if (item.label === "Текст заметки") noteBlockText = item.value;
    });
    return (
      <div className={styles.note_block}>
        <div className={styles.note_block__bookmark} />
        <div className={styles.note_block__text}>{noteBlockText}</div>
      </div>
    );
  };
  // const renderVideoBlock = (block) => {
  //   return (
  //     <div
  //       className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
  //     >
  //       {/* Плейсхолдер для видео */}
  //       <p>Видео блок</p>
  //     </div>
  //   );
  // };

  switch (block[0]?.label) {
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
    case "Блок описание":
      return renderTextBlock(block);
    case "Текст в рамочке":
      return renderTextFramed(block);
    case "Автор цитаты ( ФИО должность )":
      return renderQuoteBlock(block);
    case "Текст заметки":
      return renderNoteBlock(block);
    // case "video":
    //   return renderVideoBlock(block);
    default:
      return null;
  }
}
