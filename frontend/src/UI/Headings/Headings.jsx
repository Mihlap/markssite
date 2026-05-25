import clsx from 'clsx';
import s from './Styles.module.css';

export default function Headings({ level = 1, size, mobileSize, weight, color, font, className, children }) {
  const Tag = `h${level}`;
  return (
    <Tag
      className={clsx(
        size       && s[`size-${size}`],
        mobileSize && s[`mobile-${mobileSize}`],
        weight     && s[`fw-${weight}`],
        color      && s[`color-${color}`],
        font       && s[`font-${font}`],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
