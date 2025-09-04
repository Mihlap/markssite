import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToggleStateForButton3Async, updateToggleStateForButton3Async } from '../../store/Slice/toggleSlice';
import { deleteUser, getAllUserNames } from '../../store/Slice/authSlice';

import styles from './Applications.module.scss';
import cardStyles from '../style/style-card.module.scss';

function ToggleButton({ isActive, onClick }) {
  return (
    <div className={`${styles.toggleButton} ${isActive ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.circle}></div>
    </div>
  );
}

function UsersList({ users, onAskDelete, deleteModalState, onClose, onConfirm }) {
  return (
    <ul className={styles.Applications__list_text}>
      {users.map((user) => (
        <li key={user.id} className={styles.Applications__hideTextWrapper}>
          <span className={styles.Applications__item_text}>
           {user.userName}
          </span>

          {user.userName !== 'Pokemon' && user.userName !== 'obezyankaa' && (
            <>
              <button
                type="button"
                className={styles.Applications__delete_btn}
                onClick={() => onAskDelete(user.id, user.userName)}>
                Удалить
              </button>
         
              {deleteModalState[user.id]?.open && (
                <div className={cardStyles.delete_modal_container}>
                  <div className={cardStyles.delete_modal_block}>
                    <div className={cardStyles.delete_modal_block__title}>
                      Вы точно хотите удалить пользователя <br /> «{deleteModalState[user.id].name}»?
                    </div>
                    <p className={cardStyles.delete_modal_block__text}>Удалённого пользователя нельзя будет вернуть</p>

                    <div className={cardStyles.button_block}>
                      <button
                        className={`${cardStyles.button_block__cancel} ${cardStyles.delete_modal_button_cancel}`}
                        onClick={() => onClose(user.id)}
                      />
                      <button
                        className={`${cardStyles.button_block__save} ${cardStyles.delete_modal_button_delete}`}
                        onClick={() => onConfirm(user.id)}
                      />
                    </div>

                    <button className={cardStyles.delete_modal_block__close_button} onClick={() => onClose(user.id)} />
                  </div>
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Applications() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const isActiveForButton3 = useSelector((state) => state.toggle.isActiveForButton3);
  const userNames = useSelector((state) => state.auth.userNames);
  const [deleteModalState, setDeleteModalState] = useState({});

  useEffect(() => {
    dispatch(fetchToggleStateForButton3Async());
    dispatch(getAllUserNames());
  }, [dispatch]);

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateForButton3Async(!isActiveForButton3));
  }, [dispatch, isActiveForButton3]);

  const handleDeleteModalOpen = useCallback((id, name) => {
    setDeleteModalState((prev) => ({ ...prev, [id]: { open: true, name } }));
  }, []);

  const handleDeleteModalClose = useCallback((id) => {
    setDeleteModalState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleConfirmDeleteUser = useCallback(
    (id) => {
      dispatch(deleteUser(id)).then(() => {
        dispatch(getAllUserNames());
        handleDeleteModalClose(id);
      });
    },
    [dispatch, handleDeleteModalClose]
  );

  return (
    <section className={styles.Applications}>
      <div className={styles.Applications__titleBlock}>
        <div className={styles.Applications__title}>Управление</div>
        {/* <div className={styles.Applications__hide_block}>
          <div className={styles.Applications__hide_text}>Открыть окно для регистрации</div>
          <ToggleButton isActive={isActiveForButton3} onClick={toggleActive} />
        </div> */}
      </div>

      <div className={styles.Applications__container}>
        <div>
          {currentUser ? (
            <>
              <span className={styles.Applications__text}>Текущий пользователь в админке:</span>
              <div className={styles.Applications__status_block}>
                <span className={styles.Applications__item_statusText}>{currentUser.name}</span>
                <div className={styles.Applications__status} />
              </div>
            </>
          ) : (
            <p>Пользователь не авторизован</p>
          )}
        </div>

        <div>
          <div className={styles.Applications__hide_text}>Зарегистрированные пользователи:</div>
          {userNames && userNames.length > 0 && (
            <UsersList
              users={userNames}
              onAskDelete={handleDeleteModalOpen}
              deleteModalState={deleteModalState}
              onClose={handleDeleteModalClose}
              onConfirm={handleConfirmDeleteUser}
            />
          )}
        </div>
      </div>
    </section>
  );
}
