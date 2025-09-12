import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../style/style-card.module.scss';
import { createStaffAsync, updateStaffAsync } from '../../store/Slice/StaffSliceNew';

const CATEGORY_OPTIONS = ['Руководство', 'Научно-техническое сопровождение', 'HR'];

export default function StaffForm({ initial, onClose }) {
  const dispatch = useDispatch();

  const [name, setName] = useState(initial?.name || '');
  const [position, setPosition] = useState(initial?.position || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [profileContent, setProfileContent] = useState(initial?.profileContent || '');
  const [contentFormat, setContentFormat] = useState(initial?.contentFormat || 'markdown');
  const [img, setImg] = useState(initial?.img || '');
  const [imgFile, setImgFile] = useState(null);
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [sortIndex, setSortIndex] = useState(initial?.sortIndex ?? 0);
  const [category, setCategory] = useState(Array.isArray(initial?.category) ? initial.category : []);

  const isEdit = !!initial?.id;

  useEffect(() => {
    if (!initial) return;
    setName(initial.name || '');
    setPosition(initial.position || '');
    setDescription(initial.description || '');
    setProfileContent(initial.profileContent || '');
    setContentFormat(initial.contentFormat || 'markdown');
    setImg(initial.img || '');
    setIsVisible(initial.isVisible ?? true);
    setSortIndex(initial.sortIndex ?? 0);
    setCategory(Array.isArray(initial.category) ? initial.category : []);
  }, [initial]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const toggleCategory = (val) => {
    setCategory((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    const payload = {
      name: name.trim(),
      position,
      description,
      profileContent,
      contentFormat,
      img,
      imgFile,
      category,
      isVisible,
      sortIndex,
    };

    if (isEdit) {
      await dispatch(updateStaffAsync({ id: initial.id, changes: payload }));
    } else {
      await dispatch(createStaffAsync(payload));
    }
    onClose?.();
  };

  return (
    <form className={styles.formAddProjectClass} onSubmit={onSubmit}>
      <div className={styles.card_components_admin__modal_title}>
        {isEdit ? 'Редактировать сотрудника' : 'Новый сотрудник'}
      </div>

      <label className={styles.form_label}>ФИО</label>
      <input
        className={styles.form_input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Иванов Иван Иванович"
        required
      />

      <label className={styles.form_label}>Должность</label>
      <input
        className={styles.form_input}
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="Должность и описание"
      />

      <label className={styles.form_label}>Фото сотрудника</label>
      <div className={styles.form_row}>
        <input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files?.[0] || null)} />
        <input
          className={styles.form_input}
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="Имя файла на CDN или полный URL"
        />
      </div>

      <label className={styles.form_label}>Категории</label>
      <div className={styles.tags_row}>
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`${styles.card_components_admin__tag} ${category.includes(opt) ? styles.activeTag : ''}`}
            onClick={() => toggleCategory(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <label className={styles.form_label}>Текст описания</label>
      <textarea
        className={styles.form_textarea}
        rows={7}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Нет ограничения по символам"
      />

      <label className={styles.form_label}>Контент профиля (опционально)</label>
      <textarea
        className={styles.form_textarea}
        rows={7}
        value={profileContent}
        onChange={(e) => setProfileContent(e.target.value)}
        placeholder="Markdown/HTML или обычный текст"
      />

      <div className={styles.form_row}>
        <label className={styles.form_checkbox}>
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
          <span>Показывать на сайте</span>
        </label>

        <div className={styles.form_inline_group}>
          <span>Порядок:</span>
          <input
            type="number"
            className={styles.form_input_small}
            value={sortIndex}
            onChange={(e) => setSortIndex(Number(e.target.value) || 0)}
          />
        </div>

        <div className={styles.form_inline_group}>
          <span>Формат:</span>
          <select
            className={styles.form_select}
            value={contentFormat}
            onChange={(e) => setContentFormat(e.target.value)}>
            <option value="markdown">markdown</option>
            <option value="html">html</option>
            <option value="text">text</option>
          </select>
        </div>
      </div>

      <div className={styles.button_block}>
        <button type="button" className={styles.button_block__cancel} onClick={onClose} />
        <button type="submit" className={styles.button_block__save} disabled={!canSave} />
      </div>
    </form>
  );
}
