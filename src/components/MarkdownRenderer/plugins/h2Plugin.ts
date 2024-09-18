import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element, Text } from 'hast';

const h2Plugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        const sections: Element[][] = [];
        let currentSection: Element[] = [];
        let inSection = false;

        visit(tree, 'element', (node: Element, _: number | undefined, parent: Parent | undefined) => {

        let id: string | undefined;

        if (node.children[0] && (node.children[0] as Text).value) {
            id = (node.children[0] as Text).value;
        }

        if (node.tagName === 'h2' && parent && id) {
            if (inSection) {
            sections.push([...currentSection]);
            currentSection = [];
            }
            inSection = true;
            
            node.properties = { id: id };
            const currentRoute = window.location.pathname.replace('/moc-design-docs/', '/');
            node.children = [
            {
                type: 'element',
                tagName: 'a',
                properties: { href: `${currentRoute}#${id}` },
                children: [{ type: 'text', value: id }],
            },
            ];
            currentSection.push(node);
        } else if (inSection && parent?.type === 'root') {
            currentSection.push(node);
        }
        });

        if (currentSection.length) {
        sections.push([...currentSection]);
        }

    };
};

export default h2Plugin;