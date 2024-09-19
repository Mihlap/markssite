import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import styles from './GalleryTabs.module.scss';
import { fetchEvents } from '../../../store/Slice/vacancyEventSlice';

const Host = process.env.REACT_APP_SERVER_HOST;

const GalleryTabs = React.memo(({ handleMouseEnter, handleMouseLeave }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
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
        sliderRef.current.slickPrev(); // Перелистываем на предыдущий слайд
      } else if (direction === 'right') {
        sliderRef.current.slickNext(); // Перелистываем на следующий слайд
      }
    }
  };

  const getMediaPaths = useCallback((event) => {
    const images = event?.files?.filter(
      (file) => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.avif')
    );

    const videos = event?.eventData?.filter(
      (file) =>
        file.endsWith('.mp4') || file.includes('youtube.com') || file.includes('vk.com') || file.includes('rutube.ru')
    );
    return { images, videos };
  }, []);

  const mediaPaths = useMemo(() => {
    return events?.[activeIndex] ? getMediaPaths(events[activeIndex]) : null;
  }, [events, activeIndex, getMediaPaths]);

  const handleButtonClick = useCallback((index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      setActiveIndex(index);
    }
  }, []);

  const renderVideo = useCallback((videoUrl) => {
    if (videoUrl.includes('youtube.com')) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={videoUrl.replace('watch?v=', 'embed/')}
          title="YouTube video"
          // frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"></iframe>
      );
    } else if (videoUrl.includes('vk.com/video')) {
      const match = videoUrl.match(/vk\.com\/video(-?\d+)_(\d+)/);
      if (match) {
        const ownerId = match[1];
        const videoId = match[2];
        const vkEmbedUrl = `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}`;
        return (
          <iframe
            width="100%"
            height="100%"
            src={vkEmbedUrl}
            title="VK video"
            // frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"></iframe>
        );
      }
    } else if (videoUrl.includes('rutube.ru')) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={videoUrl.replace('/video/', '/play/embed/')}
          title="Rutube video"
          // frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"></iframe>
      );
    } else if (videoUrl.endsWith('.mp4')) {
      return (
        <video controls preload="metadata" loading="lazy">
          <source src={`${Host}/videos/${videoUrl}`} type="video/mp4" />
        </video>
      );
    }
    return null;
  }, []);

  return (
    <section className={styles.GalleryTabs}>
      <h2 className={styles.GalleryTabs__title}>
        Жизнь на&nbsp;<span>MARKS`e</span>
      </h2>

      {/* Content rendering and slider */}
      {events && events?.length > 0 ? (
        <>
          <div className={styles.GalleryTabs__buttons}>
            {events?.map((event, index) => (
              <button
                key={event.id}
                className={activeIndex === index ? styles.active : ''}
                onClick={() => handleButtonClick(index)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {event.title}
              </button>
            ))}
          </div>

          <div ref={galleryRef} className={styles.GalleryTabs__content} onMouseMove={handleMouseMove}>
            <div ref={cursorRef} className={styles.GalleryTabs__cursor}></div>
            <div
              className={`${styles.GalleryTabs__half} ${styles.GalleryTabs__half_left}`}
              onClick={() => handleSlide('left')}></div>
            <div
              className={`${styles.GalleryTabs__half} ${styles.GalleryTabs__half_right}`}
              onClick={() => handleSlide('right')}></div>
            <Slider
              ref={sliderRef}
              arrows={false}
              slidesToScroll={1}
              infinite={true}
              autoplay={true}
              autoplaySpeed={6000}
              lazyLoad="ondemand">
              {mediaPaths?.images?.map((path, index) => (
                <div key={index} className={styles.slide}>
                  <img src={`${Host}/images/eventAdd/${path}`} alt={`Slide ${index + 1}`} />
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
        <div className={styles.GalleryTabs__noEvents}>Скоро здесь будет что-то увлекательное!</div>
      )}
    </section>
  );
});

export default GalleryTabs;
