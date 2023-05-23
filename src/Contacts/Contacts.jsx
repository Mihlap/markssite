import React, { useLayoutEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from './Contacts.module.css';


const Contacts = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  mapboxgl.accessToken = apiKey;

  useLayoutEffect(() => {
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is',
      center: [37.581, 55.783],
      zoom: 11,
      attributionControl: false,
      container: 'map',
      antialias: true,
    });
    new mapboxgl.Marker({ color: '#FF7F6A' })
      .setLngLat([37.5804, 55.783])
      .addTo(map);
  }, []);

  return (

    <div className={styles.main_contact}>
      <div className={styles.menu_block}>
        <div className={styles.menu_span}>Стать клиентом или партнером</div>
        <div className={styles.menu_mail}>mail@marksgroup.ru</div>
        <div className={styles.menu_tel}>+7 (495) 120-12-26</div>
        <div className={styles.menu_address}>Москва 3-я Ямского Поля, дом 20 строение1 офис 70</div>
        <div className={styles.menu_work}>Режим работы &nbsp;&bull;&nbsp; Пн.&mdash;Пт. 10.00&mdash;19.00</div>
        <div className={styles.menu_office_name}>У нас есть офисы по всему материку&#128579;!</div>
        <div className={styles.menu_button_group}>
        <button className={styles.menu_button}>Москва</button>
        <button className={styles.menu_button}>Оренбург</button>
        <button className={styles.menu_button}>Челябинск</button>
        <button className={styles.menu_button}>Ташкент</button>
        </div>
      </div>
      <div className={styles.map_block}>
        <div id="map" style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: '7px' }} />
      </div>
    </div>

  )
}

export default Contacts;