import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, closestCenter, MouseSensor, TouchSensor, DragOverlay, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import Grid from './Grid';
import SortableItem from './SortableItem';
import Item from './Item';

const List = ({ items: externalItems, canDrag, canEdit, canDelete, onEdit, onToggle, onDelete, onReorder }) => {
  const [items, setItems] = useState(externalItems || []);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    setItems(externalItems || []);
  }, [externalItems]);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const next = arrayMove(prev, oldIndex, newIndex);
        onReorder?.(next);
        return next;
      });
    }

    setActiveId(null);
  }, [onReorder]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}>
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <Grid columns={3}>
          {items.map((el) => (
            <SortableItem
              key={el.id}
              el={el}
              canDrag={canDrag}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: '0 0' }}>
        {activeItem ? (
          <Item
            el={activeItem}
            isDragging
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default List;
