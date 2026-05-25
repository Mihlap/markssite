import { Link } from 'react-router-dom';
import { COLOR } from '../const';
import placehold from '../icon/placehold.webp';
import styles from '../styles/Project.module.css';

function parseCompetencies(raw) {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return raw.split(',').map((s) => ({ value: s.trim(), label: s.trim() }));
  }
}

function CompetencyTag({ value, label }) {
  const color = COLOR[value];
  return (
    <div className={styles.skills_item} style={{ color, borderColor: color }}>
      {label}
    </div>
  );
}

export default function Item({ project, photoSrc }) {
  const competencies = parseCompetencies(project.selectCompetencies);

  return (
    <Link className={styles.item} to={`/project/${project.id}`}>
      <img
        src={photoSrc}
        alt={project.imageProject || 'Default Alt Text'}
        loading="eager"
        decoding="async"
        onError={(e) => {
          e.currentTarget.src = placehold;
        }}
        className={styles.item_img}
      />
      <div className={styles.item_wrap}>
        <div className={styles.item_top}>
          <p title={project.title} className={styles.item_title}>
            {project.title}
          </p>
          <div className={styles.item_desc}>
            <p>{project.countryCity}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
              <circle cx="1" cy="1" r="1" fill="#959DA6" />
            </svg>
            <p>{project.monthYear}</p>
          </div>
        </div>
        <div className={styles.item_skills}>
          {competencies.map((c) => (
            <CompetencyTag key={c.value} value={c.value} label={c.label} />
          ))}
        </div>
      </div>
    </Link>
  );
}
