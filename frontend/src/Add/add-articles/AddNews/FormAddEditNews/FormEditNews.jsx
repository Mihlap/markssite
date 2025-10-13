import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import 'react-quill-new/dist/quill.snow.css';

import { changeHandler } from '../utils/formHelpers';
import { usePreviewHandlers } from '../utils/hooks/usePreviewHandlers';
import { sharedHandleDynamicInputChange, sharedHandleDeletePreview, getPreviewClassName } from '../utils/formShared';
import useInterceptExternalClose from '../../../hooks/useInterceptExternalClose';

import customStyles from '../../../add-project/FormAddEditProject/utils/customStyles';
import adminStyles from '../../../style/style-card.module.scss';
import styles from '../../../add-project/FormAddEditProject/FormAddProject.module.scss';

import {
  PublicationContainer,
  PublicationIndicator,
} from '../../../add-project/FormAddEditProject/utils/CustomSelectComponents';

import { fetchArticle, setArticleId } from '../../../../store/Slice/articleSlice';

import HeaderFields from './HeaderFields';
import SliderUploadBlock from './SliderUploadBlock';
import TextBlockFields from './TextBlockFields';
import AuthorPhotoBlock from './AuthorPhotoBlock';
import OpenImageBlock from './OpenImageBlock';
import SecondaryTextBlock from './SecondaryTextBlock';
import CloseImageBlock from './CloseImageBlock';
import ConstructionSectionFromEdit from './ConstructionSectionFromEdit';
import ConstructorPage from '../../constructor/ConstructorPage';
import SubmitButtons from '../../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../../UI/ExitConfirmModal/ExitConfirmModal';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function FormEditNews({ setIsModalOpen, editArticleData }) {
  const dispatch = useDispatch();

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
    imageTitle: '',
    imageAuthor: '',
  });

  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [, setIsDropPhotoVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);
  const quillRefs = useMemo(() => [quillRef1, quillRef2], []);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);

  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

  const applyQuillStyles = useCallback((ref) => {
    if (ref.current) {
      const root = ref.current.getEditor().root;
      root.style.cssText = `
        font-size:16px;
        font-family:Raleway,sans-serif;
        color:var(--black-1D2E43);
        border:none;
      `;
    }
  }, []);

  useEffect(() => quillRefs.forEach(applyQuillStyles), [quillRefs, applyQuillStyles]);

  const [dynamicData, setDynamicData] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [openConstructor, setOpenConstructor] = useState(false);

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

  const data = editArticleData?.ConstructorArticles?.[0]?.data;

  useEffect(() => {
    if (editArticleData) {
      const initialSelectedCompetencies = editArticleData.selectCompetencies
        ? editArticleData.selectCompetencies.split(',').map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];

      setSelectedCompetencies(initialSelectedCompetencies);

      setInputData((prevInputData) => ({
        ...prevInputData,
        title: editArticleData.title ?? '',
        selectCompetencies: initialSelectedCompetencies,
        author: editArticleData.author ?? '',
        city: editArticleData.city ?? '',
        dataMonthYear: editArticleData.dataMonthYear ?? '',
        dropPhoto: editArticleData.dropPhoto ? editArticleData.dropPhoto.split(',') : [],
        photoAva: editArticleData.photoAva ?? '',
        titleTextBlock: editArticleData.titleTextBlock ?? '',
        descriptionArticle: editArticleData.descriptionArticle ?? '',
        publication: editArticleData.publication ?? '',
        linkToPublicationTwo: editArticleData.linkToPublicationTwo ?? '',
        imageOpen: editArticleData.imageOpen ?? '',
        textBlock: editArticleData.textBlock ?? '',
        imageClose: editArticleData.imageClose ?? '',
        imageAuthor: editArticleData.imageAuthor ?? '',
        imageTitle: editArticleData.imageTitle ? editArticleData.imageTitle.split(',') : [],
        dynamicDataFromEditArticle: editArticleData.dynamicDataFromEditProject ?? '',
      }));

      const data = editArticleData?.ConstructorArticles?.[0]?.data;

      if (Array.isArray(data) && data.length > 0) {
        data.forEach((block, index) => {
          if (Array.isArray(block)) {
            const dynamicDataFromEditArticle = block.map((input) => input.value) || [];

            if (dynamicDataFromEditArticle.length > 0) {
              const dynamicData = block.map((input) => ({
                type: input.type,
                label: input.label,
                value: input.value,
                key: input.key,
                blockIndex: index,
              }));

              setDynamicData((prevDynamicData) => {
                const newDynamicData = [...prevDynamicData];
                newDynamicData[index] = dynamicData;
                return newDynamicData;
              });

              const previewsArray = dynamicData.map((input) => input.value);
              setDynamicPreviews((prev) => {
                const newPreviews = [...prev];
                newPreviews[index] = previewsArray;
                return newPreviews;
              });
            }
          }
        });
      }
    }
  }, [editArticleData]);

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (editArticleData?.id) {
        dispatch(setArticleId(editArticleData.id));
      }
      await dispatch(
        fetchArticle({
          ...inputData,
          selectCompetencies: selectedCompetencies.map((c) => c.label).join(','),
          dynamicBlocks: dynamicData,
        })
      );
      setIsModalOpen(false);
    },
    [dispatch, editArticleData, inputData, selectedCompetencies, dynamicData, setIsModalOpen]
  ); 

  const handlerOpenConstructor = useCallback(() => setOpenConstructor((o) => !o), []);

  const areAllBlocksFilled = useCallback(
    () => dynamicData.every((block) => block.every((f) => !f.required || Boolean(f.value))),
    [dynamicData]
  );
  const handleRemoveBlock = useCallback((idx) => {
    setDynamicData((d) => d.filter((_, i) => i !== idx));
    setDynamicPreviews((p) => p.filter((_, i) => i !== idx));
  }, []);

  const handleClickBlock = useCallback(
    (templateBlock) => {
      if (!areAllBlocksFilled()) return;
      const key = Date.now().toString();
      const newBlock = templateBlock.map((f) => ({ ...f, key: key + '_' + f.type }));
      setDynamicData((d) => [...d, newBlock]);
      setDynamicPreviews((p) => [...p, new Array(newBlock.length).fill([])]);
    },
    [areAllBlocksFilled]
  );

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

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_container__title}>{editArticleData ? 'Редактирование новости' : 'Новая новость'}</h2>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <HeaderFields
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            selectedCompetencies={selectedCompetencies}
            setSelectedCompetencies={setSelectedCompetencies}
            setIsFocused={() => {}}
            changeHandler={changeHandler}
            customStyles={customStyles}
            PublicationIndicator={PublicationIndicator}
            PublicationContainer={PublicationContainer}
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
            dynamicData={dynamicData}
            data={data}
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
            dynamicData={dynamicData}
            data={data}
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

          <ConstructionSectionFromEdit
            styles={styles}
            dynamicData={dynamicData}
            data={data}
            dynamicPreviews={dynamicPreviews}
            setDynamicPreviews={setDynamicPreviews}
            changeHandler={changeHandler}
            openConstructor={openConstructor}
            handlerOpenConstructor={handlerOpenConstructor}
            handleClick={handleClickBlock}
            handleRemoveBlock={handleRemoveBlock}
            handleDynamicInputChange={handleDynamicInputChange}
            handleDeletePreview={handleDeletePreview}
            bucket_url={bucket_url}
            getPreviewClassName={getPreviewClassName}
            ConstructorPage={ConstructorPage}
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
