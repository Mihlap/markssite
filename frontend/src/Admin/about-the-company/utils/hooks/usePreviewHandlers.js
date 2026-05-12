import { useCallback, useEffect, useRef } from 'react';
import {
  removePreviewPhoto,
  removePreviewPhotoAva,
  removePreviewPhotoOpen,
  removePreviewPhotoClose,
} from '../formHelpers';

export function usePreviewHandlers(options) {
  const {
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
  } = options;
 
  const photosRef = useRef(previewPhotos);
  const avaRef = useRef(previewPhotoAva);
  const openRef = useRef(previewPhotoOpen);
  const closeRef = useRef(previewPhotoClose);
  const dataRef = useRef(inputData);

  useEffect(() => {
    photosRef.current = previewPhotos;
  }, [previewPhotos]);
  useEffect(() => {
    avaRef.current = previewPhotoAva;
  }, [previewPhotoAva]);
  useEffect(() => {
    openRef.current = previewPhotoOpen;
  }, [previewPhotoOpen]);
  useEffect(() => {
    closeRef.current = previewPhotoClose;
  }, [previewPhotoClose]);
  useEffect(() => {
    dataRef.current = inputData;
  }, [inputData]);

  const handleRemovePreviewPhoto = useCallback(
    (idx) => {
      removePreviewPhoto(
        photosRef.current,
        setPreviewPhotos,
        idx,
        dataRef.current,
        setInputData,
        setIsDropPhotoVisible
      );
    },
    [setPreviewPhotos, setInputData, setIsDropPhotoVisible]
  );

  const handleRemovePreviewPhotoAva = useCallback(
    (idx) => {
      removePreviewPhotoAva(
        avaRef.current,
        setPreviewPhotoAva,
        idx,
        dataRef.current,
        setInputData,
        setIsPhotoAvaVisible
      );
    },
    [setPreviewPhotoAva, setInputData, setIsPhotoAvaVisible]
  );

  const handleRemovePreviewPhotoOpen = useCallback(
    (idx) => {
      removePreviewPhotoOpen(
        openRef.current,
        setPreviewPhotoOpen,
        idx,
        dataRef.current,
        setInputData,
        setIsPhotoOpenVisible
      );     
      setInputData((prev) => ({ ...prev, imageOpen: '' }));
    },
    [setPreviewPhotoOpen, setInputData, setIsPhotoOpenVisible]
  );

  const handleRemovePreviewPhotoClose = useCallback(
    (idx) => {
      removePreviewPhotoClose(
        closeRef.current,
        setPreviewPhotoClose,
        idx,
        dataRef.current,
        setInputData,
        setIsPhotoCloseVisible
      );     
      setInputData((prev) => ({ ...prev, imageClose: '' }));
    },
    [setPreviewPhotoClose, setInputData, setIsPhotoCloseVisible]
  );

  return {
    handleRemovePreviewPhoto,
    handleRemovePreviewPhotoAva,
    handleRemovePreviewPhotoOpen,
    handleRemovePreviewPhotoClose,
  };
}
