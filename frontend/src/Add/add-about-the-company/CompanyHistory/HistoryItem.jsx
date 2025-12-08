import { memo } from 'react';
import layoutStyles from '../../style/style-card.module.scss';
import historyStyles from './CompanyHistory.module.scss';

import Edit from '../../icon/Edit.svg';
import Look from '../../icon/eye.svg';
import noLook from '../../icon/eye2.svg';
import DragIcon from '../../icon/drag&drop.svg';

function HistoryItem({
  el,
  index,
  user,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleLookClick,
  handleEditClick,
  isDeleteOpen,
  handleDeleteModalOpen,
  handleDeleteModalClose,
  handleFormDelete,
}) {
  const canEdit = ['obezyankaa', 'Pokemon', 'manager', 'hr778'].includes(user?.name);
  const canDelete = ['obezyankaa', 'Pokemon'].includes(user?.name);

  return (
    <div
      role="listitem"
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      className={`${historyStyles.item} ${historyStyles.draggable}`}>
      <div className={historyStyles.body}>
        <div className={historyStyles.year}>{el.year}</div>
        <div className={historyStyles.content}>
          <span className={historyStyles.title}>{el.title || 'MARKS GROUP'}</span>
        </div>

        <div className={historyStyles.buttons}>
          {canEdit && (
            <>
              <div
                className={`${historyStyles.lookBlock} ${el.hidden ? historyStyles.disabled : ''}`}
                onClick={() => handleLookClick(el.id)}>
                <button className={layoutStyles.buttom_look} type="button">
                  <label className={layoutStyles.label}>
                    <div className={layoutStyles.wrapper}>
                      <img src={el.hidden ? noLook : Look} alt={el.hidden ? 'hidden' : 'visible'} />
                    </div>
                  </label>
                </button>
              </div>

              <div className={historyStyles.editBlock} onClick={() => handleEditClick(el)}>
                <button className={layoutStyles.buttom_edit} type="button">
                  <label className={layoutStyles.label}>
                    <div className={layoutStyles.wrapper}>
                      <img src={Edit} alt="edit" />
                    </div>
                  </label>
                </button>
              </div>
            </>
          )}

          {canDelete && (
            <div className={historyStyles.deleteBlock}>
              <button className={layoutStyles.buttom_del} type="button" onClick={() => handleDeleteModalOpen(el.id)}>
                <label className={layoutStyles.label}>
                  <div className={layoutStyles.wrapper}>
                    <div className={layoutStyles.lid}>
                      <div className={layoutStyles.container_vedro}>
                        <div className={layoutStyles.triangle_left}></div>
                        <div className={layoutStyles.rectangle}></div>
                        <div className={layoutStyles.triangle_right}></div>
                      </div>
                    </div>
                    <div className={layoutStyles.can}></div>
                    <span>delete</span>
                  </div>
                </label>
              </button>
            </div>
          )}
        </div>

        <div className={historyStyles.dragHandle}>
          <img src={DragIcon} alt="drag and drop" />
        </div>
      </div>

      {isDeleteOpen && (
        <div className={layoutStyles.delete_modal_container}>
          <div className={layoutStyles.delete_modal_block}>
            <div className={layoutStyles.delete_modal_block__title}>
              Вы точно хотите удалить
              <br />
              запись за {el.year} год?
            </div>
            <p className={layoutStyles.delete_modal_block__text}>
              Если вы удалите запись, вернуть её будет невозможно.
            </p>
            <div className={layoutStyles.button_block}>
              <button
                className={layoutStyles.button_block__cancel}
                type="button"
                onClick={() => handleDeleteModalClose(el.id)}
              />
              <button
                className={layoutStyles.button_block__save}
                type="button"
                onClick={() => handleFormDelete(el.id)}
              />
            </div>
            <button
              className={layoutStyles.delete_modal_block__close_button}
              type="button"
              onClick={() => handleDeleteModalClose(el.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(HistoryItem);
