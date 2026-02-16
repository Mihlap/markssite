import React from 'react';
import s from './Styles.module.css';

export default function UIGrayWrap({ customStyles, children }) {
  return (
    <div
      style={{
        ...customStyles,
      }}
      className={s.bg}
    >
      {children}
    </div>
  );
}
