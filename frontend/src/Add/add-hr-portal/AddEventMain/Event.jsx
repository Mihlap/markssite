import React from 'react';
import styles from '../../style/style-card.module.scss';
import Edit from '../../icon/Edit.svg';
import Look from '../../icon/eye.svg';
import noLook from '../../icon/eye2.svg';

const Event = ({
  el,
  index,
  isCopied,
  copiedId,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleLookClick,
  handleEditClick,
  handleCopyClick,
  handleDeleteModalOpen,
  deleteModalState,
  handleDeleteModalClose,
  handleFormDelete,
  user,
}) => (
  <div
    draggable
    onDragStart={(e) => handleDragStart(e, index)}
    onDragOver={(e) => handleDragOver(e)}
    onDrop={(e) => handleDrop(e, index)}
    className={styles.cart_vacancy_container}
    style={{ cursor: 'grab' }}
  >
    <div className={styles.cart_vacancy_container__content}>
      <span className={styles.cart_vacancy_container__title}>{el.title}</span>
    </div>
    <div className={styles.cart_vacancy_container__id_block}>
      <div className={styles.cart_vacancy_container__id_text}>id: {el.id}</div>
      {isCopied && el.id === copiedId && (
        <>
          <div className={styles.cart_vacancy_container__copyMessage}>id скопирован</div>
          <div className={styles.cart_vacancy_container__copyButton_img_copy_deffalt} />
        </>
      )}
      <button className={styles.cart_vacancy_container__copyButton} onClick={() => handleCopyClick(el.id)}>
        <div className={styles.cart_vacancy_container__copyButton_img_copy_ok} />
      </button>
    </div>
    <div className={styles.cart_vacancy_container_buttonClick}>
      {['obezyankaa', 'Pokemon', 'hr778'].includes(user?.name) && (
        <>
          <div
            className={`${styles.look_block_vacancy} ${el.hidden ? styles.disabled : ''}`}
            onClick={() => handleLookClick(el.id)}
          >
            <button className={styles.buttom_look}>
              <label htmlFor="look" className={styles.label}>
                <div className={styles.wrapper}>
                  <img src={el.hidden ? noLook : Look} alt={el.hidden ? 'No look' : 'Look'} />
                </div>
              </label>
            </button>
          </div>
          <div
            className={`${styles.edit_block_vacancy} ${styles.edit_block_slide}`}
            onClick={() => handleEditClick(el.id)}
          >
            <button className={styles.buttom_edit}>
              <label htmlFor="edit" className={styles.label}>
                <div className={styles.wrapper}>
                  <img src={Edit} alt={Edit} />
                </div>
              </label>
            </button>
          </div>
        </>
      )}

      {['obezyankaa', 'Pokemon'].includes(user?.name) && (
        <div className={styles.del_block_vacancy}>
          <button className={styles.buttom_del} onClick={() => handleDeleteModalOpen(el.id)}>
            <label htmlFor="delete" className={styles.label}>
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

    <div className={styles.cart_vacancy_container__circle_block}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.cart_vacancy_container__circle}></div>
      ))}
    </div>

    {deleteModalState[el.id] && (
      <div className={styles.delete_modal_container}>
        <div className={styles.delete_modal_block}>
          <div className={styles.delete_modal_block__title}>Вы точно хотите удалить слайд «Слайд {index + 1}»?</div>
          <p className={styles.delete_modal_block__text}>Удаленный слайд вернуть будет невозможно</p>
          <div className={styles.button_block}>
            <button className={styles.button_block__cancel} onClick={() => handleDeleteModalClose(el.id)} />
            <button className={styles.button_block__save} onClick={() => handleFormDelete(el.id)} />
          </div>
          <button
            className={styles.delete_modal_block__close_button}
            onClick={() => handleDeleteModalClose(el.id)}
          ></button>
        </div>
      </div>
    )}
  </div>
);

export default Event;
