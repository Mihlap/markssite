import clsx from 'clsx';
import styles from './styles.module.css';

export default function Button({ children, withBackground = false, className, click, ...rest }) {
  return (
    <>
      {withBackground ? (
        <div className={clsx(styles['bg'], className)}>
          <button onClick={click} className={styles['button']} {...rest}>
            {children}
          </button>
        </div>
      ) : (
        <button
          onClick={click}
          {...rest}
          className={clsx(
            styles.button, // ← подложка
            className
          )}>
          {children}
        </button>
      )}
    </>
  );
}
