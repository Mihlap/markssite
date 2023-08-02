import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import ".././Company_Slider/Company_Slider.css";

const ProjectCardSlider = ({ slides }) => {
  const sliderRef = useRef(null);
  const [width, setWidth] = useState(22);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setWidth((activeIndex + 1) * 22 + 2);
  }, [activeIndex]);

  const handleButtonClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      setActiveIndex(index);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && activeIndex < slides.length - 1) {
      handleButtonClick(activeIndex + 1);
    } else if (direction === "right" && activeIndex > 0) {
      handleButtonClick(activeIndex - 1);
    }
  };

  const settings = {
    lazyLoad: true,
    arrows: false,
    ref: sliderRef,
    slidesToScroll: 1,
    onSwipe: handleSwipe,
    infinite: false,
    // swipeToSlide: true,
  };

  return (
    <div className="company-slider-container">
      <Slider {...settings}>
        {slides && slides?.map((slide) => (
          <div key={slide.id} className="company-slider-slide">
            <img src={slide.imageTitle} alt={slide.title} />
          </div>
        ))}
      </Slider>
      <div className="navigation_slider">
        <div className="button_slider_wrapper">
          {slides && slides?.map((_, index) => (
            <button
              key={index}
              className={`button_slider ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleButtonClick(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
          <div className="underline" style={{ width: `${width}%` }}></div>
        </div>
        <div className="gray-underline"></div>
      </div>
    </div>
  );
};

export default ProjectCardSlider;
