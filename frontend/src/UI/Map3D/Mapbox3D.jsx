import React, { useLayoutEffect } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import styles from "./Mapbox.module.css";

const Mapbox3D = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  mapboxgl.accessToken = apiKey;

  useLayoutEffect(() => {
    const map = new mapboxgl.Map({
      style: "mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is",
      center: [37.581, 55.783],
      zoom: 15.5,
      pitch: 45,
      bearing: 10,
      container: "map",
      antialias: true,
      // attributionControl: false,
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
    <p class="${styles.popupDescription}">
      Центральный офис компании
    </p>
      <button class=${styles.popupButton} onclick="window.open('/contacts')">
        Смотреть контакты
      </button>
    `;
    let popup = null; 

    marker.getElement().addEventListener("mouseenter", () => {
      popup = new mapboxgl.Popup({ offset: 30 })
        .setHTML(popupContent)
        .setLngLat(marker.getLngLat())
        .addTo(map);

        popup.getElement().addEventListener("mouseleave", () => {
        popup.remove();
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