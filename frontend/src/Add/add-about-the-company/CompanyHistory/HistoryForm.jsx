import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { UiMarksInput, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';
import { createHistoryItem, updateHistoryItem } from '../../../store/Slice/companyHistorySlice';
import ConstructorMain from '../../constructor/ConstructorMain';
import { history_items } from '../../constructor/config/config';
import { BLOCK_COMPONENTS } from '../../constructor/blocks';

const EMPTY_VALUES = {
  year: '',
  title: '',
  description: '',
  previewText: '',
  previewImage: [],
  constructorBlocks: [],
};

const processFilesForMeta = (files) => {
  if (!Array.isArray(files)) return [];
  return files.map((f) => (f instanceof File ? f.name : f));
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
    case 'Тело статьи':
      return { type: 'markDown', textarea: a.value || '' };
    case 'Изображение':
      if (b?.label === 'Описание')
        return { type: 'imageWithDesc', image: toFileArray(a.value), description: b.value || '' };
      return {
        type: 'interestingFact',
        image: toFileArray(a.value),
        textarea: b?.value || '',
        ava: toFileArray(c?.value),
        description: d?.value || '',
      };
    case 'Автор цитаты':
      return { type: 'quote', image: toFileArray(a.value), description: b?.value || '', textarea: c?.value || '' };
    default:
      if (a?.type === 'markdown') return { type: 'markDown', textarea: a.value || '' };
      return null;
  }
};

const HistoryForm = forwardRef(function HistoryForm(
  { onValidityChange, onLoadingChange, onDirtyChange, editData, onSuccess },
  ref
) {
  const dispatch = useDispatch();
  const previewImageRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  const { fields: constructorBlocks, append, remove } = useFieldArray({
    control,
    name: 'constructorBlocks',
  });

  useEffect(() => { onValidityChange?.(isValid); }, [isValid, onValidityChange]);
  useEffect(() => { onLoadingChange?.(isSubmitting); }, [isSubmitting, onLoadingChange]);
  useEffect(() => { onDirtyChange?.(isDirty); }, [isDirty, onDirtyChange]);

  useImperativeHandle(ref, () => ({ resetForm: () => reset(EMPTY_VALUES) }), [reset]);

  useEffect(() => {
    if (!editData) {
      reset(EMPTY_VALUES);
      return;
    }
    reset({
      year: editData.year ? String(editData.year) : '',
      title: editData.title || '',
      description: editData.description || '',
      previewText: editData.previewText || '',
      previewImage: editData.previewImageUrl ? [editData.previewImageUrl] : [],
      constructorBlocks: (editData.dynamicBlocks || []).map(fromOldFormat).filter(Boolean),
    });
  }, [editData, reset]);

  const onSubmit = async (data) => {
    const previewImageNew = (data.previewImage || []).filter((f) => f instanceof File);
    const previewImageExisting = (data.previewImage || []).find((f) => !(f instanceof File)) || '';

    const blocks = data.constructorBlocks || [];
    const oldFormatBlocks = blocks.map(toOldFormat);

    const form = new FormData();
    const meta = {
      year: Number(data.year),
      title: data.title || '',
      description: data.description || '',
      previewText: data.previewText || '',
      img: previewImageExisting || null,
      hidden: false,
      dynamicBlocks: oldFormatBlocks,
    };
    form.append('meta', JSON.stringify(meta));

    if (previewImageNew[0] instanceof File) {
      form.append('photoAva', previewImageNew[0], previewImageNew[0].name);
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

    if (editData) {
      await dispatch(updateHistoryItem({ id: editData.id, data: form }));
    } else {
      await dispatch(createHistoryItem(form));
    }
    reset();
    onSuccess?.();
  };

  return (
    <form id="add-form-history" onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <Controller
          name="year"
          control={control}
          rules={{ required: true, validate: (v) => !isNaN(Number(v)) && Number(v) > 0 }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              type="number"
              name="year"
              bordered
              placeholder="Год"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              name="title"
              bordered
              placeholder="Заголовок"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '16px' }}>
        <Controller
          name="previewImage"
          control={control}
          rules={{ required: true, validate: (v) => Array.isArray(v) && v.length > 0 }}
          render={({ field: { onChange, value } }) => (
            <>
              {value?.length > 0 ? (
                <UiPhotoPreview
                  files={value}
                  variant="single"
                  label="Превью изображение"
                  onRemove={() => {
                    onChange([]);
                    if (previewImageRef.current) previewImageRef.current.value = '';
                  }}
                />
              ) : (
                <UiMarksInput
                  type="file"
                  name="previewImage"
                  accept="image/*"
                  info
                  inputRef={previewImageRef}
                  label="Превью изображение"
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
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '1rem' }}>
        <Controller
          name="previewText"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksTextarea
              name="previewText"
              label="Текст превью"
              placeholder="Не более 160 символов"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <UiMarksGrayWrap customStyles={{ padding: '1rem' }}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <UiMarksTextarea
              name="description"
              label="Описание"
              placeholder="Нет ограничения по символам"
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <ConstructorMain items={history_items} onSelect={(item) => append({ type: item.id })} />

      {constructorBlocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block.id} control={control} index={index} onRemove={() => remove(index)} />;
      })}
    </form>
  );
});

export default HistoryForm;
