import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Element } from 'hast';

const linkPlugin: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      // Check if it's an <a> tag with an href property
      if (node.tagName === 'a' && node.properties?.href) {
        const href = decodeURIComponent(node.properties.href as string);

        // Check if it's an external link (starting with http:// or https://)
        const isExternal = /^(https?:)?\/\//.test(href);

        // Check if it's an anchor link (starting with #)
        const isAnchorLink = href.startsWith('#');

        if (!isExternal && !isAnchorLink) {
          // If it's an internal link (not external and not an anchor link), add basePath
          const basePath = import.meta.env.BASE_URL || '';
          node.properties.href = `${basePath}${href}`.replace(/\/+/g, '/'); // Ensure no duplicate slashes
        }
        // For anchor links, do not modify the href
      }
    });
  };
};

export default linkPlugin;
