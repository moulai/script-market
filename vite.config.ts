import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 根据环境变量设置不同的 base 路径
  // 在 GitHub Pages 上使用仓库名作为 base 路径
  // 在本地开发环境使用相对路径
  base: process.env.NODE_ENV === 'production' ? '/script-market/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});