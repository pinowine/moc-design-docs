import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element } from 'hast';

const checkListPlugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
        if (node.tagName === 'li' && node.properties && Array.isArray(node.properties.className) && node.properties.className.includes('task-list-item') && parent && typeof index === 'number') {
            console.log(node)
            const checkListText = node.children[1]
            const checkList: Element = {
            type: 'element',
            tagName: 'li',
            properties: { className: ['task-list-item', 'no-marker'] },
            children: [
                {
                    type: 'element',
                    tagName: 'input',
                    properties: {type: 'checkbox', disabled: false},
                    children: []
                },
                checkListText
            ]
            };
            
            parent.children[index] = checkList;
        }
        });
    };
}

export default checkListPlugin;