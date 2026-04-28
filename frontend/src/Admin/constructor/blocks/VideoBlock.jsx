import React, { useEffect, useRef, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { UiMarksInput, UiMarksGrayWrap, UiVideoPreview } from '../../ui';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function getEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('youtu.be')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('rutube.ru/video/')) {
    const id = url.split('/video/')[1]?.split('/')[0];
    return id ? `https://rutube.ru/play/embed/${id}` : null;
  }
  if (url.includes('vk.com/video_ext.php')) return url;
  const vkMatch = url.match(/(?:vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/);
  if (vkMatch) return `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}`;
  return null;
}

export default function VideoBlock({ control, index, onRemove }) {
  const videoRef = useRef(null);
  const [sizeError, setSizeError] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(null);

  const videoValue = useWatch({ control, name: `constructorBlocks.${index}.video` });
  const descriptionValue = useWatch({ control, name: `constructorBlocks.${index}.description` });

  const hasFile = videoValue?.length > 0;
  const hasLink = !!descriptionValue?.trim();

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmbedUrl(getEmbedUrl(descriptionValue));
    }, 600);
    return () => clearTimeout(timer);
  }, [descriptionValue]);

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
        disabled={hasLink}
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
              label="Видео"
              buttonText="Загрузить видео с компьютера"
              accept="video/*"
              inputRef={videoRef}
              error={sizeError}
              disabled={hasLink}
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

      <Controller
        name={`constructorBlocks.${index}.description`}
        control={control}
        disabled={hasFile}
        render={({ field }) => (
          <UiMarksInput
            color="salmon"
            name={`constructorBlocks.${index}.description`}
            placeholder="URL видео"
            bordered
            disabled={hasFile}
            {...field}
          />
        )}
      />

      {embedUrl && !hasFile && (
        <UiVideoPreview embedUrl={embedUrl} />
      )}
    </UiMarksGrayWrap>
  );
}
