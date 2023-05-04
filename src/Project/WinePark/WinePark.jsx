import React, { useEffect, useRef } from "react";
import "./index.css";
import gsap from "gsap";

// импортируем фото
import img from "./img/WinePark.jpg";
import img1 from "./img/WinePark1.jpg";
import img2 from "./img/WinePark2.jpg";
import img3 from "./img/WinePark3.jpg";
import img4 from "./img/WinePark4.jpg";
import img5 from "./img/WinePark5.jpg";
import png from "./img/iconsBtn.png";
import { Link } from "react-router-dom";

export default function WinePark() {
  const titleRef = useRef(null);
  const linkRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const link = linkRef.current;
    const desc = descRef.current;

    // Скрываем заголовок, ссылку и описание перед анимацией
    gsap.set([title, link, desc], { opacity: 0 });

    // Анимируем появление заголовка, затем ссылки, затем описания
    gsap.to(title, { duration: 1, opacity: 1, delay: 0.5 });
    gsap.to(link, { duration: 1, opacity: 1, delay: 1 });
    gsap.to(desc, { duration: 1, opacity: 1, delay: 0.7 });
  }, []);
  return (
    <section>
      <img className="header_img" src={img} alt="" />
      <div className="container">
        <div className="header_container">
          <div className="header_img_title">
            <Link ref={linkRef} className="header_link" to="#">
              Все проекты
            </Link>
            <h1 ref={titleRef} className="header_title">
              Винный парк WinePark
            </h1>
            <div ref={descRef} className="header_desc">
              Республика Крым &#8226; 2021
            </div>
          </div>
          <div className="header_content">
            <div className="header_content_left">
              <h2>Новый формат путешествий</h2>
              <span>Генеральное проектирование</span>
              <p>
                Винный парк — это многофункциональное пространство для
                энотуризма с собственными виноградниками и гравитационной
                винодельней, остащённой самым современным оборудованием.
                Обширная парковая территория с различными элементами
                благоустройства включает фруктовый, розовый и кактусовые сады,
                зеркальный парящий мост, амфитеатр, водопад с гротом, малые
                архитектурные формы и концептуальные скульптуры.
              </p>

              <div>
                <div>
                  30 га
                  <div>Общая площадь</div>
                </div>
                <div>
                  7. 75 га
                  <div>Площадь виноградников</div>
                </div>
                <div>
                  54.5 м<div>Высота винной башни</div>
                </div>
              </div>
            </div>
            <div className="header_content_right">
              <div>
                <div>Расположение</div>
                <div>г. Москва, Ленинградский проспект, вл. 37</div>
              </div>
              <div>
                <div>Заказчик</div>
                <div>-</div>
              </div>
              <div>
                <div>Публикации</div>
                <div>
                  ТАСС «Первый в России винный парк откроется под Ялтой весной
                  2021 года»
                </div>
              </div>
              <div>
                <div>Степень участия</div>
                <div>Генеральный проектировщик</div>
              </div>
              <div>
                <div>Статус</div>
                <div>В эксплуатации</div>
              </div>
              <div>
                <div>Награды</div>
                <div>-</div>
              </div>
            </div>
          </div>
        </div>
        <div className="block_img"></div>
      </div>
    </section>
  );
}
