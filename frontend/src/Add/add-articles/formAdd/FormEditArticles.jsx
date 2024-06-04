import React, { useEffect, useRef, useState, useCallback } from "react";
import Select from "react-select";
import { transliterate } from "transliteration";
import { useDispatch } from "react-redux";
import styles from "../../add-project/formAdd/FormAddProject.module.scss";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import {
  changeHandler,
  removePreviewPhoto,
  removePreviewPhotoAva,
  removePreviewPhotoClose,
  removePreviewPhotoOpen,
  getEmbedLink,
} from "./utils/formHelpers";
import {
  fetchArticle,
  setArticleId,
  clearFormData,
  // getFetchFormArticle,
  setDynamicaData,
  setDynamicImages,
} from "../../../store/Slice/articleSlice";
import customStyles from "../../add-project/formAdd/utils/customStyles";
import compressImageFile from "browser-image-compression";

import ConstructorPage from "../constructor/ConstructorPage";
import {
  PublicationContainer,
  PublicationIndicator,
} from "../../add-project/formAdd/utils/CustomSelectComponents";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function FormEditArticles({ setIsModalOpen, editArticleData }) {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
  const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
  const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
  const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropPhoto, setIsLoadingDropPhoto] = useState(false);
  const [isLoadingOpenImage, setIsLoadingOpenImage] = useState(false);
  const [isLoadingCloseImage, setIsLoadingCloseImage] = useState(false);
  const [embedLink, setEmbedLink] = useState("");
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
    imageTitle: "",
    imageAuthor: "",
  });

   const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);

  // Стили для eact-quill
  const applyStylesToQuillEditor = (quillRef) => {
    if (quillRef && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;
      
      editorElement.style.fontSize = '16px';
      editorElement.style.fontFamily = 'Raleway, sans-serif';
      editorElement.style.color = 'var(--black-1D2E43)';
      editorElement.style.border = 'none';
    }
  };

  useEffect(() => {
    [quillRef1, quillRef2].forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, []);

   // состояние для хранения текущего значения инпута
  //  const [inputValue, setInputValue] = useState("");
  // const [blocks, setBlocks] = useState([]);
   const [openConstructor, setOpenConstructor] = useState(false);
   const [dynamicPreviews, setDynamicPreviews] = useState([]);
   const [dynamicData, setDynamicData] = useState([]);
  
  
  const data = editArticleData?.ConstructorArticles?.[0]?.data;

  useEffect(() => {
    if (editArticleData) {
      const initialSelectedCompetencies = editArticleData.selectCompetencies
        ? editArticleData.selectCompetencies.split(",").map((item) => ({ value: item.trim(), label: item.trim() }))
        : [];

      setSelectedCompetencies(initialSelectedCompetencies);

      setInputData((prevInputData) => ({
        ...prevInputData,
        title: editArticleData.title ?? "",
        selectCompetencies: initialSelectedCompetencies,
        author: editArticleData.author ?? "",
        city: editArticleData.city ?? "",
        dataMonthYear: editArticleData.dataMonthYear ?? "",
        dropPhoto: editArticleData.dropPhoto ? editArticleData.dropPhoto.split(",") : [],
        photoAva: editArticleData.photoAva ?? "",
        titleTextBlock: editArticleData.titleTextBlock ?? "",
        descriptionArticle: editArticleData.descriptionArticle ?? "",
        publication: editArticleData.publication ?? "",
        linkToPublicationTwo: editArticleData.linkToPublicationTwo ?? "",
        imageOpen: editArticleData.imageOpen ?? "",
        textBlock: editArticleData.textBlock ?? "",
        imageClose: editArticleData.imageClose ?? "",
        imageAuthor: editArticleData.imageAuthor ?? "",
        imageTitle: editArticleData.imageTitle ? editArticleData.imageTitle.split(",") : [],
        dynamicDataFromEditArticle: editArticleData.dynamicDataFromEditProject ?? "",
      }));

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
        });
      }
    }
  }, [editArticleData]);

  // useEffect(() => {
  //   const updateEmbedLink = async () => {
  //     dynamicData.forEach(async (block, blockIndex) => {
  //       block.forEach(async (input, inputIndex) => {
  //         if (input.type === "videoLink" && input.value) {
  //           const link = await getEmbedLink(input.value);
  //           setDynamicData((prevDynamicData) => {
  //             const newDynamicData = [...prevDynamicData];
  //             newDynamicData[blockIndex][inputIndex] = {
  //               ...newDynamicData[blockIndex][inputIndex],
  //               embedLink: link,
  //             };
  //             return newDynamicData;
  //           });
  //         }
  //       });
  //     });
  //   };

  //   updateEmbedLink();
  // }, [dynamicData]);
  

  // << ==== КОНСТУКТОР ==== >>
  const handleRemovePreviewPhoto = useCallback((index) => {
    removePreviewPhoto(previewPhotos, setPreviewPhotos, index, inputData, setInputData, setIsDropPhotoVisible);
  }, [previewPhotos, inputData]);

  // Удаление фото из массива превью который с одной фоткой
  const handleRemovePreviewPhotoAva = useCallback((index) => {
    removePreviewPhotoAva(previewPhotoAva, setPreviewPhotoAva, index, inputData, setInputData, setIsPhotoAvaVisible);
  }, [previewPhotoAva, inputData]);

// Удаление превью фото перед основным текстом НЕ УДАЛЯТЬ!!!!!
  // Удаление превью фото перед основным текстом
  // const handleRemovePreviewPhotoOpen = (index) => {
  //   removePreviewPhotoOpen(
  //     previewPhotoOpen,
  //     setPreviewPhotoOpen,
  //     index,
  //     inputData,
  //     setInputData,
  //     setIsPhotoOpenVisible
  //   );
  // };

  // // Удаление превью фото из закрывающей картинки
  // const handleRemovePreviewPhotoClose = (index) => {
  //   removePreviewPhotoClose(
  //     previewPhotoClose,
  //     setPreviewPhotoClose,
  //     index,
  //     inputData,
  //     setInputData,
  //     setIsPhotoCloseVisible
  //   );
  // };

  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  // функция отправки формы на Redux
  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    try {
      const previewPhotosCopy = [...previewPhotos];
      const previewPhotoAvaCopy = [...previewPhotoAva];
      const previewPhotoOpenCopy = [...previewPhotoOpen];
      const previewPhotoCloseCopy = [...previewPhotoClose];
      const formattedData = {
        ...inputData,
        dynamicBlocks: dynamicData,
        selectCompetencies: selectedCompetencies.map((option) => option.label).join(","),
      };

      if (editArticleData && editArticleData.id) {
        dispatch(setArticleId(editArticleData.id));
      }

      await dispatch(
        fetchArticle(
          formattedData,
          editArticleData.id,
          setInputData,
          setPreviewPhotos,
          setPreviewPhotoAva,
          setPreviewPhotoOpen,
          setPreviewPhotoClose,
          previewPhotosCopy,
          previewPhotoAvaCopy,
          previewPhotoOpenCopy,
          previewPhotoCloseCopy
        )
      );

      setSelectedCompetencies([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении статьи:", error);
    }
  }, [dispatch, editArticleData, inputData, previewPhotos, previewPhotoAva, previewPhotoOpen, previewPhotoClose, selectedCompetencies, dynamicData]);

  
  // << ============ КОНСТРУКТОР ============ >>
  const handlerOpenConstructor = useCallback(() => {
    setOpenConstructor(!openConstructor);
  }, [openConstructor]);

  // функция которая не даёт создать новый диманический блок, пока не заполнены value предыдущего
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

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prevDynamicData) => prevDynamicData.filter((_, index) => index !== blockIndex));
    setDynamicPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== blockIndex));
  }, []);
  

  const handleClick = useCallback((inputs, blockIndex) => {
    if (!areAllBlocksFilled()) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      return;
    }

    const blockKey = Date.now().toString();
    const newInputs = inputs.map((input) => ({
      ...input,
      key: blockKey + "_" + input.type,
      blockIndex: blockIndex,
    }));

    setDynamicData((prevDynamicData) => [...prevDynamicData, newInputs]);
    setDynamicPreviews((prevPreviews) => [
      ...prevPreviews,
      new Array(newInputs.length).fill([]),
    ]);
  }, [areAllBlocksFilled]);

  async function compressImage(file) {
    const options = {
      maxSizeMB: 3, // максимальный размер файла в MB
      maxWidthOrHeight: 1920, // максимальная ширина или высота
      useWebWorker: true,
    };

    try {
      return await compressImageFile(file, options);
    } catch (error) {
      console.error("Ошибка при сжатии изображения:", error);
    }
  }

  const handleDynamicInputChange = useCallback(async (blockIndex, inputIndex, value) => {
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
        key: "",
        // embedLink: "",
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

      // if (newDynamicData[blockIndex][inputIndex].type === "videoLink") {
      //   const link = await getEmbedLink(value);
      //   newDynamicData[blockIndex][inputIndex].embedLink = link;
      // }
    }
    setDynamicData(newDynamicData);
  }, [dynamicData]);

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
      case "Видеоролик":
        return {
          outerDiv: styles.videoPreview,
          innerDiv: styles.videoInnerDiv,
          videoStyles: styles.videoStyle, // этот стиль можно использовать для видеотега
        };
        case "Ссылка на видеоролик":
          return {
            outerDiv: styles.videoPreview,
            innerDiv: styles.videoInnerDiv,
            videoStyles: styles.videoStyle,
          };
      default:
        return "";
    }
  };

  const handleDeletePreview = useCallback((event, blockIndex, inputIndex, previewIndex) => {
    event.preventDefault();
    setDynamicPreviews((prev) => {
      const newPreviews = [...prev];
      if (
        newPreviews[blockIndex] &&
        newPreviews[blockIndex][inputIndex] &&
        newPreviews[blockIndex][inputIndex][previewIndex]
      ) {
        newPreviews[blockIndex][inputIndex] = newPreviews[blockIndex][
          inputIndex
        ].filter((_, index) => index !== previewIndex);
      }
      return newPreviews;
    });

    setDynamicData((prevData) => {
      const newData = [...prevData];
      if (
        newData[blockIndex] &&
        newData[blockIndex][inputIndex] &&
        Array.isArray(newData[blockIndex][inputIndex].value) &&
        newData[blockIndex][inputIndex].value[previewIndex]
      ) {
        const updatedValue = [...newData[blockIndex][inputIndex].value];
        updatedValue.splice(previewIndex, 1);
        newData[blockIndex][inputIndex].value = updatedValue;
      }
      return newData;
    });

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  }, []);

  const renderInputWithLabel = useCallback((inputType, labelText, blockIndex, inputIndex, key) => {
    const classNames = getPreviewClassName(labelText);

    return (
      <div key={key}>
        {inputType === "text" && (
          <div className={styles.form_container__heading_block}>
            <input
              type="input"
              maxLength="56"
              className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
              placeholder={labelText}
              value={dynamicData[blockIndex][inputIndex]?.value || ""}
              onChange={(e) => handleDynamicInputChange(blockIndex, inputIndex, e.target.value)}
            />
            <label htmlFor={`input-${blockIndex}-${inputIndex}`} className={styles.form_container__heading_block_label}>
              {labelText}
            </label>
            <div className={styles.form_container__heading_block_input_length}>
              {(dynamicData[blockIndex]?.[inputIndex]?.value || "").length}/56
            </div>
          </div>
        )}
        {inputType === "file" && (
          <>
            {labelText === "Видеоролик" ? (
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
                        if (!newPreviews[blockIndex]) {
                          newPreviews[blockIndex] = [];
                        }
                        newPreviews[blockIndex][inputIndex] = previewsArray;
                        return newPreviews;
                      });
                    }}
                  />
                  <svg className={styles.slider_container__svg} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <div className={styles.slider_container__uploadText}>Загрузить видеоролик</div>
                </label>
                {Array.isArray(dynamicPreviews[blockIndex]?.[inputIndex]) &&
                  dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                    <div key={`${blockIndex}-${inputIndex}-${index}`} className={classNames.innerDiv}>
                      <div className={styles.preview_photos_container_block_constructor}>
                        {typeof src === "string" && src.startsWith("blob:") ? (
                          <video
                            key={index}
                            src={src}
                            muted
                            loop
                            autoPlay
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                          />
                        ) : (
                          <video
                            key={index}
                            src={`${Host}/images/imageArticle/${src}`}
                            muted
                            loop
                            autoPlay
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                          />
                        )}
                        <div className={styles.preview_photos_container_block_constructor__remove_icon} onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
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
                  <label className={styles.slider_container__customFileUploadOrangeColor}>
                    <input
                      type="file"
                      onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        handleDynamicInputChange(blockIndex, inputIndex, filesArray);

                        const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
                        setDynamicPreviews((prev) => {
                          const newPreviews = [...prev];
                          if (!newPreviews[blockIndex]) {
                            newPreviews[blockIndex] = [...prev];
                          }
                          newPreviews[blockIndex][inputIndex] = previewsArray;
                          return newPreviews;
                        });
                      }}
                      multiple
                    />
                    <svg className={styles.slider_container__svg} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <div className={styles.slider_container__uploadText}>Загрузить изображения</div>
                  </label>
                </div>
                <div className={`${styles.previewContainer} ${classNames.outerDiv}`}>
                  {Array.isArray(dynamicPreviews[blockIndex]?.[inputIndex]) &&
                    dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                      <div key={`${blockIndex}-${inputIndex}-${index}`} className={classNames.innerDiv}>
                        <div className={styles.preview_photos_container_block_constructor}>
                          {typeof src === "string" && src.startsWith("blob:") ? (
                            <img
                              src={src}
                              alt={`Preview ${index}`}
                              className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                            />
                          ) : (
                            <img
                              src={`${Host}/images/imageArticle/${src}`}
                              alt={`Preview ${index}`}
                              className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                            />
                          )}
                          <div className={styles.preview_photos_container_block_constructor__remove_icon} onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
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
          {inputType === "videoLink" && (
          <div className={styles.form_container__heading_block}>
            <input
              type="url"
              value={dynamicData[blockIndex][inputIndex].value || ""}
              className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
              placeholder={labelText}
              onChange={(e) => {
                handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
              }}
            />
            <label
              htmlFor="videoLink"
              className={styles.form_container__heading_block_label}
            >
              {labelText}
            </label>
            {embedLink && (
            <div className={classNames.outerDiv}>
              <iframe
                width="560"
                height="315"
                className={styles.embedIframe}
                src={embedLink}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          </div>
        )}
        {inputType === "textarea" && (
          <div key={inputIndex} className={styles.form_container__description_text}>
            <ReactQuill
              ref={(el) => {
                if (el) {
                  const editor = el.getEditor();
                  const editorElement = editor.root;
                  editorElement.style.border = "none";
                  editorElement.style.fontSize = "16px";
                  editorElement.style.fontFamily = "Raleway, sans-serif";
                  editorElement.style.color = "var(--black-1D2E43)";
                  editorElement.style.padding = "1rem";
                  editorElement.style.borderRadius = "6px";
                  editorElement.style.fontWeight = "var(--fw-400)";
                  editorElement.style.lineHeight = "16px";
                  editorElement.style.boxSizing = "border-box";
                  editorElement.style.paddingBottom = "2.5rem";
                }
              }}
              style={{
                padding: "0rem",
                fontFamily: "var(--font-raleway)",
                borderRadius: "6px",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "var(--fw-400)",
                lineHeight: "16px",
                color: "var(---black-1D2E43)",
                boxSizing: "border-box",
                paddingBottom: "2.5rem",
              }}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline"],
                  [{ list: "bullet" }, { list: "ordered" }],
                ],
                clipboard: {
                  matchVisual: false,
                },
              }}
              formats={["bold", "italic", "underline", "list"]}
              className={`${styles.form_container__textarea} ${styles.orange_color}`}
              required
              name={key}
              id={key}
              value={dynamicData[blockIndex][inputIndex]?.value || ""}
              onChange={(value) => handleDynamicInputChange(blockIndex, inputIndex, value)}
              placeholder={labelText}
            />
            <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
              {labelText}
            </label>
          </div>
        )}
      </div>
    );
  }, [dynamicData, dynamicPreviews, handleDynamicInputChange, handleDeletePreview]);

  const renderInputs = useCallback((inputs, blockIndex) => {
    if (!Array.isArray(inputs)) return null;

    return (
      <div key={blockIndex} className={styles.blockContainer}>
        {inputs.map((input, inputIndex) => renderInputWithLabel(input.type, input.label, blockIndex, inputIndex, `${blockIndex}-${inputIndex}`))}
        <div key={`close-${blockIndex}`} className={styles.blockContainer__close_button} onClick={() => handleRemoveBlock(blockIndex)}></div>
      </div>
    );
  }, [handleRemoveBlock, renderInputWithLabel]);

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загркузки изображений❗
        </div>
      )}
      <div className={styles.form_container__title}>
        {editArticleData ? "Редактирование публикации" : "Новая публикация"}
      </div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <div className={styles.form_container__block_gray_one}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                required
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
                // required
                type="text"
                className={styles.form__field}
                placeholder="author"
                name="author"
                id="author"
                value={inputData.author}
                onChange={(event) =>
                  changeHandler(event, inputData, setInputData)
                }
              />
              <label htmlFor="author" className={styles.form__label}>
                Автор статьи
              </label>
            </div>

            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                required
                type="text"
                className={styles.form__field}
                placeholder="city"
                name="city"
                id="city"
                value={inputData.city}
                onChange={(event) =>
                  changeHandler(event, inputData, setInputData)
                }
              />
              <label htmlFor="city" className={styles.form__label}>
                Издание, город
              </label>
            </div>

            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="text"
                required
                className={styles.form__field}
                placeholder="dataMonthYear"
                name="dataMonthYear"
                id="dataMonthYear"
                value={inputData.dataMonthYear}
                onChange={(event) =>
                  changeHandler(event, inputData, setInputData)
                }
              />
              <label htmlFor="dataMonthYear" className={styles.form__label}>
                Дата, месяц, год
              </label>
            </div>
            <Select
              styles={customStyles}
              isMulti
              name="selectCompetencies"
              value={selectedCompetencies}
              onChange={setSelectedCompetencies}
              options={[
                { value: "Выступления", label: "Выступления" },
                { value: "Интервью", label: "Интервью" },
                { value: "Новости", label: "Новости" },
                { value: "Статьи", label: "Статьи" },
                { value: "Научные публикации", label: "Научные публикации" },
              ]}
              className={styles.form__field}
              placeholder="Выберите табы фильтрации"
              components={{
                DropdownIndicator: PublicationIndicator,
                ValueContainer: PublicationContainer,
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {/* блок где загружаются 4 картинки, они отображаются в шапке слайдера  */}
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
            // style={{ display: isDropPhotoVisible ? "block" : "none" }}
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
            <div className={styles.preview_photos_container}>
              {Array.isArray(inputData.dropPhoto) &&
                inputData.dropPhoto.length > 0 &&
                inputData.dropPhoto.map((preview, index) => (
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
              {inputData.imageTitle !== null &&
                inputData.dropPhoto.length === 0 &&
                [] // Создаем новый массив
                  .concat(inputData.imageTitle) // Преобразуем inputData.imageTitle в массив
                  .filter(Boolean) // Убираем пустые значения
                  .map((imageFileName, index) => (
                    <div
                      key={index}
                      className={styles.preview_photos_container__block}
                    >
                      <img
                        className={styles.preview_photos_container__img}
                        src={`${Host}/images/imageArticle/${imageFileName.trim()}`}
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
          <div className={styles.blockContainer}>
            <div className={styles.form_container__heading_block}>
              <input
                required
                type="input"
                className={styles.form_container__heading_block_input}
                placeholder="Нет ограничения по символам"
                name="titleTextBlock"
                id="titleTextBlock"
                // maxLength="56"
                value={inputData.titleTextBlock}
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
              <label
                htmlFor="titleTextBlock"
                className={styles.form_container__heading_block_label}
              >
                Заголовок текстового блока
              </label>
              {/* <div className={styles.form_container__heading_block_input_length}>
              {`${inputData.titleTextBlock.length}/56`}
            </div> */}
            </div>
            {/* блок и текстерией ( Описание статьи ) */}
            <div className={styles.form_container__description_text}>
              {/* <div className={styles.form_container__textarea_length}>
              {`${inputData.descriptionArticle.length}/260`}
            </div> */}
              <ReactQuill
                ref={quillRef1}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "bullet" }, { list: "ordered" }],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={["bold", "italic", "underline", "list"]}
                className={styles.form_container__textarea}
                style={{
                  // resize: "none",
                  padding: "0rem",
                  border: "1px solid var(--blue-75BBFD)",
                  borderRadius: "6px",
                  fontFamily: "var(--font-raleway)",
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: "var(--fw-400)",
                  lineHeight: "16px",
                  color: "var(---black-1D2E43)",
                  boxSizing: "border-box",
                  paddingBottom: "2.5rem",
                }}
                required
                name="descriptionArticle"
                id="descriptionArticle"
                value={inputData.descriptionArticle}
                onChange={(value) => {
                  setInputData((prevInputData) => ({
                    ...prevInputData,
                    descriptionArticle: value,
                  }));
                }}
                placeholder="Нет ограничения по символам"
              />
              <label
                htmlFor=""
                className={styles.form_container__textarea_label_constructor}
              >
                Текст статьи
              </label>
            </div>
          </div>
          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>
                Фото автора статьи
                {/* <span> для отображения на странице «Проекты»</span> */}
              </div>
            </div>
            <div
            // style={{ display: isPhotoAvaVisible ? "block" : "none" }}
            >
               {/* {!isLoading && ( */}
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
              {/* //  )}  */}
              {isLoading && (
                <div className={styles.preview_photos_container__loading}>
                  Загрузка . . .
                </div>
              )}
            </div>
            <div>
            {inputData.imageAuthor && previewPhotoAva.length === 0 && inputData.imageAuthor.length > 0 && (
                <div              
                  className={styles.preview_photos_container__block}
                >
                  <img
                    className={styles.preview_photos_container__img}
                    src={`${Host}/images/imageArticle/${inputData.imageAuthor}`}
                    alt=""
                  />
                  <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoAva()}
                  >
                    <span></span>
                  </div>
                </div>
              )}
              {previewPhotoAva?.map((preview, index) => (
               <div
                  key={index}
                  className={styles.preview_photos_container__block}
                  >
                    <img
                      className={styles.preview_photos_container__img}
                      src={preview || ""}
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
          <div
            className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}
          >
            <div className={styles.form_container__checkbox_block}>
              <div>Открывающая картинка</div>
            </div>
            <div
              style={{ display: isPhotoOpenVisible ? "inline-block" : "none" }}
            >
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
                  style={{ display: isPhotoOpenVisible ? "block" : "none" }}
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
                  {/* <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoOpen(index)}
                  >
                    <span></span>
                  </div> */}
                </div>
              ))}
              {inputData.imageOpen !== null &&
                previewPhotoOpen.length === 0 && (
                  <div className={styles.preview_photos_container__block}>
                    <img
                      className={styles.preview_photos_container__img}
                      src={`${Host}/images/imageArticle/${inputData.imageOpen}`}
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
          <div className={styles.blockContainer}>
            <div className={styles.form_container__description_text}>
              <ReactQuill
                ref={quillRef2}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "bullet" }, { list: "ordered" }],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={["bold", "italic", "underline", "list"]}
                className={styles.form_container__textarea}
                style={{
                  // resize: "none",
                  padding: "0rem",
                  border: "1px solid var(--blue-75BBFD)",
                  fontFamily: "var(--font-raleway)",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "var(--fw-400)",
                  lineHeight: "16px",
                  color: "var(---black-1D2E43)",
                  boxSizing: "border-box",
                  paddingBottom: "2.5rem",
                }}
                required
                name="textBlock"
                id="textBlock"
                value={inputData.textBlock}
                onChange={(value) => {
                  setInputData((prevInputData) => ({
                    ...prevInputData,
                    textBlock: value,
                  }));
                }}
                placeholder="Нет ограничения по символам"
              />
              <label
                htmlFor="textBlock"
                className={styles.form_container__textarea_label}
              >
                Текстовый блок
              </label>
            </div>
          </div>
          {/* КОНСТРУКТОР */}
          {dynamicData && (
            <div className={styles.inputs_container}>
              {dynamicData.map((blockInputs, blockIndex) => (
                <div key={blockIndex} className={styles.input_block}>
                  {/* {renderInputs(blockInputs, blockIndex)} */}
                  {Array.isArray(blockInputs) &&
                    renderInputs(blockInputs, blockIndex)}
                </div>
              ))}
            </div>
          )}
          <div className={styles.constructor_container}>
            <div className={styles.constructor_container__block}>
              {openConstructor ? (
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
                <ConstructorPage
                  data={data}
                  handleClick={handleClick}
                  // blocks={blocks}
                />
              )}
            </div>
          </div>
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
                  {/* <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoClose(index)}
                  >
                    <span></span>
                  </div> */}
                </div>
              ))}
              {!inputData.imageClose !== null &&
                previewPhotoClose.length === 0 && (
                  <div className={styles.preview_photos_container__block}>
                    <img
                      className={styles.preview_photos_container__img}
                      src={`${Host}/images/imageArticle/${inputData.imageClose}`}
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
