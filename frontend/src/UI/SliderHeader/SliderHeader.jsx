import React, { useState, useEffect, useMemo, useRef } from "react";
import Marquee from "react-fast-marquee";
import styles from "./SliderHeader.module.css";

const SliderHeader = () => {
  const [show, setShow] = useState(false);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
           observer.disconnect();
        }
      },
      { threshold: 0.5 } // Измените порог при необходимости
    );

    observer.observe(marqueeRef.current);
    return () => observer.disconnect();
  }, []);

  const marqueeProps = useMemo(() => ({
    gradient: true,
    speed: 80,
    direction: "left",
    spacing: 10,
    autoFill: true,
    gaps: null,
    gradientColor: "#F6F6F6",
  }), []);

  const images = [
    { src: "./assets/1.png", alt: "image1" },
    { src: "./assets/2.png", alt: "image2" },
    { src: "./assets/3.png", alt: "image3" },
    { src: "./assets/4.png", alt: "image4" },
    { src: "./assets/5.png", alt: "image5" },
    { src: "./assets/6.png", alt: "image6" },
  ];

  return (
    <div className={styles.logo}>
      <div ref={marqueeRef}>
        {show && (
          <Marquee {...marqueeProps} style={{ paddingLeft: '18.26vw', width: "calc(100% - 18.26vw) *100%" }}>
            {images.map((image, index) => (
              <div className={styles.item} key={index}>
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
};

export default SliderHeader;
