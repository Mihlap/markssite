import React, { useEffect } from "react";
import styles from "./Applications.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchToggleStateForButton3Async,
  updateToggleStateForButton3Async,
} from "../../store/Slice/toggleSlice";
import { deleteUser, getAllUserNames } from "../../store/Slice/authSlice";

export default function Applications() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const isActiveForButton3 = useSelector(
    (state) => state.toggle.isActiveForButton3
  );
  const userNames = useSelector((state) => state.auth.userNames);

  console.log(currentUser);

  useEffect(() => {
    dispatch(fetchToggleStateForButton3Async());
    dispatch(getAllUserNames());
  }, [dispatch]);

  const handleDeleteUser = (userId, userName) => {
    if (
      window.confirm(`Вы уверены, что хотите удалить пользователя ${userName}?`)
    ) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          // После успешного удаления, обновляем список пользователей в состоянии Redux
          dispatch(getAllUserNames());
        });
    }
  };

  const toggleActive = () => {
    dispatch(updateToggleStateForButton3Async(!isActiveForButton3));
  };
  return (
    <section className={styles.Applications}>
      <div className={styles.Applications__title}>Управление</div>
      <div className={styles.Applications__container}>
        <div className={styles.Applications__hide_block}>
          <div className={styles.Applications__hide_text}>
            Открыть роут для регистрации
          </div>
          <div
            className={`${styles.toggleButton} ${
              isActiveForButton3 ? styles.active : ""
            }`}
            onClick={toggleActive}
          >
            <div className={styles.circle}></div>
          </div>
        </div>

        <div>
          {currentUser ? (
            <div>
              <span className={styles.Applications__hide_text}>
                Текущий пользователь в админке:
              </span>{" "}
              <span className={styles.Applications__list_text}>
                {currentUser?.name}
              </span>
            </div>
          ) : (
            <p>Пользователь не авторизован</p>
          )}
        </div>
        <div>
          <div className={styles.Applications__hide_text}>
            Пользователи которые зарегистрированы
          </div>
          <ul className={styles.Applications__list_text}>
            {userNames?.map((user) => (
              <li className={styles.Applications__item_text} key={user.id}>
                {user?.id}: {user?.userName}
                {user?.userName !== "Pokemon" &&
                  user?.userName !== "obezyankaa" && (
                    <button
                      className={styles.Applications__delete_btn}
                      onClick={() => handleDeleteUser(user.id, user.userName)}
                    >
                      Удалить
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
