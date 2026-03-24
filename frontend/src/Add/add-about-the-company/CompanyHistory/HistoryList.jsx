import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import MarksEntityRow from '../../ui/EntityRow/MarksEntityRow';
import { Icon6 } from '../../ui/EntityRow/icon';
import s from './HistoryList.module.css';

export default function HistoryList({ items, canDelete, canEdit, canDrag, onEdit, onToggle, onDelete }) {
  return (
    <Droppable droppableId="history-list">
      {(provided) => (
        <div className={s.list} ref={provided.innerRef} {...provided.droppableProps}>
          {items?.map((el, index) => (
            <Draggable key={el.id} draggableId={String(el.id)} index={index} isDragDisabled={!canDrag}>
              {(provided, snapshot) => (
                <div
                  className={s.row}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={{
                    ...provided.draggableProps.style,
                    transition: snapshot.isDropAnimating ? 'all 0.3s ease' : provided.draggableProps.style?.transition,
                  }}>
                  <div {...provided.dragHandleProps}>
                    <MarksEntityRow
                      title={el.title || String(el.year)}
                      desc={String(el.year)}
                      role={canDelete ? 'admin' : canEdit ? 'manager' : ''}
                      hidden={el.hidden}
                      visible="event"
                      onEdit={() => onEdit(el)}
                      onToggle={() => onToggle(el)}
                      onDelete={() => onDelete(el)}
                    />
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
