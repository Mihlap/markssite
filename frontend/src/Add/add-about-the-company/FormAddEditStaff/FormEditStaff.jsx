import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import styles from '../../../Add/add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../Add/style/style-card.module.scss';

import PhotoNameBlock from './PhotoNameBlock';
import CategoryBlock from './CategoryBlock';
import DescriptionBlock from './DescriptionBlock';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

import { usePreviewHandlers } from '../utils/hooks/usePreviewHandlers';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose';

import { updateStaffAsync, uploadStaffMarkdownFile, deleteStaffMarkdownFile } from '../../../store/Slice/StaffSliceNew';
import ConstructionSectionFromEditStaff from './ConstructionSectionFromEditStaff';
import ConstructorPage from '../constructor/ConstructorPage';

import {
  sharedHandleDynamicInputChange,
  sharedHandleDeletePreview,
  getPreviewClassName as sharedGetPreviewClassName,
} from '../utils/formShared';
import { validateDynamicBlocks } from '../utils/dynamicValidation';
import { isFullUrl } from '../utils/imageUtils';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const REQUIRED_BLOCK_IDS = ['imageWithCaption', 'quote', 'fact'];

export default function FormEditStaff({ initial = null, onClose, registerCloseGuard, currentCategory = null }) {
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
      setInputData((p) => ({ ...p, ...initial }));
      if (initial.img) {
        const imgVal = String(initial.img || '');
        let normalizedImg = imgVal;
        if (!isFullUrl(imgVal)) {
          const base = String(bucket_url || '').replace(/\/+$/, '');
          if (imgVal.includes('/')) {
            normalizedImg = `${base}/${imgVal.replace(/^\/+/, '')}`;
          } else {
            normalizedImg = `${base}/images/imageStaff/${imgVal}`;
          }
        }
        setPreviewPhotoAva([{ url: normalizedImg }]);
      }
    }
  }, [initial]);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    async function hydrateDynamic() {
      if (!initial) return;

      let blocks = [];

      if (Array.isArray(initial?.ConstructorStaffNews) && initial.ConstructorStaffNews.length) {
        const pieces = initial.ConstructorStaffNews.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter(
          (arr) => arr.length
        );
        blocks = pieces.some((p) => Array.isArray(p?.[0])) ? pieces.flat() : pieces;
      }

      if (!blocks.length && initial?.id) {
        try {
          const r = await fetch(`/api/staff/stuffs/${initial.id}/dynamic`, { signal: controller.signal });
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
        (Array.isArray(group) ? group : []).map((inp, ii) => ({
          type: inp?.type ?? 'text',
          label: inp?.label ?? '',
          placeholder: inp?.placeholder ?? '',
          value: inp?.value ?? '',
          key: inp?.key ?? `g${gi}-i${ii}-${Date.now()}`,
          required: Boolean(inp?.required),
          pairKey: inp?.pairKey || undefined,
          blockId: inp?.blockId ?? null,
          blockRequired: Boolean(inp?.blockRequired),
        }))
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
    const { name, value } = e.target;
    setInputData((p) => ({ ...p, [name]: value }));
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

      const blocksOk = validateAll();
      const photoOk = Array.isArray(previewPhotoAva) && previewPhotoAva.length > 0;

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
        await dispatch(updateStaffAsync({ id: initial.id, formData: form, isMultipart: true }));
        onClose?.();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, inputData, dynamicData, initial, onClose, validateAll, previewPhotoAva]
  );

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>Заполните открытый блок либо закройте блок!</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.form_container__title}>Редактировать сотрудника</div>

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
