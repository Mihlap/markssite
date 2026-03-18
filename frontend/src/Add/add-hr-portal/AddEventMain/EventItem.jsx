import React from 'react';
import {UiMarksEntityRow} from '../../ui'
import styles from '../../style/style-card.module.scss';

const getRole = (user) => {
  if (['obezyankaa', 'Pokemon'].includes(user?.name)) return 'admin';
  return 'manager';
};

const EventItem = ({
  el,
  index,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleLookClick,
  handleEditClick,
  handleDeleteModalOpenEvent,
  deleteModalStateEvent,
  handleDeleteModalCloseEvent,
  handleFormDeleteEvent,
  user,
}) => (
  <div
    draggable
    onDragStart={(e) => handleDragStart(e, index)}
    onDragOver={(e) => handleDragOver(e)}
    onDrop={(e) => handleDrop(e, index)}>
    <UiMarksEntityRow
      title={el.title}
      id={el.id}
      visible="event"
      role={getRole(user)}
      hidden={el.hidden}
      onToggle={() => handleLookClick(el.id)}
      onEdit={() => handleEditClick(el.id)}
      onDelete={() => handleDeleteModalOpenEvent(el.id)}
    />

    {deleteModalStateEvent[el.id] && (
      <div className={styles.delete_modal_container}>
        <div className={styles.delete_modal_block}>
          <div className={styles.delete_modal_block__title}>
            Вы точно хотите удалить
            <br />
            мероприятие «{el.title}»?
          </div>
          <p className={styles.delete_modal_block__text}>Удаленное мероприятие вернуть будет невозможно</p>
          <div className={styles.button_block}>
            <button className={styles.button_block__cancel} onClick={() => handleDeleteModalCloseEvent(el.id)} />
            <button className={styles.button_block__save} onClick={() => handleFormDeleteEvent(el.id)} />
          </div>
          <button
            className={styles.delete_modal_block__close_button}
            onClick={() => handleDeleteModalCloseEvent(el.id)}
          />
        </div>
      </div>
    )}
  </div>
);

export default EventItem;
