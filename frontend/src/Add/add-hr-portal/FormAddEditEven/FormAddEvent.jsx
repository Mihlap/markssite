import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import compressImageFile from 'browser-image-compression';
import styles from './FormAddEvent.module.scss';
import { postEventData, resetEventsState } from '../../../store/Slice/vacancyEventSlice';

export default function FormAddEvent({ setIsModalOpenEvent }) {
  const dispatch = useDispatch();

  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [previewVideoAva, setPreviewVideoAva] = useState([]);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(true); 
  const [isImagesActive, setIsImagesActive] = useState(true); 
  const [videoUrl, setVideoUrl] = useState('');
  const [inputData, setInputData] = useState({
    title: '',
    files: [],
    videos: [],
    eventData: '',
  });

  const validateForm = useCallback(() => {
    const isValid = (inputData.title && inputData.files.length > 0) || (inputData.title && inputData.videos.length > 0);
    // inputData.eventData

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
      console.error('Ошибка при сжатии изображения:', error);
      return file;
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
    
      setInputData((prevData) => ({
        ...prevData,
        files: [...(prevData.files || []), ...compressedFiles], 
      }));

      setIsLoading(false);
      setIsImagesActive(true); 
      setIsVideoActive(false)
    }
  };

  const handleVideoChange = (event) => {
    const videoFiles = Array.from(event.target.files);
    if (videoFiles.length > 0) {
      setPreviewVideoAva((prevPreviews) => [
        ...prevPreviews,
        ...videoFiles.map((file) => URL.createObjectURL(file)),
      ]);

      setInputData((prevData) => ({
        ...prevData,
        videos: [...(prevData.videos || []), ...videoFiles],
      }));
  
      setIsVideoActive(true);
      setIsImagesActive(false);
    }
  };

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const addVideoUrl = () => {
    if (videoUrl) {
      setInputData((prevData) => ({
        ...prevData,
        videos: [...(prevData.videos || []), videoUrl],
      }));
      setPreviewVideoAva((prevPreviews) => [...prevPreviews, videoUrl]);
      setVideoUrl('');
    }
  };
  

  const handleDescriptionChange = (value) => {
    setInputData((prevData) => ({
      ...prevData,
      title: value,
      // eventData: value,
    }));
    if (isSubmitted) {
      setShowNotification(!validateForm());
    }
  };

  const handleRemovePreviewPhotoAva = useCallback(
    (index) => {
      const updatedPreviews = previewPhotoAva.filter((_, i) => i !== index);
      setPreviewPhotoAva(updatedPreviews);
  
     const updatedFiles = inputData.files.filter((_, i) => i !== index);
      setInputData((prevData) => ({
        ...prevData,
        files: updatedFiles,
      }));
  
      if (updatedFiles.length === 0) {
        setIsPhotoAvaVisible(false); 
        setIsVideoActive(true);
      }
    },
    [previewPhotoAva, inputData.files]
  );

  const handleRemovePreviewVideo = useCallback((index) => {
    const updatedVideos = previewVideoAva.filter((_, i) => i !== index);
    setPreviewVideoAva(updatedVideos);

    const updatedVideoFiles = inputData.videos.filter((_, i) => i !== index);
    setInputData((prevData) => ({
      ...prevData,
      videos: updatedVideoFiles,
    }));
    
    if (updatedVideoFiles.length === 0) {
      setIsVideoActive(false);
      setIsImagesActive(true);
    }
  }, [previewVideoAva, inputData.videos]);
  
  
  

  const closeModal = useCallback(() => {
    setInputData({
      title: '',
      files: [],
      videos: [],
      eventData: '',
    });
    setPreviewPhotoAva([]);
    setPreviewVideoAva([]);
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
      formData.append('title', inputData.title);
      formData.append(
        'details',
        JSON.stringify({
          eventData: inputData.eventData,
        })
      );

      if (inputData.files && inputData.files.length > 0) {
        inputData.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      if (inputData.videos && inputData.videos.length > 0) {
        inputData.videos.forEach((video) => {
          if (typeof video === 'string') {
            formData.append('videoUrls[]', video); 
          } else {
            formData.append('videos', video); 
          }
        });
      }

      try {
        await dispatch(postEventData(formData)).unwrap();
        dispatch(resetEventsState());
        setInputData({
          title: '',
          files: [],
          videos: [],
          eventData: '',
          hidden: '',
          order: '',
        });

        setShowNotification(false);
        setIsModalOpenEvent(false);
      } catch (error) {
        console.error('Произошла ошибка при отправке формы:', error);
      }
    },
    [validateForm, inputData, dispatch, setIsModalOpenEvent]
  );

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>Необходимо заполнить каждое поле❗</div>
      )}
      <div className={styles.form_container__title}>Новое мероприятие</div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <div className={styles.form_container__block_gray_one}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="title"
                name="title"
                id="title"
                value={inputData.title}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                maxLength={30}
                required
              />
              <label htmlFor="title" className={styles.form__label}>
                Название мероприятия
              </label>
            </div>
          </div>
          
          <div className={`${styles.form_container__block_gray_one} ${!isImagesActive ? styles.disabled : ''}`}>
           <div className={`${styles.slider_container} ${styles.flex_block_gap}`}>
            <div className={styles.form_container__checkbox_block}>
              <div>Слайдер</div>
            </div>
            <div style={{ display: isPhotoAvaVisible ? 'inline-block' : 'none' }}>
              <label 
              className={styles.slider_container__customFileUpload}
               style={{marginTop: 0 }}
              >
                <input type="file" name="files" disabled={!isImagesActive} multiple onChange={handleFileChange} />
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
            <div className={styles.preview_photos_container}>
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
          </div>

          <div className={`${styles.form_container__block_gray_one} ${!isVideoActive ? styles.disabled : ''}`}>
           <div className={`${styles.slider_container} ${styles.flex_block_gap}`}>
            <div className={styles.form_container__checkbox_block}>
              <div>Слайдер</div>
            </div>
            <div className={styles.form_container__heading_block}>
              <input
                type="input"
                className={styles.form_container__heading_block_input}
                placeholder="URL видео"
                name="videos"
                id="videos"
                maxLength="300"
                value={videoUrl}
                onChange={handleVideoUrlChange}
                disabled={!isVideoActive}                
              />           
            </div>
            <div style={{ display: isPhotoAvaVisible ? 'inline-block' : 'none' }}>
              <label 
              className={styles.slider_container__customFileUpload}
               style={{marginTop: '0.5rem' }}
              >
                <input type="file" name="videos" multiple onChange={handleVideoChange} />
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

                <div className={styles.slider_container__uploadTextForm}>Загрузить видео с компьютера</div>
              </label>
              {isLoading && <div className={styles.preview_photos_container__loading}>Загрузка . . .</div>}
            </div>
            <div className={styles.preview_photos_container}>
              {previewVideoAva?.map((preview, index) => (
                <div key={index} className={styles.preview_photos_container__block}>
                  <video className={styles.preview_photos_container__img} controls>
                    <source src={preview} type="video/mp4" />
                  </video>
                  <div
                    className={styles.preview_photos_container__remove_icon}
                    onClick={() => handleRemovePreviewVideo(index)}>
                    <span></span>
                  </div>
                </div>
              ))}
            </div>
           </div>             
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
