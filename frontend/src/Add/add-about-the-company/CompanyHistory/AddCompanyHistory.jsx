import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../style/style-card.module.scss';

import HistoryModalManager from './HistoryModalManager';
import HistoryList from './HistoryList';

import {
  fetchCompanyHistory,
} from '../../../store/Slice/companyHistorySlice';

export default function AddCompanyHistory({ user }) {
  const dispatch = useDispatch();

  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [editHistoryData, setEditHistoryData] = useState(null);
  const [modalBlockHeight, setModalBlockHeight] = useState('auto');

  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      const maxHeight = Math.min(windowHeight - 100, 1900);
      setModalBlockHeight(`${maxHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    dispatch(fetchCompanyHistory());
  }, [dispatch]);

  const handleOpenModal = useCallback(() => {
    setEditHistoryData(null);
    setIsModalOpenHistory(true);
  }, []);

  return (
    <div className={styles.card_components_admin__blockAddSlide} style={{paddingTop: 22, paddingBottom: 64}}>
      <span className={styles.card_components_admin__title}>История MARKS GROUP</span>

      <div className={styles.card_components_admin__button_block}      
        // onClick={handleOpenModal}
      >
        <button className={styles.card_components_admin__button}>
          <div>
            <svg
              className={styles.card_components_admin__icon}
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g>
                <circle cx="20.5" cy="20" r="20" fill="#F6F6F6" />
                <path
                  d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                  stroke="#75BBFD"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </g>
            </svg>
          </div>
          <div className={styles.card_components_admin__button_text}>Добавить год</div>
        </button>
      </div>

      <HistoryModalManager
        isModalOpenHistory={isModalOpenHistory}
        setIsModalOpenHistory={setIsModalOpenHistory}
        editHistoryData={editHistoryData}
        setEditHistoryData={setEditHistoryData}
        modalBlockHeight={modalBlockHeight}
      />

      <HistoryList user={user} setIsModalOpenHistory={setIsModalOpenHistory} setEditHistoryData={setEditHistoryData} />
    </div>
  );
}
