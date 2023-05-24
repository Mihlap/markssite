import React, { useLayoutEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from './Mapbox.module.css';



const Mapbox3D = () => {

  const apiKey = process.env.REACT_APP_API_KEY;
  
  mapboxgl.accessToken = apiKey;

  useLayoutEffect(() => {
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/anna02/clgz2fy0200hg01qu5tb8a6is',
      center: [37.581, 55.783], 
      zoom: 15.5,
      pitch: 45,
      bearing: 10,
      container: 'map', 
      antialias: true,
      // attributionControl: false,
    });
    map.scrollZoom.disable();
    new mapboxgl.Marker({color: '#FF7F6A'})
    .setLngLat([37.5804, 55.783])
    .addTo(map);
    
    map.addControl(new mapboxgl.NavigationControl());
     }, []);
  
  return (
    <div className={styles.map}>
       <div id="map" style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: '7px' }} />
    </div>
  )
}

export default Mapbox3D;

