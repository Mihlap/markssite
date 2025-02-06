import React, { useEffect, useState } from 'react';
import './Snowfall.scss';

const Snowfall = () => {
  const [showSnowfall, setShowSnowfall] = useState(false);

  useEffect(() => {
    const snowfallShown = localStorage.getItem('snowfallShown');
    if (!snowfallShown) {
      setShowSnowfall(true);
      localStorage.setItem('snowfallShown', 'true');
    } else {
      setShowSnowfall(true);
    }
  }, []);

  if (!showSnowfall) return null;

  const getRandomLeft = () => `${Math.random() * window.innerWidth}px`;
  const getRandomAnimationDelay = () => `${Math.random() * 10}s`;

  return (
    <div className="snowfall_container active">
      {[...Array(300)].map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: getRandomLeft(),
            animationDelay: getRandomAnimationDelay(),
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
