import React, { useEffect, useState } from "react";
import styles from "../style/style-card.module.scss";
import FormAddProject from "./formAdd/FormAddProject";
import { useDispatch } from "react-redux";
import { deleteForm } from "../../store/Slice/projectSlice";

export default function AddProject({ project, user }) {
  const Host = process.env.REACT_APP_SERVER_HOST;
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isonCopy, seticonCopy] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [deleteModalState, setDeleteModalState] = useState({});

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteModalOpen = (id) => {
    setDeleteModalState((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  const handleDeleteModalClose = (id) => {
    setDeleteModalState((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  };

  const handleCopyClick = (id) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    seticonCopy(true);
    setCopiedId(id);
  };

  const handleFormDelete = (formId) => {
    dispatch(deleteForm(formId));
    handleDeleteModalClose();
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        seticonCopy(false);
        setCopiedId("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const toggleActive = () => {
    setIsActive(!isActive);
    console.log(!isActive); // Здесь мы выводим в консоль обратное значение, так как функция еще не обновила state
  };

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Проекты</div>
          <div className={styles.card_components_admin__hide_block}>
            <div className={styles.card_components_admin__hide_text}>
              Скрыть фильтрацию
            </div>
            <div
              className={`${styles.toggleButton} ${
                isActive ? styles.active : ""
              }`}
              onClick={toggleActive}
            >
              <div className={styles.circle}></div>
            </div>
          </div>
        </div>
        <div
          className={styles.card_components_admin__button_block}
          onClick={handleOpenModal}
        >
          <button className={styles.card_components_admin__button}>
            <div>
              <svg
                className={styles.card_components_admin__icon}
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="icon">
                  <circle
                    id="Ellipse 4"
                    cx="20.5"
                    cy="20"
                    r="20"
                    fill="#F6F6F6"
                  />
                  <path
                    id="Vector 10"
                    d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                    stroke="#75BBFD"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </g>
              </svg>
            </div>
            <div className={styles.card_components_admin__button_text}>
              Добавить новый проект
            </div>
          </button>
        </div>
        {isModalOpen && (
          <div className={styles.card_components_admin__modal_container}>
            <div className={styles.card_components_admin__modal_block}>
              <FormAddProject setIsModalOpen={setIsModalOpen} />
              <button
                className={styles.card_components_admin__close_button}
                onClick={handleCloseModal}
              ></button>
            </div>
          </div>
        )}

        <div className={styles.card_components_admin__section_map}>
          <div className={styles.card_components_admin__block_map}>
            {project &&
              project.map((el) => {
                const firstPhoto = el.imageProject.split(", ")[0];
                return (
                  <div
                    className={styles.section_project__block_cart}
                    key={el.id}
                  >
                    <div className={styles.cart_project}>
                      <div className={styles.cart_project__container}>
                        <div
                          className={styles.cart_project__imageContainer}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <img
                            className={styles.cart_project__img}
                            src={`${Host}/images/imageAdd/${firstPhoto}`}
                            alt="photo1"
                          />
                          {user === "obezyankaa" ||
                          user === "Покемон" ||
                          user === "покемон" ? (
                            <div className={styles.del_block}>
                              <button
                                className={styles.buttom_del}
                                onClick={() => handleDeleteModalOpen(el.id)}
                              >
                                <label
                                  htmlFor="delete"
                                  className={styles.label}
                                >
                                  <div className={`${styles.wrapper}`}>
                                    <div className={`${styles.lid}`}>
                                      <div className={styles.container_vedro}>
                                        <div
                                          className={styles.triangle_left}
                                        ></div>
                                        <div className={styles.rectangle}></div>
                                        <div
                                          className={styles.triangle_right}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className={`${styles.can}`}></div>
                                    <span>delete</span>
                                  </div>
                                </label>
                              </button>
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.cart_project__content}>
                          <span className={styles.cart_project__title}>
                            {el.title}
                          </span>
                        </div>
                        <div className={styles.cart_project__id_block}>
                          <div className={styles.cart_project__id_text}>
                            id: {el.id}
                          </div>
                          {isCopied && el.id === copiedId && (
                            <>
                              <div className={styles.cart_project__copyMessage}>
                                id скопирован
                              </div>
                              <div
                                className={
                                  styles.cart_project__copyButton_img_copu_deffalt
                                }
                              />
                            </>
                          )}
                          <button
                            className={styles.cart_project__copyButton}
                            onClick={() => handleCopyClick(el.id)}
                          >
                            <div
                              className={
                                styles.cart_project__copyButton_img_copu_ok
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Модальное окно подтверждения удаления */}
                    {deleteModalState[el.id] && (
                      <div className={styles.delete_modal_container}>
                        <div className={styles.delete_modal_block}>
                          <div className={styles.delete_modal_block__title}>
                            Вы точно хотите удалить проект <br /> «{el.title}»
                          </div>
                          <p className={styles.delete_modal_block__text}>
                            Удаленный проект нельзя будет вернуть
                          </p>

                          <div className={styles.button_block}>
                            <button
                              className={`${styles.button_block__cancel} ${styles.delete_modal_button_cancel}`}
                              onClick={() => handleDeleteModalClose(el.id)}
                            />
                            <button
                              className={`${styles.button_block__save} ${styles.delete_modal_button_delete}`}
                              onClick={() => handleFormDelete(el.id)}
                            />
                          </div>

                          <button
                            className={
                              styles.card_components_admin__close_button
                            }
                            onClick={() => handleDeleteModalClose(el.id)}
                          ></button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
