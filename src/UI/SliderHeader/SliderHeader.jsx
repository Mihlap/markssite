import React from 'react';
import Marquee from "react-fast-marquee";
import styles from './SliderHeader.module.css';

const SliderHeader = () => {
  return (
        <div className={styles.logo}>
       <Marquee
       gradient={true}
        speed={80}
        direction="left"
         spacing={10}
         autoFill={true}
         gaps={null} 
         gradientColor={'#F6F6F6'}
         delayBetweenLoops={2000}
        >
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
     </div>
  )
}

export default SliderHeader

