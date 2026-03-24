import React from 'react';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Icon6 } from '../../ui/EntityRow/icon';
import photoSrc from './utils/photo';
import s from './Styles.module.css';

const COLS = 3;

export default function StaffList({ items, canDelete, canEdit, canDrag, onEdit, onToggle, onDelete }) {
  const rows = [];
  for (let i = 0; i < (items?.length || 0); i += COLS) {
    rows.push(items.slice(i, i + COLS));
  }

  return (
    <div className={s.list}>
      {rows.map((row, rowIdx) => (
        <Droppable key={rowIdx} droppableId={`row-${rowIdx}`} direction="horizontal">
          {(droppableProvided) => (
            <div
              className={s.row}
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {row.map((el, colIdx) => (
                <Draggable
                  key={el.id}
                  draggableId={String(el.id)}
                  index={colIdx}
                  isDragDisabled={!canDrag}
                >
                  {(draggableProvided) => (
                    <div
                      className={s.item}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                    >
                      <div className={s.wrapImg}>
                        <div className={s.iconDrag} {...draggableProvided.dragHandleProps}>
                          <Icon6 />
                        </div>
                        <img className={s.itemImg} src={photoSrc(el)} alt="staff" />
                        <div className={s.wrapBtn}>
                          {canEdit && (
                            <MarksEntityActions
                              canDelete={canDelete}
                              hidden={el.hidden ?? !el.isVisible}
                              onEdit={() => onEdit(el)}
                              onToggle={() => onToggle(el)}
                              onDelete={() => onDelete(el)}
                            />
                          )}
                        </div>
                      </div>
                      <div className={s.itemName}>
                        {el.name}
                        {el.position ? ` — ${el.position}` : ''}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}
