import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { YMaps, Map, Placemark } from '@r3flector/react-yandex-maps';
import { Link } from 'react-router-dom';
import styles from './Contacts.module.scss';

const apiKey = process.env.REACT_APP_API_KEY;

const cities = [
  { name: 'Москва', coords: [55.783, 37.5804] },
  { name: 'Санкт-Петербург', coords: [59.918079, 30.312706] },
  { name: 'Воронеж', coords: [51.653696, 39.178566] },
  { name: 'Оренбург', coords: [51.804, 55.1053] },
  { name: 'Челябинск', coords: [55.1566, 61.3018] },
  { name: 'Ташкент', coords: [41.2964, 69.275] },
];

const cityInfo = {
  Москва: {
    address: 'Москва, 3-я ул. Ямского Поля, д. 20, с. 1, офис 704',
    phone: '+7 (495) 120-12-26',
    mail: 'mail@marksgroup.ru',
    hour: '',
  },
  'Санкт-Петербург': {
    address: 'Санкт-Петербург, Державинский переулок, д. 5',
    phone: '+7 (495) 120-12-26',
    mail: 'mail@marksgroup.ru',
    hour: '',
  },
  Воронеж: {
    address: 'Воронеж, ул. Ворошилова, д. 1а',
    phone: '+7 (495) 120-12-26',
    mail: 'mail@marksgroup.ru',
    hour: '',
  },
  Оренбург: {
    address: 'Оренбург, пр. Нижний, д. 17, офис 305',
    phone: '+7 (3532) 22-86-96',
    mail: 'mail@marksgroup.ru',
    hour: '+ 2 МСК',
  },
  Челябинск: {
    address: 'Челябинск, ул. Северная, д. 52/3',
    mail: 'mail@marksgroup.ru',
    hour: '+ 2 МСК',
  },
  Ташкент: {
    address: 'Tashkent, Oybek Street, 18/1',
    phone: '+998 99 353 96 90',
    mail: 'mail@marksgroup.ru',
    hour: '+ 2 МСК',
  },
};

const customMarkerSVG =
  `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">` +
  `<path d="M32 30.6667C30.2319 30.6667 28.5362 29.9643 27.286 28.714C26.0358 27.4638 25.3334 25.7681 25.3334 24C25.3334 22.2319 26.0358 20.5362 27.286 19.286C28.5362 18.0357 30.2319 17.3333 32 17.3333C33.7682 17.3333 35.4638 18.0357 36.7141 19.286C37.9643 20.5362 38.6667 22.2319 38.6667 24C38.6667 24.8755 38.4943 25.7424 38.1592 26.5512C37.8242 27.3601 37.3331 28.095 36.7141 28.714C36.095 29.3331 35.3601 29.8242 34.5513 30.1592C33.7424 30.4942 32.8755 30.6667 32 30.6667ZM32 5.33333C27.0493 5.33333 22.3014 7.29999 18.8007 10.8007C15.3 14.3014 13.3334 19.0493 13.3334 24C13.3334 38 32 58.6667 32 58.6667C32 58.6667 50.6667 38 50.6667 24C50.6667 19.0493 48.7 14.3014 45.1994 10.8007C41.6987 7.29999 36.9507 5.33333 32 5.33333Z" fill="#FF7F6A"/></svg>`;

function Contacts({ handleMouseEnter, handleMouseLeave }) {
  const [selectedMap, setSelectedMap] = useState(cities[0].name);
  const [swiper, setSwiper] = useState(null);
  const [mapCenter, setMapCenter] = useState(cities[0].coords);
  const [mapKey, setMapKey] = useState(0);

  const menuRef = useRef(null);
  const mapRef = useRef(null);
  const ymapsRef = useRef(null);
  const swiperContainerRef = useRef(null);

  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (swiper) {
      const idx = cities.findIndex((c) => c.name === selectedMap);
      if (idx >= 0) swiper.slideTo(idx);
    }
    const coords = cities.find((c) => c.name === selectedMap)?.coords || [55.783, 37.5804];
    setMapCenter(coords);
    setMapKey((k) => k + 1);
  }, [selectedMap, swiper]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportHeight(window.innerHeight);
      setIsMobile(window.innerWidth <= 767);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  const handleCityClick = useCallback((city) => setSelectedMap(city.name), []);

  const mapOptions = useMemo(
    () => (window.innerWidth <= 767 ? { suppressMapOpenBlock: true, suppressMapOpenBlockKey: 'ctrlKey' } : {}),
    []
  );

  const centerWithSidebarSafe = useCallback(() => {
    const map = mapRef.current;
    const ymaps = ymapsRef.current;
    if (!map || !ymaps || !mapCenter) return;

    const w = window.innerWidth;
    const isDesktop = w >= 1025;

    if (isDesktop) {
      try {
        const zoom = map.getZoom ? map.getZoom() : 11;
        if (map.panTo) {
          map.panTo(mapCenter, { flying: false, duration: 0 });
        } else if (map.setCenter) {
          map.setCenter(mapCenter, zoom);
        }
      } catch (e) {
        console.warn('Desktop map centering error:', e);
      }
      return;
    }

    const left = 0;
    const top = menuRef.current ? menuRef.current.offsetHeight : 0;

    try {
      const margins = [top, 0, 0, left];
      if (map.margin && map.margin.setDefaultMargin) {
        map.margin.setDefaultMargin(margins);
      } else if (map.options && map.options.set) {
        map.options.set('margin', margins);
      }

      const zoom = map.getZoom ? map.getZoom() : 11;
      const projection = map.options.get && map.options.get('projection');

      if (projection && projection.toGlobalPixels && projection.fromGlobalPixels && top > 0) {
        const global = projection.toGlobalPixels(mapCenter, zoom);
        const shiftedGlobal = [global[0], global[1] - top / 2];
        const shiftedCenter = projection.fromGlobalPixels(shiftedGlobal, zoom);

        if (map.panTo) {
          map.panTo(shiftedCenter, { flying: false, duration: 0 });
        } else if (map.setCenter) {
          map.setCenter(shiftedCenter, zoom);
        }
      } else {
        if (map.panTo) {
          map.panTo(mapCenter, {
            flying: false,
            duration: 0,
            useMapMargin: true,
          });
        } else if (map.setCenter) {
          map.setCenter(mapCenter, zoom, { useMapMargin: true });
        }
      }
    } catch (e) {
      console.warn('Map fallback error:', e);
    }
  }, [mapCenter]);

  const ensureSwiperVisible = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!isMobile) return;

    const swiperEl = swiperContainerRef.current;
    if (!swiperEl) return;

    const rect = swiperEl.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;

    const overflow = rect.bottom - vh;
    if (overflow > 0) {
      window.scrollBy({
        top: overflow + 8,
        behavior: 'auto',
      });
    }
  }, [isMobile]);

  useEffect(() => {
    centerWithSidebarSafe();

    const onResize = () => {
      centerWithSidebarSafe();
      ensureSwiperVisible();
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [centerWithSidebarSafe, ensureSwiperVisible]);

  useEffect(() => {
    if (!isMobile) return;
    const t = setTimeout(() => {
      ensureSwiperVisible();
    }, 400);
    return () => clearTimeout(t);
  }, [isMobile, ensureSwiperVisible]);

  const { address, phone, mail, hour } = cityInfo[selectedMap];

  return (
    <>
      <Helmet>
        <title>MARKS GROUP</title>
      </Helmet>

      <div className={styles.main_contact}>
        <div className={styles.menu_block} ref={menuRef}>
          <div className={styles.menu_span}>Стать клиентом или&nbsp;партнёром</div>
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
            Режим работы &nbsp;&bull;&nbsp; Пн.&nbsp;&mdash; Пт.&nbsp;10.00&mdash;19.00
            {selectedMap !== 'Москва' && selectedMap !== 'Санкт-Петербург' && selectedMap !== 'Воронеж' && (
              <> &nbsp;&bull;&nbsp; {hour}</>
            )}
          </div>

          <div className={styles.menu_pr}>
            По&nbsp;вопросам PR, публикаций в&nbsp;СМИ, участия в&nbsp;конференциях:
            <br />
            <Link to="mailto:pr@marksgroup.ru" className={styles.menu_pr_mail}>
              pr@marksgroup.ru
            </Link>
          </div>

          <div className={styles.menu_office_name}>У нас есть офисы по всему материку!</div>

          <div className={styles.menu_button_group}>
            {cities.map((city) => (
              <button
                key={city.name}
                className={`${styles.menu_button} ${selectedMap === city.name ? styles.menu_button_active : ''}`}
                onClick={() => handleCityClick(city)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <p className={styles.menu_button_city}>{city.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div
          id="contacts-map"
          className={styles.map_block}
          style={isMobile ? { height: `${viewportHeight}px` } : undefined}>
          <YMaps>
            <Map
              key={mapKey}
              defaultState={{ center: mapCenter, zoom: 11 }}
              width="100%"
              height="100%"
              query={{ apiKey }}
              options={mapOptions}
              instanceRef={(ref) => {
                mapRef.current = ref;
              }}
              onLoad={(ymaps) => {
                ymapsRef.current = ymaps;
                setTimeout(() => {
                  centerWithSidebarSafe();
                  ensureSwiperVisible();
                }, 0);
              }}>
              <Placemark
                geometry={mapCenter}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: `data:image/svg+xml,${encodeURIComponent(customMarkerSVG)}`,
                  iconImageSize: [64, 64],
                }}
              />
            </Map>
          </YMaps>

          <div className={styles.mapTintBase} />
          <div className={styles.mapTintWarm} />

          <div ref={swiperContainerRef} className={styles.mySwiper}>
            <Swiper onSwiper={setSwiper} slidesPerView="auto" spaceBetween={10}>
              {cities.map((city) => (
                <SwiperSlide
                  key={city.name}
                  className={`${styles.slider_menu_button} ${
                    selectedMap === city.name ? styles.slider_menu_button_active : ''
                  }`}
                  onClick={() => handleCityClick(city)}>
                  <p className={styles.slider_button_city}>{city.name}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <style>{`
        [class*="ymaps-2"][class*="-ground-pane"] {
          -webkit-filter: grayscale(80%) brightness(100%);
        }
      `}</style>
    </>
  );
}

export default React.memo(Contacts);