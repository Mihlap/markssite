import React, { useRef, useEffect } from 'react';
import { UiMarksButton } from '../index.js';

import s from './Styles.module.css';

export default function MarksModal({ isOpen, onClose, onSave, isSaveDisabled = true, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog className={s.dialog} ref={dialogRef} onClose={onClose}>
      <button className={s.close_button} onClick={onClose} />
      <div className={s.title}>{title && title.length > 0 ? title : 'No Title'}</div>
      {children}
      <div className={s.buttons}>
        <UiMarksButton disabled={isSaveDisabled} onClick={onSave}>Сохранить</UiMarksButton>
        <UiMarksButton defaultStyle="gray" onClick={onClose}>
          Отмена
        </UiMarksButton>
      </div>
    </dialog>
  );
}
