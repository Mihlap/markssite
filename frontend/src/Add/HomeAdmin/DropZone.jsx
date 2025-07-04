import { memo } from 'react';
import { useDrop } from 'react-dnd';

export default memo(function DropZone({ onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'PROJECT',
    drop: (item) => onDrop(item.id, null),
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  return (
    <div
      ref={drop}
      style={{
        flexBasis: 8,
        flexShrink: 0,
        height: '100%',
        background: isOver ? 'rgba(0,150,250,0.15)' : 'transparent',
        cursor: 'pointer',
      }}
    />
  );
});
