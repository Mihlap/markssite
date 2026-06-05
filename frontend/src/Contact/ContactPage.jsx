import { useState } from 'react';
import { cityData } from './const';
import Info from './components/Info';
import Map from './components/Map';
import s from './styles/Page.module.css';
// import photo from './Screenshot.png';


export default function ContactPage() {
  const [activeCity, setActiveCity] = useState(cityData[0]);

  return (
    <section className={s.wrap}>
      <Info activeCity={activeCity} onCityChange={setActiveCity} />
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
