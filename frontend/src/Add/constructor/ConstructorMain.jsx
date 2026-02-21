import React, { useState } from 'react';
import { UiMarksConstructorWrap, UiMarksButton } from '../ui';

import s from './Styles.module.css';

export default function ConstructorMain({ items, onSelect, children }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = (item) => {
    onSelect?.(item);
    // setPickerOpen(false);
  };

  return (
    <>
      {pickerOpen ? (
        <UiMarksConstructorWrap>
          {items?.map((el) => {
            const Icon = el.icon;
            return (
              <button className={s.button} type="button" onClick={() => handleSelect(el)}>
                <Icon />
              </button>
            );
          })}
        </UiMarksConstructorWrap>
      ) : (
        <UiMarksButton defaultStyle="constructor" size="large" icon onClick={() => setPickerOpen(true)}>
          Добавить блок из библиотеки
        </UiMarksButton>
      )}
      {children}
    </>
  );
}
