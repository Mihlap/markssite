import React, { useEffect, useRef, useState } from "react";
// import styles from "./AddHRPortal.module.scss";
import styles from "../style/style-card.module.scss";
import FormEditVacancy from "./FormEditVacancy";
import FormAddVacancy from "./FormAddVacancy";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteForm,
  getFetchForm,
  getHiddenVacanciesFromDB,
  sendCopiedVacancyToServer,
  updateVacancyLookStatusAndSaveToDB,
  updateVacancyLookStatusSuccess,
} from "../../store/Slice/vacanciesSlice";
import { buttonsFilter } from "./utils.js";

import LoadingModal from "../add-project/loading/LoadingModal";
import Edit from "../icon/Edit.svg";
import Look from "../icon/eye.svg";
import noLook from "../icon/eye2.svg";
import copyIcon from "../icon/copyIcon.svg";
import pencilIcon from "../add-navbar/icon/pencil.svg";
import LoadingCircle from "../../Loading/LoadingCircle.jsx";

export default function AddHRPortal({ user }) {
  // const Host = process.env.REACT_APP_SERVER_HOST;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVacancyData, setEditVacancyData] = useState(null);
  const [modalBlockHeight, setModalBlockHeight] = useState("auto");
  const [deleteModalState, setDeleteModalState] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [copiedVacancyId, setCopiedVacancyId] = useState(null);

  const dispatch = useDispatch();
  const { error, loading, hidden } = useSelector((state) => state.vacancies);
  const vacanciesAdd = useSelector((state) => state.vacancies.vacancies);

  const isMountedRef = useRef(true);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("Вакансии");

  const updateModalBlockHeight = () => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900); // Примерное максимальное значение высоты

    setModalBlockHeight(`${maxHeight}px`);
  };

  useEffect(() => {
    dispatch(getFetchForm());
    dispatch(getHiddenVacanciesFromDB());
  }, [dispatch]);

  useEffect(() => {
    updateModalBlockHeight();
    window.addEventListener("resize", updateModalBlockHeight);
    return () => {
      window.removeEventListener("resize", updateModalBlockHeight);
      checkIsMounted();
    };
  }, []);

  const checkIsMounted = () => {
    isMountedRef.current = false;
  };

  const handleOpenModal = (type) => {
    setIsModalOpen(true);
    if (editVacancyData) {
      setEditVacancyData(null);
    }

    if (selectedFilter === "Вакансии") {
      setEditVacancyData(null);
    } else if (selectedFilter === "Стажировки") {
      setEditVacancyData(null);
    }
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

  const handleButtonsFilterClick = (filter) => {
    setActiveButtonIndex(filter);
    setSelectedFilter(buttonsFilter[filter]);
  };

  const handleCopyClick = async (id) => {
    // navigator.clipboard.writeText(id);
    // setIsCopied(true);
    // // seticonCopy(true);
    // setCopiedId(id);
    try {
      await navigator.clipboard.writeText(id);
      if (isMountedRef.current) {
        setIsCopied(true);
        setCopiedId(id);
      }
    } catch (err) {
      console.error("Unable to copy project to clipboard:", err);
    }
  };

  const handleCopyVacancyClick = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      if (isMountedRef.current) {
        const vacancyToCopy =
          vacanciesAdd && vacanciesAdd.find((el) => el.id === id);
        const copiedVacancy = { ...vacancyToCopy, id };
        dispatch(sendCopiedVacancyToServer(copiedVacancy)).then((response) => {
          const copiedId = response.data.copiedId;
          setCopiedVacancyId(copiedId); // Устанавливаем copiedId
          setTimeout(() => {
            setCopiedVacancyId(null); // Сбрасываем copiedId после 5 секунд
          }, 5000);
          dispatch(getFetchForm());
        });
      }
    } catch (err) {
      console.error("Unable to copy vacancy:", err);
    }
  };

  const handleEditClick = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      if (isMountedRef.current) {
        // setIsCopied(true);
        // setCopiedId(id);

        const vacancyToEdit = vacanciesAdd.find((el) => el.id === id);
        setEditVacancyData(vacancyToEdit);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Unable to copy vacancy to clipboard:", err);
    }
  };

  const handleFormDelete = (formId) => {
    dispatch(deleteForm(formId));
    handleDeleteModalClose();
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCopiedId("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleLookClick = async (id) => {
   const vacancyToToggle = vacanciesAdd.find((vacancy) => vacancy.id === id);
    if (!vacancyToToggle) return;

   const updatedHiddenStatus = !vacancyToToggle.hidden;
   dispatch(
      updateVacancyLookStatusAndSaveToDB({ id, hidden: updatedHiddenStatus })
    );
  };

  const filteredVacancies = vacanciesAdd.filter((vacancy) => {
    if (selectedFilter === "Вакансии") {
      return vacancy.type === "вакансия";
    } else if (selectedFilter === "Стажировки") {
      return vacancy.type === "стажировка";
    }
  });

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__title}>HR портал</div>
        <div className={styles.card_components_admin__buttonFilter}>
          {buttonsFilter.map((button, index) => (
            <button
              key={index}
              // className={`${styles.card_components_admin__buttonFilter__group}
              // ${activeButtonIndex === index ? styles.activeButtonVacancy : ""}`}
              className={`${styles.card_components_admin__buttonFilter__group} ${
                activeButtonIndex === index ? styles.activeButtonVacancy : ""
                } ${index === 0 ? styles.noAnimation : ""}`}
              onClick={() => handleButtonsFilterClick(index)}
            >
              <img
                className={`${
                  styles.card_components_admin__buttonFilter__icons
                } ${activeButtonIndex === index ? styles.activeIcon : ""}`}
                src={pencilIcon}
                alt={pencilIcon}
              />
              {button}
            </button>
          ))}
        </div>
        <div
          className={styles.card_components_admin__button_block}
          onClick={() => {
            if (
              selectedFilter === "Вакансии" ||
              selectedFilter === "Стажировки"
            ) {
              handleOpenModal(selectedFilter);
            }
          }}
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
              {selectedFilter === "Вакансии"
                ? "Добавить вакансию"
                : selectedFilter === "Стажировки"
                ? "Добавить стажировку"
                : selectedFilter === "Офис"
                ? "Офис"
                : selectedFilter === "Главная"
                ? "Добавить на главную страницу"
                : "Добавить вакансию"}
            </div>
          </button>
        </div>
        {isModalOpen && (
          <div className={styles.card_components_admin__modal_container}>
            <div
              style={{ maxHeight: modalBlockHeight }}
              className={styles.card_components_admin__modal_block}
            >
              {editVacancyData ? (
                <FormEditVacancy
                  setIsModalOpen={setIsModalOpen}
                  editVacancyData={editVacancyData}
                  selectedFilter={selectedFilter}
                  className={styles.formAddProjectClass}
                />
              ) : (
                <FormAddVacancy
                  className={styles.formAddProjectClass}
                  setIsModalOpen={setIsModalOpen}
                  selectedFilter={selectedFilter}
                />
              )}
              <button
                className={styles.card_components_admin__close_button}
                onClick={handleCloseModal}
              ></button>
            </div>
          </div>
        )}
        <div className={styles.card_components_admin__section_map}>
          {error ? (
            <div className={styles.card_components_admin__errore_div}>
              Нажмите на HR Портал,{" "}
              <span>это позволит серверу сделать запрос ещё раз.</span>
            </div>
          ) : loading ? (
            <LoadingCircle />
          ) : (
            <>
              {filteredVacancies && filteredVacancies.length === 0 ? (
                <div className={styles.card_components_admin__null_project}>
                  Вакансии сейчас отсутствуют. Добавьте вакансию!
                </div>
              ) : (
                <>
                  <div className={styles.card_components_admin__block__vacancy}>
                    {Array.isArray(filteredVacancies) &&
                      [...filteredVacancies] // Создаем копию массива вакансий, чтобы не мутировать оригинальный массив
                        .reverse() // Переворачиваем массив
                        .map((el) => {
                          return (
                            <React.Fragment key={el.id}>
                              <div
                                key={el.id}
                                className={`${styles.cart_vacancy_container} ${
                                  copiedVacancyId === el.id
                                    ? styles.copiedVacancy
                                    : ""
                                }`}
                              >
                                <div
                                  className={
                                    styles.cart_vacancy_container__content
                                  }
                                >
                                  <span
                                    className={
                                      styles.cart_vacancy_container__title
                                    }
                                  >
                                    {el.title}
                                  </span>
                                </div>
                                <div
                                  className={
                                    styles.cart_vacancy_container__department
                                  }
                                >
                                  {el.direction}
                                </div>
                                <div
                                  className={
                                    styles.cart_vacancy_container__id_block
                                  }
                                >
                                  <div
                                    className={
                                      styles.cart_vacancy_container__id_text
                                    }
                                  >
                                    id: {el.id}
                                  </div>
                                  {isCopied && el.id === copiedId && (
                                    <>
                                      <div
                                        className={
                                          styles.cart_vacancy_container__copyMessage
                                        }
                                      >
                                        id скопирован
                                      </div>
                                      <div
                                        className={
                                          styles.cart_vacancy_container__copyButton_img_copy_deffalt
                                        }
                                      />
                                    </>
                                  )}
                                  <button
                                    className={
                                      styles.cart_vacancy_container__copyButton
                                    }
                                    onClick={() => handleCopyClick(el.id)}
                                  >
                                    <div
                                      className={
                                        styles.cart_vacancy_container__copyButton_img_copy_ok
                                      }
                                    />
                                  </button>
                                </div>
                                <div
                                  className={
                                    styles.cart_vacancy_container_buttonClick
                                  }
                                >
                                  {user?.name === "obezyankaa" ||
                                  user?.name === "Pokemon" ||
                                  user?.name === "hr778" ? (
                                    <div
                                      className={styles.copyIcon_block_vacancy}
                                      onClick={() =>
                                        handleCopyVacancyClick(el.id)
                                      }
                                    >
                                      <button
                                        className={styles.buttom_copyIcon}
                                      >
                                        <label
                                          htmlFor="copyIcon"
                                          className={styles.label}
                                        >
                                          <div className={`${styles.wrapper}`}>
                                            <img
                                              src={copyIcon}
                                              alt={copyIcon}
                                            />
                                          </div>
                                        </label>
                                      </button>
                                    </div>
                                  ) : null}
                                  {user?.name === "obezyankaa" ||
                                  user?.name === "Pokemon" ? (
                                    <div className={styles.del_block_vacancy}>
                                      <button
                                        className={styles.buttom_del}
                                        onClick={() =>
                                          handleDeleteModalOpen(el.id)
                                        }
                                      >
                                        <label
                                          htmlFor="delete"
                                          className={styles.label}
                                        >
                                          <div className={`${styles.wrapper}`}>
                                            <div className={`${styles.lid}`}>
                                              <div
                                                className={
                                                  styles.container_vedro
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.triangle_left
                                                  }
                                                ></div>
                                                <div
                                                  className={styles.rectangle}
                                                ></div>
                                                <div
                                                  className={
                                                    styles.triangle_right
                                                  }
                                                ></div>
                                              </div>
                                            </div>
                                            <div
                                              className={`${styles.can}`}
                                            ></div>
                                            <span>delete</span>
                                          </div>
                                        </label>
                                      </button>
                                    </div>
                                  ) : null}
                                  {user?.name === "obezyankaa" ||
                                  user?.name === "Pokemon" ||
                                  user?.name === "hr778" ? (
                                    <div
                                      className={`${
                                        styles.look_block_vacancy
                                      } ${el.hidden ? styles.disabled : ""}`}
                                      onClick={() => handleLookClick(el.id)}
                                    >
                                      <button className={styles.buttom_look}>
                                        <label
                                          htmlFor="look"
                                          className={styles.label}
                                        >
                                          <div className={`${styles.wrapper}`}>
                                            <img
                                              src={el.hidden ? noLook : Look}
                                              alt={
                                                el.hidden ? "No look" : "Look"
                                              }
                                            />
                                          </div>
                                        </label>
                                      </button>
                                    </div>
                                  ) : null}

                                  {user?.name === "obezyankaa" ||
                                  user?.name === "Pokemon" ||
                                  user?.name === "hr778" ? (
                                    <div
                                      className={styles.edit_block_vacancy}
                                      onClick={() => handleEditClick(el.id)}
                                    >
                                      <button className={styles.buttom_edit}>
                                        <label
                                          htmlFor="edit"
                                          className={styles.label}
                                        >
                                          <div className={`${styles.wrapper}`}>
                                            <img src={Edit} alt={Edit} />
                                          </div>
                                        </label>
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              {/* Модальное окно подтверждения удаления */}
                              {deleteModalState[el.id] && (
                                <div className={styles.delete_modal_container}>
                                  <div className={styles.delete_modal_block}>
                                    <div
                                      className={
                                        styles.delete_modal_block__title
                                      }
                                    >
                                      {selectedFilter === "Вакансии"
                                        ? `Вы точно хотите удалить вакансию`
                                        : selectedFilter === "Стажировки"
                                        ? `Вы точно хотите удалить стажировку`
                                        : `Вы точно хотите удалить вакансию`}
                                      {/* Вы точно хотите удалить вакансию */}
                                      <br /> «{el.title}»?
                                    </div>
                                    <p
                                      className={
                                        styles.delete_modal_block__text
                                      }
                                    >
                                      Удаленную{" "}
                                      {selectedFilter === "Вакансии"
                                        ? "вакансию"
                                        : "стажировку"}{" "}
                                      вернуть будет невозможно
                                    </p>

                                    <div className={styles.button_block}>
                                      <button
                                        className={`${styles.button_block__cancel} ${styles.delete_modal_button_cancel}`}
                                        onClick={() =>
                                          handleDeleteModalClose(el.id)
                                        }
                                      />
                                      <button
                                        className={`${styles.button_block__save} ${styles.delete_modal_button_delete}`}
                                        onClick={() => handleFormDelete(el.id)}
                                      />
                                    </div>

                                    <button
                                      className={
                                        styles.delete_modal_block__close_button
                                      }
                                      onClick={() =>
                                        handleDeleteModalClose(el.id)
                                      }
                                    ></button>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
