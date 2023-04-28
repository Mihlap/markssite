/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import Mapbox3D from "../UI/Map3D/Mapbox3D";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import IconPlus from ".././icons/plus.svg";
import show from ".././icons/show.svg";
import BlockHeader from "../UI/BlockHeader/BlockHeader";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import styles from "./Header.module.css";

import D1 from ".././icons/D1.svg";
import D2 from ".././icons/D2.svg";
import D3 from ".././icons/D3.svg";
import D4 from ".././icons/D4.svg";
import D5 from ".././icons/D5.svg";
import D6 from ".././icons/D6.svg";
import D7 from ".././icons/D7.svg";
import D8 from ".././icons/D8.svg";
import D9 from ".././icons/D9.svg";

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
        {/* фото для мобильной версии  */}
        <img className={styles.image_phone} src={photo} alt="photo" />
      </div>
      <Navbar handleClickScroll={handleClickScroll} />
      <div className={styles.header_desctop_block}>
        <h1 className={styles.desctop_title}>Награды и публикации</h1>
        <p className={styles.desctop_test}>
          Наша компания участвует в многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с некоторыми докладами
        </p>
      </div>
      <div className={styles.header_block}>
        <h1 className={styles.heading}>Награды проектов</h1>
        <p className={styles.heading_text}>
          Наша компания участвует в<br /> многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с<br /> некоторыми
          докладами.
        </p>
      </div>
      <div className={styles.test}>
        <div className={styles.logo}>
          <Slider
            className={
              isFixed ? `${styles.logo_fixed}` : `${styles.logo_slider}`
            }
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
            {/*добавлено для слайдера*/}
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
        <div className={styles.swiper_container}>
          <SwiperContainer />
        </div>
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
              <img
                className={styles.img_2}
                src="./assets/B1.png"
                alt="image2"
              />
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
          <img className={styles.image_most} alt=""></img>
        </div>
        <div>
          <BlockHeader />
        </div>
        <Mapbox3D />
      </div>
      <div className={styles.icon_partner}>
        <img src={D1} alt="logo" />
        <img src={D2} alt="logo" />
        <img src={D3} alt="logo" />
        <img src={D4} alt="logo" />
        <img src={D5} alt="logo" />
        <img src={D6} alt="logo" />
        <img src={D7} alt="logo" />
        <img src={D8} alt="logo" />
        <img src={D9} alt="logo" />
      </div>
      <div className={styles.project_name}>Проекты</div>
      <div className={styles.main_project}>
        <div className={styles.main_project_left}>
          <img
            className={styles.img_poject}
            src="./assets/project_left.png"
            alt="project-left"
          />
          <div className={styles.card_text}>
            <h3>Жилой квартал PRIME PARK</h3>
            <span>г. Москва, Ленинградский проспект &bull; 2021 </span>
          </div>
        </div>
        <div className={styles.main_project_right}>
          <div className={styles.main_project_right1}>
            <img
              className={styles.img_project}
              src="./assets/project_right1.png"
              alt="project-right1"
            />
            <div className={styles.card_text}>
              <h3>Гостиничный комплекс с апартаментами</h3>
              <span>г. Москва, наб. Космодамианская &bull; 2021</span>
            </div>
          </div>
          <div className={styles.main_project_right2}>
            <img
              className={styles.img_project}
              src="./assets/project_right2.png"
              alt="project-right2"
            />
            <div className={styles.card_text}>
              <h3>МФК Комплекс апартаментов &laquo;Slava&raquo;</h3>
              <span>Россия, Москва &bull; 2020</span>
            </div>
          </div>
          <div className={styles.main_project_right3}>
            <img
              className={styles.img_project}
              src="./assets/project_right3.png"
              alt="project-right3"
            />
            <div className={styles.card_text}>
              <h3>МЖК Бадаевский</h3>
              <span>г. Москва, Кутузовский проспект &bull; 2020</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
    /* </div> */
  );
};

export default Header;
