import { useState, useEffect, useMemo } from 'react';
import { YMaps, Map as YMap, Placemark } from '@r3flector/react-yandex-maps';
import { marker } from '../const';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import s from '../styles/Map.module.css';

const apiKey = process.env.REACT_APP_API_KEY;

function getMapMargin(width, { top, bottom }) {
  if (width > 1024) {
    return [550, 0, 0, 0];
  }

  const topMargin = Math.max(Math.round(top), 0);
  const bottomMargin = width <= 767
    ? Math.max(Math.round(bottom) + 56, 80)
    : Math.max(Math.round(bottom) + 24, 24);

  return [topMargin, 0, bottomMargin, 0];
}

function getMarginBucket(width, overlayInsets) {
  if (width > 1024) return 'desktop';
  const { top, bottom } = overlayInsets;
  return `overlay-${Math.round(top / 20) * 20}-${Math.round(bottom / 20) * 20}`;
}

export default function Map({ activeCity, overlayInsets = { top: 0, bottom: 0 } }) {
  const { width } = useWindowWidth();
  const [mapKey, setMapKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapMargin = useMemo(() => getMapMargin(width, overlayInsets), [width, overlayInsets]);
  const marginBucket = useMemo(
    () => getMarginBucket(width, overlayInsets),
    [width, overlayInsets],
  );

  useEffect(() => {
    setIsLoaded(false);
    setMapKey((k) => k + 1);
  }, [activeCity, marginBucket]);

  return (
    <div className={s.wrap}>
      {!isLoaded && <div className={s.skeleton} />}
      <YMaps>
        <YMap
          key={mapKey}
          defaultState={{ center: activeCity.coordinates, zoom: 12, margin: mapMargin }}
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
