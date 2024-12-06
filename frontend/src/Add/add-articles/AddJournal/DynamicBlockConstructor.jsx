import React from 'react';
import styles from './DynamicBlockConstructor.module.scss';

export default function DynamicBlockConstructor({ blocks, onAddBlock, onRemoveBlock }) {
  return (
    <div className={styles.dynamicConstructor}>
      <h3>Динамические блоки</h3>
      <button type="button" onClick={() => onAddBlock({ id: Date.now(), content: '' })}>
        Добавить блок
      </button>
      {blocks.map((block, index) => (
        <div key={index} className={styles.block}>
          <textarea
            className={styles.textarea}
            value={block.content}
            onChange={(e) => onAddBlock(blocks.map((b, i) => (i === index ? { ...b, content: e.target.value } : b)))}
          />
          <button type="button" onClick={() => onRemoveBlock(index)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}
