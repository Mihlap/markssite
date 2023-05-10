import React, { useEffect, useRef } from "react";
import "./Badaevsky.css";
import gsap from "gsap";

// импортируем фото
import img from "./img/img.jpg";
import img1 from "./img/img1.jpg";
import img2 from "./img/img2.jpg";
import img3 from "./img/img3.jpg";

import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function Badaevsky() {
  const titleRef = useRef(null);
  const linkRef = useRef(null);
  const descRef = useRef(null);
  const blockLeft = useRef(null);
  const blockRight = useRef(null);
  const blockRightPhone = useRef(null);
  const blockName = useRef(null);

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

    gsap.from(blockLeft.current, {
      x: "-100%",
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: blockLeft.current,
        start: "top 80%",
      },
    });
    const elements = [blockRight.current, blockRightPhone.current];

    elements.map((element) => {
      gsap.from(element, {
        x: "100%",
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
        },
      });
    });
  }, []);
  return (
    <section className="section">
      <img className="header_img" src={img} alt="" />
      <div className="container">
        <div className="header_container">
          <div className="header_img_title">
            <Link to="/project" ref={linkRef} className="header_link">
              Все статьи
            </Link>
            <h1 ref={titleRef} className="header_title">
              Marks Group – генеральный
              <br /> проектировщик ЖК «Бадаевский»
            </h1>

            <div ref={blockName} className="header_name">
              Александр Александров
            </div>
            <div ref={descRef} className="header_desc">
              ТАСС, Грозный &#8226; 7 октября 2022
            </div>
          </div>
          <div className="header_content">
            <div ref={blockRight} className="header_content_left">
              <div className="title_block">
                <h2 className="left_title">
                  В Capital Group назвали проектное бюро для нового знакового
                  объекта Москвы
                </h2>
              </div>
              <div className="title_text">
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
      <div className="block_img">
        <div className="container">
          <div className="item">
            <img src={img1} alt="" />
          </div>
          <div className="quote_container">
            <div className="quote_block">
              <div className="quote_text">
                Принципиальные проектные решения авторов проекта – швейцарского
                бюро Herzog & de Meuron, будут воплощены генеральным
                проектировщиком в комплексном проектировании и организации
                строительства жилого комплекса. Особенность ЖК «Бадаевский»
                заключается в том, что в проекте реализован принцип Detail
                design – детального проектирования зарубежных архитекторов,
                лауреатов Притцкеровской премии.
              </div>

              <div className="quote">
                В чертежах, по которым будет вестись строительство учитывается
                всё – от основных конструктивных решений и методик реставрации
                объектов культурного наследия, до мебели и материалов в отделке
                помещений
                <div className="quote_director">
                  Руководитель проекта в Группе компаний MARKS GROUP Виталий
                  Алёхин
                </div>
              </div>
            </div>
          </div>
          <div className="item">
            <img src={img2} alt="" />
          </div>
          <div сlassName="description_object_container">
            <div className="description_object_block">
              <div className="description_object_text1">
                В рамках реализации проекта премиум-класса наряду с новым
                строительством жилого комплекса, парящего над землёй на колоннах
                высотой 35 метров, запланирована реставрация двух корпусов
                памятника промышленной архитектуры XIX века. Вместе с объектами
                культурного наследия девелопер принял решение дополнительно
                восстановить утраченное строение, не имеющее охранного статуса,
                но важное для целостности архитектурного ансамбля.
              </div>
              <div className="description_object_text2">
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
          <div className="item">
            <img src={img3} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
