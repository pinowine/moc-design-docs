import React, {useState, useEffect, Suspense, useRef} from "react";
import CodeMirror from '@uiw/react-codemirror';
import { Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { Line } from '@codemirror/state';
import Split from '@uiw/react-split';
import Loading from "../Loading/Loading";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";

import {bespin} from 'thememirror';
import {ayuLight} from 'thememirror';

// icons

// template
import { TbTemplate } from "react-icons/tb";
import { FaDatabase } from "react-icons/fa";

// text-decoration
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaStrikethrough } from "react-icons/fa6";
import { FaUnderline } from "react-icons/fa";

// doc-hierarchy
import { FaHeading } from "react-icons/fa";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { LuHeading3 } from "react-icons/lu";
import { LuHeading4 } from "react-icons/lu";
import { FaGripLines } from "react-icons/fa6";

// function-components
import { FaLink } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaListOl } from "react-icons/fa6";
import { FaListUl } from "react-icons/fa6";
import { FaListCheck } from "react-icons/fa6";
import { FaTable } from "react-icons/fa";
import { FaTableColumns } from "react-icons/fa6";
import { FaTableList } from "react-icons/fa6";

// block-generator
import { BiCodeBlock } from "react-icons/bi";
import { IoCodeSlashSharp } from "react-icons/io5";
import { LuTextQuote } from "react-icons/lu";
import { BsChatLeftQuoteFill } from "react-icons/bs";
import { MdPrivacyTip } from "react-icons/md";
import Info from "../../assets/note-info.svg?react";
import Caution from "../../assets/note-caution.svg?react";
import Example from "../../assets/note-example.svg?react";
import Important from "../../assets/note-important.svg?react";
import Warning from "../../assets/note-warning.svg?react";
import Tip from "../../assets/note-tip.svg?react";

// user-handle
import { MdOutlineSaveAlt } from "react-icons/md";
import { GrClearOption } from "react-icons/gr";

// layout-adjustment
import { RiLayoutColumnLine } from "react-icons/ri";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";

// screen
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";

import './Editor.css'

interface EditorProps {
    isDarkMode: boolean
}

const Editor: React.FC<EditorProps> = ({isDarkMode}) => {
    const [markdownText, setMarkdownText] = useState('')
    const [isMobileMode, setIsMobileMode] = useState(false)
    const [codeLanguage, setCodeLanguage] = useState('md')
    const [tableRow, setTableRow] = useState('2')
    const [tableCol, setTableCol] = useState('2')
    const editorRef = useRef<EditorView | null>(null)
    const [isInputOnly, setIsInputOnly] = useState(false)
    const [isPreviewOnly, setIsPreviewOnly] = useState(false)
    const [isInputVisible, setIsInputVisible] = useState(true)
    const [isPreviewVisible, setIsPreviewVisible] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [toolbarHeight, setToolbarHeight] = useState('2rem')

    // define head info
    const [code, setCode] = useState('')
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [writer, setWriter] = useState('')
    const [firstDate, setFirstDate] = useState('')
    const [lastDate, setLastDate] = useState('')

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setIsMobileMode(true);
            if (isInputVisible && isPreviewVisible) {
                setIsPreviewVisible(false)
            }
            setToolbarHeight('4rem')
            if (window.innerWidth < 578) {
                setToolbarHeight('6rem')
                if (window.innerWidth < 350)
                    setToolbarHeight('10rem')
            }
          } else {
            setIsMobileMode(false);
            setToolbarHeight('2rem')
          }
        };
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Listen to fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const rootElement = document.getElementById('root');
        const bodyElement = document.body;

        if (rootElement) {
            if (isFullscreen) {
                rootElement.style.display = 'none'; // Hide #root when in fullscreen
                bodyElement.classList.add('fullscreen-mode'); // Add class to body to remove margin and hide overflow
            } else {
                rootElement.style.display = ''; // Show #root when not in fullscreen
                bodyElement.classList.remove('fullscreen-mode'); // Remove class from body
            }
        }
    }, [isFullscreen]);

    const tableTemplate = ( rows: string, cols: string ):string => {
        const rowNum = Number(rows)
        const colNum = Number(cols)
        if (rowNum < 2 || colNum < 1) return '';
        const header = `| ${' '.repeat(3)} `.repeat(colNum) + '|';
        const divider = `| ${'---'} `.repeat(colNum) + '|';

        const table = [header, divider];
        for (let i = 0; i < rowNum - 1; i++) {
            const row = `| ${' '.repeat(3)} `.repeat(colNum) + '|';
            table.push(row);
        }

        return table.join('\n');
    }

    const headDataTemplate = (code: string, title: string, desc: string, writer: string, firstDate: string, lastDate: string) => {
        return `---
code: ${code}
title: ${title}
desc: ${desc}
writer: ${writer}
first_date: ${firstDate}
last_date: ${lastDate}
---`}

    // define regex for check
    const codeRegex = /^(d|t|p)-[1-9]\d*(?:-[1-9]\d*)?(?:-[1-9]\d*)?$/

    // download md

    const extractTitleFromMarkdown = (markdownText: string): string => {
        const titleMatch = markdownText.match(/^title:\s*(.*)$/m);
    
        if (titleMatch && titleMatch[1]) {
            return titleMatch[1].trim();
        }

        return '标题缺失';
    };

    const downloadMarkdownFile = (markdownText: string) => {
        const filename = extractTitleFromMarkdown(markdownText);
        
        const blob = new Blob([markdownText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.md`; 
        a.click();
        URL.revokeObjectURL(url);
    };

    // define input change
    const handleInputChange = ( setValue: React.Dispatch<React.SetStateAction<string>>, e: React.ChangeEvent<HTMLInputElement> ) => {
        const inputValue = e.target.value;
        setValue(inputValue)
    }

    // define input change with check
    const checkInputChange = ( regex: RegExp, setValue: React.Dispatch<React.SetStateAction<string>>, e: React.ChangeEvent<HTMLInputElement> ) => {
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === '') {
            setValue(inputValue);
        } else {
            setValue('格式错误')
        }
    }

    // block generation onclick event
    const generateBlock = ( mark_before: string, mark_after: string | null ) => {
        const editor = editorRef.current
        if (!editor) return

        const { state, dispatch } = editor;
        const selection = state.selection.main;
        const from = selection.from;
        const to = selection.to;

        if (from === to){
            const transaction = state.update({
            changes: { from, to, insert: `${mark_before} ${mark_after}` },
            selection: { anchor: from + 2 }
          });
          dispatch(transaction);
        } else {
          const selectedText = state.sliceDoc(from, to);
          const transaction = state.update({
            changes: { from, to, insert: `${mark_before}${selectedText}${mark_after}` },
            selection: { anchor: from + 2, head: to + 2 }
          });
          dispatch(transaction);
        }
    }

    // component generation onclick event
    const generateComponent = ( component_code: string ) => {
        const editor = editorRef.current
        if (!editor) return

        const { state, dispatch } = editor;
        const selection = state.selection.main;
        const from = selection.from;
        const to = selection.to;

        const lineFrom = state.doc.lineAt(from);
        const isLineEmpty = (line: Line) => line.text.trim() === '';

        if (from === to){
            if (isLineEmpty(lineFrom)) {
                const transaction = state.update({
                    changes: { from, to, insert: `\n${component_code}\n` },
                    selection: { anchor: from + component_code.length + 2 }
                });
                dispatch(transaction);
            } else {
                const transaction = state.update({
                    changes: { from, to, insert: `\n\n${component_code}\n` },
                    selection: { anchor: from + component_code.length + 2 }
                });
                dispatch(transaction);
            }
        } else {
            const transaction = state.update({
                changes: { from, to, insert: `\n\n${component_code}\n\n` },
                selection: { anchor: from + component_code.length + 2, head: to + component_code.length + 2 }
            });
            dispatch(transaction);
        }
    }

    // input & preview visibility

    const toggleInputOnly = () => {
        setIsPreviewOnly(false)
        setIsInputOnly(true)
        setIsInputVisible(true)
        setIsPreviewVisible(false)
    }

    const togglePreviewOnly = () => {
        setIsPreviewOnly(true)
        setIsInputOnly(false)
        setIsInputVisible(false)
        setIsPreviewVisible(true)
    }

    const toggleDefaultLayout = () => {
        setIsPreviewOnly(false)
        setIsInputOnly(false)
        setIsInputVisible(true)
        setIsPreviewVisible(true)
    }

    const editorContent = (
        <div className={`editor-container ${isFullscreen ? 'full-screen' : ''}`}>
            <div className="editor-toolbar" style={{ height: `${toolbarHeight}`}}>
                <div className="editor-tool-container document-tools">
                    <ul className="text-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button 
                                    className="button" title="加粗（Ctrl+B）" onClick={() => generateBlock('**', '**')}
                                >
                                    <FaBold/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>加粗</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button 
                                    className="button" title="斜体（Ctrl+I）" onClick={() => generateBlock('*', '*')}
                                >
                                    <FaItalic/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>斜体</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button 
                                    className="button" title="删除线（Alt+D）" onClick={() => generateBlock('~~','~~')}
                                >
                                    <FaStrikethrough/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>删除线</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button 
                                    className="button" title="下划线（Ctrl+U）" onClick={() => generateBlock('<u>','</u>')}
                                >
                                    <FaUnderline/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>下划线</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                    </ul>
                    <div className="toolbar-divider"></div>
                    <ul className="hierarchy-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper has-inner-list" tabIndex={0}>
                                <FaDatabase/>
                                <ul className="inner-list">
                                    <li className="header">
                                        <Link to='/tutorials/帮助建设我们的文档/使用Markdown语言撰写文档#头部'>
                                            <header>头数据生成</header>
                                        </Link>
                                    </li>
                                    <li className="generation-input">
                                        <div className="input-wrapper">
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="code">路径码：</label>
                                                <input 
                                                    id="code"
                                                    type="text" 
                                                    name="code"
                                                    value={code} 
                                                    placeholder='格式：(d,t,p)-1(-1(-1))' 
                                                    onChange={(e) => handleInputChange(setCode, e)}
                                                    onBlur={(e) => checkInputChange(codeRegex, setCode, e)}
                                                />
                                            </div>
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="title">标题：</label>
                                                <input 
                                                    id="title"
                                                    type="text" 
                                                    name="title"
                                                    value={title} 
                                                    placeholder='和文档一级标题一致' 
                                                    onChange={(e) => handleInputChange(setTitle, e)}
                                                />
                                            </div>
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="desc">简介：</label>
                                                <input 
                                                    id="desc"
                                                    type="text" 
                                                    name="desc"
                                                    value={desc} 
                                                    placeholder='尽量简短' 
                                                    onChange={(e) => handleInputChange(setDesc, e)}
                                                />
                                            </div>
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="writer">作者：</label>
                                                <input 
                                                    id="writer"
                                                    type="text" 
                                                    name="writer"
                                                    value={writer} 
                                                    placeholder='你的花名是' 
                                                    onChange={(e) => handleInputChange(setWriter, e)}
                                                />
                                            </div>
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="firstDate">递交日期：</label>
                                                <input 
                                                    id="firstDate"
                                                    type="date" 
                                                    name="firstDate"
                                                    value={firstDate} 
                                                    onChange={(e) => handleInputChange(setFirstDate, e)}
                                                />
                                            </div>
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="lastDate">最后更改日期：</label>
                                                <input 
                                                    id="lastDate"
                                                    type="date" 
                                                    name="lastDate"
                                                    value={lastDate} 
                                                    onChange={(e) => handleInputChange(setLastDate, e)}
                                                />
                                            </div>
                                        </div>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button" title="插入头部" onClick={() => generateComponent(headDataTemplate(code, title, desc, writer, firstDate, lastDate))}>
                                            <FaDatabase/>
                                            <span className="inner-list-item-desc">插入头部</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div 
                                className="tool-icon-wrapper has-inner-list"
                                tabIndex={0}
                            >
                                <FaHeading/>
                                <ul className="inner-list">
                                    <li className="header">
                                        <header>标题</header>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button" onClick={() => generateBlock('#', '')}>
                                            <LuHeading1/>
                                            <span className="inner-list-item-desc">一级标题</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button" onClick={() => generateBlock('##', '')}>
                                            <LuHeading2/>
                                            <span className="inner-list-item-desc">二级标题</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button" onClick={() => generateBlock('###', '')}>
                                            <LuHeading3/>
                                            <span className="inner-list-item-desc">三级标题</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button" onClick={() => generateBlock('####', '')}>
                                            <LuHeading4/>
                                            <span className="inner-list-item-desc">四级标题</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button 
                                    className="button" onClick={() => generateComponent('********')}
                                >
                                    <FaGripLines/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>分割线</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                    </ul>
                    <div className="toolbar-divider"></div>
                    <ul className="functional-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="添加一个空连接" onClick={() => generateBlock('[', ']()')}>
                                    <FaLink/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>空链接</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="行内代码块" onClick={() => generateBlock('`', '`')}>
                                    <FaCode/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>行内代码块</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="有序列表" onClick={() => generateComponent('1. ')}>
                                    <FaListOl/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>有序列表</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="无序列表" onClick={() => generateComponent('- ')}>
                                    <FaListUl/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>无序列表</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="任务列表" onClick={() => generateComponent('- [ ] a\n- [ ] b')}>
                                    <FaListCheck/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>任务列表</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper has-inner-list" tabIndex={0}>
                                <FaTable/>
                                <ul className="inner-list">
                                    <li className="header">
                                        <header>表格</header>
                                    </li>
                                    <li className="generation-input">
                                        <div className="input-wrapper">
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="table">行数：</label>
                                                <input 
                                                    id="tableRow"
                                                    type="number" 
                                                    min={2}
                                                    name="table"
                                                    value={tableRow} 
                                                    placeholder='行数' 
                                                    onChange={(e) => handleInputChange(setTableRow, e)}
                                                />
                                            </div>
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="table">列数：</label>
                                                <input 
                                                    id="tableCol"
                                                    type="number" 
                                                    min={2}
                                                    name="table"
                                                    value={tableCol} 
                                                    placeholder='列数'
                                                    onChange={(e) => handleInputChange(setTableCol, e)}
                                                />
                                            </div>
                                        </div>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button" title="插入GFM表格" onClick={() => generateComponent(tableTemplate(tableRow, tableCol))}>
                                            <FaTableColumns />
                                            <span className="inner-list-item-desc">生成GFM表格</span>
                                        </button>
                                    </li>
                                    <hr />
                                    <li className="tool-icon">
                                        <Link className="button" to={`https://www.tablesgenerator.com/html_tables`}>
                                            <FaTableList />
                                            <span className="inner-list-item-desc">制作HTML表格</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div className="toolbar-divider"></div>
                    <ul className="block-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper has-inner-list"  tabIndex={1}>
                                <BiCodeBlock/>
                                <ul className="inner-list" >
                                    <li className="header">
                                        <header>区域代码块</header>
                                    </li>
                                    <div className="input-wrapper">
                                        <li className="generation-input">
                                            <div className="inline-input-wrapper">
                                                <label className="input-desc" htmlFor="codeName">语言：</label>
                                                <input 
                                                    type="text" 
                                                    id="codeNameInput"
                                                    name="codeName"
                                                    value={codeLanguage} 
                                                    placeholder="代码语言" 
                                                    onChange={(e) => handleInputChange(setCodeLanguage, e)}
                                                />
                                            </div>
                                        </li>
                                    </div>
                                    <li className="tool-icon">
                                        <button className="button" title="区域代码块" onClick={() => generateComponent(`\`\`\`${codeLanguage}\n\n\`\`\``)}>
                                            <IoCodeSlashSharp />
                                            <span className="inner-list-item-desc">生成：默认样式</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button example-good" title="区域代码块" onClick={() => generateComponent('```(language) example-good\n\n```')}>
                                            <span className="inner-list-item-desc">生成：良好示例</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button example-bad" title="区域代码块" onClick={() => generateComponent('```(language) example-bad\n\n```')}>
                                            <span className="inner-list-item-desc">生成：错误示例</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="区域引用" onClick={() => generateComponent('> ')}>
                                    <LuTextQuote/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>区域引用</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" title="标记块" onClick={() => generateComponent('> [!CALLOUT] \n> \n> ')}>
                                    <BsChatLeftQuoteFill/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>标记块</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper has-inner-list" tabIndex={0}>
                                <MdPrivacyTip/>
                                <ul className="inner-list local-icons">
                                    <li className="header">
                                        <header>补充说明块</header>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button note" onClick={() => generateComponent('> [!NOTE] (title)\n>\n> ')}>
                                            <Info/>
                                            <span className="inner-list-item-desc">备注块</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button warning" onClick={() => generateComponent('> [!WARNING] (title)\n> \n> ')}>
                                            <Warning/>
                                            <span className="inner-list-item-desc">警告块</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button caution" onClick={() => generateComponent('> [!CAUTION] (title)\n> \n> ')}>
                                            <Caution/>
                                            <span className="inner-list-item-desc">注意块</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button tip" onClick={() => generateComponent('> [!TIP] (title)\n> \n> ')}>
                                            <Tip/>
                                            <span className="inner-list-item-desc">小贴士块</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button example" onClick={() => generateComponent('> [!EXAMPLE] (title)\n> \n> ')}>
                                            <Example/>
                                            <span className="inner-list-item-desc">示例块</span>
                                        </button>
                                    </li>
                                    <li className="tool-icon">
                                        <button className="button important" onClick={() => generateComponent('> [!IMPORTANT] (title)\n> \n> ')}>
                                            <Important/>
                                            <span className="inner-list-item-desc">重要块</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div className="toolbar-divider"></div>
                    <ul className="user-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" onClick={() => downloadMarkdownFile(markdownText)}>
                                    <MdOutlineSaveAlt/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>保存到本地</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" onClick={() => {setMarkdownText('')}}>
                                    <GrClearOption/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>清空编辑器</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="editor-tool-container layout-tools">
                    <ul className="content-layout-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className={`button ${isMobileMode ? 'disabled' : ''}`} onClick={toggleDefaultLayout} disabled={isMobileMode ? true : false}>
                                    <RiLayoutColumnLine/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>{`${isMobileMode ? '禁用分屏' : '默认状态'}`}</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" onClick={togglePreviewOnly}>
                                    <TbLayoutSidebarLeftCollapseFilled/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>仅预览</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" onClick={toggleInputOnly}>
                                    <TbLayoutSidebarRightCollapseFilled/>
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>仅编辑</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                    </ul>
                    <div className="toolbar-divider"></div>
                    <ul className="screen-tool">
                        <li className="tool-icon">
                            <div className="tool-icon-wrapper">
                                <button className="button" onClick={toggleFullscreen}>
                                    {isFullscreen ? <MdFullscreenExit/> : <MdFullscreen/>}
                                    <ul className="inner-list">
                                        <li className="tool-icon">
                                            <header>{isFullscreen ? '退出全屏' : '全屏'}</header>
                                        </li>
                                    </ul>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <Split
                mode='horizontal'
                className={`editor-content ${ (isInputOnly || isPreviewOnly || isMobileMode) ? 'visually-hidden' : ''}`}
                style={{height: `calc(100% - ${toolbarHeight})`}}
                renderBar={({ onMouseDown, ...props }) => {
                    return (
                        <div {...props} style={{ boxShadow: 'none', background: 'transparent' }}>
                            <div onMouseDown={onMouseDown} style={{ backgroundColor: 'var(--border-secondary)', boxShadow: 'none', height: '100%' }} />
                        </div>
                    );
                }}
            >
                <div 
                    className={`editor-input-wrapper`}
                    style={{ width: '20%', minWidth: 30 }}
                >
                    <div className="editor-input">
                        <CodeMirror
                            value={markdownText}
                            height="100%"
                            extensions={[markdown()]}
                            theme={isDarkMode ? bespin : ayuLight}
                            onChange={(value) => {
                            setMarkdownText(value);
                            }}
                            onCreateEditor={(view) => { editorRef.current = view; }}
                        />
                    </div>
                </div>
                <div 
                    className={`editor-preview-wrapper`}
                    style={{ width: '80%', minWidth: 100 }}
                >
                    <div className="editor-preview">
                        <MarkdownRenderer markdown={markdownText} writer={writer} firstDate={firstDate} lastDate={lastDate} desc={desc} />
                    </div>
                </div>
            </Split>
            <div 
                className={`editor-content ${(isInputOnly || isPreviewOnly || isMobileMode) ? '' : 'visually-hidden'}`}
                style={{ height: `calc(100% - ${toolbarHeight})`}}
            >
                <div 
                    className={`editor-input ${isInputOnly ? 'input-only' : ''} ${isInputVisible ? '' : 'visually-hidden'}`}
                >
                    <CodeMirror
                        value={markdownText}
                        height="100%"
                        extensions={[markdown()]}
                        theme={isDarkMode ? bespin : ayuLight}
                        onChange={(value) => {
                        setMarkdownText(value);
                        }}
                        onCreateEditor={(view) => { editorRef.current = view; }}
                    />
                </div>
                <div 
                    className={`editor-preview ${isPreviewOnly ? 'preview-only' : ''} ${isPreviewVisible ? '' : 'visually-hidden'}`}
                >
                    <MarkdownRenderer markdown={markdownText} writer={writer} firstDate={firstDate} lastDate={lastDate} desc={desc}/>
                </div>
            </div>
        </div>
    )

    const createWrapper = (wrapperContent: JSX.Element) => {
        return(
            <div className="page-wrapper category-html document-page">
                {wrapperContent}
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading/>}>
            {isFullscreen ? ReactDOM.createPortal(createWrapper(editorContent), document.body) : editorContent}
        </Suspense>
    )

}

export default Editor