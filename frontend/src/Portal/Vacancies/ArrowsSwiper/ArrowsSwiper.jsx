import React from 'react';
import styles from "./ArrowsSwiper.module.scss"

const ArrowsSwiper = ({ prevRef, nextRef }) => {
  return (  
    <div className={styles.ArrowsSwiper}>
      <button ref={prevRef}></button>
      <button ref={nextRef}></button>
    </div>
  )
}

export default ArrowsSwiper;