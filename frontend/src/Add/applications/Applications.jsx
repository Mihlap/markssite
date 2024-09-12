import React, { useEffect, useCallback } from 'react';
import styles from './Applications.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToggleStateForButton3Async, updateToggleStateForButton3Async } from '../../store/Slice/toggleSlice';
import { deleteUser, getAllUserNames } from '../../store/Slice/authSlice';

function ToggleButton({ isActive, onClick }) {
  return (
    <div className={`${styles.toggleButton} ${isActive ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.circle}></div>
    </div>
  );
}

function UsersList({ users, onDeleteUser }) {
  return (
    <ul className={styles.Applications__list_text}>
      {users.map((user) => (
        <li className={styles.Applications__item_text} key={user.id}>
          {user.id}: {user.userName}
          {user.userName !== 'Pokemon' && user.userName !== 'obezyankaa' && (
            <button className={styles.Applications__delete_btn} onClick={() => onDeleteUser(user.id, user.userName)}>
              Удалить
            </button>
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

  useEffect(() => {
    dispatch(fetchToggleStateForButton3Async());
    dispatch(getAllUserNames());
  }, [dispatch]);

  const handleDeleteUser = useCallback(
    (userId, userName) => {
      if (window.confirm(`Вы уверены, что хотите удалить пользователя ${userName}?`)) {
        dispatch(deleteUser(userId)).then(() => {
          dispatch(getAllUserNames());
        });
      }
    },
    [dispatch]
  );

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateForButton3Async(!isActiveForButton3));
  }, [dispatch, isActiveForButton3]);

  return (
    <section className={styles.Applications}>
      <div className={styles.Applications__title}>Управление</div>
      <div className={styles.Applications__container}>
        <div className={styles.Applications__hide_block}>
          <div className={styles.Applications__hide_text}>Открыть окно для регистрации</div>
          <ToggleButton isActive={isActiveForButton3} onClick={toggleActive} />
        </div>
        <div>
          {currentUser ? (
            <>
              <span className={styles.Applications__hide_text}>Текущий пользователь в админке:</span>
              <div className={styles.Applications__status_block}>
                <span className={styles.Applications__item_text}>{currentUser.name}</span>
                <div className={styles.Applications__status} />
              </div>
            </>
          ) : (
            <p>Пользователь не авторизован</p>
          )}
        </div>
        <div>
          <div className={styles.Applications__hide_text}>Пользователи, которые зарегистрированы</div>
          {userNames && <UsersList users={userNames} onDeleteUser={handleDeleteUser} />}
        </div>
      </div>
    </section>
  );
}
