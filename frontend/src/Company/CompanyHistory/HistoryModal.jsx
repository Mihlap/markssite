import Modal from 'react-modal';

import HistoryModalBlocks from './HistoryModalBlocks';
import styles from './HistoryModal.module.scss';

export default function HistoryModal({
    isOpen,
    selectedHistoryItem,
    onClose,
}) {
    if (!isOpen || !selectedHistoryItem) return null;

    return (
        <Modal
            className={styles.modal_wrapper}
            isOpen={isOpen}
            onRequestClose={onClose}
            onAfterOpen={() => {
                document.body.style.overflow = 'hidden';
                document.body.classList.add('modal-open');
            }}
            onAfterClose={() => {
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open');
            }}
            ariaHideApp={false}
            style={{
                overlay: { zIndex: 10, backgroundColor: '#2C3B447A' },
                content: { zIndex: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' },
            }}
        >
            <div key={selectedHistoryItem.id} className={styles.modal_context}>
                <div
                    className={`${styles.modal_close} ${styles.fixed}`}
                    onClick={onClose}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
                            fill="black"
                        />
                    </svg>
                </div>

                {(selectedHistoryItem.year || selectedHistoryItem.title) && (
                    <div className={styles.modal_title}>
                        {selectedHistoryItem.year}
                        {selectedHistoryItem.year && selectedHistoryItem.title && ' — '}
                        {selectedHistoryItem.title}
                    </div>
                )}

                <HistoryModalBlocks
                    selectedCard={selectedHistoryItem}
                    bucketUrl={process.env.REACT_APP_S3_BUCKET_URL}
                />
            </div>
        </Modal>
    );
}

