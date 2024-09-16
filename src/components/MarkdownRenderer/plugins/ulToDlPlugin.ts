import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element, Text } from 'hast';

const ulToDlPlugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
            if (node.tagName === 'ul' && parent && typeof index === 'number') {
                const liElements = node.children.filter((child): child is Element => child.type === 'element' && (child as Element).tagName === 'li');
                let hasDefinitionList = false;

                const dlChildren = liElements.reduce((acc: Element[], liNode: Element) => {
                    const elementChildren = liNode.children.filter((child): child is Element => child.type === 'element');
                    const lastChild = elementChildren[elementChildren.length - 1];
                    // console.log('lastChild:', lastChild);

                    if (lastChild && (lastChild as Element).tagName === 'ul') {
                        const ulInnerElements = (lastChild as Element).children.filter((child): child is Element => child.type === 'element' && (child as Element).tagName === 'li');
                        // console.log('ulInnerElements:', ulInnerElements);
                        
                        if (ulInnerElements.length === 1) {
                            const term = liNode.children.slice(0, -1).filter((child): child is Element => child.type === 'element' && child.tagName === 'p');

                            // console.log('term:', term);
                            if ('children' in term[0] &&
                                Array.isArray(term[0].children) &&
                                term[0].children.length > 0 &&
                                'children' in term[0].children[0] &&
                                Array.isArray(term[0].children[0].children)
                                ) {
                                const firstChild = term[0].children[0].children[0];
                                // console.log('firstChild:', firstChild);

                                if (firstChild && 'value' in firstChild) {
                                const id = (firstChild as Text).value.replace(/[^\u4e00-\u9fa5]/g, '');
                                const description = ulInnerElements[0].children;
                                acc.push({
                                    type: 'element',
                                    tagName: 'dt',
                                    properties: {
                                        id: id,
                                    },
                                    children: term,
                                });
                                acc.push({
                                    type: 'element',
                                    tagName: 'dd',
                                    children: description,
                                    properties: {}
                                });
                                hasDefinitionList = true;
                                }

                            }
                        }
                    }

                    return acc;
                }, []);

                // console.log('hasDefinitionList:', hasDefinitionList);

                if (hasDefinitionList) {
                    node.tagName = 'dl';
                    node.children = dlChildren;
                    // console.log('Node updated to dl:', node);
                }
            }
        });
    };
};

export default ulToDlPlugin;