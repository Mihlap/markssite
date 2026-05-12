import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Grid from './Grid';
import Item from './Item';

const swapIds = (ids, fromId, toId) => {
  if (fromId === toId) return ids;
  const next = ids.slice();
  const from = next.indexOf(fromId);
  const to = next.indexOf(toId);
  if (from === -1 || to === -1) return ids;
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};

const List = ({ items: externalItems, canDrag, canEdit, canDelete, onEdit, onToggle, onDelete, onReorder }) => {
  const [orderIds, setOrderIds] = useState(() => (externalItems || []).map((x) => x.id));
  const [dragId, setDragId] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setOrderIds((externalItems || []).map((x) => x.id));
    setDirty(false);
  }, [externalItems]);

  const byId = useMemo(() => {
    const m = new Map();
    for (const it of externalItems || []) m.set(it.id, it);
    return m;
  }, [externalItems]);

  const handleDragStart = useCallback((e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragEnter = useCallback((e, overId) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    setOrderIds((prev) => {
      const next = swapIds(prev, dragId, overId);
      if (next !== prev) setDirty(true);
      return next;
    });
  }, [dragId]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dirty) {
      setDragId(null);
      return;
    }
    const next = orderIds.map((id) => byId.get(id)).filter(Boolean);
    onReorder?.(next);
    setDragId(null);
    setDirty(false);
  }, [dirty, orderIds, byId, onReorder]);

  return (
    <div onDragOver={handleDragOver} onDrop={handleDragEnd}>
      <Grid columns={3}>
        {orderIds.map((id) => {
          const el = byId.get(id);
          if (!el) return null;
          return (
            <Item
              key={el.id}
              el={el}
              draggable={canDrag}
              isDragging={dragId === el.id}
              onDragStart={canDrag ? (e) => handleDragStart(e, el.id) : undefined}
              onDragEnter={canDrag ? (e) => handleDragEnter(e, el.id) : undefined}
              onDragEnd={canDrag ? handleDragEnd : undefined}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default List;
