/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from './SliderItem.module.css';

const Slideritem = ({ title, src, text, id }) => {

  return (
    <div className={`${styles.slider_item}${styles.swiper_slide}`}>
      <div className={styles.slider_image_wrapper}>
        <Link to={`/${id}`}>
          <img className={styles.slider_image} src={src} alt="SliderImg" />
          <svg
            className={styles.icon_image}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="20" fill="#566272" />
            <path
              d="M10 20H20M30 20H20M20 20V10M20 20V30"
              stroke="#F6F6F6"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </Link>
      </div>
      <div className={styles.slider_item_content}>
        <h1 className={styles.slider_subject}>{title}</h1>
        <span className={styles.slider_text}>{text}</span>
      </div>
    </div>
  );
};

export default Slideritem;
