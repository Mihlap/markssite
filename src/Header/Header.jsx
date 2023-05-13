/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BlockHeader from "../UI/BlockHeader/BlockHeader";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import SliderHeader from "../UI/SliderHeader/SliderHeader";
import VideoPlayer from "../UI/Videoplayer/VideoPlayer";
// import Mapbox3D from '../UI/Map3D/Mapbox3D';
import styles from "./Header.module.css";

import IconPlus from ".././icons/plus.svg";
// import show from '.././icons/show.svg';
// import photo from "./img/phone.svg";

import D1 from ".././icons/D1.svg";
import D2 from ".././icons/D2.svg";
import D3 from ".././icons/D3.svg";
import D4 from ".././icons/D4.svg";
import D5 from ".././icons/D5.svg";
import D6 from ".././icons/D6.svg";
import D7 from ".././icons/D7.svg";
import D8 from ".././icons/D8.svg";
import D9 from ".././icons/D9.svg";






const Header = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className={styles.header}>
      <div className={styles.menu}>
      <VideoPlayer/>
        {/* <img className={styles.image} src="./fon.jpg" alt="изображение" /> */}
        {/* фото для мобильной версии  */}
        {/* <img className={styles.image_phone} src={photo} alt="photo" /> */}
      </div>
      <div className={styles.header_desctop_block}>
        <h1 className={styles.desctop_title}>Награды и публикации</h1>
        <div className={styles.desctop_test}>
          Наша компания участвует в многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с некоторыми докладами
        </div>
      </div>
      <div className={styles.header_block}>
        <h1 className={styles.heading}>Награды проектов</h1>
        <p className={styles.heading_text}>
          Наша компания участвует в<br /> многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с<br /> некоторыми
          докладами.
        </p>
      </div>
      <div className={styles.container_main}>
        <SliderHeader />
        <div className={styles.swiper_container}>
          <SwiperContainer />
        </div>
        <div className={styles.show_container}>
          {/* <button className={styles.show_svg}>
            <img src={show} alt="show" />
          </button> */}
        </div>
        <div className={styles.card_container}>
          <div className={styles.card_item_1}>
            <div className={styles.card_img}>
              <img className={styles.img_1} src="./assets/B.png" alt="image1" />
            </div>
            <div className={styles.card_text}>
              <h3>Центр энотуризма WinePark</h3>
              <span>Конкурс • 100 лучших объектов росии</span>
            </div>
            <Link to="/winepark">
            <button className={styles.card_button}>
              <img src={IconPlus} alt="button" />
            </button>
            </Link>
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
              <h3>Баня, рынок, супер-слэб — что ждет Бадаевский?</h3>
              <span>
                Статья • Экспертное обсуждение реставрации и приспособления
                объектов культурного наследия
              </span>
            </div>
            <Link to="/badaevsky">
            <button className={styles.card_button}>
              <img src={IconPlus} alt="button" />
            </button>
            </Link>
          </div>
        </div>
        <div className={styles.names_contents}>
          <div className={styles.name_11}>+11</div>
          <div className={styles.name_competencies}>Компетенции</div>
        </div>
       
        
        <div className={styles.most}>
          <img className={styles.image_most} alt=""></img>
        </div>
        <BlockHeader />
        {/* <Mapbox3D /> */}
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
      <marquee
        behavior="scroll"
        direction="left"
        className={styles.marguee_block}
      >
        <div className={styles.icon_partner_phone}>
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
      </marquee>
      <div className={styles.project_name}>Проекты</div>
      <div className={styles.swiper_progect_container}>
        <SwiperContainerProgect />
      </div>
      <div className={styles.main_project}>
        <div className={styles.main_project_left}>
          <Link>
          <img
            className={styles.img_poject}
            src="./assets/project_left.png"
            alt="project-left"
          />
          </Link>
          <div className={styles.card_text}>
            <h3>Жилой квартал PRIME PARK</h3>
            <span>г. Москва, Ленинградский проспект &bull; 2021 </span>
          </div>
        </div>
        <div className={styles.main_project_right}>
          <div className={styles.main_project_right1}>
          <Link>
            <img
              className={styles.img_project}
              src="./assets/project_right1.png"
              alt="project-right1"
            />
             </Link>
            <div className={styles.card_text}>
              <h3>Гостиничный комплекс с апартаментами</h3>
              <span>г. Москва, наб. Космодамианская &bull; 2021</span>
            </div>
          </div>
          <div className={styles.main_project_right2}>
          <Link>
            <img
              className={styles.img_project}
              src="./assets/project_right2.png"
              alt="project-right2"
            />
            </Link>
            <div className={styles.card_text}>
              <h3>МФК Комплекс апартаментов &laquo;Slava&raquo;</h3>
              <span>Россия, Москва &bull; 2020</span>
            </div>
          </div>
          <div className={styles.main_project_right3}>
          <Link>
            <img
              className={styles.img_project}
              src="./assets/project_right3.png"
              alt="project-right3"
            />
            </Link>
            <div className={styles.card_text}>
              <h3>Винный парк WinePark</h3>
              <span>Республика Крым &bull; 2021</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Header;
