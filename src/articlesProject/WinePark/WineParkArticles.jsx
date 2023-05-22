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
  const blockDescription2 = useRef(null);
  const blockDescription3 = useRef(null);
  const blockDescription4 = useRef(null);
  const blockDescription5 = useRef(null);
  const blockName = useRef(null);
  //useRefs для анимация появления блоков слевой стороны экрана
  const leftImg1 = useRef(null);
  const leftImg2 = useRef(null);
  const leftImg3 = useRef(null);
  const leftImg4 = useRef(null);
  const leftImg5 = useRef(null);
  const leftImg6 = useRef(null);
  const leftImg7 = useRef(null);
  const leftImg8 = useRef(null);
  const leftImg9 = useRef(null);
  const leftImg10 = useRef(null);
  const leftImg11 = useRef(null);
  

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
      elementsLeft: [
        leftImg1.current,
        leftImg2.current,
        leftImg3.current,
        leftImg4.current,
        leftImg5.current,
        leftImg6.current,
        leftImg7.current,
        leftImg8.current,
        leftImg9.current,
        leftImg10.current,
        leftImg11.current,
      ],
      elementsRight: [
        blockRight.current,
        blockRightQuote.current,
        blockDescription.current,
        blockDescription2.current,
        blockDescription3.current,
        blockDescription4.current,
        blockDescription5.current,
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
              Центр винного туризма WINEPARK
            </h1>

            <div ref={blockName} className={styles.header_name}>
              Archea Associati +T+T Architects + INPI (входит в ГК MARKSGROUP)
            </div>
            <div ref={descRef} className={styles.header_desc}>
              Проект Россия, Москва &#8226; 24 Мая 2023
            </div>
          </div>
          <div className={styles.header_content}>
            <div ref={blockRight} className={styles.header_content_text}>
              <div className={styles.title_block}>
                <h2 className={styles.left_title}>
                  Archea Associati +T+T Architects + INPI (входит в ГК
                  MARKSGROUP)
                </h2>
              </div>
              <div className={styles.articles_title_text}>
                В&nbsp;последние годы все больше Российских винодельческих
                хозяйств заявляют о&nbsp;себе не&nbsp;только качественными
                и&nbsp;конкурентоспособными винами, но&nbsp;и&nbsp;самым
                современным подходом к&nbsp;продвижению энокультуры. Они строят
                винодельни, на&nbsp;которые съезжаются посмотреть со&nbsp;всей
                страны, дополняют их&nbsp;ресторанами, дегустационными залами
                и&nbsp;музеями современного искусства (см. ПР98). Однако такого
                &laquo;центра винных открытий&raquo;, который появился
                в&nbsp;Крыму,еще не&nbsp;было: с&nbsp;подземной винодельней,
                искусственным озером, смотровой площадкой на&nbsp;высоте
                45&nbsp;метров и&nbsp;парком среди виноградников и&nbsp;гор.
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
          <div
            ref={blockDescription}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                Альберто Антонини &mdash;главный энолог и&nbsp;консультант
                проекта&nbsp;&mdash; убежден, что &laquo;the lessis more&raquo;:
                в&nbsp;вине он&nbsp;прежде всего выражает особенности терруара.
                Архитекторы&nbsp;же решили трактовать этот принцип на&nbsp;весь
                проект центра виноделия, не&nbsp;забывая о&nbsp;том, как звучит
                расшифровка: &laquo;In&nbsp;order to&nbsp;doless you have
                to&nbsp;know more&raquo; (&laquo;если хочешь делать
                меньше&nbsp;&mdash; нужно знать больше&raquo;). Им&nbsp;удалось
                деликатно интегрировать винодельню в&nbsp;природный
                ландшафт&nbsp;&mdash; и&nbsp;при этом создать новейшую
                по&nbsp;технологическому оснащению концептуальную платформу,
                призванную стать меккой российского энотуризма.
              </div>
              <div className={styles.description_object_text2}>
                Согласно концепци и&nbsp;международной команды архитекторов,
                новая винодельня и&nbsp;правда будто &laquo;врастает&raquo;
                в&nbsp;землю, становится органичной частью пейзажа. Единственная
                видимая отовсюду доминанта&nbsp;&mdash; башня высотой более 50
                метров , откуда можно детальнорассмотреть всю сложность
                геометрии виноградников, окруженныхбескрайним морем с&nbsp;одной
                стороныи живописными горами с&nbsp;другой. На&nbsp;8,
                9&nbsp;и&nbsp;12-м этажах башни размещены дегустационные
                комнаты.
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img className={styles.item_img} ref={leftImg2} src={img2} alt="" />
          </div>
          <div
            ref={blockDescription2}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                Башня утопает в&nbsp;круглом озере диаметром 80&nbsp;м. Вдоль
                него можно спокойно гулять: с&nbsp;двух сторон от&nbsp;него
                располагаются застекленное здания винотеки и&nbsp;ресторана.
                Их&nbsp;венчает кровля весом 1700 тонн&nbsp;&mdash; на&nbsp;нее
                тоже можно подняться: это самостоятельная площадка для
                мероприятий и&nbsp;отдыха на&nbsp;высоте 6&nbsp;метров
                от&nbsp;земли. А&nbsp;затем&nbsp;&mdash; пройтись по&nbsp;озеру,
                ступая по&nbsp;&laquo;броду&raquo; из&nbsp;камней,
                и&nbsp;заглянуть в&nbsp;необычный квадратный &laquo;вырез&raquo;
                в&nbsp;водной глади.
              </div>
              <div className={styles.description_object_text2}>
                &laquo;Вырез&raquo;&nbsp;&mdash; верхняя граница подвесного
                куба-агоры: большеформатные зеркальные панели образуют
                просторную площадь 20&times;20&nbsp;метров. Это одно
                из&nbsp;самых сложных технических решений винодельни. Вес куба,
                несмотря на&nbsp;внешнюю легкость, насчитывает более
                150&nbsp;тонн, причем он&nbsp;буквально парит в&nbsp;воздухе,
                что стало возможным только благодаря сложной системе перекрытий,
                грамотно распределяющих столь внушительную нагрузку.
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_padding}`}
              ref={leftImg3}
              src={img3}
              alt=""
            />
          </div>
          <div className={styles.item}>
            <img className={styles.item_img} ref={leftImg4} src={img4} alt="" />
          </div>
          <div
            ref={blockDescription3}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                По&nbsp;периметру зеркального куба, прямо под озером, сделана
                рампа&nbsp;&mdash; и&nbsp;ее&nbsp;бетонные стены цвета графита
                впечатляют по-своему: высотой 23&nbsp;метра, они испещрены
                надписями с&nbsp;названиями сортов винограда. Изучение названий,
                зеркала и&nbsp;медитативная музыка делают прогулку по&nbsp;рампе
                особенно запоминающейся.
              </div>
              <div className={styles.description_object_text2}>
                Сама винодельня спроектирована как производство гравитационного
                типа, то&nbsp;есть все перемещения происходят свободно, сверху
                вниз, с&nbsp;применением только силы тяжести. Поэтому
                у&nbsp;производства 4&nbsp;уровня, три из&nbsp;которых уводят
                под землю на&nbsp;глубину 25&nbsp;метров.
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_padding}`}
              ref={leftImg5}
              src={img5}
              alt=""
            />
          </div>
          <div className={styles.item}>
            <img className={styles.item_img} ref={leftImg6} src={img6} alt="" />
          </div>

          <div
            ref={blockDescription4}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                В&nbsp;зале приема винограда &mdash;панорамное остекление:
                благодаря ему каждый может стать свидетелем первичных процессов
                виноделия. Современное оборудование помогает грамотно
                и&nbsp;бережно проводить начальные этапы переработки ягод
                &mdash; в&nbsp;дальнейшем именно они становятся основой для
                качественных вин. Зал, в&nbsp;котором происходит ферментация,
                в&nbsp;первую очередь поражает видом 24&nbsp;парящих стальных
                емкостей&nbsp;&mdash; каждая объемом 4100литров. Эта кажущаяся
                невесомость и&nbsp;легкость тоже стала возможной исключительно
                при помощи сложных инженерных решений и&nbsp;из-за уникальной
                конструкции потолка.
              </div>
              <div className={styles.description_object_text2}>
                Впрочем, у&nbsp;бетонных емкостей в&nbsp;качестве ферментаторов
                тоже большой потенциал. Являясь естественными изоляторами, они
                обеспечивают вину плавное и&nbsp;постепенное брожение.
                В&nbsp;арсенале WINEPARK таких емкостей 6&nbsp;объемом
                3700&nbsp;л и&nbsp;8&nbsp;&mdash; объемом 2300&nbsp;л .
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_padding}`}
              ref={leftImg7}
              src={img7}
              alt=""
            />
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_padding}`}
              ref={leftImg8}
              src={img8}
              alt=""
            />
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_padding}`}
              ref={leftImg9}
              src={img9}
              alt=""
            />
          </div>
          <div className={styles.item}>
            <img
              className={styles.item_img}
              ref={leftImg10}
              src={img10}
              alt=""
            />
          </div>
          <div
            ref={blockDescription5}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                Еще одно вдохновляющее пространство построено по&nbsp;образу
                и&nbsp;подобию античных храмов. Оно таки называется&nbsp;&mdash;
                храм вина. Здесь происходит магия становления вина, его
                созревание в&nbsp;дубовых бочках (15, 18). В&nbsp;WINEPARK вино
                выдерживается в&nbsp;&laquo;барриках&raquo; объемом 225&nbsp;л
                из&nbsp;французского и&nbsp;славонского дуба.
              </div>
              <div className={styles.description_object_text2}>
                Если&nbsp;же вернуться к&nbsp;материалам, из&nbsp;которых
                построен непосредственно центр виноделия, то&nbsp;это
                по&nbsp;крайней мере 3512 тонн металла и&nbsp;33135 кубометров
                архитектурного бетона (6, 13&ndash;14, 19). Кстати, оказалось,
                что в&nbsp;таком бетоне можно прокладывать даже сложные
                инженерные системы&nbsp;&mdash; и&nbsp;это лишь одно
                из&nbsp;уникальных технических решений, найденных
                в&nbsp;процессе реализации проекта. Зато теперь винодельня может
                разливать (7, 10)150 тысяч бутылок терруарного вина ежегодно
                и&nbsp;популяризировать не&nbsp;только принципы естественности,
                экологичности и&nbsp;минимального вмешательства в&nbsp;природу,
                но&nbsp;и&nbsp;новое российское вино (17, 20).
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img
              className={`${styles.item_img} ${styles.item_img_latest}`}
              ref={leftImg11}
              src={img11}
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
