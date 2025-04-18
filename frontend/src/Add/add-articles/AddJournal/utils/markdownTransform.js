export const wrapAnnotationAndKeywords = (markdownText) => {
  let wrappedText = markdownText;

  // Аннотация
  if (wrappedText.includes('Аннотация')) {
    wrappedText = wrappedText.replace(/^(Аннотация\s*)$/m, '<!-- annotation:start -->$1');
    if (!wrappedText.includes('<!-- annotation:end -->')) {
      wrappedText += '\n<!-- annotation:end -->';
    }
  }

  // Ключевые слова
  if (wrappedText.includes('Ключевые слова:')) {
    wrappedText = wrappedText.replace(/^(Ключевые слова:)/m, '<!-- keywords:start -->$1');
    if (!wrappedText.includes('<!-- keywords:end -->')) {
      wrappedText += '\n<!-- keywords:end -->';
    }
  }

  // Библиографический список
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
