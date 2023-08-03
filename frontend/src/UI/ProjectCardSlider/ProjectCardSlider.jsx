import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import ".././Company_Slider/Company_Slider.css";

const Host = process.env.REACT_APP_SERVER_HOST;

const ProjectCardSlider = ({ slidesCard }) => {
  const slideRef = useRef(null);
  const [width, setWidth] = useState(22);
  const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   setWidth((activeIndex + 1) * 22 + 2);
  // }, [activeIndex]);

  const handleButtonClick = (index) => {
    if (slideRef.current) {
      slideRef.current.slickGoTo(index);
      // setActiveIndex(index);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && activeIndex < slidesCard.length - 1) {
      handleButtonClick(activeIndex + 1);
    } else if (direction === "right" && activeIndex > 0) {
      handleButtonClick(activeIndex - 1);
    }
  };
  // const handleSlideChange = (index) => {
  //   setActiveIndex(index);
  // };


  const settings = {
    lazyLoad: false,
    arrows: false,
    ref: slideRef,
    slidesToScroll: 1,
    onSwipe: handleSwipe,
    infinite: false,
    // afterChange: handleSlideChange,
    // swipeToSlide: true,
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [slidesCard]);


  const imagePaths = slidesCard && slidesCard.length > 0
  ? slidesCard[activeIndex]?.imageTitle.split(",").map((imageName) => {
      return `${Host}/images/imageAdd/${imageName.trim()}`;
    })
  : [];

   
// console.log(slidesCard, '++++++++++++++++++++++++++');
  return (
    <div className="company-slider-container">
      <Slider {...settings}>
      {imagePaths?.map((path, index) => (
          <div key={index} className="company-slider-slide">
            {path && (
              <img
              className="company-slider-slide-img"
                src={path}
                alt={`Slide ${index}`}
              />
            )}
          </div>
        ))}
      </Slider>
         <div className="navigation_slider">
        <div className="button_slider_wrapper">
          {imagePaths?.map((_, index) => (
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
