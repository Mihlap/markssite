import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';

export default function PersonYear({ control, index, onRemove }) {
  const imageRef = useRef(null);

  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 1rem 32px 1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        rules={{ required: true, validate: (v) => Array.isArray(v) && v.length > 0 }}
        render={({ field: { onChange, value }, fieldState }) =>
          value?.length > 0 ? (
            <UiPhotoPreview
              files={value}
              variant="portrait"
              label="Человек года *для отображения в хронике"
              color="blue"
              onRemove={() => {
                onChange([]);
                if (imageRef.current) imageRef.current.value = '';
              }}
            />
          ) : (
            <UiMarksInput
              type="file"
              color="blue"
              info
              name={`constructorBlocks.${index}.image`}
              label="Человек года *для отображения в хронике"
              accept="image/*"
              inputRef={imageRef}
              required={!!fieldState.error}
              hint="Обязательно для загрузки"
              onChange={(e) => {
                const file = e.target.files[0];
                onChange(file ? [file] : []);
              }}
            />
          )
        }
      />
    </UiMarksGrayWrap>
  );
}
