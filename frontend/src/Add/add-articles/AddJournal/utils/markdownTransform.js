export const wrapAnnotationAndKeywords = (markdownText) => {
  
  let wrappedText = markdownText;

  if (wrappedText.includes('Аннотация')) {
    wrappedText = wrappedText.replace(/^(Аннотация\s*)$/m, '<!-- annotation:start -->$1');
    if (wrappedText.includes('Ключевые слова:')) {
      wrappedText = wrappedText.replace(/^(Ключевые слова:)/m, '<!-- annotation:end -->\n$1');
    } else {  
      wrappedText += '\n<!-- annotation:end -->';
    }
  }

  if (wrappedText.includes('Ключевые слова:')) { 
    wrappedText = wrappedText.replace(/^(Ключевые слова:)/m, '<!-- keywords:start -->$1');
    if (!wrappedText.includes('<!-- keywords:end -->')) {
      wrappedText += '\n<!-- keywords:end -->';
    }
  }

  return wrappedText;
};
