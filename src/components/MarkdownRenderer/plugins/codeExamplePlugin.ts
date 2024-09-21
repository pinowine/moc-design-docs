import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element, Text } from 'hast';

const codeExamplePlugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
            
            if (!parent || typeof index !== 'number') return;
            
            if (
                node.tagName === 'pre' && 
                node.children &&
                node.children[0] &&
                (node.children[0] as Element).tagName === 'code'
            ) {
                const codeNode = node.children[0] as Element;
                // console.log("codeNode",codeNode)

                const lang = (codeNode.properties.className as string[])
                ?.find((cls) => cls.startsWith('language-'))
                ?.replace('language-', '') || '';

                console.log(codeNode.properties)

                let judgement: string = ''
                if ( codeNode.children[1] ) {
                    const codeNodeFirstValue = (codeNode.children[1] as Text).value?.trim()
                    // console.log("cfv",codeNodeFirstValue)
            
                    if ( codeNodeFirstValue === 'example-good' || codeNodeFirstValue === 'example-bad') {
                        judgement = codeNodeFirstValue
                    }
                }
                // console.log("judgement", judgement)

                // console.log("lang",codeNode.properties)

                // // 跳过语言为 'html' 的代码块
                // if (lang === 'html') {
                //   return;
                // }
                
                const exampleClass = ((codeNode.data as { meta?: string })?.meta as string) || '';

                const addTokenClass = (children: Element[]) => {
                return children.map((child: Element) => ({
                    ...child,
                    properties: {
                    ...child.properties,
                    className: Array.isArray(child.properties?.className)
                        ? (child.properties?.className as string[]).concat('token')
                        : ['token'],
                    }
                }));
                };

                const exampleHeader: Element = {
                type: 'element',
                tagName: 'div',
                properties: { className: 'code-example' },
                children: [
                    {
                    type: 'element',
                    tagName: 'div',
                    properties: { className: 'example-header' },
                    children: [
                        {
                        type: 'element',
                        tagName: 'span',
                        properties: { className: 'language-name' },
                        children: [{ type: 'text', value: lang }],
                        },
                        {
                        type: 'element',
                        tagName: 'button',
                        properties: { type: 'button', className: 'icon copy-icon' },
                        children: [
                            {
                            type: 'element',
                            tagName: 'span',
                            properties: { className: 'visually-hidden' },
                            children: [{ type: 'text', value: 'Copy to Clipboard' }],
                            },
                        ],
                        },
                        {
                        type: 'element',
                        tagName: 'span',
                        properties: { className: 'copy-icon-message visually-hidden', role: 'alert' },
                        children: [{ type: 'text', value: '已复制到剪贴板' }],
                        },
                    ],
                    },
                    {
                    type: 'element',
                    tagName: 'pre',
                    properties: { className: `brush: ${lang} ${judgement} ${exampleClass} no-translate` },
                    children: [
                        {
                        type: 'element',
                        tagName: 'code',
                        properties: { className: `language-${lang}` } ,
                        children: addTokenClass(codeNode.children as Element[])
                        }
                    ]
                    }
                ]
                };

                parent.children[index] = exampleHeader;
            }
        });
    };
};

export default codeExamplePlugin;