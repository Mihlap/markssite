import { Link } from 'react-router-dom';

import styles from './styles/Project.module.css';
import { COLOR } from './const';
import catPhoto from '../img/default-photo.jpeg';

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
    <div
      className={styles.el_project_selectCompetencies}
      style={{ color, borderColor: color, border: '1px solid', padding: '3px 6px', borderRadius: '34px' }}>
      {label}
    </div>
  );
}

export default function Item({ project, photoSrc, gridStyle }) {
  const competencies = parseCompetencies(project.selectCompetencies);

  return (
    <Link to={`/projects/${project.id}`}>
      <img
        src={photoSrc}
        alt={project.imageProject || 'Default Alt Text'}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.src = catPhoto;
        }}
      />
      <div>
        <div>
          <div>
            <div>{project.title}</div>
            <div>
              {competencies.map((c) => (
                <CompetencyTag key={c.value} value={c.value} label={c.label} />
              ))}
            </div>
          </div>
          <div>
            <p>{project.countryCity}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
              <circle cx="1" cy="1" r="1" fill="#959DA6" />
            </svg>
            <p>{project.monthYear}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
