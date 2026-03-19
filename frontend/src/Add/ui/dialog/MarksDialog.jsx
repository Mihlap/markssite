import React, { useRef, useEffect } from 'react';
import { UiMarksButton, UiMarksSpinner, UiMarksAlert, UiMarksHeading } from '../index.js';

import s from './Styles.module.css';

export default function MarksModal({ isOpen, onClose, onSave, isSaveDisabled = true, title, children, isLoading = false, isExit = false, onExitConfirm, onExitCancel, nameSpinner }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current.close();
      document.body.style.overflow = ''; 
    }
  }, [isOpen]);

  return (
    <dialog className={`${s.dialog} ${isLoading ? s.dialogLoading : ''}`} ref={dialogRef} onClose={onClose}>
      {isLoading ? (
        <UiMarksSpinner title={nameSpinner} />
      ) : (
        <>
          {isExit && (
            <UiMarksAlert
              title="Вы точно хотите выйти без сохранения?"
              desc="Вернуть заполнение будет невозможно"
              onConfirm={onExitConfirm}
              onCancel={onExitCancel}
            />
          )}
          <div className={s.wrap} style={isExit ? { display: 'none' } : undefined}>
            <div className={s.title}>
              <UiMarksHeading size="2xl"> {title && title.length > 0 ? title : 'No Title'}</UiMarksHeading>
              <button className={s.close_button} onClick={onClose} />
            </div>
            <div className={s.content}>{children}</div>
            <div className={s.buttons}>
              <UiMarksButton disabled={isSaveDisabled || isLoading} onClick={onSave}>
                Сохранить
              </UiMarksButton>
              <UiMarksButton defaultStyle="gray" disabled={isLoading} onClick={onClose}>
                Отмена
              </UiMarksButton>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
