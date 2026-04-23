import { visit } from 'unist-util-visit';

export default function rehypeUniqueHeadingIds() {
  const counters = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (/^h[1-6]$/.test(node.tagName)) {
        counters[node.tagName] += 1;
        node.properties = node.properties || {};
        node.properties.id = `${node.tagName}-${counters[node.tagName]}`;
      }
    });
  };
}
