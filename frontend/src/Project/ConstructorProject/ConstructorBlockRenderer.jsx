import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import styles from './ConstructorBlockRenderer.module.scss';
import '../styles/Project.module.css';

import playIcon from '../../icons/play.svg';
import pauseIcon from '../../icons/pause.svg';
import playIconMobile from '../../icons/playMobile.svg';
import pauseIconMobile from '../../icons/pauseMobile.svg';
import fullscreen from '../../icons/full_screen.svg';
import fullscreen_exit from '../../icons/fullscreen_exit.svg';
import { containsListTags } from '../utils/utils';
import { renderListWithDots } from '../utils/utils';

const isMobileScreen = window.innerWidth <= 1024;

const playIconToUse = isMobileScreen ? playIconMobile : playIcon;
const pauseIconToUse = isMobileScreen ? pauseIconMobile : pauseIcon;

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const arrowStyles = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  cursor: 'pointer',
};

const PrevArrow = ({ props, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{ ...arrowStyles, left: '1.5rem' }}>
    <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          gradientUnits="userSpaceOnUse">
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
    style={{ ...arrowStyles, right: '1.5rem' }}>
    <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <path id="Vector 30" d="M13.333 21.3335L19.9997 15.3335L13.333 9.3335" stroke="#F6F6F6" strokeWidth="1.33333" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_565_7000"
          x1="32"
          y1="2.18182"
          x2="87.3078"
          y2="58.3335"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#BBDEFF" />
          <stop offset="1" stopColor="#FFBFB5" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default function ConstructorBlockRenderer({ block, handleMouseLeave, handleMouseEnter }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setDotsVisible(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const isFullUrl = (url) => url.startsWith('http://') || url.startsWith('https://');

  const renderImageWithDescription = (block) => {
    let imageUrl = '';
    let description = '';

    block?.forEach((item) => {
      if (item?.label === 'Картинка с описанием') imageUrl = item.value?.[0] || '';
      if (item?.label === 'Описание картинки') description = item?.value || '';
    });

    // Проверяем, есть ли imageUrl или description, если нет, то не отображаем блок
    if (!imageUrl && !description) return null;

    const imageSrc = isFullUrl(imageUrl) ? imageUrl : `${bucket_url}/images/imageAdd/${imageUrl}`;

    return (
      <div className={styles.containerImageToDescription}>
        {imageUrl && (
          <img className={styles.containerImageToDescription__img} src={imageSrc} alt="Описание" loading="lazy" />
        )}
        {description && <div className={styles.containerImageToDescription__text}>{description}</div>}
      </div>
    );
  };

  const renderHeaderWithText = (block) => {
    let header = '';
    let text = '';

    block.forEach((item) => {
      if (item.label === 'Заголовок') header = item.value;
      if (item.label === 'Текстовый блок') text = item.value;
    });

    return (
      <div className={styles.blockHeadingTitle}>
        {header && <h2 className={styles.blockHeadingTitle__heading}>{header}</h2>}
        <p className={styles.blockHeadingTitle__text}>
          {containsListTags(text) ? (
            <span
              dangerouslySetInnerHTML={{
                __html: renderListWithDots(text),
              }}
            />
          ) : (
            <span
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
            src={isFullUrl(images[0]) ? images[0] : `${bucket_url}/images/imageAdd/${images[0]}`}
            alt="Horizontal_image1"
            loading="lazy"
          />
        )}
        {images.length >= 2 && (
          <img
            className={styles.horizontalImage}
            src={isFullUrl(images[1]) ? images[1] : `${bucket_url}/images/imageAdd/${images[1]}`}
            alt="Horizontal_image2"
            loading="lazy"
          />
        )}

        {/* Рендерим вертикальную картинку, если она существует */}
        {images.length >= 3 && (
          <img
            className={styles.verticalImage}
            src={isFullUrl(images[2]) ? images[2] : `${bucket_url}/images/imageAdd/${images[2]}`}
            alt="Vertical_image"
            loading="lazy"
          />
        )}
      </div>
    );
  };
  const renderTwoImage = (block, index) => {
    const images = block[0].value;
    return (
      <div className={`${styles.imageBlockTwo} ${styles.imageBlockTwo_project}`}>
        {images.map((el, index) => (
          <img
            className={styles.imageBlockTwo__gridImage}
            key={index}
            src={isFullUrl(el) ? el : `${bucket_url}/images/imageAdd/${el}`}
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
      borderRadius: '10px',
      overflow: 'hidden',
    };

    let sliderImageStyle = {
      width: '100%',
      height: '370px',
      objectFit: 'cover',
      borderRadius: '16px',
    };

    if (window.innerWidth <= 768) {
      sliderImageStyle = {
        width: '100%',
        height: '22.6rem',
        objectFit: 'cover',
        borderRadius: '16px',
      };
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      sliderImageStyle = {
        width: '100%',
        height: '29rem',
        objectFit: 'cover',
        borderRadius: '16px',
      };
    }

    const activeDotStyle = {
      position: 'relative',
      width: '50px',
      height: '4px',
      backgroundColor: 'rgba(255, 127, 106, 1)',
      right: '30px',
      transition: 'width 0.5s, background-color 0.3s',
      zIndex: '1',
    };

    const inactiveDotStyle = {
      position: 'relative',
      width: '15px',
      height: '4px',
      backgroundColor: '#EBECEE',
      zIndex: '0',
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
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: dotsVisible, // Включение стрелочек
      beforeChange: (_, newIndex) => {
        setActiveSlide(newIndex);
      },
      focusOnSelect: true,
      prevArrow: dotsVisible && <PrevArrow onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />,
      nextArrow: dotsVisible && <NextArrow onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />,
    };

    return (
      <div className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive} ${styles.slider_container}`}>
        <Slider {...settings}>
          {images?.map((img, index) => (
            <div key={index} style={sliderImageContainerStyle} className={styles.custom_slider}>
              <img
                style={sliderImageStyle}
                src={isFullUrl(img) ? img : `${bucket_url}/images/imageAdd/${img}`}
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
    const videoPath = Array.isArray(block[0]?.value) ? block[0].value.join('') : null;

    if (!videoPath) {
      return null;
    }

    const videoSrc = isFullUrl(videoPath) ? videoPath : `${bucket_url}/images/imageAdd/${videoPath}`;

    const videoStyle = {
      WebkitAppearance: 'none',
      appearance: 'none',
      border: 'none',
      opacity: 1,
      outline: 'none',
      display: 'block',
      width: '100%',
      height: isFullscreen ? '100vh' : 'auto',
      objectFit: 'cover',
    };

    const handlePlay = () => {
      const videoElement = videoRef.current;
      videoElement.play();
      setIsPlaying(true);
      setIsHovered(false);
    };

    const handlePause = () => {
      const videoElement = videoRef.current;
      videoElement.pause();
      setIsPlaying(false);
      setIsHovered(false);
    };

    const handleFullscreen = () => {
      const containerElement = document.documentElement;

      if (containerElement.requestFullscreen) {
        containerElement.requestFullscreen();
      } else if (containerElement.webkitRequestFullscreen) {
        containerElement.webkitRequestFullscreen();
      } else if (containerElement.msRequestFullscreen) {
        containerElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    };

    const handleExitFullscreen = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      setIsFullscreen(false);
    };

    return (
      <div className={styles.wrapper_conteiner__item}>
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            playsInline
            muted
            loop
            controls={false}
            className={styles.block_video}
            style={videoStyle}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}>
            <source src={videoSrc} type="video/mp4" />
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
          <div className={styles.buttonWrapperBlock1}>
            {!isFullscreen ? (
              <button className={styles.buttonFullscreen} onClick={handleFullscreen}>
                <img
                  src={fullscreen}
                  alt={fullscreen}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </button>
            ) : (
              <button className={styles.buttonExitFullscreen} onClick={handleExitFullscreen}>
                <img
                  src={fullscreen_exit}
                  alt={fullscreen_exit}
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

  const getEmbedUrl = (videoLink) => {
    if (!videoLink) return null;

    if (videoLink.includes('youtu.be')) {
      return videoLink.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    if (videoLink.includes('youtube.com/watch?v=')) {
      return videoLink.replace('watch?v=', 'embed/');
    }
    if (videoLink.includes('rutube.ru/video/')) {
      const videoId = videoLink.split('/video/')[1].split('/')[0];
      return `https://rutube.ru/play/embed/${videoId}`;
    }
    if (videoLink.includes('vk.com/video_ext.php')) {
      return videoLink;
    }
    const match = videoLink.match(/(?:vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/);
    if (match) {
      const [oid, id] = match.slice(1);
      return `https://vk.com/video_ext.php?oid=${oid}&id=${id}`;
    }
    return null;
  };

  const handleIframeError = (event) => {
    const iframeContainer = event.target.closest(`.${styles.videoLinkContainer}`);
    if (iframeContainer) {
      iframeContainer.innerHTML = '<div>Видео по ссылке не загружено</div>';
    }
  };

  const renderVideoLinkBlock = (block) => {
    const videoItem = block?.find((item) => item.label === 'Ссылка на видеоролик');
    const embedLink = videoItem ? getEmbedUrl(videoItem.value) : null;

    if (!embedLink) return null;

    return (
      <div className={styles.videoLinkContainer}>
        <iframe
          className={styles.block_videoLink}
          src={embedLink}
          title="Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={handleIframeError}></iframe>
      </div>
    );
  };

  const renderCombinedVideoBlock = (block) => {
    const fileItem = block?.find((item) => item.label === 'Видео блок');
    const linkItem = block?.find((item) => item.label === 'Ссылка на видеоролик блок');

    const videoPath = Array.isArray(fileItem?.value) ? fileItem.value.join('') : null;
    const embedLink = linkItem?.value ? getEmbedUrl(linkItem.value) : null;

    if (!videoPath && !embedLink) return null;

    const videoSrc = videoPath
      ? isFullUrl(videoPath)
        ? videoPath
        : `${bucket_url}/images/imageAdd/${videoPath}`
      : null;

    const videoStyle = {
      WebkitAppearance: 'none',
      appearance: 'none',
      border: 'none',
      opacity: 1,
      outline: 'none',
      display: 'block',
      width: '100%',
      height: isFullscreen ? '100vh' : 'auto',
      objectFit: 'cover',
    };

    return (
      <>
        {videoSrc && (
          <div className={styles.wrapper_conteiner__item}>
            <div
              className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ position: 'relative' }}>
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                controls={false}
                className={styles.block_video}
                style={videoStyle}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}>
                <source src={videoSrc} type="video/mp4" />
              </video>
              <div className={styles.buttonWrapperBlock}>
                {isPlaying ? (
                  isHovered && (
                    <button
                      className={styles.buttonPause}
                      onClick={() => {
                        videoRef.current?.pause();
                        setIsPlaying(false);
                        setIsHovered(false);
                      }}>
                      <img
                        src={pauseIconToUse}
                        alt="pause"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />
                    </button>
                  )
                ) : (
                  <button
                    className={styles.buttonPlayBlock}
                    onClick={() => {
                      videoRef.current?.play();
                      setIsPlaying(true);
                      setIsHovered(false);
                    }}>
                    <img
                      src={playIconToUse}
                      alt="play"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </button>
                )}
              </div>
              <div className={styles.buttonWrapperBlock1}>
                {!isFullscreen ? (
                  <button
                    className={styles.buttonFullscreen}
                    onClick={() => {
                      document.documentElement.requestFullscreen?.();
                      setIsFullscreen(true);
                    }}>
                    <img
                      src={fullscreen}
                      alt="fullscreen"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </button>
                ) : (
                  <button
                    className={styles.buttonExitFullscreen}
                    onClick={() => {
                      document.exitFullscreen?.();
                      setIsFullscreen(false);
                    }}>
                    <img
                      src={fullscreen_exit}
                      alt="exit fullscreen"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {embedLink && (
          <div className={styles.videoLinkContainer}>
            <iframe
              className={styles.block_videoLink}
              src={embedLink}
              title="Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handleIframeError}
            />
          </div>
        )}
      </>
    );
  };

  switch (block[0]?.label) {
    case 'Картинка с описанием':
      return renderImageWithDescription(block);
    case 'Заголовок':
      return renderHeaderWithText(block);
    case 'Блок 3 картинки':
      return renderThreeImages(block);
    case 'Блок 2е вертикальные картинки':
      return renderTwoImage(block);
    case 'Слайдер *допускается загрузка 8ми изображений':
      return renderImageSlider(block);
    case 'Видеоролик':
    case 'Видео файл':
      return renderVideoBlock(block);
    case 'Ссылка на видеоролик':
      return renderVideoLinkBlock(block);
    case 'Видео блок':
      return renderCombinedVideoBlock(block);
    default:
      return null;
  }
}
