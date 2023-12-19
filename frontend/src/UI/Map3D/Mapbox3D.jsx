import React, { useEffect, useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import popupsData from "./popupsdata";
import styles from "./Mapbox.module.css";

const Mapbox3D = () => {
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(null);

  const handleMarkerClick = (popupData, index) => {
    setSelectedPopup(popupData);
    setActiveMarkerIndex(index);
  };

  const handleMarkerHover = (popupData, index) => {
    if (window.innerWidth > 1025) {
      setSelectedPopup(popupData);
      setActiveMarkerIndex(index);
    }
  };

  const handleMarkerLeave = () => {
    if (window.innerWidth > 1025 && !selectedPopup) {
      setSelectedPopup(null);
      setActiveMarkerIndex(null);
    }
  };

  const handleMapTouchStart = () => {
    // Включить прокрутку при касании карты на мобильных устройствах
    document.body.style.overflow = "auto";
  };

  const handleMapTouchEnd = () => {
    // Отключить прокрутку при завершении взаимодействия с картой
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    setSelectedPopup(null);
    setActiveMarkerIndex(null);
  }, []);

  return (
    <div className={styles.map}>
      <YMaps>
        <Map
          defaultState={{
            center: [55.77, 37.5804],
            zoom: window.innerWidth <= 767 ? 8.8 : window.innerWidth <= 1024 ? 9.6 : 10.5,
          }}
          width="100%"
          height="100%"
          options={{
            suppressMapOpenBlock: true,
            suppressMapOpenBlockKey: "ctrlKey",
          }}
          onTouchStart={handleMapTouchStart}
          onTouchEnd={handleMapTouchEnd}
        >
          {popupsData.map((marker, index) => (
            <Placemark 
              key={index}
              geometry={marker.coordinates}
              onClick={() => handleMarkerClick(marker, index)}
              onMouseEnter={() => handleMarkerHover(marker, index)}
              onMouseLeave={handleMarkerLeave}
              options={{
                iconLayout: "default#image",
                iconImageHref: "/assets/house.svg",
                iconImageSize: activeMarkerIndex === index ? [50, 55] : [40, 45],
                hintPane: activeMarkerIndex === index ? 'islands#groundPane' : 'islands#floatPane',
              }}
            />
          ))}
        </Map>
      </YMaps>
      {selectedPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            {selectedPopup.image && window.innerWidth >= 76 && (
              <img
                className={styles.popupImage}
                src={selectedPopup.image}
                alt={selectedPopup.title}
              />
            )}
            <div className={styles.popupTitle}>{selectedPopup.title}</div>
            {selectedPopup.buttonText && (
              <div
                className={styles.popupCustomButton}
                // onClick={() => window.open("/contacts")}
              >
                {selectedPopup.buttonText}
              </div>
            )}
          </div>
          <div
            className={styles.popupCloseButton}
            onClick={() => {
              setSelectedPopup(null);
              setActiveMarkerIndex(null);
            }}
          >
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
        </div>
      )}

      <style>
        {`
          [class*="ymaps-2"][class*="-ground-pane"] {
            filter: brightness(95%) hue-rotate(500deg) saturate(100%) !important;
          }

          @media (max-width: 767px) {
            .${styles.popupImage} {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Mapbox3D;




// import React, { useEffect, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import popupsData from "./popupsdata";
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import styles from "./Mapbox.module.css";

// const Mapbox3D = () => {
//   const apiKey = process.env.REACT_APP_API_KEY;
//   mapboxgl.accessToken = apiKey;

//   const [images, setImages] = useState({});
//   const imageUrl = "/assets/house.svg";

//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       style: "mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is",
//       center: [37.5804, 55.77],
//       zoom: window.innerWidth <= 767 ? 8.8 : (window.innerWidth <= 1024 ? 9.6 : 10.4),
//       pitch: 45,
//       bearing: 10,
//       container: "map",
//       antialias: true,
//       interactive: true,
//     });

//     map.scrollZoom.disable();

//     const popups = [];

//      const addPopup = async (popupData) => {
//       const marker = new mapboxgl.Marker({ element: createMarkerElement(imageUrl) })
//         .setLngLat(popupData.coordinates)
//         .addTo(map);

//         function createMarkerElement(imageUrl) {
//           const element = document.createElement("div");
//           element.style.backgroundImage = `url(${imageUrl})`;
//           element.style.width = "35px";
//           element.style.height = "40px";
//           element.style.backgroundSize = "cover";
//           element.style.objectPosition = "center";
        
//           return element;
//         }

//       const popup = new mapboxgl.Popup({
//         offset: 30,
//         closeButton: false,
//         maxWidth: "none",
//       });

//       const popupNode = document.createElement("div");
//       popupNode.style.width = window.innerWidth > 767 ? "18rem" : "10rem";

//       let popupContent = "";

//       if (window.innerWidth > 767 && popupData.image) {
//         const imageUrl = `${popupData.image}`;
      
  
//         if (!imageUrl) {
//           try {
//             const response = await fetch(imageUrl);
//             const blob = await response.blob();
//             const imageUrl = URL.createObjectURL(blob);
//             setImages((prevImages) => ({
//               ...prevImages,
//               [popupData.image]: imageUrl,
//             }));
//             // setImages(imageUrl)
//           } catch (error) {
//             console.error("Error fetching image:", error);
//           }
//         }

//         popupContent += `
//           <img
//             class="${styles.popupImage}"
//            src="${imageUrl}"
//             alt="${popupData.title}"
//           />`;
//       }

//       popupContent += `
//         <div class="${styles.popupTitle}">
//           ${popupData.title}
//         </div>`;

//       if (popupData.buttonText) {
//         popupContent += `
//           <div class=${styles.popupCustomButton} onclick="window.open('/contacts')">
//             ${popupData.buttonText} 
//           </div>`;
//       }

//       popupContent += `
//         <div class="${styles.popupCloseButton}">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 16 16"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
//               fill="black"
//             />
//           </svg>
//         </div>`;

//       popupNode.innerHTML = popupContent;

//       const closeButton = popupNode.querySelector(`.${styles.popupCloseButton}`);
//       closeButton.addEventListener("click", () => {
//         popup.remove();
//       });

//       popup.setLngLat(popupData.coordinates).setDOMContent(popupNode);

//       popups.push({ marker, popup });
//     };

//     popupsData.forEach((popupData) => {
//       addPopup(popupData);
//     });

//     // popups.forEach(({ marker, popup }) => {
//     //   marker.getElement().addEventListener("mouseenter", () => {
//     //     popups.forEach(({ popup }) => popup.remove());
//     //     popup.addTo(map);
//     //   });
//     // });

//     popups.forEach(({ marker, popup }) => {
       
//       if (window.innerWidth > 1024) {
//          marker.getElement().addEventListener("mouseenter", () => {
//           popups.forEach(({ popup }) => popup.remove());
//           popup.addTo(map);
//         });
//       } else {
//           marker.getElement().addEventListener("click", () => {
//            popups.forEach(({ popup }) => popup.remove());
//           setTimeout(() => popup.addTo(map), 100);
//         });
//       }
//     });

//     map.addControl(new mapboxgl.NavigationControl());
//   }, []);

//   return (
//     <div className={styles.map}>
//       <div
//         id="map"
//         style={{
//           width: "100%",
//           height: "100%",
//           boxSizing: "border-box",
//           borderRadius: "7px",
//         }}
//       />
//     </div>
//   );
// };

// export default Mapbox3D;
