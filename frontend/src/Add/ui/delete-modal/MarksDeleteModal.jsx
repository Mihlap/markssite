import { UiMarksButton, UiMarksHeading } from '..';
import s from './styles.module.css';

export default function MarksDeleteModal({ isOpen, title, description, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={s.modal}>
      <div className={s.wrap}>
        <div className={s.wrapDesc}>
        <UiMarksHeading size="2xl">{title}</UiMarksHeading>
        <p className={s.desc}>{description}</p>
        </div>
        <div className={s.wrapBtn}>
          <UiMarksButton onClick={onConfirm}>Удалить</UiMarksButton>
          <UiMarksButton defaultStyle="gray" onClick={onClose}>
            Отмена
          </UiMarksButton>
        </div>
        <button className={s.close} onClick={onClose} />
      </div>
    </div>
  );
}
