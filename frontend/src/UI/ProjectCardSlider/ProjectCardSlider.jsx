import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import ".././Company_Slider/Company_Slider.css";

const Host = process.env.REACT_APP_SERVER_HOST;

const ProjectCardSlider = ({ slidesCard }) => {
  const sliderRef = useRef(null);
  // const [lineWidth, setLineWidth] = useState(25);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
 


  const imagePaths = slidesCard && slidesCard.length > 0
  ? slidesCard[activeButtonIndex]?.imageTitle.split(",").map((el) => {
      return `${Host}/images/imageAdd/${el.trim()}`;
    })
  : [];
// const imagePaths = slidesCard 
//   ? slidesCard.map(slide =>
//       slide.imageTitle.split(",").map((el) => `${Host}/images/imageAdd/${el.trim()}`)
//     )
//   : [];

  const calculateLineWidth = (index) => {
    const count = imagePaths ? imagePaths.length : 0;
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

  const [lineWidth, setLineWidth] = useState(() => calculateLineWidth(0));

  useEffect(() => {
    setActiveButtonIndex(0);
    setLineWidth(calculateLineWidth(0));
  }, [activeButtonIndex]);

  // ... Rest of the code ...

  const handleButtonClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      // setActiveButtonIndex(index);
      setLineWidth(calculateLineWidth(index));
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && activeButtonIndex < slidesCard.length - 1) {
      handleButtonClick(activeButtonIndex  + 1);
    } else if (direction === "right" && activeButtonIndex > 0) {
      handleButtonClick(activeButtonIndex  - 1);
    }
  };


    
console.log(slidesCard, '++++++++++++++++++++++++++');
  return (
    <div className="company-slider-container">
      <Slider 
       lazyLoad={true}
       arrows={false}
       ref={sliderRef}
       slidesToScroll={1}
       onSwipe={handleSwipe}
       infinite={false}
       afterChange={currentSlideIndex => handleButtonClick(currentSlideIndex)}
      >
      {imagePaths?.map((path, index) => (
          <div key={index} className="company-slider-slide">
            {path && (
              <img
              className="company-slider-slide-img"
                src={path}
                alt={`Slide ${index + 1}`}
              />
            )}
          </div>
        ))}
      </Slider>
         <div className="navigation_slider">
        <div className="button_slider_wrapper">
          {imagePaths?.map((__, index) => (
            <button
            key={index}
            className={`button_slider ${activeButtonIndex === index ? "active" : ""}`}
            onClick={() => handleButtonClick(index)}
            style={{
              fontSize: `${activeButtonIndex === index ? 2.5 : 1}vw`,
            }}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
         <div className="underline" style={{ width: `${lineWidth}%`, transition: "width 0.3s ease-in-out" }}></div>

        </div>
        <div className="gray-underline"></div>
      </div>
     </div>
  );
};

export default ProjectCardSlider;
