import { transliterate } from 'transliteration';

function generateUniqueName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const fileExtension = originalName.split('.').pop();
  const sliceOfOriginalName = transliterate(originalName.slice(0, 5));
  const newName = `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;
  return newName;
}

// Rename file with unique name
const renameFile = (file) => {
  const uniqueName = generateUniqueName(file.name);
  return new File([file], uniqueName, { type: file.type });
};


const convertOldToNewFormat = (oldBlocks) => {
  if (!Array.isArray(oldBlocks)) return [];

  return oldBlocks
    .map((block) => {
      if (!Array.isArray(block) || block.length === 0) return null;

      const label = block[0]?.label;

      switch (label) {
        case 'Картинка с описанием':
          return {
            type: 'imageWithDesc',
            image: block[0]?.value || [],
            description: block[1]?.value || '',
          };
        case 'Заголовок':
          return {
            type: 'titleWithDesc',
            title: block[0]?.value || '',
            description: block[1]?.value || '',
          };
        case 'Ссылка на видеоролик':
          return {
            type: 'video',
            description: block[0]?.value || '',
          };
        case 'Блок 3 картинки':
          return {
            type: 'threeImages',
            image: block[0]?.value || [],
          };
        case 'Блок 2е вертикальные картинки':
          return {
            type: 'twoImages',
            image: block[0]?.value || [],
          };
        case 'Слайдер *допускается загрузка 8ми изображений':
          return {
            type: 'slider',
            image: block[0]?.value || [],
          };
        default:
          return null;
      }
    })
    .filter(Boolean);
}

export {
  renameFile,
  convertOldToNewFormat,
};
