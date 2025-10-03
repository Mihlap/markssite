import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { useDispatch } from 'react-redux';

import styles from '../../../add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../style/style-card.module.scss';
import customStyles from '../../../add-project/FormAddEditProject/utils/customStyles';

import { changeHandler } from '../utils/formHelpers';
import { usePreviewHandlers } from '../utils/hooks/usePreviewHandlers';
import { sharedHandleDynamicInputChange, sharedHandleDeletePreview, getPreviewClassName } from '../utils/formShared';
import useInterceptExternalClose from '../../../hooks/useInterceptExternalClose';

import { fetchArticle } from '../../../../store/Slice/articleSlice';
import ConstructorPage from '../../constructor/ConstructorPage';
import {
  PublicationContainer,
  PublicationIndicator,
} from '../../../add-project/FormAddEditProject/utils/CustomSelectComponents';

import HeaderFields from './HeaderFields';
import SliderUploadBlock from './SliderUploadBlock';
import TextBlockFields from './TextBlockFields';
import AuthorPhotoBlock from './AuthorPhotoBlock';
import OpenImageBlock from './OpenImageBlock';
import CloseImageBlock from './CloseImageBlock';
import ConstructorSection from './ConstructorSection';
import SecondaryTextBlock from './SecondaryTextBlock';
import SubmitButtons from '../../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../../UI/ExitConfirmModal/ExitConfirmModal';

export default function FormAddNews({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [, setIsDropPhotoVisible] = useState(true);
  const [, setIsFocused] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [inputData, setInputData] = useState({
    title: '',
    author: '',
    city: '',
    dataMonthYear: '',
    selectCompetencies: [],
    dropPhoto: [],
    titleTextBlock: '',
    descriptionArticle: '',
    photoAva: '',
    imageOpen: '',
    textBlock: '',
    imageClose: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);

  const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);
  const quillRefs = useMemo(() => [quillRef1, quillRef2], []);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);

  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

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
    const quillRefs = [quillRef1, quillRef2];
    quillRefs.forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, [quillRef1, quillRef2, applyStylesToQuillEditor]);

  useEffect(() => {
    quillRefs.forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, [quillRefs, applyStylesToQuillEditor]);

  const [openConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);

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

  const handleDynamicInputChange = useCallback(
    async (blockIndex, inputIndex, value) => {
      await sharedHandleDynamicInputChange(
        blockIndex,
        inputIndex,
        value,
        dynamicData,
        setDynamicData,
        setDynamicPreviews
      );
    },
    [dynamicData, setDynamicData, setDynamicPreviews]
  );

  const handleDeletePreview = useCallback(
    (event, blockIndex, inputIndex, previewIndex) => {
      sharedHandleDeletePreview(event, blockIndex, inputIndex, previewIndex, setDynamicPreviews, setDynamicData);
    },
    [setDynamicPreviews, setDynamicData]
  );

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prev) => prev.filter((_, index) => index !== blockIndex));
    setBlocks((prev) => prev.filter((_, index) => index !== blockIndex));
    setDynamicPreviews((prev) => prev.filter((_, index) => index !== blockIndex));
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

  const handleClick = useCallback(
    (inputs, _blockType) => {
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
      setBlocks((prevState) => [...prevState, newInputs]);
      setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);
    },
    [areAllBlocksFilled]
  );

  const handlerOpenConstructor = useCallback(() => {
    setOpenConstructor((prev) => !prev);
  }, []);

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const formattedData = {
        ...inputData,
        dynamicBlocks: dynamicData,
        selectCompetencies: selectedCompetencies.map((option) => option.label).join(','),
      };
      dispatch(fetchArticle(formattedData));
      setInputData({
        title: '',
        author: '',
        city: '',
        dataMonthYear: '',
        selectCompetencies: [],
        dropPhoto: [],
        titleTextBlock: '',
        descriptionArticle: '',
        photoAva: '',
        imageOpen: '',
        textBlock: '',
        imageClose: '',
      });
      setSelectedCompetencies([]);
      setIsModalOpen(false);
    },
    [dispatch, inputData, dynamicData, selectedCompetencies, setIsModalOpen]
  );

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Сначала заполните все обязательные поля в предыдущем блоке❗
        </div>
      )}
      <div className={styles.form_container__title}>Создай новость</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <HeaderFields
            inputData={inputData}
            setInputData={setInputData}
            selectedCompetencies={selectedCompetencies}
            setSelectedCompetencies={setSelectedCompetencies}
            setIsFocused={setIsFocused}
            customStyles={customStyles}
            styles={styles}
            PublicationIndicator={PublicationIndicator}
            PublicationContainer={PublicationContainer}
            changeHandler={changeHandler}
          />

          <SliderUploadBlock
            styles={styles}
            inputData={inputData}
            changeHandler={changeHandler}
            setInputData={setInputData}
            previewPhotos={previewPhotos}
            setPreviewPhotos={setPreviewPhotos}
            isLoadingDropPhoto={isLoadingDropPhoto}
            setIsLoadingDropPhoto={setIsLoadingDropPhoto}
            setIsDropPhotoVisible={setIsDropPhotoVisible}
            setIsLoading={setIsLoading}
            handleRemovePreviewPhoto={handleRemovePreviewPhoto}
          />

          <TextBlockFields
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            changeHandler={changeHandler}
            quillRef1={quillRef1}
          />

          <AuthorPhotoBlock
            styles={styles}
            inputData={inputData}
            changeHandler={changeHandler}
            setInputData={setInputData}
            setPreviewPhotos={setPreviewPhotos}
            setPreviewPhotoAva={setPreviewPhotoAva}
            setIsPhotoAvaVisible={setIsPhotoAvaVisible}
            setIsLoading={setIsLoading}
            previewPhotoAva={previewPhotoAva}
            isPhotoAvaVisible={isPhotoAvaVisible}
            isLoading={isLoading}
            handleRemovePreviewPhotoAva={handleRemovePreviewPhotoAva}
          />

          <OpenImageBlock
            styles={styles}
            inputData={inputData}
            changeHandler={changeHandler}
            setInputData={setInputData}
            setPreviewPhotos={setPreviewPhotos}
            setPreviewPhotoOpen={setPreviewPhotoOpen}
            setIsPhotoOpenVisible={setIsPhotoOpenVisible}
            setIsLoading={setIsLoading}
            setIsLoadingOpenImage={setIsLoadingOpenImage}
            previewPhotoOpen={previewPhotoOpen}
            isPhotoOpenVisible={isPhotoOpenVisible}
            isLoadingOpenImage={isLoadingOpenImage}
            handleRemovePreviewPhotoOpen={handleRemovePreviewPhotoOpen}
          />

          <SecondaryTextBlock styles={styles} quillRef2={quillRef2} inputData={inputData} setInputData={setInputData} />

          <ConstructorSection
            styles={styles}
            blocks={blocks}
            openConstructor={openConstructor}
            handlerOpenConstructor={handlerOpenConstructor}
            ConstructorPage={ConstructorPage}
            handleClick={handleClick}
            getPreviewClassName={getPreviewClassName}
            dynamicData={dynamicData}
            dynamicPreviews={dynamicPreviews}
            handleDynamicInputChange={handleDynamicInputChange}
            handleDeletePreview={handleDeletePreview}
            setDynamicPreviews={setDynamicPreviews}
            handleRemoveBlock={handleRemoveBlock}
          />

          <CloseImageBlock
            styles={styles}
            inputData={inputData}
            changeHandler={changeHandler}
            setInputData={setInputData}
            setPreviewPhotos={setPreviewPhotos}
            setPreviewPhotoClose={setPreviewPhotoClose}
            setIsPhotoCloseVisible={setIsPhotoCloseVisible}
            setIsLoading={setIsLoading}
            setIsLoadingCloseImage={setIsLoadingCloseImage}
            previewPhotoClose={previewPhotoClose}
            isPhotoCloseVisible={isPhotoCloseVisible}
            isLoadingCloseImage={isLoadingCloseImage}
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
