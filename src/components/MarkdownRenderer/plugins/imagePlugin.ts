import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Element } from 'hast';

// Define the plugin with correct types
const imagePrefixPlugin: Plugin<[ { basePath: string } ]> = (options) => {
  const { basePath } = options;

  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      // Check if the node is an <img> element
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src as string;
        
        // If the src is relative, prepend the basePath
        if (!src.startsWith('http') && !src.startsWith('//')) {
          node.properties.src = `${basePath}${src}`;
        }
      }
    });
  };
};

export default imagePrefixPlugin;
