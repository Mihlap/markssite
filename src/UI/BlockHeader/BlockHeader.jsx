import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';
import './index.scss';

import cub from "../../icons/cub.svg";

function BlockHeader() {
  gsap.registerPlugin(ScrollTrigger, CSSPlugin);
  const accordionsRef = useRef(null);
      
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach((accordion) => {
      const title = accordion.querySelector('.title');
      const text = accordion.querySelector('.text');

      

      if (text.classList.contains('closed')) {
        gsap.set(text, {
          maxHeight: 0,
          overflow: 'hidden',
        });
      } else {
        gsap.set(text, {
          maxHeight: text.scrollHeight,
          overflow: 'hidden',
        });
      }

     ScrollTrigger.create({
        trigger: text,
        start: 'bottom bottom-=200vh',
        end: 'top bottom+=5%',
        onEnter: () => {
          gsap.to(text, {
            maxHeight: text.scrollHeight,
            duration: 1,
          });
        },
        onLeaveBack: () => {
          gsap.to(text, {
            maxHeight: 0,
            duration: 1,
          });
        },
      });

      ScrollTrigger.create({
        trigger: accordion,
        start: 'top bottom',
        end: 'bottom bottom',
        onEnter: () => {
          if (!accordion.classList.contains('open')) {
            gsap.to(text, {
              maxHeight: 0,
              duration: 1,
            });
          }
        },
      });

      title.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('open');

        if (isOpen) {
          gsap.to(text, {
            maxHeight: 0,
            duration: 1,
          });
        } else {
          gsap.to(text, {
            maxHeight: text.scrollHeight,
            duration: 1,
          });
        }

        accordion.classList.toggle('open');
      });
    });

  }, []);
  

  return (
    <div className="wrapper">
      <div className="spacer"></div>
      <div ref={accordionsRef} className="accordions">
        <div className="accordion">
          <div className="title">Архитектура</div>
          <div className="text">
            <div className="wraper_block_text">
              <img
                src={cub}
                alt="logo"
                style={{ position: "absolute", zIndex: 0, left: "600px" }}
              />
              Архитектура и концепции
              <span>
                Разработка концепции, архитектурное проектирование -
                <br />
                от идеи до ввода объекта в эксплуатацию
              </span>
              Адаптация зарубежных концепций
              <span>
                Подготовка проектной и рабочей документации на базе
                <br />
                архитектурного/инжинерного решения
              </span>
              Дизайн-проекты
              <span>
                Для жилых и общественных помещений. Авторский надзор,
                <br /> ЗD-моделирование, VR-визуализация
              </span>
              Проектная и рабочая документация
              <span>
                Прохождение экспертизы, авторский надзор, сопровождение
                <br />
                строительства
              </span>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Конструктив</div>
          <div className="text">
            <div className="text_span">
              {/* <img src={cub} alt="logo" /> */}
              Инженерное проектирование
              <span>
                Разработка внутренних и наружных инженерных коммуникаций
              </span>
              Подземные транспортные сооружения
              <span>
                Проекты освоения подземного пространства для уникальных
                <br />
                особо сложных объектов строительства
              </span>
              Управление линейными объектами
              <span>Проектирование транспортных объектов и инфраструктуры</span>
              Конструктивные решения
              <span>
                Разработка полного комплекса документации на всех стадиях
                <br />
                жизненного цикла проекта
              </span>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Наука</div>
          <div className="text">
            <div className="text_span">
              {/* <img src={cub} alt="logo"/> */}
              Научно-техническое сопровождение
              <span>
                Расчетное сопровождение проектирования и строительства
                <br />
                любой сложности
              </span>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Digital</div>
          <div className="text">
            <div className="text_span">
              {/* <img src={cub} alt="logo" /> */}
              BIM моделирование
              <span>
                Проекты освоения подземного пространства для уникальных
                <br />
                особо сложных объектов строительства
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
}

export default BlockHeader;






 
    
    




