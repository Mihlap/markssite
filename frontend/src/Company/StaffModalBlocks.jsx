import { memo, useMemo } from 'react';
import MarkdownContentRenderer from '../UI/MarkdownContentRenderer/MarkdownContentRenderer';
import defaultStyles from './StaffModalBlocks.module.scss';
import 'katex/dist/katex.min.css';

import { toBestImageSrc, rewriteMdLinksToBucket } from './utils/media';
import useFactClipLayout from './utils/useFactClipLayout';

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const fromBlock = (block, { byLabel, index }) => {
  if (!Array.isArray(block)) return null;
  if (typeof index === 'number') return block[index]?.value ?? null;
  if (byLabel) {
    const needle = norm(byLabel);
    const input = block.find((i) => norm(i?.label || i?.placeholder) === needle);
    return input?.value ?? null;
  }
  return null;
};

const firstValue = (block) => (Array.isArray(block) && block[0] ? block[0].value ?? null : null);

const parseMixedContent = (html) => {
  const s = String(html ?? '');
  if (!s.trim()) return [];

  const parts = [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${s}</div>`, 'text/html');
    const container = doc.body.firstChild;

    if (!container) {
      throw new Error('Failed to parse HTML');
    }

    const walkNodes = (node) => {
      if (!node) return;

      const ELEMENT_NODE = 1;
      const TEXT_NODE = 3;

      for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === ELEMENT_NODE) {
          const tagName = child.tagName.toLowerCase();

          if (tagName === 'li') {
            const clone = child.cloneNode(true);
            const qlUiElements = clone.querySelectorAll('.ql-ui');
            qlUiElements.forEach((el) => el.remove());

            const content = clone.innerHTML.trim();
            if (content) {
              parts.push({ type: 'listItem', content });
            }
          } else if (tagName === 'p') {
            const content = child.innerHTML.trim();
            if (content) {
              parts.push({ type: 'text', content });
            }
          } else if (tagName === 'ol' || tagName === 'ul') {
            walkNodes(child);
          } else {
            walkNodes(child);
          }
        } else if (child.nodeType === TEXT_NODE) {
          const text = child.textContent.trim();
          if (text) {
            parts.push({ type: 'text', content: text });
          }
        }
      }
    };

    walkNodes(container);
  } catch (error) {
    const liMatches = Array.from(s.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
    const pMatches = Array.from(s.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi));

    const allMatches = [];
    liMatches.forEach((match) => {
      const content = match[1]
        .replace(/<span[^>]*class="ql-ui"[^>]*>[\s\S]*?<\/span>/gi, '')
        .trim();
      if (content) {
        allMatches.push({ index: match.index, type: 'listItem', content, length: match[0].length });
      }
    });
    pMatches.forEach((match) => {
      const content = match[1].trim();
      if (content) {
        allMatches.push({ index: match.index, type: 'text', content, length: match[0].length });
      }
    });

    allMatches.sort((a, b) => a.index - b.index);

    let lastIndex = 0;
    allMatches.forEach((match) => {
      if (match.index > lastIndex) {
        const textBefore = s.substring(lastIndex, match.index).trim();
        if (textBefore && !textBefore.match(/^<[^>]+>$/)) {
          parts.push({ type: 'text', content: textBefore });
        }
      }
      parts.push({ type: match.type, content: match.content });
      lastIndex = match.index + match.length;
    });

    if (lastIndex < s.length) {
      const textAfter = s.substring(lastIndex).trim();
      if (textAfter && !textAfter.match(/^<[^>]+>$/)) {
        parts.push({ type: 'text', content: textAfter });
      }
    }

    if (parts.length === 0) {
      const cleanText = s
        .replace(/<\s*br\s*\/?>/gi, '\n')
        .replace(/<\/p>\s*<p>/gi, '\n')
        .replace(/<\/div>\s*<div>/gi, '\n')
        .replace(/<\/?(p|div|li|ul|ol)[^>]*>/gi, '')
        .replace(/<[^>]+>/g, '')
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);

      cleanText.forEach((line) => {
        if (line) parts.push({ type: 'text', content: line });
      });
    }
  }

  return parts;
};

const detectBlockType = (block) => {
  if (!Array.isArray(block)) return 'text';

  const id = norm(block?.[0]?.blockId || '');
  const labels = (block || []).map((i) => norm(i?.label || i?.placeholder || ''));
  const headLabel = norm(block?.[0]?.label || '');
  const has = (needle) => labels.includes(norm(needle)) || labels.some((l) => l.includes(norm(needle)));

  if (id === 'fact' || has('интересный факт') || has('title fact')) return 'fact';
  if (id === 'quote' || has('цитата') || has('author') || has('автор')) return 'quote';
  if (id === 'personofyear' || has('человек года')) return 'personOfYear';
  if (id === 'personwithname') return 'personWithName';

  if (has('текстовый блок в рамке') || id === 'frametext') return 'frameText';
  if (has('текстовый блок с фоном') || id === 'bgtext') return 'bgText';
  if (has('текстовый блок выделенный') || id === 'frametextstripe' || id === 'callout') return 'stripeText';

  if (id === 'markdown' || has('markdown') || has('md') || has('тело статьи')) return 'markdown';
  if (id === 'dotlist' || has('текстовый блок с точкой')) return 'textWithDot';

  const fv = firstValue(block);
  if (typeof fv === 'string' && /data-list="bullet"|<li[^>]*>/i.test(fv)) return 'textWithDot';
  if (headLabel.includes('картинка с описанием')) return 'imageDescription';
  if (headLabel.includes('блок 3 картинки')) return 'threeImages';
  if (headLabel.includes('блок 2e вертикальные')) return 'twoVerticalImages';
  if (headLabel === 'заголовок') return 'headerText';

  const hasFile = block.some((i) => String(i?.type).toLowerCase() === 'file');
  if (hasFile) return 'imageWithCaption';

  return 'text';
};

const pickByIncludes = (block, tokens = [], preferType) => {
  if (!Array.isArray(block)) return null;
  const items = block.filter(Boolean);
  const match = items.find((i) => {
    const l = norm(i?.label || i?.placeholder || '');
    return tokens.some((t) => l.includes(norm(t))) && (!preferType || norm(i?.type) === norm(preferType));
  });
  return match?.value ?? null;
};

const MarkdownChunk = ({ styles, markdown, bucketUrl }) => {
  const md = useMemo(() => rewriteMdLinksToBucket(markdown || '', bucketUrl), [markdown, bucketUrl]);
  if (!String(md).trim()) return null;
  return (
    <div className={styles.modal_md_container}>
      <MarkdownContentRenderer markdown={md} />
    </div>
  );
};

const ImageWithCaption = ({ styles, src, caption, bucketUrl }) => {
  const safeSrc = toBestImageSrc(src, bucketUrl);
  if (!safeSrc) return null;
  return (
    <figure className={styles.staff_figure}>
      <img
        className={styles.staff_figure_img}
        src={safeSrc}
        alt=""
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = `${bucketUrl}/images/imageStaff/no_photo.png`;
          e.currentTarget.classList.add('img-error');
        }}
      />
      {caption && (
        <figcaption className={styles.staff_figure_caption}>
          <MarkdownChunk styles={styles} markdown={caption} bucketUrl={bucketUrl} />
        </figcaption>
      )}
    </figure>
  );
};

const QuoteBlock = ({ styles, avatar, authorName, authorPost, text, bucketUrl }) => {
  const avatarSrc = avatar ? toBestImageSrc(avatar, bucketUrl) : '';

  if (!text && !avatarSrc && !authorName && !authorPost) return null;

  return (
    <div className={styles.staff_quote}>
      <div className={styles.staff_quote_body}>
        {text && (
          <div className={styles.staff_quote_text}>
            <svg
              className={`${styles.staff_quote_decor_svg} ${styles.staff_quote_decor_top}`}
              viewBox="0 0 34 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.05735 18.8356L2.11977 24.5342C1.49701 25.2529 1.42645 26.2975 1.94689 27.0935L4.30863 30.7056C4.99638 31.7574 6.42815 31.9772 7.33044 31.1024C9.76779 28.7393 13.9697 23.9869 14.5561 18.8356C15.138 13.7239 14.8604 6.43404 14.6754 2.97112C14.6159 1.85635 13.6915 0.998611 12.5752 0.998611H2.13206C0.956223 0.998611 0.00302315 1.95181 0.00302315 3.12764V15.4643C0.00302315 16.4488 0.677985 17.3049 1.63528 17.5346L7.05735 18.8356Z"
                fill="#F6F6F6"
              />
              <path
                d="M25.1589 18.8356L20.2213 24.5342C19.5986 25.2529 19.528 26.2975 20.0484 27.0935L22.4102 30.7056C23.0979 31.7574 24.5297 31.9772 25.432 31.1024C27.8694 28.7393 32.0712 23.9869 32.6576 18.8356C33.2395 13.7239 32.9619 6.43404 32.777 2.97112C32.7174 1.85635 31.7931 0.998611 30.6767 0.998611H20.2336C19.0578 0.998611 18.1046 1.95181 18.1046 3.12764V15.4643C18.1046 16.4488 18.7795 17.3049 19.7368 17.5346L25.1589 18.8356Z"
                fill="#F6F6F6"
              />
            </svg>

            <MarkdownChunk styles={styles} markdown={text} bucketUrl={bucketUrl} />

            <svg
              className={`${styles.staff_quote_decor_svg} ${styles.staff_quote_decor_bottom}`}
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.94656 13.8304L12.8841 8.13181C13.5069 7.41307 13.5775 6.36848 13.057 5.57252L10.6953 1.96044C10.0075 0.90859 8.57576 0.688833 7.67347 1.56362C5.23611 3.9267 1.03424 8.67912 0.447848 13.8304C-0.134047 18.9421 0.143528 26.232 0.328483 29.6949C0.388022 30.8097 1.31238 31.6674 2.42873 31.6674H12.8719C14.0477 31.6674 15.0009 30.7142 15.0009 29.5384V17.2017C15.0009 16.2172 14.3259 15.3612 13.3686 15.1315L7.94656 13.8304Z"
                fill="#F6F6F6"
              />
              <path
                d="M25.8489 13.8343L30.7865 8.13571C31.4092 7.41697 31.4798 6.37239 30.9594 5.57642L28.5976 1.96435C27.9099 0.912497 26.4781 0.69274 25.5758 1.56753C23.1385 3.93061 18.9366 8.68302 18.3502 13.8343C17.7683 18.946 18.0459 26.2359 18.2308 29.6988C18.2904 30.8136 19.2147 31.6713 20.3311 31.6713H30.7742C31.95 31.6713 32.9032 30.7181 32.9032 29.5423V17.2056C32.9032 16.2212 32.2283 15.3651 31.271 15.1354L25.8489 13.8343Z"
                fill="#F6F6F6"
              />
            </svg>
          </div>
        )}

        {(avatarSrc || authorName) && (
          <div className={styles.staff_quote_meta}>
            {avatarSrc && (
              <span className={styles.staff_quote_meta_avatar}>
                <img
                  src={avatarSrc}
                  alt={authorName || 'author'}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                />
              </span>
            )}
            <div className={styles.staff_quote_meta_text}>
              {authorName && <div className={styles.staff_quote_author}>{authorName}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FactBlock = ({ styles, title = 'Интересный факт', text, image, portraitImg, portraitName, bucketUrl }) => {
  const imgSrc = image ? toBestImageSrc(image, bucketUrl) : '';
  const avatarSrc = portraitImg ? toBestImageSrc(portraitImg, bucketUrl) : '';
  const { width: clipW, height: clipH, right: clipRight, translateY: clipY } = useFactClipLayout();

  return (
    <div className={styles.staff_fact_box}>
      <div className={styles.staff_fact_stack}>
        <div className={styles.staff_fact_underlay} aria-hidden="true" />
        <div className={styles.staff_fact_card}>
          <span
            className={styles.staff_fact_clip}
            aria-hidden="true"
            style={{
              right: `${clipRight}px`,
              transform: `translateY(${clipY}px)`,
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={clipW} height={clipH} viewBox="0 0 62 73" fill="none">
              <path
                d="M24.8906 8.00977C27.1131 1.71245 34.0493 -1.5598 40.3223 0.730469L53.791 5.64844C59.5862 7.76462 62.8889 13.9791 61.1641 20.0088C60.6073 21.9551 59.9528 24.1769 59.2422 26.4834L50.6162 27.2412C51.677 23.9537 52.6685 20.6188 53.4727 17.8076C54.0149 15.9106 52.996 13.8758 51.0469 13.1641L37.5781 8.24609C35.4873 7.48289 33.1755 8.57301 32.4346 10.6719L15.75 57.9521C15.0293 59.9948 16.065 62.2406 18.0869 63.0176L20.2939 63.8643C22.4282 64.6839 24.8144 63.5518 25.5283 61.3799L38.2119 22.7832C38.9017 20.6849 41.1623 19.543 43.2607 20.2324C45.3595 20.9221 46.5012 23.1825 45.8115 25.2812L33.1279 63.877C30.9863 70.3935 23.828 73.792 17.4248 71.332L15.2188 70.4844C9.15265 68.1537 6.04369 61.4181 8.20605 55.29L24.8906 8.00977ZM48.6025 33.3584L48.5303 33.332C48.5538 33.2682 48.5761 33.2038 48.5996 33.1396L48.6025 33.3584Z"
                fill="#1D2E43"
              />
              <path
                d="M5.41309 14.9727C6.09457 12.8714 8.35089 11.7201 10.4521 12.4014C12.5534 13.0828 13.7046 15.3382 13.0234 17.4395L8.65625 30.9023L0 31.6631L5.41309 14.9727Z"
                fill="#1D2E43"
              />
            </svg>
          </span>

          <h3 className={styles.staff_fact_title}>{title || 'Интересный факт'}</h3>

          {text && (
            <div className={styles.staff_fact_text}>
              <MarkdownChunk styles={styles} markdown={text} bucketUrl={bucketUrl} />
            </div>
          )}

          {(avatarSrc || portraitName) && (
            <div className={styles.staff_fact_author_row}>
              {avatarSrc && (
                <span className={styles.staff_fact_author_avatar}>
                  <img
                    src={avatarSrc}
                    alt={portraitName || 'author'}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                </span>
              )}
              {portraitName && <span className={styles.staff_fact_author_name}>{portraitName}</span>}
            </div>
          )}

          {imgSrc && (
            <div className={styles.staff_fact_image_wrap}>
              <img className={styles.staff_fact_image} src={imgSrc} alt={title || 'Интересный факт'} loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TextWithDot = ({ styles, text, bucketUrl }) => {
  let parts = [];
  if (Array.isArray(text)) {
    parts = text.map((item) => ({ type: 'listItem', content: String(item) }));
  } else {
    parts = parseMixedContent(text);
  }

  if (!parts.length) return null;

  return (
    <div className={styles.staff_bullet_block}>
      {parts.map((part, i) => {
        if (part.type === 'listItem') {
          return (
            <div className={styles.modal_about_stuff1} key={i}>
              <div className={styles.modal_about_stuff_symbol}>•</div>
              <div className={styles.modal_about_md}>
                <MarkdownChunk styles={styles} markdown={part.content} bucketUrl={bucketUrl} />
              </div>
            </div>
          );
        } else {
          return (
            <div className={styles.staff_text_block} key={i}>
              <MarkdownChunk styles={styles} markdown={part.content} bucketUrl={bucketUrl} />
            </div>
          );
        }
      })}
    </div>
  );
};

const TextBlock = ({ styles, text, bucketUrl }) => {
  if (!String(text || '').trim()) return null;
  return (
    <div className={styles.staff_text_block}>
      <MarkdownChunk styles={styles} markdown={text} bucketUrl={bucketUrl} />
    </div>
  );
};

const FrameTextBlock = ({ styles, text, bucketUrl }) => {
  if (!String(text || '').trim()) return null;
  return (
    <div className={styles.staff_frame_text}>
      <MarkdownChunk styles={styles} markdown={text} bucketUrl={bucketUrl} />
    </div>
  );
};

const StripeTextBlock = ({ styles, text, bucketUrl }) => {
  const val = String(text || '').trim();
  if (!val) return null;
  return (
    <div className={styles.staff_stripe_text}>
      <span className={styles.staff_stripe_text_bar} aria-hidden="true" />
      <div className={styles.staff_stripe_text_body}>
        <MarkdownChunk styles={styles} markdown={val} bucketUrl={bucketUrl} />
      </div>
    </div>
  );
};

const BgTextBlock = ({ styles, text, bucketUrl }) => {
  const val = String(text || '').trim();
  if (!val) return null;
  return (
    <div className={styles.staff_bg_text}>
      <MarkdownChunk styles={styles} markdown={val} bucketUrl={bucketUrl} />
    </div>
  );
};

const ImageDescription = ({ styles, img, desc, bucketUrl }) => {
  const src = toBestImageSrc(img, bucketUrl);
  if (!src && !desc) return null;
  return (
    <div className={styles.staff_img_desc}>
      {src && <img className={styles.staff_img_desc_img} src={src} alt="" loading="lazy" />}
      {desc && (
        <div className={styles.staff_img_desc_text}>
          <MarkdownChunk styles={styles} markdown={desc} bucketUrl={bucketUrl} />
        </div>
      )}
    </div>
  );
};

const ThreeImages = ({ styles, images = [], bucketUrl }) => {
  const [a, b, c] = images.map((v) => toBestImageSrc(v, bucketUrl));
  if (!a && !b && !c) return null;
  return (
    <div className={styles.staff_three_images}>
      {a && <img src={a} alt="" loading="lazy" className={styles.staff_three_images_h} />}
      {b && <img src={b} alt="" loading="lazy" className={styles.staff_three_images_h} />}
      {c && <img src={c} alt="" loading="lazy" className={styles.staff_three_images_v} />}
    </div>
  );
};

const TwoVerticalImages = ({ styles, images = [], bucketUrl }) => {
  const list = images.map((v) => toBestImageSrc(v, bucketUrl)).filter(Boolean);
  if (!list.length) return null;
  return (
    <div className={styles.staff_two_vertical}>
      {list.map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" className={styles.staff_two_vertical_img} />
      ))}
    </div>
  );
};

const PersonOfYearBlock = ({ styles, src, bucketUrl }) => {
  const safeSrc = toBestImageSrc(src, bucketUrl);
  if (!safeSrc) return null;
  return (
    <div className={styles.staff_person_of_year}>
      <img
        className={styles.staff_person_of_year_img}
        src={safeSrc}
        alt="Человек года"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = `${bucketUrl}/images/imageStaff/no_photo.png`;
          e.currentTarget.classList.add('img-error');
        }}
      />
    </div>
  );
};

const PersonWithNameBlock = ({ styles, src, name, bucketUrl }) => {
  const safeSrc = toBestImageSrc(src, bucketUrl);
  if (!safeSrc && !name) return null;
  return (
    <div className={styles.staff_person_with_name}>
      {safeSrc && (
        <span className={styles.staff_person_with_name_avatar}>
          <img
            src={safeSrc}
            alt={name || ''}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
        </span>
      )}
      {name && <div className={styles.staff_person_with_name_text}>{name}</div>}
    </div>
  );
};

function StaffModalBlocks({ selectedCard, bucketUrl = '', styles: stylesProp }) {
  const styles = stylesProp || defaultStyles;

  const blocks = useMemo(() => {
    if (!selectedCard) return [];
    if (Array.isArray(selectedCard.dynamicBlocks) && selectedCard.dynamicBlocks.length)
      return selectedCard.dynamicBlocks;
    if (Array.isArray(selectedCard.ConstructorStaffNews) && selectedCard.ConstructorStaffNews.length)
      return selectedCard.ConstructorStaffNews.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter(
        (g) => g.length
      );
    if (Array.isArray(selectedCard.Constructors) && selectedCard.Constructors.length)
      return selectedCard.Constructors.map((c) => c?.data).filter((g) => Array.isArray(g) && g.length);
    return [];
  }, [selectedCard]);

  if (!selectedCard) return null;

  return (
    <div className={styles.staff_modal_stream}>
      {blocks.map((block, idx) => {
        const type = detectBlockType(block);

        const fileIndexes = (block || [])
          .map((i, iidx) => ({ i, iidx }))
          .filter(({ i }) => String(i?.type).toLowerCase() === 'file')
          .map(({ iidx }) => iidx);

        const imgVal =
          fromBlock(block, { byLabel: 'Изображение' }) ??
          fromBlock(block, { byLabel: 'image' }) ??
          fromBlock(block, { byLabel: 'Фото' }) ??
          (typeof fileIndexes[0] === 'number' ? fromBlock(block, { index: fileIndexes[0] }) : null);

        const captionVal =
          fromBlock(block, { byLabel: 'Подпись' }) ??
          fromBlock(block, { byLabel: 'Описание' }) ??
          fromBlock(block, { byLabel: 'caption' });

        const quoteText =
          fromBlock(block, { byLabel: 'Цитата' }) ??
          fromBlock(block, { byLabel: 'Quote' }) ??
          fromBlock(block, { byLabel: 'Текст' });

        const quoteAuthor =
          fromBlock(block, { byLabel: 'Автор' }) ??
          fromBlock(block, { byLabel: 'Имя автора' }) ??
          fromBlock(block, { byLabel: 'Author' }) ??
          fromBlock(block, { byLabel: 'ФИО/Описание' }) ??
          pickByIncludes(block, ['фио', 'имя', 'подпись', 'описание', 'author', 'автор']);

        const quotePosition =
          fromBlock(block, { byLabel: 'Должность автора' }) ??
          fromBlock(block, { byLabel: 'Должность' }) ??
          fromBlock(block, { byLabel: 'Position' }) ??
          pickByIncludes(block, ['должность', 'position', 'роль']);

        const quoteAvatarVal =
          fromBlock(block, { byLabel: 'Фото автора' }) ??
          fromBlock(block, { byLabel: 'Фото' }) ??
          fromBlock(block, { byLabel: 'Изображение' }) ??
          pickByIncludes(block, ['аватар', 'avatar', 'портрет', 'фото', 'изображ']) ??
          (typeof fileIndexes[0] === 'number' ? fromBlock(block, { index: fileIndexes[0] }) : null);

        let factPortraitImgVal =
          fromBlock(block, { byLabel: 'Портрет сотрудника' }) ??
          fromBlock(block, { byLabel: 'Фото автора' }) ??
          pickByIncludes(block, ['портрет сотрудника', 'портрет', 'avatar', 'аватар', 'author'], 'file');

        let factImgVal =
          fromBlock(block, { byLabel: 'Изображение факта' }) ??
          fromBlock(block, { byLabel: 'Изображение' }) ??
          fromBlock(block, { byLabel: 'Фото' }) ??
          fromBlock(block, { byLabel: 'image' });

        let factTitle =
          fromBlock(block, { byLabel: 'Интересный факт' }) ??
          fromBlock(block, { byLabel: 'Заголовок' }) ??
          fromBlock(block, { byLabel: 'Title fact' }) ??
          'Интересный факт';

        let factText = fromBlock(block, { byLabel: 'Текст факта' }) ?? fromBlock(block, { byLabel: 'Текст' });

        const titleStr = String(factTitle || '');
        if (!factText && (/<[a-z][\s\S]*>/i.test(titleStr) || titleStr.length > 80)) {
          factText = factTitle;
          factTitle = 'Интересный факт';
        }

        const firstVal = firstValue(block);
        const imageDescriptionImg = fromBlock(block, { byLabel: 'Картинка с описанием' }) ?? imgVal;
        const imageDescriptionText = fromBlock(block, { byLabel: 'Описание картинки' }) ?? captionVal;
        const multiImages = Array.isArray(firstVal) ? firstVal : Array.isArray(imgVal) ? imgVal : [];

        switch (type) {
          case 'imageWithCaption': {
            const src = imgVal || firstVal;
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <ImageWithCaption styles={styles} src={src} caption={captionVal} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'quote':
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <QuoteBlock
                  styles={styles}
                  avatar={quoteAvatarVal}
                  authorName={quoteAuthor}
                  authorPost={quotePosition}
                  text={quoteText}
                  bucketUrl={bucketUrl}
                />
              </div>
            );
          case 'fact':
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <FactBlock
                  styles={styles}
                  title={factTitle || 'Интересный факт'}
                  text={factText}
                  image={factImgVal}
                  portraitImg={factPortraitImgVal}
                  portraitName={
                    fromBlock(block, { byLabel: 'ФИО/Описание' }) ??
                    fromBlock(block, { byLabel: 'Автор' }) ??
                    pickByIncludes(block, ['фио', 'имя', 'author', 'подпись'])
                  }
                  bucketUrl={bucketUrl}
                />
              </div>
            );
          case 'personOfYear': {
            const src =
              pickByIncludes(block, ['человек года'], 'file') ||
              imgVal ||
              firstVal ||
              (typeof fileIndexes[0] === 'number' ? fromBlock(block, { index: fileIndexes[0] }) : null);
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <PersonOfYearBlock styles={styles} src={src} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'personWithName': {
            const src =
              pickByIncludes(block, ['портрет'], 'file') ||
              imgVal ||
              (typeof fileIndexes[0] === 'number' ? fromBlock(block, { index: fileIndexes[0] }) : null);
            const name =
              fromBlock(block, { byLabel: 'ФИО/Описание' }) ||
              pickByIncludes(block, ['фио', 'имя', 'описание']);
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <PersonWithNameBlock styles={styles} src={src} name={name} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'frameText': {
            const val = String(
              firstVal ??
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              fromBlock(block, { byLabel: 'Markdown' }) ??
              fromBlock(block, { byLabel: 'md' }) ??
              ''
            ).trim();
            if (!val) return null;
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <FrameTextBlock styles={styles} text={val} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'textWithDot': {
            const val =
              firstVal ??
              fromBlock(block, { byLabel: 'Текстовый блок с точкой' }) ??
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              '';
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <TextWithDot styles={styles} text={val} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'stripeText': {
            const val = String(
              firstVal ??
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              fromBlock(block, { byLabel: 'Markdown' }) ??
              fromBlock(block, { byLabel: 'md' }) ??
              ''
            ).trim();
            if (!val) return null;
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <StripeTextBlock styles={styles} text={val} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'bgText': {
            const val = String(
              firstVal ??
              fromBlock(block, { byLabel: 'Текстовый блок с фоном' }) ??
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              fromBlock(block, { byLabel: 'Markdown' }) ??
              fromBlock(block, { byLabel: 'md' }) ??
              ''
            ).trim();
            if (!val) return null;
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <BgTextBlock styles={styles} text={val} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'markdown': {
            const candidate = String(
              firstVal ??
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              fromBlock(block, { byLabel: 'Markdown' }) ??
              fromBlock(block, { byLabel: 'md' }) ??
              ''
            ).trim();
            if (!candidate) return null;
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <TextBlock styles={styles} text={candidate} bucketUrl={bucketUrl} />
              </div>
            );
          }
          case 'imageDescription':
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <ImageDescription
                  styles={styles}
                  img={imageDescriptionImg}
                  desc={imageDescriptionText}
                  bucketUrl={bucketUrl}
                />
              </div>
            );
          case 'threeImages':
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <ThreeImages styles={styles} images={multiImages} bucketUrl={bucketUrl} />
              </div>
            );
          case 'twoVerticalImages':
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <TwoVerticalImages styles={styles} images={multiImages} bucketUrl={bucketUrl} />
              </div>
            );
          case 'headerText': {
            const header = fromBlock(block, { byLabel: 'Заголовок' });
            const text =
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              firstVal ??
              '';
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                {header && <h2 className={styles.modal_h2}>{header}</h2>}
                {text && <TextBlock styles={styles} text={text} bucketUrl={bucketUrl} />}
              </div>
            );
          }
          default: {
            const val = String(
              fromBlock(block, { byLabel: 'Текстовый блок' }) ??
              fromBlock(block, { byLabel: 'Текст' }) ??
              fromBlock(block, { byLabel: 'Markdown' }) ??
              fromBlock(block, { byLabel: 'md' }) ??
              quoteText ??
              captionVal ??
              firstVal ??
              ''
            ).trim();
            if (!val) return null;
            return (
              <div className={styles.staff_section} key={`b-${idx}`}>
                <TextBlock styles={styles} text={val} bucketUrl={bucketUrl} />
              </div>
            );
          }
        }
      })}
    </div>
  );
}

export default memo(StaffModalBlocks);