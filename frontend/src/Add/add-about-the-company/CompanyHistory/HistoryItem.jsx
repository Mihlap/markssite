import styles from '../../style/style-card.module.scss';
import Edit from '../../icon/Edit.svg';
import Look from '../../icon/eye.svg';
import noLook from '../../icon/eye2.svg';

const HistoryItem = ({
  el,
  index,
  user,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleLookClick,
  handleEditClick,
  deleteModalState,
  handleDeleteModalOpen,
  handleDeleteModalClose,
  handleFormDelete,
}) => (
  <div
    role="listitem"
    draggable
    onDragStart={(e) => handleDragStart(e, index)}
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, index)}
    className={styles.cart_history_container}
    style={{ cursor: 'grab' }}>
  
    <div className={styles.cart_history_container__year}>{el.year}</div>
  
    <div className={styles.cart_history_container__body}>
      <div className={styles.cart_history_container__content}>
        <span className={styles.cart_history_container__title}>{el.title || 'MARKS GROUP'}</span>
        {el.text && <p className={styles.cart_history_container__text}>{el.text}</p>}
      </div>

      <div className={styles.cart_history_container__buttons}>
        {['obezyankaa', 'Pokemon', 'manager', 'hr778'].includes(user?.name) && (
          <>
            <div
              className={`${styles.look_block_history} ${el.hidden ? styles.disabled : ''}`}
              onClick={() => handleLookClick(el.id)}>
              <button className={styles.buttom_look}>
                <label className={styles.label}>
                  <div className={styles.wrapper}>
                    <img src={el.hidden ? noLook : Look} alt={el.hidden ? 'hidden' : 'visible'} />
                  </div>
                </label>
              </button>
            </div>

            <div className={styles.edit_block_history} onClick={() => handleEditClick(el)}>
              <button className={styles.buttom_edit}>
                <label className={styles.label}>
                  <div className={styles.wrapper}>
                    <img src={Edit} alt="edit" />
                  </div>
                </label>
              </button>
            </div>
          </>
        )}

        {['obezyankaa', 'Pokemon'].includes(user?.name) && (
          <div className={styles.del_block_history}>
            <button className={styles.buttom_del} onClick={() => handleDeleteModalOpen(el.id)}>
              <label className={styles.label}>
                <div className={styles.wrapper}>
                  <div className={styles.lid}>
                    <div className={styles.container_vedro}>
                      <div className={styles.triangle_left}></div>
                      <div className={styles.rectangle}></div>
                      <div className={styles.triangle_right}></div>
                    </div>
                  </div>
                  <div className={styles.can}></div>
                  <span>delete</span>
                </div>
              </label>
            </button>
          </div>
        )}
      </div>
    </div>
 
    {deleteModalState[el.id] && (
      <div className={styles.delete_modal_container}>
        <div className={styles.delete_modal_block}>
          <div className={styles.delete_modal_block__title}>
            Вы точно хотите удалить
            <br />
            запись за {el.year} год?
          </div>
          <p className={styles.delete_modal_block__text}>Если вы удалите запись, вернуть её будет невозможно.</p>
          <div className={styles.button_block}>
            <button className={styles.button_block__cancel} onClick={() => handleDeleteModalClose(el.id)} />
            <button className={styles.button_block__save} onClick={() => handleFormDelete(el.id)} />
          </div>
          <button className={styles.delete_modal_block__close_button} onClick={() => handleDeleteModalClose(el.id)} />
        </div>
      </div>
    )}
  </div>
);

export default HistoryItem;
