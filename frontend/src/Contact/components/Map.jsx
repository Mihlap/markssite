import { useState, useEffect } from 'react';
import { YMaps, Map as YMap, Placemark } from '@r3flector/react-yandex-maps';
import {
  buildingInitialCustomization,
  groundInitialCustomization,
  roadsInitialCustomization,
  waterInitialCustomization,
} from '../const/common';
import s from '../styles/Map.module.css';

const apiKey = process.env.REACT_APP_API_KEY;

const customization = [
  waterInitialCustomization,
  groundInitialCustomization,
  roadsInitialCustomization,
  buildingInitialCustomization,
];

const markerSVG =
  `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">` +
  `<path d="M32 30.6667C30.2319 30.6667 28.5362 29.9643 27.286 28.714C26.0358 27.4638 25.3334 25.7681 25.3334 24C25.3334 22.2319 26.0358 20.5362 27.286 19.286C28.5362 18.0357 30.2319 17.3333 32 17.3333C33.7682 17.3333 35.4638 18.0357 36.7141 19.286C37.9643 20.5362 38.6667 22.2319 38.6667 24C38.6667 24.8755 38.4943 25.7424 38.1592 26.5512C37.8242 27.3601 37.3331 28.095 36.7141 28.714C36.095 29.3331 35.3601 29.8242 34.5513 30.1592C33.7424 30.4942 32.8755 30.6667 32 30.6667ZM32 5.33333C27.0493 5.33333 22.3014 7.29999 18.8007 10.8007C15.3 14.3014 13.3334 19.0493 13.3334 24C13.3334 38 32 58.6667 32 58.6667C32 58.6667 50.6667 38 50.6667 24C50.6667 19.0493 48.7 14.3014 45.1994 10.8007C41.6987 7.29999 36.9507 5.33333 32 5.33333Z" fill="#FF7F6A"/></svg>`;

export default function Map({ activeCity }) {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setMapKey((k) => k + 1);
  }, [activeCity]);

  return (
    <div className={s.wrap}>
      <YMaps>
        <YMap
          key={mapKey}
          defaultState={{ center: activeCity.coordinates, zoom: 11 }}
          width="100%"
          height="100%"
          query={{ apiKey }}
          options={{ customization }}>
          <Placemark
            geometry={activeCity.coordinates}
            options={{
              iconLayout: 'default#image',
              iconImageHref: `data:image/svg+xml,${encodeURIComponent(markerSVG)}`,
              iconImageSize: [64, 64],
            }}
          />
        </YMap>
      </YMaps>
    </div>
  );
}
