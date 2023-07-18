import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import styles from "./FormAddProject.module.scss";
import { fetchProject } from "../../../store/Slice/projectSlice";
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  changeHandler,
  submitHandler,
} from "./formHelpers";

import customStyles from "./customStyles";
import icon from "./img/Frame4684.png";

export default function FormAddProject({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("28,28");
  const [inputData, setInputData] = useState({
    title: "",
    selectCompetencies: [],
    countryCity: "",
    monthYear: "",
    viewConstruction: [],
    dropPhoto: [],
    photoAva: "",
    titleTextBlock: "",
    descriptionProject: "",
  });

  // функция Удаление фото из массива превью
  // Удаление фото из массива превью
  const handleRemovePreviewPhoto = (index) => {
    removePreviewPhoto(
      previewPhotos,
      setPreviewPhotos,
      index,
      inputData,
      setInputData,
      setIsDropPhotoVisible
    );
  };

  // Удаление фото из массива превью который с одной фоткой
  const handleRemovePreviewPhotoAva = (index) => {
    removePreviewPhotoAva(
      previewPhotoAva,
      setPreviewPhotoAva,
      index,
      inputData,
      setInputData,
      setIsPhotoAvaVisible
    );
  };


  // функция отправки формы на Redux
  const submitHandler = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...inputData,
      selectCompetencies: selectedCompetencies
        .map((option) => option.label)
        .join(","),
      viewConstruction: selectedViewConstruction
        .map((option) => option.label)
        .join(","),
      radioValue: selectedRadio,
      photoAva: inputData.photoAva, // Добавлено поле "photoAva" в объект "formattedData"
    };
    console.log(formattedData, "<<<----консоль на фронте");
    dispatch(fetchProject(formattedData, setInputData));
    setSelectedCompetencies([]);
    setSelectedViewConstruction([]);
    setSelectedRadio("");
    setPreviewPhotos([]);
    setInputData({
      title: "",
      selectCompetencies: "",
      countryCity: "",
      monthYear: "",
      viewConstruction: "",
      dropPhoto: [],
      photoAva: [],
      titleTextBlock: "",
      descriptionProject: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новый проект</div>

      <form onSubmit={submitHandler}>
        <div className={styles.form_container__block_gray_one}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="title"
              name="title"
              id="title"
              value={inputData.title}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible
                )
              }
              required
            />
            <label htmlFor="title" className={styles.form__label}>
              Название проекта
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <Select
              styles={customStyles}
              isMulti
              name="selectCompetencies"
              options={[
                { value: "Архитектура", label: "Архитектура" },
                { value: "BIM", label: "BIM" },
                { value: "Конструкции", label: "Конструкции" },
                { value: "Инженерия", label: "Инженерия" },
                { value: "Дизайн", label: "Дизайн" },
              ]}
              className={styles.form__field}
              placeholder="Выбрать компетенции"
              value={selectedCompetencies}
              onChange={setSelectedCompetencies}
            />
            {/* <label htmlFor="selectCompetencies" className={styles.form__label}>
              Выбрать компетенции
            </label> */}
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="countryCity"
              name="countryCity"
              id="countryCity"
              value={inputData.countryCity}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible
                )
              }
              required
            />
            <label htmlFor="countryCity" className={styles.form__label}>
              Страна, город
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="monthYear"
              name="monthYear"
              id="monthYear"
              value={inputData.monthYear}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible
                )
              }
              required
            />
            <label htmlFor="monthYear" className={styles.form__label}>
              Месяц, год
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <Select
              styles={customStyles}
              isMulti
              name="viewConstruction"
              value={selectedViewConstruction}
              onChange={setSelectedViewConstruction}
              options={[
                { value: "Архитектура", label: "Архитектура" },
                { value: "BIM", label: "BIM" },
                { value: "Конструкции", label: "Конструкции" },
                { value: "Инженерия", label: "Инженерия" },
                { value: "Дизайн", label: "Дизайн" },
              ]}
              className={styles.form__field}
              placeholder="Выберите вид строительства"
            />
            {/* <label htmlFor="viewConstruction" className={styles.form__label}>
              Выберите вид строительства
            </label> */}
          </div>
        </div>
        <div className={styles.form_container__checkbox_block}>
          <div>
            Загрузите фото и выберете ориентацию
            <span> для отображения на странице «Проекты»</span>
          </div>
        </div>
        <label className={styles.slider_container__customFileUpload}>
          <input
            type="file"
            name="photoAva"
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,
                setPreviewPhotos,
                setIsDropPhotoVisible,
                setPreviewPhotoAva,
                setIsPhotoAvaVisible
              )
            }
            style={{ display: isPhotoAvaVisible ? "block" : "none" }}
          />
          <div className={styles.slider_container__uploadIcon}>
            <img src={icon} alt="icon" />
          </div>
          <div className={styles.slider_container__uploadText}>
            Загрузить изображения
          </div>
        </label>
        <div className={styles.preview_photos_container}>
          {previewPhotoAva.map((preview, index) => (
            <div key={index} className={styles.preview_photos_container__block}>
              <img
                className={styles.preview_photos_container__img}
                src={preview}
                alt={`Preview ${index}`}
              />
              <div
                className={styles.preview_photos_container__remove_icon}
                onClick={() => handleRemovePreviewPhotoAva(index)}
              >
                <span></span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.form_container__radio_container}>
          <div
            className={`${styles.form_container__radio_block_one} ${
              selectedRadio === "28,28"
                ? styles.form_container__radio_activ_block
                : ""
            }`}
          >
            <label
              className={`${styles.form_container__radio_label_one} ${
                selectedRadio === "28,28"
                  ? styles.form_container__radio_activ_label
                  : ""
              }`}
            >
              <input
                className={styles.form_container__radio_input}
                type="radio"
                name="radioGroup"
                value="28,28"
                checked={selectedRadio === "28,28"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </label>
          </div>
          <div
            className={`${styles.form_container__radio_block_two} ${
              selectedRadio === "28,14"
                ? styles.form_container__radio_activ_block
                : ""
            }`}
          >
            <label
              className={`${styles.form_container__radio_label_two} ${
                selectedRadio === "28,14"
                  ? styles.form_container__radio_activ_label
                  : ""
              }`}
            >
              <input
                className={styles.form_container__radio_input}
                type="radio"
                name="radioGroup"
                value="28,14"
                checked={selectedRadio === "28,14"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </label>
          </div>
          <div
            className={`${styles.form_container__radio_block_three} ${
              selectedRadio === "28,48"
                ? styles.form_container__radio_activ_block
                : ""
            }`}
          >
            <label
              className={`${styles.form_container__radio_label_three} ${
                selectedRadio === "28,48"
                  ? styles.form_container__radio_activ_label
                  : ""
              }`}
            >
              <input
                className={styles.form_container__radio_input}
                type="radio"
                name="radioGroup"
                value="28,48"
                checked={selectedRadio === "28,48"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className={styles.slider_container}>
          {/* <div className={styles.slider_container__title}>Слайдер</div> */}

          <div className={styles.form_container__checkbox_block}>
            <div>
              Слайдер
              <span> *допускается загрузка 4х изображений</span>
            </div>
          </div>

          <label className={styles.slider_container__customFileUpload}>
            <input
              type="file"
              name="dropPhoto"
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible
                )
              }
              multiple
              style={{ display: isDropPhotoVisible ? "block" : "none" }}
            />
            <div className={styles.slider_container__uploadIcon}>
              <img src={icon} alt="icon" />
            </div>
            <div className={styles.slider_container__uploadText}>
              Загрузить изображения
            </div>
          </label>
        </div>
        <div className={styles.preview_photos_container}>
          {previewPhotos.map((preview, index) => (
            <div key={index} className={styles.preview_photos_container__block}>
              <img
                className={styles.preview_photos_container__img}
                src={preview}
                alt={`Preview ${index}`}
              />
              <div
                className={styles.preview_photos_container__remove_icon}
                onClick={() => handleRemovePreviewPhoto(index)}
              >
                <span></span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.form_container__heading_block}>
          <input
            type="input"
            className={styles.form_container__heading_block_input}
            placeholder="Не более 56 символов"
            name="titleTextBlock"
            id="titleTextBlock"
            maxLength="56"
            value={inputData.titleTextBlock}
            onChange={(event) => {
              const value = event.target.value;
              if (value.length <= 56) {
                setInputData({ ...inputData, titleTextBlock: value });
              }
            }}
            required
          />
          <label
            htmlFor="titleTextBlock"
            className={styles.form_container__heading_block_label}
          >
            Название проекта
          </label>
          <div className={styles.form_container__heading_block_input_length}>
            {`${inputData.titleTextBlock.length}/56`}
          </div>
        </div>

        <div className={styles.form_container__description_text}>
          <div className={styles.form_container__textarea_length}>
            {`${inputData.descriptionProject.length}/260`}
          </div>
          <textarea
            className={styles.form_container__textarea}
            name="descriptionProject"
            id="descriptionProject"
            cols="30"
            rows="10"
            placeholder="Не более 260 символов"
            value={inputData.descriptionProject}
            onChange={(event) => {
              const value = event.target.value;
              if (value.length <= 260) {
                setInputData({ ...inputData, descriptionProject: value });
              }
            }}
          ></textarea>
          <label htmlFor="" className={styles.form_container__textarea_label}>
            Описание проекта
          </label>
        </div>

        <div className={styles.form_container__button_block}>
          <button
            className={styles.form_container__button_save}
            type="submit"
          ></button>
          <button
            className={styles.form_container__button_cancel}
            type="submit"
          ></button>
        </div>
      </form>
    </div>
  );
}
