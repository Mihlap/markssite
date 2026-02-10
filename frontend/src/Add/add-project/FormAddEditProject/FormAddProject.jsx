import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import compressImageFile from 'browser-image-compression';
import { transliterate } from 'transliteration';

import styles from './FormAddProject.module.scss';
import adminStyles from '../../style/style-card.module.scss';

import 'react-quill-new/dist/quill.snow.css';

import { changeHandler } from './utils/formHelpers';
import { usePreviewHandlers } from './utils/hooks/usePreviewHandlers';
import customStyles from './utils/customStyles';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose';

import { clearFormData, fetchProject } from '../../../store/Slice/projectSlice';

import HeaderFields from './HeaderFields';
import SliderUploadBlock from './SliderUploadBlock';
import OpenImageBlock from './OpenImageBlock';
import ConstructorSection from './ConstructorSection';
import CloseImageBlock from './CloseImageBlock';
import TextSecondBlock from './TextSecondBlock';
import PhotoAvaUpload from './PhotoAvaUpload';
import TitleTextBlock from './TitleTextBlock';
import MeasurementsBlock from './MeasurementsBlock';
import LocationStagesBlock from './LocationStagesBlock';
import ConstructorPage from '../constructor/ConstructorPage';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

export default function FormAddProject({ setIsModalOpen }) {
  const dispatch = useDispatch();

  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState([]);
  const [selectedDegreeParticipation, setSelectedDegreeParticipation] = useState([]);
  const [selectStatusObject, setSelectStatusObject] = useState('');
  const [, setIsFocused] = useState(false);

  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);

  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);

  const [, setIsMonthValid] = useState(true);
  const [, setIsYearValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const renderCount = useRef(0);
  renderCount.current += 1;

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
    title: '',
    selectCompetencies: [],
    countryCity: '',
    monthYear: '',
    viewConstruction: [],
    projectStages: [],
    dropPhoto: [],
    photoAva: null,
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
    headingTextBlock: '',
    textBlock: '',
    imageOpen: null,
    imageClose: null,
    numberOfLanes: '',
    long: '',
  });

  const [, setInputValue] = useState('');
  const [openConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const {
    handleRemovePreviewPhoto,
    handleRemovePreviewPhotoAva,
    handleRemovePreviewPhotoOpen,
    handleRemovePreviewPhotoClose,
  } = usePreviewHandlers({
    previewPhotos,
    setPreviewPhotos,
    previewPhotoAva,
    setPreviewPhotoAva,
    previewPhotoOpen,
    setPreviewPhotoOpen,
    previewPhotoClose,
    setPreviewPhotoClose,
    inputData,
    setInputData,
    setIsDropPhotoVisible,
    setIsPhotoAvaVisible,
    setIsPhotoOpenVisible,
    setIsPhotoCloseVisible,
  });

  const validateForm = useCallback(() => {
    let isValid = true;
    let errors = [];

    if (!selectedMonth) {
      setIsMonthValid(false);
      isValid = false;
      errors.push('Месяц');
    } else {
      setIsMonthValid(true);
    }

    if (!selectedYear) {
      setIsYearValid(false);
      isValid = false;
      errors.push('Год');
    } else {
      setIsYearValid(true);
    }

    if (!isValid) {
      setErrorMessage(`Пожалуйста, заполните следующие обязательные поля: ${errors.join(', ')}.`);
    }

    return isValid;
  }, [selectedMonth, selectedYear]);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);

  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

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

          await dispatch(fetchProject(formattedData, setInputData));
          dispatch(clearFormData());

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
          setIsModalOpen(false);
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
      setIsModalOpen,
    ]
  );

  const handlerOpenConstructor = useCallback(() => {
    setOpenConstructor((prevOpen) => !prevOpen);
  }, []);

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

  const handleRemoveBlock = useCallback(
    (blockIndex) => {
      setDynamicData((prevDynamicData) => prevDynamicData.filter((_, index) => index !== blockIndex));
      setBlocks((prevBlocks) => prevBlocks.filter((_, index) => index !== blockIndex));
      setDynamicPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== blockIndex));
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
    [dynamicData, setDynamicData, compressImage]
  );

  const getPreviewClassName = useCallback((label) => {
    switch (label) {
      case 'Картинка с описанием':
        return {
          outerDiv: styles.imgWithDescriptionPreview,
          innerDiv: styles.someInnerDivStyle,
        };
      case 'Слайдер *допускается загрузка 8ми изображений':
        return {
          outerDiv: styles.sliderPreview,
          innerDiv: styles.sliderPreviewDiv,
        };
      case 'Блок 2е вертикальные картинки':
        return {
          outerDiv: styles.verticallyBlock,
          innerDiv: styles.previewWerticallyBlock,
          verticalImgTwo: styles.verticalTwoImg,
        };
      case 'Блок 3 картинки':
        return {
          outerDiv: styles.horizontalImage,
          innerDiv: styles.horizontalImage2,
          imageStyles: [styles.horizontalImage1, styles.horizontalImage2, styles.verticalImage],
        };
      case 'Видеоролик':
        return {
          outerDiv: styles.videoPreview,
          innerDiv: styles.videoInnerDiv,
          videoStyles: styles.videoStyle,
        };
      case 'Ссылка на видеоролик':
        return {
          outerDiv: styles.videoPreview,
          innerDiv: styles.videoInnerDiv,
          videoStyles: styles.videoStyle,
        };
      default:
        return '';
    }
  }, []);

  const handleMonthChange = useCallback(
    (selectedOption) => {
      setSelectedMonth(selectedOption);
      if (selectedYear) {
        setInputData((prevData) => ({
          ...prevData,
          monthYear: `${selectedOption.value} ${selectedYear.value}`,
        }));
      }
    },
    [setInputData, setSelectedMonth, selectedYear]
  );

  const handleYearChange = useCallback(
    (selectedOption) => {
      setSelectedYear(selectedOption);
      if (selectedMonth) {
        setInputData((prevData) => ({
          ...prevData,
          monthYear: `${selectedMonth.value} ${selectedOption.value}`,
        }));
      }
    },
    [setInputData, setSelectedYear, selectedMonth]
  );

  const countFilledInputs = useCallback(() => {
    const inputsToCheck = [
      'totalArea',
      'siteArea',
      'floors',
      'altitude',
      'constructionVolume',
      'numberOfLanes',
      'long',
    ];
    return inputsToCheck.filter((input) => inputData[input]).length;
  }, [inputData]);

  return (
    <div className={styles.form_container}>
      {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля!</div>}
      <div className={styles.form_container__title}>Новый проект</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          {renderCount.current > 0 && <div className={styles.count}>Количество ре-рендеров: {renderCount.current}</div>}
          <HeaderFields
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            changeHandler={changeHandler}
            customStyles={customStyles}
            setIsFocused={setIsFocused}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            selectedCompetencies={selectedCompetencies}
            setSelectedCompetencies={setSelectedCompetencies}
            selectedViewConstruction={selectedViewConstruction}
            setSelectedViewConstruction={setSelectedViewConstruction}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
          />

          <PhotoAvaUpload
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            previewPhotoAva={previewPhotoAva}
            setPreviewPhotoAva={setPreviewPhotoAva}
            isPhotoAvaVisible={isPhotoAvaVisible}
            setIsPhotoAvaVisible={setIsPhotoAvaVisible}
            handleRemovePreviewPhotoAva={handleRemovePreviewPhotoAva}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            changeHandler={changeHandler}
            setPreviewPhotos={setPreviewPhotos}
            setIsDropPhotoVisible={setIsDropPhotoVisible}
            setPreviewPhotoOpen={setPreviewPhotoOpen}
            setIsPhotoOpenVisible={setIsPhotoOpenVisible}
            setPreviewPhotoClose={setPreviewPhotoClose}
            setIsPhotoCloseVisible={setIsPhotoCloseVisible}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
          />

          <SliderUploadBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            setPreviewPhotos={setPreviewPhotos}
            isLoadingDropPhoto={isLoadingDropPhoto}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            isDropPhotoVisible={isDropPhotoVisible}
            setIsDropPhotoVisible={setIsDropPhotoVisible}
            changeHandler={changeHandler}
            setIsLoading={setIsLoading}
            handleRemovePreviewPhoto={handleRemovePreviewPhoto}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
            setPreviewPhotoAva={setPreviewPhotoAva}
            setIsPhotoAvaVisible={setIsPhotoAvaVisible}
            setPreviewPhotoOpen={setPreviewPhotoOpen}
            setIsPhotoOpenVisible={setIsPhotoOpenVisible}
            setPreviewPhotoClose={setPreviewPhotoClose}
            setIsPhotoCloseVisible={setIsPhotoCloseVisible}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
          />

          <TitleTextBlock styles={styles} inputData={inputData} setInputData={setInputData} />

          <MeasurementsBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            changeHandler={changeHandler}
            countFilledInputs={countFilledInputs}
          />

          <LocationStagesBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            customStyles={customStyles}
            setIsFocused={setIsFocused}
            changeHandler={changeHandler}
            selectedDegreeParticipation={selectedDegreeParticipation}
            setSelectedDegreeParticipation={setSelectedDegreeParticipation}
            selectStatusObject={selectStatusObject}
            setSelectStatusObject={setSelectStatusObject}
            selectedProjectStages={selectedProjectStages}
            setSelectedProjectStages={setSelectedProjectStages}
          />

          <OpenImageBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            changeHandler={changeHandler}
            setPreviewPhotos={setPreviewPhotos}
            isPhotoOpenVisible={isPhotoOpenVisible}
            setIsDropPhotoVisible={setIsDropPhotoVisible}
            setPreviewPhotoAva={setPreviewPhotoAva}
            setIsPhotoAvaVisible={setIsPhotoAvaVisible}
            setPreviewPhotoOpen={setPreviewPhotoOpen}
            setIsPhotoOpenVisible={setIsPhotoOpenVisible}
            setPreviewPhotoClose={setPreviewPhotoClose}
            setIsPhotoCloseVisible={setIsPhotoCloseVisible}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
            isLoadingOpenImage={isLoadingOpenImage}
            previewPhotoOpen={previewPhotoOpen}
            handleRemovePreviewPhotoOpen={handleRemovePreviewPhotoOpen}
          />

          <TextSecondBlock styles={styles} inputData={inputData} setInputData={setInputData} quillRef1={quillRef1} />

          <ConstructorSection
            styles={styles}
            blocks={blocks}
            dynamicData={dynamicData}
            setDynamicData={setDynamicData}
            openConstructor={openConstructor}
            setDynamicPreviews={setDynamicPreviews}
            setInputValue={setInputValue}
            dynamicPreviews={dynamicPreviews}
            handleRemoveBlock={handleRemoveBlock}
            handlerOpenConstructor={handlerOpenConstructor}
            getPreviewClassName={getPreviewClassName}
            handleDynamicInputChange={handleDynamicInputChange}
            handleClick={handleClick}
            ConstructorPage={ConstructorPage}
            compressImage={compressImage}
          />

          <CloseImageBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            isPhotoCloseVisible={isPhotoCloseVisible}
            changeHandler={changeHandler}
            setPreviewPhotos={setPreviewPhotos}
            setIsDropPhotoVisible={setIsDropPhotoVisible}
            setPreviewPhotoAva={setPreviewPhotoAva}
            setIsPhotoAvaVisible={setIsPhotoAvaVisible}
            setPreviewPhotoOpen={setPreviewPhotoOpen}
            setIsPhotoOpenVisible={setIsPhotoOpenVisible}
            setPreviewPhotoClose={setPreviewPhotoClose}
            setIsPhotoCloseVisible={setIsPhotoCloseVisible}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
            isLoadingCloseImage={isLoadingCloseImage}
            previewPhotoClose={previewPhotoClose}
            handleRemovePreviewPhotoClose={handleRemovePreviewPhotoClose}
          />

          <SubmitButtons
            classNames={{
              wrapper: styles.form_container__button_block,
              save: styles.form_container__button_save,
              cancel: styles.form_container__button_cancel,
            }}
            onCancel={(e) => {
              e?.preventDefault?.();
              e?.stopPropagation?.();
              setShowExitConfirm(true);
              setShowExitConfirm(true);
            }}
          />
        </form>

        <ExitConfirmModal
          open={showExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
          onLeave={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
