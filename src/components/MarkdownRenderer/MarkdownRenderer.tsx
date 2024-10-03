import React, { useEffect, useRef, Suspense, lazy } from 'react';
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

import tablePlugin from './plugins/tablePlugin';
import linkPlugin from './plugins/linkPlugin';
import imagePlugin from './plugins/imagePlugin';
import lazyIframePlugin from './plugins/lazyIframePlugin';

import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const markdownContainerRef = useRef<HTMLDivElement>(null);

  // 加载 iframe 的函数
  const loadIframe = (iframePlaceholder: HTMLElement) => {
    const iframeSrc = iframePlaceholder.getAttribute('data-src');

    if (iframeSrc) {
      const iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.width = '800';
      iframe.height = '450';
      iframe.style.border = '1px solid rgba(0, 0, 0, 0.1)';
      iframePlaceholder.innerHTML = '';
      iframePlaceholder.appendChild(iframe);
    }
  };

  // 复制代码的函数
  const copyCode = (button: HTMLElement, codeText: string) => {
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
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
        }, 500);
      })
      .catch((err) => console.error('Failed to copy code: ', err));
  };

  useEffect(() => {
    const container = markdownContainerRef.current;
    if (container) {
      const buttons = container.querySelectorAll('.copy-icon');
      buttons.forEach((button) => {
        const codeText = button.parentElement?.nextSibling?.textContent || '';
        button.addEventListener('click', () => copyCode(button as HTMLElement, codeText));
      });

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframePlaceholder = entry.target as HTMLElement;
            loadIframe(iframePlaceholder);
            observer.unobserve(iframePlaceholder);
          }
        });
      });

      const placeholders = container.querySelectorAll('.iframe-placeholder');
      placeholders.forEach((placeholder) => {
        observer.observe(placeholder);
      });

      return () => observer.disconnect();
    }
  }, [markdown]);

  // 使用 unified 处理 Markdown
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(highlight, { prefix: '' })
    .use(codeExamplePlugin)
    .use(rehypeRaw)
    .use(sectionCleanerPlugin)
    .use(h2Plugin)
    .use(h1Plugin)
    .use(h3Plugin)
    .use(blockquotePlugin)
    .use(tablePlugin)
    .use(linkPlugin)
    .use(imagePlugin, { basePath: `${import.meta.env.BASE_URL || ''}` })
    .use(lazyIframePlugin)
    .use(rehypeStringify);

  const processedMarkdown = processor.processSync(markdown).toString();

  return (
    <div className="markdown-container" ref={markdownContainerRef}>
      <Suspense fallback={<Loading />}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{processedMarkdown}</ReactMarkdown>
      </Suspense>
    </div>
  );
};

export default MarkdownRenderer;