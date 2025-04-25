export const wrapAnnotationAndKeywords = (markdownText) => {
  let wrappedText = markdownText;

  const hasAnnotationStart = /<!--\s*annotation:start\s*-->/.test(wrappedText);
  const hasWrappedAnnotationStart = /<!--\s*chapter:start=.*?-->\s*<!--\s*annotation:start\s*-->/.test(wrappedText);

  if (hasAnnotationStart && !hasWrappedAnnotationStart) {
    wrappedText = wrappedText.replace(
      /<!--\s*annotation:start\s*-->/,
      '<!-- chapter:start=Аннотация -->\n<!-- annotation:start -->'
    );
  }

  const hasAnnotationEnd = /<!--\s*annotation:end\s*-->/.test(wrappedText);
  const hasWrappedAnnotationEnd = /<!--\s*annotation:end\s*-->\s*<!--\s*chapter:end=.*?-->/.test(wrappedText);

  if (hasAnnotationEnd && !hasWrappedAnnotationEnd) {
    wrappedText = wrappedText.replace(
      /<!--\s*annotation:end\s*-->/,
      '<!-- annotation:end -->\n<!-- chapter:end=Аннотация -->'
    );
  }

  if (wrappedText.includes('Ключевые слова:')) {
    wrappedText = wrappedText.replace(/^(Ключевые слова:)/m, '<!-- keywords:start -->$1');
    if (!wrappedText.includes('<!-- keywords:end -->')) {
      wrappedText += '\n<!-- keywords:end -->';
    }
  }

  if (
    wrappedText.includes('Библиографический список') &&
    !wrappedText.includes('<!-- chapter:start=Библиографический список -->')
  ) {
    wrappedText = wrappedText.replace(
      /^(Библиографический список\s*)$/m,
      '<!-- chapter:start=Библиографический список -->$1'
    );
  }
  if (
    wrappedText.includes('<!-- chapter:start=Библиографический список -->') &&
    !wrappedText.includes('<!-- chapter:end=Библиографический список -->')
  ) {
    wrappedText += '\n<!-- chapter:end=Библиографический список -->';
  }

  return wrappedText;
};
