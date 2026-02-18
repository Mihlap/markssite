import React from 'react';
import { UiMarksGrayWrap } from '../ui';

import s from './Styles.module.css';

export default function ConstructorBlock({ label, onRemove, children }) {
  return (
    <UiMarksGrayWrap customStyles={{ padding: '24px 16px 32px 16px', position: 'relative' }}>
      <div className={s.block}>
        <button type="button" className={s.block__remove} onClick={onRemove} aria-label="Удалить блок">
          &times;
        </button>
        {label && <div className={s.block__label}>{label}</div>}
        {children}
      </div>
    </UiMarksGrayWrap>
  );
}
