import styles from './HomeAdmin.module.scss';

const typesToStyles = {
  error: styles.notification__error,
  ok: styles.notification__ok,
  delete: styles.notification__delete,
  update: styles.notification__update,
};

export default function Notification({ text, type }) {
  if (!type) return null;
  return <div className={typesToStyles[type] || styles.home_admin_section__ok}>{text}</div>;
}
