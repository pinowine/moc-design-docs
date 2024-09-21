import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Parent, Element, Text } from 'hast';


const prefix = {
    "notecard note": "备注",
    "notecard warning": "警告",
    "notecard tip": "小贴士",
    "notecard important": "重要",
    "notecard callout": "标注",
    "notecard caution": "注意",
    "notecard example": "示例"
}

const blockquotePlugin: Plugin<[], Parent> = () => {
    return (tree: Parent) => {
        visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
            if (node.tagName === 'blockquote' && parent && typeof index === 'number') {
                const firstChild = node.children[1] as Element | undefined;
                // console.log("node,index,parent", node, index, parent)
                if (firstChild && firstChild.tagName === 'p' && firstChild.children.length > 0) {
                    const textNode = firstChild.children[0] as Text | undefined;
                    const noteType = textNode?.value?.trim() || '';
                    let className = '';

                    // 根据 GitHub 风格的标识符选择合适的 class
                    if (noteType.startsWith('[!NOTE]')) {
                        className = 'notecard note';
                    } else if (noteType.startsWith('[!WARNING]')) {
                        className = 'notecard warning';
                    } else if (noteType.startsWith('[!TIP]')) {
                        className = 'notecard tip';
                    } else if (noteType.startsWith('[!IMPORTANT]')) {
                        className = 'notecard important';
                    } else if (noteType.startsWith('[!CAUTION]')) {
                        className = 'notecard caution';
                    } else if (noteType.startsWith('[!CALLOUT]')) {
                        className = 'notecard callout';
                    } else if (noteType.startsWith('[!EXAMPLE]')) {
                        className = 'notecard example';
                    }

                    // 如果匹配到了 GitHub 风格标识符，则替换 blockquote 为 div 并移除标识符
                    if (className) {

                        const classNameKey = className as keyof typeof prefix;

                        // 将 blockquote 替换为 div，保留原有的子元素
                        parent.children[index] = {
                            type: 'element',
                            tagName: 'div',
                            properties: { className: className },
                            children: [
                                {
                                type: 'element',
                                tagName: 'p',
                                properties: {},
                                children: [
                                    { 
                                        type: 'element', 
                                        tagName: 'strong',
                                        properties: {},
                                        children: [
                                            {
                                                type: 'text',
                                                value: prefix[classNameKey]+' ：' 
                                            }
                                        ]
                                    },
                                    {
                                        type: 'text',
                                        value: ((node.children[1] as Element).children[0] as Text).value.replace(/\[[^\]]*\]/g, '')
                                    }
                                ]
                                },
                            ...node.children.slice(2)
                            ],
                        };
                    }
                }
            }
        });
    };
};

export default blockquotePlugin;
