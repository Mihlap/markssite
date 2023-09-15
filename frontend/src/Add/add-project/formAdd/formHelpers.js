
// formHelpers.js
export const removePreviewPhoto = (
  previewPhotos,
  setPreviewPhotos,
  index,
  inputData,
  setInputData,
  setIsDropPhotoVisible
) => {
  const updatedPreviewPhotos = [...previewPhotos];
  updatedPreviewPhotos.splice(index, 1);
  setPreviewPhotos(updatedPreviewPhotos);
  setIsDropPhotoVisible(true);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotos = [...inputData.dropPhoto];
  updatedDropPhotos.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    dropPhoto: updatedDropPhotos,
  }));

  // Обновление стиля поля ввода файлов
};

export const removePreviewPhotoAva = (
  previewPhotoAva,
  setPreviewPhotoAva,
  index,
  inputData,
  setInputData,
  setIsPhotoAvaVisible
) => {
  const updatedPreviewPhotosAva = [...previewPhotoAva];
  updatedPreviewPhotosAva.splice(index, 1);
  setPreviewPhotoAva(updatedPreviewPhotosAva);
  setIsPhotoAvaVisible(true);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotosAva = [...inputData.photoAva];
  updatedDropPhotosAva.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    photoAva: updatedDropPhotosAva,
  }));

  // Обновление стиля поля ввода файлов
};

export const removePreviewPhotoOpen = (
  previewPhotoOpen,
  setPreviewPhotoOpen,
  index,
  inputData,
  setInputData,
  setIsPhotoOpenVisible
) => {
  const updatedPreviewPhotosOpen = [...previewPhotoOpen];
  updatedPreviewPhotosOpen.splice(index, 1);
  setPreviewPhotoOpen(updatedPreviewPhotosOpen);
  setIsPhotoOpenVisible(true);

  const updatedDropPhotoOpen = Array.from(inputData.imageOpen);
  updatedDropPhotoOpen.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    imageOpen: updatedDropPhotoOpen,
  }));
};

export const removePreviewPhotoClose = (
  previewPhotoClose,
  setPreviewPhotoClose,
  index,
  inputData,
  setInputData,
  setIsPhotoCloseVisible
) => {
  const updatedPreviewPhotosOpen = [...previewPhotoClose];
  updatedPreviewPhotosOpen.splice(index, 1);
  setPreviewPhotoClose(updatedPreviewPhotosOpen);
  setIsPhotoCloseVisible(true);

  const updatedDropPhotoClose = Array.from(inputData.imageOpen);
  updatedDropPhotoClose.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    imageOpen: updatedDropPhotoClose,
  }));
};

 // функция сборщика, тут у нас запускаются if-else на превью фото для картинок
// функция сборщика, тут у нас запускаются if-else на превью фото для картинок
// export function changeHandler(
//   event,
//   inputData,
//   setInputData,
//   setPreviewPhotos,
//   setIsDropPhotoVisible,
//   setPreviewPhotoAva,
//   setIsPhotoAvaVisible,
//   setPreviewPhotoOpen,
//   setIsPhotoOpenVisible,
//   setPreviewPhotoClose,
//   setIsPhotoCloseVisible
// ) {
//   if (event.target.files) {
//     if (event.target.name === "dropPhoto") {
//       const filesArray = Array.from(event.target.files);
//       setInputData((prev) => ({
//         ...prev,
//         dropPhoto: filesArray,
//       }));
//       setIsDropPhotoVisible(false);

//       const previewArray = filesArray.map((file) => URL.createObjectURL(file));
//       setPreviewPhotos(previewArray);

//       event.target.style.display = "none";
//     } else if (event.target.name === "photoAva") {
//       const filesArrayAva =
//         event.target.files.length > 0 ? event.target.files : null;
//       setInputData((prev) => ({
//         ...prev,
//         photoAva: filesArrayAva,
//       }));
//       setIsPhotoAvaVisible(false);
//       const previewArray = Array.from(filesArrayAva).map((file) =>
//         URL.createObjectURL(file)
//       );
//       setPreviewPhotoAva(previewArray);

//       event.target.style.display = "none";
//     } else if (event.target.name === "imageOpen") {
//       const filesArrayOpen =
//         event.target.files.length > 0 ? event.target.files : null;
//       setInputData((prev) => ({
//         ...prev,
//         imageOpen: filesArrayOpen,
//       }));
//       setIsPhotoOpenVisible(false);
//       const previewArray = Array.from(filesArrayOpen).map((file) =>
//         URL.createObjectURL(file)
//       );
//       setPreviewPhotoOpen(previewArray);

//       event.target.style.display = "none";
//     }  else if (event.target.name === "imageClose") {
//       const filesArrayOpen =
//         event.target.files.length > 0 ? event.target.files : null;
//       setInputData((prev) => ({
//         ...prev,
//         imageClose: filesArrayOpen,
//       }));
//       setIsPhotoCloseVisible(false);
//       const previewArray = Array.from(filesArrayOpen).map((file) =>
//         URL.createObjectURL(file)
//       );
//       setPreviewPhotoClose(previewArray);

//       event.target.style.display = "none";
//     }
//   } else {
//     setInputData((prev) => ({
//       ...prev,
//       [event.target.name]: event.target.value,
//     }));
//   }
// }


function generateUniqueName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000); // 4-значное число
  const fileExtension = originalName.split(".").pop();
  const sliceOfOriginalName = originalName.slice(0, 5); // первые 5 символов исходного имени

  return `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;
}

export function changeHandler(
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
) {
  if (event.target.files) {
    const originalFiles = Array.from(event.target.files);

    let newFiles = originalFiles.map((originalFile) => {
      const uniqueName = generateUniqueName(originalFile.name);
      return new File([originalFile], uniqueName, { type: originalFile.type });
    });

    switch (event.target.name) {
      case "dropPhoto":
        setInputData((prev) => ({
          ...prev,
          dropPhoto: newFiles,
        }));
        setIsDropPhotoVisible(false);
        setPreviewPhotos(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      case "photoAva":
        setInputData((prev) => ({
          ...prev,
          photoAva: newFiles,
        }));
        setIsPhotoAvaVisible(false);
        setPreviewPhotoAva(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      case "imageOpen":
        setInputData((prev) => ({
          ...prev,
          imageOpen: newFiles,
        }));
        setIsPhotoOpenVisible(false);
        setPreviewPhotoOpen(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      case "imageClose":
        setInputData((prev) => ({
          ...prev,
          imageClose: newFiles,
        }));
        setIsPhotoCloseVisible(false);
        setPreviewPhotoClose(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      default:
        console.error("Unrecognized input name:", event.target.name);
        break;
    }

    event.target.style.display = "none";
  } else {
    setInputData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
}
