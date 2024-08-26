import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import compressImageFile from 'browser-image-compression';
import { transliterate } from 'transliteration';
import styles from './FormAddSlide.module.scss';
// import { clearFormData, fetchProject } from '../../../store/Slice/projectSlice';
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  changeHandler,
  removePreviewPhotoOpen,
  removePreviewPhotoClose,
} from '../../add-project/formAdd/utils/formHelpers';
import customStyles from '../../add-project/formAdd/utils/customStyles';
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
} from '../../add-project/formAdd/utils/CustomSelectComponents';
import ConstructorPage from '../../add-project/constructor/ConstructorPage';
import { monthOptions, yearOptions } from '../../add-project/formAdd/utils/Time';

export default function FormAddSlide({ setIsModalOpenMain, formType }) {
  const dispatch = useDispatch();

  const headerTitle = formType === 'slide' ? 'Новый слайд' : 'Новый слайд';

  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState([]);
  const [selectedDegreeParticipation, setSelectedDegreeParticipation] = useState([]);
  const [selectStatusObject, setSelectStatusObject] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [date, setDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

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
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);

  const [inputData, setInputData] = useState({
    title: '',
    selectCompetencies: [],
    countryCity: '',
    monthYear: '',
    viewConstruction: [],
    projectStages: [],
    dropPhoto: [],
    photoAva: '',
    titleTextBlock: '',
    descriptionProject: '',
    totalArea: '',
    siteArea: '',
    floors: '',
    altitude: '',
    constructionVolume: '',
    location: '',
    degreeParticipation: '',
    statusObject: '',
    customer: '',
    publication: '',
    linkToPublication: '',
    publicationTwo: '',
    linkToPublicationTwo: '',
    awards: [],
    imageOpen: '',
    headingTextBlock: '',
    textBlock: '',
    imageClose: '',
    numberOfLanes: '',
    long: '',
  });

  const [inputValue, setInputValue] = useState('');
  const [onenConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);

  const handleRemovePreviewPhotoAva = useCallback(
    (index) => {
      removePreviewPhotoAva(previewPhotoAva, setPreviewPhotoAva, index, inputData, setInputData, setIsPhotoAvaVisible);
    },
    [previewPhotoAva, inputData]
  );

  const validateForm = useCallback(() => {
    let isValid = true;
    let errors = [];

    if (!isValid) {
      setErrorMessage(`Пожалуйста, заполните следующие обязательные поля: ${errors.join(', ')}.`);
    }

    return isValid;
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpenMain(false);
  }, [setIsModalOpenMain]);

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const isFormValid = validateForm();

      if (!isFormValid) {
        console.error('Форма не прошла валидацию. Работа функции submitHandler прервана.');
      } else {
        try {
          const formattedData = {
            ...inputData,
            dynamicBlocks: dynamicData,
            selectCompetencies: Array.isArray(selectedCompetencies)
              ? selectedCompetencies.map((option) => option.label).join(',')
              : '',
            degreeParticipation: Array.isArray(selectedDegreeParticipation)
              ? selectedDegreeParticipation.map((option) => option.label).join(',')
              : '',
            statusObject: selectStatusObject.label,
            viewConstruction: Array.isArray(selectedViewConstruction)
              ? selectedViewConstruction.map((option) => option.label).join(',')
              : '',
            awards: Array.isArray(selectedProjectStages)
              ? selectedProjectStages.map((option) => option.label).join(',')
              : '',
            photoAva: inputData.photoAva,
            imageOpen: inputData.imageOpen,
          };

          // await dispatch(fetchProject(formattedData, setInputData));
          // dispatch(clearFormData());

          setSelectedCompetencies([]);
          setSelectedDegreeParticipation([]);
          setSelectStatusObject('');
          setSelectedViewConstruction([]);
          setSelectedProjectStages([]);
          setPreviewPhotos([]);
          setDynamicData([]);
          setInputData({
            title: '',
            selectCompetencies: '',
            countryCity: '',
            monthYear: '',
            viewConstruction: '',
            dropPhoto: [],
            photoAva: '',
            titleTextBlock: '',
            descriptionProject: '',
            totalArea: '',
            siteArea: '',
            floors: '',
            altitude: '',
            constructionVolume: '',
            location: '',
            degreeParticipation: '',
            statusObject: '',
            customer: '',
            publication: '',
            linkToPublication: '',
            publicationTwo: '',
            linkToPublicationTwo: '',
            awards: '',
            imageOpen: '',
            textBlock: '',
            imageClose: '',
          });

          setErrorMessage('');
          setIsModalOpenMain(false);
        } catch (error) {
          console.error('Произошла ошибка при отправке формы:', error);
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

  const areAllBlocksFilled = useCallback(() => {
    for (let block of dynamicData) {
      for (let input of block) {
        if (input.required && (!input.value || input.value === '')) {
          return false;
        }
      }
    }
    return true;
  }, [dynamicData]);

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
        key: blockKey + '_' + input.type,
      }));
      setBlocks((prevBlocks) => [...prevBlocks, newInputs]);
      setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);
      setDynamicPreviews((prevPreviews) => [...prevPreviews, new Array(newInputs.length).fill([])]);
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
      console.error('Ошибка при сжатии изображения:', error);
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
          id: '',
          type: '',
          label: '',
          value: '',
        };
      }

      function generateUniqueName(originalName) {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        const fileExtension = originalName.split('.').pop();
        const sliceOfOriginalName = transliterate(originalName.slice(0, 5));
        const newName = `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;
        return newName;
      }

      if (Array.isArray(value) && value[0] instanceof File) {
        const newFiles = await Promise.all(
          value.map(async (originalFile) => {
            if (originalFile.type.startsWith('image/')) {
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

  const handleCalendarOpen = () => {
    setShowCalendar(!showCalendar);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загркузки изображений❗
        </div>
      )}
      <div className={styles.form_container__title}>{headerTitle}</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <div className={styles.form_container__titleCard}>Карточка 1</div>
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
                }}></textarea>
              <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
                Название конкурса
              </label>
            </div>
          </div>
          <div className={styles.calendarBlockWrapper}>
              <div className={styles.dataTitle}>Дата</div>
            <div className={styles.slider_container__customFileUpload}>
              <button type="button" onClick={handleCalendarOpen} className={styles.datePickerButton}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.66742 0.167969C2.80003 0.167969 2.9272 0.220647 3.02097 0.314415C3.11474 0.408183 3.16742 0.535361 3.16742 0.667969V1.77997C5.05258 1.61208 6.94893 1.61208 8.83409 1.77997V0.667969C8.83409 0.535361 8.88676 0.408183 8.98053 0.314415C9.0743 0.220647 9.20148 0.167969 9.33409 0.167969C9.46669 0.167969 9.59387 0.220647 9.68764 0.314415C9.78141 0.408183 9.83409 0.535361 9.83409 0.667969V1.87864C10.3204 1.9476 10.7709 2.17385 11.1166 2.52282C11.4623 2.87179 11.6843 3.32432 11.7488 3.8113L11.8068 4.24664C12.0494 6.0773 12.0281 7.9333 11.7441 9.75864C11.6756 10.1981 11.4631 10.6023 11.14 10.9078C10.8168 11.2134 10.4013 11.4029 9.95875 11.4466L9.16342 11.5253C7.06007 11.7327 4.94143 11.7327 2.83808 11.5253L2.04275 11.4466C1.60019 11.4029 1.18469 11.2134 0.861538 10.9078C0.538385 10.6023 0.325885 10.1981 0.257418 9.75864C-0.026686 7.93373 -0.0477894 6.07753 0.194751 4.24664L0.252751 3.8113C0.317167 3.32432 0.539185 2.87179 0.884906 2.52282C1.23063 2.17385 1.68106 1.9476 2.16742 1.87864V0.667969C2.16742 0.535361 2.2201 0.408183 2.31386 0.314415C2.40763 0.220647 2.53481 0.167969 2.66742 0.167969ZM2.96409 2.8033C4.98409 2.60397 7.01742 2.60397 9.03742 2.8033L9.64075 2.8633C10.2188 2.91997 10.6808 3.3673 10.7574 3.94264L10.8154 4.37797C10.8354 4.52997 10.8534 4.68197 10.8701 4.83464H1.13142C1.14808 4.68197 1.16608 4.52997 1.18608 4.37797L1.24408 3.94264C1.28108 3.66304 1.41155 3.40417 1.61427 3.2081C1.817 3.01203 2.08008 2.89028 2.36075 2.86264L2.96409 2.8033ZM1.05208 5.83464C0.986611 7.09461 1.0514 8.35797 1.24542 9.60464C1.27978 9.82501 1.38635 10.0277 1.5484 10.181C1.71045 10.3342 1.91881 10.4293 2.14075 10.4513L2.93608 10.53C4.97408 10.7313 7.02742 10.7313 9.06542 10.53L9.86075 10.4513C10.0827 10.4293 10.291 10.3342 10.4531 10.181C10.6152 10.0277 10.7217 9.82501 10.7561 9.60464C10.9508 8.35664 11.0148 7.0933 10.9494 5.83464H1.05208Z"
                    fill="#566272"
                  />
                </svg>
                {date ? formatDate(date) : 'Выбрать дату'}
              </button>
            </div>
            {showCalendar && (
              <Calendar
                onChange={(value) => {
                  setDate(value);
                  setShowCalendar(false);
                }}
                value={date || new Date()}
                className={styles.calendar}
              />
            )}
          </div>
          <div className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}>
            <div className={styles.form_container__checkbox_block}>
              <div>Изображение</div>
            </div>
            <div style={{ display: isPhotoAvaVisible ? 'inline-block' : 'none' }}>
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div className={styles.slider_container__uploadTextForm}>Загрузить изображения</div>
              </label>
              {isLoading && <div className={styles.preview_photos_container__loading}>Загрузка . . .</div>}
            </div>
            <div>
              {previewPhotoAva?.map((preview, index) => (
                <div key={index} className={styles.preview_photos_container__block}>
                  <img className={styles.preview_photos_container__img} src={preview} alt={`Preview ${index}`} />
                  <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoAva(index)}>
                    <span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.form_container__titleCard}>Карточка 2</div>
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
                }}></textarea>
              <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
                Название конкурса
              </label>
            </div>
          </div>
          <div className={styles.calendarBlockWrapper}>
            <div className={styles.dataTitle}>Дата</div>
            <div className={styles.slider_container__customFileUpload}>
            <button type="button" onClick={handleCalendarOpen} className={styles.datePickerButton}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.66742 0.167969C2.80003 0.167969 2.9272 0.220647 3.02097 0.314415C3.11474 0.408183 3.16742 0.535361 3.16742 0.667969V1.77997C5.05258 1.61208 6.94893 1.61208 8.83409 1.77997V0.667969C8.83409 0.535361 8.88676 0.408183 8.98053 0.314415C9.0743 0.220647 9.20148 0.167969 9.33409 0.167969C9.46669 0.167969 9.59387 0.220647 9.68764 0.314415C9.78141 0.408183 9.83409 0.535361 9.83409 0.667969V1.87864C10.3204 1.9476 10.7709 2.17385 11.1166 2.52282C11.4623 2.87179 11.6843 3.32432 11.7488 3.8113L11.8068 4.24664C12.0494 6.0773 12.0281 7.9333 11.7441 9.75864C11.6756 10.1981 11.4631 10.6023 11.14 10.9078C10.8168 11.2134 10.4013 11.4029 9.95875 11.4466L9.16342 11.5253C7.06007 11.7327 4.94143 11.7327 2.83808 11.5253L2.04275 11.4466C1.60019 11.4029 1.18469 11.2134 0.861538 10.9078C0.538385 10.6023 0.325885 10.1981 0.257418 9.75864C-0.026686 7.93373 -0.0477894 6.07753 0.194751 4.24664L0.252751 3.8113C0.317167 3.32432 0.539185 2.87179 0.884906 2.52282C1.23063 2.17385 1.68106 1.9476 2.16742 1.87864V0.667969C2.16742 0.535361 2.2201 0.408183 2.31386 0.314415C2.40763 0.220647 2.53481 0.167969 2.66742 0.167969ZM2.96409 2.8033C4.98409 2.60397 7.01742 2.60397 9.03742 2.8033L9.64075 2.8633C10.2188 2.91997 10.6808 3.3673 10.7574 3.94264L10.8154 4.37797C10.8354 4.52997 10.8534 4.68197 10.8701 4.83464H1.13142C1.14808 4.68197 1.16608 4.52997 1.18608 4.37797L1.24408 3.94264C1.28108 3.66304 1.41155 3.40417 1.61427 3.2081C1.817 3.01203 2.08008 2.89028 2.36075 2.86264L2.96409 2.8033ZM1.05208 5.83464C0.986611 7.09461 1.0514 8.35797 1.24542 9.60464C1.27978 9.82501 1.38635 10.0277 1.5484 10.181C1.71045 10.3342 1.91881 10.4293 2.14075 10.4513L2.93608 10.53C4.97408 10.7313 7.02742 10.7313 9.06542 10.53L9.86075 10.4513C10.0827 10.4293 10.291 10.3342 10.4531 10.181C10.6152 10.0277 10.7217 9.82501 10.7561 9.60464C10.9508 8.35664 11.0148 7.0933 10.9494 5.83464H1.05208Z"
                  fill="#566272"
                />
              </svg>
              {date ? formatDate(date) : 'Выбрать дату'}
            </button>
            </div>
            {showCalendar && (
              <Calendar
                onChange={(value) => {
                  setDate(value);
                  setShowCalendar(false);
                }}
                value={date || new Date()}
                className={styles.calendar}
              />
            )}
          </div>

          <div className={styles.form_container__titleCard}>Карточка 3</div>
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
                }}></textarea>
              <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
                Название конкурса
              </label>
            </div>
          </div>
          <div className={styles.calendarBlockWrapper}>
            <div className={styles.dataTitle}>Дата</div>
            <div className={styles.slider_container__customFileUpload}>
            <button type="button" onClick={handleCalendarOpen} className={styles.datePickerButton}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.66742 0.167969C2.80003 0.167969 2.9272 0.220647 3.02097 0.314415C3.11474 0.408183 3.16742 0.535361 3.16742 0.667969V1.77997C5.05258 1.61208 6.94893 1.61208 8.83409 1.77997V0.667969C8.83409 0.535361 8.88676 0.408183 8.98053 0.314415C9.0743 0.220647 9.20148 0.167969 9.33409 0.167969C9.46669 0.167969 9.59387 0.220647 9.68764 0.314415C9.78141 0.408183 9.83409 0.535361 9.83409 0.667969V1.87864C10.3204 1.9476 10.7709 2.17385 11.1166 2.52282C11.4623 2.87179 11.6843 3.32432 11.7488 3.8113L11.8068 4.24664C12.0494 6.0773 12.0281 7.9333 11.7441 9.75864C11.6756 10.1981 11.4631 10.6023 11.14 10.9078C10.8168 11.2134 10.4013 11.4029 9.95875 11.4466L9.16342 11.5253C7.06007 11.7327 4.94143 11.7327 2.83808 11.5253L2.04275 11.4466C1.60019 11.4029 1.18469 11.2134 0.861538 10.9078C0.538385 10.6023 0.325885 10.1981 0.257418 9.75864C-0.026686 7.93373 -0.0477894 6.07753 0.194751 4.24664L0.252751 3.8113C0.317167 3.32432 0.539185 2.87179 0.884906 2.52282C1.23063 2.17385 1.68106 1.9476 2.16742 1.87864V0.667969C2.16742 0.535361 2.2201 0.408183 2.31386 0.314415C2.40763 0.220647 2.53481 0.167969 2.66742 0.167969ZM2.96409 2.8033C4.98409 2.60397 7.01742 2.60397 9.03742 2.8033L9.64075 2.8633C10.2188 2.91997 10.6808 3.3673 10.7574 3.94264L10.8154 4.37797C10.8354 4.52997 10.8534 4.68197 10.8701 4.83464H1.13142C1.14808 4.68197 1.16608 4.52997 1.18608 4.37797L1.24408 3.94264C1.28108 3.66304 1.41155 3.40417 1.61427 3.2081C1.817 3.01203 2.08008 2.89028 2.36075 2.86264L2.96409 2.8033ZM1.05208 5.83464C0.986611 7.09461 1.0514 8.35797 1.24542 9.60464C1.27978 9.82501 1.38635 10.0277 1.5484 10.181C1.71045 10.3342 1.91881 10.4293 2.14075 10.4513L2.93608 10.53C4.97408 10.7313 7.02742 10.7313 9.06542 10.53L9.86075 10.4513C10.0827 10.4293 10.291 10.3342 10.4531 10.181C10.6152 10.0277 10.7217 9.82501 10.7561 9.60464C10.9508 8.35664 11.0148 7.0933 10.9494 5.83464H1.05208Z"
                  fill="#566272"
                />
              </svg>
              {date ? formatDate(date) : 'Выбрать дату'}
            </button>
              </div>
            {showCalendar && (
              <Calendar
                onChange={(value) => {
                  setDate(value);
                  setShowCalendar(false);
                }}
                value={date || new Date()}
                className={styles.calendar}
              />
            )}
          </div>

          <div className={styles.form_container__button_block}>
            <button className={styles.form_container__button_save} type="submit"></button>
            <button className={styles.form_container__button_cancel} type="submit" onClick={closeModal}></button>
          </div>
        </form>
      </div>
    </div>
  );
}
