import { render } from '@testing-library/react';
import MarkdownRenderer from '../MarkdownRenderer';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';  // 导入 jest-dom 扩展

describe('MarkdownRenderer', () => {
  const fold = 'docs';
  const file = 'example';

  // 在每个测试之前，模拟 fetch 请求
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => '# Sample Markdown Content\nThis is some test content.',
    } as unknown as Response);
  });

  // 在测试完成后恢复原有的 fetch 方法
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<MarkdownRenderer fold={fold} file={file} />);
    expect(getByText(/loading/i)).toBeInTheDocument(); // 检查初始的 Loading 组件是否渲染
  });

  it('fetches and displays markdown content', async () => {
    const { findByText } = render(<MarkdownRenderer fold={fold} file={file} />);

    // 使用 findByText 等待异步内容渲染
    const heading = await findByText('Sample Markdown Content');
    const content = await findByText('This is some test content.');

    // 确认 markdown 文件内容渲染正确
    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    // 模拟 fetch 失败的情况
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    } as unknown as Response);

    const { queryByText } = render(<MarkdownRenderer fold={fold} file={file} />);

    // 等待加载完成
    await new Promise((r) => setTimeout(r, 100));  // 等待异步加载结束

    // 确认错误不会导致组件崩溃
    expect(queryByText('Sample Markdown Content')).not.toBeInTheDocument();
  });
});