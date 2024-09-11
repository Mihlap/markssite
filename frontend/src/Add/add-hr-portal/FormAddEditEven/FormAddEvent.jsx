import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import compressImageFile from 'browser-image-compression';
import styles from './FormAddEvent.module.scss';
import { removePreviewPhotoAva } from '../../add-project/formAdd/utils/formHelpers';
import { postVacancyData, resetSlidesState }  from '../../../store/Slice/vacancyMainSlideCardSlice';

export default function FormAddEvent({ setIsModalOpenEvent }) {
  const dispatch = useDispatch(); 

  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [inputData, setInputData] = useState({
    title: "",
    files: "",
    eventData: "",
    hidden: "",
    order: ""
  });

  const validateForm = useCallback(() => {
    const isValid =
      inputData.title &&
      inputData.files &&      
      inputData.eventData &&
      inputData.hidden &&
      inputData.order;

    return isValid;
  }, [inputData]);

  useEffect(() => {
    if (isSubmitted) {
      setShowNotification(!validateForm());
    }
  }, [inputData, isSubmitted, validateForm]);

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
      return file; 
    }
  }, []);


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true); 
  
      const compressedFile = await compressImage(file);  
    
      const finalFile = new File([compressedFile], file.name, { type: compressedFile.type });
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhotoAva([reader.result]); 
        setInputData((prevData) => ({
          ...prevData,
          files: [finalFile], 
        }));
        setIsPhotoAvaVisible(true); 
        setIsLoading(false); 
      };
      reader.readAsDataURL(finalFile);
    }
  };
  
  

  const handleDescriptionChange = (cardKey, value) => {
    if (value.length <= 150) {
      setInputData((prevData) => ({
        ...prevData,  
      }));
    }
    if (isSubmitted) {
      setShowNotification(!validateForm());  
    }
  };

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
 
  
  const closeModal = useCallback(() => {
    setInputData({
      title: "",
      files: "",
      eventData: "",
      hidden: "",
      order: ""
    });
    setPreviewPhotoAva([]);
    setIsModalOpenEvent(false);
  }, [setIsModalOpenEvent]);
  


  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitted(true); 
  
      const isFormValid = validateForm();
  
      if (!isFormValid) {
        setShowNotification(true);
          return;
      }
  
      const formData = new FormData();
      formData.append('details', JSON.stringify({
        inputData: inputData.eventData,     
      }));
  
      if (inputData.files && inputData.files.length > 0) {
        formData.append('files', inputData.files);
      }

       try {
        await dispatch(postVacancyData(formData)).unwrap();
        dispatch(resetSlidesState());       
        setInputData({
          title: "",
          files: "",
          eventData: "",
          hidden: "",
          order: ""
        });
  
        setShowNotification(false); 
        setIsModalOpenEvent(false);
  
      } catch (error) {
        console.error("Произошла ошибка при отправке формы:", error);
      }
    },
    [
      validateForm,
      inputData,
      dispatch,
      setIsModalOpenEvent,
    ]
  );
  

 return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
         Необходимо заполнить каждое поле❗
        </div>
      )}
      <div className={styles.form_container__title}>Новое мероприятие</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
           <div className={styles.form_container__block_gray_one}>
            <div className={styles.form_container__description_text}>
              <div className={styles.form_container__textarea_length}>
                {`${inputData.eventData.length}/150`}
              </div>
              <textarea
                className={styles.form_container__textarea}
                autoComplete="off"
                required
                name="description"
                id="description"
                cols="30"
                rows="10"
                placeholder="Не более 150 символов"
                value={inputData.eventData}
                onChange={(e) => handleDescriptionChange('card1', e.target.value)}
              ></textarea>
              <label htmlFor="description" className={styles.form_container__textarea_label_constructor}>
                Название конкурса
              </label>
            </div>
          </div>        
          <div className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}>
            <div className={styles.form_container__checkbox_block}>
              <div>Изображение</div>
            </div>
            <div style={{ display: isPhotoAvaVisible ? 'inline-block' : 'none' }}>
              <label className={styles.slider_container__customFileUpload}>
                <input
                  type="file"
                  name="files"
                  onChange={handleFileChange}
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
                  <img
                    className={styles.preview_photos_container__img}
                    src={preview}
                    alt={`Preview ${index}`}
                  />
                  <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewPhotoAva(index)}>
                    <span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
    
          {/* <div className={styles.form_container__block_gray_one}>
            <div className={styles.form_container__description_text}>
              <div className={styles.form_container__textarea_length}>
                {`${inputData.card2.description.length}/150`}
              </div>
              <textarea
                className={styles.form_container__textarea}
                autoComplete="off"
                required
                name="descriptionCard2"
                id="descriptionCard2"
                cols="30"
                rows="10"
                placeholder="Не более 150 символов"
                value={inputData.card2.description}
                onChange={(e) => handleDescriptionChange('card2', e.target.value)}
              ></textarea>
              <label htmlFor="descriptionCard2" className={styles.form_container__textarea_label_constructor}>
                Название конкурса
              </label>
            </div>
          </div>           */}
          <div className={styles.form_container__button_block}>
            <button className={styles.form_container__button_save} type="submit"></button>
            <button className={styles.form_container__button_cancel} type="submit" onClick={closeModal}></button>
          </div>
        </form>
      </div>
    </div>
  );
}
