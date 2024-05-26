import React from "react";
import styles from "./Mapbox.module.css";

const Popup = React.memo(({ selectedPopup, onClose }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        {selectedPopup.image && window.innerWidth >= 76 && (
          <img className={styles.popupImage} src={selectedPopup.image} alt={selectedPopup.title} />
        )}
        <div className={styles.popupTitle}>{selectedPopup.title}</div>
        {selectedPopup.buttonText && (
          <div className={styles.popupCustomButton}>{selectedPopup.buttonText}</div>
        )}
      </div>
      <div className={styles.popupCloseButton} onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
            fill="black"
          />
        </svg>
      </div>
    </div>
  );
});

export default Popup;
