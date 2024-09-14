import { Plugin } from 'unified';
import { Parent, Element, RootContent } from 'hast';

const h2Plugin: Plugin<[], Parent> = () => {
  return (tree) => {
    const newTree: Parent = { type: 'root', children: [] };

    let currentSection: Array<Element> = [];
    let inSection = false;

    // 遍历顶级的同级节点
    tree.children.forEach((node: RootContent) => {
      // 确保我们只处理 `Element` 类型的节点
      if (isElement(node) && node.tagName === 'h2') {
        // 如果在一个 section 中，先结束该 section
        if (inSection && currentSection.length > 0) {
          const h2Node = currentSection[0];  // h2 是 section 的第一个元素
          const otherElements = currentSection.slice(1);  // h2 之后的所有元素

          // 将 h2 和其他元素分别放入 section 和 div 中
          newTree.children.push({
            type: 'element',
            tagName: 'section',
            properties: { className: 'section' },
            children: [
              h2Node,  // h2 单独处理
              {
                type: 'element',
                tagName: 'div',
                properties: { className: 'section-content' },  // div 包裹其余元素
                children: [...otherElements],
              },
            ],
          });

          currentSection = [];
        }

        // 创建新的 section，开始收集新的 h2 和接下来的元素
        inSection = true;
        currentSection.push(node);
      } else if (inSection && isElement(node)) {
        // 继续收集 h2 之后的元素，直到遇到下一个 h2
        currentSection.push(node);
      } else {
        // 非 section 范围内的元素，直接放入 newTree
        newTree.children.push(node);
      }
    });

    // 如果遍历结束时还有未关闭的 section
    if (inSection && currentSection.length > 0) {
      const h2Node = currentSection[0];
      const otherElements = currentSection.slice(1);

      // 将 h2 和其他元素分别放入 section 和 div 中
      newTree.children.push({
        type: 'element',
        tagName: 'section',
        properties: { className: 'section' },
        children: [
          h2Node,
          {
            type: 'element',
            tagName: 'div',
            properties: { className: 'section-content' },
            children: [...otherElements],
          },
        ],
      });
    }

    // 用新生成的树替换原来的树
    Object.assign(tree, newTree);
  };
};

// 类型守卫函数，确保节点是 `Element` 类型
function isElement(node: RootContent): node is Element {
  return (node as Element).tagName !== undefined;
}

export default h2Plugin;
