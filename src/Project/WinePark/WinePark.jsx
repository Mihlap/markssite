import React, { useEffect, useRef } from "react";
import styles from "../Project.module.css";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
 
// импортируем фото
import img from "./img/WinePark.jpg";
import img1 from "./img/WinePark1.jpg";
import img2 from "./img/WinePark2.jpg";
import img3 from "./img/WinePark3.jpg";
import img4 from "./img/WinePark4.jpg";
import img5 from "./img/WinePark5.jpg";
 
export default function WinePark() {
 const refs = {
   title: useRef(null),
   link: useRef(null),
   desc: useRef(null),
   blockLeft: useRef(null),
   blockRight: useRef(null),
   blockRightPhone: useRef(null),
   leftImg1: useRef(null),
   leftImg2: useRef(null),
   leftImg3: useRef(null),
   leftImg4: useRef(null),
   leftImg5: useRef(null),
 };
 
 useEffect(() => {
   window.scrollTo(20, 0);
 
   const { title, link, desc } = refs;
 
   // Скрываем заголовок, ссылку и описание перед анимацией
   gsap.set([title.current, link.current, desc.current], { opacity: 0 });
 
   // Анимируем появление заголовка, затем ссылки, затем описания
   gsap.to(title.current, { duration: 1, opacity: 1, delay: 0.5 });
   gsap.to(link.current, { duration: 1, opacity: 1, delay: 1 });
   gsap.to(desc.current, { duration: 1, opacity: 1, delay: 0.7 });
 
   gsap.registerPlugin(ScrollTrigger);
 
   const {
     blockLeft,
     blockRight,
     blockRightPhone,
     leftImg1,
     leftImg2,
     leftImg3,
     leftImg4,
     leftImg5,
   } = refs;
 
   const elementsLeft = [
     blockLeft.current,
     leftImg1.current,
     leftImg3.current,
     leftImg5.current,
   ];
   const elementsRight = [
     blockRightPhone.current,
     blockRight.current,
     leftImg2.current,
     leftImg4.current,
   ];
 
   const animateElement = (element) => {
     gsap.from(element, {
       x: "-100%",
       opacity: 0,
       duration: 1.5,
       delay: 1,
       ease: "power4.out",
       scrollTrigger: {
         trigger: element,
         start: "top 80%",
       },
     });
   };
 
   elementsLeft.forEach(animateElement);
   elementsRight.forEach(animateElement);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
  return (
    <section className={styles.section}>
      <img className={styles.header_img} src={img} alt="" />
      <div className={styles.container}>
        <div className={styles.header_container}>
          <div className={styles.header_img_title}>
            <Link to="/project" ref={refs.link} className={styles.header_link}>
              Все проекты
            </Link>
            <h1 ref={refs.title} className={styles.header_title}>
              Винный парк WinePark
            </h1>
            <div ref={refs.desc} className={styles.header_desc}>
              Республика Крым &#8226; 2021
            </div>
          </div>
          <div className={styles.header_content}>
            <div ref={refs.blockLeft} className={styles.header_content_left}>
              <div className={styles.title_block}>
                <h2 className={styles.left_title}>Новый формат путешествий</h2>
                <div className={styles.left_meta}>
                  Генеральное проектирование
                </div>
              </div>
              <div className={styles.title_text}>
                Винный парк — это многофункциональное пространство для
                энотуризма с собственными
                <br /> виноградниками и гравитационной винодельней, остащённой
                самым современным оборудованием.
                <br />
                Обширная парковая территория с различными элементами
                благоустройства включает фруктовый,
                <br /> розовый и кактусовые сады, зеркальный парящий мост,
                амфитеатр, водопад с гротом, малые <br />
                архитектурные формы и концептуальные скульптуры.
              </div>
 
              <div className={styles.result_container}>
                <div className={styles.result_block}>
                  <div className={styles.result_number}>30 га</div>
                  <div className={styles.result_text}>Общая площадь</div>
                </div>
                <div className={styles.result_block}>
                  <div className={styles.result_number}>7. 75 га</div>
                  <div className={styles.result_text}>
                    Площадь виноградников
                  </div>
                </div>
                <div className={styles.result_block}>
                  <div className={styles.result_number}>54.5 м</div>
                  <div className={styles.result_text}>Высота винной башни</div>
                </div>
              </div>
            </div>
            <div ref={refs.blockRight} className={styles.header_content_right}>
              <div className={styles.local_container}>
                <div className={styles.local_ritgh}>
                  <div>
                    <div className={styles.local_title}>Расположение</div>
                    <div className={styles.local_text}>
                      г. Москва, Ленинградский проспект, вл. 37
                    </div>
                  </div>
 
                  <div>
                    <div className={styles.local_title}>Заказчик</div>
                    <div className={styles.local_text}>-</div>
                  </div>
                  <div>
                    <div className={styles.local_title}>Публикации</div>
                    <Link
                      to="https://tass.ru/obschestvo/9880739"
                      target="_blank"
                    >
                    <div className={styles.local_text}>
                      ТАСС «Первый в России винный парк откроется под Ялтой
                      весной 2021 года»
                    </div>
                    </Link>
                  </div>
                </div>
                <div className={styles.local_left}>
                  <div>
                    <div className={styles.local_title}>Степень участия</div>
                    <div className={styles.local_text}>
                      Генеральный проектировщик
                    </div>
                  </div>
                  <div>
                    <div className={styles.local_title}>Статус</div>
                    <div className={styles.local_text}>В эксплуатации</div>
                  </div>
                  <div>
                    <div className={styles.local_title}>Награды</div>
                    <div className={styles.local_text}>-</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={refs.blockRightPhone}
              className={styles.result_container_phone}
            >
              <div className={styles.result_block}>
                <div className={styles.result_number}>30 га</div>
                <div className={styles.result_text}>Общая площадь</div>
              </div>
              <div className={styles.result_block}>
                <div className={styles.result_number}>7. 75 га</div>
                <div className={styles.result_text}>Площадь виноградников</div>
              </div>
              <div className={styles.result_block}>
                <div className={styles.result_number}>54.5 м</div>
                <div className={styles.result_text}>Высота винной башни</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.blockImg}>
        <div className={styles.container}>
          <div className={styles.item}>
            <img className={styles.leftImg1} src={img1} alt="" />
          </div>
          <div className={styles.item}>
            <img className={styles.leftImg2} src={img2} alt="" />
          </div>
          <div className={styles.item}>
            <img className={styles.leftImg3} src={img3} alt="" />
          </div>
          <div className={styles.item}>
            <img className={styles.leftImg4} src={img4} alt="" />
          </div>
          <div className={styles.item}>
            <img className={styles.leftImg5} src={img5} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}