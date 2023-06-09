import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./Company_Slider.css";


const Company_Slider = () => {
  const sliderRef = useRef(null);
  const [width, setWidth] = useState(22);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleButtonClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      setWidth((prevWidth) => (index + 1) * 22 + 2);
      setActiveIndex(index);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && activeIndex < 3) {
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
    <div
      className="company-slider-container">
      <Slider {...settings}>
        <div className="company-slider-slide">
          <img src="./assets/company_slider.png" alt="111" />
        </div>
        <div className="company-slider-slide">
          <img src="./assets/company_slider.png" alt="111" />
        </div>
        <div className="company-slider-slide">
          <img src="./assets/company_slider.png" alt="111" />
        </div>
        <div className="company-slider-slide">
          <img src="./assets/company_slider.png" alt="111" />
        </div>
      </Slider>
      {/* {window.innerWidth > 1024 ? ( */}
        <div className="navigation_slider">
          <div className="button_slider_wrapper">
            <button
              className={`button_slider ${activeIndex === 0 ? "active" : ""}`}
              onClick={() => handleButtonClick(0)}
            >
              01
            </button>
            <button
              className={`button_slider ${activeIndex === 1 ? "active" : ""}`}
              onClick={() => handleButtonClick(1)}
            >
              02
            </button>
            <button
              className={`button_slider ${activeIndex === 2 ? "active" : ""}`}
              onClick={() => handleButtonClick(2)}
            >
              03
            </button>
            <button
              className={`button_slider ${activeIndex === 3 ? "active" : ""}`}
              onClick={() => handleButtonClick(3)}
            >
              04
            </button>
            <div className="underline" style={{ width: `${width}%` }}></div>
          </div>
          <div className="gray-underline"></div>
        </div>
      {/* ) : null} */}
    </div>
  );
};

export default Company_Slider;
