import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { transliterate } from "transliteration";
import styles from "./FormAddProject.module.scss";
import { fetchProject } from "../../../store/Slice/projectSlice";
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  changeHandler,
  removePreviewPhotoOpen,
  removePreviewPhotoClose,
} from "./formHelpers";
import customStyles from "./customStyles";

import icon from "./img/Frame4684.svg";
import ConstructorPage from "../constructor/ConstructorPage";

export default function FormAddProject({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);

  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);

  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("28,28");

  // << ==== КОНСТУКТОР ==== >>
  // состояние для хранения текущего значения инпута
  const [inputValue, setInputValue] = useState("");

  const [onenConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);

  const [dynamicData, setDynamicData] = useState([]);
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
    headingTextBlock: "",
    textBlock: "",
    imageClose: "",
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // функция отправки формы на Redux
  const submitHandler = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...inputData,
      dynamicBlocks: dynamicData,
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
    // console.log(formattedData, "<<<----консоль на фронте");
    dispatch(fetchProject(formattedData, setInputData));
    setSelectedCompetencies([]);
    setSelectedViewConstruction([]);
    setSelectedRadio("");
    setPreviewPhotos([]);
    setDynamicData([]);
    setInputData({
      title: "",
      selectCompetencies: "",
      countryCity: "",
      monthYear: "",
      viewConstruction: "",
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
      imageClose: "",
    });
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

      //  console.log("Generated name:", newName);

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
      // console.log(
      //   "Updated files:",
      //   newDynamicData[blockIndex][inputIndex].value
      // );
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
          <>
            {labelText === "Видеоролик" ? (
              <div>
                <div className={styles.form_container__checkbox_block}>
                  <div>{labelText}</div>
                </div>
                <label
                  className={
                    styles.slider_container__customFileUploadOrangeColor
                  }
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
                      // console.log(previewsArray);
                      setDynamicPreviews((prev) => {
                        const newPreviews = [...prev];
                        if (!newPreviews[blockIndex]) {
                          newPreviews[blockIndex] = [];
                        }
                        newPreviews[blockIndex][inputIndex] = previewsArray;
                        return newPreviews;
                      });
                    }}
                    style={{ display: isPhotoOpenVisible ? "block" : "none" }}
                  />
                  <div className={styles.slider_container__uploadIcon}>
                    <img src={icon} alt="icon" />
                  </div>
                  <div className={styles.slider_container__uploadText}>
                    Загрузить видеоролик
                  </div>
                </label>
              </div>
            ) : (
              <>
                <div key={inputIndex}>
                  <div className={styles.form_container__checkbox_block}>
                    <div>{labelText}</div>
                  </div>
                  <label
                    className={
                      styles.slider_container__customFileUploadOrangeColor
                    }
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
                    dynamicPreviews[blockIndex][inputIndex].map(
                      (src, index) => (
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
                                handleDeletePreview(
                                  e,
                                  blockIndex,
                                  inputIndex,
                                  index
                                )
                              }
                            >
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </>
            )}
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

  // console.log(inputData, "<<--inputData PROJECT");
  // console.log(dynamicData, "<<--dynamicData");
  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новый проект</div>

      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          {/* первый серый блок с инфой  */}
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
            <div className={`${styles.form__group} ${styles.field}`}>
              <Select
                styles={customStyles}
                isMulti
                name="selectCompetencies"
                options={[
                  { value: "Архитектура", label: "Архитектура" },
                  { value: "BIM", label: "BIM" },
                  { value: "Конструктив", label: "Конструктив" },
                  { value: "Инженерия", label: "Инженерия" },
                  { value: "Дизайн", label: "Дизайн" },
                ]}
                className={styles.form__field}
                placeholder="Выбрать компетенции"
                value={selectedCompetencies}
                onChange={setSelectedCompetencies}
              />
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
            </div>
            <div className={`${styles.form__group} ${styles.field}`}>
              <Select
                styles={customStyles}
                isMulti
                name="viewConstruction"
                value={selectedViewConstruction}
                onChange={setSelectedViewConstruction}
                options={[
                  { value: "Концепция", label: "Концепция" },
                  {
                    value: "Адаптация концепций",
                    label: "Адаптация концепций",
                  },
                  { value: "Дизайн-проекты", label: "Дизайн-проекты" },
                  { value: "Документация РП П", label: "Документация РП П" },
                  { value: "Инженерия", label: "Инженерия" },
                  {
                    value: "Подземные сооружения",
                    label: "Подземные сооружения",
                  },
                  { value: "Линейные объекты", label: "Линейные объекты" },
                  { value: "Конструктив", label: "Конструктив" },
                  {
                    value: "Научно-техническое сопровождение",
                    label: "Научно-техническое сопровождение",
                  },
                  { value: "BIM", label: "BIM" },
                ]}
                className={styles.form__field}
                placeholder="Выберите вид строительства"
              />
            </div>
          </div>
          {/* блок для выбора оринтации  */}
          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>
                Загрузите фото и выберете ориентацию
                <span> для отображения на странице «Проекты»</span>
              </div>
            </div>
            <div
              style={{ display: isPhotoAvaVisible ? "inline-block" : "none" }}
            >
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
                      stroke-width="0.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
          </div>
          {/* блок где загружаются 4 картинки, они отображаются в шапке слайдера  */}
          <div className={`${styles.image_four} ${styles.flex_block_gap}`}>
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
                style={{
                  display: isDropPhotoVisible ? "inline-block" : "none",
                }}
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
                        setIsDropPhotoVisible,
                        setPreviewPhotoAva,
                        setIsPhotoAvaVisible,
                        setPreviewPhotoOpen,
                        setIsPhotoOpenVisible,
                        setPreviewPhotoClose,
                        setIsPhotoCloseVisible
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
                        stroke-width="0.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                  <div className={styles.slider_container__uploadText}>
                    Загрузить изображения
                  </div>
                </label>
              </div>
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
              Заголовок текстового блока
            </label>
            <div className={styles.form_container__heading_block_input_length}>
              {`${inputData.titleTextBlock.length}/56`}
            </div>
          </div>
          {/* блок и текстерией ( Описание проекта ) */}
          <div className={styles.form_container__description_text}>
            <div className={styles.form_container__textarea_length}>
              {`${inputData.descriptionProject.length}/270`}
            </div>
            <textarea
              className={styles.form_container__textarea}
              name="descriptionProject"
              id="descriptionProject"
              cols="30"
              rows="10"
              placeholder="Не более 270 символов"
              value={inputData.descriptionProject}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 270) {
                  setInputData({ ...inputData, descriptionProject: value });
                }
              }}
            ></textarea>
            <label htmlFor="" className={styles.form_container__textarea_label}>
              Описание проекта
            </label>
          </div>
          {/* блок Заполните 3 значения на выбор ( метры, мысота, этажность) */}
          <div className={styles.measure_container}>
            <div className={styles.form_container__textarea_label}>
              Заполните 3 значения на выбор
            </div>
            <div className={styles.form_container__block_gray_one}>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text" // Измените тип на 'text', так как форматирование может включать пробелы
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
                />
                <label htmlFor="totalArea" className={styles.form__label}>
                  Общая площадь, м²
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
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
                />
                <label htmlFor="siteArea" className={styles.form__label}>
                  Площадь участка, га
                </label>
              </div>

              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
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
                />
                <label htmlFor="floors" className={styles.form__label}>
                  Этажность
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
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
                />
                <label htmlFor="altitude" className={styles.form__label}>
                  Высотность, м
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
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
                />
                <label
                  htmlFor="constructionVolume"
                  className={styles.form__label}
                >
                  Строительный объем, м3
                </label>
              </div>
            </div>
          </div>
          {/* блок где мы вводим адрес объекта если есть награды и статьи */}
          <div className={styles.measure_location_container}>
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
                  // required
                />
                <label
                  htmlFor="degreeParticipation"
                  className={styles.form__label}
                >
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
                  // required
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
                  // required
                />
                <label htmlFor="customer" className={styles.form__label}>
                  Заказчик
                </label>
              </div>

              <div className={styles.form_container__block_gray_flex}>
                <div className={styles.form_container__block_public}>
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
                    />
                    <label htmlFor="publication" className={styles.form__label}>
                      Публикация
                    </label>
                  </div>
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
                    />
                    <label
                      htmlFor="publicationTwo"
                      className={styles.form__label}
                    >
                      Публикация
                    </label>
                  </div>
                </div>
                <div className={styles.form_container__block_public_link}>
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
                    />
                    <label
                      htmlFor="linkToPublication"
                      className={styles.form__label}
                    >
                      Ссылк на статью
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
                />
                <label htmlFor="awards" className={styles.form__label}>
                  Награды
                </label>
              </div>
            </div>
          </div>
          {/* блок с картинкой открывающейся */}
          <div className={`${styles.imageOpen_block} ${styles.flex_block_gap}`}>
            <div className={styles.form_container__checkbox_block}>
              <div>Открывающая картинка</div>
            </div>
            <div style={{ display: isPhotoOpenVisible ? "block" : "none" }}>
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
                      stroke-width="0.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
          {/* блок куда вводиться инфа (Заголовок текстового блока ) */}
          <div className={styles.container__heading_block}>
            <div className={styles.form_container__heading_block}>
              <input
                type="input"
                className={styles.form_container__heading_block_input}
                placeholder="Не более 56 символов"
                name="headingTextBlock"
                id="headingTextBlock"
                maxLength="56"
                value={inputData.headingTextBlock}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 56) {
                    setInputData({ ...inputData, headingTextBlock: value });
                  }
                }}
                required
              />
              <label
                htmlFor="headingTextBlock"
                className={styles.form_container__heading_block_label}
              >
                Заголовок текстового блока
              </label>
              <div
                className={styles.form_container__heading_block_input_length}
              >
                {`${inputData.headingTextBlock.length}/56`}
              </div>
            </div>
          </div>
          {/* блок куда вводиться инфа (textarea Заголовока текстового блока ) */}
          <div className={styles.heading_textarea}>
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
          </div>

          {/* КОНСТРУКТОР */}
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
          {/* КОНСТРУКТОР */}
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
                      stroke-width="0.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
