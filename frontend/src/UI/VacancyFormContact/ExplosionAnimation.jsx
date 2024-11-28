import React from 'react';
import styles from './ExplosionAnimation.module.scss';

const ExplosionAnimation = () => {
  return (
    <div className={styles.explosionContainer}>
      {[...Array(8)].map((_, index) => {
        const angle = (index * 360) / 8;
        const x = Math.cos((angle * Math.PI) / 180);
        const y = Math.sin((angle * Math.PI) / 180);

        return (
          <div
            key={index}
            className={styles.explosionDot}
            style={{
              '--x': x,
              '--y': y,
            }}></div>
        );
      })}
    </div>
  );
};

export default ExplosionAnimation;
