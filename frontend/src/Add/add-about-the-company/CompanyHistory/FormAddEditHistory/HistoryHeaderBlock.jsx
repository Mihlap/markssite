import { memo, useMemo, useState } from 'react';
import Select from 'react-select';

import YearDropdownIndicator from '../../utils/YearDropdownIndicator';
import YearMenuList from '../../utils/YearMenuList';
import { buildYearSelectStyles } from '../../utils/yearSelectStyles';

import historyStyles from '../CompanyHistory.module.scss';

const MAX_PREVIEW_LENGTH = 160;

function HistoryHeaderBlock({
    styles,
    inputData,
    setInputData,
    fieldErrors,
}) {
    const currentYear = new Date().getFullYear();

    const [isTitleFocused, setIsTitleFocused] = useState(false);

    const yearOptions = useMemo(() => {
        const from = currentYear - 25;
        const to = currentYear + 25;
        const result = [];
        for (let y = to; y >= from; y -= 1) {
            result.push({ value: y, label: String(y) });
        }
        return result;
    }, [currentYear]);

    const selectedYear =
        yearOptions.find(
            (opt) => String(opt.value) === String(inputData.year)
        ) || null;

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

    const pivotYear = selectedYear?.value || currentYear;
    const yearSelectStyles = useMemo(() => buildYearSelectStyles(), []);

    return (
        <>
            <div
                className={`${styles.form_container__block_gray_one} ${historyStyles.historyHeaderBlock}`}
            >              
                <div className={`${styles.form__group} ${styles.field}`}>
                    <Select
                        inputId="historyYear"
                        name="historyYear"
                        styles={yearSelectStyles}
                        className={historyStyles.yearSelect}
                        value={selectedYear}
                        onChange={onYearChange}
                        options={yearOptions}
                        placeholder="Год"
                        components={{
                            DropdownIndicator: YearDropdownIndicator,
                            MenuList: YearMenuList,
                            IndicatorSeparator: null,
                        }}
                        pivotYear={pivotYear}
                        menuPlacement="auto"
                        isSearchable={false}
                    />
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
                        onFocus={() => setIsTitleFocused(true)}
                        onBlur={() => setIsTitleFocused(false)}
                        style={{
                            border: 'none',
                            borderBottom: `1px solid ${isTitleFocused ? '#75BBFD' : '#959DA6'
                                }`,
                            outline: 'none',
                            caretColor: isTitleFocused ? '#75BBFD' : '#959DA6',
                            color: 'var(--gray-959DA6, #959DA6)',
                            fontVariantNumeric: 'lining-nums proportional-nums',
                            fontFamily: 'Raleway',
                            fontSize: 16,
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '16px',
                        }}
                    />
                    <label
                        htmlFor="historyTitle"
                        className={`${styles.form__label} ${historyStyles.historyHeaderLabel}`}
                    >
                        Заголовок года
                    </label>
                </div>

                {fieldErrors.title && (
                    <div className={styles.required_hint}>{fieldErrors.title}</div>
                )}
            </div>

            {/* Превью-карточка */}
            <div className={historyStyles.historyPreviewCard}>
                <div className={historyStyles.historyPreviewHeader}>
                    <div className={historyStyles.historyPreviewTitleRow}>
                        <span className={styles.form_container__heading_block_label}>
                            Превью
                        </span>
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
                    <div className={historyStyles.historyPreviewLabelRow}>
                        <span className={styles.form_container__textarea_label_constructor}>
                            Текст превью
                        </span>
                    </div>

                    <div className={historyStyles.historyPreviewToolbar}>
                        <button
                            type="button"
                            className={historyStyles.historyToolbarButton}
                        >
                            B
                        </button>
                        <button
                            type="button"
                            className={historyStyles.historyToolbarButton}
                        >
                            U
                        </button>
                        <button
                            type="button"
                            className={historyStyles.historyToolbarButton}
                        >
                            •
                        </button>
                    </div>

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
                            className={
                                styles.form_container__textarea_label_constructor
                            }
                        >
                            Текст превью
                        </label>
                    </div>

                    {fieldErrors.description && (
                        <div className={styles.required_hint}>
                            {fieldErrors.description}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(HistoryHeaderBlock);
