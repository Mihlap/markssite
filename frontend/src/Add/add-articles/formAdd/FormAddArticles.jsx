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
} from "./formHelpers";
import { fetchArticle } from "../../../store/Slice/articleSlice";
import customStyles from "../../add-project/formAdd/customStyles";

import icon from "./img/Frame4684.svg";
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

  const handleImageUpload = (selectedFile) => {
    // функция которая запускает превью для фото из компонента ImageToDescriptionArticles
    setInputData((prevInputData) => ({
      ...prevInputData,
      imageToDescriptionArticlesImg: selectedFile,
    }));
  };

  const handleImageUploadQuote = (selectedFile) => {
    // функция которая запускает превью для фото из компонента ImageToDescriptionArticles
    setInputData((prevInputData) => ({
      ...prevInputData,
      quoteBlockAvatar: selectedFile,
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
      dynamicBlocks: dynamicData,
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

    console.log("Generated name:", newName);

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

    //  if (!newDynamicData[blockIndex][inputIndex].value) {
    //    newDynamicData[blockIndex][inputIndex].value = "";
    //  }

    //  newDynamicData[blockIndex][inputIndex].value = value;

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
                <div className={styles.slider_container__uploadIcon}>
                  <img src={icon} alt="icon" />
                </div>
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

  console.log(inputData, "<<--inputData ARTICLE");
  console.log(dynamicData, "<<--dynamicData");
  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новая публикация</div>
      <div className={styles.form_container__block_form}>
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
              {`${inputData.descriptionArticle.length}/565`}
            </div>
            <textarea
              className={styles.form_container__textarea}
              name="descriptionArticle"
              id="descriptionArticle"
              cols="30"
              rows="10"
              placeholder="Не более 565 символов"
              value={inputData.descriptionArticle}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 565) {
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
