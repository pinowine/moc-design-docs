import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Element } from 'hast';

const linkPlugin: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      // 检查是否为 <a> 标签
      if (node.tagName === 'a' && node.properties?.href) {
        const href = decodeURIComponent(node.properties.href as string);

        // 正则表达式检查是否为站外链接（以 http:// 或 https:// 开头）
        const isExternal = /^(https?:)?\/\//.test(href);

        if (!isExternal) {
          // 如果是站内链接，则添加 basePath
          const basePath = import.meta.env.BASE_URL || '';  // 获取 basePath
          node.properties.href = `${basePath}${href}`.replace(/\/+/g, '/'); // 确保链接不会有重复的 /
        }
      }
    });
  };
};

export default linkPlugin;
