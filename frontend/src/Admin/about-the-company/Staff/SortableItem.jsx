import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item from "./Item";

const SortableItem = ({ el, canDrag, canEdit, canDelete, onEdit, onToggle, onDelete }) => {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: el.id, disabled: !canDrag });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    return (
        <Item
            ref={setNodeRef}
            style={style}
            withOpacity={isDragging}
            isDragging={isDragging}
            el={el}
            dragListeners={listeners}
            dragAttributes={attributes}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
        />
    );
};

export default SortableItem;
