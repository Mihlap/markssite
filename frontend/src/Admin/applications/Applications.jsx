import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToggleStateForButton3Async, updateToggleStateForButton3Async } from '../../store/Slice/toggleSlice';
import { deleteUser, getAllUserNames } from '../../store/Slice/authSlice';
import { UiMarksDeleteModal, UiMarksSwitch } from '../ui';
import { useAdminUser } from '../hooks/useAdminUser';

import styles from './Applications.module.scss';

function UsersList({ users, onAskDelete, deleteModalState, onClose, onConfirm }) {
  return (
    <ul className={styles.Applications__list_text}>
      {users.map((user) => (
        <li key={user.id} className={styles.Applications__hideTextWrapper}>
          <span className={styles.Applications__item_text}>{user.userName}</span>

          {user.userName !== 'Pokemon' && user.userName !== 'obezyankaa' && (
            <>
              <button
                type="button"
                className={styles.Applications__delete_btn}
                onClick={() => onAskDelete(user.id, user.userName)}>
                Удалить
              </button>

              <UiMarksDeleteModal
                isOpen={!!deleteModalState[user.id]?.open}
                title={
                  <>
                    Вы точно хотите удалить пользователя <br /> <strong>«{deleteModalState[user.id]?.name}»</strong>?
                  </>
                }
                description="Удалённого пользователя нельзя будет вернуть"
                onConfirm={() => onConfirm(user.id)}
                onClose={() => onClose(user.id)}
              />
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
  const { role } = useAdminUser(currentUser);
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
  async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      await dispatch(getAllUserNames());
      handleDeleteModalClose(id);
    } catch (e) {
      console.error('Delete user failed:', e);
    }
  },
  [dispatch, handleDeleteModalClose]
);



  return (
    <section className={styles.Applications}>
      <div className={styles.Applications__titleBlock}>
        <div className={styles.Applications__title}>Управление</div>
        <div className={styles.Applications__hide_block}>
          <div className={styles.Applications__hide_text}>Открыть окно регистрации</div>
          <UiMarksSwitch isActive={isActiveForButton3} onClick={toggleActive} />
        </div>
      </div>

      <div className={styles.Applications__container}>
        <div>
          {currentUser ? (
            <>
              <span className={styles.Applications__text}>Текущий пользователь в админке:</span>
              <div className={styles.Applications__status_block}>
                <span className={styles.Applications__item_statusText}>{role}</span>
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
