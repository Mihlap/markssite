import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { YMaps, Map, ZoomControl } from '@pbe/react-yandex-maps';
import popupsData from './popupsdata';
import styles from './Mapbox.module.css';
import Marker from './Marker';
import Popup from './Popup';

const apiKey = process.env.REACT_APP_API_KEY;

const Mapbox3D = React.memo(() => {
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(null);

  const handleMarkerClick = useCallback((popupData, index) => {
    setSelectedPopup(popupData);
    setActiveMarkerIndex(index);
  }, []);

  const handleMarkerHover = useCallback((popupData, index) => {
    if (window.innerWidth > 1025) {
      setSelectedPopup(popupData);
      setActiveMarkerIndex(index);
    }
  }, []);

  const handleMarkerLeave = useCallback(() => {
    if (window.innerWidth > 1025 && !selectedPopup) {
      setSelectedPopup(null);
      setActiveMarkerIndex(null);
    }
  }, [selectedPopup]);

  const handleMapTouchStart = useCallback(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const handleMapTouchEnd = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedPopup(null);
    setActiveMarkerIndex(null);
  }, []);

  useEffect(() => {
    setSelectedPopup(null);
    setActiveMarkerIndex(null);
  }, []);

  const zoomLevel = useMemo(() => {
    if (window.innerWidth <= 767) return 8.8;
    if (window.innerWidth <= 1024) return 9.6;
    return 10.5;
  }, []);

  const handlePopupClose = useCallback(() => {
    setSelectedPopup(null);
    setActiveMarkerIndex(null);
  }, []);

  return (
    <div className={styles.map}>
      <YMaps>
        <Map
          defaultState={{
            center: [55.77, 37.5804],
            zoom: zoomLevel,
          }}
          width="100%"
          height="100%"
          query={{ apiKey }}
          options={{
            suppressMapOpenBlock: true,
            suppressMapOpenBlockKey: 'ctrlKey',
            behaviors: ['disableScrollZoom'],
          }}
          onTouchStart={handleMapTouchStart}
          onTouchEnd={handleMapTouchEnd}
          onClick={handleMapClick}
        >
          {window.innerWidth > 1025 && <ZoomControl options={{ position: { top: 20, right: 20 } }} />}
          {popupsData.map((marker, index) => (
            <Marker
              key={index}
              marker={marker}
              index={index}
              activeMarkerIndex={activeMarkerIndex}
              handleMarkerClick={handleMarkerClick}
              handleMarkerHover={handleMarkerHover}
              handleMarkerLeave={handleMarkerLeave}
            />
          ))}
        </Map>
      </YMaps>
      {selectedPopup && <Popup selectedPopup={selectedPopup} onClose={handlePopupClose} />}
      <style>
        {`
    [class*="ymaps-2"][class*="-ground-pane"] {    
      -webkit-filter: grayscale(88%) brightness(100%);
    }
  `}
      </style>
    </div>
  );
});

export default Mapbox3D;
