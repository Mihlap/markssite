import { visit } from 'unist-util-visit';

const rehypePdfEmbedder = () => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || !parent.tagName) return;

      // Случай 1: <p> содержит только <a> на PDF
      if (node.tagName === 'p' && node.children.length === 1) {
        const child = node.children[0];
        if (
          child.tagName === 'a' &&
          child.properties &&
          typeof child.properties.href === 'string' &&
          child.properties.href.toLowerCase().endsWith('.pdf')
        ) {
          const pdfUrl = child.properties.href;
          const title = child.children.map((c) => c.value).join(' ') || 'PDF';

          const iframeNode = {
            type: 'element',
            tagName: 'PDFEmbed',
            properties: { src: pdfUrl, title },
            children: [],
          };

          parent.children.splice(index, 1, iframeNode);
          return;
        }
      }

      // Случай 2: <a> на PDF не внутри <p>
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string' &&
        node.properties.href.toLowerCase().endsWith('.pdf')
      ) {
        const pdfUrl = node.properties.href;
        const title = node.children.map((c) => c.value).join(' ') || 'PDF';

        const iframeNode = {
          type: 'element',
          tagName: 'PDFEmbed',
          properties: { src: pdfUrl, title },
          children: [],
        };

        parent.children.splice(index, 1, iframeNode);
      }
    });
  };
};

export default rehypePdfEmbedder;
