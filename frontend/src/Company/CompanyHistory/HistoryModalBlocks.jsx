import { memo } from 'react';
import StaffModalBlocks from '../StaffModalBlocks';
import staffModalStyles from '../StaffModalBlocks.module.scss';

function HistoryModalBlocks({ selectedCard, bucketUrl = '' }) {
  return <StaffModalBlocks selectedCard={selectedCard} bucketUrl={bucketUrl} styles={staffModalStyles} />;
}

export default memo(HistoryModalBlocks);
