import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksGrayWrap, UiVideoPreview } from '../../ui';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function VideoUpload({ control, index, onRemove }) {
  const videoRef = useRef(null);
  const [sizeError, setSizeError] = useState(null);

  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{
        padding: '36px 16px 32px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
      <Controller
        name={`constructorBlocks.${index}.video`}
        control={control}
        render={({ field: { onChange, value } }) =>
          value?.length > 0 ? (
            <UiVideoPreview
              file={value[0]}
              label="Видео"
              onRemove={() => {
                onChange([]);
                setSizeError(null);
                if (videoRef.current) videoRef.current.value = '';
              }}
            />
          ) : (
            <UiMarksInput
              type="file"
              color="salmon"
              name={`constructorBlocks.${index}.video`}
              label="Загрузите видео"
              accept="video/*"
              inputRef={videoRef}
              error={sizeError}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > MAX_SIZE_BYTES) {
                  setSizeError(`Файл слишком большой. Максимальный размер — ${MAX_SIZE_MB} МБ`);
                  e.target.value = '';
                  return;
                }
                setSizeError(null);
                onChange([file]);
              }}
            />
          )
        }
      />
    </UiMarksGrayWrap>
  );
}
