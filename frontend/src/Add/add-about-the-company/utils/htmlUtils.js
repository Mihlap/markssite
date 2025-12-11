/**
 * Обрезает HTML контент до указанной длины, сохраняя форматирование
 * @param {string} html - HTML строка для обрезки
 * @param {number} maxLength - Максимальная длина в символах (plain text)
 * @returns {string} - Обрезанный HTML с сохраненным форматированием
 */
export const truncateHtmlPreservingFormat = (html, maxLength) => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let plainText = '';
    let truncated = false;

    const traverse = (node) => {
        if (truncated) return;

        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || '';
            if (plainText.length + text.length > maxLength) {
                const remaining = maxLength - plainText.length;
                node.textContent = text.slice(0, remaining);
                truncated = true;
                return;
            }
            plainText += text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                if (truncated) {
                    child.remove();
                } else {
                    traverse(child);
                }
            }
        }
    };

    const children = Array.from(tempDiv.childNodes);
    for (const child of children) {
        if (truncated) {
            child.remove();
        } else {
            traverse(child);
        }
    }

    return tempDiv.innerHTML;
};

