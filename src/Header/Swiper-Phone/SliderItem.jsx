/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./SliderItem.css";

const Slideritem = ({ title, src, text, icon, id }) => {

  return (
    <div className="slider-item swiper-slide">
      <div className="slider-image-wrapper">
        <img className="slider-image" src={src} alt="SliderImg" />
        {/* <div className="icon_image">{icon}</div> */}
        <Link to="/winepark">
        <img className="icon_image" src={icon} alt="icon" />
        </Link>
      </div>
      <div className="slider-item-content">
        <h1 className="slider_subject">{title}</h1>
        <span className="slider_text">{text}</span>
      </div>
    </div>
  );
};

export default Slideritem;
