import React, { useEffect } from 'react';
import { UiMarksButton, UiMarksSpinner, UiMarksAlert, UiMarksHeading } from '../index.js';

import s from './Styles.module.css';

export default function MarksModal({ isOpen, onClose, onSave, isSaveDisabled = true, title, children, isLoading = false, isExit = false, onExitConfirm, onExitCancel, nameSpinner }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={s.backdrop} />
      <div className={`${s.dialog} ${isLoading ? s.dialogLoading : ''}`}>
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
                <UiMarksButton color='blue' size='normal' disabled={isSaveDisabled || isLoading} onClick={onSave}>
                  Сохранить
                </UiMarksButton>
                <UiMarksButton color="gray" size='normal' disabled={isLoading} onClick={onClose}>
                  Отмена
                </UiMarksButton>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
