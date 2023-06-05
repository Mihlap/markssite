import React  from "react";
import Slider from "react-slick";
import "./CompanyGroupSlider.css";

const CompanyGroupSlider = () => {
  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: 7,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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
