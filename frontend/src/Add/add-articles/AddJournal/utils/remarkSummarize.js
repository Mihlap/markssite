// НИГДЕ НЕ ИСПОЛЬЗУЕТСЯ

// import { visit } from 'unist-util-visit';
// import { toString } from 'mdast-util-to-string';

// export default function remarkSummarize() {
//   return async (tree, file) => {
//     const tasks = [];
//     visit(tree, 'containerDirective', (node, index, parent) => {
//       if (node.name !== 'summary') return;
//       const rawText = toString(node);
//       const task = fetch('/api/summarize', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: rawText }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           parent.children.splice(index, 1, {
//             type: 'html',
//             value: `<div class=\"summary-block\"> <strong>Summary:</strong><p>${data.summary}</p></div>`,
//           });
//         })
//         .catch((err) => {
//           file.message(`Summary fetch error: ${err}`);
//         });
//       tasks.push(task);
//     });
//     await Promise.all(tasks);
//   };
// }
