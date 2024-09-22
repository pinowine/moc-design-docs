import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Element, Parent } from 'hast';

// Define the plugin with correct types
const imagePlugin: Plugin<[ { basePath: string } ], Parent> = (options) => {
  const { basePath } = options;

  return (tree: Parent) => {
    visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
      // Check if the node is an <img> element
      if (node.tagName === 'img' && parent && typeof index === 'number' && node.properties?.src) {
        let src = node.properties.src as string;
        const alt = node.properties.alt as string;
        
        // If the src is relative, prepend the basePath
        if (!src.startsWith('http') && !src.startsWith('//')) {
          src = `${basePath}${src}`;
        }

        parent.children = [
          {
            type: 'element',
            tagName: 'img',
            properties: {
              src: src,
              alt: alt,
              loading: 'lazy'
            },
            children: []
          }
        ]

        // console.log("parent",parent)
      }
    });
  };
};

export default imagePlugin;