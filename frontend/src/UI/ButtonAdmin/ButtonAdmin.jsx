import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../Header/Header.module.css';

export default function ButtonAdmin({ user, handleMouseEnter, handleMouseLeave }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('selectedItem');
    setData(storedData);
  }, []);
  return (
    <>
      {user ? (
        <NavLink
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={styles.preview_mode}
          to={`/admin/${data}`}
        >
          <div className={styles.preview_title}>Режим предпросмотра</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="icon / 24 /  arrow /  actively">
              <rect x="24" width="24" height="24" rx="12" transform="rotate(90 24 0)" fill="#F6F6F6" />
              <g id="Group 4653">
                <path id="Vector 30" d="M17 7L12 12L17 17" stroke="#75BBFD" />
                <path id="Vector 31" d="M7 7L12 12L7 17" stroke="#75BBFD" />
              </g>
            </g>
          </svg>
        </NavLink>
      ) : null}
    </>
  );
}
