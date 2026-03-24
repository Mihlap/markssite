import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';
import { createStaffAsync, updateStaffAsync } from '../../../store/Slice/StaffSliceNew';
import s from './Styles.module.css';
import ConstructorMain from '../../constructor/ConstructorMain';
import { staff_items } from '../../constructor/config/config';
import { BLOCK_COMPONENTS } from '../../constructor/blocks';

const CATEGORY_OPTIONS = [
  { value: 'Руководство', label: 'Руководство' },
  { value: 'Научное сопровождение', label: 'Научное сопровождение' },
  { value: 'HR', label: 'HR' },
];

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

  const {
    control,
    handleSubmit,
    reset,
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
      return;
    }
    reset({
      name: editStaffData.name || '',
      position: editStaffData.position || '',
      description: editStaffData.description || '',
      category: (editStaffData.category || []).map((c) => ({ value: c, label: c })),
      photoAva: editStaffData.img ? [editStaffData.img] : [],
      constructorBlocks: (editStaffData.dynamicBlocks || []).map(fromOldFormat).filter(Boolean),
    });
  }, [editStaffData, reset]);

  const onSubmit = async (data) => {
    const photoAvaNew = (data.photoAva || []).filter((f) => f instanceof File);
    const photoAvaExisting = (data.photoAva || []).find((f) => !(f instanceof File)) || '';

    const blocks = data.constructorBlocks || [];
    const oldFormatBlocks = blocks.map(toOldFormat);

    const form = new FormData();
    const meta = {
      name: data.name || '',
      position: data.position || '',
      description: data.description || '',
      category: Array.isArray(data.category) ? data.category.map((o) => o.value) : [],
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
    <form id="add-form-staff" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <Controller
          name="photoAva"
          control={control}
          rules={{ required: true, validate: (v) => Array.isArray(v) && v.length > 0 }}
          render={({ field: { onChange, value } }) => (
            <>
              {value?.length > 0 ? (
                <UiPhotoPreview
                  files={value}
                  variant="single"
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    onChange(file ? [file] : []);
                  }}
                />
              )}
            </>
          )}
        />
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              name="name"
              bordered
              placeholder="ФИО"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>
      <UiMarksGrayWrap customStyles={{ padding: '32px 16px' }}>
        <Controller
          name="category"
          control={control}
          rules={{ required: true, validate: (v) => Array.isArray(v) && v.length > 0 }}
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
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksTextarea
              name="description"
              label="Описание"
              placeholder="Нет ограничения по символам"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <ConstructorMain items={staff_items} onSelect={(item) => append({ type: item.id })} />

      {constructorBlocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block.id} control={control} index={index} onRemove={() => remove(index)} />;
      })}
    </form>
  );
});

export default StaffForm;
