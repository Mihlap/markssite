import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import compressImageFile from "browser-image-compression";

import { transliterate } from "transliteration";
import styles from "./FormAddProject.module.scss";
import {
  clearFormData,
  fetchProject,
  setProjectId,
} from "../../../store/Slice/projectSlice";
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  changeHandler,
  removePreviewPhotoOpen,
  removePreviewPhotoClose,
} from "./utils/formHelpers";
import customStyles from "./utils/customStyles";
import {
  DropdownIndicator,
  ValueContainer,
  AnotherDropdownIndicator,
  AnotherValueContainer,
  SelectDegreeParticipationDropdownIndicator,
  SelectDegreeParticipationValueContainer,
  SelectStatusObjectDropdownIndicator,
  SelectStatusObjectValueContainer,
  MonthDropdownIndicator,
  MonthValueContainer,
  YearDropdownIndicator,
  YearValueContainer,
} from "./utils/CustomSelectComponents";

import ConstructorPage from "../constructor/ConstructorPage";
import { monthOptions, yearOptions } from "./utils/Time";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function FormEditProject({ setIsModalOpen, editProjectData }) {
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({
    title: "",
    selectCompetencies: [],
    countryCity: "",
    monthYear: "",
    viewConstruction: [],
    dropPhoto: [],
    photoAva: "",
    imageProject: "",
    imageTitle: "",
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
    numberOfLanes: "",
    long: "",
  });

  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [selectDegreeParticipation, setSelectDegreeParticipation] =
    useState(null);
  const [selectStatusObject, setSelectStatusObject] = useState(null);

  const [isFocused, setIsFocused] = useState(false);
  // const [selectedRadio, setSelectedRadio] = useState("28,28");

  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);

  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);

  const [isMonthValid, setIsMonthValid] = useState(true);
  const [isYearValid, setIsYearValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);

  // << ==== useStates для конструктора ==== >>
  const [inputValue, setInputValue] = useState("");
  const [openConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);

  const countFilledInputs = () => {
    const inputsToCheck = [
      "totalArea",
      "siteArea",
      "floors",
      "altitude",
      "constructionVolume",
      "numberOfLanes",
      "long",
    ];
    return inputsToCheck.filter((input) => inputData[input]).length;
  };

  useEffect(() => {
    if (editProjectData) {
       
      const initialSelectedCompetencies = editProjectData.selectCompetencies
        ? editProjectData.selectCompetencies
            .split(",")
            .map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];
      const [selectedMonth, selectedYear] = (
        editProjectData.monthYear || ""
      ).split(" ");

      const initialViewConstruction = editProjectData.viewConstruction
        ? editProjectData.viewConstruction
            .split(",")
            .map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];
      
      // Set form data from editProjectData
      setSelectedCompetencies(initialSelectedCompetencies);
      setSelectedMonth({ value: selectedMonth, label: selectedMonth });
      setSelectedYear({ value: selectedYear, label: selectedYear });
      setSelectedViewConstruction(initialViewConstruction);
      setSelectDegreeParticipation(
        editProjectData.degreeParticipation
          ? { label: editProjectData.degreeParticipation }
          : null
      );
      setSelectStatusObject(
        editProjectData.statusObject
          ? { label: editProjectData.statusObject }
          : null
      );

      setInputData((prevInputData) => {
        const updatedInputData = {
          ...prevInputData,
          title:
            editProjectData.title !== undefined ? editProjectData.title : "",
          selectCompetencies: initialSelectedCompetencies,
          countryCity:
            editProjectData.countryCity !== undefined
              ? editProjectData.countryCity
              : "",
          monthYear:
            editProjectData.monthYear !== undefined
              ? editProjectData.monthYear
              : "",
          viewConstruction: initialViewConstruction,
          dropPhoto:
            editProjectData.dropPhoto !== undefined
              ? editProjectData.dropPhoto
              : [],
          photoAva:
            editProjectData.photoAva !== undefined
              ? editProjectData.photoAva
              : "",
          imageProject:
            editProjectData.imageProject !== undefined
                ? editProjectData.imageProject
                : "",
          imageTitle:
            editProjectData.imageTitle !== undefined
                ? editProjectData.imageTitle
                : "",
          titleTextBlock:
            editProjectData.titleTextBlock !== undefined
              ? editProjectData.titleTextBlock
              : "",
          descriptionProject:
            editProjectData.descriptionProject !== undefined
              ? editProjectData.descriptionProject
              : "",
          totalArea:
            editProjectData.totalArea !== undefined
              ? editProjectData.totalArea
              : "",
          siteArea:
            editProjectData.siteArea !== undefined
              ? editProjectData.siteArea
              : "",
          floors:
            editProjectData.floors !== undefined ? editProjectData.floors : "",
          altitude:
            editProjectData.altitude !== undefined
              ? editProjectData.altitude
              : "",
          constructionVolume:
            editProjectData.constructionVolume !== undefined
              ? editProjectData.constructionVolume
              : "",
          location:
            editProjectData.location !== undefined
              ? editProjectData.location
              : "",
          degreeParticipation:
            editProjectData.degreeParticipation !== undefined
              ? editProjectData.degreeParticipation
              : "",
          statusObject:
            editProjectData.statusObject !== undefined
              ? editProjectData.statusObject
              : "",
          customer:
            editProjectData.customer !== undefined
              ? editProjectData.customer
              : "",
          publication:
            editProjectData.publication !== undefined
              ? editProjectData.publication
              : "",
          linkToPublication:
            editProjectData.linkToPublication !== undefined
              ? editProjectData.linkToPublication
              : "",
          publicationTwo:
            editProjectData.publicationTwo !== undefined
              ? editProjectData.publicationTwo
              : "",
          linkToPublicationTwo:
            editProjectData.linkToPublicationTwo !== undefined
              ? editProjectData.linkToPublicationTwo
              : "",
          awards:
            editProjectData.awards !== undefined ? editProjectData.awards : "",
          imageOpen:
            editProjectData.imageOpen !== undefined
              ? editProjectData.imageOpen
              : "",
          headingTextBlock:
            editProjectData.headingTextBlock !== undefined
              ? editProjectData.headingTextBlock
              : "",
          textBlock:
            editProjectData.textBlock !== undefined
              ? editProjectData.textBlock
              : "",
          imageClose:
            editProjectData.imageClose !== undefined
              ? editProjectData.imageClose
              : "",
          numberOfLanes:
            editProjectData.numberOfLanes !== undefined
              ? editProjectData.numberOfLanes
              : "",
          long: editProjectData.long !== undefined ? editProjectData.long : "",
          dynamicDataFromEditProject:
            editProjectData.dynamicDataFromEditProject !== undefined
              ? editProjectData.dynamicDataFromEditProject
              : "",
        };
        // console.log("Обновленные данные формы:", updatedInputData);
        return updatedInputData;
      });

      const dynamicDataFromEditProject = editProjectData.dynamicData;

      if (
        editProjectData.dynamicDataFromEditProject &&
        editProjectData.dynamicDataFromEditProject.length > 0
      ) {
        setDynamicData(editProjectData.dynamicDataFromEditProject);
        const previewsArray = dynamicDataFromEditProject.map((block) =>
          block.map((input) => input.value)
        );

        setDynamicPreviews(previewsArray);
      }
    }
  }, [editProjectData]);

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

  const validateForm = () => {
    let isValid = true;
    let errors = [];

    // Проверяем, был ли выбран месяц
    if (!selectedMonth) {
      setIsMonthValid(false);
      isValid = false;
      errors.push("Месяц");
    } else {
      setIsMonthValid(true);
    }

    // Проверяем, был ли выбран год
    if (!selectedYear) {
      setIsYearValid(false);
      isValid = false;
      errors.push("Год");
    } else {
      setIsYearValid(true);
    }

    // Сохраняем сообщение об ошибке
    if (!isValid) {
      setErrorMessage(
        `Пожалуйста, заполните следующие обязательные поля: ${errors.join(
          ", "
        )}.`
      );
    }

    return isValid;
  };

  // закрывает модалкку формы
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // функция отправки формы на Redux
  const submitHandler = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (!isFormValid) {
      console.error(
        "Форма не прошла валидацию. Работа функции submitHandler прервана."
      );
      return;
    }

    try {
      const formattedData = {
        ...inputData,
        dynamicBlocks: dynamicData,
        selectCompetencies: Array.isArray(selectedCompetencies)
          ? selectedCompetencies.map((option) => option.label).join(",")
          : "",
        degreeParticipation: selectDegreeParticipation.label,
        statusObject: selectStatusObject.label,
        viewConstruction: Array.isArray(selectedViewConstruction)
          ? selectedViewConstruction.map((option) => option.label).join(",")
          : "",
        photoAva: inputData.photoAva,
        imageOpen: inputData.imageOpen,
      };

      // Добавим проверки на пустоту перед маппингом
      if (
        formattedData.selectCompetencies &&
        formattedData.selectCompetencies !== ""
      ) {
        formattedData.selectCompetencies = Array.isArray(
          formattedData.selectCompetencies
        )
          ? formattedData.selectCompetencies
              .map((option) => option.label)
              .join(",")
          : formattedData.selectCompetencies;
      }

      if (
        formattedData.viewConstruction &&
        formattedData.viewConstruction !== ""
      ) {
        formattedData.viewConstruction = Array.isArray(
          formattedData.viewConstruction
        )
          ? formattedData.viewConstruction
              .map((option) => option.label)
              .join(",")
          : formattedData.viewConstruction;
      }

      // Определение, создаем новый проект или обновляем существующий
      if (editProjectData && editProjectData.id) {
        dispatch(setProjectId(editProjectData.id));
        // Обновление существующего проекта
        await dispatch(
          fetchProject(formattedData, setInputData, editProjectData.id)
        );
      } else {
        // Создание нового проекта
        await dispatch(fetchProject(formattedData, setInputData));
      }

      dispatch(clearFormData());

      // Очищаем состояния
      setSelectedCompetencies([]);
      setSelectDegreeParticipation("");
      setSelectStatusObject("");
      setSelectedViewConstruction([]);
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
        imageProject: "",
        imageTitle: "",
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

      setErrorMessage(""); // Очищаем ошибки
      setIsModalOpen(false);
    } catch (error) {
      console.error("Произошла ошибка при отправке формы:", error);
      // Обработка ошибки, например, вывод сообщения об ошибке пользователю
    }
  };

  // << ============ функции КОНСТРУКТОРА ============ >>

  const handlerOpenConstructor = () => {
    setOpenConstructor(!openConstructor);
  };

  // функция которая не даёт создать новый диманический блок, пока не заполнены value предыдущего
  const areAllBlocksFilled = () => {
    for (let block of dynamicData) {
      for (let input of block) {
        // Проверяем только обязательные поля
        if (input.required && (!input.value || input.value === "")) {
          return false;
        }
      }
    }
    return true;
  };

  const handleRemoveBlock = (blockIndex) => {
    setDynamicData((prevDynamicData) =>
      prevDynamicData.filter((_, index) => index !== blockIndex)
    );
    // Обновление других связанных состояний...
    setBlocks((prevBlocks) =>
      prevBlocks.filter((_, index) => index !== blockIndex)
    );
    setDynamicPreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== blockIndex)
    );
  };
  // функция которая срабатывает в случае если мы всё-таки пытаемся создать блок выдает ( алерт ), в случае успеза проходит в дальше и создаёт новый динамический блок
  const handleClick = (inputs) => {
    if (!areAllBlocksFilled()) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      return;
    }

    const blockKey = Date.now().toString();
    const newInputs = inputs.map((input) => ({
      ...input,
      key: blockKey + "_" + input.type,
    }));
    setBlocks((prevState) => [...prevState, newInputs]);
    setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);
    //  handlerOpenConstructor();
  };

  async function compressImage(file) {
    const options = {
      maxSizeMB: 4, // максимальный размер файла в MB
      maxWidthOrHeight: 1920, // максимальная ширина или высота
      useWebWorker: true,
    };

    try {
      return await compressImageFile(file, options);
    } catch (error) {
      console.error("Ошибка при сжатии изображения:", error);
    }
  }

  // обработчик динамических значений
  const handleDynamicInputChange = async (blockIndex, inputIndex, value) => {
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
      const sliceOfOriginalName = transliterate(originalName.slice(0, 5));
      const newName = `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;
      return newName;
    }

    if (Array.isArray(value) && value[0] instanceof File) {
      const newFiles = await Promise.all(
        value.map(async (originalFile) => {
          if (originalFile.type.startsWith("image/")) {
            // Сжимаем только изображения
            const compressedFile = await compressImage(originalFile);
            const uniqueName = generateUniqueName(compressedFile.name);
            return new File([compressedFile], uniqueName, {
              type: compressedFile.type,
            });
          } else {
            // Если файл не является изображением, возвращаем его без изменений
            const uniqueName = generateUniqueName(originalFile.name);
            return new File([originalFile], uniqueName, {
              type: originalFile.type,
            });
          }
        })
      );

      newDynamicData[blockIndex][inputIndex].value = newFiles;
    } else {
      newDynamicData[blockIndex][inputIndex].value = value;
    }

    setDynamicData(newDynamicData);
  };

  // этот цикл сделан для присвоения разных стилей для одной конструкции превью
  const getPreviewClassName = (label) => {
    switch (label) {
      case "Картинка с описанием":
        return {
          outerDiv: styles.imgWithDescriptionPreview,
          innerDiv: styles.someInnerDivStyle,
        };
      case "Слайдер *допускается загрузка 8ми изображений":
        return {
          outerDiv: styles.sliderPreview,
          innerDiv: styles.sliderPreviewDiv,
        };
      case "Блок 2е вертикальные картинки":
        return {
          outerDiv: styles.verticallyBlock,
          innerDiv: styles.previewWerticallyBlock,
          verticalImgTwo: styles.verticalTwoImg,
        };
      case "Блок 3 картинки":
        return {
          outerDiv: styles.horizontalImage,
          innerDiv: styles.horizontalImage2,
          imageStyles: [
            styles.horizontalImage1,
            styles.horizontalImage2,
            styles.verticalImage,
          ],
        };

      case "Видеоролик":
        return {
          outerDiv: styles.videoPreview,
          innerDiv: styles.videoInnerDiv,
          videoStyles: styles.videoStyle, // этот стиль можно использовать для видеотега
        };
      default:
        return "";
    }
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

    const classNames = getPreviewClassName(labelText);

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
                    accept="video/*" // Это будет принимать только видеофайлы
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
                  />
                  <svg
                    className={styles.slider_container__svg}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M11.8346 7.54949L5.64198 7.54949C5.46544 7.54642 5.29006 7.57854 5.12606 7.64398C4.96206 7.70942 4.81274 7.80686 4.68681 7.93062C4.56088 8.05439 4.46085 8.20199 4.39257 8.36483C4.3243 8.52766 4.28913 8.70246 4.28913 8.87903C4.28913 9.0556 4.3243 9.2304 4.39257 9.39323C4.46085 9.55607 4.56088 9.70367 4.68681 9.82744C4.81274 9.9512 4.96206 10.0486 5.12606 10.1141C5.29006 10.1795 5.46544 10.2116 5.64198 10.2086L11.7538 10.1277C12.451 10.1156 13.1156 9.83011 13.6043 9.33275C14.0931 8.8354 14.367 8.16596 14.367 7.46862C14.367 6.77129 14.0931 6.10185 13.6043 5.60449C13.1156 5.10713 12.451 4.82165 11.7538 4.80953L5.64198 4.88946C4.58388 4.88946 3.56912 5.30979 2.82093 6.05798C2.07274 6.80617 1.65241 7.82093 1.65241 8.87903C1.65241 9.93713 2.07274 10.9519 2.82093 11.7001C3.56912 12.4483 4.58388 12.8686 5.64198 12.8686L11.5187 12.8752"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className={styles.slider_container__uploadText}>
                    Загрузить видеоролик
                  </div>
                </label>
                {/* Добавляем блок превью видео ниже */}
                {dynamicPreviews[blockIndex] &&
                  dynamicPreviews[blockIndex][inputIndex] &&
                  dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                    <div
                      key={`${blockIndex}-${inputIndex}-${index}`}
                      className={classNames.innerDiv}
                    >
                      <div
                        className={
                          styles.preview_photos_container_block_constructor
                        }
                      >
                        <video
                          key={index}
                          src={src}
                          muted
                          loop
                          autoPlay
                          className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
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
                  ))}
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
                    />
                    <svg
                      className={styles.slider_container__svg}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M11.8346 7.54949L5.64198 7.54949C5.46544 7.54642 5.29006 7.57854 5.12606 7.64398C4.96206 7.70942 4.81274 7.80686 4.68681 7.93062C4.56088 8.05439 4.46085 8.20199 4.39257 8.36483C4.3243 8.52766 4.28913 8.70246 4.28913 8.87903C4.28913 9.0556 4.3243 9.2304 4.39257 9.39323C4.46085 9.55607 4.56088 9.70367 4.68681 9.82744C4.81274 9.9512 4.96206 10.0486 5.12606 10.1141C5.29006 10.1795 5.46544 10.2116 5.64198 10.2086L11.7538 10.1277C12.451 10.1156 13.1156 9.83011 13.6043 9.33275C14.0931 8.8354 14.367 8.16596 14.367 7.46862C14.367 6.77129 14.0931 6.10185 13.6043 5.60449C13.1156 5.10713 12.451 4.82165 11.7538 4.80953L5.64198 4.88946C4.58388 4.88946 3.56912 5.30979 2.82093 6.05798C2.07274 6.80617 1.65241 7.82093 1.65241 8.87903C1.65241 9.93713 2.07274 10.9519 2.82093 11.7001C3.56912 12.4483 4.58388 12.8686 5.64198 12.8686L11.5187 12.8752"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className={styles.slider_container__uploadText}>
                      Загрузить изображения
                    </div>
                  </label>
                </div>
                <div
                  className={`${styles.previewContainer} ${classNames.outerDiv}`}
                >
                  {dynamicPreviews[blockIndex] &&
                    dynamicPreviews[blockIndex][inputIndex] &&
                    dynamicPreviews[blockIndex][inputIndex].map(
                      (src, index) => {
                        return (
                          <div
                            key={`${blockIndex}-${inputIndex}-${index}`}
                            className={classNames.innerDiv}
                          >
                            <div
                              className={
                                styles.preview_photos_container_block_constructor
                              }
                            >
                              <img
                                src={src}
                                alt={`Preview ${index}`}
                                className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
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
                        );
                      }
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
            <label
              htmlFor=""
              className={styles.form_container__textarea_label_constructor}
            >
              {labelText}
            </label>
          </div>
        )}
        {/* <div className={styles.slider_container__uploadText}>{labelText}</div> */}
      </div>
    );
  };

  const renderInputs = (inputs, blockIndex) => {
    return (
      <div key={blockIndex} className={styles.blockContainer}>
        {inputs.map((input, inputIndex) =>
          renderInputWithLabel(
            input.type,
            input.label,
            blockIndex,
            inputIndex,
            input.key
          )
        )}
        <div
          className={styles.blockContainer__close_button}
          onClick={() => handleRemoveBlock(blockIndex)}
        ></div>
      </div>
    );
  };

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
    if (selectedYear) {
      setInputData({
        ...inputData,
        monthYear: `${selectedOption.value} ${selectedYear.value}`,
      });
    }
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
    if (selectedMonth) {
      setInputData({
        ...inputData,
        monthYear: `${selectedMonth.value} ${selectedOption.value}`,
      });
    }
  };

  // << ============ функции КОНСТРУКТОРА ============ >>

  // console.log(inputData, "<<--inputData PROJECT");
  // console.log(dynamicData, "<<--dynamicData");
  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Сначала заполните все обязательные поля в предыдущем блоке❗
        </div>
      )}
      <div className={styles.form_container__title}>
        {editProjectData ? "Редактирование проекта" : "Новый проект"}
      </div>
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
                autoComplete="off"
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
                value={selectedCompetencies || []} 
                onChange={setSelectedCompetencies}
                // onChange={(selectedOptions) => setSelectedCompetencies(selectedOptions || [])} 
                components={{ DropdownIndicator, ValueContainer }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
                autoComplete="off"
                required
              />
              <label htmlFor="countryCity" className={styles.form__label}>
                Страна, город
              </label>
            </div>
            <div className={styles.form_container__time_block}>
              <div
                className={`${styles.form__group} ${styles.form_container__month_block}`}
              >
                <label htmlFor="month" className={styles.form__label}>
                  Месяц
                </label>
                <Select
                  id="month"
                  styles={customStyles}
                  className={styles.form__field}
                  value={selectedMonth || []}  
                  onChange={handleMonthChange}
                  options={monthOptions}
                  placeholder="Месяц"
                  components={{
                    DropdownIndicator: MonthDropdownIndicator,
                    ValueContainer: MonthValueContainer,
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>

              <div
                className={`${styles.form__group} ${styles.form_container__year_block}`}
              >
                <label htmlFor="year" className={styles.form__label}>
                  Год
                </label>
                <Select
                  id="year"
                  styles={customStyles}
                  className={styles.form__field}
                  value={selectedYear || []}
                  onChange={handleYearChange}
                  options={yearOptions}
                  placeholder="Год"
                  components={{
                    DropdownIndicator: YearDropdownIndicator,
                    ValueContainer: YearValueContainer,
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              {errorMessage && (
                <div className={styles.form_error_message}>
                  <div className={styles.form_error_message_div}>
                    <button
                      onClick={() => setErrorMessage("")}
                      className={styles.form_error_close_button}
                      aria-label="Закрыть"
                    >
                      ✕
                    </button>
                    {errorMessage}
                  </div>
                </div>
              )}
            </div>
            <div className={`${styles.form__group} ${styles.field}`}>
              <Select
                styles={customStyles}
                isMulti
                name="viewConstruction"
                value={selectedViewConstruction || []}
                onChange={setSelectedViewConstruction}
                options={[
                  {
                    value: "Архитектура и концепция",
                    label: "Архитектура и концепция",
                  },
                  {
                    value: "Градостроительство и генплан",
                    label: "Градостроительство и генплан",
                  },
                  {
                    value: "Конструктив",
                    label: "Конструктив",
                  },
                  {
                    value: "Инженерия",
                    label: "Инженерия",
                  },
                  {
                    value: "Геотехника",
                    label: "Геотехника",
                  },
                  {
                    value: "Наука",
                    label: "Наука",
                  },
                  {
                    value: "Технологии",
                    label: "Технологии",
                  },
                  {
                    value: "Цифровые технологии",
                    label: "Цифровые технологии",
                  },
                ]}
                className={styles.form__field}
                placeholder="Выберите табы фильтрации"
                components={{
                  DropdownIndicator: AnotherDropdownIndicator,
                  ValueContainer: AnotherValueContainer,
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
          </div>
          {/* блок для выбора оринтации  */}
          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>
                Выберете фото
                <span> для отображения на странице “Проекты”</span>
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
                      setIsPhotoCloseVisible,
                      setIsLoading,
                      setIsLoadingDropPhoto,
                      setIsLoadingOpenImage,
                      setIsLoadingCloseImage
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

                <div className={styles.slider_container__uploadTextForm}>
                  Загрузить изображения
                </div>
              </label>
              {isLoading && (
                <div className={styles.preview_photos_container__loading}>
                  Загрузка . . .
                </div>
              )}
            </div>
            <div>
            {inputData.imageProject !== null && (
                <div className={styles.preview_photos_container__block}>
                  <img
                    className={styles.preview_photos_container__img}
                    src={`${Host}/images/imageAdd/${inputData.imageProject}`}
                    alt="Preview"
                  />
                  {/* <div
                  className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoClose()}
                   >
                   <span></span>
                   </div> */}
                </div>
              )}
              {previewPhotoAva?.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
                  <img
                    className={styles.preview_photos_container__img}
                    src={preview || ''} 
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
              {/* {previewPhotoAva?.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
                  <img
                    className={styles.preview_photos_container__img}
                    src={preview || ''} 
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
               {inputData.imageProject !== null && (
                <div className={styles.preview_photos_container__block}>
                  <img
                    className={styles.preview_photos_container__img}
                    src={`${Host}/images/imageAdd/${inputData.imageProject}`}
                    alt="Preview"
                  />
                  <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoClose()}
                  >
                    <span></span>
                  </div>
                </div>
              )} */}
            </div>
            {/* <div className={styles.form_container__radio_container}>
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
            </div> */}
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
              // style={{
              //   display: isDropPhotoVisible ? "inline-block" : "none",
              // }}
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
                        setIsPhotoCloseVisible,
                        setIsLoading,
                        setIsLoadingDropPhoto,
                        setIsLoadingOpenImage,
                        setIsLoadingCloseImage
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
                  <div className={styles.slider_container__uploadTextForm}>
                    Загрузить изображения
                  </div>
                </label>
                {isLoadingDropPhoto && (
                  <div className={styles.preview_photos_container__loading}>
                    Загрузка . . .
                  </div>
                )}
              </div>
            </div>
            <div className={styles.preview_photos_container}>
              {inputData.dropPhoto && inputData.dropPhoto.map((preview, index) => (
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
            {inputData.imageTitle && inputData.imageTitle.split(',').map((imageFileName, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
                  <img
                    className={styles.preview_photos_container__img}
                    src={`${Host}/images/imageAdd/${imageFileName.trim()}`}
                    alt={`Preview ${index}`}
                  />
                  {/* <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhoto(index)}
                  >
                    <span></span>
                  </div> */}
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
              autoComplete="off"
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
              {`${inputData.descriptionProject.length}/260`}
            </div>
            <textarea
              className={styles.form_container__textarea}
              autoComplete="off"
              required
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
                  autoComplete="off"
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
                  disabled={countFilledInputs() >= 3 && !inputData.totalArea}
                />
                {inputData.totalArea && (
                  <span className={styles.measurement}>м²</span>
                )}
                <label
                  htmlFor="totalArea"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.totalArea
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Общая площадь, м²
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="siteArea"
                  name="siteArea"
                  autoComplete="off"
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
                  disabled={countFilledInputs() >= 3 && !inputData.siteArea}
                />
                {inputData.siteArea && (
                  <span className={styles.measurement}>га</span>
                )}
                <label
                  htmlFor="siteArea"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.siteArea
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Площадь участка, га
                </label>
              </div>

              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="floors"
                  name="floors"
                  autoComplete="off"
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
                  disabled={countFilledInputs() >= 3 && !inputData.floors}
                />
                <label
                  htmlFor="floors"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.floors
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Этажность
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="altitude"
                  name="altitude"
                  autoComplete="off"
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
                  disabled={countFilledInputs() >= 3 && !inputData.altitude}
                />
                {inputData.altitude && (
                  <span className={styles.measurement}>м</span>
                )}
                <label
                  htmlFor="altitude"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.altitude
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Высотность, м
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="constructionVolume"
                  name="constructionVolume"
                  autoComplete="off"
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
                  disabled={
                    countFilledInputs() >= 3 && !inputData.constructionVolume
                  }
                />
                {inputData.constructionVolume && (
                  <span className={styles.measurement}>м³</span>
                )}
                <label
                  htmlFor="constructionVolume"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.constructionVolume
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Строительный объем, м³
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="numberOfLanes"
                  name="numberOfLanes"
                  autoComplete="off"
                  id="numberOfLanes"
                  value={inputData.numberOfLanes}
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
                  disabled={
                    countFilledInputs() >= 3 && !inputData.numberOfLanes
                  }
                />
                <label
                  htmlFor="numberOfLanes"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.numberOfLanes
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Количество полос
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="long"
                  name="long"
                  autoComplete="off"
                  id="long"
                  value={inputData.long}
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
                  disabled={countFilledInputs() >= 3 && !inputData.long}
                />
                {inputData.long && (
                  <span className={styles.measurement}>км</span>
                )}
                <label
                  htmlFor="long"
                  className={`${styles.form__label} ${
                    countFilledInputs() >= 3 && !inputData.long
                      ? styles.disabledLabel
                      : ""
                  }`}
                >
                  Длинна, км
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
                  autoComplete="off"
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
                <Select
                  styles={customStyles}
                  // isMulti
                  name="degreeParticipation"
                  options={[
                    {
                      value: "Генеральное проектирование",
                      label: "Генеральное проектирование",
                    },
                    {
                      value: "Проектирование отдельных разделов",
                      label: "Проектирование отдельных разделов",
                    },
                  ]}
                  className={styles.form__field}
                  placeholder="Степень участия"
                  value={
                    selectDegreeParticipation
                      ? {
                          value: selectDegreeParticipation.value,
                          label: selectDegreeParticipation.label,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setSelectDegreeParticipation(
                      selectedOption
                        ? {
                            value: selectedOption.value,
                            label: selectedOption.label,
                          }
                        : null
                    )
                  }
                  components={{
                    DropdownIndicator:
                      SelectDegreeParticipationDropdownIndicator,
                    ValueContainer: SelectDegreeParticipationValueContainer,
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <Select
                  styles={customStyles}
                  // isMulti
                  name="statusObject"
                  options={[
                    {
                      value: "Завершен",
                      label: "Завершен",
                    },
                    {
                      value: "В работе",
                      label: "В работе",
                    },
                  ]}
                  className={styles.form__field}
                  placeholder="Статус объекта"
                  value={
                    selectStatusObject
                      ? {
                          value: selectStatusObject.value,
                          label: selectStatusObject.label,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setSelectStatusObject(
                      selectedOption
                        ? {
                            value: selectedOption.value,
                            label: selectedOption.label,
                          }
                        : null
                    )
                  }
                  components={{
                    DropdownIndicator: SelectStatusObjectDropdownIndicator,
                    ValueContainer: SelectStatusObjectValueContainer,
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="customer"
                  name="customer"
                  autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                  autoComplete="off"
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
                      setIsPhotoCloseVisible,
                      setIsLoading,
                      setIsLoadingDropPhoto,
                      setIsLoadingOpenImage,
                      setIsLoadingCloseImage
                    )
                  }
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M11.8346 7.54949L5.64198 7.54949C5.46544 7.54642 5.29006 7.57854 5.12606 7.64398C4.96206 7.70942 4.81274 7.80686 4.68681 7.93062C4.56088 8.05439 4.46085 8.20199 4.39257 8.36483C4.3243 8.52766 4.28913 8.70246 4.28913 8.87903C4.28913 9.0556 4.3243 9.2304 4.39257 9.39323C4.46085 9.55607 4.56088 9.70367 4.68681 9.82744C4.81274 9.9512 4.96206 10.0486 5.12606 10.1141C5.29006 10.1795 5.46544 10.2116 5.64198 10.2086L11.7538 10.1277C12.451 10.1156 13.1156 9.83011 13.6043 9.33275C14.0931 8.8354 14.367 8.16596 14.367 7.46862C14.367 6.77129 14.0931 6.10185 13.6043 5.60449C13.1156 5.10713 12.451 4.82165 11.7538 4.80953L5.64198 4.88946C4.58388 4.88946 3.56912 5.30979 2.82093 6.05798C2.07274 6.80617 1.65241 7.82093 1.65241 8.87903C1.65241 9.93713 2.07274 10.9519 2.82093 11.7001C3.56912 12.4483 4.58388 12.8686 5.64198 12.8686L11.5187 12.8752"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className={styles.slider_container__uploadTextForm}>
                  Загрузить изображения
                </div>
              </label>
              {isLoadingOpenImage && (
                <div className={styles.preview_photos_container__loading}>
                  Загрузка . . .
                </div>
              )}
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
              {inputData.imageOpen && previewPhotoOpen.length === 0 && (
                <div className={styles.preview_photos_container__block}>
                  <img
                    className={styles.preview_photos_container__img}
                    src={`${Host}/images/imageAdd/${inputData.imageOpen}`}
                    alt="Preview"
                  />
                  {/* <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoOpen()}
                  >
                    <span></span>
                  </div> */}
                </div>
              )}
            </div>
          </div>
          {/* блок куда вводиться инфа (Заголовок текстового блока ) */}
          <div className={styles.container__heading_block}>
            <div className={styles.form_container__heading_block}>
              <input
                type="input"
                className={styles.form_container__heading_block_input}
                placeholder="Не более 56 символов"
                autoComplete="off"
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
                // required
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
                autoComplete="off"
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
                required
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
          <div className={styles.inputs_container}>
            {blocks.map((blockInputs, blockIndex) => (
              <div key={blockIndex} className={styles.input_block}>
                {renderInputs(blockInputs, blockIndex)}
              </div>
            ))}
          </div>
          <div className={styles.constructor_container}>
            <div className={styles.constructor_container__block}>
              {!openConstructor ? (
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
          {/* блок с картинкой закрывающейся */}
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
                      setIsPhotoCloseVisible,
                      setIsLoading,
                      setIsLoadingDropPhoto,
                      setIsLoadingOpenImage,
                      setIsLoadingCloseImage
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
                <div className={styles.slider_container__uploadTextForm}>
                  Загрузить изображения
                </div>
              </label>
              {isLoadingCloseImage && (
                <div className={styles.preview_photos_container__loading}>
                  Загрузка . . .
                </div>
              )}
            </div>
            <div>         
              {previewPhotoClose.map((preview, index) => (
                <div
                  key={index}
                  className={styles.preview_photos_container__block}
                >
                  <img
                    className={styles.preview_photos_container__img}
                    src={preview || ''} 
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
              {inputData.imageClose !== null && (
                <div className={styles.preview_photos_container__block}>
                  <img
                    className={styles.preview_photos_container__img}
                    src={`${Host}/images/imageAdd/${inputData.imageClose}`}
                    alt="Preview"
                  />
                  {/* <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoClose()}
                  >
                    <span></span>
                  </div> */}
                </div>
              )}
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
