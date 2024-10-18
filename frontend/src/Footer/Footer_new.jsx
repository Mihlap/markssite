import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Footer_new.module.scss';

const Footer_new = () => {
  const [text, setText] = useState('Обсудим\u00A0ваш\u00A0проект');
  const [hoveredChars, setHoveredChars] = useState([]);
  const [hoveredFooterChars, setHoveredFooterChars] = useState([]);
  const circleRef = useRef(null);
  const charRefs = useRef([]);
  const footerCharRefs = useRef([]);
  const intervalRef = useRef(null);

  const footerItems = [
    'Офис Москва',
    '+7 (495) 120-12-26',
    'Москва 3-я Ямского Поля, дом 20 строение 1 офис 704',
    'mail@marks',
    'Сотрудникам',
    'Документы',
  ];

  const handleMouseEnter = useCallback(() => {
    setText('Осталось\u00A0только\u00A0нажать');
    updateHoveredElements();
    intervalRef.current = setInterval(updateHoveredElements, 50);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setText('Обсудим\u00A0ваш\u00A0проект');
    setHoveredChars([]);
    setHoveredFooterChars([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const rectangleCircleOverlap = useCallback((rect, circle) => {
    const rectX = rect.left;
    const rectY = rect.top;
    const rectW = rect.right - rect.left;
    const rectH = rect.bottom - rect.top;

    const circleX = circle.cx;
    const circleY = circle.cy;
    const radius = circle.r;

    const closestX = Math.max(rectX, Math.min(circleX, rectX + rectW));
    const closestY = Math.max(rectY, Math.min(circleY, rectY + rectH));

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    return distanceX * distanceX + distanceY * distanceY < radius * radius;
  }, []);

  const updateHoveredElements = useCallback(() => {
    if (!circleRef.current) return;

    const circleRect = circleRef.current.getBoundingClientRect();
    if (circleRect.width <= 100) {
      setHoveredChars([]);
      setHoveredFooterChars([]);
      return;
    }

    const circleRadius = circleRect.width / 2;
    const circleCenterX = circleRect.left + circleRadius;
    const circleCenterY = circleRect.top + circleRadius;

    const updatedHoveredChars = charRefs.current.reduce((acc, char, index) => {
      if (!char) return acc;
      const charRect = char.getBoundingClientRect();
      if (
        rectangleCircleOverlap(charRect, {
          cx: circleCenterX,
          cy: circleCenterY,
          r: circleRadius,
        })
      ) {
        acc.push(index);
      }
      return acc;
    }, []);

    const updatedHoveredFooterChars = footerCharRefs.current.reduce((acc, char, index) => {
      if (!char) return acc;
      const charRect = char.getBoundingClientRect();
      if (
        rectangleCircleOverlap(charRect, {
          cx: circleCenterX,
          cy: circleCenterY,
          r: circleRadius,
        })
      ) {
        acc.push(index);
      }
      return acc;
    }, []);

    setHoveredChars((prev) => (prev.length !== updatedHoveredChars.length ? updatedHoveredChars : prev));
    setHoveredFooterChars((prev) =>
      prev.length !== updatedHoveredFooterChars.length ? updatedHoveredFooterChars : prev
    );
  }, [rectangleCircleOverlap]);

  useEffect(() => {
    const handleResizeOrScroll = () => updateHoveredElements();
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateHoveredElements]);

  let footerCharIndex = 0;

  return (
    <div className={styles.footer}>
      <div className={styles['footer-text-wrapper']} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className={styles['footer-text']}>
          {text.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => (charRefs.current[index] = el)}
              className={`${styles['footer-char']} ${hoveredChars.includes(index) ? styles['inside-circle'] : ''}`}>
              {char}
            </span>
          ))}
        </div>
        <div className={styles['footer-circle']} ref={circleRef}></div>
      </div>

      <div className={styles['footer-left']}>
        {footerItems.slice(0, 3).map((item, itemIndex) => (
          <div className={styles['footer-item']} key={itemIndex}>
            {item.split('').map((char, index) => {
              const totalIndex = footerCharIndex++;
              return (
                <span
                  key={totalIndex}
                  ref={(el) => (footerCharRefs.current[totalIndex] = el)}
                  className={`${styles['footer-char']} ${
                    hoveredFooterChars.includes(totalIndex) ? styles['inside-circle'] : ''
                  }`}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles['footer-right']}>
        {footerItems.slice(3).map((item, itemIndex) => (
          <div className={styles['footer-item']} key={itemIndex + 3}>
            {item.split('').map((char, index) => {
              const totalIndex = footerCharIndex++;
              return (
                <span
                  key={totalIndex}
                  ref={(el) => (footerCharRefs.current[totalIndex] = el)}
                  className={`${styles['footer-char']} ${
                    hoveredFooterChars.includes(totalIndex) ? styles['inside-circle'] : ''
                  }`}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer_new;
