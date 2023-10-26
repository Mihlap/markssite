import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import popupsData from "./popupsdata";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import styles from "./Mapbox.module.css";

const Mapbox3D = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  mapboxgl.accessToken = apiKey;

  useEffect(() => {
    const map = new mapboxgl.Map({
      style: "mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is",
      center: [37.5804, 55.77],
      zoom: window.innerWidth <= 767 ? 8.8 : (window.innerWidth <= 1024 ? 9.6 : 10.4),
      pitch: 45,
      bearing: 10,
      container: "map",
      antialias: true,
      interactive: true,
    });
    
    map.scrollZoom.disable();
    
    
    const popups = []; 
    
    popupsData.forEach((popupData) => {
      const marker = new mapboxgl.Marker({ color: "#FF7F6A" })
      .setLngLat(popupData.coordinates)
      .addTo(map);
      
      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: false,
        maxWidth: "none",
      });
      
      const popupNode = document.createElement("div");
      popupNode.style.width = "18rem";
      
      let popupContent = "";
      
      
      // if (window.innerWidth >= 767) {
      
      if (popupData.image) {
        popupContent += `
        <img
        class="${styles.popupImage}"
        src="${popupData.image}"
        alt="${popupData.title}"
        />`;
      }
    // }
      
      popupContent += `
      <div class="${styles.popupTitle}">
      ${popupData.title}
      </div>`;
      
      if (popupData.buttonText) {
        popupContent += `
        <div class=${styles.popupCustomButton} onclick="window.open('/contacts')">
        ${popupData.buttonText} 
        </div>`;
      }
      
      popupContent += `
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
      
      popupNode.innerHTML = popupContent;

      const closeButton = popupNode.querySelector(
        `.${styles.popupCloseButton}`
      );
      closeButton.addEventListener("click", () => {
        popup.remove();
      });

      popup.setLngLat(popupData.coordinates).setDOMContent(popupNode);

      popups.push({ marker, popup });
    });

    popups.forEach(({ marker, popup }) => {
      marker.getElement().addEventListener("mouseenter", () => {

       
        popups.forEach(({ popup }) => popup.remove());

        popup.addTo(map);
      });
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
