/* eslint-disable array-callback-return */
import React, { useEffect, useRef } from "react";
import styles from "../Badaevsky/Badaevsky.module.css";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AllProjectsButton from "../../UI/ButtonsProjects/AllProjectsButton";

// импортируем фото
import img from "./img/wine-park.jpg";
import img1 from "./img/wine-park1.jpg";
import img2 from "./img/wine-park2.jpg";
import img3 from "./img/wine-park3.jpg";
import img4 from "./img/wine-park4.jpg";
import img5 from "./img/wine-park5.jpg";
import img6 from "./img/wine-park6.jpg";
import img7 from "./img/wine-park7.jpg";
import img8 from "./img/wine-park8.jpg";
import img9 from "./img/wine-park9.jpg";
import img10 from "./img/wine-park10.jpg";
import img11 from "./img/wine-park11.jpg";

export default function WineParkArticles() {
  //useRefs для анимация появления блоков в шапке на картинке
  const titleRef = useRef(null);
  const linkRef = useRef(null);
  const descRef = useRef(null);
  //useRefs для анимация появления блоков справой стороны экрана
  const blockRight = useRef(null);
  const blockRightQuote = useRef(null);
  const blockDescription = useRef(null);
  const blockName = useRef(null);
  //useRefs для анимация появления блоков слевой стороны экрана
  const leftImg1 = useRef(null);
  const leftImg2 = useRef(null);
  const leftImg3 = useRef(null);

  useEffect(() => {
    window.scrollTo(20, 0);

    const title = titleRef.current;
    const link = linkRef.current;
    const desc = descRef.current;
    const name = blockName.current;

    // Скрываем заголовок, ссылку и описание перед анимацией
    gsap.set([title, link, desc, name], { opacity: 0 });

    // Анимируем появление заголовка, затем ссылки, затем описания
    gsap.to(title, { duration: 1, opacity: 1, delay: 0.5 });
    gsap.to(link, { duration: 1, opacity: 1, delay: 1 });
    gsap.to(desc, { duration: 1, opacity: 1, delay: 0.7 });
    gsap.to(name, { duration: 1, opacity: 1, delay: 0.7 });

    gsap.registerPlugin(ScrollTrigger);

    const { elementsLeft, elementsRight } = {
      elementsLeft: [leftImg1.current, leftImg2.current, leftImg3.current],
      elementsRight: [
        blockRight.current,
        blockRightQuote.current,
        blockDescription.current,
      ],
    };

    elementsLeft.forEach((element) => {
      gsap.from(element, {
        x: "-100%",
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 100%",
        },
      });
    });

    elementsRight.forEach((element) => {
      gsap.from(element, {
        x: "100%",
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
        },
      });
    });
  }, []);
  return (
    <section className={styles.section}>
      <img className={styles.header_img} src={img} alt="" />
      <div className={styles.container}>
        <div className={styles.header_container}>
          <div className={styles.header_img_title}>
            <AllProjectsButton />
            <h1 ref={titleRef} className={styles.header_title}>
              Центр винноготуризма WINEPARK
            </h1>

            <div ref={blockName} className={styles.header_name}>
              Archea Associati +T+T Architects +INPI (входитв ГК MARKSGROUP)
            </div>
            <div ref={descRef} className={styles.header_desc}>
              Проект Россия, Москва &#8226; 24 Мая 2023
            </div>
          </div>
          <div className={styles.header_content}>
            <div ref={blockRight} className={styles.header_content_text}>
              <div className={styles.title_block}>
                <h2 className={styles.left_title}>
                  Archea Associati +T+T Architects +INPI (входитв ГК MARKSGROUP)
                </h2>
              </div>
              <div className={styles.articles_title_text}>
                В последние годы все больше российских винодельческих хозяйств
                заявляют о себе не только качественными и конкурентоспособными
                винами, но и самым современным подходом к продвижению
                энокультуры. Они строят винодельни, на которые съезжаются
                посмотреть со всей страны, дополняют их ресторанами,
                дегустационными залами и музеями современного искусства (см.
                ПР98). Однако такого «центра винных открытий», который появился
                в Крыму,еще не было: с подземной винодельней, искусственным
                озером, смотровой площадкой на высоте 45 метров и парком среди
                виноградников и гор.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.block_img}>
        <div className={styles.container}>
          <div className={styles.item}>
            <img className={styles.item_img} ref={leftImg1} src={img1} alt="" />
          </div>
          <div className={styles.quote_container}>
            <div ref={blockRightQuote} className={styles.quote_block}>
              <div className={styles.quote_text}>
                Альберто Антонини — главный энолог и консультант проекта —
                убежден, что “the lessis more”: в вине он прежде всего выражает
                особенности терруара. Архитекторы же решили трактовать этот
                принцип на весь проект центра виноделия, не забывая о том, как
                звучит расшифровка: “In order to doless you have to know more”
                («если хочешь делать меньше — нужно знать больше»). Им удалось
                деликатно интегрировать винодельню в природный ландшафт — и при
                этом создать новейшую по технологическому оснащению
                концептуальную платформу, призванную стать меккой российского
                энотуризма.
              </div>

              <div className={styles.quote}>
                В чертежах, по которым будет вестись строительство учитывается
                всё – от основных конструктивных решений и методик реставрации
                объектов культурного наследия, до мебели и материалов в отделке
                помещений
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img className={styles.item_img} ref={leftImg2} src={img2} alt="" />
          </div>
          <div
            ref={blockDescription}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                В рамках реализации проекта премиум-класса наряду с новым
                строительством жилого комплекса, парящего над землёй на колоннах
                высотой 35 метров, запланирована реставрация двух корпусов
                памятника промышленной архитектуры XIX века. Вместе с объектами
                культурного наследия девелопер принял решение дополнительно
                восстановить утраченное строение, не имеющее охранного статуса,
                но важное для целостности архитектурного ансамбля.
              </div>
              <div className={styles.description_object_text2}>
                В рамках реализации проекта премиум-класса наряду с новым
                строительством жилого комплекса, парящего над землёй на колоннах
                высотой 35 метров, запланирована реставрация двух корпусов
                памятника промышленной архитектуры XIX века. Вместе с объектами
                культурного наследия девелопер принял решение дополнительно
                восстановить утраченное строение, не имеющее охранного статуса,
                но важное для целостности архитектурного ансамбля.
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_latest}`}
              ref={leftImg3}
              src={img3}
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
