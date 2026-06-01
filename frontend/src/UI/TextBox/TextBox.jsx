import clsx from 'clsx';
import s from './Styles.module.css';

export default function TextBox({ variant = 'h1', size, mobileSize, bigSize, weight, color, mobileColor, font, className, href, children }) {
  const Tag = variant;
  return (
    <Tag
      href={href}
      className={clsx(
        size && s[`size-${size}`],
        mobileSize && s[`mobile-${mobileSize}`],
        bigSize && s[`big-${bigSize}`],
        weight && s[`fw-${weight}`],
        color && s[`color-${color}`],
        mobileColor && s[`colorPhone-${mobileColor}`],
        font && s[`font-${font}`],
        className
      )}>
      {children}
    </Tag>
  );
}
