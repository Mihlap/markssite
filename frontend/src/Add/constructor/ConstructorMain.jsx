import React, { useState } from 'react';
import { UiMarksConstructorWrap, UiMarksButton } from '../ui';

import s from './Styles.module.css';

export default function ConstructorMain({ items, onSelect, children }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setPickerOpen(false);
  };

  return (
    <>
      {children}

      {pickerOpen ? (
        <UiMarksConstructorWrap>
          <div className={s.picker}>
            {items.map((item) => (
              <div key={item.id} className={s.picker__item} onClick={() => handleSelect(item)}>
                <item.icon />
                <span className={s.picker__label}>{item.label}</span>
              </div>
            ))}
          </div>
        </UiMarksConstructorWrap>
      ) : (
        <UiMarksButton defaultStyle="constructor" size="large" icon onClick={() => setPickerOpen(true)}>
          Добавить блок из библиотеки
        </UiMarksButton>
      )}
    </>
  );
}
