import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';

export default function PosterPerson({ control, index, onRemove }) {
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
              variant="single"
              label="Портрет сотрудника"
              color="salmon"
              onRemove={() => {
                onChange([]);
                if (imageRef.current) imageRef.current.value = '';
              }}
            />
          ) : (
            <UiMarksInput
              type="file"
              color="salmon"
              info
              name={`constructorBlocks.${index}.image`}
              label="Портрет сотрудника"
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
      <Controller
        name={`constructorBlocks.${index}.description`}
        control={control}
        render={({ field }) => (
          <UiMarksInput
            autoGrow
            color="salmon"
            name={`constructorBlocks.${index}.description`}
            placeholder="ФИО/Описание"
            bordered
            {...field}
          />
        )}
      />
    </UiMarksGrayWrap>
  );
}
