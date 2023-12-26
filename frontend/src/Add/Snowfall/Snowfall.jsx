import React, { useEffect, useState } from "react";
import "./Snowfall.scss";

const Snowfall = () => {
  const [showSnowfall, setShowSnowfall] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("snowfallShown")) {
      setShowSnowfall(true);
      localStorage.setItem("snowfallShown", "true");
    }
  }, []);

  if (!showSnowfall) {
    return null;
  }
  // Функция для генерации случайной позиции снежинки по горизонтали
  const getRandomLeft = () => {
    const screenWidth = window.innerWidth;
    return Math.floor(Math.random() * screenWidth) + "px";
  };

  // Функция для генерации случайной задержки начала анимации снежинки
  const getRandomAnimationDelay = () => {
    return Math.random() * 30 + "s"; // Задержка до 30 секунд
  };

  return (
    <div className="snowfall-container active">
      {[...Array(300)].map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: getRandomLeft(),
            animationDelay: getRandomAnimationDelay(),
          }}
        ></div>
      ))}
    </div>
  );
};

export default Snowfall;
