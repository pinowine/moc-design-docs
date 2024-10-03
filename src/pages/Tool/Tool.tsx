import React from 'react';
import Editor from '../../components/Editor/Editor';

import './Tool.css'

interface ToolProps {
    isDarkMode: boolean
}

const Tool:React.FC<ToolProps> = ({isDarkMode}) => {
    return (
        <div className="tool-container">
            <div className="full-page-editor-container">
                <Editor isDarkMode={isDarkMode}/>
            </div>
        </div>
    )
}

export default Tool