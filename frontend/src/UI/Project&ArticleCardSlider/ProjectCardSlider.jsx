import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import placehold from '../../Project/icon/placehold.webp';

import '.././Company_Slider/CompanySlider.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const calculateLineWidth = (index, count) => {
  if (count === 4) {
    return (index + 1) * 22;
  } else if (count === 3) {
    return (index + 1) * 30;
  } else if (count === 2) {
    return (index + 1) * 45;
  } else {
    return index;
  }
};

const ProjectCardSlider = ({ slidesCard }) => {
  const sliderRef = useRef(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  const imagePaths =
    slidesCard && slidesCard.length > 0
      ? slidesCard.flatMap((slide) => {
          if (!slide.imageTitle) return placehold;
          return slide.imageTitle.split(',').map((el) => {
            return el.includes('https') ? el.trim() : `${bucket_url}/images/imageAdd/${el.trim()}`;
          });
        })
      : [];

  const [lineWidth, setLineWidth] = useState(() => calculateLineWidth(0, imagePaths.length));

  useEffect(() => {
    setLineWidth(calculateLineWidth(0, imagePaths.length));
  }, [slidesCard, imagePaths.length]);

  const handleButtonClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      setActiveButtonIndex(index);
      setLineWidth(calculateLineWidth(index, imagePaths.length));
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' && activeButtonIndex < slidesCard.length - 1) {
      handleButtonClick(activeButtonIndex + 1);
    } else if (direction === 'right' && activeButtonIndex > 0) {
      handleButtonClick(activeButtonIndex - 1);
    }
  };

  const handleBeforeChange = (oldIndex, newIndex) => {
    setActiveButtonIndex(newIndex);
    setLineWidth(calculateLineWidth(newIndex, imagePaths.length));
  };

  if (imagePaths.length <= 1) {
    return (
      <div className="company-slider-container">
        {imagePaths?.map((path, index) => (
          <div key={index} className="company-slider-slide">
            <img className="company-slider-slide-img" src={path} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="company-slider-container">
      <Slider
        lazyLoad={true}
        arrows={false}
        ref={sliderRef}
        slidesToScroll={1}
        onSwipe={handleSwipe}
        infinite={true}
        autoplay={true}
        autoplaySpeed={6000}
        beforeChange={handleBeforeChange}>
        {imagePaths?.map((path, index) => (
          <div key={index} className="company-slider-slide">
            <img className="company-slider-slide-img" src={path} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
      <div className="navigation_slider">
        <div className="button_slider_wrapper">
          {imagePaths?.map((__, index) => (
            <button
              key={index}
              className={`button_slider ${activeButtonIndex === index ? 'active' : ''}`}
              onClick={() => handleButtonClick(index)}>
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
          <div className="underline" style={{ width: `${lineWidth}%` }}></div>
        </div>
        <div className="gray-underline"></div>
      </div>
    </div>
  );
};

export default ProjectCardSlider;
