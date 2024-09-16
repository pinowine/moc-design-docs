export const highlightMatchedText = (text: string, keyword: string): string | null => {
    // 找到关键词在文本中的位置
    const keywordIndex = text.indexOf(keyword);

    if (keywordIndex === -1) {
        return text; // 没有匹配到关键词，返回原始文本
    }

    // 要忽略的 Markdown 特殊字符
    const markdownSpecialChars = ['>', '*', '#', ' ','-','、','[',']','(',')','{','}','|','`','~','!','@','/',"\"",'\''];

    // 过滤掉 Markdown 特殊字符的函数
    const filterSpecialChars = (str: string): string => {
        return str.split('').filter(char => !markdownSpecialChars.includes(char)).join('');
    };

    // 从关键词开始向前截取 6 个非 Markdown 特殊字符
    let start = keywordIndex;
    let count = 0;
    while (start > 0 && count < 10) {
        start--;
        if (!markdownSpecialChars.includes(text[start])) {
        count++;
        }
    }

    // 从关键词开始向后截取 8 个非 Markdown 特殊字符
    let end = keywordIndex + keyword.length;
    count = 0;
    while (end < text.length && count < 10) {
        if (!markdownSpecialChars.includes(text[end])) {
        count++;
        }
        end++;
    }

    // 截取并过滤 Markdown 特殊字符的文本片段
    const snippet = filterSpecialChars(text.slice(start, end));

    // 检查连续的中文字符是否不少于 6 个
    const chineseCharPattern = /[\u4e00-\u9fa5]+/g;
    const matchedChinese = snippet.match(chineseCharPattern);
    const totalChineseChars = matchedChinese ? matchedChinese.join('').length : 0;

    if (totalChineseChars < 6) {
        return null; // 如果连续中文字符少于 6 个，返回 null
    }

    // 在结果的前后添加省略号 "……"
    const snippetWithEllipsis = `…${snippet}…`;

    // 高亮关键词
    const highlightedSnippet = snippetWithEllipsis.replace(
        new RegExp(keyword, 'gi'),
        (match) => `<mark>${match}</mark>`
    );

    return highlightedSnippet;
};