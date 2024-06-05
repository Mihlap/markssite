import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import styles from "./ConstructorBlockRenderer.module.scss";
import "../stylePaginationSlider.css";

import playIcon from "../../icons/play.svg";
import pauseIcon from "../../icons/pause.svg";
import playIconMobile from "../../icons/playMobile.svg";
import pauseIconMobile from "../../icons/pauseMobile.svg";
import { containsListTags } from "../../Project/utils";
import { renderListWithDots } from "../../Project/utils";

const isMobileScreen = window.innerWidth <= 1024;

const playIconToUse = isMobileScreen ? playIconMobile : playIcon;
const pauseIconToUse = isMobileScreen ? pauseIconMobile : pauseIcon;

const Host = process.env.REACT_APP_SERVER_HOST;

const arrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
  cursor: "pointer",
};

const PrevArrow = ({ props, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{ ...arrowStyles, left: "1.5rem" }}
  >
    <svg
      width="42"
      height="42"
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
  </div>
);

const NextArrow = ({ props, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{ ...arrowStyles, right: "1.5rem" }}
  >
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
  </div>
);

export default function ConstructorBlockRenderer({
  block,
  handleMouseLeave,
  handleMouseEnter,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDotsVisible(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderImageWithDescription = (block) => {
    let imageUrl = "";
    let description = "";

    block?.forEach((item) => {
      if (item?.label === "Картинка с описанием")
        imageUrl = item.value?.[0] || "";
      if (item?.label === "Описание картинки") description = item?.value || "";
    });

    // Проверяем, есть ли imageUrl или description, если нет, то не отображаем блок
    if (!imageUrl && !description) return null;

    return (
      <div className={styles.containerImageToDescription}>
        {imageUrl && (
          <img
            className={styles.containerImageToDescription__img}
            src={`${Host}/images/imageAdd/${imageUrl}`}
            alt="Описание"
            loading="lazy"
          />
        )}
        {description && (
          <div className={styles.containerImageToDescription__text}>
            {description}
          </div>
        )}
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
        {header && (
          <h2 className={styles.blockHeadingTitle__heading}>{header}</h2>
        )}
        <p className={styles.blockHeadingTitle__text}>
          {containsListTags(text) ? (
            <div
              dangerouslySetInnerHTML={{
                __html: renderListWithDots(text),
              }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: renderListWithDots(text),
              }}
            />
          )}
          {/* {text} */}
        </p>
      </div>
    );
  };

  const renderThreeImages = (block, index) => {
    const images = block[0].value;
    //  Проверяем, есть ли картинки в блоке
    if (!images || images.length < 1) {
      return null; // Если картинок нет или их не три, не рендерим блок
    }

    return (
      <div className={styles.gridContainer}>
        {/* Рендерим первые две горизонтальные картинки, если они существуют */}
        {images.length >= 1 && (
          <img
            className={styles.horizontalImage}
            src={`${Host}/images/imageAdd/${images[0]}`}
            alt="Horizontal_image1"
            loading="lazy"
          />
        )}
        {images.length >= 2 && (
          <img
            className={styles.horizontalImage}
            src={`${Host}/images/imageAdd/${images[1]}`}
            alt="Horizontal_image2"
            loading="lazy"
          />
        )}

        {/* Рендерим вертикальную картинку, если она существует */}
        {images.length >= 3 && (
          <img
            className={styles.verticalImage}
            src={`${Host}/images/imageAdd/${images[2]}`}
            alt="Vertical_image"
            loading="lazy"
          />
        )}
      </div>
    );
  };

  // const renderThreeImages = (block, index) => {
  //   const images = block[0].value;
  //   return (
  //     <div className={styles.gridContainer}>
  //       {images?.slice(0, 2).map((img, index) => (
  //         <img
  //           className={styles.horizontalImage}
  //           key={index}
  //           src={`${Host}/images/imageAdd/${img}`}
  //           alt="Horizontal_image"
  //           loading="lazy"
  //         />
  //       ))}
  //       <img
  //         className={styles.verticalImage}
  //         src={`${Host}/images/imageAdd/${images[2]}`}
  //         alt="Vertical_image"
  //         loading="lazy"
  //       />
  //     </div>
  //   );
  // };

  const renderTwoImage = (block, index) => {
    const images = block[0].value;
    return (
      <div
        className={`${styles.imageBlockTwo} ${styles.imageBlockTwo_project}`}
      >
        {images.map((el, index) => (
          <img
            className={styles.imageBlockTwo__gridImage}
            key={index}
            src={`${Host}/images/imageAdd/${el}`}
            alt={`img_${index}`}
            loading="lazy"
          />
        ))}
      </div>
    );
  };

  const renderImageSlider = (block) => {
    const images = block[0].value;

    const sliderImageContainerStyle = {
      borderRadius: "10px",
      overflow: "hidden",
    };

    let sliderImageStyle = {
      width: "100%",
      height: "810px",
      objectFit: "cover",
      borderRadius: "16px",
    };

    if (window.innerWidth <= 768) {
      sliderImageStyle = {
        width: "100%",
        height: "22.6rem",
        objectFit: "cover",
        borderRadius: "16px",
      };
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      sliderImageStyle = {
        width: "100%",
        height: "29rem",
        objectFit: "cover",
        borderRadius: "16px",
      };
    }

    const activeDotStyle = {
      position: "relative",
      width: "50px",
      height: "4px",
      backgroundColor: "rgba(255, 127, 106, 1)",
      right: "30px",
      transition: "width 0.5s, background-color 0.3s",
      zIndex: "1",
    };

    const inactiveDotStyle = {
      position: "relative",
      width: "15px",
      height: "4px",
      backgroundColor: "#EBECEE",
      zIndex: "0",
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
      arrows: dotsVisible, // Включение стрелочек
      beforeChange: (_, newIndex) => {
        setActiveSlide(newIndex);
      },
      focusOnSelect: true,
      prevArrow: dotsVisible && (
        <PrevArrow
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ),
      nextArrow: dotsVisible && (
        <NextArrow
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ),
    };

    // console.log('Block:', block);

    return (
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive} ${styles.slider_container}`}
      >
        <Slider {...settings}>
          {images?.map((img, index) => (
            <div
              key={index}
              style={sliderImageContainerStyle}
              className={styles.custom_slider}
            >
              <img
                style={sliderImageStyle}
                src={`${Host}/images/imageAdd/${img}`}
                alt="Slider_image"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const renderVideoBlock = (block) => {
    const videoPath = block[0]?.value.join("");

    if (!videoPath) {
      return null; // или просто return; если вы предпочитаете не возвращать явно null
    }

    const videoStyle = {
      WebkitAppearance: "none",
      appearance: "none",
      border: "none",
      opacity: 1,
      outline: "none",
      // controls: "controls",
    };

    const handlePlay = () => {
      const videoElement = document.querySelector("video");
      videoElement.play();
      setIsPlaying(true);
      setIsHovered(false);
    };

    const handlePause = () => {
      const videoElement = document.querySelector("video");
      videoElement.pause();
      setIsPlaying(false);
      setIsHovered(false);
    };

    return (
      <div className={styles.wrapper_conteiner__item}>
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            playsInline
            muted
            loop
            className={styles.block_video}
            style={videoStyle}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source
              src={`${Host}/images/imageAdd/${videoPath}`}
              type="video/mp4"
            />
          </video>
          <div className={styles.buttonWrapperBlock}>
            {isPlaying ? (
              isHovered && (
                <button className={styles.buttonPause} onClick={handlePause}>
                  <img
                    src={pauseIconToUse}
                    alt={pauseIconToUse}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                </button>
              )
            ) : (
              <button className={styles.buttonPlayBlock} onClick={handlePlay}>
                <img
                  src={playIconToUse}
                  alt={playIconToUse}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderVideoLinkBlock = (block) => {
    let videoLink = "";

    block?.forEach((item) => {
      if (item.label === "Ссылка на видеоролик") videoLink = item.value;
    });

    if (!videoLink) return null;

    let embedLink = videoLink;
    if (videoLink.includes("youtu.be")) {
      embedLink = videoLink.replace("youtu.be/", "www.youtube.com/embed/");
    } else {
      embedLink = videoLink.replace("watch?v=", "embed/");
    }

    const handleIframeError = (event) => {
      const iframeContainer = event.target.closest(
        `.${styles.videoLinkContainer}`
      );
      if (iframeContainer) {
        iframeContainer.innerHTML = "<div>Видео по ссылке не загружено</div>";
      }
    };

    return (
      <div className={styles.videoLinkContainer}>
        <iframe
          className={styles.block_videoLink}
          src={embedLink}
          title="Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={handleIframeError}
        ></iframe>
      </div>
    );
  };

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
    case "Видеоролик":
      return renderVideoBlock(block);
    case "Ссылка на видеоролик":
      return renderVideoLinkBlock(block);
    default:
      return null;
  }
}
