import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import compressImageFile from "browser-image-compression";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { transliterate } from "transliteration";
import styles from "../../add-project/formAdd/FormAddProject.module.scss";
import { clearFormData, fetchProject } from "../../../store/Slice/projectSlice";
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  changeHandler,
  removePreviewPhotoOpen,
  removePreviewPhotoClose,
} from "../../add-project/formAdd/utils/formHelpers";
import customStyles from "../../add-project/formAdd/utils/customStyles";
import {
  DropdownIndicator,
  ValueContainer,
  AnotherDropdownIndicator,
  AnotherValueContainer,
  AnotherStagesProject,
  SelectDegreeParticipationDropdownIndicator,
  SelectDegreeParticipationValueContainer,
  SelectStatusObjectDropdownIndicator,
  SelectStatusObjectValueContainer,
  MonthDropdownIndicator,
  MonthValueContainer,
  YearDropdownIndicator,
  YearValueContainer,
} from "../../add-project/formAdd/utils/CustomSelectComponents";
import ConstructorPage from "../../add-project/constructor/ConstructorPage";
import { monthOptions, yearOptions } from "../../add-project/formAdd/utils/Time";

export default function FormAddSlide({ setIsModalOpenMain, formType }) {
  const dispatch = useDispatch();

  const headerTitle = formType === 'slide' ? 'Новый слайд' : "Новый слайд";

  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState([]);
  const [selectedDegreeParticipation, setSelectedDegreeParticipation] = useState([]);
  const [selectStatusObject, setSelectStatusObject] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  const quillRef1 = useRef(null);

  const quillRefs = useMemo(() => [quillRef1], [quillRef1]);

  const applyStylesToQuillEditor = useCallback((quillRef) => {
    if (quillRef && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;
   
      editorElement.style.fontSize = '16px';
      editorElement.style.fontFamily = 'Raleway, sans-serif';
      editorElement.style.color = 'var(--black-1D2E43)';
      editorElement.style.border = 'none';
    }
  }, []);

  useEffect(() => {
    quillRefs.forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, [quillRefs, applyStylesToQuillEditor]);

  const [inputData, setInputData] = useState({
    title: "",
    selectCompetencies: [],
    countryCity: "",
    monthYear: "",
    viewConstruction: [],
    projectStages: [],
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
    awards: [],
    imageOpen: "",
    headingTextBlock: "",
    textBlock: "",
    imageClose: "",
    numberOfLanes: "",
    long: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [onenConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const countFilledInputs = useCallback(() => {
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
  }, [inputData]);

  const handleRemovePreviewPhoto = useCallback((index) => {
    removePreviewPhoto(
      previewPhotos,
      setPreviewPhotos,
      index,
      inputData,
      setInputData,
      setIsDropPhotoVisible
    );
  }, [previewPhotos, inputData]);

  const handleRemovePreviewPhotoAva = useCallback((index) => {
    removePreviewPhotoAva(
      previewPhotoAva,
      setPreviewPhotoAva,
      index,
      inputData,
      setInputData,
      setIsPhotoAvaVisible
    );
  }, [previewPhotoAva, inputData]);

  const handleRemovePreviewPhotoOpen = useCallback((index) => {
    removePreviewPhotoOpen(
      previewPhotoOpen,
      setPreviewPhotoOpen,
      index,
      inputData,
      setInputData,
      setIsPhotoOpenVisible
    );
  }, [previewPhotoOpen, inputData]);

  const handleRemovePreviewPhotoClose = useCallback((index) => {
    removePreviewPhotoClose(
      previewPhotoClose,
      setPreviewPhotoClose,
      index,
      inputData,
      setInputData,
      setIsPhotoCloseVisible
    );
  }, [previewPhotoClose, inputData]);

  const validateForm = useCallback(() => {
    let isValid = true;
    let errors = [];

    if (!selectedMonth) {
      setIsMonthValid(false);
      isValid = false;
      errors.push("Месяц");
    } else {
      setIsMonthValid(true);
    }

    if (!selectedYear) {
      setIsYearValid(false);
      isValid = false;
      errors.push("Год");
    } else {
      setIsYearValid(true);
    }

    if (!isValid) {
      setErrorMessage(
        `Пожалуйста, заполните следующие обязательные поля: ${errors.join(
          ", "
        )}.`
      );
    }

    return isValid;
  }, [selectedMonth, selectedYear]);

  const closeModal = useCallback(() => {
    setIsModalOpenMain(false);
  }, [setIsModalOpenMain]);

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const isFormValid = validateForm();

      if (!isFormValid) {
        console.error("Форма не прошла валидацию. Работа функции submitHandler прервана.");
      } else {
        try {
          const formattedData = {
            ...inputData,
            dynamicBlocks: dynamicData,
            selectCompetencies: Array.isArray(selectedCompetencies)
              ? selectedCompetencies.map((option) => option.label).join(",")
              : "",
            degreeParticipation: Array.isArray(selectedDegreeParticipation)
              ? selectedDegreeParticipation.map((option) => option.label).join(",")
              : "",
            statusObject: selectStatusObject.label,
            viewConstruction: Array.isArray(selectedViewConstruction)
              ? selectedViewConstruction.map((option) => option.label).join(",")
              : "",
            awards: Array.isArray(selectedProjectStages)
              ? selectedProjectStages.map((option) => option.label).join(",")
              : "",
            photoAva: inputData.photoAva,
            imageOpen: inputData.imageOpen,
          };

          await dispatch(fetchProject(formattedData, setInputData));
          dispatch(clearFormData());

          setSelectedCompetencies([]);
          setSelectedDegreeParticipation([]);
          setSelectStatusObject("");
          setSelectedViewConstruction([]);
          setSelectedProjectStages([]);
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

          setErrorMessage("");
          setIsModalOpenMain(false);

        } catch (error) {
          console.error("Произошла ошибка при отправке формы:", error);
        }
      }
    },
    [
      validateForm,
      inputData,
      dynamicData,
      selectedCompetencies,
      selectedDegreeParticipation,
      selectStatusObject,
      selectedViewConstruction,
      selectedProjectStages,
      dispatch,
      setIsModalOpenMain,
    ]
  );

  const handlerOpenConstructor = useCallback(() => {
    setOpenConstructor((prevOpen) => !prevOpen);
  }, []);

  const areAllBlocksFilled = useCallback(() => {
    for (let block of dynamicData) {
      for (let input of block) {
        if (input.required && (!input.value || input.value === "")) {
          return false;
        }
      }
    }
    return true;
  }, [dynamicData]);

  const handleRemoveBlock = useCallback(
    (blockIndex) => {
      setDynamicData((prevDynamicData) =>
        prevDynamicData.filter((_, index) => index !== blockIndex)
      );
      setBlocks((prevBlocks) =>
        prevBlocks.filter((_, index) => index !== blockIndex)
      );
      setDynamicPreviews((prevPreviews) =>
        prevPreviews.filter((_, index) => index !== blockIndex)
      );
    },
    [setDynamicData, setBlocks, setDynamicPreviews]
  );

  const handleClick = useCallback(
    (inputs) => {
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
      setBlocks((prevBlocks) => [...prevBlocks, newInputs]);
      setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);
      setDynamicPreviews((prevPreviews) => [
        ...prevPreviews,
        new Array(newInputs.length).fill([]),
      ]);
    },
    [areAllBlocksFilled]
  );

  const compressImage = useCallback(async (file) => {
    const options = {
      maxSizeMB: 4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      return await compressImageFile(file, options);
    } catch (error) {
      console.error("Ошибка при сжатии изображения:", error);
    }
  }, []);

  const handleDynamicInputChange = useCallback(
    async (blockIndex, inputIndex, value) => {
      const newDynamicData = [...dynamicData];

      if (!newDynamicData[blockIndex]) {
        newDynamicData[blockIndex] = [];
      }

      if (!newDynamicData[blockIndex][inputIndex]) {
        newDynamicData[blockIndex][inputIndex] = {
          id: "",
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
              const compressedFile = await compressImage(originalFile);
              const uniqueName = generateUniqueName(compressedFile.name);
              return new File([compressedFile], uniqueName, {
                type: compressedFile.type,
              });
            } else {
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
    },
    [dynamicData, compressImage]
  );



  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загркузки изображений❗
        </div>
      )}
       <div className={styles.form_container__title}>
     {headerTitle}
        </div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>                 
          <div className={styles.form_container__block_gray_one}>
           <div className={styles.form_container__description_text}>
            <div className={styles.form_container__textarea_length}>
              {`${inputData.descriptionProject.length}/150`}
            </div>
            <textarea
              className={styles.form_container__textarea}
              autoComplete="off"
              required
              name="descriptionProject"
              id="descriptionProject"
              cols="30"
              rows="10"
              placeholder="Не более 150 символов"
              value={inputData.descriptionProject}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 150) {
                  setInputData({ ...inputData, descriptionProject: value });
                }
              }}
            ></textarea>
            <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
              Название конкурса
            </label>
          </div>
          </div>
          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>
               Изображение
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
          <div className={styles.form_container__block_gray_one}>
           <div className={styles.form_container__description_text}>
            <div className={styles.form_container__textarea_length}>
              {`${inputData.descriptionProject.length}/150`}
            </div>
            <textarea
              className={styles.form_container__textarea}
              autoComplete="off"
              required
              name="descriptionProject"
              id="descriptionProject"
              cols="30"
              rows="10"
              placeholder="Не более 150 символов"
              value={inputData.descriptionProject}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 150) {
                  setInputData({ ...inputData, descriptionProject: value });
                }
              }}
            ></textarea>
            <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
              Название конкурса
            </label>
            </div>
          </div>
          
          <div className={styles.form_container__block_gray_one}>
           <div className={styles.form_container__description_text}>
            <div className={styles.form_container__textarea_length}>
              {`${inputData.descriptionProject.length}/150`}
            </div>
            <textarea
              className={styles.form_container__textarea}
              autoComplete="off"
              required
              name="descriptionProject"
              id="descriptionProject"
              cols="30"
              rows="10"
              placeholder="Не более 150 символов"
              value={inputData.descriptionProject}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= 150) {
                  setInputData({ ...inputData, descriptionProject: value });
                }
              }}
            ></textarea>
            <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
              Название конкурса
            </label>
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


