import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './GalleryTabs.module.scss';
import { fetchEvents } from '../../../store/Slice/vacancyEventSlice';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const GalleryTabs = React.memo(({ handleMouseEnter, handleMouseLeave }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
  const sliderRef = useRef(null);
  const cursorRef = useRef(null);
  const galleryRef = useRef(null);
  const { events } = useSelector((state) => state.formAddEvent);
  const videoRefs = useRef([]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events && events?.length > 0 && activeIndex === null) {
      const visibleEvents = events.filter((event) => !event.hidden);
      if (visibleEvents.length > 0) {
        setActiveIndex(0);
      }
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
        sliderRef.current.slickPrev();
      } else if (direction === 'right') {
        sliderRef.current.slickNext();
      }
    }
  };

  const getMediaPaths = useCallback((event) => {
    const images = event?.files?.filter(
      (file) => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.avif')
    );

    const videos = event?.eventData?.filter(
      (file) => file.endsWith('.mp4') || file.includes('youtube.com') || file.includes('rutube.ru')
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

  const renderVideo = useCallback((videoUrl, index) => {
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
          ref={(el) => (videoRefs.current[index] = el)}
          id={`youtube-player-${index}`}
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
    } else if (videoUrl.includes('rutube.ru')) {
      const rutubeEmbedUrl = videoUrl.replace('/video/', '/play/embed/') + '?autoplay=1&muted=1&controls=0';
      return (
        <iframe
          ref={(el) => (videoRefs.current[index] = el)}
          id={`rutube-player-${index}`}
          width="100%"
          height="100%"
          src={rutubeEmbedUrl}
          title="Rutube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          playsInline
          allowFullScreen
          loading="lazy"
          onLoad={() => {
            const iframe = document.getElementById(`rutube-player-${index}`);
            setTimeout(() => {
              iframe.contentWindow.postMessage(JSON.stringify({ type: 'player:mute', data: {} }), '*');
              iframe.contentWindow.postMessage(JSON.stringify({ type: 'player:play', data: {} }), '*');
              iframe.contentWindow.postMessage(JSON.stringify({ type: 'player:hideControls', data: {} }), '*');
            }, 100);
          }}
        ></iframe>
      );
    } else if (videoUrl.endsWith('.mp4')) {
      return (
        <video
          ref={(el) => (videoRefs.current[index] = el)}
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
          <source src={`${bucket_url}/videos/${videoUrl}`} type="video/mp4" />
        </video>
      );
    }
    return null;
  }, []);

  useEffect(() => {
    const currentVideoRefs = [...videoRefs.current]; 
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.tagName === 'IFRAME') {
            const iframe = entry.target;
            if (iframe && iframe.src.includes('rutube.ru')) {
              iframe.contentWindow.postMessage(JSON.stringify({ type: 'player:play', data: {} }), '*');
            }
          } else if (entry.isIntersecting && entry.target.tagName === 'VIDEO') {
            entry.target.play();
          } else {
            entry.target.pause?.();
          }
        });
      },
      { threshold: 0.5 }
    );

    setTimeout(() => {
      currentVideoRefs.forEach((video) => {
        if (video) observer.observe(video);
      });
    }, 100);

    return () => {
      currentVideoRefs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [mediaPaths, activeIndex]);

  useEffect(() => {
    if (mediaPaths?.videos && videoRefs.current[activeIndex]) {
      const currentVideo = videoRefs.current[activeIndex];

      if (currentVideo && currentVideo.tagName === 'IFRAME' && currentVideo.src.includes('rutube.ru')) {
        currentVideo.contentWindow.postMessage(JSON.stringify({ type: 'player:play', data: {} }), '*');
      } else if (currentVideo && currentVideo.tagName === 'VIDEO') {
        currentVideo.play();
      }
    }
  }, [activeIndex, mediaPaths?.videos]);

  const mediaItems = useMemo(() => {
    const images =
      mediaPaths?.images?.map((path, index) => ({
        type: 'image',
        src: path,
        index,
      })) || [];

    const videos =
      mediaPaths?.videos?.map((video, index) => ({
        type: 'video',
        src: video,
        index,
      })) || [];

    return [...videos, ...images];
  }, [mediaPaths]);

  const renderMediaItem = useCallback(
    (item) => {
      if (item.type === 'video') {
        return (
          <div key={item.index} className={styles.slide}>
            {renderVideo(item.src, item.index)}
          </div>
        );
      } else if (item.type === 'image') {
        return (
          <div key={item.index} className={styles.slide}>
            <img src={item.src} alt={`Slide ${item.index + 1}`} />
          </div>
        );
      }
      return null;
    },
    [renderVideo]
  );

  return (
    <section className={styles.GalleryTabs}>
      <h2 className={styles.GalleryTabs__title}>
        Жизнь на&nbsp;<span>MARKSe</span>
      </h2>
      {events && events?.filter((event) => !event.hidden).length > 0 ? (
        <>
          <Swiper className={styles.GalleryTabs__buttons} speed={1000} slidesPerView={'auto'} spaceBetween={8}>
            {events
              ?.filter((event) => !event.hidden)
              .map((event, index) => (
                <SwiperSlide
                  key={event.id}
                  className={`${styles.GalleryTabs__button} ${activeIndex === index ? styles.active : ''}`}
                  onClick={() => handleButtonClick(index)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {event.title}
                </SwiperSlide>
              ))}
          </Swiper>
          <div ref={galleryRef} className={styles.GalleryTabs__content} onMouseMove={handleMouseMove}>
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
              {mediaItems.map((item) => renderMediaItem(item))}
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
