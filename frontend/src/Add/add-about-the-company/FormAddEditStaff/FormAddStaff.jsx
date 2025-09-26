import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from '../../../Add/add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../Add/style/style-card.module.scss';

import PhotoNameBlock from './PhotoNameBlock';
import CategoryBlock from './CategoryBlock';
import DescriptionBlock from './DescriptionBlock';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

import { usePreviewHandlers } from '../utils/hooks/usePreviewHandlers';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose';

import { createStaffAsync } from '../../../store/Slice/StaffSliceNew';

export default function FormAddStaff({ initial = null, onClose, registerCloseGuard, currentCategory = null }) {
  const dispatch = useDispatch();

  const [previewPhotoAva, setPreviewPhotoAva] = useState([]);
  const [isPhotoAvaVisible, setIsPhotoAvaVisible] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [inputData, setInputData] = useState({
    name: '',
    position: '',
    category: [],
    description: '',
    img: null,
    isVisible: true,
  });
 
  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);  
  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

  if (registerCloseGuard) registerCloseGuard(() => setShowExitConfirm(true));

  useEffect(() => {
    if (initial) {
      setInputData((p) => ({ ...p, ...initial }));
      if (initial.img) setPreviewPhotoAva([{ url: initial.img }]);
    }
  }, [initial]);

  const { handleRemovePreviewPhotoAva } = usePreviewHandlers({
    previewPhotoAva,
    setPreviewPhotoAva,
    previewPhotoOpen: [],
    setPreviewPhotoOpen: () => {},
    previewPhotoClose: [],
    setPreviewPhotoClose: () => {},
    inputData,
    setInputData,
    setIsDropPhotoVisible: () => {},
    setIsPhotoAvaVisible,
    setIsPhotoOpenVisible: () => {},
    setIsPhotoCloseVisible: () => {},
  });

  const validate = useCallback(() => {
    if (!inputData.name || !inputData.category || inputData.category.length === 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3500);
      return false;
    }
    return true;
  }, [inputData]);

  const submitHandler = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!validate()) return;

      const payload = {
        ...inputData,
        category: Array.isArray(inputData.category) ? inputData.category : [inputData.category],
      };

      try {
        await dispatch(createStaffAsync(payload));
        onClose?.();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, inputData, onClose, validate]
  );

  const setIsFocused = () => {};

  return (
    <div className={styles.form_container}>
      {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля!</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.form_container__title}>Новый сотрудник</div>

        <button
          type="button"
          className={adminStyles.card_components_admin__close_button}
          onClick={() => setShowExitConfirm(true)}
          aria-label="Закрыть"
        />
      </div>

      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler}>
          <PhotoNameBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            previewPhotoAva={previewPhotoAva}
            setPreviewPhotoAva={setPreviewPhotoAva}
            handleRemovePreviewPhotoAva={handleRemovePreviewPhotoAva}
          />

          <CategoryBlock
            styles={styles}
            inputData={inputData}
            setInputData={setInputData}
            setIsFocused={setIsFocused}
            currentCategory={currentCategory}
            isEditing={!!initial}
          />

          <DescriptionBlock styles={styles} inputData={inputData} setInputData={setInputData} />

          <SubmitButtons
            classNames={{
              wrapper: styles.form_container__button_block,
              save: styles.form_container__button_save,
              cancel: styles.form_container__button_cancel,
            }}
            onCancel={() => setShowExitConfirm(true)}
          />
        </form>

        <ExitConfirmModal
          open={showExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
          onLeave={() => onClose && onClose()}
        />
      </div>
    </div>
  );
}
