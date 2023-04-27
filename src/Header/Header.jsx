/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IconPlus from ".././icons/plus.svg";
import show from ".././icons/show.svg";
import styles from "./Header.module.css";
import CSSPlugin from "gsap/CSSPlugin";
import BlockHeader from "../UI/BlockHeader";

// фото для телефона
import photo from "./img/phone.svg";

const settings = {
  dots: false,
  infinite: true,
  speed: 20000,
  slidesToShow: 5,
  slidesToScroll: 6,
  autoplay: true,
  autoplaySpeed: 1,
  cssEase: "linear",
  vertical: false,
  verticalSwiping: true,
  swipeToSlide: true,
  touchThreshold: 1,
  arrows: false,
  variableWidth: true,
};
const Header = ({ handleClickScroll }) => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const logo = document.querySelector(".logo_fixed");
      const header = document.querySelector("logo_slider");
      const headerHeight = header ? header.offsetHeight : 0;
      const logoPosition = logo ? logo.getBoundingClientRect().top : 0;

      if (logoPosition <= headerHeight) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    // <div className={styles.main}>
    <div className={styles.header}>
      <div className={styles.menu}>
        <img className={styles.image} src="./image.png" alt="изображение" />
        <img className={styles.image_phone} src={photo} alt="photo" />
      </div>
      <Navbar handleClickScroll={handleClickScroll} />
      <div className={styles.header_block}>
        <h1 className={styles.heading}>Награды проектов</h1>
        <p className={styles.heading_text}>
          Наша компания участвует в<br /> многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с<br /> некоторыми
          докладами.
        </p>
      </div>
      <div className={styles.logo}>
        <Slider
          className={isFixed ? `${styles.logo_fixed}` : `${styles.logo_slider}`}
          {...settings}
          centerPadding="5px"
        >
          <div className={styles.item}>
            <img src="./assets/1.png" alt="image1" />
          </div>
          <div className={styles.item}>
            <img src="./assets/2.png" alt="image2" />
          </div>
          <div className={styles.item}>
            <img src="./assets/3.png" alt="image3" />
          </div>
          <div className={styles.item}>
            <img src="./assets/4.png" alt="image4" />
          </div>
          <div className={styles.item}>
            <img src="./assets/5.png" alt="image5" />
          </div>
          <div className={styles.item}>
            <img src="./assets/6.png" alt="image6" />
          </div>
          <div className={styles.item}>
            <img src="./assets/1.png" alt="image1" />
          </div>
          <div className={styles.item}>
            <img src="./assets/2.png" alt="image2" />
          </div>
          <div className={styles.item}>
            <img src="./assets/3.png" alt="image3" />
          </div>
          <div className={styles.item}>
            <img src="./assets/4.png" alt="image4" />
          </div>
          <div className={styles.item}>
            <img src="./assets/5.png" alt="image5" />
          </div>
          <div className={styles.item}>
            <img src="./assets/6.png" alt="image6" />
          </div>
        </Slider>
      </div>
      {/* <div className={styles.test}>
          <button className={styles.show_svg}>
          <img src={show} alt="show" />
        </button>
        <div className={styles.card_container}>
          <div className={styles.card_item_1}>
            <div className={styles.card_img}>
              <img className={styles.img_1} src="./assets/B.png" alt="image1" />
            </div>
            <div className={styles.card_text}>
              <h3>Смотр-конкурс Стекло в архитектуре 2022</h3>
              <span>Номинация Объект • нового строительства</span>
            </div>
            <button className={styles.card_button}>
              <img src={IconPlus} alt="button" />
            </button>
          </div>
          <div className={styles.card_item_2}>
            <div className={styles.card_img}>
              <img className={styles.img_2} src="./assets/B1.png" alt="image2" />
            </div>
            <div className={styles.card_text}>
              <h3>Смотр-конкурс Стекло в архитектуре 2022</h3>
              <span>Номинация Объект • нового строительства</span>
            </div>
            <button className={styles.card_button}>
              <img src={IconPlus} alt="button" />
            </button>
          </div>
        </div>
        <div className={styles.names_contents}>
          <div className={styles.name_11}>+11</div>
          <div className={styles.name_competencies}>Компетенции</div>
        </div>
        <div className={styles.most}>
          <img className={styles.image_most} ></img>
        </div>
        <div>
       <BlockHeader />
        </div>
         <div>
          <Footer />
        </div>
      </div> */}
    </div>
    /* </div> */
  );
};

export default Header;
