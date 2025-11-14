import styles from './SkeletonLoader.module.scss';

const SkeletonLoader = ({ itemCount = 8 }) => {
 return (
    <ul className={styles.skeleton_container}>
      {Array(itemCount)
        .fill(0)
        .map((_, index) => (
          <li key={index} className={styles.skeleton_container__item_stuff}>
            <div className={styles.skeleton_container__wrapper_item_stuff}></div>
            <div className={styles.skeleton_container__item_name_stuff}></div>
            <div className={styles.skeleton_container__item_position_stuff}></div>
          </li>
        ))}
    </ul>
  );
};
;

export default SkeletonLoader;
