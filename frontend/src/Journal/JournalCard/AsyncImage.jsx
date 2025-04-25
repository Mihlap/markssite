import React, { useState, useEffect } from 'react';
import styles from './AsyncImage.module.scss';

export default function AsyncImage({ src, alt = '', wrapperClass = '', imgClass = '', ...props }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <div className={`${wrapperClass} ${!loaded ? styles.loading : ''}`}>
      {loaded && <img src={src} alt={alt} className={imgClass} {...props} />}
    </div>
  );
}
