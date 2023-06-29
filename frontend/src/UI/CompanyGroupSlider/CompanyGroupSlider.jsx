import React, { useRef, useState }  from "react";
import Slider from "react-slick";
import "./CompanyGroupSlider.css";

const CompanyGroupSlider = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: 7,
    slidesToScroll: 3,
    arrows: false,
    centerPadding: "60px",
    beforeChange: (current, next) => setCurrentPage(next),
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
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "40px",
          autoplay: false,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 480,
        settings: {
           slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
          autoplay: false,
          autoplaySpeed: 3000,
         },
      },
    ],
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    sliderRef.current.slickGoTo(page);
  };


  return (
    <div className="company-group-container">
      <Slider ref={sliderRef} {...settings}>
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
      <div className="pagination_company_slider">
        {Array.from({ length: Math.ceil(9) }).map(
          (_, index) => (
            <button
              key={index}
              className={`pagination_company_slider-dot ${
                currentPage === index ? "active" : ""
              }`}
              onClick={() => handlePageClick(index)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CompanyGroupSlider;
