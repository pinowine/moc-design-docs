import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Element } from 'hast';

const linkPlugin: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      // 检查是否为 <a> 标签
      if (node.tagName === 'a' && node.properties?.href) {
        // 使用 data-onclick 传递自定义的处理信息
        node.properties = {
          ...node.properties,
          'data-onclick': true,  // 添加 data-onclick 属性
        };
      }
    });
  };
};

export default linkPlugin;
