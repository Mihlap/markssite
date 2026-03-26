import s from './Style.module.css';

const sizeMap = {
  '3xl': s.heading_large,
  '2xl': s.heading_medium,
  'xl': s.heading_small,
};

const paddingTopMap = {
  'none': s.pt_none,
  'sm': s.pt_sm,
  'md': s.pt_md,
  'lg': s.pt_lg,
  'xl': s.pt_xl,
};

const paddingBottomMap = {
  'none': s.pb_none,
  'sm': s.pb_sm,
  'md': s.pb_md,
  'lg': s.pb_lg,
  'xl': s.pb_xl,
};

export default function MarksHeading({ children, size, pt, pb, customStyles }) {
  const ptClass = paddingTopMap[pt] || '';
  const pbClass = paddingBottomMap[pb] || '';
  const inlineStyles = {
    ...(pt && !paddingTopMap[pt] && { paddingTop: pt }),
    ...(pb && !paddingBottomMap[pb] && { paddingBottom: pb }),
    ...customStyles,
  };

  return (
    <div
      className={`${s.heading} ${sizeMap[size] || s.heading_large} ${ptClass} ${pbClass}`}
      style={inlineStyles}
    >
      {children}
    </div>
  );
}
