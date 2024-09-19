import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // 如果你使用全局的测试方法
    environment: 'jsdom',  // 如果你需要模拟浏览器环境
    coverage: {
      reporter: ['text', 'json', 'html'],  // 生成覆盖率报告
    },
  },
});