import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element, Text } from 'hast';

const blockquotePlugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
        if (node.tagName === 'blockquote' && parent && typeof index === 'number') {
            const firstChild = node.children[1] as Element | undefined;
            if (firstChild &&
            firstChild.tagName === 'p' &&
            firstChild.children.length > 0 &&
            (firstChild.children[0] as Element).tagName === 'strong'
            ) {
            const strongChild = firstChild.children[0] as Element;
            const textNode = strongChild.children[0] as Text | undefined;
            const noteType = textNode?.value || '';
            let className = 'notecard';

            if (noteType.includes('备注')) {
                className += ' note';
            } else if (noteType.includes('警告')) {
                className += ' warning';
            } else if (noteType.includes('标注')) {
                className = 'callout';
                strongChild.tagName = 'p';
                firstChild.children = strongChild.children;
            } else if (noteType.includes('示例')) {
                className += ' example';
            }

            parent.children[index] = {
                type: 'element',
                tagName: 'div',
                properties: { className: className },
                children: node.children,
            };
            }
        }
        });
    };
};

export default blockquotePlugin;