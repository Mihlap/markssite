import { useState } from 'react';
import { cityData } from './const';
import Info from './components/Info';
import Map from './components/Map';
import s from './styles/Page.module.css';
import FilterToolbar from './components/FilterToolbar';
import photo from './Screenshot.png';

const tabs = cityData.map((c) => c.name);

export default function ContactPage() {
  const [activeCity, setActiveCity] = useState(cityData[0]);

  return (
    <section className={s.wrap}>
      <Info activeCity={activeCity} onCityChange={setActiveCity} />
      {/* <FilterToolbar
        tabs={tabs}
        activeTab={activeCity.name}
        // onTabChange={(name) => onCityChange(cityData.find((c) => c.name === name))}
      /> */}
      <Map activeCity={activeCity} />
      {/* <img
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        src={photo}
        alt="city"
      /> */}
    </section>
  );
}
