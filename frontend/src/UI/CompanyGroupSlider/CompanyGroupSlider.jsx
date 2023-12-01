import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./CompanyGroupSlider.css";

const CompanyGroupSlider = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 0,
    arrows: false,
    centerPadding: "0",
    adaptiveWidth: true,
    beforeChange: (current, next) => setCurrentPage(next),
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 0,
          centerPadding: "0",
          autoplay: false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          // centerPadding: "60px",
          autoplay: false,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          // centerPadding: "60px",
          autoplay: false,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          // centerPadding: "60px",
          autoplay: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          // centerPadding: "40px",
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          // centerPadding: "40px",
          autoplay: false,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 615,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "40px",
          centerMode: false,
          autoplay: false,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "0",
          // centerMode: true,
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
        <div className="image-wrapper">
          <div className="company-group-slide">
            <img src="./assets/Vector.svg" alt="1" />
            <span className="text_slider_span">
              Проектно-архитектурная компания. Генеральное проектирование,
              научные исследования, комплексный анализ объектов и&nbsp;территорий
              развития инфраструктуры городов и&nbsp;мегаполисов
            </span>
          </div>
        </div>
        <div className="image-wrapper">
          <div className="company-group-slide">
            <img src="./assets/Vector1.svg" alt="2" />
            <span className="text_slider_span">
              Проектирование интерьеров жилых и&nbsp;общественных пространств. Дизайн
              интерьеров, брендинг и&nbsp;архитектурная визуализация
            </span>
          </div>
        </div>
        <div className="image-wrapper">
          <div className="company-group-slide">
            <img src="./assets/Vector2.svg" alt="3" />
            <span className="text_slider_span">
              Цифровые решения в&nbsp;проектировании, девелопменте и&nbsp;строительстве
            </span>
          </div>
        </div>
        <div className="image-wrapper">
          <div className="company-group-slide">
            <img src="./assets/Vector3.svg" alt="4" />
            <span className="text_slider_span">
              Научно-техническое сопровождение проектирования и&nbsp;строительства.
              Проектирование, научные исследования, комплексные расчёты
              строительных конструкций, оснований, фундаментов и&nbsp;подземных
              сооружений
            </span>
          </div>
        </div>
        <div className="image-wrapper">
          <div className="company-group-slide">
            <img src="./assets/Vector4.svg" alt="5" />
            <span className="text_slider_span">
            Институт науки, проектирования и&nbsp;инжиниринга. Проектирование объектов промышленного и&nbsp;гражданского строительства
            </span>
          </div>
        </div>
      </Slider>
      <div className="pagination_company_slider">
        {Array.from({ length: Math.ceil(5) }).map((_, index) => (
          <button
            key={index}
            className={`pagination_company_slider-dot ${
              currentPage === index ? "active" : ""
            }`}
            onClick={() => handlePageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyGroupSlider;
