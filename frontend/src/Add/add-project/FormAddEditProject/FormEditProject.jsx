import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import compressImageFile from 'browser-image-compression';
import { transliterate } from 'transliteration';

import 'react-quill-new/dist/quill.snow.css';
import styles from './FormAddProject.module.scss';
import adminStyles from '../../style/style-card.module.scss';

import { changeHandler } from './utils/formHelpers';
import { usePreviewHandlers } from './utils/hooks/usePreviewHandlers';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose';
import customStyles from './utils/customStyles';

import { fetchProject, setProjectId } from '../../../store/Slice/projectSlice';

import ConstructorPage from '../constructor/ConstructorPage';
import HeaderFields from './HeaderFields';
import PhotoAvaUpload from './PhotoAvaUpload';
import SliderUploadBlock from './SliderUploadBlock';
import TitleTextBlock from './TitleTextBlock';
import TextSecondBlock from './TextSecondBlock';
import MeasurementsBlock from './MeasurementsBlock';
import LocationStagesBlock from './LocationStagesBlock';
import OpenImageBlock from './OpenImageBlock';
import ConstructionSectionFromEdit from './ConstructionSectionFromEdit';
import CloseImageBlock from './CloseImageBlock';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function FormEditProject({ setIsModalOpen, editProjectData }) {
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    title: '',
    selectCompetencies: [],
    countryCity: '',
    monthYear: '',
    viewConstruction: [],
    dropPhoto: [],
    photoAva: null,
    imageProject: null,
    imageTitle: '',
    titleTextBlock: '',
    descriptionProject: '',
    totalArea: '',
    siteArea: '',
    floors: '',
    altitude: '',
    constructionVolume: '',
    location: '',
    degreeParticipation: [],
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

  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState([]);
  const [selectedDegreeParticipation, setSelectedDegreeParticipation] = useState([]);
  const [selectStatusObject, setSelectStatusObject] = useState(null);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [, setIsDropPhotoVisible] = useState(true);
  const [, setIsMonthValid] = useState(true);
  const [, setIsYearValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [embedLink] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);

  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

  useEffect(() => {
    quillRefs.forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, [quillRefs, applyStylesToQuillEditor]);

  const [openConstructor, setOpenConstructor] = useState(false);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);

  const data = editProjectData?.Constructors?.[0]?.data;

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

  useEffect(() => {
    if (editProjectData) {
      const initialSelectedCompetencies = editProjectData.selectCompetencies
        ? editProjectData.selectCompetencies.split(',').map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];
      const [m, y] = (editProjectData.monthYear || '').trim().split(' ');
      const initialViewConstruction = editProjectData.viewConstruction
        ? editProjectData.viewConstruction.split(',').map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];
      const initialDegreeParticipation = editProjectData.degreeParticipation
        ? editProjectData.degreeParticipation.split(',').map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];
      const initialProjectStages = editProjectData.awards
        ? editProjectData.awards.split(',').map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];

      setSelectedCompetencies(initialSelectedCompetencies);
      setSelectedMonth(m ? { value: m, label: m } : null);
      setSelectedYear(y ? { value: y, label: y } : null);
      setSelectedViewConstruction(initialViewConstruction);
      setSelectedProjectStages(initialProjectStages);
      setSelectedDegreeParticipation(initialDegreeParticipation);
      setSelectStatusObject(
        editProjectData.statusObject
          ? { value: editProjectData.statusObject, label: editProjectData.statusObject }
          : null
      );

      setInputData((prevInputData) => {
        const updatedInputData = {
          ...prevInputData,
          title: editProjectData.title || '',
          selectCompetencies: initialSelectedCompetencies,
          countryCity: editProjectData.countryCity || '',
          monthYear: editProjectData.monthYear || '',
          viewConstruction: initialViewConstruction,
          dropPhoto: editProjectData.dropPhoto || [],
          photoAva: editProjectData.photoAva || '',
          imageProject: editProjectData.imageProject || '',
          imageTitle: editProjectData.imageTitle || '',
          titleTextBlock: editProjectData.titleTextBlock || '',
          descriptionProject: editProjectData.descriptionProject || '',
          totalArea: editProjectData.totalArea || '',
          siteArea: editProjectData.siteArea || '',
          floors: editProjectData.floors || '',
          altitude: editProjectData.altitude || '',
          constructionVolume: editProjectData.constructionVolume || '',
          location: editProjectData.location || '',
          degreeParticipation: initialDegreeParticipation,
          statusObject: editProjectData.statusObject || '',
          customer: editProjectData.customer || '',
          publication: editProjectData.publication || '',
          linkToPublication: editProjectData.linkToPublication || '',
          publicationTwo: editProjectData.publicationTwo || '',
          linkToPublicationTwo: editProjectData.linkToPublicationTwo || '',
          awards: initialProjectStages,
          imageOpen: editProjectData.imageOpen || '',
          headingTextBlock: editProjectData.headingTextBlock || '',
          textBlock: editProjectData.textBlock || '',
          imageClose: editProjectData.imageClose || '',
          numberOfLanes: editProjectData.numberOfLanes || '',
          long: editProjectData.long || '',
          dynamicDataFromEditProject: editProjectData.dynamicDataFromEditProject || '',
        };
        return updatedInputData;
      });

      if (Array.isArray(data) && data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const block = data[index];
          if (Array.isArray(block)) {
            const dynamicDataFromEditProject = block.map((input) => input.value) || [];

            if (dynamicDataFromEditProject.length > 0) {
              const dynamicData = block.map((input) => ({
                type: input.type,
                label: input.label,
                value: input.value,
                key: input.key,
                blockIndex: index,
              }));

              setDynamicData((prevDynamicData) => [
                ...prevDynamicData.slice(0, index),
                dynamicData,
                ...prevDynamicData.slice(index + 1),
              ]);

              const previewsArray = dynamicData.map((input) => input.value);

              setDynamicPreviews((prev) => {
                const newPreviews = [...prev];
                newPreviews[index] = previewsArray;
                return newPreviews;
              });
            }
          }
        }
      }
    }
  }, [editProjectData, data]);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (!isFormValid) {
      console.error('Форма не прошла валидацию. Работа функции submitHandler прервана.');
      return;
    }
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
        statusObject: selectStatusObject?.label ?? '',
        viewConstruction: Array.isArray(selectedViewConstruction)
          ? selectedViewConstruction.map((option) => option.label).join(',')
          : '',
        awards: Array.isArray(selectedProjectStages)
          ? selectedProjectStages.map((option) => option.label).join(',')
          : '',
        photoAva: inputData.photoAva,
        imageOpen: inputData.imageOpen,
        imageClose: inputData.imageClose,
      };
      if (formattedData.selectCompetencies && formattedData.selectCompetencies !== '') {
        formattedData.selectCompetencies = Array.isArray(formattedData.selectCompetencies)
          ? formattedData.selectCompetencies.map((option) => option.label).join(',')
          : formattedData.selectCompetencies;
      }
      if (formattedData.viewConstruction && formattedData.viewConstruction !== '') {
        formattedData.viewConstruction = Array.isArray(formattedData.viewConstruction)
          ? formattedData.viewConstruction.map((option) => option.label).join(',')
          : formattedData.viewConstruction;
      }
      if (formattedData.awards && formattedData.awards !== '') {
        formattedData.awards = Array.isArray(formattedData.awards)
          ? formattedData.awards.map((option) => option.label).join(',')
          : formattedData.awards;
      }
      if (formattedData.degreeParticipation && formattedData.degreeParticipation !== '') {
        formattedData.degreeParticipation = Array.isArray(formattedData.degreeParticipation)
          ? formattedData.degreeParticipation.map((option) => option.label).join(',')
          : formattedData.degreeParticipation;
      }

      if (editProjectData && editProjectData.id) {
        dispatch(setProjectId(editProjectData.id));
        dispatch(fetchProject(formattedData, setInputData, editProjectData.id));
      } else {
        dispatch(fetchProject(formattedData, setInputData));
      }

      setSelectedCompetencies([]);
      setSelectedDegreeParticipation([]);
      setSelectStatusObject(null);
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
        photoAva: '',
        imageProject: '',
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
        headingTextBlock: '',
        textBlock: '',
        imageClose: '',
        dropPhoto: [],
        imageTitle: '',
      });
      setErrorMessage('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Произошла ошибка при отправке формы:', error);
    }
  };

  const handlerOpenConstructor = useCallback(() => {
    setOpenConstructor(!openConstructor);
  }, [openConstructor]);

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

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prevDynamicData) => prevDynamicData.filter((_, index) => index !== blockIndex));
    setDynamicPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== blockIndex));
  }, []);

  const handleClick = useCallback(
    (inputs, blockIndex) => {
      if (!areAllBlocksFilled()) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
        return;
      }
      const blockKey = Date.now().toString();
      const newInputs = inputs.map((input) => ({
        ...input,
        key: blockKey + '_' + input.type,
        blockIndex: blockIndex,
      }));

      setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);

      setDynamicPreviews((prevPreviews) => [...prevPreviews, new Array(newInputs.length).fill([])]);
    },
    [areAllBlocksFilled]
  );

  const compressImage = useCallback(async (file) => {
    const options = {
      maxSizeMB: 3,
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
          key: '',
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
    [compressImage, dynamicData]
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
        return {
          outerDiv: '',
          innerDiv: '',
          imageStyles: [],
        };
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
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загркузки изображений❗
        </div>
      )}
      <div className={styles.form_container__title}>{editProjectData ? 'Редактирование проекта' : 'Новый проект'}</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <HeaderFields
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            changeHandler={changeHandler}
            customStyles={customStyles}
            setIsFocused={() => {}}
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
            bucket_url={bucket_url}
          />

          <SliderUploadBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            setPreviewPhotos={setPreviewPhotos}
            isLoadingDropPhoto={isLoadingDropPhoto}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
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
            bucket_url={bucket_url}
          />
          <TitleTextBlock styles={styles} inputData={inputData} setInputData={setInputData} />
          <TextSecondBlock styles={styles} inputData={inputData} setInputData={setInputData} quillRef1={quillRef1} />
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
            setIsFocused={() => {}}
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
            setIsLoading={setIsLoading}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
            isLoadingOpenImage={isLoadingOpenImage}
            previewPhotoOpen={previewPhotoOpen}
            handleRemovePreviewPhotoOpen={handleRemovePreviewPhotoOpen}
            bucket_url={bucket_url}
          />
          <ConstructionSectionFromEdit
            styles={styles}
            dynamicData={dynamicData}
            setDynamicData={setDynamicData}
            openConstructor={openConstructor}
            setDynamicPreviews={setDynamicPreviews}
            dynamicPreviews={dynamicPreviews}
            handleRemoveBlock={handleRemoveBlock}
            handlerOpenConstructor={handlerOpenConstructor}
            handleClick={handleClick}
            ConstructorPage={ConstructorPage}
            getPreviewClassName={getPreviewClassName}
            handleDynamicInputChange={handleDynamicInputChange}
            bucket_url={bucket_url}
            embedLink={embedLink}
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
            setIsLoading={setIsLoading}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
            isLoadingCloseImage={isLoadingCloseImage}
            previewPhotoClose={previewPhotoClose}
            handleRemovePreviewPhotoClose={handleRemovePreviewPhotoClose}
            bucket_url={bucket_url}
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
