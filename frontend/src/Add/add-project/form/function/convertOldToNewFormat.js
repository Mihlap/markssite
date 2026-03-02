export function convertOldToNewFormat(oldBlocks) {
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
