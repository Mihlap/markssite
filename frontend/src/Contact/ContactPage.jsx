import { useCallback, useState } from 'react';
import { cityData } from './const';
import Info from './components/Info';
import Map from './components/Map';
import s from './styles/Page.module.css';


export default function ContactPage() {
  const [activeCity, setActiveCity] = useState(cityData[0]);
  const [overlayInsets, setOverlayInsets] = useState({ top: 0, bottom: 0 });
  const handleOverlayResize = useCallback((insets) => {
    setOverlayInsets(insets);
  }, []);

  return (
    <section className={s.wrap}>
      <Info
        activeCity={activeCity}
        onCityChange={setActiveCity}
        onOverlayResize={handleOverlayResize}
      />
      <Map activeCity={activeCity} overlayInsets={overlayInsets} />
    </section>
  );
}
