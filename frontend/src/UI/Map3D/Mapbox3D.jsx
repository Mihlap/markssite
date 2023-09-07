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
    
    const isMobile = window.innerWidth < 1024;
    const popupContent = `
      ${
        !isMobile
          ? `
          <img
            src="../assets/office.jpg"
            alt="Центральный офис"
            width="200"
            height="150"
          />`
          : ""
      }
      <strong 
        style="
          color: #3C3C3C;
          font-family: Raleway;
          font-size: 1rem;
          font-style: normal;
          font-weight: 700;
          line-height: 1.5rem;
          margin-top: 1rem;"
      >
        Marks Group
      </strong>
      <p
        style="
          color: #3C3C3C;
          font-family: Raleway;
          font-size: 0.875rem;
          font-style: normal;
          font-weight: 700;
          line-height: 1rem;
        "
      >
        Центральный офис компании
      </p>
      <button class="websiteButton"
        style="
          display: flex;
          width: auto;
          padding: 8px 24px;
          align-items: center;
          justify-content: center;
          border-radius: 2.125rem;
          border: 1px solid var(--black-1D2E43);
          background-color: transparent;
          white-space: nowrap;
          color: var(--black-1D2E43);
          cursor: pointer;
          margin-top: 1rem;
        "
        onmouseover="this.style.backgroundColor='var(--dark-gray-566272)'; this.style.color='white';"
        onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--black-1D2E43)';"
      >
        Смотреть контакты
      </button>
    `;
    let popup = null; 

    marker.getElement().addEventListener("mouseenter", () => {
      popup = new mapboxgl.Popup({ offset: 30 })
        .setHTML(popupContent)
        .setLngLat(marker.getLngLat())
        .addTo(map);

      popup.getElement().addEventListener("click", (e) => {
        if (e.target.classList.contains("websiteButton")) {
          window.open("/contacts");
        }
      });

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