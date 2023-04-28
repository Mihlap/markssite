import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CSSPlugin from 'gsap/CSSPlugin';
import './index.scss';

function Block_Header() {
  gsap.registerPlugin(ScrollTrigger, CSSPlugin);

  useEffect(() => {
    const accordions = document.querySelectorAll('.accordion');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.accordions',
        pinSpacing: true,
        start: 'top bottom-=300',
        end: 'bottom top',
        scrub: true,
        ease: 'linear',
        immediateRender: false,
      }
    });

    accordions.forEach((accordion) => {
      tl.from(accordion.querySelector('.text'), {
        height: 0,
        paddingBottom: 0,
        opacity: 0,
        onComplete: () => {
          accordion.style.height = 'auto';
        }
      });
    });

    tl.to('.accordion', {
      marginTop: 1,
      stagger: .5,
    },
      '<');

 }, []);

  return (
    <div class="wrapper">
      <div class="spacer"></div>
      <div class="accordions">
        <div class="accordion">
          <div class="title">Архитектура</div>
          <div class="text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum consequatur error natus omnis voluptatem mollitia earum nisi et voluptatibus repellendus!
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
            Join superfast 5G wireless networks when you’re on the go. Download files, play multiplayer games, stream movies, check in with friends, and more. Join superfast 5G wireless networks when you’re on the go. Download files, play multiplayer games, stream movies, check in with friends, and more.
          </div>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
  )
}

export default Block_Header