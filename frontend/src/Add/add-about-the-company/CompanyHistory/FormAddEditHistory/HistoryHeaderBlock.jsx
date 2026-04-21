import {
    memo,
    useMemo,
    useState,
    useRef,
    useCallback,
    useEffect,
} from 'react';
import Select from 'react-select';

import historyStyles from '../CompanyHistory.module.scss';

import YearDropdownIndicator from '../../utils/YearDropdownIndicator';
import YearMenuList from '../../utils/YearMenuList';
import { buildYearSelectStyles } from '../../utils/yearSelectStyles';
import { useInfoTooltip } from '../../utils/useInfoTooltip';
import { truncateHtmlPreservingFormat } from '../../utils/htmlUtils';
import { toBucketSrc } from '../../utils/imageUtils';
import { PORTRAIT_CONTAINER_STYLE, PORTRAIT_IMG_STYLE } from '../../utils/portraitPreview';

import InfoTooltip from '../../FormAddEditStaff/InfoTooltip';
import QuillField from '../../../../UI/QuillField/QuillField';

const MAX_PREVIEW_LENGTH = 160;

function HistoryHeaderBlock({
    styles,
    inputData,
    setInputData,
    forceValidate = 0,
}) {
    const currentYear = new Date().getFullYear();
    const [isTitleFocused, setIsTitleFocused] = useState(false);
    const [touched, setTouched] = useState({ year: false, title: false, photo: false, previewText: false });

    const yearSelectRef = useRef(null);
    const titleInputRef = useRef(null);
    const uploadBtnRef = useRef(null);
    const previewTextRef = useRef(null);

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

    const onYearChange = useCallback((option) => {
        setTouched((t) => ({ ...t, year: true }));
        setInputData((prev) => ({
            ...prev,
            year: option ? option.value : '',
        }));
    }, [setInputData]);

    const onTitleChange = useCallback((e) => {
        const { value } = e.target;
        if (!touched.title) setTouched((t) => ({ ...t, title: true }));
        setInputData((prev) => ({ ...prev, title: value }));
    }, [setInputData, touched.title]);
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
            setTouched((t) => ({ ...t, photo: true }));
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
        setTouched((t) => ({ ...t, photo: true }));
    }, [previewImage, revokePreview, setInputData]);

    useEffect(() => {
        if (inputData.previewImageUrl && !previewImage) {
            const fullUrl = toBucketSrc(inputData.previewImageUrl);
            setPreviewImage({ url: fullUrl });
        } else if (!inputData.previewImageUrl && previewImage && !previewImage.file) {
            setPreviewImage(null);
        } else if (
            inputData.previewImageUrl &&
            previewImage &&
            previewImage.url !== toBucketSrc(inputData.previewImageUrl) &&
            !previewImage.file
        ) {
            const fullUrl = toBucketSrc(inputData.previewImageUrl);
            setPreviewImage({ url: fullUrl });
        }
    }, [inputData.previewImageUrl, previewImage]);

    useEffect(
        () => () => {
            if (previewImage) revokePreview(previewImage);
        },
        [previewImage, revokePreview]
    );

    const handlePreviewTextChange = useCallback((value) => {
        const plain = value
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();

        let finalValue = value;
        if (plain.length > MAX_PREVIEW_LENGTH) {
            finalValue = truncateHtmlPreservingFormat(value, MAX_PREVIEW_LENGTH);
        }

        if (!touched.previewText) setTouched((t) => ({ ...t, previewText: true }));
        setInputData((prev) => ({
            ...prev,
            previewText: finalValue,
        }));
    }, [setInputData, touched.previewText]);

    const previewPlainText = (inputData.previewText || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();

    const previewLength = previewPlainText.length;

    const yearEmpty = !inputData.year;
    const titleEmpty = !String(inputData?.title || '').trim();
    const photoEmpty = !previewImage && !inputData.previewImageUrl;
    const previewTextEmpty = !previewPlainText || previewLength === 0;

    const pivotYear = selectedYear?.value || currentYear;
    const hasYearError = touched.year && yearEmpty;
    const yearSelectStyles = useMemo(() => buildYearSelectStyles(hasYearError), [hasYearError]);

    useEffect(() => {
        if (!forceValidate) return;
        setTouched({ year: true, title: true, photo: true, previewText: true });
        const firstInvalid =
            (yearEmpty && yearSelectRef.current) ||
            (titleEmpty && titleInputRef.current) ||
            (photoEmpty && uploadBtnRef.current) ||
            (previewTextEmpty && previewTextRef.current) ||
            null;
        if (firstInvalid) {
            firstInvalid.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
            firstInvalid.focus?.({ preventScroll: true });
        }
    }, [forceValidate, yearEmpty, titleEmpty, photoEmpty, previewTextEmpty]);

    return (
        <>
            <style>{`
                .qlScope-historyPreviewText .ql-editor.ql-blank::before {
                    color: #959DA6;
                    font-variant-numeric: lining-nums proportional-nums;
                    font-family: Raleway;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 16px;
                }
                .qlScope-historyPreviewText {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                .qlScope-historyPreviewText .ql-container {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                .qlScope-historyPreviewText .ql-editor {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    white-space: pre-wrap;
                }
            `}</style>
            <div
                className={`${styles.form_container__block_gray_one} ${historyStyles.historyHeaderBlock}`}
            >
                <div className={`${styles.form__group} ${styles.field}`} style={{ position: 'relative' }}>
                    <div ref={yearSelectRef}>
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
                            onBlur={() => setTouched((t) => ({ ...t, year: true }))}
                        />
                    </div>
                    {touched.year && yearEmpty && (
                        <div className={styles.required_hint} style={{ marginTop: 4 }}>
                            Обязательно для заполнения
                        </div>
                    )}
                </div>

                <div className={`${styles.form__group} ${styles.field}`} style={{ position: 'relative' }}>
                    <input
                        ref={titleInputRef}
                        type="text"
                        className={`${styles.form__field} ${touched.title && titleEmpty ? styles.input_error : ''
                            }`}
                        placeholder="Заголовок года"
                        name="title"
                        id="historyTitle"
                        value={inputData.title || ''}
                        onChange={onTitleChange}
                        autoComplete="off"
                        required
                        onFocus={() => setIsTitleFocused(true)}
                        onBlur={() => {
                            setIsTitleFocused(false);
                            setTouched((t) => ({ ...t, title: true }));
                        }}
                        aria-invalid={touched.title && titleEmpty ? 'true' : 'false'}
                        style={{
                            border: 'none',
                            borderBottom: `1px solid ${touched.title && titleEmpty ? '#E00747' : (isTitleFocused ? '#75BBFD' : '#959DA6')
                                }`,
                            outline: 'none',
                            caretColor: isTitleFocused ? '#75BBFD' : '#959DA6',
                            color: '#959DA6',
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
                    {touched.title && titleEmpty && (
                        <div className={styles.required_hint} style={{ marginTop: 4 }}>
                            Обязательно для заполнения
                        </div>
                    )}
                </div>
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
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label
                                ref={uploadBtnRef}
                                className={`${styles.slider_container__customFileUploadStaff} ${touched.photo && photoEmpty ? styles.input_error : ''
                                    }`}
                                style={{ marginTop: '6px' }}
                                onBlur={() => setTouched((t) => ({ ...t, photo: true }))}
                                tabIndex={0}
                                aria-invalid={touched.photo && photoEmpty ? 'true' : 'false'}
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
                            {touched.photo && photoEmpty && (
                                <div className={styles.required_hint} style={{ marginTop: 4 }}>
                                    Обязательно для загрузки
                                </div>
                            )}
                        </div>

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
                    <div className={styles.preview_photos_container__block} style={{ ...PORTRAIT_CONTAINER_STYLE, marginTop: '10px' }}>
                        <img
                            className={styles.preview_photos_container__img}
                            src={previewImage.url}
                            alt="Preview"
                            style={PORTRAIT_IMG_STYLE}
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
                    <div className={historyStyles.historyPreviewTextWrapper}>
                        <div ref={previewTextRef} style={{ paddingTop: '16px' }} />
                        <QuillField
                            styles={styles}
                            label="Текст превью"
                            value={inputData.previewText || ''}
                            onChange={(v) => {
                                if (!touched.previewText) setTouched((t) => ({ ...t, previewText: true }));
                                handlePreviewTextChange(v);
                            }}
                            placeholder="Не более 160 символов"
                            scopeKey="historyPreviewText"
                            showToolbar={true}
                            className=""
                            classNameInput={`${historyStyles.historyPreviewQuill} ${touched.previewText && previewTextEmpty ? historyStyles.historyPreviewQuill_error : ''
                                }`}
                            error={touched.previewText && previewTextEmpty}
                            ariaInvalid={touched.previewText && previewTextEmpty ? 'true' : 'false'}
                            ariaDescribedby={touched.previewText && previewTextEmpty ? 'err-previewText' : undefined}
                        />
                        <div className={styles.form_container__textarea_length}>
                            {previewLength}/{MAX_PREVIEW_LENGTH}
                        </div>
                        {touched.previewText && previewTextEmpty && (
                            <div id="err-previewText" className={styles.required_hint} style={{ marginTop: 4 }}>
                                Обязательно для заполнения
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(HistoryHeaderBlock);
