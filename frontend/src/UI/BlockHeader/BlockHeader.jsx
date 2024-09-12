import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';
import './BlockHeader.scss';

import mySvg from '../../Header/img/slider_block_header_icon.svg';
import { Link } from 'react-router-dom';

const BlockHeader = () => {
  const accordionsRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger, CSSPlugin);

  useEffect(() => {
    const isMobileScreen = window.innerWidth < 700;
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((accordion) => {
      accordion.classList.remove('open');
    });
    let currentIndex = -1;

    if (isMobileScreen) {
      accordions.forEach((accordion, index) => {
        const text = accordion.querySelector('.text');
        text.classList.add('closed');

        gsap.set(text, {
          maxHeight: 0,
          overflow: 'hidden',
          delay: 1,
        });

        ScrollTrigger.create({
          trigger: text,
          start: 'bottom bottom-=5%',
          end: 'top bottom+=5%',
          onUpdate: (self) => {
            if (self.direction === 1 && index > currentIndex) {
              gsap.to(text, {
                maxHeight: text.scrollHeight,
                duration: 0.3,
                pin: true,
              });
              accordion.classList.add('open');
              currentIndex = index;
            }
          },
          onLeaveBack: () => {
            gsap.to(text, {
              maxHeight: 0,
              duration: 0.2,
            });
            accordion.classList.remove('open');
            currentIndex = index - 1;
          },
        });
      });
    } else {
      accordions.forEach((accordion, index) => {
        const text = accordion.querySelector('.text');
        text.classList.add('closed');

        gsap.set(text, {
          maxHeight: 0,
          overflow: 'hidden',
          delay: 1,
        });

        ScrollTrigger.create({
          trigger: text,
          start: 'bottom bottom-=20%',
          end: 'top bottom+=15%',
          onUpdate: (self) => {
            // const scrollDistance = self.start - self.scroll();
            const scrollDelta = self.getVelocity() * 100;
            const shouldOpen = scrollDelta > 50;

            if (shouldOpen && index > currentIndex) {
              gsap.to(text, {
                maxHeight: text.scrollHeight,
                duration: 0.3,
              });
            } else if (!shouldOpen && index === currentIndex) {
              gsap.to(text, {
                maxHeight: 0,
                duration: 0.2,
              });
              accordion.classList.remove('open');
              currentIndex = index - 1;
            }
          },
          onLeaveBack: () => {
            gsap.to(text, {
              maxHeight: 0,
              duration: 0.1,
            });
            accordion.classList.remove('open');
            currentIndex = index - 1;
          },
        });
      });
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="spacer"></div>
      <div className="accordions" ref={accordionsRef}>
        <div className="accordion">
          <div className="title">Архитектура</div>
          {/* <img className="cub_img" src={cub} alt="logo"/> */}
          <div className="text">
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Концепция`}>
              <span className="text_title_span">Архитектура и&nbsp;концепции</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Разработка концепции, архитектурное проектирование -&nbsp;от&nbsp;идеи до&nbsp;ввода объекта
                  в&nbsp;эксплуатацию
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Адаптация концепций`}>
              <span className="text_title_span">Адаптация зарубежных концепций</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Подготовка проектной и&nbsp;рабочей документации на&nbsp;базе архитектурного/инженерного решения
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Дизайн-проекты`}>
              <span className="text_title_span">Дизайн-проекты</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Для жилых и&nbsp;общественных помещений. Авторский надзор, ЗD&nbsp;-&nbsp;моделирование,
                  VR&nbsp;-&nbsp;визуализация
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Документация РП П`}>
              <span className="text_title_span">Проектная и&nbsp;рабочая документация</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Прохождение экспертизы, авторский надзор, сопровождение строительства
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Конструктив</div>
          <div className="text">
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Инженерия`}>
              <span className="text_title_span">Инженерное проектирование</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Разработка внутренних и&nbsp;наружных инженерных коммуникаций
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Подземные сооружения`}>
              <span className="text_title_span">Подземные транспортные сооружения</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Проекты освоения подземного пространства для&nbsp;уникальных особо сложных объектов строительства
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Линейные объекты`}>
              <span className="text_title_span">Управление линейными объектами</span>
              <div className="text_span">
                <span className="header_slider_span">Проектирование транспортных объектов и&nbsp;инфраструктуры</span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Конструктив`}>
              <span className="text_title_span">Конструктивные решения</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Разработка полного комплекса документации на&nbsp;всех стадиях жизненного цикла проекта
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Наука</div>
          <div className="text">
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=Научно-техническое сопровождение`}>
              <span className="text_title_span">Научно-техническое сопровождение</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Расчетное сопровождение проектирования и&nbsp;строительства любой сложности
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Digital</div>
          <div className="text">
            <Link className="text_wrapper_accordion" to={`/project?viewConstruction=BIM`}>
              <span className="text_title_span">BIM моделирование</span>
              <div className="text_span">
                <span className="header_slider_span">
                  Разработка программного обеспечения, инфраструктуры и&nbsp;методик в&nbsp;цифровой среде
                  для&nbsp;инженерного проектирования, девелопмента и строительства
                </span>
                <div className="icon_slider_svg">
                  <img src={mySvg} alt="My SVG" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
};

export default BlockHeader;
