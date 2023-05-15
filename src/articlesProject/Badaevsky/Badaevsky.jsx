/* eslint-disable array-callback-return */
import React, { useEffect, useRef } from "react";
import styles from "./Badaevsky.module.css";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// импортируем фото
import img from "./img/img.jpg";
import img1 from "./img/img1.jpg";
import img2 from "./img/img2.jpg";
import img3 from "./img/img3.jpg";

export default function Badaevsky() {
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
          start: "top 80%",
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
            <Link to="/project" ref={linkRef} className={styles.header_link}>
              Все статьи
            </Link>
            <h1 ref={titleRef} className={styles.header_title}>
              Marks Group – генеральный
              <br /> проектировщик ЖК «Бадаевский»
            </h1>

            <div ref={blockName} className={styles.header_name}>
              Александр Александров
            </div>
            <div ref={descRef} className={styles.header_desc}>
              ТАСС, Грозный &#8226; 7 октября 2022
            </div>
          </div>
          <div className={styles.header_content}>
            <div ref={blockRight} className={styles.header_content_text}>
              <div className={styles.title_block}>
                <h2 className={styles.left_title}>
                  В Capital Group назвали проектное бюро для нового знакового
                  объекта Москвы
                </h2>
              </div>
              <div className={styles.articles_title_text}>
                Генеральным проектированием жилого комплекса премиум-класса
                «Бадаевский» – первого столичного проекта, получившего сразу три
                награды международного конкурса World Architecture Festival –
                WAF 2019, займётся ГК Marks Group.
                <br />
                <br /> Группа компаний специализируется на комплексном
                проектировании, научных исследованиях, анализе объектов и
                территорий развития городов и мегаполисов и имеет более 200
                реализованных проектов по всей России и за рубежом. В
                партнёрстве с Capital опыт проектировщиков Marks востребован как
                в работе с уникальными высотными зданиями, так и с объектами
                культурного наследия.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.block_img}>
        <div className={styles.container}>
          <div className={styles.item}>
            <img ref={leftImg1} src={img1} alt="" />
          </div>
          <div className={styles.quote_container}>
            <div ref={blockRightQuote} className={styles.quote_block}>
              <div className={styles.quote_text}>
                Принципиальные проектные решения авторов проекта – швейцарского
                бюро Herzog & de Meuron, будут воплощены генеральным
                проектировщиком в комплексном проектировании и организации
                строительства жилого комплекса. Особенность ЖК «Бадаевский»
                заключается в том, что в проекте реализован принцип Detail
                design – детального проектирования зарубежных архитекторов,
                лауреатов Притцкеровской премии.
              </div>

              <div className={styles.quote}>
                В чертежах, по которым будет вестись строительство учитывается
                всё – от основных конструктивных решений и методик реставрации
                объектов культурного наследия, до мебели и материалов в отделке
                помещений
                <div className={styles.quote_director}>
                  Руководитель проекта в Группе компаний MARKS GROUP Виталий
                  Алёхин
                </div>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img ref={leftImg2} src={img2} alt="" />
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
            <img ref={leftImg3} src={img3} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
