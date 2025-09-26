import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import adminStyles from '../../Add/style/style-card.module.scss';

export default function ExitConfirmModal({
  open,
  onCancel,
  onLeave,
  title = 'Вы точно хотите выйти без сохранения?',
  text = 'Вернуть заполнение будет невозможно',
  closeOnOverlay = true,
  closeOnEsc = true,
  mountTo,
  classNames = {},
}) {
  const cn = {
    container: classNames.container || adminStyles.exit_modal_container,
    block: classNames.block || adminStyles.exit_modal_block,
    closeBtn: classNames.closeBtn || adminStyles.exit_modal_block__close_button,
    title: classNames.title || adminStyles.exit_modal_block__title,
    text: classNames.text || adminStyles.exit_modal_block__text,
    btnRow: classNames.btnRow || adminStyles.button_block,
    btnCancel: classNames.btnCancel || `${adminStyles.button_block__cancel} ${adminStyles.exit_modal_button_cancel}`,
    btnLeave: classNames.btnLeave || `${adminStyles.button_block__save} ${adminStyles.exit_modal_button_leave}`,
  };

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e) => e.key === 'Escape' && onCancel?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc, onCancel]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const mountNode = mountTo || (typeof document !== 'undefined' ? document.body : null);

  if (!open || !mountNode) return null;

  const modal = (
    <div
      className={cn.container}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (!closeOnOverlay) return;
        if (e.target === e.currentTarget) onCancel?.();
      }}>
      <div className={cn.block} onClick={(e) => e.stopPropagation()}>
        <button className={cn.closeBtn} onClick={onCancel} aria-label="Закрыть" />
        <div className={cn.title}>{title}</div>
        <p className={cn.text}>{text}</p>
        <div className={cn.btnRow}>
          <button className={cn.btnCancel} onClick={onCancel} />
          <button className={cn.btnLeave} onClick={onLeave} />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, mountNode);
}
