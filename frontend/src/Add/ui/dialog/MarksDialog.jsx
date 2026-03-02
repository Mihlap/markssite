import React, { useRef, useEffect } from 'react';
import { UiMarksButton, UiMarksSpinner } from '../index.js';

import s from './Styles.module.css';

export default function MarksModal({ isOpen, onClose, onSave, isSaveDisabled = true, title, children, isLoading = false, nameSpinner }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog className={`${s.dialog} ${isLoading ? s.dialogLoading : ''}`} ref={dialogRef} onClose={onClose}>
      {isLoading ? (
        <UiMarksSpinner title={nameSpinner} />
      ) : (
        <>
          <div className={s.title}>
            {title && title.length > 0 ? title : 'No Title'}
            <button className={s.close_button} onClick={onClose} />
          </div>
          {children}
          <div className={s.buttons}>
            <UiMarksButton disabled={isSaveDisabled || isLoading} onClick={onSave}>
              Сохранить
            </UiMarksButton>
            <UiMarksButton defaultStyle="gray" disabled={isLoading} onClick={onClose}>
              Отмена
            </UiMarksButton>
          </div>
        </>
      )}
    </dialog>
  );
}
