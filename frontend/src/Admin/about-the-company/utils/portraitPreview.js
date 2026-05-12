export const PORTRAIT_CONTAINER_STYLE = {
  position: 'relative',
  display: 'inline-block',
  flexBasis: 'auto',
  maxWidth: '100%',
};

export const PORTRAIT_IMG_STYLE = {
  minHeight: '5rem',
  height: '220px',
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
};

export const isPortraitLabel = (label) => {
  const s = String(label || '').toLowerCase();
  return s === 'портрет сотрудника' || s === 'автор цитаты' || s === 'человек года';
};
