import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IconPlus from '.././icons/plus.svg';
import show from '.././icons/show.svg';
import styles from './Header.module.css';
import './index.scss';
import CSSPlugin from 'gsap/CSSPlugin';

const settings = {
  dots: false,
  infinite: true,
  speed: 20000,
  slidesToShow: 5,
  slidesToScroll: 6,
  autoplay: true,
  autoplaySpeed: 1,
  cssEase: "linear",
  vertical: false,
  verticalSwiping: true,
  swipeToSlide: true,
  touchThreshold: 1,
  arrows: false,
  variableWidth: true,
};
const Header = () => {
  const [isFixed, setIsFixed] = useState(false);

  gsap.registerPlugin(ScrollTrigger, CSSPlugin);
 
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.accordions',
        pin: true,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
        ease: 'linear',
      }
    })
    
    tl.to('.accordion .text', {
      height: 0,
      paddingBottom: 0,
      opacity: 0,
      stagger: .5,
    })
    tl.to('.accordion', {
      marginBottom: 1,
      stagger: .5,
    }, '<')
  }, []);

  useEffect(() => {
    function handleScroll() {
      const logo = document.querySelector('.logo_fixed');
      const header = document.querySelector('logo_slider');
      const headerHeight = header ? header.offsetHeight : 0;
      const logoPosition = logo ? logo.getBoundingClientRect().top : 0;

      if (logoPosition <= headerHeight) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }

      const accordions = document.querySelectorAll('.accordion');

      accordions.forEach((accordion) => {
       const rect = accordion.getBoundingClientRect();
       if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
         gsap.to(accordion.querySelector('.title'), {
           opacity: 1,
           duration: 0.5,
         });
         gsap.to(accordion.querySelector('.text'), {
           opacity: 1,
           duration: 0.5,
           delay: 0.5,
         });
       } else {
         gsap.to(accordion.querySelector('.title'), {
           opacity: 0,
           duration: 0.5,
         });
         gsap.to(accordion.querySelector('.text'), {
           opacity: 0,
           duration: 0.5,
         });
       }
     });
    }

    window.addEventListener('scroll', handleScroll);
      
    return () => {
      window.removeEventListener('scroll', handleScroll);
      };
  }, []);

return (
<div className={styles.main}>
<div className={styles.header}>
<div className={styles.menu}>
  <img className={styles.image} src="./image.png" alt="изображение"/>
</div>
<Navbar/>
 <div className={styles.str}>
  Награды проектов
</div>
<div className={styles.str1}>Наша компания участвует в многочисленных выставках, конференциях и конкурсах. Предлагаем ознакомиться с некоторыми докладами</div>
<div className={styles.logo}>
  <Slider className={isFixed ? `${styles.logo_fixed}` : `${styles.logo_slider}`} {...settings} centerPadding='5px'>
  <div className={styles.item}><img src="./assets/1.png" alt="image1"/></div>
  <div className={styles.item}><img src="./assets/2.png" alt="image2"/></div>
  <div className={styles.item}><img src="./assets/3.png" alt="image3"/></div>
  <div className={styles.item}><img src="./assets/4.png" alt="image4"/></div>
  <div className={styles.item}><img src="./assets/5.png" alt="image5"/></div>
  <div className={styles.item}><img src="./assets/6.png" alt="image6"/></div>
  {/*добавлено для слайдера*/}
  <div className={styles.item}><img src="./assets/1.png" alt="image1"/></div> 
  <div className={styles.item}><img src="./assets/2.png" alt="image2"/></div>
  <div className={styles.item}><img src="./assets/3.png" alt="image3"/></div>
  <div className={styles.item}><img src="./assets/4.png" alt="image4"/></div>
  <div className={styles.item}><img src="./assets/5.png" alt="image5"/></div>
  <div className={styles.item}><img src="./assets/6.png" alt="image6"/></div>
  </Slider>
</div>
<div className={styles.most}>
<img className={styles.image_most} src="./assets/most.png" alt="most"/>
</div>
<button className={styles.show_svg}>
<img src={show} alt="show"/>
</button>
<div className={styles.card_container}>
<div className={styles.card_item_1}>
<div className={styles.card_img}>
<img className={styles.img_1} src="./assets/B.png" alt="image1"/>
</div>
<div className={styles.card_text}>
<h3>Смотр-конкурс Стекло в архитектуре 2022</h3>
<span>Номинация Объект • нового строительства</span>
</div>
<button className={styles.card_button}>
<img src={IconPlus} alt="button" />
</button>
</div>
<div className={styles.card_item_2}>
<div className={styles.card_img}>
<img className={styles.img_2} src="./assets/B1.png" alt="image2" />
</div>
<div className={styles.card_text}>
<h3>Смотр-конкурс Стекло в архитектуре 2022</h3>
<span>Номинация Объект • нового строительства</span>
</div>
 <button className={styles.card_button}>
 <img src={IconPlus} alt="button" />
</button>
</div>
</div>
<div className={styles.names_contents}>
<div className={styles.name_11}>+11</div>
<div className={styles.name_competencies}>Компетенции</div>
</div>
<div>
<div class="spacer"></div>
      <div class="accordions">
        <div class="accordion">
        <div class="title">Архитектура</div>
    <div class="text">
        Lets you immerse yourself in whatever you’re reading, watching, or creating. The 10.9-inch Liquid Retina display features advanced technologies like True Tone, P3 wide color, and an antireflective coating.1
        </div>
        </div>
        <div class="accordion">
        <div class="title">Конструктив</div>
        <div class="text">
        The breakthrough M1 chip is now in Air. An 8-core CPU delivers up to 60 percent faster performance than the previous generation, making Air a creative and mobile gaming powerhouse. Multitask smoothly between powerful apps and play graphics-intensive games. And with M1, you can go even further with your creativity with apps like SketchUp.
        </div>
        </div>
        <div class="accordion">
        <div class="title">Наука</div>
        <div class="text">
        The 12MP Ultra Wide front camera enables Center Stage, making video calls more natural and content creation more fun. As you move around, the camera automatically pans to keep you centered in the shot. When others join or leave the frame, the view expands or zooms in.
        </div>
        </div>
        <div class="accordion">
        <div class="title">Digital</div>
        <div class="text">
          Join superfast 5G wireless networks when you’re on the go. Download files, play multiplayer games, stream movies, check in with friends, and more.
        </div>
        </div>
        </div>
        <div class="spacer"></div>
       </div>
<div>
<Footer/>
</div>
</div>
</div>
)
}

export default Header;



