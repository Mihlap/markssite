import React, { useEffect, useRef, useState } from 'react';
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

export { getEmbedUrl };

export default function VideoBlock({ file, url, onFileChange, onUrlChange, onRemove, btnClose = true, color = 'salmon', padding = '36px 16px 32px 16px' }) {
  const videoRef = useRef(null);
  const [sizeError, setSizeError] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(null);

  const hasFile = !!file;
  const hasLink = !!url?.trim();

  useEffect(() => {
    const timer = setTimeout(() => setEmbedUrl(getEmbedUrl(url)), 600);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <UiMarksGrayWrap
      btnClose={btnClose}
      handlerClick={onRemove}
      customStyles={{
        padding: padding,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
      {hasFile ? (
        <UiVideoPreview
          file={file}
          label="Видео"
          color={color}
          onRemove={() => {
            onFileChange(null);
            setSizeError(null);
            if (videoRef.current) videoRef.current.value = '';
          }}
        />
      ) : (
        <UiMarksInput
          type="file"
          color={color}
          label="Видео"
          buttonText="Загрузить видео с компьютера"
          accept="video/*"
          inputRef={videoRef}
          error={sizeError}
          disabled={hasLink}
          onChange={(e) => {
            const f = e.target.files[0];
            if (!f) return;
            if (f.size > MAX_SIZE_BYTES) {
              setSizeError(`Файл слишком большой. Максимальный размер — ${MAX_SIZE_MB} МБ`);
              e.target.value = '';
              return;
            }
            setSizeError(null);
            onFileChange(f);
          }}
        />
      )}

      <UiMarksInput
        color={color}
        placeholder="URL видео"
        bordered
        disabled={hasFile}
        value={url ?? ''}
        onChange={(e) => onUrlChange(e.target.value)}
      />

      {embedUrl && !hasFile && <UiVideoPreview embedUrl={embedUrl} />}
    </UiMarksGrayWrap>
  );
}
