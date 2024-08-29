import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../style/style-card.module.scss';
import FormEditSlide from '../FormEditSlide/FormEditeSlide.jsx';
import FormAddSlide from '../FormAddSlide/FormAddSlide.jsx';
import {
  fetchSlides,
  editSlide,
  toggleSlideVisibility,
  deleteSlide  
 } from '../../../store/Slice/vacancyMainSlideCardSlice';

import Edit from '../../icon/Edit.svg';
import Look from '../../icon/eye.svg';
import noLook from '../../icon/eye2.svg';


export default function AddSlideMain({
  user,
  handleOpenModal,
  isModalOpenMain,
  setIsModalOpenMain,
  editSlideData,
  modalBlockHeight,
  handleDeleteModalOpen,
  deleteModalState,
  setDeleteModalState,
  handleDeleteModalClose,
}) {
  const dispatch = useDispatch();
  const slides = useSelector(state => state.formAddSlide.slides || []);

  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState("");
  const [showOk, setShowOk] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState("");
  const [replacement, setReplacement] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  
  const handleEditClick = useCallback((id) => {
    if (editSlideData) {
      dispatch(editSlide({ id, data: editSlideData }));
    }
  }, [dispatch, editSlideData]);

 
  const handleDeleteSlide = useCallback(
    (id) => {
      dispatch(deleteSlide(id));
      handleDeleteModalClose(id);
    },
    [dispatch, handleDeleteModalClose]
  );

  const handleLookClick = useCallback((id) => {
    dispatch(toggleSlideVisibility(id));
  }, [dispatch]);

 
  // const handleLookClick =
    // useCallback();
    // (id) => {
    //   const vacancyToToggle = vacanciesAdd.find((vacancy) => vacancy.id === id);
    //   if (!vacancyToToggle) return;
    //   const updatedHiddenStatus = !vacancyToToggle.hidden;
    //   dispatch(updateVacancyLookStatusAndSaveToDB({ id, hidden: updatedHiddenStatus }));
    // },
    // [dispatch, vacanciesAdd]

  return (
    <div className={styles.card_components_admin__blockAddSlide}>
      <span className={styles.card_components_admin__title}>Ведущая компания в сфере проектирования</span>
      <div className={styles.card_components_admin__button_block} onClick={handleOpenModal}>
        <button className={styles.card_components_admin__button}>
          <div>
            <svg
              className={styles.card_components_admin__icon}
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g id="icon">
                <circle id="Ellipse 4" cx="20.5" cy="20" r="20" fill="#F6F6F6" />
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
          <div className={styles.card_components_admin__button_text}>Добавить слайд</div>
        </button>
      </div>
      {isModalOpenMain && (
        <div className={styles.card_components_admin__modal_container}>
          <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
            {editSlideData ? (
              <FormEditSlide
                setIsModalOpenMain={setIsModalOpenMain}
                editSlideData={editSlideData}
                formType="slide"
                className={styles.formAddProjectClass}
              />
            ) : (
              <FormAddSlide
                className={styles.formAddProjectClass}
                setIsModalOpenMain={setIsModalOpenMain}
                formType="slide"
              />
            )}
            <button
              className={styles.card_components_admin__close_button}
              onClick={() => setIsModalOpenMain(false)}></button>
          </div>
        </div>
      )}
      <>
        <div className={styles.card_components_admin__block__vacancy}>
          {Array?.isArray(slides) &&
            [...slides]?.map((el, index) => {
              return (
                <React.Fragment key={el.id}>
                  <div
                    key={el.id}
                    className={styles.cart_vacancy_container}
                  >
                    <div className={styles.cart_vacancy_container__content}>
                      <span className={styles.cart_vacancy_container__title}>{`Слайд ${index + 1}`}</span>
                    </div>
                    <div className={styles.cart_vacancy_container_buttonClick}>
                    {user?.name === 'obezyankaa' || user?.name === 'Pokemon' || user?.name === 'hr778' ? (
                        <div
                          className={`${styles.look_block_vacancy} ${el.hidden ? styles.disabled : ''}`}
                          onClick={() => handleLookClick(el.id)}>
                          <button className={styles.buttom_look}>
                            <label htmlFor="look" className={styles.label}>
                              <div className={`${styles.wrapper}`}>
                                <img src={el.hidden ? noLook : Look} alt={el.hidden ? 'No look' : 'Look'} />
                              </div>
                            </label>
                          </button>
                        </div>
                      ) : null}
                 
                      {user?.name === 'obezyankaa' || user?.name === 'Pokemon' || user?.name === 'hr778' ? (
                        <div className={`${styles.edit_block_vacancy} ${styles.edit_block_slide}`} onClick={() => handleEditClick(el.id)}>
                          <button className={styles.buttom_edit}>
                            <label htmlFor="edit" className={styles.label}>
                              <div className={`${styles.wrapper}`}>
                                <img src={Edit} alt={Edit} />
                              </div>
                            </label>
                          </button>
                        </div>
                      ) : null}

                      {user?.name === 'obezyankaa' || user?.name === 'Pokemon' ? (
                        <div className={styles.del_block_vacancy}>
                          <button className={styles.buttom_del} onClick={() => handleDeleteModalOpen(el.id)}>
                            <label htmlFor="delete" className={styles.label}>
                              <div className={`${styles.wrapper}`}>
                                <div className={`${styles.lid}`}>
                                  <div className={styles.container_vedro}>
                                    <div className={styles.triangle_left}></div>
                                    <div className={styles.rectangle}></div>
                                    <div className={styles.triangle_right}></div>
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
                  </div>
                  {deleteModalState[el.id] && (
                    <div className={styles.delete_modal_container}>
                      <div className={styles.delete_modal_block}>
                        <div className={styles.delete_modal_block__title}>                          
                            Вы точно хотите удалить слайд                            
                          <br /> «{`Слайд ${index + 1}`}»?
                        </div>
                        <p className={styles.delete_modal_block__text}>
                          Удаленный слайд вернуть будет невозможно
                        </p>

                        <div className={styles.button_block}>
                          <button
                            className={`${styles.button_block__cancel} ${styles.delete_modal_button_cancel}`}
                            onClick={() => handleDeleteModalClose(el.id)}
                          />
                          <button
                            className={`${styles.button_block__save} ${styles.delete_modal_button_delete}`}
                            onClick={() => handleDeleteSlide(el.id)}
                          />
                        </div>

                        <button
                          className={styles.delete_modal_block__close_button}
                          onClick={() => handleDeleteModalClose(el.id)}></button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </>
    </div>
  );
}
