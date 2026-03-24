import React from 'react';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Icon6 } from '../../ui/EntityRow/icon';
import photoSrc from './utils/photo';
import s from './Styles.module.css';

const COLS = 3;

export default function StaffList({ items, canDelete, canEdit, canDrag, onEdit, onToggle, onDelete }) {
  const columns = [[], [], []];
  (items || []).forEach((item, i) => columns[i % COLS].push(item));

  return (
    <div className={s.list}>
      {columns.map((col, colIdx) => (
        <Droppable key={colIdx} droppableId={`col-${colIdx}`}>
          {(provided) => (
            <div className={s.column} ref={provided.innerRef} {...provided.droppableProps}>
              {col.map((el, index) => (
                <Draggable key={el.id} draggableId={String(el.id)} index={index} isDragDisabled={!canDrag}>
                  {(provided, snapshot) => (
                    <div
                      title={el.position}
                      className={s.item}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        transition: snapshot.isDropAnimating
                          ? 'all 0.3s ease'
                          : provided.draggableProps.style?.transition,
                      }}
                    >
                      <div {...provided.dragHandleProps}>
                        <div className={s.wrapImg}>
                          <div className={s.iconDrag}>
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}
