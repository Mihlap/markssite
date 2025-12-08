import {
    memo,
    useMemo,
    useState,
    useRef,
    useCallback,
    useEffect,
} from 'react';
import Select from 'react-select';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import historyStyles from '../CompanyHistory.module.scss';

import YearDropdownIndicator from '../../utils/YearDropdownIndicator';
import YearMenuList from '../../utils/YearMenuList';
import { buildYearSelectStyles } from '../../utils/yearSelectStyles';
import { useInfoTooltip } from '../../utils/useInfoTooltip';

import InfoTooltip from '../../FormAddEditStaff/InfoTooltip';

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

    const pivotYear = selectedYear?.value || currentYear;
    const yearSelectStyles = useMemo(() => buildYearSelectStyles(), []);
    const [previewImage, setPreviewImage] = useState(
        inputData.previewImageUrl ? { url: inputData.previewImageUrl } : null
    );
    const fileInputRef = useRef(null);
    const { ref: infoBtnRef, open: helpOpen, toggle: toggleHelp, closeTooltip: closeHelp } = useInfoTooltip(false);

    const revokePreview = useCallback((p) => {
        try {
            if (p?.url && !inputData.previewImageUrl) {
                URL.revokeObjectURL(p.url);
            }
        } catch { }
    }, [inputData.previewImageUrl]);

    const onPreviewFileChange = useCallback(
        (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            if (previewImage) revokePreview(previewImage);

            const url = URL.createObjectURL(file);
            setPreviewImage({ file, url });

            setInputData((prev) => ({
                ...prev,
                previewImageFile: file,
                previewImageUrl: url,
            }));

            e.target.value = '';
        },
        [previewImage, revokePreview, setInputData]
    );

    const removePreviewImage = useCallback(() => {
        if (previewImage) revokePreview(previewImage);
        setPreviewImage(null);

        setInputData((prev) => ({
            ...prev,
            previewImageFile: null,
            previewImageUrl: '',
        }));

        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [previewImage, revokePreview, setInputData]);

    useEffect(
        () => () => {
            if (previewImage) revokePreview(previewImage);
        },
        [previewImage, revokePreview]
    );

    const handlePreviewTextChange = (value) => {
        const plain = value
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();
        const limitedPlain = plain.slice(0, MAX_PREVIEW_LENGTH);

        let finalValue = value;
        if (plain.length > MAX_PREVIEW_LENGTH) {
            finalValue = limitedPlain;
        }

        setInputData((prev) => ({
            ...prev,
            previewText: finalValue,
        }));
    };

    const previewPlainText = (inputData.previewText || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();

    const previewLength = previewPlainText.length;

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
                        type="text"
                        className={`${styles.form__field} ${fieldErrors.title ? styles.input_error : ''
                            }`}
                        placeholder="Заголовок года"
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

            <div
                className={`${styles.form_container__block_gray_one} ${historyStyles.historyPreviewCard}`}
            >
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
                        <label
                            className={styles.slider_container__customFileUploadStaff}
                            style={{marginTop: '6px'}}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="historyPreviewImg"
                                accept="image/*"
                                onChange={onPreviewFileChange}
                                style={{ display: 'none' }}
                            />
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                                    stroke="currentColor"
                                    strokeWidth="0.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <div className={styles.slider_container__uploadTextForm}>
                                Загрузить изображение
                            </div>
                        </label>
                 
                        <button
                            ref={infoBtnRef}
                            type="button"
                            onClick={toggleHelp}
                            aria-label="Помощь"
                            style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '8px', cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M7.9987 10.6087V7.27539M7.99479 5.27539H8.00078M7.9987 1.27539C11.6654 1.27539 14.6654 4.27539 14.6654 7.94206C14.6654 11.6087 11.6654 14.6087 7.9987 14.6087C4.33203 14.6087 1.33203 11.6087 1.33203 7.94206C1.33203 4.27539 4.33203 1.27539 7.9987 1.27539Z"
                                    stroke="#566272"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <InfoTooltip
                            title="Ознакомьтесь"
                            linkText="с рекомендациями"
                            linkHref="#"
                            placement="top"
                            tipStyle={{ width: 203 }}
                            anchorRef={infoBtnRef}
                            isOpen={helpOpen}
                            onOpenChange={(v) => {
                                if (!v) closeHelp();
                            }}
                            onClose={closeHelp}
                        />
                    </div>
                </div>

                {previewImage && (
                    <div className={styles.preview_photos_container__block}>
                        <img
                            className={styles.preview_photos_container__img}
                            src={previewImage.url}
                            alt="Preview"
                        />
                        <div
                            className={styles.preview_photos_container__remove_icon}
                            onClick={removePreviewImage}
                        >
                            <span></span>
                        </div>
                    </div>
                )}

                <div className={historyStyles.historyPreviewBody}>
                   <div
                        className={styles.form_container__description_text}
                        style={{ position: 'relative' }}
                    >
                        <div className={styles.form_container__textarea_length}>
                            {previewLength}/{MAX_PREVIEW_LENGTH}
                        </div>

                        <ReactQuill
                            modules={{
                                toolbar: [
                                    ['bold', 'underline'],
                                    [{ list: 'bullet' }],
                                ],
                                clipboard: {
                                    matchVisual: false,
                                },
                            }}
                            formats={['bold', 'underline', 'list']}
                            className={styles.form_container__textarea}
                            style={{
                                padding: 0,
                                border: '1px solid var(--blue-75BBFD)',
                                fontFamily: 'var(--font-raleway)',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 'var(--fw-400)',
                                lineHeight: '16px',
                                color: 'var(---black-1D2E43)',
                                boxSizing: 'border-box',
                                paddingBottom: '2.5rem',
                                whiteSpace: 'pre-wrap',
                            }}
                            value={inputData.previewText || ''}
                            onChange={handlePreviewTextChange}
                            placeholder="Не более 160 символов"
                        />

                        <label
                            htmlFor="historyPreviewText"
                            className={styles.form_container__textarea_label_constructor}
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
