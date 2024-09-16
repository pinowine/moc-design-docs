import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import Loading from '../Loading/Loading';
const ReactMarkdown = lazy(() => import('react-markdown'));

import { unified } from 'unified';
import rehypeRaw from 'rehype-raw';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import highlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import h1Plugin from './plugins/h1Plugin';
import h2Plugin from './plugins/h2Plugin';
import h3Plugin from './plugins/h3Plugin';
import sectionCleanerPlugin from './plugins/sectionCleanerPlugin';

import codeExamplePlugin from './plugins/codeExamplePlugin';
import blockquotePlugin from './plugins/blockQuotePlugin';

import ulToDlPlugin from './plugins/ulToDlPlugin';
import tablePlugin from './plugins/tablePlugin';
import linkPlugin from './plugins/linkPlugin';
import imagePlugin from './plugins/imagePlugin';

import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  fold: string;
  file: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ fold, file }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const markdownContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const encodedFile = encodeURIComponent(file);
        const encodedFold = encodeURIComponent(fold);
        const basePath = import.meta.env.BASE_URL || ''; // Fetch the base URL from Vite's environment variables
        const url = `${basePath}documents/${encodedFold}/${encodedFile}.md`; // Add basePath prefix here
        // console.log('Fetching markdown file:', url);
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          setMarkdown(text);
        } else {
          console.error('Failed to fetch markdown file:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching markdown file:', error);
      }
    };

    fetchMarkdown();
  }, [fold, file]);

  const copyCode = (button: HTMLElement, codeText: string) => {
    navigator.clipboard.writeText(codeText).then(() => {
      let copyTextElement = button.nextElementSibling;
      if (!copyTextElement || !copyTextElement.classList.contains('copy-icon-message')) {
        copyTextElement = document.createElement('span');
        copyTextElement.textContent = 'Copied!';
        copyTextElement.className = 'copy-icon-message';
        button.parentNode?.insertBefore(copyTextElement, button.nextSibling);
      }
      copyTextElement.classList.remove('visually-hidden');
      setTimeout(() => {
        copyTextElement?.classList.add('visually-hidden');
      }, 500); // 0.5秒后重新添加`visually-hidden`类
    }).catch(err => console.error('Failed to copy code: ', err));
  };

  useEffect(() => {
    const container = markdownContainerRef.current;
    if (container) {
      const buttons = container.querySelectorAll('.copy-icon');
      buttons.forEach((button) => {
        const codeText = button.parentElement?.nextSibling?.textContent || '';
        button.addEventListener('click', () => copyCode(button as HTMLElement, codeText));
      });
    }
  }, [markdown]);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(sectionCleanerPlugin)
    .use(h2Plugin)
    .use(h1Plugin)
    .use(h3Plugin)
    .use(ulToDlPlugin)
    .use(blockquotePlugin)
    .use(tablePlugin)
    .use(highlight, { prefix: '' })
    .use(codeExamplePlugin)
    .use(imagePlugin, { basePath: `${import.meta.env.BASE_URL || ''}` })
    .use(linkPlugin)
    .use(rehypeStringify);

  const processedMarkdown = processor.processSync(markdown).toString();

  return (
    <div
      className="markdown-container"
      ref={markdownContainerRef}
    >
      <Suspense fallback={<Loading/>} >
        <ReactMarkdown rehypePlugins={[rehypeRaw]} >{processedMarkdown}</ReactMarkdown>
      </Suspense>
    </div>
  );
};

export default MarkdownRenderer;
