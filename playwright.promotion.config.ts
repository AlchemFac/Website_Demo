import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'promotion.spec.ts',
  outputDir: 'test-results/promotion',
  use: { ...base.use, baseURL: 'http://127.0.0.1:4330' },
  webServer: {
    command: 'npm run preview:promotion -- --host 127.0.0.1 --ignore-lock',
    url: 'http://127.0.0.1:4330',
    reuseExistingServer: false,
  },
});
