import React, { useEffect, useRef, useState } from 'react';
// import styles from "./AddHRPortal.module.scss";
import styles from "../style/style-card.module.scss";
import FormEditVacancy from './FormEditVacancy';
import FormAddVacancy from './FormAddVacancy';
import { useSelector } from 'react-redux';
import LoadingModal from '../add-project/loading/LoadingModal';

export default function AddHRPortal({ user }) {
  const Host = process.env.REACT_APP_SERVER_HOST;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVacancyData, setEditVacancyData] = useState(null);
  const [modalBlockHeight, setModalBlockHeight] = useState("auto");
  const [deleteModalState, setDeleteModalState] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  const error = useSelector((state) => state.project.error);
  const loading = useSelector((state) => state.project.loading);
  const project = useSelector((state) => state.project.projects);
  
  const isMountedRef = useRef(true);

  const updateModalBlockHeight = () => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900); // Примерное максимальное значение высоты

    setModalBlockHeight(`${maxHeight}px`);
  };

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


  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (editVacancyData) {
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

  const handleEditClick = async (id) => {
    try {
  await navigator.clipboard.writeText(id);  
  if (isMountedRef.current) {
    // setIsCopied(true);
    // setCopiedId(id);

    const projectToEdit = project.find((el) => el.id === id);
    // console.log('Project to edit111111111111111111111:', projectToEdit);
  
    // setEditProjectData(projectToEdit);
    setIsModalOpen(true);
  }
} catch (err) {
  console.error("Unable to copy project to clipboard:", err);
}
};


  return (
    <section className={styles.card_components_admin}>
    <div className={styles.card_components_admin__block}>
      <div className={styles.card_components_admin__title}>HR портал</div>
    
       <div
          className={styles.card_components_admin__button_block}
          // onClick={handleOpenModal}
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
              Добавить вакансию
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
                  className={styles.formAddProjectClass}
                />
              ) : (
                <FormAddVacancy
                  className={styles.formAddProjectClass}
                  setIsModalOpen={setIsModalOpen}
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
            // <Loading />
            <LoadingModal />
          ) : (
            <>
              {project && project.length === 0 ? (
                <div className={styles.card_components_admin__null_project}>
                  Вакансии сейчас отсутствуют. Добавьте вакансию!
                </div>
              ) : (
                <>
                  <div className={styles.card_components_admin__block_map}>
                    {project &&
                      [...project] // Создаем копию массива project, чтобы не мутировать оригинальный массив
                        .reverse() // Переворачиваем массив
                        .map((el) => {
                          const photoName = el && el.imageProject;
                          const defaultPhoto = '';

                          const photoSrc =
                            photoName &&
                            photoName !== "null" &&
                            photoName !== "undefined"
                              ? `${Host}/images/imageAdd/${photoName}`
                              : defaultPhoto;
                          return (
                            <React.Fragment key={el.id}>
                              <div
                                key={el.id}
                                className={styles.cart_project_container}
                              >
                                <div
                                  className={
                                    styles.cart_project_container__imageContainer
                                  }
                                >
                                  <img
                                    className={
                                      styles.cart_project_container__img
                                    }
                                    loading="lazy"
                                    src={photoSrc}
                                    alt="photo_project"
                                  />
                                  {user?.name === "obezyankaa" ||
                                  user?.name === "Pokemon" ? (
                                    <div className={styles.del_block}>
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
                                  user?.name === "Pokemon" ? (
                                      <div className={styles.edit_block}
                                        onClick={() => handleEditClick(el.id)}
                                      >
                                      <button
                                        className={styles.buttom_edit}
                                      >
                                        <label
                                          htmlFor="edit"
                                          className={styles.label}
                                        >
                                          <div className={`${styles.wrapper}`}>
                                            {/* <img src={Edit} alt={Edit} /> */}
                                            {/* <span>Edit</span> */}
                                          </div>
                                        </label>
                                      </button>
                                   </div>
                                  ) : null}
                                </div>
                                <div
                                  className={
                                    styles.cart_project_container__content
                                  }
                                >
                                  <span
                                    className={
                                      styles.cart_project_container__title
                                    }
                                  >
                                    {el.title}
                                  </span>
                                </div>
                                <div
                                  className={
                                    styles.cart_project_container__id_block
                                  }
                                >
                                  <div
                                    className={
                                      styles.cart_project_container__id_text
                                    }
                                  >
                                    id: {el.id}
                                  </div>
                                  {isCopied && el.id === copiedId && (
                                    <>
                                      <div
                                        className={
                                          styles.cart_project_container__copyMessage
                                        }
                                      >
                                        id скопирован
                                      </div>
                                      <div
                                        className={
                                          styles.cart_project_container__copyButton_img_copu_deffalt
                                        }
                                      />
                                    </>
                                  )}
                                  <button
                                    className={
                                      styles.cart_project_container__copyButton
                                    }
                                    onClick={() => handleCopyClick(el.id)}
                                  >
                                    <div
                                      className={
                                        styles.cart_project_container__copyButton_img_copu_ok
                                      }
                                    />
                                  </button>
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
                                      Вы точно хотите удалить проект <br /> «
                                      {el.title}»
                                    </div>
                                    <p
                                      className={
                                        styles.delete_modal_block__text
                                      }
                                    >
                                      Удаленный проект нельзя будет вернуть
                                    </p>

                                    <div className={styles.button_block}>
                                      <button
                                        className={`${styles.button_block__cancel} ${styles.delete_modal_button_cancel}`}
                                        // onClick={() =>
                                        //   handleDeleteModalClose(el.id)
                                        // }
                                      />
                                      <button
                                        className={`${styles.button_block__save} ${styles.delete_modal_button_delete}`}
                                        // onClick={() => handleFormDelete(el.id)}
                                      />
                                    </div>

                                    <button
                                      className={
                                        styles.delete_modal_block__close_button
                                      }
                                      // onClick={() =>
                                      //   handleDeleteModalClose(el.id)
                                      // }
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

