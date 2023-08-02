import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import styles from "./FormAddArticles.module.scss";
import { changeHandler, removePreviewPhoto, removePreviewPhotoAva } from './formHelpers';
import { fetchArticle } from '../../../store/Slice/articleSlice';

import icon from "./img/Frame4684.png";

export default function FormAddArticles({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [inputData, setInputData] = useState({
    title: "",
    author: "",
    city: "",
    dataMonthYear: "",
    dropPhoto: [],
    titleTextBlock: "",
    descriptionArticle: "",
    photoAva: "",
  });

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
    };
    dispatch(
      fetchArticle(
        formattedData,
        setInputData,
        setPreviewPhotos,
        setPreviewPhotoAva
      )
    );
    console.log(formattedData, "<<<----консоль на фронте");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(inputData);
  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новая публикация</div>

      <form onSubmit={submitHandler}>
        <div className={styles.form_container__block_gray_one}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="text"
              className={styles.form__field}
              placeholder="title"
              name="title"
              id="title"
              value={inputData.title}
              onChange={(event) =>
                changeHandler(event, inputData, setInputData)
              }
              required
            />
            <label htmlFor="title" className={styles.form__label}>
              Название статьи
            </label>
          </div>

          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="text"
              className={styles.form__field}
              placeholder="author"
              name="author"
              id="author"
              value={inputData.author}
              onChange={(event) =>
                changeHandler(event, inputData, setInputData)
              }
              required
            />
            <label htmlFor="author" className={styles.form__label}>
              Автор статьи
            </label>
          </div>

          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="text"
              className={styles.form__field}
              placeholder="city"
              name="city"
              id="city"
              value={inputData.city}
              onChange={(event) =>
                changeHandler(event, inputData, setInputData)
              }
              required
            />
            <label htmlFor="city" className={styles.form__label}>
              Издание, город
            </label>
          </div>

          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="text"
              className={styles.form__field}
              placeholder="dataMonthYear"
              name="dataMonthYear"
              id="dataMonthYear"
              value={inputData.dataMonthYear}
              onChange={(event) =>
                changeHandler(event, inputData, setInputData)
              }
              required
            />
            <label htmlFor="dataMonthYear" className={styles.form__label}>
              Дата, месяц, год
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
                  setIsDropPhotoVisible
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
            {`${inputData.descriptionArticle.length}/260`}
          </div>
          <textarea
            className={styles.form_container__textarea}
            name="descriptionArticle"
            id="descriptionArticle"
            cols="30"
            rows="10"
            placeholder="Не более 260 символов"
            value={inputData.descriptionArticle}
            onChange={(event) => {
              const value = event.target.value;
              if (value.length <= 260) {
                setInputData({ ...inputData, descriptionArticle: value });
              }
            }}
          ></textarea>
          <label htmlFor="" className={styles.form_container__textarea_label}>
            Описание проекта
          </label>
        </div>

        <div className={styles.form_container__checkbox_block}>
          <div>
            Фото автора статьи
            {/* <span> для отображения на странице «Проекты»</span> */}
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
