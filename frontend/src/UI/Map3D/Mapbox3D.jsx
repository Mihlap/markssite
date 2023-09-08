import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import styles from "./Mapbox.module.css";

const Mapbox3D = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  mapboxgl.accessToken = apiKey;

  useEffect(() => {
    const map = new mapboxgl.Map({
      style: "mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is",
      center: [37.581, 55.783],
      zoom: 15.5,
      pitch: 45,
      bearing: 10,
      container: "map",
      antialias: true,
    });

    map.scrollZoom.disable();

    const marker = new mapboxgl.Marker({ color: "#FF7F6A" })
      .setLngLat([37.5804, 55.783])
      .addTo(map);

    const isMobile = window.innerWidth <= 1024;
    const popupContent = `
        ${
          !isMobile
            ? `
            <img
              class="${styles.popupImage}"
              src="../assets/office.jpg"
              alt="Центральный офис"
            />`
            : ""
        }
        <strong class="${styles.popupTitle}">
          Marks Group
        </strong>
        <div class=${styles.popupCustomButton} onclick="window.open('/contacts')">
          Смотреть контакты
        </div>
        <div class="${styles.popupCloseButton}">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
              fill="black"
            />
          </svg>
        </div>
      `;

    let popup = new mapboxgl.Popup({ offset: 30, closeButton: false, maxWidth: 'none' });

    marker.getElement().addEventListener("mouseenter", () => {
      const popupNode = document.createElement("div");
      popupNode.style.width = "18rem";
      popupNode.innerHTML = popupContent;

      const closeButton = popupNode.querySelector(`.${styles.popupCloseButton}`);
      closeButton.addEventListener("click", () => {
        popup.remove();
      });

      popup.setLngLat(marker.getLngLat()).setDOMContent(popupNode).addTo(map);

      const popupContentElement = document.querySelector(".mapboxgl-popup-content");
if (popupContentElement) {
  popupContentElement.style.borderRadius = "1rem";
}
   
    });

    map.addControl(new mapboxgl.NavigationControl());
  }, []);

  return (
    <div className={styles.map}>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: "7px",
        }}
      />
    </div>
  );
};

export default Mapbox3D;
