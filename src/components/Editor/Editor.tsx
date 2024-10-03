import React, {useState, useEffect, Suspense, useRef} from "react";
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import Split from '@uiw/react-split';
import Loading from "../Loading/Loading";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";

import {barf} from 'thememirror';
import {ayuLight} from 'thememirror';

// icons

// template
import { TbTemplate } from "react-icons/tb";

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

// block-generator
import { BiCodeBlock } from "react-icons/bi";
import { TbBlockquote } from "react-icons/tb";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import Info from "../../assets/note-info.svg?react";
import Caution from "../../assets/note-caution.svg?react";
import Example from "../../assets/note-example.svg?react";
import Important from "../../assets/note-important.svg?react";
import Warning from "../../assets/note-warning.svg?react";
import Tip from "../../assets/note-tip.svg?react";

// user-handle
import { MdOutlineSaveAlt } from "react-icons/md";

// layout-adjustment
import { BsLayoutSidebar } from "react-icons/bs";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { BsLayoutSplit } from "react-icons/bs";
import { MdFullscreen } from "react-icons/md";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";


import './Editor.css'

interface EditorProps {
    isDarkMode: boolean
}

const Editor: React.FC<EditorProps> = ({isDarkMode}) => {
    const [markdownText, setMarkdownText] = useState('');
    const [splitDirection, setSplitDirection] = useState<'vertical' | 'horizontal'>('vertical');
    const editorRef = useRef<EditorView | null>(null);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setSplitDirection('vertical');
          } else {
            setSplitDirection('horizontal');
          }
        };
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    // define templates
    const Template = `---
code: 
level: 
parent: 
title: 
type: 
desc: 
---

# MainTitle

description

## SubTitle1

content

### SubSubTitle

content

## SubTitle2

content`

    //   define tools onclick event
    const generateTemplate = () => {
        setMarkdownText(Template)
    };

    // bold onclick event
    const generateBold = () => {
        const editor = editorRef.current
        if (!editor) return

        const { state, dispatch } = editor;
        const selection = state.selection.main;
        const from = selection.from;
        const to = selection.to;

        if (from === to){
            const transaction = state.update({
            changes: { from, to, insert: '** **' },
            selection: { anchor: from + 2 }
          });
          dispatch(transaction);
        } else {
          const selectedText = state.sliceDoc(from, to);
          const transaction = state.update({
            changes: { from, to, insert: `**${selectedText}**` },
            selection: { anchor: from + 2, head: to + 2 }
          });
          dispatch(transaction);
        }
    }

    // italic onclick event 
    const generateItalic = () => {
        const editor = editorRef.current
        if (!editor) return

        const { state, dispatch } = editor;
        const selection = state.selection.main;
        const from = selection.from;
        const to = selection.to;

        if (from === to){
            const transaction = state.update({
            changes: { from, to, insert: '* *' },
            selection: { anchor: from + 2 }
          });
          dispatch(transaction);
        } else {
          const selectedText = state.sliceDoc(from, to);
          const transaction = state.update({
            changes: { from, to, insert: `*${selectedText}*` },
            selection: { anchor: from + 2, head: to + 2 }
          });
          dispatch(transaction);
        }
    }

    // strick through onclick event 
    const generateStrick = () => {
        const editor = editorRef.current
        if (!editor) return

        const { state, dispatch } = editor;
        const selection = state.selection.main;
        const from = selection.from;
        const to = selection.to;

        if (from === to){
            const transaction = state.update({
            changes: { from, to, insert: '~~ ~~' },
            selection: { anchor: from + 2 }
          });
          dispatch(transaction);
        } else {
          const selectedText = state.sliceDoc(from, to);
          const transaction = state.update({
            changes: { from, to, insert: `~~${selectedText}~~` },
            selection: { anchor: from + 2, head: to + 2 }
          });
          dispatch(transaction);
        }
    }

    // underline onclick event 
    const generateUnderline = () => {
        const editor = editorRef.current
        if (!editor) return

        const { state, dispatch } = editor;
        const selection = state.selection.main;
        const from = selection.from;
        const to = selection.to;

        if (from === to){
            const transaction = state.update({
            changes: { from, to, insert: '<u> </u>' },
            selection: { anchor: from + 2 }
          });
          dispatch(transaction);
        } else {
          const selectedText = state.sliceDoc(from, to);
          const transaction = state.update({
            changes: { from, to, insert: `<u>${selectedText}</u>` },
            selection: { anchor: from + 2, head: to + 2 }
          });
          dispatch(transaction);
        }
    }

    return (
        <Suspense fallback={<Loading/>}>
            <div className="editor-container">
                <div className="editor-toolbar">
                    <div className="editor-tool-container document-tools">
                        <ul className="template-tool">
                            <li className="tool-icon">
                                <button className="button" title={`生成一个模板（Alt+T）\r注意：会覆盖现有代码`} onClick={generateTemplate}>
                                    <TbTemplate/>
                                </button>
                            </li>
                        </ul>
                        <div className="toolbar-divider"></div>
                        <ul className="text-tool">
                            <li className="tool-icon">
                                <button 
                                    className="button" title="加粗（Ctrl+B）" onClick={generateBold}
                                >
                                    <FaBold/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button 
                                    className="button" title="斜体（Ctrl+I）" onClick={generateItalic}
                                >
                                    <FaItalic/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button 
                                    className="button" title="删除线（Alt+D）" onClick={generateStrick}
                                >
                                    <FaStrikethrough/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button 
                                    className="button" title="下划线（Ctrl+U）" onClick={generateUnderline}
                                >
                                    <FaUnderline/>
                                </button>
                            </li>
                        </ul>
                        <div className="toolbar-divider"></div>
                        <ul className="hierarchy-tool">
                            <li className="tool-icon">
                                    <div 
                                        className=""
                                    >
                                        <FaHeading/>
                                        <ul className="inner-list">
                                            <li className="tool-icon">
                                                <button className="button">
                                                    <LuHeading1/>
                                                    <span className="inner-list-item-desc">一级标题</span>
                                                </button>
                                            </li>
                                            <li className="tool-icon">
                                                <button className="button">
                                                    <LuHeading2/>
                                                    <span className="inner-list-item-desc">二级标题</span>
                                                </button>
                                            </li>
                                            <li className="tool-icon">
                                                <button className="button">
                                                    <LuHeading3/>
                                                    <span className="inner-list-item-desc">三级标题</span>
                                                </button>
                                            </li>
                                            <li className="tool-icon">
                                                <button className="button">
                                                    <LuHeading4/>
                                                    <span className="inner-list-item-desc">四级标题</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                            </li>
                            <li className="tool-icon">
                                <button 
                                    className="button"
                                >
                                    <FaGripLines/>
                                </button>
                            </li>
                        </ul>
                        <div className="toolbar-divider"></div>
                        <ul className="functional-tool">
                            <li className="tool-icon">
                                <button className="button" title="添加一个空连接">
                                    <FaLink/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <FaCode/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <FaListOl/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <FaListUl/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <FaListCheck/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <FaTable/>
                                </button>
                            </li>
                        </ul>
                        <div className="toolbar-divider"></div>
                        <ul className="block-tool">
                            <li className="tool-icon">
                                <button className="button">
                                    <BiCodeBlock/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <TbBlockquote/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <div className="">
                                    <MdOutlineSpeakerNotes/>
                                    <ul className="inner-list local-icons">
                                        <li className="tool-icon">
                                            <button className="button">
                                                <Info/>
                                            </button>
                                        </li>
                                        <li className="tool-icon">
                                            <button className="button">
                                                <Warning/>
                                            </button>
                                        </li>
                                        <li className="tool-icon">
                                            <button className="button">
                                                <Caution/>
                                            </button>
                                        </li>
                                        <li className="tool-icon">
                                            <button className="button">
                                                <Tip/>
                                            </button>
                                        </li>
                                        <li className="tool-icon">
                                            <button className="button">
                                                <Example/>
                                            </button>
                                        </li>
                                        <li className="tool-icon">
                                            <button className="button">
                                                <Important/>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        <div className="toolbar-divider"></div>
                        <ul className="user-tool">
                            <li className="tool-icon">
                                <button className="button">
                                    <MdOutlineSaveAlt/>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="editor-tool-container layout-tools">
                        <ul className="content-layout-tool">
                            <li className="tool-icon">
                                <button className="button">
                                    <BsLayoutSidebar/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <BsLayoutSidebarReverse/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <BsLayoutSplit/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <TbLayoutSidebarLeftCollapseFilled/>
                                </button>
                            </li>
                            <li className="tool-icon">
                                <button className="button">
                                    <TbLayoutSidebarRightCollapseFilled/>
                                </button>
                            </li>
                        </ul>
                        <div className="toolbar-divider"></div>
                        <ul className="screen-tool">
                            <li className="tool-icon">
                                <button className="button">
                                    <MdFullscreen/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <Split
                    mode={splitDirection}
                    className="editor-content"
                    renderBar={({ onMouseDown, ...props }) => {
                        return (
                            <div {...props} style={{ boxShadow: 'none', background: 'transparent' }}>
                                <div onMouseDown={onMouseDown} style={{ backgroundColor: 'var(--border-secondary)', boxShadow: 'none', height: '100%' }} />
                            </div>
                        );
                    }}
                >
                    <div 
                        className="editor-input"
                        style={{ flex: 1, overflow: 'auto' }}
                    >
                        <CodeMirror
                            value={markdownText}
                            height="100%"
                            extensions={[markdown()]}
                            theme={isDarkMode ? barf : ayuLight}
                            onChange={(value) => {
                            setMarkdownText(value);
                            }}
                            onCreateEditor={(view) => { editorRef.current = view; }}
                        />
                    </div>
                    <div 
                        className="editor-preview"
                        style={{ width: "50%", maxWidth: '80%', overflow: 'auto' }}
                    >
                        <MarkdownRenderer markdown={markdownText} />
                    </div>
                </Split>
            </div>
        </Suspense>
    )

}

export default Editor