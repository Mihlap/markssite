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
    centerPadding: "60px",
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          centerPadding: "60px",
          autoplay: false,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          centerPadding: "60px",
          autoplay: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: "40px",
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 767,
        settings: {
          dots: true,
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "40px",
          autoplay: false,
          autoplaySpeed: 3000,
          appendDots: (dots) => (
            <div>
              {dots.map((dot, index) => {
                  if (index < 3) {
                    return <li key={index} className="custom-dots">{dot}</li>;
                  }
                  return null;
                })}
            </div>
          ),
          customPaging: (i) => (
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "20px",
                height: "1px",
                borderRadius: "30%",
                backgroundColor: "#FF7F6A",
                border: "3px #FF7F6A solid",
                margin: "2rem 2px",
              }}
            ></div>
          ),
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
          autoplay: false,
          autoplaySpeed: 3000,
          appendDots: (dots) => (
            <div>
             {dots.map((dot, index) => {
                  if (index < 3) {
                    return <li key={index} className="custom-dots">{dot}</li>;
                  }
                  return null;
                })}
            </div>
          ),
          customPaging: (i) => (
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "20px",
                height: "1px",
                borderRadius: "30%",
                backgroundColor: "#FF7F6A",
                border: "3px #FF7F6A solid",
                margin: "2rem 2px",
              }}
            ></div>
          ),
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
