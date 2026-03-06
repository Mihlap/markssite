import Modal from 'react-modal';
import styles from './HistoryYearPickerModal.module.scss';

function getTitleForYear(cardsByYear, year) {
    const group = cardsByYear?.[year];
    const first =
        group?.top?.[0] ?? group?.bottom?.[0];
    return first?.title ?? '';
}

export default function HistoryYearPickerModal({
    isOpen,
    onClose,
    years = [],
    cardsByYear = {},
    activeYearIndex = 0,
    onSelectYear,
}) {
    if (!isOpen) return null;

    const handleSelectYear = (idx, year) => {
        if (typeof onSelectYear === 'function') {
            onSelectYear({ index: idx, year });
        }

        if (typeof onClose === 'function') {
            onClose();
        }
    };

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
                overlay: { zIndex: 10, backgroundColor: 'rgba(44, 59, 68, 0.5)' },
                content: {
                    zIndex: 10,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: '50%',
                    height: '100vh',
                    maxHeight: '100vh',
                    width: '50vw',
                    margin: 0,
                    padding: 0,
                    border: 'none',
                    overflow: 'hidden',
                },
            }}
        >
            <div className={styles.modal_content}>
                <button
                    type="button"
                    className={styles.modal_close}
                    onClick={onClose}
                    aria-label="Закрыть"
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
                            fill="currentColor"
                        />
                    </svg>
                </button>

                <h2 className={styles.modal_heading}>История MARKS GROUP</h2>

                <div className={styles.year_list}>
                    {years.map((year, idx) => {
                        const title = getTitleForYear(cardsByYear, year);
                        const isActive = idx === activeYearIndex;

                        const handleClick = () => handleSelectYear(idx, year);

                        return (
                            <div
                                key={year}
                                className={styles.year_row}
                                data-active={isActive ? 'true' : undefined}
                                onClick={handleClick}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleClick();
                                    }
                                }}
                            >
                                <span className={styles.year_value}>{year}</span>
                                {title ? (
                                    <span className={styles.year_title}>{title}</span>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
}
