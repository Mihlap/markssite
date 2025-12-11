import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from '../../../add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../style/style-card.module.scss';

import SubmitButtons from '../../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../../UI/ExitConfirmModal/ExitConfirmModal';

import {
  updateHistoryItem,
  fetchCompanyHistory,
  uploadHistoryMarkdownFile,
  deleteHistoryMarkdownFile,
} from '../../../../store/Slice/companyHistorySlice';

import ConstructionSectionFromEditStaff from '../../FormAddEditStaff/ConstructionSectionFromEditStaff';
import ConstructorPageBase from '../../constructor/ConstructorPage';
import HistoryHeaderBlock from './HistoryHeaderBlock';
import useInterceptExternalClose from '../../../hooks/useInterceptExternalClose';
import {
  sharedHandleDynamicInputChange,
  sharedHandleDeletePreview,
  getPreviewClassName as sharedGetPreviewClassName,
} from '../../utils/formShared';
import { validateDynamicBlocks } from '../../utils/dynamicValidation';
import { toBucketSrc, isFullUrl } from '../../utils/imageUtils';

const ConstructorPage = (props) => <ConstructorPageBase {...props} isHistoryForm={true} />;

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const REQUIRED_BLOCK_IDS = ['imageWithCaption', 'quote', 'fact', 'personOfYear', 'personWithName'];

export default function FormEditHistory({ initial = null, onClose, registerCloseGuard }) {
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

  const [dynamicData, setDynamicData] = useState([]);
  const [dynamicPreviews, setDynamicPreviews] = useState([]);
  const [openConstructor, setOpenConstructor] = useState(false);
  const dynamicDataRef = useRef(dynamicData);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);
  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);
  if (registerCloseGuard) registerCloseGuard(() => setShowExitConfirm(true));

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
    }
  }, [initial]);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    async function hydrateDynamic() {
      if (!initial) return;

      let blocks = [];

      if (Array.isArray(initial?.ConstructorLegends) && initial.ConstructorLegends.length) {
        const pieces = initial.ConstructorLegends.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter(
          (arr) => arr.length
        );
        blocks = pieces.some((p) => Array.isArray(p?.[0])) ? pieces.flat() : pieces;
      }

      if (Array.isArray(initial?.dynamicBlocks) && initial.dynamicBlocks.length) {
        blocks = initial.dynamicBlocks;
      }

      if (!blocks.length && initial?.id) {
        try {
          const r = await fetch(`/api/legend/${initial.id}/dynamic`, { signal: controller.signal });
          if (r.ok) {
            const j = await r.json();
            const raw = Array.isArray(j?.dynamicData) ? j.dynamicData : [];

            if (Array.isArray(raw?.[0])) {
              blocks = raw;
            } else if (raw.length && typeof raw[0] === 'object' && 'blockIndex' in raw[0]) {
              const grouped = [];
              raw.forEach((inp) => {
                const bi = Number.isFinite(+inp.blockIndex) ? +inp.blockIndex : 0;
                if (!grouped[bi]) grouped[bi] = [];
                grouped[bi].push(inp);
              });
              blocks = grouped.filter(Boolean);
            } else if (raw.length) {
              blocks = [raw];
            }
          }
        } catch (e) {
          if (e?.name !== 'AbortError') console.error('hydrateDynamic error:', e);
        }
      }

      if (isCancelled) return;

      const normalized = (blocks || []).map((group, gi) =>
        (Array.isArray(group) ? group : []).map((inp, ii) => {
          const value = inp?.value ?? '';
          let processedValue = value;

          if (inp?.type === 'file' && typeof value === 'string' && value) {
            processedValue = toBucketSrc(value);
          } else if (inp?.type === 'file' && Array.isArray(value)) {
            processedValue = value.map(v => typeof v === 'string' ? toBucketSrc(v) : v);
          }

          return {
            type: inp?.type ?? 'text',
            label: inp?.label ?? '',
            placeholder: inp?.placeholder ?? '',
            value: processedValue,
            key: inp?.key ?? `g${gi}-i${ii}-${Date.now()}`,
            required: Boolean(inp?.required),
            pairKey: inp?.pairKey || undefined,
            blockId: inp?.blockId ?? null,
            blockRequired: Boolean(inp?.blockRequired),
          };
        })
      );

      dynamicDataRef.current = normalized;
      setDynamicData(normalized);

      const nextPreviews = normalized.map((group) =>
        group.map((inp) => {
          const v = inp?.value;
          if (inp?.type === 'file') return Array.isArray(v) ? v : v ? [v] : [];
          return Array.isArray(v) ? v : [];
        })
      );
      setDynamicPreviews(nextPreviews);
    }

    hydrateDynamic();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [initial]);

  const changeBasic = useCallback((e) => {
    const { name, value, type, checked } = e.target || {};
    setInputData((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handlerOpenConstructor = useCallback(() => setOpenConstructor((v) => !v), []);

  const handleClick = useCallback(
    (inputs, meta = {}) => {
      const { ok, errors } = validateDynamicBlocks(dynamicData, dynamicPreviews, {
        requiredBlockIds: REQUIRED_BLOCK_IDS,
        checkMissingBlocks: false,
      });

      setFieldErrors(errors);
      if (!ok) {
        setShowNotification(true);
        setForceValidateTick((n) => n + 1);
        setTimeout(() => setShowNotification(false), 3500);
        return;
      }
      const key = Date.now().toString();
      const newBlock = inputs.map((f, idx) => ({
        ...f,
        key: `${key}_${f.type}_${idx}`,
        value: f.defaultValue ?? '',
        blockId: meta.blockId || null,
        blockRequired: !!meta.requiredBlock,
      }));
      setDynamicData((prev) => [...prev, newBlock.map((x) => ({ ...x }))]);
      setDynamicPreviews((prev) => [...prev, new Array(newBlock.length).fill([])]);
    },
    [dynamicData, dynamicPreviews]
  );

  const handleRemoveBlock = useCallback((blockIndex) => {
    setDynamicData((prev) => prev.filter((_, i) => i !== blockIndex));
    setDynamicPreviews((prev) => prev.filter((_, i) => i !== blockIndex));
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

  const getPreviewClassName = useCallback((label) => sharedGetPreviewClassName(label, styles), []);

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

  const validateAll = useCallback(() => {
    const { ok, errors } = validateDynamicBlocks(dynamicData, dynamicPreviews, {
      requiredBlockIds: REQUIRED_BLOCK_IDS,
      checkMissingBlocks: false,
    });
    setFieldErrors(errors);
    return ok;
  }, [dynamicData, dynamicPreviews]);

  const submitHandler = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!initial?.id) return;

      const topOk = validateTopFields();
      const blocksOk = validateAll();

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

      if (inputData.previewImageFile instanceof File) {
        form.append('photoAva', inputData.previewImageFile, inputData.previewImageFile.name);
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
        await dispatch(updateHistoryItem({ id: initial.id, data: form })).unwrap();
        await dispatch(fetchCompanyHistory()).unwrap();
        onClose?.();
      } catch (err) {
        console.error('Ошибка при обновлении записи истории:', err);
      }
    },
    [dispatch, inputData, dynamicData, initial, onClose, validateTopFields, validateAll]
  );

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните обязательные поля формы и открытые блоки конструктора либо закройте блок!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.form_container__title}>Редактировать запись истории</div>

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

          <ConstructionSectionFromEditStaff
            styles={styles}
            dynamicData={dynamicData}
            dynamicPreviews={dynamicPreviews}
            setDynamicPreviews={setDynamicPreviews}
            handleRemoveBlock={handleRemoveBlock}
            handleDynamicInputChange={handleDynamicInputChange}
            handleDeletePreview={handleDeletePreview}
            bucket_url={bucket_url}
            getPreviewClassName={getPreviewClassName}
            openConstructor={openConstructor}
            handlerOpenConstructor={handlerOpenConstructor}
            ConstructorPage={ConstructorPage}
            handleClick={handleClick}
            mdUpload={(file) => dispatch(uploadHistoryMarkdownFile(file)).unwrap()}
            mdDelete={(url) => dispatch(deleteHistoryMarkdownFile(url)).unwrap()}
            fieldErrors={fieldErrors}
            forceValidate={forceValidateTick}
            isHistory={true}
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
