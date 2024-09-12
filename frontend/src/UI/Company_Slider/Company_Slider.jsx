import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Company_Slider.css';

const catPhoto = '../../img/default-photo.jpeg';

const CompanySlider = () => {
  const sliderRef = useRef(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [lineWidth, setLineWidth] = useState(22);

  const slidesCard = [
    { imageTitle: 'wine-park1.png' },
    { imageTitle: 'mfk-slava2.png' },
    { imageTitle: 'prime-park3.png' },
    { imageTitle: 'badaevsky4.png' },
  ];

  const imagePaths = slidesCard.flatMap((slide) => {
    if (!slide.imageTitle) return catPhoto;
    return slide.imageTitle.split(',').map((el) => `./assets/${el.trim()}`);
  });

  useEffect(() => {
    setLineWidth(calculateLineWidth(activeButtonIndex));
  }, [activeButtonIndex]);

  const calculateLineWidth = (index) => {
    const count = imagePaths.length;
    if (sliderRef.current && count === 4) {
      return (index + 1) * 22;
    } else if (sliderRef.current && count === 3) {
      return (index + 1) * 30;
    } else if (sliderRef.current && count === 2) {
      return (index + 1) * 45;
    } else {
      return index;
    }
  };

  const handleButtonClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      setActiveButtonIndex(index);
      setLineWidth(calculateLineWidth(index));
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' && activeButtonIndex < slidesCard.length - 1) {
      handleButtonClick(activeButtonIndex + 1);
    } else if (direction === 'right' && activeButtonIndex > 0) {
      handleButtonClick(activeButtonIndex - 1);
    }
  };

  const handleBeforeChange = (_, newIndex) => {
    setActiveButtonIndex(newIndex);
    setLineWidth(calculateLineWidth(newIndex));
  };

  const settings = {
    lazyLoad: true,
    arrows: false,
    ref: sliderRef,
    slidesToScroll: 1,
    onSwipe: handleSwipe,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    beforeChange: handleBeforeChange,
  };

  return (
    <div className="company-slider-container">
      <Slider {...settings}>
        {imagePaths.map((path, index) => (
          <div key={index} className="company-slider-slide">
            <img className="company-slider-slide-img" src={path} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
      <div className="navigation_slider">
        <div className="button_slider_wrapper">
          {imagePaths.map((_, index) => (
            <button
              key={index}
              className={`button_slider ${activeButtonIndex === index ? 'active' : ''}`}
              onClick={() => handleButtonClick(index)}
            >
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

export default CompanySlider;
