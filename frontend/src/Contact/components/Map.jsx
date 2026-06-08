import { useState, useEffect } from 'react';
import { YMaps, Map as YMap, Placemark } from '@r3flector/react-yandex-maps';
import { marker } from '../const';
import s from '../styles/Map.module.css';

const apiKey = process.env.REACT_APP_API_KEY;

export default function Map({ activeCity }) {
  const [mapKey, setMapKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setMapKey((k) => k + 1);
  }, [activeCity]);

  return (
    <div className={s.wrap}>
      {!isLoaded && <div className={s.skeleton} />}
      <YMaps>
        <YMap
          key={mapKey}
          defaultState={{ center: activeCity.coordinates, zoom: 12, margin: [550, 0, 0, 0] }}
          width="100%"
          height="100%"
          query={{ apiKey }}
          options={{ suppressMapOpenBlock: true }}
          onLoad={() => setIsLoaded(true)}>
          <Placemark
            geometry={activeCity.coordinates}
            options={{
              iconLayout: 'default#image',
              iconImageHref: `data:image/svg+xml,${encodeURIComponent(marker)}`,
              iconImageSize: [64, 64],
            }}
          />
        </YMap>
      </YMaps>
      <style>{`
  [class*="ymaps-2"][class*="-ground-pane"] {
    -webkit-filter: grayscale(80%) brightness(100%);
  }
  [class*="ymaps-2"][class*="-map-copyrights-promo"],
  [class*="ymaps-2"][class*="-copyrights-pane"] {
    display: none !important;
  }
`}</style>
    </div>
  );
}
