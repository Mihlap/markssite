import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./FormAddProject.module.scss";
import { fetchProject } from "../../../store/Slice/projectSlice";
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  changeHandler,
  removePreviewPhotoOpen
} from "./formHelpers";

import icon from "./img/Frame4684.png";

export default function FormAddProject({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);

  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);

  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);

  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);

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
    totalArea: "",
    siteArea: "",
    floors: "",
    altitude: "",
    constructionVolume: "",
    location: "",
    degreeParticipation: "",
    statusObject: "",
    customer: "",
    publication: "",
    linkToPublication: "",
    publicationTwo: "",
    linkToPublicationTwo: "",
    awards: "",
    imageOpen: "",
    textBlock: "",
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

  // Удаление превью фото перед основным текстом
  const handleRemovePreviewPhotoOpen = (index) => {
    removePreviewPhotoOpen(
      previewPhotoOpen,
      setPreviewPhotoOpen,
      index,
      inputData,
      setInputData,
      setIsPhotoOpenVisible
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

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
      imageOpen: inputData.imageOpen,
    };
    console.log(formattedData, "<<<----консоль на фронте");
    dispatch(fetchProject(formattedData, setInputData));
    setSelectedCompetencies([]);
    setSelectedViewConstruction([]);
    setSelectedRadio("");
    setPreviewPhotos([]);
    setInputData({
      title: "",
      // selectCompetencies: "",
      // countryCity: "",
      // monthYear: "",
      // viewConstruction: "",
      // dropPhoto: [],
      photoAva: "",
      // titleTextBlock: "",
      // descriptionProject: "",
      // totalArea: "",
      // siteArea: "",
      // floors: "",
      // altitude: "",
      // constructionVolume: "",
      // location: "",
      // degreeParticipation: "",
      // statusObject: "",
      // customer: "",
      // publication: "",
      // linkToPublication: "",
      // publicationTwo: "",
      // linkToPublicationTwo: "",
      // awards: "",
      // imageOpen: "",
      // textBlock: "",
    });
    setIsModalOpen(false);
  };

  // console.log(inputData);
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
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="title" className={styles.form__label}>
              Название проекта
            </label>
          </div>
          {/* <div className={`${styles.form__group} ${styles.field}`}>
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
          </div> */}
          {/* <div className={`${styles.form__group} ${styles.field}`}>
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
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="countryCity" className={styles.form__label}>
              Страна, город
            </label>
          </div> */}
          {/* <div className={`${styles.form__group} ${styles.field}`}>
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
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="monthYear" className={styles.form__label}>
              Месяц, год
            </label>
          </div> */}
          {/* <div className={`${styles.form__group} ${styles.field}`}>
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
          </div> */}
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
                setIsPhotoAvaVisible,
                setPreviewPhotoOpen,
                setIsPhotoOpenVisible
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
          {previewPhotoAva?.map((preview, index) => (
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
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
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
        </div> */}
        {/* <div className={styles.form_container__heading_block}>
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
        </div> */}
        {/*
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

        <div className={styles.form_container__textarea_label}>
          Заполните 3 значения на выбор
        </div>
        <div className={styles.form_container__block_gray_one}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="totalArea"
              name="totalArea"
              id="totalArea"
              value={inputData.totalArea}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="totalArea" className={styles.form__label}>
              Общая площадь
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="siteArea"
              name="siteArea"
              id="siteArea"
              value={inputData.siteArea}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="siteArea" className={styles.form__label}>
              Площадь участка
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="floors"
              name="floors"
              id="floors"
              value={inputData.floors}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="floors" className={styles.form__label}>
              Этажность
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="altitude"
              name="altitude"
              id="altitude"
              value={inputData.altitude}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="altitude" className={styles.form__label}>
              Высотность
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="constructionVolume"
              name="constructionVolume"
              id="constructionVolume"
              value={inputData.constructionVolume}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="constructionVolume" className={styles.form__label}>
              Строительный объем
            </label>
          </div>
        </div>

        <div
          className={`${styles.form_container__block_gray_one} ${styles.form_container__three_grey_block}`}
        >
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="location"
              name="location"
              id="location"
              value={inputData.location}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="location" className={styles.form__label}>
              Расположение: Город, улица, номер дома
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="degreeParticipation"
              name="degreeParticipation"
              id="degreeParticipation"
              value={inputData.degreeParticipation}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="degreeParticipation" className={styles.form__label}>
              Степень участия
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="statusObject"
              name="statusObject"
              id="statusObject"
              value={inputData.statusObject}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="statusObject" className={styles.form__label}>
              Статус объекта (например «Дом сдан»)
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="customer"
              name="customer"
              id="customer"
              value={inputData.customer}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="customer" className={styles.form__label}>
              Заказчик
            </label>
          </div>

          <div className={styles.form_container__block_gray_flex}>
            <div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="publication"
                  name="publication"
                  id="publication"
                  value={inputData.publication}
                  onChange={(event) =>
                    changeHandler(
                      event,
                      inputData,
                      setInputData,
                      setPreviewPhotos,
                      setIsDropPhotoVisible,
                      setPreviewPhotoAva,
                      setIsPhotoAvaVisible,
                      setPreviewPhotoOpen,
                      setIsPhotoOpenVisible
                    )
                  }
                  required
                />
                <label htmlFor="publication" className={styles.form__label}>
                  Публикация
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="linkToPublication"
                  name="linkToPublication"
                  id="linkToPublication"
                  value={inputData.linkToPublication}
                  onChange={(event) =>
                    changeHandler(
                      event,
                      inputData,
                      setInputData,
                      setPreviewPhotos,
                      setIsDropPhotoVisible,
                      setPreviewPhotoAva,
                      setIsPhotoAvaVisible,
                      setPreviewPhotoOpen,
                      setIsPhotoOpenVisible
                    )
                  }
                  required
                />
                <label
                  htmlFor="linkToPublication"
                  className={styles.form__label}
                >
                  Ссылк на статью
                </label>
              </div>
            </div>
            <div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="publicationTwo"
                  name="publicationTwo"
                  id="publicationTwo"
                  value={inputData.publicationTwo}
                  onChange={(event) =>
                    changeHandler(
                      event,
                      inputData,
                      setInputData,
                      setPreviewPhotos,
                      setIsDropPhotoVisible,
                      setPreviewPhotoAva,
                      setIsPhotoAvaVisible,
                      setPreviewPhotoOpen,
                      setIsPhotoOpenVisible
                    )
                  }
                  required
                />
                <label htmlFor="publicationTwo" className={styles.form__label}>
                  Публикация
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="linkToPublicationTwo"
                  name="linkToPublicationTwo"
                  id="linkToPublicationTwo"
                  value={inputData.linkToPublicationTwo}
                  onChange={(event) =>
                    changeHandler(
                      event,
                      inputData,
                      setInputData,
                      setPreviewPhotos,
                      setIsDropPhotoVisible,
                      setPreviewPhotoAva,
                      setIsPhotoAvaVisible,
                      setPreviewPhotoOpen,
                      setIsPhotoOpenVisible
                    )
                  }
                  required
                />
                <label
                  htmlFor="linkToPublicationTwo"
                  className={styles.form__label}
                >
                  Ссылк на статью
                </label>
              </div>
            </div>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="awards"
              name="awards"
              id="awards"
              value={inputData.awards}
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible
                )
              }
              required
            />
            <label htmlFor="awards" className={styles.form__label}>
              Награды
            </label>
          </div>
        </div>
        */}
        <div className={styles.form_container__checkbox_block}>
          <div>Открывающая картинка</div>
        </div>
        <label className={styles.slider_container__customFileUpload}>
          <input
            type="file"
            name="imageOpen"
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,
                setPreviewPhotos,
                setIsDropPhotoVisible,
                setPreviewPhotoAva,
                setIsPhotoAvaVisible,
                setPreviewPhotoOpen,
                setIsPhotoOpenVisible
              )
            }
            style={{ display: isPhotoOpenVisible ? "block" : "none" }}
          />
          <div className={styles.slider_container__uploadIcon}>
            <img src={icon} alt="icon" />
          </div>
          <div className={styles.slider_container__uploadText}>
            Загрузить изображения
          </div>
        </label>
        <div className={styles.preview_photos_container}>
          {previewPhotoOpen?.map((preview, index) => (
            <div key={index} className={styles.preview_photos_container__block}>
              <img
                className={styles.preview_photos_container__img}
                src={preview}
                alt={`Preview ${index}`}
              />
              <div
                className={styles.preview_photos_container__remove_icon}
                onClick={() => handleRemovePreviewPhotoOpen(index)}
              >
                <span></span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.form_container__description_text}>
          <textarea
            className={styles.form_container__textarea}
            name="textBlock"
            id="textBlock"
            cols="30"
            rows="10"
            placeholder="Дополнительный текстовый блок"
            value={inputData.textBlock}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,
                setPreviewPhotos,
                setIsDropPhotoVisible,
                setPreviewPhotoAva,
                setIsPhotoAvaVisible,
                setPreviewPhotoOpen,
                setIsPhotoOpenVisible
              )
            }
          ></textarea>
          <label
            htmlFor="textBlock"
            className={styles.form_container__textarea_label}
          >
            Текстовый блок
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
            onClick={closeModal}
          ></button>
        </div>
      </form>
    </div>
  );
}
