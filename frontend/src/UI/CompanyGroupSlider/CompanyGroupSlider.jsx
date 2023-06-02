import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./CompanyGroupSlider.css";

const CompanyGroupSlider = () => {
  const sliderRef = useRef(null);
  const [width, setWidth] = useState(22);
  const [activeIndex, setActiveIndex] = useState(0);
   
    const handleButtonClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      setWidth((index + 1) * 22 + 2);
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
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    slidesPerRow: 1,
    rowGap: '30px',
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          slidesPerRow: 1,
          rowGap: '30px',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          slidesPerRow: 1,
          rowGap: '30px',
        },
      },
    ],
  }
 
  return (
    <div className="company-group-container">
      <Slider {...settings}>
        <div className="company-group-slide">
          <img src="./assets/group_company.png" alt="1" />
        </div>
        <div className="company-group-slide">
          <img src="./assets/group_company.png" alt="2" />
        </div>
        <div className="company-group-slide">
          <img src="./assets/group_company.png" alt="3" />
        </div>
        <div className="company-group-slide">
        <img src="./assets/group_company.png" alt="4" />
        </div>
        <div className="company-group-slide">
        <img src="./assets/group_company.png" alt="5" />
        </div>
        <div className="company-group-slide">
        <img src="./assets/group_company.png" alt="6" />
        </div>
        <div className="company-group-slide">
        <img src="./assets/group_company.png" alt="7" />
        </div>
        <div className="company-group-slide">
        <img src="./assets/group_company.png" alt="8" />
        </div>
        <div className="company-group-slide">
        <img src="./assets/group_company.png" alt="9" />
        </div>
      </Slider>
     </div>
  );
};

export default CompanyGroupSlider;
