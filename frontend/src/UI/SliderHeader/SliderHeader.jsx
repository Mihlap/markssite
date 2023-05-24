import React, { useState, useEffect, useMemo } from "react";
import Marquee from "react-fast-marquee";
import styles from "./SliderHeader.module.css";

const SliderHeader = () => {
  const [show, setShow] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 300);
    return () => clearTimeout(timer);
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

  return (
    <div className={styles.logo}>
      {show && (
        <Marquee {...marqueeProps}>
          <div className={styles.item}>
            <img src="./assets/1.png" alt="image1" />
          </div>
          <div className={styles.item}>
            <img src="./assets/2.png" alt="image2" />
          </div>
          <div className={styles.item}>
            <img src="./assets/3.png" alt="image3" />
          </div>
          <div className={styles.item}>
            <img src="./assets/4.png" alt="image4" />
          </div>
          <div className={styles.item}>
            <img src="./assets/5.png" alt="image5" />
          </div>
          <div className={styles.item}>
            <img src="./assets/6.png" alt="image6" />
          </div>
        </Marquee>
      )}
    </div>
  );
};

export default SliderHeader;

