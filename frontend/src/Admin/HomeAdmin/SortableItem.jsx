import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item from "./Item";

const SortableItem = ({ el, handleFormDelete }) => {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: el.IdProject });

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
        id={el.IdProject}
        dragListeners={listeners}
        dragAttributes={attributes}
        onDelete={handleFormDelete}
      />
    );
};

export default SortableItem;
