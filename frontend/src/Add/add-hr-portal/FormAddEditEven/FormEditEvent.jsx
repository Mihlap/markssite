import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import compressImageFile from 'browser-image-compression';
import styles from './FormAddEvent.module.scss';
import { editEvent, fetchEvents, postEventData } from '../../../store/Slice/vacancyEventSlice';

const Host = process.env.REACT_APP_SERVER_HOST;

export default function FormEditSlide({ setIsModalOpenEvent, editEventData }) {
  const dispatch = useDispatch();

  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);  
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [removedFiles, setRemovedFiles] = useState([]); 
  const [formData, setFormData] = useState({
    title: editEventData?.title || '',
    files: editEventData?.files || [],
    eventData: editEventData?.eventData || [],
  });

  useEffect(() => {
    if (editEventData) {
      setFormData({
        title: editEventData?.title || '',
        files: editEventData?.files || [],
        eventData: editEventData?.eventData || [],
      });
    }
  }, [editEventData]);

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

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setIsLoading(true);

      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await compressImage(file);
          return new File([compressedFile], file.name, { type: compressedFile.type });
        })
      );

      setPreviewPhotoAva((prevPreviews) => [
        ...prevPreviews,
        ...compressedFiles.map((file) => URL.createObjectURL(file)),
      ]);

      setFormData((prevData) => ({
        ...prevData,
        files: [...prevData.files, ...compressedFiles],
      }));

      setIsLoading(false);
    }
  };

  const handleRemovePreviewPhotoAva = useCallback((indexToRemove) => {
    setShowNotification(false);  
  
    const fileToRemove = formData.files[indexToRemove];
    
    setRemovedFiles((prevRemovedFiles) => [...prevRemovedFiles, fileToRemove]);
  
    setPreviewPhotoAva((prevPreviews) => 
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: prevFormData.files.filter((_, index) => index !== indexToRemove),
    }));
  
    if (formData.files.length === 1) {
      setIsImageRemoved(true);
    }
  }, [formData.files]);

  
  const handleVideoChange = (index, newUrl) => {
    const videoUrl = newUrl.trim();
    setFormData((prevData) => {
      const updatedEventData = [...prevData.eventData];
      updatedEventData[index] = videoUrl; 
      return {
        ...prevData,
        eventData: updatedEventData,
      };
    });
  };


  const addNewVideoField = () => {
    setFormData((prevData) => ({
      ...prevData,
      eventData: [...prevData.eventData, ''],
    }));
  };  

  const handleRemoveVideoField = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      eventData: prevData.eventData.filter((_, index) => index !== indexToRemove),
    }));
  };
  

  const validateForm = useCallback(() => {
    let isValid = true;
    if (!formData.title && formData.files.length === 0 && formData.eventData.length > 0) {
      isValid = false;
    }
    setShowNotification(!isValid);
    return isValid;
  }, [formData]);

  const closeModalEvent = useCallback(() => {
    setIsModalOpenEvent(false);
  }, [setIsModalOpenEvent]);

  const handleDescriptionChange = (value) => {
    setShowNotification(false);  
    setFormData((prevData) => ({
      ...prevData,
      title: value,
    }));
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
  
      const isFormValid = validateForm();
      if (!isFormValid) {
        setShowNotification(true);
        return;
      }

      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);

      const videoUrlsJson = JSON.stringify(formData.eventData);
      dataToSend.append('videoUrls', videoUrlsJson);
  
      if (isImageRemoved) {
        dataToSend.append('removePhotoAva', 'true');
      }  
    
      if (formData.files.length > 0) {
        formData.files.forEach((file) => {
          dataToSend.append('files', file);
        });
      }
  
      if (removedFiles.length > 0) {
        dataToSend.append('removedFiles', JSON.stringify(removedFiles));
      }
  
      try {
        if (editEventData && editEventData.id) {
          await dispatch(editEvent({ id: editEventData.id, data: dataToSend })).unwrap();
        } else {
          await dispatch(postEventData(dataToSend)).unwrap();
        }
  
        await dispatch(fetchEvents());
        setFormData({
          title: '',
          files: [],
          eventData: [],
        });
  
        setShowNotification(false);
        setIsModalOpenEvent(false);
      } catch (error) {
        console.error('Произошла ошибка при отправке формы:', error);
      }
    },
    [validateForm, formData, removedFiles, isImageRemoved, dispatch, setIsModalOpenEvent, editEventData]
  );
  

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>Необходимо заполнить каждое поле❗</div>
      )}
      <div className={styles.form_container__title}>Редактирование слайда</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <div className={styles.form_container__block_gray_one} style={{paddingBottom: '2rem'}}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="title"
                name="title"
                id="title"
                value={formData.title}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                required
              />
              <label htmlFor="title" className={styles.form__label}>
                Название мероприятия
              </label>
            </div>
          </div>      
          
          <div className={styles.form_container__block_gray_one}>  
           <div className={`${styles.slider_container} ${styles.flex_block_gap}`}>
            <div className={styles.form_container__checkbox_block}>
              <div>Слайдер</div>
            </div>

            <div className={styles.preview_photos_container}>
              {formData.files.length > 0 &&
                previewPhotoAva.length === 0 &&
                formData.files.map((file, index) => (
                  <div key={index} className={styles.preview_photos_container__block}>
                    <img
                      className={styles.preview_photos_container__img}
                      src={`${Host}/images/eventAdd/${file}`}
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
             <div style={{ display: isPhotoAvaVisible ? 'inline-block' : 'none' }}>
              <label className={styles.slider_container__customFileUpload}>
                <input type="file" name="files" multiple onChange={handleFileChange} />
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
              {/* <div className={`${styles.slider_container} ${styles.flex_block_gap}`}>          
               <div className={styles.form_container__heading_block}>
                <input
                  type="input"
                  className={styles.form_container__heading_block_input}
                  placeholder="URL видео"
                  name="videos"
                  id="videos"
                  maxLength="300"
                  value={formData.eventData}
                  onChange={handleVideoChange}               
                />
                </div>
              </div> */}              


            </div>          
              {formData.eventData.map((url, index) => (
                <div key={index} className={styles.form_container__block_gray_one}>
                  <div className={styles.form_container__heading_block}>
                    <input
                      type="input"
                      className={styles.form_container__heading_block_input}
                      placeholder="ссылка на видеоролик"
                      name="videos"
                      id={`videos-${index}`}
                      maxLength="300"
                      value={url}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                    />                   
                      <div
                      className={styles.blockContainer__close_button}
                      onClick={() => handleRemoveVideoField(index)}
                    >               
                    </div>
                  </div>
                </div>
              ))}      
            <label
              className={styles.slider_container__customFileUpload}
              style={{ marginTop: '1rem', marginBottom: '2rem' }}
              onClick={addNewVideoField}
            >
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
                <div className={styles.slider_container__uploadTextForm}>Добавить URL</div>
              </label>
          </div>
          <div className={styles.form_container__button_block}>
            <button className={styles.form_container__button_save} type="submit"></button>
            <button className={styles.form_container__button_cancel} type="submit" onClick={closeModalEvent}></button>
          </div>
        </form>
      </div>
    </div>
  );
}
