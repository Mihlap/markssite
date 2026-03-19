import s from './Style.module.css';

const sizeMap = {
  '3xl': s.heading_large,
  '2xl': s.heading_medium,
  'xl': s.heading_small,
};

export default function MarksHeading({ children, size, customStyles }) {
  return (
    <div className={`${s.heading} ${sizeMap[size] || s.heading_large}`} style={customStyles}>
      {children}
    </div>
  );
}
