import React, { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownFetcherProps {
  fold: string;
  file: string;
}

const MarkdownFetcher: React.FC<MarkdownFetcherProps> = ({ fold, file }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const encodedFile = encodeURIComponent(file);
        const encodedFold = encodeURIComponent(fold);
        const basePath = import.meta.env.BASE_URL || '';
        const url = `${basePath}documents/${encodedFold}/${encodedFile}.md`;
        const response = await fetch(url);
        if (response.ok) {
          let text = await response.text();

          // 移除前置内容（Front Matter）
          if (text.startsWith('---')) {
            const frontMatterEndIndex = text.indexOf('---', 3);
            if (frontMatterEndIndex !== -1) {
              text = text.slice(frontMatterEndIndex + 3).trim();
            }
          }

          setMarkdown(text);
        } else {
          console.error('Failed to fetch markdown file:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching markdown file:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [fold, file]);

  if (loading) {
    return <Loading />;
  }

  return <MarkdownRenderer markdown={markdown} />;
};

export default MarkdownFetcher;
