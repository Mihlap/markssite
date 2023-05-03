import React, { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ScrollSmoother } from 'gsap/ScrollSmoother';
import CSSPlugin from 'gsap/CSSPlugin';
import './index.scss';

function BlockHeader() {
  gsap.registerPlugin(ScrollTrigger, CSSPlugin);

  useLayoutEffect(() => {
    const accordions = document.querySelectorAll('.accordion');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.accordions',
        pinSpacing: true,
        start: 'bottom bottom-=100',
        end: 'bottom bottom',
        scrub: false,
        ease: 'linear',
        immediateRender: false,
        smoothScroll: true,
        onLeaveBack: () => tl.reverse(
          {
            duration: 1.5
          },
        ),
      }
    });

    accordions.forEach((accordion) => {
      tl.from(accordion.querySelector('.text'), {
        height: 0,
        paddingBottom: 0,
        opacity: 0,
        onComplete: () => {
        accordion.style.height = 'auto';
        },
        duration: 1,
       });
    });

    tl.to('.accordion', {
      marginTop: 1,
      stagger: 0.5,
     },
      '<');
 }, []);

  return (
    <div class="wrapper">
      <div class="spacer"></div>
      <div class="accordions">
        <div class="accordion part1">
          <div class="title">Архитектура</div>
          <div class="text">
           Архитектура и концепции
           <span>Разработка концепции, архитектурное проектирование -
            <br/>от идеи до ввода объекта в эксплуатацию</span>
           Адаптация зарубежных концепций
           <span>Подготовка проектной и рабочей документации на базе
            <br/>архитектурного/инжинерного решения</span>
           Дизайн-проекты
           <span>Для жилых и общественных помещений. Авторский надзор,
            <br/> ЗD-моделирование, VR-визуализация</span>
           Проектная и рабочая документация
           <span>Прохождение экспертизы, авторский надзор, сопровождение
            <br/>строительства</span>
          </div>
        </div>
        <div class="accordion part2">
          <div class="title">Конструктив</div>
          <div class="text">
            Инженерное проектирование
            <span>Разработка внутренних и наружных инженерных коммуникаций</span>
            Подземные транспортные сооружения
            <span>Проекты освоения подземного пространства для уникальных
              <br/>особо сложных объектов строительства</span>
              Управление линейными объектами
              <span>Проектирование транспортных объектов и инфраструктуры</span>
              Конструктивные решения
              <span>Разработка полного комплекса документации на всех стадиях
                <br/>жизненного цикла проекта</span>
           </div>
        </div>
        <div class="accordion part3">
          <div class="title">Наука</div>
          <div class="text">
          Научно-техническое сопровождение
          <span>Расчетное сопровождение проектирования и строительства
            <br/>любой сложности
          </span>
          </div>
        </div>
        <div class="accordion part4">
          <div class="title">Digital</div>
          <div class="text">
            BIM моделирование
            <span>Проекты освоения подземного пространства для уникальных
              <br/>особо сложных объектов строительства</span>
          </div>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
  )
}

export default BlockHeader