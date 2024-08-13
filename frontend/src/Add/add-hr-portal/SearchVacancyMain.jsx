import React, { useEffect, useState } from "react";
import styles from "../HomeAdmin/HomeAdmin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import DraggableVacancy from "../HomeAdmin/DraggableVacancy";
import { arrIdVacancySelector } from "./VacancySelector";
import {
  deleteVacancy,
  getZaprosData,
  searchVacancyMainPostzapros,
  updateVacancyOrderReplacement,
  updateVacancyOrderSuccess
} from "../../store/Slice/searchVacancyMainSlice";

export default function SearchVacancyMain() {
  const dispatch = useDispatch();
  const vacancies = useSelector((state) => state.vacancies?.vacancies);
  const arrIdVacancy = useSelector(arrIdVacancySelector);

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
    dispatch(getZaprosData());
  }, [dispatch]);
  
  const handleSearchChange = (event) => {
    setSearchId(event.target.value);    
    setIsButtonDisabled(event.target.value === "");
  };

  const handleKeyPress = (event) => {
    // Проверяем, является ли нажатая клавиша клавишей "Enter" (код клавиши 13)
    if (event.key === "Enter") {
      filterVacanciesById(); // Выполняем поиск
    }
  };
  // Функция для фильтрации проектов по введенному id
  const filterVacanciesById = async () => {
    if (!vacancies) {
      return; 
    }
    const filteredVacancy = vacancies.find(
      (vacancy) => vacancy.id === parseInt(searchId, 10)
    );
    if (filteredVacancy) {
      try {
        await dispatch(
          searchVacancyMainPostzapros(filteredVacancy, setSearchId, setSavedId)
        );

        showMessage("Вакансия добавлена", "ok");
      } catch (error) {
        console.error("Ошибка при сохранении вакансии:", error);
        showMessage("Ошибка при сохранении вакансии:", "error");
      }
    } else {
        showMessage("Вакансия с таким id не найден", "error");
    }
  };

  const handleFormDelete = (formId) => {
    dispatch(deleteVacancy(formId));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(false);
      setShowOk(false);
      setReplacement(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showError, showOk, replacement]);

  const updateVacancyOrder = (updatedVacancies) => {
    return (dispatch) => {
      dispatch(updateVacancyOrderSuccess(updatedVacancies));
    };
  };

  const moveVacancy = (draggedIndex, targetIndex) => {
    const updatedVacancies = [...arrIdVacancy];
    const draggedVacancy = updatedVacancies[draggedIndex];
    updatedVacancies.splice(draggedIndex, 1);
    updatedVacancies.splice(targetIndex, 0, draggedVacancy);

    // Вызываем действие для обновления порядка элементов
    dispatch(updateVacancyOrder(updatedVacancies));

    showMessage("Вакансия перемещена", "replacement");
    // И тут же сохраняем новый порядок в базу данных
    dispatch(updateVacancyOrderReplacement(updatedVacancies));
  };

  const showMessage = (message, type) => {
    switch (type) {
      case "error":
        setErrorMessage(message);
        setShowError(true);
        break;
      case "ok":
        setOkMessage(message);
        setShowOk(true);
        break;
      case "replacement":
        setReplacementMessage(message);
        setReplacement(true);
        break;
      default:
        break;
    }
  };

  const Message = ({ message, type }) => {
    return (
      <div
        className={
          type === "error"
            ? styles.home_admin_section__error
            : styles.home_admin_section__ok
        }
      >
        {message}
      </div>
    );
  };

   return (
    <div className={styles.home_admin_section__section} >
      <span className={styles.home_admin_section__sectionSpan}>Актуальные вакансии</span>
      <div className={`${styles.home_admin_section__block_search} ${styles.home_admin_section__block_searchVacancy}`}>
        <div className={styles.home_admin_section__id_container}>
          {arrIdVacancy?.map((vacancy, index) => (
            <DraggableVacancy
              key={index}
              vacancy={vacancy}
              index={index}
              moveVacancy={moveVacancy}
              handleFormDelete={handleFormDelete}
            />
          ))}
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="number"
            className={styles.form__field}
            placeholder="idshnik"
            name="idshnik"
            id="idshnik"
            value={savedId !== null ? savedId : searchId}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress} 
            required
            autoComplete="off"
          />
          <label htmlFor="idshnik" className={styles.form__label}>
            Укажите id вакансии
          </label>
        </div>
        <div className={styles.home_admin_section__button_container_project}>
          <button
            className={styles.home_admin_section__button}
            onClick={filterVacanciesById}
            disabled={isButtonDisabled}
          />
        </div>
        <div>
          {showError && <Message message={errorMessage} type="error" />}
        </div>
        <div>{showOk && <Message message={okMessage} type="ok" />}</div>
        <div>
          {replacement && (
            <Message message={replacementMessage} type="replacement" />
          )}
        </div>
      </div>
    </div>
  );
}
