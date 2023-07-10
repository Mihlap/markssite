import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';
import './index.scss';


const BlockHeader = React.memo(() => {
  const accordionsRef = useRef(null);
  
  gsap.registerPlugin(ScrollTrigger, CSSPlugin);

  useEffect(() => {
    const accordions = document.querySelectorAll('.accordion');
    let currentIndex = -1;
  
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
        start: 'bottom bottom-=15%',
        end: 'top bottom+=10%',
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
  }, []);
  
 return (
    <div className="wrapper">
      <div className="spacer"></div>
      <div className="accordions" ref={accordionsRef}>
        <div className="accordion">
          <div className="title">Архитектура</div>
              {/* <img className="cub_img" src={cub} alt="logo"/> */}
          <div className="text">
            <div className="text_span">
               Архитектура и концепции
              <span>
                Разработка концепции, архитектурное проектирование - от идеи до ввода объекта в эксплуатацию
              </span>
                Адаптация зарубежных концепций
              <span>
                Подготовка проектной и рабочей документации на базе архитектурного/инжинерного решения
              </span>
              Дизайн-проекты
              <span>
                Для жилых и общественных помещений. Авторский надзор, ЗD - моделирование, VR - визуализация
              </span>
              Проектная и рабочая документация
              <span>
                Прохождение экспертизы, авторский надзор, сопровождение строительства
              </span>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Конструктив</div>
          <div className="text">
              <div className="text_span">
              Инженерное проектирование
              <span>
                Разработка внутренних и наружных инженерных коммуникаций
              </span>
              Подземные транспортные сооружения
              <span>
                Проекты освоения подземного пространства для уникальных особо сложных объектов строительства
              </span>
              Управление линейными объектами
              <span>Проектирование транспортных объектов и инфраструктуры</span>
              Конструктивные решения
              <span>
                Разработка полного комплекса документации на всех стадиях жизненного цикла проекта
              </span>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Наука</div>
          <div className="text">
            <div className="text_span">
              Научно-техническое сопровождение
              <span>
                Расчетное сопровождение проектирования и строительства любой сложности
              </span>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="title">Digital</div>
          <div className="text">
            <div className="text_span">
              BIM моделирование
              <span>
                Разработка программного обеспечения, инфраструктуры и методик в цифровой среде
                для инженерного проектирования, девелопмента и строительства
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
});

export default BlockHeader;





 
    
    




