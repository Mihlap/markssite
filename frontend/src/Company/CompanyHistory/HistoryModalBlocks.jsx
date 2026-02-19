import { memo } from 'react';
import StaffModalBlocks from '../StaffModalBlocks';
import styles from './HistoryModalBlocks.module.scss';

function HistoryModalBlocks({ selectedCard, bucketUrl = '' }) {
  if (!selectedCard) return null;
  return <StaffModalBlocks selectedCard={selectedCard} bucketUrl={bucketUrl} styles={styles} />;
}

export default memo(HistoryModalBlocks);
