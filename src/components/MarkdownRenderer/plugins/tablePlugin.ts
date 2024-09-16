import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element } from 'hast';

const tablePlugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
        if (node.tagName === 'table' && parent && typeof index === 'number') {
            const table = node
            const tableHeader: Element = {
            type: 'element',
            tagName: 'figure',
            properties: { className: 'table-container' },
            children: [table]
            };
            
            parent.children[index] = tableHeader;
        }
        });
    };
}

export default tablePlugin;