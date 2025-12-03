import { memo, useMemo } from 'react';
import Select from 'react-select';

import {
    YearDropdownIndicator,
    YearValueContainer,
} from '../../add-project/FormAddEditProject/utils/CustomSelectComponents';
import historyStyles from './CompanyHistory.module.scss';

const MAX_PREVIEW_LENGTH = 160;

function HistoryHeaderBlock({
    styles,
    inputData,
    setInputData,
    fieldErrors,
    customStyles,
}) {
    const yearOptions = useMemo(() => {
        const current = new Date().getFullYear();
        const from = current - 50;
        const to = current + 5;
        const result = [];
        for (let y = to; y >= from; y -= 1) {
            result.push({ value: y, label: String(y) });
        }
        return result;
    }, []);

    const selectedYear = useMemo(
        () =>
            yearOptions.find((opt) => String(opt.value) === String(inputData.year)) || null,
        [yearOptions, inputData.year]
    );

    const onYearChange = (option) => {
        setInputData((prev) => ({
            ...prev,
            year: option ? option.value : '',
        }));
    };

    const onTitleChange = (e) => {
        const { value } = e.target;
        setInputData((prev) => ({ ...prev, title: value }));
    };

    const onDescriptionChange = (e) => {
        const raw = e.target.value || '';
        const value = raw.slice(0, MAX_PREVIEW_LENGTH);
        setInputData((prev) => ({ ...prev, description: value }));
    };

    const previewLength = (inputData.description || '').length;

    return (
        <>
            {/* Верхний серый блок: Год + Заголовок года (как в HeaderFields) */}
            <div
                className={`${styles.form_container__block_gray_one} ${historyStyles.historyHeaderBlock}`}
            >        
                <div className={`${styles.form__group} ${styles.field}`}>
                    <Select
                        inputId="historyYear"
                        styles={customStyles}
                        className={styles.form__field}
                        value={selectedYear}
                        onChange={onYearChange}
                        options={yearOptions}
                        placeholder="Год"
                        components={{
                            DropdownIndicator: YearDropdownIndicator,
                            ValueContainer: YearValueContainer,
                        }}
                    />
                    {/* <label htmlFor="historyYear" className={styles.form__label}></label> */}
                </div>
                {fieldErrors.year && (
                    <div className={styles.required_hint}>{fieldErrors.year}</div>
                )}
            
                <div className={`${styles.form__group} ${styles.field}`}>
                    <input
                        type="input"
                        className={`${styles.form__field} ${fieldErrors.title ? styles.input_error : ''
                            }`}
                        placeholder="title"
                        name="title"
                        id="historyTitle"
                        value={inputData.title}
                        onChange={onTitleChange}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="historyTitle" className={styles.form__label}>
                        Заголовок года
                    </label>
                </div>
                {fieldErrors.title && (
                    <div className={styles.required_hint}>{fieldErrors.title}</div>
                )}
            </div>

            {/* Карточка превью, как на макете */}
            <div className={historyStyles.historyPreviewCard}>
                <div className={historyStyles.historyPreviewHeader}>
                    <div className={historyStyles.historyPreviewTitleRow}>
                        <span className={styles.form_container__heading_block_label}>Превью</span>
                        <span className={historyStyles.historyPreviewSub}>
                            *для отображения в хронике
                        </span>
                    </div>

                    <div className={historyStyles.historyPreviewActions}>
                        <button
                            type="button"
                            className={`${styles.slider_container__customFileUploadStaff} ${historyStyles.historyPreviewUploadButton}`}
                        >
                            <span className={styles.slider_container__svg}>📎</span>
                            <span className={styles.slider_container__uploadTextForm}>
                                Загрузить изображение
                            </span>
                        </button>

                        {/* маленькая иконка-инфо справа от кнопки, как на макете */}
                        <button
                            type="button"
                            className={historyStyles.historyPreviewInfo}
                            aria-label="Подсказка по превью"
                        >
                            i
                        </button>
                    </div>
                </div>

                <div className={historyStyles.historyPreviewBody}>
                    {/* подпись "Текст превью" над тулбаром */}
                    <div className={historyStyles.historyPreviewLabelRow}>
                        <span className={styles.form_container__textarea_label_constructor}>
                            Текст превью
                        </span>
                    </div>

                    {/* панель форматирования-заглушка */}
                    <div className={historyStyles.historyPreviewToolbar}>
                        <button type="button" className={historyStyles.historyToolbarButton}>
                            B
                        </button>
                        <button type="button" className={historyStyles.historyToolbarButton}>
                            U
                        </button>
                        <button type="button" className={historyStyles.historyToolbarButton}>
                            •
                        </button>
                    </div>

                    {/* textarea в стиле TitleTextBlock */}
                    <div className={styles.form_container__description_text}>
                        <div className={styles.form_container__textarea_length}>
                            {previewLength}/{MAX_PREVIEW_LENGTH}
                        </div>
                        <textarea
                            className={`${styles.form_container__textarea} ${fieldErrors.description ? styles.input_error : ''
                                }`}
                            autoComplete="off"
                            required
                            name="description"
                            id="historyPreviewText"
                            rows={4}
                            placeholder="Не более 160 символов"
                            value={inputData.description}
                            onChange={onDescriptionChange}
                        />
                        <label
                            htmlFor="historyPreviewText"
                            className={styles.form_container__textarea_label_constructor}
                        >
                            Текст превью
                        </label>
                    </div>

                    {fieldErrors.description && (
                        <div className={styles.required_hint}>{fieldErrors.description}</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(HistoryHeaderBlock);
