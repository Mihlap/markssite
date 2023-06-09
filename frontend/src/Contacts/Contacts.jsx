import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import mapboxgl from 'mapbox-gl';
import { Link } from "react-router-dom";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from './Contacts.module.css';

const apiKey = process.env.REACT_APP_API_KEY;
mapboxgl.accessToken = apiKey;

const cities = ['Москва', 'Оренбург', 'Челябинск', 'Ташкент'];

const cityInfo = {
  Москва: {
    address: 'Москва, 3-я Ямского Поля, дом 20, строение 1, офис 704',
    phone: '+7 (495) 120-12-26',
    mail: 'mail@marksgroup.ru',
  },
  Оренбург: {
    address: 'г. Оренбург, проезд Нижний, 17, офис 305',
    phone: '+7 (495) 120-12-26',
    mail: 'mail@marksgroup.ru',
  },
  Челябинск: {
    address: 'г. Челябинск, ул. Северная дом 52/3',
    phone: '+7 (495) 120-12-26',
    mail: 'mail@marksgroup.ru',
  },
  Ташкент: {
    address: 'Tashkent, Oybek Street, 18/1',
    phone: '+9 (989) 935 39 90',
    mail: 'mail@marksgroup.ru',
  },
};

const Contacts = () => {
  const [map, setMap] = useState(null);
  const [selectedMap, setSelectedMap] = useState('Москва');
  const [marker, setMarker] = useState(null);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (!map) {
      const newMap = new mapboxgl.Map({
        style: 'mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is',
        center: getOfficeCenter(selectedMap),
        zoom: 11,
        attributionControl: false,
        container: 'map',
        antialias: true,
      });

      if ('ontouchstart' in window) {
        newMap.dragPan.disable();
        newMap.touchZoomRotate.enable();
      } else {
        newMap.dragPan.enable();
        newMap.scrollZoom.enable();
      }

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

       //меняем названия на русский язык
        newMap.getStyle().layers.forEach(function (layer) {
          if (layer.type === 'symbol') {
            newMap.setLayoutProperty(layer.id, 'text-field', ['get', 'name_ru']);
          }
        });

        const newMarker = new mapboxgl.Marker({ color: '#FF7F6A' })
          .setLngLat(getOfficeCenter(selectedMap))
          .addTo(newMap);
        setMarker(newMarker);
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
      map.panBy([-100, -100], { duration: 0 });
      const canvas = map.getCanvasContainer();
      canvas.style.touchAction = 'pan-y';
      if (canvas.classList.contains('mapboxgl-touch-zoom-rotate')) {
        canvas.classList.add('pinch-zoom');
      }
    }
  }, [map, selectedMap]);

  function getOfficeCenter(city) {
    switch (city) {
      case 'Москва':
        return [37.5804, 55.783];
      case 'Оренбург':
        return [55.1053, 51.804];
      case 'Челябинск':
        return [61.3018, 55.1566];
      case 'Ташкент':
        return [69.275, 41.2964];
      default:
        return [37.5804, 55.783];
    }
  }

  const { address, phone, mail } = cityInfo[selectedMap];

  return (
    <div className={styles.main_contact}>
      <div className={styles.menu_block}>
        <div className={styles.menu_span}>Стать клиентом или партнером</div>
        <div className={styles.menu_mail}>{mail}</div>
        <div className={styles.menu_tel}>{phone}</div>
        <Link to={`mailto:${mail}`} className={styles.link_mail}>
          {mail}
        </Link>
        <Link to={`tel:${phone}`} className={styles.link_tel}>
          {phone}
        </Link>
        <div className={styles.menu_address}>{address}</div>
        <div className={styles.menu_work}>
          Режим работы &nbsp;&bull;&nbsp; Пн. &mdash; Пт. 10.00&mdash;19.00
        </div>
        <div className={styles.menu_office_name}>
          У нас есть офисы по всему материку!
        </div>
        <div className={styles.menu_button_group}>
          {cities.map((city) => (
            <button
              key={city}
              className={`${styles.menu_button} ${
                selectedMap === city ? styles.menu_button_active : ''
              }`}
              onClick={() => setSelectedMap(city)}
            >
              <p className={styles.menu_button_city}>{city}</p>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.map_block}>
        <div
          id="map"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={'auto'}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          className={styles.mySwiper}
          touch={true}
        >
          <div className={styles.slider_menu_button_group}>
            {cities.map((city) => (
              <SwiperSlide
                key={city}
                className={`${styles.slider_menu_button} ${
                  selectedMap === city ? styles.slider_menu_button_active : ''
                }`}
                onClick={() => {
                  if (swiper) {
                    swiper.slideTo(cities.indexOf(city));
                  }
                  setSelectedMap(city);
                }}
              >
                <p className={styles.slider_button_city}>{city}</p>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default Contacts;
