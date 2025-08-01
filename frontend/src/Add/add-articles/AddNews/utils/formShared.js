import { transliterate } from 'transliteration';
import compressImageFile from 'browser-image-compression';

// Сжатие изображений
export async function compressImage(file, options = { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true }) {
  try {
    return await compressImageFile(file, options);
  } catch (e) {
    console.error('Ошибка при сжатии изображения:', e);
    throw e;
  }
}

// Генерация уникального имени файла
export function generateUniqueName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const ext = originalName.split('.').pop();
  const prefix = transliterate(originalName.slice(0, 5));
  return `file_${prefix}_${timestamp}_${randomNum}.${ext}`;
}


// Функция для обработки динамического изменения input в конструкторе
export async function sharedHandleDynamicInputChange(
  blockIndex,
  inputIndex,
  value,
  dynamicData,
  setDynamicData,
  setDynamicPreviews
) {
  const newData = [...dynamicData];
  if (!newData[blockIndex]) newData[blockIndex] = [];
  if (!newData[blockIndex][inputIndex]) newData[blockIndex][inputIndex] = { type: '', label: '', value: '' };

  if (Array.isArray(value) && value[0] instanceof File) {
    const files = await Promise.all(
      value.map(async (file) => {
        if (file.type.startsWith('image/')) {
          const c = await compressImage(file);
          return new File([c], generateUniqueName(c.name), { type: c.type });
        }
        return new File([file], generateUniqueName(file.name), { type: file.type });
      })
    );
    newData[blockIndex][inputIndex].value = files;
    setDynamicPreviews((prev) => {
      const p = [...prev];
      if (!p[blockIndex]) p[blockIndex] = [];
      p[blockIndex][inputIndex] = files.map((f) => URL.createObjectURL(f));
      return p;
    });
  } else {
    newData[blockIndex][inputIndex].value = value;
    setDynamicPreviews((prev) => {
      const p = [...prev];
      if (!p[blockIndex]) p[blockIndex] = [];
      p[blockIndex][inputIndex] = value;
      return p;
    });
  }

  setDynamicData(newData);
}

// Выбор CSS-классов для превью
export function getPreviewClassName(label, styles) {
  switch (label) {
    case 'Картинка с описанием':
      return { outerDiv: styles.imgWithDescriptionPreview, innerDiv: styles.someInnerDivStyle };
    case 'Слайдер *допускается загрузка 8ми изображений':
      return { outerDiv: styles.sliderPreview, innerDiv: styles.sliderPreviewDiv };
    case 'Блок 2е вертикальные картинки':
      return {
        outerDiv: styles.verticallyBlock,
        innerDiv: styles.previewWerticallyBlock,
        verticalImgTwo: styles.verticalTwoImg,
      };
    case 'Видеоролик':
    case 'Ссылка на видеоролик':
      return { outerDiv: styles.videoPreview, innerDiv: styles.videoInnerDiv, videoStyles: styles.videoStyle };
    default:
      return {};
  }
}


// Удаление превью в динамических блоках
export function sharedHandleDeletePreview(
  event,
  blockIndex,
  inputIndex,
  previewIndex,
  setDynamicPreviews,
  setDynamicData
) {
  event.preventDefault();
  setDynamicPreviews((prev) => {
    const p = [...prev];
    p[blockIndex][inputIndex] = p[blockIndex][inputIndex].filter((_, i) => i !== previewIndex);
    return p;
  });
  setDynamicData((prev) => {
    const d = [...prev];
    d[blockIndex][inputIndex].value = d[blockIndex][inputIndex].value.filter((_, i) => i !== previewIndex);
    return d;
  });
  document.querySelectorAll('input[type="file"]').forEach((i) => (i.value = ''));
}
