import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from '../../../Add/add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../Add/style/style-card.module.scss';

import PhotoNameBlock from './PhotoNameBlock';
import CategoryBlock from './CategoryBlock';
import DescriptionBlock from './DescriptionBlock';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

import { createStaffAsync, uploadStaffMarkdownFile, deleteStaffMarkdownFile } from '../../../store/Slice/StaffSliceNew';

import ConstructorSection from './ConstructorSection';
import ConstructorPage from '../constructor/ConstructorPage';

import { usePreviewHandlers } from '../utils/hooks/usePreviewHandlers';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose';
import {
  sharedHandleDynamicInputChange,
  sharedHandleDeletePreview,
  getPreviewClassName as sharedGetPreviewClassName,
} from '../utils/formShared';
import { validateDynamicBlocks } from '../utils/dynamicValidation';

const REQUIRED_BLOCK_IDS = ['imageWithCaption', 'quote', 'fact'];

export default function FormAddStaff({ initial = null, onClose, registerCloseGuard, currentCategory = null }) {
  const dispatch = useDispatch();

  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [, setIsPhotoAvaVisible] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [forceValidateTick, setForceValidateTick] = useState(0);

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
  const dynamicDataRef = useRef(dynamicData);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);
  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);
  if (registerCloseGuard) registerCloseGuard(() => setShowExitConfirm(true));

  useEffect(() => {
    dynamicDataRef.current = dynamicData;
  }, [dynamicData]);

  useEffect(() => {
    if (initial) {
      setInputData((p) => ({ ...p, ...initial }));
      if (initial.img) setPreviewPhotoAva([{ url: initial.img }]);
    }
  }, [initial]);

  useEffect(() => {
    if (currentCategory && (!Array.isArray(inputData.category) || !inputData.category.length)) {
      setInputData((p) => ({ ...p, category: [currentCategory] }));
    }
  }, [currentCategory, inputData.category]);

  const { handleRemovePreviewPhotoAva } = usePreviewHandlers({
    previewPhotoAva,
    setPreviewPhotoAva,
    previewPhotoOpen: [],
    setPreviewPhotoOpen: () => { },
    previewPhotoClose: [],
    setPreviewPhotoClose: () => { },
    inputData,
    setInputData,
    setIsDropPhotoVisible: () => { },
    setIsPhotoAvaVisible,
    setIsPhotoOpenVisible: () => { },
    setIsPhotoCloseVisible: () => { },
  });

  const changeBasic = useCallback((e) => {
    const { name, value } = e.target || {};
    setInputData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleDynamicInputChange = useCallback(async (blockIndex, inputIndex, value) => {
    await sharedHandleDynamicInputChange(
      blockIndex,
      inputIndex,
      value,
      dynamicDataRef.current,
      setDynamicData,
      setDynamicPreviews
    );
  }, []);

  const handleDeletePreview = useCallback((event, blockIndex, inputIndex, previewIndex) => {
    sharedHandleDeletePreview(event, blockIndex, inputIndex, previewIndex, setDynamicPreviews, setDynamicData);
  }, []);

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prev) => prev.filter((_, i) => i !== blockIndex));
    setBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
    setDynamicPreviews((prev) => prev.filter((_, i) => i !== blockIndex));
  }, []);

  const validateForAdding = useCallback(() => {
    const { ok, errors } = validateDynamicBlocks(dynamicData, dynamicPreviews, {
      requiredBlockIds: REQUIRED_BLOCK_IDS,
      checkMissingBlocks: false,
    });
    setFieldErrors(errors);
    return ok;
  }, [dynamicData, dynamicPreviews]);

  const validateForSubmit = useCallback(() => {
    const { ok, errors } = validateDynamicBlocks(dynamicData, dynamicPreviews, {
      requiredBlockIds: REQUIRED_BLOCK_IDS,
      checkMissingBlocks: false,
    });
    setFieldErrors(errors);
    return ok;
  }, [dynamicData, dynamicPreviews]);

  const handlerOpenConstructor = useCallback(() => setOpenConstructor((v) => !v), []);

  const handleClick = useCallback(
    (inputs, meta = {}) => {
      if (!validateForAdding()) {
        setShowNotification(true);
        setForceValidateTick((n) => n + 1);
        setTimeout(() => setShowNotification(false), 3500);
        return;
      }

      const key = Date.now().toString();
      const newBlock = (inputs || []).map((f, idx) => ({
        ...f,
        label: (f.label ?? '').trim() || (f.placeholder ?? '').trim() || undefined,
        placeholder: f.placeholder,
        key: `${key}_${f.type}_${idx}`,
        value: f.defaultValue ?? '',
        blockId: meta.blockId || null,
        blockRequired: !!meta.requiredBlock,
      }));

      setBlocks((prev) => [...prev, newBlock]);
      setDynamicData((prev) => [...prev, newBlock.map((x) => ({ ...x }))]);
      setDynamicPreviews((prev) => [...prev, new Array(newBlock.length).fill([])]);
    },
    [validateForAdding]
  );

  const getPreviewClassName = useCallback((label) => sharedGetPreviewClassName(label, styles), []);

  const submitHandler = useCallback(
    async (e) => {
      e?.preventDefault?.();

      const blocksOk = validateForSubmit();
      const photoOk = Boolean(inputData?.img) || (Array.isArray(previewPhotoAva) && previewPhotoAva.length > 0);

      const topOk =
        photoOk &&
        Boolean(String(inputData.name || '').trim()) &&
        Array.isArray(inputData.category) &&
        inputData.category.length > 0 &&
        Boolean(String(inputData.description || '').trim());

      if (!blocksOk || !topOk) {
        setShowNotification(true);
        setForceValidateTick((n) => n + 1);
        setTimeout(() => setShowNotification(false), 3500);
        return;
      }

      const form = new FormData();
      const meta = {
        ...inputData,
        category: Array.isArray(inputData.category) ? inputData.category : [inputData.category],
        dynamicBlocks: (dynamicData || []).map((block) =>
          (block || []).map((inp) => {
            const copy = { ...inp };
            const v = copy.value;
            if (Array.isArray(v)) copy.value = v.map((vv) => (vv instanceof File ? vv.name : vv));
            else if (v instanceof File) copy.value = v.name;
            return copy;
          })
        ),
      };

      form.append('meta', JSON.stringify(meta));
      if (inputData.img instanceof File) {
        form.append('photoAva', inputData.img, inputData.img.name);
      }

      for (let b = 0; b < dynamicData.length; b++) {
        const block = dynamicData[b] || [];
        for (let i = 0; i < block.length; i++) {
          const inp = block[i];
          if (inp?.type !== 'file') continue;
          const val = inp?.value;
          if (Array.isArray(val)) {
            for (let k = 0; k < val.length; k++) {
              const v = val[k];
              if (v instanceof File) form.append(`dynamic_block_${b}_input_${i}[]`, v, v.name);
            }
          } else if (val instanceof File) {
            form.append(`dynamic_block_${b}_input_${i}`, val, val.name);
          }
        }
      }

      try {
        await dispatch(createStaffAsync(form));
        onClose?.();
      } catch (err) {
        console.error('createStaff failed', err);
      }
    },
    [dispatch, inputData, dynamicData, onClose, previewPhotoAva, validateForSubmit]
  );

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>Заполните открытый блок либо закройте блок!</div>
      )}

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
        <form className={styles.form_container__form} onSubmit={submitHandler} noValidate>
          <PhotoNameBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            previewPhotoAva={previewPhotoAva}
            setPreviewPhotoAva={setPreviewPhotoAva}
            handleRemovePreviewPhotoAva={handleRemovePreviewPhotoAva}
            changeHandler={changeBasic}
            forceValidate={forceValidateTick}
          />

          <CategoryBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            setIsFocused={() => { }}
            currentCategory={currentCategory}
            isEditing={!!initial}
          />

          <DescriptionBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            forceValidate={forceValidateTick}
          />

          <ConstructorSection
            styles={styles}
            blocks={blocks}
            openConstructor={openConstructor}
            handlerOpenConstructor={handlerOpenConstructor}
            ConstructorPage={ConstructorPage}
            handleClick={handleClick}
            getPreviewClassName={getPreviewClassName}
            dynamicData={dynamicData}
            dynamicPreviews={dynamicPreviews}
            handleDynamicInputChange={handleDynamicInputChange}
            handleDeletePreview={handleDeletePreview}
            setDynamicPreviews={setDynamicPreviews}
            handleRemoveBlock={handleRemoveBlock}
            mdUpload={(file) => dispatch(uploadStaffMarkdownFile(file)).unwrap()}
            mdDelete={(url) => dispatch(deleteStaffMarkdownFile(url)).unwrap()}
            fieldErrors={fieldErrors}
            forceValidate={forceValidateTick}
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
