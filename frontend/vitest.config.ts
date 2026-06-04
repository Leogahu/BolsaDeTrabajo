import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    maxWorkers: 1,
    fileParallelism: false,
    pool: 'forks',
  },
});
