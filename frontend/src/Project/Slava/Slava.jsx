import React, { useEffect, useRef } from "react";
import styles from "../Project.module.css";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import AllProjectsButton from "../../UI/ButtonsProjects/AllProjectsButton";
// import PreviousNextButton from "../../UI/ButtonsProjects/PreviousNextButton";

// импортируем фото
import img from "./img/Slava.jpg";
import img1 from "./img/Slava2.jpg";
import img2 from "./img/Slava3.jpg";
import img3 from "./img/Slava4.jpg";
import next from "../../icons/next.svg";
import previous from "../../icons/previous.svg";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
export default function Slava() {
 const refs = {
   title: useRef(null),
   link: useRef(null),
   desc: useRef(null),
   blockLeft: useRef(null),
   blockRight: useRef(null),
   blockDescription: useRef(null),
   blockRightPhone: useRef(null),
   leftImg1: useRef(null),
   leftImg2: useRef(null),
   leftImg3: useRef(null),
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

   const {
     blockLeft,
     blockRight,
     blockDescription,
     blockRightPhone,
     leftImg1,
     leftImg2,
     leftImg3,
   } = refs;

   const elementsRight = [
     blockRightPhone.current,
     blockDescription.current,
     blockLeft.current,
     blockRight.current,
     leftImg1.current,
     leftImg2.current,
     leftImg3.current,
    
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
        },
     });
     gsap.from(element, { duration: 1, clipPath: { start: "110%" } })
   };

   elementsRight.forEach(animateElement);
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
  return (
    <section className={styles.section}>
      <img className={styles.header_img} src={img} alt="" />
      <div className={styles.container}>
        <div className={styles.header_container}>
          <div className={styles.header_img_title}>
            <AllProjectsButton />
            <h1 ref={refs.title} className={styles.header_title}>
              МФК Комплекс апартаментов «Slava»
            </h1>
            <div ref={refs.desc} className={styles.header_desc}>
              Россия, Москва, р-н Беговой &#8226; 2020
            </div>
          </div>
          <div className={styles.header_content}>
            <div
              ref={refs.blockLeft}
              className={`${styles.header_content_left} ${styles.header_content_left_custom}`}
            >
              <div className={styles.title_block}>
                <h2 className={styles.left_title}>МФК на сложном рельефе</h2>
                <div className={styles.left_meta}>
                  Генеральное проектирование
                </div>
              </div>
              <div className={styles.title_text}>
                Участок многофункционального комплекса расположен в САО г.
                Москвы в районе «Беговой», на территории Второго часового завода
                «Слава». Рельеф со стороны 1-ой улицы Ямского поля – спокойный,
                идущий на повышение в сторону существующей застройки, перепад
                рельефа составляет около 3,5 м.
              </div>

              <div className={styles.result_container}>
                <div className={styles.result_block}>
                  <div className={styles.result_number}>1,218 га</div>
                  <div className={styles.result_text}>Общая площадь</div>
                </div>
                <div className={styles.result_block}>
                  <div className={styles.result_number}>4394,7 м²</div>
                  <div className={styles.result_text}>Площадь застройки</div>
                </div>
                <div className={styles.result_block}>
                  <div className={styles.result_number}>8 — 17</div>
                  <div className={styles.result_text}>Этажность</div>
                </div>
              </div>
            </div>
            <div ref={refs.blockRight} className={styles.header_content_right}>
              <div className={styles.local_container}>
                <div className={styles.local_ritgh}>
                  <div>
                    <div className={styles.local_title}>Расположение</div>
                    <div className={styles.local_text}>
                      Москва, Ленинградский пр-т 8
                    </div>
                  </div>

                  <div>
                    <div className={styles.local_title}>Заказчик</div>
                    <div className={styles.local_text}>MR Group</div>
                  </div>
                  <div>
                    <div className={styles.local_title}>Публикации</div>
                    <Link
                      to="https://realty.rbc.ru/news/6380ab7d9a79474428aef71a"
                      target="_blank"
                    >
                      <div className={styles.local_text}>
                        РБК Недвижимость &quot;Каким будет квартал SLAVA:
                        апартаменты с&nbsp;видом на&nbsp;Москву
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
                    <div className={styles.local_text}>Строительство</div>
                  </div>
                  <div>
                    <div className={styles.local_title}>Награды</div>
                    <div className={styles.local_text}>&mdash;</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={refs.blockRightPhone}
              className={styles.result_container_phone}
            >
              <div className={styles.result_block}>
                <div className={styles.result_number}>1,218 га</div>
                <div className={styles.result_text}>Общая площадь</div>
              </div>
              <div
                className={`${styles.result_block} ${styles.result_number_block}`}
              >
                <div className={styles.result_number}>4394,7 м²</div>
                <div className={styles.result_text}>Площадь застройки</div>
              </div>
              <div className={styles.result_block}>
                <div className={styles.result_number}>8 — 17</div>
                <div className={styles.result_text}>Этажность</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.blockImg}>
        <div className={styles.container}>
          <div className={styles.item}>
            <img
              ref={refs.leftImg1}
              className={styles.item_img}
              src={img1}
              alt=""
            />
          </div>
          <div
            ref={refs.blockDescription}
            className={styles.description_object_container}
          >
            <div className={styles.description_object_block}>
              <div className={styles.description_object_text1}>
                Назначение – многофункциональный комплекс, содержащий
                апартаменты, магазины, кафе, офисы, предприятия бытового
                обслуживания населения, подземный паркинг. МФК состоит из 6
                секций апартаментов: 4 секции сблокированные и имеют сложную
                П-образную форму и переменную этажность 8-10-8-15 этажей, 2
                отдельно стоящие секции высотой 16 и 17 этажей с подземной
                автостоянкой.
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <img
              ref={refs.leftImg2}
              className={styles.item_img}
              src={img2}
              alt=""
            />
          </div>
          <div className={styles.item}>
            <img
              ref={refs.leftImg3}
              className={`${styles.item_img} ${styles.item_img_latest}`}
              src={img3}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.button_project}>
          <Link className={styles.button_project_link} to="/hotel-appart">
            <div
              className={`${styles.previous_svg} ${styles.button_project_button}`}
            >
              <img src={previous} alt="" />
              <span className={styles.previous_span}>Предыдущий проект</span>
            </div>
          </Link>
          <Link className={styles.button_project_link} to="/winepark">
            <div
              className={`${styles.next_svg} ${styles.button_project_button}`}
            >
              <span className={styles.next_span}>Следующий проект</span>
              <img src={next} alt="" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
