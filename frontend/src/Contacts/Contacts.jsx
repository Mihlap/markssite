import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from './Contacts.module.css';

const Contacts = () => {
  const [map, setMap] = useState(null);
  const [selectedMap, setSelectedMap] = useState('Москва');
  const [marker, setMarker] = useState(null);

  const apiKey = process.env.REACT_APP_API_KEY;
  mapboxgl.accessToken = apiKey;

  useEffect(() => {
    if (!map) {
      const zoomLevel = window.innerWidth <= 700 ? 9 : 12;
      const newMap = new mapboxgl.Map({
        style: 'mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is',
        center: getOfficeCenter(selectedMap),
        zoom: zoomLevel,
        attributionControl: false,
        container: 'map',
        antialias: true,
      });

       newMap.on('load', () => {
        newMap.addSource('marker', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: getOfficeCenter(selectedMap),
                },
              },
            ],
          },
        });
        const newMarker = new mapboxgl.Marker({ color: '#FF7F6A' })
          .setLngLat(getOfficeCenter(selectedMap))
          .addTo(newMap);
        setMarker(newMarker);
      });
        //меняем названия на русский язык
        newMap.getStyle().layers.forEach(function (layer) {
          if (layer.type === 'symbol') {
            newMap.setLayoutProperty(layer.id, 'text-field', ['get', 'name_ru']);
          }
        });
      setMap(newMap);
    } else {
      map.setCenter(getOfficeCenter(selectedMap));
      if (map && map.getSource('marker')) {
        map.getSource('marker').setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: getOfficeCenter(selectedMap),
              },
            },
          ],
        });
      }
      const newMarker = new mapboxgl.Marker({ color: '#FF7F6A' })
        .setLngLat(getOfficeCenter(selectedMap))
        .addTo(map);
      setMarker(newMarker);
    }
  }, [map, selectedMap]);

  function getOfficeCenter(city) {
    switch (city) {
      case 'Москва':
        return [37.5804, 55.783];
      case 'Оренбург':
        return [55.098208, 51.768199];
      case 'Челябинск':
        return [61.402554, 55.160026];
      case 'Ташкент':
        return [69.267883, 41.311151];
      default:
        return [37.5804, 55.783];
    }
  }
  const cityInfo = {
    Москва: {
      address: 'Москва, 3-я Ямского Поля, дом 20, строение 1, офис 70',
      phone: '+7 (495) 120-12-26',
    },
    Оренбург: {
      address: 'г. Оренбург, проезд Нижний, 17, офис 305',
      phone: '+7 (495) 120-12-26',
    },
    Челябинск: {
      address: 'г. Челябинск, ул. Северная дом 52/3',
      phone: '+7 (495) 120-12-26',
    },
    Ташкент: {
      address: 'Tashkent, Oybek Street, 18/1',
      phone: '+7 (495) 120-12-26',
    },
  };

  const { address, phone } = cityInfo[selectedMap];

  return (
    <div className={styles.main_contact}>
      <div className={styles.menu_block}>
        <div className={styles.menu_span}>Стать клиентом или партнером</div>
        <div className={styles.menu_mail}>mail@marksgroup.ru</div>
        <div className={styles.menu_tel}>{phone}</div>
        <div className={styles.menu_address}>{address}</div>
        <div className={styles.menu_work}>
          Режим работы &nbsp;&bull;&nbsp; Пн.&mdash;Пт. 10.00&mdash;19.00
        </div>
        <div className={styles.menu_office_name}>
          У нас есть офисы по всему материку!
        </div>
        <div className={styles.menu_button_group}>
          <button
            className={`${styles.menu_button} ${selectedMap === 'Москва' ? styles.menu_button_active : ''}`}
            onClick={() => setSelectedMap('Москва')}
          >
            Москва
          </button>
          <button
            className={`${styles.menu_button} ${selectedMap === 'Оренбург' ? styles.menu_button_active : ''}`}
            onClick={() => setSelectedMap('Оренбург')}
          >
            Оренбург
          </button>
          <button
            className={`${styles.menu_button} ${selectedMap === 'Челябинск' ? styles.menu_button_active : ''}`}
            onClick={() => setSelectedMap('Челябинск')}
          >
            Челябинск
          </button>
          <button
            className={`${styles.menu_button} ${selectedMap === 'Ташкент' ? styles.menu_button_active : ''}`}
            onClick={() => setSelectedMap('Ташкент')}
          >
            Ташкент
          </button>
         </div>
      </div>
      <div className={styles.map_block}>
        <div
          id="map"
          style={{
            width: '100%',
            height: '100%%',
           }}
        />
      </div>
    </div>
  );
};

export default Contacts;
