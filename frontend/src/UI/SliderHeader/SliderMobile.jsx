import React, { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";
import styles from './SliderHeader.module.css';

const SliderMobile = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
    return (
    <div className={styles.icon_partner_phone}>
    {show && (
    <Marquee
    gradient={true}
    speed={70}
    direction="left"
    spacing={10}
    autoFill={true}
    gaps={null}
    gradientColor={"#F6F6F6"}
    delayBetweenLoops={2000}
      >
        <div className={styles.item_mobile}>
          <img src="./assets/D1.png" alt="logo1" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D2.png" alt="logo2" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D3.png" alt="logo3" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D4.png" alt="logo4" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D5.png" alt="logo5" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D6.png" alt="logo6" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D7.png" alt="logo7" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D8.png" alt="logo8" />
          </div>
          <div className={styles.item_mobile}>
          <img src="./assets/D9.png" alt="logo9" />
          </div>
        </Marquee>
        )}
        </div>
    )
}

export default SliderMobile;