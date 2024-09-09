// import React, { useState, useCallback, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import compressImageFile from 'browser-image-compression';
// import styles from './FormAddEvent.module.scss';
// // import { clearFormData, fetchProject } from '../../../store/Slice/projectSlice';
// import { removePreviewPhotoAva, changeHandler } from '../../add-project/formAdd/utils/formHelpers';
// import { postVacancyData, editSlide, fetchSlides } from '../../../store/Slice/vacancyEventSlice';

// const Host = process.env.REACT_APP_SERVER_HOST;

// export default function FormEditEvent({ setIsModalOpenMain, editSlideData }) {
//   const dispatch = useDispatch();

//   const [previewPhotos, setPreviewPhotos] = useState([]);
//   const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
//   const [previewPhotoOpen, setPreviewPhotoOpen] = useState([]);
//   const [previewPhotoClose, setPreviewPhotoClose] = useState([]);
//   const [isPhotoCloseVisible, setIsPhotoCloseVisible] = useState(true);
//   const [isPhotoOpenVisible, setIsPhotoOpenVisible] = useState(true);
//   const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
//   const [isDropPhotoVisible, setIsDropPhotoVisible] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showNotification, setShowNotification] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     photoAva: editSlideData?.photoAva || '',
//     card1: editSlideData?.card1 || { description: '', date: '' },
//     card2: editSlideData?.card2 || { description: '', date: '' },
//     card3: editSlideData?.card3 || { description: '', date: '' },
//   });

//   useEffect(() => {
//     if (editSlideData) {
//       setFormData({
//         photoAva: editSlideData.photoAva || '',
//         card1: {
//           description: editSlideData.cardData.card1?.description || '',
//           date: editSlideData.cardData.card1?.date ? new Date(editSlideData.cardData.card1.date) : '',
//         },
//         card2: {
//           description: editSlideData.cardData.card2?.description || '',
//           date: editSlideData.cardData.card2?.date ? new Date(editSlideData.cardData.card2.date) : '',
//         },
//         card3: {
//           description: editSlideData.cardData.card3?.description || '',
//           date: editSlideData.cardData.card3?.date ? new Date(editSlideData.cardData.card3.date) : '',
//         },
//       });
//     }
//   }, [editSlideData]);

//   const handleDescriptionChange = (cardKey, value) => {
//     if (value.length <= 150) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [cardKey]: { ...prevData[cardKey], description: value },
//       }));
//     }
//   };

//   const handleDateChange = (cardKey, date) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [cardKey]: { ...prevData[cardKey], date: date },
//     }));
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFormData((prevState) => ({
//         ...prevState,
//         photoAva: file, // Обновляем состояние новым файлом
//       }));

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewPhotoAva([reader.result]); // Обновляем превью
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemovePreviewPhotoAva = useCallback(
//     (index) => {
//       removePreviewPhotoAva(previewPhotoAva, setPreviewPhotoAva, index, formData, setFormData, setIsPhotoAvaVisible);
//     },
//     [previewPhotoAva, formData]
//   );

//   const validateForm = useCallback(() => {
//     let isValid = true;
//     let errors = [];

//     if (!isValid) {
//       setErrorMessage(`Пожалуйста, заполните следующие обязательные поля: ${errors.join(', ')}.`);
//     }

//     return isValid;
//   }, []);

//   const closeModal = useCallback(() => {
//     setIsModalOpenMain(false);
//   }, [setIsModalOpenMain]);

//   const submitHandler = useCallback(
//     async (e) => {
//       e.preventDefault();

//       const isFormValid = validateForm();

//       if (!isFormValid) {
//         console.error('Форма не прошла валидацию. Работа функции submitHandler прервана.');
//         return;
//       }

//       const dataToSend = new FormData();
//       dataToSend.append(
//         'details',
//         JSON.stringify({
//           card1: formData.card1,
//           card2: formData.card2,
//           card3: formData.card3,
//         })
//       );

//       if (formData.photoAva && formData.photoAva instanceof File) {
//         dataToSend.append('photoAva', formData.photoAva);
//       } else if (editSlideData && editSlideData.photoAva) {
//         dataToSend.append('photoAva', editSlideData.photoAva);
//       } else {
//         dataToSend.append('photoAva', '');
//       }

//       try {
//         if (editSlideData && editSlideData.id) {
//           await dispatch(editSlide({ id: editSlideData.id, data: dataToSend })).unwrap();
//         } else {
//           await dispatch(postVacancyData(dataToSend)).unwrap();
//         }

//         await dispatch(fetchSlides());
//         setPreviewPhotos([]);
//         setFormData({
//           photoAva: '',
//           card1: { description: '', date: null },
//           card2: { description: '', date: null },
//           card3: { description: '', date: null },
//         });

//         setErrorMessage('');
//         setIsModalOpenMain(false);
//       } catch (error) {
//         console.error('Произошла ошибка при отправке формы:', error);
//       }
//     },
//     [validateForm, formData, dispatch, setIsModalOpenMain, editSlideData]
//   );

//   const compressImage = useCallback(async (file) => {
//     const options = {
//       maxSizeMB: 4,
//       maxWidthOrHeight: 1920,
//       useWebWorker: true,
//     };

//     try {
//       return await compressImageFile(file, options);
//     } catch (error) {
//       console.error('Ошибка при сжатии изображения:', error);
//     }
//   }, []);

//   return (
//     <div className={styles.form_container}>
//       {showNotification && (
//         <div className={styles.form_container__notification}>
//           Заполните предыдущий блок или дождитесь загркузки изображений❗
//         </div>
//       )}
//       <div className={styles.form_container__title}>Редактирование слайда</div>
//       <div className={styles.form_container__block_form}>
//         <form className={styles.form_container__form} onSubmit={submitHandler}>
//           <div className={styles.form_container__titleCard}>Карточка 1</div>
//           <div className={styles.form_container__block_gray_one}>
//             <div className={styles.form_container__description_text}>
//               <div className={styles.form_container__textarea_length}>{`${formData.card1.description.length}/150`}</div>
//               <textarea
//                 className={styles.form_container__textarea}
//                 autoComplete="off"
//                 required
//                 name="descriptionCard1"
//                 id="descriptionCard1"
//                 cols="30"
//                 rows="10"
//                 placeholder="Не более 150 символов"
//                 value={formData.card1.description}
//                 onChange={(e) => handleDescriptionChange('card1', e.target.value)}></textarea>
//               <label htmlFor="descriptionCard1" className={styles.form_container__textarea_label_constructor}>
//                 Название конкурса
//               </label>
//             </div>
//           </div>
//           {/* <CalendarAdd date={formData.card1.date} setDate={(date) => handleDateChange('card1', date)} /> */}
//           <div className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}>
//             <div className={styles.form_container__checkbox_block}>
//               <div>Изображение</div>
//             </div>
//             <div style={{ display: isPhotoAvaVisible ? 'inline-block' : 'none' }}>
//               <label className={styles.slider_container__customFileUpload}>
//                 <input type="file" name="photoAva" onChange={handleFileChange} />
//                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <g id="Frame 4684">
//                     <path
//                       id="Vector"
//                       d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
//                       stroke="currentColor"
//                       strokeWidth="0.8"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </g>
//                 </svg>
//                 <div className={styles.slider_container__uploadTextForm}>Загрузить изображения</div>
//               </label>
//               {isLoading && <div className={styles.preview_photos_container__loading}>Загрузка . . .</div>}
//             </div>
//             <div>
//               {formData.photoAva !== null && previewPhotoAva.length === 0 && (
//                 <div className={styles.preview_photos_container__block}>
//                   <img
//                     className={styles.preview_photos_container__img}
//                     src={`${Host}/images/slideCard/${formData.photoAva}`}
//                     alt="Preview"
//                   />
//                   <div
//                     className={styles.preview_photos_container__remove_icon}
//                     onClick={() => handleRemovePreviewPhotoAva()}>
//                     <span></span>
//                   </div>
//                 </div>
//               )}
//               {previewPhotoAva?.map((preview, index) => (
//                 <div key={index} className={styles.preview_photos_container__block}>
//                   <img className={styles.preview_photos_container__img} src={preview} alt={`Preview ${index}`} />
//                   <div
//                     className={styles.preview_photos_container__remove_icon}
//                     onClick={() => handleRemovePreviewPhotoAva(index)}>
//                     <span></span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className={styles.form_container__titleCard}>Карточка 2</div>
//           <div className={styles.form_container__block_gray_one}>
//             <div className={styles.form_container__description_text}>
//               <div className={styles.form_container__textarea_length}>{`${formData.card2.description.length}/150`}</div>
//               <textarea
//                 className={styles.form_container__textarea}
//                 autoComplete="off"
//                 required
//                 name="descriptionCard2"
//                 id="descriptionCard2"
//                 cols="30"
//                 rows="10"
//                 placeholder="Не более 150 символов"
//                 value={formData.card2.description}
//                 onChange={(e) => handleDescriptionChange('card2', e.target.value)}></textarea>
//               <label htmlFor="descriptionCard2" className={styles.form_container__textarea_label_constructor}>
//                 Название конкурса
//               </label>
//             </div>
//           </div>
//           {/* <CalendarAdd date={formData.card2.date} setDate={(date) => handleDateChange('card2', date)} /> */}
//           <div className={styles.form_container__titleCard}>Карточка 3</div>
//           <div className={styles.form_container__block_gray_one}>
//             <div className={styles.form_container__description_text}>
//               <div className={styles.form_container__textarea_length}>{`${formData.card3.description.length}/150`}</div>
//               <textarea
//                 className={styles.form_container__textarea}
//                 autoComplete="off"
//                 required
//                 name="descriptionCard3"
//                 id="descriptionCard3"
//                 cols="30"
//                 rows="10"
//                 placeholder="Не более 150 символов"
//                 value={formData.card3.description}
//                 onChange={(e) => handleDescriptionChange('card3', e.target.value)}
//                 // value={inputData.descriptionCard3}
//                 // onChange={(event) => {
//                 //   const value = event.target.value;
//                 //   if (value.length <= 150) {
//                 //     setInputData({ ...inputData, descriptionCard3: value });
//                 //   }
//                 // }}
//               ></textarea>
//               <label htmlFor="descriptionCard3" className={styles.form_container__textarea_label_constructor}>
//                 Название конкурса
//               </label>
//             </div>
//           </div>
//           {/* <CalendarAdd date={formData.card3.date} setDate={(date) => handleDateChange('card3', date)} /> */}
//           <div className={styles.form_container__button_block}>
//             <button className={styles.form_container__button_save} type="submit"></button>
//             <button className={styles.form_container__button_cancel} type="submit" onClick={closeModal}></button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
