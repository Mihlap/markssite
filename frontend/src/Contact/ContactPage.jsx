import { useState } from 'react';
import { cityData } from './const';
import Info from './components/Info';
import Map from './components/Map';
import s from './styles/Page.module.css';

export default function ContactPage() {
  const [activeCity, setActiveCity] = useState(cityData[0]);

  return (
    <section className={s.wrap}>
      <Info activeCity={activeCity} onCityChange={setActiveCity} />
      <Map activeCity={activeCity} />
    </section>
  );
}
