import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './GalleryTabs.module.scss';
import { fetchEvents } from '../../../store/Slice/vacancyEventSlice';

const Host = process.env.REACT_APP_SERVER_HOST;
const VK_api = process.env.REACT_APP_VK_API;

const GalleryTabs = React.memo(({ handleMouseEnter, handleMouseLeave }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVKLoaded, setIsVKLoaded] = useState(false); 
  const sliderRef = useRef(null);
  const cursorRef = useRef(null);
  const galleryRef = useRef(null);
  const { events } = useSelector((state) => state.formAddEvent);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events && events?.length > 0 && activeIndex === null) {
      setActiveIndex(0);
    }
  }, [events, activeIndex]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vk.com/js/api/openapi.js?169';
    script.async = true;
    script.onload = () => {
      if (window.VK) {
        window.VK.init({
          apiId: VK_api,
          onlyWidgets: false,
        });
        setIsVKLoaded(true);
      }
    };
    script.onerror = () => {
      console.error('Не удалось загрузить скрипт VK Open API.');
      setIsVKLoaded(false);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);  
  

  const handleMouseMove = (e) => {
    const galleryRect = galleryRef.current.getBoundingClientRect();
    const x = e.clientX - galleryRect.left;
    const y = e.clientY - galleryRect.top;

    cursorRef.current.style.left = `${x}px`;
    cursorRef.current.style.top = `${y}px`;
  };

  const handleSlide = (direction) => {
    if (sliderRef.current) {
      if (direction === 'left') {
        sliderRef.current.slickPrev();
      } else if (direction === 'right') {
        sliderRef.current.slickNext();
      }
    }
  };

  const getMediaPaths = useCallback((event) => {
    const images = event?.files?.filter(
      (file) =>
        file.endsWith('.jpg') ||
        file.endsWith('.png') ||
        file.endsWith('.jpeg') ||
        file.endsWith('.avif')
    );

    const videos = event?.eventData?.filter(
      (file) =>
        file.endsWith('.mp4') ||
        file.includes('youtube.com') ||
        file.includes('vk.com') ||
        file.includes('rutube.ru')
    );
    return { images, videos };
  }, []);

  const mediaPaths = useMemo(() => {
    return events?.[activeIndex] ? getMediaPaths(events[activeIndex]) : null;
  }, [events, activeIndex, getMediaPaths]);

  const handleButtonClick = useCallback(
    (index) => {
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(0); 
        setActiveIndex(index);
      }
    },
    [sliderRef]
  );


 useEffect(() => {
  if (isVKLoaded && mediaPaths?.videos) {
    const vkVideoUrl = mediaPaths.videos.find((video) =>
      video.includes('vk.com/video')
    );
    if (vkVideoUrl) {
      const match = vkVideoUrl.match(/vk\.com\/video(-?\d+)_(\d+)/);
      if (match) {
        const ownerId = match[1];
        const videoId = match[2];

        // console.log('Available VK Widgets:', window.VK.Widgets); // Проверка доступных методов

        setTimeout(() => {
          if (window.VK && window.VK.Widgets && typeof window.VK.Widgets.Video === 'function') {
            // console.log('Вызов VK.Widgets.Video');
            window.VK.Widgets.Video(
              `vk_video_player_${ownerId}_${videoId}_${activeIndex}`,
              {
                width: '100%',
                height: '100%',
                video: `${ownerId}_${videoId}`,
                autoplay: 1,
                mute: 1,
                hd: 1,
              }
            );
          } else {
            console.error('VK.Widgets.Video is not available. Available Widgets:', window.VK.Widgets);
          }
        }, 1000);
      }
    }
  } else if (!isVKLoaded) {
    console.error('VK Open API не загружен. Невозможно инициализировать виджет VK видео.');
  }
}, [isVKLoaded, activeIndex, mediaPaths]);
 
  


  const renderVideo = useCallback(
    (videoUrl) => {
      let youtubeVideoId;

      if (videoUrl.includes('youtu.be')) {
        youtubeVideoId = videoUrl.split('/').pop();
      } else if (videoUrl.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        youtubeVideoId = urlParams.get('v');
      }

      if (youtubeVideoId) {
        const embeddedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0`;
        return (
          <iframe
            id={`youtube-player-${activeIndex}`}
            width="100%"
            height="100%"
            src={embeddedUrl}
            title="YouTube video"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            playsInline
            allowFullScreen
            loading="lazy"
          ></iframe>
        );
      } else if (videoUrl.includes('vk.com/video')) {
        const match = videoUrl.match(/vk\.com\/video(-?\d+)_(\d+)/);
        if (match) {
          const ownerId = match[1];
          const videoId = match[2];
          // const vkEmbedUrl = `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}&hd=1&autoplay=1&controls=0`;
          return (
          //   <iframe
          //   id={`vk-player-${activeIndex}`}
          //   width="100%"
          //   height="100%"
          //   src={vkEmbedUrl}
          //   title="VK video"
          //   allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          //   playsInline
          //   allowFullScreen
          //   loading="lazy"
          // ></iframe>
            <div
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              <div
                id={`vk_video_player_${ownerId}_${videoId}_${activeIndex}`}
                style={{ width: '100%', height: '100%' }}
              ></div>
              {/* Overlay to prevent interaction with controls */}
              <div className={styles.vkPlayerOverlay}></div>
            </div>
          );
        }
      } else if (videoUrl.includes('rutube.ru')) {
        return (
          <iframe
            id={`rutube-player-${activeIndex}`}
            width="100%"
            height="100%"
            src={
              videoUrl.replace('/video/', '/play/embed/') +
              '?autoplay=1&muted=1&controls=0'
            }
            title="Rutube video"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            playsInline
            allowFullScreen
            loading="lazy"
            onLoad={() => {
              const iframe = document.getElementById(`rutube-player-${activeIndex}`);
              setTimeout(() => {
                iframe.contentWindow.postMessage(
                  JSON.stringify({ type: 'player:mute', data: {} }),
                  '*'
                );
                iframe.contentWindow.postMessage(
                  JSON.stringify({ type: 'player:play', data: {} }),
                  '*'
                );
                iframe.contentWindow.postMessage(
                  JSON.stringify({ type: 'player:hideControls', data: {} }),
                  '*'
                );
              }, 500);
            }}
          ></iframe>
        );
      } else if (videoUrl.endsWith('.mp4')) {
        return (
          <video
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            controls={false}
            loading="lazy"
            width="100%"
            height="100%"
          >
            <source src={`${Host}/videos/${videoUrl}`} type="video/mp4" />
          </video>
        );
      }
      return null;
    },
    [activeIndex, styles.vkPlayerOverlay]
  );

  return (
    <section className={styles.GalleryTabs}>
      <h2 className={styles.GalleryTabs__title}>
        Жизнь на&nbsp;<span>MARKS`e</span>
      </h2>
      {events && events?.length > 0 ? (
        <>
          <Swiper
            className={styles.GalleryTabs__buttons}
            speed={1000}
            slidesPerView={'auto'}
            spaceBetween={8}
          >
          {events?.map((event, index) => (
            <SwiperSlide
                key={event.id}
                className={`${styles.GalleryTabs__button} ${activeIndex === index ? styles.active : ''}`}
                onClick={() => handleButtonClick(index)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {event.title}
              </button>
            ))}
          </div>

          <div
            ref={galleryRef}
            className={styles.GalleryTabs__content}
            onMouseMove={handleMouseMove}
          >
            <div ref={cursorRef} className={styles.GalleryTabs__cursor}></div>
            <div
              className={`${styles.GalleryTabs__half} ${styles.GalleryTabs__half_left} ${
                mediaPaths?.videos?.length ? styles.disabled : ''
              }`}
              onClick={() => handleSlide('left')}
            ></div>
            <div
              className={`${styles.GalleryTabs__half} ${styles.GalleryTabs__half_right} ${
                mediaPaths?.videos?.length ? styles.disabled : ''
              }`}
              onClick={() => handleSlide('right')}
            ></div>
            <Slider
              ref={sliderRef}
              arrows={false}
              slidesToScroll={1}
              infinite={true}
              autoplay={false}
              lazyLoad="ondemand"
            >
              {mediaPaths?.images?.map((path, index) => (
                <div key={index} className={styles.slide}>
                  <img
                    src={`${Host}/images/eventAdd/${path}`}
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}

              {mediaPaths?.videos?.map((video, index) => (
                <div key={index} className={styles.slide}>
                  {renderVideo(video)}
                </div>
              ))}
            </Slider>
          </div>
        </>
      ) : (
        <div className={styles.GalleryTabs__noEvents}>
          Скоро здесь будет что-то увлекательное!
        </div>
      )}
    </section>
  );
});

export default GalleryTabs;
