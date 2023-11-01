import React, { useState } from "react";
import Select from "react-select";
import { transliterate } from "transliteration";
import { useDispatch } from "react-redux";
import styles from "../../add-project/formAdd/FormAddProject.module.scss";
import {
  changeHandler,
  removePreviewPhoto,
  removePreviewPhotoAva,
  removePreviewPhotoClose,
  removePreviewPhotoOpen,
} from "./utils/formHelpers";
import { fetchArticle } from "../../../store/Slice/articleSlice";
import customStyles from "../../add-project/formAdd/utils/customStyles";

import ConstructorPage from "../constructor/ConstructorPage";
import { PublicationContainer, PublicationIndicator } from "../../add-project/formAdd/utils/CustomSelectComponents";

export default function FormAddArticles({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
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
  });

  // << ==== КОНСТУКТОР ==== >>
  // состояние для хранения текущего значения инпута
  const [inputValue, setInputValue] = useState("");

  const [onenConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);


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
      dynamicBlocks: dynamicData,
      selectCompetencies: selectedCompetencies.map((option) => option.label)
        .join(","),
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

  // << ============ КОНСТРУКТОР ============ >>

  const handlerOpenConstructor = () => {
    setOpenConstructor(!onenConstructor);
  };

  const handleClick = (inputs) => {
    const blockKey = Date.now().toString();
    const newInputs = inputs.map((input) => ({
      ...input,
      key: blockKey + "_" + input.type,
    }));
    setBlocks((prevState) => [...prevState, newInputs]);
    setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);
  };

  const handleDynamicInputChange = (blockIndex, inputIndex, value) => {
    const newDynamicData = [...dynamicData];

    if (!newDynamicData[blockIndex]) {
      newDynamicData[blockIndex] = [];
    }

    if (!newDynamicData[blockIndex][inputIndex]) {
      newDynamicData[blockIndex][inputIndex] = {
        type: "",
        label: "",
        value: "",
      };
    }
  function generateUniqueName(originalName) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const fileExtension = originalName.split(".").pop();

    // Транслитерация части оригинального имени файла
    const sliceOfOriginalName = transliterate(originalName.slice(0, 5));

    const newName = `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;


    return newName;
  }
    if (Array.isArray(value) && value[0] instanceof File) {
      const newFiles = value.map((originalFile) => {
        const uniqueName = generateUniqueName(originalFile.name);
        return new File([originalFile], uniqueName, {
          type: originalFile.type,
        });
      });
      newDynamicData[blockIndex][inputIndex].value = newFiles;
      console.log(
        "Updated files:",
        newDynamicData[blockIndex][inputIndex].value
      );
    } else {
      newDynamicData[blockIndex][inputIndex].value = value;
    }


    setDynamicData(newDynamicData);
  };

  const renderInputWithLabel = (
    inputType,
    labelText,
    blockIndex,
    inputIndex,
    key
  ) => {
    function handleDeletePreview(event, blockIndex, inputIndex, previewIndex) {
      event.preventDefault();
      setDynamicPreviews((prev) => {
        const newPreviews = [...prev];
        if (newPreviews[blockIndex] && newPreviews[blockIndex][inputIndex]) {
          newPreviews[blockIndex][inputIndex].splice(previewIndex, 1);
        }
        return newPreviews;
      });

      setDynamicData((prevData) => {
        const newData = [...prevData];
        if (newData[blockIndex] && newData[blockIndex][inputIndex]) {
          newData[blockIndex][inputIndex].value.splice(previewIndex, 1);
        }
        return newData;
      });

      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = "")); // это очищает значение всех инпутов типа file
    }

    return (
      <div key={inputIndex}>
        {inputType === "text" && (
          // <input type="text" />
          <div className={styles.form_container__heading_block}>
            <input
              type="input"
              maxLength="56" // 2. Установите атрибут maxLength
              value={dynamicData[blockIndex][inputIndex].value || ""} // используйте значение inputValue как текущее значение инпута
              className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
              placeholder={labelText}
              onChange={(e) => {
                setInputValue(e.target.value); // 4. Обновите inputValue при каждом изменении
                handleDynamicInputChange(
                  blockIndex,
                  inputIndex,
                  e.target.value
                );
              }}
            />
            <label
              htmlFor="titleTextBlock"
              className={styles.form_container__heading_block_label}
            >
              {labelText}
            </label>
            <div className={styles.form_container__heading_block_input_length}>
              {(dynamicData[blockIndex][inputIndex].value || "").length}/56
            </div>
          </div>
        )}
        {inputType === "file" && (
          // <input type="file" accept="image/*" />
          <>
            <div key={inputIndex}>
              <div className={styles.form_container__checkbox_block}>
                <div>{labelText}</div>
              </div>
              <label
                className={styles.slider_container__customFileUploadOrangeColor}
              >
                <input
                  type="file"
                  onChange={(e) => {
                    const filesArray = Array.from(e.target.files);
                    handleDynamicInputChange(
                      blockIndex,
                      inputIndex,
                      filesArray
                    );

                    const previewsArray = filesArray.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setDynamicPreviews((prev) => {
                      const newPreviews = [...prev];
                      if (!newPreviews[blockIndex]) {
                        newPreviews[blockIndex] = [];
                      }
                      newPreviews[blockIndex][inputIndex] = previewsArray;
                      return newPreviews;
                    });
                  }}
                  multiple
                  style={{ display: isPhotoOpenVisible ? "block" : "none" }}
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Frame 4684">
                    <path
                      id="Vector"
                      d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <div className={styles.slider_container__uploadText}>
                  Загрузить изображения
                </div>
              </label>
            </div>
            <div className={styles.previewContainer}>
              {dynamicPreviews[blockIndex] &&
                dynamicPreviews[blockIndex][inputIndex] &&
                dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                  <div
                    key={`${blockIndex}-${inputIndex}-${index}`}
                    className={styles.previewWrapper}
                  >
                    <div
                      className={
                        styles.preview_photos_container_block_constructor
                      }
                    >
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className={styles.preview_photos_container__img}
                      />
                      <div
                        className={
                          styles.preview_photos_container_block_constructor__remove_icon
                        }
                        onClick={(e) =>
                          handleDeletePreview(e, blockIndex, inputIndex, index)
                        }
                      >
                        <span></span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        {inputType === "textarea" && (
          <div
            key={inputIndex}
            className={styles.form_container__description_text}
          >
            <div className={styles.form_container__textarea_length}>
              {/* {`${inputData.descriptionArticle.length}/260`} */}
            </div>
            <textarea
              className={`${styles.form_container__textarea} ${styles.orange_color}`}
              // name="descriptionArticle"
              onChange={(e) =>
                handleDynamicInputChange(blockIndex, inputIndex, e.target.value)
              }
              id="descriptionArticle"
              cols="30"
              rows="10"
              placeholder={labelText}
            ></textarea>
            <label htmlFor="" className={styles.form_container__textarea_label}>
              {labelText}
            </label>
          </div>
        )}
        {/* <div className={styles.slider_container__uploadText}>{labelText}</div> */}
      </div>
    );
  };

  const renderInputs = (inputs, blockIndex) => {
    return inputs.map((input, inputIndex) => {
      return renderInputWithLabel(
        input.type,
        input.label,
        blockIndex,
        inputIndex
      );
    });
  };

  // console.log(inputData, "<<--inputData ARTICLE");
  // console.log(dynamicData, "<<--dynamicData");
  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новая публикация</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <div className={styles.form_container__block_gray_one}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                required
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
                required
                type="text"
                className={styles.form__field}
                placeholder="author"
                name="author"
                id="author"
                value={inputData.author}
                onChange={(event) =>
                  changeHandler(event, inputData, setInputData)
                }
              />
              <label htmlFor="author" className={styles.form__label}>
                Автор статьи
              </label>
            </div>

            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                required
                type="text"
                className={styles.form__field}
                placeholder="city"
                name="city"
                id="city"
                value={inputData.city}
                onChange={(event) =>
                  changeHandler(event, inputData, setInputData)
                }
              />
              <label htmlFor="city" className={styles.form__label}>
                Издание, город
              </label>
            </div>

            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="text"
                required
                className={styles.form__field}
                placeholder="dataMonthYear"
                name="dataMonthYear"
                id="dataMonthYear"
                value={inputData.dataMonthYear}
                onChange={(event) =>
                  changeHandler(event, inputData, setInputData)
                }
              />
              <label htmlFor="dataMonthYear" className={styles.form__label}>
                Дата, месяц, год
              </label>
            </div>
            <Select
              styles={customStyles}
              isMulti
              name="selectCompetencies"
              value={selectedCompetencies}
              onChange={setSelectedCompetencies}
              options={[
                { value: "Научные", label: "Научные" },
                { value: "Опробации", label: "Опробации" },
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
              components={{
                DropdownIndicator: PublicationIndicator,
                ValueContainer: PublicationContainer,
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {/* блок где загружаются 4 картинки, они отображаются в шапке слайдера  */}
          <div
            className={`${styles.slider_container} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>
                Слайдер
                <span> *допускается загрузка 4х изображений</span>
              </div>
            </div>
            <div
            // style={{ display: isDropPhotoVisible ? "block" : "none" }}
            >
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
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Frame 4684">
                    <path
                      id="Vector"
                      d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <div className={styles.slider_container__uploadText}>
                  Загрузить изображения
                </div>
              </label>
            </div>
            <div className={styles.preview_photos_container}>
              {inputData.dropPhoto.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
                  <img
                    className={styles.preview_photos_container__img}
                    src={URL.createObjectURL(preview)}
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
          </div>
          {/* блок и инпутом ( Заголовок текстового блока ) */}
          <div className={styles.form_container__heading_block}>
            <input
              required
              type="input"
              className={styles.form_container__heading_block_input}
              placeholder="Нет ограничения по символам"
              name="titleTextBlock"
              id="titleTextBlock"
              // maxLength="56"
              value={inputData.titleTextBlock}
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
            />
            <label
              htmlFor="titleTextBlock"
              className={styles.form_container__heading_block_label}
            >
              Заголовок текстового блока
            </label>
            {/* <div className={styles.form_container__heading_block_input_length}>
              {`${inputData.titleTextBlock.length}/56`}
            </div> */}
          </div>
          {/* блок и текстерией ( Описание статьи ) */}
          <div className={styles.form_container__description_text}>
            {/* <div className={styles.form_container__textarea_length}>
              {`${inputData.descriptionArticle.length}/260`}
            </div> */}
            <textarea
              className={styles.form_container__textarea}
              required
              name="descriptionArticle"
              id="descriptionArticle"
              cols="30"
              rows="10"
              placeholder="Нет ограничения по символам"
              value={inputData.descriptionArticle}
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
            <label htmlFor="" className={styles.form_container__textarea_label}>
              Текст статьи
            </label>
          </div>

          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>
                Фото автора статьи
                {/* <span> для отображения на странице «Проекты»</span> */}
              </div>
            </div>
            <div style={{ display: isPhotoAvaVisible ? "block" : "none" }}>
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
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Frame 4684">
                    <path
                      id="Vector"
                      d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <div className={styles.slider_container__uploadText}>
                  Загрузить изображения
                </div>
              </label>
            </div>
            <div>
              {previewPhotoAva?.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
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
          </div>
          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>Открывающая картинка</div>
            </div>
            <div
              style={{ display: isPhotoOpenVisible ? "inline-block" : "none" }}
            >
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Frame 4684">
                    <path
                      id="Vector"
                      d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <div className={styles.slider_container__uploadText}>
                  Загрузить изображения
                </div>
              </label>
            </div>
            <div>
              {previewPhotoOpen?.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
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

          <div className={styles.inputsContainer}>
            {blocks.map((blockInputs, blockIndex) => (
              <div key={blockIndex} className={styles.inputBlock}>
                {renderInputs(blockInputs, blockIndex)}
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
                <ConstructorPage handleClick={handleClick} />
              )}
            </div>
          </div>

          <div
            className={`${styles.imageClose_block} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>Закрывающая картинка</div>
            </div>
            <div style={{ display: isPhotoCloseVisible ? "block" : "none" }}>
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
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Frame 4684">
                    <path
                      id="Vector"
                      d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <div className={styles.slider_container__uploadText}>
                  Загрузить изображения
                </div>
              </label>
            </div>
            <div>
              {previewPhotoClose?.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
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
    </div>
  );
}
