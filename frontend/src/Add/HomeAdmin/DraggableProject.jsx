import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styles from './HomeAdmin.module.scss';

export default function DraggableProject({
  project,
  index,
  moveProject,
  handleDrop,
  handleFormDelete,
}) {
  const ref = useRef(null);

  const [, dropHover] = useDrop({
    accept: 'PROJECT',
    hover: (item, monitor) => {
      if (item.index === index) return;
      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverX = clientOffset.x - hoverRect.left;
   
      if (item.index < index && hoverX < hoverMiddleX) return;     
      if (item.index > index && hoverX > hoverMiddleX) return;

      moveProject(item.id, project.IdProject);
      item.index = index;
    },
  });

  const [, dropFinish] = useDrop({
    accept: 'PROJECT',
    drop: () => ({ targetId: project.IdProject }),
  });

  const [, drag] = useDrag({
    type: 'PROJECT',
    item: () => ({ id: project.IdProject, index }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        handleDrop(item.id, dropResult.targetId);
      }
    },
  });

 drag(dropFinish(dropHover(ref)));

  return (
    <div ref={ref} className={styles.home_admin_section__id_block}>
      <div className={styles.home_admin_section__circle_block}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.home_admin_section__circle} />
        ))}
      </div>
      <div>id: {project.IdProject}</div>
      <button className={styles.home_admin_section__button_del} onClick={() => handleFormDelete(project.IdProject)}>
        <svg width="24" height="24" fill="none">
          <path d="M9 9L15 15" stroke="#1D2E43" strokeLinecap="round" />
          <path d="M15 9L9 15" stroke="#1D2E43" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
