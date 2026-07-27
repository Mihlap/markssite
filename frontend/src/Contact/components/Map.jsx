import { useState, useEffect, useMemo } from 'react';
import { YMaps, Map as YMap, Placemark } from '@r3flector/react-yandex-maps';
import { marker } from '../const';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import s from '../styles/Map.module.css';

const apiKey = process.env.REACT_APP_API_KEY;
const LAPTOP_MAX_WIDTH = 1600;

function getMinVisibleMapPx(viewportHeight, width) {
  if (width > 1024) {
    return Math.round(Math.min(360, Math.max(220, viewportHeight * 0.38)));
  }
  if (width > 430) {
    return Math.round(Math.min(300, Math.max(200, viewportHeight * 0.34)));
  }
  return Math.round(Math.min(260, Math.max(168, viewportHeight * 0.32)));
}

function getMapMargin(width, { top, bottom }) {
  if (width > 1024) {
    const topMargin = Math.max(Math.round(top) || 550, 0);
    return [topMargin, 0, 0, 0];
  }

  const topMargin = Math.max(Math.round(top), 0);
  const bottomMargin = width <= 767
    ? Math.max(Math.round(bottom) + 56, 80)
    : Math.max(Math.round(bottom) + 24, 24);

  return [topMargin, 0, bottomMargin, 0];
}

function getMapHeightPx(width, viewportHeight, { top, bottom }) {
  const minVisible = getMinVisibleMapPx(viewportHeight, width);
  const needed = (Math.round(top) || 0) + minVisible + (Math.round(bottom) || 0);

  if (width > LAPTOP_MAX_WIDTH) {
    return needed > viewportHeight ? needed : null;
  }

  return Math.max(viewportHeight, needed);
}

function getMarginBucket(width, overlayInsets) {
  const { top, bottom } = overlayInsets;
  return `overlay-${Math.round(top / 20) * 20}-${Math.round(bottom / 20) * 20}-${width > 1024 ? 'd' : 'm'}`;
}

export default function Map({ activeCity, overlayInsets = { top: 0, bottom: 0 } }) {
  const { width } = useWindowWidth();
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const [mapKey, setMapKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeout;
    let lastWidth = window.innerWidth;

    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const nextWidth = window.innerWidth;     
        if (nextWidth !== lastWidth) {
          lastWidth = nextWidth;
          setViewportHeight(window.innerHeight);
        }
      }, 150);
    };

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const mapHeightPx = useMemo(
    () => getMapHeightPx(width, viewportHeight, overlayInsets),
    [width, viewportHeight, overlayInsets],
  );
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
    <div className={s.wrap} style={mapHeightPx ? { height: mapHeightPx } : undefined}>
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
