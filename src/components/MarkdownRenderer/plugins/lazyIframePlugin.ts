import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';
import { Node } from 'unist';
import { Element } from 'hast';

interface Options {
  loadingMessage?: string;
}

const lazyIframePlugin: Plugin<[Options?]> = (options = {}) => {
  const { loadingMessage = 'Loading...' } = options;

  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'iframe') {
        // Wrap iframe in a div for lazy loading with IntersectionObserver
        node.tagName = 'div';
        node.properties = { className: ['iframe-placeholder'], 'data-src': node.properties.src };
        node.children = [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: 'iframe-loading-message' },
            children: [{ type: 'text', value: loadingMessage }]
          }
        ];
      }
    });
  };
};

export default lazyIframePlugin;
