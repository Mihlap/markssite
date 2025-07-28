import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { transliterate } from 'transliteration';
import { useDispatch } from 'react-redux';
import styles from '../../../add-project/formAdd/FormAddProject.module.scss';
import {
  changeHandler,
  removePreviewPhoto,
  removePreviewPhotoAva,
  removePreviewPhotoClose,
  removePreviewPhotoOpen,
} from '../utils/formHelpers';
import { fetchArticle } from '../../../../store/Slice/articleSlice';
import customStyles from '../../../add-project/formAdd/utils/customStyles';
import compressImageFile from 'browser-image-compression';
import ConstructorPage from '../../constructor/ConstructorPage';
import { PublicationContainer, PublicationIndicator } from '../../../add-project/formAdd/utils/CustomSelectComponents';

import HeaderFields from './HeaderFields';
import SliderUploadBlock from './SliderUploadBlock';
import TextBlockFields from './TextBlockFields';
import AuthorPhotoBlock from './AuthorPhotoBlock';
import OpenImageBlock from './OpenImageBlock';
import CloseImageBlock from './CloseImageBlock';
import ConstructorSection from './ConstructorSection';
import SubmitButtons from './SubmitButtons';
import SecondaryTextBlock from './SecondaryTextBlock';

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

  const handleRemovePreviewPhoto = useCallback(
    (index) => {
      removePreviewPhoto(previewPhotos, setPreviewPhotos, index, inputData, setInputData, setIsDropPhotoVisible);
    },
    [previewPhotos, inputData]
  );
  const handleRemovePreviewPhotoAva = useCallback(
    (index) => {
      removePreviewPhotoAva(previewPhotoAva, setPreviewPhotoAva, index, inputData, setInputData, setIsPhotoAvaVisible);
    },
    [previewPhotoAva, inputData]
  );
  const handleRemovePreviewPhotoOpen = useCallback(
    (index) => {
      removePreviewPhotoOpen(
        previewPhotoOpen,
        setPreviewPhotoOpen,
        index,
        inputData,
        setInputData,
        setIsPhotoOpenVisible
      );
    },
    [previewPhotoOpen, inputData]
  );
  const handleRemovePreviewPhotoClose = useCallback(
    (index) => {
      removePreviewPhotoClose(
        previewPhotoClose,
        setPreviewPhotoClose,
        index,
        inputData,
        setInputData,
        setIsPhotoCloseVisible
      );
    },
    [previewPhotoClose, inputData]
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

  const generateUniqueName = (originalName) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const fileExtension = originalName.split('.').pop();
    const sliceOfOriginalName = transliterate(originalName.slice(0, 5));
    return `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;
  };

  const handleDynamicInputChange = useCallback(
    async (blockIndex, inputIndex, value) => {
      const newDynamicData = [...dynamicData];

      if (!newDynamicData[blockIndex]) newDynamicData[blockIndex] = [];
      if (!newDynamicData[blockIndex][inputIndex]) {
        newDynamicData[blockIndex][inputIndex] = {
          type: '',
          label: '',
          value: '',
        };
      }

      if (Array.isArray(value) && value[0] instanceof File) {
        const newFiles = await Promise.all(
          value.map(async (originalFile) => {
            if (originalFile.type.startsWith('image/')) {
              const compressedFile = await compressImage(originalFile);
              const uniqueName = generateUniqueName(compressedFile.name);
              return new File([compressedFile], uniqueName, { type: compressedFile.type });
            } else {
              const uniqueName = generateUniqueName(originalFile.name);
              return new File([originalFile], uniqueName, { type: originalFile.type });
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
      case 'Видеоролик':
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

  const handleDeletePreview = (event, blockIndex, inputIndex, previewIndex) => {
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
    fileInputs.forEach((input) => (input.value = ''));
  };

  const renderInputWithLabel = useCallback(
    (inputType, labelText, blockIndex, inputIndex, key) => {
      const classNames = getPreviewClassName(labelText);

      return (
        <div key={inputIndex}>
          {inputType === 'text' && (
            <div className={styles.form_container__heading_block}>
              <input
                type="input"
                maxLength="56"
                value={dynamicData[blockIndex][inputIndex].value || ''}
                className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
                placeholder={labelText}
                onChange={(e) => {
                  handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
                }}
              />
              <label className={styles.form_container__heading_block_label}>{labelText}</label>
              <div className={styles.form_container__heading_block_input_length}>
                {(dynamicData[blockIndex][inputIndex].value || '').length}/56
              </div>
            </div>
          )}
          {inputType === 'file' && (
            <>
              {labelText === 'Видеоролик' ? (
                <div>
                  <div className={styles.form_container__checkbox_block_constructor}>
                    <div>{labelText}</div>
                  </div>
                  <label className={styles.slider_container__customFileUploadOrangeColor}>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        handleDynamicInputChange(blockIndex, inputIndex, filesArray);

                        const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
                        setDynamicPreviews((prev) => {
                          const newPreviews = [...prev];
                          if (!newPreviews[blockIndex]) newPreviews[blockIndex] = [];
                          newPreviews[blockIndex][inputIndex] = previewsArray;
                          return newPreviews;
                        });
                      }}
                    />
                    <svg
                      className={styles.slider_container__svg}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path
                          d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    <div className={styles.slider_container__uploadText}>Загрузить видеоролик</div>
                  </label>
                  {dynamicPreviews[blockIndex] &&
                    dynamicPreviews[blockIndex][inputIndex] &&
                    dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                      <div key={`${blockIndex}-${inputIndex}-${index}`} className={classNames.innerDiv}>
                        <div className={styles.preview_photos_container_block_constructor}>
                          <video
                            src={src}
                            muted
                            loop
                            autoPlay
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                          />
                          <div
                            className={styles.preview_photos_container_block_constructor__remove_icon}
                            onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <>
                  <div>
                    <div className={styles.form_container__checkbox_block_constructor}>
                      <div>{labelText}</div>
                    </div>
                    <label className={styles.slider_container__customFileUploadOrangeColor}>
                      <input
                        type="file"
                        onChange={(e) => {
                          const filesArray = Array.from(e.target.files);
                          handleDynamicInputChange(blockIndex, inputIndex, filesArray);

                          const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
                          setDynamicPreviews((prev) => {
                            const newPreviews = [...prev];
                            if (!newPreviews[blockIndex]) newPreviews[blockIndex] = [];
                            newPreviews[blockIndex][inputIndex] = previewsArray;
                            return newPreviews;
                          });
                        }}
                        multiple
                      />
                      <svg
                        className={styles.slider_container__svg}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <path
                            d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                            stroke="currentColor"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                      <div className={styles.slider_container__uploadText}>Загрузить изображения</div>
                    </label>
                  </div>
                  <div className={`${styles.previewContainer} ${classNames.outerDiv}`}>
                    {dynamicPreviews[blockIndex] &&
                      dynamicPreviews[blockIndex][inputIndex] &&
                      dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                        <div key={`${blockIndex}-${inputIndex}-${index}`} className={classNames.innerDiv}>
                          <div className={styles.preview_photos_container_block_constructor}>
                            <img
                              src={src}
                              alt={`Preview ${index}`}
                              className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                            />
                            <div
                              className={styles.preview_photos_container_block_constructor__remove_icon}
                              onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
          {inputType === 'videoLink' && (
            <div className={styles.form_container__heading_block}>
              <input
                type="url"
                value={dynamicData[blockIndex][inputIndex].value || ''}
                className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
                placeholder={labelText}
                onChange={(e) => {
                  handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
                }}
              />
              <label className={styles.form_container__heading_block_label}>{labelText}</label>
            </div>
          )}
          {inputType === 'textarea' && (
            <div key={inputIndex} className={styles.form_container__description_text}>
              <div className={styles.form_container__textarea_length}></div>
              <ReactQuill
                ref={(el) => {
                  if (el) {
                    const editor = el.getEditor();
                    const editorElement = editor.root;
                    editorElement.style.fontSize = '16px';
                    editorElement.style.fontFamily = 'Raleway, sans-serif';
                    editorElement.style.color = 'var(--black-1D2E43)';
                    editorElement.style.padding = '1rem';
                    editorElement.style.borderRadius = '6px';
                    editorElement.style.fontWeight = 'var(--fw-400)';
                    editorElement.style.lineHeight = '16px';
                    editorElement.style.boxSizing = 'border-box';
                    editorElement.style.paddingBottom = '2.5rem';
                    editorElement.style.whiteSpace = 'pre-wrap';
                  }
                }}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'bullet' }, { list: 'ordered' }],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                style={{
                  padding: '0rem',
                  fontFamily: 'var(--font-raleway)',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 'var(--fw-400)',
                  lineHeight: '16px',
                  color: 'var(---black-1D2E43)',
                  boxSizing: 'border-box',
                  paddingBottom: '2.5rem',
                  whiteSpace: 'pre-wrap',
                }}
                formats={['bold', 'italic', 'underline', 'list']}
                className={`${styles.form_container__textarea} ${styles.orange_color}`}
                required
                name={key}
                id={key}
                value={dynamicData[blockIndex][inputIndex].value}
                onChange={(value) => {
                  handleDynamicInputChange(blockIndex, inputIndex, value);
                }}
                placeholder={labelText}
              />
              <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
                {labelText}
              </label>
            </div>
          )}
        </div>
      );
    },
    [dynamicData, dynamicPreviews, getPreviewClassName, handleDynamicInputChange]
  );

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prev) => prev.filter((_, index) => index !== blockIndex));
    setBlocks((prev) => prev.filter((_, index) => index !== blockIndex));
    setDynamicPreviews((prev) => prev.filter((_, index) => index !== blockIndex));
  }, []);

  const renderInputs = useCallback(
    (inputs, blockIndex) => {
      return (
        <div key={blockIndex} className={styles.blockContainer}>
          {inputs.map((input, inputIndex) => renderInputWithLabel(input.type, input.label, blockIndex, inputIndex))}
          <div className={styles.blockContainer__close_button} onClick={() => handleRemoveBlock(blockIndex)}></div>
        </div>
      );
    },
    [renderInputWithLabel, handleRemoveBlock]
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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

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
            {...{
              inputData,
              setInputData,
              selectedCompetencies,
              setSelectedCompetencies,
              setIsFocused,
              customStyles,
              styles,
              PublicationIndicator,
              PublicationContainer,
              changeHandler,
            }}
          />
          <SliderUploadBlock
            {...{
              styles,
              inputData,
              changeHandler,
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
              setIsLoadingCloseImage,
              handleRemovePreviewPhoto,
              previewPhotos,
              isLoadingDropPhoto,
            }}
          />
          <TextBlockFields {...{ styles, inputData, setInputData, changeHandler, quillRef1 }} />
          <AuthorPhotoBlock
            {...{
              styles,
              inputData,
              changeHandler,
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
              setIsLoadingCloseImage,
              previewPhotoAva,
              isPhotoAvaVisible,
              isLoading,
              handleRemovePreviewPhotoAva,
            }}
          />
          <OpenImageBlock
            {...{
              styles,
              inputData,
              changeHandler,
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
              setIsLoadingCloseImage,
              previewPhotoOpen,
              isPhotoOpenVisible,
              isLoadingOpenImage,
              handleRemovePreviewPhotoOpen,
            }}
          />
          <SecondaryTextBlock styles={styles} quillRef2={quillRef2} inputData={inputData} setInputData={setInputData} />
          <ConstructorSection
            styles={styles}
            blocks={blocks}
            dynamicPreviews={dynamicPreviews}
            dynamicData={dynamicData}
            renderInputs={renderInputs}
            openConstructor={openConstructor}
            handlerOpenConstructor={handlerOpenConstructor}
            ConstructorPage={ConstructorPage}
            handleClick={handleClick}
            handleRemoveBlock={handleRemoveBlock}
            showNotification={showNotification}
          />
          <CloseImageBlock
            {...{
              styles,
              inputData,
              changeHandler,
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
              setIsLoadingCloseImage,
              previewPhotoClose,
              isPhotoCloseVisible,
              isLoadingCloseImage,
              handleRemovePreviewPhotoClose,
            }}
          />
          <SubmitButtons styles={styles} closeModal={closeModal} />
        </form>
      </div>
    </div>
  );
}