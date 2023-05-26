/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from './SliderItem.module.css';

const Slideritem = ({ title, src, text, icon, id }) => {

  return (
    <div className={`${styles.slider_item}${styles.swiper_slide}`}>
      <div className={styles.slider_image_wrapper}>
        <Link to={`/${id}`}>
          <img className={styles.slider_image} src={src} alt="SliderImg" />
          {/* <div className="icon_image">{icon}</div> */}
          <img className={styles.icon_image} src={icon} alt="icon" />
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
