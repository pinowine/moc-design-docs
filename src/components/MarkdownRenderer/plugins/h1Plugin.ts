import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element } from 'hast';

const h1Plugin: Plugin<[], Parent> = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
      if (node.tagName === 'h1' && parent && typeof index === 'number') {
        // 创建一个 header 标签，包裹 h1 元素
        const headerElement: Element = {
          type: 'element',
          tagName: 'header',
          properties: {},  // 可以删除这个空属性，除非有特定需求
          children: [node], // 直接使用 h1 元素作为 header 的子节点
        };

        // 替换原始的 h1 元素为新的 header 包裹结构
        parent.children[index] = headerElement;
      }
    });
  };
};

export default h1Plugin;
