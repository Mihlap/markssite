import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';
import { createStaffAsync, updateStaffAsync, uploadStaffMarkdownFile } from '../../../store/Slice/StaffSliceNew';
import s from './Styles.module.css';
import ConstructorMain from '../../constructor/ConstructorMain';
import { staff_items } from '../../constructor/config/config';
import { BLOCK_COMPONENTS } from '../../constructor/blocks';

const S3_URL = (process.env.REACT_APP_S3_BUCKET_URL || '').replace(/\/+$/, '');

const toStaffImgUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${S3_URL}/images/imageStaff/${img}`;
};

const CATEGORY_OPTIONS = [
  { value: 'Руководство', label: 'Руководство' },
  { value: 'Научно-техническое сопровождение', label: 'Научно-техническое сопровождение' },
  { value: 'HR', label: 'HR' },
];

const normalizeCategoryValue = (value) => {
  const n = String(value || '').toLowerCase().trim();
  if (n === 'научное сопровождение') return 'Научно-техническое сопровождение';
  return value;
};

const EMPTY_VALUES = {
  name: '',
  position: '',
  description: '',
  category: [],
  photoAva: [],
  constructorBlocks: [],
};

const processFilesForMeta = (files) => {
  if (!Array.isArray(files)) return [];
  return files.map((f) => (f instanceof File ? f.name : f));
};

const toFileArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return [val];
};

const fromOldFormat = (inputs) => {
  if (!Array.isArray(inputs) || !inputs.length) return null;
  const [a, b, c, d] = inputs;
  switch (a?.label) {
    case 'Текстовый блок в рамке':
      return { type: 'textWithFrame', textarea: a.value || '' };
    case 'Текстовый блок выделенный':
      return { type: 'textWithSelection', textarea: a.value || '' };
    case 'Текстовый блок с фоном':
      return { type: 'textWithBackg', textarea: a.value || '' };
    case 'Текстовый блок с точкой':
      return { type: 'textWithPoint', textarea: a.value || '' };
    case 'Тело статьи':
      return { type: 'markDown', textarea: a.value || '' };
    case 'Изображение':
      if (b?.label === 'Описание')
        return { type: 'imageWithDesc', image: toFileArray(a.value), description: b.value || '' };
      return { type: 'interestingFact', image: toFileArray(a.value), textarea: b?.value || '', ava: toFileArray(c?.value), description: d?.value || '' };
    case 'Автор цитаты':
      return { type: 'quote', image: toFileArray(a.value), description: b?.value || '', textarea: c?.value || '' };
    default:
      if (a?.type === 'markdown') return { type: 'markDown', textarea: a.value || '' };
      return null;
  }
};

const toOldFormat = (block) => {
  switch (block.type) {
    case 'textWithFrame':
      return [{ type: 'textarea', label: 'Текстовый блок в рамке', value: block.textarea || '' }];
    case 'imageWithDesc':
      return [
        { type: 'file', label: 'Изображение', value: processFilesForMeta(block.image) },
        { type: 'text', label: 'Описание', value: block.description || '' },
      ];
    case 'quote':
      return [
        { type: 'file', label: 'Автор цитаты', value: processFilesForMeta(block.image) },
        { type: 'text', label: 'ФИО/Описание', value: block.description || '' },
        { type: 'textarea', label: 'Цитата', value: block.textarea || '' },
      ];
    case 'textWithSelection':
      return [{ type: 'textarea', label: 'Текстовый блок выделенный', value: block.textarea || '' }];
    case 'interestingFact':
      return [
        { type: 'file', label: 'Изображение', value: processFilesForMeta(block.image) },
        { type: 'textarea', label: 'Интересный факт', value: block.textarea || '' },
        { type: 'file', label: 'Портрет сотрудника', value: processFilesForMeta(block.ava) },
        { type: 'text', label: 'ФИО/Описание', value: block.description || '' },
      ];
    case 'textWithBackg':
      return [{ type: 'textarea', label: 'Текстовый блок с фоном', value: block.textarea || '' }];
    case 'textWithPoint':
      return [{ type: 'textarea', label: 'Текстовый блок с точкой', value: block.textarea || '' }];
    case 'markDown':
      return [{ type: 'markdown', label: 'Тело статьи', value: block.textarea || '' }];
    default:
      return [];
  }
};

const getBlockFiles = (block, inputIndex) => {
  switch (block.type) {
    case 'imageWithDesc':
      return inputIndex === 0 ? block.image : null;
    case 'quote':
      return inputIndex === 0 ? block.image : null;
    case 'interestingFact':
      if (inputIndex === 0) return block.image;
      if (inputIndex === 2) return block.ava;
      return null;
    default:
      return null;
  }
};

const StaffForm = forwardRef(function StaffForm(
  { onValidityChange, onLoadingChange, onDirtyChange, editStaffData, onSuccess },
  ref
) {
  const dispatch = useDispatch();
  const photoAvaRef = useRef(null);

  const handleMarkdownUpload = useCallback(
    (file) => dispatch(uploadStaffMarkdownFile(file)).unwrap(),
    [dispatch]
  );

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    clearErrors,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  const {
    fields: constructorBlocks,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'constructorBlocks',
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(
    ref,
    () => ({
      resetForm: () => reset(EMPTY_VALUES),
    }),
    [reset]
  );

  useEffect(() => {
    if (!editStaffData) {
      reset(EMPTY_VALUES);
      trigger();
      return;
    }
    reset({
      name: editStaffData.name || '',
      position: editStaffData.position || '',
      description: editStaffData.description || '',
      category: (editStaffData.category || []).map((c) => {
        const value = normalizeCategoryValue(c);
        return { value, label: value };
      }),
      photoAva: editStaffData.img ? [toStaffImgUrl(editStaffData.img)] : [],
      constructorBlocks: (editStaffData.dynamicBlocks || []).map(fromOldFormat).filter(Boolean),
    });
    trigger();
  }, [editStaffData, reset, trigger]);

  const onSubmit = async (data) => {
    let hasBlockError = false;
    if (!data.photoAva?.length) {
      setError('photoAva', { type: 'custom', message: 'Обязательно для загрузки' });
      hasBlockError = true;
    }
    if (!data.name?.trim()) {
      setError('name', { type: 'custom', message: 'Обязательно для заполнения' });
      hasBlockError = true;
    }
    if (!data.description?.trim()) {
      setError('description', { type: 'custom', message: 'Обязательно для заполнения ' });
      hasBlockError = true;
    }
    (data.constructorBlocks || []).forEach((block, i) => {
       if (block.type === 'imageWithDesc') {
         if (!block.image?.length) {
           setError(`constructorBlocks.${i}.image`, { type: 'custom', message: 'Обязательно для загрузки' });
           hasBlockError = true;
         }
         return;
       }
      if (block.type === 'interestingFact') {
        const hasAva = block.ava?.length > 0;
        const hasDesc = block.description?.length > 0;
        const d = document.createElement('div');
        d.innerHTML = block.textarea || '';
        if (!d.textContent.trim()) {
          setError(`constructorBlocks.${i}.textarea`, { type: 'custom', message: 'Обязательно для заполнения' });
          hasBlockError = true;
        }
        if (hasAva && !hasDesc) {
          setError(`constructorBlocks.${i}.description`, { type: 'custom', message: 'Обязательно для заполнения' });
          hasBlockError = true;
        }
        if (hasDesc && !hasAva) {
          setError(`constructorBlocks.${i}.ava`, { type: 'custom', message: 'Обязательно для загрузки' });
          hasBlockError = true;
        }
        return;
      }
      if (block.type !== 'quote') return;
      const hasImg = block.image?.length > 0;
      const hasDesc = block.description?.length > 0;
      const d = document.createElement('div');
      d.innerHTML = block.textarea || '';
      if (!d.textContent.trim()) {
        setError(`constructorBlocks.${i}.textarea`, { type: 'custom', message: 'Обязательно для заполнения' });
        hasBlockError = true;
      }
      if (hasImg && !hasDesc) {
        setError(`constructorBlocks.${i}.description`, { type: 'custom', message: 'Обязательно для заполнения' });
        hasBlockError = true;
      }
      if (hasDesc && !hasImg) {
        setError(`constructorBlocks.${i}.image`, { type: 'custom', message: 'Обязательно для загрузки' });
        hasBlockError = true;
      }
    });
    if (hasBlockError) return;

    const photoAvaNew = (data.photoAva || []).filter((f) => f instanceof File);
    const photoAvaExisting = (data.photoAva || []).find((f) => !(f instanceof File)) || '';

    const blocks = data.constructorBlocks || [];
    const oldFormatBlocks = blocks.map(toOldFormat);

    const form = new FormData();
    const meta = {
      name: data.name || '',
      position: data.position || '',
      description: data.description || '',
      category: Array.isArray(data.category)
        ? data.category.map((o) => normalizeCategoryValue(o.value))
        : [],
      img: photoAvaExisting || null,
      isVisible: true,
      dynamicBlocks: oldFormatBlocks,
    };
    form.append('meta', JSON.stringify(meta));

    if (photoAvaNew[0] instanceof File) {
      form.append('photoAva', photoAvaNew[0], photoAvaNew[0].name);
    }

    for (let b = 0; b < blocks.length; b++) {
      const oldBlock = oldFormatBlocks[b];
      for (let i = 0; i < oldBlock.length; i++) {
        if (oldBlock[i]?.type !== 'file') continue;
        const fileArr = getBlockFiles(blocks[b], i);
        if (!Array.isArray(fileArr)) continue;
        for (const f of fileArr) {
          if (f instanceof File) form.append(`dynamic_block_${b}_input_${i}[]`, f, f.name);
        }
      }
    }

    if (editStaffData) {
      await dispatch(updateStaffAsync({ id: editStaffData.id, formData: form }));
    } else {
      await dispatch(createStaffAsync(form));
    }
    reset();
    onSuccess?.();
  };

  return (
    <>
    <form id="add-form-staff" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <Controller
          name="photoAva"
          control={control}
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              {value?.length > 0 ? (
                <UiPhotoPreview
                  files={value}
                  variant="portrait"
                  onRemove={() => {
                    onChange([]);
                    if (photoAvaRef.current) photoAvaRef.current.value = '';
                  }}
                  label="Портрет сотрудника "
                />
              ) : (
                <UiMarksInput
                  type="file"
                  name="photoAva"
                  accept="image/*"
                  info
                  inputRef={photoAvaRef}
                  label="Портрет сотрудника "
                  color="blue"
                  error={fieldState.error?.message}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    onChange(file ? [file] : []);
                    if (file) clearErrors('photoAva');
                  }}
                />
              )}
            </>
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <UiMarksInput
              name="name"
              bordered
              placeholder="ФИО"
              error={fieldState.error?.message}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value.trim()) clearErrors('name');
              }}
            />
          )}
        />
      </UiMarksGrayWrap>
      <UiMarksGrayWrap customStyles={{ padding: '32px 16px' }}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Категория"
              placeholder="Выберите категорию"
              name="category"
              customStyles={{ container: s.selectContainer }}
              options={CATEGORY_OPTIONS}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '1rem' }}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <UiMarksTextarea
              name="description"
              label="Описание"
              placeholder="Нет ограничения по символам"
              error={fieldState.error?.message}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value.trim()) clearErrors('description');
              }}
            />
          )}
        />
      </UiMarksGrayWrap>

      <ConstructorMain items={staff_items} onSelect={(item) => append({ type: item.id })} />

      {constructorBlocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block.id} control={control} index={index} onRemove={() => remove(index)} onUploadFile={handleMarkdownUpload} clearErrors={clearErrors} imageFolder="imageStaff" />;
      })}
    </form>
    <DevTool control={control} placement="top-right" />
    </>
  );
});

export default StaffForm;
