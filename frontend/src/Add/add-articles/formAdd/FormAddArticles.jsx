import React, { useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import styles from "./FormAddArticles.module.scss";
import {
  changeHandler,
  removePreviewPhoto,
  removePreviewPhotoAva,
  removePreviewPhotoClose,
  removePreviewPhotoOpen,
} from "./formHelpers";
import { fetchArticle } from "../../../store/Slice/articleSlice";
import customStyles from "../../add-project/formAdd/customStyles";

import icon from "./img/Frame4684.png";
import ConstructorPage from "../constructor/ConstructorPage";

export default function FormAddArticles({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
  //   const [previewImgConstructor, setPreviewImgConstructor] = useState([]);
  //   const [previewImgConstructorVisible, setpreviewImgConstructorVisible] =
  //     useState(true);
  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [onenConstructor, setOpenConstructor] = useState(false);
  const [inputData, setInputData] = useState({
    title: "",
    author: "",
    city: "",
    dataMonthYear: "",
    selectCompetencies: [],
    dropPhoto: [],
    titleTextBlock: "",
    descriptionArticle: "",
    photoAva: "",
    imageOpen: "",
    textBlock: "",
    imageClose: "",
    blockHeadingTitle: "",
    blockHeadingText: "",
    textBlockArticles: "",
    frameBlock: "",
    imageToDescriptionArticlesText: "",
    imageToDescriptionArticlesImg: "",
  });

  console.log(inputData);

  const handleImageUpload = (selectedFile) => {
    // Here you can update the state with the selected image file
    setInputData((prevInputData) => ({
      ...prevInputData,
      imageToDescriptionArticlesImg: selectedFile,
    }));
  };

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

  // Удаление превью фото из закрывающей картинки
  const handleRemovePreviewPhotoClose = (index) => {
    removePreviewPhotoClose(
      previewPhotoClose,
      setPreviewPhotoClose,
      index,
      inputData,
      setInputData,
      setIsPhotoCloseVisible
    );
  };

  // функция отправки формы на Redux
  const submitHandler = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...inputData,
      selectCompetencies: selectedCompetencies.label,
    };
    dispatch(
      fetchArticle(
        formattedData,
        setInputData,
        setPreviewPhotos,
        setPreviewPhotoAva,
        setPreviewPhotoOpen,
        setPreviewPhotoClose
      )
    );
    setSelectedCompetencies([]);
    setIsModalOpen(false);
    // console.log(formattedData, "<<<----консоль на фронте");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const areAllFieldsFilled = () => {
  //   const {
  //     title,
  //     author,
  //     city,
  //     dataMonthYear,
  //     dropPhoto,
  //     titleTextBlock,
  //     descriptionArticle,
  //     photoAva,
  //     imageOpen,
  //     textBlock,
  //     imageClose,
  //   } = inputData;

  //   return (
  //     title &&
  //     author &&
  //     city &&
  //     dataMonthYear &&
  //     dropPhoto.length > 0 &&
  //     titleTextBlock &&
  //     descriptionArticle &&
  //     photoAva &&
  //     imageOpen &&
  //     textBlock &&
  //     imageClose
  //   );
  // };

  const handlerOpenConstructor = () => {
    setOpenConstructor(!onenConstructor);
  };

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
              // required
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
              // required
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
              // required
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
              // required
            />
            <label htmlFor="dataMonthYear" className={styles.form__label}>
              Дата, месяц, год
            </label>
          </div>
          <Select
            styles={customStyles}
            name="selectCompetencies"
            value={selectedCompetencies}
            onChange={setSelectedCompetencies}
            options={[
              { value: "Научные", label: "Научные" },
              { value: "Апробации", label: "Апробации" },
              { value: "Интервью", label: "Интервью" },
              { value: "Литература", label: "Литература" },
              { value: "Научно-популярные", label: "Научно-популярные" },
              { value: "Инженерия", label: "Инженерия" },
              { value: "Архитектура", label: "Архитектура" },
              { value: "Конструкции", label: "Конструкции" },
              { value: "BIM", label: "BIM" },
              { value: "Digital", label: "Digital" },
            ]}
            className={styles.form__field}
            placeholder="Выбрать компетенции"
          />
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
                setIsPhotoOpenVisible,
                setPreviewPhotoClose,
                setIsPhotoCloseVisible
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
                setIsPhotoOpenVisible,
                setPreviewPhotoClose,
                setIsPhotoCloseVisible
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
                setIsPhotoOpenVisible,
                setPreviewPhotoClose,
                setIsPhotoCloseVisible
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
        <div className={styles.form_container__checkbox_block}>
          <div>Закрывающая картинка</div>
        </div>
        <label className={styles.slider_container__customFileUpload}>
          <input
            type="file"
            name="imageClose"
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
                setIsPhotoOpenVisible,
                setPreviewPhotoClose,
                setIsPhotoCloseVisible
              )
            }
            style={{ display: isPhotoCloseVisible ? "block" : "none" }}
          />
          <div className={styles.slider_container__uploadIcon}>
            <img src={icon} alt="icon" />
          </div>
          <div className={styles.slider_container__uploadText}>
            Загрузить изображения
          </div>
        </label>
        <div className={styles.preview_photos_container}>
          {previewPhotoClose?.map((preview, index) => (
            <div key={index} className={styles.preview_photos_container__block}>
              <img
                className={styles.preview_photos_container__img}
                src={preview}
                alt={`Preview ${index}`}
              />
              <div
                className={styles.preview_photos_container__remove_icon}
                onClick={() => handleRemovePreviewPhotoClose(index)}
              >
                <span></span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.constructor_container}>
          <div className={styles.constructor_container__block}>
            {!onenConstructor ? (
              <div className={styles.constructor_container__block_btn}>
                <button onClick={handlerOpenConstructor}>
                  <svg
                    className={styles.constructor_container__svg}
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
                        fill="#FF7F6A"
                      />
                      <path
                        id="Vector 10"
                        d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </g>
                  </svg>
                </button>
                <div className={styles.constructor_container__text}>
                  Добавить блок из библиотеки
                </div>
              </div>
            ) : (
              <ConstructorPage
                inputData={inputData}
                setInputData={setInputData}
                onImageUpload={handleImageUpload}
              />
            )}
          </div>
        </div>

        <div className={styles.form_container__button_block}>
          <button
            className={styles.form_container__button_save}
            type="submit"
            // disabled={!areAllFieldsFilled()}
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
