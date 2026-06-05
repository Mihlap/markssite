import { Link } from 'react-router-dom';
import { COLOR } from '../const';
import placehold from '../icon/placehold.webp';
import { UiMarksTextBox } from '../../UI';
import styles from '../styles/Item.module.css';

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
    <Link to={`/project/${project.id}`} className={styles.item}>
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
      <div className={styles.item_content}>
        <div className={styles.item_info}>
              <UiMarksTextBox
                variant="p"
                size="sm"
                weight="700"
                color="primary"
                font="raleway"
                title={project.title}
                className={styles.item_title}>
                {project.title || 'Заголовок'}
              </UiMarksTextBox>
          <div className={styles.item_meta} title={project.countryCity}>
            <UiMarksTextBox
              variant="p"
              font="raleway"
              weight="400"
              color="muted"
              className={styles.item_location}>
              {project.countryCity}
            </UiMarksTextBox>
            <UiMarksTextBox
              variant="p"
              font="raleway"
              weight="400"
              color="muted"
              className={styles.item_date}>
              {project.monthYear}
            </UiMarksTextBox>
          </div>
        </div>
        <div className={styles.item_skills_wrap}>
          {competencies.map((c) => (
            <CompetencyTag key={c.value} value={c.value} label={c.label} />
          ))}
        </div>
      </div>
    </Link>
  );
}
