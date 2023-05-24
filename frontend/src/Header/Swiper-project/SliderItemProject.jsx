/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./SliderItemProject.css";

const SliderItemProject = ({ title, src, text, icon, id }) => {

  return (
    <div className="slider-item swiper-slide">
      <div className="slider-image-wrapper">
        <Link to={`/${id}`}>
        <img className="slider-image" src={src} alt="SliderImg" />
        {/* <div className="icon_image">{icon}</div> */}
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

export default SliderItemProject;
