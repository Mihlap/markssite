import React from 'react';
import s from './Styles.module.css';

export default function UIGrayWrap({ customStyles, colorStatus, children, btnClose = false, handlerClick }) {
  return (
    <div
      style={{
        ...customStyles,
      }}
      className={s.bg}>
      {btnClose && (
        <button type="button" data-color-status={colorStatus} onClick={() => handlerClick()} className={s.btnClose} />
      )}
      {children}
    </div>
  );
}
