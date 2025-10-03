import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import compressImageFile from 'browser-image-compression';

import styles from '../../../Add/add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../Add/style/style-card.module.scss';

import PhotoNameBlock from './PhotoNameBlock';
import CategoryBlock from './CategoryBlock';
import DescriptionBlock from './DescriptionBlock';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

import { usePreviewHandlers } from '../utils/hooks/usePreviewHandlers';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose';

import { createStaffAsync } from '../../../store/Slice/StaffSliceNew';

import ConstructorSection from './ConstructorSection';
import ConstructorPage from '../constructor/ConstructorPage';

const compressOptions = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
};

async function maybeCompressFile(file) {
  try {
    if (!file || !file.type?.startsWith?.('image/')) return file;
    const compressed = await compressImageFile(file, compressOptions);
    return compressed instanceof File ? compressed : new File([compressed], file.name, { type: file.type });
  } catch (err) {
    console.warn('compress fail, using original file', err);
    return file;
  }
}

export default function FormAddStaff({ initial = null, onClose, registerCloseGuard, currentCategory = null }) {
  const dispatch = useDispatch();

  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [inputData, setInputData] = useState({
    name: '',
    position: '',
    category: [],
    description: '',
    img: null,
    isVisible: true,
  });

  const [openConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);
  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

  if (registerCloseGuard) registerCloseGuard(() => setShowExitConfirm(true));

  useEffect(() => {
    if (initial) {
      setInputData((p) => ({ ...p, ...initial }));
      if (initial.img) setPreviewPhotoAva([{ url: initial.img }]);
    }
  }, [initial]);

  const { handleRemovePreviewPhotoAva } = usePreviewHandlers({
    previewPhotoAva,
    setPreviewPhotoAva,
    previewPhotoOpen: [],
    setPreviewPhotoOpen: () => {},
    previewPhotoClose: [],
    setPreviewPhotoClose: () => {},
    inputData,
    setInputData,
    setIsDropPhotoVisible: () => {},
    setIsPhotoAvaVisible,
    setIsPhotoOpenVisible: () => {},
    setIsPhotoCloseVisible: () => {},
  });

  const validate = useCallback(() => {
    if (!inputData.name || !inputData.category || inputData.category.length === 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3500);
      return false;
    }
    return true;
  }, [inputData]);

  const areAllBlocksFilled = useCallback(() => {
    for (let block of dynamicData) {
      for (let input of block) {
        if (input.required && (input.value === undefined || input.value === null || input.value === '')) {
          return false;
        }
      }
    }
    return true;
  }, [dynamicData]);

  const submitHandler = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!validate()) return;

      const form = new FormData();

      const metadata = {
        ...inputData,
        category: Array.isArray(inputData.category) ? inputData.category : [inputData.category],
        dynamicBlocks: dynamicData.map((block) =>
          block.map((inp) => {
            const copy = { ...inp };
            if (Array.isArray(copy.value)) {
              copy.value = copy.value.map((v) => (v instanceof File ? v.name : v));
            } else if (copy.value instanceof File) {
              copy.value = copy.value.name;
            }
            return copy;
          })
        ),
      };

      form.append('meta', JSON.stringify(metadata));
   
      if (inputData.img instanceof File) {
        const compressed = await maybeCompressFile(inputData.img);
        form.append('photoAva', compressed, compressed.name);
      }
     
      for (let b = 0; b < dynamicData.length; b++) {
        const block = dynamicData[b] || [];
        for (let i = 0; i < block.length; i++) {
          const inp = block[i];
          const val = inp?.value;
          if (Array.isArray(val)) {
            for (let k = 0; k < val.length; k++) {
              const v = val[k];
              if (v instanceof File) {
                const compressed = await maybeCompressFile(v);
                form.append(`dynamic_block_${b}_input_${i}[]`, compressed, compressed.name);
              }
            }
          } else if (val instanceof File) {
            const compressed = await maybeCompressFile(val);
            form.append(`dynamic_block_${b}_input_${i}`, compressed, compressed.name);
          }
        }
      }

      try {     
        await dispatch(createStaffAsync(form));
        onClose?.();
      } catch (err) {
        console.error('submit error', err);
      }
    },
    [dispatch, inputData, dynamicData, onClose, validate]
  );


  const handlerOpenConstructor = useCallback(() => {
    setOpenConstructor((prev) => !prev);
  }, []);

  const handleClick = useCallback(
    (inputs, _blockType) => {
      if (!areAllBlocksFilled()) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3500);
        return;
      }
      const blockKey = Date.now().toString();
      const newInputs = inputs.map((input) => ({
        ...input,
        key: blockKey + '_' + input.type,
        value: input.defaultValue ?? '',
      }));
      setBlocks((prev) => [...prev, newInputs]);
      setDynamicData((prev) => [...prev, newInputs.map((ni) => ({ ...ni }))]);
      setDynamicPreviews((prev) => [...prev, new Array(newInputs.length).fill([])]);    
    },
    [areAllBlocksFilled]
  );

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prev) => prev.filter((_, i) => i !== blockIndex));
    setBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
    setDynamicPreviews((prev) => prev.filter((_, i) => i !== blockIndex));
  }, []);

  const handleDynamicInputChange = useCallback(async (blockIndex, inputIndex, value) => { 
    if (Array.isArray(value) && value[0] instanceof File) {
      const compressedFiles = await Promise.all(value.map((f) => maybeCompressFile(f)));
      const previews = compressedFiles.map((f) => URL.createObjectURL(f));

      setDynamicPreviews((prev) => {
        const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
        if (!next[blockIndex]) next[blockIndex] = [];
        next[blockIndex][inputIndex] = previews;
        return next;
      });

      setDynamicData((prev) => {
        const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
        if (!next[blockIndex]) next[blockIndex] = [];
        next[blockIndex][inputIndex] = { ...(next[blockIndex][inputIndex] || {}), value: compressedFiles };
        return next;
      });
      return;
    }

    if (value instanceof File) {
      const compressed = await maybeCompressFile(value);
      const preview = URL.createObjectURL(compressed);

      setDynamicPreviews((prev) => {
        const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
        if (!next[blockIndex]) next[blockIndex] = [];
        next[blockIndex][inputIndex] = [preview];
        return next;
      });

      setDynamicData((prev) => {
        const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
        if (!next[blockIndex]) next[blockIndex] = [];
        next[blockIndex][inputIndex] = { ...(next[blockIndex][inputIndex] || {}), value: compressed };
        return next;
      });
      return;
    }

    setDynamicData((prev) => {
      const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
      if (!next[blockIndex]) next[blockIndex] = [];
      next[blockIndex][inputIndex] = { ...(next[blockIndex][inputIndex] || {}), value };
      return next;
    });
  }, []);

  const handleDeletePreview = useCallback((event, blockIndex, inputIndex, previewIndex) => {
    event?.stopPropagation?.(); 
    setDynamicPreviews((prev) => {
      const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
      if (!next[blockIndex] || !next[blockIndex][inputIndex]) return prev;
      next[blockIndex][inputIndex] = next[blockIndex][inputIndex].filter((_, i) => i !== previewIndex);
      return next;
    });
    setDynamicData((prev) => {
      const next = prev.map((b) => (Array.isArray(b) ? b.slice() : []));
      if (!next[blockIndex] || !next[blockIndex][inputIndex]) return prev;
      const val = next[blockIndex][inputIndex].value;
      if (Array.isArray(val)) {
        next[blockIndex][inputIndex] = {
          ...next[blockIndex][inputIndex],
          value: val.filter((_, i) => i !== previewIndex),
        };
      } else if (val instanceof File && previewIndex === 0) {
        next[blockIndex][inputIndex] = { ...next[blockIndex][inputIndex], value: '' };
      }
      return next;
    });
  }, []);

  const getPreviewClassName = useCallback((label) => {
    if (!label) return { outerDiv: styles.previewContainer, innerDiv: styles.previewItem };
    const l = label.toLowerCase();
    if (l.includes('видеоролик') || l.includes('видео')) {
      return { outerDiv: styles.videoPreview, innerDiv: styles.videoInnerDiv, verticalImgTwo: styles.videoStyle };
    }
    if (l.includes('слайдер')) {
      return { outerDiv: styles.sliderPreview, innerDiv: styles.sliderPreviewDiv };
    }
    if (l.includes('2е вертикальные') || l.includes('вертикальные')) {
      return {
        outerDiv: styles.verticallyBlock,
        innerDiv: styles.previewWerticallyBlock,
        verticalImgTwo: styles.verticalTwoImg,
      };
    }
    if (l.includes('картинка с описанием')) {
      return { outerDiv: styles.imgWithDescriptionPreview, innerDiv: styles.someInnerDivStyle };
    }
    return { outerDiv: styles.previewContainer, innerDiv: styles.previewItem };
  }, []);

  const setIsFocused = () => {};

  return (
    <div className={styles.form_container}>
      {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля!</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.form_container__title}>Новый сотрудник</div>

        <button
          type="button"
          className={adminStyles.card_components_admin__close_button}
          onClick={() => setShowExitConfirm(true)}
          aria-label="Закрыть"
        />
      </div>

      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <PhotoNameBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            previewPhotoAva={previewPhotoAva}
            setPreviewPhotoAva={setPreviewPhotoAva}
            handleRemovePreviewPhotoAva={handleRemovePreviewPhotoAva}
            changeHandler={(e) => setInputData((p) => ({ ...p, [e.target.name]: e.target.value }))}
          />

          <CategoryBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            setIsFocused={setIsFocused}
            currentCategory={currentCategory}
            isEditing={!!initial}
          />

          <DescriptionBlock styles={styles} inputData={inputData} setInputData={setInputData} />

          <ConstructorSection
            styles={styles}
            blocks={blocks}
            dynamicData={dynamicData}
            setDynamicData={setDynamicData}
            openConstructor={openConstructor}
            setDynamicPreviews={setDynamicPreviews}
            setInputValue={setInputValue}
            dynamicPreviews={dynamicPreviews}
            handleRemoveBlock={handleRemoveBlock}
            handlerOpenConstructor={handlerOpenConstructor}
            getPreviewClassName={getPreviewClassName}
            handleDynamicInputChange={handleDynamicInputChange}
            handleDeletePreview={handleDeletePreview}
            handleClick={handleClick}
            ConstructorPage={ConstructorPage}
          />

          <SubmitButtons
            classNames={{
              wrapper: styles.form_container__button_block,
              save: styles.form_container__button_save,
              cancel: styles.form_container__button_cancel,
            }}
            onCancel={() => setShowExitConfirm(true)}
          />
        </form>

        <ExitConfirmModal
          open={showExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
          onLeave={() => onClose && onClose()}
        />
      </div>
    </div>
  );
}
