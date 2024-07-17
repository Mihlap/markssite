import React, { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";
import styles from './SliderHeader.module.css';

const imageFileNames = [
  "logo1.png",
  "logo2.png",
  "logo3.png",
  "logo4.png",
  "logo5.png",
  "logo6.png",
  "logo7.png",
  // "logo8.png",
  "logo9.png",
  "logo10.png",
  "logo11.png",
  "logo12.png",
  // "logo13.png",
  "logo14.png",
  "logo15.png",
  "logo16.png",
  "logo17.png",
  "logo18.png",
  "logo19.png",
  "logo20.png",
  "logo21.png",
  "logo22.png",
  "logo23.png",
  "logo24.png",
  "logo25.png",
  "logo26.png",
  "logo27.png",
  "logo28.png",
  "logo29.png",
  "logo30.png",
  "logo31.png",
  "logo32.png",
  "logo33.png",
  "logo34.png",
  "logo35.png",
  "logo36.png",
  "logo37.png",
  "logo38.png",
  "logo39.png",
  "logo40.png",
  "logo41.png",
  "logo42.png",
  "logo43.png",
  "logo44.png",
];

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
          {imageFileNames.map((fileName, index) => (
            <div key={index} className={styles.item_mobile}>
              <img src={`./assets/logo/${fileName}`} alt={`logo${index + 1}`} className={styles.item_mobile_img}/>
            </div>
          ))}
        </Marquee>
      )}
    </div>
    )
}

export default SliderMobile;