import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element } from 'hast';

const h1Plugin: Plugin<[ {desc: string} ], Parent> = (options) => {

  const {desc} = options

  return (tree) => {
    visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
      if (node.tagName === 'h1' && parent && typeof index === 'number') {
        // 创建一个 header 标签，包裹 h1 元素
        const headerElement: Element = {
          type: 'element',
          tagName: 'div',
          properties: {class: 'header-wrapper'},
          children: [
            {
              type: 'element',
              tagName: 'header',
              properties: {},
              children: [node]
            },
            {
              type: 'element',
              tagName: 'p',
              properties: {class: 'header-desc'},
              children: [
                {
                  type: 'text',
                  value: `- ${desc} -`
                }
              ]
            }
          ], // 直接使用 h1 元素作为 header 的子节点
        };

        // 替换原始的 h1 元素为新的 header 包裹结构
        parent.children[index] = headerElement;
      }
    });
  };
};

export default h1Plugin;
