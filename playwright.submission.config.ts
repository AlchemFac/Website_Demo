import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'submission.spec.ts',
  outputDir: 'test-results/submission',
  use: { ...base.use, baseURL: 'http://127.0.0.1:4323' },
  webServer: {
    command:
      'npm run preview -- --outDir ./.submission-test-dist --host 127.0.0.1 --port 4323 --ignore-lock',
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: false,
  },
});
