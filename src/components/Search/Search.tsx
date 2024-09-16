import React, { useState, useEffect } from 'react';
import { getMarkdownFiles } from '../../utils/getMarkdownFiles';
import { getDocumentPath } from '../../utils/getDocumentPath'; // 引入工具函数
import { highlightMatchedText } from '../../utils/highlightMatchedText'; // 引入高亮函数
import './Search.css';  // 导入样式

interface SearchResult {
  fileName: string;
  filePath: string;
  matchedLine: string;
}

const Search: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false); // 控制input框是否聚焦
  const [activeDescendant, setActiveDescendant] = useState<string | null>(null); // 当前选择的搜索结果项

  useEffect(() => {
    const searchFiles = async () => {
      const files = await getMarkdownFiles();
      const results: SearchResult[] = [];
      const fileCountMap: { [key: string]: number } = {}; // 记录每个文件的匹配次数

      for (const fileObj of files) {
        const { fileName, content, type } = fileObj;
        // console.log('fileName:', fileName); // 打印文件名
        // console.log('content:', content); // 打印文件内容
        // console.log('type:', type); // 打印文件类型
        const lines = content.split('\n');

        // 在对应的 JSON 文件中查找路径
        const documentPathData = await getDocumentPath(fileName, type);

        if (documentPathData) {
          const { path: filePathParts, prefix } = documentPathData;
          const filePath = `/${prefix}/${filePathParts.join('/')}`; // 构建路径

          lines.forEach((line: string) => {
            if (line.toLowerCase().includes(keyword.toLowerCase())) {

              // 如果该文件已经有 2 个结果，跳过
              if (!fileCountMap[fileName]) {
                fileCountMap[fileName] = 0;
              }

              if (fileCountMap[fileName] >= 2) {
                return; // 超过 2 个时不再添加
              }

              fileCountMap[fileName] += 1; // 记录当前文件的匹配次数

              results.push({
                fileName,
                filePath,
                matchedLine: line,
              });
            }
          });
        }
      }

      setSearchResults(results);
    };

    if (keyword) {
      searchFiles();
    } else {
      setSearchResults([]);
    }
  }, [keyword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // console.log('Keyword input:', inputValue); // 打印当前的关键词
    setKeyword(inputValue);
  };

  const clearSearch = () => {
    setKeyword(''); // 清空输入框内容
    setActiveDescendant(null); // 重置 activeDescendant
  };

  const handleSearchClick = () => {
    if (searchResults.length > 0) {
      const firstResultPath = searchResults[0].filePath; // 获取第一个搜索结果的路径
      window.location.href = firstResultPath; // 跳转到第一个结果
    }
  };

  // 当 input 框聚焦时，设置 aria-expanded 为 true
  const handleInputFocus = () => {
    setIsFocused(true);
  };

  // 当 input 框失去焦点时，设置 aria-expanded 为 false
  const handleInputBlur = () => {
    setIsFocused(false);
    setActiveDescendant(null); // 失去焦点时重置 activedescendant
  };

  return (
    <div className={`header-search ${searchResults.length > 0 ? 'has-search-results' : ''}`}>
        <form 
          action="/zh-CN/search" 
          className='search-form search-widget' 
          id='top-nav-search-form' 
          role='search' 
          onSubmit={(e) => e.preventDefault()}
        >
            <label id="top-nav-search-label" form="top-nav-search-input" className="visually-hidden">Search MDD</label>
            <input
                type="search"
                value={keyword}
                onChange={handleInputChange}
                onFocus={handleInputFocus}  // 聚焦事件
                onBlur={handleInputBlur}    // 失去焦点事件
                placeholder="   "
                className="search-input-field"
                aria-activedescendant={activeDescendant ? `top-nav-search-result-${activeDescendant}` : undefined}
                aria-expanded={isFocused && searchResults.length > 0 ? 'true' : 'false'}
                aria-autocomplete='list'
                aria-controls='top-nav-search-menu'
                aria-labelledby='top-nav-search-label'
                autoComplete='off'
                id='top-nav-search-input'
                role='combobox'
                name='q'
            />
            <button 
              type="button" 
              className="button action has-icon clear-search-button"
              style={{ display: keyword ? 'block' : 'none' }} // 有内容时显示
              onClick={clearSearch} // 点击时清空内容
            >
                <span className="button-wrap">
                    <span className="icon icon-cancel "></span>
                    <span className="visually-hidden">Clear search input</span>
                </span>
            </button>
            <button 
              type="submit" 
              className={`button action has-icon search-button ${searchResults.length === 0 ? 'disabled' : ''}`}
              onClick={handleSearchClick} // 点击按钮时执行跳转
              disabled={searchResults.length === 0} // 当没有搜索结果时禁用按钮
            >
                <span className="button-wrap">
                    <span className="icon icon-search "></span>
                    <span className="visually-hidden">Search</span>
                </span>
            </button>
            <div id="top-nav-search-menu" role="listbox" aria-labelledby="top-nav-search-label">
              {keyword && (
                <div className="search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => {
                      const highlightedText = highlightMatchedText(result.matchedLine, keyword);

                      if (!highlightedText) {
                        return null;
                      }

                      return (
                        <div 
                          key={index} 
                          role='option' 
                          aria-selected='false' 
                          id={`top-nav-search-result-${index}`}
                          className='result-item'
                        >
                          <a href={result.filePath} tabIndex={-1}>
                            <b dangerouslySetInnerHTML={{
                              __html: highlightedText
                            }} />
                            <br />
                            <small>{result.filePath}</small>
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <div className="result-item nothing-found">
                      <a href='' className='no-result'>无结果</a>
                    </div> // 无结果时显示此消息
                  )}
                </div>
              )}
            </div>
        </form>
    </div>
  );
};

export default Search;
