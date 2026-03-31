import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from '../../../add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../style/style-card.module.scss';

import SubmitButtons from '../../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../../UI/ExitConfirmModal/ExitConfirmModal';

import {
  createHistoryItem,
  fetchCompanyHistory,
  uploadHistoryMarkdownFile,
  deleteHistoryMarkdownFile,
} from '../../../../store/Slice/companyHistorySlice';

import ConstructorSection from '../../FormAddEditStaff/ConstructorSection';
import ConstructorPageBase from '../../constructor/ConstructorPage';
import HistoryHeaderBlock from './HistoryHeaderBlock';
import useInterceptExternalClose from '../../../hooks/useInterceptExternalClose';
import {
  sharedHandleDynamicInputChange,
  sharedHandleDeletePreview,
  getPreviewClassName as sharedGetPreviewClassName,
} from '../../utils/formShared';
import { validateDynamicBlocks } from '../../utils/dynamicValidation';

const ConstructorPage = (props) => <ConstructorPageBase {...props} isHistoryForm={true} />;

const REQUIRED_BLOCK_IDS = ['imageWithCaption', 'quote', 'fact', 'personOfYear', 'personWithName'];

export default function FormAddHistory({ initial = null, onClose, registerCloseGuard }) {
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({
    year: '',
    title: '',
    description: '',
    previewText: '',
    previewImageUrl: '',
    previewImageFile: null,
    img: '',
    hidden: false,
  });

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [forceValidateTick, setForceValidateTick] = useState(0);

  const [openConstructor, setOpenConstructor] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);
  const dynamicDataRef = useRef(dynamicData);

  useEffect(() => {
    dynamicDataRef.current = dynamicData;
  }, [dynamicData]);

  useEffect(() => {
    if (initial) {
      setInputData((p) => ({
        ...p,
        year: initial.year ?? '',
        title: initial.title ?? '',
        description: initial.description ?? '',
        previewText: initial.previewText ?? '',
        previewImageUrl: initial.previewImageUrl ?? initial.img ?? '',
        previewImageFile: null,
        img: initial.img ?? '',
        hidden: !!initial.hidden,
      }));
      if (Array.isArray(initial.dynamicBlocks) && initial.dynamicBlocks.length) {
        setBlocks(initial.dynamicBlocks.map((b) => b.map((x) => ({ ...x }))));
        setDynamicData(initial.dynamicBlocks.map((b) => b.map((x) => ({ ...x }))));
        setDynamicPreviews(initial.dynamicBlocks.map((b) => new Array(b.length).fill([])));
      }
    }
  }, [initial]);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);
  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);
  if (registerCloseGuard) registerCloseGuard(() => setShowExitConfirm(true));

  const changeBasic = useCallback((e) => {
    const { name, value, type, checked } = e.target || {};
    setInputData((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const validateTopFields = useCallback(() => {
    const errors = {};
    const yearNum = Number(inputData.year);
    const previewPlainText = (inputData.previewText || '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    if (!inputData.year || Number.isNaN(yearNum)) {
      errors.year = 'Обязательно для заполнения';
    }
    if (!inputData.title || !String(inputData.title).trim()) {
      errors.title = 'Обязательно для заполнения';
    }
    if (!inputData.previewImageUrl && !inputData.previewImageFile) {
      errors.img = 'Обязательно для загрузки';
    }
    if (!previewPlainText || previewPlainText.length === 0) {
      errors.previewText = 'Обязательно для заполнения';
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  }, [inputData]);

  const validateForAdding = useCallback(() => {
    const { ok, errors } = validateDynamicBlocks(dynamicDataRef.current, dynamicPreviews, {
      requiredBlockIds: REQUIRED_BLOCK_IDS,
      checkMissingBlocks: false,
    });
    setFieldErrors(errors);
    return ok;
  }, [dynamicPreviews]);

  const validateForSubmit = useCallback(() => {
    const { ok, errors } = validateDynamicBlocks(dynamicDataRef.current, dynamicPreviews, {
      requiredBlockIds: REQUIRED_BLOCK_IDS,
      checkMissingBlocks: false,
    });
    setFieldErrors(errors);
    return ok;
  }, [dynamicPreviews]);

  const handleDynamicInputChange = useCallback(
    async (blockIndex, inputIndex, value) => {
      await sharedHandleDynamicInputChange(
        blockIndex,
        inputIndex,
        value,
        dynamicDataRef.current,
        setDynamicData,
        setDynamicPreviews
      );
    },
    []
  );

  const handleDeletePreview = useCallback((event, blockIndex, inputIndex, previewIndex) => {
    sharedHandleDeletePreview(event, blockIndex, inputIndex, previewIndex, setDynamicPreviews, setDynamicData);
  }, []);

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prev) => prev.filter((_, i) => i !== blockIndex));
    setBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
    setDynamicPreviews((prev) => prev.filter((_, i) => i !== blockIndex));
  }, []);

  const handlerOpenConstructor = useCallback(() => setOpenConstructor((v) => !v), []);
  const getPreviewClassName = useCallback((label) => sharedGetPreviewClassName(label, styles), []);

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

  const submitHandler = useCallback(
    async (e) => {
      e?.preventDefault?.();

      const topOk = validateTopFields();
      const blocksOk = validateForSubmit();

      if (!topOk || !blocksOk) {
        setShowNotification(true);
        setForceValidateTick((n) => n + 1);
        setTimeout(() => setShowNotification(false), 3500);
        return;
      }

      const form = new FormData();

      const meta = {
        year: Number(inputData.year),
        title: String(inputData.title || '').trim(),
        description: String(inputData.description || '').trim(),
        previewText: String(inputData.previewText || '').trim(),
        img: inputData.previewImageUrl ? String(inputData.previewImageUrl).trim() : null,
        hidden: !!inputData.hidden,
        dynamicBlocks: (dynamicDataRef.current || []).map((block) =>
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
      if (inputData.previewImageFile instanceof File) {
        form.append('photoAva', inputData.previewImageFile, inputData.previewImageFile.name);
      }

      for (let b = 0; b < (dynamicDataRef.current || []).length; b++) {
        const block = dynamicDataRef.current[b] || [];
        for (let i = 0; i < block.length; i++) {
          const inp = block[i];
          if (inp?.type !== 'file') continue;
          const val = inp?.value;
          if (Array.isArray(val)) {
            for (let k = 0; k < val.length; k++) {
              const v = val[k];
              if (v instanceof File) {
                form.append(`dynamic_block_${b}_input_${i}[]`, v, v.name);
              }
            }
          } else if (val instanceof File) {
            form.append(`dynamic_block_${b}_input_${i}`, val, val.name);
          }
        }
      }

      try {
        await dispatch(createHistoryItem(form)).unwrap();
        await dispatch(fetchCompanyHistory()).unwrap();
        onClose?.();
      } catch (err) {
        console.error('Ошибка при создании записи истории:', err);
      }
    },
    [dispatch, inputData, validateTopFields, validateForSubmit, onClose]
  );

  const saveDisabled = (() => {
    const hasTopLevelData =
      String(inputData.year || '').trim() !== '' ||
      String(inputData.title || '').trim() !== '' ||
      String(inputData.description || '').trim() !== '' ||
      String(inputData.previewText || '').trim() !== '' ||
      String(inputData.previewImageUrl || '').trim() !== '' ||
      inputData.previewImageFile instanceof File ||
      String(inputData.img || '').trim() !== '' ||
      Boolean(inputData.hidden);

    if (hasTopLevelData) return false;

    return !(dynamicDataRef.current || []).some((block) =>
      (block || []).some((inp) => {
        const v = inp?.value;
        if (Array.isArray(v)) return v.length > 0;
        if (v instanceof File) return true;
        return String(v ?? '').trim() !== '';
      })
    );
  })();

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните обязательные поля формы и открытые блоки конструктора либо закройте блок!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.form_container__title}>Новая запись истории</div>

        <button
          type="button"
          className={adminStyles.card_components_admin__close_button}
          onClick={() => setShowExitConfirm(true)}
          aria-label="Закрыть"
        />
      </div>

      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler} noValidate>
          <HistoryHeaderBlock
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
            mdUpload={(file) => dispatch(uploadHistoryMarkdownFile(file)).unwrap()}
            mdDelete={(url) => dispatch(deleteHistoryMarkdownFile(url)).unwrap()}
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
            saveDisabled={saveDisabled}
            saveProps={
              saveDisabled
                ? {
                    style: {
                      backgroundColor: 'var(--light-blue-D4EDFB)',
                      cursor: 'not-allowed',
                    },
                  }
                : undefined
            }
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
