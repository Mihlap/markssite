import React, { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";
import styles from './SliderHeader.module.css';

import D1 from "../../icons/D1.svg";
import D2 from "../../icons/D2.svg";
import D3 from "../../icons/D3.svg";
import D4 from "../../icons/D4.svg";
import D5 from "../../icons/D5.svg";
import D6 from "../../icons/D6.svg";
import D7 from "../../icons/D7.svg";
import D8 from "../../icons/D8.svg";
import D9 from "../../icons/D9.svg";

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
          <img src={D1} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D2} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D3} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D4} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D5} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D6} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D7} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D8} alt="logo" />
          </div>
          <div className={styles.item_mobile}>
          <img src={D9} alt="logo" />
          </div>
        </Marquee>
        )}
        </div>
    )
}

export default SliderMobile;